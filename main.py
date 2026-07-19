# ==================================================
# AI Trading Journal API
# main.py
# Secured multi-user SaaS template backend
# ==================================================

import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import create_tables, get_connection, seed_default_setups, fetch_one, execute_query
from risk import (
    calculate_risk,
    calculate_risk_per_point,
    calculate_position_size,
    calculate_profit
)
from journal import (
    save_trade,
    get_all_trades,
    update_trade,
    delete_trade,
    search_symbol
)
from statistics import statistics_summary
from charts import get_performance_history
from mentor import perform_mentor_audit, perform_mentor_chat
from exchange_sync import (
    get_api_credentials,
    get_raw_credentials,
    save_api_credentials,
    delete_api_credentials,
    sync_binance_exchange,
    sync_bybit_exchange,
    sync_okx_exchange,
    sync_delta_exchange,
    sync_shark_exchange
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

# ============================================
# FastAPI App
# ============================================

app = FastAPI(
    title="AI Trading Journal API",
    version="5.0"
)

# ============================================
# CORS Configuration
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ai-trading-journal-seven.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize database tables & migrations
create_tables()

# Serve static files for uploaded screenshots
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ============================================
# Data Models
# ============================================

class RegisterInput(BaseModel):
    email: str
    password: str

class RiskInput(BaseModel):
    capital: float
    risk_percent: float

class RiskPointInput(BaseModel):
    capital: float
    risk_percent: float
    stop_loss: float

class PositionInput(BaseModel):
    risk_amount: float
    stop_loss: float

class Trade(BaseModel):
    symbol: str
    trade_type: str
    entry: float
    exit_price: float
    stop_loss: float
    target: float
    quantity: float
    risk_percent: float
    capital: float
    trade_date: str
    notes: str
    screenshot: str = None
    setup_id: Optional[int] = None
    followed_rule_ids: Optional[List[int]] = []

class UpdateTrade(BaseModel):
    exit_price: float
    profit_loss: float
    notes: str

class ExchangeKeysInput(BaseModel):
    exchange_name: str
    api_key: str
    api_secret: str
    passphrase: str = None

# ============================================
# Home Route
# ============================================

@app.get("/")
def home():
    return {
        "message": "AI Trading SaaS API Running"
    }

# ============================================
# Authentication Endpoints
# ============================================

@app.post("/auth/register")
def register(data: RegisterInput):
    email_clean = data.email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check duplicate
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="This email is already registered.")
        
    hashed = hash_password(data.password)
    created_at = datetime.utcnow().isoformat()
    
    try:
        cursor.execute(
            "INSERT INTO users (email, hashed_password, created_at) VALUES (?, ?, ?)",
            (email_clean, hashed, created_at)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    conn.close()
    return {"message": "Account created successfully! You can now log in."}


@app.post("/auth/login")
def login(data: RegisterInput):
    email_clean = data.email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, hashed_password FROM users WHERE email = ?", (email_clean,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password.")
        
    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password.")
        
    token = create_access_token({"user_id": user["id"], "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

# ============================================
# Risk & Size Calculators (Public)
# ============================================

@app.post("/calculate-risk")
def risk_calculator(data: RiskInput):
    risk_amount = calculate_risk(data.capital, data.risk_percent)
    return {
        "capital": data.capital,
        "risk_percent": data.risk_percent,
        "risk_amount": risk_amount
    }

@app.post("/risk-per-point")
def risk_per_point(data: RiskPointInput):
    risk_amount = calculate_risk(data.capital, data.risk_percent)
    risk_point = calculate_risk_per_point(risk_amount, data.stop_loss)
    return {
        "risk_amount": risk_amount,
        "risk_per_point": risk_point
    }

@app.post("/position-size")
def position_size(data: PositionInput):
    result = calculate_position_size(data.risk_amount, data.stop_loss)
    return {
        "position_size": result
    }

# ============================================
# Scoped Trade Management Routes
# ============================================

@app.post("/trade/upload-screenshot")
def upload_screenshot(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    return {"filename": unique_name}


@app.post("/trade/add")
def add_trade(data: Trade, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    risk_amount = calculate_risk(data.capital, data.risk_percent)
    
    profit_loss = 0.0
    if data.exit_price > 0:
        profit_loss = calculate_profit(
            data.entry,
            data.exit_price,
            data.quantity,
            data.trade_type
        )

    trade_id = save_trade(
        user_id,
        data.symbol.upper(),
        data.trade_type.upper(),
        data.entry,
        data.exit_price,
        data.stop_loss,
        data.target,
        data.quantity,
        data.risk_percent,
        risk_amount,
        profit_loss,
        data.trade_date,
        data.notes,
        data.screenshot,
        setup_id=data.setup_id
    )

    if data.setup_id:
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id FROM setup_rules WHERE setup_id = ?", (data.setup_id,))
            rules = cursor.fetchall()
            for r in rules:
                rule_id = r["id"]
                is_followed = 1 if data.followed_rule_ids and rule_id in data.followed_rule_ids else 0
                cursor.execute(
                    "INSERT OR REPLACE INTO trade_rules_compliance (trade_id, rule_id, is_followed) VALUES (?, ?, ?)",
                    (trade_id, rule_id, is_followed)
                )
            conn.commit()
        except Exception:
            pass
        finally:
            conn.close()

    return {
        "message": "Trade Saved Successfully",
        "profit_loss": profit_loss
    }


@app.get("/trades")
def trades(current_user: dict = Depends(get_current_user)):
    return get_all_trades(current_user["id"])


@app.get("/statistics")
def statistics(current_user: dict = Depends(get_current_user)):
    return statistics_summary(current_user["id"])


@app.get("/trade/search/{symbol}")
def search_trade(symbol: str, current_user: dict = Depends(get_current_user)):
    result = search_symbol(current_user["id"], symbol.upper())
    if not result:
        raise HTTPException(status_code=404, detail="Trade Not Found")
    return result


@app.put("/trade/update/{trade_id}")
def edit_trade(trade_id: int, data: UpdateTrade, current_user: dict = Depends(get_current_user)):
    update_trade(
        current_user["id"],
        trade_id,
        data.exit_price,
        data.profit_loss,
        data.notes
    )
    return {
        "message": "Trade Updated Successfully"
    }


@app.delete("/trade/delete/{trade_id}")
def remove_trade(trade_id: int, current_user: dict = Depends(get_current_user)):
    delete_trade(current_user["id"], trade_id)
    return {
        "message": "Trade Deleted Successfully"
    }

# ============================================
# Scoped Performance Analytics
# ============================================

@app.get("/charts/history")
def charts_history(current_user: dict = Depends(get_current_user)):
    return get_performance_history(current_user["id"])


@app.get("/mentor/insights")
def mentor_insights(current_user: dict = Depends(get_current_user)):
    return perform_mentor_audit(current_user["id"])

# ============================================
# Scoped Exchange Configuration & Sync
# ============================================

@app.get("/exchanges/credentials")
def get_credentials(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return {
        "binance": get_api_credentials(user_id, "binance"),
        "bybit": get_api_credentials(user_id, "bybit"),
        "okx": get_api_credentials(user_id, "okx"),
        "delta_india": get_api_credentials(user_id, "delta_india"),
        "shark": get_api_credentials(user_id, "shark"),
        "gemini_api": get_api_credentials(user_id, "gemini_api")
    }


@app.post("/exchanges/credentials")
def save_credentials(data: ExchangeKeysInput, current_user: dict = Depends(get_current_user)):
    save_api_credentials(
        current_user["id"],
        data.exchange_name,
        data.api_key,
        data.api_secret,
        data.passphrase
    )
    return {"message": f"{data.exchange_name.replace('_', ' ').title()} credentials saved."}


@app.delete("/exchanges/credentials/{exchange_name}")
def delete_credentials(exchange_name: str, current_user: dict = Depends(get_current_user)):
    delete_api_credentials(current_user["id"], exchange_name)
    return {"message": f"{exchange_name.replace('_', ' ').title()} credentials deleted."}


@app.post("/exchanges/sync")
def sync_exchanges(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    binance_creds = get_raw_credentials(user_id, "binance")
    bybit_creds = get_raw_credentials(user_id, "bybit")
    okx_creds = get_raw_credentials(user_id, "okx")
    delta_creds = get_raw_credentials(user_id, "delta_india")
    shark_creds = get_raw_credentials(user_id, "shark")
    
    total_imported = 0
    
    if binance_creds:
        total_imported += sync_binance_exchange(user_id, binance_creds["api_key"], binance_creds["api_secret"])
    if bybit_creds:
        total_imported += sync_bybit_exchange(user_id, bybit_creds["api_key"], bybit_creds["api_secret"])
    if okx_creds:
        total_imported += sync_okx_exchange(user_id, okx_creds["api_key"], okx_creds["api_secret"], okx_creds["passphrase"])
    if delta_creds:
        total_imported += sync_delta_exchange(user_id, delta_creds["api_key"], delta_creds["api_secret"])
    if shark_creds:
        total_imported += sync_shark_exchange(user_id, shark_creds["api_key"], shark_creds["api_secret"])
        
    return {
        "status": "success",
        "message": f"Successfully synced exchanges. Imported {total_imported} new trade records."
    }


# ============================================
# Trading Setups & Rules Configuration APIs
# ============================================

class SetupCreateInput(BaseModel):
    name: str
    description: str
    rules: List[str]


@app.get("/setups")
def read_setups(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    seed_default_setups(user_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description FROM trading_setups WHERE user_id = ?", (user_id,))
    setups = [dict(row) for row in cursor.fetchall()]
    
    for s in setups:
        cursor.execute("SELECT id, rule_text FROM setup_rules WHERE setup_id = ?", (s["id"],))
        s["rules"] = [dict(row) for row in cursor.fetchall()]
        
    conn.close()
    return setups


@app.post("/setups")
def create_setup(data: SetupCreateInput, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO trading_setups (user_id, name, description) VALUES (?, ?, ?)",
            (user_id, data.name, data.description)
        )
        setup_id = cursor.lastrowid
        
        for r in data.rules:
            if r.strip():
                cursor.execute(
                    "INSERT INTO setup_rules (setup_id, rule_text) VALUES (?, ?)",
                    (setup_id, r.strip())
                )
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    conn.close()
    return {"message": "Setup created successfully."}


@app.delete("/setups/{setup_id}")
def remove_setup(setup_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM trading_setups WHERE id = ? AND user_id = ?", (setup_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Setup not found.")
        
    cursor.execute("DELETE FROM trading_setups WHERE id = ?", (setup_id,))
    cursor.execute("DELETE FROM setup_rules WHERE setup_id = ?", (setup_id,))
    conn.commit()
    conn.close()
    return {"message": "Setup deleted successfully."}


# ============================================
# Live Demo Futures Trading (Paper Wallet) APIs
# ============================================

class PaperOrderInput(BaseModel):
    symbol: str
    direction: str
    size: float
    entry_price: float
    leverage: int
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None


class CloseOrderInput(BaseModel):
    exit_price: float


@app.get("/paper/account")
def get_paper_account(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_connection()
    cursor = conn.cursor()
    
    # Initialize paper balance if first time
    cursor.execute("INSERT OR IGNORE INTO paper_balances (user_id, balance) VALUES (?, 10000.00)", (user_id,))
    conn.commit()
    
    cursor.execute("SELECT balance FROM paper_balances WHERE user_id = ?", (user_id,))
    balance = cursor.fetchone()["balance"]
    
    cursor.execute("SELECT * FROM paper_positions WHERE user_id = ? AND is_active = 1", (user_id,))
    positions = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return {
        "balance": balance,
        "positions": positions
    }


@app.post("/paper/order")
def place_paper_order(data: PaperOrderInput, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    margin = (data.size * data.entry_price) / data.leverage
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Initialize
    cursor.execute("INSERT OR IGNORE INTO paper_balances (user_id, balance) VALUES (?, 10000.00)", (user_id,))
    conn.commit()
    
    cursor.execute("SELECT balance FROM paper_balances WHERE user_id = ?", (user_id,))
    balance = cursor.fetchone()["balance"]
    
    if margin > balance:
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient simulated balance to cover order margin.")
        
    # Deduct margin
    cursor.execute("UPDATE paper_balances SET balance = balance - ? WHERE user_id = ?", (margin, user_id))
    
    # Create position
    cursor.execute("""
        INSERT INTO paper_positions (user_id, symbol, direction, size, entry_price, leverage, margin, stop_loss, take_profit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, data.symbol.upper(), data.direction.upper(), data.size, data.entry_price, data.leverage, margin, data.stop_loss, data.take_profit))
    
    conn.commit()
    conn.close()
    return {"message": "Simulated futures order executed successfully."}


@app.post("/paper/close/{position_id}")
def close_paper_position(position_id: int, data: CloseOrderInput, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM paper_positions WHERE id = ? AND user_id = ? AND is_active = 1", (position_id, user_id))
    pos = cursor.fetchone()
    if not pos:
        conn.close()
        raise HTTPException(status_code=404, detail="Active position not found.")
        
    # Calculate P&L
    is_short = pos["direction"] == "SHORT"
    pnl = (pos["entry_price"] - data.exit_price) * pos["size"] if is_short else (data.exit_price - pos["entry_price"]) * pos["size"]
    
    # Refund margin + P&L
    cursor.execute("UPDATE paper_balances SET balance = balance + ? WHERE user_id = ?", (pos["margin"] + pnl, user_id))
    
    # Mark position closed
    cursor.execute("UPDATE paper_positions SET is_active = 0 WHERE id = ?", (position_id,))
    
    # Auto-log to journal
    trade_date_str = datetime.utcnow().isoformat().split("T")[0]
    save_trade(
        user_id=user_id,
        symbol=pos["symbol"],
        trade_type=pos["direction"],
        entry=pos["entry_price"],
        exit_price=data.exit_price,
        stop_loss=pos["stop_loss"] or 0.0,
        target=pos["take_profit"] or 0.0,
        quantity=pos["size"],
        risk_percent=0.0,
        risk_amount=pos["margin"],
        profit_loss=pnl,
        trade_date=trade_date_str,
        notes=f"Simulated Futures position closed on Demo Platform. Leverage: {pos['leverage']}x.",
        exchange_source="Demo"
    )
    
    conn.commit()
    conn.close()
    return {
        "message": "Position closed and logged to journal.",
        "pnl": pnl
    }


@app.post("/paper/reset")
def reset_paper_wallet(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE paper_balances SET balance = 10000.00 WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM paper_positions WHERE user_id = ? AND is_active = 1", (user_id,))
    conn.commit()
    conn.close()
    return {"message": "Simulated futures balance reset successfully."}


# ============================================
# Interactive Mentor Chat Console API
# ============================================

class MentorChatInput(BaseModel):
    message: str
    history: List[dict] = []


@app.post("/mentor/chat")
def mentor_chat(data: MentorChatInput, current_user: dict = Depends(get_current_user)):
    reply = perform_mentor_chat(current_user["id"], data.history, data.message)
    return {
        "reply": reply
    }


# ============================================
# Custom AI Mentor Configuration API
# ============================================

class MentorConfigInput(BaseModel):
    mentor_name: str
    avatar_emoji: str
    personality: str
    custom_rules: str


@app.get("/mentor/config")
def get_mentor_config(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    cfg = fetch_one("SELECT mentor_name, avatar_emoji, personality, custom_rules FROM custom_mentor_config WHERE user_id = ?", (user_id,))
    if not cfg:
        execute_query(
            "INSERT OR IGNORE INTO custom_mentor_config(user_id, mentor_name, avatar_emoji, personality, custom_rules) VALUES(?, ?, ?, ?, ?)",
            (user_id, "Mentor AI", "👨‍🏫", "Professional, strict, and encouraging", "")
        )
        cfg = {
            "mentor_name": "Mentor AI",
            "avatar_emoji": "👨‍🏫",
            "personality": "Professional, strict, and encouraging",
            "custom_rules": ""
        }
    return cfg


@app.post("/mentor/config")
def save_mentor_config(data: MentorConfigInput, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    exists = fetch_one("SELECT user_id FROM custom_mentor_config WHERE user_id = ?", (user_id,))
    if exists:
        execute_query(
            "UPDATE custom_mentor_config SET mentor_name = ?, avatar_emoji = ?, personality = ?, custom_rules = ? WHERE user_id = ?",
            (data.mentor_name, data.avatar_emoji, data.personality, data.custom_rules, user_id)
        )
    else:
        execute_query(
            "INSERT INTO custom_mentor_config(user_id, mentor_name, avatar_emoji, personality, custom_rules) VALUES(?, ?, ?, ?, ?)",
            (user_id, data.mentor_name, data.avatar_emoji, data.personality, data.custom_rules)
        )
    return {"message": "Custom AI Mentor configuration updated successfully!"}