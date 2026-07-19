# ============================================
# AI Trading Journal
# statistics.py
# Version : 1.0
# ============================================

from journal import get_all_trades


def total_trades(trades):
    return len(trades)

def winning_trades(trades):
    return sum(1 for trade in trades if trade["profit_loss"] and trade["profit_loss"] > 0)

def losing_trades(trades):
    return sum(1 for trade in trades if trade["profit_loss"] and trade["profit_loss"] < 0)

def total_profit(trades):
    return sum(trade["profit_loss"] for trade in trades if trade["profit_loss"] and trade["profit_loss"] > 0)

def total_loss(trades):
    return abs(sum(trade["profit_loss"] for trade in trades if trade["profit_loss"] and trade["profit_loss"] < 0))

def net_profit(trades):
    return total_profit(trades) - total_loss(trades)

def win_rate(trades):
    total = total_trades(trades)
    return (winning_trades(trades) / total * 100) if total > 0 else 0.0

def average_profit(trades):
    wins = winning_trades(trades)
    return total_profit(trades) / wins if wins > 0 else 0.0

def average_loss(trades):
    losses = losing_trades(trades)
    return total_loss(trades) / losses if losses > 0 else 0.0

def profit_factor(trades):
    loss = total_loss(trades)
    return total_profit(trades) / loss if loss > 0 else 0.0

def largest_win(trades):
    wins = [trade["profit_loss"] for trade in trades if trade["profit_loss"] and trade["profit_loss"] > 0]
    return max(wins) if wins else 0.0

def largest_loss(trades):
    losses = [trade["profit_loss"] for trade in trades if trade["profit_loss"] and trade["profit_loss"] < 0]
    return min(losses) if losses else 0.0

def statistics_summary(user_id):
    """Return all statistics after fetching trades once."""
    trades = get_all_trades(user_id)
    return {
        "Total Trades": total_trades(trades),
        "Winning Trades": winning_trades(trades),
        "Losing Trades": losing_trades(trades),
        "Win Rate (%)": round(win_rate(trades), 2),
        "Total Profit": round(total_profit(trades), 2),
        "Total Loss": round(total_loss(trades), 2),
        "Net Profit": round(net_profit(trades), 2),
        "Average Profit": round(average_profit(trades), 2),
        "Average Loss": round(average_loss(trades), 2),
        "Largest Win": round(largest_win(trades), 2),
        "Largest Loss": round(largest_loss(trades), 2),
        "Profit Factor": round(profit_factor(trades), 2)
    }