# ==================================================
# AI Trading Journal
# journal.py
# Scopes all CRUD trade journal records to user_id
# ==================================================

from database import execute_query, execute_insert_query, fetch_all, fetch_one


# ============================================
# Save Trade
# ============================================

def save_trade(
    user_id,
    symbol,
    trade_type,
    entry,
    exit_price,
    stop_loss,
    target,
    quantity,
    risk_percent,
    risk_amount,
    profit_loss,
    trade_date,
    notes,
    screenshot=None,
    exchange_source=None,
    exchange_order_id=None,
    setup_id=None
):

    query = """
    INSERT INTO trades(
        user_id,
        symbol,
        trade_type,
        entry,
        exit,
        stop_loss,
        target,
        quantity,
        risk_percent,
        risk_amount,
        profit_loss,
        trade_date,
        notes,
        screenshot,
        exchange_source,
        exchange_order_id,
        setup_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    values = (
        user_id,
        symbol.upper(),
        trade_type.upper(),
        entry,
        exit_price,
        stop_loss,
        target,
        quantity,
        risk_percent,
        risk_amount,
        profit_loss,
        trade_date,
        notes,
        screenshot,
        exchange_source,
        exchange_order_id,
        setup_id
    )

    return execute_insert_query(query, values)


# ============================================
# Get All Trades
# ============================================

def get_all_trades(user_id):

    query = """
    SELECT *
    FROM trades
    WHERE user_id = ?
    ORDER BY id DESC
    """

    return fetch_all(query, (user_id,))


# ============================================
# Get Trade By ID
# ============================================

def get_trade_by_id(user_id, trade_id):

    query = """
    SELECT *
    FROM trades
    WHERE user_id = ? AND id = ?
    """

    return fetch_one(query, (user_id, trade_id))


# ============================================
# Update Trade
# ============================================

def update_trade(
    user_id,
    trade_id,
    exit_price,
    profit_loss,
    notes
):

    query = """
    UPDATE trades
    SET
        exit = ?,
        profit_loss = ?,
        notes = ?
    WHERE user_id = ? AND id = ?
    """

    values = (
        exit_price,
        profit_loss,
        notes,
        user_id,
        trade_id
    )

    execute_query(query, values)


# ============================================
# Delete Trade
# ============================================

def delete_trade(user_id, trade_id):

    query = """
    DELETE FROM trades
    WHERE user_id = ? AND id = ?
    """

    execute_query(query, (user_id, trade_id))


# ============================================
# Search By Symbol
# ============================================

def search_symbol(user_id, symbol):

    query = """
    SELECT *
    FROM trades
    WHERE user_id = ? AND symbol LIKE ?
    ORDER BY trade_date DESC
    """

    return fetch_all(query, (user_id, f"%{symbol.upper()}%"))


# ============================================
# Search By Date
# ============================================

def search_date(user_id, trade_date):

    query = """
    SELECT *
    FROM trades
    WHERE user_id = ? AND trade_date = ?
    ORDER BY id DESC
    """

    return fetch_all(query, (user_id, trade_date))


# ============================================
# Total Trades
# ============================================

def total_trades(user_id):

    query = """
    SELECT COUNT(*) AS total
    FROM trades
    WHERE user_id = ?
    """

    result = fetch_one(query, (user_id,))

    return result["total"]