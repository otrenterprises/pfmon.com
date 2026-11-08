# Confirmed swings drive structure across timeframes

*Write-up 01 of the multi-timeframe strategy research set. Reading order and the shared conventions live in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md). This document owns swing definitions, swing hierarchy, market structure and the multi-timeframe swing framework. Bar-pattern geometry lives in [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md), and how swings combine with profiles and Fibonacci grids lives in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md).*

Swing point theory, read as swing points with price action across timeframes, comes down to three codable pieces. The first is a swing detector from one of two families: bar-count pivots, or price-threshold (directional-change) reversals. The second is a state machine that reads the alternating list of *confirmed* swings as UP, DOWN, RANGE or TRANSITION. The third is a nesting rule: every higher-timeframe (HTF) swing is also one of the lower timeframe's swings, and the HTF trend changes only when an HTF bar closes beyond its own protected swing (grade G3). Every classic school (Larry Williams, Bill Williams, DeMark, Gann, Dow, Brooks, Wyckoff, Sperandeo) fits these pieces once its missing numbers are fixed. This set fixes them as pre-committed defaults. **SWING(L) is a directional-change detector at 2.0 × ATR(L), with ATR frozen at the extreme. Pivot(3,3) is the alternative. Higher degrees use a k, 2k, 4k ladder.** Automation is only precise if each swing stores two timestamps, the extreme and the confirmation, and only confirmed swings drive decisions. Many setups that look obvious on a chart that ignores this cannot be traded live. The evidence is honest but thin. Peer-reviewed and central-bank research shows that watched levels, usually prior peaks and troughs, interrupt trends more often than chance: **60.8% versus 56.2%** for arbitrary levels in Osler's FX test ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). It also shows that stop orders cluster just beyond salient levels. But the labels built on top (BOS, CHoCH, 2B, sweeps, multi-timeframe alignment) have no rigorous tests, and standalone candlestick triggers failed the one rigorous test found. Swing structure therefore earns its place as a framework for location, gating and risk definition, not as a signal generator. It carries over intact to constant-volume bars because the directional-change detector does not depend on the clock.

## Two detector families cover every classic swing definition

Almost every published swing definition can be coded as one of two families. **Bar-count pivots** call bar *c* a swing high when its high beats the highs of L bars to the left and R bars to the right. **Price-threshold reversals** call a running extreme a swing once price has retraced at least θ from it. ZigZag (points or percent) and the academic directional-change (DC) framework both belong to the second family. Brooks, Wyckoff and Dow are conceptual layers on top of these families. Their texts give no canonical numbers, so each must be pinned to a family before it can be coded ([TradingView: Larry Williams Market Structure](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure); [NinjaTrader 8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm); [Glattfelder, Dupuis & Olsen 2011](https://arxiv.org/abs/0809.1040)).

The bar-count family is the one traders recognize on sight. The Bill Williams fractal is a five-bar pattern: the middle high beats the two highs on each side. It cannot be known until the two right-hand bars close, so platforms plot it two bars in the past ([MetaTrader 5 Help: Fractals](https://www.metatrader5.com/en/terminal/help/indicators/bw_indicators/fractals)). Larry Williams defines a short-term high as "a day with lower highs (excluding inside days) on both sides." He then builds intermediate- and long-term highs by applying the same test to the list of short-term highs ([TradingView script](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)). DeMark TD points are symmetric pivots at Level 1, 2 or 3 bars per side. DeMark reportedly preferred Level 1 because higher levels confirm too late ([MarketInOut: DeMark TD Points](https://www.marketinout.com/blog/demark-td-points-and-td-lines)). Gann swing charts classify each bar as higher, lower, inside or outside. The swing line turns after N consecutive higher or lower bars, with inside bars ignored. The 2-bar chart is the common standard and the 3-bar chart marks intermediate swings ([Optuma KB: Gann Swing Charts](https://www.optuma.com/kb/charts/gann-swing-charts)). Even platform vendors downplay these tools: NinjaTrader calls its own Swing indicator "**mostly a visual tool and not meant to be predictive in nature**" ([NinjaTrader 8 Help: Swing](https://static.ninjatrader.com/support/helpGuides/nt8/swing.htm)).

The threshold family has the stronger formal footing. Glattfelder, Dupuis and Olsen split the price curve into directional-change and overshoot sections. They call the result "intrinsic time," an activity-based clock ([arXiv:0809.1040](https://arxiv.org/pdf/0809.1040)). Tsang's notation separates the **extreme point (EXT)**, which is known only in hindsight, from the **DC confirmation point (DCC)**, the real-time event that reveals it ([Tsang, DC Notations](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf)). No major futures platform ships an ATR-scaled ZigZag. NinjaTrader 8 offers points or percent only, and Sierra Chart's three Zig Zag modes are percent, fixed amount, and fixed amount plus a minimum bar count ([Sierra Chart: Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). Lo, Mamaysky and Wang explain why neither family uses raw one-bar extrema. They rejected P(t−1) < P(t) > P(t+1) because "it identifies too many extrema, and also yields patterns that are not visually consistent" with what analysts see ([LMW, NBER WP 7613](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)).

| School | Family | Codable rule | Known when | What must be added before coding |
|---|---|---|---|---|
| Bill Williams fractal | Bar-count | H[c] > H[c±1], H[c±2] | 2 bars after the pivot bar | Tie rule |
| Larry Williams ST / IT / LT | Bar-count, recursive | ST: high above nearest non-inside bar each side; IT: ST high above neighbouring ST highs; LT: same on IT | ST ≥ 1 bar; IT/LT only when a lower ST/IT high forms to the right | Outside-day rule (not in sources) |
| DeMark TD point, Level n | Bar-count | Symmetric n-bar pivot; TD line through the two most recent qualifying points | n bars | Breakout qualifiers (sources disagree) |
| Gann N-bar swing chart | Bar sequence | Line turns after N consecutive higher/lower bars; inside bars ignored | ≥ N bars | Outside-bar rule (Optuma and Bilson differ) |
| ZigZag / directional change | Threshold | Extreme confirmed once price retraces ≥ θ | Variable in bars, fixed in price (≥ θ) | θ scaling (ATR is not native) |
| Dow peaks and troughs | Conceptual | Rising peaks and troughs = bull; mirror = bear | Depends on detector | A "significance" detector |
| Brooks swings, legs, H1/H2 | Conceptual | Swing trade = "at least two legs" | Depends on detector | Leg definition (none published) |
| Wyckoff SC, AR, ST, spring, upthrust | Conceptual, range-based | Range bounds from SC low and AR high; spring = failed break of support | Depends on detector | Range detector, failure window |
| Sperandeo 1-2-3, 2B | Conceptual, swing-list | Patterns over consecutive confirmed swings | Depends on detector | Trendline rule, "immediately" window |
| SMC internal vs swing structure | Two bar-count degrees | Short pivot length = internal, long = swing | Pivot length | Close vs wick, pivot lengths |

*Sources for the table: the citations above plus [Incredible Charts: Dow Theory](https://www.incrediblecharts.com/technical/dow_theory_trends.php), [Brooks Trading Course: swing trading definition](https://www.brookstradingcourse.com/ask-al/swing-trading-definition-and-discussion/), [TradingWyckoff: Spring](https://tradingwyckoff.com/en/spring-shakeout/), [RoboForex: Sperandeo 1-2-3 and 2B](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/), [Optuma: Gann Swing Chart Overlay](https://www.optuma.com/kb/tools/swings/gann-swing-chart-overlay) and [LuxAlgo: SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/). Several originals (Williams, Bill Williams, Gann, Sperandeo, Brooks) were known only through secondary implementations.*

### The default detector: directional change at 2.0 × ATR(L)

This set uses one convention. **SWING(L)** is the directional-change detector on layer L with reversal threshold **k × ATR(L), k = 2.0, ATR frozen at the moment the extreme is set**. **Pivot(L,R) with 3/3** is the alternative. The DC detector is the default for four reasons, all drawn from the notes. It guarantees strict alternation of highs and lows. It produces a clean hierarchy, because every swing at 2θ is also a swing at θ, which bar-count pivots do not guarantee. Its lag is fixed in price, not bars. And it works the same on time bars, volume bars and raw ticks. Freezing ATR at the extreme matters because a drifting ATR can turn an already-confirmed swing back into an unconfirmed one. The pivot alternative is easy to read on every platform and is final once confirmed. But consecutive same-type pivots must be reconciled by hand, and its meaning changes across bar types. Both detectors need two rules fixed and documented in advance. The **tie rule** is strict ">" on the left and "≥" on the right, so the first of two equal extremes wins and a double top on equal bars produces exactly one pivot. The **outside-bar rule** says: when one OHLC bar both extends the extreme and retraces θ, extend first and test the reversal from the next bar. If tick data shows the true intrabar order, use that order. Sierra Chart documents exactly this case as the source of real-time-versus-recalculated disagreement ([Sierra Chart: Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). These rules are design choices synthesized from the notes, not quotations.

```
Swing { layer, type: H|L, price, extreme_time, extreme_bar,
        confirm_time, confirm_bar,               # first moment the rule could know it
        detector: "DC(k=2.0, ATR14 frozen)" | "Pivot(3,3)",
        degree: 0|1|2 (k, 2k, 4k), label: HH|HL|LH|LL|EQH|EQL,
        status: PROVISIONAL (display only) | CONFIRMED | TAKEN,
        ltf_bar_of_extreme }                     # for drawing this swing on lower layers

SWING(L) default — directional change, evaluated at close of each bar t on layer L
  state: mode ∈ {UP, DOWN}, ext_price, ext_time, thr
  if mode == UP:
      if H[t] > ext_price:                       # extend first; strict ">" = first equal extreme wins
          ext_price, ext_time = H[t], time_of_high(t); thr = 2.0 * ATR(L)[t]   # freeze threshold
      elif ext_price - L[t] >= thr:               # directional-change confirmation (DCC)
          emit Swing(H, ext_price, ext_time, confirm_time = close_time(t), status = CONFIRMED)
          mode = DOWN; ext_price, ext_time = L[t], time_of_low(t); thr = 2.0 * ATR(L)[t]
  else: mirror using lows
  publish the running extreme as PROVISIONAL for display; never trade it

Pivot(3,3) alternative — at close of bar t, test c = t - 3
  isPH = all(H[c] > H[c-i], i=1..3) and all(H[c] >= H[c+j], j=1..3)
  isPL = mirror on lows;  emit with confirm_bar = t
  two same-type pivots in a row → keep the more extreme (earlier on ties)
```

**Evidence grade: not an edge claim.** Detectors are measurement conventions. The DC framework's measurement properties are peer-reviewed (A as geometry), while each school's specific numeric rules come from practitioner texts, mostly retrieved through secondary implementations (C).

## Swing degree is recursion, and every step up multiplies the lag

Swing hierarchies come from running the same "higher than its neighbours" test on the *list of lower-degree swings* instead of on bars. Williams states this directly: an intermediate-term high is "any short-term high with lower short-term highs on both sides," and a long-term high applies the same rule to intermediate highs ([TradingView script](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)). DeMark levels nest by construction, since every Level 3 point is also a Level 1 point ([MarketInOut](https://www.marketinout.com/blog/demark-td-points-and-td-lines)). Gann practitioners use 1-, 2- and 3-bar charts for minor, standard and intermediate swings. Dow nests primary trends, secondary reactions and minor moves ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). SMC vendors draw "internal" structure from a short pivot length and "swing" structure from a long one. They advise defining trend with the slow degree and timing entries with the fast one ([LuxAlgo: SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)). The threshold family gives the cleanest version. Running DC detectors at θ, 2θ and 4θ gives a hierarchy that alternates and never overlaps. Glattfelder et al. describe thresholds of different sizes as "focal points" that blur out irrelevant detail. Their scaling laws hold across **close to three orders of magnitude** of threshold size in 13 FX rates, which supports treating a threshold ladder as one coherent multi-scale structure ([Glattfelder et al.](https://arxiv.org/pdf/0809.1040)). The shared convention follows that design: a ladder of **k, 2k, 4k (2, 4 and 8 × ATR)** when higher degrees are emulated on a single series.

There are two ways to get a hierarchy: recursion on one series, or a simple detector on higher-timeframe bars. They reach roughly the same structure. A short-term swing on W1 bars is roughly an intermediate-to-long-term swing on D1 bars. Recursion keeps one data series and avoids HTF alignment bugs. HTF bars are easier to check by eye. Because this user reviews visually, the notes recommend plotting both and checking that they agree. The link between layers is exact when the data and session template are identical. **An HTF swing high at HTF bar k has price equal to the maximum LTF high inside bar k's span.** Its LTF location is the bar holding that maximum, which is usually also an LTF swing high of some degree. The engine should store `ltf_bar_of_extreme` so HTF levels can be drawn on the LTF chart at the exact bar. Promotion only goes upward and is never guaranteed. An LTF swing becomes an HTF swing only when the HTF detector confirms it: by surviving R HTF bars as the HTF pivot bar's extreme, or, on a ladder, by price retracing 2θ from it before exceeding it. Most LTF swings never promote. Inside an HTF leg they are internal structure. This gives a **machine-checkable nesting test**: every HTF swing price must equal some LTF swing price, or some lower-threshold extreme on a ladder. If it does not, thresholds or session templates are mismatched, and no multi-timeframe rule should be trusted until the mismatch is fixed. All of this is synthesis in the notes, not a sourced result.

Lag multiplies with degree. A Williams intermediate high is not known until a rally fails and a *lower* short-term high confirms to its right. On W1 bars, a Pivot(3,3) low is not usable until three full weeks after the week of the low has closed. A W1 swing under the DC detector needs two weekly ATRs of retracement. The practical consequence runs through every template in this document: **use higher degrees as context and level maps, and the lowest degree as the trigger.** No rigorous study compares recursive hierarchies with multi-timeframe pivots for forecasting value. **Evidence grade: B.** Practitioner consensus is consistent across Williams, DeMark, Gann, Dow and SMC, and the DC scaling laws give indirect support for multi-scale coherence. No test shows that the hierarchy itself predicts anything.

## Market structure is a four-state machine over confirmed swings

Once swings are confirmed and alternating, structure is bookkeeping. Each new confirmed swing high is labelled against the previous confirmed swing high: **HH** if it is higher by more than the tolerance, **LH** if lower by more than the tolerance, **EQH** otherwise. Lows are labelled HL, LL or EQL the same way. The shared tolerance is **0.15 × ATR(L)**, taken from the notes' 0.1–0.25 × ATR range for intraday futures. That replaces LMW's 1.5%-of-price rule, which suits daily stocks. Sierra Chart's Zig Zag already writes these labels to a subgraph as numeric codes (LH = 1, HH = 2, HL = 3, LL = 4). That makes it a ready-made visual cross-check ([Sierra Chart: Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). Dow's definition supplies the trend logic. A bull trend *starts* when a higher low is followed by a rally above the previous high, and *ends* when a lower high is followed by a decline below the previous low. Practitioners still dispute whether one broken sequence ends a trend or whether both a lower high and a lower low are needed ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)).

The shared vocabulary turns this into events. **BOS** is a close beyond the last confirmed swing in the trend direction. **CHoCH** is the first close beyond the *protected* swing against the trend. The **protected low** in an uptrend is the higher low that launched the last BOS, meaning the lowest confirmed swing low since the previous BOS. LuxAlgo calls BOS "continuation of the current direction" and CHoCH "the first warning of a potential reversal," but its page does not say whether a wick or a close counts ([LuxAlgo: SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)). No canonical ICT or SMC text fixes the details. This set resolves the ambiguity with one rule. **A close beyond a level is a break. A wick beyond it followed by a close back inside is a sweep.** The two cannot happen on the same bar, which keeps them visually distinct. Closes below a non-protected swing low inside an uptrend are not events on that layer. They are internal structure, and they may show up as events on a lower layer.

The four-state design below is a proposal. It combines the notes' state-machine pseudocode with Dow's start and end rules. TRANSITION is the state after a CHoCH and before the new direction proves itself with a BOS. RANGE is what TRANSITION decays into when neither direction resolves. The only number not in the notes is the timeout of **three confirmed swings**. The Dow path needs two new confirmed swings (the new extreme, then a lower high) before its break, so a third swing with no break marks the failure.

```
STRUCTURE(L): runs on CONFIRMED swings of SWING(L); evaluated at close of bar t; C = close[t]
state ∈ {UP, DOWN, RANGE, TRANSITION}; dir; protectedLow; protectedHigh; tol = 0.15 * ATR(L)

on confirmed swing s: label it (HH/LH/EQH or HL/LL/EQL vs the previous same-type swing ± tol)
                      if state == TRANSITION: swings_since_choch += 1

UP:   if C > lastSH.price and lastSH.status != TAKEN:
          emit BOS_UP; protectedLow = lowest confirmed SL since previous BOS; lastSH.status = TAKEN
      elif C < protectedLow.price:
          emit CHoCH_DOWN; state = TRANSITION; dir = DOWN
          protectedHigh = trend extreme (highest confirmed SH since the last BOS_UP); swings_since_choch = 0
DOWN: mirror

TRANSITION (dir = DOWN shown; dir = UP mirrors):
      if C > protectedHigh.price:                          # failed CHoCH: old trend resumes
          emit BOS_UP; state = UP; protectedLow = lowest confirmed SL since the CHoCH
      elif a confirmed SH below protectedHigh exists since the CHoCH      # Dow: a lower high...
           and C < most recent confirmed SL since the CHoCH:              # ...then a break of the low
          emit BOS_DOWN; state = DOWN; protectedHigh = that lower high
      elif swings_since_choch >= 3:
          state = RANGE; rangeHigh = max SH, rangeLow = min SL since the CHoCH leg began

RANGE: if C > rangeHigh:
           if last confirmed SL > the SL before it: emit BOS_UP; state = UP; protectedLow = last confirmed SL
           else: emit CHoCH_UP; state = TRANSITION; dir = UP; protectedLow = last confirmed SL
       if C < rangeLow: mirror
phase (UP shown): PULLBACK if the most recent confirmed swing is an SH, else IMPULSE
```

One consequence is worth stating plainly. After a CHoCH followed by a straight-line move, the layer stays in TRANSITION, which means stand aside, until the counter-move confirms a lower high. That is lag by design. The classic named patterns are all paths through this machine. Sperandeo's **1-2-3 top** needs three things: a trendline break, a failed test of the high, and a break below the prior minor low. Two of the three raise the probability of a trend change, and all three define one ([Bulkowski: 1-2-3 Trend Change](https://www.thepatternsite.com/123tc.html); [RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)). In swing terms it is a CHoCH whose point 3 is a confirmed lower high, which makes it stricter than an SMC CHoCH. His **2B** is quoted as: "if prices penetrate the previous high, but fail to carry through and immediately drop below the previous high, the trend is apt to reverse" ([RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/)). Wyckoff's **spring** and **upthrust** are the same failure at a range boundary. A spring is only a test until price closes back inside the range, and a close back below the spring low invalidates it ([LuxAlgo: Spring](https://www.luxalgo.com/library/concept/spring/); [TradingWyckoff: Spring/Shakeout](https://tradingwyckoff.com/en/spring-shakeout/)). LMW define **double tops** on alternating extrema: two tops within 1.5% of their average and at least 22 trading days apart ([LMW](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)). The intraday version here swaps in the ATR tolerance. Brooks' **H1/H2** pullback count corresponds to a lower layer's CHoCH back in the trend direction while the higher layer is in PULLBACK. A two-legged pullback that holds above the swing low that started the impulse keeps the trend intact ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/01-terminology/the-lows-are-labeled-incorrectly/)).

```
SWEEP / 2B against a confirmed, untaken level lvl above price (mirror below); w = 3 bars, minPen = 1 tick
at close of bar t:
  if C[t] > lvl:  lvl broken by close → BOS/CHoCH per STRUCTURE; lvl.status = TAKEN; bos_bar = t
  elif max(H[t-w+1..t]) >= lvl + minPen and all closes in that window <= lvl and C[t] < lvl:
      emit SWEEP_HIGH (one-bar or multi-bar 2B); stop_ref = max(H since first penetration)
  if lvl was TAKEN at bos_bar and t - bos_bar < w and C[t] < lvl: flag that BOS as FAILED (Brooks failed breakout)
```

| Pattern | Swing-list definition | Trigger | Invalidation | Grade |
|---|---|---|---|---|
| Uptrend (Dow) | Last confirmed SH is HH and last SL is HL | — | CHoCH_DOWN | B |
| BOS / CHoCH | Close beyond last untaken swing in trend / beyond protected swing against it | The close | Opposite close beyond the protected swing | C |
| 1-2-3 top | 1 = trend-extreme SH; 2 = next confirmed SL; 3 = next confirmed SH ≤ 1 + tol | Close < point 2 | Close > point 1 | C |
| 2B top / sweep | Wick ≥ 1 tick above an untaken SH, no close above, close back below within 3 bars | SWEEP_HIGH | Close above the sweep high | C (rule); B (mechanism) |
| Spring / upthrust | SWEEP of a RANGE low / high | Close back inside the range | Close beyond the spring low / upthrust high | C |
| Double top | Two confirmed SHs within 0.15 × ATR(L) with a confirmed SL between | Close < that SL (neckline) | Close above the higher top | B |
| H1/H2 (Brooks) | Lower-layer CHoCH_UP during higher-layer PULLBACK in an UP trend | Lower-layer CHoCH_UP | Higher-layer CHoCH_DOWN | C |

The grades reflect the gaps the notes found. BOS, CHoCH, 2B, 1-2-3, Williams' and Gann's trading rules have **no rigorous out-of-sample evidence** in futures. LMW's distributional result for double tops and similar patterns is peer-reviewed, but it covers daily US stocks and uses kernel-smoothed extrema. The 2B and sweep *mechanism* has indirect support from stop-order clustering, covered in the evidence section below.

## Higher timeframes set bias only when their own bars close

The multi-timeframe framework rests on one fact. An HTF swing is a subset of LTF swings, so the HTF's protected swing is also a specific LTF price, and **the HTF trend changes only when price closes beyond that price at HTF resolution.** The working template is the same across eras: Dow's primary, secondary and minor trends, Elder's tide, wave and ripple, and the modern "HTF bias plus LTF structure shift at an HTF level." LuxAlgo's statement of it is the most explicit in the notes. Alignment means "requiring the swing structure of two or more timeframes to agree before acting." A conflict "most often marks a higher-timeframe correction in progress." An LTF break against the HTF trend "is treated as internal, corrective movement until the higher timeframe's own structure actually breaks." The same page warns that "two or three timeframes is typical; beyond that, extra charts mostly add delay and contradiction," and that "nothing about alignment is guaranteed" ([LuxAlgo: Multi-timeframe Structure Alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)). Elder's factor of about five between layers, with some sources giving 4–6, is the spacing convention ([TradingView: Triple Screen scripts](https://www.tradingview.com/scripts/triplescreen/); [AskTraders: Elder's Triple Screen](https://www.asktraders.com/learn-to-trade/trading-guide/elders-triple-screening-strategy/)). Dow's secondary reactions, which typically retrace "one-third to two-thirds" of the primary move, are the classical template for pullback size. They are not a rule ([Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)). How swings map between layers is covered in the hierarchy section above. This section builds the decision framework on that mapping.

### Three grades separate a test of an HTF swing from a trend change

When LTF price reaches the HTF protected swing, three things can happen, ordered from earliest and noisiest to latest and cleanest. The grades below are the shared convention. They are synthesized from the notes' three detection grades, and every strategy must state which grade it acts on.

| Grade | Event (HTF uptrend, HTF protected low P) | Meaning | Allowed use | Cost |
|---|---|---|---|---|
| G1 | LTF bar trades at or through P, LTF close stays ≥ P | Liquidity test; candidate HTF 2B | Location for Template B longs; never a bias change | None; this is information |
| G2 | LTF bar *closes* below P | Provisional HTF CHoCH; can be undone | "Bias suspended": block new Template A/C entries; stand aside | Can be a false alarm |
| G3 | HTF bar *closes* below P | Confirmed HTF CHoCH; STRUCTURE(HTF) → TRANSITION | The only grade that changes bias | Up to one full HTF bar late |

```
P = HTF protected swing with P.confirm_time <= t     # HTF protectedLow shown; mirror for protectedHigh
at close of LTF bar t:
    if low_LTF[t] <= P.price and close_LTF[t] >= P.price: G1(P)
    if close_LTF[t] < P.price:                           G2(P) → bias_suspended = true
at close of HTF bar T:
    if close_HTF[T] < P.price:                           G3(P) → STRUCTURE(HTF) emits CHoCH_DOWN
    elif a G2 occurred inside T:                         HTF_SWEEP(P) (HTF 2B/spring) → Template B candidate; bias_suspended = false
```

The design point is that **G1 and G2 compare live LTF price with an HTF level that was already confirmed**, so they use legitimate real-time information. What a strategy may not use is the developing HTF bar's eventual close, or whether the developing bar will become a pivot.

### Three templates turn HTF bias into LTF triggers

The notes give three codable templates. Each one is a composition of the state machine across layers, written with the shared roles. They are untested building blocks for visual review. Concrete proposals with IDs and full parameters belong in [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md). Any LOCATION refinement that uses Fibonacci or volume-at-price follows the confluence rule in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md).

| Role | Template A: HTF pullback continuation | Template B: LTF swing failure at an HTF level | Template C: HTF breakout pullback |
|---|---|---|---|
| CONTEXT | STRUCTURE(bias) = UP, last event BOS_UP | STRUCTURE(bias) ∈ {DOWN, RANGE}, or UP but extended into a higher layer's swing high | BOS_UP on the bias or setup layer |
| LOCATION | Bias layer in PULLBACK: price between HTF lastSH and HTF protectedLow | A confirmed, untaken HTF swing high or RANGE high | The broken HTF swing level, within 0.15 × ATR |
| SETUP | STRUCTURE(setup) = DOWN during the HTF pullback | Price trades ≥ 1 tick beyond the level | Pullback holds: LTF HL ≥ level − tol, bars_since_BOS ≥ 2, within 5 bars of the BOS layer |
| TRIGGER | Trigger-layer CHoCH_UP | Trigger-layer SWEEP_HIGH, then CHoCH_DOWN | Trigger-layer CHoCH_UP or BOS_UP |
| MANAGEMENT | Stop below the trigger-layer swing low before the CHoCH (tight) or below HTF protectedLow (wide) | Stop above the highest high since penetration; target HTF mid-range or HTF protected low | Stop below the LTF HL |
| Bias invalidation | G3 below HTF protectedLow | HTF bar closes above the level (the break held) | HTF close back below the level (failed breakout) |
| Lineage | Elder tide/wave/ripple; Brooks H2; Dow secondary reaction | Sperandeo 2B; Wyckoff spring/upthrust | Brooks breakout pullback |

Template A is Brooks' H2 at multi-timeframe scale: the LTF downtrend inside the HTF pullback is the "two legs down," and the LTF CHoCH up is the resumption. Template B gets its location from the HTF level and its timing from LTF structure. A stricter variant waits for the HTF bar to close back below the level, which adds up to one HTF bar of lag. Template C applies Brooks' observations that a failed breakout reverses "within a bar or a few bars." A breakout pullback is a 1–5 bar dip, and after a breakout has gone 2–3 bars without failing, a later "failure" more often just sets up a breakout-pullback entry ([Brooks forum: Failed breakout](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/)).

### Alignment states decide which template is eligible

Each layer publishes a snapshot: trend, phase, last event (BOS, CHoCH or SWEEP), bars since that event, and its protected levels with their confirmation times. The stack state follows deterministically. The precedence rules from the notes are short. **Bias comes from the highest state layer. The trigger layer never changes direction permission. A lower layer opposing the bias is a correction until G3 at the higher layer. No strategy uses more than three state layers.** Further layers become level providers (W1 or D1 swing prices drawn on the chart), not gates. This matches the conflict state machine in the companion price-action note, where a counter-trend move on the setup layer within an intact HTF trend *is* the setup ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)).

| Stack state | Condition | Eligible templates | Default action |
|---|---|---|---|
| ALIGNED | Bias UP, setup UP, bias phase IMPULSE | C | No counter-trend trades |
| PULLBACK | Bias UP in PULLBACK, setup DOWN | A | Primary setup state |
| CONFLICT | Two upper layers disagree (e.g., W1 DOWN, D1 UP) | B at the higher layer's levels, *or* adopt the nearer layer as bias and use the farther for targets only | Pick one policy per strategy and document it |
| RANGE | Bias layer in RANGE | B at range edges | No A or C |
| TRANSITION | Bias in TRANSITION, or bias_suspended after a G2 | None, unless an HTF_SWEEP turns it into a Template B candidate (mirrored: long at the swept HTF low) | Stand aside |

An alignment score (+1/−1 per layer, weighted by rank) can be shown on a review dashboard. The notes recommend keeping it **display-only** so it never turns into a hidden optimization target.

### Each layer must find its own swings

Scaling is simple if each layer runs the detector on its own bars. **The same k on each layer's own ATR(L), or the same Pivot(3,3) on each layer's own bars, scales automatically**, and it matches what the trader sees on each chart. When degrees are emulated on one series, the ladder's ratios should match the ATR ratios between the timeframes being emulated. A diffusive heuristic from the notes is that ATR grows roughly with the square root of the time ratio. Under it, a 4–6× time step corresponds to a 2–2.5× threshold step, so **one rung of the k, 2k, 4k ladder stands in for roughly one 4–5× layer step.** Intraday volatility seasonality (the open, the close, news) breaks this heuristic. Measure the actual ATR ratios per instrument instead of assuming them. The stacks below use the shared labels. The ratios are bars of the lower layer per bar of the upper layer.

| Stack (CONTEXT / SETUP / TRIGGER) | Ratios, ETH (~23 h) | Ratios, RTH (6.5 h) | √-ratio ATR step | Note |
|---|---|---|---|---|
| W1 / D1 / H4 | 5; ~5.75 | 5; ~1.6 | 2.2; 2.4 | Swing; ETH bars required |
| D1 / H4 / H1 | ~5.75; 4 | ~1.6; 4 | 2.4; 2.0 | ETH only |
| D1 / H1 / M15 | ~23; 4 | 6.5; 4 | 4.8 or 2.5; 2.0 | RTH-friendly |
| H4 / H1 / M15 | 4; 4 | 4; 4 | 2.0; 2.0 | Intraday swing |
| H1 / M15 / M5 | 4; 3 | 4; 3 | 2.0; 1.7 | Scalp-swing (the notes used 3-minute bars; M5 is the nearest label) |
| VB-A / VB-B / VB-C, with W1 and D1 as levels | 5; 4 by volume | Same | 2.2; 2.0 | Scalp; activity-normalized |
| D1 / VB-A / VB-B, with W1 as levels | ~50; 5 | — | ~7; 2.2 | Intraday; bridge D1 to VB-A with the VB-A ladder |

*The stack ratios come from the notes' table and [LuxAlgo](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/). The square-root column is arithmetic on the diffusive heuristic, not measurement.*

Two checks keep a stack honest. The **granularity check** says each HTF leg should usually contain a handful of LTF swings. If an HTF leg typically holds only one, the layers are too close. If it holds more than about ten, the trigger layer is too noisy for visual review. The **session declaration** says which session each layer's bars use. SWING(D1) on the Globex session and the RTH-defined PDH/PDL are different objects and must not be confused. The W1 layer adds futures-specific hazards. The weekly bar starts at the Sunday-evening ET open. Holiday weeks are short. And back-adjusted continuous series shift historical swing prices by the roll spread, while live participants see unadjusted levels. HTF swing levels should therefore be computed on the contract that will actually be traded. That last point is an inference in the notes, and each platform's roll handling should be checked.

### Price action bars are swing events in miniature

Bar patterns carry swing meaning only at a swing level. The one rigorous test in the notes is negative for standalone use. Marshall, Young and Rose tested **28 candlestick signals on DJIA stocks from 1992 to 2002** with bootstrap methods and found no evidence that the signals predicted price ([RePEc: JBF 2006](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323); [CXO Advisory summary](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/)). Inside a swing context, the defensible job of a bar pattern is timing plus an objective stop just beyond the pattern's extreme. Exact bar geometry (wick ratios, body tests) is defined once in [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md). This document adds only the swing-context condition.

| Bar pattern | Swing-context reading | Encode as | Grade |
|---|---|---|---|
| Pin / rejection bar | One-bar sweep of a confirmed level of the same or a higher layer | SWEEP + close in the opposite third of the bar | D standalone; C in context |
| Engulfing bar | Earliest bar-level proxy for a trigger-layer CHoCH at an HTF level in the bias direction | Optional "early trigger" variant of CHoCH | D standalone; C in context |
| Inside-bar break | Two-bar micro-range. Break with the bias during an HTF pullback = Template A in miniature; break against the bias into an HTF level = Template B candidate. Cluster nested inside bars | Micro-range break | D standalone; C in context |
| Breakout pullback | LTF HL above the broken level within 1–5 bars, with bars_since_BOS ≥ 2 | Template C | C |
| Failed breakout | BOS closed back through within 3 bars | FAILED BOS flag → Template B | C |

**Evidence grades for this section.** HTF-bias plus LTF-trigger alignment: **B**. Consensus runs from Dow through Elder, Shannon, Brooks and SMC vendors, and time-series momentum gives indirect support for trend persistence on the highest layers, but no study tests alignment itself. G1/G2/G3 discipline: **B as a correctness requirement**, because the platforms document it. It is not an edge. Templates A, B and C: **C**. The 4–6× spacing: **C**, an Elder and vendor convention. Bar patterns: **D** standalone, **C** in context.

## Every swing carries two timestamps, and only the second may trade

A swing point has a **pivot time**, when the extreme printed, and a **confirmation time**, when the rule could first know it. Every platform document in the notes reaches the same fix. Pine's manual calls pivot scripts that plot into the past "potentially misleading." It notes that `ta.pivothigh(5,5)` detects the pivot five bars late, and that the only recommended non-repainting HTF request is `request.security(..., expr[1], lookahead = barmerge.lookahead_on)`. Lookahead without the offset "will return data from the future on historical bars, which is dangerously misleading" ([Pine Script: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). NinjaTrader says Swing values are final only after `strength` bars and should be read "the number of swing strength bars ago." It says the ZigZag's "current developing leg should be thought of temporary" and is meaningful only on bar close ([NT8 Help: Swing](https://static.ninjatrader.com/support/helpGuides/nt8/swing.htm); [NT8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)). Tsang puts it most bluntly: a "nowcast" of a directional change made before the extreme point is wrong by definition ([Tsang 2024](https://eprints-gro.gold.ac.uk/37843/1/Intelligent%20Systems%20in%20Accounting%20%20Finance%20and%20Management%20-%202024%20-%20Tsang%20-%20Nowcasting%20directional%20change%20in%20high%20frequency.pdf)). Academic pattern tests built in the same discipline: LMW added a delay parameter *d* = 3 days because "in practice we do not observe a realization of a given pattern as soon as it has completed" ([LMW](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)).

| Detector | Known at | Lag example | What moves before confirmation |
|---|---|---|---|
| SWING(L) DC, k = 2.0 | First close with a retracement ≥ 2 × ATR(L) frozen at the extreme | Always ≥ 2 ATR(L) in price; more after a gap | The provisional extreme of the current leg |
| Pivot(3,3) | Close of the third bar after the pivot bar | On W1: three weekly closes after the week of the extreme | Nothing once confirmed; candidates appear and vanish |
| Bill Williams fractal | Close of the second bar after | 2 bars | Same |
| Williams IT / LT, DeMark Level 3 | When the lower-degree swing to the right confirms | Many bars; variable | Same |
| HTF swing seen from an LTF | Close of the HTF bar that confirms it | Up to one full HTF bar after the HTF detector's own lag | The developing HTF bar |

The lag has a price. With a threshold detector, **at least θ is always given back from the extreme before the swing exists**. On gappy data the confirmation can land well beyond θ. In Tsang's 5% worked example, a downturn from 110 is confirmed at 98, which is 10.91% below the extreme ([Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)). That gap effect applies directly to Globex reopenings and weekend gaps. Glattfelder et al. find that the average overshoot after a directional change is about θ, but they caution that the same result "is also found by computing the probable path of the price within a binomial tree" ([Glattfelder et al.](https://arxiv.org/pdf/0809.1040)). A reversal entry at confirmation therefore captures, on average, about what a random walk would give. **That is geometry, not edge.**

Look-ahead-free automation follows from three rules in the notes. First, build every layer from **one raw stream with one session template**, labelling bars by close time. Second, update each layer only on its own closed bars. Third, let rules read only snapshots whose `confirm_time ≤ t`. Platform event ordering shows why self-built bars are safer. NinjaTrader processes the primary series first when timestamps are equal, and "bars are not considered closed until the first tick of the following bar comes in." So at 10:00 on an M5 primary, the H1 bar closing at 10:00 has not yet been processed in the M5 event. Live results under OnEachTick can also differ from reloaded history ([NT8 Help: Multi-Time Frame & Instruments](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). A custom engine fed by Rithmic or Tradovate data controls this ordering explicitly.

```
for TF in stack (low → high):
    bars[TF]   = resample(raw_stream, TF, session_template, label = BAR_CLOSE_TIME)
    engine[TF] = SwingEngine(SWING(TF), STRUCTURE(TF), tie_rule, outside_bar_rule)

at close of each trigger-layer bar, time t:
    for TF in stack (high → low) with a closed bar at time <= t not yet processed:   # HTF bars closing exactly at t are known at t
        engine[TF].update(bars[TF].last_closed)          # emits confirmed swings and events, each with confirm_time
        snapshot[TF] = engine[TF].state()                # trend, phase, protected levels, last_event, confirm times
    legal:   trigger-layer price vs CONFIRMED HTF levels (G1, G2, SWEEP)
    illegal: the developing HTF bar's final close, or whether it will become a pivot
    developing[TF] = running OHLC of the open TF bar     # display and G1/G2 only, never bias
    evaluate templates using snapshot[CONTEXT], snapshot[SETUP], trigger-layer events
    log signal with the full snapshot stack (every input's confirm_time must be <= t)
```

The notes offer two policies for the developing HTF bar. Under the *strict* policy it is ignored entirely. Under the *provisional overlay* policy it is shown in a distinct style and used only for "bias suspended" flags. This set uses strict for bias and the overlay for display and G2. Historical-versus-live parity follows the same logic: evaluate HTF state only at HTF close, and never mix platform-supplied HTF series with self-built LTF bars. Implementation detail belongs to [07 Automation architecture](07%20Automation%20architecture.md). **Evidence grade: B as a correctness requirement.** It is consistently documented by TradingView, NinjaTrader and Sierra Chart. No published benchmark measures how much performance is lost when moving from repainting logic to confirmed-only logic in futures.

## Pre-committed defaults, not optimized settings

The notes found **no rigorous source for "the right" ATR multiple on intraday ES, NQ or CL.** Every value in circulation looks like practitioner preference or backtest output. The defaults below are fixed in advance, mostly from the middle of the ranges in the notes, and are meant to be changed only after visual review, never by optimization. Values marked "design" are this document's own choices where the notes give no number.

| Parameter | Default | Basis in the notes |
|---|---|---|
| SWING(L) detector | Directional change / ATR-ZigZag | DC framework; ATR scaling recommended, not native on platforms |
| Reversal threshold | k = 2.0 × ATR(L) | k ≈ 1.5–3 for "visually obvious" swings (unsourced judgment) |
| ATR(L) | 14 bars of L; session-aware for RTH layers | Excludes open-gap distortion for ES/NQ |
| Threshold freeze | At the extreme | Prevents confirmed swings from un-confirming |
| Alternative detector | Pivot(3,3) | Trigger-degree pivots 2/2 to 3/3; fractal 2/2; DeMark Levels 1–3 |
| Tie rule | Strict left, ≥ right; first equal extreme wins | "Choose and document"; platforms differ |
| Outside bars | Extend first, test reversal next bar; tick order when available | Sierra's documented real-time vs recalculation case |
| Degree ladder | k, 2k, 4k (2, 4, 8 × ATR) | DC ladder; Glattfelder scaling |
| EQH / EQL tolerance | 0.15 × ATR(L) | 0.1–0.25 × ATR intraday |
| Sweep penetration | 1 tick | Both companion notes use ≥ 1 tick |
| Sweep / 2B / failed-BOS window | 3 bars of the evaluating layer | Sperandeo "immediately" ≈ 1–3 bars; Brooks "a bar or a few bars" |
| TRANSITION → RANGE timeout | 3 confirmed swings | Design; the notes say "m swings" with no number |
| Breakout-pullback window | ≤ 5 bars of the BOS layer, bars_since_BOS ≥ 2 | Brooks 1–5 bars; 2–3 bars of maturity |
| Stop buffer beyond protecting swing | max(2 ticks, 0.1 × ATR(L)) | max(1–2 ticks, 0.1–0.25 × ATR); stop clustering argues against exact-level stops |
| Layer spacing / state layers | 4–6× / at most 3 | Elder; LuxAlgo |
| LTF swings per HTF leg | About 2–10 | "A handful, not one and not dozens" |
| Bias-changing grade | G3 only; G2 = stand aside | Notes' recommended default |
| Volume-bar layers | VB-A, VB-B, VB-C = ADV/50, /250, /1000 of the 20-session ADV; recalibrated weekly; break at session start | Shared convention; 1/50 rule from Easley et al. |

## Volume bars keep the swing logic but change what a bar means

This user prefers constant-volume candles, and swing theory carries over to them more cleanly than most price action does. The statistical case for volume time is real but partial. Easley, López de Prado and O'Hara argue that sampling in volume "removes most intra-session seasonal effects" and allows "a partial recovery of Normality." Their key futures exhibit compares one-minute E-mini S&P 500 sampling against sampling **every 1/50 of average daily volume**, which is the origin of the VB-A size. That evidence is a visual distribution plot with no test statistics ([Easley, López de Prado & O'Hara, "The Volume Clock"](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). A 2026 crypto-futures preprint calls the normality gains "regime-dependent and secondary" ([arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)). Practitioners report that bar-pattern reading survives. Galen Woods writes that "unlike range charts, we are able to apply bar pattern analysis on constant volume charts" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). Asked whether 5-minute trendlines and signal bars carry over to tick charts, Brooks Trading Course staff answered "Yes, and yes." A moderator reported that a roughly 6,500-volume ES chart closely resembled a 5-minute chart in 2021 ([Brooks Trading Course forum: tick chart](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). The fuller treatment of volume bars is in [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md). Below is what changes for swings specifically. These points are inferences from how the bars are built, since the notes found **no study of swing definitions on volume, tick, range or Renko bars**.

The DC detector is unchanged on volume bars and arguably more natural there. Tsang built directional change for tick-to-tick data as event-driven sampling ([Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)), so k × ATR(VB) is an event threshold on an event clock. **ATR on volume bars is closer to stationary** than time-bar ATR, because each bar holds equal participation and most intraday seasonality is gone. A threshold set from ATR(VB-B) is therefore less distorted by the quiet overnight and the busy open than a time-bar threshold, which needs session-aware handling. Pivot(3,3) still works, but "three bars" now means 3 × V contracts. Confirmation can take seconds at the 09:30 ET open and hours in the overnight session. A swing then means "a reversal that held for k × V contracts," which is more consistent in information content but unpredictable in clock duration. The engine builds bars from Rithmic tick prints, so it knows the intrabar order. **The outside-bar ambiguity disappears** when the DC runs on the tick sequence, and every swing's true extreme comes from the ticks, not from the bar boundary. The proposal here is to compute the DC on ticks for exact price and order, but to publish each confirmation at the close of the bar in which the confirming tick printed, so the engine and the chart always agree.

Session handling and clock time need explicit rules. The shared convention breaks volume bars at session start, as Sierra Chart requires for Volume Per Bar. That leaves one partial bar per session ([Sierra Chart: Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). This document proposes that the DC detector use every price, including partial bars, because a price is a price. Pivot counting, by contrast, treats a partial bar as a separator rather than one of the three right-hand bars. Mandelbrot's caveat applies directly: "as long as the flow of local time remains unpredictable," identifying the right local time does not help prediction ([Volume Clock PDF, quoting Mandelbrot 1973](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). So anything with a clock deadline stays on clock time: LEVELS, the W1 and D1 bars, news windows and flat-by-time rules. The volume note proposes a **clock guard** (cancel a pending setup that has not triggered within T minutes) and an **event guard** around scheduled releases. It gives no justified values, so those are set during visual review.

The stack arithmetic also changes. VB-A, VB-B and VB-C are 5× and 4× apart by volume, which matches the 4–6× guidance in bar count. To keep higher-tier bar boundaries aligned exactly with lower-tier boundaries, the sizes should be **exact integer multiples**: round VB-C first, then set VB-B = 4 × VB-C and VB-A = 5 × VB-B, so rounding never breaks the nesting. That is a design proposal building on the volume note's observation that integer-multiple tiers share boundaries. Against the volume note's suggested execution tier of ADV/150 to ADV/300, VB-B falls inside the band. **VB-C, at about 1,000 bars per average session, is faster**: across the 23-hour Globex day that averages under 1.5 minutes per bar, and faster in RTH, where most volume trades. It is a scalping TRIGGER layer, and a Brooks Trading Course forum moderator warns that very fast charts give "more false signals" during breakouts. The jump from D1 to VB-A is about 50 bars, far beyond 4–6×. Under the diffusive heuristic, one D1 ATR spans roughly √50 ≈ 7 VB-A ATRs. The 4k rung of the VB-A ladder (8 × ATR(VB-A)) therefore sits near one D1 ATR and serves as the intermediate degree between them. Measure that ratio on the user's own data before relying on it. Alignment with clock-time layers follows the volume note's rule: at a volume bar's close time, use only time bars whose close time is at or before it.

Other non-time bars fit the same frame. **Range bars** convert a Pivot(L,R) into roughly a threshold rule with θ ≈ R × range, and inside and outside bars largely disappear. A **Renko** reversal is itself a directional change with θ = 2 bricks, so stacking N-bar pivots on Renko only adds lag. **Tick bars** behave like volume bars, but trade counts depend on whether the feed reports CME aggressor summary trades or split fills. **Heikin-Ashi** values are averaged, synthetic prices and must never define a swing or a stop ([NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)). **Evidence grade: C for any swing edge on volume bars** (no studies). The underlying volume-clock statistics are graded in [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md).

## The evidence supports levels, not the labels

The strongest finding in the notes is microstructural, not chart-based. Osler compared support and resistance levels published daily by six FX firms from 1996 to 1998 against 10,000 sets of arbitrary levels on minute data. **Rates bounced off published levels 60.8% of the time versus 56.2% for arbitrary ones.** Published levels beat arbitrary ones in all 16 firm-currency pairs, with significance at 5% in all but three, and the effect persisted for at least five business days. The levels practitioners publish are typically prior reaction lows and peaks. Two further findings matter for system design. "None of the firms correctly assessed the relative likelihood of trend interruptions at the different levels," and the firms agreed with each other only about 30% of the time ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Osler's later order-level study found executed stop-loss buy orders clustered just above round numbers: **14.3% of requested rates ended in 01–10 versus 6.9% in 90–99**. Trends were "unusually rapid" when those clusters were reached, with effects significant "for hours, although not for days" ([Osler 2002, FRBNY SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). Kavajecz and Odders-White found that support and resistance levels coincide with peaks of NYSE limit-order-book depth. They argue technical analysis works by locating liquidity, not by predicting prices ([Review of Financial Studies 17(4), via RePEc](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). LMW found that extrema-based patterns carry incremental distributional information in US stocks from 1962 to 1996, while cautioning that this "does not necessarily imply" excess profits ([NBER](https://www.nber.org/papers/w7613)).

Those results support swing-level trading in both directions. A stop cluster can be absorbed, producing a failure (2B, sweep, spring), or it can be triggered into a cascade, producing a continuation (BOS). **The evidence does not say which one happens in a given instance.** That is exactly why this framework makes the stack state choose in advance which template is eligible. Three caveats limit transfer. The data are FX from the 1990s and US equities, not modern CME futures. Osler's order evidence concerns round numbers and published levels, not swing points directly, and no peer-reviewed study tests stop runs at prior swing highs and lows in CME futures. And decay since publication is unknown. Academic opinion on support and resistance overall is unsettled: one survey describes the evidence on both sides as "equally numerous and convincing" ([Chung & Bellotti, arXiv 2101.07410](https://arxiv.org/abs/2101.07410v1)). On the trend side, time-series momentum across 58 liquid futures and forwards shows 1–12 month persistence ([Moskowitz, Ooi & Pedersen 2012, via EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:104:y:2012:i:2:p:228-250)). That is indirect support for a W1 CONTEXT layer, not for swing-based trend labels as such.

| Concept | Grade | Why |
|---|---|---|
| Prior extremes act as reaction and liquidity levels | A (mechanism) | Osler 2000; Kavajecz & Odders-White 2004; transfer to CME futures unverified |
| Stops cluster just beyond salient levels and cascade when hit | A for round numbers; B extended to swing levels | Osler 2002 order data concern round numbers |
| Round-number proximity as a level attribute | A | Over 70% of published levels end in 0 and 96% in 0 or 5 ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)) |
| Elaborate "strong vs weak swing" scoring | D | The firms' own strength rankings were uninformative |
| DC overshoot ≈ θ as a target forecast | D as edge (A as geometry) | Reproduced by a binomial random walk |
| Dow HH/HL trend and swing hierarchy | B | Consistent practitioner consensus; TSMOM and DC scaling are indirect support |
| BOS / CHoCH / 1-2-3 / 2B / springs as entry rules | C | Vendor and practitioner conventions; no rigorous tests |
| Double tops and bottoms on swing extrema | B | LMW, daily stocks, distributional not profit |
| HTF bias + LTF trigger alignment | B | Consensus; LuxAlgo itself calls it unproven |
| Confirmed-only, G3-for-bias discipline | B (correctness) | Platform-documented; prevents look-ahead, creates no edge |
| Standalone candlestick triggers | D | Marshall, Young & Rose 2006 |
| Templates A/B/C; bar triggers in swing context; swings on volume bars | C | Untested compositions |

## Swings are the anchors other tools borrow

Confirmed swings are the objective anchors for nearly every other tool in this set, and the rule is the same everywhere: **anchor at the extreme, activate at the confirmation.** Stops go beyond the protecting swing plus a buffer. Osler's stop-clustering results argue against placing stops exactly at the obvious level, though they do not say what buffer is optimal ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). FIB(A→B) grids run between confirmed opposite swings of the same detector and degree. They are re-anchored only when a new opposite swing confirms, never to a provisional extreme, and they are invalidated on a close beyond A, as covered in [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md). Anchored VWAP and PROFILE(ANCH(A→B)) start accumulating at the extreme bar but may drive rules only from the confirmation bar onward. LuxAlgo's auto-anchored swing VWAP shows the lag, appearing several bars after the true extreme ([LuxAlgo: Auto-Anchored Swing VWAPs](https://www.luxalgo.com/library/indicator/yGQMVJ90-auto-anchored-swing-vwaps/); [AlphaTrends: Anchoring the VWAP](https://alphatrends.net/?p=623098)). Profiles are covered in [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md). Measured moves project the prior leg of the same degree. The DC 2θ regularity is useful only as a neutral reference distance for scaling targets, not as a forecast.

Two disciplines govern all of these. **Degree consistency**: anchor tools on swings of the same degree as the trade's thesis. An M5 Pivot(3,3) low under a D1-based thesis produces stops that are too tight and retracements the reviewer will not recognize on the D1 chart. **No double-counting**: a Fibonacci level and the swing it was drawn from share an anchor, so their agreement is one piece of information, not two. Volume-at-price is the independent dimension, a point developed in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md). **Evidence grade: B** for stops beyond swings (via the stop-clustering mechanism). **C** for swing-anchored Fibonacci, AVWAP and profiles, which have practitioner support but no tests in the notes.

## How to visually verify the swing engine on your charts

Because this user will forward-validate by eye instead of backtesting, the swing engine needs a review chart designed to expose its own mistakes. The most important display rule comes from Pine's guidance not to hide plotting offsets. **Draw every swing twice: a marker at the extreme bar and a smaller marker at the confirmation bar, joined by a thin connector, with the provisional leg in a dashed style.** That one picture shows the real lag, and it is often where a setup that looked obvious turns out to be untradeable. The research notes judge that referencing the pivot bar instead of the confirmation bar is the most common look-ahead error in visually reviewed systems. Every check below runs from the trader's own charts plus the engine's event log.

| Check | What to draw or run | Pass condition | Failure it catches |
|---|---|---|---|
| Two-marker plot | Extreme marker, confirmation marker, dashed provisional leg | Every signal arrow sits at or to the right of the confirmation marker of every swing it uses | Pivot-bar look-ahead |
| Bar replay | Replay a full ETH session in the platform's replay mode | Confirmed markers appear only at their confirmation bar and never move; only the dashed extreme moves | Repainting; ATR drift from an unfrozen threshold |
| Live versus reload | Diff the live log of confirmed swings against a recompute from history | Identical price, extreme_time and confirm_time | Developing-bar leakage; OnEachTick vs OnBarClose divergence; session mismatch |
| Platform cross-check | NinjaTrader ZigZag in points set to the frozen threshold; Sierra Zig Zag fixed amount and its HH/HL/LH/LL codes; NinjaTrader Swing(3) vs Pivot(3,3) | Same extremes except where ATR changed the threshold; labels agree | Tie and outside-bar bugs; labelling errors |
| Nesting | HTF swings drawn on the LTF chart at `ltf_bar_of_extreme` | Every HTF swing price equals an LTF swing price | Mismatched data, sessions or thresholds |
| Granularity | Count trigger-layer swings per setup-layer leg | Typically 2–10 | Layers too close (1) or trigger too noisy (> 10) |
| Structure ribbon | One row per layer showing UP/DOWN/RANGE/TRANSITION; BOS as solid lines, CHoCH dashed, protected swing as a line until taken | State changes only on a close, never on a wick | Wick-based breaks; sweeps miscounted as BOS |
| G-grade overlay | HTF protected level on the LTF chart with G1, G2 and G3 marks | The bias row changes only at G3; G2 only greys out entries | Bias flipping on LTF closes |
| Edge cases | Equal highs, outside bars, Globex reopen gaps, partial VB bars, roll days, holiday weeks | One pivot per equal pair; outside bars per rule; partial bars flagged | Tie, gap and session bugs |
| Settings parity | Compare engine bars with chart bars: VB size, split vs overflow, session template, New Bar at Session Start, H4 alignment | Same OHLC and same bar count per session | The bot seeing different candles than the trader |

Two habits make these checks routine. First, **log every signal with the full stack snapshot**: each layer's state, phase, protected levels and their confirmation times. Any logged decision can then be replayed and checked for inputs confirmed after the signal time. Second, review G2 events as their own category. They are the moments when an LTF close beyond an HTF protected swing tempts a bias flip. How often they resolve into G3 rather than an HTF sweep is one of the most useful things forward validation can show about a given instrument. That suggestion is this document's inference, not a sourced result.

## Conclusion

The precision of a swing system depends far more on its timestamp discipline than on its detector or its k. Pivots versus directional change, 2.0 versus 2.5 ATR, Williams versus DeMark: these change which swings appear, not whether the system is honest. Storing an extreme time and a confirmation time, acting only on the second, and changing HTF bias only at G3 are what make a chart reviewed by eye behave the same way live. The surprising result of the synthesis is how little the classic schools actually disagree. Once numbers are pinned down, they become one state machine at different degrees. The real choice left to the trader is which of two opposite outcomes, failure or cascade, a given stack state makes eligible.

The evidence implies a modest but coherent role for swing theory. The proven part is that watched extremes are where orders and liquidity concentrate, and HTF swings are simply the most widely watched extremes on the chart. Multi-timeframe swing structure is best understood as a way to decide in advance *where* to pay attention and *which* outcome to bet on there, with bar patterns reduced to stop-defining timing devices. It is not a generator of independent signals. Constant-volume bars fit this framing unusually well, because a directional-change detector is already an event clock: swing logic moves onto volume bars unchanged, while clock time is kept only where clock deadlines actually exist.
