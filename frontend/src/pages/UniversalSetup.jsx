import { useState, useEffect } from 'react'
import AIMentorPopup from '../components/AIMentorPopup'

// ── Scroll reveal ───────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.uts-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('uts-in-view'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useTabs(initial) {
  const [active, setActive] = useState(initial)
  return { active, setActive }
}

// ── Colours ────────────────────────────────────────────────────────
const BULL = '#34C795', BEAR = '#F2555A', GOLD = '#E8B24D'
const MUTED = '#8B93A3', DIM = '#5B6472', TEXT = '#EDEFF2'

// ── Style tokens ──────────────────────────────────────────────────
const sec  = { padding: '72px 28px', borderBottom: '1px solid rgba(237,239,242,0.09)', position: 'relative' }
const card = { background: 'rgba(17,21,29,0.7)', border: '1px solid rgba(237,239,242,0.09)', borderRadius: '14px', padding: '22px', backdropFilter: 'blur(8px)' }
const diag = { background: 'rgba(23,27,37,0.8)', border: '1px solid rgba(237,239,242,0.09)', borderRadius: '14px', padding: '20px', backdropFilter: 'blur(8px)' }
const cap  = { marginTop: '12px', fontSize: '13px', color: MUTED, lineHeight: 1.65, margin: 0 }
const lede = { color: MUTED, fontSize: '16px', lineHeight: 1.7, maxWidth: '620px', margin: 0 }
const h2s  = { fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(24px,3.4vw,38px)', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px', maxWidth: '700px', background: 'linear-gradient(to right,#EDEFF2,#8B93A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
const eyebrowS = { display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11.5px', letterSpacing: '0.14em', color: GOLD, textTransform: 'uppercase', marginBottom: '14px' }
const tabBtnBase = { fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', background: 'transparent', border: '1px solid rgba(237,239,242,0.16)', color: MUTED, padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s' }
const tabBtnOn  = { ...tabBtnBase, background: GOLD, color: '#171006', borderColor: GOLD, fontWeight: 700 }
const pillarBox = { background: 'rgba(17,21,29,0.7)', border: '1px solid rgba(237,239,242,0.09)', borderRadius: '12px', padding: '18px', textAlign: 'center', backdropFilter: 'blur(8px)' }
const flowRow   = { display: 'grid', gridTemplateColumns: '1fr 60px 1.2fr', gap: '12px', alignItems: 'center', background: 'rgba(17,21,29,0.7)', border: '1px solid rgba(237,239,242,0.09)', borderRadius: '10px', padding: '13px 18px' }
const fnBox = { background: '#151317', border: '1px dashed rgba(242,85,90,0.38)', borderRadius: '6px', padding: '18px 20px', transform: 'rotate(-1.2deg)', boxShadow: '0 8px 28px rgba(0,0,0,0.4)', position: 'relative', marginTop: '8px', fontFamily: "'IBM Plex Mono',monospace" }

// ── BILINGUAL CONTENT ─────────────────────────────────────────────
const T = {
  en: {
    langBtn: 'हिंदी',
    navLabel: 'UTS',
    nav: ['Battle','Framework','Flow','Structure','Footprint','Candle','SMC','Traps','Patterns','Setup','Risk','Mind','Roadmap'],

    heroEye: 'Field Notes - Mar 2017 to Apr 2025 - A personal trading framework',
    heroTitle1: 'The Universal', heroTitle2: 'Trading Setup',
    heroLede: 'Every chart has two participants: the retailer, who reacts and the big player, who plans. This framework is built entirely around learning to read the second one\'s footprint before you risk a single rupee on the first one\'s noise.',
    heroChartCap: '',

    battleEye: '$battle - retailer vs big player',
    battleH2: 'Two players, one chart',
    battleLede: 'The market works on psychology - not just yours, but the crowd\'s. To trade well, you have to read both: how the retailer thinks, and how the big player deliberately trades against it.',
    retailTag: '// retailer', retailTitle: 'Reacts',
    bigTag: '// big player', bigTitle: 'Plans',
    retailItems: [
      'Trades off what is visible right now - the last candle, the last green arrow.',
      'Small order size. Individually, it has no effect on the market.',
      'Gets its ideas from YouTube, Instagram, Google - and a lot of paid courses.',
      'Places stops and entries at the obvious, textbook support and resistance.',
      'Watches the chart constantly, and trades out of impatience.',
    ],
    bigItems: [
      'Has less time than the retailer, so it focuses only on the most-used tools: support, resistance, structure.',
      'Large order size - big enough to fluctuate the market on its own.',
      'Needs liquidity to fill that size, so it manipulates price toward where retail orders are sitting.',
      'Builds a position quietly, then shows a fast, confirming move to invite the retailer in - on the wrong side.',
      '99% observation, 1% execution.',
    ],
    battleNote: 'Market works on Psychology. Retailer, against Big player. Note: trade against Retailer. Note: Read both psychology.',

    fwEye: '$framework - the four pillars',
    fwH2: 'Four inputs, one read: price action',
    fwLede: 'Everything funnels into one question - what is price actually doing, right now, at this level? Four inputs answer it.',
    fwLede2: 'Two of these get studied the deepest: candlestick patterns and chart patterns - because that is where the trap actually gets set and sprung.',
    pillars: [
      { n: '01', title: 'S / R / Trend',   desc: 'Where price has reacted before, and which way it\'s currently biased.' },
      { n: '02', title: 'Indicator',        desc: '9 / 15 EMA for trend and momentum confirmation - never used alone.' },
      { n: '03', title: 'Volume',           desc: 'How much size is really trading at a level - confirms whether a move is real.' },
      { n: '04', title: 'Option Chain',     desc: 'OI and PCR - where big players have written contracts, and what they are betting on.' },
    ],

    flowEye: '$flow - demand, supply and price',
    flowH2: 'What actually moves the candle',
    flowLede: 'Every other concept on this page is a specific way of manufacturing one of these four situations.',
    flowRows: [
      { lbl: 'Demand up, Supply up',   arrow: '=', col: GOLD, result: 'Price holds',  note: 'stable' },
      { lbl: 'Demand up, Supply down', arrow: '^', col: BULL, result: 'Price climbs', note: 'buyers in control' },
      { lbl: 'Demand down, Supply up', arrow: 'v', col: BEAR, result: 'Price falls',  note: 'sellers in control' },
      { lbl: 'Demand down, Supply down', arrow: '=', col: GOLD, result: 'Price holds', note: 'stable, low conviction' },
    ],

    structEye: '$structure - trend and swings',
    structH2: 'Reading structure: HH/HL, LH/LL, and range',
    structLede: 'A swing high that gets revisited becomes resistance. A swing low that gets revisited becomes support. Everything else is just naming the sequence of these swings.',
    structCards: [
      { title: 'UPTREND',   col: BULL, cap: 'Higher highs, higher lows. Demand consistently outruns supply.' },
      { title: 'DOWNTREND', col: BEAR, cap: 'Lower highs, lower lows. Supply consistently outruns demand.' },
      { title: 'SIDEWAYS',  col: GOLD, cap: 'A narrow or wide range while both sides decide. Undecided, not directionless.' },
    ],

    footEye: '$footprint - size and liquidity',
    footH2: 'Small size moves nothing. Large size moves everything.',
    footLede: 'A retail order is too small to fluctuate the market. A big player\'s order is large enough to move price on its own, but needs an equal and opposite amount of liquidity to fill without slipping.',
    footLede2: 'That is the whole reason a liquidity creation phase exists: the big player builds an obvious range, invites orders onto the wrong side of it, then sweeps through to collect the fuel it needs for the real move.',
    footNote: 'Big players have less time, then focus only on most-used things - Support and Resistance, to manipulate.',
    retailCard: { tag: 'RETAIL ORDER', qty: 'small qty', cap: 'No effect on the market.' },
    bigCard: { tag: 'BIG PLAYER ORDER', qty: 'large qty', cap: 'Fluctuates the market and requires liquidity to fill.' },

    candleEye: '$candle - the trap candle',
    candleH2: 'One candle, two players',
    candleLede: 'Colour does not matter. What matters is where the close sits relative to the wick and how big the rejection is. This bewafa (unfaithful) candle is the single most reliable tell in the whole framework.',
    candleLede2: 'A trap candle only counts once the wick-to-body ratio is stretched enough. The bigger the ratio, the stronger the rejection.',
    buyerTitle: 'BUYER CANDLE', buyerCap: 'Long lower wick, small body near the top. Price swept below a level and got reclaimed - buyers stepped in aggressively.',
    sellerTitle: 'SELLER CANDLE', sellerCap: 'Long upper wick, small body near the bottom. Price swept above a level and got rejected - sellers stepped in aggressively.',
    ratios: ['1:3 - required', '1:4 - stronger', '1:5 - strongest'],

    smcEye: '$smc - smart money concept',
    smcH2: 'Reading the order block',
    smcLede: 'Smart money is simply the amount a big player uses to manipulate the chart. On the big time frames - 1H, 4H, 1D - a major swing leaves behind an order block: the last opposing candle before an impulsive move.',
    smcCap: 'Price returns to test the block. Each touch either confirms the zone or uses it up.',
    smcCap2: 'Rule from the notes: if it comes back only up to three times, we can trust it. Beyond that, treat the zone as unstable.',
    smcNote: 'Order added already. If comes only three times, we can trust.',

    trapsEye: '$traps - the liquidity playbook',
    trapsH2: 'The liquidity creation phase, three ways',
    trapsLede: 'Build an obvious level, invite the crowd onto the wrong side of it, sweep it to collect their stops and pending orders, then reverse hard in the real direction. Same idea, three shapes.',
    trapTabs: ['Support Trap', 'Resistance Trap', 'Trendline Trap'],
    trapCaps: [
      'Price bounces off a flat support again and again - retail keeps buying it and stacking stops just underneath. One candle finally sweeps below, then reverses up hard.',
      'Mirror image at a ceiling. Repeated touches at resistance, a sweep above it to trap late buyers, then a hard reversal down.',
      'An obvious rising trendline that everyone can see. A fake break against it shakes out the trend-followers - then price resumes in the original direction.',
    ],

    pattEye: '$patterns - chart pattern traps',
    pattH2: 'Classic patterns, read as traps - not signals',
    pattLede: 'Pattern names and directional bias follow the trader\'s own system as logged in the journal. The mechanism (neckline, sweep, 50% rule, reversal) is what matters.',
    pattLede2: 'Also watch for: Pole and Flag - a sharp impulsive pole, a tight countertrend flag, and continuation in the pole\'s original direction.',
    pattTabs: ['Double Top / Bottom', 'Head and Shoulders', 'Cup and Handle'],
    dtCaps: [
      'Two highs invite late buyers; break of neckline, 50% rule for entry, target 300pts, stop above the second top.',
      'Two lows trap late sellers; break of neckline up, entry on the 50% retrace, stop below the second bottom.',
    ],
    hsCaps: [
      'Left shoulder, higher head, right shoulder. Stop-hunt above the neckline, then the real breakdown.',
      'Mirror image at a low. Stop-hunt below the neckline, then the real breakout up.',
    ],
    chCaps: [
      'A rounded base (cup), a small pullback (handle) that shakes out the impatient, then the breakout.',
      'The mirrored dome at a top - a small bounce (handle) traps late buyers before the real breakdown.',
    ],

    setupEye: '$setup - sweep and reversal',
    setupH2: 'Putting it together',
    setupLede: 'This is the actual, tradeable setup - every section above is just building the vocabulary to read it.',
    setupSteps: [
      { n: '01', title: 'Sweep', desc: 'Price takes out an obvious level - support, resistance, trendline, or a pattern neckline.' },
      { n: '02', title: 'Trap Candle', desc: 'A rejection candle confirms it - 1:3 or better wick-to-body ratio, closing back inside the range.' },
      { n: '03', title: 'Enter and Manage', desc: 'Enter in the new direction. Stop beyond the sweep wick. Target the next liquidity pool.' },
    ],
    setupPCH: 'POSITION CONVERSION AND ACCUMULATION (PC + AC)',
    setupPCCap: 'Before the real move, big players build a position gradually through repeated small clusters at the same level. Round numbers (prices ending in 000 / 500) and the 50% retracement of the prior impulse leg add confluence to the zone.',
    setupNote: 'Structural trap and PC + AC. Reversal patterns: M, W, Mh, M(2).',

    riskEye: '$risk - rules that protect the read',
    riskH2: 'Trade management',
    riskLede: 'A correct read with no risk control is still a losing system. These are the operating rules logged alongside the setup.',
    riskGroups: [
      { title: 'Before the trade', items: ['Wait for the full setup. No sweep, no trap candle, no trade.', 'The 30% Rule - a fixed risk-sizing threshold kept from the original playbook.', 'Cap the number of trades: one trade per day, full stop.'] },
      { title: 'During the trade', items: ['Split the entry: roughly 50% at the trigger, 50% on a favourable retest.', 'Keep a single loss inside roughly 12-15% of planned risk.', 'A loss stops trading for the day. A booked profit also stops trading for the day.'] },
      { title: 'On profit', items: ['First target ~300 points; trailing after that, again and again.', 'A trail-stop exit is not a failure - take it without hesitation.', 'Withdraw your profits. Do not let gains sit as numbers on a screen.'] },
    ],
    riskDisclaimer: 'These are personal thresholds recorded in the original journal, tuned to one trader\'s instrument and capital. They are not a universal recommendation. Position-size and risk according to your own capital, instrument, and broker terms. This page is educational, not financial advice.',

    mindEye: '$mind - psychology and routine',
    mindH2: 'Control your mind before you control your trade',
    mindLede: 'The discipline gets built long before the market opens.',
    mindLede2: 'Stop looking at charts all the time - checking constantly produces more emotion, not more signal. And withdraw your profits, on schedule.',
    routine: [
      { time: '4:00', what: 'Wake up' },
      { time: '4:45', what: 'Walk' },
      { time: '5:15', what: 'Yoga and meditation (Yoga Nidra)' },
      { time: 'Market open', what: 'Trade - quietly.' },
    ],
    quotes: [
      { q: 'Trading is not what you expect. Trading is what you see.', d: '14 April' },
      { q: 'Trend is your friend.', d: '21 April' },
      { q: 'Control your losses. Manage your trade.', d: 'signed, 21 April' },
    ],

    roadEye: '$roadmap - the path',
    roadH2: 'Six to eight months, then execution',
    roadLede: 'The journal is explicit about this: it took 6-8 months of losses before the framework actually clicked. Treat that as an honest expectation, not a shortcut.',
    roadBannerSub: 'of paper losses, before the read became reliable enough to trust.',
    longLabel: 'Long bias', shortLabel: 'Short bias',
    longTFs:  ['Monthly / Weekly - HTF context', '1D - daily structure', '4H - intraday bias', '1H - entry TF', '15M - fine-tune entry'],
    shortTFs: ['1D - HTF context and structure', '4H - session bias', '1H - primary TF', '15M - entry TF', '5M - timing'],
    bootLabel: '// DAILY BOOT SEQUENCE',
    bootRules: ['One trade per day. One setup, one decision.', 'No trade without the full read: sweep + trap candle + structure.', 'Loss stops the day. Profit stops the day.', 'Withdraw on schedule. Money left in the account is temptation.', '99% observation, 1% execution.'],
    bootFinal: 'If none of these conditions are met today, the trade is: do nothing. That is also a position.',

    footerQuote: 'Wait for the real move. Do nothing until then.',
    footerSub: 'UTS Framework - Field Notes - Mar 2017 to Apr 2025 - Personal trading system, not financial advice.',
    backTop: 'Back to top',
  },

  hi: {
    langBtn: 'English',
    navLabel: 'UTS',
    nav: ['Battle','Framework','Flow','Structure','Footprint','Candle','SMC','Traps','Patterns','Setup','Risk','Mind','Roadmap'],

    heroEye: 'Field Notes - March 2017 se April 2025 - Ek personal trading framework',
    heroTitle1: 'Universal', heroTitle2: 'Trading Setup',
    heroLede: 'Har chart mein do participants hote hain: Retailer - jo react karta hai, aur Big Player - jo plan karta hai. Ye framework poori tarah se doosre ki footprint padhne ke liye bani hai - pehle wale ke noise pe rupaya lagane se pehle.',
    heroChartCap: '',

    battleEye: '$battle - retailer vs big player',
    battleH2: 'Do khiladi, ek chart',
    battleLede: 'Market psychology pe chalti hai - sirf tumhari nahi, poori bheed ki. Achha trade karna hai to dono padhne honge: Retailer kaise sochta hai, aur Big Player jaanbujhkar uske against kaise trade karta hai.',
    retailTag: '// retailer', retailTitle: 'React karta hai',
    bigTag: '// big player', bigTitle: 'Plan karta hai',
    retailItems: [
      'Jo abhi dikh raha hai usi pe trade karta hai - last candle, last green arrow.',
      'Chhota order size. Akele market pe koi asar nahi.',
      'Ideas YouTube, Instagram, Google se milte hain - aur bahut saare paid courses se.',
      'Stops aur entries obvious, textbook support aur resistance pe lagate hain.',
      'Chart lagaatar dekhta rehta hai, aur impatience mein trade karta hai.',
    ],
    bigItems: [
      'Retailer se kam time hota hai, isliye sirf sabse zyada use hone wali cheezein dekhta hai: support, resistance, structure.',
      'Bada order size - akele market hilane ke liye kaafi.',
      'Us size ko fill karne ke liye liquidity chahiye, isliye price ko wahan le jaata hai jahan retail orders baithe hain.',
      'Quietly position build karta hai, phir ek fast confirming move dikhata hai - retailer ko galat side mein invite karne ke liye.',
      '99% observation, 1% execution.',
    ],
    battleNote: 'Market Psychology pe kaam karta hai. Retailer, Big Player ke against. Note: Retailer ke against trade karo. Note: Dono psychology padho.',

    fwEye: '$framework - char pillars',
    fwH2: 'Char inputs, ek read: Price Action',
    fwLede: 'Sab kuch ek sawaal mein funnel hota hai - is level pe abhi price actually kya kar raha hai? Char inputs jawab dete hain.',
    fwLede2: 'Inme se do sabse gehraai se padhte hain: candlestick patterns aur chart patterns - kyunki wahi pe trap set aur spring hota hai.',
    pillars: [
      { n: '01', title: 'S / R / Trend',   desc: 'Price pehle kahan react kar chuka hai, aur abhi kis direction mein biased hai.' },
      { n: '02', title: 'Indicator',        desc: '9 / 15 EMA sirf trend aur momentum confirmation ke liye - akele kabhi use nahi.' },
      { n: '03', title: 'Volume',           desc: 'Ek level pe kitna size actually trade ho raha hai - confirm karta hai ki move real hai ya nahi.' },
      { n: '04', title: 'Option Chain',     desc: 'OI aur PCR - big players ne kahan contracts likhe hain, aur kya bet laga rakhi hai.' },
    ],

    flowEye: '$flow - demand, supply aur price',
    flowH2: 'Candle actually kya move karta hai',
    flowLede: 'Is page ka har concept basically inhi char situations mein se koi ek banata hai.',
    flowRows: [
      { lbl: 'Demand up, Supply up',   arrow: '=', col: GOLD, result: 'Price stable',  note: 'koi side nahi' },
      { lbl: 'Demand up, Supply down', arrow: '^', col: BULL, result: 'Price badhta hai', note: 'buyers in control' },
      { lbl: 'Demand down, Supply up', arrow: 'v', col: BEAR, result: 'Price girta hai',  note: 'sellers in control' },
      { lbl: 'Demand down, Supply down', arrow: '=', col: GOLD, result: 'Price stable', note: 'low conviction, dono side kamzor' },
    ],

    structEye: '$structure - trend aur swings',
    structH2: 'Structure padhna: HH/HL, LH/LL, aur range',
    structLede: 'Ek swing high jo dobara visit hota hai resistance ban jaata hai. Ek swing low jo dobara visit hota hai support ban jaata hai. Baaki sab inhi swings ki sequence ka naam hai.',
    structCards: [
      { title: 'UPTREND',   col: BULL, cap: 'Higher highs, higher lows. Demand lagaatar supply se aage.' },
      { title: 'DOWNTREND', col: BEAR, cap: 'Lower highs, lower lows. Supply lagaatar demand se aage.' },
      { title: 'SIDEWAYS',  col: GOLD, cap: 'Dono side decide kar rahi hain. Undecided hai, directionless nahi.' },
    ],

    footEye: '$footprint - size aur liquidity',
    footH2: 'Chhota size kuch nahi hilata. Bada size sab hilata hai.',
    footLede: 'Retail order market hilane ke liye bahut chhota hai. Big player ka order price khud move kar sakta hai, lekin fill hone ke liye barabar aur opposite liquidity chahiye - bina slippage ke.',
    footLede2: 'Yahi wajah hai ki liquidity creation phase exist karta hai: Big Player ek obvious range banata hai, retail ko galat side pe le aata hai, phir sweep karke asli move ke liye fuel collect karta hai.',
    footNote: 'Big players ke paas kam time hai, isliye sirf sabse zyada use hone wali cheezein dekhte hain - Support aur Resistance, manipulate karne ke liye.',
    retailCard: { tag: 'RETAIL ORDER', qty: 'chhota qty', cap: 'Market pe koi asar nahi.' },
    bigCard: { tag: 'BIG PLAYER ORDER', qty: 'bada qty', cap: 'Market hilata hai aur fill ke liye liquidity chahiye.' },

    candleEye: '$candle - trap candle (bewafa candle)',
    candleH2: 'Ek candle, do khiladi',
    candleLede: 'Color matter nahi karta. Jo matter karta hai wo hai: close wick ke relative kahan baitha hai, aur rejection kitna bada hai. Ye bewafa (nafarmaan) candle poore framework ka sabse reliable signal hai.',
    candleLede2: 'Trap candle tab hi count hogi jab wick-to-body ratio kaafi stretched ho. Ratio jitna bada, rejection utna strong.',
    buyerTitle: 'BUYER CANDLE', buyerCap: 'Lamba neeche ka wick, chhota body upar ke paas. Price ek level ke neeche sweep hui aur reclaim ho gayi - buyers ne aggressively entry li.',
    sellerTitle: 'SELLER CANDLE', sellerCap: 'Lamba upar ka wick, chhota body neeche ke paas. Price ek level ke upar sweep hui aur reject ho gayi - sellers ne aggressively entry li.',
    ratios: ['1:3 - minimum', '1:4 - strong', '1:5 - strongest'],

    smcEye: '$smc - smart money concept',
    smcH2: 'Order Block padhna',
    smcLede: 'Smart money simply woh amount hai jo big player chart manipulate karne ke liye use karta hai. Bade time frames pe - 1H, 4H, 1D - ek major swing ke baad ek order block bachta hai: impulsive move se pehle ka aakhri opposing candle.',
    smcCap: 'Price block test karne wapas aati hai. Har touch ya to zone confirm karta hai ya use khatam karta hai.',
    smcCap2: 'Notes ka rule: agar teen baar tak aaye to trust kar sakte hain. Usse zyada = zone unstable maano.',
    smcNote: 'Order add ho gaya. Agar sirf teen baar aaye to trust kar sakte hain.',

    trapsEye: '$traps - liquidity playbook',
    trapsH2: 'Liquidity creation phase, teen tarike',
    trapsLede: 'Obvious level banao, bheed ko galat side mein invite karo, unke stops aur pending orders collect karne ke liye sweep karo, phir asli direction mein hard reverse karo. Same idea, teen shapes.',
    trapTabs: ['Support Trap', 'Resistance Trap', 'Trendline Trap'],
    trapCaps: [
      'Price flat support pe baar baar bounce karti hai - retail khareedta rehta hai aur stops neeche stack karta hai. Ek candle finally neeche sweep karti hai, phir tezi se upar reverse hoti hai.',
      'Ceiling pe mirror image. Resistance pe baar baar touches, uske upar sweep karke late buyers ko trap karo, phir hard reversal neeche.',
      'Obvious rising trendline jo sab dekh sakte hain. Ek fake break trend-followers ko shake out karta hai - phir price original direction mein resume hoti hai.',
    ],

    pattEye: '$patterns - chart pattern traps',
    pattH2: 'Classic patterns, signals nahi - traps ki tarah padho',
    pattLede: 'Pattern ke naam aur directional bias trader ke apne system ke hisaab se hain. Mechanism (neckline, sweep, 50% rule, reversal) hi matter karta hai.',
    pattLede2: 'Ye bhi dhyaan rakho: Pole and Flag - sharp impulsive pole, tight countertrend flag, aur pole ki original direction mein continuation.',
    pattTabs: ['Double Top / Bottom', 'Head and Shoulders', 'Cup and Handle'],
    dtCaps: [
      'Do highs late buyers ko invite karte hain; neckline break confirm karta hai, 50% rule se entry, target 300pts, stop second top ke upar.',
      'Do lows late sellers ko trap karte hain; neckline upar break karta hai, 50% retrace pe entry, stop second bottom ke neeche.',
    ],
    hsCaps: [
      'Left shoulder, ooncha head, right shoulder. Stop-hunt neckline ke upar, phir asli breakdown.',
      'Low pe mirror image. Stop-hunt neckline ke neeche, phir asli breakout upar.',
    ],
    chCaps: [
      'Rounded base (cup), ek chhota pullback (handle) impatient logon ko shake out karta hai, phir breakout.',
      'Top pe dome, ek chhota bounce (handle) late buyers ko trap karta hai, phir breakdown.',
    ],

    setupEye: '$setup - sweep aur reversal',
    setupH2: 'Sab kuch ek saath',
    setupLede: 'Yahi actual, tradeable setup hai - upar ka har section bas ise padhne ki vocabulary banata hai.',
    setupSteps: [
      { n: '01', title: 'Sweep', desc: 'Price ek obvious level tod deti hai - support, resistance, trendline, ya pattern neckline.' },
      { n: '02', title: 'Trap Candle', desc: 'Rejection candle confirm karti hai - minimum 1:3 wick-to-body ratio, range ke andar close ke saath.' },
      { n: '03', title: 'Entry aur Management', desc: 'Naye direction mein enter karo. Stop sweep ke wick ke bahar. Target aagla liquidity pool.' },
    ],
    setupPCH: 'POSITION CONVERSION AND ACCUMULATION (PC + AC)',
    setupPCCap: 'Asli move se pehle, big players dhire dhire position build karte hain - ek hi level pe baar baar chhote clusters ke zariye. Round numbers (000 / 500 pe khatam hone wale prices) aur prior impulse ka 50% retracement strong confluence add karte hain.',
    setupNote: 'Structural trap aur PC + AC. Reversal patterns: M, W, Mh, M(2).',

    riskEye: '$risk - read ko protect karne wale rules',
    riskH2: 'Trade management',
    riskLede: 'Sahi read ke baad bhi risk control nahi to losing system hai. Ye operating rules hain jo journal mein setup ke saath note kiye gaye.',
    riskGroups: [
      { title: 'Trade se pehle', items: ['Poora setup wait karo. Sweep nahi, trap candle nahi, trade nahi.', '30% Rule - original playbook ka fixed risk-sizing threshold.', 'Trades ki limit: ek din mein sirf ek trade, bas.'] },
      { title: 'Trade ke dauran', items: ['Entry split karo: roughly 50% trigger pe, 50% favourable retest pe.', 'Ek loss planned risk ke 12-15% ke andar rakho.', 'Loss hona = us din aur trading band. Profit book hona = us din aur trading band.'] },
      { title: 'Profit pe', items: ['Pehla target ~300 points; uske baad trailing stop, baar baar.', 'Trail-stop exit failure nahi hai - bina hesitation ke le lo.', 'Profits withdraw karo. Screen pe numbers mat baithne do.'] },
    ],
    riskDisclaimer: 'Ye personal thresholds hain jo original journal mein ek trader ke instrument aur capital ke hisaab se note kiye gaye. Ye universal recommendation nahi hain. Apne khud ke capital, instrument aur broker terms ke hisaab se position-size aur risk rakho. Ye page educational hai, financial advice nahi.',

    mindEye: '$mind - psychology aur routine',
    mindH2: 'Apne trade se pehle apna mann control karo',
    mindLede: 'Discipline market khulne se bahut pehle banti hai.',
    mindLede2: 'Charts lagaatar mat dekho - baar baar dekhne se signal nahi, emotion aata hai. Aur profits schedule pe withdraw karo.',
    routine: [
      { time: '4:00', what: 'Uthna' },
      { time: '4:45', what: 'Walk' },
      { time: '5:15', what: 'Yoga aur meditation (Yoga Nidra)' },
      { time: 'Market open', what: 'Quietly trade karo.' },
    ],
    quotes: [
      { q: 'Trading woh nahi jo tum expect karte ho. Trading woh hai jo tum dekhte ho.', d: '14 April' },
      { q: 'Trend tumhara dost hai.', d: '21 April' },
      { q: 'Apne losses control karo. Apna trade manage karo.', d: 'signed, 21 April' },
    ],

    roadEye: '$roadmap - raah',
    roadH2: 'Chhe se aath mahine, phir execution',
    roadLede: 'Journal isme ekdum saaf hai: framework actually click hone se pehle 6-8 mahine ke losses lagte hain. Ise honest expectation maano, shortcut nahi.',
    roadBannerSub: 'paper losses ke, jab tak read kaafi reliable nahi ho gayi.',
    longLabel: 'Long bias', shortLabel: 'Short bias',
    longTFs:  ['Monthly / Weekly - HTF context', '1D - daily structure', '4H - intraday bias', '1H - entry TF', '15M - fine-tune entry'],
    shortTFs: ['1D - HTF context and structure', '4H - session bias', '1H - primary TF', '15M - entry TF', '5M - timing'],
    bootLabel: '// ROZ KA BOOT SEQUENCE',
    bootRules: ['Ek din mein sirf ek trade. Ek setup, ek decision.', 'Sweep + trap candle + structure - teeno ke bina trade nahi.', 'Loss = din khatam. Profit = din khatam.', 'Schedule pe withdraw karo. Account mein rakha paisa laalach hai.', '99% observation, 1% execution.'],
    bootFinal: 'Agar aaj koi bhi condition poori nahi hoti: kuch mat karo. Yahi bhi ek position hai.',

    footerQuote: 'Asli move ka intezaar karo. Tab tak kuch mat karo.',
    footerSub: 'UTS Framework - Field Notes - March 2017 se April 2025 - Personal trading system, financial advice nahi.',
    backTop: 'Upar wapas',
  }
}

// ── NAV ANCHOR IDS ────────────────────────────────────────────────
const NAV_IDS = ['battle','framework','flow','structure','footprint','candle','smc','traps','patterns','setup','risk','mind','roadmap']

// ── ATOMS ─────────────────────────────────────────────────────────
function Eyebrow({ txt }) {
  return <div style={eyebrowS}><span style={{ fontSize: '9px' }}>&#9650;</span>{txt}</div>
}
function Reveal({ children, style }) {
  return <div className="uts-reveal" style={style}>{children}</div>
}
function FieldNote({ children, date }) {
  return (
    <div style={fnBox}>
      <div style={{ position: 'absolute', top: '-10px', left: '14px', background: BEAR, color: '#1a0808', fontFamily: "'IBM Plex Mono',monospace", fontSize: '9px', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '3px', fontWeight: 700 }}>FIELD NOTE</div>
      <p style={{ color: '#E7C7C8', fontSize: '12.5px', lineHeight: 1.75, margin: 0 }}>{children}</p>
      {date && <span style={{ display: 'block', marginTop: '10px', color: 'rgba(242,85,90,0.65)', fontSize: '11px' }}>- {date}</span>}
    </div>
  )
}
function TabSet({ tabs, panels }) {
  const { active, setActive } = useTabs(tabs[0].id)
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(t => <button key={t.id} onClick={() => setActive(t.id)} style={active === t.id ? tabBtnOn : tabBtnBase}>{t.label}</button>)}
      </div>
      {panels.map(p => <div key={p.id} style={{ display: active === p.id ? 'block' : 'none' }}>{p.content}</div>)}
    </div>
  )
}

function HeroChart({ t }) {
  const images = [
    "/BTCUSD_2026-07-19_10-39-11.png",
    "/BTCUSD_2026-07-19_11-07-22.png",
    "/Screenshot 2026-07-19 112108.png"
  ]
  const [curr, setCurr] = useState(0)

  const prev = () => setCurr(c => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurr(c => (c + 1) % images.length)

  const arrowBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(10,13,18,0.6)', color: TEXT, border: '1px solid rgba(237,239,242,0.16)',
    borderRadius: '50%', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
    fontFamily: "'IBM Plex Mono',monospace", fontSize: '18px'
  }

  return (
    <div style={{ ...diag, marginTop: '44px', position: 'relative' }}>
      <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '22px', color: '#E8B24D', margin: '0 0 16px 0', textAlign: 'center' }}>Examples of trading setups</h3>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
        <button onClick={prev} style={{ ...arrowBtn, left: '12px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,13,18,0.9)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,13,18,0.6)'}>&lt;</button>
        <button onClick={next} style={{ ...arrowBtn, right: '12px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,13,18,0.9)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,13,18,0.6)'}>&gt;</button>
        <div style={{ display: 'flex', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${curr * 100}%)` }}>
          {images.map((src, i) => (
            <img 
              key={src}
              src={src} 
              alt={`Hero Chart ${i + 1}`} 
              style={{ width: '100%', flexShrink: 0 }} 
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurr(i)}
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              border: 'none',
              background: curr === i ? GOLD : DIM,
              cursor: 'pointer',
              transition: 'background 0.3s'
            }} 
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}


// ── ALL SECTIONS ──────────────────────────────────────────────────
function HeroSection({ t }) {
  return (
    <section style={{ ...sec, borderTop: '1px solid rgba(237,239,242,0.09)' }}>
      <Eyebrow txt={t.heroEye} />
      <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(36px,5.5vw,62px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.04, background: 'linear-gradient(135deg,#EDEFF2 40%,#E8B24D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 18px' }}>
        {t.heroTitle1}<br />{t.heroTitle2}
      </h1>
      <p style={{ ...lede, fontSize: '17px', maxWidth: '640px' }}>{t.heroLede}</p>
      <HeroChart t={t} />
    </section>
  )
}

function BasicSection({ t, id, eyeKey, h2Key, ledeKey, lede2Key, noteKey, customData }) {
  return (
    <section style={sec} id={id}>
      <div style={{ marginBottom: '40px' }}>
        <Eyebrow txt={t[eyeKey]} />
        <h2 style={h2s}>{t[h2Key]}</h2>
        <p style={lede}>{t[ledeKey]}</p>
        {t[lede2Key] && <p style={{ ...lede, marginTop: '12px' }}>{t[lede2Key]}</p>}
      </div>
      
      {customData && customData()}

      {t[noteKey] && (
        <Reveal>
          <FieldNote>{t[noteKey]}</FieldNote>
        </Reveal>
      )}
    </section>
  )
}


// ── ROOT ──────────────────────────────────────────────────────────
export default function UniversalSetup() {
  const [lang, setLang] = useState('hi')
  const [showAiExplain, setShowAiExplain] = useState(false)
  const t = T[lang]
  useScrollReveal()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');
        .uts-reveal { opacity:0; transform:translateY(20px); transition:opacity .7s ease,transform .7s ease; }
        .uts-reveal.uts-in-view { opacity:1; transform:translateY(0); }
      `}</style>

      <div style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari','Outfit',sans-serif" : "'IBM Plex Mono','Outfit',monospace", color: TEXT, background: 'transparent', maxWidth: '1080px', margin: '0 auto', paddingBottom: '80px', width: '100%' }}>

        {/* Sub-nav with language toggle */}
        <div style={{ position: 'sticky', top: '70px', zIndex: 40, background: 'rgba(10,13,18,0.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(237,239,242,0.09)', borderRadius: '0 0 16px 16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '6px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: GOLD, whiteSpace: 'nowrap', marginRight: '4px' }}>{t.navLabel}</span>
            <div style={{ display: 'flex', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
              {NAV_IDS.map((id, i) => (
                <a key={id} href={`#${id}`}
                  style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: MUTED, textDecoration: 'none', padding: '6px 10px', borderRadius: '100px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = TEXT}
                  onMouseLeave={e => e.target.style.color = MUTED}>
                  {t.nav[i]}
                </a>
              ))}
            </div>

            {/* AI Explain Toggle */}
            <button
              onClick={() => setShowAiExplain(!showAiExplain)}
              style={{
                marginLeft: '12px', flexShrink: 0,
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: '12px', fontWeight: 600,
                padding: '6px 14px', borderRadius: '100px',
                border: `1px solid #6366f1`,
                background: showAiExplain ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.12)',
                color: '#8b5cf6', cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span>✨</span>
              {showAiExplain ? 'Close AI' : 'Explain with AI'}
            </button>
            <button
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              style={{
                marginLeft: '6px', flexShrink: 0,
                fontFamily: lang === 'hi' ? "'IBM Plex Mono',monospace" : "'Noto Sans Devanagari',sans-serif",
                fontSize: '12px', fontWeight: 600,
                padding: '6px 14px', borderRadius: '100px',
                border: `1px solid ${GOLD}`,
                background: 'rgba(232,178,77,0.12)',
                color: GOLD, cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '14px' }}>{lang === 'en' ? 'अ' : 'A'}</span>
              {t.langBtn}
            </button>
          </div>
        </div>

        {/* AI Explain Modal */}
        {showAiExplain && (
          <AIMentorPopup onClose={() => setShowAiExplain(false)} />
        )}

        {/* Sections rendered from T object dynamically */}
        <HeroSection t={t} />
        
        <BasicSection t={t} id="battle" eyeKey="battleEye" h2Key="battleH2" ledeKey="battleLede" noteKey="battleNote" customData={() => (
          <Reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
            <div style={card}>
              <div style={{ color: BEAR, fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', marginBottom: '12px' }}>{t.retailTag}</div>
              <h3 style={{ margin: '0 0 16px', color: TEXT }}>{t.retailTitle}</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: MUTED, fontSize: '14px', lineHeight: 1.6 }}>
                {t.retailItems.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
              </ul>
            </div>
            <div style={card}>
              <div style={{ color: BULL, fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', marginBottom: '12px' }}>{t.bigTag}</div>
              <h3 style={{ margin: '0 0 16px', color: TEXT }}>{t.bigTitle}</h3>
              <ul style={{ paddingLeft: '20px', margin: 0, color: MUTED, fontSize: '14px', lineHeight: 1.6 }}>
                {t.bigItems.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
              </ul>
            </div>
          </Reveal>
        )} />
        <BasicSection t={t} id="framework" eyeKey="fwEye" h2Key="fwH2" ledeKey="fwLede" lede2Key="fwLede2" customData={() => (
          <Reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '32px' }}>
            {t.pillars.map((p, i) => (
              <div key={i} style={pillarBox}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '24px', color: 'rgba(237,239,242,0.1)', fontWeight: 700 }}>{p.n}</div>
                <h3 style={{ margin: '8px 0', fontSize: '16px', color: TEXT }}>{p.title}</h3>
                <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </Reveal>
        )} />
        <BasicSection t={t} id="flow" eyeKey="flowEye" h2Key="flowH2" ledeKey="flowLede" customData={() => (
          <Reveal style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {t.flowRows.map((r, i) => (
              <div key={i} style={flowRow}>
                <div style={{ fontSize: '14px', color: TEXT }}>{r.lbl}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", color: r.col, fontSize: '16px', textAlign: 'center', fontWeight: 700 }}>{r.arrow}</div>
                <div style={{ fontSize: '14px', color: r.col }}>{r.result} <span style={{ color: DIM }}>— {r.note}</span></div>
              </div>
            ))}
          </Reveal>
        )} />
        <BasicSection t={t} id="structure" eyeKey="structEye" h2Key="structH2" ledeKey="structLede" customData={() => (
          <Reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '32px' }}>
            {t.structCards.map((c, i) => (
              <div key={i} style={card}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: c.col, marginBottom: '16px', fontWeight: 600 }}>{c.title}</div>
                <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{c.cap}</p>
              </div>
            ))}
          </Reveal>
        )} />
        <BasicSection t={t} id="footprint" eyeKey="footEye" h2Key="footH2" ledeKey="footLede" lede2Key="footLede2" noteKey="footNote" customData={() => (
          <Reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '32px', marginBottom: '24px' }}>
             <div style={card}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: MUTED, marginBottom: '8px' }}>{t.retailCard.tag}</div>
                <div style={{ fontSize: '20px', color: TEXT, marginBottom: '8px' }}>{t.retailCard.qty}</div>
                <p style={{ color: DIM, fontSize: '13px', margin: 0 }}>{t.retailCard.cap}</p>
             </div>
             <div style={card}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: GOLD, marginBottom: '8px' }}>{t.bigCard.tag}</div>
                <div style={{ fontSize: '20px', color: TEXT, marginBottom: '8px' }}>{t.bigCard.qty}</div>
                <p style={{ color: DIM, fontSize: '13px', margin: 0 }}>{t.bigCard.cap}</p>
             </div>
          </Reveal>
        )} />
        <BasicSection t={t} id="candle" eyeKey="candleEye" h2Key="candleH2" ledeKey="candleLede" lede2Key="candleLede2" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={card}>
                <h4 style={{ color: BULL, margin: '0 0 8px', fontSize: '14px' }}>{t.buyerTitle}</h4>
                <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{t.buyerCap}</p>
              </div>
              <div style={card}>
                <h4 style={{ color: BEAR, margin: '0 0 8px', fontSize: '14px' }}>{t.sellerTitle}</h4>
                <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{t.sellerCap}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {t.ratios.map((r, i) => (
                <div key={i} style={{ padding: '8px 16px', background: 'rgba(237,239,242,0.05)', borderRadius: '100px', fontSize: '12px', fontFamily: "'IBM Plex Mono',monospace", color: MUTED }}>
                  {r}
                </div>
              ))}
            </div>
          </Reveal>
        )} />
        <BasicSection t={t} id="smc" eyeKey="smcEye" h2Key="smcH2" ledeKey="smcLede" noteKey="smcNote" customData={() => (
          <Reveal style={{ marginTop: '32px', marginBottom: '24px' }}>
            <p style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6, margin: '0 0 12px 0' }}>{t.smcCap}</p>
            <p style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{t.smcCap2}</p>
          </Reveal>
        )} />
        <BasicSection t={t} id="traps" eyeKey="trapsEye" h2Key="trapsH2" ledeKey="trapsLede" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <TabSet 
              tabs={t.trapTabs.map((lbl, i) => ({ id: `trap-${i}`, label: lbl }))}
              panels={t.trapCaps.map((cap, i) => ({ id: `trap-${i}`, content: <div style={diag}><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{cap}</p></div> }))}
            />
          </Reveal>
        )} />
        <BasicSection t={t} id="patterns" eyeKey="pattEye" h2Key="pattH2" ledeKey="pattLede" lede2Key="pattLede2" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <TabSet 
              tabs={t.pattTabs.map((lbl, i) => ({ id: `patt-${i}`, label: lbl }))}
              panels={[
                { id: 'patt-0', content: <div style={diag}><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px 0' }}>{t.dtCaps[0]}</p><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{t.dtCaps[1]}</p></div> },
                { id: 'patt-1', content: <div style={diag}><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px 0' }}>{t.hsCaps[0]}</p><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{t.hsCaps[1]}</p></div> },
                { id: 'patt-2', content: <div style={diag}><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: '0 0 12px 0' }}>{t.chCaps[0]}</p><p style={{ color: TEXT, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{t.chCaps[1]}</p></div> },
              ]}
            />
          </Reveal>
        )} />
        <BasicSection t={t} id="setup" eyeKey="setupEye" h2Key="setupH2" ledeKey="setupLede" noteKey="setupNote" customData={() => (
          <Reveal style={{ marginTop: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {t.setupSteps.map((s, i) => (
                <div key={i} style={{ ...card, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '16px', color: GOLD, fontWeight: 700, paddingTop: '2px' }}>{s.n}</div>
                  <div>
                    <h4 style={{ margin: '0 0 8px', color: TEXT, fontSize: '15px' }}>{s.title}</h4>
                    <p style={{ margin: 0, color: MUTED, fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={diag}>
              <h4 style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: GOLD, marginBottom: '12px' }}>{t.setupPCH}</h4>
              <p style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{t.setupPCCap}</p>
            </div>
          </Reveal>
        )} />
        <BasicSection t={t} id="risk" eyeKey="riskEye" h2Key="riskH2" ledeKey="riskLede" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {t.riskGroups.map((g, i) => (
                <div key={i} style={card}>
                  <h4 style={{ color: GOLD, margin: '0 0 16px', fontSize: '14px', fontFamily: "'IBM Plex Mono',monospace" }}>{g.title}</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, color: TEXT, fontSize: '14px', lineHeight: 1.6 }}>
                    {g.items.map((item, j) => <li key={j} style={{ marginBottom: '10px' }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p style={{ color: DIM, fontSize: '12px', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>{t.riskDisclaimer}</p>
          </Reveal>
        )} />
        <BasicSection t={t} id="mind" eyeKey="mindEye" h2Key="mindH2" ledeKey="mindLede" lede2Key="mindLede2" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <div style={{ ...diag, marginBottom: '32px' }}>
              {t.routine.map((r, i) => (
                <div key={i} style={{ display: 'flex', padding: '12px 0', borderBottom: i < t.routine.length - 1 ? '1px solid rgba(237,239,242,0.06)' : 'none' }}>
                  <div style={{ width: '100px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '13px', color: GOLD }}>{r.time}</div>
                  <div style={{ color: TEXT, fontSize: '14px' }}>{r.what}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {t.quotes.map((q, i) => (
                <div key={i} style={{ paddingLeft: '16px', borderLeft: `2px solid ${DIM}` }}>
                  <p style={{ color: MUTED, fontSize: '15px', fontStyle: 'italic', margin: '0 0 8px 0' }}>"{q.q}"</p>
                  <p style={{ color: DIM, fontSize: '12px', fontFamily: "'IBM Plex Mono',monospace", margin: 0 }}>— {q.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )} />
        <BasicSection t={t} id="roadmap" eyeKey="roadEye" h2Key="roadH2" ledeKey="roadLede" customData={() => (
          <Reveal style={{ marginTop: '32px' }}>
            <div style={{ padding: '16px', background: 'rgba(232,178,77,0.08)', borderRadius: '8px', border: `1px solid rgba(232,178,77,0.2)`, color: GOLD, fontSize: '14px', marginBottom: '32px' }}>
              <strong style={{ fontFamily: "'IBM Plex Mono',monospace" }}>6-8 MONTHS</strong> {t.roadBannerSub}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={card}>
                <div style={{ color: BULL, fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', marginBottom: '16px' }}>{t.longLabel}</div>
                <ul style={{ paddingLeft: '20px', margin: 0, color: MUTED, fontSize: '13px', lineHeight: 1.6 }}>
                  {t.longTFs.map((tf, i) => <li key={i} style={{ marginBottom: '8px' }}>{tf}</li>)}
                </ul>
              </div>
              <div style={card}>
                <div style={{ color: BEAR, fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', marginBottom: '16px' }}>{t.shortLabel}</div>
                <ul style={{ paddingLeft: '20px', margin: 0, color: MUTED, fontSize: '13px', lineHeight: 1.6 }}>
                  {t.shortTFs.map((tf, i) => <li key={i} style={{ marginBottom: '8px' }}>{tf}</li>)}
                </ul>
              </div>
            </div>

            <div style={diag}>
              <h4 style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: TEXT, marginBottom: '16px' }}>{t.bootLabel}</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0', color: MUTED, fontSize: '14px', lineHeight: 1.7 }}>
                {t.bootRules.map((r, i) => <li key={i} style={{ marginBottom: '8px' }}>{r}</li>)}
              </ul>
              <div style={{ padding: '12px', background: 'rgba(17,21,29,0.5)', borderRadius: '6px', color: TEXT, fontSize: '14px', fontWeight: 500 }}>
                {t.bootFinal}
              </div>
            </div>
          </Reveal>
        )} />

        {/* Footer */}
        <footer style={{ padding: '72px 28px 48px', textAlign: 'center', borderTop: '1px solid rgba(237,239,242,0.09)' }}>
          <div style={{ fontFamily: lang === 'hi' ? "'Noto Sans Devanagari','Outfit',sans-serif" : "'Outfit',sans-serif", fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, maxWidth: '600px', margin: '0 auto 16px', background: 'linear-gradient(135deg,#EDEFF2,#E8B24D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.footerQuote}
          </div>
          <p style={{ color: DIM, fontSize: '13px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>{t.footerSub}</p>
          <a href="#" style={{ display: 'inline-block', marginTop: '32px', fontFamily: "'IBM Plex Mono',monospace", fontSize: '12px', color: MUTED, textDecoration: 'none', border: '1px solid rgba(237,239,242,0.16)', padding: '10px 20px', borderRadius: '100px' }}>{t.backTop}</a>
        </footer>
      </div>
    </>
  )
}
