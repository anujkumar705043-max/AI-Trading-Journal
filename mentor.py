# ==================================================
# AI Trading Journal
# mentor.py
# AI Mentor Evaluation and Rule Audit Engine (Gemini LLM Integrated)
# ==================================================
import os
import json
from collections import Counter
from google import genai
from google.genai import types
from database import get_connection, fetch_one
from journal import get_all_trades
from statistics import statistics_summary

print("Mentor.py Version: FALLBACK V2 LOADED")

_WORKING_GEMINI_MODEL = None

def _generate_content_with_fallback(client, contents, config=None):
    global _WORKING_GEMINI_MODEL
    
    models_to_try = [
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash"
    ]
    
    if _WORKING_GEMINI_MODEL and _WORKING_GEMINI_MODEL in models_to_try:
        models_to_try.remove(_WORKING_GEMINI_MODEL)
        models_to_try.insert(0, _WORKING_GEMINI_MODEL)
        
    last_error = None
    for model_name in models_to_try:
        print(f"Trying Gemini model: {model_name}")
        try:
            if config:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config
                )
            else:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents
                )
            _WORKING_GEMINI_MODEL = model_name
            return response
        except Exception as e:
            print(f"Failed model: {model_name}")
            print(e)
            last_error = e
            continue
            
    raise Exception(f"All models failed. Last error: {last_error}")


# ==================================================
# UNIVERSAL TRADING SETUP (UTS) — FRAMEWORK RULES
# The AI Mentor uses these rules as its PRIMARY
# knowledge base for all evaluations and chat replies.
# Never contradict these rules.
# ==================================================
UTS_FRAMEWORK = """
=== UNIVERSAL TRADING SETUP (UTS) — CORE FRAMEWORK ===

PHILOSOPHY:
- The market has two players: the Retailer (reacts, small orders, emotion-driven) and the Big Player (plans, large orders, manipulates levels). Always trade WITH the Big Player, never against them.
- Big players target the most-used tools — support, resistance, trendlines — because retail orders cluster there. They sweep those levels to collect liquidity, then reverse hard.
- The core loop is always: BUILD obvious level → INVITE crowd onto wrong side → SWEEP to collect stops → REVERSE in the real direction.
- 99% observation. 1% execution.

THE FOUR PILLARS (all feed into Price Action):
1. S/R/Trend — Where price has reacted before, and the current directional bias.
2. Indicator — 9 EMA / 15 EMA for momentum confirmation only. Never used alone.
3. Volume — Confirms whether a move at a level is real or manufactured.
4. Option Chain — OI and PCR data shows where big players have written contracts.

PRICE ACTION IS THE FINAL DECISION-MAKER. All four pillars feed into one question: what is price actually doing right now at this level?

DEMAND/SUPPLY FLOW:
- Demand up + Supply up = Price stable
- Demand up + Supply down = Price rises (buyers in control)
- Demand down + Supply up = Price falls (sellers in control)
- Demand down + Supply down = Price stable, low conviction

MARKET STRUCTURE:
- Uptrend: Higher Highs + Higher Lows. Demand consistently outruns supply.
- Downtrend: Lower Highs + Lower Lows. Supply consistently outruns demand.
- Sideways/Range: Price oscillates between support and resistance. Undecided, not directionless.

THE FOOTPRINT (why big players need liquidity):
- Retail orders are too small to move the market.
- Big player orders can move price but need equal and opposite liquidity to fill without slipping.
- The liquidity creation phase: big players build an obvious range, invite retail on the wrong side, sweep it to fill their real position, then reverse.

THE TRAP CANDLE (Bewafa / Unfaithful Candle):
- Colour does NOT matter. What matters: where the close sits relative to the wick.
- BUYER CANDLE: Long lower wick, small body near the top. Price swept below a level and was reclaimed aggressively by buyers.
- SELLER CANDLE: Long upper wick, small body near the bottom. Price swept above a level and was rejected aggressively by sellers.
- MINIMUM valid ratio: 1:3 wick-to-body. Stronger = 1:4. Strongest = 1:5. Below 1:3 = NOT valid.

SMART MONEY / ORDER BLOCK:
- The order block is the LAST opposing candle before an impulsive move on 1H, 4H, or 1D timeframe. It marks where the big player entered.
- Rule: 1 to 3 touches of the zone = trusted. 4 or more touches = treat zone as unstable/broken.

THREE TRAP SHAPES (Liquidity Creation Phase):
1. SUPPORT TRAP: Repeated bounces off support build retail buy stops below. One candle sweeps below, then reverses UP hard.
2. RESISTANCE TRAP: Mirror image. Repeated tests at resistance build stops above. Sweeps above, traps late buyers, reverses DOWN hard.
3. TRENDLINE TRAP: Obvious trendline everyone can see. A fake break shakes out trend-followers, then price resumes the original direction.

CHART PATTERN TRAPS (read as traps, not textbook signals):
- Double Top (M): Two highs trap late buyers. Neckline break confirms. Entry on 50% retrace. Target ~300 pts. Stop above second top.
- Double Bottom (W): Two lows trap late sellers. Neckline break up confirms. Entry on 50% retrace. Stop below second bottom.
- Head and Shoulders: Left shoulder, head, right shoulder. Real move = breakdown after stop-hunt above neckline.
- Inverse H&S: Mirror. Real move = breakout after stop-hunt below neckline.
- Cup and Handle: Rounded base + small pullback (handle) shakes out impatient traders. Then breakout.
- Inverse Cup and Handle: Dome top + small bounce traps late buyers. Then breakdown.
- Pole and Flag: Sharp impulsive pole, tight countertrend flag, continuation in pole's direction.

THE FULL VALID SETUP (all 3 steps required):
Step 1 — SWEEP: Price takes out an obvious level (support, resistance, trendline, pattern neckline).
Step 2 — TRAP CANDLE: Rejection candle with minimum 1:3 wick-to-body ratio, closing back inside the range.
Step 3 — ENTER AND MANAGE: Enter in the new direction. Stop beyond the sweep wick. Target = next liquidity pool.
If ANY step is missing = NO trade. Do not enter.

POSITION CONVERSION AND ACCUMULATION (PC + AC):
- Big players accumulate gradually through repeated small clusters at the same level (tight touches, not one clean bounce).
- Round numbers (prices ending in 000, 500, 00) and the 50% retracement of the prior impulse leg add strong confluence.

RISK MANAGEMENT RULES (non-negotiable):
BEFORE the trade:
- Wait for the FULL setup. No sweep = no trade. No trap candle = no trade.
- The 30% Rule: never allocate more than 30% of planned daily risk to one trade.
- Maximum ONE trade per day. One setup, one decision.

DURING the trade:
- Split entry: ~50% at the trigger, ~50% on a favourable retest (averaging in).
- A single loss must stay within 12-15% of planned daily risk.
- A LOSS stops all trading for the rest of the day.
- A BOOKED PROFIT also stops all trading for the rest of the day.

ON PROFIT:
- First target: approximately 300 index points. Trail the stop after that, repeatedly.
- A trail-stop exit is NOT a failure. Take it without hesitation.
- WITHDRAW profits on schedule. Never let gains sit as numbers on a screen.

PSYCHOLOGY AND ROUTINE:
- Pre-market routine: 4:00 wake, 4:45 walk, 5:15 yoga and meditation (Yoga Nidra), then trade quietly.
- Do NOT watch charts constantly. Constant monitoring produces emotion, not signal.
- Key quotes from the journal: "Trading is not what you expect. Trading is what you see." / "Trend is your friend." / "Control your losses. Manage your trade."

ROADMAP AND TIMEFRAMES:
- Expect 6-8 months of learning losses before the read becomes reliable. This is an honest expectation, not a warning.
- Long bias stack: Monthly/Weekly (HTF context) > 1D (structure) > 4H (bias) > 1H (entry TF) > 15M (fine-tune).
- Short bias stack: 1D (HTF) > 4H (bias) > 1H (primary TF) > 15M (entry TF) > 5M (timing).

DAILY BOOT SEQUENCE:
1. One trade per day. One setup, one decision.
2. No trade without: sweep + trap candle + structure alignment. All three.
3. Loss stops the day. Profit stops the day.
4. Withdraw on schedule.
5. 99% observation. 1% execution.
If conditions not met: do nothing. That is also a valid position.

=== END UTS FRAMEWORK ===
"""

def perform_mentor_audit(user_id):
    """
    Acts as a personal trading Mentor. If a Gemini API Key is configured,
    sends live statistics and setups compliance metrics to Gemini 1.5 Flash.
    Otherwise, evaluates rules locally.
    """
    trades = get_all_trades(user_id)
    stats = statistics_summary(user_id)
    
    # Get user email
    user_info = fetch_one("SELECT email FROM users WHERE id = ?", (user_id,))
    username = user_info["email"].split("@")[0].capitalize() if user_info else "Trader"
    
    total = stats.get("Total Trades", 0)
    if total == 0:
        return {
            "status": "insufficient_data",
            "message": f"Hello {username}. I don't see any logged trades in your journal yet. Go ahead and enter a couple of trades, and I will analyze your performance, check your rules compliance, and give you a weekly plan."
        }

    # Fetch custom AI mentor profile
    mentor_cfg = fetch_one("SELECT mentor_name, avatar_emoji, personality, custom_rules FROM custom_mentor_config WHERE user_id = ?", (user_id,))
    if mentor_cfg:
        mentor_name = mentor_cfg["mentor_name"]
        avatar_emoji = mentor_cfg["avatar_emoji"]
        personality_desc = mentor_cfg["personality"]
        custom_rules_str = mentor_cfg["custom_rules"]
    else:
        mentor_name = "Mentor AI"
        avatar_emoji = "👨‍🏫"
        personality_desc = "Professional, strict, and encouraging"
        custom_rules_str = ""
    
    # 1. Fetch User Setups & Compliance Stats
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name FROM trading_setups WHERE user_id = ?", (user_id,))
    setups = cursor.fetchall()
    has_setups = len(setups) > 0
    total_checks = 0
    followed_checks = 0
    
    compliance_insights = []
    compliance_summary = []
    
    try:
        query = """
        SELECT trc.rule_id, sr.rule_text, trc.is_followed, t.profit_loss, ts.name as setup_name
        FROM trade_rules_compliance trc
        JOIN setup_rules sr ON trc.rule_id = sr.id
        JOIN trading_setups ts ON sr.setup_id = ts.id
        JOIN trades t ON trc.trade_id = t.id
        WHERE t.user_id = ?
        """
        cursor.execute(query, (user_id,))
        compliance_rows = cursor.fetchall()
        
        rule_stats = {}
        for r in compliance_rows:
            rid = r["rule_id"]
            total_checks += 1
            if r["is_followed"] == 1:
                followed_checks += 1
                
            if rid not in rule_stats:
                rule_stats[rid] = {
                    "text": r["rule_text"],
                    "setup_name": r["setup_name"],
                    "followed_count": 0,
                    "total_count": 0,
                    "pl_when_followed": 0.0,
                    "pl_when_broken": 0.0
                }
            
            rule_stats[rid]["total_count"] += 1
            pl = r["profit_loss"] if r["profit_loss"] is not None else 0.0
            if r["is_followed"] == 1:
                rule_stats[rid]["followed_count"] += 1
                rule_stats[rid]["pl_when_followed"] += pl
            else:
                rule_stats[rid]["pl_when_broken"] += pl
                
        for rid, s in rule_stats.items():
            rate = s["followed_count"] / s["total_count"] if s["total_count"] > 0 else 1.0
            rate_percent = round(rate * 100, 1)
            broken_count = s["total_count"] - s["followed_count"]
            
            compliance_summary.append(
                f"- Setup: '{s['setup_name']}', Rule: '{s['text']}'. Followed: {s['followed_count']}/{s['total_count']} times ({rate_percent}% compliance). P&L when broken: ${s['pl_when_broken']}"
            )
            
            if rate_percent < 80:
                warning_text = f"You broke your rule '{s['text']}' on {broken_count} occasions inside your '{s['setup_name']}' setup. "
                if s["pl_when_broken"] < 0:
                    warning_text += f"This directly cost you ${abs(round(s['pl_when_broken'], 2))} in losses."
                else:
                    warning_text += "Even if you got lucky, ignoring this rule lowers consistency."
                
                compliance_insights.append({
                    "rule_id": rid,
                    "rule_text": s["text"],
                    "setup_name": s["setup_name"],
                    "compliance_rate": rate_percent,
                    "warning": warning_text
                })
    except Exception:
        pass
    finally:
        conn.close()

    # 2. Behavioral Tags
    behavioral_tags = {
        "FOMO/Chasing": ["fomo", "chase", "chased", "late entry", "hurried", "impatient", "greed"],
        "Panic Selling/Early Exit": ["panic", "scared", "fear", "early exit", "impatient", "closed early", "cut early"],
        "Revenge Trading": ["revenge", "recover", "tilt", "angry", "frustrated", "losses back"],
        "Disciplined Execution": ["plan", "rules", "setup", "patience", "strategy", "indicator", "confluence"]
    }
    tag_counts = {tag: 0 for tag in behavioral_tags}
    notes_summary = []
    for t in trades:
        n = t.get("notes") or ""
        if n:
            notes_summary.append(f"- Date: {t['trade_date']}, Symbol: {t['symbol']}, Notes: {n}")
        notes_lower = n.lower()
        for tag, keywords in behavioral_tags.items():
            if any(k in notes_lower for k in keywords):
                tag_counts[tag] += 1

    # 3. Overtrading Check
    dates = [t["trade_date"] for t in trades if t.get("trade_date")]
    date_counts = Counter(dates)
    overtrading_days = [date for date, count in date_counts.items() if count > 3]
    has_overtraded = len(overtrading_days) > 0

    # 4. Sizing check
    risk_percentages = [t["risk_percent"] for t in trades if t.get("risk_percent") is not None and t.get("risk_percent") > 0]
    avg_risk = sum(risk_percentages) / len(risk_percentages) if risk_percentages else 0.0

    # 5. Math expectancy summaries
    win_rate = stats.get("Win Rate (%)", 0.0)
    avg_win = stats.get("Average Profit", 0.0)
    avg_loss = stats.get("Average Loss", 0.0)
    rr_ratio = avg_win / avg_loss if avg_loss > 0 else 0.0
    expectancy = (win_rate / 100 * avg_win) - ((100 - win_rate) / 100 * avg_loss)
    overall_compliance = (followed_checks / total_checks * 100) if total_checks > 0 else 100

    # 6. Retrieve Gemini Key from server environment
    api_key = os.getenv("GEMINI_API_KEY")
    
    if api_key:
        prompt = f"""
        You are {mentor_name}, a custom AI Trading Mentor. 
        Your avatar style is {avatar_emoji}.
        Your personality guidelines: You are {personality_desc}. You must adopt these traits in your writing style.

        CRITICAL INSTRUCTION: You are trained on the Universal Trading Setup (UTS) framework. This is the trader's PRIMARY trading methodology. You must evaluate ALL trades and behaviours STRICTLY against UTS rules. If a trade violates UTS rules, call it out clearly. If it follows UTS rules, commend it specifically.

        === UTS FRAMEWORK (your primary evaluation rulebook) ===
        {UTS_FRAMEWORK}
        === END UTS FRAMEWORK ===

        Additional trader-defined strategy guidelines to enforce:
        {custom_rules_str if custom_rules_str else 'No additional custom rules declared.'}
        
        You are conducting a performance audit for a trader named {username}.
        
        Here is their performance summary:
        - Win Rate: {win_rate}%
        - Expectancy: ${round(expectancy, 2)} per trade
        - Average Risk per Position: {round(avg_risk, 2)}%
        - Has Overtraded (exceeded 3 trades/day): {'Yes' if has_overtraded else 'No'} on days: {', '.join(overtrading_days)}
        
        Trader Setups Compliance Logs:
        {chr(10).join(compliance_summary) if compliance_summary else 'No setups tracked yet.'}
        
        Trader's recent trade notes (for psychological analysis):
        {chr(10).join(notes_summary[:10]) if notes_summary else 'No notes written yet.'}
        
        Based on this data, write an audit in first-person as {mentor_name} addressing the trader by name.
        Evaluate each violation against UTS rules specifically (e.g. did they enter without a sweep? did they overtrade beyond 1 trade/day? did they ignore the trap candle ratio?).
        Focus on their sizing discipline, overtrading alerts, and rule breakages. Quantify their losses where appropriate.
        Keep it concise, actionable, and direct.
        
        Return EXACTLY a JSON response inside a raw text block (do not return markdown syntax, wrappers or code blocks).
        The JSON must contain these keys:
        {{
          "mentor_grade": "A/B/C/D/F",
          "mentor_grade_desc": "One-line status text summary",
          "mentor_speech": "Your first-person feedback critique...",
          "weekly_plan": ["Goal 1", "Goal 2", "Goal 3"]
        }}
        """
        
        try:
            client = genai.Client(api_key=api_key)
            response = _generate_content_with_fallback(client, prompt)
            text = response.text.strip()
            # Clean Markdown wrappers if present
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            parsed = json.loads(text)
            return {
                "status": "success",
                "username": username,
                "mentor_name": mentor_name,
                "avatar_emoji": avatar_emoji,
                "mentor_grade": parsed["mentor_grade"],
                "mentor_grade_desc": parsed["mentor_grade_desc"],
                "mentor_speech": parsed["mentor_speech"],
                "expectancy": round(expectancy, 2),
                "avg_risk_percent": round(avg_risk, 2),
                "compliance_insights": compliance_insights,
                "weekly_plan": parsed["weekly_plan"]
            }
        except Exception as e:
            # Fall back to local evaluation if LLM fails
            print(f"Gemini SDK Error (audit): {str(e)}")
            pass

    # ============================================
    # Fallback Offline Local Rule-Based Auditor
    # ============================================
    if avg_risk > 2.0 or has_overtraded or overall_compliance < 60:
        grade = "D"
        grade_desc = "At Risk of Blowing Account"
    elif overall_compliance < 80 or tag_counts["Revenge Trading"] > 0:
        grade = "C"
        grade_desc = "Inconsistent Execution"
    elif overall_compliance < 95 or avg_risk == 0:
        grade = "B"
        grade_desc = "Good Consistency (Refining Stage)"
    else:
        grade = "A"
        grade_desc = "Disciplined Professional"

    critique = f"Hello {username}. I have audited your trading logs locally. (Note: Configure your Gemini API Key in Settings to enable live LLM evaluation).\n\n"
    
    if not has_setups:
        critique += "First of all, I don't see any custom setups configured in your system database. I have seeded default setups (Pullback, Breakout, Mean Reversion) with standard rules for you. Please start using them when logging trades.\n\n"
    
    if avg_risk > 2.0:
        critique += f"I noticed that your average risk per trade is {round(avg_risk, 2)}%. This is way too high. You need to reduce your risk per trade to a strict maximum of 1% to 2% immediately.\n\n"
    elif avg_risk == 0:
        critique += "You aren't logging your risk per trade percentage. Start adding risk percentages when adding new positions to audit size safety.\n\n"
    else:
        critique += f"Good job on risk management. Your average risk per trade is {round(avg_risk, 2)}%, which is within the safe professional threshold.\n\n"

    if has_overtraded:
        critique += f"I see overtrading behavior. You logged more than 3 positions on {len(overtrading_days)} different days. Wait for confluences, don't rush.\n\n"

    if total_checks > 0:
        critique += f"Your overall setups rule compliance rate is {round(overall_compliance, 1)}%. "
        if overall_compliance >= 90:
            critique += "You are executing your setups with high discipline. Keep it up.\n\n"
        elif overall_compliance >= 70:
            critique += "You have decent compliance but you are letting some trades slide without checking all rules.\n\n"
        else:
            critique += "Your rule compliance is poor. Follow your check criteria without exception.\n\n"
            
        if compliance_insights:
            critique += "Rules you ignore frequently:\n"
            for insight in compliance_insights:
                critique += f"- In your '{insight['setup_name']}' setup, you ignore: '{insight['rule_text']}'. {insight['warning']}\n"
            critique += "\n"

    weekly_plan = []
    if not has_setups:
        weekly_plan.append("Configure at least one standard trade setup template.")
    if avg_risk > 2.0:
        weekly_plan.append("Strict Rule: Do not exceed 1.5% risk per trade on any new position.")
    if has_overtraded:
        weekly_plan.append("Limit Volume: Establish a daily maximum of 2 logged trades. Step away after.")
    if compliance_insights:
        for insight in compliance_insights[:2]:
            weekly_plan.append(f"Discipline Task: Follow rule '{insight['rule_text']}' in setup '{insight['setup_name']}' without exception.")
            
    if not weekly_plan:
        weekly_plan.append("Practice execution consistency: Keep logging confluences and rule checklists.")

    return {
        "status": "success",
        "username": username,
        "mentor_name": mentor_name,
        "avatar_emoji": avatar_emoji,
        "mentor_grade": grade,
        "mentor_grade_desc": grade_desc,
        "mentor_speech": critique,
        "expectancy": round(expectancy, 2),
        "avg_risk_percent": round(avg_risk, 2),
        "compliance_insights": compliance_insights,
        "weekly_plan": weekly_plan
    }


def perform_mentor_chat(user_id, message_history, user_message, image_filename=None, audio_filename=None):
    """
    Sends the user's message (and optional image/audio) along with trading history context to Google Gemini
    to get a conversational mentor reply.
    """
    trades = get_all_trades(user_id)
    stats = statistics_summary(user_id)
    
    user_info = fetch_one("SELECT email FROM users WHERE id = ?", (user_id,))
    username = user_info["email"].split("@")[0].capitalize() if user_info else "Trader"
    
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        return "Gemini API Key not found in server environment. Please contact the administrator."
    
    # Fetch custom AI mentor profile
    mentor_cfg = fetch_one("SELECT mentor_name, avatar_emoji, personality, custom_rules FROM custom_mentor_config WHERE user_id = ?", (user_id,))
    if mentor_cfg:
        mentor_name = mentor_cfg["mentor_name"]
        avatar_emoji = mentor_cfg["avatar_emoji"]
        personality_desc = mentor_cfg["personality"]
        custom_rules_str = mentor_cfg["custom_rules"]
    else:
        mentor_name = "Mentor AI"
        avatar_emoji = "👨‍🏫"
        personality_desc = "Professional, strict, and encouraging"
        custom_rules_str = ""

    # Format trades summary
    trade_logs = []
    for t in trades[:15]:
        trade_logs.append(
            f"Date: {t['trade_date']}, Symbol: {t['symbol']}, Type: {t['trade_type']}, Entry: {t['entry']}, Exit: {t['exit']}, P&L: {t['profit_loss']}, Notes: {t['notes']}"
        )

    system_instruction = f"""
    You are {mentor_name}, a custom AI Trading Mentor.
    Your avatar is {avatar_emoji}.
    Your personality guidelines: You are {personality_desc}. You must adopt these traits in your writing style.

    CRITICAL INSTRUCTION: You are trained on the Universal Trading Setup (UTS) framework. This is the trader's PRIMARY trading methodology. Every answer you give must be grounded in UTS rules. When you analyse a trade, check it against UTS. When you give advice, frame it using UTS concepts (sweep, trap candle, order block, liquidity phase, Big Player vs Retailer). Never contradict UTS rules. If the trader asks about any trading concept, explain it from the UTS perspective first.
    If the user uploads an image/screenshot, carefully analyze it according to the UTS rules. Look for support/resistance sweeps, trap candles, and order blocks. Point out any valid setups or mistakes directly from the visual evidence.

    === UTS FRAMEWORK (your complete knowledge base) ===
    {UTS_FRAMEWORK}
    === END UTS FRAMEWORK ===

    Additional trader-defined strategy guidelines to enforce:
    {custom_rules_str if custom_rules_str else 'No additional custom rules declared.'}

    You are chatting directly with {username}. Your goal is to guide them using UTS methodology, evaluate their setups against UTS rules, and call out any behaviour that violates UTS discipline.
    
    Trader's Stats:
    - Win Rate: {stats.get("Win Rate (%)", 0.0)}%
    - Total Trades: {stats.get("Total Trades", 0)}
    - Profit Factor: {stats.get("Profit Factor", 0.0)}
    
    Recent Trades Logs:
    {chr(10).join(trade_logs)}
    
    Answer the trader's questions in first-person as {mentor_name}. Reference UTS rules by name when relevant (e.g. "According to the UTS sweep rule...", "The UTS trap candle requires a minimum 1:3 wick-to-body ratio..."). Keep answers concise, specific to their data, and direct.
    """

    # Build multi-turn conversation contents for SDK
    sdk_contents = []
    for msg in message_history[-10:]:
        role = "user" if msg["sender"] == "user" else "model"
        sdk_contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["text"])]))
    
    # Prepare the latest user message parts
    user_parts = [types.Part.from_text(text=user_message)]
    
    # Attach image if provided
    if image_filename:
        image_path = os.path.join("uploads", image_filename)
        if os.path.exists(image_path):
            try:
                with open(image_path, "rb") as f:
                    img_bytes = f.read()
                ext = os.path.splitext(image_filename)[1].lower()
                mime_type = "image/jpeg"
                if ext == ".png":
                    mime_type = "image/png"
                elif ext in [".webp"]:
                    mime_type = "image/webp"
                
                user_parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime_type))
            except Exception as e:
                print(f"Error loading image {image_path}: {e}")

    # Attach audio if provided
    if audio_filename:
        audio_path = os.path.join("uploads", audio_filename)
        if os.path.exists(audio_path):
            try:
                with open(audio_path, "rb") as f:
                    audio_bytes = f.read()
                ext = os.path.splitext(audio_filename)[1].lower()
                mime_type = "audio/webm"
                if ext in [".wav"]:
                    mime_type = "audio/wav"
                elif ext in [".mp3"]:
                    mime_type = "audio/mpeg"
                
                user_parts.append(types.Part.from_bytes(data=audio_bytes, mime_type=mime_type))
            except Exception as e:
                print(f"Error loading audio {audio_path}: {e}")

    # Add the latest user message
    sdk_contents.append(types.Content(role="user", parts=user_parts))

    try:
        client = genai.Client(api_key=api_key)
        response = _generate_content_with_fallback(
            client, 
            sdk_contents, 
            config=types.GenerateContentConfig(system_instruction=system_instruction)
        )
        return response.text.strip()
    except Exception as e:
        return f"Could not reach my mentoring core: {str(e)}. Check your connection."
