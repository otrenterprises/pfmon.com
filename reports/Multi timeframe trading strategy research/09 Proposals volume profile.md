# Let the auction pick the trade: fifteen volume profile proposals

**Volume profile and auction market theory support fifteen distinct strategies that can be triggered automatically (VP-01 to VP-15), but none of them rests on a tested edge.** They are built to fail cheaply and to be forward-validated, not trusted. In each proposal the profile supplies CONTEXT and LOCATION. A single bar-close price event is the TRIGGER, and confirmed swings appear only as anchors for anchored profiles. Each proposal ships in a clock-time and a constant-volume-bar version, with a state machine and pre-committed defaults. The set covers every profile dimension: session, overnight, weekly, monthly, composite and swing-anchored. It runs from scalps through multi-day swings and covers balance (responsive) and imbalance (initiative) regimes, with one shared value-migration router deciding which proposals may arm. The evidence is thin. The research found no peer-reviewed test of value areas, the 80% rule, naked POCs or HVN/LVN behaviour in futures. The one informal test of the 80% rule saw complete traverses on only **16 of 41 ES triggers (39%)** ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). The support sits one level down, in the general mechanism. Support and resistance levels coincide with peaks in order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). Take-profit orders cluster at salient prices, and stop orders cluster just beyond them ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). Levels that have held tend to hold again, but that tendency fades over time ([Chung & Bellotti 2021](https://arxiv.org/abs/2101.07410v1)). That support is why every setup here grades C, why the better ones put their LOCATION on a B-grade profile level, why first targets are the nearer reference (usually a POC) and why every stop sits beyond the obvious level. Begin forward validation with **VP-03, VP-05 and VP-14**. Between them they cover balance, imbalance and the weekly horizon, and they use only final profiles and the clock-time initial balance.

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
| One position per instrument | Both brokers net positions per contract. While a position is open, a signal from any other proposal on the same contract is logged, not traded | Design default |
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
| `COMP(balance)` | Extends COMP(n weeks) to a balance anchor. Take the longest run of consecutive completed RTH sessions ending at [-1] in which each session's VALUE_REL to its predecessor is INSIDE, OUTSIDE, OVERLAP_UP or OVERLAP_DOWN. Use at least 3 and at most 20 sessions (if longer, the last 20). The RTH histograms of that run are summed. Its profile high and low are the balance edges BH and BL. Today's developing session is never included. This follows the notes' "composite over a balance area, anchored at the start of the current balance" |

Each proposal's own CONTEXT filter is authoritative. The table only summarizes which proposals the router lets arm in each state.

| Router state at decision time | May arm | Blocked |
|---|---|---|
| Open OUT_VALUE or OUT_RANGE, OPEN_TYPE = OD or OTD away from value | VP-02, then VP-05, VP-06 and VP-10 in the drive direction | VP-01, VP-03, VP-04; VP-08 against the drive |
| Open OUT_VALUE or OUT_RANGE, no drive away from value | VP-01; VP-04 until T0+30 if OUT_VALUE | VP-02 |
| Open IN_VALUE, no OD or OTD | VP-03; VP-04 until T0+30; VP-11 | VP-02 |
| REGIME(D) is IMB or TENT in direction d | VP-05, VP-07, VP-08, VP-10 and VP-15 in d; VP-09 and VP-11 HOLD unless against d | VP-03 when IMB |
| REGIME(D) is BALANCE or EXPANSION | VP-03 (BALANCE only); VP-05 with the IB-side tiebreak; VP-11 FILL | VP-15 |
| COMP(balance) of at least 3 sessions exists | VP-12, VP-13 | — |
| REGIME(W) is IMB in direction d | VP-14 in d; VP-13 in d | VP-12 fades of probes in direction d |

## The fifteen proposals at a glance

| ID | Name | Style | Profile(s) | Stack: time / volume | Regime | Evidence | Complexity |
|---|---|---|---|---|---|---|---|
| VP-01 | Value-area re-entry traverse ("80% rule") | Intraday | RTH[-1] | D1 · M30 / M30 + VB-B variant | Rejected outside open returning to balance | C (headline D; location B) | Med |
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
