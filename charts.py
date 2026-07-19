# ============================================
# AI Trading Journal
# charts.py
# Aggregates trade data for performance charts
# ============================================

from database import fetch_all


def get_performance_history(user_id):
    """
    Returns trade date, symbol, profit_loss, and cumulative profit/loss
    sorted chronologically to render equity curve charts.
    """
    query = """
    SELECT id, symbol, trade_type, profit_loss, trade_date 
    FROM trades 
    WHERE user_id = ?
    ORDER BY trade_date ASC, id ASC
    """
    trades = fetch_all(query, (user_id,))
    
    history = []
    cumulative = 0.0
    for t in trades:
        pl = t["profit_loss"] if t["profit_loss"] is not None else 0.0
        cumulative += pl
        history.append({
            "id": t["id"],
            "symbol": t["symbol"],
            "trade_type": t["trade_type"],
            "profit_loss": round(pl, 2),
            "cumulative": round(cumulative, 2),
            "trade_date": t["trade_date"]
        })
    return history
