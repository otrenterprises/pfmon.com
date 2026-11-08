# Fibonacci Proposals: Measure Pullbacks, Never Worship Ratios

Thirteen proposals passed the distinctness test: eleven tradeable setups (FIB-01 to FIB-04, FIB-06 to FIB-11, FIB-13) and two reusable modules, a pullback-depth classifier (FIB-05) and a target ladder (FIB-12). Each one uses Fibonacci for one of three jobs only. It is a standard ruler for pullback depth, a locator for multi-anchor clusters, or a ladder of targets. The reason is simple. The most rigorous tests of Fibonacci levels as standalone signals are negative, so a standalone Fib level earns **grade D** ([Tsinaslanidis, Guijarro & Voukelatos, ESWA](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495); [Batchelor & Ramyar](https://openaccess.city.ac.uk/16276/); [Forexop's 40,243 FX corrections](https://forexop.com/?p=7920)). The best-supported design in the family is the least "Fibonacci" one. FIB-08 trades the 0/50/100 grid of the prior RTH day, which is the set of levels Shanaev & Gibson's working paper singles out ([SSRN 4212430](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212430)), and every participant computes that grid the same way. It earns **grade B (indirect)**. Every swing-anchored design is **grade C**. Two engineering facts shape all the designs. First, a grid can only be traded once its end anchor is confirmed. With the shared 2×ATR reversal detector, a same-degree swing high is only known after price has already retraced k·ATR/leg of the leg, which is 50% on a 4-ATR leg. Entries shallower than that therefore need the end anchor confirmed one degree lower. Second, a cluster rule fed by 13–17 candidate levels almost always finds a "cluster" somewhere. Clusters decide *where* to act, not *whether* a level is special. Fib levels and the swings they are drawn from are the same information, so no proposal counts them as two confirmations. Bias comes from swing structure on a higher layer, and timing from a structure break on a lower layer. Start forward validation with FIB-08, FIB-02 and FIB-06. Run the FIB-05 and FIB-12 modules inside them, plus a pre-declared "placebo ratio" twin in signal-only mode, to learn whether the ratios add anything at all.

Every numeric rule or default below that does not carry a citation is a **design proposal**. It is a starting value pre-committed for forward testing, not a sourced fact and not an optimized value. Definitions of the levels are in [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md). Swing and structure engines are in [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md). Execution, risk and logging plumbing is in [07 Automation architecture](07%20Automation%20architecture.md).

## Why a family with grade-D ratios is still worth forward-testing

This family covers proposals in which Fibonacci supplies the core **location** and/or **target** logic. They all take their anchors and context from SWING/STRUCTURE ([01](01%20Swing%20points%20across%20timeframes.md)). Where a trigger is needed it is a minimal lower-layer price-action event ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)). None uses volume profile; that dimension belongs to [09 Proposals volume profile](09%20Proposals%20volume%20profile.md) and [11 Proposals confluence](11%20Proposals%20confluence.md).

The evidence against φ-ratios as magic numbers is the strongest in the whole research set. Tsinaslanidis et al. built an algorithm that identifies Fibonacci zones objectively in three equity markets and found **no support for Fibonacci retracements as a standalone rule**. They also found that wider zones catch more bounces, which is what geometry alone predicts ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495)). Batchelor & Ramyar tested the lengths and durations of successive Dow trends with a bootstrap. They found "a few significant ratios… but no more than would be expected by chance" ([City Research Online](https://openaccess.city.ac.uk/16276/)). Forexop's blog-quality test of 40,243 FX corrections found depths distributed log-normally with **no peaks at Fib levels**. About 83% of corrections ended between 15% and 61.8% ([Forexop](https://forexop.com/?p=7920)). The one notable positive study, Shanaev & Gibson, is an unpublished SSRN working paper. It reports predictive power and Fama-French alpha, but its abstract names **0%, 50% and 100%** among the most important levels. Those are the swing extremes and the midpoint, not φ-ratios ([SSRN 4212430](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212430)).

Four reasons still justify forward-testing these designs, each with the cost of being wrong kept small.

1. **A ruler is useful even without magic.** The grid standardizes how deep a pullback is. A stop beyond 0.786 or beyond the leg origin sits beyond most normal corrections in Forexop's distribution, and that rationale does not depend on φ.
2. **Widely watched anchors can be self-fulfilling.** Osler found that published support/resistance levels, which dealers partly derive from the "50 percent rule" and 38.2/61.8 retracements, interrupted intraday FX trends **60.8% of the time vs 56.2% for arbitrary levels** ([Osler 2000, FRBNY](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Stop-loss orders cluster just beyond salient prices and accelerate moves for hours ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The argument favours obvious weekly, daily and time-anchored grids over idiosyncratic intraday anchors. It also argues for zones and stop buffers rather than exact lines.
3. **The context the trades ride has better evidence than the ratios.** Time-series momentum persists over 1–12 months across 58 futures markets ([Moskowitz, Ooi & Pedersen](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). Any edge more likely comes from trading pullbacks *with* a higher-layer trend and from asymmetric stop/target placement than from 0.618 itself.
4. **Forward testing with frozen rules is real out-of-sample evidence.** It is not optimization, provided every rule change starts a new sample ([07](07%20Automation%20architecture.md)).

None of these is a holy grail. Osler's edge is a few percentage points over a high base rate. In the forward test, a level that "held" means nothing without a baseline.

**A note on cluster arithmetic (illustrative).** A typical cluster proposal here pools about 13–17 candidate levels. Say about 15 of them fall within a band 2×ATR deep below price. That is roughly 1.5 levels per 0.2-ATR window. If the levels were spread at random, about one window in five would hold three or more of them, so the band would contain about two "clusters" on average. In practice, the cluster rule is a standard, auditable way of choosing *which* depth gets the order, not proof that the depth is special. This matches Forexop's observation that almost any pullback ends "near a Fib level."

**Independence accounting (applies to every proposal).** A Fib level, the swing that anchors it, and other Fib levels drawn from overlapping pivots are all *geometry*. They count as one vote ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)). Clusters from *different* anchor pairs are only partly independent, because every anchor comes from one price path. Time-anchored LEVELS (PDH/PWH and so on) are somewhat more independent, since no swing detector chooses them. Volume-at-price is the genuinely independent dimension, and it is deliberately excluded here. Combining it with Fib is the job of the CX family.

**Evidence grades in this file.** The shared scale is A to D. Each proposal is graded on its *load-bearing Fibonacci role*, and its context components are listed separately in "At a glance." On that basis, φ-ratio clusters and single retracements are C: practitioner consensus is consistent, but direct tests are negative. The time-anchored 0/50/100 grid is B (indirect). Stop placement beyond 0.786 or the origin is B. A Fib level used standalone, without trend context or a structure trigger, is D, and no proposal does that.

**Deliberately excluded.** *Fibonacci time zones and time ratios* are excluded because the only rigorous test found no more significant duration ratios than chance ([Batchelor & Ramyar](https://openaccess.city.ac.uk/16276/)). Time projections also need two anchors per duration, which multiplies the anchoring problem. Babypips' "about 70%" claim is single-source and unverified ([Babypips](https://www.babypips.com/forexpedia/fibonacci-time-zones)). Boroden-style time windows may appear on review charts with zero weight. *Full harmonic patterns* are used only as cluster generators inside FIB-03, because their positive evidence is vendor backtests ([LiberatedStockTrader](https://www.liberatedstocktrader.com/gartley-pattern/)). *The 0.65 "golden pocket" bound and ICT's 0.705* have no stated rationale and are not used ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/); [Equiti](https://www.equiti.com/jo-en/news/trading-ideas/ote-vs-fibonacci-ict-trading/)). *DiNapoli's displaced moving averages* could not be verified from reachable sources and are left out.

## Anchoring rules every proposal shares

These twelve rules sit underneath every FIB-xx proposal. They are design proposals derived from the swing and automation notes, and they implement the shared FIB(A→B) definition from [04](04%20Fibonacci%20retracements%20and%20extensions.md).

**R1 — Confirmed swings only.** Anchors come from SWING(L) records whose `confirm_time` ≤ now. A swing is drawn at its pivot bar on review charts, but it drives decisions only from its confirmation bar ([Pine repainting docs](https://www.tradingview.com/pine-script-docs/concepts/repainting/); [NinjaTrader ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)). The provisional extreme of a still-running leg is the "repaint". It is displayed as a PROVISIONAL grid and never traded.

**R2 — Two-degree end-confirmation (the confirmation-depth rule).** With the shared detector, the end anchor B of leg A→B on layer L is confirmed only when price has moved k×ATR(L) back from B, with k = 2.0. The pullback depth at which B becomes known is therefore **k·ATR(L) / |B−A|**: 0.67 on a 3-ATR leg, 0.50 on a 4-ATR leg, 0.33 on a 6-ATR leg. At the same degree, a 0.382 entry is impossible on most legs. The shared rule therefore keeps the *leg* at the anchor degree. A must be a confirmed SWING(L) point and |B−A| ≥ 3×ATR(L). The grid becomes executable ("end-confirmed", status ACTIVE) as soon as B, the extreme since A, is confirmed by SWING at the **next lower layer** in the proposal's stack, or by the k rung when the anchor degree is emulated with the 2k rung on one series. B's price is identical either way, so the grid's levels never change when L-degree confirmation arrives later. If a pullback reaches an entry depth before the grid is ACTIVE, the setup is logged as "missed: unconfirmed" and not taken.

**R3 — Wick-based anchors.** A and B are the high/low extremes of the pivot bars, not closes. On volume bars, use the true traded extreme from ticks rather than a synthetic bar boundary ([swing notes via 01](01%20Swing%20points%20across%20timeframes.md)).

**R4 — Minimum anchor leg.** Impulse legs used as grid anchors must satisfy |B−A| ≥ 3×ATR(L), following the minimum-size filter in the auto-Fib reference algorithm ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)).

**R5 — Grid versioning.** `grid_id = (layer, A.pivot_id, B.pivot_id[, C.pivot_id])`. A grid's levels are immutable, and only its status changes: PROVISIONAL (display only) → ACTIVE → SUSPENDED → INVALIDATED / SUPERSEDED / RETIRED. When a grid leaves ACTIVE, every order armed on it is cancelled, with a reason code. A changed anchor always creates a new grid; an existing grid is never mutated ([07](07%20Automation%20architecture.md)).

**R6 — Invalidation on a close beyond A.** A trigger-layer (lower-layer) close beyond A is a G2 event: the grid becomes SUSPENDED and no new orders are placed on it. An anchor-layer close beyond A is G3: the grid becomes INVALIDATED, which is terminal. This follows the Elliott wave-2 rule and the LuxAlgo "swing origin" invalidation ([Elliott rule](https://il.tradingview.com/chart/CRUDEOIL1%21/u6QWFgV0-Elliot-Wave-Explanation-I-live-Example-Crudeoil); [LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)). Tests of a zone are registered on wicks; breaks and invalidations only on closes.

**R7 — Re-anchoring.** If price trades beyond B before a fill, the grid becomes SUPERSEDED and its orders are cancelled. The new leg must earn ACTIVE again under R2. There is no manual re-anchoring and no "anchor shopping": after an INVALIDATED grid, the next grid comes only from the detector's next confirmed swing pair.

**R8 — Time-anchored grids.** FIB-08 and FIB-09 anchor on a prior RTH day or a prior week. Those ranges are final at the period close, so R1 and R2 are satisfied by construction. A and B are assigned by trade direction (longs: A = low, B = high).

**R9 — Zones, not lines.** A single-level zone is the level ±0.1×ATR(L_loc). A FIB-CLUSTER is the shared definition: ≥3 levels from ≥2 distinct anchor pairs within 0.2×ATR(L_loc). Clusters are found by complete linkage, meaning any window whose max−min ≤ w, so a zone's width can never exceed w. Ties go to the most members, then a higher-degree member, then the zone nearest price. The anchor prices themselves (0% and 100%) are never counted as cluster members.

**R10 — Grid lock and attempts.** Each zone gets one attempt. A grid can carry **one trade across the whole FIB family**, so a failed level cannot be re-entered under another proposal's name.

**R11 — Ratio set.** Retracements {0.382, 0.5, 0.618, 0.786}, extensions A + {1.272, 1.618}×(B−A) beyond B, and projections C ± {0.618, 1.0, 1.618}×|B−A| from a later confirmed swing C. Practitioners measure "the 1.272" from different legs: Boroden from the prior corrective swing, most auto-tools from the impulse ([Boroden interview](https://tradingmarkets.com/?p=661586)). This file pre-commits to the shared FIB(A→B) definition, and the forward test should not switch conventions mid-sample.

**R12 — Sessions and rolls.** Swing structure on intraday time layers is computed on ETH (Globex) bars, so overnight swings count and there is one consistent engine. RTH is used only for time-based LEVELS and for entry windows. W1/D1 bars follow the Globex trade date. Grids that span a contract roll use back-adjusted prices and are translated into the new contract by the logged roll spread ([07](07%20Automation%20architecture.md)).

## Shared risk, execution and logging rules

All proposals inherit the risk architecture in [07](07%20Automation%20architecture.md). The family-level defaults below are design proposals that sit inside broker and prop-firm limits.

**Sizing and reward.** 1R is a fixed dollar amount chosen before Stage 1 (design suggestion: ≤0.5% of equity while validating). Quantity = floor(1R / (stop ticks × tick value)). If that comes out below one micro, the trade is skipped rather than the risk widened. Reference tick values are MES $1.25, ES $12.50, MNQ $0.50 and NQ $5.00 ([07](07%20Automation%20architecture.md); verify on CME specs). Micros are the default for anything with a structure stop on H4/D1 layers. A trade is taken only if its first target is ≥1.0R away (S12).

**Caps.** 2R daily loss per proposal and 3R across the family. Three trades per day per proposal unless stated otherwise. Three consecutive losses stop that proposal for the day. One open position per instrument across the family. Each proposal is disabled after five consecutive fills without a human review of its decision records, which is FIA's repeated-execution control ([FIA 2024](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf)).

**Session windows (clock time).** ES/NQ intraday entries run 09:45–15:30 ET, and positions are flat by 15:55 ET. CL entries run 09:15–14:00 ET, flat by 14:25 ET. Swing proposals may enter in ETH except 16:45–18:30 ET around the 17:00–18:00 ET maintenance break, and except the first 60 minutes after the Sunday open ([CME ES hours](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html)).

**News blackout (clock time).** No new entries from T−10 to T+30 minutes around FOMC statements, CPI, NFP and, for CL, the weekly EIA inventory report. Intraday positions are flattened at T−2 minutes. Swing positions keep their server-side brackets. Calendars come from machine-readable sources ([Federal Reserve FOMC calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm); [BLS release schedule](https://www.bls.gov/schedule/news_release/empsit.htm)).

**Volatility band.** A proposal trades only while ATR(L_loc) / median(ATR(L_loc), 20 sessions) ∈ [0.5, 2.0] (S15).

**Bar-close evaluation and order hygiene.** Every state transition happens on a closed bar of the named layer. The only intrabar actions are resting broker orders. Every entry is a server-side bracket (Rithmic `RequestBracketOrder`, Tradovate `placeOSO`/multibracket), marked automated, and carries an expiry (`cancelAfterSecs`/GTD). Resting orders are modified only at bar close and only if the level moved ≥2 ticks. This keeps message rates low and clear of the Rule 575 "reckless messaging" risk ([07](07%20Automation%20architecture.md)). CME stops are stop-with-protection, so gaps can slip past them ([CME order types](https://cmegroupclientsite.atlassian.net/wiki/display/EPICSANDBOX/Order+Types+for+Futures+and+Options)).

**Decision logging.** Each transition writes the 07 decision record. For Fib proposals that record also holds every `grid_id` used, the A/B/C pivot IDs with their pivot and confirm times, the members of each cluster, every ATR(L) value, and the FIB-05 depth state. The review chart renders "as of" the event sequence number, next to the hindsight chart.

## Shared parameter defaults

Every proposal inherits these defaults unless its own table overrides one. All are pre-committed starting values.

| ID | Parameter | Default | Reason |
|---|---|---|---|
| S1 | Swing detector | Directional change / ATR-ZigZag, k = 2.0 × ATR(L), ATR frozen at the extreme; alternative Pivot(L,R) 3/3 | Shared convention. Scales across ES/NQ/CL and across layers. DC is event-based, so it works the same on volume bars ([Glattfelder et al.](https://arxiv.org/pdf/0809.1040); [Tsang DC notation](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf)) |
| S2 | ATR | ATR(14) on the layer's own bars; session-aware for RTH-defined layers | Shared convention |
| S3 | Degree ladder | Anchor at layer L (or 2k rung); end-confirm at next lower layer (or k rung) | R2 confirmation-depth arithmetic (design) |
| S4 | Minimum anchor leg | 3.0 × ATR(L) | Auto-Fib reference algorithm in the Fib notes ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)) |
| S5 | Ratio set | R11 | Shared convention. Fewer levels means fewer chance "hits" |
| S6 | Cluster tolerance | w = 0.2 × ATR(L_loc); ≥3 levels, ≥2 anchor pairs, complete linkage | Shared convention. Boroden's "about 2 ES points" band rescaled to volatility ([Boroden](https://tradingmarkets.com/?p=661586)); looser than LuxAlgo's 0.5×ATR DiNapoli default ([LuxAlgo DiNapoli](https://www.luxalgo.com/library/indicator/dinapoli-levels/)) |
| S7 | Single-level zone | Level ± 0.1 × ATR(L_loc) | Same total width as S6 (design) |
| S8 | Active grids per layer | Last 2 confirmed impulse legs in trade direction, plus 1 leg per higher anchor layer | "Last two or three significant legs… plus the dominant leg one timeframe up" ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)) |
| S9 | Stop buffer | max(2 ticks, 0.1 × ATR(L_stop)) | Swing notes range of 1–2 ticks / 0.1–0.25×ATR. Stops cluster just beyond levels ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)) |
| S10 | Limit offset | 1 tick in front of the zone edge | 07 convention (1–2 ticks in front of the level) |
| S11 | Trigger entry | Limit at broken CHoCH level ± 1 tick (retest), expiry 3 trigger-layer bars | Boroden: enter "on the break or on a pullback after it" ([Boroden](https://tradingmarkets.com/?p=661586)); chosen to cap risk and avoid chasing (design) |
| S12 | Minimum reward | T1 ≥ 1.0R | Design |
| S13 | Attempts | 1 per zone; 1 trade per grid family-wide (R10) | DiNapoli's "first pullback"; zones expire after first test ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)); bounce odds decay with time ([Chung & Bellotti](https://arxiv.org/abs/2101.07410v1)) |
| S14 | Equal highs/lows | 0.15 × ATR(L) | Shared convention |
| S15 | Volatility band | ATR(L_loc)/20-session median ∈ [0.5, 2.0] | Design |
| S16 | Bias grade | G3 for bias; G2 = stand aside | Shared convention |
| S17 | Targets and management | FIB-12 ladder, 50/50 split, breakeven after T1 | Design (FIB-12) |

**Volume-bar versions.** VB-A, VB-B and VB-C are constant-volume bars of ADV/50, ADV/250 and ADV/1000. They are built on the full-size contract, recalibrated weekly, break at session start and split large prints ([05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md); [Sierra Chart settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). As a rough guide (an inference, to be checked by counting bars per session), VB-A behaves like an M15–M30 chart in average RTH conditions, VB-B like M3–M5, and VB-C like M1 or faster. The volume notes put 150–300 bars/day at roughly 3–5-minute RTH equivalents. No VB tier is as coarse as H1, so **H1, H4, D1 and W1 stay on clock time** in every VB version. So do LEVELS, session windows, blackouts, flat-by times and the clock guards on setup expiry. The Fib arithmetic is unchanged on volume bars: a level is a price. What changes is that ATR(VB-x) measures range per 14×V contracts, so tolerances and buffers stop swelling and shrinking with the clock-time seasonality of the open, lunch and overnight. Partial bars at session breaks are excluded from swing counting.

## Overview of the proposals

| ID | Name | Style | Anchor layer(s) | Stack: context / location / trigger (time; VB) | Regime | Grade | Complexity |
|---|---|---|---|---|---|---|---|
| FIB-01 | Boroden Type 1 with-trend cluster limit | Scalp / intraday | M5 + M15 | H1 / M5+M15 cluster / none (H1 / VB-B+VB-A / none) | Orderly intraday trend | C | Med |
| FIB-02 | Boroden Type 2 HTF-cluster fade with LTF trigger | Intraday | H1 + H4 + D1 | H4 / H1+H4+D1 cluster / M5 (H4 / VB-A+H4+D1 / VB-B) | HTF up or range; LTF falling into HTF support | C | Med–High |
| FIB-03 | Two-step correction completion (AB=CD into impulse retracement) | Intraday (swing instance) | M15 pattern | H1 / M15 pattern cluster / M5 (H1 / VB-A / VB-B) | Trend with two-legged corrections | C | High |
| FIB-04 | DiNapoli F38 single penetration, abandon past 61.8 | Intraday (swing instance) | M15 thrust | H1 / M15 F38 / none (H1 / VB-A / none) | Strong, fresh thrusts | C | Low |
| FIB-05 | Pullback-depth classifier (router and sizer) | Module | Host's location layer | Host's stack | All (classifies) | C routing; B stop placement | Low |
| FIB-06 | Weekly/daily/H4 multi-anchor cluster swing | Swing | W1 + D1 + H4 | W1 / D1 cluster / H1 (W1 / D1 cluster / VB-A) | Weekly uptrend, daily pullback | C | High |
| FIB-07 | Structure-shift first retrace ("OTE" without jargon) | Intraday | M15 CHoCH leg | H1 / M15 0.618–0.786 / M5 (H1 / VB-A / VB-B) | Early trend after a structure shift | C | Med |
| FIB-08 | Prior-day equilibrium hold (0/50/100) | Intraday (weekly instance) | Prior RTH day | D1 / prior-day 50% / M5 (D1 / prior-day 50% / VB-B) | Daily uptrend, pullback day | B (indirect) | Low |
| FIB-09 | Prior-week range overshoot reversion | Swing (1–5 sessions) | Prior week | D1 / 1.0–1.272 band of prior week / H1 (D1 / same / VB-A) | Daily range | C | Med |
| FIB-10 | Extension-exhaustion fade at an HTF extension cluster | Intraday-to-swing | H4 + D1 | D1 / H4 extension cluster / H1 (D1 / H4 cluster / VB-A) | H4 leg into daily resistance, daily not up | C | High |
| FIB-11 | Projection breakout (OP/XOP targets) | Intraday (swing instance) | M15 | H1 / M15 A-B-C / stop entry at B (H1 / VB-A / stop entry) | Strong trend, shallow pullback | C | Med |
| FIB-12 | Target ladder and management overlay | Module | Host's anchor leg | Host's stack | All | C ratios; B placement rule | Low |
| FIB-13 | Volume-clock pullback scalp | Scalp | VB-B | VB-A / VB-B coarse band / VB-C (time: M15 / M5 / M1) | Intraday trend with decelerating pullbacks | C | Med |

## FIB-01 Boroden Type 1 with-trend cluster limit

### At a glance
- **Style:** scalp / intraday. **Typical hold:** 10–90 minutes.
- **Instruments:** ES/MES, NQ/MNQ (RTH entries); CL/MCL (09:15–14:00 ET).
- **Regime:** orderly intraday uptrend (downtrend mirrored) with pullbacks that stay inside the immediate trend.
- **Evidence grade:** C overall. The cluster location rests on practitioner consensus, and a standalone Fib level is D. H1 trend context is B (indirect). A stop beyond the zone is B.
- **Automation complexity:** Med (it needs the cluster engine; there is no trigger logic).

### Concept basis
Carolyn Boroden ranks Type 1 as her highest-probability trade. It goes with the immediate trend, judged on a 2- or 5-minute chart, into a cluster of at least three Fibonacci relationships. It "does not require a trigger." The stop goes "just a few ticks" beyond the extreme of the cluster zone, is moved to breakeven as soon as possible and then trailed, and the first objective is the 1.272 extension ([Boroden interview](https://tradingmarkets.com/?p=661586)). Clusters are the one Fib construct with a defensible automation rationale. Pooling anchors makes the zone less sensitive to any single anchor choice and removes anchor-shopping ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)). Boroden's absolute tolerance of about 2 ES points (3–4 NQ) comes from an era of much lower index prices, so this proposal uses the ATR-relative band S6. The honest caveat is the cluster arithmetic in the introduction: the rule standardizes where the order goes. Any edge has to come from trading with the H1 trend and from the asymmetric stop/target geometry, not from the levels themselves ([Tsinaslanidis et al.](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495)). Grid definitions: [04](04%20Fibonacci%20retracements%20and%20extensions.md). Swing and structure engines: [01](01%20Swing%20points%20across%20timeframes.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H1 STRUCTURE (ETH bars) | H1 STRUCTURE (clock: no VB tier at H1 class) |
| LOCATION | FIB-CLUSTER from the last 2 M5 up-impulse legs + the last M15 up-impulse leg + the M5 symmetry projection | Same, from the last 2 VB-B legs + the last VB-A leg + the VB-B symmetry projection |
| SETUP | M5 STRUCTURE = UP; cluster above the M5 protected low | VB-B STRUCTURE = UP; cluster above the VB-B protected low |
| TRIGGER | None (resting limit) | None |
| MANAGEMENT | M5 (buffer, trail, time stop) | VB-B (buffer, trail), with a clock backstop on the time stop |

On clock time in both versions: H1 (in the VB version), the RTH entry window, news blackout, flat-by time, and the 90-minute time-stop backstop.

### Context filter
STRUCTURE(H1) = UP at G3: the last H1 event is BOS_UP or CHoCH_UP, confirmed by an H1 close. No G2 event against it, meaning no M5 or M15 close below the H1 protected low. Shorts mirror the rule.

### Location
The contributors are the retracements {0.382, 0.5, 0.618, 0.786} of FIB(A→B) for the last two ACTIVE M5 up-impulse legs and the last ACTIVE M15 up-impulse leg, plus one symmetry projection. That projection is the current M5 swing high minus 1.0 × the size of the last completed M5 pullback (Boroden's "symmetry"). That gives 13 candidate levels. A FIB-CLUSTER needs w = 0.2 × ATR(M5), ≥3 members, ≥2 distinct anchor pairs, and ≥1 member from the M15 leg. The zone's midpoint must sit at depth 0.382–0.618 of the latest M5 leg, so it is in the FIB-05 SHALLOW/NORMAL band and not DEEP. The zone's low must sit above STRUCTURE(M5).protected_low. If several clusters qualify, R9 picks one.

### Setup
At an M5 bar close the qualifying zone is the nearest one below price, price is within 1.0 × ATR(M5) of zone_hi, and STRUCTURE(M5) = UP.

### Trigger
None. This is Boroden's Type 1. The resting limit order is the commitment.

### Entry order
A buy limit at zone_hi + 1 tick (S10) inside a server-side bracket. It expires after 12 M5 bars or at the end of the entry window, whichever comes first. It is cancelled at a bar close if the anchoring grid is SUPERSEDED or SUSPENDED. A replacement order goes up only if the new zone differs by ≥2 ticks.

### Risk & management
- **Stop:** zone_lo − max(2 ticks, 0.1 × ATR(M5)), widened if needed to a floor of 0.25 × ATR(M5) from entry, so noise alone cannot stop the trade.
- **Size:** fixed-fractional, per the shared rules.
- **Targets:** FIB-12 continuation mode on the latest M5 leg. T1 is the first rung ≥1.0R among {B, E(1.272)}; T2 is the next rung. Half the position exits at each.
- **After T1:** stop to breakeven + 1 tick, then trailed below each new confirmed SWING(M5) low − buffer.
- **Time stop:** exit at market if T1 has not been reached within 18 M5 bars.
- **Cancel / invalidation while armed:** an M5 close below zone_lo before a fill (zone failed: INVALIDATED); the grid SUPERSEDED or SUSPENDED, H1 context lost, or the window closing (CANCELLED).

### Filters
- Entries 09:45–15:30 ET for ES/NQ; 09:15–14:00 ET for CL.
- News blackout per the shared rules.
- Volatility band S15 applied to ATR(M5).
- One attempt per zone; at most 3 trades per day.

### Automation spec
**States:** IDLE → ZONE_ACTIVE → ORDER_PENDING → IN_POSITION → MANAGED (after T1) → CLOSED. Exits: CANCELLED, EXPIRED, INVALIDATED, REJECTED, ERROR.

```
on bar_close(M5):
  if not RISK.window_ok() or STRUCTURE(H1).state != UP or G2_against(H1): cancel(this, "context"); return
  legs  = SWING(M5).impulse_legs(UP, n=2, min=3*ATR(M5)) + SWING(M15).impulse_legs(UP, n=1, min=3*ATR(M15))
  grids = [FIB(l.A→l.B) for l in legs if FIB(l.A→l.B).status == ACTIVE]        # R2 end-confirmed
  lv    = retracements(grids) + [SWING(M5).last_high - 1.0*SWING(M5).last_pullback_size]
  z     = FIB_CLUSTER(lv, w=0.2*ATR(M5), min_levels=3, min_anchors=2, require_layer=M15)
            .select(below=price, depth_mid_in=[0.382,0.618] of legs[0],
                    lo_above=STRUCTURE(M5).protected_low, rule=R9)
  if state == IDLE and z and STRUCTURE(M5).state == UP and price - z.hi <= 1.0*ATR(M5) and not LOCKED(z.grids):
      entry = z.hi + tick;  stop = min(z.lo - buffer(M5), entry - 0.25*ATR(M5))
      T = FIB12.continuation(legs[0], entry, stop)
      if T.T1_R >= 1.0: ORDER.bracket_limit(entry, stop, T, expiry=12 bars); state = ORDER_PENDING; LOG(z, grids, T)
  if state == ORDER_PENDING:
      if close < z.lo: cancel(this, "zone_failed") -> INVALIDATED
      elif any(g.status != ACTIVE for g in z.grids): cancel(this, "grid_changed") -> CANCELLED
on fill: LOCK(z.grids); state = IN_POSITION
on T1 fill: ORDER.move_stop(entry + tick); state = MANAGED; trail on SWING(M5) lows (bar close, ≥2-tick hysteresis)
on 18 M5 bars without T1: ORDER.exit_market("time")
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor legs | 2 × M5 + 1 × M15 up-impulse | S8 / LuxAlgo leg selection |
| Symmetry ratio | 1.0 × the last completed M5 pullback | Boroden's symmetry is an equality projection |
| Cluster tolerance | 0.2 × ATR(M5) | S6, on the execution layer per the Fib notes' reference algorithm |
| Cross-layer member | ≥1 member from the M15 leg | Stops the zone from being geometry of a single layer (design) |
| Depth window | 0.382–0.618 of the latest M5 leg | FIB-05: untriggered limits are not taken in DEEP (design) |
| Arm distance | ≤1.0 × ATR(M5) above the zone | Avoids parking stale orders far from price (design) |
| Stop floor | 0.25 × ATR(M5) | Noise and sweep protection (Osler) (design) |
| Order expiry | 12 M5 bars | Level effects decay with time ([Chung & Bellotti](https://arxiv.org/abs/2101.07410v1)) (design) |
| Time stop | 18 M5 bars | Stop-cascade effects last hours, not days ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)) (design) |
| Max trades/day | 3 | Within the 07 range of 3–5 |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- H1 labelled UP, with the H1 close that confirmed it marked.
- Every anchor leg drawn with both its pivot marker and its confirm marker. The B used by the cluster carries an M5 (lower-degree) confirm marker earlier than the order timestamp.
- The member levels listed with their `grid_id`s: at least two different anchor pairs, one of them the M15 leg.
- A zone no wider than 0.2 × ATR(M5), sitting above the M5 protected low.
- An order placed at a bar close within 1 ATR of the zone.

A bot error looks like one of these:
- The grid drawn to a high that was still provisional at order time (a repainting end anchor).
- Three ratios of one leg labelled a "cluster".
- A swing-low price counted as a member (double-counting the anchor).
- M1 or H4 swings used as anchors (wrong degree).
- An order left working after a new high superseded the grid.
- A second fill at the same zone after a stop-out (a grid-lock breach).

### Failure modes & regime fit
The design suits steady trend sessions with orderly, two-legged pullbacks. It fails in three ways.
- **Adverse selection on fast pullbacks.** A limit fill on a fast pullback often means the level is being traded through ([07](07%20Automation%20architecture.md)). Track "filled, then ≥X ticks adverse."
- **Stops parked where sweeps go.** A stop a few ticks beyond a cluster sits in the sweep zone Osler's stop-clustering evidence describes. The 0.25-ATR floor softens this without removing it.
- **Stale bias.** An H1 UP label can persist into a range day.

V-shaped trend days produce no trade, because the pullbacks never reach a qualifying depth, and that is acceptable. Expect a lower win rate and larger winners.

### Relations
- **FIB-04:** conflicts. Both are with-trend limit entries on the same thesis, so run one per instrument and layer. FIB-05 sends 0.382-only pullbacks of fresh thrusts to FIB-04, and 0.382–0.618 cluster zones to FIB-01.
- **FIB-13:** the same continuation thesis on volume bars with a trigger. Choose one.
- **FIB-02:** complements FIB-01, taking HTF clusters that are reached *against* the immediate trend.
- **FIB-05 and FIB-12:** used as modules.
- **PA family:** its with-trend pullback triggers enter at the same places. Do not run both.
- **CX family:** a volume node inside the zone would be the independent second dimension, and belongs there.

## FIB-02 Boroden Type 2 HTF-cluster fade with LTF trigger

### At a glance
- **Style:** intraday. **Typical hold:** 15 minutes to 3 hours.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL.
- **Regime:** H4 up or ranging, while the immediate (M5) trend falls into a higher-timeframe support cluster. Shorts mirror.
- **Evidence grade:** C. Cluster location is practitioner consensus, and standalone it is D. The trigger is a timing and risk device: standalone candlestick signals tested negative ([Marshall, Young & Rose](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323)). The stop beyond structure is B.
- **Automation complexity:** Med–High.

### Concept basis
Boroden's Type 2 takes a higher-timeframe cluster (her example is 60-minute) *against* the immediate trend, and requires a lower-timeframe trigger: "Trigger means take action." Her listed triggers are a violation of a prior swing high or low, an MA crossover, a Haggerty 1-2-3, or a double bottom into the cluster confirmed by a break of the middle swing. Entry comes on the break or on a pullback after it. If price clears the zone without a trigger, she stays out ([Boroden interview](https://tradingmarkets.com/?p=661586)). Two parts of that map onto the shared building blocks. The HTF cluster supplies location, and an LTF CHoCH supplies timing, which is the "HTF level plus LTF structure shift" template ([LuxAlgo MTF alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). The honest-evidence reading favours this design over FIB-01. Salient-level effects are small (60.8% vs 56.2%) ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)), which argues for waiting on evidence that the level is actually holding before entering. Anchoring on H1, H4 and D1 also favours more widely watched swings. See [04](04%20Fibonacci%20retracements%20and%20extensions.md) and [01](01%20Swing%20points%20across%20timeframes.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H4 STRUCTURE (ETH) | H4 STRUCTURE (clock) |
| LOCATION | FIB-CLUSTER from the last 2 H1 up-legs + the last H4 up-leg + the last D1 up-leg + the H1 symmetry projection | From the last 2 VB-A legs + the last H4 leg + the last D1 leg (clock) + the VB-A symmetry projection |
| SETUP | M5 STRUCTURE = DOWN while the zone is touched | VB-B STRUCTURE = DOWN |
| TRIGGER | M5 CHoCH_UP | VB-B CHoCH_UP |
| MANAGEMENT | M5 structure; targets from the M5 leg into the zone | VB-B |

On clock time in both versions: H4 and D1 anchors and context, entry windows, blackout, flat-by time, the trigger window's clock backstop (60 minutes), and the time stop.

### Context filter
STRUCTURE(H4) ∈ {UP, RANGE} at G3 for longs, so no long fades a confirmed H4 downtrend. The zone must lie above the H4 structural low: the protected low in UP, the range low in RANGE.

### Location
The contributors are retracements {0.382, 0.5, 0.618, 0.786} of the last two ACTIVE H1 up-legs, the last H4 up-leg and the last D1 up-leg, plus the H1 symmetry projection at 1.0 (17 levels). The cluster needs w = 0.2 × ATR(H1), ≥3 members, ≥2 anchor pairs, and ≥1 member from the H4 or D1 legs, which is what makes it a "higher-timeframe cluster." Selection follows R9.

### Setup
STRUCTURE(M5) = DOWN, and an M5 bar's low trades at or below zone_hi. That bar is the first touch, and it moves the setup to ARMED.

### Trigger
An M5 CHoCH_UP: an M5 close above the last confirmed SWING(M5) high. It must come within 12 M5 bars of the first touch, and before the zone "clears." The zone clears on an M5 close below zone_lo − 0.1 × ATR(H1), which matches Boroden's "no trigger, no trade." A double bottom inside the zone, confirmed by a close above the middle swing, is a special case of the same CHoCH, so there is only one trigger rule.

### Entry order
A buy limit at the broken M5 swing-high price + 1 tick (S11), expiring after 3 M5 bars, inside a bracket. An unfilled order is EXPIRED and logged in a "missed" column. There is no chasing.

### Risk & management
- **Stop:** the lowest low since the first touch − max(2 ticks, 0.1 × ATR(M5)). Skip the trade if that stop is more than 0.6 × ATR(H1) away.
- **Targets:** FIB-12 reversal mode on the M5 leg S→X that ran into the zone, where X is the low. T1 is the first of R(0.382), R(0.5) or R(0.618) of S→X that is ≥1.0R. T2 is S, the leg's origin. Half exits at each.
- **After T1:** stop to breakeven, then trailed under confirmed M5 swing lows.
- **Time stop:** 36 M5 bars, and flat by session end.
- **Cancel:** the zone clears, any grid in the cluster becomes SUSPENDED or SUPERSEDED, the H4 context flips, or the trigger window lapses.

### Filters
- RTH entry windows; news blackout.
- Volatility band applied to ATR(H1).
- One attempt per zone; 3 trades per day.

### Automation spec
**States:** IDLE → ZONE_ACTIVE (a qualifying cluster below price) → ARMED (first touch while M5 is DOWN) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED (zone cleared, context, grid), EXPIRED (trigger window or order), REJECTED, ERROR.

```
on bar_close(H1): Z = FIB_CLUSTER(retr(SWING(H1).legs(UP,2)) + retr(SWING(H4).legs(UP,1)) + retr(SWING(D1).legs(UP,1))
                               + [symmetry(SWING(H1),1.0)], w=0.2*ATR(H1), min_levels=3, min_anchors=2,
                               require_layer∈{H4,D1}).select(below=price, lo_above=STRUCTURE(H4).structural_low)
on bar_close(M5):
  if STRUCTURE(H4).state not in {UP,RANGE} or not RISK.window_ok(): cancel(this); return
  if state == ZONE_ACTIVE and low <= Z.hi and STRUCTURE(M5).state == DOWN: state = ARMED; t0 = now; X = low
  if state == ARMED:
      X = min(X, low)
      if close < Z.lo - 0.1*ATR(H1) or bars_since(t0) > 12 or clock_since(t0) > 60min: -> CANCELLED/EXPIRED
      elif STRUCTURE(M5).event == CHoCH_UP:
          lvl = STRUCTURE(M5).broken_level; stop = X - buffer(M5)
          if (lvl - stop) <= 0.6*ATR(H1):
              T = FIB12.reversal(leg=SWING(M5).leg_into(X), entry=lvl+tick, stop)
              if T.T1_R >= 1.0: ORDER.bracket_limit(lvl+tick, stop, T, expiry=3 bars) -> ORDER_PENDING
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor set | 2 × H1 + H4 + D1 up-legs, plus H1 symmetry | S8; Boroden's 15/60/daily clusters |
| Tolerance | 0.2 × ATR(H1) | S6 on the zone-defining layer |
| HTF member requirement | ≥1 from H4/D1 | Definition of a "higher-timeframe cluster" (design) |
| Trigger | M5 CHoCH_UP | Boroden's "violation of a prior swing high" in shared terms |
| Trigger window | 12 M5 bars / 60 minutes | Reaction should be prompt; clock guard per 05 (design) |
| Zone-cleared rule | M5 close < zone_lo − 0.1 × ATR(H1) | "Clears the zone without a trigger" (design) |
| Max stop | 0.6 × ATR(H1) | Keeps the trade intraday-sized (design) |
| Time stop | 36 M5 bars | Design |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- The H4 state at the time (UP or RANGE).
- The cluster's members with their grid IDs, one of them from H4 or D1, each anchor confirmed before the first touch.
- The M5 down-structure into the zone.
- The CHoCH close marked, with its broken level, within 12 bars.
- A fill at a retest of that level.

A bot error looks like one of these:
- A CHoCH computed on a provisional M5 swing.
- A "cluster" whose H4 member came from a leg still extending at touch time.
- A trigger accepted after the zone had already cleared.
- An entry chased at market after the retest expired.

### Failure modes & regime fit
- **Persistent declines.** In those the M5 CHoCH fires repeatedly as a lower high inside a larger decline. The H4 filter and one-attempt rule limit the damage but do not prevent it.
- **Missed fast reversals.** Retest-limit entries miss the fastest reversals. Log the misses, because a market-entry variant would have to be a new strategy version.
- **Weekly-trend days.** On days dominated by the weekly trend, HTF clusters get run straight through.

The design fits rotational or trending H4 conditions in which the HTF support is obvious.

### Relations
- **FIB-01:** complements it (immediate trend with vs against the trade).
- **FIB-03:** overlaps it. Both are triggered entries at counter-short-term clusters, so do not run both on the same instrument.
- **FIB-06:** the same logic one scale up. The two may run together only across different instruments, or with the family position cap.
- **FIB-12:** reversal mode.
- **PA family:** its "2B / CHoCH at HTF level" templates are the trigger family here. Do not run them at the same zones.

## FIB-03 Two-step correction completion (AB=CD into impulse retracement)

### At a glance
- **Style:** intraday (the swing instance, D1/H4/H1, would be a separate strategy version). **Typical hold:** 30 minutes to 4 hours.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL.
- **Regime:** H1 uptrend whose M15 corrections unfold in two legs. Shorts mirror.
- **Evidence grade:** C. The two-step and harmonic evidence is vendor or practitioner only. AB=CD is a geometric symmetry with no predictive test.
- **Automation complexity:** High (four pattern pivots plus the cluster plus the trigger).

### Concept basis
Boroden's Type 3 is a two-step (ABC, "Gartley-style") pattern into a cluster against the short-term trend. Her "symmetry," a projection of a prior corrective swing, counts as a setup in its own right ([Boroden interview](https://tradingmarkets.com/?p=661586); [Boroden on symmetry](https://tradingmarkets.com/recent/how_i_identify_powerful_setups_using_symmetry-664959)). AB=CD is the 1.0 projection, which is DiNapoli's OP ([LuxAlgo DiNapoli](https://www.luxalgo.com/library/concept/dinapoli-levels.md)). The same structure is Brooks' two-legged pullback (H2) and his Leg 1 = Leg 2 measured move ([TheRightTrader two-legged pullback](https://therighttrader.com/learn/trend-analysis/two-legged-pullback); [LuxAlgo measured move](https://www.luxalgo.com/library/concept/measured-move/)). Harmonic definitions are fully rule-based, but their positive evidence is vendor backtests, for example a 60% Gartley target-hit rate on a Nasdaq-100 test ([LiberatedStockTrader](https://www.liberatedstocktrader.com/gartley-pattern/)). They are also hostage to swing-detector settings, because five confirmed pivots are needed. This proposal therefore uses the two-step only as a **pre-labelled cluster generator**, and requires a trigger because point D is against the short-term trend. A caution on independence: AB=CD (pivots P1, P2, P3) and the impulse retracement (P0, P1) share P1, so the cluster is partly one fact counted twice. See [04](04%20Fibonacci%20retracements%20and%20extensions.md) and [01](01%20Swing%20points%20across%20timeframes.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H1 STRUCTURE = UP | H1 STRUCTURE (clock) |
| LOCATION | M15 pattern cluster (P0–P3 all confirmed SWING(M15)) | VB-A pattern cluster |
| SETUP | M15 C→D leg in progress, price in the zone | VB-A |
| TRIGGER | M5 CHoCH_UP | VB-B CHoCH_UP |
| MANAGEMENT | M15 pattern points as targets | VB-A points |

On clock time in both versions: H1, windows, blackout, flat-by time, and the trigger window's clock backstop (75 minutes).

### Context filter
STRUCTURE(H1) = UP at G3, with no G2 against it.

### Location
**Pattern.** All four pattern points are confirmed SWING(M15) points:
- P0 is a swing low.
- P1 is a swing high, with P0→P1 ≥ 3 × ATR(M15) and an M15 BOS_UP during that leg.
- P2 is a swing low, with |P1−P2| ≥ 3 × ATR(M15) and P2 above P0.
- P3 is a swing high below P1 that retraced 0.382–0.786 of P1→P2.

The minimum first-leg size of 3 ATR also guarantees that P3 confirms, after 2 ATR, before D is reached (R2 arithmetic).

**Cluster contributors.**
- The mandatory AB=CD projection, D = P3 − 1.0 × |P1−P2|.
- Retracements R(0.5), R(0.618) and R(0.786) of FIB(P0→P1).
- Projections of the bounce, P3 − {1.272, 1.618} × |P3−P2| (the harmonic "BC projection").

The zone is a FIB-CLUSTER with w = 0.2 × ATR(M15) and ≥3 members. It must contain AB=CD and at least one impulse retracement, so D lands inside the 0.5–0.786 band of the impulse.

### Setup
Price trades into the zone (M5 low ≤ zone_hi) while the M15 leg from P3 is still in progress, meaning no M15 close above P3.

### Trigger
An M5 CHoCH_UP within 12 M5 bars of the first touch.

### Entry order
A buy limit at the broken M5 level + 1 tick, expiring after 3 M5 bars (S11).

### Risk & management
- **Stop:** the farther of (the lowest low since the touch − buffer(M5)) and (zone_lo − 0.1 × ATR(M15)), which is Boroden's "beyond the cluster extreme."
- **Targets:** T1 = P3 (breaking the correction's lower high resumes the trend), T2 = P1 (the prior extreme). Skip unless T1 is ≥1.0R.
- **After T1:** stop to breakeven; the remainder trails under confirmed M15 swing lows.
- **Time stop:** 48 M5 bars, and flat by session end.
- **Cancel:** an M15 close below zone_lo − 0.1 × ATR(M15); any trade below P0, which means the pattern is dead and the impulse grid INVALIDATED; a new M15 swing high above P3 before the touch, which means the pattern is SUPERSEDED.

### Filters
- RTH windows; blackout.
- Volatility band applied to ATR(M15).
- One attempt per pattern; 2 trades per day (the pattern is infrequent).

### Automation spec
**States:** IDLE → PATTERN_ACTIVE (P0–P3 confirmed, zone computed) → ARMED (touch) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED (pattern superseded or dead), EXPIRED, INVALIDATED, REJECTED, ERROR.

```
on SWING(M15).new_confirmed:
  (P0,P1,P2,P3) = SWING(M15).last_four(L,H,L,H)
  if |P1-P0|>=3*ATR(M15) and BOS_UP_in(P0→P1) and |P1-P2|>=3*ATR(M15) and P2>P0 and P3<P1
     and 0.382 <= (P3-P2)/(P1-P2) <= 0.786:
       lv = [P3-1.0*|P1-P2|] + FIB(P0→P1).R([0.5,0.618,0.786]) + [P3-1.272*|P3-P2|, P3-1.618*|P3-P2|]
       Z  = FIB_CLUSTER(lv, w=0.2*ATR(M15), min_levels=3, must_include=["ABCD", "impulse"])
       if Z: state = PATTERN_ACTIVE
on bar_close(M5):  # same ARMED → trigger → bracket flow as FIB-02, with targets (P3, P1)
```

| Parameter | Default | Reason |
|---|---|---|
| Pattern degree | All points on SWING(M15), k = 2 | One degree avoids mixing internal and external swings (design) |
| Leg minima | P0→P1 and P1→P2 ≥ 3 × ATR(M15) | S4; guarantees P3 confirmation before D |
| Bounce depth (P3) | 0.382–0.786 of P1→P2 | Harmonic C-point range, trimmed to the shared set ([LuxAlgo harmonics](https://www.luxalgo.com/library/concept/harmonic-patterns.md)) |
| Mandatory members | AB=CD + ≥1 impulse retracement | Keeps D inside the impulse's pullback band (design) |
| Tolerance | 0.2 × ATR(M15) | S6 |
| Targets | P3 then P1 | Pattern-native structure targets (design) |
| Time stop | 48 M5 bars | Design |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- Four labelled pivots P0–P3, each with a confirm marker earlier than the touch.
- The AB=CD line and at least one impulse retracement inside a zone ≤0.2 × ATR(M15) wide.
- The H1 trend up; a CHoCH on M5 inside or just above the zone.

A bot error looks like one of these:
- A P3 that was still provisional when the zone was drawn (D "moves").
- P2 taken from a lower degree (an M5 swing) while P1 is M15.
- AB=CD measured from a different C than the one confirmed.
- A cluster counted as "three confirmations" when all its members share P1–P3.

### Failure modes & regime fit
- **Settings sensitivity.** The pattern is rare, and its frequency depends heavily on k. A small change in k changes the pattern count, which is a strong reason to freeze k.
- **Deep CD legs.** If the CD leg extends past 1.618 × the bounce, the correction is turning into a trend change.

It fits trending markets with rhythmic, two-legged corrections. It fails in fast trend reversals and in news-driven gaps through D.

### Relations
- **FIB-02:** overlaps it (choose one per instrument).
- **FIB-01:** the two can collide when the D-zone coincides with a Type 1 cluster. The family grid lock prevents a double entry.
- **FIB-05:** depth context.
- **FIB-12:** the alternative ladder (this proposal pre-commits to pattern targets instead).
- **PA family:** H2 / two-legged pullback proposals conflict (the same events).

## FIB-04 DiNapoli F38 single penetration, abandon past 61.8

### At a glance
- **Style:** intraday (a swing instance, W1/D1/H4, would be a separate strategy version). **Typical hold:** 30 minutes to the session close.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL.
- **Regime:** strong, fresh thrusts in an established H1 trend.
- **Evidence grade:** C. DiNapoli's rules are known only through a third-party codification, with no statistics. The stop beyond F61 is B.
- **Automation complexity:** Low (one grid, one limit, a static bracket).

### Concept basis
In LuxAlgo's codification of Joe DiNapoli, the with-trend setup is the *first* pullback into the 38.2% retracement ("F38") of a fresh thrust, with the stop beyond the 61.8% ("F61") of the same reaction. A 61.8% penetration "warns the setup is reaching the zone where it is usually abandoned." The objective points are COP = C + 0.618 × (B−A), OP = C + 1.0 × (B−A) and XOP = C + 1.618 × (B−A), with C the reaction low ([LuxAlgo DiNapoli concept](https://www.luxalgo.com/library/concept/dinapoli-levels.md); [LuxAlgo DiNapoli indicator](https://www.luxalgo.com/library/indicator/dinapoli-levels/)). CQG ships the same projections as "DNExp" ([CQG](https://help.cqg.com/cqgic/25/Documents/expansiondnexp.htm)). Sources disagree on whether the objectives are anchored at C or at B. This proposal pre-commits to C ([CQG DiNapoli studies](https://help.cqg.com/cqgic/25/Documents/dinapolistudies.htm)).

The practitioner heuristic that "38.2% works best in strong momentum trends" ([LuxAlgo Fib retracement](https://www.luxalgo.com/library/concept/fib-retracement/)) is why the setup requires a large thrust. The R2 arithmetic is why it requires lower-degree end-confirmation. With B confirmed on M5 after roughly 2 × ATR(M5), and taking ATR(M5) ≈ 0.55–0.6 × ATR(M15) under diffusive scaling (illustrative; measure per instrument), a 4 × ATR(M15) thrust usually goes ACTIVE at a depth of about 0.3, before F38 is reached.

The honest base rate is that in Forexop's FX sample only about 17% of corrections went beyond 61.8% ([Forexop](https://forexop.com/?p=7920)). That figure is *unconditional*. Among pullbacks that have already reached 38.2%, the share going beyond 61.8% is necessarily higher. Measuring that conditional share is one of the forward test's jobs, through FIB-05's logs. See [04](04%20Fibonacci%20retracements%20and%20extensions.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H1 STRUCTURE = UP | H1 STRUCTURE (clock) |
| LOCATION | FIB(A→B) of the M15 thrust; F38 zone | FIB(A→B) of the VB-A thrust |
| SETUP | B end-confirmed by SWING(M5) before F38 is reached | B end-confirmed by SWING(VB-B) |
| TRIGGER | None (resting limit) | None |
| MANAGEMENT | M15 (static bracket, trail on M15 swings) | VB-A |

On clock time in both versions: H1, windows, blackout, and the flat-by time.

### Context filter
STRUCTURE(H1) = UP at G3 and no G2 against it.

### Location
F38 = B − 0.382 × (B−A), with the zone F38 ± 0.1 × ATR(M15). The thrust A→B qualifies when:
- A is a confirmed SWING(M15) low;
- |B−A| ≥ 4 × ATR(M15);
- the leg produced an M15 BOS_UP (closed above the prior M15 swing high);
- the current pullback is the first one since that BOS.

### Setup
The grid becomes ACTIVE (B confirmed by SWING(M5)) while the pullback depth so far is still below the F38 zone. If price reaches the zone first, the setup is logged as "missed: unconfirmed."

### Trigger
None. This is a with-trend Type-1-style entry.

### Entry order
A buy limit at F38 + 1 tick inside a bracket. It expires after 16 M15 bars or at the window's end. It is cancelled if price trades above B (SUPERSEDED), on an M15 close below F61 (abandoned), or if the H1 context is lost.

### Risk & management
- **Stop:** F61 − max(2 ticks, 0.1 × ATR(M15)).
- **Targets:** at fill, set C* = the lowest price since B (in practice, the fill area). T1 = COP = C* + 0.618 × (B−A); T2 = OP = C* + 1.0 × (B−A). The bracket is static and documented; it is not re-anchored if C later moves lower. The reward is about 2.4R to COP, so expect a modest hit rate.
- **After T1:** stop to breakeven + 1 tick, then trailed under confirmed M15 swing lows.
- **Time stop:** flat at session end.
- **Cancel:** described above. A second visit to F38 (DiNapoli's "double penetration") is *not* traded (S13).

### Filters
- RTH windows; blackout.
- Volatility band applied to ATR(M15).
- One attempt per thrust; 2 trades per day.

### Automation spec
**States:** IDLE → ZONE_ACTIVE (thrust qualified, grid ACTIVE) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED (superseded or context), INVALIDATED (M15 close below F61 before a fill), EXPIRED, REJECTED, ERROR.

```
on bar_close(M15):
  leg = SWING(M15).last_impulse(UP); g = FIB(leg.A→leg.B)
  if STRUCTURE(H1).state==UP and |leg|>=4*ATR(M15) and leg.made_BOS_UP and g.status==ACTIVE   # B confirmed by SWING(M5)
     and DEPTH(g) < 0.382 - 0.1*ATR(M15)/|leg| and state==IDLE and not LOCKED(g):
        entry = g.R(0.382)+tick; stop = g.R(0.618) - buffer(M15)
        ORDER.bracket_limit(entry, stop, targets=None, expiry=16 bars); state = ORDER_PENDING
  if state==ORDER_PENDING and (close < g.R(0.618) or high > leg.B or STRUCTURE(H1).state!=UP): cancel(reason)
on fill: C* = min_low_since(leg.B); ORDER.set_targets([C*+0.618*|leg|, C*+1.0*|leg|], split=50/50); LOCK(g)
```

| Parameter | Default | Reason |
|---|---|---|
| Thrust minimum | 4.0 × ATR(M15) | R2: lets M5 end-confirmation precede F38; "strong momentum" heuristic (design) |
| Fresh | First pullback after the thrust's BOS | DiNapoli's "first pullback… of a fresh thrust" |
| Entry level | F38 + 1 tick | DiNapoli F38 plus S10 |
| Stop | F61 − buffer | DiNapoli: stop beyond the F61 of the same reaction |
| Targets | COP, OP from C | DiNapoli objective points, anchored at C (pre-committed convention) |
| Expiry | 16 M15 bars | Design |
| Double penetration | Not traded | S13; avoids re-entering a level that failed to hold |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- The thrust labelled with its size in ATR(M15) and the BOS close.
- An M5 confirm marker on B *before* price reached F38.
- The order at F38 + 1 tick, the stop under F61, and COP/OP drawn from C*.

A bot error looks like one of these:
- A thrust measured from a provisional B (B kept rising after the order).
- F38 computed on an M5 leg (wrong degree).
- An order placed after price had already passed F38 (an unconfirmed grid treated as confirmed).
- Objectives drawn from B instead of C (convention drift).

### Failure modes & regime fit
- **Deep pullbacks.** In ordinary trends pullbacks often run deeper than 38.2%, so the order fills and then the stop is hit at F61. This is exactly the honest-evidence case: no peak at 38.2 is expected.
- **Cost of the thrust filter.** It sharply reduces trade frequency.

It fits strong momentum days and the first pullback after a breakout. It fails on news spikes, where the thrust is a single bar and the pullback is a full reversal.

### Relations
- **FIB-07:** routed by FIB-05. FIB-04 owns SHALLOW pullbacks of BOS thrusts; FIB-07 owns DEEP retraces of CHoCH legs. The grid lock stops both trading one grid.
- **FIB-01:** conflicts (choose one per instrument and layer).
- **FIB-11:** complements it. FIB-11 enters on the break of B after the same shallow pullback, if FIB-04 did not fill.
- **FIB-12:** this proposal pre-commits to DiNapoli's own targets instead of the ladder.

## FIB-05 Pullback-depth classifier (router and sizer)

### At a glance
- **Style:** module (no entries of its own). **Typical hold:** not applicable.
- **Instruments:** all.
- **Regime:** all; it classifies the regime.
- **Evidence grade:** C for routing semantics (the sources contradict each other); B for its stop-placement function.
- **Automation complexity:** Low.

### Concept basis
The Fib grid's most defensible job is to measure pullback depth on a standard scale. Forexop's sample shows corrections distributed log-normally, with about 83% ending between 15% and 61.8% and no peaks at Fib ratios ([Forexop](https://forexop.com/?p=7920)). The ratios are therefore convenient *quantile marks*, not magnets. Dow Theory's secondary reactions typically retrace "one-third to two-thirds" ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). Elliott guidelines put wave 2 at 50–61.8% (sometimes 78.6%) and wave 4 near 38.2%, and treat a retracement beyond 100% of wave 1 as an invalidation rule ([TheRightTrader](https://therighttrader.com/learn/elliott-wave-and-cycles/elliott-wave-fibonacci-ratios)).

Practitioners read ≤38.2% as strength and 61.8–78.6% as fading momentum. They also contradict one another, and "depth is a measurement, not a signal by itself" ([LuxAlgo Fib retracement](https://www.luxalgo.com/library/concept/fib-retracement/); [TheRightTrader deep vs shallow](https://therighttrader.com/learn/trend-analysis/deep-vs-shallow-pullback)). The stop-placement convention is unusually consistent across schools: DiNapoli puts the stop beyond F61, OTE at 100%, the golden pocket invalidates at 0.786 or the origin ([LuxAlgo DiNapoli](https://www.luxalgo.com/library/indicator/dinapoli-levels/); [LuxAlgo OTE](https://www.luxalgo.com/library/concept/optimal-trade-entry/); [LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)). Together with the distributional base rate, that consistency is why stop placement grades B.

Osler found that "none of the firms correctly assessed the relative likelihood" of reactions at different levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). That cautions against elaborate strength scores, so this module routes and sizes with one coarse rule and keeps trend-strength tags for diagnosis only. See [04](04%20Fibonacci%20retracements%20and%20extensions.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | n/a (supplied by the host) | n/a |
| LOCATION | Runs on every ACTIVE grid on the host's location layer | The same grids on VB layers |
| SETUP / TRIGGER | n/a | n/a |
| MANAGEMENT | Supplies the default stop reference and the size multiplier | Same |

On clock time: nothing of its own.

### Context filter
None. The classifier runs on every ACTIVE grid. It distinguishes **BOS legs** (continuation inside an established trend) from **CHoCH legs** (the first leg of a possible new trend), because their normal depths differ: wave-4-like vs wave-2-like.

### Location
Depth for longs is d = (B − lowest low since B) / (B − A), measured on wicks. The states are:
- **SHALLOW:** d ≤ 0.382 + τ, where τ = 0.1 × ATR(L)/|B−A| is the zone half-width as a fraction of the leg.
- **NORMAL:** 0.382 + τ < d ≤ 0.618 + τ.
- **DEEP:** d above that, with no close beyond R(0.786).
- **BROKEN:** a close beyond R(0.786).
- **INVALID:** a close beyond A (R6).

Wicks register tests; only closes register BROKEN or INVALID.

### Setup
Routing table (design):

| Depth state | BOS-leg grids (continuation) | CHoCH-leg grids (new trend) |
|---|---|---|
| SHALLOW | FIB-04 eligible; FIB-11 eligible | Not yet in the FIB-07 zone |
| NORMAL | FIB-01 zones eligible; triggered entries at full size; FIB-11 only if d ≤ 0.5 | Waiting |
| DEEP | Untriggered limits barred; triggered entries (FIB-02/03/06/13) at 0.5× size | FIB-07 zone at full size (wave-2-normal) |
| BROKEN | No continuation entries on this grid; flag REVERSAL_ELIGIBLE for the PA family | FIB-07 grid dead |
| INVALID | Grid INVALIDATED | Same |

### Trigger
None. The module emits flags.

### Entry order
None.

### Risk & management
- **Stop reference:** for hosts that need a structural stop and have none from a trigger, the default stop is R(0.786) − buffer for BOS legs and A − buffer for CHoCH legs.
- **Size multiplier:** 0.5 in DEEP on BOS-leg grids. This is the only sizing rule.
- **Completed-pullback memory:** when a grid becomes SUPERSEDED (a close beyond B), its final depth class is recorded. A trend-strength tag (STRONG if the last two completed pullbacks were SHALLOW, WEAK if both were DEEP or worse) is logged for diagnosis only and gates nothing.

### Filters
None of its own.

### Automation spec
**States (per grid, monotone within one pullback):** NONE → SHALLOW → NORMAL → DEEP → BROKEN → INVALID. On SUPERSEDED, record the completed depth and reset with the new grid.

```
on bar_close(L_host) for g in FIB.grids(L_host, status in {ACTIVE, SUSPENDED}):
  d = (g.B - min_low_since(g.B)) / |g.B - g.A|;  tau = 0.1*ATR(L_host)/|g.B - g.A|
  g.depth = max_state(g.depth, SHALLOW if d<=0.382+tau else NORMAL if d<=0.618+tau else DEEP)
  if close < g.R(0.786): g.depth = BROKEN
  if close < g.A:        g.depth = INVALID; g.status = INVALIDATED
  emit ROUTE(g.id, g.leg_type in {BOS, CHoCH}, g.depth, size_mult = 0.5 if (g.leg_type==BOS and g.depth==DEEP) else 1.0)
on g.status -> SUPERSEDED: HISTORY[L_host].append(g.depth); emit TAG(diagnostic_only)
```

| Parameter | Default | Reason |
|---|---|---|
| Band edges | 0.382 / 0.618 / 0.786 / A | The shared ratio set used as quantile labels (design) |
| τ (edge tolerance) | 0.1 × ATR(L)/leg | Same half-width as S7 |
| Wick vs close | Wicks for depth, closes for BROKEN/INVALID | LuxAlgo zone lifecycle convention |
| DEEP size multiplier | 0.5 (BOS legs only) | Weak-trend heuristic, applied once and coarsely (design) |
| Trend tag | Diagnostic only | Osler: level-strength judgments were uninformative |
| Inherited | S1, S2, S4 | Shared |

### Visual review checklist
A valid run shows a depth label on every bar for each grid, monotone within a pullback. A BROKEN label appears only on a *close* below R(0.786), and the leg type (BOS or CHoCH) matches the structure event that produced the leg.

A bot error looks like one of these:
- Depth computed from closes rather than wicks.
- Depth reset by a lower high instead of only by a new B.
- A CHoCH leg treated as a BOS leg, which would wrongly halve FIB-07's size.
- A grid kept routing after INVALID.

### Failure modes & regime fit
- **Contested semantics.** Depth semantics are contested, which is why the module only gates untriggered entries and halves size. It does not forecast.
- **Gaps and spikes.** These can skip states (SHALLOW straight to BROKEN within one bar). The router must evaluate on the bar close and not assume the intermediate states were visited.

Its most valuable output is the forward-collected **empirical depth distribution per instrument and layer**, which replaces folklore with the user's own base rates.

### Relations
FIB-05 is used by FIB-01, 02, 03, 04, 06, 07, 11 and 13. PA-family pullback proposals may use it as a depth ruler, and its REVERSAL_ELIGIBLE flag is a context input for PA-family reversal templates. It does not conflict with anything.

## FIB-06 Weekly/daily/H4 multi-anchor cluster swing

### At a glance
- **Style:** swing. **Typical hold:** 2–10 sessions.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL (micros by default; structure stops are wide).
- **Regime:** weekly uptrend with a daily pullback in progress. Shorts mirror.
- **Evidence grade:** C overall. The cluster location is practitioner consensus, and standalone it is D. Weekly trend context is B (indirect, from time-series momentum). The stop beyond the zone is B.
- **Automation complexity:** High.

### Concept basis
Boroden builds clusters from 15/60-minute and daily swings and requires at least three relationships in a tight range ([Boroden interview](https://tradingmarkets.com/?p=661586)). Generic cluster engines weight cross-timeframe clusters higher and recommend tolerance as "a fraction of the recent average range" ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)). The case for running the cluster logic on *weekly and daily* anchors is the self-fulfilling argument. Order clustering at a Fib grid needs many participants to draw the same grid, which is plausible for obvious higher-timeframe swings and implausible for idiosyncratic intraday ones. Published levels also kept their predictive power for at least five business days in Osler's data ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). The weekly bias layer has the best-supported trend evidence in the set, 1–12-month persistence across futures ([Moskowitz, Ooi & Pedersen](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). The structure follows the concept notes' swing template: daily structure, then an HTF location, then a 60-minute structure trigger. Dow's "one-third to two-thirds" secondary reaction is the size template for the pullback ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). See [04](04%20Fibonacci%20retracements%20and%20extensions.md) and [01](01%20Swing%20points%20across%20timeframes.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | W1 STRUCTURE = UP; D1 not DOWN | Same (clock) |
| LOCATION | FIB-CLUSTER from the last 2 D1 up-legs + the last W1 up-leg + the last H4 up-leg + the D1 symmetry projection | Same (clock; there is no VB tier this coarse) |
| SETUP | D1 in a pullback, zone touched | Same |
| TRIGGER | H1 CHoCH_UP | VB-A CHoCH_UP (a faster, tighter variant) |
| MANAGEMENT | H4 swing trail | H4 swing trail (clock) |

On clock time in both versions: W1, D1 and H4 entirely; maintenance-window and Sunday-open exclusions; blackouts; the 3-session trigger window; the 10-session time stop.

### Context filter
STRUCTURE(W1) = UP at G3, and STRUCTURE(D1) ≠ DOWN at G3: the D1 protected low has not been closed below. A D1 G2 event (an H1 or H4 close below the D1 protected low) puts the proposal on stand-aside.

### Location
The contributors are retracements {0.382, 0.5, 0.618, 0.786} of the last two ACTIVE D1 up-legs, the last W1 up-leg and the last H4 up-leg, plus the D1 symmetry projection (the current D1 high minus 1.0 × the last completed D1 pullback), for 17 levels. The cluster needs w = 0.2 × ATR(D1), ≥3 members, and ≥2 anchor pairs of which ≥1 is D1 or W1. The zone's midpoint must sit at depth 0.382–0.786 of the latest D1 leg, and the zone must lie above the D1 protected low. Selection follows R9.

### Setup
The D1 pullback is active (price below the latest confirmed D1 swing high and above the D1 protected low), and an H1 bar's low trades at or below zone_hi. That is the first touch, and the setup moves to ARMED.

### Trigger
An H1 CHoCH_UP within 3 sessions of the first touch. It must come before a D1 close below zone_lo − 0.1 × ATR(D1), which counts as the zone being cleared.

### Entry order
A buy limit at the broken H1 level + 1 tick, expiring after 3 H1 bars, inside a bracket.

### Risk & management
- **Stop:** the farther of (the lowest low since the touch − buffer(H1)) and (zone_lo − 0.1 × ATR(D1)). Skip if the stop distance exceeds 1.0 × ATR(D1).
- **Size:** in micros, per the shared rule.
- **Targets:** FIB-12 continuation on the latest D1 leg. T1 is the first rung ≥1R among {D1 B, E(1.272)}; T2 is the next rung. Half exits at each.
- **After T1:** stop to breakeven; trail under confirmed SWING(H4) lows.
- **Time stop:** 10 sessions.
- **Cancel:** the zone clears, the W1 context is lost, a D1 G2 event occurs, any cluster grid becomes SUPERSEDED, or a roll date falls within 2 sessions (do not open across a roll).

### Filters
- ETH entries, excluding 16:45–18:30 ET and the first 60 minutes after the Sunday open.
- News blackout for entries; open positions keep their server-side brackets.
- Volatility band applied to ATR(D1).
- One attempt per zone; at most one open FIB-06 position per instrument.

### Automation spec
**States:** IDLE → ZONE_ACTIVE → ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED, EXPIRED, INVALIDATED, REJECTED, ERROR.

```
on bar_close(D1):
  ctx = STRUCTURE(W1).state==UP and STRUCTURE(D1).state!=DOWN and not G2_event(D1)
  lv  = retr(SWING(D1).legs(UP,2)) + retr(SWING(W1).legs(UP,1)) + retr(SWING(H4).legs(UP,1)) + [symmetry(SWING(D1),1.0)]
  Z   = FIB_CLUSTER(lv, w=0.2*ATR(D1), min_levels=3, min_anchors=2, require_layer∈{D1,W1})
          .select(below=price, depth_mid_in=[0.382,0.786] of SWING(D1).last_leg, lo_above=STRUCTURE(D1).protected_low)
  if close < Z.lo - 0.1*ATR(D1): cancel(this, "zone_cleared")
on bar_close(H1):
  if state==ZONE_ACTIVE and low<=Z.hi: state=ARMED; t0=now; X=low
  if state==ARMED:
     X=min(X,low)
     if sessions_since(t0) > 3: -> EXPIRED
     elif STRUCTURE(H1).event==CHoCH_UP:
        stop = min(X - buffer(H1), Z.lo - 0.1*ATR(D1)); lvl = STRUCTURE(H1).broken_level
        if lvl - stop <= 1.0*ATR(D1): T = FIB12.continuation(SWING(D1).last_leg, lvl+tick, stop)
           if T.T1_R >= 1.0: ORDER.bracket_limit(lvl+tick, stop, T, expiry=3 bars) -> ORDER_PENDING
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor set | 2 × D1 + W1 + H4 up-legs, plus D1 symmetry | S8; Boroden's multi-TF clusters |
| Tolerance | 0.2 × ATR(D1) | S6 on the zone layer |
| Depth window | 0.382–0.786 of the latest D1 leg | Dow's 1/3–2/3 template within the shared set (design) |
| Trigger | H1 CHoCH_UP | Concept notes' swing template (60-minute structure trigger) |
| Trigger window | 3 sessions | Daily pullbacks linger; level effects decay over days (design) |
| Max stop | 1.0 × ATR(D1) | Keeps micro sizing feasible (design) |
| Trail layer | H4 swings | A management role only (design) |
| Time stop | 10 sessions | Shannon-style 3–6-day swing holds, with slack (design) |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- Weekly and daily labels, with their confirming closes dated.
- Each cluster member traceable to a grid whose B was confirmed before the first touch, and at least one D1 or W1 member.
- The touch, the H1 CHoCH within 3 sessions, and the fill at a retest.

A bot error looks like one of these:
- Weekly swings taken from the *developing* week (look-ahead; the weekly bar is known only at the Friday close).
- Back-adjusted levels shown on an unadjusted chart without the roll offset.
- A cluster whose W1 member comes from a leg that the as-of chart shows was still extending.

### Failure modes & regime fit
- **Thin samples.** Signals are few per instrument, so samples accumulate slowly. Run identical rules on ES, NQ and CL, remembering that MES and ES are the same signal, not two.
- **Gap risk.** Overnight and weekend gaps can jump stop-with-protection orders.
- **Weekly turns.** At major weekly turns, daily pullbacks become reversals; G2/G3 handling contains this.

It fits steady weekly trends. It fails in macro shocks and in regime turns.

### Relations
- **FIB-08's weekly instance:** overlaps it (choose one).
- **FIB-02:** the intraday analogue; respect the family position cap.
- **FIB-10:** conflicts with it on the same instrument when the H4 is extended (opposite views).
- **FIB-05 and FIB-12:** modules.
- **PA family:** "HTF-trend pullback continuation" (Template A) is the structure-only cousin.

## FIB-07 Structure-shift first retrace ("OTE" without jargon)

### At a glance
- **Style:** intraday. **Typical hold:** 15 minutes to 3 hours.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL.
- **Regime:** early trend, i.e. the first pullback after an M15 structure shift while H1 is not against it. Shorts mirror.
- **Evidence grade:** C. The OTE construct has no published evidence. The structure-shift prerequisite is practitioner consensus. The stop beyond the trigger swing is B.
- **Automation complexity:** Med.

### Concept basis
ICT's "Optimal Trade Entry" waits for a market-structure shift or break of structure with aggressive displacement. It then waits for a retracement into the 0.62–0.79 band of that leg (0.705 is simply the midpoint), and for a lower-timeframe structure shift inside the band. The stop is commonly at the 100% level, and the targets are the swing, then extensions ([LuxAlgo OTE](https://www.luxalgo.com/library/concept/optimal-trade-entry/); [Equiti](https://www.equiti.com/jo-en/news/trading-ideas/ote-vs-fibonacci-ict-trading/)). The candid points come from the same sources. "The ratios themselves have no mechanical force." There is no reliable published win rate. A vendor reports that no journal article tests ICT concepts at all ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)).

The useful part is the *structural prerequisite*: only legs that actually shifted structure, with a large-bodied bar, qualify. The 0.62/0.705/0.79 numbers add nothing over 0.618 and 0.786 ([Fib notes via 04](04%20Fibonacci%20retracements%20and%20extensions.md)). Elliott guidelines say the same thing in a different vocabulary: the first correction of a new move commonly retraces 50–61.8%, sometimes 78.6%, and never more than 100% ([TheRightTrader](https://therighttrader.com/learn/elliott-wave-and-cycles/elliott-wave-fibonacci-ratios)). That is why FIB-05 treats DEEP as normal for CHoCH legs. The ICT-style preceding liquidity sweep is *not* required here. Sweeps are the PA family's domain, and the one vendor test found swept levels predicted continuation more often than reversal (unverified).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H1 STRUCTURE ≠ DOWN | H1 STRUCTURE (clock) |
| LOCATION | FIB(A→B) of the M15 CHoCH leg; band R(0.786)–R(0.618) | FIB(A→B) of the VB-A CHoCH leg |
| SETUP | First entry into the band after the grid is ACTIVE (B confirmed by SWING(M5)) | B confirmed by SWING(VB-B) |
| TRIGGER | M5 CHoCH_UP inside the band | VB-B CHoCH_UP |
| MANAGEMENT | M5 (stop and trail) | VB-B |

On clock time in both versions: H1, windows, blackout, flat-by time, and the trigger window's clock backstop (60 minutes).

### Context filter
STRUCTURE(H1) ∈ {UP, RANGE, TRANSITION} at G3, i.e. not DOWN. No bullish shift is taken against a confirmed H1 downtrend.

### Location
The leg A→B qualifies when:
- A is the confirmed M15 swing low that ended the prior M15 down-structure;
- the leg produced an M15 CHoCH_UP (a close above the last M15 lower high);
- |B−A| ≥ 3 × ATR(M15);
- the leg contains at least one bar with a body ≥ 1.0 × ATR(M15) in the leg direction (the "displacement" test);
- B is end-confirmed by SWING(M5) (R2).

The band is [R(0.786) − 0.1 × ATR(M15), R(0.618) + 0.1 × ATR(M15)].

### Setup
The first trade into the band after the grid is ACTIVE, with no earlier band entry on this grid.

### Trigger
An M5 CHoCH_UP within 12 M5 bars of the first band entry. It must come before any M5 close below R(0.786) − 0.1 × ATR(M15); such a close makes the grid BROKEN and cancels the setup.

### Entry order
A buy limit at the broken M5 level + 1 tick, expiring after 3 M5 bars (S11).

### Risk & management
- **Stop:** the lowest low since band entry − buffer(M5).
- **Targets:** FIB-12 continuation on A→B. T1 is the first rung ≥1R among {B, E(1.272)}; T2 is the next rung.
- **After T1:** stop to breakeven; trail under confirmed M5 swing lows.
- **Time stop:** 36 M5 bars, and flat by session end.
- **Invalidation:** an M15 close below A (INVALIDATED), an M5 close below the band (BROKEN), or the H1 context turning DOWN.

### Filters
- RTH windows; blackout.
- Volatility band applied to ATR(M15).
- One attempt per leg; 3 trades per day.

### Automation spec
**States:** IDLE → ZONE_ACTIVE (CHoCH leg qualified, grid ACTIVE) → ARMED (band entered) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED, EXPIRED, INVALIDATED, REJECTED, ERROR.

```
on STRUCTURE(M15).event == CHoCH_UP:
  leg = SWING(M15).leg_containing_event(); g = FIB(leg.A→leg.B)
  if |leg|>=3*ATR(M15) and max_body_in(leg, dir=UP)>=1.0*ATR(M15) and STRUCTURE(H1).state!=DOWN: watch(g, type=CHoCH)
on bar_close(M5):
  if g.status==ACTIVE and state==ZONE_ACTIVE and low <= g.R(0.618)+0.1*ATR(M15): state=ARMED; t0=now; X=low
  if state==ARMED:
     X=min(X,low)
     if close < g.R(0.786)-0.1*ATR(M15) or bars_since(t0)>12: cancel()
     elif STRUCTURE(M5).event==CHoCH_UP:
        lvl=STRUCTURE(M5).broken_level; stop=X-buffer(M5); T=FIB12.continuation(leg, lvl+tick, stop)
        if T.T1_R>=1.0: ORDER.bracket_limit(lvl+tick, stop, T, expiry=3 bars) -> ORDER_PENDING
```

| Parameter | Default | Reason |
|---|---|---|
| Leg type | M15 CHoCH leg | ICT's MSS prerequisite in neutral terms |
| Displacement | ≥1 bar with body ≥ 1.0 × ATR(M15) | "Aggressive displacement" made codable (design) |
| Band | 0.618–0.786 (± 0.1 ATR) | Classical equivalent of OTE's 0.62–0.79 |
| Trigger | M5 CHoCH_UP inside the band | "LTF MSS inside the zone" |
| Trigger window | 12 M5 bars / 60 minutes | Design |
| Stop | Trigger swing low − buffer | Tighter and more auditable than a 100% stop (design) |
| Time stop | 36 M5 bars | Design |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- The prior M15 down-structure and the CHoCH close that ended it.
- The displacement bar highlighted.
- B with an M5 confirm marker before band entry.
- The band drawn from A and B (not from the CHoCH level).
- The trigger CHoCH inside the band, and a fill at a retest.

A bot error looks like one of these:
- A CHoCH computed on a provisional M15 swing.
- A "displacement" bar that closed after B.
- The band drawn on a leg that was still extending.
- The 0.705 midpoint used as an entry price.
- Halved size because the leg was misclassified as BOS by FIB-05.

### Failure modes & regime fit
- **Ranges.** Here, CHoCH legs are mostly noise, and many "shifts" fail. ICT's own material calls an OTE in a ranging market without a prior stop run "much weaker."
- **Deep retraces.** A retrace that closes through 0.786 means the shift failed, and the cancel rule handles it.
- **News bars.** A news bar can manufacture the displacement test.

It fits days that turn after an overnight or early-session decline, and post-pullback resumptions inside an H1 trend.

### Relations
- **FIB-04:** complements it through FIB-05 (shallow BOS legs vs deep CHoCH legs).
- **FIB-13:** the same skeleton on BOS legs and volume bars (different leg type, so both can run under the grid lock).
- **PA family:** its CHoCH-breakout entries fire *at* the shift. FIB-07 waits for the retrace, so do not run both on the same instrument.
- **CX family:** owns any version that adds a volume node or a sweep requirement.

## FIB-08 Prior-day equilibrium hold (0/50/100)

### At a glance
- **Style:** intraday (weekly instance FIB-08W, swing, is a separate strategy version). **Typical hold:** 30 minutes to 5 hours.
- **Instruments:** ES/MES and NQ/MNQ (prior RTH 09:30–16:00 ET), CL/MCL (prior 09:00–14:30 ET session).
- **Regime:** daily uptrend; the RTH session opens in the upper half of the prior day's range and pulls back. Shorts mirror.
- **Evidence grade:** B (indirect). The 0%/50%/100% levels are singled out by Shanaev & Gibson (a working paper). Prior extremes and the "50 percent rule" are among the practitioner methods behind Osler's published levels that beat random levels. The trigger is a timing device.
- **Automation complexity:** Low.

### Concept basis
Shanaev & Gibson report predictive power for retracement levels in international indices and FX. Their S&P 500 strategy earns significant Fama-French alpha, and their abstract names **0%, 50% and 100%** among the most important levels ([SSRN 4212430](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212430); full text not accessed, publication status unknown). Osler lists the "50 percent rule" and Fibonacci retracements among the methods dealers use to set the published levels that bounced price **60.8% vs 56.2%** of the time for random levels. She also quotes the practitioner definition of support and resistance as prior reaction lows and peaks ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). ICT's "premium/discount" relabels the same midpoint ([blog](https://dhanith-trading-blog.vercel.app/blog/premium-and-discount-zones)).

What makes this the family's best-supported design is not φ, since 50% is not a Fibonacci ratio. It is the anchor. The prior RTH day's high and low are final, identical for every participant, and need no swing detector, so the grid cannot repaint and cannot be anchor-shopped. That is exactly the precondition the self-fulfilling argument needs. See [04](04%20Fibonacci%20retracements%20and%20extensions.md) and [02](02%20Multi%20timeframe%20price%20action.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | D1 STRUCTURE = UP (Globex daily bars) | Same (clock) |
| LOCATION | Prior RTH day grid: EQ_D = (PDH + PDL)/2 (LEVELS) | Same (clock) |
| SETUP | RTH open > EQ_D; first RTH touch of the EQ zone | Same |
| TRIGGER | M5 CHoCH_UP | VB-B CHoCH_UP |
| MANAGEMENT | M5 | VB-B |

On clock time in both versions: D1, PDH/PDL/EQ_D, the RTH open, entry windows, blackout, and the 15:55 ET flat-by.

### Context filter
STRUCTURE(D1) = UP at G3, and the RTH open (09:30 ET; 09:00 ET for CL) is above EQ_D. The prior RTH range must be ≥ 0.5 × ATR(D1-RTH), so narrow days, where the midpoint sits on top of everything, are skipped.

### Location
EQ_D = PDL + 0.5 × (PDH − PDL) on the prior RTH session. The zone is EQ_D ± 0.1 × ATR(D1-RTH), with ATR computed on RTH daily bars (session-aware, S2).

### Setup
The first RTH touch of the zone between 09:45 and 14:30 ET (ES/NQ).

### Trigger
An M5 CHoCH_UP within 12 M5 bars of the first touch. The setup is cancelled by two consecutive M5 closes below zone_lo, which counts as acceptance below equilibrium.

### Entry order
A buy limit at the broken M5 level + 1 tick, expiring after 3 M5 bars (S11).

### Risk & management
- **Stop:** the lowest low since the touch − buffer(M5). Skip if the stop distance exceeds 0.35 × ATR(D1-RTH).
- **Targets:** FIB-12 continuation on the time-anchored grid with A = PDL and B = PDH. T1 is the first rung ≥1R among {PDH, E(1.272) = PDL + 1.272 × (PDH − PDL)}; T2 is the next rung. Half exits at each.
- **After T1:** stop to breakeven; trail under M5 swing lows.
- **Time stop:** flat at 15:55 ET.
- **Cancel:** acceptance below EQ, D1 context lost, the trigger window lapses, or the time leaves the window.

### Filters
- RTH only; blackout; on FOMC days the whole session is skipped (design).
- Volatility band applied to ATR(D1-RTH).
- One attempt per day.

**Weekly instance (FIB-08W).** The same rules apply one layer up. W1 = UP, EQ_W comes from the prior Globex week, the zone is ± 0.1 × ATR(W1), the trigger is an H1 (VB-A) CHoCH, targets are PWH then E(1.272), and the time stop is 5 sessions. Run it as its own strategy version.

### Automation spec
**States:** IDLE → ZONE_ACTIVE (context passed at 09:30) → ARMED (touch) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED, EXPIRED, REJECTED, ERROR.

```
at RTH_open:
  EQ = (LEVELS.PDH + LEVELS.PDL)/2; rngOK = (PDH-PDL) >= 0.5*ATR(D1_RTH)
  if STRUCTURE(D1).state==UP and LEVELS.RTH_open > EQ and rngOK: state=ZONE_ACTIVE; Z=[EQ-0.1*ATR(D1_RTH), EQ+0.1*ATR(D1_RTH)]
on bar_close(M5):
  if state==ZONE_ACTIVE and low<=Z.hi and 09:45<=now<=14:30: state=ARMED; t0=now; X=low
  if state==ARMED:
     X=min(X,low)
     if two_consecutive_closes_below(Z.lo) or bars_since(t0)>12: cancel()
     elif STRUCTURE(M5).event==CHoCH_UP:
        lvl=STRUCTURE(M5).broken_level; stop=X-buffer(M5)
        if lvl-stop <= 0.35*ATR(D1_RTH):
           T=FIB12.continuation(grid=(PDL→PDH), entry=lvl+tick, stop)
           if T.T1_R>=1.0: ORDER.bracket_limit(lvl+tick, stop, T, expiry=3 bars) -> ORDER_PENDING
```

| Parameter | Default | Reason |
|---|---|---|
| Range definition | Prior RTH session (CL: 09:00–14:30 ET) | Most-watched cash-session range; one template, fixed in advance |
| Midpoint | 0.5 | Shanaev & Gibson's 50%; Osler's "50 percent rule" |
| Open condition | RTH open > EQ_D | Makes the touch a pullback into equilibrium (design) |
| Minimum range | 0.5 × ATR(D1-RTH) | Skip narrow days (design) |
| Zone | ± 0.1 × ATR(D1-RTH) | S7 on the zone layer |
| Acceptance-below rule | 2 consecutive M5 closes below the zone | Distinguishes a wick test from acceptance (design) |
| Max stop | 0.35 × ATR(D1-RTH) | Intraday-sized risk (design) |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- PDH and PDL taken from the prior RTH session, with their timestamps, and EQ_D drawn from session open to close.
- The 09:30 open marked above EQ_D, and the D1 UP label dated by its confirming close.
- The first touch, the CHoCH close within 12 bars, and a retest fill.

A bot error looks like one of these:
- PDH/PDL computed from the Globex day instead of RTH (a template mismatch, the most common cause of "levels don't match").
- EQ recomputed from the *developing* day.
- The zone sized with an intraday ATR.
- A second attempt on the same day.

### Failure modes & regime fit
- **Gap-and-go days.** The midpoint is never reached, so there is no trade.
- **Opens above EQ that become down-trend days.** The trigger requirement and the acceptance rule usually keep the system out, but a false CHoCH in the first decline is the classic loss.
- **Range days.** These chop around EQ.

It fits trending weeks with ordinary pullback days.

### Relations
- **FIB-09:** complements it. FIB-09 is the range regime, so the two are mutually exclusive by D1 state and can run together.
- **FIB-08W:** overlaps FIB-06 (choose one).
- **PA family:** its PDH/PDL breakout or failure proposals trade the 0% and 100% lines. FIB-08 trades the 50% line, so all of them can coexist under the family position cap.
- **FIB-12:** supplies the ladder.

## FIB-09 Prior-week range overshoot reversion

### At a glance
- **Style:** swing. **Typical hold:** 1–5 sessions, closed by the end of the week.
- **Instruments:** ES/MES, NQ/MNQ, CL/MCL.
- **Regime:** daily range (D1 RANGE or TRANSITION).
- **Evidence grade:** C overall. Prior-week extremes as reaction levels are B, by indirect support from Osler. The 1.272 overshoot bound and the 50% target are design choices, C.
- **Automation complexity:** Med.

### Concept basis
Salient levels "reflect" price more often than random levels do. Take-profit orders cluster *at* salient prices while stop-loss orders cluster *just beyond* them and propagate moves for hours ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf); [Osler SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf); [Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). That mechanism explains why a range high is often overshot and why a quick failure back inside is informative. This is Sperandeo's 2B: "if prices penetrate the previous high, but fail to carry through and immediately drop below the previous high, the trend is apt to reverse" ([RoboForex on Sperandeo](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)).

Fibonacci contributes two things here. The first is an **overshoot bound**: an overshoot beyond the 1.272 extension of the prior week's range, closed on H1, is treated as acceptance (a breakout) rather than a sweep. Using Boroden's first extension as the cut-off is a design proposal. The second is an **equilibrium target**: the 50% of the range, the level Shanaev & Gibson highlight ([SSRN 4212430](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212430)).

Fading equity-index strength carries a lower prior. Bulkowski's 1-2-3 statistics are asymmetric (73% bullish vs 43% bearish on stocks) ([ThePatternSite](https://www.thepatternsite.com/123tc.html)), and trends persist ([Moskowitz, Ooi & Pedersen](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). The weekly filter therefore allows only the counter-weekly-trend side to be skipped. See [04](04%20Fibonacci%20retracements%20and%20extensions.md).

### Chart stack
| Role | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | D1 STRUCTURE ∈ {RANGE, TRANSITION}; W1 STRUCTURE picks the allowed side | Same (clock) |
| LOCATION | Prior Globex week: band [PWH, PWL + 1.272 × (PWH − PWL)] for shorts; the mirror below PWL for longs | Same (clock) |
| SETUP | Trade beyond PWH by ≥ max(1 tick, 0.1 × ATR(H1)) | Same, with ATR(VB-A) |
| TRIGGER | H1 close back below PWH within 6 H1 bars | VB-A close back below PWH within 24 VB-A bars and 6 hours |
| MANAGEMENT | H1 | VB-A |

On clock time in both versions: W1, D1, PWH/PWL/EQ_W, the Friday 15:45 ET exit, the maintenance and Sunday exclusions, and blackouts.

### Context filter
STRUCTURE(D1) ∈ {RANGE, TRANSITION} at G3. If STRUCTURE(W1) = UP, only the long side (PWL overshoot) is traded; if DOWN, only the short side; if RANGE, both. The prior week's range must be ≥ 0.5 × ATR(W1).

### Location
For shorts, the band runs from PWH to E(1.272) = PWL + 1.272 × (PWH − PWL), which is the 1.0–1.272 extension band of FIB(PWL→PWH). Longs mirror below PWL.

### Setup
A trade above PWH by at least max(1 tick, 0.1 × ATR(H1)). The setup is ARMED on the first such trade.

### Trigger
An H1 close back below PWH within 6 H1 bars of the first penetration, with no H1 close above E(1.272) in between. A close above E(1.272) cancels the setup: the range is accepted as broken.

### Entry order
A sell limit at PWH − 1 tick (a retest from below), expiring after 3 H1 bars (S11 with the broken level = PWH).

### Risk & management
- **Stop:** the highest high since penetration + buffer(H1).
- **Targets (FIB-12 range mode):** T1 = EQ_W + 1 tick, the 50% of the prior week, front-run by a tick. T2 = PWL + 1 tick. Half exits at each. Skip unless T1 is ≥1R.
- **After T1:** stop to breakeven.
- **Time stop:** exit at market by Friday 15:45 ET. The prior-week grid is superseded at the weekly close.
- **Cancel:** an H1 close above E(1.272), the D1 state turning UP or DOWN at G3, the trigger window lapsing, or the week ending.

### Filters
- ETH entries, excluding 16:45–18:30 ET and the first 60 minutes after the Sunday open.
- Blackout.
- Volatility band applied to ATR(D1).
- One attempt per side per week.

### Automation spec
**States:** IDLE → ZONE_ACTIVE (the week's grid set on Sunday, context passed) → ARMED (penetration) → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Exits: CANCELLED (accepted beyond 1.272, context, week end), EXPIRED, REJECTED, ERROR.

```
at week_open: G = (A=LEVELS.PWL, B=LEVELS.PWH); EQW=(PWH+PWL)/2; E127 = PWL + 1.272*(PWH-PWL)
  sides = {SHORT,LONG} if STRUCTURE(W1).state==RANGE else {LONG} if UP else {SHORT}
on bar_close(H1):   # short side shown
  if STRUCTURE(D1).state not in {RANGE,TRANSITION}: cancel(); return
  if state==ZONE_ACTIVE and high >= PWH + max(tick, 0.1*ATR(H1)): state=ARMED; t0=now; HH=high
  if state==ARMED:
     HH=max(HH,high)
     if close > E127 or bars_since(t0)>6: cancel()
     elif close < PWH:
        stop=HH+buffer(H1); T=[EQW+tick, PWL+tick]
        if (PWH-tick - T[0]) >= 1.0*(stop-(PWH-tick)): ORDER.bracket_limit_sell(PWH-tick, stop, T, expiry=3 bars) -> ORDER_PENDING
at Friday 15:45 ET: ORDER.exit_market("week_end")
```

| Parameter | Default | Reason |
|---|---|---|
| Range | Prior Globex week (Sunday 18:00 – Friday 17:00 ET) | One template, the weekly cap |
| Overshoot bound | Close beyond E(1.272) = accepted breakout | Boroden's first extension as the abandonment band (design) |
| Minimum penetration | max(1 tick, 0.1 × ATR(H1)) | A real trade beyond the level (design) |
| Failure window | 6 H1 bars | Sperandeo's "immediately" ≈ a small k (design) |
| Target | EQ_W, then the opposite extreme, each front-run by 1 tick | 50% level; take-profits cluster at salient prices (Osler) |
| W1 side filter | Only the side matching the W1 trend | Trend persistence; equity-index asymmetry (design) |
| Week-end exit | Friday 15:45 ET | The anchor expires at the weekly close (design) |
| Inherited | S1–S17 | Shared |

### Visual review checklist
A valid signal shows:
- PWH/PWL from the completed Globex week, EQ_W, and the E(1.272) band.
- The penetration bar and the H1 close back inside within 6 bars.
- No H1 close above E(1.272).
- The D1 RANGE label dated, and the W1 side filter respected.

A bot error looks like one of these:
- Using the *developing* week's high.
- E(1.272) computed from the wrong range.
- A trade on the side the W1 filter forbids.
- The 2B and the Fib band counted as two independent confirmations (they share the PWH anchor).

### Failure modes & regime fit
- **Genuine breakouts that retest the old high.** These stop the trade out, which is why both the 1.272 close rule and the trigger close matter.
- **Weekly trend resumption.** A daily range inside a strong weekly trend resolves in the weekly direction; the side filter only reduces this.
- **Late-week setups.** These have little time left before the exit.

It fits balanced, rotational weeks.

### Relations
- **PA family:** its 2B / failed-breakout proposals at PWH/PWL overlap directly. Run one or the other per instrument.
- **FIB-08:** complements it by regime.
- **FIB-11:** conflicts with it (breakout vs fade around extremes).
- **FIB-12:** supplies the range-mode target rules.

