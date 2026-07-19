 # SQLite
# ============================================
# AI Trading Journal
# database.py
# Version : 1.0
# Database : SQLite3
# ============================================

import sqlite3

DATABASE_NAME = "ai_trading_journal.db"


def get_connection():
    """
    Create and return database connection.
    """
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    """
    Create database tables if they do not exist.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trades(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER NOT NULL DEFAULT 1,

        symbol TEXT NOT NULL,

        trade_type TEXT NOT NULL,

        entry REAL NOT NULL,

        exit REAL,

        stop_loss REAL NOT NULL,

        target REAL,

        quantity REAL NOT NULL,

        risk_percent REAL,

        risk_amount REAL,

        profit_loss REAL,

        trade_date TEXT,

        notes TEXT,

        screenshot TEXT,

        exchange_source TEXT,

        exchange_order_id TEXT UNIQUE,
        
        FOREIGN KEY(user_id) REFERENCES users(id)

    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exchange_credentials(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL DEFAULT 1,
        exchange_name TEXT NOT NULL,
        api_key TEXT NOT NULL,
        api_secret TEXT NOT NULL,
        passphrase TEXT,
        UNIQUE(user_id, exchange_name),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trading_setups(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS setup_rules(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setup_id INTEGER NOT NULL,
        rule_text TEXT NOT NULL,
        FOREIGN KEY(setup_id) REFERENCES trading_setups(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trade_rules_compliance(
        trade_id INTEGER NOT NULL,
        rule_id INTEGER NOT NULL,
        is_followed INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(trade_id, rule_id),
        FOREIGN KEY(trade_id) REFERENCES trades(id) ON DELETE CASCADE,
        FOREIGN KEY(rule_id) REFERENCES setup_rules(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS paper_balances(
        user_id INTEGER PRIMARY KEY,
        balance REAL NOT NULL DEFAULT 10000.00,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS paper_positions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        direction TEXT NOT NULL,
        size REAL NOT NULL,
        entry_price REAL NOT NULL,
        leverage INTEGER NOT NULL,
        margin REAL NOT NULL,
        stop_loss REAL,
        take_profit REAL,
        is_active INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS custom_mentor_config(
        user_id INTEGER PRIMARY KEY,
        mentor_name TEXT NOT NULL DEFAULT 'Mentor AI',
        avatar_emoji TEXT NOT NULL DEFAULT '👨‍🏫',
        personality TEXT NOT NULL DEFAULT 'Professional, strict, and encouraging',
        custom_rules TEXT NOT NULL DEFAULT '',
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Self-migrations for existing databases
    alterations = [
        "ALTER TABLE trades ADD COLUMN screenshot TEXT",
        "ALTER TABLE trades ADD COLUMN exchange_source TEXT",
        "ALTER TABLE trades ADD COLUMN exchange_order_id TEXT",
        "ALTER TABLE trades ADD COLUMN user_id INTEGER DEFAULT 1",
        "ALTER TABLE exchange_credentials ADD COLUMN user_id INTEGER DEFAULT 1",
        "ALTER TABLE trades ADD COLUMN setup_id INTEGER"
    ]
    for alt in alterations:
        try:
            cursor.execute(alt)
        except sqlite3.OperationalError:
            pass

    connection.commit()
    connection.close()


def execute_query(query, values=()):
    """
    Execute INSERT / UPDATE / DELETE query.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(query, values)

    connection.commit()

    connection.close()


def execute_insert_query(query, values=()):
    """
    Execute INSERT query and return the last inserted row ID.
    """
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    row_id = cursor.lastrowid
    connection.commit()
    connection.close()
    return row_id


def fetch_all(query, values=()):
    """
    Return all rows.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(query, values)

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]


def fetch_one(query, values=()):
    """
    Return single row.
    """

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(query, values)

    row = cursor.fetchone()

    connection.close()

    return dict(row) if row else None


def seed_default_setups(user_id):
    """
    Seeds default Mentor setups and rules for user_id if not present.
    """
    connection = get_connection()
    cursor = connection.cursor()
    
    # Check if setups exist for this user
    cursor.execute("SELECT id FROM trading_setups WHERE user_id = ?", (user_id,))
    if cursor.fetchone():
        connection.close()
        return
        
    setups_data = [
        {
            "name": "Pullback Setup",
            "description": "Entering on a correction within an established trend.",
            "rules": [
                "Trend matches higher timeframe (4H/1H)",
                "Price retests key support/resistance zone",
                "Bullish/Bearish candlestick confirmation",
                "Target meets a minimum 1:2 Risk-Reward ratio"
            ]
        },
        {
            "name": "Breakout Setup",
            "description": "Entering as price breaks out of a consolidation zone.",
            "rules": [
                "Consolidation range clearly defined (3+ touches)",
                "Breakout occurs on high volume / momentum close",
                "Stop Loss set below range or key moving average"
            ]
        },
        {
            "name": "Mean Reversion Setup",
            "description": "Entering extreme price extensions expecting a return to average.",
            "rules": [
                "Price is significantly extended from 20 EMA",
                "RSI is overbought/oversold (>70 or <30)",
                "Reversal divergence present on 15m/5m timeframe"
            ]
        }
    ]
    
    try:
        for s in setups_data:
            cursor.execute(
                "INSERT INTO trading_setups (user_id, name, description) VALUES (?, ?, ?)",
                (user_id, s["name"], s["description"])
            )
            setup_id = cursor.lastrowid
            for r in s["rules"]:
                cursor.execute(
                    "INSERT INTO setup_rules (setup_id, rule_text) VALUES (?, ?)",
                    (setup_id, r)
                )
        connection.commit()
    except Exception:
        pass
    finally:
        connection.close()