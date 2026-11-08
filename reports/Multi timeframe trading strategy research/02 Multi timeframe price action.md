# Higher timeframes decide direction; patterns define risk

Every multi-timeframe (MTF) price action framework in the research reduces to one hierarchy, whether it is Elder's Triple Screen, Dow's trend degrees, Shannon, Brooks or the modern "HTF bias plus LTF structure shift" school. A slow layer says which direction is allowed, a middle layer finds a pullback or a watched level, and a fast layer times the entry and fixes the stop. Only Elder names a spacing, a calendar-based **factor of about five** between layers ([ForexOp](https://forexop.com/technical/multiple-timeframe-trade-analysis/)), and no study tests which ratio works best. On 23-hour CME Globex the arithmetic breaks below the daily bar: D1→H1 is ~23× on ETH but 6.5× on RTH. Constant-volume bars avoid that problem, because the VB-A/VB-B/VB-C tiers sit a fixed 5× and 4× apart whatever the session. About a dozen setups can be coded without ambiguity: pin bar, engulfing, inside and outside bars, Crabel NR4/NR7/inside day, opening range breakout, breakout-pullback, failed breakout/2B, Brooks H1/H2/L1/L2, wedge, and PDH/PDL/PWH/PWL interactions. Three conditions make that possible: thresholds are fixed in advance, direction comes from the higher layer, and entry is a stop order beyond a signal bar. The evidence, though, is lopsided. **Twenty-eight candlestick patterns showed no predictive power under bootstrap tests on DJIA stocks** ([CXO Advisory](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/)). Against that, **time-series momentum across 58 futures and forward markets** ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)) and **intraday momentum, where the first half-hour return predicts the last half-hour (R² ~1.6%)** ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)), are robust. Published support and resistance levels also interrupted FX trends more often than random levels did ([New York Fed](https://www.newyorkfed.org/research/epr/00v06n2/0007osle.html)). The design that follows puts trend persistence in CONTEXT and watched levels in LOCATION, and uses bar patterns only as TRIGGERs whose job is to define the stop. No study tests MTF alignment filtering itself, so the user's forward log is the only test it will get. ICT's "Power of Three" becomes testable only when it is restated as a failed break of the period open, and the strongest related evidence points the other way.

*Reading note.* This write-up uses the shared conventions of the set. Swing mechanics are defined in [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md) and only referenced here: SWING(L), STRUCTURE(L), BOS, CHoCH, the G1/G2/G3 trend-change grades and the protected swing. Volume-bar construction is in [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md). Combinations with volume profile and Fibonacci are in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md), the engine is in [07 Automation architecture](07%20Automation%20architecture.md), and concrete strategies are in [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md). Every numeric default below is a pre-committed starting value drawn from the research notes, not an optimized one. Anything marked *(proposal)* is a design inference, not a sourced fact.

## Seven frameworks share one hierarchy, and only Elder names a ratio

Elder's Triple Screen is the only widely cited MTF framework with an explicit spacing rule. Screen 1 applies a trend-following indicator to the long-term chart to set direction, and the documented minimal version is simply the **slope of a 13-week EMA**. Screen 2 applies oscillators to an intermediate chart to find pullbacks against that direction. Screen 3 uses a short-term chart to time the entry ([ForexOp](https://forexop.com/technical/multiple-timeframe-trade-analysis/); [Commodity Charting Tools](https://commoditychartingtools.blogspot.com/2009/01/triple-screen-trading-system.html)). Each screen sits roughly **a factor of five** from its neighbour, and the justification is the calendar: about 4.5 weeks per month, exactly five trading days per week, roughly five to six hours per equity cash session ([ForexOp](https://forexop.com/technical/multiple-timeframe-trade-analysis/)). Other summaries widen this to 4–6× and give examples such as a weekly "tide" over a daily "wave". Some credit the tide/wave/ripple metaphor to Robert Rhea rather than Elder ([TheRightTrader](https://therighttrader.com/learn/trend-analysis/triple-screen-trading-system); [TradingView Triple Screen scripts](https://www.tradingview.com/scripts/triplescreen/)). A copy of an Elder article says he used the method from 1985 and first published it in Futures Magazine in April 1986 ([Scribd](https://es.scribd.com/document/6630691/Tsd)). All of this is secondary, because Elder's book text was not verified. The ratio is a convention, not a finding. A NexusFi trader reports that a factor near 16 worked better for him ([NexusFi](https://nexusfi.com/showthread.php?p=57069)), and the research found no study that compares ratios.

The other frameworks supply the same hierarchy without the numbers. Dow Theory's nesting is the original three-degree version: the primary trend; secondary reactions lasting "about 10 to 60 days" that typically retrace one-third to two-thirds; and minor fluctuations ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). Brian Shannon's approach comes only from low-confidence summaries, because his CMC Markets interview returned 404 ([CMC Markets Opto](https://cmcmarkets.com/en-gb/opto/i-trade-using-multiple-timeframes-by-brian-shannon)): set the trend on the higher timeframe, use lower ones for entries and exits, and never let the lower timeframe override the higher trend. His stage model could not be verified. Al Brooks reportedly trades a 5-minute RTH ES chart with 15- and 60-minute charts for context ([NexusFi](https://nexusfi.com/traders-hideout/734-book-discussion-reading-price-charts-bar-bar-al-brooks-17.html)). Forum relays of his view hold that "any move on 5m chart can be caused by tests of S/R on other time frames", and that a trading range on one timeframe can be a channel on a higher one ([Brooks Trading Course forum](https://brookstradingcourse.com/support-forum/18-trading-ranges/how-far-to-look-back-for-tranding-range-and-context)). His course does not formalize how he combines them. John Murphy's sourced contribution is the level definition that Osler quotes: support is "identified beforehand by a previous reaction low" and resistance "by a previous peak" ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). His top-down method was not retrieved. Wyckoff's sourced contribution is narrower than his reputation. The **spring** and **upthrust** are failed breaks of a trading-range boundary that quickly reverse back inside ([TradingWyckoff](https://tradingwyckoff.com/en/spring-shakeout/); [LuxAlgo](https://www.luxalgo.com/library/concept/spring/)), which makes them 2B patterns at range scale. His phase schematics were not retrieved from a citable source and are left out. LuxAlgo gives the modern restatement: two or three timeframes stepped about **4–6×** apart, "higher-timeframe bias plus a lower-timeframe structure shift at a higher-timeframe level", and an explicit warning that "nothing about alignment is guaranteed" ([LuxAlgo](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)).

| Framework | Layers as the source names them | Spacing | What can be coded | Source confidence |
|---|---|---|---|---|
| Elder Triple Screen | Tide (long-term trend, e.g. 13-week EMA slope) / wave (oscillator pullback) / ripple (entry) | ~5× (4–6× in some summaries) | EMA-slope bias, pullback against bias, stop entry | Secondary summaries only |
| Dow (Hamilton/Rhea) | Primary / secondary (10–60 days, 1/3–2/3 retrace) / minor | Durations, not ratios | HH/HL swing structure | Secondary |
| Shannon | HTF trend, LTF entries and exits, LTF never overrides HTF | None | Precedence rule | Low (primary page 404) |
| Brooks | 5-minute RTH execution, 15/60-minute context (reported); H1/H2 counts | None | Bar counts, breakout and failed breakout | Secondary and forum relays |
| Murphy | S/R at prior reaction lows and peaks | None | Levels from swings | Only the S/R definition sourced |
| Wyckoff | Spring and upthrust at range edges | None | 2B of a range boundary | Phases not sourced |
| LuxAlgo MTF alignment | HTF bias + LTF structure shift at HTF level; 2–3 timeframes | 4–6× | Aligned/conflicted state | Vendor educational |

In this set's role vocabulary, Elder's Screen 1 is CONTEXT, Screen 2 is SETUP and Screen 3 is TRIGGER. The prior-period highs and lows, opens and swing prices that every framework uses become LOCATION, and the stop and target that the trigger defines become MANAGEMENT. Each layer of a stack has exactly one role. The cap from LuxAlgo and the swing notes applies: **at most three gating layers** (CONTEXT, SETUP, TRIGGER), because extra charts "mostly add delay and contradiction rather than clarity" ([LuxAlgo](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). Any further timeframe becomes a level provider. The confirmed swing prices of a gating layer may feed LOCATION or MANAGEMENT as horizontal levels; that does not give the layer a second role, since a price is an input, not a gate. One spacing rule is reasoning rather than a tested result. Adjacent gating layers should sit about **3–6× apart**. Below 3× the layers show the same swings. Above 8–10× a pullback on the setup layer is only a couple of bars on the context layer, so the lower layer's structure no longer maps onto the upper layer's.

## Globex hours break the factor of five below the daily bar

Elder's arithmetic assumes an equity cash day. ES, NQ and CL trade about 23 hours a day on Globex, so the ratio between two clock layers depends on which session template builds them. The swing notes add a hard rule: build all bars of a stack from **one raw stream with one session template**, either ETH or RTH. If you don't, an HTF swing will not equal any LTF swing, and the nesting check in [01](01%20Swing%20points%20across%20timeframes.md) fails. A trading window (only enter between 09:30 and 16:00 ET) is a separate decision from the template. An ETH-built stack can still trade only RTH.

| Adjacent pair | ETH template (~23 h) | RTH template (ES/NQ, 6.5 h) | Verdict |
|---|---|---|---|
| W1 → D1 | 5 | 5 | In band either way |
| D1 → H4 | ~5.75 | ~1.6 | ETH only; RTH is redundant |
| D1 → H1 | ~23 | 6.5 | RTH only; ETH is too wide |
| H4 → H1 | 4 | 4 (but an RTH day holds ~1.6 H4 bars) | ETH preferred |
| H1 → M15 | 4 | 4 | Either |
| M15 → M5 | 3 | 3 | Either (lower edge) |
| M5 → M1 | 5 | 5 | Either |
| H1 → M30 | 2 | 2 | Too close |
| VB-A → VB-B → VB-C | 5, 4 | 5, 4 | Independent of session |

The ETH and RTH ratios come from the notes, which observe that D1→H4 on a 23-hour session "preserves the factor-of-five spirit better than daily-to-60m". *(Proposal.)* A further trap: 23 is not divisible by 4, so an ETH H4 series always contains one short bar per session. Whether the platform anchors H4 bars to the 18:00 ET open or to midnight changes every H4 high and low, so hardcode the anchor and use the same one in the bot and the review chart.

### Time-bar stacks for scalping, intraday and swing trading

The notes derive these stacks from the factor-of-five idea; no authoritative source prescribes futures stacks. The notes' scalping stack used a 3-minute trigger. That label is not in this set, so M5 (3× below M15) or VB-C replaces it. MANAGEMENT defaults to a bracket order: the stop comes from the TRIGGER event and the target from the next opposing LOCATION level. That suits a strategy meant to be triggered and left alone. Trailing, where a strategy uses it, follows confirmed swing prices of the named layer.

| Stack | Template / window | CONTEXT | SETUP | TRIGGER | Ratios | LOCATION inputs | MANAGEMENT |
|---|---|---|---|---|---|---|---|
| Scalp-T | RTH or ETH / RTH | H1 | M15 | M5 | 4×, 3× | PDH/PDL/PDC, ONH/ONL, DO, IBH/IBL, ORH/ORL, SWING(H1) prices | Bracket; target = next LEVEL |
| Scalp-T fast | RTH or ETH / RTH | M15 | M5 | M1 | 3×, 5× | Same | Bracket |
| Intraday-T | ETH / RTH or ETH | H4 | H1 | M15 | 4×, 4× | D1 and W1 LEVELS, SWING(H4) prices | Bracket; optional trail on SWING(H1) prices |
| Intraday-T (RTH) | RTH / RTH | D1 | H1 | M15 | 6.5×, 4× | PD/ON/IB levels, PWH/PWL, SWING(D1) prices | Same |
| Swing-T | ETH / any | W1 | D1 | H4 | 5×, ~5.75× | PWH/PWL/PWC, WO, SWING(W1) prices | Bracket; trail on SWING(D1) prices |
| Swing-T alt | ETH / any | D1 | H4 | H1 | ~5.75×, 4× | W1 levels as LOCATION only | Trail on SWING(H4) prices |

Swing-T alt follows a suggestion in the notes. Using the weekly chart only as LOCATION, meaning where price sits inside the weekly range, avoids the over-filtering that a fourth gate causes.

### Volume-bar stacks keep a fixed ratio and solve the overnight problem

The volume-bar tiers in this set are sized from the instrument's 20-session average daily volume (ADV): **VB-A = ADV/50, VB-B = ADV/250 and VB-C = ADV/1000**. They are recalibrated weekly, and bars break at session start. VB-A is the Easley–López de Prado–O'Hara sampling of "every 1/50 of the average daily volume", which they used on E-mini S&P futures to show that volume-clock sampling "removes most intra-session seasonal effects" and partially recovers normality ([Volume Clock](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). Higher tiers can only stay aligned with lower ones if the multiples are exact integers and the session-break rule is the same. Then each higher-tier bar boundary coincides with a lower-tier boundary, as the volume notes point out. *(Proposal.)* Compute VB-C from ADV and round it to a "nice" contract count, then **define VB-B = 4 × VB-C and VB-A = 5 × VB-B** rather than rounding each tier separately. Recalibrate all three at the same weekly session open. Use the same split convention for large prints in the bot and the chart.

The arithmetic below shows why volume bars suit this user's preference. The share of ETH volume that prints in RTH is an **assumed range of 60–90%**. The notes say only that "most" volume prints in RTH, so measure it from your own Rithmic history.

| Tier | Bars per ETH session at average volume | Average RTH minutes per bar (60–90% in RTH) | Average overnight minutes per bar (10–40% overnight) | Nearest time-bar cousin in RTH |
|---|---|---|---|---|
| VB-A | 50 | ~9–13 min | ~50–200 min | Between M5 and M15 |
| VB-B | 250 | ~1.7–2.6 min | ~10–40 min | ~M2 |
| VB-C | 1,000 | ~26–39 s | ~2.5–10 min | ~30-second bars |

So VB-C is the "seconds" layer during the cash session, and it stretches to minutes overnight. Each candle represents comparable participation, which is the property the user likes. The practitioner anchor agrees: a Brooks course moderator noted that a ~6,500-volume ES chart closely resembled a 5-minute chart in 2021. The same thread carries the warning for scalpers. Fast charts give "more false signals" during breakouts, the course admin calls 2,000 ticks and lower "far too fast", and a member reported early profit-taking, stops too wide for the targets and higher commissions on lower timeframes ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). *(Proposal.)* VB-C should therefore only ever serve as TRIGGER, never as SETUP or CONTEXT.

| Stack | Template | CONTEXT | SETUP | TRIGGER | Ratios | LOCATION inputs | MANAGEMENT |
|---|---|---|---|---|---|---|---|
| Scalp-V | Volume bars break at Globex open; trade RTH | VB-A | VB-B | VB-C | 5×, 4× | Clock LEVELS (PDH/PDL/PDC, ONH/ONL, DO, IBH/IBL, ORH/ORL), SWING(D1) prices | Bracket; optional trail on SWING(VB-B) prices |
| Intraday-V | Hybrid, ETH | H4 | VB-A | VB-B | ~8.7× average (uneven), 5× | D1 and W1 LEVELS, SWING(H4) prices | Bracket |
| Swing-V | Hybrid, ETH | D1 | H4 | VB-A | ~5.75×, ~8.7× average | W1 LEVELS, SWING(W1) prices | Trail on SWING(H4) prices |

The reason for keeping clock bars at the top comes from the volume notes. Daily and weekly bars are what other participants anchor to (prior-day levels, settlement, the weekly open). At daily-plus horizons, bar counts per period are roughly equal under either clock anyway, and the 1-week cap is a calendar unit. A practitioner sees daily time charts as sensible because "each bar covers a full session" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). Hybrid stacks pay a price: a clock-to-volume ratio is an average, not a constant. With the assumed RTH share, an RTH H4 bar holds roughly 18–28 VB-A bars and an overnight H4 bar holds about one to five. The ~8.7× average in Intraday-V and Swing-V sits above the 3–6× band. It is tolerated only because the clock layer above the volume tier gates direction and supplies levels rather than nesting swing-for-swing. Judge hybrid spacing with the swing-granularity check from the swing notes instead: **each CONTEXT leg should contain a handful of SETUP swings**. One means the layers are too close; more than about ten means the lower layer is too noisy for visual review.

## Two or three binary tests make trend alignment objective

Alignment becomes objective once each layer's bias is reduced to a few tests on closed bars, each returning +1, 0 or −1. The best academic support is for simple trend definitions at long horizons and for the sign of the early-session move intraday. Nothing rigorous supports the "above the weekly open" or "premium/discount" filters. One more gap matters most: no study found tests whether requiring HTF and LTF agreement improves LTF signals.

| Test | Definition (closed bars of layer L) | Session | Evidence | Grade |
|---|---|---|---|---|
| Structure | STRUCTURE(L) from confirmed SWING(L): UP = +1, DOWN = −1, RANGE or TRANSITION = 0 (per [01](01%20Swing%20points%20across%20timeframes.md)) | Layer's template | Dow consensus; extrema-based patterns carry distributional information ([Lo, Mamaysky & Wang](https://web.mit.edu/~alo/www/Papers/techanal.html)) | B |
| EMA slope (Elder Screen 1) | sign(EMA13[1] − EMA13[1+k]); 0 if \|slope\| < 0.1 × ATR(L) | Layer's template | Elder practitioner consensus ([Commodity Charting Tools](https://commoditychartingtools.blogspot.com/2009/01/triple-screen-trading-system.html)); trend persistence as indirect support | B |
| Time-series momentum | sign(close_W1[1] − close_W1[1+N]), N = 52 weeks | W1, clock | 58 futures, 1–12-month persistence ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)) | A |
| Opening move (Gao window) | sign(price at 10:00 ET − PDC), used only for decisions in the last RTH half-hour | RTH | SPY 1993–2013, R² ~1.6% ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)) | A (SPY; futures transfer unverified) |
| Prior-period range | +1 above PWH (or PDH), −1 below PWL (or PDL), 0 inside | PDH/PDL RTH; PWH/PWL clock week | Practitioner; Osler indirect | C |
| Side of period open | sign(price − WO) or sign(price − DO): the developing HTF candle's direction | Clock | Nothing beyond the Gao window | C |
| Premium/discount | pos = (price − range low) / (range high − range low); longs only below 0.5 in UP | Last completed CONTEXT swing range or prior week | ICT convention; no evidence found | C |

The 52-week lookback is the closest W1 equivalent of the published 12-month lookback in AQR's dataset, which spans January 1985 to December 2009 and is robust across sub-samples, lookbacks and holding periods ([AQR](https://www.aqr.com/Insights/Datasets/Time-Series-Momentum-Original-Paper-Data)). Shorter values of 13 or 26 weeks are alternatives to pre-commit, not values to tune. Two qualifications apply to the TSMOM evidence. It comes from diversified, monthly-rebalanced portfolios, not single-instrument entries. And the persistence partially reverses beyond about twelve months, so even the strongest bias signal has a horizon limit. The notes leave the EMA-slope lag k open; one bar is the simplest reading of "slope", and it should be fixed before the first review. The premium/discount 0.5 line is the 0.5 retracement of the same swing range that [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md) anchors on. Under the confluence rule it cannot count as independent confirmation of a Fib zone.

*(Proposal.)* Use STRUCTURE(CONTEXT) as the primary test and one momentum test as a disagreement detector, and stop there. When they disagree, the stack is in TRANSITION, not trending. That is the notes' own example of a flip in progress: "weekly structure +1 but weekly EMA slope −1". An additive score across many tests invites hidden curve-fitting, so any score is for display only.

```
# Evaluated only at CLOSE of the CONTEXT bar; every input carries confirm_time <= t
def context_state(stack, t):
    s = STRUCTURE(stack.CONTEXT).state_at(t)        # UP, DOWN, RANGE, TRANSITION (detector per 01)
    if s in (RANGE, TRANSITION):
        return s
    if stack.CONTEXT == W1:
        m = sign(close_W1[1] - close_W1[1 + 52])     # TSMOM, grade A mechanism
    else:
        d = EMA(stack.CONTEXT, 13)[1] - EMA(stack.CONTEXT, 13)[2]
        m = 0 if abs(d) < 0.1 * ATR(stack.CONTEXT)[1] else sign(d)
    if m == -dir(s):
        return TRANSITION                            # structure and momentum disagree
    if open_G2_event_against(stack.CONTEXT, s, t):   # LTF close beyond CONTEXT protected swing
        return TRANSITION                            # G2 = provisional, "stand aside"
    return s
```

## A four-state machine resolves every timeframe conflict

Every framework uses the same precedence: **the higher layer owns direction, the lower layer owns timing**. Triple Screen trades only with the long-term trend and uses the intermediate chart to find moves against it ([ForexOp](https://forexop.com/technical/multiple-timeframe-trade-analysis/)). LuxAlgo treats an LTF break against the HTF trend as "internal, corrective movement until the higher timeframe's own structure actually breaks" ([LuxAlgo](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). Brooks-style traders treat a two-legged counter-move inside a trend as the entry itself ([NexusFi](https://nexusfi.com/a/strategies/two-legged-pullback-trading)). It follows that a SETUP layer running against CONTEXT is not a conflict. It is the setup. A real conflict, one that should block trading, exists only when the CONTEXT layer itself is ranging or changing. These precedence rules are framework conventions; no empirical work compares conflict-resolution rules.

| State | CONTEXT | SETUP | Meaning | Eligible setups | Direction |
|---|---|---|---|---|---|
| **A: aligned trend** | UP (or DOWN) | Same direction | Impulse in progress | Breakout-pullback, H1/L1, ORB with CONTEXT, inside-bar or NR break with CONTEXT | CONTEXT only; no fades |
| **B: HTF trend, SETUP pullback** | UP (or DOWN) | Opposite, RANGE or TRANSITION | Correction inside an intact trend: the primary state | H2/L2, 2B of the pullback extreme, pin or engulfing at LOCATION, inside-bar or NR break with CONTEXT, three-push pullback end, TRIGGER-layer CHoCH back with CONTEXT | CONTEXT only |
| **C: HTF range** | RANGE | Any | No directional permission | Failed breakout/2B at range edges and PDH/PDL; OCO inside-bar or NR breaks; reduced size, targets inside the range | Both, at edges only |
| **D: HTF transition** | TRANSITION (structure–momentum disagreement, or open G2 event) | Any | Bias being re-decided | None for this stack; a lower-degree stack runs its own state machine | None |

The notes allow intraday scalps in State D "only in the direction of the setup layer with tight targets". In stack terms, a swing stack in State D stands aside, while a scalp stack whose CONTEXT is that swing stack's SETUP layer evaluates its own state. No layer ever trades two roles. The G-grades from [01](01%20Swing%20points%20across%20timeframes.md) map directly onto the states. A G1 touch or sweep of the CONTEXT protected swing is a test, not a change. In State C it is a candidate 2B, and it leaves State A/B intact. A G2 close on a lower layer beyond the protected swing moves the stack to D ("stand aside"). The notes phrase the same rule as "if the setup-layer pullback closes beyond the last bias-layer confirmed swing low, bias resets to 0". A G3 close of the CONTEXT bar beyond the protected swing is a confirmed CHoCH, and STRUCTURE(CONTEXT) stays TRANSITION until new swings confirm.

```
def stack_state(stack, t):
    c = context_state(stack, t)
    if c == TRANSITION: return D
    if c == RANGE:      return C
    s = STRUCTURE(stack.SETUP).state_at(t)
    return A if dir(s) == dir(c) else B       # SETUP against, ranging or turning = correction

# Precedence: CONTEXT grants direction; LOCATION says where; SETUP says which pattern is live;
# TRIGGER fixes entry and initial stop and may NEVER change direction permission;
# MANAGEMENT uses LOCATION levels for targets and named-layer swing prices for trails.
```

One case needs a rule written down per strategy. It occurs when two upper timeframes disagree, for example a weekly downtrend under a daily uptrend in a stack where W1 is only LOCATION. The swing notes offer two deterministic options. The first is to label the state CONFLICT and trade only failure setups at the higher layer's levels, or stand aside. The second is to take the nearer layer as CONTEXT and use the farther one only for targets and level maps. *(Proposal.)* Prefer the second option. It keeps the gate count at three, and it turns the weekly disagreement into a concrete MANAGEMENT rule: a long target is capped at the nearest opposing W1 level (PWH or a SWING(W1) high) instead of reaching past it.

## Bar-shape triggers time entries but carry no proven edge

Most classic patterns can be coded without ambiguity if three things hold. The thresholds (body and wick ratios, lookback N) are fixed in advance. Trend context comes from the CONTEXT layer rather than from the pattern. Entry is a stop order beyond the signal bar. The coded definitions below come from the notes, and their thresholds are conventions, not evidence. The level-proximity tolerance reuses the set's 0.15 × ATR(L) equal-highs tolerance *(proposal; the notes give only "± buffer")*.

```
# Closed signal bar on layer L: O,H,L,C; prior bar O1,H1,L1,C1
# R = H-L; Body = |C-O|; UW = H - max(O,C); LW = min(O,C) - L; ATR = ATR(L); tol = 1 tick
bull_pin     = LW >= 2*Body and LW >= 0.6*R and UW <= 0.25*R and R >= 0.8*ATR
               and (L <= level + 0.15*ATR or L == lowest_low(N))        # must sit at LOCATION
bull_pin_2B  = L < level and C > level and C >= L + (2/3)*R             # 01's encoding: one-bar sweep + close back
bull_engulf  = C1 < O1 and C > O and Body > abs(C1 - O1)
               and O <= C1 + tol and C >= O1 - tol                      # strict variant adds H >= H1 and L <= L1
inside       = H < H1 and L > L1                                        # strict; "ii" = two consecutive inside bars
outside      = H > H1 and L < L1
outside_dir  = +1 if C >= L + (2/3)*R else -1 if C <= L + (1/3)*R else 0
NR4          = R == min(R[0..3]);  NR7 = R == min(R[0..6])              # every NR7 is also an NR4
ID_NR4       = inside and NR4                                           # on D1: inside day + narrowest of 4
# Entry: stop order 1 tick beyond the signal bar's extreme in the permitted direction.
# Initial stop: 1 tick beyond the opposite extreme (or beyond the swept level's extreme).
```

**Pin bar.** The "lower shadow at least twice the body, little or no upper shadow" rule is the commonly cited Nison-style hammer; it was not checked against Nison. The R ≥ 0.8 × ATR clause screens out tiny bars. The pin belongs on the SETUP layer at a LOCATION level and is entered on the TRIGGER layer via a stop above the pin high or a trigger-layer break. It fails in three typical ways: pins mid-range with no level, pins against CONTEXT, and, on time bars, pins spanning the RTH open or close or a news minute. The swing notes argue it is best encoded not as a shape but as a one-bar sweep of a confirmed level with a close back inside, which makes it a 2B. *Grade: D as a shape alone; C at a level in CONTEXT direction; as a one-bar 2B it inherits the 2B rationale below.*

**Engulfing.** Bulkowski's large equity sample has bullish engulfing "reversing" 63% of the time, ranked 22 of 103 candle patterns ([ThePatternSite](https://thepatternsite.com/BullEngulfing.html)). Bearish engulfing reverses ~79% of the time, but the move "runs out of steam almost immediately" ([StockCharts](https://articles.stockcharts.com/article/stockcharts-insider-every-candlestick-scan-in-the-library-ranked-and-why-the-popular-ones-may-fall-short/)). Bulkowski's "reversal" means the direction of the next breakout, not profit, and the data are stocks, not futures. Use it as a TRIGGER with a near target, never as a swing signal. The swing notes treat it as the earliest bar-level proxy for a TRIGGER-layer CHoCH, noisier than the swing-based version. *Grade: D alone; C as a trigger in State B.*

**Inside bar.** Strict inequality is the default; pick strict or inclusive once and keep it. The breakout enters 1 tick beyond the inside bar, or beyond the mother bar in the stricter variant. In States A and B it trades only the CONTEXT side. In State C it can be bracketed with both sides as an OCO pair. Its signature failure, a false break followed by reversal through the opposite side, is itself the "failed inside-bar breakout" trap. Nested inside bars should be clustered as one compression. *Grade: C.*

**Outside bar.** Direction comes from close location (top or bottom third). It is a SETUP-layer event that often marks a failed breakout on one side, and it is noise mid-range. *Grade: C.*

**NR4, NR7 and ID/NR4 (Crabel).** NR4 is the narrowest range of the last four bars, NR7 of the last seven, and an inside day sits inside the prior day's range ([LuxAlgo](https://www.luxalgo.com/library/concept/nr4-nr7-narrow-range-bars/)). The ID/NR4 combination is neutral until price breaks one side via stop orders ([Trading Setups Review](https://tradingsetupsreview.com/inside-daynr4)). The classic layer is D1, which for ES/NQ should be RTH-built to match the RTH opening range that usually follows; label ETH-built versions explicitly. The same rule works intraday as NR7 on M15 or H1. The failure modes are two-sided whipsaw and the low-range days that precede scheduled news (CPI, FOMC, and EIA for CL). One warning matters for ES. A table attributed to Kaufman reportedly shows an inside-day filter improving ORB win rates in bonds and soybeans but worsening them in the S&P 500, from 68% to 61% ([Learning-TA](https://learning-ta.pages.dev/learn/opening-range-breakout)). That is secondhand and unverified, but it is enough not to assume the filter helps index futures. *Grade: C.*

**Reading these patterns on volume bars.** The volume notes give interpretation rules derived from the equal-volume construction; they are reasoning, not tests. A volume-bar wick was formed within a fixed participation budget, so a long wick means price was rejected within N contracts. That makes wicks more comparable across sessions than an overnight 5-minute wick built on a few hundred lots. An engulfing bar now engulfs a bar of equal volume, so its meaning reduces to directional displacement. An inside bar becomes a cleaner measure of compression per unit of volume. Volume bars essentially never gap within a Globex session, so gap patterns exist only at forced session breaks. The partial bar at each session break must be flagged and excluded from range comparisons, pattern tests and pivot counts. Galen Woods writes that "unlike range charts, we are able to apply bar pattern analysis on constant volume charts," while warning that "the only way to find out is to test" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). No study shows any candlestick behaving better on volume bars.

## Level and structure setups carry the plausible mechanism

The setups in this section are where the one solid microstructure finding applies. Stop orders cluster just beyond watched levels, so a move through them either cascades (breakout continuation) or is absorbed and reverses (failed breakout). Osler's FX order data show executed stop-loss buys clustering just above round numbers. Trends become "unusually rapid" when those clusters are hit, with effects "statistically significant for hours, although not for days" ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). The research cannot say which outcome dominates at a given touch, and that is why the state machine, not the trader, decides which of the two opposing setups is eligible.

```
# Levels: confirmed SWING(SETUP or CONTEXT) extremes, PDH/PDL, PWH/PWL, ORH/ORL, range edges. Bull side shown.

# Breakout-pullback (State A)
breakout  = SETUP bar closes > level                               # BOS semantics when level is a swing
pullback  = within M = 5 SETUP bars: low <= level + 0.15*ATR(SETUP)
            and no SETUP close < level - 0.15*ATR(SETUP)            # otherwise: failed breakout
mature    = bars_since_breakout >= 2                                # Brooks: 2-3 bars without failing
trigger   = TRIGGER-layer CHoCH_UP or H1/H2 buy stop after the pullback low
stop      = 1 tick below pullback low

# Failed breakout / 2B (State C at range edges; State B at the pullback extreme)
probe     = high >= level + 1 tick
fail      = within M <= 3 SETUP bars, a SETUP bar closes < level
entry     = sell stop 1 tick below the low of the close-back-inside bar
stop      = 1 tick above max(high since probe)
strict    = also require the level's own layer to close back inside  # adds up to one bar of lag

# Opening range breakout (States A/B, CONTEXT direction only)
ORH, ORL  = high, low of first X minutes after the RTH open          # X pre-declared per strategy: 5, 15 or 30
long      = buy stop at ORH + k ticks                                # k pre-declared; notes give no value
skip      = (ORH - ORL) > cap * ATR(D1)                              # cap pre-declared; notes give no value

# Brooks H2, bar-count interpretation (pick ONE interpretation and document it)
in CONTEXT UP:
  pullback_active once a SETUP bar's high < prior bar's high
  count += 1 each time a bar's high > prior bar's high while pullback_active   # H1, then H2
  at count == 2: buy stop 1 tick above signal bar high; stop 1 tick below pullback low
  reset on a new trend high, or on a G2 close beyond the CONTEXT protected low (-> State D)
# two-leg interpretation: count completed down-legs of SWING(SETUP) instead of bar highs

# Wedge / three-push top
SH1 < SH2 < SH3 confirmed on SWING(SETUP); e2 = SH2 - SH1; e3 = SH3 - SH2; require e3 < e2
trigger   = SETUP close below the latest confirmed minor swing low after SH3   # strict: 2B of SH3
```

**Breakout-pullback.** Brooks' terms supply the timing. A breakout pullback is a small pullback of about **1–5 bars** shortly after a breakout. A "failed failure" is a breakout pullback. And once a breakout has gone **2–3 bars without failing**, a later "failure" more often just sets up the pullback entry ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/)). The M = 5 window and the bars_since_breakout ≥ 2 maturity gate encode exactly that. The ±0.15 × ATR band around the level is a proposal. The failure mode is a deep pullback that closes back inside, which converts the setup into its opposite. *Grade: B* (consistent practitioner consensus; Osler's stop-cascade evidence is indirect support).

**Failed breakout / 2B.** Sperandeo's 2B is a new high beyond the prior swing high that fails to follow through and falls back below the prior extreme. It is distinct from his 1-2-3 trendline-break reversal ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/); the book itself was not read). Brooks' failed breakout reverses "within a bar or a few bars", which is why the M window must be short and fixed. Wyckoff's spring and upthrust are the same event at a range edge. Two failures are typical: a genuine breakout that merely retests, and a 2B taken against a strong CONTEXT trend. *Grade: B.*

**Opening range breakout.** Crabel's ORB articles appeared as a multi-part series in *Technical Analysis of Stocks & Commodities* in 1989 ([Traders.com](https://store.traders.com/-v07-c04-orb-pdf.html)); they were not read. The futures nuance is the definition of "open": RTH 09:30 ET for ES/NQ, or the 09:00 ET pit-session convention for CL, rather than the 18:00 ET Globex open. Results will differ between them. The failures are breaks that immediately reverse (the trap, which is the 2B setup at ORH/ORL), low-volatility days, and very wide opening ranges, which is why the OR width is capped against ATR. The intraday momentum result (first half-hour from the prior close predicts the last half-hour) is indirect support for "early direction persists" ([Gao et al. working paper](https://www3.nd.edu/~zda/intramom.pdf)). *Grade: B.*

**PDH/PDL and PWH/PWL interactions.** These are not separate setups. They are the reference extremes fed into breakout-pullback (States A/B) or failed breakout/2B (State C). Letting the state choose avoids the incoherent position of being eligible for both at the same level. Vendor statistics such as "~67% of the time when YM breaks the previous day's high, the session closes green" ([Edgeful](https://www.edgeful.com/blog/posts/previous-days-range-trading-mistake)) publish no sample, method or significance test. *Grade: B* (Osler's watched-level effect, FX evidence; no futures-specific study).

**H1/H2 and L1/L2.** H1 is the first attempt to resume a trend after a pullback begins, and H2 the second attempt after a two-legged pullback. The entry is a stop above the signal bar and the stop goes beyond the second leg ([NexusFi](https://nexusfi.com/a/strategies/two-legged-pullback-trading)). The coding problem is definitional. One secondary source counts a bar whose *high* exceeds the prior bar's high, another a bar that *closes* above it ([Scribd Brooks setups](https://www.scribd.com/doc/305118912/Brooks-Setups); [Elite Trader](https://www.elitetrader.com/et/threads/al-brooks-method.296854/post-5816507)). Labeling is debated even on Brooks' own forum ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/high-12-low-12/)), and an open-source coded interpretation exists ([TradingView](https://www.tradingview.com/script/YUixSlPL-Al-Brooks-Second-Entry/)). H1/H2 entries are most reliable in trends. In trading ranges every push is a potential H1/H2 that fails, and signal bars are labeled in hindsight ([NexusFi](https://nexusfi.com/a/strategies/signal-bars-entry-bars-price-action)), which is why the count is only eligible in States A and B. No reliable published win rate exists. *Grade: C.*

**Wedge / three-push.** This is three successive extremes whose extensions shrink, followed by a break of the latest minor swing low. It is the riskiest pattern to automate, because what counts as a "push" depends on swing granularity. It must use SWING(L) at the set's default k = 2.0, never a hand-picked detector. The code shows the bearish top, which is a fade and therefore eligible only at range edges in State C. Its mirror, three shrinking pushes *down* inside a CONTEXT uptrend, is a State B pullback-exhaustion entry in the CONTEXT direction. *Grade: C.*

| Setup | Best layers | Eligible states | Entry / initial stop | Main failure modes | Grade |
|---|---|---|---|---|---|
| Pin bar | Shape on SETUP at LOCATION; entry on TRIGGER | B; C at range edges | Stop beyond pin high / beyond pin low | Mid-range pins; against CONTEXT; time bars spanning open, close or news | D alone → C |
| Engulfing | SETUP or TRIGGER | B | Stop beyond engulfing extreme | Follow-through fades fast | D alone → C |
| Inside bar / ii | SETUP or TRIGGER | A, B (CONTEXT side); C (OCO) | 1 tick beyond inside or mother bar | False break, then reversal | C |
| Outside bar | SETUP | B, C | By close location | Mid-range noise | C |
| NR4 / NR7 / ID-NR4 | D1 (RTH) classic; M15/H1 intraday | A, B (CONTEXT side); C (OCO) | 1 tick beyond NR bar, or next ORH/ORL | Whipsaw; pre-news compression | C |
| ORB | RTH OR on M1/M5 or VB-C/VB-B | A, B | k ticks beyond ORH/ORL | Immediate failure; quiet days; wide OR | B |
| Breakout-pullback | Break on SETUP; re-entry on TRIGGER | A | TRIGGER break / below pullback low | Close back inside = failed breakout | B |
| Failed breakout / 2B | Probe and fail on SETUP; entry on TRIGGER | C; B at pullback extreme | Below close-back bar / above probe high | Genuine breakout that retests; against strong CONTEXT | B |
| H1/H2, L1/L2 | SETUP (5-minute tradition; M5 or VB-B) | A (H1), B (H2) | Signal bar ± 1 tick / beyond pullback extreme | Ranges; definition ambiguity | C |
| Wedge / three-push | SETUP | C at range edges; B when the three pushes are the pullback (CONTEXT direction) | Minor swing break after push 3 | Push granularity; strong trends extend | C |
| PDH/PDL, PWH/PWL | Clock LEVELS feeding the two setups above | A/B → breakout-pullback; C → 2B | Per host setup | Taking both setups; ETH/RTH level mismatch | B |

## The HTF candle works as a lens; Power of Three does not work as a theory

Watching the developing daily or weekly candle is coherent and codable. Its open, its current range, and the side of the open price is on are, mathematically, just the sign and shape of the current D1 or W1 bar. The notes propose four fields computed on every TRIGGER bar: side of the open, position within the developing range, whether the prior period's high or low has been taken, and expected remaining range (ATR minus the range so far). The last field gives a usable risk filter: do not start a with-trend scalp once the day's range already exceeds about **1.2 × ATR(D1)**. That is a reasonable precaution, not a proven edge. One implementation rule is non-negotiable. The lens must be computed from the TRIGGER stream's own data with explicit session boundaries, never by reading an HTF series' current bar, so that historical and live behavior are identical.

```
# Computed from LTF ticks/bars with explicit session boundaries (never from an HTF series' forming bar)
for P in (D1, W1):                                   # state D1 session: RTH (09:30 ET) or ETH (18:00 ET)
    open_P     = DO if P == D1 else WO
    hi_P, lo_P = running high / low of current period up to t
    side_P     = sign(price - open_P)                # developing candle direction
    pos_P      = (price - lo_P) / max(hi_P - lo_P, tick)
    took_high  = hi_P > prior_period_high            # PDH / PWH already taken?
    took_low   = lo_P < prior_period_low
    room_P     = ATR(P)[1] - (hi_P - lo_P)           # expected remaining range
block_new_with_trend_scalp = (hi_D1 - lo_D1) > 1.2 * ATR(D1)[1]
```

ICT's "Power of Three" (PO3, or accumulation–manipulation–distribution) takes the same anatomy and turns it into a story. A period consolidates near its open, runs stops on the wrong side of the open, then expands in the "true" direction into the close ([FXOpen](https://fxopen.com/blog/en/what-is-ict-po3-and-how-do-traders-use-it/); [LuxAlgo](https://www.luxalgo.com/library/concept/accumulation-manipulation-distribution/)). Its timing definitions conflict. One indicator fixes accumulation at 19:00–01:00 EST, manipulation at 01:00–07:00 and distribution at 07:00–13:00 ([LuxAlgo PO3 indicator](https://www.luxalgo.com/library/indicator/5thZ7SVC-power-of-3-ict-01-amd-ict-smc-accumulations/)). Another maps Asia to accumulation, the New York open to manipulation and the New York session to distribution ([FXOpen](https://fxopen.com/blog/en/what-is-ict-po3-and-how-do-traders-use-it/)). Even a vendor that teaches it answers "No" to whether every day follows the sequence ([LuxAlgo](https://www.luxalgo.com/library/concept/accumulation-manipulation-distribution/)). The deeper problem is logical. Any bullish daily candle with a lower wick has, by construction, traded below its open and closed above it, so PO3 "explains" every such candle after the fact and, as usually stated, cannot be falsified. No independent test of PO3 was found, and "Candle Range Theory" returned no citable source at all. *Grade: C.*

PO3 becomes testable only as a conditional claim: *if by time T price has traded at least X below the session open and then reclaims the open, the probability of closing above the open exceeds the unconditional rate.* That is a failed breakdown (2B) of DO or WO, and the failed-breakout code above implements it with the period open as the level. X and T must be pre-declared, and the user's forward log can then count the conditional frequency directly. The restatement also exposes a conflict. The strongest rigorous evidence on the opening move, Gao et al.'s first-half-hour result, is about **continuation** of the early move. PO3 claims the early move is the fake-out. The user should not adopt "the first move is manipulation" as a default bias. The defensible use of the open-reclaim 2B is in State C, or where CONTEXT already agrees with the reclaim direction. *Grade for the open-reclaim 2B: C,* because the open's status as a watched level is practitioner lore.

## Watched levels need exact clock definitions

Practitioners treat prior-period highs, lows and closes, overnight extremes, period opens and the initial balance as the core reference levels. The platform education material adds that confluence of levels from different methods is often treated as stronger ([NinjaTrader](https://ninjatrader.com/Futures/Blogs/How-to-Identify-Intraday-Support-and-Resistance-Levels-in-Your-Trading)). The rigorous evidence that watched levels matter at all comes from FX. In Osler's study, rates bounced off levels published by six firms **60.8% of the time versus 56.2% for arbitrary levels**. Published levels beat arbitrary ones in all 16 firm-currency pairs, and the predictive power lasted at least five business days ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). The same paper reports that "none of the firms correctly assessed the relative likelihood of trend interruptions at the different levels." That is a direct warning against elaborate level-strength scoring. Osler's order-clustering work supplies the microstructure explanation for why such levels work ([New York Fed SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.html)). Academic opinion on support and resistance as a whole remains unsettled, with "equally numerous and convincing" evidence on both sides ([arXiv](https://arxiv.org/abs/2101.07410v1)). No peer-reviewed futures-specific study was found for PDH/PDL, ONH/ONL, the weekly open or the IB.

| Level | Definition in this set | Clock / session | Notes |
|---|---|---|---|
| PDH / PDL / PDC | Prior RTH day high, low, close | RTH 09:30–16:00 ET (ES/NQ) | An ETH-day version must be named explicitly as such |
| ONH / ONL | Overnight high, low | Globex 18:00 ET → RTH open | |
| PWH / PWL / PWC | Prior week high, low, close | Week opens Sunday 18:00 ET (Globex) | Holiday weeks and rolls matter |
| WO / DO | Weekly open / daily open | WO = Sunday 18:00 ET; DO stated per strategy (RTH 09:30 or Globex 18:00) | DO is the reference for the HTF candle lens |
| IBH / IBL | RTH initial balance, first 60 minutes | RTH | Market Profile convention |
| ORH / ORL | Opening range, first X minutes | RTH (CL: state the 09:00 ET convention if used) | X stated per strategy |
| Monthly open, prior month H/L | Computed from D1 data | Clock | *(Proposal)* LOCATION only, never a decision candle; the user decides whether this respects the 1-week cap. Excluded by default. |

These session times should be verified against current CME hours and against each platform's session template, since Rithmic- and Tradovate-fed platforms use different templates. Mismatched templates are the most common source of "my levels don't match" bugs. Every level is computed on clock time from the tick stream, including on volume-bar stacks. The volume notes are blunt here: never derive an opening range or prior-day level from "the first K volume bars." One more level type has the most direct order-data evidence, round numbers, where Osler finds stop orders clustering just beyond rates ending in 00 or 50 ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). It is not in the shared LEVELS set, and [06](06%20How%20the%20dimensions%20interact.md) and [08](08%20Proposals%20price%20action%20and%20swing.md) decide whether to use it. Volume-at-price levels (POC, VAH/VAL, nPOC) are the independent LOCATION dimension under the confluence rule and are covered in [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md).

## The evidence supports trend and levels, not candlesticks

The research splits cleanly into three findings. Candlestick patterns, tested mechanically as standalone signals in large liquid US stocks, mostly fail rigorous testing. Trend persistence in futures and early-session momentum intraday are robust. And nobody has tested multi-timeframe filtering itself.

| Claim | Best evidence | Sample | Result | Grade |
|---|---|---|---|---|
| Standalone candlesticks predict returns | Marshall, Young & Rose, *JBF* 2006 ([EconPapers](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323)) | 28 patterns, DJIA stocks 1992–2002, bootstrap | "Neither bullish nor bearish candlestick signals reliably generate abnormal returns" ([CXO](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/)) | D |
| Same, futures | German index futures, 19 patterns (secondary citation) ([IJEFI review](https://econjournals.com/index.php/ijefi/article/download/9298/pdf/23008)) | German index futures | Negative | D |
| Same, older or less efficient samples | Caginalp & Laurent 1998 ([EconPapers](https://econpapers.repec.org/RePEc:taf:apmtfi:v:5:y:1998:i:3-4:p:181-205)); Lu, Shiu & Liu 2012 ([EconPapers](https://econpapers.repec.org/RePEc:eee:revfin:v:21:y:2012:i:2:p:63-68)); Lu 2014 ([EconPapers](https://econpapers.repec.org/RePEc:eee:pacfin:v:26:y:2014:i:c:p:65-78)) | S&P 500 stocks 1992–96; Taiwan 2002–08 | Positive, including newly mined patterns | Context-specific |
| Extrema-based patterns carry information | Lo, Mamaysky & Wang, *JF* 2000 ([EconPapers](https://econpapers.repec.org/RePEc:bla:jfinan:v:55:y:2000:i:4:p:1705-1765)) | US stocks 1962–96 | Distributional information, not demonstrated profit | B (for swing-based structure) |
| Trend persistence | Moskowitz, Ooi & Pedersen, *JFE* 2012 ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)) | 58 futures/forwards | Persistence 1–12 months, partial reversal beyond | A |
| Intraday momentum | Gao, Han, Li & Zhou, *JFE* 2018 ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)) | SPY 1993–2013 | First half-hour predicts last; R² ~1.6%; stronger with volatility and volume | A |
| Watched levels interrupt trends | Osler 2000 ([New York Fed](https://www.newyorkfed.org/research/epr/00v06n2/0007osle.html)); stop cascades, Osler 2002 ([SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)); S/R at depth peaks, Kavajecz & Odders-White *RFS* 2004 ([IDEAS](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)) | FX 1996–98; NYSE | 60.8% vs 56.2% bounces; cascades last hours | A (mechanism); futures transfer unverified |
| MTF alignment improves LTF signals | None found | — | Untested | C (consensus only) |

Caginalp & Laurent reported out-of-sample significance near 36 standard deviations and almost 1% profit over two days on three-day reversal patterns. But the sample is short and old, and transaction-cost treatment was not verified. Lu & Shiu found existing two-day patterns unprofitable in Taiwan, with only two *new* patterns working ([EconPapers](https://econpapers.repec.org/RePEc:mes:emfitr:v:48:y:2012:i:0:p:41-57)). The overall pattern is what small, regime-dependent and partly data-mined edges would produce: failure in large liquid US stocks under bootstrap, success in older samples, less efficient markets, or with patterns mined from the same data. ES and NQ are among the most liquid markets in the world, so **standalone candlestick edges there should be presumed absent**. The intraday-momentum explanations are rebalancing in the first and last half-hours and late-informed traders acting on morning information ([nd.edu](https://www3.nd.edu/~zda/intramom.pdf)). ES tracks SPY closely, so the effect plausibly transfers, but that was not verified for futures.

The strongest counter-argument deserves a fair hearing. Greg Morris's critique of Marshall et al. is that mechanical tests ignore the short-term trend context needed to identify patterns ([CXO](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/)). The MTF approach supplies exactly that context: direction from CONTEXT, and the pattern only at a LOCATION level. That is a hypothesis, not evidence, because no rigorous study tests context-conditioned candlesticks. **The design implication is to put the evidence where it exists and ask the patterns for nothing they cannot deliver.** CONTEXT comes from simple trend and momentum on the slowest layers (W1/D1 structure and the TSMOM sign). Intraday direction can lean on the opening move in Gao's window. LOCATION means widely watched levels where stops plausibly cluster. The TRIGGER is a simple stop-entry pattern whose real product is a defined stop: an objective price beyond which the trade idea is wrong. Judged that way, a trigger is good if it gives a tight, unambiguous stop that rarely needs discretion, not if it "predicts".

## Synchronizing layers without look-ahead on four platforms

The rule of thumb is short. **Decisions use only closed HTF bars, or a developing HTF bar computed explicitly from LTF data.** The single most common look-ahead error in visually reviewed price action systems is plotting a swing at its pivot bar and letting signals reference it before its confirming bars have closed. The chart then looks better in review than the strategy behaved live. Every swing therefore stores both its extreme time and its confirmation time, and every rule checks confirm_time ≤ t.

**Custom code on the Rithmic/Tradovate stream.** The user's repo already integrates R|Protocol and Tradovate, and those native platforms do not appear to offer multi-timeframe strategy scripting themselves (unverified). That makes a custom engine the natural path, and it also gives the cleanest guarantees. Build every layer, clock and volume, from one trade stream under one session template, and label every bar by its close time. When several layers close at the same instant, process them from highest to lowest, so the TRIGGER evaluation sees a CONTEXT bar that closed at that same instant. That is not look-ahead, because the CONTEXT bar's close time ≤ t. For volume bars, a higher tier is known only when its own last contract prints. With exact integer multiples its close coincides with a lower-tier close. A D1 bar is known only at the session close and a W1 bar only at Friday's close, so a volume bar closing at t may use only clock bars whose close time ≤ t, and any "developing" value is computed from ticks up to t. Two guards come from the volume notes. A clock guard cancels a signal from a volume bar that took longer than a set number of minutes, or a setup that has not triggered within T minutes. An event guard suspends entries around scheduled releases, which compress many bars into seconds.

```
# One stream (Rithmic LastTrade with aggressor side); one session template per stack
on trade(ts, px, qty, aggressor):
    if not tradable(trade): return                       # drop off-market prints (verify feed flags)
    levels.update(ts, px)                                # PDH/ONH/IB/OR/DO/WO on clock time
    for tier in (VB_C, VB_B, VB_A): vb[tier].add(ts, px, qty)     # split convention, break at session start
    for tf in (M1, M5, M15, H1, H4, D1, W1): tb[tf].add(ts, px, qty)

on bars_closed(closed, t):                              # every bar carries t_open, t_close
    for bar in sort_by_layer_rank_desc(closed):          # highest layer first at equal timestamps
        swing[bar.layer].update(bar)                     # emits Swing{price, extreme_time, confirm_time}
        snap[bar.layer] = state(bar.layer)               # STRUCTURE, phase, protected swings, asof = t_close
    if stack.TRIGGER in layers(closed):
        assert all(s.asof <= t for s in snap.values())
        st = stack_state(stack, t)                       # A/B/C/D from snapshots only
        if clock_guard_ok(t) and event_guard_ok(t):
            evaluate eligible setups; submit stop-entry + bracket on the execution feed
        log(t, st, snap, levels, developing_HTF)         # full stack snapshot for visual review
```

**NinjaTrader 8.** Secondary series are added with `AddDataSeries()`, which "should ONLY be called from the OnStateChange() method during State.Configure", with hardcoded arguments. `BarsInProgress` identifies which series fired `OnBarUpdate()`, and you should check `CurrentBars[n]` for every series before processing ([NT8 Help](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). The ordering rule creates a subtle lag: "your primary bars series will always be processed first" when timestamps match. On an M5 primary at 10:00, the H1 bar closing at 10:00 has not been processed yet, so `Closes[1][0]` still holds the 09:00 bar. That is conservative, with no look-ahead, but it costs one HTF bar at boundaries. To use the just-closed H1 value at 10:00, act in the `BarsInProgress == 1` event. With `Calculate.OnBarClose`, "bars are not considered closed until the first tick of the following bar comes in". With `OnEachTick` the live OHLCV "is different than on historical data", and real-time event order matches history only with Tick Replay. Timestamp granularity limits how accurately tick- and second-based trigger layers can be synchronized, and orders should go to the most granular series ([NT8 Help](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). A 2016 beta-forum report of the primary series not driving `OnBarUpdate` with an added daily series is old and should be re-checked on the current build ([NinjaTrader forum](https://forum.ninjatrader.com/forum/historical-beta-archive/version-8-beta/91294-adddataseries-and-onbarupdate)). NT8 volume bars restart at each session's first tick and can leave a partial last bar, configurable via "Break at EOD". The docs do not say whether a print that crosses the threshold is split ([NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)).

```csharp
// Sketch: M5 primary = TRIGGER, H1 = CONTEXT, M15 = SETUP (hardcoded per NT8 docs)
protected override void OnStateChange() {
    if (State == State.Configure) {
        AddDataSeries(BarsPeriodType.Minute, 60);  // BarsInProgress 1
        AddDataSeries(BarsPeriodType.Minute, 15);  // BarsInProgress 2
    }
}
protected override void OnBarUpdate() {
    if (CurrentBars[0] < 1 || CurrentBars[1] < 1 || CurrentBars[2] < 1) return;
    if (BarsInProgress == 1) { UpdateContext(); return; }   // H1 closed: update CONTEXT here
    if (BarsInProgress == 2) { UpdateSetup();   return; }
    EvaluateTrigger();  // primary; at shared timestamps it runs BEFORE the H1/M15 updates
}
```

**TradingView Pine.** The documented non-repainting HTF request is `request.security(symbol, timeframe, expression[1], lookahead = barmerge.lookahead_on)`, and "neither can be removed without compromising the integrity of the function." Using `lookahead_on` without the `[1]` offset "will return data from the future on historical bars, which is dangerously misleading" ([Pine docs: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). On realtime bars, an un-offset request returns the developing HTF value regardless of confirmation ([Pine docs: Other timeframes](https://www.tradingview.com/pine-script-docs/concepts/other-timeframes-and-data/)). `calc_on_every_tick` strategies will "most probably not generate the same order executions" as on history. `barstate.isconfirmed` avoids the repaint that `barstate.isnew` causes, and `timenow` logic always repaints. Community guidance blocks requests for timeframes at or below the chart's own ([TradingView](https://www.tradingview.com/script/W1YpYcOI-Higher-timeframe-requests/)). For this user the larger problem is bar type. TradingView's "Volume candles" chart type varies candle *width* by volume on what appear to be time candles; it is not constant-volume bars ([TradingView](https://in.tradingview.com/support/solutions/43000724995)). True fixed-volume bars exist only as community scripts such as CBTV, which runs in a separate pane ([TradingView](https://in.tradingview.com/script/3fKYlqbQ-Candles-Based-On-Traded-Volume)). That makes TradingView a weak host for a VB stack.

```
// Sketch: H1 CONTEXT values on a lower chart without repainting
ctxClose = request.security(syminfo.tickerid, "60", close[1], lookahead = barmerge.lookahead_on)
ctxEma   = request.security(syminfo.tickerid, "60", ta.ema(close, 13)[1], lookahead = barmerge.lookahead_on)
```

**Sierra Chart.** Referencing another timeframe generally means a separate chart per timeframe, pulled into the destination via the Study/Price Overlay study. Sierra engineering stated in 2014 that "a separate chart is absolutely required" ([Sierra Chart Support Board](https://www.sierrachart.com/SupportBoard.php?ThreadID=12439)). Users report overlay data behaving as effectively "static", comparisons with the overlay's previous bar not evaluating as expected, and studies on overlaid data drifting out of sync ([thread 24016](https://www.sierrachart.com/SupportBoard.php?ThreadID=24016); [thread 75318](https://www.sierrachart.com/SupportBoard.php?ThreadID=75318)). The official overlay and ACSIL multi-chart docs were not retrieved. Sierra is, however, the best documented of the four for volume bars. "When using Volume Per Bar, it is necessary that New Bar at Session Start be enabled." Sierra recommends Split Data Records for exactly constant bars, notes that the final in-progress record is not split, and offers a CME option to combine fills into the original aggressor summary trade ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). Whatever the platform, its volume-bar settings must match the bot's builder exactly: size, split versus overflow, session break and recalibration date. Otherwise the bot "sees" different candles from the ones the user reviews.

## How to visually verify MTF signals on your charts

The user will not backtest, so visual review and forward validation carry all the weight. They only work if the chart shows exactly what the bot knew at each moment. The checks below catch the failures that make a reviewed chart look better than live trading. They are design proposals built from the implementation rules in the notes; none is a sourced procedure. Run the parity checks once per stack before any strategy review, and the per-signal checks on every logged signal. Bar replay serves here as a visual audit of what the engine saw, not as a performance test.

| Check | How to run it on the chart | What a failure looks like |
|---|---|---|
| Session-template parity | Plot the bot's PDH/PDL/PDC, ONH/ONL, IBH/IBL, DO and WO over the platform's own versions | Lines differ by the overnight extreme or by a whole day |
| H4 anchor parity | Compare bot and platform H4 bar boundaries on ETH | H4 highs and lows disagree on the short session bar |
| Volume-bar parity | Same VB-C size, VB-B = 4×, VB-A = 5×, split convention, session break and recalibration date; compare bars per session and VB-A close timestamps | Bot candles differ from chart candles, especially around large prints |
| Confirmation markers | Draw each swing at its extreme plus a second marker at its confirm_time | Any signal printed before the confirmation markers of the swings it uses |
| Nesting check | Every SWING(CONTEXT) price should equal some SWING(SETUP) price | An HTF swing with no LTF counterpart means mismatched thresholds or templates |
| Granularity | Count SETUP swings per CONTEXT leg over a few weeks | One per leg = layers too close; more than ~10 = trigger layer too noisy |
| State rows | A colour band per layer for STRUCTURE, one row for A/B/C/D, a line at the pending trigger price | Signals in State D, or against CONTEXT in A/B |
| Developing-HTF policy | Draw the developing D1/W1 range and any provisional swing in a distinct style | Provisional (G2) elements opening trades rather than only suspending them |
| Snapshot replay | For each logged signal, step bar replay to the signal bar and compare against the logged stack snapshot | Any input whose confirm_time is later than the signal time |
| Live-vs-reload parity | Next morning, reload the prior session and compare plotted signals with the live log | Signals that moved, vanished or appeared = repainting or template drift |
| Failure tagging | Tag each losing or skipped trade with a named failure mode from the setup table | One failure mode dominating points to a rule fix, which is pre-declared and dated |

Two habits make the review honest. First, organize the forward log by stack state, not just by setup. The central untested claim of this whole write-up is that trading only with CONTEXT, at LOCATION, improves outcomes, and the log can only probe it if each trade records whether it came from State A, B or C, what grade of trend change was open, and how far price was from the nearest opposing level. Second, change parameters only on a schedule and only with a dated note. The weekly VB recalibration is the only scheduled change in this set. Never re-size bars intraday, because that redraws history and silently moves every swing. Any other change gets a pre-declared date and applies only from that date forward. That keeps a forward record from quietly becoming an optimization.

## Conclusion

Seen this way, an MTF stack is a method for moving evidence from where it exists to where it is needed. Robust results live at the slow end (trend persistence over weeks to months) and at the level (stop clustering at watched prices). The fast end, where entries happen, has almost none. The stack lets a trader borrow direction from the first two and use the third only for what it does well: placing an objective stop. That reframes what to watch in forward validation. A trigger should be judged by the stability of the stop it produces and how often its failure mode appears, not by a win rate. The four-state machine is the actual strategy, and setups are interchangeable parts slotted into States A, B and C. That makes the state log, not the pattern log, the place where the user's forward record can say something new.

Two less obvious conclusions follow for this user. Volume bars are not a compromise with price action but its fix below the daily bar. They remove the ETH/RTH ratio problem that breaks Elder's factor of five on Globex, and by construction they make a wick or an inside bar at 03:00 represent the same participation as one at 09:31. Above the daily bar, and for every reference level, clock time still rules, so the hybrid stack is the design rather than a workaround. Second, the Gao-versus-PO3 conflict is the clearest single case where "proven concepts" should overrule a popular narrative. The peer-reviewed default is that the early move continues. Any strategy that bets on the open being a fake-out has to earn that bias as a pre-declared 2B, in the state where fades are allowed, and in the forward log.
