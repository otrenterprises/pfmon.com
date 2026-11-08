# Assign the roles, then let the regime choose

This file proposes **fifteen automatically triggerable multi-timeframe strategies (CX-01 to CX-15) and a regime router (CX-00)**. Each one combines two or three of the researched dimensions without blending them. Every role (context, location, setup, trigger, management) is filled by exactly one pre-declared condition from one dimension, and the router decides which strategy families may run at all. The division of labour comes straight out of the research. Confirmed swing structure supplies bias, triggers and invalidation. Volume-at-price supplies location and acceptance, because it is the only dimension built from where contracts actually traded rather than from the same pivots. Fibonacci supplies a depth label or a target ruler and never counts as independent confirmation, because every Fib level is arithmetic on the swing anchors the structure engine already uses. **No peer-reviewed study tests whether "more confluence" improves results, or tests Fibonacci levels or volume-profile nodes in futures.** The evidence that does exist is narrower: published FX support/resistance levels caused bounces **60.8%** of the time against **56.2%** for arbitrary levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)), stop orders cluster just beyond salient prices and speed up moves once they are hit ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)), and technical levels coincide with limit-order-book depth ([Kavajecz & Odders-White](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). The two proposals with peer-reviewed cores borrow return momentum rather than chart geometry. CX-04 uses time-series momentum as its weekly context, and CX-15 uses the first-half-hour/last-half-hour intraday momentum effect. Every number in this file is a **pre-committed starting value, not an optimized one**. Bailey et al. show that false discoveries multiply with each configuration tried, and choosing rules by looking at past charts counts as trying configurations ([Bailey, Borwein, López de Prado & Zhu](https://scholarworks.wmich.edu/math_pubs/40/)). Start forward validation with **CX-08, CX-01 and CX-15**. Between them they cover rotation, trend pullbacks and end-of-day timing at low-to-medium build complexity. Run each proposal's single-dimension parent in shadow, so the forward sample shows whether the second dimension earns its place.

## Combining works only when each dimension answers a different question

The three dimensions are not three opinions on the same question. Swing structure answers *which way*, *what would prove me wrong* and *when the market has turned*: whether the swings make higher highs or lower lows, and where the protected swing sits. A volume profile answers *which prices were accepted*: where both sides traded heavily (POC, HVN, value area), where price moved through with little trade (LVN, single prints), and whether value is moving. Fibonacci answers *how deep or how far*, measured in units of a swing leg. Mixing them into one indicator throws away exactly this separation. The concept-interplay research therefore recommends a role-and-layer map. Higher-timeframe structure and value migration give context. Profile levels give location, filtered by Fib depth where Fib is used. Lower-timeframe price action gives the trigger. Structure gives invalidation. Extensions and opposing profile levels give targets ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)).

The named methods researched are partial versions of that map. Boroden layers Fib clusters with structure triggers: a trade with the immediate trend needs no trigger, while a higher-timeframe cluster against it does ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)). Dale pairs a higher-timeframe POC with a volume cluster and waits for the pullback ([Trader Dale, Oct 2025](https://trader-dale.blogspot.com/2025/10/trade-of-week-perfect-confluence-volume.html)). Shannon stacks anchored VWAPs from swing points ([Alphatrends](https://alphatrends.net/?p=623098)). ICT's sequence of sweep, then structure shift, then retracement is a context→trigger→location chain with no published evidence ([LuxAlgo: OTE](https://www.luxalgo.com/library/concept/optimal-trade-entry/)). The proposals below make each of those decompositions explicit. They also add combinations the notes support but no named author publishes.

The independent dimension is volume-at-price, and that shapes every role map below. A Fib retracement and the swing it was drawn from carry the same information: the location of two pivots. Counting "Fib 61.8% plus the prior swing low" as two confirmations double-counts unless the swing low belongs to a different leg. A profile not anchored to the current swing measures something else entirely: prior-week POC, composite HVN or session value edge. So does a round number, where Osler found order clustering. A profile anchored to the same two swings as a Fib grid shares their *time* window but still measures volume distribution, not geometry, so it is partly independent ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)). Every role map below ends with one sentence explaining why it does not double-count.

## Six anti-smash rules every proposal obeys

These rules are design proposals synthesized from the notes. They are enforced in code by the confluence gate and the dimension tags of the level registry in [07 Automation architecture](07%20Automation%20architecture.md) (§2.10–2.11), which tag levels GEOMETRY (swing and Fib), PROFILE (volume-at-price), REFERENCE (clock levels) or EXTERNAL (optional feeds).

| # | Rule | What it means in code | Why |
|---|---|---|---|
| 1 | One pre-declared condition per role | Each proposal names exactly one CONTEXT, LOCATION, SETUP, TRIGGER and MANAGEMENT rule. The gate returns the first failing role. No weighted scores. | A score adds one free parameter per weight plus a threshold, and false discoveries grow with configurations tried ([Bailey et al.](https://scholarworks.wmich.edu/math_pubs/40/)) |
| 2 | Count dimensions, not lines | Five Fib levels in a zone are one GEOMETRY vote. A LOCATION may cite at most one GEOMETRY and one PROFILE source. | Fib and swing levels share anchors ([06](06%20How%20the%20dimensions%20interact.md)) |
| 3 | Fib never supplies bias, the profile never supplies the trigger, and the trigger never supplies location | Role-to-dimension assignments in each role map are fixed | Each dimension answers a different question (concept-interplay rules) |
| 4 | Context comes from a higher layer than the trigger, at a declared ratio of about 4–6× | Stacks below declare their layers. The router (CX-00) gates bias. | Elder/LuxAlgo convention ([LuxAlgo MTF alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)) |
| 5 | Volume-weighted lenses count once | AVWAP and a profile level can never both fill one role. When they coincide, the overlap is logged as one PROFILE vote. | Both are built from the same prints |
| 6 | Dimensions are separate engines feeding one decision layer | The swing, profile and Fib engines emit versioned, as-of records. Only the setup state machine combines them, and only at bar close. | Determinism and replayable audit ([07](07%20Automation%20architecture.md) §1, §2.12) |

The router's permission is a *gate* shared by every proposal, not a confluence vote. A proposal whose CONTEXT is a value-migration state still needs the router to allow its direction. That is not double counting, because the router's job is to stop proposals from running in regimes they were not designed for.

## The evidence supports levels and stop clustering, not confluence itself

The honest evidence base is small, and it bears on mechanisms rather than on any of these combinations. Osler's test of six firms' published FX levels (1996–98) found bounces **60.8% vs 56.2%** for arbitrary levels, with published levels beating artificial ones in **all 16** firm-currency pairs, yet the firms themselves could not rank which of their levels were stronger ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). In about **9,700** bank orders, take-profits clustered *at* round numbers and stop-losses *just beyond* them; stop-loss responses were larger, lasted longer and were significant "for hours, although not for days" ([Osler SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf); [Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). Support and resistance coincide with peaks in NYSE limit-order-book depth ([Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)), and intraday S/R bounce probability rises with prior bounces but decays over time ([Chung & Bellotti](https://arxiv.org/abs/2101.07410v1)). None of this is CME futures data, and none of it tests Fib ratios or profile nodes.

Where the specific tools have been tested, the results are negative or thin. Fibonacci as a standalone rule found no support across three equity markets ([Tsinaslanidis, Guijarro & Voukelatos](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495)), and Dow trend ratios clustered "no more than would be expected by chance" ([Batchelor & Ramyar](https://openaccess.city.ac.uk/16276/)). The one informal ES test of the 80% value-area rule found complete fills on only **16 of 41** triggers, about 39% ([teamlbr 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). Standalone candlesticks failed bootstrap tests on DJIA stocks ([Marshall, Young & Rose 2006](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323)). The two clean positives are about return momentum, not geometry: time-series momentum persists over 1–12 months across 58 futures and forwards ([Moskowitz, Ooi & Pedersen 2012](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)), and the first half-hour return, measured from the prior close, predicts the last half-hour return in SPY with R² ≈ 1.6% ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)).

Two consequences follow for design. First, salient-level effects are a few percentage points above a high base rate, so no level should be traded without a trigger, and every "it held" statistic needs a chance baseline. Second, sample arithmetic: if four roughly independent filters each pass 30% of candidate bars, the joint pass rate is about 0.8%. That is why swing-horizon proposals should run with identical rules across ES, NQ and CL to collect enough instances ([06](06%20How%20the%20dimensions%20interact.md)).

**Grading convention used in this file.** Grades follow the shared legend in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md): A for peer-reviewed support for the mechanism, B for consistent practitioner consensus with partial or indirect support, C for anecdotal or vendor-only, and D for tested and not supported as a standalone signal. Every role is required, so a proposal is only as strong as its weakest required role, and the **grade shown is that weakest role**, with the best-supported role in parentheses. The role-level grades used are:

| Role-level grade | Building blocks |
|---|---|
| A | TSMOM, Gao intraday momentum (on the published samples) |
| B | Swing levels as S/R and swing-break triggers (indirect via Osler and Kavajecz & Odders-White); value-area edges, POC and value migration (practitioner consensus plus the indirect depth evidence) |
| C | LVN behaviour (practitioners use it in two contradictory ways), nPOC and poor-high magnets, Fib depth bands, extensions and clusters inside confluence, AVWAP as a signal, VSA tests adapted to volume bars, and the ICT vocabulary |
| D | Fib as a standalone entry |

## Shared building blocks added for this file

All shared names follow the conventions in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md) and their implementations in [07 Automation architecture](07%20Automation%20architecture.md) §2: SWING(L), STRUCTURE(L) with BOS/CHoCH/SWEEP events and grades G1–G3, LEVELS, PROFILE(P), FIB(A→B), FIB-CLUSTER and ATR(L). The helpers below are reused by name in the proposals. **All values are design proposals**, anchored to ranges in the notes where the notes give one.

| Helper | Definition (pre-committed default) | Basis |
|---|---|---|
| TOL(L) | 0.25 × ATR(L) of the layer that defines the zone. Used as a zone half-width and as the tolerance for two levels to "coincide". | Concept-interplay swing template (±0.25 daily ATR). Sits between Boroden's ≤2 ES points and the 0.5 × ATR(14) of the DiNapoli implementation ([LuxAlgo DiNapoli](https://www.luxalgo.com/library/indicator/dinapoli-levels/)) |
| BUF(L) | max(2 ticks, 0.10 × ATR(L)) beyond the structural extreme that defines a stop. L is the layer that produced the extreme. | Swing notes give max(1–2 ticks, 0.1–0.25 × ATR). The Osler stop-cluster logic says stops belong beyond the obvious level |
| Stop floor | Final stop distance = max(structural stop + BUF, 1.0 × ATR(TRIGGER layer)) | [07](07%20Automation%20architecture.md) §7 |
| IMPULSE(A→B, L) | Confirmed SWING(L) leg with \|B−A\| ≥ 3 × ATR(L), whose end B closed beyond the prior same-type swing (it produced a BOS) | Fib notes (legs ≥ 3 × ATR) |
| SWEEP(level) | A bar trades at least 1 tick beyond a confirmed level. STRUCTURE emits SWEEP_HIGH/LOW. | [02](02%20Multi%20timeframe%20price%20action.md); swing notes |
| RECLAIM(level, k) | After a SWEEP, a bar of the evaluating layer closes back inside the level within k = 3 bars, with no close beyond it in between | Sperandeo's 2B "immediately" ≈ 1–3 bars ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)) |
| ACCEPT(level, side) | Clock version: two consecutive M30 closes beyond the level. Volume version: two consecutive VB-A closes beyond it. REJECT = SWEEP + RECLAIM without ACCEPT. | Two 30-minute periods is the Market Profile convention ([LuxAlgo 80% rule](https://www.luxalgo.com/library/concept/80-percent-rule/)). The VB-A analogue is a design choice and shorter in clock time during RTH |
| VM(Pₜ vs Pₜ₋₁) | HIGHER if VALₜ ≥ VAHₜ₋₁. OVERLAP_UP if VAHₜ > VAHₜ₋₁, VALₜ > VALₜ₋₁ and POCₜ > POCₜ₋₁. Mirror for LOWER and OVERLAP_DOWN. BALANCE otherwise (inside, unchanged, outside, or overlap without POC confirmation). "VM up" = HIGHER or OVERLAP_UP. Developing RTH VM is read only after the IB ends; developing WEEK VM only after the week's second RTH close. | Value migration with POC confirmation ([Bookmap](https://bookmap.com/blog/value-migration-explained-how-markets-shift-from-one-area-of-acceptance-to-another); [LuxAlgo](https://www.luxalgo.com/library/concept/value-migration/)) |
| ZONE-PASSED | If the bar that confirms anchor B closes beyond the far edge of the zone being approached, that zone is void for this leg | Confirmation-lag rule. A k = 2 ZigZag gives back ≥ 2 × ATR before B exists ([01](01%20Swing%20points%20across%20timeframes.md)) |
| ROOM | (T1 − entry) ≥ 1.0 × (entry − stop), otherwise skip. Magnet trades need ≥ 2.0 | Design |
| HVN/LVN detector | Gaussian smoothing with σ = clamp(0.1 × ATR(Lp)/tick, 2, 40) ticks, where Lp = M30 for session and intraday-ANCH profiles and D1 for WEEK, MONTH, COMP and D1-ANCH. HVN prominence ≥ 0.3 × max smoothed row. LVN valley ≤ 0.35 × the smaller adjacent peak. Node zone = width at half relative height. | KDE + prominence convention ([Minh](https://metaminh.medium.com/how-to-analyze-volume-profiles-with-python-3166bb10ff24)); volume-profile notes. For ES, σ ≈ 3 ticks at session scale, inside the notes' 2–4-tick suggestion |
| ROUND(sym) | ES multiples of 50 points; NQ multiples of 100 points; CL whole dollars | Osler's strongest clustering is at "00" levels. The futures analogue is an untested inference |
| MAGNET | An F target from a declared candidate list that lies within TOL(L) of at least one *independent* reference: prior-WEEK POC/VAH/VAL, a WEEK nPOC ≤ 4 weeks old, a COMP(4) HVN, or ROUND. Reference profiles must not be anchored at the F target's own swings. | Concept-interplay inference: an extension landing on a naked POC/HVN is a stronger take-profit candidate. Osler: take-profits reflect at salient levels |
| AVWAP(s) | Volume-weighted average from pivot_time(s), exposed only from confirm_time(s) | Shannon; auto-anchored VWAP lag ([LuxAlgo](https://www.luxalgo.com/library/indicator/yGQMVJ90-auto-anchored-swing-vwaps/)) |
| ATRr | ATR(D1) / median(ATR(D1), last 60 sessions). LOW < 0.75; NORMAL 0.75–1.33; HIGH 1.33–2.0; EXTREME > 2.0 | Design: round, unoptimized cut points |
| ANCH(A→B) timing | Prints from pivot_time(A) to pivot_time(B), computed and frozen at confirm_time(B). Final from then on. Never extended to "now". | Swing anchoring rule ([01](01%20Swing%20points%20across%20timeframes.md)) |

Entry orders use three pre-declared types, all sent with a broker-held bracket. Rithmic `RequestBracketOrder` (330) carries `cancelAfterSecs`, multi-level targets and `stopMarketAtSsboe`. Tradovate `placeOSO` links two brackets as OCO, and its spec requires `isAutomated: true` on non-human orders ([Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json)).

| Entry type | Definition |
|---|---|
| ENTRY-MKT | Marketable limit at last trade ± 2 ticks on the trigger bar close; cancel after 30 s |
| ENTRY-LMT | Resting limit 1 tick in front of the zone's near edge, so it fills before the obvious print; server-side expiry at setup expiry |
| ENTRY-STP | Stop-limit 1 tick beyond the trigger bar extreme, with the limit 2 ticks further; cancel after 3 trigger-layer bars |

Re-quotes happen only at bar close and only with ≥ 2 ticks of hysteresis ([07](07%20Automation%20architecture.md) §4–6).

The default management module (MGMT-DEF) applies unless a proposal states otherwise. Take 50% at T1 and move the stop to entry + 1 tick. The remainder runs to T2 if T2 is defined; otherwise it trails 1 BUF behind each newly confirmed swing on the trigger layer. Time stops are stated per proposal in bars, with a clock cap.

## Volume bars may replace intraday time bars, but never the clock-anchored layers

Every chart stack below is given twice. One version uses time bars (W1, D1, H4, H1, M30, M15, M5, M1). The other uses constant-volume bars: VB-A, VB-B and VB-C, sized at ADV/50, ADV/250 and ADV/1000 of the instrument's 20-session average daily volume, recalibrated weekly, and broken at session start. By construction that is about 50, 250 and 1,000 bars per average Globex day. Averaged over a 23-hour day, the mean durations are about 28, 5.5 and 1.4 minutes. Bars are much shorter in RTH and much longer overnight, because the volume clock runs on "whatever the number of (night-session) hours or (day-session) milliseconds it takes" ([Easley, López de Prado & O'Hara](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)).

When a proposal needs a higher swing degree than VB-A provides, it emulates the degree on the VB-A series with the shared ladder: SWING(VB-A, 2k) and SWING(VB-A, 4k), with k = 2.0. Under diffusive scaling, that roughly matches H2 and H4–H8 degrees, but the correspondence is approximate and must be eyeballed per instrument ([01](01%20Swing%20points%20across%20timeframes.md); [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md)).

| Must stay on clock time in every proposal | Why |
|---|---|
| W1 and D1 bars, and the router's swing inputs | Participants anchor to sessions and weeks. The 1-week cap is a calendar unit ([05](05%20Volume%20bars%20versus%20time%20bars.md)) |
| LEVELS (PDH/PDL/PDC, ONH/ONL, PWH/PWL/PWC, WO/DO, IBH/IBL, ORH/ORL) | Defined in session terms. Never derive them from "the first K volume bars" |
| PROFILE windows RTH, ETH, ON, WEEK, MONTH, COMP(n) | Calendar windows. ANCH(A→B) is event-anchored and may use VB swings |
| Session windows, news blackouts, flat-by times, clock caps on time stops, Gao timing windows | A volume clock cannot be converted to clock time in advance ([Mandelbrot via Easley et al.](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)) |
| A clock guard on every VB trigger: cancel if the trigger bar took more than 15 minutes, or if an armed setup is older than its clock cap | Overnight volume bars can span hours ([05](05%20Volume%20bars%20versus%20time%20bars.md)) |

## Common risk rules apply to every CX proposal before its own rules

The engine-level fences are those in [07 Automation architecture](07%20Automation%20architecture.md) §7. They are repeated here so each proposal can be read on its own.

| Rule | Pre-committed default |
|---|---|
| Risk per trade | 1R = a fixed dollar amount the user sets. Effective risk R_eff = R × router multiplier. `qty = floor(R_eff / (stop_ticks × tick_value))`. **Skip if qty < 1 micro**, never widen. MES $1.25/tick, ES $12.50, MNQ $0.50, NQ $5.00; read CL/MCL from the contract spec at startup |
| Daily and weekly loss | Account: −2R per trade date, then no new entries. Weekly: 2× daily. Broker auto-liquidation set slightly beyond |
| Trade counts | 3 trades per instrument per day across all strategies. 3 consecutive losses stop that strategy for the day. 3 fills of the same setup type without human acknowledgement disable it (FIA §3.2 concept) |
| News blackout | No new entries from T−10 to T+30 minutes around tier-1 releases (FOMC, CPI, NFP; for CL also the weekly EIA inventory report, time to be verified). Intraday CX positions are flattened at T−2 minutes. Swing positions keep broker-held stops |
| Session filters | No entries 16:00–17:00 CT, in the first 15 minutes after the 17:00 CT reopen, or in the 15 minutes before 15:00 CT and 16:00 CT unless a proposal says otherwise. Intraday positions are flat by 15:50 CT. No new swing entries after 12:00 CT Friday |
| Roll and holidays | Proposals that use WEEK, COMP or MONTH profiles take no new entries from roll Monday until those profiles are rebuilt on the new front month, shifted by the logged roll spread. Early-close sessions count as OFF for RTH-profile proposals |
| Bar-close evaluation | Every condition is evaluated on closed bars of its layer, with swings used only after confirm_time. The exception is clock triggers that are explicitly clock-based (CX-15) |
| Developing vs final values | Only final profiles (prior RTH/ON/WEEK/MONTH/COMP, or ANCH frozen at confirm_time(B)) may define a LOCATION. Developing values (dPOC, developing VA, developing VM, day type) may be CONTEXT or SETUP only where a proposal says so, and they are logged with `as_of_seq` |
| Net direction | Accounts net positions per contract. A new entry against an open position on the same instrument family (ES/MES, NQ/MNQ, CL/MCL) is blocked. Lower-horizon entries may only add in the direction of an open higher-horizon position |
| Decision logging | One immutable decision record per state transition, holding every role's inputs, the router state, level provenance (with `dimension` tags), swing pivots with both timestamps, and grid and profile versions ([07](07%20Automation%20architecture.md) §5) |

## Fifteen proposals and a router at a glance

Codes used in the table: S = swing structure and price action, V = volume-at-price (including AVWAP), F = Fibonacci, M = return momentum, T = clock. The "@2k/@4k" suffix marks a ladder-degree swing on the VB-A series. Router states are defined in the CX-00 section.

| ID | Name | Style | CONTEXT | LOCATION | TRIGGER | MANAGEMENT | Stack: time · volume | Regime (router) | Grade | Complexity |
|---|---|---|---|---|---|---|---|---|---|---|
| CX-00 | Regime router | meta | S + V + ATRr + day type (+ optional gamma) | — | — | Family enablement, risk multiplier, exclusions | W1/D1/H4 + RTH profile · same (clock) | all | n/a | Med |
| CX-01 | Leg-value pullback | intraday swing | S: STRUCTURE(H4) | V: POC of ANCH H1 impulse leg | S: M15 CHoCH | S (+ MAGNET) | H4/H1/M15 · VB-A@4k/VB-A/VB-B | TREND_PULLBACK, TREND_IMPULSE; TREND_BALANCE × 0.5 | B | Med |
| CX-02 | Volume-picked Fibonacci pullback | swing | S: STRUCTURE(D1) | F×V: one Fib level of the D1 leg, chosen by ANCH volume | S: H1 CHoCH | S; F/V MAGNET | D1/H4/H1 · D1/VB-A@2k/VB-A | TREND_PULLBACK; TREND_BALANCE × 0.5 | C (context B) | High |
| CX-03 | Weekly-value Fibonacci cluster swing | swing | S: STRUCTURE(W1) | F+V: FIB-CLUSTER ∩ WEEK/COMP value | S: H4 CHoCH | S; MAGNET | W1/D1/H4 · W1/D1/VB-A@2k | TREND_PULLBACK, TREND_BALANCE, CONFLICT (W1 side) | C (context B) | High |
| CX-04 | Momentum-filtered composite value swing | swing | M: TSMOM(W1, 52) | V: COMP(4) POC or VAL | S: H1 CHoCH | S + V | W1/D1/H4/H1 · W1/D1/VB-A@2k/VB-A | any except OFF | B (context A) | Med |
| CX-05 | Accepted break retest | intraday | V: developing RTH VM | S: broken H1 swing level | S: M15 CHoCH | S (+ MAGNET) | H1/M15 + RTH profile · VB-A/VB-B | TREND_IMPULSE | B | Med |
| CX-06 | Balance breakout LVN hold | intraday to 2 days | S: H4 RANGE break | V: breakout-leg LVN | S: M15 CHoCH | V re-acceptance exit; S range projection | H4/H1/M15 · VB-A@2k/VB-A/VB-B | RANGE (breakout) | C (context B) | High |
| CX-07 | Measured-move magnet breakout | intraday | S: STRUCTURE(H4) | S: confirmed H1 swing high B | S: M15 close beyond B | F∩V MAGNET | H4/H1/M15 · VB-A@4k/VB-A/VB-B | TREND_IMPULSE | C (trigger B) | Med |
| CX-08 | Value-edge 2B | intraday / scalp | V: day type ROTATIONAL | V: prior RTH VAH/VAL | S: sweep of a swing beyond the edge, then reclaim | V: POC, then opposite edge | M15/M5 · VB-A/VB-B (slow set: H4/M30 · VB-A@2k/VB-A on WEEK VA) | ROTATIONAL, RANGE, TREND_BALANCE (bias side) | B | Med |
| CX-09 | Spring at composite value low | swing | S: STRUCTURE(D1) = RANGE | V: below range-ANCH VAL | S: spring, test, H1 CHoCH | V: range POC, then range high | D1/H4/H1 · D1/VB-A@2k/VB-A | RANGE | B | High |
| CX-10 | Sweep-shift-retrace | scalp | S: HTF liquidity level | F: 0.618–0.786 of the displacement leg | S: M1/VB-C CHoCH | V: prior RTH POC | LEVELS/M5/M1 · LEVELS/VB-B/VB-C | any with permission | C | High |
| CX-11 | Unfinished-auction liquidity run | intraday | V or S: poor high/low vs EQH/EQL target | S: retest zone of the M15 CHoCH | S: M5 CHoCH | V/S: exits by target type | M15/M5 · VB-A/VB-B | TREND_* or RANGE toward target | C (trigger B) | Med |
| CX-12 | LVN air-pocket scalp | scalp | V: open vs ON and prior value | V: prior RTH LVN near edge | S: VB-C BOS into the LVN | V: next HVN; time stop | M5/M1 · VB-B/VB-C | DIRECTIONAL day | C | Med |
| CX-13 | Day-type-gated Fibonacci cluster | intraday / scalp | V: day type → Boroden type | F: FIB-CLUSTER on M15/H1 legs | none (Type 1) or S: M1 CHoCH (Type 2) | F: 1.272 extension; V cap (Type 2) | H1/M15/M5/M1 · VB-A@2k/VB-A/VB-B/VB-C | RTH, all day types | C | High |
| CX-14 | Anchored-VWAP reclaim at value | swing | V: VM(WEEK) | V: AVWAP from the D1 protected low | S: H1 sweep and reclaim of AVWAP | S (+ MAGNET) | W1/D1/H1 · W1/D1/VB-A | TREND_PULLBACK, TREND_BALANCE | C (trigger B) | Med |
| CX-15 | Late-session momentum at value | intraday (30 min) | M: first-half-hour return | V: side of dPOC at 15:30 ET | T: 15:30 ET | T: 15:59 ET exit; ATR stop | RTH M30/M5 · RTH profile/VB-B | not OFF | C (context A) | Low |


## CX-01 Leg-value pullback

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday swing |
| Typical hold | 1–6 hours; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | TREND_PULLBACK; also TREND_IMPULSE on a fresh H1 leg; TREND_BALANCE at × 0.5 |
| Evidence grade | **B** (best-supported role: location as a support level, indirectly via Osler and Kavajecz & Odders-White) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(H4) = UP (last change at G3) |
| LOCATION | Profile | POC of ANCH(A→B), where A→B is the last confirmed H1 IMPULSE. Zone = POC ± TOL(H1) |
| SETUP | Swing | The H1 pullback from B reaches the zone while A (the H1 protected low) holds |
| TRIGGER | Swing | M15 CHoCH_UP with the pullback low inside the zone |
| MANAGEMENT | Swing (+ optional MAGNET) | Stop below the pullback low; T1 = B; T2 = MAGNET or trail |

Why this is not double counting: structure decides only which prints belong to the leg. The profile then ranks the prices inside it by traded volume, which geometry cannot do. The two share a time window, but the POC is independent of where any geometric rule would put a level, and the trigger is a later event on a lower layer.

**Concept basis.** Anchoring a fixed-range profile from swing low to swing high is the standard practitioner construction ([ForexTester](https://forextester.com/blog/fixed-range-volume-profile/); [FuturesHive](https://www.futureshive.com/blog/volume-profile-trading-strategy-2025)). It is already mechanized in open-source scripts that profile every completed swing leg ([Swing Volume Profile Pro](https://id.tradingview.com/script/7yozLqCv-Swing-Volume-Profile-Pro-WillyAlgoTrader/)). Dale's flagship rule supplies the location logic: find the volume cluster, wait for the pullback, and enter "from the beginning of that volume cluster" ([Trader Dale, Dec 2025](https://trader-dale.blogspot.com/2025/12/my-1-volume-profile-setup-step-by-step.html), snippet-level). The notes read the leg POC as the "fair price of the impulse". The timing logic is the standard multi-timeframe template: higher-timeframe bias plus a lower-timeframe structure shift at a higher-timeframe level ([LuxAlgo MTF alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). The mechanism is the general S/R evidence (depth at levels, bounces above chance). **No out-of-sample test of leg-profile levels in futures exists.** See [01](01%20Swing%20points%20across%20timeframes.md), [03](03%20Volume%20profile%20across%20timeframes.md) and [06](06%20How%20the%20dimensions%20interact.md).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| Router gate | W1, D1 (clock) | W1, D1 (clock) |
| CONTEXT | H4 (ETH) STRUCTURE | STRUCTURE on SWING(VB-A, 4k), emulating H4 |
| LOCATION + SETUP | H1 legs (SWING k = 2) + ANCH(A→B) from tick prints | VB-A legs (SWING k = 2) + ANCH(A→B) from tick prints |
| TRIGGER | M15 | VB-B (5× finer than VB-A) |
| MANAGEMENT | M15 swings for the trail | VB-B swings for the trail |

The ratios are 4×/4× in time and ladder/5× in volume. These stay on clock time: router inputs, trigger windows, the news blackout, the 15:50 CT flat, and the time stop's clock cap.

**Context filter.** STRUCTURE(H4) = UP, last changed at G3, with no open G2 event against it, and the router grants long permission for CX-01. Shorts are the mirror image.

**Location.** At confirm_time(B) of a new confirmed H1 swing high B, check that A→B is an IMPULSE (≥ 3 × ATR(H1), and B closed above the prior H1 swing high). Build ANCH(A→B) at 1-tick rows and set Z = [POC − TOL(H1), POC + TOL(H1)], with ATR(H1) frozen at confirm_time(B). The zone is valid only if B − POC ≥ 1.0 × ATR(H1) and ZONE-PASSED does not void it.

**Setup.** After confirm_time(B), price trades into Z (low ≤ Z_hi) with no H1 close below A and no new high above B. At least one confirmed M15 swing high must exist after pivot_time(B); this is the pullback's lower high.

**Trigger.** The first M15 close above the most recent confirmed M15 swing high after B (CHoCH_UP). The pullback low L_pb, the lowest low since confirm_time(B), must lie in [Z_lo − BUF(H1), Z_hi]. The trigger bar must close 08:35–14:30 CT for ES/NQ, or 08:05–13:00 CT for CL.

**Entry order.** ENTRY-MKT on the trigger bar close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | L_pb − BUF(M15), floored at 1.0 × ATR(M15). Skip if entry − stop > 1.5 × ATR(H1) |
| Size | `qty = floor(R_eff / (stop_ticks × tick_value))`; skip if below 1 micro |
| T1 | B − 1 tick (50%), subject to ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | First MAGNET above B within 2 × ATR(H4), using candidates FIB(A→B) extensions 1.272 and 1.618. If none, trail 1 BUF(M15) behind each new confirmed M15 swing low |
| Time stop | If +0.5R is not reached within 16 M15 bars (4 h), exit at the next M15 close. Flat by 15:50 CT |
| Cancel an armed setup | H1 close < A; H1 close < Z_lo − BUF(H1); high > B (the leg extended; re-anchor on the next leg); 12 H1 bars after confirm_time(B); router withdraws permission |

**Filters.** Trigger windows as above; common news blackout. ATRr must be 0.75–2.0, set via the router: risk ×0.5 when HIGH, off when EXTREME. One attempt per leg (`level_id` = hash(A, B, "POC")). At most 2 CX-01 trades per instrument per day.

**Automation spec.** States: IDLE → ARMED → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED (after T1) → CLOSED. Terminal states: VOID, INVALIDATED, EXPIRED, CANCELLED.

```python
on_close(H1):
  B = new_confirmed(SWING(H1), type=HIGH)
  if B and IMPULSE(A:=B.prev_low, B, H1) and STRUCTURE(H4)==UP and router.allows("CX-01", LONG):
      prof = PROFILE(ANCH(A,B))                      # pivot_time(A)..pivot_time(B), frozen now
      Z = (prof.POC - TOL(H1), prof.POC + TOL(H1))
      if B.price - prof.POC >= 1.0*ATR(H1) and not ZONE_PASSED(Z, B.confirm_bar):
          arm(Setup("CX-01", level_id=h(A,B,"POC"), Z=Z, A=A, B=B))
  for s in setups("CX-01", ARMED|IN_ZONE):
      if close < s.A.price or close < s.Z.lo - BUF(H1): s.to(INVALIDATED)
      elif high > s.B.price:                          s.to(CANCELLED)
      elif bars_since(s.B.confirm_bar, H1) > 12:      s.to(EXPIRED)
      elif low <= s.Z.hi:                             s.to(IN_ZONE)
on_close(M15):
  for s in setups("CX-01", IN_ZONE):
      lh = last_confirmed(SWING(M15), HIGH, after=s.B.pivot_time)
      L_pb = min_low(since=s.B.confirm_time)
      if lh and close > lh.price and s.Z.lo - BUF(H1) <= L_pb <= s.Z.hi and in_window(now):
          stop = min(L_pb - BUF(M15), close - 1.0*ATR(M15))
          if close - stop <= 1.5*ATR(H1) and ROOM(close, s.B.price - tick, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=s.B.price - tick)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Swing detector | DC/ATR-ZigZag k = 2.0, ATR frozen at the extreme | Shared convention |
| Impulse size | ≥ 3 × ATR(H1) with a BOS | Fib notes |
| Zone half-width | TOL(H1) = 0.25 × ATR(H1) | Concept-interplay ±0.25 ATR |
| Room to B | ≥ 1.0 × ATR(H1) | Design: leaves a target |
| Stop buffer | BUF = max(2 ticks, 0.1 × ATR) | Swing notes range |
| Expiry | 12 H1 bars | Design: about half a Globex day |
| Time stop | 16 M15 bars, +0.5R | Design |
| Partial | 50% at T1 | Shared MGMT-DEF |

**Visual review checklist**

1. On H4, check that the confirmed swings carry confirm markers and that STRUCTURE reads UP, with the last BOS visible.
2. On H1, mark A and B with both pivot and confirm times. Check the leg is ≥ 3 × ATR(H1) and that B made a BOS.
3. Draw ANCH from pivot_time(A) to pivot_time(B). It must *not* run to "now". Shade the POC band.
4. Switch to the as-of view at confirm_time(B). The band must already have existed, and the confirming bar must not have closed beyond the band's far edge.
5. On M15, check that the pullback printed a confirmed lower high, that the trigger is a *close* above it, and that the pullback low sits inside the band.
6. Check entry, stop and T1 = B − 1 tick.

Signs of a bot error: a profile that includes pullback prints; an anchor at a provisional ZigZag extreme; a CHoCH on a wick; a zone taken from the developing session POC; an entry after the zone was sliced by an H1 close.

**Failure modes & regime fit.** The proposal suits orderly trends whose pullbacks hold above the leg's protected low. It fails when the H1 pullback is really an H4 reversal. That shows up first as a G2 event, and the router withdraws permission before G3. It also fails on gap or grind legs whose volume sits near B: the room check then skips the leg, which is correct behaviour but makes setups rare in strong momentum. The confirmation lag of k = 2 means a usable POC usually lies more than about 2 × ATR(H1) below B, so the setup is biased toward legs that launched from a base. That matches the notes' "deep zone coincides with value" case. On thin overnight legs the POC can be an artifact of a few large prints, so the trigger window keeps entries in RTH.

**Relations.** CX-02 is the same idea at D1 degree, with Fib depth added. The two can run together on one instrument only in the same direction, under the net-direction rule. CX-05 and CX-07 trade the same H4 trend at a different location (broken level, breakout). The first proposal to arm on an H1 leg owns it. The PA- trend-pullback template in [08](08%20Proposals%20price%20action%20and%20swing.md) is CX-01's single-dimension parent: run it in shadow, not live, on the same instrument and degree. VP- leg-profile proposals in [09](09%20Proposals%20volume%20profile.md) share the location.

## CX-02 Volume-picked Fibonacci pullback

**At a glance**

| Item | Value |
|---|---|
| Style | Swing |
| Typical hold | 1–10 sessions |
| Instruments | ES/MES, NQ/MNQ, CL/MCL (micros expected, because D1 stops are wide) |
| Regime | TREND_PULLBACK at D1; TREND_BALANCE at × 0.5 |
| Evidence grade | **C** (Fib depth inside confluence is C; best-supported role: D1 structure context, B) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(D1) = UP (G3) |
| LOCATION | Fibonacci × Profile | The single FIB(A→B) retracement (0.382/0.5/0.618/0.786) of the last D1 IMPULSE that sits inside an HVN of ANCH(A→B) and has the highest smoothed volume. Fib labels depth; the profile picks the level |
| SETUP | Swing | STRUCTURE(H4) ≠ UP (a pullback is under way) when price reaches the zone |
| TRIGGER | Swing | H1 CHoCH_UP with the pullback low inside the zone |
| MANAGEMENT | Swing + MAGNET | Stop beyond the pullback low or zone edge; T1 = B; T2 = extension MAGNET |

Why this is not double counting: the Fib grid is one GEOMETRY vote. The ANCH profile is a PROFILE vote that shares the leg's time window but measures where volume traded. Their agreement is a two-dimension location, and the notes rank it *less* independent than a calendar profile would be (CX-03 uses one of those). Picking one level per leg also *reduces* multiple comparisons, because you trade one level rather than whichever level happened to hold.

**Concept basis.** This is the pairing where the "independent dimensions" argument is strongest: "A Fib level is theoretical; volume helps verify it" ([LuxAlgo Auto-Anchored Fib VP](https://www.luxalgo.com/library/indicator/z8gaWHWQ-auto-anchored-fibonacci-volume-profile/)). An open-source engine already scores every retracement by volume at price on the same pivot-detected leg ([PhenLabs](https://de.tradingview.com/script/8EJkZCuY-Fibonacci-Volume-Confluence-Engine-PhenLabs/)). Practitioner checklists insist on profiling the *same leg* ([TradingView KPUDW7dp](https://www.tradingview.com/script/KPUDW7dp/)). Fib's own evidence is why it holds only the depth label. It is negative as a standalone rule ([Tsinaslanidis et al.](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495)), and in 40,243 FX corrections about 83% ended between 15% and 61.8% with no peaks at Fib ratios. That makes the grid a usable ruler of normal depth, not a set of magic lines ([Forexop](https://forexop.com/?p=7920)). See [04](04%20Fibonacci%20retracements%20and%20extensions.md), [03](03%20Volume%20profile%20across%20timeframes.md) and [06](06%20How%20the%20dimensions%20interact.md).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT + leg + Fib grid | D1 (clock) | D1 (clock); must stay on clock |
| LOCATION profile | ANCH(A→B) from per-minute profile bars (Rithmic 208/209) | Same |
| SETUP | H4 STRUCTURE | STRUCTURE on SWING(VB-A, 2k) |
| TRIGGER | H1 CHoCH | CHoCH on SWING(VB-A, k) |

These stay on clock time: the D1 leg and grid, session filters, the Friday cutoff, and the session-count time stop.

**Context filter.** STRUCTURE(D1) = UP at G3, with no open G2 event against it, and the router grants long permission (TREND_PULLBACK).

**Location.** At confirm_time(B) of a D1 swing high closing an IMPULSE A→B (≥ 3 × ATR(D1)), compute the candidates p_r = B − r(B − A) for r ∈ {0.382, 0.5, 0.618, 0.786} and the HVN node zones of ANCH(A→B). A candidate is eligible only if it lies inside an HVN node zone. Choose p* as the eligible candidate with the highest smoothed volume, then set Z = HVN node zone ∩ [p* − TOL(D1), p* + TOL(D1)]. These contradiction rules are pre-declared from the notes:

- If the ANCH POC lies above the 0.382 level (volume concentrated near the top of the leg), only 0.382 is eligible, because deeper levels sit in thin territory.
- If no candidate is eligible, the leg is skipped.
- Log the depth class (0.382 strong, 0.5–0.618 normal, 0.786 deep), but do not gate on it.

**Setup.** After confirm_time(B), price trades into Z while STRUCTURE(H4) ∈ {DOWN, TRANSITION}, with no D1 close below A (which kills the grid) and no new high above B.

**Trigger.** H1 CHoCH_UP: the first H1 close above the last confirmed H1 swing high formed after B, with the pullback low inside [Z_lo − BUF(H1), Z_hi].

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket. Swing proposals may enter in ETH outside the common session filters.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | min(pullback low − BUF(H1), Z_lo − BUF(D1)), floored at 1.0 × ATR(H1). Skip if wider than 1.0 × ATR(D1) |
| T1 | B − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | MAGNET from candidates FIB(A→B) 1.272 and 1.618 extensions. If none qualifies, trail 1 BUF(H4) behind each new confirmed H4 swing low |
| Time stop | 10 sessions without T1 → exit at the RTH close |
| Cancel an armed setup | D1 close < A; D1 close < Z_lo − BUF(D1); new high > B; 15 sessions after confirm_time(B); router change |

**Filters.** Common session and news rules apply; no entries after 12:00 CT Friday. Router risk ×0.5 in FOMC weeks and when ATRr is HIGH; off when EXTREME. One attempt per grid version; one CX-02 position per instrument.

**Automation spec.** States: IDLE → ARMED → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: VOID, INVALIDATED, EXPIRED, CANCELLED.

```python
on_close(D1):
  B = new_confirmed(SWING(D1), HIGH); A = B.prev_low if B else None
  if B and IMPULSE(A, B, D1) and STRUCTURE(D1)==UP and router.allows("CX-02", LONG):
      g = FIB(A,B); prof = PROFILE(ANCH(A,B)); nodes = prof.HVN_zones()
      cands = [(r, g.ret(r)) for r in (0.382, 0.5, 0.618, 0.786)]
      if prof.POC > g.ret(0.382): cands = [c for c in cands if c[0] == 0.382]
      elig = [(r, p) for r, p in cands if any(n.lo <= p <= n.hi for n in nodes)]
      if elig:
          r, p = max(elig, key=lambda c: prof.smoothed_at(c[1]))
          n = node_containing(nodes, p)
          Z = (max(n.lo, p - TOL(D1)), min(n.hi, p + TOL(D1)))
          if not ZONE_PASSED(Z, B.confirm_bar):
              arm(Setup("CX-02", level_id=h(g.id, r), Z=Z, A=A, B=B, depth=r))
on_close(H1):
  for s in setups("CX-02", ARMED|IN_ZONE):
      if low <= s.Z.hi and STRUCTURE(H4) in (DOWN, TRANSITION): s.to(IN_ZONE)
      lh = last_confirmed(SWING(H1), HIGH, after=s.B.pivot_time); L_pb = min_low(since=s.B.confirm_time)
      if s.state == IN_ZONE and lh and close > lh.price and s.Z.lo - BUF(H1) <= L_pb <= s.Z.hi:
          stop = min(L_pb - BUF(H1), s.Z.lo - BUF(D1), close - ATR(H1))
          if close - stop <= ATR(D1) and ROOM(close, s.B.price - tick, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=s.B.price - tick)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Retracement set | 0.382, 0.5, 0.618, 0.786 | Shared FIB convention |
| Eligibility | Inside an HVN node zone (shared detector) | The profile selects; LVN levels are rejected (notes) |
| POC-above-0.382 rule | Only 0.382 eligible | Concept-interplay contradiction case (b) |
| Zone | HVN zone ∩ p* ± TOL(D1) | Design |
| Max stop | 1.0 × ATR(D1) | Design: keeps micro sizing feasible |
| Expiry / time stop | 15 / 10 sessions | Design; Dow secondary reactions last weeks |

**Visual review checklist**

1. On D1, check A and B (both timestamps), the leg ≥ 3 × ATR, STRUCTURE UP, and the grid drawn on confirmed anchors only.
2. Overlay ANCH(A→B) with its HVN node zones shaded, and the four Fib lines.
3. Confirm that the chosen level is the eligible one with the most volume. If the POC sits above 0.382, only 0.382 may be chosen.
4. On H4, the pullback structure should be DOWN or TRANSITION when the zone is touched.
5. On H1, check for a confirmed lower high after B and a close above it, with the pullback low inside the zone.

Signs of a bot error: a level in an LVN being chosen; a grid anchored to a still-extending high; a profile recomputed after B; a trade after a D1 close below the zone.

**Failure modes & regime fit.** The proposal needs a D1 trend with ordinary pullbacks. It fails on legs where volume concentrated at the origin, so the eligible level is 0.786 and the "pullback" is really a test of the whole leg; the depth log will show this. Because the profile and the grid share A and B, an anchor error corrupts both at once. That is why the anchor must be the shared swing engine's, never a hand pick. Samples will be small: run ES, NQ and CL with identical rules.

**Relations.** CX-02 is CX-01's 3-dimension, D1-degree sibling. CX-03 uses a multi-anchor cluster with a calendar profile, which is more independent. When both arm in the same direction, CX-03 owns overlapping zones. The FIB- pullback proposals in [10](10%20Proposals%20Fibonacci.md) are the parent; shadow them. The VP- leg-node proposals in [09](09%20Proposals%20volume%20profile.md) share the profile.

## CX-03 Weekly-value Fibonacci cluster swing

**At a glance**

| Item | Value |
|---|---|
| Style | Swing |
| Typical hold | 2–15 sessions |
| Instruments | ES/MES, NQ/MNQ, CL/MCL; run identically across all three to collect samples |
| Regime | TREND_PULLBACK or TREND_BALANCE with weekly bias, or CONFLICT in the W1 direction (a D1 correction against W1) |
| Evidence grade | **C** (cluster location C; best-supported role: weekly structure context, B) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(W1) = UP (G3) |
| LOCATION | Fibonacci + Profile | A FIB-CLUSTER from D1/W1 anchors that lies within TOL(D1) of a non-swing-anchored volume reference: prior WEEK VAL or POC, COMP(4) POC or HVN, or a WEEK/MONTH nPOC ≤ 8 weeks old |
| SETUP | Swing | STRUCTURE(D1) ∈ {DOWN, TRANSITION}: a D1 correction reaches the zone above the W1 protected low |
| TRIGGER | Swing | H4 CHoCH_UP with the pullback low inside the zone |
| MANAGEMENT | Swing + MAGNET | Stop beyond the zone; T1 = the D1 swing high; T2 = MAGNET or the W1 high |

Why this is not double counting: all cluster members together are one GEOMETRY vote, however many lines they contain. The volume reference comes from calendar windows (week, composite), not from the cluster's swing anchors, so it is the most independent location in this file.

**Concept basis.** This is the notes' fully specified swing template almost line for line: daily trend, pullback into a weekly or composite HVN/POC or naked weekly POC within ±0.25 daily ATR, a lower-timeframe structure trigger, and a stop beyond the zone ([06](06%20How%20the%20dimensions%20interact.md)). The cluster is the one Fib construct with a defensible automation rationale. It pools independent anchors, so no single anchor choice decides the zone. Boroden requires at least three Fibonacci price relationships ([TradingMarkets](https://tradingmarkets.com/?p=661586)), and a generic implementation requires levels from ≥ 2 swings within a tolerance that is "a fraction of the recent average range" ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters/)). Dale's confluence of a volume cluster with a **Weekly POC** supplies the profile side ([Trader Dale, Oct 2025](https://trader-dale.blogspot.com/2025/10/trade-of-week-perfect-confluence-volume.html)). Osler's finding that level predictive power lasted at least five business days, and Chung & Bellotti's decay result, argue for weekly refreshing of the volume references.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | W1 (clock) | W1 (clock); must stay |
| Cluster anchors + SETUP | D1 (and the last W1 leg) | D1 (clock); must stay |
| Volume references | WEEK, COMP(4), MONTH nPOCs (clock windows) | Same |
| TRIGGER | H4 CHoCH | CHoCH on SWING(VB-A, 2k) (≈ H2–H4 degree; eyeball it) |
| MANAGEMENT trail | H4 swings | SWING(VB-A, 2k) swings |

**Context filter.** STRUCTURE(W1) = UP at G3. The router grants long permission in TREND_PULLBACK, or in CONFLICT where W1 is the permitted direction.

**Location.** At each D1 close, rebuild FIB-CLUSTER(D1). Contributors are:

- retracements 0.382, 0.5, 0.618 and 0.786 of the last 2 confirmed D1 legs and the last confirmed W1 leg in the bias direction;
- 1.272 and 1.618 extensions of the most recent D1 correction, below its low;
- projections C − 0.618, 1.0 and 1.618 × |prior D1 correction| from the latest D1 swing high (Boroden-style symmetry).

Keep groups of ≥ 3 levels from ≥ 2 distinct anchors within 0.2 × ATR(D1), with width capped at 0.5 × ATR(D1). A cluster qualifies only if a volume reference lies within TOL(D1) of its span. The zone Z is the union span of cluster and reference, capped at 0.5 × ATR(D1).

**Setup.** Price trades into Z while STRUCTURE(D1) ∈ {DOWN, TRANSITION} and price is above the W1 protected low.

**Trigger.** H4 CHoCH_UP (H4 bars aligned to the CME trade date), with the pullback low inside [Z_lo − BUF(H4), Z_hi].

**Entry order.** ENTRY-MKT on the trigger close, any H4 close outside the common session filters, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | min(pullback low − BUF(H4), Z_lo − BUF(D1)), floored at 1.0 × ATR(H4). Skip if wider than 1.5 × ATR(D1) |
| T1 | The D1 swing high the correction started from, − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | MAGNET from extensions 1.272 and 1.618 of the D1 leg ending at that high. Else the last W1 swing high − 1 tick. Trail behind H4 swing lows |
| Time stop | 15 sessions |
| Cancel an armed setup | D1 close below the W1 protected low; D1 close < Z_lo − BUF(D1); a cluster or reference rebuild that no longer qualifies before the touch; 20 sessions; router change |

**Filters.** Common rules apply; no new entries in roll week until WEEK and COMP are rebuilt; FOMC weeks at ×0.5. One attempt per zone per week; one CX-03 position per instrument.

**Automation spec.** States: IDLE → ARMED → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: INVALIDATED, EXPIRED, CANCELLED.

```python
on_close(D1):
  if STRUCTURE(W1) != UP or not router.allows("CX-03", LONG): return
  refs = [PROFILE(WEEK_prev).VAL, PROFILE(WEEK_prev).POC, PROFILE(COMP(4)).POC,
          *PROFILE(COMP(4)).HVN_centers(), *naked_POCs(["WEEK","MONTH"], max_age_weeks=8)]
  for c in FIB_CLUSTER(D1, legs=last_legs(D1,2)+last_legs(W1,1), tol=0.2*ATR(D1), min_n=3, min_anchors=2):
      r = nearest(refs, c.span, within=TOL(D1))
      if r and c.width <= 0.5*ATR(D1):
          Z = cap(union(c.span, r), 0.5*ATR(D1))
          arm_or_refresh(Setup("CX-03", level_id=h(c.members, r.id), Z=Z, wpl=STRUCTURE(W1).protected_low))
on_close(H4):
  for s in setups("CX-03", ARMED|IN_ZONE):
      if close_D1_below(s.wpl) or close_D1_below(s.Z.lo - BUF(D1)): s.to(INVALIDATED); continue
      if low <= s.Z.hi and STRUCTURE(D1) in (DOWN, TRANSITION): s.to(IN_ZONE)
      if s.state == IN_ZONE and event(STRUCTURE(H4)) == "CHoCH_UP" and s.Z.lo - BUF(H4) <= pullback_low() <= s.Z.hi:
          stop = min(pullback_low() - BUF(H4), s.Z.lo - BUF(D1), close - ATR(H4))
          if close - stop <= 1.5*ATR(D1): send(ENTRY_MKT, bracket(stop, T1=last_SH(D1) - tick)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Cluster rule | ≥ 3 levels, ≥ 2 anchors, 0.2 × ATR(D1), width ≤ 0.5 × ATR(D1) | Shared FIB-CLUSTER; Fib notes width cap |
| Volume reference set | Prior WEEK VAL/POC, COMP(4) POC/HVN, nPOC ≤ 8 weeks | Concept-interplay "more independent" list; Dale's weekly POC |
| Coincidence tolerance | TOL(D1) | Shared |
| Max stop | 1.5 × ATR(D1) | Design; micros |
| Time stop / expiry | 15 / 20 sessions | Design |

**Visual review checklist**

1. On W1, check confirmed swings and an UP structure; mark the protected low.
2. On D1, draw every contributing grid with its anchor IDs and highlight the cluster members (≥ 3, from ≥ 2 anchors).
3. Overlay the prior WEEK VA/POC, the COMP(4) profile and the naked POCs. Exactly one reference must lie within TOL of the cluster.
4. In the as-of view at the touch, the cluster and reference must both have existed before the touch.
5. On H4, check for a confirmed lower high and a close above it, with the pullback low in the zone.

Signs of a bot error: five lines from one leg counted as a cluster; a reference profile built across a roll without the spread shift; an nPOC that was actually touched (check the "Chart Bars" intersection rule); a trigger taken after a D1 close below the W1 protected low.

**Failure modes & regime fit.** Trades will be rare per instrument, so run it across instruments. Clusters spanning W1 legs are wide; the width cap discards the widest, and those are exactly the ones a reviewer will want to "keep", so resist that. The design fails when a weekly trend is ending: the W1 protected low breaks at G3 only after a whole week. Around rolls, profile levels from the old contract are offset by the roll spread unless shifted.

**Relations.** CX-03 owns zones that overlap CX-02's in the same direction. CX-04 is the momentum-context alternative at the same horizon; both may hold the same direction but count against the per-instrument risk cap. CX-09 is the RANGE-regime counterpart, and the router never enables both. Its parents are FIB- cluster proposals in [10](10%20Proposals%20Fibonacci.md) and VP- weekly-value proposals in [09](09%20Proposals%20volume%20profile.md).

## CX-04 Momentum-filtered composite value swing

**At a glance**

| Item | Value |
|---|---|
| Style | Multi-day swing |
| Typical hold | 3–15 sessions |
| Instruments | ES/MES, NQ/MNQ, CL/MCL (the published momentum evidence covers equity-index and commodity futures) |
| Regime | Any router state except OFF. Risk ×0.5 when the D1 bias opposes momentum, or in CONFLICT or SUSPENDED |
| Evidence grade | **B** (best-supported role: context, A) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Momentum | TSMOM(W1, 52) = sign(last completed weekly close − weekly close 52 weeks earlier) > 0 |
| LOCATION | Profile | The first COMP(4) value reference below price: the POC if price is above it, otherwise the VAL. Zone = reference ± TOL(D1) |
| SETUP | Swing | STRUCTURE(H4) ∈ {DOWN, TRANSITION} when price enters the zone |
| TRIGGER | Swing | H1 CHoCH_UP with the pullback low inside the zone |
| MANAGEMENT | Swing + Profile | Stop below the pullback low; T1 = the nearer of the D1 swing high and the COMP(4) VAH; trail by H4 swings; exit on a momentum flip |

Why this is not double counting: the context is a return computed from two weekly closes. It uses no swing anchor and no volume. The location is volume-at-price over a calendar window, and the trigger is a later structure event. The three roles use three unrelated inputs.

**Concept basis.** This is the evidence-aligned design the notes recommend: bias from the robust long-horizon trend evidence, location at widely watched levels, and a simple trigger whose main job is to define risk ([02](02%20Multi%20timeframe%20price%20action.md)). Time-series momentum, where a futures contract's own past 12-month return predicts its next return, is robust across 58 futures and forwards and partially reverses beyond a year ([Moskowitz, Ooi & Pedersen](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). AQR's dataset uses a 12-month lookback with a 1-month hold ([AQR](https://www.aqr.com/Insights/Datasets/Time-Series-Momentum-Original-Paper-Data)). Two honest caveats apply: the evidence is for diversified, monthly-rebalanced portfolios, not single-instrument entry timing, and 52 weekly bars only approximate 12 months. Composite value as a location is the profile school's "with the other-timeframe participant" idea ([03](03%20Volume%20profile%20across%20timeframes.md)). It is graded B as a level and was never tested as a momentum-entry location.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | W1 closes (clock) | W1 closes (clock); must stay |
| LOCATION | COMP(4) = the last 4 completed weeks, ETH volume (clock window) | Same |
| SETUP | H4 STRUCTURE | STRUCTURE on SWING(VB-A, 2k) |
| TRIGGER | H1 CHoCH | CHoCH on SWING(VB-A, k) |
| Trail | H4 swings | SWING(VB-A, 2k) swings |

**Context filter.** TSMOM(W1, 52) > 0, read at each W1 close. TSMOM(13) and TSMOM(26) are logged as diagnostics only and never gate. The router must not be OFF.

**Location.** At each W1 close, rebuild COMP(4). At each D1 close, pick the reference: the POC if close > POC, else the VAL if close > VAL, else none (price is below value against the momentum). Set Z = reference ± TOL(D1).

**Setup.** Price enters Z (low ≤ Z_hi) while STRUCTURE(H4) ∈ {DOWN, TRANSITION}.

**Trigger.** H1 CHoCH_UP with the pullback low inside [Z_lo − BUF(H1), Z_hi].

**Entry order.** ENTRY-MKT on the trigger close, ETH allowed outside the session filters, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Pullback low − BUF(H1), floored at 1.0 × ATR(H1). Skip if wider than 1.0 × ATR(D1) |
| T1 | The nearer of (last D1 swing high, COMP(4) VAH) above entry, − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | Trail behind confirmed H4 swing lows; exit everything at the first W1 close where TSMOM(52) ≤ 0 |
| Time stop | 15 sessions |
| Cancel an armed setup | D1 close < Z_lo − BUF(D1); W1 close flips TSMOM; COMP rebuild moves the reference by more than TOL(D1) before the touch (re-arm on the new one); 10 sessions; router OFF |

**Filters.** Common rules apply, plus the roll-week block for COMP. One CX-04 position per instrument and one attempt per reference per week.

**Automation spec.** States: IDLE → ARMED → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: INVALIDATED, EXPIRED, CANCELLED.

```python
on_close(W1):
  ctx = sign(close_W1[-1] - close_W1[-53])              # last completed week vs 52 weeks earlier
  log(diag={"tsmom13": sign(close_W1[-1]-close_W1[-14]), "tsmom26": sign(close_W1[-1]-close_W1[-27])})
  comp = PROFILE(COMP(4))
  if ctx <= 0: cancel_all("CX-04", LONG); exit_positions("CX-04", LONG)
on_close(D1):
  if ctx > 0 and router.state != OFF:
      ref = comp.POC if close > comp.POC else comp.VAL if close > comp.VAL else None
      if ref: arm_or_refresh(Setup("CX-04", level_id=h(comp.id, ref), Z=(ref - TOL(D1), ref + TOL(D1))))
on_close(H1):
  for s in setups("CX-04", ARMED|IN_ZONE):
      if low <= s.Z.hi and STRUCTURE(H4) in (DOWN, TRANSITION): s.to(IN_ZONE)
      if s.state == IN_ZONE and event(STRUCTURE(H1)) == "CHoCH_UP" and s.Z.lo - BUF(H1) <= pullback_low() <= s.Z.hi:
          stop = min(pullback_low() - BUF(H1), close - ATR(H1))
          t1 = min(last_SH(D1), comp.VAH) - tick
          if close - stop <= ATR(D1) and ROOM(close, t1, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=t1), risk=R*router.mult("CX-04")); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Momentum lookback | 52 weekly bars | Closest weekly analogue of the published 12-month lookback |
| Composite | COMP(4), ETH volume, rebuilt at each W1 close | Weekly refresh, per the level-decay evidence |
| Reference choice | POC, else VAL | Design: deterministic "first value below price" |
| Max stop | 1.0 × ATR(D1) | Design |
| Exit on flip | First W1 close with TSMOM ≤ 0 | Consistent with the context role |

**Visual review checklist**

1. On W1, mark the close 52 weeks back and the last close. The sign must be positive at the signal date.
2. Draw the COMP(4) profile frozen at the last W1 close. Its POC and VAL must match the decision record.
3. Check the reference choice against the D1 close at the time.
4. On H4, check that the pullback was DOWN or TRANSITION at the touch.
5. On H1, check for a confirmed lower high and a close above it inside the zone.

Signs of a bot error: TSMOM computed with the developing week; a COMP that includes the current week; an exit not taken after a momentum flip.

**Failure modes & regime fit.** Momentum turns slowly, so the first weeks of a new trend are traded with the old sign. A 52-week signal is late by design, and the published evidence covers the average across many contracts, not the turning points. Composite value can sit far below price in strong trends, so the setup does not appear. That is acceptable, because the alternative is chasing. CL's event risk (inventory and OPEC news) can gap through value.

**Relations.** CX-04 can run alongside CX-03 and CX-02 in the same direction, within the instrument risk cap. If the D1 bias opposes momentum, the router halves CX-04's risk and disables CX-02 longs, so they cannot fight. Its momentum context is the natural "cross-horizon permission" for scalps (see the portfolio view). Its parents are VP- composite-value proposals in [09](09%20Proposals%20volume%20profile.md).

## CX-05 Accepted break retest

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday |
| Typical hold | 1–5 hours; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ (RTH profile 08:30–15:00 CT); CL/MCL with an RTH profile on pit hours (08:00–13:30 CT, to verify) |
| Regime | TREND_IMPULSE |
| Evidence grade | **B** (best-supported role: location at a broken swing level) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile | Developing VM(RTH today vs prior RTH) ∈ {HIGHER, OVERLAP_UP} at the BOS bar close (read after the IB) |
| SETUP | Swing | H1 BOS_UP: a close above the last confirmed H1 swing high L_b, closing after the IB ends |
| LOCATION | Swing | Retest band around the broken level: [L_b − TOL(H1), L_b + TOL(H1)] |
| TRIGGER | Swing | M15 CHoCH_UP after the retest low prints inside the band |
| MANAGEMENT | Swing (+ optional MAGNET) | Stop below the retest low; failed-breakout exit; T1 = breakout extreme |

Why this is not double counting: the BOS is a close beyond a swing. Value migration is a shift in where the session's volume concentrates. Both say "up", but from different data, and only the profile can separate an accepted break from a stop run. The retest location is the swing level itself; the profile is not used as a level here.

**Concept basis.** The notes turn the ambiguous "sweep or breakout?" question into a testable acceptance rule: a break of structure where price *builds volume* outside the old value and value migrates counts as continuation ([06](06%20How%20the%20dimensions%20interact.md)). Value migration compares today's developing or completed value area with yesterday's. A POC that migrates with the value area strengthens the read ([Bookmap](https://bookmap.com/blog/value-migration-explained-how-markets-shift-from-one-area-of-acceptance-to-another); [LuxAlgo](https://www.luxalgo.com/library/concept/value-migration/)). The entry is the breakout-pullback. In Brooks' terms, a pullback of about 1–5 bars after a breakout sets up resumption, and a "failed failure" is a breakout pullback ([Brooks forum: failed breakout](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/)). The mechanism is Osler's: rates "trend strongly after crossing" levels where stops cluster ([Osler SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf)). See [02](02%20Multi%20timeframe%20price%20action.md) and [03](03%20Volume%20profile%20across%20timeframes.md).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| Router gate | W1, D1, H4 (H4 aligned = TREND_IMPULSE) | W1, D1 (clock); H4 or SWING(VB-A, 4k) |
| CONTEXT | Developing RTH profile vs the prior RTH profile (clock windows; IB end) | Same; must stay on clock |
| SETUP + LOCATION | H1 swings and BOS | VB-A swings and BOS |
| TRIGGER | M15 CHoCH | VB-B CHoCH |

**Context filter.** At the BOS bar close, the developing VM(RTH) is HIGHER or OVERLAP_UP versus the prior RTH session. That means POC confirmation is included, and the reading is taken only after the IB ends (09:30 CT for ES/NQ, 09:00 CT for CL). The router must be in TREND_IMPULSE with long permission.

**Location.** L_b is the price of the confirmed H1 swing high taken by the BOS. The band is B_L = [L_b − TOL(H1), L_b + TOL(H1)].

**Setup.** An H1 BOS_UP closes after the IB end with the context true at that close. The setup stays armed while no H1 close falls below L_b − TOL(H1).

**Trigger.** The retest low (lowest low after the BOS) must touch the band (≤ L_b + TOL(H1)). The trigger is then the first M15 close above the last confirmed M15 swing high formed after the BOS, between 09:30 and 14:30 CT.

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Retest low − BUF(M15), floored at 1.0 × ATR(M15). Skip if wider than 1.0 × ATR(H1) |
| T1 | Highest high since the BOS, − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | Trail behind confirmed M15 swing lows. Once the retest low is a confirmed M15 swing (C), the MAGNET candidates C + 1.0 and 1.618 × \|B − A\| (A = the HL that launched the BOS, B = the breakout high) may replace the trail target |
| Failed-breakout exit | An H1 close < L_b − TOL(H1) at any time → exit at market |
| Time stop | 12 M15 bars without +0.5R; flat by 15:50 CT |
| Cancel an armed setup | H1 close < L_b − TOL(H1); developing VM turns BALANCE or down at an M30 close before the trigger; price runs > 2 × ATR(H1) above L_b without a retest; 6 H1 bars after the BOS; router change |

**Filters.** RTH only, from the IB end to 14:30 CT; common news blackout; ATRr not EXTREME. One attempt per broken level.

**Automation spec.** States: IDLE → ARMED → RETESTING → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: INVALIDATED, EXPIRED, CANCELLED.

```python
on_close(H1):
  if event(STRUCTURE(H1)) == "BOS_UP" and now >= IB_END and router.state("CX-05") == TREND_IMPULSE:
      vm = VM(PROFILE(RTH).developing(), PROFILE(RTH_prev))
      if vm in (HIGHER, OVERLAP_UP):
          Lb = STRUCTURE(H1).taken_level
          arm(Setup("CX-05", level_id=h(Lb.id,"retest"), Lb=Lb.price, band=(Lb.price-TOL(H1), Lb.price+TOL(H1))))
  for s in setups("CX-05", ARMED|RETESTING|IN_POSITION):
      if close < s.band.lo: s.exit_or(INVALIDATED)          # failed breakout
on_close(M30):
  for s in setups("CX-05", ARMED|RETESTING):
      if VM(PROFILE(RTH).developing(), PROFILE(RTH_prev)) not in (HIGHER, OVERLAP_UP): s.to(CANCELLED)
on_close(M15):
  for s in setups("CX-05", ARMED|RETESTING):
      if min_low(since=s.armed_at) <= s.band.hi: s.to(RETESTING)
      sh = last_confirmed(SWING(M15), HIGH, after=s.armed_at)
      if s.state == RETESTING and sh and close > sh.price and in_window(now):
          stop = min(min_low(since=s.armed_at) - BUF(M15), close - ATR(M15))
          t1 = max_high(since=s.armed_at) - tick
          if close - stop <= ATR(H1) and ROOM(close, t1, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=t1)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| VM definition | HIGHER or OVERLAP_UP, POC-confirmed | Value-migration sources |
| VM read time | After the IB (first 60 min RTH) | Design: the developing VA is noise before then |
| Retest band | L_b ± TOL(H1) | Shared tolerance |
| Retest window | 6 H1 bars | Brooks' 1–5-bar breakout pullback, rounded up |
| Failed-breakout exit | H1 close below the band | Brooks' failed breakout; design |

**Visual review checklist**

1. On H1, find the confirmed swing high, then the *close* above it after the IB.
2. Overlay the prior RTH VA/POC and the developing RTH VA/POC *as of the BOS bar*. The developing VA must be HIGHER, or overlapping up with the POC above the prior POC.
3. Shade the retest band. Check the retest low entered it with no H1 close below the band.
4. On M15, check the confirmed swing high after the BOS and the close above it.
5. Check entry, stop and T1.

Signs of a bot error: using the *end-of-day* VA (hindsight) instead of the as-of developing value; a BOS on a wick; a retest counted on a bar before the BOS.

**Failure modes & regime fit.** The design fails on trend days that never retest. That is a missed trade, which is acceptable. It also fails on late-session breaks where the developing value is still dominated by morning trade, so the VM test is true for stale reasons. Its weakest point is that the developing VM itself repaints until the close, so it must be logged at the decision time. In balanced weeks the H4 gate keeps it off.

**Relations.** CX-07 trades the *break* of a swing high and CX-05 the *retest* of one. The first to arm on a given level owns it. CX-01 owns pullbacks to a leg's POC instead. CX-05 and CX-06 differ by regime: CX-06 is breakouts from balance, CX-05 continuation in trend. Its parents are the PA- breakout-pullback proposals in [08](08%20Proposals%20price%20action%20and%20swing.md); shadow them.

## CX-06 Balance breakout LVN hold

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday swing |
| Typical hold | 2 hours to 2 sessions (session rules as for swing; broker-held stop overnight) |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | RANGE resolving into a breakout (router RANGE or TREND_BALANCE, breakout watch) |
| Evidence grade | **C** (LVN behaviour C; best-supported role: range-break context, B) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(H4) = RANGE (≥ 4 alternating confirmed swings), then an H4 close above the range high RH |
| SETUP | Swing | Breakout maturity: the next 3 H1 closes all stay above RH |
| LOCATION | Profile | The LVN of the breakout leg's ANCH(A→B) between old value and new value (between RH − TOL(H4) and B − 1 × ATR(H1)) |
| TRIGGER | Swing | M15 CHoCH_UP with the pullback low inside the LVN zone |
| MANAGEMENT | Profile + Swing | Exit on re-acceptance in or below the LVN; T1 = B; T2 = range-height projection |

Why this is not double counting: structure establishes that the balance broke and held. The profile then locates the thin price band the breakout skipped, which is a fact about volume distribution that no swing level encodes. The exit uses acceptance (volume and time building), not a second geometric line.

**Concept basis.** The notes describe the LVN between the old and new value areas as an "air pocket" that should not be re-accepted. If volume builds in it, the breakout has failed ([06](06%20How%20the%20dimensions%20interact.md)). Valentini's Trend Model, known only from a secondary description, trades continuation when the market is out of balance and "searching for new value", marks LVNs on the leg and looks for aggression at the LVN ([TradeZella](https://www.tradezella.com/strategies/auction-market-strategy)). The profile notes warn that LVNs are used both as rejection points (in imbalance) and as zones crossed fast (when broken), and that "regime classification must come first". CX-06 is the rejection use, gated to a fresh imbalance; CX-12 is the fast-crossing use. Brooks' maturity rule supplies the setup: once a breakout has gone 2–3 bars without failing, a later dip more often sets up a breakout pullback. His first target after a range breakout is the range height ([LuxAlgo: Measured Move](https://www.luxalgo.com/library/concept/measured-move/)). There is no test of LVN behaviour in futures.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H4 STRUCTURE (RANGE → break) | STRUCTURE on SWING(VB-A, 2k) |
| SETUP + leg anchors | H1 closes and swings | VB-A closes and swings |
| LOCATION | ANCH(A→B) from tick prints | Same |
| TRIGGER | M15 CHoCH | VB-B CHoCH |
| Re-acceptance exit | ACCEPT on M30 closes (clock) | ACCEPT on VB-A closes |

These stay on clock time: session filters, the news blackout and the Friday cutoff.

**Context filter.** STRUCTURE(H4) has been RANGE, and an H4 bar closes above RH, the highest confirmed H4 swing high of the range. RL is the lowest confirmed swing low of the range. The router must allow the long breakout, which means RANGE or TREND_BALANCE in the breakout direction.

**Location.** A is the last confirmed H1 swing low inside the range before the breakout. B is the first confirmed H1 swing high after the breakout. At confirm_time(B), build ANCH(A→B) and find LVNs with the shared detector; by definition each sits between two HVNs, so a new-value HVN exists above it. Choose the deepest LVN whose zone lies within [RH − TOL(H4), B − 1.0 × ATR(H1)]. The zone Z is the LVN node zone. Apply ZONE-PASSED.

**Setup.** The three H1 closes after the H4 breakout close all stay above RH. This is checked before B even confirms; if it fails, the setup is cancelled as a failed breakout.

**Trigger.** M15 CHoCH_UP after confirm_time(B), with the pullback low inside [Z_lo − BUF(M15), Z_hi].

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Pullback low − BUF(M15), floored at 1.0 × ATR(M15). Skip if wider than 1.0 × ATR(H1) |
| Re-acceptance exit | ACCEPT below Z_lo (two consecutive M30 closes) → exit at market, even if the stop has not been hit |
| T1 | B − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | RH + (RH − RL) − 1 tick (range-height projection) |
| Time stop | 2 sessions |
| Cancel an armed setup | An H1 close < RH − TOL(H4) (failed breakout); ACCEPT inside the LVN zone before the trigger; 8 H1 bars after confirm_time(B); router change |

**Filters.** Common rules apply; ATRr not EXTREME. One attempt per range breakout.

**Automation spec.** States: IDLE → BREAKOUT_WATCH → MATURE → ARMED → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: FAILED_BREAKOUT, VOID, EXPIRED, CANCELLED.

```python
on_close(H4):
  if STRUCTURE(H4).was_range and close > STRUCTURE(H4).range_high and router.allows("CX-06", LONG):
      RH, RL = STRUCTURE(H4).range_high, STRUCTURE(H4).range_low
      s = arm(Setup("CX-06", level_id=h(RH,"brk"), RH=RH, RL=RL)); s.to(BREAKOUT_WATCH)
on_close(H1):
  for s in setups("CX-06", BREAKOUT_WATCH):
      if close < s.RH: s.to(FAILED_BREAKOUT)
      elif h1_closes_since(s.armed_at) >= 3: s.to(MATURE)
  B = new_confirmed(SWING(H1), HIGH)
  for s in setups("CX-06", MATURE):
      if B and B.pivot_time > s.armed_at:
          A = last_confirmed(SWING(H1), LOW, before=s.armed_at)
          prof = PROFILE(ANCH(A,B))
          lv = deepest([z for z in prof.LVN_zones() if z.lo >= s.RH - TOL(H4) and z.hi <= B.price - ATR(H1)])
          if lv and not ZONE_PASSED(lv, B.confirm_bar): s.update(Z=lv, B=B); s.to(ARMED)
          else: s.to(VOID)
  for s in setups("CX-06", ARMED|IN_ZONE|IN_POSITION):
      if close < s.RH - TOL(H4): s.exit_or(CANCELLED)
on_close(M30):
  for s in setups("CX-06", ARMED|IN_ZONE|IN_POSITION):
      if ACCEPT(level=s.Z.lo, side=BELOW): s.exit_or(CANCELLED)       # re-acceptance = failed
on_close(M15):
  for s in setups("CX-06", ARMED|IN_ZONE):
      if low <= s.Z.hi: s.to(IN_ZONE)
      if s.state == IN_ZONE and event(STRUCTURE(M15)) == "CHoCH_UP" and s.Z.lo - BUF(M15) <= pullback_low() <= s.Z.hi:
          stop = min(pullback_low() - BUF(M15), close - ATR(M15))
          if close - stop <= ATR(H1) and ROOM(close, s.B.price - tick, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=s.B.price - tick, T2=s.RH + (s.RH - s.RL) - tick)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Range definition | STRUCTURE(H4) RANGE after 4 swings | Shared STRUCTURE ([07](07%20Automation%20architecture.md) §2.5) |
| Maturity | 3 H1 closes above RH | Brooks' 2–3 bars without failure |
| LVN search band | RH − TOL(H4) to B − 1 × ATR(H1) | Design: between old and new value |
| Re-acceptance | ACCEPT below the LVN | Notes' "re-acceptance = failed breakout" |
| T2 | Range height | Brooks' first range-breakout target |

**Visual review checklist**

1. On H4, mark the range swings (≥ 4), RH and RL, and the breakout *close*.
2. On H1, check the three closes above RH, then A (inside the range) and B (confirmed after the break).
3. Draw ANCH(A→B). It should show old value low, a thin valley, and a new peak above. Shade the chosen LVN.
4. In the as-of view at confirm_time(B), check that the LVN existed and the confirming bar did not close below it.
5. On M15, check the CHoCH close with the pullback low inside the LVN.
6. On M30, there must be no two consecutive closes below the LVN before entry.

Signs of a bot error: an LVN taken from a session profile rather than the leg; a "range" with only 2–3 swings; acceptance counted on overlapping bars.

**Failure modes & regime fit.** This is the classic look-above-and-fail risk: balance breakouts often return to value. The maturity setup and the re-acceptance exit exist to cut those quickly. Two-sided ranges with a wide, flat profile produce no clear LVN, so no trade. A breakout leg that is one long bar produces an LVN that is just a fast candle; that is expected and still valid under the rule.

**Relations.** CX-06 conflicts with CX-12 at the same LVN (hold vs traverse). The level-ownership rule gives the LVN to whichever armed first, and the router normally separates them by day type. It conflicts with CX-08 and CX-09 at the range edge (fade vs breakout), and the router decides by acceptance. Its parents are the VP- balance-breakout and look-above-and-fail proposals in [09](09%20Proposals%20volume%20profile.md).

## CX-07 Measured-move magnet breakout

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday |
| Typical hold | 30 min–5 h; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | TREND_IMPULSE |
| Evidence grade | **C** (magnet target C; best-supported role: break trigger at a swing level, B) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(H4) = UP (impulse phase per the router) |
| LOCATION | Swing | Confirmed, untaken H1 swing high B of an A→B→C structure (A low, B high, C a confirmed higher low) |
| SETUP | Fibonacci ∩ Profile | A MAGNET exists above B: the projection C + 1.0 or 1.618 × \|B − A\| within TOL(H1) of an independent reference, with ≥ 2R of room |
| TRIGGER | Swing | M15 close above B |
| MANAGEMENT | Fibonacci ∩ Profile | ⅔ off at the magnet − 1 tick; ⅓ runner for a stop cascade through it; failed-breakout exit |

Why this is not double counting: here the confluence sits at the *target*, not the entry. The projection is GEOMETRY from A, B and C. The reference is PROFILE or a round number drawn from windows unrelated to those anchors. Entry and stop are pure structure.

**Concept basis.** Osler's order data gives the two halves of this trade. Stop-loss orders just beyond a level "propagate trends" when hit ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)), which is the reason to buy the break of B. Take-profit orders cluster *at* salient prices and act as "partially reflecting barriers" ([Osler SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf)), which is the reason to exit at a magnet. The projection is DiNapoli's OP and XOP (C + 1.0 and 1.618 × the thrust; [LuxAlgo DiNapoli](https://www.luxalgo.com/library/indicator/dinapoli-levels/)) and Brooks' Leg 1 = Leg 2. The notes infer that an extension landing near a naked POC, VAH or composite HVN is a stronger magnet than either alone ([06](06%20How%20the%20dimensions%20interact.md)). An honest caveat: Glattfelder et al. find that a directional change of size θ is followed on average by an overshoot of the same size, and that this result "is also found by computing the probable path of the price within a binomial tree". A measured move is therefore a *reference distance*, not a forecast ([Glattfelder, Dupuis & Olsen](https://arxiv.org/pdf/0809.1040)).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | H4 STRUCTURE | STRUCTURE on SWING(VB-A, 4k) |
| LOCATION (A, B, C) | H1 swings | VB-A swings |
| SETUP references | Prior WEEK POC/VAH/VAL, WEEK nPOCs, COMP(4) HVN, ROUND (clock windows) | Same |
| TRIGGER | M15 close | VB-B close |

**Context filter.** STRUCTURE(H4) = UP, and the router is in TREND_IMPULSE with long permission.

**Location.** B is an untaken confirmed H1 swing high. A is the confirmed H1 swing low before B, and C is the confirmed H1 swing low after B, with C > A.

**Setup.** At confirm_time(C), compute the candidates P1 = C + 1.0 × (B − A) and P2 = C + 1.618 × (B − A). Take the first candidate within TOL(H1) of an independent reference as the MAGNET M. The setup is armed only if M exists.

**Trigger.** An M15 close above B, between 08:35 and 14:30 CT (CL 08:05–13:00), while B is untaken. At the trigger, ROOM to M − 1 tick must be ≥ 2.0.

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket and two target legs (Rithmic `targetQuantity[]`/`targetTicks[]`).

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Last confirmed M15 swing low − BUF(M15), floored at 1.0 × ATR(M15). Skip if wider than 1.0 × ATR(H1) |
| T1 | ⅔ of the position at M − 1 tick. Then stop to entry + 1 tick |
| Runner | ⅓. Once price trades at M, trail the stop at M − 0.25 × ATR(H1), then 1 BUF(M15) behind new M15 swing lows. This captures a cascade if M sits on stops |
| Failed-breakout exit | M15 close < B − BUF(M15) before T1 → exit at market |
| Time stop | 8 M15 bars without +0.5R |
| Cancel an armed setup | H1 close < C; a magnet rebuild invalidates M (reference touched or rolled); 12 H1 bars after confirm_time(C); router change |

**Filters.** Common rules apply; no entry when the trigger bar's range is > 2 × ATR(M15), because that is a news or spike bar where the stop sits too far away. One attempt per B.

**Automation spec.** States: IDLE → ARMED (magnet found) → ORDER_PENDING → IN_POSITION → MANAGED → RUNNER → CLOSED. Terminal states: INVALIDATED, EXPIRED, CANCELLED.

```python
REFS = lambda: indep_refs(["WEEK_prev.POC","WEEK_prev.VAH","WEEK_prev.VAL"], naked_POCs("WEEK", 4),
                          PROFILE(COMP(4)).HVN_centers(), ROUND(sym))
on_close(H1):
  C = new_confirmed(SWING(H1), LOW)
  if C and STRUCTURE(H4) == UP and router.state("CX-07") == TREND_IMPULSE:
      B = last_confirmed(SWING(H1), HIGH, before=C.pivot_time); A = B.prev_low
      if C.price > A.price and not B.taken:
          for P in (C.price + 1.0*(B.price-A.price), C.price + 1.618*(B.price-A.price)):
              if (r := nearest(REFS(), P, within=TOL(H1))):
                  arm(Setup("CX-07", level_id=h(B.id,"brk"), B=B, C=C, M=P, ref=r)); break
on_close(M15):
  for s in setups("CX-07", ARMED):
      if close > s.B.price and in_window(now) and range_ <= 2*ATR(M15):
          stop = min(last_confirmed(SWING(M15), LOW).price - BUF(M15), close - ATR(M15))
          if close - stop <= ATR(H1) and ROOM(close, s.M - tick, stop) >= 2.0:
              send(ENTRY_MKT, bracket(stop, targets=[(2/3, s.M - tick)], runner=1/3)); s.to(ORDER_PENDING)
  for s in setups("CX-07", IN_POSITION):
      if close < s.B.price - BUF(M15): s.exit("failed_breakout")
```

| Parameter | Default | Reason |
|---|---|---|
| Projection set | C + 1.0 and 1.618 × \|B − A\| | DiNapoli OP/XOP; shared FIB projection convention |
| Reference set | WEEK POC/VAH/VAL, WEEK nPOC ≤ 4 wk, COMP(4) HVN, ROUND | MAGNET helper; independence |
| Room | ≥ 2R to the magnet | Design: the target must justify a breakout entry |
| ⅔ / ⅓ split | Take-profits reflect at the level; stops beyond can cascade | Osler SR125/SR150 |
| Spike filter | Trigger bar range ≤ 2 × ATR(M15) | Design |

**Visual review checklist**

1. On H1, label A, B and C with both timestamps; B must be untaken.
2. Draw the P1 and P2 projections from C, overlay the reference levels, and check that one lies within TOL of a projection.
3. On M15, find the *close* above B and confirm ROOM ≥ 2R to M at that close.
4. Check the ⅔ target at M − 1 tick and the runner logic after M trades.

Signs of a bot error: a projection taken from an unconfirmed C; a reference that is the swing's own ANCH POC (not independent); a trigger after B was already taken earlier.

**Failure modes & regime fit.** Breakouts fail often in balance, which is why the router allows CX-07 only in TREND_IMPULSE, and the failed-breakout exit is the main loss-limiter. Magnets more than 2R away in quiet markets are rarely reached in a session, and the time stop handles them. When a magnet is a ROUND number, Osler's data argue both for the take-profit cluster at the level and for stops just beyond it, which is exactly the ⅔/⅓ split.

**Relations.** CX-07 shares broken-level ownership with CX-05: one trades the break, the other the retest. It uses the MAGNET module that CX-01, CX-02, CX-03 and CX-14 use for T2. It conflicts with CX-08 at the same swing high (break vs sweep fade), and the router decides by regime. Its parents are the PA- breakout and measured-move proposals in [08](08%20Proposals%20price%20action%20and%20swing.md) and the FIB- extension-target proposals in [10](10%20Proposals%20Fibonacci.md).

## CX-08 Value-edge 2B

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday / scalp (fast set); intraday swing (slow set) |
| Typical hold | 10 min–3 h fast, flat by 14:55 CT (ES/NQ) or 13:25 CT (CL); 2 h–2 sessions slow |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | Day type ROTATIONAL; router RANGE (both sides), TREND_BALANCE (bias side only) or TREND_PULLBACK (bias-side edge only) |
| Evidence grade | **B** (best-supported role: the sweep beyond a swing level, Osler's mechanism) |
| Automation complexity | Med |

**Role map (fast set)**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile | Day type = ROTATIONAL (open inside prior value, or open-auction/ORR at open + 30), with no ACCEPT outside prior value on the faded side today |
| LOCATION | Profile | Prior RTH VAH (shorts) or VAL (longs) |
| SETUP | Swing | SWEEP of a liquidity level Lq at or beyond the edge: an untaken confirmed SWING(M15) high, ONH or PDH lying within [VAH − TOL(M15), VAH + 1.0 × ATR(M15)] |
| TRIGGER | Swing | RECLAIM: within 3 M5 bars of the sweep, an M5 close back below VAH (inside value), with no ACCEPT above |
| MANAGEMENT | Profile | Stop above the sweep extreme; T1 = prior POC; T2 = the opposite edge, only if still ROTATIONAL |

Why this is not double counting: the value edge is volume-derived and marks where the auction ran out of opposite-side trade. The swing high is price-path-derived and marks where stops sit. The reclaim is a later event in time. Location and setup come from different dimensions, and the target comes back to the profile.

**Concept basis.** The notes call a sweep beyond a swing extreme that is also beyond a VA edge, followed by a fast return inside value, "the cleanest 'structure + profile' reversal": stops fire and find no acceptance ([06](06%20How%20the%20dimensions%20interact.md)). This is Sperandeo's 2B at a profile edge, a price that "penetrate[s] the previous high, but fail[s] to carry through" ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)). It is also Dalton's look-above-and-fail, the mirror of the 80% rule ([03](03%20Volume%20profile%20across%20timeframes.md)). An inside-value open "implies overnight agreement and favors rotation" ([LuxAlgo Open Types](https://www.luxalgo.com/library/concept/open-types/)), and rotational days favour fading VA edges ([LuxAlgo Day-type](https://www.luxalgo.com/library/concept/day-type-taxonomy/)). The prior POC is T1 rather than the far edge because the only ES test of the 80% rule found full fills on about 39–40% of triggers ([teamlbr](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). Stops beyond obvious levels are Osler's mechanism. Bulkowski's equity data show bearish structure reversals succeeding less often than bullish ones (43% vs 73%; [ThePatternSite](https://www.thepatternsite.com/123tc.html)), so the router allows entries against the W1 trend only in RANGE, and only at half risk (CX-00, rule ME-9).

**Chart stack**

| Layer (role) | Fast set: time | Fast set: volume | Slow set: time | Slow set: volume |
|---|---|---|---|---|
| CONTEXT | Day type (clock: open + 30, IB) | Same (clock) | Router RANGE or TREND_BALANCE | Same |
| LOCATION | Prior RTH VA (clock) | Same | Prior WEEK VA (clock) | Same |
| Liquidity swings | SWING(M15), ONH, PDH | SWING(VB-A), ONH, PDH | SWING(H4), PWH | SWING(VB-A, 2k), PWH |
| SETUP + TRIGGER | M5 sweep and reclaim (k = 3) | VB-B sweep and reclaim (k = 3) | M30 (k = 3) | VB-A (k = 3) |
| MANAGEMENT | M5 | VB-B | M30 | VB-A |

The slow set is a separate `strategy_version` with its own sample. Its T1 is the prior WEEK POC and its time stop is 12 M30 bars.

**Context filter.** At open + 30 min the router's day type is ROTATIONAL and stays so (no switch to DIRECTIONAL). No ACCEPT above the prior VAH has occurred today; for longs, none below the VAL. The router permits the direction.

**Location.** Prior RTH VAH or VAL, computed with the shared 70% single-row expansion (final values).

**Setup.** Lq is the nearest untaken level in {confirmed SWING(M15) highs, ONH, PDH} within [VAH − TOL(M15), VAH + 1.0 × ATR(M15)]. The setup event is SWEEP(Lq) at RTH time ≥ open + 30 min.

**Trigger.** RECLAIM: within 3 M5 bars of the sweep bar, an M5 bar closes below VAH, with no ACCEPT above VAH in between. **Cross-proposal veto:** skip the short if an unrepaired prior-RTH poor high lies within 0.5 × ATR(H1) above the entry and was not taken by the sweep. That is the notes' contradiction case (c): profile logic expects it to be revisited.

**Entry order.** ENTRY-MKT on the reclaim close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Sweep extreme + BUF(M5), floored at 1.0 × ATR(M5). Skip if wider than 1.0 × ATR(M30) |
| T1 | Prior RTH POC + 1 tick (shorts) (50%), with ROOM ≥ 1.0. Then stop to entry − 1 tick |
| T2 | Prior VAL + 1 tick, only if the day type is still ROTATIONAL when T1 fills; otherwise trail 1 BUF(M5) beyond new M5 swing highs |
| Time stop | 12 M5 bars without +0.5R; flat by 14:55 CT (ES/NQ) or 13:25 CT (CL) |
| Cancel an armed setup | ACCEPT above VAH; no reclaim within 3 M5 bars; day type switches to DIRECTIONAL; router change |

**Filters.** Setups only from open + 30 to 14:15 CT (ES/NQ) or 12:45 CT (CL); common news blackout; ATRr not EXTREME. One attempt per edge per session; at most 2 CX-08 trades per instrument per day.

**Automation spec.** States: IDLE → WATCH (edge active) → SWEPT → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: ACCEPTED (cancel), EXPIRED, VETOED, CANCELLED.

```python
on_session_open(RTH): va = PROFILE(RTH_prev); edges = [("SHORT", va.VAH), ("LONG", va.VAL)]
on_close(M5):
  if router.daytype() != ROTATIONAL or now < OPEN_PLUS_30: return
  for side, edge in edges:
      if not router.allows("CX-08", side) or accepted_today(edge, side): continue
      Lq = nearest_untaken([*SWING(M15).highs(), ON.high, PD.high] if side=="SHORT" else [...lows],
                           band=(edge - TOL(M15), edge + ATR(M15)) if side=="SHORT" else (edge - ATR(M15), edge + TOL(M15)))
      s = get_or_arm(Setup("CX-08", level_id=h(va.id, side), edge=edge, Lq=Lq)) if Lq else None
      if s and s.state == WATCH and SWEEP(Lq, side): s.to(SWEPT); s.sweep_bar = bar_index
      if s and s.state == SWEPT:
          if ACCEPT(edge, side_beyond(side)): s.to(ACCEPTED)
          elif bar_index - s.sweep_bar > 3: s.to(EXPIRED)
          elif closes_inside(edge, side):
              if side == "SHORT" and unrepaired_poor_high(RTH_prev, within=(close, close + 0.5*ATR(H1))): s.to(VETOED); continue
              stop = extreme_since(s.sweep_bar) + BUF(M5) * sgn(side); stop = farther(stop, close, ATR(M5))
              t1 = va.POC + tick*sgn(side)
              if abs(close - stop) <= ATR(M30) and ROOM(close, t1, stop) >= 1.0:
                  send(ENTRY_MKT, bracket(stop, T1=t1)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| VA method | 70%, single-row expansion from the POC (Sierra-style) | Shared convention ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)) |
| Liquidity band | Edge − TOL to edge + 1 × ATR(M15) | Design: stops "beyond the edge" |
| Reclaim window | 3 bars | Sperandeo "immediately" |
| T1 | Prior POC | 80% rule test: full fills about 39–40% |
| Start time | Open + 30 min | Day type needs the open classification |

**Visual review checklist**

1. Draw the prior RTH profile: VAH, VAL and POC.
2. Mark the open location tier and the open type at +30 min. They must read ROTATIONAL.
3. Mark Lq (a confirmed swing with its confirm marker, or ONH/PDH) beyond VAH.
4. On M5, find the bar that traded ≥ 1 tick above Lq, then a *close* back below VAH within 3 bars.
5. Check there were no two consecutive M30 closes above VAH before the reclaim.
6. Check that no unrepaired poor high sits just above.
7. Check entry, stop above the sweep high, and T1 at the POC.

Signs of a bot error: using today's developing VA as the edge; an unconfirmed swing as Lq; a reclaim on a wick; a short taken after acceptance.

**Failure modes & regime fit.** The design fails on days that start rotational and turn directional after the IB. The day-type switch cancels armed setups, but an open position needs its stop. It also fails when the sweep is the first leg of initiative buying: the vendor test the notes cite claims swept levels more often *continued*, which is unverified ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)). The mitigations are the ACCEPT cancel and the 3-bar window. It works best in balanced weeks (overlapping WEEK value).

**Relations.** CX-08 is the intraday sibling of CX-09 (spring at composite value). It conflicts with CX-06 and CX-07 at the same edge or swing (fade vs break), and the router and level ownership resolve it. It is vetoed beneath CX-11 poor-high targets. Its single-dimension parents are VP- look-above-and-fail and 80%-rule proposals in [09](09%20Proposals%20volume%20profile.md) and PA- 2B proposals in [08](08%20Proposals%20price%20action%20and%20swing.md); shadow both.

## CX-09 Spring at composite value low

**At a glance**

| Item | Value |
|---|---|
| Style | Swing |
| Typical hold | 1–10 sessions |
| Instruments | ES/MES, NQ/MNQ, CL/MCL. The mirror (an upthrust at composite VAH) is a separate `strategy_version` |
| Regime | RANGE at D1 (router RANGE; also CONFLICT in the W1 direction) |
| Evidence grade | **B** (best-supported role: the spring as a failed break of an obvious low, via Osler's stop clustering) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing | STRUCTURE(D1) = RANGE. Range low RL = lowest confirmed D1 swing low; range high RH = highest confirmed D1 swing high |
| LOCATION | Profile | Price is below the VAL of the range profile ANCH(R0→Rn), valid only if VAL − RL ≤ 1.0 × ATR(D1) |
| SETUP | Swing | Spring: SWEEP(RL) and RECLAIM on H4 within 3 H4 bars; the spring low SL* is recorded |
| TRIGGER | Swing | Test and sign of strength: a confirmed H1 swing low T > SL* after the reclaim, then an H1 close above the H1 swing high between the spring and T |
| MANAGEMENT | Profile | Stop below SL*; T1 = range POC; T2 = RH |

Why this is not double counting: the range low is a price-path extreme where stops cluster. The VAL is the edge of the range's accepted volume. They sit at different prices and answer different questions ("where are the stops?" and "is price below value?"). The test and the sign of strength are later structure events.

**Concept basis.** In Wyckoff's spring, price undercuts the range low, then makes a lower-volume test that holds above the spring low; a close back below the spring low cancels it ([LuxAlgo Spring](https://www.luxalgo.com/library/concept/spring/); [TradingWyckoff](https://tradingwyckoff.com/en/spring-shakeout/)). A spring is a 2B-style failed break of a *range* boundary, and "only a test until price closes back inside the range" ([01](01%20Swing%20points%20across%20timeframes.md)). The profile side is Dalton's look-below-and-fail applied to a multi-day balance ([03](03%20Volume%20profile%20across%20timeframes.md)). The microstructure reason is Osler's: stop-loss sells cluster just below obvious levels ([Osler SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). VSA defines a valid test bar as quieter than the prior two bars, with a narrow spread; "A test with high volume isn't a test" ([LuxAlgo VSA test bar](https://www.luxalgo.com/library/concept/vsa-test-bar/)). On constant-volume bars, raw volume is constant by construction, so quietness must be redefined as longer bar duration or less range per bar. That adaptation is the notes' inference, not a sourced method, so here it is **logged as an attribute, not used as a gate**. The quoted 72–75% spring win rates are unsourced marketing.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | D1 STRUCTURE (clock) | D1 (clock); must stay |
| LOCATION | ANCH(R0→Rn) from per-minute profile bars | Same |
| SETUP (spring) | H4 sweep and reclaim | SWING(VB-A, 2k) layer sweep and reclaim on VB-A closes |
| TRIGGER (test + strength) | H1 swings and close | VB-A swings and close |
| VSA attribute | M5 bar range (logged) | VB-A duration and range vs session medians (logged) |

**Context filter.** STRUCTURE(D1) = RANGE (≥ 4 alternating confirmed swings with no close beyond RH or RL), and the router permits longs (RANGE, or CONFLICT with W1 UP).

**Location.** R0 is the first confirmed D1 swing of the range and Rn the last confirmed D1 swing before the spring. Build ANCH(R0→Rn) with its VAL and POC (final). It is valid only if 0 ≤ VAL − RL ≤ 1.0 × ATR(D1). The condition is satisfied when price trades below the VAL.

**Setup.** SWEEP(RL) (an H4 low ≤ RL − 1 tick), then RECLAIM: an H4 close above RL within 3 H4 bars. SL* is the lowest low of the sweep.

**Trigger.** After the reclaim, take R1 as the confirmed H1 swing high whose pivot follows the spring. A confirmed H1 swing low T must follow R1, with T > SL*. That is the test. The trigger is the first H1 close above R1. At the trigger, log the VSA attribute: the median duration of the VB-A bars during the test leg ÷ the session median VB-A duration, and the median range ÷ the session median.

**Entry order.** ENTRY-MKT on the trigger close (ETH allowed outside the session filters), with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | SL* − BUF(H4), floored at 1.0 × ATR(H1). Skip if wider than 1.5 × ATR(D1) |
| T1 | Range ANCH POC − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | RH − 1 tick; trail behind confirmed H4 swing lows after T1 |
| Time stop | 10 sessions |
| Cancel an armed setup | H4 close < SL* (spring cancelled); no reclaim within 3 H4 bars; T ≤ SL*; 15 H1 bars after the reclaim without the trigger; D1 close > RH (range resolved upward: hand over to CX-06); router change |

**Filters.** Common rules apply, including the roll-week block (the range profile spans weeks); FOMC weeks at ×0.5. One spring attempt per range low.

**Automation spec.** States: IDLE → WATCH (range valid) → SPRUNG → RECLAIMED → TESTED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: CANCELLED_SPRING, EXPIRED, INVALID_RANGE.

```python
on_close(D1):
  if STRUCTURE(D1) == RANGE and router.allows("CX-09", LONG):
      R = STRUCTURE(D1).range; prof = PROFILE(ANCH(R.first_swing, R.last_swing))
      if 0 <= prof.VAL - R.low <= ATR(D1): get_or_arm(Setup("CX-09", level_id=h(R.id,"spring"), RL=R.low, RH=R.high, prof=prof))
on_close(H4):
  for s in setups("CX-09", WATCH|SPRUNG):
      if s.state == WATCH and low <= s.RL - tick and low < s.prof.VAL: s.to(SPRUNG); s.SL = low; s.n = 0
      elif s.state == SPRUNG:
          s.SL = min(s.SL, low); s.n += 1
          if close > s.RL: s.to(RECLAIMED); s.t_reclaim = now
          elif s.n > 3: s.to(EXPIRED)
  for s in setups("CX-09", RECLAIMED|TESTED):
      if close < s.SL: s.to(CANCELLED_SPRING)
on_close(H1):
  for s in setups("CX-09", RECLAIMED|TESTED):
      R1 = last_confirmed(SWING(H1), HIGH, after=s.t_spring); T = last_confirmed(SWING(H1), LOW, after=R1.pivot_time if R1 else None)
      if R1 and T and T.price > s.SL: s.to(TESTED)
      if s.state == TESTED and close > R1.price:
          log_attr(vsa=quietness(VB_A, leg=(R1.pivot_time, T.pivot_time)))
          stop = min(s.SL - BUF(H4), close - ATR(H1))
          if close - stop <= 1.5*ATR(D1) and ROOM(close, s.prof.POC - tick, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=s.prof.POC - tick, T2=s.RH - tick)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Range | STRUCTURE(D1) RANGE after 4 swings | Shared STRUCTURE |
| Value-near-low validity | VAL − RL ≤ 1.0 × ATR(D1) | Design: a D-shaped balance, not a lopsided one |
| Reclaim window | 3 H4 bars | Shared RECLAIM; Wyckoff "quickly reverses" |
| Test | A confirmed H1 HL above SL* | Wyckoff spring → test |
| VSA quietness | Logged only | Inference; no source for volume-bar VSA |

**Visual review checklist**

1. On D1, mark the range swings (≥ 4), RL and RH, and draw ANCH from the first to the last range swing with its VAL and POC.
2. Check that VAL − RL ≤ 1 ATR(D1).
3. On H4, find the sweep below RL (≥ 1 tick, below VAL) and a *close* back above RL within 3 bars.
4. On H1, check R1 (the reaction high) and T (the test, confirmed, above the spring low), then the close above R1.
5. Look at the VB-A bars during the test. Did they slow down? Note it; do not decide on it.
6. Check the stop below the spring low and T1 at the range POC.

Signs of a bot error: a range profile extended into the spring itself; a test that undercut the spring low; a trigger before the test low confirmed.

**Failure modes & regime fit.** A "spring" that is really the start of a breakdown fails, and the H4 close below SL* cancels it or the stop takes it. Ranges whose value sits mid-range far above RL are excluded by design. Equity-index downside breaks can be fast (stop cascades), so gap risk overnight is real; it is managed with micros and the broker-held stop.

**Relations.** CX-09 is the swing-horizon sibling of CX-08. It conflicts with CX-06 at the range edge, and the router gives the edge to CX-06 only after acceptance outside. The router never enables CX-09 together with CX-03 (trend vs range). Its parents are the PA- 2B/spring proposals in [08](08%20Proposals%20price%20action%20and%20swing.md) and VP- look-below-and-fail proposals in [09](09%20Proposals%20volume%20profile.md).

## CX-10 Sweep-shift-retrace

**At a glance**

| Item | Value |
|---|---|
| Style | Scalp |
| Typical hold | 5–45 min; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | Any intraday router state that permits the reversal direction; best at HTF edges in RANGE, CONFLICT or ROTATIONAL days |
| Evidence grade | **C** (the ICT sequence has no published evidence; best-supported role: the sweep at a widely watched level, B) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Swing / reference levels | The swept level belongs to LIQ = {PDH, PDL, ONH, ONL, PWH, PWL, untaken confirmed SWING(H1) extremes} |
| SETUP | Swing | SWEEP of a LIQ level on M5, then within 10 M5 bars an M5 CHoCH in the reversal direction whose displacement leg X→Y is an IMPULSE (≥ 3 × ATR(M5)) |
| LOCATION | Fibonacci | Retracement band FIB(X→Y) 0.618–0.786 |
| TRIGGER | Swing | M1 CHoCH back in the reversal direction, with the retrace extreme inside the band |
| MANAGEMENT | Profile | Stop beyond the sweep extreme X; T1 = Y; T2 = prior RTH POC if it lies beyond Y |

Why this is not double counting: the Fib band is drawn on the very swings that define the structure shift, so it is a *depth ruler*, not a second vote. That is stated plainly: this proposal has two independent dimensions (structure and reference levels for entry, profile only for the target) plus a ruler.

**Concept basis.** The ICT/OTE textbook sequence is a liquidity sweep, then a market-structure shift with displacement, then a retracement into 0.62–0.79. "The band, not any single ratio, is the OTE zone" and "price is under no obligation to reach it or to hold there", and the source cites no statistics ([LuxAlgo OTE](https://www.luxalgo.com/library/concept/optimal-trade-entry/)). A vendor reports that Crossref finds no journal article testing ICT concepts, and that its own (unverified) tests found swept levels predicted *continuation* more often than reversal ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)). The notes keep the testable core in neutral words: a sweep of a swing extreme, a reclaim, a BOS, then a pullback into 61.8–78.6% of the reclaim leg ([06](06%20How%20the%20dimensions%20interact.md)). The mechanism that makes it plausible is Osler's stop cascade, which is significant "for hours" and is therefore scalp-scale. The 0.62/0.705/0.79 numbers add nothing over 0.618/0.786 ([04](04%20Fibonacci%20retracements%20and%20extensions.md)), and order blocks and fair value gaps are omitted as unevidenced parameters.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | LEVELS (clock) + SWING(H1) | LEVELS (clock) + SWING(VB-A) |
| SETUP + LOCATION leg | M5 | VB-B |
| TRIGGER | M1 | VB-C (15-minute clock guard) |
| MANAGEMENT target | Prior RTH POC (clock window) | Same |

**Context filter.** The level swept is in LIQ and untaken before the sweep. The router permits the reversal direction, and on DIRECTIONAL days only sweeps *against* the day's direction that would trade *with* it are allowed. That is, buy a sweep of a low on a DIRECTIONAL_UP day.

**Location.** At confirm_time(Y), the band is [FIB(X→Y).ret(0.786), FIB(X→Y).ret(0.618)] (the order depends on direction). Apply ZONE-PASSED: if the bar that confirms Y closes beyond 0.786, the band is void.

**Setup.** SWEEP(level) on M5, followed within 10 M5 bars by an M5 close beyond the last confirmed M5 swing in the reversal direction (CHoCH). The leg from the sweep extreme X to the next confirmed M5 swing Y must be an IMPULSE.

**Trigger.** The first M1 close beyond the last confirmed M1 swing against the retrace (M1 CHoCH in the trade direction), with the retrace extreme inside [band ± BUF(M5)], within 30 M1 bars of confirm_time(Y).

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | X ∓ BUF(M5), floored at 1.0 × ATR(M1). Skip if wider than 1.0 × ATR(M15) |
| T1 | Y ∓ 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry ± 1 tick |
| T2 | Prior RTH POC ∓ 1 tick if it lies beyond Y in the trade direction; otherwise exit everything at T1 |
| Time stop | 20 M1 bars without +0.5R |
| Cancel an armed setup | Any M5 close beyond X; no CHoCH within 10 M5 bars of the sweep; band void; 30 M1 bars after confirm_time(Y); router change |

**Filters.** RTH 08:35–14:30 CT (ES/NQ) or 08:05–13:00 CT (CL); also ETH 02:00–08:00 CT for ONH/ONL sweeps only if the user opts in as a separate version. Common news blackout. One attempt per LIQ level per session.

**Automation spec.** States: IDLE → SWEPT → SHIFTED → BAND_ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: VOID, EXPIRED, CANCELLED.

```python
on_close(M5):
  for lvl in LIQ(untaken=True):
      if SWEEP(lvl) and router.allows("CX-10", reversal_side(lvl)): arm(Setup("CX-10", level_id=h(lvl.id), lvl=lvl, X=extreme_now())).to(SWEPT)
  for s in setups("CX-10", SWEPT|SHIFTED):
      s.X = more_extreme(s.X, bar)                       # sweep extreme keeps updating until the shift
      if beyond(close, s.X): s.to(CANCELLED)
      elif s.state == SWEPT and event(STRUCTURE(M5)) == choch(reversal_side(s.lvl)): s.to(SHIFTED)
      elif s.state == SWEPT and bars_since(s.armed_at, M5) > 10: s.to(EXPIRED)
      Y = new_confirmed(SWING(M5), opposite_type(s.X))
      if s.state == SHIFTED and Y and IMPULSE(s.X, Y, M5):
          band = (FIB(s.X, Y).ret(0.618), FIB(s.X, Y).ret(0.786))
          if ZONE_PASSED(band, Y.confirm_bar): s.to(VOID)
          else: s.update(Y=Y, band=band); s.to(BAND_ARMED)
on_close(M1):
  for s in setups("CX-10", BAND_ARMED):
      if bars_since(s.Y.confirm_bar, M1) > 30: s.to(EXPIRED); continue
      if event(STRUCTURE(M1)) == choch(trade_side(s)) and inside(retrace_extreme(s), s.band, pad=BUF(M5)):
          stop = farther(s.X - BUF(M5)*sgn(trade_side(s)), close, ATR(M1))
          t1 = s.Y.price - tick*sgn(trade_side(s)); poc = PROFILE(RTH_prev).POC
          if abs(close - stop) <= ATR(M15) and ROOM(close, t1, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=t1, T2=poc if beyond(poc, s.Y.price, trade_side(s)) else None)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| LIQ set | PDH/PDL, ONH/ONL, PWH/PWL, untaken H1 swings | The most-watched levels ([02](02%20Multi%20timeframe%20price%20action.md)) |
| Shift window | 10 M5 bars | Design |
| Displacement | IMPULSE ≥ 3 × ATR(M5) | Fib notes' impulse size |
| Band | 0.618–0.786 | Classical equivalents of OTE 0.62–0.79 |
| Trigger window | 30 M1 bars | Design |

**Visual review checklist**

1. Mark the LIQ level (PDH/ONH etc., or an H1 swing with its confirm marker).
2. On M5, find the sweep bar, then the CHoCH *close* within 10 bars.
3. Mark X and Y (Y confirmed). The leg must be ≥ 3 × ATR(M5).
4. Draw the 0.618–0.786 band from confirmed anchors. The confirming bar must not have closed beyond 0.786.
5. On M1, find the CHoCH close back in the trade direction with the retrace extreme in the band.
6. Check the stop beyond X, T1 at Y, and T2 at the prior POC if it lies beyond Y.

Signs of a bot error: a band drawn to a provisional Y; X not updated through the sweep; trading a sweep in the direction of a DIRECTIONAL day's initiative (a fade against it).

**Failure modes & regime fit.** On trend days, sweeps lead to continuation; the vendor claim above and the router's day-type gate are the reasons for the directional restriction. Displacement legs during news are excluded by the blackout. Many setups never retrace to 0.618; that is a missed trade, not a loss. It is the most parameter-dense proposal here, so forward samples must be large before any judgement.

**Relations.** CX-10 overlaps CX-08 when the swept level sits beyond a value edge. CX-08 owns the edge, and CX-10 may trade only LIQ levels not inside TOL(M15) of an active CX-08 edge. It conflicts with CX-07 and CX-05 at swing highs. Its parents are PA- sweep/2B proposals in [08](08%20Proposals%20price%20action%20and%20swing.md) and FIB- OTE-style proposals in [10](10%20Proposals%20Fibonacci.md).

## CX-11 Unfinished-auction liquidity run

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday |
| Typical hold | 20 min–4 h; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | Any TREND_* state or RANGE in which the router permits the direction toward the target |
| Evidence grade | **C** (target magnets C; best-supported role: structure trigger, B) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile **or** Swing, by target type | A qualifying target T* lies ahead, between 1.0 × ATR(M15) and 1.0 × ATR(D1) away. Type **P** = prior-RTH poor high/low (profile: unfinished auction). Type **E** = equal highs/lows (price action: resting stops). Type **PE** = both within TOL(M15) |
| SETUP | Swing | STRUCTURE(M15) CHoCH or BOS toward T*; P_L = the protected swing that launched it |
| LOCATION | Swing | Retest zone between the broken M15 swing and P_L |
| TRIGGER | Swing | M5 CHoCH toward T* with the pullback extreme inside the zone |
| MANAGEMENT | Profile / Swing | Exits differ by type. **P**: one exit 1 tick *through* the poor extreme (the repair). **E/PE**: half 1 tick *before* the level, half 0.5 × ATR(M15) *beyond* it |

Why this is not double counting: a poor high and an equal high are "different definitions that sometimes coincide". The proposal keeps them as separate types and logs each, so the forward sample can show whether profile-defined and price-action-defined targets behave differently. The entry itself is structure only.

**Concept basis.** A poor high is a session extreme printed by two or more TPOs with no single-print tail, read as an "unfinished auction" that "tends to be revisited". The same source warns "do not rename a double top as a poor high because the highs match" ([TheRightTrader](https://therighttrader.com/learn/volume-and-order-flow/poor-highs-and-lows)), and Sierra Chart defines it algorithmically as an extreme equalled within N increments ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). Context changes the read: "a poor high far above value is a different trip than a poor high sitting on the value-area high of a balanced day" ([NexusFi](https://nexusfi.com/a/market-structure/single-prints-poor-highs-poor-lows-market-profile)). That location is logged as an attribute. Equal highs and lows are flagged by SMC tools as liquidity ([LuxAlgo SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)). The type-specific exits are Osler's asymmetry applied directly: take-profits sit *at* salient levels and reflect, while stops sit *just beyond* and accelerate ([Osler SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf)). A poor high carries no stop-cluster claim, only a revisit claim, so its exit requires the repair print.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT (P) | Prior RTH TPO/volume profile, M30 periods (clock) | Same; must stay on clock |
| CONTEXT (E) | SWING(M15) EQH/EQL | SWING(VB-A) EQH/EQL |
| SETUP + LOCATION | M15 STRUCTURE | VB-A STRUCTURE |
| TRIGGER | M5 CHoCH | VB-B CHoCH |

**Context filter.** T* is the nearest qualifying target in the trade direction. P: the prior-RTH high (or low) touched in ≥ 2 M30 periods within 1 tick, not traded through by ≥ 1 tick since. E: two confirmed untaken SWING(M15) highs within 0.15 × ATR(M15), separated by a confirmed swing low. PE: P and E within TOL(M15). The distance from price must be within [1.0 × ATR(M15), 1.0 × ATR(D1)]. The router must permit the direction.

**Location.** After the setup event, the zone is [P_L, broken level] for longs: between the protected M15 low and the broken M15 swing high.

**Setup.** The latest STRUCTURE(M15) event is CHoCH_UP or BOS_UP toward T* (mirror for shorts).

**Trigger.** An M5 CHoCH_UP whose pullback low lies inside the zone and above P_L + BUF(M15), between 08:35 and 14:30 CT (CL 08:05–13:00).

**Entry order.** ENTRY-MKT on the trigger close. The bracket carries the type-specific targets.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Pullback low − BUF(M5), floored at 1.0 × ATR(M5). Skip if wider than 1.0 × ATR(M15) |
| Exits, type P | 100% limit at T* + 1 tick: it fills only if the auction is repaired. ROOM ≥ 1.5 |
| Exits, type E/PE | 50% at T* − 1 tick, then stop to entry + 1 tick; 50% at T* + 0.5 × ATR(M15). ROOM to T* − 1 tick ≥ 1.5 |
| Time stop | 16 M5 bars without +0.5R |
| Cancel an armed setup | M15 close below P_L; T* traded through before entry; 8 M15 bars after the setup; router change |

**Filters.** Common rules apply; ATRr not EXTREME. One attempt per target per session; at most 2 CX-11 trades per instrument per day.

**Automation spec.** States: IDLE → TARGETED → ARMED → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: TARGET_TAKEN, INVALIDATED, EXPIRED, CANCELLED.

```python
def targets(side):
    P = [poor_extreme(PROFILE(RTH_prev), side, min_periods=2, ticks=1)] if unrepaired(...) else []
    E = equal_extremes(SWING(M15), side, tol=0.15*ATR(M15), untaken=True)
    return merge_types(P, E, tol=TOL(M15))           # each item tagged "P", "E" or "PE"
on_close(M15):
  for side in (LONG, SHORT):
      T = nearest_ahead(targets(side), lo=ATR(M15), hi=ATR(D1))
      if T and event(STRUCTURE(M15)) in toward(side) and router.allows("CX-11", side):
          PL = STRUCTURE(M15).protected(side)
          arm(Setup("CX-11", level_id=h(T.id), T=T, type=T.type, zone=(PL.price, STRUCTURE(M15).taken_level.price), PL=PL))
  for s in setups("CX-11", ARMED):
      if beyond(close, s.PL.price, against=s.side) or traded_through(s.T): s.to(INVALIDATED)
on_close(M5):
  for s in setups("CX-11", ARMED):
      if event(STRUCTURE(M5)) == choch(s.side) and inside(pullback_extreme(), s.zone) and in_window(now):
          stop = farther(pullback_extreme() - BUF(M5)*sgn(s.side), close, ATR(M5))
          if s.type == "P": tg = [(1.0, s.T.price + tick*sgn(s.side))]
          else:             tg = [(0.5, s.T.price - tick*sgn(s.side)), (0.5, s.T.price + 0.5*ATR(M15)*sgn(s.side))]
          if abs(close - stop) <= ATR(M15) and ROOM(close, tg[0][1], stop) >= 1.5:
              send(ENTRY_MKT, bracket(stop, targets=tg)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Poor extreme | ≥ 2 M30 periods within 1 tick | Sierra Chart definition (Price Increments 0–1) |
| Equal highs/lows | 0.15 × ATR(M15) | Shared convention |
| Target distance | 1 × ATR(M15) to 1 × ATR(D1) | Design: far enough to pay, near enough to be reached today |
| Type E split | 1 tick before; 0.5 × ATR(M15) beyond | Osler's take-profit vs stop asymmetry; the distance is design |
| Type P exit | 1 tick through | A repair requires a trade-through |

**Visual review checklist**

1. On the prior RTH TPO or volume profile, verify the poor extreme (≥ 2 periods at the high, no tail) and that it was untouched since. For E targets, verify both swings are confirmed and within 0.15 × ATR.
2. Read the target type label (P, E or PE) and check it.
3. On M15, find the CHoCH or BOS toward the target and mark P_L.
4. On M5, find the CHoCH with the pullback inside the retest zone.
5. Check the exits match the type.

Signs of a bot error: a double top labelled P; a poor high that had already been repaired; a P-type exit placed before the level.

**Failure modes & regime fit.** Targets that are far from value with no structure behind them stall. Logging inside vs outside value at the signal lets the user see this. Type E targets often trigger a cascade and then a reversal; the 50% runner is sized for that. Poor highs repaired overnight in ETH: decide whether ETH trades count as repair (here they **do**, Chart-Bars method) and keep that fixed.

**Relations.** CX-11 vetoes CX-08 shorts beneath an unrepaired poor high, and CX-08 longs above an unrepaired poor low. It uses the same Osler asymmetry as CX-07's runner. Its parents are VP- poor-high repair proposals in [09](09%20Proposals%20volume%20profile.md) and PA- liquidity proposals in [08](08%20Proposals%20price%20action%20and%20swing.md).

## CX-12 LVN air-pocket scalp

**At a glance**

| Item | Value |
|---|---|
| Style | Scalp |
| Typical hold | 1–20 min |
| Instruments | ES/MES, NQ/MNQ (RTH); CL/MCL (pit hours) |
| Regime | Day type DIRECTIONAL in the trade direction (router), with swing permission in that direction |
| Evidence grade | **C** (the LVN "crossed fast" claim is practitioner-only and contested; best-supported role: structure setup, B) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile | Initiative open: the RTH open is above both the prior RTH VAH and the ON VAH (mirror for shorts), with no ACCEPT back below the prior VAH since |
| SETUP | Swing | STRUCTURE(VB-B) = UP (last event BOS_UP or state UP) |
| LOCATION | Profile | The near (lower) edge of an LVN of the final prior PROFILE(RTH) lying above price within 1.0 × ATR(VB-A), with an HVN or POC on its far side |
| TRIGGER | Swing | VB-C BOS_UP whose close lies in the first half of the LVN |
| MANAGEMENT | Profile + clock | Target = near edge of the far-side HVN − 1 tick; time stop of 8 VB-C bars or 10 minutes |

Why this is not double counting: context and location are both volume-at-price, but from different windows (the overnight and prior-day value relationship vs the prior session's thin zone) and for different jobs (permission vs where). The trigger is a fresh structure event on the fastest layer, and the time stop tests the location's own claim.

**Concept basis.** LVNs are described as "areas of rejection where price moved through quickly" ([TradersAgency](https://tradersagency.com/blog/volume-profile-analysis); [LuxAlgo FRVP](https://www.luxalgo.com/library/indicator/4r2CZGol-fixed-range-volume-profile/)), and practitioners also use them as targets. The profile notes give the microstructure reading: an LVN records past high price impact, but whether *future* impact is also high there "is an assumption" ([03](03%20Volume%20profile%20across%20timeframes.md)). CX-12 makes that assumption falsifiable. If the thin zone really is crossed fast, the trade reaches the far HVN within a few volume bars; if not, the time stop exits. An open outside range "plus a drive is the strongest continuation read" in open-type teaching ([LuxAlgo Open Types](https://www.luxalgo.com/library/concept/open-types/)), which supplies the directional permission from the overnight and prior-day value relationship. Volume bars suit this scalp. Each bar holds the same participation, so bar range is a price-impact proxy, and a fast, wide sequence is "impact plus urgency" ([05](05%20Volume%20bars%20versus%20time%20bars.md); [Galen Woods](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version (native) |
|---|---|---|
| CONTEXT | ON profile (17:00–08:30 CT) and prior RTH profile (clock windows) | Same; must stay on clock |
| LOCATION | Prior RTH profile LVNs (final) | Same |
| SETUP | M5 STRUCTURE | VB-B STRUCTURE |
| TRIGGER | M1 BOS | VB-C BOS (15-min clock guard) |
| Time stop | 8 M1 bars | 8 VB-C bars and 10-minute clock cap |

**Context filter.** RTH open > max(prior RTH VAH, ON VAH). No ACCEPT below the prior VAH since the open. The router's day type at open + 30 is DIRECTIONAL_UP (or UNDETERMINED leaning up before then is *not* enough), and the swing regime permits longs.

**Location.** From the prior RTH profile, LVN zones with the shared detector. Choose the nearest LVN whose lower edge lvn_lo is above price by ≤ 1.0 × ATR(VB-A). The far-side node H_far is the HVN or POC zone directly above it, and its near edge must be ≥ 2 × (expected stop distance) above lvn_lo.

**Setup.** STRUCTURE(VB-B) = UP.

**Trigger.** VB-C BOS_UP with the close in (lvn_lo, lvn_lo + 0.5 × (lvn_hi − lvn_lo)]. Not later: a close deep in the LVN means the move is already underway.

**Entry order.** ENTRY-MKT on the trigger close, with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | min(lvn_lo − BUF(VB-B), last confirmed VB-C swing low − BUF(VB-C)), floored at 1.0 × ATR(VB-C). Skip if wider than 1.0 × ATR(VB-A) |
| Target | 100% at H_far near edge − 1 tick (ROOM ≥ 1.5) |
| Time stop | If +0.5R is not reached within 8 VB-C bars *or* 10 minutes, exit at market: the "crossed fast" premise failed |
| Cancel an armed setup | STRUCTURE(VB-B) leaves UP; price trades above the LVN's midpoint before the trigger (missed); ACCEPT below the prior VAH; router change |

**Filters.** From open + 30 to 14:30 CT (ES/NQ) or 13:00 CT (CL); common news blackout; ATRr NORMAL or HIGH (off when LOW or EXTREME, because thin zones in quiet markets are not traversed with urgency; this is a design choice). One attempt per LVN per session; at most 2 CX-12 trades per instrument per day.

**Automation spec.** States: IDLE → PERMITTED → ARMED → ORDER_PENDING → IN_POSITION → CLOSED. Terminal states: MISSED, CANCELLED, TIME_EXIT.

```python
on_time(OPEN_PLUS_30):
  ctx_up = open_px > max(PROFILE(RTH_prev).VAH, PROFILE(ON).VAH) and not ACCEPT(PROFILE(RTH_prev).VAH, BELOW)
  permitted = ctx_up and router.daytype() == DIRECTIONAL_UP and router.allows("CX-12", LONG)
on_close(VB_B):
  if permitted and STRUCTURE(VB_B) == UP and router.atr_class() in (NORMAL, HIGH):
      for lv in PROFILE(RTH_prev).LVN_zones():
          if 0 < lv.lo - close <= ATR(VB_A) and (hf := node_above(PROFILE(RTH_prev), lv)):
              get_or_arm(Setup("CX-12", level_id=h(lv.id), lv=lv, far=hf))
on_close(VB_C):
  for s in setups("CX-12", ARMED):
      if high > (s.lv.lo + s.lv.hi)/2 and s.state == ARMED and not event(STRUCTURE(VB_C)) == "BOS_UP": s.to(MISSED); continue
      if event(STRUCTURE(VB_C)) == "BOS_UP" and s.lv.lo < close <= s.lv.lo + 0.5*(s.lv.hi - s.lv.lo) and bar.duration <= 15*60:
          stop = min(s.lv.lo - BUF(VB_B), last_confirmed(SWING(VB_C), LOW).price - BUF(VB_C), close - ATR(VB_C))
          tgt = s.far.lo - tick
          if close - stop <= ATR(VB_A) and ROOM(close, tgt, stop) >= 1.5:
              send(ENTRY_MKT, bracket(stop, T1=tgt)); s.to(ORDER_PENDING); s.t_entry = now; s.n = 0
  for s in setups("CX-12", IN_POSITION):
      s.n += 1
      if not reached(s, 0.5) and (s.n >= 8 or now - s.t_entry >= 600): s.exit("time_stop")
```

| Parameter | Default | Reason |
|---|---|---|
| Context | Open above both prior and ON VAH | Open-location tiers ([LuxAlgo](https://www.luxalgo.com/library/concept/open-types/)); ON profile kept separate |
| LVN source | Prior RTH final profile | Final values only for LOCATION |
| Entry depth | First half of the LVN | Design |
| Time stop | 8 VB-C bars / 10 min | Design: tests the "crossed fast" premise; clock guard ([05](05%20Volume%20bars%20versus%20time%20bars.md)) |
| ATR class | NORMAL or HIGH | Design |

**Visual review checklist**

1. Overlay the ON profile and the prior RTH profile, and mark the RTH open above both VAHs.
2. Check the day type at open + 30 reads DIRECTIONAL_UP.
3. Shade the LVN (valley ≤ 0.35 × the smaller adjacent peak) and the far HVN.
4. On VB-B, check structure is UP. On VB-C, check the BOS close inside the lower half of the LVN.
5. Check the target at the far HVN edge, and whether the exit was by target or time stop.

Signs of a bot error: an LVN taken from today's developing profile; a trigger close above the LVN midpoint; a time stop not enforced on the clock cap.

**Failure modes & regime fit.** LVNs from the prior day are not guaranteed to be thin today, since liquidity is non-stationary ([03](03%20Volume%20profile%20across%20timeframes.md)). The time stop is the defence. The design fails on initiative opens that immediately rotate back (ORR). The day-type gate at open + 30 and the ACCEPT cancel cover most of those. Slippage on VB-C entries in fast markets is the main live-versus-sim gap, so measure it in Stage 2.

**Relations.** CX-12 is the opposite LVN use from CX-06, and level ownership prevents both on one LVN. CX-12 and CX-13 Type 1 are the DIRECTIONAL-day scalps. CX-08 is the ROTATIONAL-day scalp, and the router never runs CX-12 and CX-08 on the same day. Its parents are VP- LVN proposals in [09](09%20Proposals%20volume%20profile.md).

## CX-13 Day-type-gated Fibonacci cluster

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday / scalp |
| Typical hold | 10 min–2 h; flat by 15:50 CT |
| Instruments | ES/MES, NQ/MNQ (Boroden's tolerances are ES/NQ-scale); CL/MCL on pit hours |
| Regime | RTH after the IB ends. The day type decides the mode; UNDETERMINED = off |
| Evidence grade | **C** (Fib cluster C; best-supported role: day-type context, B) |
| Automation complexity | High |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile | Router day type. DIRECTIONAL_X permits Type 1 and Type 2 trades in direction X. ROTATIONAL permits Type 2 only, both sides |
| LOCATION | Fibonacci | FIB-CLUSTER(M15): ≥ 3 levels from ≥ 2 anchors within 0.2 × ATR(M15), width ≤ 0.5 × ATR(M15) |
| SETUP | Swing | Boroden type. **Type 1** if STRUCTURE(M15) points in the trade direction (the cluster is a pullback in the immediate trend); **Type 2** if not |
| TRIGGER | — / Swing | Type 1: none (resting limit at the cluster, Boroden's rule). Type 2: M1 CHoCH in the trade direction after price enters the cluster |
| MANAGEMENT | Fibonacci (+ Profile cap for Type 2) | Stop a few ticks beyond the cluster extreme; breakeven at +1R; T1 = 1.272 extension of the swing into the cluster. Type 2's T1 is capped at the prior RTH POC if that is nearer |

Why this is not double counting: every cluster member is one GEOMETRY vote, however many lines it contains. The day type comes from volume and time at price over the session, and its only job is to decide whether the cluster may be bought blind or needs a structure trigger. Type 1 deliberately runs on two roles (context and location). That is Boroden's own rule, and its cost is adverse selection on limit fills.

**Concept basis.** Boroden defines a cluster as "at least three Fibonacci price relationships" within about 2 ES or 3–4 NQ points. Her Type 1 trades go *with* the immediate trend (judged on 2- or 5-minute charts) and "do not require a trigger". Type 2 trades take a higher-timeframe cluster *against* the immediate trend and require one ("Trigger means take action"), for example a violation of a prior swing. Her stop goes "just a few ticks above the EXTREME of the price cluster zone", moves to breakeven "ASAP", and the first objective is the 1.272 extension ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)). **Boroden explicitly does not use volume**, so the hybrid here is a design proposal. Dalton's day-type and open-type taxonomy decides when "with the immediate trend" deserves a blind limit: on trend days "the trade is with the extension" ([therighttrader: Trend Day](https://therighttrader.com/learn/trading-strategies/trend-day)), while rotational days favour fading value-area edges ([LuxAlgo Day-type](https://www.luxalgo.com/library/concept/day-type-taxonomy/)). The Fib-cluster rationale is anchor diversity ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters/)). The standalone Fib evidence is negative ([04](04%20Fibonacci%20retracements%20and%20extensions.md)).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | Day type (clock: open, open + 30, IB) | Same; must stay on clock |
| Cluster anchors | M15 legs + last H1 leg | VB-A legs + last SWING(VB-A, 2k) leg |
| SETUP (type) | STRUCTURE(M15) | STRUCTURE(VB-A) |
| Immediate-trend check (logged) | STRUCTURE(M5) | STRUCTURE(VB-B) |
| TRIGGER (Type 2) | M1 CHoCH | VB-C CHoCH (15-minute clock guard) |

**Context filter.** After the IB ends, router.daytype() ∈ {DIRECTIONAL_UP, DIRECTIONAL_DOWN, ROTATIONAL}, and the swing regime permits the trade direction.

**Location.** At each M15 close, rebuild FIB-CLUSTER(M15). Contributors are:

- retracements 0.382, 0.5, 0.618 and 0.786 of the last 2 confirmed M15 legs and the last confirmed H1 leg;
- 1.272 and 1.618 extensions of the most recent M15 correction;
- projections of the prior M15 correction from the latest M15 swing (symmetry, 0.618 / 1.0 / 1.618).

Keep clusters with ≥ 3 members from ≥ 2 anchors within 0.2 × ATR(M15) and width ≤ 0.5 × ATR(M15). The zone Z is the cluster span. B is the swing extreme that began the move into the cluster.

**Setup.** Type 1 if STRUCTURE(M15) = trade direction; otherwise Type 2. Type 1 is eligible only on DIRECTIONAL days in the trade direction. Type 2 is eligible on ROTATIONAL days, or on DIRECTIONAL days in the trade direction.

**Trigger.** Type 1: none. Type 2: after price trades into Z, the first M1 close beyond the last confirmed M1 swing against the trade (CHoCH), within 20 M1 bars. If price clears the zone without a trigger, there is no trade (Boroden).

**Entry order.** Type 1: ENTRY-LMT 1 tick in front of Z's near edge, server-side expiry after 6 M15 bars. Type 2: ENTRY-MKT on the trigger close. Both carry a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Z far edge ∓ BUF(M15), floored at 1.0 × ATR(M5) for Type 1 and 1.0 × ATR(M1) for Type 2. Skip if wider than 1.0 × ATR(M15) |
| Breakeven | Stop to entry ± 1 tick when price reaches +1R (Boroden "ASAP", made objective) |
| T1 | Z_mid + 1.272 × (B − Z_mid), fixed at order time (50%), with ROOM ≥ 1.0. Type 2 caps T1 at the prior RTH POC − 1 tick if that lies between entry and the extension |
| T2 | Trail 1 BUF(M5) behind newly confirmed M5 swings |
| Time stop | 12 M5 bars without +0.5R |
| Cancel an armed setup | An M15 close beyond Z's far edge (cluster broken); cluster rebuilt without the zone; day type switches against the mode; Type 1 limit expiry; router change |

**Filters.** From the IB end to 14:30 CT (CL 13:00); common news blackout; ATRr not EXTREME. One attempt per cluster; at most 2 CX-13 trades per instrument per day.

**Automation spec.** States: IDLE → ARMED (cluster, typed) → LIMIT_WORKING (Type 1) or IN_ZONE (Type 2) → ORDER_PENDING → IN_POSITION → BREAKEVEN → MANAGED → CLOSED. Terminal states: BROKEN, EXPIRED, CANCELLED.

```python
on_close(M15):
  dt = router.daytype()
  if now < IB_END or dt == UNDETERMINED: return
  for c in FIB_CLUSTER(M15, legs=last_legs(M15,2)+last_legs(H1,1), tol=0.2*ATR(M15), min_n=3, min_anchors=2):
      if c.width > 0.5*ATR(M15): continue
      side = LONG if c.span.hi < close else SHORT
      typ = 1 if STRUCTURE(M15).dir == side else 2
      ok = (typ == 1 and dt == directional(side)) or (typ == 2 and dt in (ROTATIONAL, directional(side)))
      if ok and router.allows("CX-13", side):
          B = swing_into(c, side)
          s = get_or_arm(Setup("CX-13", level_id=h(c.members), Z=c.span, typ=typ, side=side, B=B))
          if typ == 1 and s.state == ARMED:
              stop = farther(far_edge(c, side) - BUF(M15)*sgn(side), near_edge(c, side), ATR(M5))
              t1 = mid(c) + 1.272*(B.price - mid(c))
              if ROOM(near_edge(c, side), t1, stop) >= 1.0:
                  send(ENTRY_LMT, price=near_edge(c, side) + tick*sgn(side), expire_bars=6, bracket=bracket(stop, T1=t1, be_at_R=1.0))
                  s.to(LIMIT_WORKING)
  for s in setups("CX-13"):
      if beyond(close, far_edge(s.Z, s.side), against=s.side): s.cancel_or_exit(BROKEN)
on_close(M1):
  for s in setups("CX-13", ARMED, typ=2):
      if touched(s.Z): s.to(IN_ZONE); s.t_zone = now
  for s in setups("CX-13", IN_ZONE):
      if bars_since(s.t_zone, M1) > 20: s.to(EXPIRED)
      elif event(STRUCTURE(M1)) == choch(s.side):
          stop = farther(far_edge(s.Z, s.side) - BUF(M15)*sgn(s.side), close, ATR(M1))
          t1 = nearer(mid(s.Z) + 1.272*(s.B.price - mid(s.Z)), PROFILE(RTH_prev).POC - tick*sgn(s.side), from_=close, side=s.side)
          if abs(close - stop) <= ATR(M15) and ROOM(close, t1, stop) >= 1.0:
              send(ENTRY_MKT, bracket(stop, T1=t1, be_at_R=1.0)); s.to(ORDER_PENDING)
```

| Parameter | Default | Reason |
|---|---|---|
| Cluster | ≥ 3 levels, ≥ 2 anchors, 0.2 × ATR(M15), width ≤ 0.5 × ATR(M15) | Shared FIB-CLUSTER; Boroden's tight-band intent rescaled to ATR |
| Type rule | STRUCTURE(M15) direction | Boroden's "immediate trend", fixed on one layer |
| Day-type gate | DIRECTIONAL for Type 1 | Design (Dalton-style) |
| Breakeven | +1R | Boroden "ASAP" made objective |
| T1 | 1.272 extension of the swing into the cluster | Boroden's first objective |
| Type 2 cap | Prior RTH POC | Design: rotational days revert to value |

**Visual review checklist**

1. List the contributing grids with anchor IDs, and highlight cluster members (≥ 3 from ≥ 2 anchors).
2. Check the cluster width ≤ 0.5 × ATR(M15).
3. Check the day type label and time against the open and IB.
4. Check the Type from STRUCTURE(M15) at the arming bar.
5. For Type 1, check the resting limit 1 tick in front of the zone and the fill.
6. For Type 2, check the M1 CHoCH close inside or after the zone touch.
7. Check the stop beyond the cluster's far edge, breakeven at +1R, and T1.

Signs of a bot error: a cluster from one leg's ratios only; a Type 1 limit on a ROTATIONAL day; a cluster recomputed with the bar that touched it.

**Failure modes & regime fit.** Type 1 limits are adversely selected: a fill often means the level is being traded through. Measure "filled and immediately went against by ≥ 1R" separately ([07](07%20Automation%20architecture.md) §6). Clusters are noisy on small M15 legs, where anchor choice dominates; the notes suggest Fib on scalp legs be "at most a coarse depth band". That is why this proposal requires an H1 contributor. Day types that change after the IB are handled by cancellation, not reversal.

**Relations.** CX-13 Type 1 sits in the DIRECTIONAL-day slot with CX-12 and is mutually exclusive by level ownership. Type 2 sits in the ROTATIONAL slot with CX-08; CX-08 owns VA edges, and CX-13 trades clusters not within TOL(M15) of an edge. Its parents are the FIB- cluster and Boroden-style proposals in [10](10%20Proposals%20Fibonacci.md); shadow them.

## CX-14 Anchored-VWAP reclaim at value

**At a glance**

| Item | Value |
|---|---|
| Style | Swing |
| Typical hold | Hours to 5 sessions |
| Instruments | ES/MES, NQ/MNQ, CL/MCL |
| Regime | TREND_PULLBACK or TREND_BALANCE at D1, long side in BULL (mirror in BEAR) |
| Evidence grade | **C** (AVWAP as a signal is C; best-supported role: sweep-and-reclaim trigger, B) |
| Automation complexity | Med |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Profile | VM(last completed WEEK vs the week before) ∈ {HIGHER, OVERLAP_UP} |
| LOCATION | Volume-weighted, swing-anchored | AVWAP(P_D), anchored at the D1 protected low P_D (the HL that launched the last D1 BOS_UP). Zone = live AVWAP ± TOL(H1) |
| SETUP | Swing | STRUCTURE(H4) ∈ {DOWN, TRANSITION}: a pullback toward the AVWAP |
| TRIGGER | Swing | H1 SWEEP below the AVWAP and RECLAIM (an H1 close back above it within 3 H1 bars), with the sweep low above P_D |
| MANAGEMENT | Swing (+ MAGNET) | Stop below the sweep low; T1 = last D1 swing high; trail under H4 higher lows (Shannon) |

Why this is not double counting: AVWAP and every profile are built from the same prints. Under anti-smash rule 5 the AVWAP is the *only* volume lens in the location role. The weekly profile appears only as context (is value moving up?). If the AVWAP happens to sit within TOL of a weekly POC or VAL, the coincidence is logged and never counted as a second confirmation.

**Concept basis.** Brian Shannon popularized anchoring VWAP to meaningful swing highs and lows or to news events, and stacking several anchors across timeframes, with stops under "the most recent and relevant higher low" ([Alphatrends](https://alphatrends.net/?p=623098)). Holds of about 3–6 days using weekly-to-intraday charts are reported in secondary summaries. Pre-declaring *one* anchor (the D1 protected low) rather than a stack follows the Bailey et al. argument against choosing among many configurations after the fact. VWAP is academically established as an *execution benchmark* (Berkowitz, Logue & Noser), and Madhavan warns that uncritical benchmark use can raise costs. **No evidence shows AVWAP is predictive in futures** ([Madhavan 2002](https://www.smallake.kr/wp-content/uploads/2014/07/TP_Spring_2002_Madhavan.pdf)). Auto-anchored VWAP tools start only once the swing is confirmed, so the line appears bars after the extreme ([LuxAlgo](https://www.luxalgo.com/library/indicator/yGQMVJ90-auto-anchored-swing-vwaps/)). The profile notes give the distinction the role map relies on: VWAP is the volume-weighted *mean*, the POC is the *mode*, and an AVWAP drifting away from the anchored POC suggests migration ([03](03%20Volume%20profile%20across%20timeframes.md)).

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | WEEK profiles (clock) | Same; must stay |
| Anchor | D1 STRUCTURE protected low (clock) | Same |
| LOCATION | AVWAP from tick prints since pivot_time(P_D), exposed from confirm_time | Same |
| SETUP | H4 STRUCTURE | STRUCTURE on SWING(VB-A, 2k) |
| TRIGGER | H1 sweep and reclaim | VB-A sweep and reclaim |
| Trail | H4 swing lows | SWING(VB-A, 2k) lows |

**Context filter.** At the last W1 close, VM(WEEK_prev vs WEEK_prev−1) ∈ {HIGHER, OVERLAP_UP}. The router permits longs in TREND_PULLBACK or TREND_BALANCE.

**Location.** P_D = STRUCTURE(D1).protected_low, available from its confirm_time. The AVWAP accumulates price × size from pivot_time(P_D). At each H1 close the zone is AVWAP_t ± TOL(H1).

**Setup.** STRUCTURE(H4) ∈ {DOWN, TRANSITION} while price is within 1.0 × ATR(H4) of the AVWAP.

**Trigger.** An H1 bar's low ≤ AVWAP_t − 1 tick (SWEEP), then within 3 H1 bars an H1 close > AVWAP_t (RECLAIM), with the sweep low > P_D.

**Entry order.** ENTRY-MKT on the reclaim close (ETH allowed outside the session filters), with a broker-held bracket.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Sweep low − BUF(H1), floored at 1.0 × ATR(H1). Skip if wider than 1.0 × ATR(D1) |
| T1 | Last confirmed D1 swing high − 1 tick (50%), with ROOM ≥ 1.0. Then stop to entry + 1 tick |
| T2 | MAGNET from FIB 1.272 and 1.618 extensions of the D1 leg from P_D. Else trail 1 BUF(H4) behind new H4 swing lows (Shannon's higher low) |
| Time stop | 10 sessions |
| Cancel an armed setup | D1 close < P_D (anchor broken, so the AVWAP is retired); W1 close turns VM to BALANCE or down; no reclaim within 3 H1 bars after a sweep (reset to ARMED once); 10 sessions; router change |

**Filters.** Common rules apply; no entries after 12:00 CT Friday; ATRr not EXTREME. One attempt per anchor per week.

**Automation spec.** States: IDLE → ARMED → SWEPT → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED. Terminal states: RETIRED (anchor broken), EXPIRED, CANCELLED.

```python
on_close(W1):  ctx = VM(PROFILE(WEEK_prev), PROFILE(WEEK_prev2)) in (HIGHER, OVERLAP_UP)
on_close(D1):
  PD = STRUCTURE(D1).protected_low
  if ctx and PD and PD.confirm_time <= now and router.allows("CX-14", LONG):
      get_or_arm(Setup("CX-14", level_id=h(PD.id,"avwap"), PD=PD, vw=AVWAP(PD)))
  for s in setups("CX-14"):
      if close < s.PD.price: s.to(RETIRED)
on_close(H1):
  for s in setups("CX-14", ARMED|SWEPT):
      v = s.vw.value(now)
      log_attr(volume_coincidence = near(v, [PROFILE(WEEK_prev).POC, PROFILE(WEEK_prev).VAL], TOL(H1)))
      if s.state == ARMED and STRUCTURE(H4) in (DOWN, TRANSITION) and low <= v - tick and low > s.PD.price:
          s.to(SWEPT); s.sweep_low = low; s.k = 0
      elif s.state == SWEPT:
          s.sweep_low = min(s.sweep_low, low); s.k += 1
          if close > v:
              stop = min(s.sweep_low - BUF(H1), close - ATR(H1)); t1 = last_SH(D1) - tick
              if close - stop <= ATR(D1) and ROOM(close, t1, stop) >= 1.0:
                  send(ENTRY_MKT, bracket(stop, T1=t1)); s.to(ORDER_PENDING)
          elif s.k > 3: s.to(ARMED)
```

| Parameter | Default | Reason |
|---|---|---|
| Anchor | D1 protected low (one anchor) | Shannon-style swing anchor; one pre-declared anchor (Bailey) |
| Context | Weekly VM up | Value-migration sources |
| Sweep/reclaim | 1 tick / 3 H1 bars | Shared SWEEP/RECLAIM |
| Trail | H4 higher lows | Shannon's "most recent relevant higher low" |
| Coincidence | Logged only | Anti-smash rule 5 |

**Visual review checklist**

1. On D1, mark the protected low with its confirm marker. The AVWAP line should start at the pivot but be drawn solid only from confirm_time.
2. Overlay the last two WEEK profiles and check that the VM is HIGHER or overlapping up with the POC up.
3. On H4, check the pullback state.
4. On H1, find the bar whose low crossed below the AVWAP value *of that bar*, then a close back above within 3 bars.
5. Check the stop below the sweep low and T1 at the D1 high.
6. Note whether a weekly POC or VAL sat on the AVWAP. It must not have changed the decision.

Signs of a bot error: AVWAP values back-filled before confirm_time used in a decision; an AVWAP still drawn after the anchor broke; a sweep measured against the AVWAP value of a later bar.

**Failure modes & regime fit.** AVWAP from an old anchor flattens and stops being informative. Retirement on a new protected low keeps it fresh. In strong trends price never returns to the AVWAP, which means no trade, and that is fine. In balance the AVWAP sits inside value and gets crossed repeatedly; the weekly VM context and the TREND_* gate keep CX-14 off.

**Relations.** CX-14's AVWAP and CX-04's COMP POC are both volume lenses. If both arm in the same direction on one instrument, only the first takes the trade (ME-3 applies across volume lenses within TOL). CX-02 and CX-03 are the geometry-led alternatives at the same horizon. Parents: Shannon-style AVWAP proposals, wherever [08](08%20Proposals%20price%20action%20and%20swing.md) or [09](09%20Proposals%20volume%20profile.md) place them.

## CX-15 Late-session momentum at value

**At a glance**

| Item | Value |
|---|---|
| Style | Intraday |
| Typical hold | About 29 minutes (15:30–15:59 ET) |
| Instruments | ES/MES primary. NQ/MNQ is an *untested extension* (the published sample is SPY). CL excluded: no evidence, different session |
| Regime | Any router state except OFF; HIGH volatility keeps full size (the published predictability rises with volatility) |
| Evidence grade | **C** (the profile and structure filters are C; best-supported role: context, A) |
| Automation complexity | Low |

**Role map**

| Role | Dimension | Building block / condition |
|---|---|---|
| CONTEXT | Momentum | r1 = (ES trade price at 10:00:00 ET − ES trade price at 16:00:00 ET prior day) / the latter. sign(r1) is the direction; r1 = 0 means no trade |
| LOCATION | Profile | At 15:30 ET, price is on the r1 side of the developing RTH POC (above the dPOC for longs) |
| SETUP | Swing | At 15:30 ET, STRUCTURE(M5) is not against r1 (not DOWN, and not TRANSITION toward down, for longs) |
| TRIGGER | Clock | 15:30:00 ET, the close of the 15:00–15:30 ET M30 bar |
| MANAGEMENT | Clock + ATR | Exit at 15:59:00 ET; broker-held stop at 1.0 × ATR(M30, RTH) |

Why this is not double counting: the context is a return between two clock prints. It uses no level, swing or volume. The dPOC test asks whether the session's own accepted price agrees with the morning direction, and the structure test asks whether the last half-hour has already turned. Each filter is a separately logged hypothesis tested against the unfiltered baseline (below).

**Concept basis.** Gao, Han, Li and Zhou find that the first half-hour return, *measured from the previous day's close*, predicts the last half-hour return in SPY over 1993–2013, with R² ≈ 1.6%. Predictability rises with volatility and volume ([Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414); [working paper](https://www3.nd.edu/~zda/intramom.pdf)). The explanations offered are investors rebalancing in the first and last half-hours, and late-informed traders acting on morning information. ES tracks SPY closely, so the effect plausibly transfers, but **it is not verified for futures in these notes**. An R² of 1.6% means many losing days, so costs and slippage decide whether it is worth running. Its direction is the *opposite* of ICT's "Power of Three" claim that the early move is a fake-out ([02](02%20Multi%20timeframe%20price%20action.md)). The profile filter is this file's design: using the developing POC as "where today's volume accepted price" ([03](03%20Volume%20profile%20across%20timeframes.md)). It has no evidence and exists to be tested against the unfiltered baseline.

**Chart stack**

| Layer (role) | Time-bar version | Volume-bar version |
|---|---|---|
| CONTEXT | Clock prints at 16:00 ET (prior day) and 10:00 ET | Same; must stay on clock |
| LOCATION | Developing RTH profile (09:30 ET onward) | Same |
| SETUP | STRUCTURE(M5) | STRUCTURE(VB-B) |
| TRIGGER and exit | 15:30:00 and 15:59:00 ET | Same; must stay on clock |
| Stop size | ATR(M30), RTH, session-aware | Same |

**Context filter.** r1 ≠ 0 at 10:00:00 ET, using the front-month ES last trade at or before each timestamp. The router state is not OFF.

**Location.** At 15:30:00 ET, for longs, last trade > dPOC of the developing RTH profile (mirror for shorts). Ties mean no trade.

**Setup.** At 15:30:00 ET, STRUCTURE(M5) ∉ {DOWN, TRANSITION-down} for longs (mirror for shorts).

**Trigger.** 15:30:00 ET.

**Entry order.** ENTRY-MKT at 15:30:00 ET, cancelling after 30 s if unfilled (no chasing). Broker-held stop.

**Risk & management.**

| Item | Rule |
|---|---|
| Initial stop | Entry ∓ 1.0 × ATR(M30, RTH) |
| Size | `qty = floor(R_eff / stop)`; skip if below 1 micro |
| Exit | 15:59:00 ET, marketable limit ± 2 ticks, with a broker-side backstop (Rithmic `stopMarketAtSsboe` / Tradovate `flattenTimestamp`). Exiting a minute early keeps the bot out of closing-period messaging, which CME's RA2608-5 now addresses ([07](07%20Automation%20architecture.md) §7) |
| Targets | None. The effect is a return to the close |
| Cancel | Any tier-1 release scheduled 15:20–16:00 ET; early-close session; router OFF |

**Filters.** RTH full sessions only. FOMC days are traded at the router's event multiplier ×0.5 and logged. ATRr EXTREME → off. At most one CX-15 trade per instrument per day. It enters only if the instrument is flat or holding a position in the same direction (net-direction rule).

**Shadow baseline (required).** Every day, also log the *unfiltered* trade (sign of r1 only, same entry, exit and stop) as a signal-only control, with the location and setup flags attached. This is the cleanest attribution experiment in the file: after n days, compare filtered and unfiltered outcomes on the same days.

**Automation spec.** States: IDLE → CONTEXT_SET (10:00 ET) → ORDER_PENDING (15:30 ET) → IN_POSITION → CLOSED (15:59 ET). Terminal states: NO_SIGNAL, FILTERED (shadow only), SKIPPED.

```python
at(time="10:00:00 ET"):
  r1 = (last_trade_at("10:00:00 ET") - last_trade_at("16:00:00 ET", day=-1)) / last_trade_at("16:00:00 ET", day=-1)
  side = LONG if r1 > 0 else SHORT if r1 < 0 else None
at(time="15:30:00 ET"):
  if side is None or router.state == OFF or tier1_between("15:20 ET", "16:00 ET") or early_close(): return
  loc_ok = (last > PROFILE(RTH).developing().POC) if side == LONG else (last < PROFILE(RTH).developing().POC)
  set_ok = STRUCTURE(M5).state not in against(side)                    # not DOWN/TRANSITION-down for longs
  log_shadow("CX-15-baseline", side, loc_ok=loc_ok, set_ok=set_ok)   # unfiltered control, every day
  if loc_ok and set_ok and net_direction_ok(side):
      stop = last - sgn(side)*ATR(M30, session="RTH")
      send(ENTRY_MKT, bracket(stop, flatten_at="15:59:00 ET"), risk=R*router.mult("CX-15"))
at(time="15:59:00 ET"): flatten("CX-15")
```

| Parameter | Default | Reason |
|---|---|---|
| First window | Prior 16:00 ET → 10:00 ET | Gao et al.'s definition (from the prior close) |
| Entry / exit | 15:30 / 15:59 ET | Last half hour; exit 1 minute early (design) |
| Location filter | Side of dPOC | Design hypothesis |
| Setup filter | M5 structure not against | Design hypothesis |
| Stop | 1.0 × ATR(M30, RTH) | Shared stop floor rule; catastrophic stop only |

**Visual review checklist**

1. Mark the prior-day 16:00 ET print and today's 10:00 ET print. Check the sign of r1.
2. At 15:30 ET, overlay the developing RTH profile *as of 15:30* and check which side of the dPOC price was on.
3. Check the M5 structure label at 15:30.
4. Check the entry within seconds of 15:30, the exit at 15:59, and the stop distance = 1 × ATR(M30).
5. Compare against the baseline log for that day.

Signs of a bot error: the end-of-day POC used instead of the 15:30 dPOC; r1 computed from the RTH open instead of the prior close; an exit after 16:00 ET.

**Failure modes & regime fit.** The effect is small. Most of its value may sit on high-volatility days, which is why HIGH volatility keeps full size here while other proposals halve it. Futures transfer is unverified, so the baseline log is essential. If the baseline's forward expectancy is ≤ 0 after a pre-declared sample, retire both. The filters can only *remove* days, so they help only if they remove losing ones; the shadow comparison measures exactly that.

**Relations.** CX-15 is time-separated from almost everything. It enters at 15:30 ET (14:30 CT), exactly when the other intraday proposals' trigger windows close. The net-direction rule prevents conflicts with open intraday positions. It is the natural late-day complement to the rotation and trend slots. No PA-, VP- or FIB- parent exists; the baseline is its parent.

## CX-00 The regime router decides which families may run, in which direction, at what size

The router is the shared gate every proposal consults before it may arm. It is not a confluence vote and it never opens a trade. It turns a small, pre-declared set of inputs into four outputs (a regime state, a direction permission, the list of enabled families and a risk multiplier), and it enforces the mutual-exclusion rules. It encodes the notes' precedence rules. Bias comes from the highest layer of the stack, and a lower layer against it counts as a correction until the higher layer's protected swing breaks at grade G3. Conflicting upper layers mean CONFLICT: trade failures at the higher layer's levels, or stand aside. A RANGE bias layer favours failure templates over continuation templates. Layers beyond three become level providers, not gates ([01](01%20Swing%20points%20across%20timeframes.md); [LuxAlgo MTF alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). On the profile side, balance versus imbalance must be classified *before* deciding whether an LVN is a rejection point or an air pocket ([03](03%20Volume%20profile%20across%20timeframes.md)). **Every rule below is a design proposal.** No study tests multi-timeframe regime routing, so the router's own parameters are part of each `strategy_version` and are frozen like everything else.

### Inputs, with the time each is read

| Input | Definition | Read at |
|---|---|---|
| STRUCTURE(W1), (D1), (H4) | State ∈ {UP, DOWN, RANGE, TRANSITION}. Bias changes only at G3 | Each W1, D1 and H4 close |
| G2 flag | An LTF (H1) close beyond the D1 protected swing against the D1 state, with that D1 bar not yet closed | Each H1 close |
| VM(WEEK) | Last completed week vs the week before (HIGHER / OVERLAP_UP / BALANCE / OVERLAP_DOWN / LOWER) | W1 close |
| ATR regime | ATRr class LOW / NORMAL / HIGH / EXTREME | D1 close |
| Day type (intraday overlay) | Open tier, open type, IB width, acceptance events (below) | RTH open, open + 30, IB end, each M30 close |
| Calendar and health | Tier-1 blackout windows, FOMC week, roll window, early close; stale-data and order-channel faults ([07](07%20Automation%20architecture.md) §7) | Continuously (timers) |
| GAMMA_REGIME (**optional**) | ∈ {POSITIVE, NEGATIVE, NEAR_FLIP, UNKNOWN} from [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md); default UNKNOWN = ignored | As-of external event, logged with the EXTERNAL dimension tag ([07](07%20Automation%20architecture.md) §1) |

### Derivation rules

**Bias** is SUSPENDED if STRUCTURE(D1) = TRANSITION or the G2 flag is set; otherwise RANGE if STRUCTURE(D1) = RANGE; otherwise BULL if D1 = UP and W1 ≠ DOWN, BEAR if D1 = DOWN and W1 ≠ UP, and CONFLICT in the remaining cases. **Value relation** is WITH when VM(WEEK) moves in the bias direction (HIGHER or OVERLAP_UP for BULL), AGAINST when it moves the opposite way, and BALANCE otherwise. **Regime state**: OFF overrides everything (EXTREME ATRr, a data or health fault, or, for new entries only, an active blackout). SUSPENDED, CONFLICT and RANGE then pass straight through from the bias. For BULL or BEAR the state is TREND_BALANCE if the value relation is AGAINST or STRUCTURE(H4) = RANGE, TREND_IMPULSE if STRUCTURE(H4) points in the bias direction, and TREND_PULLBACK otherwise (H4 against, or in TRANSITION).

### State table: what each regime enables

| Regime state | Direction permission | Enabled CX proposals | Enabled single-dimension families (generic) | Disabled | Base risk × |
|---|---|---|---|---|---|
| TREND_IMPULSE | Bias side only | CX-01 (fresh H1 legs), CX-04, CX-05, CX-07, CX-11, CX-12 and CX-13 Type 1 (DIRECTIONAL day in the bias direction), CX-13 Type 2 (bias side), CX-15 | PA- breakout and breakout-pullback; VP- initiative, IB extension and acceptance; FIB- extension targets | All fades against the bias (CX-08, CX-09, CX-10 counter-bias), CX-02, CX-03, CX-06, CX-14 | 1.0 |
| TREND_PULLBACK | Bias side only | CX-01, CX-02, CX-03, CX-04, CX-14; CX-08 bias-side edge only (VAL longs in BULL); CX-10 in the bias direction; CX-11, CX-13, CX-15 | PA- higher-timeframe pullback (Template A); FIB- with-trend retracements and clusters; VP- responsive entries at value in the bias direction | Breakouts (CX-05, CX-06, CX-07) until H4 turns back (→ TREND_IMPULSE); counter-bias fades | 1.0 |
| TREND_BALANCE | Bias side only | CX-03, CX-04, CX-06 (breakout watch), CX-08 bias side, CX-10 and CX-11 bias side, CX-13 Type 2, CX-14, CX-15; CX-01 and CX-02 at × 0.5 | VP- value-edge responsive (bias side); PA- 2B at range edges (bias side); FIB- counter-trend (Type 2) | CX-05, CX-07, CX-12 | 0.75 |
| RANGE | Both (counter-W1 at × 0.5, ME-9) | CX-04, CX-06 (breakout watch), CX-08 both sides, CX-09, CX-10, CX-11, CX-13 Type 2, CX-15 | VP- rotation (80% rule, look-above/below-and-fail, POC reversion); PA- 2B and failed breakout; FIB- Type 2 | All trend pullback and continuation (CX-01, CX-02, CX-03, CX-05, CX-07, CX-12, CX-14) | 0.75 |
| CONFLICT (W1 ≠ D1) | W1 direction only | CX-03 (the D1 correction against W1 is its setup), CX-04 at × 0.5, CX-08 and CX-09 at W1/D1 edges in the W1 direction, CX-10 in the W1 direction, CX-15 | PA- Template B (2B at higher-layer levels) in the W1 direction; VP- at WEEK/COMP edges | All continuation in the D1 direction | 0.5 |
| SUSPENDED (G2 open, or D1 TRANSITION) | Swing: none. Scalps: STRUCTURE(H1) direction | CX-04 at × 0.5; scalps CX-10, CX-12, CX-13 with T1-only management; CX-15 | Scalp templates from any family, T1 only | All new swing entries (CX-02, CX-03, CX-09, CX-14) and intraday swings (CX-01, CX-05, CX-06, CX-07) | 0.5 |
| OFF | None | None. Open positions are managed by their own brackets | None | All | 0 |

### Intraday overlay: day type

The day type is read on clock time from the RTH session (08:30 CT for ES/NQ, 08:00 CT for CL). It gates the intraday families inside whatever the swing regime allows; it never adds a direction the swing regime forbids.

| Step | Time | Rule |
|---|---|---|
| Open tier | RTH open | INSIDE_VA (open within the prior RTH VA), OUTSIDE_VA_IN_RANGE, or OUTSIDE_RANGE (beyond PDH or PDL) ([LuxAlgo Open Types](https://www.luxalgo.com/library/concept/open-types/)) |
| Open type | Open + 30 min | OD, OTD, ORR or OA, using the open-type classifier in [03](03%20Volume%20profile%20across%20timeframes.md) |
| First label | Open + 30 min | DIRECTIONAL_X if the open is outside VA or range on side X *and* the open type is OD or OTD toward X. ROTATIONAL if the open is INSIDE_VA *or* the open type is OA or ORR. Otherwise UNDETERMINED |
| IB resolution | IB end (open + 60) | UNDETERMINED → DIRECTIONAL_X if IB width < 0.6 × its 20-session median and range extension so far is on side X only; else ROTATIONAL |
| One switch | Any M30 close | ROTATIONAL → DIRECTIONAL_X on ACCEPT beyond the prior VA on side X. At most one switch per session, and never back |

| Day type | Enabled intraday proposals (within swing permission) | Disabled |
|---|---|---|
| DIRECTIONAL_X | CX-12, CX-13 Type 1 and Type 2 toward X, CX-11 toward X, CX-10 only for sweeps against X that trade with X | CX-08 (all), fades against X |
| ROTATIONAL | CX-08 (sides per swing permission), CX-10, CX-11, CX-13 Type 2 | CX-12, CX-13 Type 1 |
| UNDETERMINED (before open + 30, or unresolved) | None of the day-type readers | CX-08, CX-10, CX-11, CX-12, CX-13 |

Proposals that do not read day type (CX-01, CX-05, CX-07, CX-15 and every swing proposal) are unaffected by this overlay and follow the swing state table alone.

### Volatility, event and optional gamma overlays

The volatility multiplier m_vol is 1.0 for LOW and NORMAL, 0.5 for HIGH and 0 for EXTREME (which forces OFF). The single exception is CX-15, which keeps 1.0 in HIGH because the published intraday-momentum predictability rises with volatility ([Gao et al.](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). The event multiplier m_event is 0.5 for swing proposals in FOMC weeks and 0.5 for CX-15 on FOMC days. The roll window and early closes are handled by the common rules.

**GAMMA_REGIME is an optional, design-proposal input.** It is defined, sourced and graded in [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md), not in this file: these research notes contain no gamma evidence. No CX proposal depends on it. When it is UNKNOWN (the default, and whenever the feed is stale or absent), it has no effect. Its modulation follows one rule: **it can only reduce risk or disable a family, never enable one or raise size**. An unvalidated feed should not be able to add exposure. It applies only to ES/NQ intraday families. Swing proposals, CX-01 and CX-15 are unaffected.

| GAMMA_REGIME | Mean-reversion and balance group (CX-08, CX-10, CX-13 Type 2; VP- rotation; PA- 2B) | Continuation and breakout group (CX-05, CX-07, CX-11, CX-12, CX-13 Type 1; PA- breakout; VP- initiative) |
|---|---|---|
| UNKNOWN (default) | No change | No change |
| POSITIVE (the design hypothesis is that it favours mean reversion and balance) | No change | m_gamma = 0.5 |
| NEGATIVE (the hypothesis is that it favours continuation and breakouts) | m_gamma = 0.5; fades against the day's DIRECTIONAL side disabled | No change |
| NEAR_FLIP (the hypothesis is ambiguity) | m_gamma = 0.5 | m_gamma = 0.5 |

Gamma enters decision records as an EXTERNAL-tagged context value. Forward results can then be split by gamma state as a pre-declared diagnostic, which is how its usefulness should be judged before it is ever allowed to do more than reduce size.

### Outputs and risk scaling

At each update the router publishes a snapshot: `{state, bias, direction_permission, daytype, enabled[family], m_regime, m_vol, m_event, m_gamma, inputs_as_of}`. Effective risk is R_eff = R × m_regime × m_vol × m_event × m_gamma × m_rule, where m_rule carries per-proposal factors from the state table (for example CX-04 × 0.5 in CONFLICT). If the resulting quantity is below one micro, the trade is skipped. A state change **cancels armed setups that are no longer enabled, but never closes open positions**. Positions run under their own brackets. That avoids exits on regime flicker.

### Mutual-exclusion rules

| Rule | Statement |
|---|---|
| ME-1 Net direction | One direction per instrument family (ES/MES, NQ/MNQ, CL/MCL) at a time. Entries against an open position are blocked; there are no flips without going flat |
| ME-2 Equity bucket | ES-family and NQ-family together: combined open risk ≤ 1.5R, and at most one new equity-bucket entry per 15 minutes |
| ME-3 Level ownership | Each `level_id` has one owner thesis. Any other proposal referencing a level within TOL of an owned level is blocked until the owner reaches a terminal state. This applies across volume lenses too: an AVWAP and a POC within TOL count as one level |
| ME-4 Opposing theses | Continuation and fade at the same level are never both armed. The regime state decides which is eligible |
| ME-5 Horizon nesting | Lower-horizon proposals may trade only in the direction of an open higher-horizon position on the same instrument. Per-instrument open risk ≤ 2R |
| ME-6 Parent in shadow | A CX proposal and its single-dimension parent (PA-/VP-/FIB-) never both trade the same signal. The parent runs signal-only |
| ME-7 Priority | When two enabled setups arm on one instrument on the same bar and only one can be taken: higher horizon first, then better weakest-role grade (B before C), then lower automation complexity, then earlier arming sequence number |
| ME-8 Caps override | The account fences (daily −2R, weekly −4R, 3 trades per instrument per day, 3 consecutive losses per strategy, repeated-execution limit) override every regime output ([07](07%20Automation%20architecture.md) §7) |
| ME-9 Counter-W1 | Entries against STRUCTURE(W1) (when W1 is UP or DOWN) are allowed only in RANGE, and in SUSPENDED scalps, at m_rule = 0.5 |

### Router pseudocode

```python
def router_update(sym, t):
    W, D, H4 = (STRUCTURE(L).asof(t) for L in ("W1", "D1", "H4"))
    g2 = htf_grade("D1", "H1", t) == "G2"                 # provisional break against D1, D1 bar still open
    bias = ("SUSPENDED" if D.state == TRANSITION or g2 else
            "RANGE" if D.state == RANGE else
            "BULL" if D.state == UP and W.state != DOWN else
            "BEAR" if D.state == DOWN and W.state != UP else "CONFLICT")
    vm = VM(PROFILE("WEEK_prev"), PROFILE("WEEK_prev2"))
    value = ("WITH" if moves_with(vm, bias) else "AGAINST" if moves_against(vm, bias) else "BALANCE")
    atr_c = atr_class(ATR("D1").asof(t) / median_atr("D1", 60, t))
    ev = calendar_and_health(sym, t)                     # blackout, fomc_week, roll, early_close, fault
    if atr_c == EXTREME or ev.fault or ev.blackout:      state = "OFF"
    elif bias in ("SUSPENDED", "CONFLICT", "RANGE"):     state = bias
    elif value == "AGAINST" or H4.state == RANGE:        state = "TREND_BALANCE"
    elif H4.dir == dir_of(bias) and H4.state in (UP, DOWN): state = "TREND_IMPULSE"
    else:                                                state = "TREND_PULLBACK"
    perm = permission(state, bias, W, STRUCTURE("H1").asof(t))   # bias side / both / W1 side / H1 side for scalps / none
    dt = daytype(sym, t)                                 # open tier, open type, IB, one-way switch on ACCEPT
    gamma = external("GAMMA_REGIME", sym, t, default="UNKNOWN", max_age_s=300)   # optional; stale → UNKNOWN
    snap = Snapshot(state, bias, perm, dt, enabled=STATE_TABLE[state] & DAYTYPE_TABLE[dt],
                    m_regime=BASE_MULT[state], m_vol=vol_mult(atr_c), m_event=event_mult(ev),
                    m_gamma=gamma_mult(gamma), inputs_as_of=asof_ids(t))
    for s in armed_setups(sym):
        if not snap.allows(s.proposal, s.side): s.to("CANCELLED", reason=f"router:{state}/{dt}")
    log_decision_record("ROUTER", snap)
    return snap
# Triggered on: every W1/D1/H4/H1 close, RTH open, open+30, IB end, every M30 close (ACCEPT checks),
# calendar timers, health events and external GAMMA_REGIME updates. Never on a developing bar's values.
```

### Router failure modes and review

The router is late by design. A weekly or daily trend change at G3 can take a full bar to register, and the SUSPENDED state exists to cover that gap with reduced, scalp-only activity. It can flicker when H4 oscillates around TRANSITION. Flicker does no harm because state changes only cancel armed setups and never close positions; but if cancellations cluster, look at H4 swing granularity (the "handful of LTF swings per HTF leg" check in [01](01%20Swing%20points%20across%20timeframes.md)), not at the router thresholds. The router is also a parameter set that can be overfitted. Treat the state table as frozen per version, and judge it only through the forward results of the proposals it gates.

For visual review, plot one row per input on the chart (W1/D1/H4 state with G-grades, VM(WEEK), ATRr class, day type, gamma if present) and colour the background by router state. Every cancelled setup should show the router reason code.

## Validate the combinations forward, start with three, and run them as a portfolio

### Attribute every outcome to a role, not to "the setup"

A combined strategy that wins or loses tells you nothing about *which* dimension helped unless each role's state is logged at signal time. Every decision record should carry, per role, the fields below. Results are then read against the pre-declared go/no-go rules of [07 Automation architecture](07%20Automation%20architecture.md) §8: signal-only first, then simulation, then one micro, with any rule change creating a new `strategy_version` and a new sample.

| Role | Log at signal time | Diagnostic question it answers later |
|---|---|---|
| CONTEXT | Router snapshot; each layer's STRUCTURE and G-grade; VM values; TSMOM, r1 or day type; gamma if present | Do trades with context "barely true" behave like trades with context "strongly true"? |
| LOCATION | `level_id`, kind, dimension tags (GEOMETRY, PROFILE, REFERENCE), provenance anchors, level age, prior touches, distance from the trigger price in ATR, and whether a GEOMETRY+PROFILE coincidence was present | Does a two-dimension location beat a one-dimension one? Do older or more-touched levels decay, as Chung & Bellotti found for S/R? |
| SETUP | Event and time, depth class, bars since the anchor, logged attributes (VSA quietness, volume coincidence, poor-vs-equal target type) | Do the pre-declared attributes separate outcomes? |
| TRIGGER | Trigger bar range/ATR, VB duration, entry slippage, fill vs touch | Is the edge lost at execution? |
| MANAGEMENT | Which exit fired; MAE and MFE in R; time to T1; runner result beyond magnets | Do stops sit beyond normal noise? Are targets realistic? |

Two practices turn this log into evidence rather than storytelling. First, run each CX proposal's **single-dimension parent in shadow**: the PA-, VP- or FIB- version, or the unconditional Gao trade for CX-15. Over the same days, the comparison then shows whether the added dimension removed losers or just removed trades. Second, analyse the logged attributes **only at pre-declared checkpoints** (for example at n = 50 and n = 100 trades per proposal), never to tweak a live version. Bailey et al.'s point applies with full force to an eyeball review loop. With a typical spread of about 1.0–1.5R per trade, showing an expectancy of +0.2R with about 95% one-sided confidence takes roughly 70–150 trades ([07](07%20Automation%20architecture.md) §8). Swing-horizon proposals must therefore run identically across ES, NQ and CL to get there.

### Start with CX-08, CX-01 and CX-15

These three are the recommended first deployment, for reasons that reinforce each other. **CX-08 (value-edge 2B)** has a B weakest role, medium complexity and RTH-only operation, and building it forces the three engines every other proposal needs: final session profiles, confirmed swings on two layers, and the router's day-type classifier. **CX-01 (leg-value pullback)** is also B, runs natively on the preferred volume bars, exercises anchored profiles and multi-layer structure, and trades the trend regime that CX-08 is barred from, so the router keeps the two from competing. **CX-15 (late-session momentum at value)** has the only peer-reviewed core among the intraday proposals and is low complexity, with at most one decision per day; its required shadow baseline makes it the cleanest attribution experiment in the set, and it is time-separated from the other two.

Together they cover rotation, trend pullbacks and end-of-day timing, so forward data accrue across regimes rather than in one. The next wave is CX-04 (A-graded momentum context at swing horizon, once weekly and composite seeding is built), CX-05 (B, for TREND_IMPULSE) and CX-09 (B, the swing range counterpart). Add C-graded proposals only after the first wave's plumbing passes Stage 0 and its signal-only reviews show high agreement.

### Portfolio view: slots that partition regimes and time

| Slot | Proposals | Can run alongside | Mutually exclusive with | Why they coexist |
|---|---|---|---|---|
| Swing trend (D1/W1) | CX-04 plus one of CX-03 or CX-02 (CX-03 preferred, being more independent), CX-14 | Intraday trend and close-timing slots in the same direction (ME-5) | Swing range slot (the router never enables both) | Same direction; per-instrument cap 2R |
| Swing range | CX-09 | Intraday rotation slot | Swing trend slot | Both live in RANGE regimes |
| Intraday trend | CX-01, CX-05, CX-07 (level ownership dedups) | Swing trend; directional-day scalps; CX-15 | Intraday rotation (router and day type) | Different locations in one trend; ME-3 dedups |
| Intraday rotation | CX-08, CX-10 (LIQ levels not at CX-08 edges), CX-13 Type 2 | Swing range; CX-15 | Directional-day scalps (day type) | One owner per edge or level |
| Directional-day scalps | CX-12, CX-13 Type 1, CX-11 | Intraday trend; swing trend in the same direction | Intraday rotation | Same day-direction, different levels |
| Close timing | CX-15 | Everything, subject to ME-1 | — | Different clock window |
| Single-dimension families | PA-, VP-, FIB- proposals | Live only where they have no CX child and their regime matches the router state | Their own CX children (they run in shadow under ME-6) | Same caps, ownership and router as CX |

The broader lesson of building these proposals is that a combined strategy earns its keep mostly through what it *forbids*. It forbids fading an edge the market has accepted, buying a breakout during balance, and treating five Fib lines as five reasons. Its value is therefore measured by the losers it removes relative to its single-dimension parent, not by its win rate. The evidence ceiling for any geometry- or profile-led combination here is B, because the strongest research supports levels and stop clustering in general, not these constructions. The designs closest to the evidence pair a peer-reviewed return-momentum context (CX-04, CX-15) with a level-based location and a structure trigger whose main job is defining risk. The rest should be judged as disciplined, auditable operationalizations of plausible mechanisms. Forward evidence, with every role logged and every parent in shadow, is the only thing that can raise them above that.
