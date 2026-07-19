# Risk Calculator
# ============================================
# AI Trading Journal
# risk.py
# Version : 1.0
# ============================================


def calculate_risk(capital: float, risk_percent: float) -> float:
    """
    Calculate risk amount based on capital and risk percentage.
    """
    return (capital * risk_percent) / 100


def calculate_risk_per_point(risk_amount: float, stop_loss: float) -> float:
    """
    Calculate risk per point.
    """
    if stop_loss <= 0:
        raise ValueError("Stop loss must be greater than zero.")

    return risk_amount / stop_loss


def calculate_position_size(risk_amount: float, stop_loss: float) -> float:
    """
    Calculate position size.
    """
    if stop_loss <= 0:
        raise ValueError("Stop loss must be greater than zero.")

    return risk_amount / stop_loss


def calculate_reward(entry: float, target: float) -> float:
    """
    Calculate reward points.
    """
    return abs(target - entry)


def calculate_risk_points(entry: float, stop_loss: float) -> float:
    """
    Calculate risk points.
    """
    return abs(entry - stop_loss)


def calculate_rr_ratio(entry: float, stop_loss: float, target: float) -> float:
    """
    Calculate Risk : Reward Ratio
    """
    risk = calculate_risk_points(entry, stop_loss)
    reward = calculate_reward(entry, target)

    if risk == 0:
        raise ValueError("Risk cannot be zero.")

    return reward / risk


def calculate_profit(entry: float, exit_price: float, quantity: float, trade_type: str = "LONG") -> float:
    """
    Calculate profit or loss.
    """
    if trade_type.upper() == "SHORT":
        return (entry - exit_price) * quantity
    return (exit_price - entry) * quantity


def calculate_drawdown(balance: float, current_balance: float) -> float:
    """
    Calculate drawdown percentage.
    """
    if balance <= 0:
        raise ValueError("Balance must be greater than zero.")

    return ((balance - current_balance) / balance) * 100