# Let the auction pick the trade: fifteen volume profile proposals

**Volume profile and auction market theory support fifteen distinct strategies that can be triggered automatically (VP-01 to VP-15), but none of them rests on a tested edge.** They are built to fail cheaply and to be forward-validated, not trusted. In each proposal the profile supplies CONTEXT and LOCATION. A single bar-close price event is the TRIGGER, and confirmed swings appear only as anchors for anchored profiles. Each proposal ships in a clock-time and a constant-volume-bar version, with a state machine and pre-committed defaults. The set covers every profile dimension: session, overnight, weekly, monthly, composite and swing-anchored. It runs from scalps through multi-day swings and covers balance (responsive) and imbalance (initiative) regimes, with one shared value-migration router deciding which proposals may arm. The evidence is thin. The research found no peer-reviewed test of value areas, the 80% rule, naked POCs or HVN/LVN behaviour in futures. The one informal test of the 80% rule saw complete traverses on only **16 of 41 ES triggers (39%)** ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). The support sits one level down, in the general mechanism. Support and resistance levels coincide with peaks in order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). Take-profit orders cluster at salient prices, and stop orders cluster just beyond them ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). Levels that have held tend to hold again, but that tendency fades over time ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)). That support is why every setup here grades C, why the better ones put their LOCATION on a B-grade level, why first targets are the nearer reference (usually a POC) and why every stop sits beyond the obvious level. Begin forward validation with **VP-03, VP-05 and VP-14**. Between them they cover balance, imbalance and the weekly horizon, and they use only final profiles and the clock-time initial balance.

## How this family works, and the rules every proposal shares

### What the family is, and how much the evidence carries

Auction market theory reads each period as an auction. It rotates between balance, where two-sided trade builds accepted value, and imbalance, where price searches for new value ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/); [TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy)). In this family the profile answers two questions: whether value is migrating or overlapping (CONTEXT), and which edge, POC, node or unfinished reference to act at (LOCATION). Price action is allowed only as a TRIGGER, such as a close back inside value or a small CHoCH on a lower layer. Swings are allowed only as anchors of ANCH(A→B) profiles. Fibonacci is not used; it belongs to [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md) and [11 Proposals confluence](11%20Proposals%20confluence.md).

Three of the brief's candidates were merged to keep the list honest:

- **HVN mean reversion inside balance** is the same trade as a value-edge fade. It lives inside VP-03 at session scale and VP-12 at composite scale.
- **Naked POCs and poor highs/lows** share one trade template and differ only in what the target is called, so together they form VP-10.
- **Value migration** became the shared router below rather than a standalone trade. VP-14 is its swing-scale expression.

The research found no peer-reviewed test of Market Profile value areas, the 80% rule, naked POCs or HVN/LVN behaviour in ES, NQ or CL, and practitioner sources publish no out-of-sample results ([NexusFi, 80% Rule](https://nexusfi.com/a/concepts/80-percent-rule)). The only count of a named rule comes from an informal ES test from 2008. It found that the 80% rule filled the whole value area on 16 of 41 triggers (39%), or 16 of 40 when the periods had to be consecutive (40%). Its author called the sample "far from an extensive sample size" ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)).

The credible evidence concerns the mechanism, not the setups:

- Support and resistance coincide with limit-order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)).
- Take-profit orders cluster at round numbers and stop-losses just beyond them. That pattern explains both reversals at levels and faster moves after breaks ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)).
- Intraday levels that have bounced before are more likely to bounce again, and the probability decays over time ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)).

The effects are small. In Osler's FX test, levels published by dealers interrupted trends **60.8%** of the time, against **56.2%** for arbitrary levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). TradingView itself calls the volume profile reactive: a record of past activity, not a forecast ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

Grades follow the policy set in [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md). Profile levels used as LOCATIONs earn **B**, every setup built on them is **C**, and the "80%" headline is **D**. No proposal earns A. The peer-reviewed work supports support/resistance and order clustering in general, not profile levels in futures. The tag "location B" marks the proposals whose LOCATION is a final POC, value-area edge or HVN, the better-supported kind of level. [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) explains the role logic.

### Profile engine assumptions

One engine and one value-area method serve every proposal, the review chart and the decision log. PROFILE(P) is volume-at-price at 1-tick rows, built from Rithmic `LastTrade` prints. Template 150 carries `tradePrice`, `tradeSize` and an aggressor flag, BUY=1/SELL=2. Prints flagged `isSnapshot` come from the database, not the exchange, and are dropped ([Rithmic/protos.json](../../Rithmic/protos.json); [07 Automation architecture](07%20Automation%20architecture.md)).

The POC and value-area rules are Sierra Chart's:

- POC ties go to the row nearest the profile's middle, then to the lower row.
- The 70% value area starts at the POC and adds the larger adjacent row, carrying the other forward. Tied rows are both included. Expansion stops once the total reaches or exceeds 70% ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)).

Vendors disagree. TradingView stops before exceeding 70% and breaks ties toward the POC, then upward. The Linnsoft/CBOT "Method A" adds two rows at a time. VAH and VAL can therefore sit a tick or more apart on identical data ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/); [Linnsoft TPO](https://www.linnsoft.com/tpo)). The review chart must be the engine's own rendering, or Sierra Chart with 1-tick rows and a volume-based 70% value area.

**Seeding** uses `RequestVolumeProfileMinuteBars` (208, response 209). Each minute carries per-price arrays (`profilePrice`, `profileBidVolume`, `profileAskVolume`, `profileNoAggressorVolume`), so summed history is exact at each price rather than smeared across bar ranges ([Rithmic/protos.json](../../Rithmic/protos.json)). Size matters here:

- A Globex day is about 1,380 minute bars, a week about 6,900 and a month about 30,000.
- That is above the Rithmic guide's hint that a round-number reply such as 10,000 may be truncated.
- Seeding therefore pages by time window and checks for missing minutes ([07](07%20Automation%20architecture.md)).

Profiles built from bars are a last resort. Sierra notes that coarse records spread each bar's volume evenly over its range ([Sierra Chart Volume by Price](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)), and that smearing fills in exactly the LVNs several proposals need. Profiles and volume bars come from the full-size contract (ES, NQ, CL) even when orders go to MES, MNQ or MCL ([07](07%20Automation%20architecture.md)).

**Time-defined items** use clock-time M30 sub-periods built from ticks, starting at the RTH open. These are the IB, the 80% rule's half-hours, single prints, poor highs/lows and open types. **Liquidity-defined items** use volume: POC, VA, HVN/LVN and nPOC. That split follows [03](03%20Volume%20profile%20across%20timeframes.md).

**Sessions.** ETH is the Globex session, Sunday–Friday 17:00–16:00 CT, with a 16:00–17:00 CT maintenance halt ([CME ES contract specs](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html)). RTH is a convention, not a CME fact; both RTH windows below must be confirmed against the feed's session template:

| Instrument | RTH | ON window |
|---|---|---|
| ES, NQ | 08:30–15:00 CT (cash-session convention) | 17:00 CT to the RTH open |
| CL | 08:00–13:30 CT (pit-session convention) | 17:00 CT to the RTH open |

T0 denotes the RTH open, RTHO the first RTH trade price (not DO, the 17:00 CT Globex open) and TC the RTH close. Every proposal declares which session its profile uses.

**Notation.** PROFILE(P)[-k] is the k-th most recent completed profile of type P, and its values are final. PROFILE(P)[0] is the developing profile. Any rule that reads [0] logs the value it used together with its `as_of` event sequence number, because the end-of-session value a reviewer sees later will differ ([07](07%20Automation%20architecture.md)).

**Nodes.** HVN/LVN come from the shared `nodes(H, sigma(P))` detector:

- Gaussian smoothing with σ = 3 ticks for one-session profiles and round(3·√sessions) ticks for longer ones.
- HVN prominence of at least 0.3 × the maximum.
- An LVN valley of at most 0.35 × the smaller neighbouring peak, with an HVN on both sides.
- Node zones measured as the width at half relative height.

The 0.3 prominence follows a reference implementation whose author calls it "only a starting point" ([Minh, Medium](https://metaminh.medium.com/how-to-analyze-volume-profiles-with-python-3166bb10ff24)). If [03](03%20Volume%20profile%20across%20timeframes.md) or [07](07%20Automation%20architecture.md) revise these values, they win.

**Composites and rolls.** COMP sums stored per-session histograms. At the quarterly roll, histograms from the old contract are shifted by the logged roll spread and flagged pre-roll. No proposal located on WEEK, MONTH or COMP levels takes new entries in roll week (design proposal).

### Volume bars, and what stays on clock time

VB-A, VB-B and VB-C are constant-volume bars of ADV/50, ADV/250 and ADV/1000 of the full-size contract's 20-session average daily volume:

- VB-C is rounded first and the others derived from it as 4× and 20×, so the tiers nest exactly.
- Sizes are recalibrated weekly.
- Large prints are split so every bar holds exactly V contracts.
- Every tier breaks at the Globex session start ([05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md); [07](07%20Automation%20architecture.md)).

Sierra Chart documents both the split option and the requirement for "New Bar at Session Start" with Volume Per Bar ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). The 1/50 size is the sampling that partially restored normality for E-mini S&P returns ([Volume Clock](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)).

Averaged over a 23-hour Globex day, the tiers run about **28, 5.5 and 1.4 minutes per bar**. RTH bars form much faster and overnight bars much slower ([05](05%20Volume%20bars%20versus%20time%20bars.md)). The working pairings are therefore VB-A beside M15/M30, VB-B beside M5 and VB-C beside M1. Because every bar holds the same volume, bar range measures price impact per contract and bar duration measures urgency. VP-08 and VP-09 rely on exactly that.

Volume time cannot be converted back into clock time in advance. In every volume-bar version, the following therefore stay on the clock:

- profile periods
- the IB
- opening ranges and the open itself
- M30 acceptance periods
- W1, D1 and H4 bars
- news windows
- flat-by-time rules

Three handling rules follow from that:

- The VB that straddles T0 mixes overnight and RTH prints and is never a trigger bar. The first eligible RTH trigger bar opens at or after T0.
- No trigger may fire on a VB that took more than 30 minutes to form ([07](07%20Automation%20architecture.md)).
- The shared ladder has no volume-bar equivalent of H1 or H4. Swing proposals keep those layers on the clock and use VB-A as a finer trigger, which fires earlier and more often.

### Common rules for every proposal

Every rule, threshold and default in the proposals is a **design proposal**, pre-committed from the research notes and the series' shared documents. None was sourced as a tested value or optimized. Cited facts carry links. The fences below come from [07](07%20Automation%20architecture.md) and apply to the whole family.

| Rule | Pre-committed default | Basis |
|---|---|---|
| Risk unit | 1R is a fixed dollar amount set by the user. `qty = floor(R_usd / ((stop_ticks + 2) × tick_value))`, with 2 ticks of slippage allowance. **Skip if qty < 1 micro** rather than widen the stop | [07](07%20Automation%20architecture.md); the slippage allowance is a design default |
| Tick values | MES $1.25, ES $12.50, MNQ $0.50, NQ $5.00. CL/MCL are read at startup from the contract spec, not hardcoded | [07](07%20Automation%20architecture.md) |
| Stop floor | The structural stop each proposal states, widened if needed to at least 1.0 × ATR(TRIGGER layer) | [07](07%20Automation%20architecture.md) |
| Stop buffer | BUF(L) = max(2 ticks, 0.15 × ATR(L)) | Inside the notes' 1–2 tick / 0.1–0.25 ATR range ([07](07%20Automation%20architecture.md)) |
| Daily fences | 2R daily loss, then no new entries until the next trade date. At most 3 trades per instrument. 3 consecutive losses stop the day. 3 fills of one proposal in a session disable it until a human re-enables it | [07](07%20Automation%20architecture.md); FIA's repeated-execution control |
| Weekly fence | 4R (2× daily) | [07](07%20Automation%20architecture.md) |
| One position per instrument root | Both brokers net positions per contract, and ES and MES (likewise NQ/MNQ, CL/MCL) carry the same risk, so they count as one root. While a position is open, a signal from any other proposal on the same root is logged, not traded | Design default |
| News blackout | No new entries from T−10 to T+30 minutes around the FOMC statement, CPI, NFP and, for CL, the EIA petroleum report. Armed entries are cancelled. Scalps (VP-03, VP-04, VP-08, VP-09) are flattened at T−2. On volume bars, entries resume only after T+30 **and** 20 VB-B bars | [07](07%20Automation%20architecture.md) blackout; CPI dates still need loading; the scalp flatten is a design default |
| Session filters | No entries from 16:00 to 17:00 CT, in the 15 minutes after the 17:00 CT reopen, or in the 15 minutes before 15:00 and 16:00 CT, unless a proposal is an opening setup by design. Intraday trades are flat by TC − 5 minutes, with 07's 15:50 CT broker-side flatten as backstop | [07](07%20Automation%20architecture.md) |
| Swing holding | Until Stage 0 shows that broker-held brackets survive the maintenance halt and the weekend, multi-session proposals (VP-12, VP-13, VP-14) run signal-only or attended | [07](07%20Automation%20architecture.md) §6 |
| Short sessions | A holiday or early-close session is flagged `short`. Proposals that read "the prior RTH profile" skip the following day | Design default |
| Volatility band | New entries only while ATR(D1) is between 0.6× and 2.0× its 100-session median | Design default: dead tape makes rotations worthless, and crisis tape gaps through levels |
| Bar-close evaluation | Triggers fire only on closed bars. Higher layers are read with `asof(L, t)`. Swings may be used only after `confirm_ts`. A VB closes on its completing print | [07](07%20Automation%20architecture.md) §2.12, §5 |
| Orders | Fades: limit at the level or the trigger close, with expiry. Breakouts: stop-limit with limit offset SLIP(L) = max(2 ticks, 0.1 × ATR(L)). Every entry carries an expiry (`cancelAfterSecs` / GTD). The broker-held bracket goes out with the entry. Orders are marked automated. Resting orders are re-quoted only at a TRIGGER-layer close and only after a move of at least 2 ticks | [07](07%20Automation%20architecture.md) §6 |
| Targets | Exit limits sit 1 tick in front of the target level, because take-profit orders cluster at salient prices | [Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html) |
| Decision log | One record per state transition, using 07's schema. `levels_used` carries `status: final/developing` and `as_of_seq`, plus the VA-method ID, the VB size set and the router state | [07](07%20Automation%20architecture.md) §5 |

Every proposal uses 07's state set: IDLE → ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED, with terminal EXPIRED, INVALIDATED, REJECTED, CANCELLED and ERROR. MANAGED is entered once the bracket legs are confirmed working. This file adds one marker inside MANAGED: `post_T1`, meaning T1 has filled and the stop has moved to breakeven. `setup_id = hash(strategy_version, proposal_id, level_id, arming_bar_id)` doubles as the broker order tag. `strategy_version` reads like `VP-03@v1`.

### The shared router and the helper names used in the pseudocode

The pseudocode uses the series' shared names: ATR(L), SWING(L), STRUCTURE(L), BOS/CHoCH, LEVELS, PROFILE(P), POC, VAH/VAL, dPOC, HVN/LVN, nPOC, `asof`, `developing`, `accepted_beyond` and `nodes`. It adds the file-local helpers below, all of them design proposals.

| Helper | Definition |
|---|---|
| `VALUE_REL(cur, prev)` | With tolerance tol = 0.1 × ATR(L_P), where L_P is M30 for RTH and D1 for WEEK/MONTH: **HIGHER** if cur.VAL > prev.VAH + tol; **OVERLAP_UP** if cur.VAH > prev.VAH + tol and cur.VAL lies within [prev.VAL − tol, prev.VAH + tol]; **INSIDE** if cur.VAH ≤ prev.VAH + tol and cur.VAL ≥ prev.VAL − tol; **OUTSIDE** if it is wider on both sides; **OVERLAP_DOWN** and **LOWER** mirror the first two |
| `REGIME(D)`, `REGIME(W)` | From the last two completed RTH profiles (D) or WEEK profiles (W). **IMB_UP**: HIGHER, or OVERLAP_UP with [-1].POC > [-2].VAH. **TENT_UP**: any other OVERLAP_UP, where the POC is still anchored in old value ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/)). **BALANCE**: INSIDE. **EXPANSION**: OUTSIDE, where 03 says to stand aside until a new edge is accepted. TENT_DOWN and IMB_DOWN mirror the up states |
| `OPEN_TIER(RTHO, P)` | Against P = PROFILE(RTH)[-1] and PDH/PDL: **IN_VALUE**, **OUT_VALUE** (outside the VA but inside the prior range) or **OUT_RANGE**, each with a side, ABOVE or BELOW ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)) |
| `OPEN_TYPE()` | Evaluated once at T0+30 from ticks, using 03's placeholders: k = 0.25 × ATR(M5), p = 0.5 × ATR(M5), m = 1.0. **OD(d)**: no trade back through RTHO by more than k, OR30 ≥ m × its 20-session median, and every M5 close on the d side of RTH VWAP. **OTD(d)**: a probe of at least p against d inside the first 15 minutes, then a cross of RTHO and a trade beyond the pre-probe extreme in d; the probe extreme is stored. **ORR(d)**: a run of at least p against d, then a cross back through RTHO by at least k in d, with the run's extreme intact. **OA**: at least two crosses of RTHO by k or more, and none of the above. Otherwise **UNCLASSIFIED**. Precedence is OD > OTD > ORR > OA |
| `accepted_beyond(level, d)` | 03's acceptance function: at least 2 RTH M30 closes beyond the level since the first cross, and at least 15% of RTH volume since the first cross printed beyond it. Two M30 periods are about 15% of a 6.5-hour session, so the volume floor asks for at least average participation beyond the level |
| `CLOSE_BACK(L, level, d, n)` | A bar on layer L closes back on the original side of `level` by at least 1 tick, after a trade beyond it by at least 1 tick within the last n bars of L, with fewer than n closes beyond in between |
| `REFS` and `REF_BEYOND(x, d, rr_min, max_dist)` | REFS is the reference set: PDH/PDL/PDC, ONH/ONL, PWH/PWL/PWC, POC/VAH/VAL of PROFILE(RTH)[-1], PROFILE(WEEK)[-1] and PROFILE(MONTH)[-1], and live nPOCs. REF_BEYOND returns the nearest member beyond x in direction d that meets the reward-to-risk floor and lies within max_dist |
| `rr(target)` | abs(target − entry) / abs(entry − stop) |
| `floor_stop(price, ATR(L))` | The stated structural stop, moved further from the entry if needed so the stop distance is at least 1.0 × ATR(L) of the TRIGGER layer (07's stop floor) |
| `COMP(balance)` | Extends COMP(n weeks) to a balance anchor. Take the longest run of consecutive completed RTH sessions ending at [-1] in which each session's VALUE_REL to its predecessor is INSIDE, OUTSIDE, OVERLAP_UP or OVERLAP_DOWN. Use at least 3 and at most 20 sessions (if longer, the last 20). The RTH histograms of that run are summed. Its profile high and low are the balance edges BH and BL. Today's developing session is never included. This follows the notes' "composite over a balance area, anchored at the start of the current balance" |

Each proposal's own CONTEXT filter is authoritative. The table only summarizes which proposals the router lets arm in each state.

| Router state at decision time | May arm | Blocked |
|---|---|---|
| Open OUT_VALUE or OUT_RANGE, OPEN_TYPE = OD or OTD away from value | VP-02, then VP-05, VP-06 and VP-10 in the drive direction | VP-01, VP-03, VP-04; VP-08 against the drive |
| Open OUT_VALUE or OUT_RANGE, no drive away from value | VP-01; VP-04 until T0+30 if OUT_VALUE | VP-02 |
| Open IN_VALUE, no OD or OTD | VP-03; VP-04 until T0+30; VP-11 | VP-02 |
| REGIME(D) is IMB or TENT in direction d | VP-05 and VP-15 in d; VP-06, VP-07, VP-08, VP-09, VP-10 and VP-11 (both branches) unless against d | VP-03 when IMB |
| REGIME(D) is BALANCE or EXPANSION | VP-03 (BALANCE only); VP-05 with the IB-side tiebreak; VP-06, VP-07, VP-08, VP-09, VP-10; VP-11 FILL | VP-15; VP-11 HOLD |
| COMP(balance) of at least 3 sessions exists | VP-12, VP-13 | — |
| REGIME(W) is IMB in direction d | VP-14 in d; VP-13 in d | VP-12 fades of probes in direction d |

## The fifteen proposals at a glance

| ID | Name | Style | Profile(s) | Stack: time / volume | Regime | Evidence | Complexity |
|---|---|---|---|---|---|---|---|
| VP-01 | Value-area re-entry traverse ("80% rule") | Intraday | RTH[-1] | M30 / M30 + VB-B variant | Rejected outside open returning to balance | C (headline D; location B) | Med |
| VP-02 | Open-drive acceptance away from value | Intraday | RTH[-1], RTH VWAP | M1 classifier · M30 / VB-A | Imbalance | C | High |
| VP-03 | Inside-open value-edge fade | Scalp | RTH[-1] | M30 · M5 / VB-B | Balance | C (location B) | Low |
| VP-04 | Overnight inventory correction | Scalp | ON[-1], RTH[-1] | M5 / VB-B | Transition at the open | C | Med |
| VP-05 | IB extension with value migration | Intraday | RTH[-1], RTH[-2], IB | M30 · M5 / VB-B | Imbalance | C (location B) | Low |
| VP-06 | dPOC-trailed trend-day hold | Intraday | RTH[0] dPOC, RTH[-1] | M30 / VB-A | Imbalance | C | Med |
| VP-07 | Breakout-leg LVN hold | Intraday | ANCH on M15, RTH[-1] | M15 · M5 / VB-A · VB-B | Imbalance (fresh breakout) | C | High |
| VP-08 | Valentini-style trend model (LVN + aggressor delta) | Scalp | ANCH on M5, COMP(balance) / WEEK target | M5 · M1 / VB-B · VB-C | Imbalance toward a prior balance | C | High |
| VP-09 | LVN air-pocket traverse | Scalp | COMP(2 weeks, ETH) | M1 / VB-B | Imbalance or transition | C | High |
| VP-10 | Unfinished-auction magnet run (nPOC, poor extremes) | Intraday | nPOC of RTH/WEEK/MONTH; RTH[-1..-2] poor extremes | M30 · M5 / VB-B | Initiative | C | Med |
| VP-11 | Single-print hold or fill | Intraday | RTH[-1..-5] single prints | M30 · M5 / VB-B | Either; the branch is set by acceptance | C | High |
| VP-12 | Composite look-above/below-and-fail | Swing | COMP(balance) | D1 · M30 / VB-A | Balance | C (location B) | Med |
| VP-13 | Composite balance breakout with daily acceptance | Swing | COMP(balance), RTH[-1] | D1 · H1 / VB-A | Balance to imbalance | C (location B) | Med |
| VP-14 | Weekly value-migration VAL buy | Swing | WEEK[-1], WEEK[-2], MONTH[-1] | W1 · D1 · H4 / VB-A | Imbalance | C (location B) | Low |
| VP-15 | Anchored impulse-leg POC pullback | Intraday | ANCH on M15 | M15 · M5 / VB-A · VB-B | Imbalance | C (location B) | High |

## VP-01 Value-area re-entry traverse (the "80% rule")

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 30 min – 3 h | ES/MES, NQ/MNQ, CL/MCL | Transition: a rejected outside-value open returning to the prior balance | C with the POC target; the "80%" headline is D; location B | Med |

**Concept basis.** When the RTH session opens outside the prior session's value area, re-enters it and holds, the rule expects a traverse to the opposite edge. The usual confirmation is two 30-minute brackets inside value ([MetroTrade](https://www.metrotrade.com/what-is-the-80-rule-in-futures-trading/); [LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/)). Sources disagree on the details. *Mind Over Markets* reportedly does not require the two half-hour periods to be consecutive. Some practitioners require closes inside, and some require the whole bar inside ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)).

The only test found contradicts the name. In 119 ES day sessions from April 2008, 76 opened outside the prior value area and 41 met the two-period condition. Only **16 of those 41 (39%) filled the whole value area**. With consecutive periods the figure was 16 of 40 (40%), and three of the fills came through single prints ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). That fixes the design. The prior POC, roughly halfway across, is T1 and takes half the position. The opposite edge is a runner that should be expected to fail more often than not.

The mechanism is credible but indirect. The prior value area is where yesterday's two-sided trade concentrated, the kind of location where book depth and take-profit orders are documented to cluster ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html); [Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). Definitions and the count are in [03](03%20Volume%20profile%20across%20timeframes.md).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | PROFILE(RTH)[-1] and OPEN_TIER at T0; OPEN_TYPE at T0+30 | Same (clock) |
| LOCATION | Entry-side edge E of PROFILE(RTH)[-1]: VAL if the open is below value, VAH if above | Same |
| SETUP | Consecutive RTH M30 periods that trade inside the VA and close inside | Same M30 periods (clock) |
| TRIGGER | Close of the second qualifying M30 period | Same close; a logged signal-only variant enters on the first VB-B close back inside after a retest of E |
| MANAGEMENT | Thesis exit on an M30 close outside the VA; broker-held bracket | Same |

Stays on clock time in both versions: the prior RTH profile, T0, the M30 periods and the setup deadline. The rule is defined in half-hours, so volume bars change only the logged retest variant.

**Context filter.** OPEN_TIER(RTHO) is OUT_VALUE or OUT_RANGE, and RTHO is at least BUF(M30) outside the VA. OPEN_TYPE at T0+30 must not be OD or OTD away from value; that day belongs to VP-02.

**Location.** The entry-side edge E.

**Setup.** The first RTH M30 period that trades inside the VA and closes inside it arms the setup. A following period that does not qualify resets the count. Consecutive periods are the default. The non-consecutive reading is a separately versioned variant, and the 2008 test found little difference (39% vs 40%).

**Trigger.** The close of the second consecutive qualifying M30 period. It must come no later than T0 + 4 h (12:30 CT for ES/NQ), and rr(T1) must be at least 1.0 after the stop floor is applied.

**Entry order.** Limit at the trigger close ± SLIP(M30), toward the trade, valid 60 seconds. If unfilled, the setup EXPIRES.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | E − BUF(M30) for a long, E + BUF(M30) for a short, broker-held and widened to the 1.0 × ATR(M30) floor if needed. Thesis exit at market on any M30 close back outside the VA on the entry side |
| Sizing | Common R rule |
| T1 / T2 | T1: PROFILE(RTH)[-1].POC, 1 tick in front, 50%. T2: the opposite VA edge, 1 tick in front, 50% |
| Breakeven / trail / time | Stop to breakeven when T1 fills. Time stop after 6 M30 periods in the trade, or TC − 5 min |
| Cancel / invalidation | Deadline passes before the trigger → EXPIRED. Drive away at T0+30 → CANCELLED. A blackout begins → CANCELLED |

**Filters.** RTH only. Setup window T0+30 to T0+4 h. Common news, volatility and short-session rules apply. At most one attempt per day.

**Automation spec.**
- IDLE → ARMED on the first qualifying period.
- ARMED → IDLE when a period does not qualify.
- ARMED → ORDER_PENDING on the second qualifying close.
- ORDER_PENDING → IN_POSITION on the fill → MANAGED once the brackets are confirmed.
- MANAGED → CLOSED on T2, the stop, the thesis exit or the time stop.
- IDLE or ARMED → EXPIRED at the deadline. Any non-terminal state → CANCELLED on a drive away or a blackout.

```
on T0:      P = PROFILE(RTH)[-1]; tier = OPEN_TIER(RTHO, P)
            if tier == IN_VALUE or dist(RTHO, P.VA) < BUF(M30): done_for_day
            side = LONG if tier.side == BELOW else SHORT
            E = P.VAL if side == LONG else P.VAH;  q = 0
on T0+30:   if OPEN_TYPE() in {OD, OTD} away from value: CANCELLED("drive away")
on M30 close (RTH, t <= T0+4h):
            if traded_inside(bar, P.VA) and P.VAL <= bar.c <= P.VAH: q += 1
            else: q = 0; if state == ARMED: state = IDLE
            if q == 1: state = ARMED                     # log P values (final) and q
            if q == 2:
                stop = floor_stop(E -/+ BUF(M30), ATR(M30))
                if rr(P.POC) >= 1.0:
                    send limit(bar.c +/- SLIP(M30), ttl=60s) with bracket(stop,
                         targets=[P.POC -/+ 1 tick (50%), opposite_edge(P) -/+ 1 tick (50%)])
on M30 close in position: if bar.c outside P.VA on entry side: exit_market("thesis")
on T1 fill: move stop to entry
```

| Parameter | Default | Reason |
|---|---|---|
| Profile and session | PROFILE(RTH)[-1], RTH | The rule is defined on prior-day session value |
| Value area | 70%, Sierra single-row | Engine standard |
| Minimum outside distance | BUF(M30) | Excludes trivial one-tick "outside" opens |
| Qualifying period | Trades inside and closes inside | 03's synthesis of the conflicting variants |
| Consecutive | true | Cleaner reset; the test shows 40% vs 39%, so little is lost |
| Setup deadline | T0 + 4 h | Leaves at least 2.5 h of RTH for the traverse |
| Entry | Trigger close ± SLIP(M30), 60 s | Canonical close entry with bounded slippage |
| Logged variant | Limit 1 tick inside E, valid 60 min, signal-only | The notes' "retest" alternative, compared without trading it |
| T1 / T2 split | POC 50% / opposite edge 50% | The 39–40% full-traverse count |
| Minimum rr(T1) | 1.0 | Skips setups where the POC is too close to pay |
| Time stop | 6 M30 periods | A traverse that stalls for 3 h has lost its premise |
| Max attempts | 1 per day | The rule fires once per open |

**Visual review checklist.**
1. Load the prior RTH volume profile (1-tick rows, 70% volume VA, Sierra method). Confirm that the logged POC, VAH and VAL match the drawn lines to the tick.
2. Confirm that RTHO, the first RTH print, sits outside the VA by at least the logged margin.
3. On an M30 chart anchored at T0, find two consecutive periods that traded inside and closed inside. The entry belongs at the second close.
4. On a 1–5-minute chart, confirm the first 30 minutes were not a drive away from value.
5. Check the stop beyond E by the logged buffer or ATR floor, T1 one tick in front of the prior POC and T2 one tick in front of the opposite edge.

Bot errors to look for:
- Today's developing VA used as if final.
- An ETH or 24-hour profile used instead of RTH.
- A period counted that closed outside.
- M30 periods anchored to the clock hour instead of T0, which matters for CL's 08:00 CT open.
- A value area drawn with TradingView's method, whose one-tick differences change whether a period "closed inside".

**Failure modes & regime fit.** It works best when an outside open is rejected and the session rotates (normal and normal-variation days). It fails when the re-entry is only a pullback inside a trend day, when news drives the open, and when the prior VA is so wide that the traverse needs more time than the session has. Expect most triggers not to complete the traverse. The edge, if any, lives in the T1 leg.

**Relations.** The router makes it exclusive with VP-02 on the same open. It shares the "back to value" thesis with VP-12 at composite scale, so only one of them may act on one excursion. If the prior POC is naked, T1 coincides with a VP-10 target; VP-10 must not stack a second position on it. It serves as the session-scale balance reference that PA-family triggers and CX-family location filters can reuse.

## VP-02 Open-drive acceptance away from value

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 1 h – to the close | ES/MES, NQ/MNQ, CL/MCL | Imbalance: out-of-value open with conviction | C | High (open-type classifier) |

**Concept basis.** Open location is read in three tiers: inside value, outside value but inside the prior range, and outside the range. Inside-value opens favour rotation, while an out-of-range open plus a drive is "the strongest continuation read" ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)). The two drive types differ:

- In an **open-drive** (OD), price moves away from the first prints and never trades back through the open, which becomes a "do not revisit" reference.
- In an **open-test-drive** (OTD), a probe finds no business and price drives the other way. The rejected probe extreme becomes the stop reference.

Conviction opens tend to hold one side of session VWAP ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)). The taxonomy is Dalton's, from *Mind Over Markets* (1990) ([therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive)). There is "no reliable published win rate for the opening drive" ([therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive)), and per-open-type probabilities that circulate online cite nothing ([NexusFi, Open type classification](https://nexusfi.com/a/concepts/open-type-classification)).

Indirect support is real but small. In SPY from 1993 to 2013, the first half-hour return, measured from the prior close, predicted the last half-hour return with an R² of about 1.6% ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). An out-of-range open also sits beyond prior-day extremes, where stop clusters plausibly accelerate moves ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). On trend days "the trade is with the extension" ([therighttrader, Trend Day](https://therighttrader.com/learn/trading-strategies/trend-day)). The classifier thresholds are 03's placeholders ([03](03%20Volume%20profile%20across%20timeframes.md)). The classification window stays on the clock for the reasons given in [05](05%20Volume%20bars%20versus%20time%20bars.md).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | PROFILE(RTH)[-1], PDH/PDL, OPEN_TIER at T0, REGIME(D) | Same (clock) |
| LOCATION | RTHO (OD) or the probe extreme (OTD) as the do-not-revisit line; OR30 extremes | Same (clock) |
| SETUP | OPEN_TYPE from ticks and M1/M5 over [T0, T0+30) | Same (ticks, clock window) |
| TRIGGER | The [T0, T0+30) M30 bar closes in the half of OR30 nearest the drive | First VB-A close at or after T0+30 that lies in the drive half of OR30 |
| MANAGEMENT | After T1, trail under each completed M30 period (TPO bracket) | Same M30 bracket trail (clock) |

Stays on clock time in both versions: T0, the 30-minute classification window, OR30 and its 20-session median, the RTH VWAP anchor, the M30 brackets and the T0+60 entry expiry.

**Context filter.** OPEN_TIER is OUT_VALUE or OUT_RANGE. OPEN_TYPE is OD(d) or OTD(d), with d pointing away from value. REGIME(D) is not IMB against d.

**Location.** The line the trade must not revisit: RTHO for OD, the probe extreme for OTD.

**Setup.** Classification at T0+30.

**Trigger.** The TRIGGER-layer close lies in the half of OR30 nearest d. If price has already fallen back into the half nearest the open, the setup is CANCELLED.

**Entry order.** Limit at trigger close − 0.25 × OR30 for longs (+ for shorts), valid until T0+60 (09:30 CT ES/NQ). If unfilled it EXPIRES, and the day passes to VP-05.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | OD: RTHO − BUF(M30). OTD: probe extreme − BUF(M30). Mirrored for shorts and subject to the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | T1 (50%): REF_BEYOND(OR30 extreme, d, rr ≥ 1.0, within 3R); if none qualifies, 1.5R. T2: runner on the M30 bracket trail |
| Breakeven / trail / time | Stop to breakeven when T1 fills. Then, at each M30 close, the stop ratchets to the low of the last completed M30 period − 1 tick (high + 1 tick for shorts). Flat by TC − 5 min |
| Cancel / invalidation | A trade back through RTHO by k or more before the fill → INVALIDATED, because the OD premise is gone. T0+60 without a fill → EXPIRED |

**Filters.** RTH only, with an entry window of T0+30 to T0+60. This is an opening setup by design, so the "first 15 minutes" filter does not apply. NFP and CPI print at 07:30 CT, and their blackout ends before T0, so VP-02 runs on those days. Common volatility band. At most one attempt per day.

**Automation spec.**
- IDLE → ARMED at T0+30 if the context holds.
- ARMED → ORDER_PENDING on a trigger close in the drive half.
- ARMED → CANCELLED if the trigger close is outside the drive half.
- ORDER_PENDING → IN_POSITION → MANAGED → CLOSED.
- ARMED or ORDER_PENDING → INVALIDATED on a trade through RTHO by k.
- ORDER_PENDING → EXPIRED at T0+60.

```
on T0+30:
  P = PROFILE(RTH)[-1]; tier = OPEN_TIER(RTHO, P); d = UP if tier.side == ABOVE else DOWN
  ot = OPEN_TYPE()
  if tier == IN_VALUE or ot not in {OD(d), OTD(d)} or REGIME(D) == IMB(-d): done_for_day
  ref = RTHO if ot == OD(d) else ot.probe_extreme;  state = ARMED
on trigger close (M30 ending T0+30 | first VB-A closing >= T0+30):
  if not in_drive_half(bar.c, OR30, d): CANCELLED("faded into open half")
  entry = bar.c -/+ 0.25*OR30;  stop = floor_stop(ref -/+ BUF(M30), ATR(trigger L))
  T1 = REF_BEYOND(OR30.extreme(d), d, rr_min=1.0, max_dist=3R) or entry +/- 1.5R
  send limit(entry, expire=T0+60) with bracket(stop, T1 50%, runner 50%)
on any trade beyond RTHO by >= k against d while ARMED/ORDER_PENDING: INVALIDATED
on M30 close while post_T1: stop = ratchet(last_completed_M30.low - 1 tick)     # mirror for shorts
```

| Parameter | Default | Reason |
|---|---|---|
| k, p, m | 0.25 × ATR(M5), 0.5 × ATR(M5), 1.0 × median OR30 (20 sessions) | 03's placeholders; scale-free across instruments |
| VWAP rule | All M5 closes on the drive side (OD); last two (OTD) | LuxAlgo's conviction cross-check, made explicit |
| Window | 30 min | The classification horizon in the source |
| Pullback | 0.25 × OR30 | Limits entry slippage after a drive while leaving most drives fillable; logged non-fills show the cost |
| Entry expiry | T0+60 | After the IB completes, VP-05 owns the day |
| Stop reference | RTHO (OD) or probe extreme (OTD) | The source's own invalidation references |
| T1 | First REFS level with rr in [1.0, 3.0], else 1.5R | A profile reference where one exists; a fixed fallback otherwise |
| Trail | M30 bracket low/high | TPO-native trailing that uses no swing structure |
| Max attempts | 1 per day | One open per day |

**Visual review checklist.**
1. Draw the prior RTH VA, PDH/PDL and RTHO. Confirm the open tier.
2. On a 1–5-minute chart of the first 30 minutes, check that price never traded back through RTHO by more than k (OD), or that the probe met p and price then exceeded the pre-probe extreme (OTD).
3. Overlay RTH VWAP (anchored at T0, not at 17:00 CT) and check the drive side.
4. Check the entry limit at 0.25 × OR30 back from the trigger close, the stop beyond RTHO or the probe extreme, and T1 at the logged reference.
5. After T1, check that the stop stepped only at M30 closes.

Bot errors to look for:
- The 17:00 CT Globex open used as "the open".
- An ETH-anchored VWAP.
- An OR30 median polluted by half-day sessions.
- The VB that straddles T0 used as the trigger.
- Classification run before the window closed.

**Failure modes & regime fit.** It fits trend and normal-variation days that start outside value. It fails on drives that run straight into a higher-dimension edge (a weekly VAH or a COMP balance high, where VP-12 lives), on news-fuelled opens that exhaust within the hour, and on late open-rejection-reverse sessions that turn around near the IB end. OTD classification is the noisiest part of the rule.

**Relations.** The router excludes VP-01, VP-03 and VP-04 on the same open. VP-05, VP-06 and VP-10 often follow in the same direction, so treat them as one risk unit. Its T1 is often a VP-10 target. If the drive pierces a COMP edge and then fails, VP-12 arms only after an M30 close back inside, which contradicts this trade's premise. One-position-per-instrument settles the sequence. CX-family proposals can filter VP-02 with higher-timeframe locations.

## VP-03 Inside-open value-edge fade

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Scalp | 5 – 90 min | ES/MES, NQ/MNQ, CL/MCL | Balance | C; location B | Low |

**Concept basis.** An inside-value open implies overnight agreement and favours rotation ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)), and rotational days favour fading value-area edges ([LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/)). The prior value area is where both sides transacted heavily. Support and resistance levels coincide with order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)), take-profit orders cluster at salient levels with stops just beyond ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)), and levels lose strength with age ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)). That is the case for the prior session's edges as LOCATION (grade B, per [03](03%20Volume%20profile%20across%20timeframes.md)), for a stop beyond the probe and for using only yesterday's profile.

The setup itself is untested, and 03 notes a mechanical confound: volume at price partly records time spent at price, so HVN "support" is partly ordinary range reversion. The trigger is the session-scale form of 03's value-area rejection test: a probe beyond the edge that closes back inside before acceptance. HVN mean reversion inside balance is folded in here because the target, the prior POC, is the dominant HVN.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | PROFILE(RTH)[-1] relationships: OPEN_TIER, REGIME(D); OPEN_TYPE at T0+30 | Same (clock) |
| LOCATION | PROFILE(RTH)[-1].VAH and .VAL | Same |
| SETUP | Probe beyond the edge by at least 1 tick on M5 | Probe on VB-B |
| TRIGGER | CLOSE_BACK(M5, edge, d, 3) | CLOSE_BACK(VB-B, edge, d, 3) |
| MANAGEMENT | M5; 90-minute time stop | VB-B; same clock time stop |

Stays on clock time in both versions: T0, the T0+30 classification, the arming window and the time stop.

**Context filter.** OPEN_TIER is IN_VALUE. OPEN_TYPE at T0+30 is neither OD nor OTD in either direction. REGIME(D) is BALANCE, TENT_UP or TENT_DOWN.

**Location.** VAH (short) and VAL (long) of PROFILE(RTH)[-1]. Each edge is its own setup.

**Setup.** A TRIGGER-layer bar trades at least 1 tick beyond the edge. A third consecutive TRIGGER-layer close beyond the edge invalidates that edge for the day, because the probe is moving toward acceptance.

**Trigger.** CLOSE_BACK(L, edge, d, 3): a close back inside by at least 1 tick within 3 bars of the first trade beyond, with fewer than 3 closes beyond in between. The trigger must also satisfy rr(T1) ≥ 1.0.

**Entry order.** Limit at the trigger close, valid for 2 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | Probe extreme + BUF(L) for shorts (− for longs), widened to the 1.0 × ATR(L) floor if needed |
| Sizing | Common R rule |
| T1 / T2 | T1: PROFILE(RTH)[-1].POC, 1 tick in front, 50%. T2: the opposite VA edge, 1 tick in front, 50% |
| Breakeven / trail / time | Stop to breakeven at T1. Time stop 90 min after the fill |
| Cancel / invalidation | 3 closes beyond the edge → INVALIDATED (that edge, that day). An M30 period that passes `accepted_beyond` → INVALIDATED. A blackout → CANCELLED |

**Filters.** Arm from T0+30 to TC − 60 min. Common news and volatility rules. At most one attempt per edge per day and two per day in total.

**Automation spec.**
- IDLE → ARMED at T0+30 per edge, if the context holds.
- ARMED → ORDER_PENDING on CLOSE_BACK.
- ARMED → INVALIDATED on 3 closes beyond or on acceptance.
- ORDER_PENDING → EXPIRED after 2 bars.
- IN_POSITION → MANAGED → CLOSED.

```
on T0+30:
  P = PROFILE(RTH)[-1]
  if OPEN_TIER(RTHO, P) != IN_VALUE or OPEN_TYPE() in {OD, OTD} or REGIME(D) not in {BALANCE, TENT_UP, TENT_DOWN}:
      done_for_day
  arm(edge=P.VAH, d=DOWN); arm(edge=P.VAL, d=UP)
on TRIGGER-layer close (M5 | VB-B, T0+30 <= t <= TC-60), for each armed edge e:
  if closes_beyond(e, last 3 bars) >= 3 or accepted_beyond(e.price, -e.d): INVALIDATED(e)
  elif CLOSE_BACK(L, e.price, e.d, 3):
      stop = floor_stop(probe_extreme(e) +/- BUF(L), ATR(L))
      if rr(P.POC) >= 1.0:
          send limit(bar.c, expire=2 bars) with bracket(stop, [P.POC (50%), opposite_edge (50%)] each 1 tick in front)
on T1 fill: stop -> entry;   on fill + 90 min: exit_market("time")
```

| Parameter | Default | Reason |
|---|---|---|
| Context | IN_VALUE open, no OD/OTD, REGIME(D) not IMB/EXPANSION | Rotation favoured by both the open tier and day-over-day value |
| Probe | At least 1 tick beyond the edge | Minimal objective "look beyond" |
| CLOSE_BACK n | 3 bars | Sperandeo's "immediately", read as 1–3 bars in the swing notes |
| Stop | Probe extreme + BUF(L), ATR floor | Stops sit beyond the cluster, not at it |
| Targets | Prior POC, then opposite edge | 03's "first target the POC" convention |
| Time stop | 90 min | A responsive fade that doesn't rotate within 90 minutes has stopped being one |
| Arming window | T0+30 to TC − 60 | Waits for the open classification and leaves time to rotate |
| Max attempts | 1 per edge, 2 per day | Decay of repeatedly tested levels |

**Visual review checklist.**
1. Confirm the open inside yesterday's RTH VA (engine lines, 1-tick rows).
2. Check yesterday-vs-day-before value: inside or overlapping, with no strong migration.
3. On M5 or VB-B, find a bar that traded beyond the edge, then a close back inside within 3 bars.
4. Check the stop beyond the probe wick by the buffer, T1 at the prior POC and T2 at the opposite edge.

Bot errors to look for:
- Today's developing VA used as the edge, which is the most common error.
- A trigger on the VB that straddles T0.
- A probe that exists only because of a one-tick VA mismatch with the reviewer's chart.
- An edge left armed after it was accepted.

**Failure modes & regime fit.** It suits normal and neutral-centre days. It fails when an inside open turns into a normal-variation or trend day: the first probe fails, the second is accepted, and VP-05 territory begins. It also fails on midday news and when the prior VA is so narrow that T1 is trivial (skipped by the rr check).

**Relations.** It is the session-scale twin of VP-12. When a prior-day edge coincides with a COMP edge, only one of them may act on that level. VP-05 may take the opposite side later the same day after an IB break, and one-position-per-instrument keeps them sequential. VP-11's HOLD branch can conflict when a single-print zone sits at the edge. PA-family sweep-and-reclaim triggers are the price-only analogue.

## VP-04 Overnight inventory correction

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Scalp | 10 – 60 min | ES/MES, NQ/MNQ; CL/MCL only after its RTH and ON windows are confirmed | Transition at the open | C | Med |

**Concept basis.** The overnight profile is kept separate from RTH so it can give the overnight high, low and POC and the "inventory" read. That separation is standard platform practice: Sierra Chart offers "Use Separate Profile for Evening Session" ([Sierra Chart Volume by Price](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)). Dalton's view, as summarized by LuxAlgo, is that the open is uniquely informative because overnight inventory, news and institutional participation collide there, and the pre-bell references include the overnight range ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)).

The idea that lopsided overnight inventory gets corrected early in RTH is Market Profile lore that the notes could not verify from Dalton's own text. Two facts also argue for caution:

- Overnight volume is thin, so volume bars stretch over hours at night ([Volume Clock](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). An ON POC therefore rests on comparatively few contracts.
- The one peer-reviewed intraday result points the other way. In SPY, the first half-hour return measured from the prior close, which includes the overnight move, predicted a same-direction last half-hour ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)).

Hence the design. VP-04 trades only after price has crossed back through the open against the inventory, takes the correction no further than ON value, and is gone by the end of the IB. Grade C. Profile windows: [03](03%20Volume%20profile%20across%20timeframes.md).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | PROFILE(ON)[-1], final at T0; OPEN_TIER; news calendar | Same (clock) |
| LOCATION | RTHO; ON VAH/VAL/POC | Same |
| SETUP | Inventory flag at T0: LONG if RTHO > ON.VAH, SHORT if RTHO < ON.VAL | Same |
| TRIGGER | First M5 close at least 1 tick through RTHO against the inventory, in [T0+5, T0+30] | First VB-B (opened at or after T0) close at least 1 tick through RTHO against the inventory, in [T0, T0+30] |
| MANAGEMENT | M5; time exit at T0+60 | VB-B; same clock exit |

Stays on clock time in both versions: the ON window (17:00 CT to T0, excluding the 15:00–16:00 CT post-close hour per [03](03%20Volume%20profile%20across%20timeframes.md)), T0, the trigger window and the T0+60 exit.

**Context filter.** OPEN_TIER is IN_VALUE or OUT_VALUE; OUT_RANGE opens belong to VP-02. No tier-1 release fell between 17:00 CT and T0: NFP and CPI print at 07:30 CT, and inventory built around news is not positional. The ON range is at least 0.5 × its 20-session median.

**Location.** RTHO, the line the inventory side must defend.

**Setup.** INV = LONG or SHORT at T0. If RTHO lies inside the ON value area, the setup is NEUTRAL and does not arm.

**Trigger.** With LONG inventory, the first TRIGGER-layer close at or below RTHO − 1 tick inside the window. SHORT inventory mirrors it.

**Entry order.** Limit at the trigger close, valid 2 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | RTH high so far + BUF(M5) for a correction short (RTH low − BUF(M5) for a correction long), with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | T1: the near ON value edge, 1 tick in front (ON.VAH for a short), 50%. T2: ON.POC, 1 tick in front, 50%. Requires rr(T2) ≥ 1.5 |
| Breakeven / trail / time | Stop to breakeven at T1. Exit everything at T0+60 |
| Cancel / invalidation | No trigger by T0+30 → EXPIRED. Blackout → CANCELLED |

**Filters.** An opening setup by design, valid T0 to T0+60. Skip days with a pre-open tier-1 release. Common volatility band. One attempt per day.

**Automation spec.**
- IDLE → ARMED at T0 if INV ≠ NEUTRAL and the context holds.
- ARMED → ORDER_PENDING on the trigger.
- ARMED → EXPIRED at T0+30.
- ORDER_PENDING → EXPIRED after 2 bars.
- IN_POSITION → MANAGED → CLOSED, at the latest at T0+60.

```
on T0:
  ON = PROFILE(ON)[-1]; P = PROFILE(RTH)[-1]
  if OPEN_TIER(RTHO, P) == OUT_RANGE or tier1_release_between(17:00 CT, T0) or ON.range < 0.5*median20(ON.range):
      done_for_day
  inv = LONG if RTHO > ON.VAH else SHORT if RTHO < ON.VAL else NEUTRAL
  if inv == NEUTRAL: done_for_day
  state = ARMED;  d = DOWN if inv == LONG else UP              # trade against the inventory
on TRIGGER-layer close in window:
  if closed_through(RTHO, d, ticks=1):
      stop = floor_stop(rth_extreme_so_far(-d) +/- BUF(M5), ATR(L))
      T1, T2 = near_edge(ON, d) -/+ 1 tick, ON.POC -/+ 1 tick
      if rr(T2) >= 1.5: send limit(bar.c, expire=2 bars) with bracket(stop, [T1 50%, T2 50%])
on T0+30 while ARMED: EXPIRED;   on T0+60: exit_market("time")
```

| Parameter | Default | Reason |
|---|---|---|
| Inventory definition | RTHO beyond the ON value area | Uses the separate ON profile directly; no extra threshold |
| ON range floor | 0.5 × median ON range (20 sessions) | A tiny overnight has no inventory worth correcting |
| News exclusion | Any tier-1 release between 17:00 CT and T0 | News inventory is a reaction, not a position |
| Trigger | Close at least 1 tick through RTHO in [T0+5, T0+30] | The inventory side failing to defend the open |
| Targets | ON near edge, then ON POC | Correction to overnight value, no further |
| Minimum rr(T2) | 1.5 | Short holding window needs a payoff |
| Time exit | T0+60 | Inventory correction is an opening phenomenon; the intraday momentum result warns against holding |
| Max attempts | 1 per day | One open |

**Visual review checklist.**
1. Draw the ON volume profile from 17:00 CT to T0 only, separate from RTH, and mark its VAH, VAL and POC.
2. Confirm RTHO beyond the ON value area on the logged side.
3. Confirm no tier-1 release overnight and an adequate ON range.
4. Find the first M5 or VB-B close through RTHO against the inventory inside the window.
5. Check the stop beyond the RTH extreme so far and the targets at the ON edge and POC. The position is flat by T0+60.

Bot errors to look for:
- A full ETH or 24-hour profile used as "ON".
- The 15:00–16:00 CT post-close hour included.
- ES's ON window applied to CL.
- A trigger on the VB that straddles T0.
- A trigger fired before T0+5 on time bars.

**Failure modes & regime fit.** It fits quiet overnights that drift to one extreme and an inside or near-value open. It fails when the inventory is right, as on gap-and-go days where the overnight move is the start of a drive (the Gao result's scenario), on news days (excluded) and when the ON POC sits on so few contracts that it is not a meaningful level.

**Relations.** Opposes VP-02 by construction: OUT_RANGE opens are excluded, and a close back through RTHO contradicts an OD. Can stack with VP-01 or VP-03 in the same direction (for example, a correction from an open below value toward value). One-position-per-instrument means VP-04 fires first and blocks the later entry. Overlaps conceptually with PA-family opening-range failure triggers.

## VP-05 IB extension with value migration

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 1 – 5 h | ES/MES, NQ/MNQ, CL/MCL | Imbalance (normal-variation and trend days) | C; location B (IBH/IBL are clock-time LEVELS) | Low |

**Concept basis.** Sierra defines the initial balance as a number of sub-periods from the profile start (two 30-minute periods make a one-hour IB) and reports extensions beyond it with configurable percentage lines ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). The day-type taxonomy describes two cases ([LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/)):

- A **normal-variation** day extends the IB on one side, though sources disagree on how far.
- A **trend** day has a narrow IB, persistent one-way extension and a close near the extreme.

On trend days "the trade is with the extension" ([therighttrader, Trend Day](https://therighttrader.com/learn/trading-strategies/trend-day)). The day-type frequencies conflict and come without methodology. One blog cites ~50% normal variation and <5% trend days ([bullbear-university](https://bullbear-university.blogspot.com/2013/09/anticipating-trading-days-market.html)). A NexusFi post on ES reports 54% normal variation, ~16% trend and 25% neutral ([NexusFi](https://nexusfi.com/showthread.php?p=823821)). As [03](03%20Volume%20profile%20across%20timeframes.md) concludes, a one-tick IB break is a filter, not an event. Any edge has to come from the width condition, the direction filter and the follow-through.

The direction filter is prior-day value migration ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/)). It uses final profiles only, which keeps this proposal free of developing values. There is indirect support for the same-direction persistence the trade relies on:

- SPY's first half-hour return predicts its last half-hour ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)).
- Stop orders cluster just beyond salient extremes such as the IB high ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)).

Grade C for the setup. The IB extremes are clock-time LEVELS, whose evidence 07 grades B.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | REGIME(D) from PROFILE(RTH)[-1] vs [-2]; tiebreak IB midpoint vs PROFILE(RTH)[-1].POC | Same (clock) |
| SETUP | IB = high/low of [T0, T0+60); IB width within band | Same (clock) |
| LOCATION | IBH (long) or IBL (short) | Same |
| TRIGGER | First M5 close at least 1 tick beyond the IB extreme in direction d, after T0+60 | First VB-B close at least 1 tick beyond, after T0+60 |
| MANAGEMENT | M30 soft exit on a close back inside the IB; broker bracket | Same M30 soft exit (clock) |

Stays on clock time in both versions: T0, the IB window, the 20-session IB median, the break window and the M30 soft exit.

**Context filter.** If REGIME(D) is IMB or TENT, d is its direction. If it is BALANCE or EXPANSION, d = UP when the IB midpoint is above PROFILE(RTH)[-1].POC and DOWN when below; no trade if equal. The IB width must be between 0.3× and 1.0× its 20-session median. The narrow flag (below 0.6×) is logged for diagnosis only.

**Location.** IBH for d = UP, IBL for d = DOWN.

**Setup.** The IB completes at T0+60.

**Trigger.** The first TRIGGER-layer close at least 1 tick beyond the IB extreme in d, between T0+60 and TC − 120 min.

**Entry order.** Limit at the IB extreme + 1 tick (a retest of the broken edge), valid 30 minutes. A logged signal-only variant uses a stop-limit 1 tick beyond the trigger bar, so missed non-retest breakouts are measured.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | IB midpoint − BUF(M30) for a long (+ for a short), with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | T1: IBH + 0.5 × IB width (the 150% total-range line), 50%. T2: IBH + 1.0 × IB width (the 200% line), 50%. Mirrored for shorts |
| Breakeven / trail / time | Stop to breakeven at T1. Soft exit at market on any M30 close back inside the IB. Flat by TC − 5 |
| Cancel / invalidation | 30 minutes without a fill → EXPIRED. An M30 close back inside the IB before the fill → INVALIDATED. A trade beyond the opposite IB extreme before the fill → INVALIDATED (neutral-day risk) |

**Filters.** RTH only. Break window T0+60 to TC − 120. Common news and volatility rules. One attempt per day, in direction d only.

**Automation spec.**
- IDLE → ARMED at T0+60 if the context and width hold.
- ARMED → ORDER_PENDING on the trigger close.
- ORDER_PENDING → EXPIRED after 30 minutes, or → INVALIDATED.
- IN_POSITION → MANAGED → CLOSED via T2, the stop, the soft exit or the time exit.

```
on T0+60:
  IBH, IBL = high/low(T0, T0+60); W = IBH - IBL;  P1, P2 = PROFILE(RTH)[-1], PROFILE(RTH)[-2]
  if not (0.3 <= W / median20(IB width) <= 1.0): done_for_day
  r = REGIME(D)
  d = r.dir if r in {IMB_*, TENT_*} else (UP if mid(IBH,IBL) > P1.POC else DOWN if mid < P1.POC else None)
  if d is None: done_for_day
  edge = IBH if d == UP else IBL;  state = ARMED;  log(narrow = W < 0.6*median20)
on TRIGGER-layer close (M5 | VB-B), T0+60 <= t <= TC-120:
  if closed_beyond(edge, d, ticks=1):
      stop = floor_stop(mid(IBH,IBL) -/+ BUF(M30), ATR(L))
      send limit(edge +/- 1 tick, expire=30 min) with bracket(stop, [edge +/- 0.5W (50%), edge +/- 1.0W (50%)])
on M30 close: if inside IB: (state in {ARMED, ORDER_PENDING}) -> INVALIDATED else exit_market("soft")
```

| Parameter | Default | Reason |
|---|---|---|
| IB | First 60 min of RTH (two M30) | Market Profile convention; Sierra's definition |
| Width band | 0.3–1.0 × median IB (20) | Excludes wide-IB days, where extension targets are far and containment is likely, and degenerate IBs; the notes' 0.6× narrow mark is logged |
| Direction | REGIME(D), else IB-mid vs prior POC | "In the direction of value migration" from final profiles only |
| Trigger | M5/VB-B close ≥ 1 tick beyond | The notes' one-tick trade-through, made bar-close-based |
| Entry | Retest limit, 30 min | Small R; logged stop-limit variant measures what retests miss |
| Stop | IB midpoint | Gives clean geometry: T1 ≈ 1R, T2 ≈ 2R |
| Targets | +0.5 and +1.0 IB width beyond the edge | The notes' 1.5× and 2× IB extensions |
| Soft exit | M30 close back inside the IB | A failed extension |
| Max attempts | 1 per day | One IB per day |

**Visual review checklist.**
1. Use a Sierra TPO chart with 30-minute sub-periods starting at T0 and an IB of two sub-periods. Confirm the IB lines match the engine.
2. Set extension lines at +50% and +100% of IB width beyond the IB extremes. Check which convention the platform's IE% uses before comparing.
3. Confirm the direction from yesterday's vs the day before's value areas, or the IB midpoint vs yesterday's POC.
4. Find the first M5 or VB-B close beyond the IB extreme after T0+60. Check the retest limit, the stop at the IB midpoint and the soft exit on an M30 close back inside.

Bot errors to look for:
- An IB computed from the Globex start.
- An IB on a half-day treated as normal.
- A direction computed from today's developing profile.
- A trigger fired during the IB window.
- Extension lines measured from the wrong extreme.

**Failure modes & regime fit.** It suits normal-variation and trend days that start in the direction of yesterday's migration. It fails on neutral days that extend both sides (the first extension reverses), on afternoon reversals and on breaks just before scheduled midday releases. With trend days somewhere between under 5% and about 16% of sessions, most fills will reach T1 at best.

**Relations.** VP-02 is the earlier entry on the same days. VP-06 and VP-10 fire on the same trend days in the same direction, so treat them as one risk unit (one position per instrument enforces it). VP-03 may have faded the IB-forming rotation earlier. VP-13 is the composite-scale analogue. PA-family opening-range breakouts are the price-only cousin.

## VP-06 dPOC-trailed trend-day hold

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 2 h – to the close | ES/MES, NQ/MNQ, CL/MCL | Imbalance (trend days) | C | Med (developing profile, trailing) |

**Concept basis.** The developing POC (dPOC) is the POC recomputed as the session progresses. The engine samples it at every M30 close and logs it at every trigger ([03](03%20Volume%20profile%20across%20timeframes.md); [07](07%20Automation%20architecture.md)). The value-migration reading gives the idea: "a POC migrating with the VA strengthens the read", while a POC anchored in the old area argues the migration is tentative ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/); [Bookmap, Value Migration Explained](https://bookmap.com/blog/value-migration-explained-how-markets-shift-from-one-area-of-acceptance-to-another)). Trend days show little rotation and close near the extreme ([LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/)). The intraday-momentum result is the only peer-reviewed hint that holding into the close pays: the last half-hour tends to continue the first ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)).

Using the dPOC both as confirmation and as a trailing stop is this file's extension of day-over-day migration to the developing profile. It is untested, and it depends on developing values, which 07 flags as the main audit risk. Grade C.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | REGIME(D) not against d; VALUE_REL(PROFILE(RTH)[0], PROFILE(RTH)[-1]) is HIGHER or OVERLAP_UP for longs, sampled at M30 closes | Same (clock sampling) |
| SETUP | dPOC migration: dPOC(t) − dPOC(t − 2 M30) ≥ 0.5 × ATR(M30) at an M30 close | Same (clock) |
| LOCATION | The dPOC, the stop anchor | Same |
| TRIGGER | The same M30 close, with price between dPOC + 0.25 × ATR(M30) and dPOC + 1.0 × ATR(M30) | First VB-A close inside that band during the next M30 period |
| MANAGEMENT | Stop trailed under the dPOC at each M30 close | Stop trailed under the dPOC (as of each VB-A close) at each VB-A close |

Stays on clock time in both versions: T0, the M30 sampling of dPOC and developing VA, the setup window and the flat-by time.

**Context filter.** For longs, REGIME(D) is not IMB_DOWN and the developing VA (logged with `as_of`) is HIGHER or OVERLAP_UP versus PROFILE(RTH)[-1]. Shorts mirror.

**Location.** The dPOC at the trigger, logged.

**Setup.** A two-period dPOC migration of at least 0.5 × ATR(M30) in direction d.

**Trigger.** Price inside the band [dPOC + 0.25, dPOC + 1.0] × ATR(M30) at the TRIGGER-layer close. Above the band the trade would be chasing; below it the stop would be too close to the dPOC.

**Entry order.** Limit at the trigger close ± SLIP(L), valid 60 seconds.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | dPOC − BUF(M30) for a long, with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | No fixed target. A single position is held to the close or stopped out |
| Breakeven / trail / time | At each TRIGGER-layer close (M30, or VB-A in the volume version), stop = max(stop, dPOC(as_of) − BUF(M30)). It only ratchets, and it is modified only if it moved at least 2 ticks. Flat by TC − 5. Flatten at T−2 before an afternoon FOMC statement |
| Cancel / invalidation | Price above the band → no trade on this close; it may re-arm at a later close. Window ends → EXPIRED |

**Filters.** Setup window T0+90 to TC − 120. Common news and volatility rules. One attempt per day.

**Automation spec.**
- IDLE → ARMED when the context and migration hold at an M30 close.
- ARMED → ORDER_PENDING when price is in the band (same close or next VB-A).
- ARMED → IDLE if the band is missed.
- ORDER_PENDING → EXPIRED after 60 s.
- IN_POSITION → MANAGED, with ratchet updates → CLOSED.

```
on M30 close t (T0+90 <= t <= TC-120):
  dev = PROFILE(RTH)[0] (as_of=t); P = PROFILE(RTH)[-1]
  d = UP if VALUE_REL(dev, P) in {HIGHER, OVERLAP_UP} else DOWN if VALUE_REL(dev, P) in {LOWER, OVERLAP_DOWN} else None
  if d is None or REGIME(D) == IMB(-d): return
  if sgn(d) * (dev.dPOC - dPOC_at(t - 60 min)) >= 0.5 * ATR(M30): state = ARMED; log(dev.dPOC, as_of=t)
on TRIGGER-layer close while ARMED (M30 at t | VB-A within next M30):
  x = sgn(d) * (bar.c - dPOC_now)
  if 0.25*ATR(M30) <= x <= 1.0*ATR(M30):
      send limit(bar.c +/- SLIP(L), ttl=60s) with bracket(stop = floor_stop(dPOC_now -/+ BUF(M30), ATR(L)))
  else: state = IDLE
on TRIGGER-layer close in position: new = dPOC_now -/+ BUF(M30); if improves(stop, new) by >= 2 ticks: modify_stop(new)
```

| Parameter | Default | Reason |
|---|---|---|
| Migration lookback | 2 M30 periods | Two brackets, matching the acceptance tradition |
| Migration size | 0.5 × ATR(M30) | Half a typical bracket's range; rejects one-row dPOC flips |
| Entry band | 0.25–1.0 × ATR(M30) beyond the dPOC | Neither chasing nor sitting on the stop |
| Window | T0+90 to TC − 120 | IB plus one bracket of developing data; time left to trend |
| Trail | dPOC − BUF(M30), ratchet only, 2-tick hysteresis | Value-based trail; message hygiene per 07 |
| Targets | None | A trend-day hold; the trail is the exit |
| Max attempts | 1 per day | One trend day per day |

**Visual review checklist.**
1. Replay the session to each logged M30 close. Confirm the dPOC and developing VA printed in the decision record, not the end-of-day profile.
2. Confirm the developing value is higher (or overlapping higher) than yesterday's.
3. Check the two-period dPOC rise against 0.5 × ATR(M30), and the entry inside the band.
4. Step through the stop path. It may only rise, and only at TRIGGER-layer closes.

Bot errors to look for:
- The end-of-day POC used instead of the dPOC as of the trigger.
- The stop loosened when the dPOC retreated.
- Stop modifications sent on every tick.
- A POC tie-rule mismatch causing the dPOC to flip between two equal rows. The rule is nearest the middle, then lower.

**Failure modes & regime fit.** It suits trend days with steady value build-up. On thin, fast trend days the dPOC lags far behind price, so the band check skips the trade. On double-distribution days the dPOC jumps late and the trail sits deep. It also fails on afternoon reversals and on FOMC afternoons (flattened).

**Relations.** It shares days and direction with VP-02, VP-05 and VP-10 (one risk unit). It uses the same "POC as fair price" mechanism as VP-15 on a different anchor, the session rather than the swing leg. It conflicts with VP-03 by regime.

## VP-07 Breakout-leg LVN hold

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 20 min – 3 h | ES/MES, NQ/MNQ, CL/MCL | Imbalance: a fresh breakout from yesterday's value | C | High (ANCH + LVN detection) |

**Concept basis.** An LVN is "a local trough where very little volume ever traded" ([LuxAlgo, HVN/LVN detector](https://www.luxalgo.com/library/indicator/CHxGnqBD-volume-profile-with-hvn-lvn-detector/)). Practitioners use LVNs in contradictory ways:

- as targets ([faders substack](https://faders.substack.com/p/volume-profile));
- as entry zones because "large players tend to skip price during discovery" ([nemissa substack](https://nemissa.substack.com/p/trading-with-the-volume-profile));
- as rejection points on pullbacks ([TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy)).

Only regime resolves the contradiction ([03](03%20Volume%20profile%20across%20timeframes.md)). The case here is narrow. After a breakout, the LVN separating old value from new acceptance is the "air pocket" that should not be re-accepted, and re-acceptance means the breakout failed ([06](06%20How%20the%20dimensions%20interact.md)). In Kyle's terms an LVN records high past price impact ([Kyle 1985](https://econometricsociety.org/publications/econometrica/1985/11/01/continuous-auctions-and-insider-trading)). Assuming the same impact will hold in future is a hypothesis, because liquidity is not stationary.

Profiling the leg between two swings is standard practitioner practice ([ForexTester, Fixed Range Volume Profile](https://forextester.com/blog/fixed-range-volume-profile/); [FuturesHive](https://www.futureshive.com/blog/volume-profile-trading-strategy-2025)) and has been automated per leg ([TradingView, Swing Volume Profile Pro](https://id.tradingview.com/script/7yozLqCv-Swing-Volume-Profile-Pro-WillyAlgoTrader/)). Grade C.

**Anchor detector.** This proposal uses 07's alternative detector, Pivot(L,3,3). Under the default 2 × ATR ZigZag, B is confirmed only after a 2-ATR retrace. That would usually consume the pullback, and often the LVN, before the profile exists.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | VALUE_REL(PROFILE(RTH)[0], PROFILE(RTH)[-1]) is HIGHER or OVERLAP_UP at B.confirm_ts (logged); REGIME(D) not IMB_DOWN | Same (clock) |
| LOCATION | Separation LVN zone of PROFILE(ANCH(A→B)), anchors from Pivot(M15,3,3) | Anchors from Pivot(VB-A,3,3) |
| SETUP | Pullback into the LVN zone after B.confirm_ts | Same |
| TRIGGER | CLOSE_BACK(M5, zone.hi, UP, 3) with no M5 close below zone.lo | CLOSE_BACK(VB-B, zone.hi, UP, 3), same condition |
| MANAGEMENT | M15 bars for the time stop | VB-A bars for the time stop |

Stays on clock time in both versions: the prior RTH profile, T0 and the RTH window, and the developing-value sample at B.confirm_ts.

**Context filter.** The leg must start in RTH (A.pivot_ts ≥ T0), at or below PROFILE(RTH)[-1].VAH, and end at least 0.5 × ATR(M15) above it (B ≥ VAH + 0.5 × ATR(M15)). Requiring an RTH start keeps thin overnight volume from manufacturing fake LVNs. Today's developing value must be HIGHER or OVERLAP_UP versus yesterday. Shorts mirror the rule.

**Location.** Choose the highest LVN of ANCH(A→B) that has an HVN on both sides and lies between VAH − BUF(M15) and B − 0.25 × (B − A). If none exists, there is no setup.

**Setup.** At B.confirm_ts, price must still be at least 0.25 × ATR(M15) above zone.hi, meaning the location is untouched; otherwise the setup EXPIRES with reason "consumed before confirmation". Price then trades into the zone.

**Trigger.** A TRIGGER-layer close back above zone.hi by at least 1 tick, within 3 bars of trading into the zone, with no TRIGGER-layer close below zone.lo. It must come within 8 M15 bars of activation and before TC − 60.

**Entry order.** Limit at the trigger close, valid 2 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | zone.lo − BUF(M15), with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | T1: B, 1 tick in front, 50%. T2: REF_BEYOND(B, UP, rr ≥ 2.0, within 2 × ATR(M30)), 50%; if none, 100% at T1 |
| Breakeven / trail / time | Stop to breakeven at T1. Time stop after 8 M15 bars in the trade without T1. Flat by TC − 5 |
| Cancel / invalidation | An M15 close below zone.lo before the trigger → INVALIDATED. A trade below A → INVALIDATED. A new confirmed swing high above B → CANCELLED and re-anchored as a new version. 8 M15 bars after activation without a trigger → EXPIRED |

**Filters.** RTH only, T0+30 to TC − 60. Common rules. One attempt per leg, two per day.

**Automation spec.**
- IDLE → ARMED at B.confirm_ts when the leg, LVN and untouched checks pass.
- ARMED → ORDER_PENDING on the trigger.
- ARMED → INVALIDATED, CANCELLED or EXPIRED.
- IN_POSITION → MANAGED → CLOSED.

```
on Swing(H) confirmed on anchor layer L_A (M15 | VB-A) at t = B.confirm_ts:
  A = last_confirmed_swing_low_before(B); P = PROFILE(RTH)[-1]; dev = PROFILE(RTH)[0] (as_of=t)
  if A.pivot_ts < T0 or A.price > P.VAH or B.price < P.VAH + 0.5*ATR(M15): return
  if VALUE_REL(dev, P) not in {HIGHER, OVERLAP_UP} or REGIME(D) == IMB_DOWN: return
  H = PROFILE(ANCH(A->B));  N = nodes(H, sigma(ANCH))
  z = highest LVN zone in N with HVN on both sides and P.VAH - BUF(M15) <= z.price <= B.price - 0.25*(B.price - A.price)
  if z is None or last_price < z.hi + 0.25*ATR(M15): EXPIRED("no LVN / consumed"); return
  state = ARMED(level_id = hash("LVN", L_A, A.id, B.id))
on TRIGGER-layer close (M5 | VB-B) while ARMED:
  if bar.c < z.lo: INVALIDATED
  elif CLOSE_BACK(L, z.hi, UP, 3):
      stop = floor_stop(z.lo - BUF(M15), ATR(L))
      T2 = REF_BEYOND(B.price, UP, rr_min=2.0, max_dist=2*ATR(M30))
      send limit(bar.c, expire=2 bars) with bracket(stop, [B - 1 tick (50%), T2 (50%)] if T2 else [B - 1 tick (100%)])
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor detector | Pivot(M15,3,3) / Pivot(VB-A,3,3) | Bounds confirmation lag to 3 bars instead of a 2-ATR retrace |
| Leg start | In RTH, at or below prior VAH | A breakout leg out of yesterday's value |
| Leg end | ≥ prior VAH + 0.5 × ATR(M15) | Clearly into new territory |
| LVN choice | Highest two-sided LVN between prior VAH and the upper quarter of the leg | The neck between old value and new acceptance |
| Untouched margin | 0.25 × ATR(M15) | The location must still be ahead of price when it becomes known |
| Trigger | CLOSE_BACK(…, 3) above zone.hi | Rejection of the air pocket |
| Stop | Below the LVN zone | Re-acceptance into the old value means a failed breakout |
| T2 floor | rr ≥ 2.0 | Only a meaningful extension earns a runner |
| Time limits | 8 M15 bars to trigger and to T1 | About two hours; stale pullbacks lose the breakout's urgency |

**Visual review checklist.**
1. Draw ANCH(A→B) from the engine overlay (smoothed histogram, HVN/LVN zones) between A.pivot_ts and B.pivot_ts. Mark B.confirm_ts separately.
2. Check that A is in RTH at or below yesterday's VAH, and that B is clearly above it.
3. Check that the LVN has an HVN above and below, and that price was still above the zone at confirmation.
4. Find the dip into the zone and the close back above it within 3 bars. Check the stop under the zone and the targets.

Bot errors to look for:
- The profile drawn to a provisional high.
- Bars after B included in ANCH.
- An LVN picked from the raw histogram.
- A one-sided tail labelled as an LVN.
- Expecting Sierra's raw Peaks and Valleys to match the smoothed nodes. Per [03](03%20Volume%20profile%20across%20timeframes.md), node comparisons are qualitative.

**Failure modes & regime fit.** It suits clean RTH breakouts from yesterday's value with a visible two-humped leg. It fails when breakouts fail, when legs are too steady to produce an LVN, on news, and on fast days where the pullback is over before B confirms (skipped by design).

**Relations.** Owns breakout legs that cross yesterday's VAH with a separation LVN; VP-15 does not arm on those legs. If a prior balance lies ahead within reach, VP-08 owns the leg instead. VP-09 treats LVNs as traverse zones, so an LVN may have only one owner at a time. PA-family breakout-pullback templates are the price-only analogue.

## VP-08 Valentini-style trend model (LVN + aggressor delta)

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Scalp | 5 – 60 min | ES/MES, NQ/MNQ, CL/MCL | Imbalance: price out of balance and travelling toward a prior balance | C | High (ANCH + LVN + aggressor delta) |

**Concept basis.** The secondary description has four parts ([TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy); [TradeZella, Auction Market Playbook](https://www.tradezella.com/playbooks/auction-market-playbook)):

- The context is a market out of balance and "searching for new value".
- LVNs are marked on the reclaim leg.
- The trigger is "big buy aggression hitting right at that LVN on the footprint".
- The target is the POC inside the prior balance.

Neither page is Valentini's own text, and the description is ambiguous about which balance it means. Following [03](03%20Volume%20profile%20across%20timeframes.md), this proposal reads it as a continuation trade toward the next high-volume area in the trade's direction. The reclaim leg is the impulse that carries price back toward a balance area it left earlier, and the target is that balance's POC.

The footprint requirement is real and is what separates VP-08 from VP-07: the trigger needs aggressor-side volume. TradingView's "up/down volume" is classified by bar direction ("if close >= open… up volume"), not aggressor data, so it cannot host this rule ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)). Rithmic supplies the data on both paths:

- Live: `LastTrade` carries the aggressor flag, BUY=1/SELL=2.
- Seeding: template 209's minute profiles carry per-price bid- and ask-aggressor volume ([Rithmic/protos.json](../../Rithmic/protos.json)).

Constant-volume bars make delta comparable from bar to bar, because every bar holds the same contracts ([05](05%20Volume%20bars%20versus%20time%20bars.md)). Grade C.

**Chart stack**

| Role | Time-bar version | Volume-bar version (primary) |
|---|---|---|
| CONTEXT | accepted_beyond(PROFILE(RTH)[-1] edge, d) today; target balance TB ahead | Same (clock) |
| LOCATION | LVN zone on PROFILE(ANCH(A→B)), anchors from Pivot(M5,3,3) | Anchors from Pivot(VB-B,3,3) |
| SETUP | Pullback into the LVN zone | Same |
| TRIGGER | M1 bar in the zone, close in its upper half, delta/volume z-score ≥ 2.0 vs the trailing 200 M1 bars | VB-C bar in the zone, close in its upper half, delta z-score ≥ 2.0 vs the trailing 200 VB-C bars |
| MANAGEMENT | M5; 60-minute time stop | VB-B; same clock time stop |

Stays on clock time in both versions: the prior RTH profile, the M30 acceptance periods, TB's profile periods and the time stop.

**Context filter.**
1. Today, price has been `accepted_beyond` PROFILE(RTH)[-1].VAH (for d = UP), so it has left yesterday's balance.
2. A target balance TB lies ahead. TB is the nearest of: the composites of completed balance episodes (runs of at least 3 overlapping sessions) within the last 20 sessions, WEEK[-1] and WEEK[-2]. TB's whole VA must lie beyond the current price in d, and TB.POC must be within 1.0 × ATR(D1).
3. REGIME(D) is not IMB against d.

**Location.** On ANCH(A→B) of the most recent confirmed impulse leg in d, built from RTH prints only, take the highest two-sided LVN whose zone.hi lies at least 0.25 × ATR(M5) below price at B.confirm_ts.

**Setup.** Price pulls back into the LVN zone.

**Trigger.** A TRIGGER-layer bar that trades inside the zone, closes in the upper half of its own range, and shows aggressive buying.

- Delta is ask-aggressor minus bid-aggressor volume.
- On VB-C, the bar's delta must reach a z-score of at least 2.0 against the trailing 200 non-partial VB-C bars.
- On M1, delta/volume is used instead, z-scored the same way.

**Entry order.** Limit at the trigger close, valid 3 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | zone.lo − BUF(M5), with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | Single target: TB.POC, 1 tick in front, 100%. Requires rr ≥ 2.0 |
| Breakeven / trail / time | Stop to breakeven once price trades +1R. Time stop 60 min. Scalp blackout flatten applies |
| Cancel / invalidation | An M5 or VB-B close below zone.lo before the trigger → INVALIDATED. A new confirmed swing extending the leg → CANCELLED and re-anchored. TB.POC traded before the fill → CANCELLED, because the magnet is satisfied |

**Filters.** RTH only, T0+15 to TC − 60, because aggressor reads and fills are poorer in thin overnight books. Common rules. At most one attempt per LVN and two per day.

**Automation spec.**
- IDLE → ARMED at B.confirm_ts if the context, TB and LVN checks pass.
- ARMED → ORDER_PENDING on the trigger.
- ARMED → INVALIDATED or CANCELLED.
- ORDER_PENDING → EXPIRED after 3 bars.
- IN_POSITION → MANAGED → CLOSED.

```
on Swing confirmed on anchor layer (M5 | VB-B) completing impulse leg A->B in direction d:
  P = PROFILE(RTH)[-1]
  if not accepted_beyond(P.edge(d), d) today or REGIME(D) == IMB(-d): return
  TB = nearest([episode composites last 20 sessions] + [WEEK[-1], WEEK[-2]],
               where VA entirely beyond last_price in d and abs(POC - last_price) <= ATR(D1))
  if TB is None: return
  z = highest two-sided LVN of nodes(PROFILE(ANCH(A->B)), sigma(ANCH)) with z.hi <= last_price - 0.25*ATR(M5)   # mirror for shorts
  if z is None: return
  state = ARMED(level_id = hash("LVN", layer, A.id, B.id), target = TB.POC)
on TRIGGER-layer close (VB-C | M1) while ARMED:
  if traded_in(bar, z) and close_in_upper_half(bar) and zscore(delta_metric(bar), last 200 bars) >= 2.0:
      stop = floor_stop(z.lo - BUF(M5), ATR(L))
      if rr(TB.POC) >= 2.0: send limit(bar.c, expire=3 bars) with bracket(stop, [TB.POC -/+ 1 tick (100%)])
on M5|VB-B close < z.lo while ARMED: INVALIDATED
```

| Parameter | Default | Reason |
|---|---|---|
| Out-of-balance test | `accepted_beyond` yesterday's edge | 03's single acceptance definition |
| Target balance | Nearest multi-session balance (episode composite, WEEK[-1..-2]) ahead within 1 × ATR(D1) | "POC inside the prior balance", read as the next high-volume area in the trade direction |
| Anchor detector | Pivot(M5,3,3) / Pivot(VB-B,3,3), RTH legs only | Scalp-scale legs; confirmation lag bounded |
| Delta metric | Ask-aggressor minus bid-aggressor (VB-C); ratio to bar volume (M1) | Equal-volume bars make raw delta comparable; time bars need normalising |
| Aggression threshold | z ≥ 2.0 vs the trailing 200 bars | A conventional "unusual" cutoff; 200 VB-C bars is about a fifth of an average day |
| Close location | Upper half of the bar | Aggression that also moved price, not absorbed aggression |
| Target / rr | TB.POC only; rr ≥ 2.0 | A single magnet target with an untested hit rate needs payoff |
| Time stop | 60 min | Scalp horizon |

**Visual review checklist.**
1. Draw TB's value area and POC (episode composite or prior week) and confirm it lies wholly ahead of price.
2. Confirm today's acceptance beyond yesterday's value edge (two M30 closes plus the volume share).
3. Overlay ANCH(A→B) with its LVN zone and B's confirmation marker.
4. At the trigger bar, inspect the engine-rendered footprint or delta. Delta must be in the bar's buy-aggressor direction and unusually large, and the bar must close in its upper half.
5. Check the stop under the zone and the target 1 tick in front of TB.POC.

Bot errors to look for:
- Delta computed from bar direction or the tick rule instead of the aggressor flag.
- `isSnapshot` prints counted.
- Seeded `profileNoAggressorVolume` added to one side.
- A z-score window that crosses the session break or includes partial bars.
- One huge print, possibly a block-like summary trade, read as "aggression" without inspection.

**Failure modes & regime fit.** It suits directional sessions heading back into an old balance. It fails on **absorption**: large buy delta with no progress means a passive seller is winning, the opposite of the signal. That is why the trigger requires the close in the upper half. It also fails on exhaustion near TB, and when the target is far enough that the scalp horizon expires first. Whether Rithmic delivers CME summary trades or split fills does not change delta totals, but it does change how large individual prints look ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)).

**Relations.** Owns the leg when a TB destination exists; otherwise VP-07 may own it. If TB.POC is also naked, it is VP-10's target too, and one position per instrument prevents doubling. VP-09 reads LVNs as traverse zones, so LVN ownership applies. The volume-bar trigger is the family's purest use of the independent order-flow dimension, which CX proposals may reuse as a trigger.

## VP-09 LVN air-pocket traverse

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Scalp | 2 – 30 min | ES/MES, NQ/MNQ, CL/MCL | Imbalance or transition: price leaving an HVN through thin volume | C | High (LVN detection + bar speed) |

**Concept basis.** An LVN that breaks should be traversed quickly ([03](03%20Volume%20profile%20across%20timeframes.md)). In the practitioner hierarchy, higher-dimension LVNs mark where price should travel fast or reject, and the HVNs beyond them mark where it should stall. Two mechanisms are offered:

- **Kyle's λ.** An LVN records high past price impact per contract ([Kyle 1985](https://econometricsociety.org/publications/econometrica/1985/11/01/continuous-auctions-and-insider-trading)). Assuming that impact persists is a hypothesis.
- **Stop cascades.** Osler found that trends are "unusually rapid" when prices reach levels where stop-losses cluster, and that the effects are significant for hours, not days ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). That was shown for round numbers and extremes, not for LVNs.

Constant-volume bars add a clean way to see the traverse. Each bar holds the same contracts, so a wide bar means high impact per contract, and a short-lived bar means urgency. 03 names "fast, wide bars" as what an LVN traverse should look like ([05](05%20Volume%20bars%20versus%20time%20bars.md); [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). The thesis is speed, so the proposal's distinctive rule is a time stop that exits a traverse that is not fast. Grade C.

**Chart stack**

| Role | Time-bar version | Volume-bar version (primary) |
|---|---|---|
| CONTEXT | REGIME(D) not IMB against d | Same (clock) |
| LOCATION | Two-sided LVN zone of PROFILE(COMP(2 weeks)) from ETH prints, between HVN_near and HVN_far | Same |
| SETUP | Price in or at HVN_near, trading into the adjacent LVN zone | Same |
| TRIGGER | M1 close at least 1 tick inside the LVN zone in d, with range ≥ 1.5 × median M1 range (20 bars) and volume ≥ 1.5 × median M1 volume (20 bars) | VB-B close at least 1 tick inside the zone in d, with range ≥ 1.5 × median range and duration ≤ 0.5 × median duration of the last 20 non-partial VB-B bars |
| MANAGEMENT | M1; progress check after 10 bars; 30-minute hard limit | VB-B; progress check after 10 bars; same clock limit |

Stays on clock time in both versions: the composite's session boundaries, the RTH trading window and the 30-minute hard time stop.

**Context filter.** REGIME(D) is not IMB against d. The traverse direction d is set by which side of the LVN price is leaving.

**Location.** PROFILE(COMP(2 weeks)) is built from all ETH prints of the last 10 completed sessions, with 03's role for ETH: "liquidity levels including overnight". It uses σ = round(3·√10) ≈ 9 ticks. An LVN qualifies only with an HVN on both sides. HVN_near is the HVN price is leaving, and HVN_far is the target beyond.

**Setup.** Price trades from HVN_near into the LVN zone.

**Trigger.** A fast, wide TRIGGER-layer bar closes inside the LVN zone in d (thresholds as in the table). In the time version, M1 volume is seasonal at the open, so no trigger is taken in the first 15 RTH minutes.

**Entry order.** Stop-limit 1 tick beyond the trigger bar's extreme in d, with limit offset SLIP(L), valid 2 TRIGGER-layer bars. This is a breakout-style entry, per 07's order table.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | The LVN/HVN_near boundary − BUF(L) (back in the origin HVN means no traverse), with the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | Single target: the near edge of HVN_far, 1 tick in front, 100%. Requires rr ≥ 1.5 |
| Breakeven / trail / time | Stop to breakeven at +1R. **Speed stop:** if price has not covered 50% of entry→T1 within 10 TRIGGER-layer bars, exit at market. Hard time stop 30 min |
| Cancel / invalidation | 2 bars without a fill → EXPIRED. Price back inside HVN_near before the fill → CANCELLED |

**Filters.** RTH only, from T0+15 to TC − 30, because overnight books are too thin for stop-limit scalps. Common rules. At most one attempt per LVN per direction per day and three per day.

**Automation spec.**
- IDLE → ARMED when price sits in or at HVN_near adjacent to a qualifying LVN.
- ARMED → ORDER_PENDING on the fast-wide trigger.
- ORDER_PENDING → EXPIRED or CANCELLED.
- IN_POSITION → MANAGED, with the speed check → CLOSED.

```
nightly at 17:00 CT:  C = PROFILE(COMP(2 weeks), ETH); N = nodes(C, sigma(C)); lvns = two_sided(N.LVN)
on TRIGGER-layer close (VB-B | M1), T0+15 <= t <= TC-30:
  for z in lvns adjacent to price:
     d = direction from HVN_near(z) into z
     if REGIME(D) == IMB(-d) or owned_by_other(z): continue
     fast = (range(bar) >= 1.5*median_range(20)) and ((duration(bar) <= 0.5*median_duration(20)) if VB
             else (volume(bar) >= 1.5*median_volume(20)))
     if fast and closed_inside(bar, z, d, ticks=1):
        stop = floor_stop(z.boundary(HVN_near) -/+ BUF(L), ATR(L)); T1 = HVN_far(z).near_edge -/+ 1 tick
        if rr(T1) >= 1.5: send stop_limit(extreme(bar, d) +/- 1 tick, limit_off=SLIP(L), expire=2 bars) with bracket(stop, [T1])
in position, each TRIGGER-layer close: if bars_since_fill >= 10 and progress < 0.5: exit_market("speed")
```

| Parameter | Default | Reason |
|---|---|---|
| Profile | COMP(2 weeks), ETH | Higher-dimension liquidity map; 10 sessions is recent enough for decay concerns |
| LVN | Two-sided only | A traverse needs a destination HVN |
| Speed test (VB) | Range ≥ 1.5× and duration ≤ 0.5× of 20-bar medians | Impact plus urgency, as the volume-bar construction defines them |
| Speed test (M1) | Range and volume ≥ 1.5× of 20-bar medians | The time-bar proxy, which is weaker because clock volume is seasonal |
| Entry | Stop-limit beyond the trigger bar | Bounded slippage on breakouts per 07 |
| Speed stop | 50% of the distance within 10 bars | The thesis is a fast traverse; a slow one has failed |
| Hard time stop | 30 min | Osler's cascades are an hours-scale effect; a scalp should be done well inside that |
| Max attempts | 1 per LVN per direction, 3 per day | Repeated attempts at one LVN are a rejection signal |

**Visual review checklist.**
1. Show the engine-rendered COMP(2 weeks) ETH profile, smoothed, with HVN and LVN zones. Confirm the LVN has an HVN above and below.
2. At the trigger bar, read its logged range and duration against the 20-bar medians.
3. Check the stop-limit placement, the stop at the HVN boundary and the target at the far HVN's near edge.
4. Check whether the speed stop fired as logged.

Bot errors to look for:
- An LVN taken from the raw histogram.
- A one-sided tail used as a traverse zone.
- Medians computed with partial bars or across the session break.
- Time-version triggers in the first RTH minutes.
- A roll-week composite not shifted by the roll spread.

**Failure modes & regime fit.** It suits directional sessions and the transition out of a balance. It fails when the traverse stalls at a micro-HVN inside the LVN, when the LVN acts as rejection instead (VP-07's scenario), on news spikes (blackout) and on rotational days, where a composite LVN inside a broad balance is just a quiet price.

**Relations.** It conflicts with VP-07 and VP-08 at the same LVN, because rejection and traverse are opposite readings. An LVN has one owner at a time: the first proposal to arm it. It complements VP-13, whose breakouts often cross a composite LVN, and the two then count as one risk unit. It opposes VP-12 at a balance edge.

## VP-10 Unfinished-auction magnet run (nPOC and poor extremes)

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 30 min – to the close | ES/MES, NQ/MNQ, CL/MCL | Initiative activity toward an unfinished reference | C | Med (nPOC and poor-extreme trackers) |

**Concept basis.** Two kinds of unfinished reference serve as targets:

- **Naked POC (nPOC):** a prior profile's POC that has not been traded through since that profile closed. Sierra implements it as "Extend Point of Control … Until Future Intersection" ([Sierra Chart Volume by Price](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)).
- **Poor high or low:** a session extreme shared by two or more TPO periods with no single-print tail. It reads as an unfinished auction that "tends to be revisited" ([therighttrader, Poor highs and lows](https://therighttrader.com/learn/volume-and-order-flow/poor-highs-and-lows); [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). Trader Dale makes the same point ([Trader Dale, Feb 2026](https://trader-dale.blogspot.com/2026/02/order-flow-failed-auction-unfinished.html)).

Two cautions shape the rules. A matching double top is not a poor high, because TPO counts matter ([therighttrader](https://therighttrader.com/learn/volume-and-order-flow/poor-highs-and-lows)). Context changes the trip: "a poor high far above value is a different trip than a poor high sitting on the value-area high of a balanced day" ([NexusFi](https://nexusfi.com/a/market-structure/single-prints-poor-highs-poor-lows-market-profile)). The only claim of validation for nPOC retests is unvetted and shows no method ([portfoliowebsite summary](https://portfoliowebsite-3hz.pages.dev/research/futures-ta/companions/research-summary.html)).

Both kinds are used as **targets, never entries** ([03](03%20Volume%20profile%20across%20timeframes.md)). They share one template, so they are one proposal. The target type is logged, for diagnosis only. Osler's take-profit clustering argues for exiting just in front ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)), and Chung & Bellotti's decay argues for age caps ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)). Grade C.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | REGIME(D) not against d; a qualifying target exists | Same (clock) |
| LOCATION | Entry reference R ∈ {PROFILE(RTH)[-1].VAH/VAL, IBH/IBL}; target from the nPOC and poor-extreme trackers | Same |
| SETUP | accepted_beyond(R, d) at an RTH M30 close | Same (clock) |
| TRIGGER | After acceptance, a bar trades within 2 ticks of R, then an M5 close at least 1 tick beyond R in d | Same with VB-B |
| MANAGEMENT | M5; flat by TC − 5 | VB-B; same |

Stays on clock time in both versions: T0, the IB, the M30 acceptance periods, the profile periods behind every nPOC and poor extreme, and the flat-by time.

**Context filter.** REGIME(D) is not IMB against d. A target exists beyond R in d:
- an nPOC from RTH (at most 10 sessions old), WEEK (at most 8 weeks) or MONTH (at most 6 months); or
- an unrepaired poor high/low of PROFILE(RTH)[-1] or [-2], meaning at least two M30 periods within 1 tick of the extreme and no trade beyond it since.

The target must lie within 1.0 × ATR(D1) of the entry.

**Location.** R is whichever of PROFILE(RTH)[-1].VAH/VAL (or IBH/IBL after T0+60) price has just been accepted beyond, toward the target.

**Setup.** `accepted_beyond(R, d)` turns true at an M30 close.

**Trigger.** Within the next 2 M30 periods, a TRIGGER-layer bar trades at or within 2 ticks of R (a retest), followed by a TRIGGER-layer close at least 1 tick beyond R in d.

**Entry order.** Limit at the trigger close, valid 2 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | R − BUF(M30) for d = UP, with the ATR floor. Price back inside value means the initiative failed |
| Sizing | Common R rule |
| T1 / T2 | Single target: the nearest qualifying target, 1 tick in front, 100%. Requires rr ≥ 1.5 |
| Breakeven / trail / time | Stop to breakeven at +1R. Flat by TC − 5 |
| Cancel / invalidation | Target touched before entry → CANCELLED (magnet satisfied). An M30 close back beyond R against d → INVALIDATED. No retest within 2 M30 periods → EXPIRED (no chasing) |

**Filters.** RTH only, T0+60 to TC − 90, because acceptance needs at least two M30 closes. Common rules. One attempt per day.

**Automation spec.**
- IDLE → ARMED when `accepted_beyond` turns true and a target qualifies.
- ARMED → ORDER_PENDING on the retest trigger.
- ARMED → EXPIRED, CANCELLED or INVALIDATED.
- IN_POSITION → MANAGED → CLOSED.

```
trackers: naked = {RTH, WEEK, MONTH POCs not yet printed at by any later trade, ETH included}
          poor  = {extremes of RTH[-1], RTH[-2] with >= 2 M30 periods within 1 tick and no later trade beyond}
on M30 close (T0+60 <= t <= TC-90):
  for R in candidates(P.VAH, P.VAL, IBH, IBL):
     d = side price is on relative to R
     if not accepted_beyond(R, d) or REGIME(D) == IMB(-d): continue
     tgt = nearest(naked(age caps) + poor, beyond R in d, dist <= ATR(D1))
     if tgt: state = ARMED(level_id = hash(tgt.kind, tgt.profile, tgt.price), R = R, deadline = t + 2*M30)
on TRIGGER-layer close (M5 | VB-B) while ARMED:
  if touched(tgt): CANCELLED("magnet satisfied")
  if retest_seen(R, within=2 ticks) and closed_beyond(R, d, ticks=1):
      stop = floor_stop(R -/+ BUF(M30), ATR(L))
      if rr(tgt.price) >= 1.5: send limit(bar.c, expire=2 bars) with bracket(stop, [tgt.price -/+ 1 tick])
on M30 close: if closed_beyond(R, -d): INVALIDATED
```

| Parameter | Default | Reason |
|---|---|---|
| nPOC touch rule | Any later trade at the POC, ETH included | 03's conservative default; fewer levels survive |
| Age caps | 10 RTH sessions, 8 weeks, 6 months | Decay of level strength; prefer young references |
| Poor extreme | At least 2 M30 periods within 1 tick | Sierra's definition with 07's 1-tick setting |
| Entry reference | Prior VA edge or IB extreme just accepted beyond | Initiative activity made objective with 03's acceptance metric |
| Retest tolerance | 2 ticks | Entry near the reference, not mid-air |
| Reach | ≤ 1.0 × ATR(D1) | The magnet must be reachable within the session |
| rr | ≥ 1.5 | A single-target trade with an untested hit rate needs payoff |
| Max attempts | 1 per day | One initiative leg per day |

**Visual review checklist.**
1. Overlay the nPOC lines (Sierra "Extend POC Until Future Intersection", Chart Bars method, on a 24-hour chart) with the engine's list and ages. Confirm the target was untouched at entry time.
2. For poor extremes, check the TPO chart (30-minute sub-periods). At least two periods must share the extreme within 1 tick, with nothing traded beyond since.
3. Confirm the acceptance at R: two M30 closes beyond plus the logged volume share.
4. Check the retest, the trigger close, the stop beyond R and the exit 1 tick in front of the target.

Bot errors to look for:
- An nPOC treated as naked after an ETH touch.
- A poor high detected with the 0.15 × ATR equal-highs tolerance instead of the TPO rule.
- A repaired poor extreme still targeted.
- Ages counted in calendar days.
- Pre-roll nPOCs not shifted.

**Failure modes & regime fit.** It suits initiative days that leave value toward an old reference. It fails when an HVN between price and the magnet stalls the move, when the magnet is reached only the next day, and on balance days, where acceptance beyond R is brief.

**Relations.** It shares trend days with VP-02, VP-05 and VP-06 (one risk unit). VP-01's T1 or VP-08's TB.POC may be the same price, and one position per instrument prevents doubling. Single-print zones are deliberately not targets here; they belong to VP-11. CX-family proposals may use the same targets for higher-timeframe exits.

## VP-11 Single-print hold or fill

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 30 min – 3 h | ES/MES, NQ/MNQ, CL/MCL | HOLD branch in migration; FILL branch when the zone is accepted | C | High (TPO single-print port) |

**Concept basis.** Sierra defines a single print as "the first TPO within a sub-period that exceeds the high or low of all of the prior TPOs". It is confirmed only if later sub-periods stay beyond, never identified in the first or last sub-period, and retracted if traded back into ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). Unfilled singles persist across sessions as gaps in the auction. Practitioners read them two ways: as support or resistance if the move that created them continues, or as targets to fill if it doesn't. Because the direction is ambiguous, [03](03%20Volume%20profile%20across%20timeframes.md) calls them "levels, not signals".

A double distribution is "two distributions separated by single prints", which Dalton treats as a trend-type day ([therighttrader, Double Distribution Day](https://therighttrader.com/learn/trading-strategies/double-distribution-day)). The only number is tangential: 3 of the 16 complete 80%-rule fills in 2008 came through single prints ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)).

The proposal resolves the ambiguity with a state machine instead of a forecast. A first touch from the destination side that holds is traded as a HOLD. An M30 period accepted *inside* the zone is traded as a FILL. Only one branch may trade a zone per day. Grade C.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | REGIME(D), checked per branch | Same (clock) |
| LOCATION | Zone Z = [z_lo, z_hi], the most recent unfilled confirmed RTH single-print zone from RTH[-1..-5] | Same (M30 TPO, clock) |
| SETUP | HOLD: price enters Z from the destination side but not past z_mid. FILL: price enters Z | Same |
| TRIGGER | HOLD: CLOSE_BACK(M5, edge, c, 3) out of Z. FILL: an RTH M30 close inside Z | HOLD: CLOSE_BACK(VB-B, …). FILL: same M30 close (clock); entry on the first VB-B close inside Z after it |
| MANAGEMENT | M5 / M30 | VB-B / M30 |

Stays on clock time in both versions: the M30 TPO sub-periods that define the singles, the FILL acceptance close and T0.

**Context filter.** The creation direction c is UP if the zone formed during an up-move, so it sits below the later distribution.
- **HOLD**, trading in c: REGIME(D) is IMB or TENT in c.
- **FILL**, trading in fill direction f toward the far edge: REGIME(D) is not IMB against f.

**Location.** Z must be confirmed in Sierra's "all forward sub-periods" mode and be at least max(4 ticks, 0.25 × ATR(M30)) tall. It shrinks as any later trade, ETH included, prints inside it.

**Setup.** HOLD: price trades at least 1 tick into Z from the destination side (from above for c = UP) without trading past z_mid. FILL: price trades into Z from either side.

**Trigger.** HOLD: a TRIGGER-layer close back out of Z on the destination side within 3 bars. FILL: an RTH M30 period closes inside Z.

**Entry order.** HOLD: limit at the trigger close, valid 2 bars. FILL: limit at the M30 close (time version) or the first VB-B close inside Z (volume version), valid 1 M30 period.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | HOLD: z_mid − BUF(M5) for c = UP, since a half-filled zone has failed as support. FILL: the entry-side edge ± BUF(M30). Both use the ATR floor |
| Sizing | Common R rule |
| T1 / T2 | HOLD: REF_BEYOND(entry, c, rr ≥ 1.0) from {session extreme so far, REFS}, 100%. FILL: the far edge of Z, 1 tick in front, 100% |
| Breakeven / trail / time | Stop to breakeven at +1R. Time stop: HOLD 2 h, FILL 3 h. Flat by TC − 5 |
| Cancel / invalidation | HOLD: a trade past z_mid before the trigger → INVALIDATED (the FILL watch continues). FILL: a close back out of Z on the entry side before the fill → INVALIDATED. If HOLD traded and lost, FILL does not arm on that zone that day |

**Filters.** RTH, T0+30 to TC − 60. Common rules. One trade per zone per day, two per day in total.

**Automation spec.**
- Per zone: IDLE → ARMED(HOLD) when price enters from the destination side, and/or ARMED(FILL) when price enters at all.
- ARMED(HOLD) → ORDER_PENDING on the close back out, or → INVALIDATED past z_mid.
- ARMED(FILL) → ORDER_PENDING on an M30 close inside Z.
- After a HOLD loss, FILL → CANCELLED for the day.
- IN_POSITION → MANAGED → CLOSED.

```
nightly: zones = confirmed_unfilled_singles(RTH[-1..-5], mode=ALL_FORWARD); drop height < max(4 ticks, 0.25*ATR(M30))
on any trade inside z: shrink(z)                                   # ETH prints fill too
on TRIGGER-layer close (M5 | VB-B), T0+30 <= t <= TC-60, for each z (creation dir c):
  if entered_from_destination(z, c) and not traded_past(z.mid) and REGIME(D) in {IMB(c), TENT(c)}:
      if CLOSE_BACK(L, z.dest_edge, c, 3):
          stop = floor_stop(z.mid -/+ BUF(M5), ATR(L)); T = REF_BEYOND(bar.c, c, rr_min=1.0)
          send limit(bar.c, expire=2 bars) with bracket(stop, [T])           # HOLD
on M30 close inside z (and not hold_lost_today(z)):
  f = direction toward z.far_edge(from entry side); if REGIME(D) == IMB(-f): skip
  stop = floor_stop(z.entry_edge -/+ BUF(M30), ATR(M30))
  send limit(bar.c, expire=1 M30) with bracket(stop, [z.far_edge -/+ 1 tick])  # FILL
```

| Parameter | Default | Reason |
|---|---|---|
| Single definition | Sierra, all-forward mode; not in first/last sub-period; retract on re-entry | Ported platform definition; the stricter mode |
| Zone age | Up to 5 RTH sessions | Decay; most zones are filled sooner |
| Minimum height | max(4 ticks, 0.25 × ATR(M30)) | Filters trivial singles |
| HOLD depth limit | z_mid | Past half-fill, the zone is filling, not holding |
| FILL acceptance | One M30 close inside | The TPO-native sign of acceptance inside the gap |
| Targets | HOLD: next reference with rr ≥ 1.0; FILL: far edge | Hold resumes the creating move; fill completes the gap |
| One branch per zone per day | — | Prevents stop-and-reverse whipsaw |

**Visual review checklist.**
1. On a Sierra TPO chart with 30-minute sub-periods from T0 and single-print highlighting in all-forward mode, confirm the zone and its later shrinkage from subsequent trades.
2. For HOLD: price entered from the destination side, never passed z_mid, and closed back out within 3 bars.
3. For FILL: an M30 period closed inside the zone, and the target is the far edge.
4. Confirm only one branch traded the zone that day.

Bot errors to look for:
- Singles computed from volume rows instead of TPO periods.
- Singles flagged in the first or last sub-period.
- A zone used before the sub-periods that confirm it had closed (look-ahead).
- Overnight fills not applied.
- Both branches trading the same zone.

**Failure modes & regime fit.** HOLD suits continuation days after a trend or double-distribution day. FILL suits rotational days. Both fail when zones are mostly filled overnight, when a trend day blows through, and in chop that straddles the zone.

**Relations.** Complements VP-01, whose traverses sometimes complete through singles. When a zone sits at a prior VA edge, VP-03 and VP-11 share one attempt at that level. It shares the "unfinished business" idea with VP-10 but keeps singles out of VP-10's targets.

## VP-12 Composite look-above/below-and-fail

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Swing (intraday trigger, multi-session hold) | 2 h – 3 sessions | ES/MES, NQ/MNQ, CL/MCL | Balance (multi-day) | C; location B | Med |

**Concept basis.** Look-above-and-fail is the multi-day mirror of the 80% rule. Price auctions above a balance high, fails to win acceptance and returns inside. The target is the balance POC first, then the opposite edge ([03](03%20Volume%20profile%20across%20timeframes.md), Background). Wyckoff's upthrust is the same idea, a push above resistance that closes back inside the range. A spring below the range is only a test until price closes back inside, and a close back beyond invalidates it ([LuxAlgo, Upthrust](https://www.luxalgo.com/library/concept/upthrust/); [LuxAlgo, Spring](https://www.luxalgo.com/library/concept/spring/)).

The mechanism is Osler's. Stop-loss buy orders cluster just above salient levels ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). A probe that triggers them without follow-through leaves late buyers trapped above a level the market did not accept. The composite is "anchored at the start of the current balance", as the notes and 03 recommend. Its edges are final profile levels (location B). The setup is untested (C).

**Swing holding.** Until Stage 0 shows that broker-held brackets survive the maintenance halt and the weekend, this proposal runs signal-only or attended ([07](07%20Automation%20architecture.md) §6).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | D1; COMP(balance) of at least 3 sessions; REGIME(W) not IMB in the probe direction | Same (clock) |
| LOCATION | BH/BL (COMP(balance) profile high/low); targets COMP POC and the opposite VA edge | Same |
| SETUP | RTH trade at least 1 tick beyond BH (or BL) | Same |
| TRIGGER | RTH M30 close back inside by at least 1 tick within 4 M30 periods of the first probe trade, while `accepted_beyond` is false | VB-A close back inside within the same 4-period clock window, same non-acceptance test |
| MANAGEMENT | Broker bracket; soft exit on later acceptance; D1 time stop | Same |

Stays on clock time in both versions: the session boundaries of the composite, the M30 acceptance periods, the 4-period window and the session-count time stop.

**Context filter.** COMP(balance) exists with at least 3 sessions and is frozen at the last RTH close. REGIME(W) is not IMB in the probe's direction: no fading a probe that goes with the weekly migration. Not in roll week.

**Location.** BH for a short (look-above-and-fail), BL for a long (look-below-and-fail).

**Setup.** An RTH trade at least 1 tick beyond BH.

**Trigger.** An M30 close at or below BH − 1 tick within 4 M30 periods of the first probe trade, while `accepted_beyond(BH, UP)` is false (fewer than two M30 closes beyond, or less than 15% of volume since the cross printed beyond). rr(T1) must be at least 1.0.

**Entry order.** Limit at the trigger close, valid 1 M30 period (time) or 2 VB-A bars (volume).

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | Probe extreme + BUF(M30), with the ATR floor |
| Sizing | Common R rule; micros are expected given multi-session stop widths |
| T1 / T2 | T1: COMP POC, 1 tick in front, 50%. T2: COMP VAL, 1 tick in front, 50% (mirrored for longs) |
| Breakeven / trail / time | Stop to breakeven at T1. Soft exit at market if `accepted_beyond(BH, UP)` becomes true at any later RTH M30 close. Time stop at the third RTH close after entry |
| Cancel / invalidation | 4 M30 periods with neither failure nor acceptance → EXPIRED. Acceptance before the trigger → INVALIDATED, and the edge passes to VP-13's watch |

**Filters.** Probes and triggers in RTH only. No entries in roll week. Common news rules, with positions held through scheduled events only on broker-held stops and only in attended mode. At most one attempt per edge per day and two per balance episode.

**Automation spec.**
- IDLE → ARMED on the probe.
- ARMED → ORDER_PENDING on the close back inside without acceptance.
- ARMED → INVALIDATED on acceptance, or → EXPIRED after 4 M30 periods.
- IN_POSITION → MANAGED → CLOSED via target, stop, soft exit or time stop.

```
on RTH close: C = COMP(balance) over completed RTH sessions; if C.sessions < 3: no balance
on RTH trade >= C.BH + 1 tick (and REGIME(W) != IMB_UP, not roll week): state = ARMED(edge=C.BH, d=DOWN, t_probe=now)
on TRIGGER-layer close (M30 | VB-A) while ARMED:
  if accepted_beyond(C.BH, UP): INVALIDATED("accepted -> VP-13 watch")
  elif now > t_probe + 4*M30: EXPIRED
  elif bar.c <= C.BH - 1 tick:
      stop = floor_stop(probe_high + BUF(M30), ATR(L))
      if rr(C.POC) >= 1.0: send limit(bar.c, expire=1 M30 | 2 VB-A) with bracket(stop, [C.POC + 1 tick (50%), C.VAL + 1 tick (50%)])
in position, each RTH M30 close: if accepted_beyond(C.BH, UP): exit_market("accepted")
at 3rd RTH close after fill: exit_market("time")
```

| Parameter | Default | Reason |
|---|---|---|
| Composite | COMP(balance): 3–20 overlapping RTH sessions, frozen at the last RTH close | Anchored at the balance start, per the notes |
| Edge | Composite profile high/low | A true look above the balance, not rotation inside it |
| Probe | At least 1 tick beyond | Minimal objective probe |
| Failure window | 4 M30 periods | Brooks' "within a bar or a few bars" for failed breakouts, at M30 scale |
| Acceptance test | 03's `accepted_beyond` (2 M30 closes, 15% volume) | One definition of acceptance across the family |
| Targets | COMP POC, then the opposite VA edge | 03's swing-stack management |
| Time stop | 3 RTH sessions | A balance fade that hasn't rotated in three sessions has lost its premise |

**Visual review checklist.**
1. Recreate COMP(balance) on Sierra as a date-range volume profile over the listed sessions, RTH data only. Confirm BH, BL, POC and VA. Confirm each session's value overlapped its predecessor's.
2. Mark the probe beyond BH and count the M30 closes beyond it: fewer than two, or a volume share under 15%.
3. Confirm the close back inside within 4 periods, the stop beyond the probe extreme and the targets.

Bot errors to look for:
- A non-overlapping (HIGHER/LOWER) session included in the run.
- A composite built from ETH while the chart shows RTH.
- Today's developing session included.
- Acceptance computed with ETH volume.
- BH taken from an ETH high.

**Failure modes & regime fit.** It suits mature, two-sided balances. It fails on the "failed failure", where a failure resumes as a breakout, and on weeks with migration in the probe direction (filtered), event weeks, very young balances and balances near the 20-session cap.

**Relations.** VP-13 is the opposite outcome at the same edge. They are mutually exclusive by the acceptance test and share one attempt budget per edge per day. When a prior-day VA edge coincides with BH, VP-03 and VP-12 share the level. It shares VP-01's "back to value" thesis on a larger scale, so only one of them may act on one excursion. The router blocks it against weekly migration (VP-14's regime).

## VP-13 Composite balance breakout with daily acceptance

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Swing | 1 – 5 sessions | ES/MES, NQ/MNQ, CL/MCL | Transition from multi-day balance to imbalance | C; location B | Med |

**Concept basis.** A breakout is the look-above test *passing*: acceptance beyond the edge signals continuation toward the next higher-dimension reference ([03](03%20Volume%20profile%20across%20timeframes.md)). In Market Profile lore, the other-timeframe participant's entry produces range extension and value migration (Background in 03). Value migration with the POC is the strongest version of that read ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/)). This proposal makes acceptance as strict as the profile allows: a full RTH session whose **POC** sits beyond the balance high. Most of that session's volume then traded outside the old balance.

The mechanism for follow-through is Osler's. Prices "trend strongly after crossing" levels where stop-losses cluster, and stop cascades last hours ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The entry follows Brooks' breakout pullback: a small pullback after a breakout is the resumption setup, while a failed breakout reverses within a few bars ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/)). The target uses the range-height measured move after a range breakout ([LuxAlgo, Measured Move](https://www.luxalgo.com/library/concept/measured-move/)). Grade C, with B-grade edge locations.

**Swing holding.** Signal-only or attended until Stage 0 answers the bracket-persistence question ([07](07%20Automation%20architecture.md) §6).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | D1; COMP(balance) of at least 3 sessions, frozen before the breakout session; REGIME(W) not IMB against d | Same (clock) |
| SETUP | PROFILE(RTH)[-1].POC > BH (or < BL): a full session of value accepted beyond the balance | Same |
| LOCATION | Retest zone [BH − 0.1 × ATR(D1), BH + 0.1 × ATR(D1)] | Same |
| TRIGGER | H1 close above zone.hi after trading in the zone | VB-A close above zone.hi after trading in the zone (finer, earlier) |
| MANAGEMENT | D1: value-based trail under each prior RTH VAL; soft exit if value returns inside | Same (clock) |

Stays on clock time in both versions: the composite and its sessions, the breakout session's POC, D1/H1 bars (H1 aligned to 17:00 CT on the ETH template) and the session-count expiry and time stop.

**Context filter.** COMP(balance), computed through the session *before* the breakout session, had at least 3 sessions. REGIME(W) is not IMB against d. Not in roll week.

**Location.** The broken edge BH (or BL) with a ±0.1 × ATR(D1) zone.

**Setup.** The breakout session closes with its POC beyond BH. The setup arms at that RTH close and stays armed for the next 3 RTH sessions.

**Trigger.** Price trades into the retest zone, then a TRIGGER-layer bar closes above zone.hi. rr(T1) must be at least 1.0.

**Entry order.** Limit at the trigger close, valid 2 TRIGGER-layer bars. A trigger that closes inside a no-entry window is placed when the window ends and keeps its original expiry.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | BH − 0.25 × ATR(D1) for a long (mirrored for shorts), with the ATR floor |
| Sizing | Common R rule; micros are expected |
| T1 / T2 | Balance height H = BH − BL. T1: BH + 0.5 × H, 50%. T2: BH + 1.0 × H, 50%, or the first WEEK/MONTH reference (VAH/VAL/POC, nPOC) between T1 and BH + H if nearer. All 1 tick in front |
| Breakeven / trail / time | Stop to breakeven at T1. At each RTH close, the runner's stop = max(stop, PROFILE(RTH)[-1].VAL − BUF(D1)). Soft exit at the next RTH open if a completed session's POC is back inside the balance. Time stop 5 sessions |
| Cancel / invalidation | No trigger within 3 RTH sessions → EXPIRED. A completed RTH session with its POC back below BH before entry → INVALIDATED |

**Filters.** Triggers in any session, but entries only inside the session filters. No entries in roll week. Common news rules. One attempt per breakout.

**Automation spec.**
- IDLE → ARMED at the RTH close whose POC is beyond BH.
- ARMED → ORDER_PENDING on the retest trigger.
- ARMED → EXPIRED after 3 sessions, or → INVALIDATED when value returns.
- IN_POSITION → MANAGED, with the daily value trail → CLOSED.

```
on RTH close (session s):
  C = COMP(balance) through s-1 (frozen); if C.sessions < 3 or roll_week: return
  if PROFILE(RTH)[s].POC > C.BH and REGIME(W) != IMB_DOWN:
      state = ARMED(level_id = hash("BH", C.first_session, C.BH), d = UP, expires = s + 3 sessions)
on TRIGGER-layer close (H1 | VB-A) while ARMED:
  zone = [C.BH - 0.1*ATR(D1), C.BH + 0.1*ATR(D1)]
  if traded_in(zone, since=arm) and bar.c > zone.hi:
      stop = floor_stop(C.BH - 0.25*ATR(D1), ATR(L)); H = C.BH - C.BL
      T2 = nearer(C.BH + H, first_ref(WEEK/MONTH, between=(C.BH + 0.5*H, C.BH + H)))
      if rr(C.BH + 0.5*H) >= 1.0: place_when_allowed(limit(bar.c, expire=2 bars), bracket(stop, [C.BH + 0.5*H (50%), T2 (50%)]))
on RTH close while ARMED or in position:
  if PROFILE(RTH)[-1].POC < C.BH: (INVALIDATED if ARMED else exit_at_next_open("value back inside"))
  if post_T1: stop = max(stop, PROFILE(RTH)[-1].VAL - BUF(D1))
```

| Parameter | Default | Reason |
|---|---|---|
| Acceptance | A full RTH session's POC beyond the edge | Value, not just price, has migrated; the strictest profile-native test |
| Composite | COMP(balance), frozen before the breakout session | The breakout session must not redefine the balance it breaks |
| Retest zone | ±0.1 × ATR(D1) around BH | A small, volatility-scaled tolerance |
| Retest window | 3 RTH sessions | Breakout pullbacks come soon or not at all |
| Stop | BH − 0.25 × ATR(D1) | Deep enough to survive a retest wick; a deeper return re-enters the balance |
| Targets | 0.5 H and 1.0 H beyond BH, or a nearer WEEK/MONTH reference | Range-height measured move, capped by higher-dimension references |
| Trail | Prior RTH VAL − BUF(D1) | A value-based trail that needs no swing structure |
| Time stop | 5 sessions | About one week, matching Osler's horizon for level effects |

**Visual review checklist.**
1. Recreate COMP(balance) through the session before the breakout and confirm BH, BL and H.
2. Confirm the breakout session's RTH POC is beyond BH.
3. Mark the retest zone and the H1 or VB-A close back above it, the stop below BH and the targets.
4. Step through the daily trail. It may rise only to the prior RTH VAL − buffer.

Bot errors to look for:
- The breakout session included in the composite.
- The breakout session's POC computed from ETH.
- A retest zone in fixed ticks.
- H1 bars aligned to midnight instead of 17:00 CT.
- A soft exit triggered by a developing (not completed) session.

**Failure modes & regime fit.** It suits balance breakouts with real value migration. It fails when strong breakouts never retest (logged as misses), when a retest goes deep into the balance, when the weekly context opposes, and when CL gaps through the stop.

**Relations.** VP-12 is the opposite outcome at the same edge. The breakout session often makes VP-14's next weekly setup. Breakouts often traverse a composite LVN, which is VP-09 at scalp scale and counts as one risk unit. VP-10 targets (higher-dimension nPOCs) frequently cap T2.

## VP-14 Weekly value-migration VAL buy

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Swing | 1 – 7 sessions | ES/MES, NQ/MNQ, CL/MCL | Imbalance (weekly migration) | C; location B | Low |

**Concept basis.** 03's migration table gives the tactic directly: when value is entirely higher, "favour responsive buys at the new VAL; avoid fading highs" ([03](03%20Volume%20profile%20across%20timeframes.md)). A POC that migrates with the value area strengthens the read ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/)). A trade aligned with value migration on two or more dimensions is "with the OTF", which is why the monthly profile is used as a second CONTEXT check. Trader Dale's confluence examples lean on the weekly POC ([Trader Dale, Oct 2025](https://trader-dale.blogspot.com/2025/10/trade-of-week-perfect-confluence-volume.html)), and he publishes higher-timeframe swing material whose rules were not extracted ([Trader Dale, May 2026](https://trader-dale.blogspot.com/2026/05/swing-trading-with-volume-profile.html)).

The horizon fits the strongest evidence in the set. Osler found that published support and resistance levels kept predictive power for **at least five business days** ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Chung & Bellotti's decay argues for using only last week's profile ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)). Grade C for the setup, B for the weekly VAL as a location.

**Swing holding.** Signal-only or attended until Stage 0 answers the bracket-persistence question ([07](07%20Automation%20architecture.md) §6).

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | W1; REGIME(W) = IMB in d (WEEK[-1] vs WEEK[-2]); WO above PROFILE(MONTH)[-1].POC (for longs) | Same (clock) |
| LOCATION | Zone [WEEK[-1].VAL − 0.1 × ATR(D1), WEEK[-1].VAL + 0.1 × ATR(D1)] | Same |
| SETUP | Price trades into the zone during the current week | Same |
| TRIGGER | H4 close above zone.hi after trading in the zone, with no D1 close below zone.lo since the touch | VB-A close above zone.hi under the same condition (finer: fires earlier and more often) |
| MANAGEMENT | D1: value trail under each prior RTH VAL; H4 for entry expiry | Same D1 trail; VB-A for entry expiry |

Stays on clock time in both versions: the WEEK (Sunday 17:00 to Friday 16:00 CT, ETH) and MONTH profiles, WO, D1 and H4 bars (17:00, 21:00, 01:00, 05:00, 09:00 and 13:00 CT, with the 13:00–16:00 bar flagged short), the weekend rule and the session-count time stop.

**Context filter.** REGIME(W) is IMB_UP for longs (IMB_DOWN for shorts), computed at the Sunday 17:00 CT open from the last two completed weeks. The weekly open WO is above the last completed month's POC for longs. Not in roll week.

**Location.** WEEK[-1].VAL, the bottom of the newly accepted value, with a ±0.1 × ATR(D1) zone.

**Setup.** Any trade in the zone during the current week.

**Trigger.** A TRIGGER-layer close above zone.hi after the touch, provided no D1 bar has closed below zone.lo since the touch. rr(T1) must be at least 1.0.

**Entry order.** Limit at the trigger close, valid 1 H4 bar (time) or 3 VB-A bars (volume). A trigger that closes in a no-entry window is placed when the window ends and keeps its original expiry. No new entries after Friday 12:00 CT.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | zone.lo − BUF(D1), with the ATR floor. Skip if the stop distance exceeds 1.5 × ATR(D1) |
| Sizing | Common R rule; micros are expected |
| T1 / T2 | T1: WEEK[-1].POC, 1 tick in front, 50%. T2: PWH, 1 tick in front, 50% (mirrored for shorts) |
| Breakeven / trail / time | Stop to breakeven at T1. At each RTH close, the runner's stop = max(stop, PROFILE(RTH)[-1].VAL − BUF(D1)). Time stop 7 RTH sessions. Weekend: hold only after T1 (stop at breakeven or better); otherwise flatten at Friday TC − 5 |
| Cancel / invalidation | A D1 close below zone.lo before the trigger → INVALIDATED for the week. Week end → EXPIRED |

**Filters.** Common news rules: no new entries in blackout windows, and in attended mode, judgment on holding through FOMC weeks. No roll-week entries. At most one entry per week per instrument.

**Automation spec.**
- IDLE → ARMED at the Sunday open if the context holds.
- ARMED → ORDER_PENDING on the trigger.
- ARMED → INVALIDATED on a D1 close below the zone, or → EXPIRED at week end.
- IN_POSITION → MANAGED, with the daily trail and weekend rule → CLOSED.

```
on Sunday 17:00 CT:
  W1, W2, M1 = PROFILE(WEEK)[-1], PROFILE(WEEK)[-2], PROFILE(MONTH)[-1]
  if REGIME(W) != IMB_UP or WO <= M1.POC or roll_week: idle_for_week      # mirror for IMB_DOWN
  zone = [W1.VAL - 0.1*ATR(D1), W1.VAL + 0.1*ATR(D1)]; state = ARMED(level_id = hash("WVAL", W1.id))
on D1 close while ARMED: if touched(zone) and bar.c < zone.lo: INVALIDATED
on TRIGGER-layer close (H4 | VB-A) while ARMED and before Friday 12:00 CT:
  if touched(zone) and bar.c > zone.hi:
      stop = floor_stop(zone.lo - BUF(D1), ATR(L))
      if (entry - stop) <= 1.5*ATR(D1) and rr(W1.POC) >= 1.0:
          place_when_allowed(limit(bar.c, expire=1 H4 | 3 VB-A), bracket(stop, [W1.POC - 1 tick (50%), PWH - 1 tick (50%)]))
on RTH close in position: if post_T1: stop = max(stop, PROFILE(RTH)[-1].VAL - BUF(D1))
on Friday TC-5: if not post_T1: exit_market("weekend")
```

| Parameter | Default | Reason |
|---|---|---|
| Migration test | REGIME(W) = IMB (higher value, or overlapping with POC above the prior VAH) | 03's migration table; POC confirmation per LuxAlgo |
| Second dimension | WO beyond MONTH[-1].POC | "With the OTF" on two dimensions |
| Location | Last week's VAL ± 0.1 × ATR(D1) | 03: responsive buys at the new VAL |
| Trigger | H4 (or VB-A) close back above the zone | A minimal bar-close rejection of the new value's floor |
| Stop | Below the zone by BUF(D1); skip if over 1.5 × ATR(D1) | Below the new value's floor; the cap keeps R affordable in micros |
| Targets | Last week's POC, then PWH | POC first, per 03's swing management |
| Trail / time | Prior RTH VAL; 7 sessions | Value-based trail; about Osler's five-day horizon plus two days |
| Weekend rule | Hold only after T1 | The weekend gap is the largest unmanaged risk |

**Visual review checklist.**
1. Draw last week's and the prior week's volume profiles (Sunday 17:00 to Friday 16:00 CT, ETH, 1-tick rows, Sierra VA). Confirm the relation and POC placement that make IMB.
2. Draw last month's profile and confirm WO is above its POC.
3. Mark the VAL zone, the touch, the H4 or VB-A close back above it, and the absence of a D1 close below.
4. Check the stop, T1 at last week's POC, T2 at PWH, the daily trail steps and the Friday rule.

Bot errors to look for:
- A week boundary at Monday 00:00.
- A holiday-shortened week treated as normal.
- The current week's developing profile used.
- H4 bars aligned to midnight, unlike 07's 17:00 CT alignment.
- A monthly profile built on calendar days instead of trade dates.
- Unshifted pre-roll weeks.

**Failure modes & regime fit.** It suits sustained weekly migration. It fails when value rotates back (the week turns into balance), in event weeks, roll weeks and CL OPEC gaps, and on pullbacks that slice through the VAL. Expect only a handful of signals per instrument per quarter, so run ES, NQ and CL with identical rules.

**Relations.** It often follows a VP-13 breakout week. The router blocks VP-12 fades against it. While a VP-14 position is open, intraday proposals on the same instrument root are signal-only under the one-position rule. That is the cost of netting, and it is the reason to run swing and intraday validation on different instruments at first. CX-family proposals may add a geometric LOCATION in the same zone; they must count the weekly VAL as the PROFILE dimension only once.

## VP-15 Anchored impulse-leg POC pullback

**At a glance**

| Style | Typical hold | Instruments | Regime | Evidence | Automation |
|---|---|---|---|---|---|
| Intraday | 20 min – 3 h | ES/MES, NQ/MNQ, CL/MCL | Imbalance (trend continuation) | C; location B (leg POC/HVN) | High (swings + ANCH) |

**Concept basis.** Practitioners draw a fixed-range profile from one swing point to the next. Swing traders profile "the last major swing high to swing low", then wait for price to come back to the POC ([ForexTester, Fixed Range Volume Profile](https://forextester.com/blog/fixed-range-volume-profile/); [FuturesHive](https://www.futureshive.com/blog/volume-profile-trading-strategy-2025)). An open-source script automates a profile per completed swing leg ([TradingView, Swing Volume Profile Pro](https://id.tradingview.com/script/7yozLqCv-Swing-Volume-Profile-Pro-WillyAlgoTrader/)). Trader Dale's flagship setup waits for a pullback into a volume cluster where price reacted before and enters "from the beginning of that volume cluster" ([Trader Dale, Dec 2025](https://trader-dale.blogspot.com/2025/12/my-1-volume-profile-setup-step-by-step.html); snippet-level only).

The concept-interplay reading makes the leg's POC the "fair price of the impulse". It also notes that a pullback slicing through an LVN tends to reach the next HVN, so the HVN, not the LVN, is the location within an intact trend ([06](06%20How%20the%20dimensions%20interact.md)). Two rules carry over:

- Anchors must come from one predeclared pivot rule, never chosen by eye.
- ANCH(A→B) is usable only from B's `confirm_ts` ([07](07%20Automation%20architecture.md) §2.7).

The leg POC is an HVN, a B-grade location per 03. The setup is untested (C).

**Anchor detector.** Pivot(L,3,3), for the same reason as VP-07: a 2-ATR ZigZag confirmation would usually have consumed the pullback.

**Chart stack**

| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | REGIME(D) is IMB or TENT in d | Same (clock) |
| LOCATION | POC zone of PROFILE(ANCH(A→B)), anchors from Pivot(M15,3,3) on RTH legs | Anchors from Pivot(VB-A,3,3) |
| SETUP | Pullback into the POC zone after B.confirm_ts, before any trade beyond A | Same |
| TRIGGER | STRUCTURE(M5) CHoCH back in d while price is in the zone (or within 0.25 × ATR(M15) beyond it) | STRUCTURE(VB-B) CHoCH, same condition |
| MANAGEMENT | M15 bars for the time stop | VB-A bars for the time stop |

Stays on clock time in both versions: the prior RTH profiles behind REGIME(D), T0 and the RTH window.

**Context filter.** REGIME(D) is IMB or TENT in d. The leg is not owned by VP-07 (an RTH breakout leg out of yesterday's value with a separation LVN) or VP-08 (a leg with a target balance ahead).

**Location.** The leg must qualify on four counts:
- B exceeds the previous confirmed swing high, so the leg is an impulse to a new extreme;
- the leg height B − A is at least 3 × ATR(M15);
- A.pivot_ts ≥ T0, so the leg is RTH-only and avoids thin-overnight artefacts;
- the profile is built from all prints between the two pivots.

The location is the HVN zone containing the leg POC, at width at half height, clipped to POC ± 0.25 × ATR(M15).

**Setup.** At B.confirm_ts the zone must still lie at least 0.25 × ATR(M15) below price; if not, the setup EXPIRES as consumed. Price then trades into the zone without trading below A.

**Trigger.** STRUCTURE(M5) (or STRUCTURE(VB-B)) emits CHoCH_UP while price is in or just above the zone, within 8 M15 bars of activation and before TC − 60. A logged signal-only variant uses CLOSE_BACK(M5, POC, UP, 3) instead, so the simpler trigger can be compared.

**Entry order.** Limit at the CHoCH bar's close, valid 2 TRIGGER-layer bars.

**Risk & management**

| Item | Rule |
|---|---|
| Initial stop | min(zone.lo, pullback low) − BUF(M15), with the ATR floor. Skip if the stop distance exceeds 0.5 × (B − A) |
| Sizing | Common R rule |
| T1 / T2 | T1: B, 1 tick in front, 50%. T2: REF_BEYOND(B, d, rr ≥ 2.0, within 1.5 × ATR(M30)), 50%; if none, 100% at T1 |
| Breakeven / trail / time | Stop to breakeven at T1. Time stop after 8 M15 bars in the trade without T1. Flat by TC − 5 |
| Cancel / invalidation | An M15 close below zone.lo before the trigger → INVALIDATED, since the fair price failed and the next HVN or the origin is in play. A trade below A → INVALIDATED. A new confirmed swing beyond B → CANCELLED and re-anchored as a new version. 8 M15 bars after activation without a trigger → EXPIRED |

**Filters.** RTH, T0+30 to TC − 60. Common rules. One attempt per leg, two per day.

**Automation spec.**
- IDLE → ARMED at B.confirm_ts if the leg qualifies and the zone is untouched.
- ARMED → ORDER_PENDING on the CHoCH.
- ARMED → INVALIDATED, CANCELLED or EXPIRED.
- IN_POSITION → MANAGED → CLOSED.

```
on Swing(H) confirmed on anchor layer L_A (M15 | VB-A), t = B.confirm_ts:
  A = last_confirmed_swing_low_before(B)
  if A.pivot_ts < T0 or B.price <= prev_confirmed_SH.price or (B.price - A.price) < 3*ATR(M15): return
  if REGIME(D) not in {IMB_UP, TENT_UP} or owned_by(VP-07, VP-08, leg=(A,B)): return
  H = PROFILE(ANCH(A->B)); z = clip(hvn_zone_containing(H.POC, nodes(H, sigma(ANCH))), H.POC +/- 0.25*ATR(M15))
  if last_price < z.hi + 0.25*ATR(M15): EXPIRED("consumed"); return
  state = ARMED(level_id = hash("APOC", L_A, A.id, B.id))
on TRIGGER-layer event while ARMED:
  if M15 close < z.lo or traded_below(A.price): INVALIDATED
  if event == CHoCH_UP on STRUCTURE(M5 | VB-B) and price within [z.lo, z.hi + 0.25*ATR(M15)]:
      stop = floor_stop(min(z.lo, pullback_low) - BUF(M15), ATR(L))
      if (entry - stop) <= 0.5*(B.price - A.price):
          T2 = REF_BEYOND(B.price, UP, rr_min=2.0, max_dist=1.5*ATR(M30))
          send limit(bar.c, expire=2 bars) with bracket(stop, [B - 1 tick (50%), T2 (50%)] if T2 else [B - 1 tick (100%)])
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor detector | Pivot(M15,3,3) / Pivot(VB-A,3,3), RTH legs only | Bounded confirmation lag; no overnight-volume artefacts |
| Leg qualification | New extreme; height ≥ 3 × ATR(M15) | An impulse, and room for the POC to sit below price at confirmation |
| Location | HVN zone around the POC, clipped to ± 0.25 × ATR(M15) | Fair price of the impulse; the clip keeps fat nodes from becoming wide stops |
| Trigger | STRUCTURE CHoCH back in d (shared detector, k = 2.0) | The brief's "small LTF CHoCH"; the close-back variant is logged for comparison |
| Stop cap | 0.5 × leg height | Beyond that the trade is no longer a pullback in an impulse |
| Targets | B, then the next reference with rr ≥ 2.0 | Retest of the impulse extreme; a runner only if a real reference lies beyond |
| Time limits | 8 M15 bars to trigger and to T1 | About two hours |

**Visual review checklist.**
1. Overlay ANCH(A→B) from the engine (smoothed histogram, POC and its HVN zone) with markers at A.pivot_ts, B.pivot_ts and B.confirm_ts.
2. Confirm that B is a new extreme, the leg height is at least 3 × ATR(M15) and the zone was still below price at confirmation.
3. Find the pullback into the zone and the M5 or VB-B CHoCH, a close above the last confirmed lower high of the pullback.
4. Check the stop, the cap, and the targets at B and beyond.

Bot errors to look for:
- The profile anchored at a provisional extreme.
- ANCH extended past B.
- The setup activated before B was confirmed.
- A different pivot rule from the declared one.
- A CHoCH computed on an unconfirmed swing.

**Failure modes & regime fit.** It suits steady trends with two-sided trade inside impulses. It fails in weakening trends where pullbacks run through the POC to the leg origin, on top-heavy legs where the POC sits near B (skipped at activation), and on shallow pullbacks that never form M5 swings. In that last case no CHoCH can fire, and the logged close-back variant shows what was missed.

**Relations.** Leg ownership goes to VP-07 or VP-08 first. VP-06 is the same "POC as fair price" idea on a session anchor, so the two are one risk unit on the same day. The FIB family anchors retracements on the same swings. Under the shared confluence rule, the anchored POC is PROFILE and a Fib level is GEOMETRY, two dimensions, but they share time anchors, so 06 treats them as only partly independent. CX proposals must not count them as fully separate confirmations.

## Forward-validating the family, where to start, and which proposals to keep apart

### Prove the engine before judging any proposal

Every proposal here fails silently if the engine draws different levels from the reviewer's chart. Stage 0 therefore includes [03](03%20Volume%20profile%20across%20timeframes.md)'s daily diff for the first 20 sessions. Each item must agree with a Sierra Chart profile configured to match (1-tick rows, 1-tick data, volume VA at 70%, single-row, two-level option off, M30 TPO periods with letters at T0):

| Item | Required agreement |
|---|---|
| POC, VAH, VAL | Exact |
| HVN/LVN | Same major nodes (qualitative) |
| nPOC set | Same set |
| IB, singles, poor extremes | Exact |
| dPOC at every trigger | Exact to the logged value on replay |

The VB tiers must match the platform bar for bar under the same split and session-break settings ([05](05%20Volume%20bars%20versus%20time%20bars.md)). Any non-zero POC or VA difference is an engine bug until explained. Only then do the checklists above mean anything.

### Run each proposal through 07's stages with frozen rules

Each proposal moves through [07](07%20Automation%20architecture.md)'s stages under its own `strategy_version`. Any change to a rule or parameter starts a new sample.

| Stage | What runs | Pass condition |
|---|---|---|
| 1. Signal-only | At least 4–6 weeks **and** 30–50 signals per proposal, whichever is later | Agreement ≥ 80% and zero look-ahead defects in the determinism test |
| 2. Simulated execution | At least 50–100 trades; limit fills scored twice, on touch and in a conservative trade-through column | After at least 50 trades, E > 0 with a lower 80% bound above −0.1R and slippage within budget. Abort if E < −0.3R after 30 trades |
| 3. Replay rehearsal | The calendar's stress days: Thanksgiving and its half-day (Nov 26–27), NFP (Dec 4), FOMC (Dec 8–9) and the December equity roll (Dec 14 by the stated rule) | Blackouts, flattening, roll handling and short-session flags all behave correctly |
| 4. One micro live | 1 MES/MNQ/MCL | Same statistics, plus live-versus-sim slippage |

Sample size is the binding constraint. The 2008 test saw 41 VP-01 triggers in 119 sessions, about one every three days, so 40 triggers take roughly six months per instrument ([03](03%20Volume%20profile%20across%20timeframes.md)). The swing proposals fire less often still. Run ES, NQ and CL in parallel with identical rules. Segment results by instrument or regime only to diagnose, never to retune mid-sample.

### Measure what the research could not

The notes leave specific numbers unknown, and forward validation can supply them without any tuning:

- **VP-01:** the rate at which T1 (the prior POC) is reached, alongside the full-traverse rate, to compare with 39–40%.
- **VP-10:** the in-session touch rate of each target type and age band.
- **VP-11:** the HOLD/FILL split.
- **VP-09:** traverse speed distributions.
- **VP-08:** how often large delta is absorbed rather than followed.

Fade proposals (VP-03, VP-12, and VP-01's first leg) also need a **placebo control**, borrowed from Osler's method of testing published levels against arbitrary ones. In signal-only mode, run the identical trigger at a pseudo-level shifted ±0.5 × ATR(L_P) from the real edge, and compare reaction rates. Osler's 60.8% against 56.2% shows how high the base rate for any level is ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). A profile edge that cannot beat its placebo is not adding anything.

### Start with VP-03, VP-05 and VP-14

These three are the right first cohort for four reasons:

- **Different regimes and horizons.** VP-03 is the balance scalp, VP-05 the intraday imbalance trade and VP-14 the weekly swing. They rarely want the same position at the same time.
- **Lowest complexity.** All three rate Low, and they read only *final* profiles (prior RTH, prior week, prior month) plus the clock-time IB. That keeps developing values, HVN/LVN detection, single-print ports and order flow out of the first validation cycle.
- **Better-supported locations.** Each puts its LOCATION on a B-grade level: a prior value edge, the IB extreme or the weekly VAL.
- **Clean visual reviews.** Every signal can be checked on a standard Sierra chart without engine overlays.

VP-03 and VP-05 also fire often enough to fill a Stage 1 sample in weeks. VP-14 is slow, which is the reason to start it now. Until Stage 0 answers the bracket-persistence question it stays signal-only or attended, which costs nothing during Stage 1.

The suggested second cohort is VP-01 and VP-12, which add M30 acceptance logic and the composite. After that come VP-02, VP-04, VP-06 and VP-10. The high-complexity proposals (VP-07, VP-08, VP-09, VP-11 and VP-15) should wait until the HVN/LVN detector and the swing anchors have passed their own visual reviews.

### Proposals that should not run together

| Pair or group | Why | Rule |
|---|---|---|
| VP-07, VP-08, VP-09 at one LVN | Rejection and traverse are opposite readings of the same node | One owner per LVN (first to arm). In the first validation cycle, run at most one of the three per instrument |
| VP-07 or VP-08 with VP-15 on one leg | LVN-as-hold and POC-as-fair-price are competing locations on the same anchored profile | Leg ownership: VP-08 if a target balance exists, else VP-07 if it is a breakout leg with a separation LVN, else VP-15 |
| VP-01 and VP-12 on one excursion | Both express "back to value"; together they double one thesis | One per excursion; the composite-scale VP-12 takes precedence when its edge is involved |
| VP-02, VP-05, VP-06, VP-10 on one day | All are trend-day bets in the same direction, so their outcomes are correlated | Treat as one risk unit; one position per instrument enforces it |
| VP-04 with VP-02 | Opposite readings of the open: correct the inventory, or follow the drive | Don't co-run in the first cycle; the router already cancels VP-04 on OUT_RANGE opens |
| VP-12 with VP-13 | Opposite outcomes at one edge | They may co-run because the acceptance test makes them exclusive, but they share one attempt budget per edge per day |
| VP-03 with VP-12 (or VP-11) at one price | Two proposals at one level double-count a single LOCATION | One per level |
| Any swing (VP-12, VP-13, VP-14) with intraday proposals on one instrument root | Futures positions net per contract | Run swing and intraday validation on different instruments, or accept intraday as signal-only while the swing position is open |

The family's lasting product may be the router and the engine rather than any single setup. Once the engine classifies balance against imbalance and acceptance against rejection the same way every time, the proposals become fifteen cheap, frozen hypotheses about where auction behaviour pays. They share one data path, one value-area method and one set of fences, so a forward sample will show which of them deserve the user's capital and which only looked convincing in hindsight.
