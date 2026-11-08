# Turning swing structure into fifteen bot-ready strategies

*File 08 of the multi-timeframe research set: proposals built from swing structure, price-action triggers and clock-time reference levels only (IDs PA-01 to PA-15). Reading order and file map: [00 Index and reading guide](00%20Index%20and%20reading%20guide.md).*

Fifteen genuinely distinct, automatically triggerable strategies can be built from confirmed swing structure, price-action triggers and clock-time levels alone, from scalps on constant-volume bars to month-long positions on weekly candles, without touching volume profile or Fibonacci. Only two of them rest on peer-reviewed evidence for the signal itself: the first-half-hour return predicting the last half-hour (PA-11, **R² about 1.6% in SPY, 1993–2013**) ([Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)) and 1–12-month time-series momentum across **58 futures and forwards** (PA-12) ([Moskowitz, Ooi & Pedersen 2012](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). Six more, the level-reaction and trend-continuation templates, lean on indirect but credible evidence that prices react more often than chance at widely watched prior highs and lows (**60.8% vs 56.2% bounce rates** in intraday FX) and that stop orders cluster just beyond such levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf); [Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The other seven are clean, codable versions of practitioner methods with no rigorous support. They are graded C and labelled that way. Volume bars change only the intraday setup and trigger layers. Weekly and daily bars, every reference level, session windows and news blackouts stay on clock time. Every number below is a pre-committed starting value drawn from the research notes or labelled as a design proposal, not an optimized result, and every proposal is a hypothesis to forward-validate in signal-only mode. Start with PA-11, PA-01 and PA-04. Between them they exercise the three engines the whole family needs (clock and session logic, multi-layer swing structure, and the level registry), and they produce signals often enough to judge within weeks.

## Small edges at watched levels are this family's honest foundation

Every proposal uses three ingredients and nothing else. The first is confirmed swing structure: SWING(L) and STRUCTURE(L) on each layer, with BOS, CHoCH and the G1/G2/G3 trend-change grades. The second is price-action triggers: structure breaks, sweep-and-reclaim failures and signal-bar breaks. The third is clock-time reference levels (LEVELS: PDH/PDL/PDC, ONH/ONL, PWH/PWL/PWC, WO/DO, IBH/IBL, ORH/ORL). Volume profile and Fibonacci are deliberately absent. They belong to [09 Proposals volume profile](09%20Proposals%20volume%20profile.md) and [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md), and the combinations belong to [11 Proposals confluence](11%20Proposals%20confluence.md). Each proposal gives exactly one pre-declared condition to each role (CONTEXT, LOCATION, SETUP, TRIGGER, MANAGEMENT), following [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md). The higher layer decides direction, the level decides where, and the lowest layer decides when and defines the stop. That is the template shared by Dow's nested trends, Elder's tide, wave and ripple, and the modern "higher-timeframe bias plus a lower-timeframe structure shift at a higher-timeframe level" ([LuxAlgo: MTF structure alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/); [Incredible Charts: Dow Theory](https://www.incrediblecharts.com/technical/dow_theory_trends.php)).

The credible evidence is narrow, and it is worth stating exactly. Support and resistance levels published by six FX firms interrupted intraday trends **60.8% of the time against 56.2% for arbitrary levels**. Published levels beat arbitrary ones in **all 16 firm-currency pairs**, and their predictive power lasted at least five business days. Yet no firm could tell which of its own levels were strong ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Stop-loss orders cluster just beyond salient prices. When they trigger they produce unusually rapid moves that stay statistically significant **for hours, not days** ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). Support and resistance levels also coincide with peaks in limit-order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). These findings support both halves of level trading: the failure-and-reclaim when the stop pool is absorbed, and the continuation when the cascade runs. They do not say which one will happen. That is why every level proposal here lets the higher-layer state choose one branch in advance, and never both. None of the named swing constructs (BOS, CHoCH, 2B, 1-2-3, H2) has rigorous out-of-sample support in futures. They operationalize the mechanism; they are not independently proven edges ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)). Candlestick patterns used alone are **grade D**: 28 candlestick signals on DJIA stocks from 1992 to 2002 showed no predictive power under bootstrap tests ([Marshall, Young & Rose 2006](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323); [CXO Advisory summary](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/)). In this file, bar patterns appear only as timing and stop devices inside swing context. No study tests multi-timeframe alignment itself ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)).

Two cautions apply to everything below. First, the level evidence comes from 1990s FX and older US equities, so the size of these effects in today's algorithm-heavy CME books is unknown. Second, visual review is itself a fitting loop. The probability of a spurious result rises with the number of configurations tried ([Bailey et al. 2014](https://scholarworks.wmich.edu/math_pubs/40/)), so the parameters here are frozen starting values. Changing any of them starts a new `strategy_version` and a new sample ([07 Automation architecture](07%20Automation%20architecture.md)).

Volume bars get the same scrutiny. Sampling E-mini S&P futures every **1/50 of average daily volume** made returns visibly closer to normal and removed most intraday seasonality. The evidence is a plot, not a test statistic, and independent reproductions find that returns stay fat-tailed ([Easley, López de Prado & O'Hara 2012](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). Practitioners report that bar, trendline and swing reading carries over to constant-volume and tick charts. Asked whether this works, Brooks course staff answered "Yes, and yes", and Galen Woods notes that bar-pattern analysis survives on constant-volume charts but not on range charts ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/); [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). No study shows that price-action triggers work *better* on volume bars. Mandelbrot's caveat is the binding constraint: volume time cannot be converted into clock time in advance ([Volume Clock paper](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). So anything with a clock deadline stays on time bars. Every proposal therefore gives a time-bar stack and a volume-bar stack, and the volume version swaps only intraday layers. VB-B (ADV/250) corresponds roughly to a 3–5-minute RTH chart. By the 5× and 4× tier ratios, VB-A (ADV/50) works out to roughly 15–25 minutes and VB-C (ADV/1000) to about a minute or less at average activity. Treat those equivalences as arithmetic to check on your own charts ([05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md)).

Some brief candidates were merged or dropped rather than padded into separate proposals. Measured-move targets became a shared management convention (MM, below), because a target is not an entry. Double tops are covered by PA-13 (a 1-2-3 whose third point equals the first) and by PA-14. Inside-bar breaks live inside PA-07 and PA-08. Wedges and three-push patterns were dropped, because what counts as a "push" depends on swing granularity, and the notes flag that as risky to automate. Standalone pin-bar and engulfing entries were dropped as grade D.

### Common rules every proposal inherits

These rules apply to every PA proposal unless its own section overrides them. Implementation details (bar builders, level registry, risk manager, order manager, decision records, reconciliation) are in [07 Automation architecture](07%20Automation%20architecture.md).

| Rule | Pre-committed default | Basis |
|---|---|---|
| Risk unit | 1R = a fixed dollar risk the user sets, inside broker and prop-firm limits. `qty = floor(1R / (stop_ticks × tick_value))`. If qty < 1 micro, **skip the trade** rather than widen risk. Tick values: MES $1.25, ES $12.50, MNQ $0.50, NQ $5.00 (verify on CME specs). | 07 |
| Daily loss cap | −2R per strategy and −3R across the family per account. After that, no new entries until the next trade date (18:00 ET). | Notes give 2–3R |
| Consecutive losses | 3 per strategy disables that strategy for the day | 07 |
| Max trades | Per proposal (see each Filters part), plus a family-wide cap of 6 entries per account per day (design) | 07; design |
| Repeated executions | 10 fills of one setup type without a human review disables it until re-enabled. The concept is FIA's; N = 10 is a design choice. | [FIA 2024 §3.2](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf) |
| Positions | At most one open position per instrument across the PA family. PA-12 runs in a separate position sleeve with its own exposure cap. | Design |
| News blackout | No new entries from T−10 min to T+30 min around FOMC statements, NFP and CPI (all instruments) and the EIA petroleum report (CL). Scalp proposals (PA-08, PA-14, PA-15) flatten at T−2 min. Swing positions keep their server-side stops. Load the calendar from [federalreserve.gov](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) and [bls.gov](https://www.bls.gov/schedule/news_release/empsit.htm), and verify release times there. | Notes give T−5/10 to T+15/30 |
| Session filters | ETH = Globex, Sun–Fri 18:00–17:00 ET with a 17:00–18:00 ET maintenance halt ([CME ES specs](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html)). No new entries 16:45–18:30 ET. RTH = 09:30–16:00 ET for ES/NQ and 09:00–14:30 ET for CL. Intraday proposals take no new entries in the last 15 RTH minutes and are flat 5 minutes before the RTH close. Holiday and early-close days come from the CME holiday table and are treated as short sessions. | CME; 07 |
| Confirmed swings only | Each swing stores `pivot_time` and `confirm_time`. A rule may read a swing only when `confirm_time ≤ now`. Bias never comes from a developing HTF bar. Developing period values (session high so far, side of WO) are computed from ticks with explicit session boundaries, never from an HTF series' current bar. | [Pine repainting docs](https://www.tradingview.com/pine-script-docs/concepts/repainting/); [NT8 multi-series docs](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm); 01 |
| Bar-close evaluation | Conditions are evaluated on `BarClosed` events of the named layer. Resting orders are placed, moved or cancelled only at bar close (message hygiene; CME Rule 575). | 07 |
| Server-side protection | Every entry goes out as a bracket with a server-side stop and an expiry. CME stops are stop-with-protection orders and can fail to fill through a gap ([CME order types](https://cmegroupclientsite.atlassian.net/wiki/display/EPICSANDBOX/Order+Types+for+Futures+and+Options)). | 07 |
| Decision logging | One append-only decision record per state transition. It holds each layer's state, the swings used (with confirm times), the levels (with provenance), the ATRs, the risk state and the intended order. Records are keyed by `setup_id = hash(strategy_version, setup_type, level_id, arming_bar_id)`, which also serves as the Rithmic `userTag` / Tradovate `clOrdId`. | 07 |
| Volume bars | VB-A/B/C = ADV/50, ADV/250 and ADV/1000 of the traded contract's 20-session average daily volume. Recalibrate at the first session of each week, rounded to a "nice" number. Split large prints so each bar holds exactly V. Bars break at the 18:00 ET Globex open, and the partial last bar is excluded from swing counting. Clock guards (design values): ignore a VB trigger bar that lasted more than 30 minutes, and expire an armed VB setup after 60 minutes of wall-clock time. Flag for review if bars per day drift more than 40% from target for 5 sessions. | 05; [Sierra Chart settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html) |

The swing and order parameters below are also shared. Each proposal lists only its own additional parameters and says which of these it inherits.

| Parameter | Default | Reason |
|---|---|---|
| `k_swing` | SWING(L) = ATR-ZigZag / directional change with reversal 2.0 × ATR(L), ATR frozen at the extreme. Alternative: Pivot(L, 3, 3). | Shared convention; the notes put "visually obvious" swings at k ≈ 1.5–3 |
| `atr_n` | 14 bars of the layer's own series (RTH-only for RTH layers) | Shared convention |
| `tol_eq` | 0.15 × ATR(L) | Shared convention (notes: 0.1–0.25) |
| `minpen` | max(1 tick, 0.10 × ATR(L)) on the layer that detects the sweep | Notes: "1 tick or 0.1×ATR" |
| `k_2b` | 3 bars of the sweep layer, unless stated | Sperandeo's "immediately" ≈ 1–3 bars ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)); Brooks' failed breakouts reverse "within a bar or a few bars" ([Brooks forum](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/)) |
| `maxpen` | 1.0 × ATR(L) on the sweep layer. A deeper penetration is treated as acceptance, not a sweep. | Design |
| `buf` | max(2 ticks, 0.10 × ATR(trigger layer)) beyond the structural stop | Notes: max(1–2 ticks, 0.1–0.25 ATR); stay beyond the stop cluster (Osler) |
| `min_stop` | 1.0 × ATR(trigger layer) | Notes: stop = max(structure + buffer, k × ATR) |
| `slip` | max(2 ticks, 0.10 × ATR(trigger layer)) as the limit offset on E1/E2 orders | Design; bounds slippage (07) |
| `rr_floor` | Skip the trade if T1 is less than 1.0R from entry | Design: a first objective inside noise is not a trade |
| `level_age` | Swing levels expire after 20 sessions | Osler: ≥ 5 days of predictive power; bounce odds decay over time ([Chung & Bellotti](https://arxiv.org/abs/2101.07410v1)) |
| `t1_split` | 50% off at T1, then stop to breakeven. The remainder goes to T2 or a trail. | Design |

### Building blocks and order archetypes used in the specs

The pseudocode in each Automation spec uses these names. They map onto the pipeline stages in [07 Automation architecture](07%20Automation%20architecture.md) (bar builders, feature layers, level registry, setup state machines, risk manager, order manager, journal).

| Name | Meaning |
|---|---|
| `on_close(L)` | Handler that runs on the `BarClosed` event of layer L |
| `SWING(L)` | Confirmed swings on L: `.last_high`, `.last_low`, `.highs_since(t)`, `.lows_since(t)`. Each swing has `price`, `pivot_time`, `confirm_time`, `taken`. |
| `STRUCTURE(L)` | `.state` ∈ {UP, DOWN, RANGE, TRANSITION}; `.event` on this bar ∈ {BOS_UP, BOS_DOWN, CHoCH_UP, CHoCH_DOWN, NONE}; `.last_sh`, `.last_sl`, `.protected_low`, `.protected_high`, `.bos_count` (consecutive BOS in the current trend) |
| `GRADE(level, dir, lo, hi)` | G1 if layer `lo` traded beyond the level, G2 if a `lo` bar closed beyond it, G3 if a `hi` bar closed beyond it, else G0 |
| `LEVELS` | Clock-time levels (PDH … ORL) plus a registry of every actionable level with `level_id`, provenance, state and per-day attempt counters. Levels within `tol_eq` of each other are merged into one `level_id`. |
| `ATR(L)`, `TOL(L)`, `MINPEN(L)`, `BUF(L)`, `SLIP(L)` | The family defaults above, evaluated on layer L |
| `NEXT_LEVEL(side, px)` | Nearest LEVELS entry or confirmed, untaken SWING(H4/D1) extreme beyond `px` that is ≥ 1R away. If none exists within 3R, returns entry ± 2R. |
| `MM(a, b, origin)` | Measured move: origin ± abs(b − a). This is Brooks' leg 1 = leg 2 and range-height projection ([LuxAlgo: Measured Move](https://www.luxalgo.com/library/concept/measured-move/); [Brooks forum](https://www.brookstradingcourse.com/es/support-forum/general-trading-discussion/measured-move-from-failed-leg-1-leg-2/)). Treat it as a reference distance, not a forecast: after a directional change of size θ the average further move is about θ, a result a random walk also produces ([Glattfelder et al. 2011](https://arxiv.org/pdf/0809.1040)). |
| `RISK.ok()`, `RISK.qty(entry, stop)`, `rr_ok(entry, stop, t1)` | Pre-trade veto (caps, blackout, session, data freshness, duplicate `setup_id`), 1R sizing, and the `rr_floor` check (T1 at least 1R from entry) |
| `ENTER(kind, side, px, expiry, bracket)` | Sends entry order archetype E1, E2 or E3 with a server-side bracket (stop, T1, T2) |
| `LOG(setup_id, transition, snapshot)` | Appends a decision record |
| `in_window(a, b)`, `blackout()` | Clock filters, in America/New_York time |

The order archetypes are as follows. **E1 close-trigger**: a marketable limit at the trigger bar's close ± `slip`, valid for one trigger bar. If unfilled, the setup becomes EXPIRED and the miss is logged. **E2 stop-entry**: a stop-limit 1 tick beyond the signal bar's extreme with limit = trigger ± `slip`, re-placed only at bar close, with a stated expiry. **E3 level limit**: a resting limit 1 tick in front of the level, with a stated expiry. In review, an E3 fill counts only if price traded through the limit by at least 1 tick (the conservative column). Setup states follow 07: IDLE → ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED, with terminal EXPIRED, INVALIDATED, REJECTED, CANCELLED and ERROR. Strategy-specific refinements are written `ARMED:NAME`.

## Fifteen proposals at a glance

| ID | Name | Style | Stack: time · volume | Regime | Evidence | Automation |
|---|---|---|---|---|---|---|
| PA-01 | HTF pullback continuation (tide, wave, ripple) | Swing (intraday variant) | D1 / H4 / H1 · D1 / H4 / VB-A | Trend, pullback phase | B | Med |
| PA-02 | Sweep-and-reclaim at a confirmed HTF swing | Intraday | H4 / M15 / M5 · H4 / VB-A / VB-B | Range; trend extended into an older swing | B | Med |
| PA-03 | HTF breakout-pullback and "failed failure" | Intraday to swing | D1 / H4 / M15 · D1 / H4 / VB-A | Trend initiation and continuation | B | High |
| PA-04 | Prior-day high/low: failure vs acceptance | Intraday (RTH) | D1 / M15 / M5 · D1 / VB-A / VB-B | Either, chosen by D1 state | B | Med |
| PA-05 | Prior-week high/low: failure vs acceptance | Swing | D1 / H4 / H1 · D1 / H4 / VB-A | Either, chosen by D1 state | B | Med |
| PA-06 | Opening range breakout with D1 bias | Intraday (RTH open) | D1 / M5 · D1 / VB-B | Trend day | C | Low |
| PA-07 | NR7 / inside-day range expansion | Intraday (swing variant) | W1 / D1 / M15 · W1 / D1 / VB-B | Compression to expansion | C | Low |
| PA-08 | H2/L2 two-legged pullback | Scalp | M15 / M5 · VB-A / VB-B | Intraday trend | C | Med |
| PA-09 | Weekly-open bias, daily-open retest | Intraday | H1 / M15 / M5 · H1 / VB-A / VB-B | Directional week | C | Med |
| PA-10 | Failed break of the RTH open (testable Power of Three) | Intraday (open) | D1 / M5 · D1 / VB-B | Opening rotation | C | Low |
| PA-11 | First half-hour predicts last half-hour | Intraday, clock-timed | Clock only · no volume version | Any; stronger when volatile | A | Low |
| PA-12 | Time-series momentum position | Swing / position | W1 / D1 · clock only | Persistent trends | A | Low |
| PA-13 | Graded 1-2-3 trend reversal | Swing | D1 / H4 · D1 / VB-A | Transition | C | High |
| PA-14 | Equal-highs/lows liquidity trap | Scalp | M15 / M5 / M1 · VB-A / VB-B / VB-C | Intraday range | C | Med |
| PA-15 | Overnight-extreme failed test at the RTH open | Intraday (open) | ON levels / M5 · ON levels / VB-B | Balanced open | B | Low |

The regime coverage is deliberate. Trend proposals (PA-01, PA-03, PA-06, PA-08, PA-09, PA-12) need an established direction. Range proposals (PA-02, the failure branches of PA-04 and PA-05, PA-14, PA-15) need a boundary that holds. Transition proposals (PA-07, PA-10, PA-13) bet on a change of state. PA-11 is regime-agnostic.

## PA-01 HTF pullback continuation with LTF CHoCH (tide, wave, ripple)

**At a glance.** Style: swing (intraday variant noted) · Typical hold: 1–10 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: established trend, pullback phase · Evidence: B · Automation: Med.

**Concept basis.** This is Template A from the swing research. Every lower-layer move against the higher-layer trend counts as a correction until the higher layer's own protected swing breaks. The entry comes when the lower layer's structure turns back in the trend direction ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)). It encodes Dow's secondary reaction inside a primary trend, a counter-move that typically retraces one-third to two-thirds of the primary move ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). It does so as Elder's tide (D1), wave (H4) and ripple (H1), with adjacent layers about a factor of five apart ([TradingView: Triple Screen scripts](https://www.tradingview.com/scripts/triplescreen/); [ForexOp](https://forexop.com/technical/multiple-timeframe-trade-analysis/)). LuxAlgo's alignment guide supplies the operational rule. An LTF break against the HTF trend "is treated as internal, corrective movement until the higher timeframe's own structure actually breaks", and the entry is the LTF "change of character back in the higher-timeframe direction" ([LuxAlgo](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). The indirect empirical support is trend persistence: futures returns persist over 1–12 months ([Moskowitz, Ooi & Pedersen](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)), so trading in the D1 trend direction is reasonable at multi-day horizons. Nothing tests the H1 timing step, and LuxAlgo itself says alignment is unproven. See also [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 (ETH) STRUCTURE = UP, last event BOS_UP | D1 (ETH), unchanged | Yes |
| LOCATION | D1 pullback zone between D1 `protected_low` and D1 `last_sh` − 1.0 × ATR(D1) | Same | Yes |
| SETUP | H4: at least one confirmed H4 swing high below D1 `last_sh` (the "wave") | H4, unchanged (no VB tier is this coarse) | Yes, in this stack |
| TRIGGER | H1 CHoCH_UP | VB-A CHoCH_UP | No |
| MANAGEMENT | D1 `last_sh` and D1 leg for targets; H4 swings for the trail | Same | Targets yes; trail either |

What must remain on clock time: the D1 bars and ATR(D1), the D1 protected low and last swing high, the H4 layer in the volume version, the session and news windows, and the 10-session time stop. D1 (ETH) to H4 is about 5.75×, and H4 to H1 is 4×. VB-A prints about 50 bars per ETH day against H4's six, a wider ~8× step. For the **intraday variant**, move every rule down one layer: H4 / H1 / M15 on time bars, or H4 / VB-A / VB-B on volume bars. In either variant, check that a typical setup-layer leg holds roughly 4–10 trigger-layer swings. Fewer means the layers are too close; more means the trigger layer is too noisy for review ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)).

**Context filter.** D1 STRUCTURE.state = UP, the most recent D1 event is BOS_UP, and there has been no G3 CHoCH_DOWN since (mirror everything for shorts). If PA-13 has raised a G2 flag against this trend, stand aside.

**Location.** The last H1 close sits inside the D1 pullback: below D1 `last_sh` − 1.0 × ATR(D1) and above D1 `protected_low`. Depth is measured in ATR rather than as a retracement ratio, which keeps this proposal independent of the Fibonacci family.

**Setup.** Since D1 `last_sh` formed, H4 has confirmed at least one swing high below it. That H4 lower high shows the wave is under way.

**Trigger.** An H1 bar closes above the most recent confirmed H1 swing high (H1 CHoCH_UP) while context, location and setup all hold at that close.

**Entry order.** E2: a buy stop-limit 1 tick above the trigger bar's high, limit = trigger + `slip`. It is valid for 3 H1 bars and re-checked at each H1 close; cancel it if any condition fails.

**Risk & management.** The initial stop goes below the lowest H1 low since D1 `last_sh` (the pullback low) minus `buf`, widened to `min_stop` = 1.0 × ATR(H1) if that is closer. Size is 1R. T1 is D1 `last_sh`, a retest of the trend extreme, subject to `rr_floor`. T2 = MM(D1 `protected_low`, D1 `last_sh`, pullback low): leg 1 = leg 2. After T1 fills, move the stop to breakeven, then trail below each newly confirmed H4 swing low minus `buf`. Time stop: exit at the first H4 close after 10 sessions without reaching T1. Structural exit: exit if D1 closes below D1 `protected_low` (G3). An armed setup ends in one of three ways. It is INVALIDATED on a G3 CHoCH_DOWN. It moves to ARMED:SUSPENDED on an H1 close below D1 `protected_low` (G2), which also cancels working orders. It EXPIRES if price trades above D1 `last_sh` before the trigger, because the pullback ended without a signal.

**Filters.** Trading runs on ETH. No H1 trigger is accepted from bars closing between 16:45 and 18:30 ET or inside a news blackout. Volatility ceiling: skip if ATR(D1) is more than 2.0× its 100-session median, because crash regimes break the continuation template. There is no volatility floor. At most 2 entries per D1 pullback (one re-arm after a stop-out, provided location still holds), and at most 1 entry per day.

**Automation spec.**

```
States: IDLE → ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
        ARMED → ARMED:SUSPENDED (G2) → ARMED (G2 cleared by H1 close back above) | INVALIDATED (G3) | EXPIRED

on_close(D1):
    ctx = STRUCTURE(D1)                                   # closed D1 bars only
    if ctx.state != UP or ctx.event == CHoCH_DOWN: invalidate_all("D1 context lost")
on_close(H1):
    ctx  = STRUCTURE(D1); top = ctx.last_sh; pl = ctx.protected_low
    zone = pl.price < H1.close < top.price - 1.0*ATR(D1)
    wave = any(h.price < top.price for h in SWING(H4).highs_since(top.pivot_time))
    if state == IDLE and ctx.state == UP and zone and wave: state = ARMED; LOG(id, "ARMED", snap())
    if state in {ARMED, ARMED:SUSPENDED}:
        g = GRADE(pl.price, DOWN, lo=H1, hi=D1)
        state = ARMED:SUSPENDED if g == G2 else ARMED
        if H1.high > top.price: state = EXPIRED
        if state == ARMED and STRUCTURE(H1).event == CHoCH_UP and RISK.ok():
            stop = min(low_since(top.pivot_time) - BUF(H1), H1.high - 1.0*ATR(H1))
            ENTER(E2, LONG, H1.high + tick, expiry=3*H1,
                  bracket=(stop, T1=top.price, T2=MM(pl.price, top.price, low_since(top.pivot_time))))
            state = ORDER_PENDING
on_close(H4) while MANAGED: trail stop to SWING(H4).last_low.price - BUF(H4) if higher
```

| Parameter | Default | Reason |
|---|---|---|
| `depth_atr` | 1.0 × ATR(D1) below D1 `last_sh` | Design: the pullback must have real size; volatility-scaled rather than a ratio |
| `wave_rule` | ≥ 1 confirmed H4 swing high below D1 `last_sh` | Template A's "LTF down during the HTF pullback" |
| `trigger` | H1 CHoCH_UP (close-based) | Template A ripple; a close, not a wick |
| `entry_expiry` | 3 H1 bars | Design: follow-through should come quickly |
| `time_stop` | 10 sessions | Dow secondary reactions run weeks; design cap for a swing hold |
| `trail_layer` | H4 confirmed swing lows | Degree consistency: manage on the setup layer ([01](01%20Swing%20points%20across%20timeframes.md)) |
| `max_entries` | 2 per D1 pullback, 1 per day | Design |
| `vol_ceiling` | ATR(D1) ≤ 2.0 × 100-session median | Design |
| Inherited | `k_swing`, `atr_n`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. On D1, the last confirmed swing high and swing low each sit above their predecessors, and the BOS_UP was a *close* above the prior swing high. Its confirmation marker lies left of the signal.
2. The trigger bar's close lies inside the shaded zone between D1 `protected_low` and D1 `last_sh` − 1 ATR(D1).
3. H4 shows a lower-high marker whose confirmation marker precedes the trigger.
4. The H1 trigger bar closes above a dashed, already-confirmed H1 swing high.
5. The stop sits below the pullback low by the buffer, not at the low itself.
6. The decision record lists the D1, H4 and H1 states with every `confirm_time` ≤ signal time.

Bot error signatures: bias flipping mid-day, a sign it read the developing D1 bar; a swing used before its confirmation marker; a CHoCH counted on a wick; an H4 lower high taken from the still-open H4 bar; a trigger accepted during maintenance or a blackout.

**Failure modes & regime fit.** The template works when the D1 trend persists and pullbacks resolve. It loses when the pullback becomes a reversal (the stop goes first, then G3). It also loses in D1 ranges misread as trends after a single BOS. V-shaped resumptions that never print an H4 lower high are missed opportunities, not losses. Swing holds carry gap risk across the maintenance halt and weekends, and a CME stop-with-protection can fail to fill through a gap. Triggers in Asian hours face thin books. In the volume version, VB-A triggers can come from compressed overnight bars. The 30-minute clock guard filters the worst of them.

**Relations.** PA-08 is the same thesis one scale down. Run both only under the one-position rule. PA-03 owns the *first* pullback after a fresh break, and PA-01 defers while PA-03 is armed on the same D1 leg. PA-13 is the counter-thesis: its G2 flag suspends PA-01. PA-12's sign may *replace* D1 STRUCTURE as the context condition (swap it, never stack it). A VP- or FIB-family location could replace the ATR depth zone, but that combination belongs in [11 Proposals confluence](11%20Proposals%20confluence.md).

## PA-02 Sweep-and-reclaim (2B) at a confirmed HTF swing level

**At a glance.** Style: intraday · Typical hold: 30 minutes to 4 hours · Instruments: ES/MES, NQ/MNQ, CL/MCL, 03:00–16:00 ET · Regime: HTF range or transition, or an HTF trend extended into an older, higher-degree swing · Evidence: B · Automation: Med.

**Concept basis.** This is Template B: an LTF swing failure at an HTF swing level, the multi-timeframe form of Sperandeo's 2B. In Sperandeo's words, as quoted by secondary sources, "if prices penetrate the previous high, but fail to carry through and immediately drop below the previous high, the trend is apt to reverse" ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)). It is also the mirror of Wyckoff's spring and upthrust, which count only once price closes back inside the range ([LuxAlgo: Spring](https://www.luxalgo.com/library/concept/spring/); [TradingWyckoff](https://tradingwyckoff.com/en/spring-shakeout/)). The HTF level gives location and the LTF structure gives timing ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)). The credible mechanism is Osler's. Practitioners define resistance as "a previous peak", such levels beat arbitrary ones, and stop orders cluster just beyond them ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf); [Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). A run through the cluster that cannot hold is the trap. The caveat matters: Osler's order data concern round numbers and published levels, not HTF swing highs specifically. The notes found no peer-reviewed test of stop runs at prior swing extremes in CME futures. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | H4 STRUCTURE | H4, unchanged | Yes |
| LOCATION | Confirmed, untaken SWING(H4) or SWING(D1) extreme | Same | Yes |
| SETUP | M15 sweep and reclaim within `k_2b` = 3 bars | VB-A sweep and reclaim within 3 bars | No |
| TRIGGER | M5 CHoCH against the post-sweep move | VB-B CHoCH | No |
| MANAGEMENT | H4 range midpoint and swings for targets; M5 for the stop | H4 targets; VB-B stop | Targets yes |

What must remain on clock time: H4 and D1 levels and their confirm times, level age (20 sessions), the trading window and the time stop. M15 to M5 is 3× and VB-A to VB-B is 5×. **Scalp variant:** M15 / M5 / M1 or VB-A / VB-B / VB-C, with H1 swing levels.

**Context filter.** For a short at a swing high: H4 STRUCTURE.state ∈ {RANGE, TRANSITION, DOWN}. If H4 is UP, a short is allowed only when the level is a D1 swing, a higher-degree swing that the H4 trend has extended into. Mirror for longs at swing lows.

**Location.** A confirmed, untaken H4 or D1 swing extreme from the level registry. Its `confirm_time` must precede the start of the sweep, and it must be no older than 20 sessions. Coincident levels (within `tol_eq`) share one `level_id` and one attempt.

**Setup.** An M15 bar trades at least `minpen` beyond the level, penetrating no more than `maxpen` = 1.0 × ATR(M15). Within 3 M15 bars of the first penetration, an M15 bar closes back on the original side of the level. Closes beyond the level in between are allowed, which matches Sperandeo's "fail to carry through".

**Trigger.** After the reclaim close, an M5 bar closes beyond the most recent M5 swing low confirmed after the sweep began. If no such swing has confirmed yet, the M15 reclaim bar's low stands in. The trigger must come within 4 M15 bars of the reclaim. This is the LTF CHoCH against the move that ran the stops.

**Entry order.** E1: a marketable sell limit at the trigger close − `slip`, valid for one M5 bar.

**Risk & management.** The stop goes at the highest high since the penetration plus `buf`, with `min_stop` = 1.0 × ATR(M5). Size is 1R. T1 is the H4 range midpoint when H4 is in RANGE; otherwise it is the nearest confirmed H4 swing low below entry, subject to `rr_floor`. T2 is the H4 range low or H4 `protected_low`. Move to breakeven after T1. Time stop: 16 M15 bars (4 hours), because Osler's cascade effects last hours. Intraday positions are flat by 15:55 ET for RTH entries, or by 16:40 ET otherwise. An armed setup is INVALIDATED in three cases: penetration beyond `maxpen`; no reclaim within 3 M15 bars, after which the level is marked TAKEN and becomes PA-03's; or an M15 close beyond the sweep extreme after the reclaim. It EXPIRES if no trigger arrives within 4 M15 bars.

**Filters.** Window 03:00–16:00 ET (European and US hours). Skip entries when ATR(M15) exceeds 3.0× its 20-session median (news-like conditions). One attempt per level: a swept level is retired whatever the outcome. At most 2 trades per day for this proposal.

**Automation spec.**

```
States: IDLE → ARMED → ARMED:SWEPT → ARMED:RECLAIMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
on_close(H4): registry.add(confirmed untaken highs/lows of SWING(H4), SWING(D1); age ≤ 20 sessions)
on_close(M15):                                          # short side at a swing high shown
    for lv in registry.active(kind=SWING_HIGH):
        ctx_ok = STRUCTURE(H4).state in {RANGE, TRANSITION, DOWN} or lv.layer == D1
        if lv.state == ARMED and ctx_ok and M15.high >= lv.price + MINPEN(M15):
            if M15.high - lv.price > 1.0*ATR(M15): lv.invalidate("acceptance"); continue
            lv.state = SWEPT; lv.t0 = M15.open_time; lv.ext = M15.high
        elif lv.state == SWEPT:
            lv.ext = max(lv.ext, M15.high)
            if M15.close < lv.price: lv.state = RECLAIMED; lv.rbar = M15
            elif bars_since(lv.t0, M15) >= 3: lv.taken = True; lv.invalidate("no reclaim")
on_close(M5):
    for lv in registry.state(RECLAIMED):
        pl = SWING(M5).lows_since(lv.t0).last or lv.rbar.low
        if M5.close < price(pl) and RISK.ok():
            stop = max(lv.ext + BUF(M5), M5.close + 1.0*ATR(M5))
            ENTER(E1, SHORT, M5.close - SLIP(M5), expiry=1*M5, bracket=(stop, T1=h4_target(), T2=h4_range_low()))
        elif bars_since(lv.rbar, M15) > 4: lv.state = EXPIRED
```

| Parameter | Default | Reason |
|---|---|---|
| Level source | SWING(H4) and SWING(D1), confirmed and untaken | Template B |
| `level_age` | 20 sessions | Osler ≥ 5 days; decay per Chung & Bellotti |
| `k_2b` | 3 M15 bars | Sperandeo "immediately"; Brooks "within a few bars" |
| `maxpen` | 1.0 × ATR(M15) | Design: a deep run is acceptance, not a sweep |
| `trigger_window` | 4 M15 bars after reclaim | Design |
| `time_stop` | 16 M15 bars | Osler: cascade effects significant for hours |
| `vol_ceiling` | ATR(M15) ≤ 3.0 × 20-session median | Design |
| `attempts` | 1 per level; 2 trades per day | Design; avoids re-fading a level that already broke |
| Inherited | `k_swing`, `tol_eq`, `minpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The level is an H4 or D1 swing whose confirmation marker sits left of the sweep, and it is not marked as taken.
2. H4 context is shown as RANGE, TRANSITION or DOWN, or the level is a D1 swing.
3. The sweep bar's wick crosses the level by at least the minimum penetration but less than one M15 ATR.
4. An M15 close back below the level occurs within three bars of the first penetration.
5. The M5 trigger close is below a swing low (or the reclaim bar's low) that formed after the sweep began.
6. The stop sits above the sweep's extreme by the buffer.

Bot error signatures: a level drawn from an unconfirmed H4 pivot (its marker appears only after the sweep); an M15 "reclaim" taken from the still-open bar; reuse of a level already marked taken; a trigger more than 4 M15 bars after the reclaim; an entry while H4 was UP and the level was only an H4 swing.

**Failure modes & regime fit.** The proposal is strongest in H4 ranges and at the ends of stretched moves. It is weakest in strong trends, where swept levels often act as breakout-retest points. One vendor reports its own (unverified) tests found swept levels predicted *continuation* more often than reversal ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)), which is why the context filter blocks trend-direction levels. Expect fast stop-outs when the reclaim is a pause inside a cascade. A tier-1 release turns any sweep into noise, which the blackout handles.

**Relations.** PA-03 takes the opposite outcome at the same level, a reclaim that never comes, and the shared registry makes the two mutually exclusive per level. PA-04 and PA-15 apply the same mechanism to clock-time levels, and PA-14 to equal-high pools at scalp scale. Coincident levels are merged so only one fires. The G2/G3 flags from PA-13 do not gate PA-02, because PA-02 does not depend on trend.

## PA-03 HTF breakout-pullback, including the "failed failure"

**At a glance.** Style: intraday to short swing · Typical hold: 4 hours to 3 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: trend initiation (first BOS) and continuation · Evidence: B · Automation: High.

**Concept basis.** This is Template C, Brooks' breakout pullback expressed in swing terms. A breakout pullback is a small pullback of about 1–5 bars soon after a breakout, read as a setup for resumption. A "failed failure", where the failure itself fails and price resumes in the breakout direction, is also a breakout pullback. Once a breakout has run 2–3 bars without failing, a later "failure" more often just sets up a breakout-pullback entry ([Brooks forum: Failed breakout](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/); [Brooks forum: successful vs failed BO](https://brookstradingcourse.com/support-forum/general-trading-discussion/successful-vs-failed-bo-of-trs)). The credible mechanism is the other half of Osler's result: once a salient level is crossed, the triggered stops propagate the trend, and moves are "unusually rapid" for hours ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The retest is where late participants and the breakout's own stops meet. The "failed failure" trigger is PA-02's sweep-and-reclaim turned around: it fades the traders who shorted the apparent failure. See [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md) and [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 STRUCTURE ≠ DOWN (for longs) | D1, unchanged | Yes |
| LOCATION | The H4 swing high just broken | Same | Yes |
| SETUP | H4 BOS_UP with displacement, then a pullback within 5 H4 bars | H4, unchanged | Yes |
| TRIGGER | M15: higher low held at the level and CHoCH_UP, or failed failure | VB-A, same rules | No |
| MANAGEMENT | NEXT_LEVEL and MM for targets; H4 close back below the level = exit | Same | Targets yes |

What must remain on clock time: D1 and H4 bars, the broken level, the 5-H4-bar window and the 3-session time stop. H4 to M15 is 16×, a deliberate gap: the H4 decides that a breakout happened, and the M15 times the retest. **Intraday variant:** H1 BOS with M5 (time) or VB-B (volume) triggers.

**Context filter.** D1 STRUCTURE.state ∈ {UP, RANGE, TRANSITION} for longs, never DOWN. Mirror for shorts.

**Location.** The price of the confirmed H4 swing high that the H4 BOS_UP closed above. It is stored as a registry level with its `protected_low`, the H4 higher low that launched the break.

**Setup.** An H4 bar closes at least 0.25 × ATR(H4) above the level (BOS with displacement). Within the next 5 H4 bars, price pulls back toward the level. The **maturity rule**: a dip during the first 2 H4 bars after the BOS does not count as a failed-failure candidate.

**Trigger.** Two triggers exist; whichever fires first is used.
- **(a) Standard.** An M15 swing low confirms at or above the level − `tol_eq`(H4), then an M15 bar closes above the last confirmed M15 swing high of the pullback (M15 CHoCH_UP).
- **(b) Failed failure.** Once the breakout is at least 2 H4 bars old, an M15 bar closes below the level − `tol_eq`(H4), with no H4 close below that line. Then, within 3 M15 bars, an M15 bar closes back above the level.

**Entry order.** E1: a marketable buy limit at the trigger close + `slip`, valid for one M15 bar.

**Risk & management.** For trigger (a), the stop goes below the M15 higher low minus `buf`. For trigger (b), it goes below the lowest low of the dip minus `buf`. Either way `min_stop` = 1.0 × ATR(M15). Size is 1R. T1 = NEXT_LEVEL(LONG, entry), subject to `rr_floor`. T2 = MM(protected_low, level, level), the range-height projection of the leg that broke out ([LuxAlgo: Measured Move](https://www.luxalgo.com/library/concept/measured-move/)). After T1, move to breakeven and trail below confirmed H1 swing lows minus `buf`. Structural exit: an H4 close back below the level − `tol_eq`(H4) after entry closes the trade at once, stop or not, because the breakout has failed. Time stop: 3 sessions. An armed setup is INVALIDATED by an H4 close below the level − `tol_eq`(H4) before entry, or by a new H4 BOS above (the new level supersedes and re-arms). It EXPIRES after 5 H4 bars.

**Filters.** ETH. No triggers 16:45–18:30 ET or during a blackout. Ignore an H4 BOS whose bar contains a tier-1 release, because the displacement is news, not acceptance (design). One trade per broken level; at most 2 per day.

**Automation spec.**

```
States: IDLE → ARMED → ARMED:DIPPED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
on_close(H4):
    s = STRUCTURE(H4)
    if s.event == BOS_UP and H4.close >= s.broken.price + 0.25*ATR(H4) \
       and STRUCTURE(D1).state != DOWN and not news_in(H4):
        setup = new(level=s.broken.price, pl=s.protected_low, t_bos=H4.close_time); state = ARMED
    for st in armed:
        st.h4_bars += 1
        if H4.close < st.level - TOL(H4): st.invalidate("failed breakout")
        elif st.h4_bars > 5: st.state = EXPIRED
on_close(M15):
    for st in armed:
        hl = SWING(M15).lows_since(st.t_bos).last
        if st.state == ARMED and hl and hl.price >= st.level - TOL(H4) \
           and STRUCTURE(M15).event == CHoCH_UP:
            go(st, stop=hl.price - BUF(M15))                          # trigger (a)
        elif st.state == ARMED and st.h4_bars >= 2 and M15.close < st.level - TOL(H4):
            st.state = ARMED:DIPPED; st.t_dip = M15.open_time
        elif st.state == ARMED:DIPPED:
            if M15.close > st.level: go(st, stop=low_since(st.t_dip) - BUF(M15))   # trigger (b)
            elif bars_since(st.t_dip, M15) > 3: st.state = ARMED          # back to waiting for (a)
go(st, stop): if RISK.ok(): ENTER(E1, LONG, M15.close + SLIP(M15), expiry=1*M15,
              bracket=(min(stop, M15.close - 1.0*ATR(M15)), T1=NEXT_LEVEL(LONG, M15.close),
                       T2=MM(st.pl.price, st.level, st.level)))
```

| Parameter | Default | Reason |
|---|---|---|
| `disp_bos` | H4 close ≥ level + 0.25 × ATR(H4) | Notes: "closes beyond a level by ≥ k ATR"; 0.25 is a design value |
| `pull_window` | 5 H4 bars | Brooks: breakout pullbacks of about 1–5 bars |
| `maturity` | 2 H4 bars before a dip can be a failed failure | Brooks: 2–3 bars without failing |
| `hold_tol` | `tol_eq`(H4) = 0.15 × ATR(H4) | Shared tolerance convention |
| `ff_window` | 3 M15 bars to reclaim | `k_2b` convention |
| `time_stop` | 3 sessions | Design |
| `news_bos` | Ignore BOS bars that contain a tier-1 release | Design |
| Inherited | `k_swing`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The H4 BOS bar *closes* above an H4 swing high whose confirmation marker precedes it, with a gap of at least a quarter ATR.
2. D1 is not in a downtrend on the last closed D1 bar.
3. For trigger (a), an M15 higher low sits at or above the tolerance band under the level, followed by an M15 close above the pullback's last swing high.
4. For trigger (b), the dip close below the band comes at least two H4 bars after the BOS, no H4 bar has closed below the band, and the reclaim close comes within three M15 bars.
5. The stop sits under the higher low or the dip low, plus the buffer.

Bot error signatures: a BOS from a wick or from the still-open H4 bar; a "failed failure" taken in the first two H4 bars; an entry after an H4 close below the band; the level silently replaced by a later swing without a re-arm entry in the log.

**Failure modes & regime fit.** The proposal works on genuine range expansions. It fails on breakouts that are only the top of a wider range (D1 RANGE is allowed, so expect some of these), and on news-driven spikes that retrace fully. Losses cluster when an H4 failure develops slowly, more than 5 H4 bars after the BOS. The trigger (b) branch is especially exposed when the dip is the start of a real reversal; the H4-close exit limits the damage. Automation complexity is high because two triggers, a maturity rule and level supersession must agree.

**Relations.** PA-02 is the mutually exclusive alternative at the same level, decided by whether the reclaim happens within `k_2b`. PA-01 handles later pullbacks in an established trend and defers while PA-03 is armed on the same leg. PA-04 and PA-05 run the same acceptance logic on clock-time levels (PDH and PWH). Avoid holding PA-03 and a PA-13 reversal on the same instrument, because their theses are opposite.

## PA-04 Prior-day high/low: failure (2B) versus acceptance (breakout-retest)

**At a glance.** Style: intraday, RTH · Typical hold: 15 minutes to 4 hours, flat by the RTH close · Instruments: ES/MES and NQ/MNQ (RTH 09:30–16:00 ET), CL/MCL (RTH 09:00–14:30 ET) · Regime: both; the D1 state picks the branch · Evidence: B · Automation: Med.

**Concept basis.** The prior RTH day's high and low are probably the most-watched intraday reference levels. Practitioner sources treat them as core reference points ([NinjaTrader blog](https://ninjatrader.com/Futures/Blogs/How-to-Identify-Intraday-Support-and-Resistance-Levels-in-Your-Trading)). They are exactly the "previous reaction low" and "previous peak" from which Osler's published levels were typically derived, and those levels beat arbitrary ones at interrupting intraday trends ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). The same order-clustering mechanism explains both outcomes. If the stop pool is absorbed, the result is a 2B failure. If the cascade runs, the result is acceptance and a breakout-retest ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The notes recommend letting the bias state decide which of the two opposing setups is eligible, so the bot never trades both. A vendor claims that 67% of YM sessions close green after breaking the prior day's high. It publishes no sample, method or test, so it is cited only as unverified ([Edgeful](https://www.edgeful.com/blog/posts/previous-days-range-trading-mistake)). No peer-reviewed futures study of PDH/PDL was found. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 (ETH) STRUCTURE, last closed bar | D1, unchanged | Yes |
| LOCATION | PDH / PDL of the prior RTH session | Same, computed from ticks | Yes |
| SETUP | M15: sweep-and-reclaim (failure) or acceptance close plus pullback | VB-A | No |
| TRIGGER | M5 close-based break | VB-B | No |
| MANAGEMENT | PDC, prior-day midpoint (PDM), PDL/PDH, NEXT_LEVEL | Same levels; VB-A trail | Levels yes |

What must remain on clock time: PDH, PDL, PDC and PDM; the RTH window; the flat time; and the gap check at the open. VB bars straddle 09:30 ET, so never derive these levels from VB bars.

**Context filter.** The branch matrix, decided once at the RTH open from the last closed D1 bar. At PDH: if D1 is UP, only the acceptance long is eligible; if D1 is RANGE, TRANSITION or DOWN, only the failure short is eligible. At PDL: if D1 is DOWN, only the acceptance short is eligible; otherwise only the failure long. This is the notes' rule: aligned trend → breakout-pullback, otherwise → failed breakout.

**Location.** PDH or PDL. Skip any level that the RTH session *opens* beyond (a gap through the level); PA-06 and PA-15 cover those opens. A PDH within `tol_eq`(H4) of an H4 swing high is one merged registry level with one attempt.

**Setup.**
- **Failure branch (short at PDH shown).** An M15 bar trades at or above PDH + `minpen`(M15), penetrating no more than `maxpen`. Within 2 M15 bars of the first penetration (`k_2b` = 2 here), an M15 bar closes below PDH.
- **Acceptance branch (long at PDH shown).** An M15 bar closes at or above PDH + 0.25 × ATR(M15). Within the next 6 M15 bars, price pulls back to within 0.25 × ATR(M15) of PDH, with no M15 close below PDH − 0.25 × ATR(M15).

**Trigger.**
- **Failure.** The first M5 close below the low of the M15 reclaim bar, within 3 M15 bars of the reclaim.
- **Acceptance.** The first M5 close above the high of the M5 bar that printed the pullback low. This is a close-based version of Brooks' "High 1" break.

**Entry order.** E1: a marketable limit at the trigger close ± `slip`, valid for one M5 bar.

**Risk & management.** Failure: the stop goes above the highest high since penetration plus `buf`. Acceptance: below the pullback low minus `buf`. Both use `min_stop` = 1.0 × ATR(M5), and size is 1R. Failure targets: T1 is whichever of PDM and PDC is nearer while still at least 1R away; T2 is PDL (full rotation). Acceptance targets: T1 = NEXT_LEVEL; T2 is a trail below confirmed M15 swing lows minus `buf` until the flat time. Move to breakeven after T1. Time stop: 12 M15 bars (3 hours) without T1. A failure setup is INVALIDATED if no reclaim comes within 2 M15 bars; the level then counts as accepted, and the acceptance branch may arm only if D1 permits it. An acceptance setup is INVALIDATED by an M15 close back below PDH − 0.25 × ATR(M15). Either branch EXPIRES if its trigger window lapses.

**Filters.** ES/NQ setups run 09:30–15:30 ET; CL setups run 09:00–14:00 ET. Blackout per the family rules. Volatility ceiling: ATR(M15) ≤ 3.0× its 20-session median. **At most one trade per level per day** across both branches, no flip-flopping, and at most 2 trades per day for this proposal.

**Automation spec.**

```
States: IDLE → ARMED (branch fixed at RTH open) → ARMED:SWEPT | ARMED:ACCEPTED → ARMED:PULLED
        → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
at RTH open:
    for lv in [PDH, PDL]:
        if opened_beyond(lv): skip
        lv.branch = branch_matrix(lv, STRUCTURE(D1).state)        # FAILURE or ACCEPT
        lv.state = ARMED
on_close(M15):                                                    # PDH shown
    if lv.branch == FAILURE:
        if lv.state == ARMED and M15.high >= lv.px + MINPEN(M15) and M15.high - lv.px <= ATR(M15):
            lv.state = SWEPT; lv.t0 = M15.open_time; lv.ext = M15.high
        elif lv.state == SWEPT:
            lv.ext = max(lv.ext, M15.high)
            if M15.close < lv.px: lv.state = RECLAIMED; lv.rbar = M15
            elif bars_since(lv.t0, M15) >= 2: lv.invalidate("accepted")
    if lv.branch == ACCEPT:
        if lv.state == ARMED and M15.close >= lv.px + 0.25*ATR(M15): lv.state = ACCEPTED; lv.t0 = now
        elif lv.state == ACCEPTED:
            if M15.close < lv.px - 0.25*ATR(M15): lv.invalidate("failed acceptance")
            elif M15.low <= lv.px + 0.25*ATR(M15): lv.state = PULLED
            elif bars_since(lv.t0, M15) > 6: lv.state = EXPIRED
on_close(M5):
    if lv.state == RECLAIMED and M5.close < lv.rbar.low:
        enter(E1, SHORT, stop=lv.ext + BUF(M5), T1=nearest_1R(PDM, PDC), T2=PDL)
    if lv.state == PULLED and M5.close > bar_of_low_since(lv.t0, M5).high:
        enter(E1, LONG, stop=low_since(lv.t0) - BUF(M5), T1=NEXT_LEVEL(LONG, M5.close), T2="trail M15")
```

| Parameter | Default | Reason |
|---|---|---|
| Level session | Prior RTH (ES/NQ 09:30–16:00 ET, CL 09:00–14:30 ET) | Shared convention: PDH/PDL = prior RTH day |
| Branch rule | D1 STRUCTURE matrix | Notes: the bias state chooses one of two opposing setups |
| `k_2b` | 2 M15 bars | Design: "immediately" at the daily-level scale |
| `accept_disp` | 0.25 × ATR(M15) close beyond | Notes: "closes beyond by ≥ k ATR"; value is design |
| `pull_band` | 0.25 × ATR(M15) | Notes: "within j ATR of the level"; value is design |
| `pull_window` | 6 M15 bars | Design |
| `gap_skip` | Skip levels the RTH opens beyond | Design; hands those opens to PA-06/PA-15 |
| `time_stop` | 12 M15 bars | Design; Osler hours-scale effects |
| `attempts` | 1 per level per day; 2 trades per day | Design |
| Inherited | `k_swing`, `tol_eq`, `minpen`, `maxpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. PDH and PDL lines match the prior RTH session's extremes, not the full Globex day's.
2. The log shows the branch chosen at 09:30 ET from the last closed D1 bar, and only that branch fires.
3. Failure: the wick crosses PDH by at least the minimum penetration, an M15 close back below comes within two bars, and an M5 close below the reclaim bar's low follows.
4. Acceptance: the M15 close clears PDH by a quarter ATR, the pullback stays within the band without a close back inside, and an M5 close breaks the pullback-low bar's high.
5. The stop sits beyond the sweep extreme or pullback low by the buffer, and T1 is at least 1R away.

Bot error signatures: levels computed from ETH bars; a branch that changed during the session; both branches trading the same level; a trade at a level the session opened beyond; a PDH and an H4 swing within tolerance traded as two separate levels.

**Failure modes & regime fit.** The failure branch suffers on trend days that start inside the prior range and break out after lunch. The acceptance branch suffers on "look above and fail" days where D1 is UP but the session rotates. Because the branch is fixed at the open, an intraday regime change is accepted as a loss, not adapted to. That is deliberate: adapting would mean optimizing. CL's RTH levels matter less when most of the move happened overnight.

**Relations.** PA-05 is the weekly analogue. PA-15 and PA-06 own the opens that gap beyond PDH or PDL. PA-02 and PA-03 run the same pair on swing levels, and the merged registry prevents double-firing. Do not run PA-04's failure branch alongside PA-14 at a level that is both PDH and an equal-high pool; the registry merge enforces this.

## PA-05 Prior-week high/low: failure versus acceptance (swing)

**At a glance.** Style: swing · Typical hold: 1–5 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: both; the D1 state picks the branch · Evidence: B · Automation: Med.

**Concept basis.** This is the same failure-versus-acceptance pair as PA-04, one degree up. The prior week's high and low are the weekly-cap layer's most visible levels, and the notes suggest weekly levels as a *location* filter rather than a fourth state gate, to avoid over-filtering. Osler found that published levels kept predictive power for at least five business days ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)), which is the right order of magnitude for a weekly level used over the following week. Stop clustering supplies both outcomes ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The trigger is an H1 CHoCH, the swing-native timing step of Template B. No futures-specific study of PWH/PWL was found. See [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md) and [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 (ETH) STRUCTURE | D1, unchanged | Yes |
| LOCATION | PWH / PWL (prior Globex week, Sun 18:00 to Fri 17:00 ET); PWC and PWM for targets | Same | Yes |
| SETUP | H4 sweep-and-reclaim (failure) or D1 acceptance close plus pullback | H4 / D1, unchanged | Yes |
| TRIGGER | H1 CHoCH in the trade direction | VB-A CHoCH | No |
| MANAGEMENT | PWM, PWC, PWL/PWH, NEXT_LEVEL; H4 trail | Same | Yes |

What must remain on clock time: the weekly levels, the D1 and H4 layers, and the Friday flat rule. The volume version changes only the trigger.

**Context filter.** The same branch matrix as PA-04, read from the last closed D1 bar. When the D1 trend points through the level, only acceptance is eligible; otherwise only failure.

**Location.** PWH or PWL, active from the Sunday 18:00 ET open through Friday 12:00 ET.

**Setup.**
- **Failure branch (short at PWH shown).** An H4 bar trades at or above PWH + `minpen`(H4), penetrating no more than `maxpen` = 1.0 × ATR(H4). Within 2 H4 bars, an H4 bar closes back below PWH.
- **Acceptance branch (long at PWH shown).** A D1 bar closes at or above PWH + 0.25 × ATR(D1). Within the next 3 sessions, price pulls back to within 0.25 × ATR(D1) of PWH, with no D1 close below PWH − 0.25 × ATR(D1).

**Trigger.** In both branches: an H1 close beyond the most recent H1 swing confirmed after the sweep start or the pullback start, in the trade direction (H1 CHoCH). If no such swing has confirmed, the reclaim H4 bar's extreme or the pullback-low H1 bar's extreme stands in. The trigger window is 6 H1 bars for failure and 1 session for acceptance.

**Entry order.** E1: a marketable limit at the H1 trigger close ± `slip`, valid for one H1 bar.

**Risk & management.** Failure: the stop goes above the highest high since penetration plus `buf`(H1). Acceptance: below the pullback low minus `buf`(H1). Both use `min_stop` = 1.0 × ATR(H1), and size is 1R. Failure targets: T1 is the nearer of PWM (prior-week midpoint) and PWC that is at least 1R away; T2 is PWL. Acceptance targets: T1 = NEXT_LEVEL; T2 is a trail below confirmed H4 swing lows minus `buf`. Breakeven after T1. Time stop: 5 sessions, or flat by Friday 16:30 ET, whichever comes first. The Friday flat is a design default against weekend gaps; it is configurable, and switching it off makes a new `strategy_version`. Invalidation and expiry mirror PA-04, with the layers moved up one degree.

**Filters.** ETH. Entries Monday 03:00 ET through Friday 12:00 ET, outside maintenance and blackouts. Skip the week after a contract roll if the weekly levels come from the expired contract without translation; use the back-adjusted levels per [07 Automation architecture](07%20Automation%20architecture.md). **One trade per weekly level per week.**

**Automation spec.**

```
States: as PA-04 (ARMED with branch → SWEPT/RECLAIMED or ACCEPTED/PULLED → ORDER_PENDING → … → CLOSED)
at week open (Sun 18:00 ET): for lv in [PWH, PWL]: lv.branch = branch_matrix(lv, STRUCTURE(D1).state); lv.state = ARMED
on_close(D1): re-read STRUCTURE(D1); if the branch's D1 permission is lost before entry: lv.state = CANCELLED
on_close(H4):   failure branch sweep/reclaim logic, as PA-04 with M15 → H4, k_2b = 2
on_close(D1):   acceptance branch: accept close ≥ px + 0.25*ATR(D1); pullback ≤ px + 0.25*ATR(D1) within 3 sessions
on_close(H1):
    pl = SWING(H1).lows_since(lv.t0).last or lv.rbar.low                         # failure short
    if lv.state == RECLAIMED and H1.close < price(pl): enter(E1, SHORT, stop=lv.ext + BUF(H1), T1=nearest_1R(PWM, PWC), T2=PWL)
    ph = SWING(H1).highs_since(lv.t_pull).last or bar_of_low_since(lv.t_pull, H1).high   # acceptance long
    if lv.state == PULLED and H1.close > price(ph): enter(E1, LONG, stop=low_since(lv.t_pull) - BUF(H1), T1=NEXT_LEVEL(...), T2="trail H4")
friday 16:30 ET: flatten PA-05 positions (configurable)
```

| Parameter | Default | Reason |
|---|---|---|
| Week definition | Globex week, Sun 18:00 to Fri 17:00 ET | Notes: weekly open = Sunday 18:00 ET Globex open |
| `k_2b` | 2 H4 bars | Design |
| `accept_disp`, `pull_band` | 0.25 × ATR(D1) each | Notes' breakout-retest template; values are design |
| `pull_window` | 3 sessions | Design |
| `trigger_window` | 6 H1 bars (failure), 1 session (acceptance) | Design |
| `time_stop` | 5 sessions or Friday 16:30 ET | Design; weekend gap control |
| `attempts` | 1 trade per weekly level per week | Design |
| Inherited | `k_swing`, `tol_eq`, `minpen`, `maxpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. PWH and PWL match the prior Globex week's extremes on the traded contract, or on the back-adjusted series in a roll week.
2. The branch matches the last closed D1 state at the week open.
3. Failure: the H4 wick crosses PWH by at least the minimum penetration, an H4 close back below comes within two bars, and the H1 close breaks a post-sweep swing low.
4. Acceptance: the D1 close clears PWH by a quarter ATR, the pullback stays in the band, and the H1 CHoCH comes after the pullback low.
5. The position is flat by Friday 16:30 ET unless the Friday rule is disabled in the logged config.

Bot error signatures: weekly levels from a Monday-open week convention; the H4 reclaim read from the open H4 bar; an acceptance branch armed by a wick instead of a D1 close; weekly levels left untranslated across a roll.

**Failure modes & regime fit.** Weekly levels are hit less often, so samples accumulate slowly. Pool ES, NQ and CL under identical rules, as the notes advise for swing-scale confluence. Failure trades get run over in breakout weeks that began inside the range. Acceptance trades suffer when the D1 trend is late-stage, which is where PA-13 takes over. A single macro event (CPI, FOMC) can decide a week, and the blackout cannot shield a swing position that is already open.

**Relations.** PA-04 is the daily analogue. Run both, because the levels differ, but the registry merges a PWH and PDH that sit within tolerance of each other. PA-01 longs and PA-05 failure shorts can conflict when a D1 uptrend reaches PWH; the branch matrix forbids that particular failure short. PA-12 can replace D1 STRUCTURE as the branch selector (swap, not stack).

## PA-06 Opening range breakout filtered by D1 bias

**At a glance.** Style: intraday, RTH open · Typical hold: 30 minutes to the RTH close · Instruments: ES/MES, NQ/MNQ (OR 09:30–09:45 ET); CL/MCL (OR 09:00–09:15 ET) · Regime: trend days · Evidence: C · Automation: Low.

**Concept basis.** Crabel's opening range breakout appeared as a multi-part series in *Technical Analysis of Stocks & Commodities* in 1989 ([Traders.com: ORB Part 5](https://store.traders.com/-v07-c04-orb-pdf.html)). The notes rely on secondary definitions: long on a break of the first X minutes' high, short on a break of the low, Crabel favoring short ranges, optionally only in the bias direction, with OR width capped against ATR. The only statistic found is secondhand and cuts against the S&P. A table attributed to Kaufman shows ORB win rates in the S&P falling from 68% to 61% with an inside-day filter ([Learning-TA](https://learning-ta.pages.dev/learn/opening-range-breakout)). The Gao et al. intraday-momentum result measures a different window (prior close to 10:00 ET, then the last half-hour), so it is *not* used as support here. That is why this proposal is graded C: a precisely codable, widely used convention without credible tests. The D1 bias filter applies the notes' rule to trade only the side that matches the higher layer. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 (ETH) STRUCTURE | D1, unchanged | Yes |
| LOCATION | ORH / ORL of the first 15 RTH minutes | Same, from ticks | Yes |
| SETUP | OR width between 0.10 and 0.50 × ATR(D1) | Same | Yes |
| TRIGGER | M5 close beyond ORH/ORL by 0.10 × ATR(M5) | VB-B close beyond by 0.10 × ATR(VB-B) | No |
| MANAGEMENT | NEXT_LEVEL; trail on M15 swings; 12:30 ET check; flat 15:55 ET | VB-A swings for the trail | Times yes |

What must remain on clock time: the OR window itself (it is defined in minutes and must never be "the first K volume bars"), the trigger window, the 12:30 ET check and the flat time. **IB variant:** use IBH/IBL (first 60 RTH minutes) as the range, with the trigger window moved to 10:30–13:00 ET. It is slower and gives fewer, later signals.

**Context filter.** D1 STRUCTURE.state = UP permits only the long breakout; DOWN permits only the short. RANGE or TRANSITION means no trade, which keeps PA-06 distinct from PA-07's two-sided breakout.

**Location.** ORH and ORL, computed from ticks between 09:30:00 and 09:44:59 ET (ES/NQ).

**Setup.** At the 09:45 ET close, the OR width satisfies 0.10 × ATR(D1) ≤ (ORH − ORL) ≤ 0.50 × ATR(D1). Very narrow ranges invite whipsaw and very wide ones leave no room; the notes' failure modes name both.

**Trigger.** Between 09:45 and 11:30 ET, the first M5 close at or above ORH + 0.10 × ATR(M5) (longs), or at or below ORL − 0.10 × ATR(M5) (shorts). Bar-close confirmation is chosen over a resting stop to screen out wick-only breaks, at the cost of a worse price.

**Entry order.** E1: a marketable limit at the trigger close ± `slip`, valid for one M5 bar.

**Risk & management.** The stop goes at the OR midpoint minus `buf`(M5) for longs, with `min_stop` = 1.0 × ATR(M5). The design reasoning: a breakout that falls back through the middle of its own range has failed. Size is 1R. T1 = NEXT_LEVEL(LONG, entry), for example PDH, ONH or PWH if they are above. T2 is a trail below confirmed M15 swing lows minus `buf` until the 15:55 ET flat. Breakeven after T1. Time stop: if T1 has not filled and open profit is below +0.5R at 12:30 ET, exit, because the ORB thesis is morning momentum. An armed setup EXPIRES at 11:30 ET without a trigger. It is INVALIDATED if a trigger fires on the side the context does not permit (log it and do not trade).

**Filters.** If a tier-1 release falls inside the OR window, the day is skipped. One trade per day; there is no re-entry after a stop-out on the other side, because that would be PA-10's or PA-15's job. Holiday and early-close sessions are skipped.

**Automation spec.**

```
States: IDLE → ARMED (09:45 close, width ok) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED | EXPIRED (11:30)
at 09:45:00 ET:
    orh, orl = tick_high_low("09:30:00", "09:44:59"); w = orh - orl
    side = {UP: LONG, DOWN: SHORT}.get(STRUCTURE(D1).state)
    if side and 0.10*ATR(D1) <= w <= 0.50*ATR(D1) and not news_in("09:30", "09:45"): state = ARMED
on_close(M5) while ARMED and in_window("09:45", "11:30"):
    if side == LONG and M5.close >= orh + 0.10*ATR(M5) and RISK.ok():
        stop = min((orh + orl)/2 - BUF(M5), M5.close - 1.0*ATR(M5))
        ENTER(E1, LONG, M5.close + SLIP(M5), expiry=1*M5, bracket=(stop, T1=NEXT_LEVEL(LONG, M5.close), T2="trail M15"))
at 12:30 ET: if state == IN_POSITION (T1 not yet filled) and open_R < 0.5: exit
at 15:55 ET: flatten
```

| Parameter | Default | Reason |
|---|---|---|
| `or_len` | 15 minutes (variants: 5 or 30; IB = 60) | Notes: "e.g., 5, 15, 30; Crabel used short ranges" |
| `or_start` | 09:30 ET (ES/NQ), 09:00 ET (CL) | Notes: futures "open" must be defined explicitly |
| `width_band` | 0.10–0.50 × ATR(D1) | Notes: cap OR width vs ATR; values are design |
| `break_disp` | 0.10 × ATR(M5) beyond ORH/ORL, on a close | Design |
| `trigger_window` | 09:45–11:30 ET | Design |
| `stop_rule` | OR midpoint − `buf` | Design |
| `noon_check` | 12:30 ET, exit if below +0.5R | Design |
| Inherited | `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The OR box spans exactly 09:30:00–09:44:59 ET (ES/NQ) and matches tick extremes.
2. The width label sits inside the 0.10–0.50 ATR(D1) band.
3. The D1 state at the open permits the traded side.
4. The trigger M5 bar *closes* beyond the box edge by the displacement, between 09:45 and 11:30 ET.
5. The stop sits at the OR midpoint minus the buffer, and the trade is flat by 15:55 ET.

Bot error signatures: an OR computed from Globex-session bars or from the first VB bars; a wick-only trigger; a second trade after a stop-out; trading on a RANGE day.

**Failure modes & regime fit.** ORB loses steadily on rotation days, where the open breaks one way and comes back; that is the trap PA-10 and PA-15 try to fade. It also loses on days where the real move came overnight and the RTH session only digests it. The D1 bias filter removes counter-trend breaks but not rotation days. Running ORB on NR7 days is a common practitioner pairing, but the only statistic found (the unverified Kaufman table) suggests it may *hurt* in the S&P, so it is not built in.

**Relations.** PA-06 conflicts directly with PA-10 and PA-15. All three trade the same opening window with opposite theses, so pick one per instrument per validation cycle. PA-07 is the two-sided, compression-filtered relative. PA-11 trades a later window and is independent.

## PA-07 NR4/NR7/inside-day range-expansion breakout (Crabel)

**At a glance.** Style: intraday (swing variant noted) · Typical hold: to the RTH close; 1–3 sessions in the swing variant · Instruments: ES/MES, NQ/MNQ, CL/MCL · Regime: compression to expansion · Evidence: C · Automation: Low.

**Concept basis.** An NR4 day has the smallest high-low range of the last 4 days, and an NR7 the smallest of the last 7. Every NR7 is also an NR4. An inside day's high and low both sit inside the prior day's range ([LuxAlgo: NR4/NR7](https://www.luxalgo.com/library/concept/nr4-nr7-narrow-range-bars/), attributing the definitions to Crabel, 1990). An ID/NR4 is an inside day that is also an NR4. It is neutral until price breaks one side, and it is traded with a buy stop above the high and a sell stop below the low ([Trading Setups Review: Inside Day NR4](https://tradingsetupsreview.com/inside-daynr4)). The definitions are exact, which makes this one of the simplest proposals to automate. The evidence is not: the notes found only secondary definitions and no credible statistics, hence grade C. The named failure modes are whipsaw through both sides and compression ahead of scheduled news (CPI, FOMC, EIA for CL). See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | W1 STRUCTURE | W1, unchanged | Yes |
| LOCATION | NR day's high and low | Same | Yes |
| SETUP | D1-RTH bar is NR7 or ID/NR4 | Same (D1 always on clock) | Yes |
| TRIGGER | Resting stop-limits 1 tick beyond the NR extremes | VB-B close beyond the NR extreme by `minpen`(VB-B) | No |
| MANAGEMENT | NEXT_LEVEL; M15 trail; flat 15:55 ET | VB-A trail | Times yes |

What must remain on clock time: NR detection on daily bars, the order window (09:30–12:00 ET) and the flat time. NR detection uses RTH daily ranges (ES/NQ 09:30–16:00 ET; CL 09:00–14:30 ET), the session Crabel's era traded. An ETH-range variant is possible but is a separate `strategy_version`. The volume version replaces the resting stop with a bar-close trigger. That is slower, but it reviews more cleanly, because a VB-B close beyond the extreme is unambiguous.

**Context filter.** W1 STRUCTURE.state = UP: long side only. DOWN: short side only. RANGE or TRANSITION: both sides, OCO (Crabel-neutral). Note that SWING(W1) at k = 2 confirms few swings, so W1 will often read RANGE or TRANSITION. That is acceptable here, because it simply means both sides are eligible.

**Location.** The NR day's high (NRH) and low (NRL).

**Setup.** At the RTH close, the just-completed RTH day is an NR7, or an inside day that is also an NR4. Skip the signal if the next session contains an FOMC statement, NFP or CPI before 12:00 ET, or (for CL) the EIA report. Compression before news is the classic trap.

**Trigger.** In the next RTH session, between 09:30 and 12:00 ET, price trades 1 tick beyond NRH or NRL. A side is dropped if the session *opens* beyond that extreme, because a gap through the range is not a range breakout.

**Entry order.** E2: stop-limit orders at NRH + 1 tick and/or NRL − 1 tick, limit = trigger ± `slip`, placed at 09:30 ET and cancelled at 12:00 ET. OCO when both sides are live: one fill cancels the other.

**Risk & management.** The stop goes at the opposite NR extreme ∓ `buf`(M15). The NR day is narrow by construction, which is the setup's appeal. `min_stop` = 1.0 × ATR(M15). Size is 1R. T1 = NEXT_LEVEL; T2 is a trail below confirmed M15 swing lows minus `buf`, flat at 15:55 ET (14:25 ET for CL). Breakeven after T1. **Swing variant:** hold T2 for up to 3 sessions, trailing on H4 swings, as a separate `strategy_version`. No reversal after a stop-out: if price whipsaws through both sides, the signal is spent.

**Filters.** One fill per NR signal. Skip holiday and early-close sessions. Volatility floor: none, since low volatility is the setup. Volatility ceiling: skip if ATR(D1) exceeds 2.0× its 100-session median, because NR days in crisis regimes are still huge.

**Automation spec.**

```
States: IDLE → ARMED (NR detected at RTH close) → ORDER_PENDING (09:30 OCO) → IN_POSITION → MANAGED → CLOSED
        ORDER_PENDING → EXPIRED (12:00 ET, no fill) | CANCELLED (news, gap)
at RTH close (day d):
    r = range_rth(d)
    nr7  = r == min(range_rth(d-6 .. d))
    idnr4 = inside(d, d-1) and r == min(range_rth(d-3 .. d))
    if (nr7 or idnr4) and not tier1_before_noon(d+1): state = ARMED; nrh, nrl = high(d), low(d)
at 09:30 ET (d+1):
    sides = {UP: [LONG], DOWN: [SHORT]}.get(STRUCTURE(W1).state, [LONG, SHORT])
    drop any side whose extreme the open already crossed
    ENTER(E2, sides, px={LONG: nrh + tick, SHORT: nrl - tick}, oco=True, expiry="12:00 ET",
          bracket={LONG: (nrl - BUF(M15), NEXT_LEVEL(LONG, nrh), "trail M15"), SHORT: mirror})
at 15:55 ET: flatten (intraday version)
```

| Parameter | Default | Reason |
|---|---|---|
| `nr_rule` | NR7, or ID that is also NR4 | Crabel definitions (secondary sources) |
| `nr_session` | RTH daily ranges | Design; matches the era of the definition |
| `order_window` | 09:30–12:00 ET next session | Design: expansion should show early |
| `news_skip` | Skip if FOMC/NFP/CPI (or EIA for CL) falls before noon on the breakout day | Notes' named failure mode |
| `gap_rule` | Drop a side the open already crossed | Design |
| `stop_rule` | Opposite NR extreme ∓ `buf` | Design; uses the small range as risk |
| `vol_ceiling` | ATR(D1) ≤ 2.0 × 100-session median | Design |
| Inherited | `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The signal day's RTH range is the smallest of the last 7 RTH days (or it is inside the prior day and the smallest of 4). Check the range labels.
2. W1 context matches the sides armed.
3. Orders appear only from 09:30 ET on the next session, 1 tick beyond the extremes, and are gone by 12:00 ET.
4. After one side fills, the other order is cancelled.
5. The stop sits at the opposite extreme plus the buffer.

Bot error signatures: NR detection on ETH ranges when RTH was configured; an order still working after 12:00 ET; both sides filled; a signal taken ahead of a scheduled tier-1 release.

**Failure modes & regime fit.** The two-sided whipsaw is the main cost. It is limited to one stop-out because there is no reversal, but it happens often in quiet regimes. NR days that cluster ahead of holidays or events are false compression. In W1 trends, the one-sided version gives up the occasional counter-trend expansion.

**Relations.** PA-07 overlaps with PA-06 on NR days, since both are opening-session breakouts. Run one or the other per instrument. PA-13's G2/G3 flags do not gate PA-07. Combining NR compression with profile acceptance is a CX-family idea and is not done here.

## PA-08 Brooks H2/L2 two-legged pullback on volume bars

**At a glance.** Style: scalp · Typical hold: 5–45 minutes · Instruments: ES/MES, NQ/MNQ in RTH (CL/MCL in its RTH as a separate line) · Regime: intraday trend · Evidence: C · Automation: Med.

**Concept basis.** Brooks' High 1 is the first attempt to resume an uptrend after a pullback begins. High 2 is the second attempt, after a two-legged pullback. The entry is a stop above the signal bar after leg two, with the stop beyond the second leg ([NexusFi: Two-legged pullback](https://nexusfi.com/a/strategies/two-legged-pullback-trading)). H1/H2 entries are most reliable in trends. In trading ranges, every push is a potential H1/H2 that fails ([NexusFi: Signal bars & entry bars](https://nexusfi.com/a/strategies/signal-bars-entry-bars-price-action)). The labels are debated even on Brooks' own forum ([Brooks forum: High 1-2 / Low 1-2](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/high-12-low-12/)), and the secondary sources conflict on whether a "High 1" needs a *trade* above or a *close* above the prior bar's high. The coded rule below is therefore one documented interpretation, comparable to the open-source [Al Brooks Second Entry script](https://www.tradingview.com/script/YUixSlPL-Al-Brooks-Second-Entry/). No reliable published win rate exists. The case for volume bars comes from practitioners, not tests. Brooks course staff say signal bars and trend lines carry over to tick charts. A moderator found that roughly **6,500-volume ES charts resembled a 5-minute chart (2021)**, and the admin targets about a 3–5-minute equivalent while warning that faster charts give "more false signals" ([Brooks forum: tick chart](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). VB-B is sized to that 3–5-minute equivalent. The signal bar is a bar pattern, and bar patterns alone are grade D, so it is allowed only inside a confirmed context-layer trend. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) and [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version (primary) | Clock-only? |
|---|---|---|---|
| CONTEXT | M15 STRUCTURE = UP | VB-A STRUCTURE = UP | No |
| LOCATION | Pullback held above the context layer's `protected_low` | Same | No |
| SETUP | M5 two-legged pullback (H1, then leg two) | VB-B two-legged pullback | No |
| TRIGGER | M5 signal bar, stop entry above it (the H2) | VB-B signal bar | No |
| MANAGEMENT | 1R, then measured move; M5 time stop | Same on VB-B | Session times only |

What must remain on clock time: the RTH window, the blackout and pre-release flatten, and the flat time. VB-A to VB-B is 5×, and M15 to M5 is 3×. **Faster variant:** VB-B context with VB-C setup and trigger (or M5/M1 on time bars). Brooks staff call charts that fast "far too fast", so treat it as experimental.

**Context filter.** The context layer's STRUCTURE.state = UP (mirror: DOWN for L2 shorts). RANGE and TRANSITION are not traded, because H2s fail in ranges.

**Location.** The whole pullback must stay above the context layer's `protected_low`. A pullback that closes below it resets the count and stands aside.

**Setup.** This is the coded H2, one interpretation, pinned here.
1. **Pullback start.** A setup-layer bar whose high is below the prior bar's high, occurring within 10 bars of the highest high since the context layer's last BOS_UP.
2. **H1.** The first subsequent bar whose high exceeds the prior bar's high.
3. **Leg two.** After the H1 bar, at least one bar trades below the H1 bar's low.
4. **H2 armed.** Leg two is complete. From then on, each closed bar is a candidate signal bar if it closes at or above its own midpoint (a bull signal bar, a design filter).

**Trigger.** The next bar trades 1 tick above the candidate signal bar's high. That bar is the H2.

**Entry order.** E2: a buy stop-limit 1 tick above the signal bar's high, limit = trigger + `slip`, valid for one bar. If unfilled, re-place it above the next qualifying signal bar, up to 5 re-placements, and then the setup expires.

**Risk & management.** The stop goes at the pullback low (the lowest low since the pullback start) minus `buf`, with `min_stop` = 1.0 × ATR(setup layer). Size is 1R. T1 is entry + 1R, the scalp leg. T2 = MM(impulse start, trend extreme, pullback low): leg 1 = leg 2 ([LuxAlgo: Measured Move](https://www.luxalgo.com/library/concept/measured-move/)). After T1, move to breakeven and hold the remainder to T2 or the flat time. Time stop: exit after 6 setup-layer bars if price has not reached +0.5R. The setup resets when a new trend high prints before the trigger, and it is INVALIDATED on a close below the context `protected_low`. After an H2 stops out, an H3 is not traded (design: a third leg is a wedge or a range sign).

**Filters.** RTH 09:35–15:45 ET for ES/NQ; 09:05–14:15 ET for CL. Clock guard: ignore a signal bar whose duration exceeded 30 minutes. At most 2 attempts per context-layer trend leg and 4 trades per day. Flatten at T−2 minutes before tier-1 releases.

**Automation spec.**

```
States: IDLE → ARMED:PULLBACK → ARMED:H1 → ARMED:LEG2 → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
on_close(B) where B = VB-B (or M5):
    C = STRUCTURE(VB-A)
    if C.state != UP or B.close < C.protected_low.price: reset("context")
    if state == IDLE and B.high < B[1].high and bars_since(highest_high_since(C.last_bos_time)) <= 10:
        state = ARMED:PULLBACK; pb_low = B.low; t0 = B.open_time
    pb_low = min(pb_low, B.low)
    if B.high > highest_high_since(C.last_bos_time): reset("new high")       # pullback over before H2
    if state == ARMED:PULLBACK and B.high > B[1].high: state = ARMED:H1; h1_low = B.low
    elif state == ARMED:H1 and B.low < h1_low: state = ARMED:LEG2
    elif state == ARMED:LEG2:
        if B.close >= (B.high + B.low)/2 and duration(B) <= 30min and RISK.ok() and replaced < 5:
            stop = min(pb_low - BUF(VB-B), B.high - 1.0*ATR(VB-B))
            ENTER(E2, LONG, B.high + tick, expiry=1*B,
                  bracket=(stop, T1=B.high + tick + R, T2=MM(impulse_start, trend_high, pb_low)))
            replaced += 1
```

| Parameter | Default | Reason |
|---|---|---|
| `bar_type` | VB-B (time version: M5) | Brooks staff: a 3–5-minute equivalent; M5 is Brooks' own reported chart |
| `context` | VB-A (time version: M15) STRUCTURE | Notes' scalping stack: 15m bias, 5m setup |
| `h_rule` | Trade-through of the prior bar's high (not a close) | Sources conflict; pinned to the setup sheet's "high above previous bar" |
| `leg2_rule` | A bar below the H1 bar's low | Two-leg interpretation; design |
| `signal_bar` | Close ≥ bar midpoint | Design; Brooks prefers bull signal bars |
| `replace_max` | 5 bars | Design |
| `t1` | 1R; T2 = leg 1 = leg 2 | Scalp convention; Brooks measured move |
| `time_stop` | 6 bars without +0.5R | Design |
| `attempts` | 2 per context leg, 4 per day, no H3 | Design |
| `clock_guard` | Signal bar ≤ 30 min | Family VB guard |
| Inherited | `k_swing` (context layer), `buf`, `min_stop`, `slip`, `t1_split` | Family defaults; `rr_floor` is met by construction |

**Visual review checklist.**
1. The context layer (VB-A or M15) shows confirmed higher highs and higher lows, with the last BOS_UP confirmed before the pullback.
2. The pullback begins within 10 bars of the trend high, and the H1 bar is labelled.
3. A bar trades below the H1 bar's low (leg two).
4. The signal bar closes in its upper half, and the H2 bar trades one tick above its high.
5. The stop sits below the pullback low by the buffer, and the pullback low never closed below the context protected low.

Bot error signatures: an H2 counted without a second leg; a signal bar taken from a still-open VB bar; a stop entry moved intrabar; an H2 traded while context was RANGE; a signal bar that took 40 minutes overnight (the clock guard failed).

**Failure modes & regime fit.** This proposal depends on the regime. It works in clean intraday trends with shallow two-legged pullbacks. It bleeds in ranges that the context layer still reads as UP (the lag of k = 2 swings), and around the open, when volume bars print in seconds and swings confirm almost at once. The definitional ambiguity means the user's discretionary read of "H2" will often differ from the bot's. That makes the agreement rate in signal-only review the key statistic for this proposal.

**Relations.** PA-08 is PA-01's thesis at scalp scale. Do not hold both on one instrument, per the one-position rule. It conflicts with PA-14 (opposite-direction intraday scalps); run them on different instruments. HTF location filters from VP or FIB files would be CX material.

## PA-09 Weekly-open bias with a daily-open retest

**At a glance.** Style: intraday · Typical hold: 1–6 hours · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH, Tuesday to Friday · Regime: directional weeks · Evidence: C · Automation: Med.

**Concept basis.** Watching the developing higher-timeframe candle, meaning which side of its open price is on, is a coherent and codable lens. It is mathematically just the sign of the current weekly or daily bar. The notes found **no academic support** for "price above the weekly or daily open" as a filter. The nearest rigorous evidence, early-session direction persisting into the close, comes from a specific window and a different reference ([Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). This proposal uses the weekly open for direction and the daily open as a pullback location in that direction. Both are widely watched clock prices, and the Osler order-clustering argument applies to them only by analogy ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Hence grade C. The notes stress that developing-period values must be computed from LTF ticks with explicit session boundaries, not from an HTF series' current bar, to keep historical and live behavior identical. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | Side of WO, read on H1 closes with a dead-band | Same (H1 clock) | Yes |
| LOCATION | DO (Globex trade-date open, 18:00 ET) ± 0.15 × ATR(H1) | Same | Yes |
| SETUP | M15 pullback into the DO zone after an excursion away from DO | VB-A | No |
| TRIGGER | M5 CHoCH away from DO | VB-B CHoCH | No |
| MANAGEMENT | Session high so far, NEXT_LEVEL, M15 trail | VB-A trail | Levels yes |

What must remain on clock time: WO, DO, ATR(D1), ATR(H1), the session-high-so-far, and the trading window. On Mondays the trade date opens at the weekly open, so DO = WO and the proposal does not run.

**Context filter.** On the last closed H1 bar: H1.close − WO ≥ +0.25 × ATR(D1) gives a long bias, and ≤ −0.25 × ATR(D1) gives a short bias. Anything in between means no trade. The dead-band stops the bias flickering around the open.

**Location.** The DO zone: DO ± 0.15 × ATR(H1).

**Setup.** For longs, the session high so far is at least DO + 0.5 × ATR(H1), so price has moved away from the open on the bias side. Then an M15 bar's low enters the DO zone, with no M15 close below the zone's lower edge.

**Trigger.** After the zone touch, an M5 close above the most recent M5 swing high confirmed during the pullback (M5 CHoCH_UP). If none confirmed, the high of the M5 bar that printed the zone low stands in. The trigger window is 6 M15 bars after the touch.

**Entry order.** E1: a marketable limit at the trigger close + `slip`, valid for one M5 bar.

**Risk & management.** The stop goes at the lower of the pullback low and DO − 0.15 × ATR(H1), minus `buf`(M5), with `min_stop` = 1.0 × ATR(M5). Size is 1R. T1 is the session high so far if it is at least 1R away; otherwise T1 = NEXT_LEVEL. T2 is PWH (longs) if within 3R, else a trail below confirmed M15 swing lows. Breakeven after T1. The position is flat at 15:55 ET. Time stop: 16 M15 bars. An armed setup is INVALIDATED by an M15 close beyond the far zone edge (DO lost) or by the H1 bias flipping. It EXPIRES after 6 M15 bars without a trigger.

**Filters.** Tuesday to Friday only. Window 03:00–15:00 ET. Blackout per the family rules. One trade per day.

**Automation spec.**

```
States: IDLE → ARMED:AWAY → ARMED:TOUCH → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
on_close(H1): bias = sign_with_band(H1.close - WO, 0.25*ATR(D1))      # WO, DO from ticks, session-aware
on_close(M15):
    if weekday == MON or not in_window("03:00", "15:00"): return
    zl, zh = DO - 0.15*ATR(H1), DO + 0.15*ATR(H1)
    if bias == LONG and state == IDLE and session_high_so_far >= DO + 0.5*ATR(H1): state = ARMED:AWAY
    if state == ARMED:AWAY and M15.low <= zh:
        if M15.close < zl: state = INVALIDATED
        else: state = ARMED:TOUCH; t_touch = M15.open_time
    if state == ARMED:TOUCH and (M15.close < zl or bias != LONG): state = INVALIDATED
on_close(M5):
    if state == ARMED:TOUCH:
        ph = SWING(M5).highs_since(t_touch).last or bar_of_low_since(t_touch, M5).high
        if M5.close > price(ph) and RISK.ok():
            stop = min(min(low_since(t_touch), zl) - BUF(M5), M5.close - 1.0*ATR(M5))
            ENTER(E1, LONG, M5.close + SLIP(M5), expiry=1*M5,
                  bracket=(stop, T1=hod_or_next_level(), T2=PWH_if_within_3R_else_trail()))
```

| Parameter | Default | Reason |
|---|---|---|
| `wo` | Sunday 18:00 ET Globex open | Notes' futures convention |
| `do` | Trade-date open at 18:00 ET (ETH) | Shared convention; ETH chosen here |
| `bias_band` | 0.25 × ATR(D1) | Notes: dead-band to avoid flicker; value is design |
| `zone` | DO ± 0.15 × ATR(H1) | Shared tolerance convention, on H1 |
| `away` | Session high ≥ DO + 0.5 × ATR(H1) | Design: a real excursion before the retest |
| `trigger_window` | 6 M15 bars | Design |
| `time_stop` | 16 M15 bars | Design |
| Inherited | `k_swing`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. WO and DO lines sit at the Sunday and trade-date Globex opens.
2. The H1 bias row shows price beyond WO by more than the dead-band at the trigger time.
3. Price moved at least half an H1 ATR away from DO before returning.
4. The touch bar's low is inside the zone and its close is not below it.
5. The M5 trigger closes above a post-touch swing high.
6. The trade is skipped on Mondays.

Bot error signatures: WO or DO taken from an RTH open; bias read from the developing weekly bar of an HTF series instead of tick-derived values; a trade on a Monday; a zone width computed from the wrong layer's ATR.

**Failure modes & regime fit.** This fails in rotational weeks, where price crosses WO repeatedly; the dead-band reduces but does not remove the whipsaw. It also fails on trend-reversal days that start with an apparent DO retest. It does best in weeks with a clear early direction. Because the context is a single sign, it carries less information than the swing-based contexts, which is why it stays at grade C.

**Relations.** PA-09 complements PA-01 and PA-08 on a different level type. Do not run it alongside PA-10 on the same instrument: PA-10 fades a break of the session open, while PA-09 buys a hold of the daily open. PA-12's sign can serve as a stricter weekly context in a separate `strategy_version` (swap, not stack).

## PA-10 Failed break of the RTH open (Power of Three, restated testably)

**At a glance.** Style: intraday, open to midday · Typical hold: 1–6 hours · Instruments: ES/MES, NQ/MNQ (RTH open 09:30 ET) · Regime: opening rotation inside an HTF trend · Evidence: **C**, a hypothesis with no supporting tests · Automation: Low.

**Concept basis.** ICT's "Power of Three" describes a period that consolidates around its open (accumulation), runs stops on the wrong side of the open (manipulation), then expands in the "true" direction into the close (distribution) ([FXOpen](https://fxopen.com/blog/en/what-is-ict-po3-and-how-do-traders-use-it/)). Its timing definitions conflict. One indicator sets accumulation at 19:00–01:00 EST; others map Asia to accumulation and the New York open to manipulation ([LuxAlgo PO3 indicator](https://www.luxalgo.com/library/indicator/5thZ7SVC-power-of-3-ict-01-amd-ict-smc-accumulations/)). Even a vendor teaching it answers "No" to whether every day follows the sequence ([LuxAlgo: AMD](https://www.luxalgo.com/library/concept/accumulation-manipulation-distribution/)). As usually stated, it explains any candle with a wick after the fact, so it is not falsifiable. The notes' testable restatement is a conditional failed-breakdown of the open. If by time T price has traded at least X below the session open and then reclaims the open, the session should close above the open more often than the unconditional rate. Mechanically, that is a 2B at a clock-time level. Be clear that **Gao et al.'s rigorous result points the other way**: early-session moves tend to *continue* into the close ([Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). Run this one as a hypothesis test, not as a belief. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 (ETH) STRUCTURE | D1, unchanged | Yes |
| LOCATION | DO-RTH = first trade at or after 09:30:00 ET | Same | Yes |
| SETUP | Excursion ≥ 0.10 × ATR(D1) against the D1 bias, before 10:30 ET | Same (measured from ticks) | Yes |
| TRIGGER | M5 close back across DO-RTH by ≥ 1 tick, before 11:00 ET | VB-B close | No |
| MANAGEMENT | RTH session high so far, NEXT_LEVEL, M15 trail, flat 15:50 ET | VB-A trail | Times yes |

What must remain on clock time: the open price, the excursion window (09:30–10:30 ET), the trigger deadline (11:00 ET) and the flat time. **Globex variant:** DO = 18:00 ET open, with the excursion window set to one of the PO3 vendor timings. It is not the default because the sources disagree on the window.

**Context filter.** D1 STRUCTURE.state = UP: only failed breakdowns (longs). DOWN: only failed breakouts (shorts). RANGE or TRANSITION: no trade. PO3 proponents take the "true direction" from higher-timeframe bias.

**Location.** DO-RTH, the RTH open price.

**Setup.** Between 09:30 and 10:30 ET, price trades at or below DO-RTH − 0.10 × ATR(D1) (for longs). The excursion must not exceed 0.50 × ATR(D1); a deeper move is a trend day against the bias, and the setup is INVALIDATED.

**Trigger.** The first M5 close at or above DO-RTH + 1 tick after the excursion and before 11:00 ET.

**Entry order.** E1: a marketable limit at the trigger close + `slip`, valid for one M5 bar.

**Risk & management.** The stop goes at the excursion low minus `buf`(M5), with `min_stop` = 1.0 × ATR(M5). Size is 1R. T1 is the RTH session high so far if it is at least 1R away; otherwise T1 = NEXT_LEVEL. T2 is the "distribution into the close": hold to 15:50 ET while trailing below confirmed M15 swing lows minus `buf`. Breakeven after T1. The setup EXPIRES at 11:00 ET without a trigger.

**Filters.** RTH only. Skip if a tier-1 release falls between 09:30 and 11:00 ET, because the excursion would be news, not "manipulation". One trade per day. Skip holiday and early-close sessions.

**Automation spec.**

```
States: IDLE → ARMED (09:30, context ok) → ARMED:EXCURSION → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
at 09:30:00 ET: o = first_trade_at_or_after("09:30:00"); bias = STRUCTURE(D1).state; state = ARMED if bias in {UP, DOWN}
on_tick until 10:30 ET (bias UP shown):
    if low_since_open <= o - 0.10*ATR(D1): state = ARMED:EXCURSION
    if low_since_open <  o - 0.50*ATR(D1): state = INVALIDATED("trend day")
on_close(M5) while ARMED:EXCURSION and now < 11:00 ET:
    if M5.close >= o + tick and RISK.ok():
        stop = min(low_since_open - BUF(M5), M5.close - 1.0*ATR(M5))
        ENTER(E1, LONG, M5.close + SLIP(M5), expiry=1*M5, bracket=(stop, T1=rth_high_or_next_level(), T2="trail M15 to 15:50"))
at 11:00 ET: if state != ORDER_PENDING/IN_POSITION: state = EXPIRED
```

| Parameter | Default | Reason |
|---|---|---|
| `open_ref` | RTH open (09:30 ET) | Design: most ES/NQ volume prints in RTH; PO3 timing sources conflict |
| `exc_min` | 0.10 × ATR(D1) | Notes: "at least X below the open"; X is design |
| `exc_max` | 0.50 × ATR(D1) | Design: separates a "manipulation" excursion from a trend day |
| `exc_window` | 09:30–10:30 ET | Design |
| `trigger_deadline` | 11:00 ET | Design |
| `flat` | 15:50 ET | Design ("into the close") |
| Inherited | `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The open line is the first RTH trade, not the Globex open.
2. D1 context permits the side.
3. The excursion low is at least 0.10 ATR(D1) beyond the open, at most 0.50, and before 10:30 ET.
4. An M5 close back across the open comes before 11:00 ET.
5. The stop sits under the excursion low plus the buffer.

Bot error signatures: a Globex open used for the reference; an excursion measured with a bar close instead of a tick extreme; a trade taken after 11:00 ET; a trade on a news morning.

**Failure modes & regime fit.** If Gao et al.'s continuation effect dominates in ES, this proposal loses on days whose early move against the D1 bias continues. That is the hypothesis under test. It also gets chopped on days that oscillate around the open. It fits rotation mornings inside an HTF trend.

**Relations.** PA-10 is the direct counter-hypothesis to PA-11; the two can run side by side in signal-only mode as a deliberate experiment, but not live on one account. It conflicts with PA-06 and PA-15 in the same window, and with PA-09, which buys a hold of an open rather than a reclaim.

## PA-11 Intraday momentum: first half-hour predicts the last half-hour

**At a glance.** Style: intraday, clock-timed · Typical hold: 30 minutes (15:30–16:00 ET) · Instruments: ES/MES as the primary line; NQ/MNQ as a separate experimental line; CL excluded (no evidence, different session) · Regime: any; the effect is stronger on volatile, high-volume days · Evidence: **A** (mechanism peer-reviewed in SPY; not verified in futures) · Automation: Low.

**Concept basis.** Gao, Han, Li and Zhou find that the first half-hour return of the day, **measured from the previous day's close** and so including the overnight move, predicts the last half-hour return in SPY over 1993–2013. The R² is about 1.6%, and predictability rises with volatility and volume ([Gao et al., JFE 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414); [working paper](https://www3.nd.edu/~zda/intramom.pdf)). The offered explanations are investors rebalancing in the first and last half-hours, and late-informed traders acting on morning information ([working paper](https://www3.nd.edu/~zda/intramom.pdf)). ES tracks SPY closely, so the effect plausibly transfers, but the notes did not verify it for futures. An R² of 1.6% means most days are noise, costs matter, and the edge exists only in aggregate. In this file it is the purest "clock-time reference level" trade: PDC is the level, and the clock is the trigger. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | PDC (last trade at or before 16:00:00 ET, prior session) | Same | Yes |
| LOCATION | Not applicable; the trade is defined by time, not price | — | — |
| SETUP | r1 = price at 10:00:00 ET − PDC, with a dead-band | Same | Yes |
| TRIGGER | Clock: 15:30:00 ET | Same | Yes |
| MANAGEMENT | Catastrophic stop from ATR(M30-RTH); time exit 15:59:30 ET | Same | Yes |

What must remain on clock time: all of it. **There is no volume-bar version of the signal.** The effect is a time-of-day pattern, and a volume clock removes exactly the intraday seasonality being traded ([Easley et al.](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). The only volume-bar element a user could add is to *display* the 15:30–16:00 window on a VB-B chart for review.

**Context filter.** None beyond the signal. Optional, off by default: trade only if ATR(D1) ≥ its 60-session median, following Gao's finding that predictability rises with volatility. Turning it on makes a new `strategy_version`.

**Location.** Not applicable.

**Setup.** At 10:00:00 ET, compute d = P(10:00) − PDC. If |d| < 0.10 × ATR(D1), there is no signal (design dead-band against near-zero signs). Otherwise, direction = sign(d).

**Trigger.** The clock reaching 15:30:00 ET on a day with a valid direction, outside any blackout.

**Entry order.** E1 at 15:30:00 ET: a marketable limit at the last trade ± `slip`(M5), valid for 60 seconds. Unfilled means no trade, logged.

**Risk & management.** The catastrophic stop sits 1.0 × ATR(M30) from entry, using M30 bars on RTH data. It defines 1R for sizing. There is no target; the exit is by time at 15:59:30 ET via a marketable limit, with a broker-side time flatten as backstop (Rithmic `stopMarketAtSsboe` / `targetMarketAtSsboe`, Tradovate `flattenTimestamp`; see [07 Automation architecture](07%20Automation%20architecture.md)). No breakeven or trailing, since the hold is too short and those rules would alter the tested mechanism.

**Filters.** Skip early-close and holiday sessions, because the "last half-hour" differs. Skip FOMC statement days by default: the afternoon is event-driven, which is not the mechanism described (design; configurable). Blackout per the family rules. One trade per day per instrument.

**Automation spec.**

```
States: IDLE → ARMED (10:00 signal) → ORDER_PENDING (15:30) → IN_POSITION → CLOSED (15:59:30) | EXPIRED (no fill)
at 16:00:00 ET (day d-1): PDC = last_trade_at_or_before("16:00:00")
at 10:00:00 ET (day d):
    if early_close(d) or holiday(d) or (skip_fomc and fomc_day(d)): return
    dlt = last_trade_at_or_before("10:00:00") - PDC
    if abs(dlt) >= 0.10*ATR(D1): side = LONG if dlt > 0 else SHORT; state = ARMED; LOG(id, "ARMED", {PDC, dlt})
at 15:30:00 ET:
    if state == ARMED and RISK.ok() and not blackout():
        stop = entry -/+ 1.0*ATR(M30_RTH)
        ENTER(E1, side, last ± SLIP(M5), expiry=60s, bracket=(stop, T1=None, T2=None), flatten_at="15:59:30")
at 15:59:30 ET: exit at marketable limit; broker time-flatten as backstop
```

| Parameter | Default | Reason |
|---|---|---|
| `pdc` | Last trade at or before 16:00:00 ET, prior session | Matches Gao's SPY close; not the 17:00 Globex close or settlement (design) |
| `signal_time` | 10:00:00 ET | Gao: first half-hour |
| `entry_time` / `exit_time` | 15:30:00 / 15:59:30 ET | Gao: last half-hour; exit 30 s early to avoid closing-print conduct issues (design) |
| `dead_band` | 0.10 × ATR(D1) | Design |
| `stop` | 1.0 × ATR(M30, RTH) | Design: catastrophic only; sets 1R |
| `vol_filter` | Off (option: ATR(D1) ≥ 60-session median) | Gao: stronger when volatile |
| `skip_fomc` | On | Design |
| Inherited | `slip` | Family default; the swing parameters do not apply |

**Visual review checklist.**
1. The PDC marker sits on the prior session's 16:00 ET price.
2. The 10:00 ET marker and the sign of the gap from PDC match the trade direction, and the gap exceeds the dead-band.
3. Entry prints at 15:30 ET, and exit at 15:59:30 ET or the stop.
4. No trade on early-close days or (by default) FOMC days.

Bot error signatures: PDC taken from settlement or the 17:00 ET close; a signal computed at 09:30 + 30 minutes on an early-open or holiday schedule; entry outside 15:30 ± 1 minute; a missing flatten.

**Failure modes & regime fit.** The edge is small (R² about 1.6%) and was measured in SPY. Commissions and 1–2 ticks of slippage each way are a large fraction of the expected move, so expect long flat or losing stretches even if the effect is real. Closing-period dynamics in futures (index rebalancing days, quarterly expiries) can dominate single days. CME's updated Rule 575 FAQ (advisory RA2608-5, effective August 13, 2026) addresses disorderly execution during the closing period ([CME RA2608-5](https://www.cmegroup.com/content/dam/cmegroup/notices/market-regulation/2026/07/cme-group-ra2608-5.pdf); [07 Automation architecture](07%20Automation%20architecture.md)), which is another reason the bot exits before 16:00 ET with plain marketable orders. Signals arrive daily, so this is the fastest proposal in the file to accumulate a forward sample.

**Relations.** PA-11 is independent of every other PA proposal in time, except PA-10, whose opposite claim about the opening move makes the two a natural paired experiment in signal-only mode. It can coexist with intraday positions only under the one-position rule. In practice, run it on MES while the other proposals run elsewhere.

## PA-12 Time-series momentum as a weekly swing position

**At a glance.** Style: swing / position · Typical hold: one month per decision, often several consecutive months · Instruments: ES/MES, NQ/MNQ and CL/MCL together at equal R, since the evidence is a diversified result · Regime: persistent trends; it suffers in sharp reversals and trendless years · Evidence: **A** · Automation: Low.

**Concept basis.** Moskowitz, Ooi and Pedersen show that across **58 liquid futures and forwards** (equity indices, currencies, commodities, bonds), an instrument's own past return predicts its future return. The effect persists over 1–12 months and partially reverses at longer horizons ([JFE 2012](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). AQR reports robustness across sub-samples, look-backs and holding periods. Its public dataset uses a **12-month look-back and 1-month hold, January 1985 to December 2009** ([AQR data page](https://www.aqr.com/Insights/Datasets/Time-Series-Momentum-Original-Paper-Data)). The notes call this the bias definition with the strongest published support for futures, with the caveat that it was established for diversified, monthly-rebalanced portfolios, not single-instrument entries. A 52-week look-back on weekly candles respects the one-week cap, because the look-back is a lookup, not a decision layer. The proposal is "price action" only in the narrow sense that its sole input is past price at clock-time closes. Its value to the family is as a slow, low-maintenance position and as an evidence-backed alternative CONTEXT for PA-01, PA-05 and PA-09. See [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | W1: sign(close − close 52 weeks earlier) | None; W1 always on clock | Yes |
| LOCATION | Not applicable | — | — |
| SETUP | Last W1 close of each calendar month (the evaluation point) | — | Yes |
| TRIGGER | First RTH session after evaluation, 09:35 ET | — | Yes |
| MANAGEMENT | D1 for the disaster stop and rolls; ATR(W1) for sizing | — | Yes |

What must remain on clock time: everything. **There is no volume-bar version**, because W1 and D1 stay on clock time by convention, and the published result is defined on calendar returns.

**Context filter.** The 52-week return sign, computed on a back-adjusted continuous series so that roll gaps do not masquerade as returns ([07 Automation architecture](07%20Automation%20architecture.md)).

**Location.** Not applicable.

**Setup.** At the last W1 close of each calendar month (Friday, 17:00 ET), record the sign for each instrument.

**Trigger.** If the target position differs from the current one (long, short or flat after a disaster stop), act at 09:35 ET on the next RTH session.

**Entry order.** E1: a marketable limit at last ± `slip`(M5), valid for 2 minutes. If unfilled, retry once at 10:00 ET, then alert.

**Risk & management.** The disaster stop is a server-side stop at 2.5 × ATR(W1) from entry. That distance defines 1R, so position size automatically scales inversely with volatility. Be clear that this is a design addition the published strategy does not have, and that it changes the strategy's behavior. If the stop is hit, stay flat until the next monthly evaluation. There are no targets or trailing; the exit or reversal happens only at the monthly evaluation when the sign flips. Rolls follow the calendar in [07 Automation architecture](07%20Automation%20architecture.md), and the position carries across rolls at the same R.

**Filters.** None by design: TSMOM's evidence comes from mechanical, unfiltered application. If an evaluation falls on a holiday week, use the last available W1 close. The family daily loss caps do not apply to this sleeve; it has its own cap of 1R per instrument.

**Automation spec.**

```
States: FLAT | LONG | SHORT (persistent sleeve); per-change: IDLE → ORDER_PENDING → IN_POSITION; STOPPED_UNTIL_NEXT_EVAL
on_close(W1) if last_W1_of_month():
    for sym in [ES, NQ, CL]:
        tgt = sign(close_adj(sym, W1, 0) - close_adj(sym, W1, 52))
        if pos(sym).state == STOPPED_UNTIL_NEXT_EVAL: pos(sym).state = FLAT
        if tgt != pos(sym).side: schedule(sym, tgt, at="next RTH 09:35 ET"); LOG(...)
at scheduled time:
    stop_dist = 2.5*ATR(W1); qty = RISK.qty(entry, entry ∓ stop_dist)   # skip if < 1 micro
    flatten_if_opposite(); ENTER(E1, tgt, last ± SLIP(M5), expiry=120s, bracket=(entry ∓ stop_dist, None, None))
on stop fill: pos.state = STOPPED_UNTIL_NEXT_EVAL
```

| Parameter | Default | Reason |
|---|---|---|
| `lookback` | 52 W1 bars (12 months) | AQR dataset: 12-month look-back; robust across look-backs |
| `rebalance` | Monthly (last W1 close of the month) | AQR: 1-month hold |
| `basket` | ES, NQ, CL at equal R | The evidence is diversified (58 instruments); three is the minimum honest version |
| `disaster_stop` | 2.5 × ATR(W1) | Design; also volatility-scales size |
| `execution` | Next RTH session, 09:35 ET | Design: avoids the Globex open and the opening print |
| `series` | Back-adjusted continuous for the signal, front month for trading | 07 roll handling |

**Visual review checklist.**
1. On the W1 chart, the close 52 bars back is marked, and the sign of the difference matches the position.
2. Decisions occur only at month-end weekly closes.
3. Fills land on the next RTH session near 09:35 ET.
4. The stop distance equals 2.5 ATR(W1) at entry.
5. After a stop-out, the sleeve stays flat until the next month-end.

Bot error signatures: a look-back on the unadjusted series across a roll; a decision on a mid-month weekly close; a position flipped intramonth by anything other than the disaster stop.

**Failure modes & regime fit.** Single-instrument TSMOM is much noisier than the diversified portfolio that was published. With three correlated instruments (ES and NQ especially), expect multi-month drawdowns and whipsaw around turning points, where the 12-month sign lags. The momentum literature also notes partial reversal beyond 12 months. The disaster stop can turn a temporary drawdown into a realized loss and a month out of the market. Because the sample builds at 12 decisions per instrument per year, forward validation cannot judge PA-12 statistically within any reasonable time. Validate its plumbing and accept, or reject, the published evidence.

**Relations.** PA-12's sign can replace D1 STRUCTURE as the CONTEXT in PA-01 or PA-05, or the WO sign in PA-09, each as a separate `strategy_version` (swap, not stack). Run PA-12 in its own sleeve with an explicit net-exposure cap against the intraday proposals.

## PA-13 1-2-3 trend reversal (Sperandeo) with G1/G2/G3 grading

**At a glance.** Style: swing (intraday variant noted) · Typical hold: 3–10 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: transition at the end of a mature trend · Evidence: C · Automation: High.

**Concept basis.** Sperandeo's trend change in an uptrend has three conditions: (1) the trendline breaks, (2) the market fails to make a new high, or tests the high and fails, and (3) price falls below the prior minor correction low. Two of the three raise the probability of a change; all three define it. The 2B, a test that pokes above the high and fails, is reportedly the single criterion he weights most ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)). Bulkowski's close-based version reports that **74 of 101 (73%)** bullish 1-2-3s rose at least 20%, against **29 of 67 (43%)** bearish ones. Those are small samples of daily stocks with no base-rate comparison, and Bulkowski notes that trendline choice "can dramatically change" results ([ThePatternSite](https://www.thepatternsite.com/123tc.html)). That supports a C grade, not B. The swing research maps the pattern onto confirmed swings and onto the multi-timeframe grades. G1 is an LTF touch of the critical swing (a test only). G2 is an LTF close beyond it, a provisional change that means "stand aside". G3 is an HTF close beyond it, the confirmed change ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)). A double top is the special case where point 3 is within `tol_eq` of point 1; Lo, Mamaysky and Wang anchor double tops on alternating extrema the same way ([LMW 2000](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)). The trendline condition is omitted by design: it is the least objective of the three.

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | D1 STRUCTURE = UP with ≥ 2 consecutive BOS_UP (a mature trend to reverse) | D1, unchanged | Yes |
| LOCATION | P2 = first confirmed D1 swing low after the trend-extreme high P1 | Same | Yes |
| SETUP | Failed test after P2: rally stays ≤ P1 + `tol_eq`, or a 2B above P1 reclaimed on H4 | 2B reclaim on VB-A | Partly |
| TRIGGER | Graded break of P2: G2 = H4 close below (flag only); **G3 = D1 close below (trade)** | G2 on a VB-A close; G3 on D1 | G3 yes |
| MANAGEMENT | D1 `protected_low` and MM targets; H4 trail | H4 or VB-A trail | Targets yes |

What must remain on clock time: D1 bars, P1, P2, the G3 event and the 10-session time stop. **Intraday variant:** context, pattern and G3 on H1, with G2 on M15 or VB-A.

**Context filter.** D1 STRUCTURE.state = UP and `bos_count` ≥ 2 in the current trend (mirror: DOWN for bullish reversals). There must be a trend to reverse.

**Location.** P1 is the latest confirmed D1 swing high that registered as a higher high. P2 is the first confirmed D1 swing low after P1.

**Setup.** After P2's `confirm_time`, track the running high since P2. Call it P3; at any moment it is fully known, so there is no look-ahead. The test has failed when either (a) a later break of P2 happens with P3 ≤ P1 + `tol_eq`(D1), or (b) P3 exceeded P1 by at least `minpen`(H4) and an H4 bar closed back below P1 within 2 H4 bars (a 2B). A D1 close above P1 + `tol_eq`(D1) resets the pattern: the trend resumed, and the new high becomes P1.

**Trigger.** Graded against P2.
- **G1:** an H4 low below P2. Logged only.
- **G2:** an H4 close below P2. This raises a `BIAS_SUSPENDED` flag that PA-01, PA-03 and PA-05 longs read, but **no trade** by default.
- **G3:** a D1 close below P2. This is the trade trigger.

**Entry order.** After G3, two orders go out as an OCO, both expiring after 3 sessions. (a) E3: a sell limit at P2 − 1 tick, the retest of the broken low from below. (b) E2: a sell stop-limit 1 tick below the G3 D1 bar's low, the continuation.

**Risk & management.** The stop goes at P3 + `buf`(D1), with `min_stop` = 1.0 × ATR(D1). Sizing is 1R for bullish reversals and for CL. For **bearish reversals in ES and NQ, sizing is 0.5R**, because Bulkowski's asymmetry and the long-run upward drift of equity indices argue for a lower prior. That is a design choice from equity data. T1 is D1 `protected_low` (the higher low that launched the last BOS) if it lies at least 1R below entry; otherwise T1 = MM(P3, P2, P2), the failed-test leg projected down. T2 = MM(P1, P2, P2), leg 1 = leg 2 from P1. After T1, move to breakeven and trail above confirmed H4 swing highs plus `buf`. Time stop: 10 sessions. An armed setup resets on a D1 close above P1 + `tol_eq`. It EXPIRES if G3 has not happened within 15 sessions of P2's confirmation.

**Filters.** ETH; no entries 16:45–18:30 ET or in a blackout. Volatility ceiling: skip if ATR(D1) exceeds 2.5× its 100-session median, because crash-regime "reversals" are gap-driven. One trade per P1/P2 pair.

**Automation spec.**

```
States: IDLE → ARMED:P2 → ARMED:TESTED → (G2 flag) → ORDER_PENDING (after G3) → IN_POSITION → MANAGED → CLOSED
on_close(D1):
    s = STRUCTURE(D1)
    if state == IDLE and s.state == UP and s.bos_count >= 2:
        P1 = s.last_sh; P2 = SWING(D1).lows_since(P1.pivot_time).first     # confirmed only
        if P2: state = ARMED:P2
    if state in {ARMED:P2, ARMED:TESTED}:
        if D1.close > P1.price + TOL(D1): reset_with(P1 = new high)
        P3 = high_since(P2.confirm_time)
        if D1.close < P2.price and (P3 <= P1.price + TOL(D1) or tested_2b):   # G3
            ENTER_OCO([E3 SELL LIMIT P2.price - tick, E2 SELL STOP D1.low - tick], expiry=3 sessions,
                      size=0.5R if sym in {ES, NQ} else 1R,
                      bracket=(max(P3 + BUF(D1), entry + 1.0*ATR(D1)),
                               T1=s.protected_low if far_enough else MM(P3, P2.price, P2.price),
                               T2=MM(P1.price, P2.price, P2.price)))
on_close(H4):
    if P3 > P1.price + MINPEN(H4) and H4.close < P1.price and bars_since_poke(H4) <= 2: tested_2b = True
    g = GRADE(P2.price, DOWN, lo=H4, hi=D1); if g == G2: publish("BIAS_SUSPENDED", sym, P2)
```

| Parameter | Default | Reason |
|---|---|---|
| `maturity` | ≥ 2 consecutive D1 BOS_UP | Design: a reversal needs a trend to reverse |
| `P2_rule` | First confirmed D1 swing low after P1 | Swing research: point 2 = "minor correction low" |
| `test_tol` | `tol_eq`(D1) | Shared convention; also makes double tops a special case |
| `2b_window` | 2 H4 bars | `k_2b` convention, scaled |
| `entry_grade` | G3 trades; G2 flags only | Swing research: grade 3 for bias, grade 2 as "stand aside" |
| `entry_expiry` | 3 sessions | Design |
| `bear_size` | 0.5R for ES/NQ bearish reversals | Bulkowski asymmetry; index drift (design) |
| `time_stop` | 10 sessions | Design |
| `setup_expiry` | 15 sessions after P2 confirms | Design |
| `vol_ceiling` | ATR(D1) ≤ 2.5 × 100-session median | Design |
| Inherited | `k_swing`, `tol_eq`, `minpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. The D1 trend shows at least two consecutive BOS_UP closes.
2. P1 is a confirmed higher high, and P2 is the first confirmed swing low after it; both confirmation markers precede the trade.
3. The rally after P2 stays within tolerance of P1, or pokes above and an H4 close back below follows within two bars.
4. The G2 flag appears at the first H4 close below P2, and the trade arms only after the first D1 close below P2.
5. Both OCO orders appear, and the stop sits above P3 plus the buffer.

Bot error signatures: P2 taken from an unconfirmed pivot; P3 drawn as a confirmed swing that confirmed after the trigger; a trade at G2; G3 read from the still-open D1 bar; the 0.5R rule ignored on ES/NQ bearish trades.

**Failure modes & regime fit.** In strong trends, most "failed tests" are pauses. The P2 break then becomes a higher-timeframe pullback low, and PA-01's next long wins while PA-13 loses. Waiting for G3 gives up up to one D1 bar of move and sometimes the whole retest. Equity-index bearish reversals carry a lower prior. The pattern takes weeks to form, so samples are sparse; pool instruments and include the intraday variant.

**Relations.** PA-13 is the counter-thesis to PA-01, PA-03 and PA-05 acceptance longs, and its G2 flag is their interlock. It complements PA-02 (a fast single-level failure) by covering slow, multi-swing transitions. Once G3 fires, PA-01 shorts in the new direction (mirror logic) can take over later pullbacks.

## PA-14 Equal-highs/lows liquidity trap (EQH/EQL failed breakout)

**At a glance.** Style: scalp · Typical hold: 2–20 minutes · Instruments: ES/MES, NQ/MNQ in RTH; CL/MCL in its RTH · Regime: intraday balance and range · Evidence: C · Automation: Med.

**Concept basis.** Equal highs and lows are flagged in SMC vendor tools as potential liquidity and reversal points. The vendor page gives a "bars confirmation" parameter but no tolerance method ([LuxAlgo SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)). The mechanism claim is that stops pile up just beyond an obvious double top. That extends Osler's documented clustering of stop-loss orders just beyond salient prices to a price-action pattern Osler did not test ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)), so it stays an untested extrapolation. The double-top geometry follows Lo, Mamaysky and Wang. They require two tops within a tolerance and a minimum separation, with a trough between. Their 1.5%-of-price tolerance and 22-day separation suit daily stocks, so this proposal replaces them with `tol_eq` = 0.15 × ATR(L) and a bar-count separation ([LMW 2000](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf); [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)). One vendor's unverified tests suggest swept levels more often *continue* ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)). Grade C, with the context filter blocking trend-direction fades. This is the user's most volume-bar-native proposal: all three layers can be volume bars. See [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md).

**Chart stack.**

| Role | Time-bar version | Volume-bar version (primary) | Clock-only? |
|---|---|---|---|
| CONTEXT | M15 STRUCTURE ≠ UP (for EQH fades) | VB-A STRUCTURE ≠ UP | No |
| LOCATION | EQH pool on M5: ≥ 2 confirmed swing highs within `tol_eq`(M5) | EQH pool on VB-B | No |
| SETUP | Sweep of the pool by ≥ `minpen`(M1) and ≤ `maxpen` | Sweep on VB-C | No |
| TRIGGER | M1 close below the low of the bar that made the sweep high, within 6 bars | VB-C | No |
| MANAGEMENT | Neckline (swing low between the highs), range low | Same | No |

What must remain on clock time: the RTH window, the blackout and pre-release flatten, and the 20-minute wall-clock time stop. VB-A, VB-B and VB-C are 5× and 4× apart, and M15, M5 and M1 are 3× and 5×.

**Context filter.** The context layer's STRUCTURE.state ∈ {RANGE, TRANSITION, DOWN} for fades of equal highs; {RANGE, TRANSITION, UP} for fades of equal lows.

**Location.** An EQH pool on the setup layer. It needs two or more confirmed swing highs with |SH_a − SH_b| ≤ `tol_eq`, at least 6 setup bars apart, with a confirmed swing low between them (the neckline N). Both highs must be untaken. The pool must have formed in the current RTH session or the prior one. Pool level E = the highest of the equal highs. Skip pools within `tol_eq` of a clock-time LEVEL; PA-04 and PA-15 own those.

**Setup.** A trigger-layer bar trades at or above E + `minpen`(trigger), penetrating no more than `maxpen` = 1.0 × ATR(setup).

**Trigger.** Within 6 trigger bars of the first penetration, a trigger-layer bar closes below the low of the bar that printed the sweep's high. The penetration must not run beyond `maxpen` before that close.

**Entry order.** E1: a marketable sell limit at the trigger close − `slip`, valid for one trigger bar.

**Risk & management.** The stop goes at the sweep's highest high plus `buf`(trigger), with `min_stop` = 1.0 × ATR(trigger). Size is 1R. T1 is the neckline N, subject to `rr_floor`; if N is under 1R away, skip the trade. T2 is the setup-layer range low, or the nearest confirmed EQL below. Breakeven after T1. Time stop: 15 trigger bars or 20 minutes wall-clock, whichever comes first (Osler's cascade dynamics are fast). An armed pool is INVALIDATED by a setup-layer close above E + `tol_eq` held for 2 setup bars (acceptance). It is also INVALIDATED if the penetration exceeds `maxpen`. It EXPIRES after 6 trigger bars without a trigger.

**Filters.** RTH 09:45–15:30 ET for ES/NQ; 09:15–14:00 ET for CL. Flatten at T−2 minutes before tier-1 releases. Clock guard: ignore VB-C trigger bars that lasted more than 10 minutes (tighter than the family's 30, because this is a scalp). One attempt per pool and at most 4 trades per day.

**Automation spec.**

```
States: IDLE → ARMED (pool registered) → ARMED:SWEPT → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
on_close(VB-B):                                              # setup layer: pool detection
    hs = SWING(VB-B).highs_since(session_start(prev=1))
    for a, b in consecutive_untaken_pairs(hs):
        if abs(a.price - b.price) <= TOL(VB-B) and bars_between(a, b) >= 6 and SWING(VB-B).low_between(a, b):
            if not near_level(max(a.price, b.price), TOL(VB-B)): registry.add_pool(E=max(a,b), N=low_between(a,b))
    for p in pools: if two_closes_above(p.E + TOL(VB-B)): p.invalidate("accepted")
on_close(VB-C):                                              # trigger layer
    ctx_ok = STRUCTURE(VB-A).state != UP
    for p in registry.pools(state=ARMED) if ctx_ok and in_window("09:45", "15:30"):
        if VB-C.high >= p.E + MINPEN(VB-C):
            if VB-C.high - p.E > 1.0*ATR(VB-B): p.invalidate("too deep"); continue
            p.state = SWEPT; p.t0 = now; p.ext_bar = argmax_high_since(p.t0)
    for p in pools(state=SWEPT):
        if VB-C.close < p.ext_bar.low and duration(VB-C) <= 10min and RISK.ok():
            stop = max(p.ext_bar.high + BUF(VB-C), VB-C.close + 1.0*ATR(VB-C))
            if rr_ok(VB-C.close, stop, p.N):
                ENTER(E1, SHORT, VB-C.close - SLIP(VB-C), expiry=1*VB-C, bracket=(stop, T1=p.N, T2=range_low_or_EQL()))
        elif bars_since(p.t0, VB-C) > 6: p.state = EXPIRED
```

| Parameter | Default | Reason |
|---|---|---|
| `eq_tol` | 0.15 × ATR(setup layer) | Shared convention; replaces LMW's 1.5% of price |
| `eq_sep` | ≥ 6 setup bars apart, confirmed low between | LMW-style separation, scaled to intraday (design) |
| `pool_age` | Current or prior RTH session | Design: intraday stops refresh daily |
| `trigger` | Close below the sweep-high bar's low within 6 trigger bars | Design: a close-based failure of the sweep bar |
| `accept_rule` | 2 setup-bar closes above E + `tol_eq` | Design |
| `time_stop` | 15 trigger bars or 20 minutes | Osler: cascade effects are fast; design values |
| `clock_guard` | VB-C trigger bar ≤ 10 minutes | Design, tighter for scalps |
| `attempts` | 1 per pool; 4 trades per day | Design |
| Inherited | `k_swing` (all layers), `minpen`, `maxpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. Two setup-layer swing highs are within the tolerance label, at least six bars apart, with a confirmed swing low between them, and both confirmed before the sweep.
2. The context layer is not UP.
3. The sweep wick crosses the pool by at least the minimum penetration and less than one setup ATR.
4. A trigger bar closes below the low of the bar that made the sweep high, within six bars.
5. The neckline is at least 1R from entry, and the trade closes within 20 minutes.

Bot error signatures: "equal highs" where one pivot was still unconfirmed at the sweep; a pool that coincides with PDH or ONH still trading here; a trigger from a VB-C bar that took 25 minutes; a fade while the context was UP.

**Failure modes & regime fit.** In trending sessions, equal highs are breakout fuel, not traps; the context filter blocks the worst of these. During the first 15 minutes of RTH and around releases, sweeps are indistinguishable from news. Pools form constantly in quiet markets, so the one-attempt rule and the 1R neckline requirement are what keep trade count manageable. Fill quality matters at scalp scale: track slippage separately.

**Relations.** PA-14 is PA-02's mechanism at scalp scale with a different level rule (equal-high pools instead of single HTF swings). The registry ensures a level is fished by only one of PA-02, PA-04, PA-14 and PA-15. It conflicts with PA-08's opposite-direction scalps on the same instrument.

## PA-15 Overnight-extreme failed test at the RTH open (ONH/ONL)

**At a glance.** Style: intraday, opening window · Typical hold: 15 minutes to 2 hours, flat by 11:30 ET · Instruments: ES/MES, NQ/MNQ · Regime: RTH opens inside the overnight range (a balanced open) · Evidence: B · Automation: Low.

**Concept basis.** The overnight high and low (Globex 18:00 ET to the 09:30 ET RTH open) are among the practitioner core reference levels. In code they must be defined unambiguously against a stated session template ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)). The case for fading the first failed test at the open combines two things: Osler's evidence that watched extremes interrupt trends more often than chance ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)), and the volume-clock observation that ES volume concentrates sharply around the US open ([Easley et al.](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). The overnight extremes are therefore where thin overnight inventory first meets RTH participation. The grade is B by analogy with PDH and PDL, with the honest weakness that overnight extremes form in thin trading and no futures study of them was found. The trigger is Sperandeo's classic: once price closes back inside, a stop just beyond the low of the bar that closed back inside, with the stop above the false-break high ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)).

**Chart stack.**

| Role | Time-bar version | Volume-bar version | Clock-only? |
|---|---|---|---|
| CONTEXT | RTH open strictly inside (ONL, ONH) | Same | Yes |
| LOCATION | ONH / ONL from ticks, 18:00–09:29:59 ET; ON midpoint (ONM) | Same | Yes |
| SETUP | M5 sweep-and-reclaim of the first test, within 3 bars | VB-B | No |
| TRIGGER | E2 stop 1 tick beyond the M5 reclaim bar | E2 beyond the VB-B reclaim bar | No |
| MANAGEMENT | ONM, then the opposite ON extreme; flat 11:30 ET | Same | Yes |

What must remain on clock time: the overnight window, the 09:30–11:00 ET test window and the 11:30 ET flat. VB bars break only at 18:00 ET, so a VB-B bar can straddle 09:30. Use the first VB-B bar that *opens* at or after 09:30:00 as the first eligible setup bar.

**Context filter.** The RTH session opens strictly between ONL and ONH. Opens beyond either extreme belong to PA-06 or PA-04's gap logic.

**Location.** ONH and ONL. The first RTH test of each extreme only.

**Setup.** Between 09:30 and 11:00 ET, an M5 bar trades at or above ONH + `minpen`(M5) on the first RTH test, penetrating no more than `maxpen` = 1.0 × ATR(M15). Within 3 M5 bars, an M5 bar closes back below ONH: the reclaim bar.

**Trigger.** Price trades 1 tick below the reclaim bar's low within the next 3 M5 bars.

**Entry order.** E2: a sell stop-limit 1 tick below the reclaim bar's low, limit = trigger − `slip`, placed at the reclaim bar's close and valid for 3 M5 bars.

**Risk & management.** The stop goes at the highest high since the penetration plus `buf`(M5), with `min_stop` = 1.0 × ATR(M5). Size is 1R. T1 = ONM; skip the trade if ONM is less than 1R away. T2 = ONL. Breakeven after T1. The position is flat by 11:30 ET. The setup is INVALIDATED if no reclaim comes within 3 M5 bars (acceptance above ONH; no trade here). It EXPIRES if the stop entry is not hit within 3 M5 bars.

**Filters.** RTH only. If a tier-1 release falls between 09:30 and 10:00 ET, skip; if one falls at 08:30 ET, the blackout runs to 09:00 ET and the open is tradable. Flatten at T−2 minutes before a 10:00 ET tier-1 release. First test of each extreme only, and one trade per day.

**Automation spec.**

```
States: IDLE → ARMED (09:30, open inside ON) → ARMED:SWEPT → ARMED:RECLAIMED (E2 placed) → IN_POSITION → MANAGED → CLOSED
at 09:30:00 ET: onh, onl = tick_high_low(prev 18:00:00, 09:29:59); onm = (onh + onl)/2
                o = first_trade_at_or_after("09:30:00"); state = ARMED if onl < o < onh
on_close(M5) while in_window("09:30", "11:00"):                     # ONH shown
    if state == ARMED and M5.high >= onh + MINPEN(M5):
        if M5.high - onh > 1.0*ATR(M15): state = INVALIDATED; return
        state = ARMED:SWEPT; t0 = M5.open_time; ext = M5.high
    elif state == ARMED:SWEPT:
        ext = max(ext, M5.high)
        entry = M5.low - tick; stop = max(ext + BUF(M5), entry + 1.0*ATR(M5))
        if M5.close < onh and RISK.ok() and rr_ok(entry, stop, onm):
            ENTER(E2, SHORT, entry, expiry=3*M5, bracket=(stop, T1=onm, T2=onl))
            state = ARMED:RECLAIMED
        elif bars_since(t0, M5) >= 3: state = INVALIDATED("accepted")
at 11:30 ET: flatten
```

| Parameter | Default | Reason |
|---|---|---|
| `on_window` | 18:00 to 09:29:59 ET | Notes' futures level definitions |
| `test_window` | 09:30–11:00 ET | Design: the open's volume burst (Easley et al.) |
| `k_2b` | 3 M5 bars | Family default |
| `maxpen` | 1.0 × ATR(M15) | Design; the opening volatility needs a wider cap than M5 |
| `entry` | E2 stop beyond the reclaim bar, 3-bar expiry | Sperandeo's classic 2B entry |
| `targets` | ONM, then the opposite ON extreme | Design |
| `flat` | 11:30 ET | Design |
| Inherited | `minpen`, `buf`, `min_stop`, `slip`, `rr_floor`, `t1_split` | Family defaults |

**Visual review checklist.**
1. ONH and ONL match tick extremes from 18:00 ET to 09:29:59 ET on the traded contract.
2. The RTH open is inside the range.
3. The first test after 09:30 ET penetrates by at least the minimum and less than one M15 ATR.
4. An M5 close back inside comes within three bars, and the stop entry sits 1 tick below that bar's low.
5. The ON midpoint is at least 1R from the entry, and the position is flat by 11:30 ET.

Bot error signatures: an ON range that includes the first RTH minutes; a second-test entry; the first VB bar straddling 09:30 used as an RTH bar; the stop entry left working past three bars.

**Failure modes & regime fit.** Opens that drive (trend days) run straight through the overnight extremes. The reclaim filter catches most of these as invalidations rather than losses, but fast reversals of the reclaim still stop out. When ONH coincides with PDH, the merged level gets one attempt, owned by whichever proposal arms first; the registry logs which. Narrow overnight ranges put ONM within 1R and are skipped.

**Relations.** PA-15 conflicts with PA-06 (ORB continuation) and PA-10 (open reclaim) in the same window; choose one per instrument. It complements PA-04, whose levels and window differ, under the registry merge. It is PA-02's mechanism applied to session extremes.

## Forward-validate the family signal-only before risking a micro

### Four stages with go/no-go rules declared in advance

Not backtesting does not mean not testing. The protocol in [07 Automation architecture](07%20Automation%20architecture.md) applies to every proposal, with its rules frozen per `strategy_version`. **Stage 0 (plumbing, 1–2 weeks in sim)** forces failures on purpose: kill the process mid-trade, drop the network, send an invalid price, simulate a reject. Then verify that brackets, expiries, reconciliation and the kill switch behave. **Stage 1 (signal-only, at least 4–6 weeks or 30–50 signals per proposal, whichever is later)** runs the engine and draws annotations but sends nothing. Review each signal against an as-of chart, truncated at the decision's `event_seq`, using that proposal's visual checklist. Track the **agreement rate** and the categories of false triggers. **Stage 2 (sim execution, 50–100 trades)** measures fills, slippage and rejects. For E3 limits, keep a conservative column that counts a fill only if price traded through by at least a tick. **Stage 3 (replay rehearsal)** runs FOMC days, NFP mornings, roll weeks, half-days and gap opens through replay to check behavior, not edge. **Stage 4** is one MES/MNQ live.

The arithmetic is unforgiving. With a standard deviation of about 1.0–1.5R per trade, 30 trades give a standard error of 0.18–0.27R. Showing a +0.2R expectancy with about 95% one-sided confidence takes roughly 70–150 trades. Thirty trades can reject a broken rule but cannot confirm a modest edge. A reasonable pre-declared rule from the notes: go live at one micro if, after at least 50 sim trades, expectancy is positive with its lower 80% bound above −0.1R, slippage is within budget and agreement is at least 80%. Abort if expectancy is below −0.3R after 30 trades or if any risk control fails. Two cautions carry over from the evidence section. Visual review is a fitting loop, so record every firing, ugly ones included, and judge each rule on forward instances only ([Bailey et al. 2014](https://scholarworks.wmich.edu/math_pubs/40/)). And swing-scale proposals (PA-05, PA-13, PA-12) fire too rarely on one instrument. Pool ES, NQ and CL under identical rules, and accept that PA-12 can only be plumbing-checked within a sensible timeframe.

For the user's volume-bar question, the cleanest experiment is the one this file is built for. Run the time-bar and volume-bar versions of the same proposal side by side in signal-only mode, with identical parameters, and compare agreement rates and false-trigger categories. Practitioner opinion says price action carries over to constant-volume bars ([Brooks forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). Nothing rigorous says whether it carries over *better*, and this comparison answers that for the user's own charts.

### Start with PA-11, PA-01 and PA-04

**PA-11** comes first because it is the only intraday proposal with peer-reviewed support for the signal itself. It needs no swing engine and makes one decision per day, so 30–50 signals arrive within two to three months of RTH sessions. It also exercises the clock, holiday, blackout and broker-side time-flatten machinery that every other proposal relies on. **PA-01** is the core multi-timeframe swing engine: SWING and STRUCTURE on three layers, confirm-time discipline and G-grades. PA-03, PA-05 and PA-13 reuse that engine, so validating it first makes them cheaper. It is also the natural place to run time and volume versions side by side (D1/H4/H1 against D1/H4/VB-A). **PA-04** exercises the level registry, the merge of coincident levels and the branch-by-regime logic shared by PA-05, PA-14 and PA-15. It uses the most visible levels on any chart, PDH and PDL, and fires often enough across three instruments to build a sample. PA-12 can run alongside in its own sleeve as a background position that needs almost no review effort.

### Pairs that must never run live at the same time

The opening-window trio **PA-06, PA-10 and PA-15** makes contradictory claims about the same minutes: ORB continuation, a failed break of the open, and a failed test of the overnight extreme. Run only one per instrument per validation cycle. **PA-10 and PA-11** make opposite claims about whether the opening move persists. Running them together in signal-only mode is a useful experiment, but never live on one account. **PA-01 and PA-13** on the same instrument and D1 leg are allowed only through the G2 interlock (PA-13's flag suspends PA-01 longs). The same interlock applies to PA-03 and PA-05 acceptance longs. **PA-06 and PA-07** compete on NR7 sessions, so choose one. **PA-08 and PA-14** are opposite-direction scalps; put them on different instruments. **PA-12** runs only in its own sleeve with an explicit net-exposure cap. **PA-02 and PA-03** at one level, the two branches of **PA-04**, and **PA-04, PA-14 and PA-15** at coincident levels are mutually exclusive by construction through the level registry. They may run together, provided the registry merge and one-attempt counters are verified in Stage 1.

The deeper lesson of this family is that the swing machinery does not supply edge on its own. It is a precise, auditable way of asking one question at a level the market already watches: is the stop pool here being absorbed or set off? The published evidence supports asking it but does not answer it. So each proposal's value lies in pre-committing to who answers it (the higher-layer state) and in logging every answer for the user to grade.
