# Swing Point Theory and Market Structure: Machine-Codable Definitions for Automated Futures Trading

Notes compiled 2026-11-08. Context: these are for a discretionary-turned-systematic futures trader (ES/NQ/CL; Rithmic/Tradovate; intraday up to weekly bars) who will not backtest and will visually review every strategy. Source quality is flagged throughout. "Primary" means the original author, the platform's own documentation, or a peer-reviewed or central-bank paper. "Secondary" means practitioner blogs, vendor pages or community scripts. Pseudocode and design rules in the Inferences subsections are my own synthesis. They are not quotations.

## 1. Classic and modern definitions of a swing high/low

### Takeaway
Almost every classic definition is one of two machine-codable families. (a) **Bar-count pivots**: the bar's high exceeds the highs of L bars to the left and R bars to the right. Larry Williams' short-term points, Bill Williams fractals, DeMark TD points, N-bar "strength" pivots (NinjaTrader Swing, Pine `ta.pivothigh`) and the base of Gann swing charts all belong here. (b) **Price-threshold reversals**: an extreme is a swing once price retraces at least θ from it. ZigZag (percent/points), the academic directional-change (DC) framework and Dow-style "significant" peaks/troughs belong here. Brooks, Wyckoff and Dow are conceptual frameworks layered on top. Their source texts do not give one canonical numeric definition, so each must be pinned to family (a) or (b) before it can be coded.

### Cited Findings
**Larry Williams (short/intermediate/long-term points; Long-Term Secrets to Short-Term Trading, 1999)**
- A community implementation quotes Williams defining a short-term high "as a day with lower highs (excluding inside days) on both sides." It quotes an intermediate-term high as "any short-term high with lower short-term highs on both sides" and a long-term high as "any intermediate term high with lower intermediate term highs on both sides." Lows are the mirror image. — [TradingView: Larry Williams Market Structure (open-source script)](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)
- The same nested definitions appear in other practitioner implementations: [ProRealCode: Williams' Highs and Lows](https://www.prorealcode.com/prorealtime-indicators/williams-highs-lows/?pnum=2), [MQL5 article](https://www.mql5.com/en/articles/20511), [LuxAlgo library listing](https://www.luxalgo.com/library/indicator/3bpbtsEs-larry-williams-market-structure/).
- The fetched script page gives no outside-bar rule. Its only special case is the exclusion of inside days. — [TradingView script](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)

**Bill Williams fractals (Trading Chaos)**
- An up fractal is a 5-bar pattern: the middle bar's high is above the highs of the two bars on each side. A down fractal mirrors this with lows. The pattern cannot be confirmed until the two right-hand bars have closed, so the marker is plotted 2 bars in the past. — [MetaTrader 5 Help: Fractals](https://www.metatrader5.com/en/terminal/help/indicators/bw_indicators/fractals); [TradingView Help: Williams Fractal](https://in.tradingview.com/support/solutions/43000591663-williams-fractal/); [LuxAlgo: Williams Fractal concept](https://www.luxalgo.com/library/concept/williams-fractal/)
- Implementations differ on ties. Strict inequality is the common default, and some allow equal highs on one side. Bill Williams used the fractal as a breakout trigger (enter on a break of an up fractal) filtered by his Alligator indicator. — [LuxAlgo](https://www.luxalgo.com/library/concept/williams-fractal/); [Linnsoft: Fractals – Swing Highs, Swing Lows](https://www.linnsoft.com/techind/fractals-swing-highs-swing-lows) (secondary; Williams' original text was not retrieved)

**N-bar pivot strength (platform implementations)**
- NinjaTrader 8 `Swing(strength)`: strength is "The number of required bars to the left and right of the swing point." `SwingHighBar(barsAgo, instance, lookBackPeriod)` returns how many bars ago the nth most recent swing occurred, or -1 if none was found. The swing value is only final once "the strength number of bars has passed since the extreme point," and the indicator "updates it's calculations as new incoming data warrants so." NinjaTrader calls it "mostly a visual tool and not meant to be predictive in nature." To avoid values that change, it recommends reading SwingHigh/SwingLow only "the number of swing strength bars ago," because "those values are calculated in their final state." — [NinjaTrader 8 Help: Swing](https://static.ninjatrader.com/support/helpGuides/nt8/swing.htm)
- TradingView Pine: in the docs' example `pHi = ta.pivothigh(5, 5)`, the pivot is detected 5 bars after it occurs. Scripts "will often go back in the past to plot pivot levels," which the docs class as "potentially misleading." — [Pine Script v6 User Manual: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)

**DeMark TD Points / TD Lines**
- A TD supply point is a bar whose high is above the highs of the bars immediately before and after it. A TD demand point is the mirror with lows. The "level" sets how many bars each side must be beaten (Level 1 = 1 bar each side, Level 2 = 2, Level 3 = 3). Every higher-level point is also a Level 1 point. A downward TD line connects the most recent supply point to the next *higher* supply point to its left. An upward TD line connects the most recent demand point to the next *lower* demand point to its left. Only the most recent two points are treated as active. DeMark reportedly favored Level 1, partly because higher levels take longer to confirm. — [MarketInOut: DeMark TD Points and TD Lines](https://www.marketinout.com/blog/demark-td-points-and-td-lines); [MQL5: TD Points / TD lines article](https://mql5.com/en/articles/1995)
- Some sources add DeMark "qualifier" rules for TD-line breakouts that use closing prices. Sources disagree on the details. — [LiteFinance: TD Lines by Tom DeMark](https://www.litefinance.org/blog/for-professionals/td-lines-by-tom-demark/) (secondary)

**Gann swing charts (1-, 2-, 3-bar)**
- Bar classification: Higher Bar = higher high and higher low. Lower Bar = lower high and lower low. Outside Bar = higher high and lower low. Inside Bar = lower high and higher low. — [Optuma KB: Gann Swing Charts](https://www.optuma.com/kb/charts/gann-swing-charts)
- In the N-bar swing chart, the swing line turns up after N consecutive up bars and down after N consecutive down bars. The 2-bar chart is the common "standard," and the 3-bar chart is the intermediate swing. Inside bars are ignored as neutral and do not reset the count. — [Optuma KB](https://www.optuma.com/kb/charts/gann-swing-charts); [Daily Gann Newsletter: Lesson 2 – Constructing a Swing Chart](https://thedailygannnewsletter.blogspot.com/p/lesson-2-constructing-swing-chart.html); [TheRightTrader: Gann Swing Chart](https://therighttrader.com/learn/elliott-wave-and-cycles/gann-swing-chart) (secondary)
- Outside-bar handling differs by implementation. Optuma plots the swing at the outside bar's high if the following bar is lower, or at its low if the following bar is higher. The Bilson method treats UP→OUTSIDE→UP as an outside-bar swing low and UP→OUTSIDE→DOWN as an outside-bar swing high. Optuma also has a "Cluster Outside and Inside Bars" property, and community coders call runs of consecutive inside/outside bars the hardest case. — [Optuma KB: Gann Swing Chart Overlay](https://www.optuma.com/kb/tools/swings/gann-swing-chart-overlay); [TradingView: Bilson Gann Count](https://in.tradingview.com/script/yXeHjiuc-Bilson-Gann-Count); [Optuma FAQ: MA6 vs Optuma Gann Swings](https://help.optuma.com/kb/faq.php?id=775)

**ZigZag (percent / points; ATR is not native in the major platforms)**
- NinjaTrader 8 ZigZag parameters: `deviationType` (Points or Percent), `deviationValue`, `useHighLow` ("When true, both High and Low price series are used"). The docs describe it as "a reactive filter showing extreme price points." It "can update it's current direction and price extreme point based on newly incoming data," and "the current developing leg should be thought of temporary until a new leg in opposite direction has been set." It "is only meaningful to work with in Calculate.OnBarClose mode." — [NinjaTrader 8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)
- Sierra Chart Zig Zag has three modes. Mode 1 uses a percent reversal. Mode 3 uses a fixed price amount. Mode 2 uses a fixed amount plus a "Number of Bars Required for Reversal" and allows an earlier reversal when the prior line's endpoint is broken. It uses bar High and Low. The reference describes no ATR/volatility mode. The line "does not always extend to the very last bar," and real-time versus full recalculation can put a reversal on different bars when one bar both makes a new extreme and triggers a reversal. The fix is "Calculate New Values on Bar Close." Other inputs include "Reset Zig Zag at Start of Trading Day," and HH/HL/LH/LL labels are written to a subgraph (LH=1, HH=2, HL=3, LL=4). — [Sierra Chart Technical Studies Reference: Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)
- Search-result snippets from Sierra Chart support-board threads (not opened; the board requires login) indicate two things. A reversal exactly equal to the threshold does not register (users enter 1.99 instead of 2.0). And a 2016 thread asked for an ATR-referenced reversal amount, with no sign it was implemented. — [Sierra Chart Support Board (login-gated)](https://www.sierrachart.com/SupportBoard.php?ThreadID=18484) (user posts; which thread holds which statement is unverified; treat as weak)

**Directional-change (DC) framework (academic)**
- Glattfelder, Dupuis & Olsen dissect the price curve into DC and overshoot sections. The algorithm "measures occurrences of a price change ∆x_dc from the last high or low (i.e., extrema), if it is in an up or down mode, respectively." At each DC, the overshoot of the previous DC is "the difference between the price level at which the last directional change occurred and the extrema." "The high and low price levels are then reset to the current price and the mode alternates." The authors call this an "activity-based time-scale called intrinsic time." The paper was published in Quantitative Finance 11(4):599–614 (2011). — [arXiv:0809.1040 (Glattfelder, Dupuis, Olsen)](https://arxiv.org/abs/0809.1040); [full PDF](https://arxiv.org/pdf/0809.1040)
- Tsang's notation: the threshold θ is set by the observer, usually as a percentage. The upward DC confirmation price is P_DCC↑ ≥ P_EXT × (1 + θ), with the running extreme tracked as a state variable. The **extreme point** (EXT) is the turning point, and the **DC confirmation point** (DCC) is when the reversal becomes known. DC events are recorded in hindsight relative to EXT. The overshoot runs from the DCC to the next extreme. — [Tsang, DC Notations (CCFEA WP 2014)](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf); [Tsang, Directional Change for Handling Tick-to-tick Data (2021)](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)
- Tsang's worked 5% example: a trend starting at 110 is confirmed as a downturn at 98, which is 10.91% below 110, and that point is a DCC. — [Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)

**Dow Theory peaks/troughs**
- Hamilton (The Stock Market Barometer, 1922) and Rhea (The Dow Theory, 1932) systematized Dow's editorials. A primary bull trend is a series of rising peaks and rising troughs, with each rally exceeding the prior rally's high and each decline ending above the prior low. A bear trend is the mirror. Practitioners disagree on whether one broken sequence ends a trend or whether both a lower high *and* a lower low are required. Classical Dow also requires the Industrials and Rails/Transports to confirm each other. — [Incredible Charts: Dow Theory – Trends](https://www.incrediblecharts.com/technical/dow_theory_trends.php); [TheDowTheory.com: Two typical Dow Theory misconceptions](https://thedowtheory.com/dow-theory-update-for-july-19-two-typical-dow-theory-misconceptions-i/) (secondary; the original texts were not retrieved)

**Al Brooks (swing highs/lows, legs)**
- In an Ask-Al Q&A, Brooks says a swing trade needs "at least two legs. Maybe 10 bars — but certainly at least two legs." — [Brooks Trading Course: Swing trading definition and discussion](https://www.brookstradingcourse.com/ask-al/swing-trading-definition-and-discussion/)
- High 1 / High 2 (H1/H2) counts the attempts to resume an uptrend after a pullback. H1 is the first attempt and H2 comes after two legs down. In Brooks' charts the H1/H2 labels sit on the signal bar, and entry is on the bar that completes the setup. — [Brooks Trading Course forum: "The lows are labeled incorrectly"](https://www.brookstradingcourse.com/support-forum/01-terminology/the-lows-are-labeled-incorrectly/); [NexusFi: Two-legged pullback](https://nexusfi.com/a/strategies/two-legged-pullback-trading) (secondary)

**Wyckoff swing structure**
- A spring is a break below trading-range support that finds little further selling and quickly reverses back inside the range (Phase C of accumulation). An upthrust / UTAD is the distribution mirror above resistance. A secondary test (ST) retests the selling-climax area on lower volume and a narrower spread, generally stopping at or above the selling-climax (SC) low. The SC low and the automatic-rally high set the range boundaries. — [TradingWyckoff: Secondary Test](https://tradingwyckoff.com/en/secondary-test/); [TradingWyckoff: Spring/Shakeout](https://tradingwyckoff.com/en/spring-shakeout/); [LuxAlgo: Spring](https://www.luxalgo.com/library/concept/spring/); [LuxAlgo: Upthrust](https://www.luxalgo.com/library/concept/upthrust/)
- Sources disagree on terminology. Some reserve "upthrust" for distribution only, while TradingWyckoff also uses it for shakeouts in accumulation. — [TradingWyckoff](https://tradingwyckoff.com/en/spring-shakeout/); [NexusFi thread](https://nexusfi.com/showthread.php?p=911575)

**Kernel-regression local extrema (Lo, Mamaysky & Wang 2000)**
- LMW detect patterns by smoothing prices with nonparametric kernel regression and taking local extrema of the smoothed curve, using sign changes of its derivative. They then locate the actual max/min in the raw price series near each one. They reject raw local extrema (P_{t-1} < P_t > P_{t+1}) because "it identifies too many extrema, and also yields patterns that are not visually consistent with the kind of patterns that technical analysts find compelling." The smoothed extrema always alternate between maxima and minima. — [Lo, Mamaysky & Wang, NBER WP 7613 (full text)](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)

### Inferences
**Codable definition summary table** (my synthesis of the definitions above)

| Definition | Family | Exact rule to code | Confirmation lag (event time) | Visual identifiability |
|---|---|---|---|---|
| Bill Williams fractal | Bar-count | H[c] > H[c±1], H[c±2] | 2 bars after the pivot bar closes | High: standard on most platforms |
| N-bar pivot (L,R) | Bar-count | H[c] > H[c−1..c−L] and H[c] ≥/> H[c+1..c+R] | R bars | High |
| DeMark TD point level n | Bar-count | Symmetric n-bar pivot | n bars | High |
| Williams short-term high | Bar-count, skips inside bars | H[c] > H of nearest non-inside bar on each side | ≥1 bar (until the first non-inside bar after it closes with a lower high) | High |
| Williams intermediate/long-term | Hierarchical | ST high above adjacent ST highs | Until the next (lower) ST high on the right is confirmed; variable, often many bars | Medium |
| Gann N-bar swing chart | Bar-sequence | Line turns after N consecutive higher/lower bars; inside bars ignored; outside-bar rule must be fixed | ≥ N bars after the extreme | Medium (overlay needed) |
| ZigZag / DC | Price threshold | Extreme confirmed when price retraces ≥ θ from the running extreme | Variable in bars, but fixed in price: you always give back ≥ θ before the swing is known | High (but the last leg moves) |
| Kernel extrema (LMW) | Smoothing | Extrema of the kernel-smoothed curve mapped to raw prices | Two-sided smoother; LMW add a d-day detection delay | Low-medium (needs a smoother overlay) |

- **Definitions that cannot be coded without an added rule:** Brooks "swing/leg," Wyckoff spring/ST and Dow "significant" peak all need an underlying swing detector (family a or b) plus a significance filter. The source texts do not give the numbers, so any implementation is a design choice. Document it as such.
- **Tie rule:** Choose an asymmetric rule, for example strict ">" on the left and "≥" on the right, or the reverse. This stops a double top on two equal bars from producing two pivots or none. Write the choice down, because platforms differ.
- **Outside bars:** In OHLC data you cannot know whether an outside bar's high or low printed first. Pick one rule: Optuma-style resolution by the next bar, resolution from the lower timeframe, or treating the outside bar as both. Apply it to all detectors that use that bar (Gann, Williams, ZigZag), so different modules do not disagree about the same bar.

### Gaps
- I did not retrieve Larry Williams' book text. Whether he gives an explicit outside-day rule or uses intraday sequence to resolve outside days is unverified.
- I did not retrieve Bill Williams' *Trading Chaos* text. The exact original wording and tie rules are unverified.
- Brooks' books give no single formal numeric swing/leg definition that I could locate. The Brooks Trading Course glossary URL returned 404.
- I did not retrieve primary Gann texts. Attributions of the "2-day vs 3-day" swing to Gann himself are from secondary sources of uncertain provenance.
- I did not find TradingView's exact tie-handling inside `ta.pivothigh`/`ta.pivotlow` (strict vs non-strict on each side). Verify empirically on equal-high bars before relying on it.
- I did not find NinjaTrader's default Swing strength value in the fetched doc.

## 2. Swing hierarchy and timeframe nesting (fractal market structure)

### Takeaway
Swing hierarchies are built by recursion: run the same "higher than its neighbors" test on the *list of lower-degree swings* instead of on bars. This is Williams' ST→IT→LT method, and it is DeMark's levels and Gann's 1/2/3-bar charts in another form. An equivalent price-threshold hierarchy is a ladder of DC thresholds θ₁ < θ₂ < θ₃. Each degree up multiplies the confirmation lag, so a higher-degree swing is best used as *context* (trend filter, key level) and a lower-degree swing as the *trigger*.

### Cited Findings
- Williams' hierarchy is explicitly recursive. An intermediate-term high is "any short-term high with lower short-term highs on both sides," and a long-term high is "any intermediate term high with lower intermediate term highs on both sides." — [TradingView: Larry Williams Market Structure](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)
- DeMark's levels are nested by construction. Every higher-level TD point is also a Level 1 point, and higher levels take longer to confirm, so price often breaks the line before the second point forms. — [MarketInOut: DeMark TD Points](https://www.marketinout.com/blog/demark-td-points-and-td-lines)
- Gann practitioners use the 1-bar chart for minor swings, the 2-bar chart as the standard, and the 3-bar chart for intermediate swings. — [Optuma KB: Gann Swing Charts](https://www.optuma.com/kb/charts/gann-swing-charts); [Daily Gann Newsletter Lesson 2](https://thedailygannnewsletter.blogspot.com/p/lesson-2-constructing-swing-chart.html) (secondary)
- Dow Theory nests three degrees of movement: primary trend, secondary reactions and minor movements. — [Incredible Charts: Dow Theory – Trends](https://www.incrediblecharts.com/technical/dow_theory_trends.php); [TheRightTrader: Primary, secondary, minor trends](https://therighttrader.com/learn/trend-analysis/primary-secondary-minor-trends) (secondary)
- The DC literature treats different thresholds as different "focal points": "the fixed event thresholds of different sizes define focal points, blurring out irrelevant details of the price evolution." Glattfelder et al. report scaling laws that hold "for close to three orders of magnitude" of threshold size across 13 FX rates. That gives a principled multi-scale structure without fixed clock time. — [Glattfelder et al. 2011, arXiv:0809.1040](https://arxiv.org/pdf/0809.1040)
- SMC indicator vendors split structure into two degrees: "Internal Structure" (fast, short pivot length) and "Swing Structure" (slow, long pivot length). "Dashed internal labels track the fast rhythm inside the larger moves marked by solid swing lines." Common guidance is to define trend by swing structure and time entries with internal structure. — [LuxAlgo: Smart Money Concepts (SMC)](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/); [LuxAlgo Price Action Concepts docs: Market Structures](https://deploy-preview-41--luxalgo.netlify.app/lux-algo-premium-indicators/lux-pa/market-structures)
- One SMC script defines the boundary precisely: until a confirmed Swing High/Low is broken by a candle *body*, all intervening price action is "internal." — [TradingView: Smart Money Pro](https://in.tradingview.com/script/0z6C7YVt-Smart-Money-Pro/) (single-script convention, not a standard)

### Inferences
- **Recursive construction (pseudocode):**
```
level0 = bars (skip inside bars per Williams)
ST = pivots(level0, compare=adjacent non-inside bars)       # degree 1
IT = [s in ST.highs if s.price > prev(ST.highs, s).price and s.price > next(ST.highs, s).price]
LT = [s in IT.highs if s.price > prev(IT.highs, s).price and s.price > next(IT.highs, s).price]
# confirmation time of an IT high = confirmation time of next(ST.highs, s) (the lower ST high to its right)
```
- **Equivalence to timeframe nesting:** A short-term swing on a weekly bar is roughly an intermediate-to-long-term swing on daily bars. Williams-style recursion on one timeframe and simple pivots on higher-timeframe bars are two ways to reach the same hierarchy. Recursion keeps one data series and avoids higher-timeframe alignment and lookahead bugs. Higher-timeframe bars are easier to verify visually. For a system that will be reviewed visually, plot both on the review chart and check that they agree.
- **DC ladder alternative:** Run DC detectors at θ, 2θ and 4θ (or ATR multiples). Every θ₂ swing extreme is also a θ₁ extreme. This gives a clean, alternating, non-overlapping hierarchy, which bar-count pivots do not guarantee.
- **Lag compounds by degree:** An IT high is not known until a *lower* ST high forms to its right. That requires a rally that fails and then a bar with a lower high. A rule triggered on IT/LT swings therefore enters late. Most practitioners use the higher degree as the filter and level map, and the lower degree as the trigger.

### Gaps
- I found no rigorous study comparing recursive swing hierarchies with multi-timeframe pivots for forecasting value.
- The default internal/swing pivot lengths in the LuxAlgo SMC script were not stated on the fetched page. Values commonly quoted elsewhere (e.g., internal 5, swing 50) are unverified here.

## 3. Market structure classification: HH/HL, LH/LL, ranges, BOS, CHoCH, 1-2-3, 2B, sweeps, double tops

### Takeaway
Market structure is a **state machine over the alternating list of confirmed swings**. Trend = UP when the last confirmed swing high and swing low are both higher than their predecessors (HH+HL), DOWN when both are lower (LH+LL), and RANGE/transition otherwise. A break of structure (BOS) is a close beyond the last confirmed swing *in* the trend direction. A change of character (CHoCH) is the first close beyond the last confirmed swing *against* it. Sperandeo's 1-2-3 and 2B are older, more conservative versions of the same transition logic. SMC terms (BOS/CHoCH/liquidity sweep) are vendor conventions with no canonical standard, so pin down every parameter (pivot length, close vs. wick, tolerance).

### Cited Findings
- **Dow trend definition:** rising peaks and rising troughs = bull; falling peaks and troughs = bear. Whether one violation ends the trend or both a lower high and a lower low are needed is disputed among practitioners. — [Incredible Charts](https://www.incrediblecharts.com/technical/dow_theory_trends.php)
- **Sierra Chart's Zig Zag labels each pivot HH, HL, LH or LL** automatically, as numeric subgraph codes. This classification is a platform-native output that can drive automation. — [Sierra Chart Zig Zag reference](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)
- **BOS vs CHoCH (vendor definitions):** BOS = "structure breaking with the trend, continuation of the current direction." CHoCH = "structure breaking against the trend, the first warning of a potential reversal." — [LuxAlgo SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/). The LuxAlgo page does not specify whether a break requires a close or only a wick. — same source
- **Equal highs/lows (EQH/EQL)** are flagged with a "bars confirmation" parameter as potential liquidity/reversal points. The tolerance method is not stated on the vendor page. — [LuxAlgo SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)
- **Sperandeo 1-2-3 trend change (Trader Vic, 1991):** In an uptrend: (1) the trendline is broken; (2) the market fails to make a new high, or tests the high and fails; (3) price falls below the prior minor (correction) low. Two of three conditions = increased probability of a trend change. All three = the definition of a trend change. — [RoboForex: Trading like Sperandeo – 1-2-3 Reversal and 2B](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/); [Bulkowski, ThePatternSite: 1-2-3 Trend Change](https://www.thepatternsite.com/123tc.html); [Technical Analysis of Stocks & Commodities online article](https://technical.traders.com/tradersonline/display.asp?art=958) (secondary)
- **Sperandeo 2B rule:** a refinement of step 2. Secondary sources quote it as: "In an uptrend, if prices penetrate the previous high, but fail to carry through and immediately drop below the previous high, the trend is apt to reverse." Sperandeo reportedly weighs 2B more heavily than any other single criterion. — [RoboForex](https://roboforex.com/blog/education/trading-like-sperandeo-1-2-3-reversal-and-2b-pattern/); [Wisdom is Profit blog: Technical rules of Victor Sperandeo](https://wisdomisprofit.blogspot.com/2010/12/technical-rules-of-victor-sperandeo.html) (secondary; not verified against the book)
- **Wyckoff spring/upthrust** are 2B-style failed breaks of a *range* boundary. A close back below the spring low invalidates it, and a spring that looks like a liquidity sweep is only a test until price closes back inside the range. — [LuxAlgo: Spring](https://www.luxalgo.com/library/concept/spring/); [TradingWyckoff: Spring/Shakeout](https://tradingwyckoff.com/en/spring-shakeout/)
- **Double tops in swing terms (LMW 2000):** starting at a local maximum E1, find the highest later local maximum Ea. The two tops must be within 1.5% of their average and at least 22 trading days apart (following Edwards & Magee). Head-and-shoulders = five consecutive alternating extrema with the head highest and the shoulders (E1, E5) and troughs (E2, E4) each within 1.5% of their averages. — [Lo, Mamaysky & Wang NBER WP 7613](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)
- **Brooks pullback counting:** H1/H2 (L1/L2) count attempts to resume the trend. A two-legged pullback that holds above the swing low that started the impulse keeps the trend intact. — [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/01-terminology/the-lows-are-labeled-incorrectly/); [TheRightTrader: Two-legged pullback](https://therighttrader.com/learn/trend-analysis/two-legged-pullback) (secondary)

### Inferences
- **Structure state machine (pseudocode; run only on *confirmed* swings, evaluated at bar close):**
```
inputs: swings = alternating list of confirmed {type: H|L, price, pivot_bar, confirm_bar}
state: trend ∈ {UP, DOWN, NONE}; protectedLow; protectedHigh; lastSH; lastSL

on new confirmed swing s:
   if s.type == H: classify s as HH if s.price > lastSH.price + tol else LH if s.price < lastSH.price - tol else EQH
                   lastSH = s
   if s.type == L: classify HL / LL / EQL similarly; lastSL = s

on bar close t:
   if close[t] > lastSH.price:                       # break above last confirmed swing high
        if trend == UP:   emit BOS_UP;  protectedLow = lowest confirmed SL since previous BOS (the HL that launched the break)
        else:             emit CHoCH_UP; trend = UP (provisional); protectedLow = lastSL
        mark lastSH as "taken" so it can't re-trigger
   if close[t] < lastSL.price: mirror logic (BOS_DOWN / CHoCH_DOWN; protectedHigh)
   if trend == UP and close[t] < protectedLow.price: emit CHoCH_DOWN; trend = DOWN
```
- **Range definition (codable):** a RANGE exists when the last k confirmed swings alternate without a close beyond the outermost confirmed SH/SL. Equivalently, a CHoCH was not followed by a BOS in the new direction within m swings. Range bounds = max SH / min SL of those swings.
- **Close vs. wick:** use a *close* beyond the level for BOS/CHoCH and a *wick beyond plus close back inside* for sweeps/2B/springs. The two are then mutually exclusive on any bar, which makes them easy to identify visually.
- **2B / swing failure / liquidity sweep (pseudocode):**
```
level = lastSH.price (confirmed, not yet taken)
if high[t] >= level + minPen (e.g., 1 tick or 0.1*ATR) and close[t] < level:      # same-bar failure
      emit SWEEP_HIGH / 2B_TOP_candidate
elif high within last k bars exceeded level and close[t] < level and no close > level in between:
      emit 2B_TOP (k-bar variant; Sperandeo's "immediately" ≈ small k, e.g., 1–3 bars)
stop reference = max(high since penetration)
```
- **1-2-3 top (pseudocode):** point 1 = confirmed SH that is the trend extreme. Point 2 = the subsequent confirmed SL (the "minor correction low"). Point 3 = the next confirmed SH, where SH3 ≤ SH1 (a failed test, or a 2B if it poked above). The trigger is a close < point 2. Optional condition (1) = a trendline from the last two HLs is broken. This reuses the same swing list as the state machine. A 1-2-3 top is a CHoCH whose point 3 is a lower high, so it is stricter than an SMC CHoCH, which fires on any break of the protected low.
- **Double top in swing terms (intraday adaptation of LMW):** two confirmed SHs, |SH_a − SH_b| ≤ tol, separated by at least N bars, with a confirmed SL between them. The neckline break is a close < that SL. For intraday futures, use an ATR-based tolerance (e.g., a fraction of ATR) rather than LMW's 1.5% of price, which suits daily stocks. This is my adaptation, not tested.
- **Internal vs external:** external (swing) structure = swings from the longer detector. Internal = swings from the shorter detector *between* the current external SH and SL. A CHoCH on internal structure inside an intact external uptrend is a pullback-ending signal, not a trend reversal. That is the standard use in SMC and maps onto Brooks' H2 logic.

### Gaps
- There is no canonical, authoritative definition of BOS/CHoCH/"market structure shift." The terms come from ICT/SMC educators and vendor scripts, and details (close vs wick, pivot length, which low is "protected") vary. I found no primary ICT text with exact rules.
- I did not retrieve Sperandeo's book to verify the exact 2B wording, the time window implied by "immediately," or his trendline-drawing rule.
- I found no rigorous statistical evidence for BOS/CHoCH or 2B performance in futures. Bulkowski's ThePatternSite may hold 1-2-3 statistics (stocks), but I did not verify them. Anything beyond the conceptual logic is anecdotal.

## 4. The automation problem: confirmation lag and repainting

### Takeaway
A swing point has two timestamps: the **pivot time** (when the extreme printed) and the **confirmation/event time** (when the rule could first know it). Bar-count pivots are confirmed R bars later and are then final. ZigZag/DC extremes are confirmed when price has retraced θ, and the provisional extreme of the current leg keeps moving until then (the "repaint"). Every platform's docs agree on the fix: act only on confirmed values, at bar close, at the confirmation time, and never plot or backtest on the pivot bar as if it were known then.

### Cited Findings
- Pine docs: pivot scripts are "potentially misleading" because of plotting in the past. `ta.pivothigh(5,5)` detects the pivot 5 bars late, and labeling `bar_index[5]` "repaints because an elapsed realtime bar showing no price may get a price placed on it." The recommended handling is to plot "without an offset by default" and let users opt into past plotting. Use `barstate.isconfirmed` or `[1]` references so signals use only closed bars (these "will also trigger signals later than repainting scripts"). For higher-timeframe data, use `request.security()` with a `[1]` offset and `lookahead_on`. Lookahead without the offset "will return data from the future on historical bars, which is dangerously misleading." — [Pine Script User Manual: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)
- NinjaTrader 8 Swing: values are final only after `strength` bars, so access them "the number of swing strength bars ago." — [NT8 Help: Swing](https://static.ninjatrader.com/support/helpGuides/nt8/swing.htm)
- NinjaTrader 8 ZigZag: "the current developing leg should be thought of temporary until a new leg in opposite direction has been set." Use Calculate.OnBarClose. — [NT8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)
- Sierra Chart Zig Zag: the last leg can change, and real-time versus recalculated results can differ when one bar both makes a new extreme and triggers a reversal. "Calculate New Values on Bar Close" removes this by ignoring the incomplete bar. — [Sierra Chart Zig Zag reference](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)
- DC literature formalizes the two timestamps. EXT (extreme point) is known only in hindsight, while DCC (confirmation point) is a real-time event. A "nowcast" of a DC made before the extreme point is wrong by definition because the direction has not yet changed. — [Tsang DC Notations 2014](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf); [Tsang 2024, Nowcasting directional change in high-frequency data (ISAFM)](https://eprints-gro.gold.ac.uk/37843/1/Intelligent%20Systems%20in%20Accounting%20%20Finance%20and%20Management%20-%202024%20-%20Tsang%20-%20Nowcasting%20directional%20change%20in%20high%20frequency.pdf); [Li, Tsang & O'Hara 2022 (ISAFM)](https://repository.essex.ac.uk/32954/1/Intelligent%20Systems%20in%20Accounting%20Finance%20and%20Management%20-%202022%20-%20Li%20-%20Measuring%20relative%20volatility%20in%20high%E2%80%90frequency.pdf)
- Academic precedent for handling lag in tests: LMW introduce a parameter d that "controls for the fact that in practice we do not observe a realization of a given pattern as soon as it has completed." The final extremum must occur by day t+l−1, and post-pattern returns are computed only from the end of day t+l+d. They used l=35, d=3 (38-day windows). — [LMW NBER WP 7613](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)
- Auto-anchored swing VWAP tools start the VWAP only once the swing is confirmed (N bars each side), so the line appears several bars after the actual high/low. — [LuxAlgo: Auto-Anchored Swing VWAPs](https://www.luxalgo.com/library/indicator/yGQMVJ90-auto-anchored-swing-vwaps/)

### Inferences
- **Swing record schema (store both times; every downstream rule keys off `confirm_bar`):**
```
Swing { type: H|L, price, pivot_bar, pivot_time, confirm_bar, confirm_time,
        detector: "pivot(L,R)" | "DC(θ)" | "WilliamsST" ..., degree: 0/1/2, status: PROVISIONAL|CONFIRMED|TAKEN }
```
- **Confirmed-only N-bar pivot (non-repainting by construction):**
```
on bar close t:
   c = t - R
   if c - L < 0: return
   isPH = all(H[c] >  H[c-i] for i in 1..L) and all(H[c] >= H[c+j] for j in 1..R)   # document tie rule
   isPL = all(L[c] <  L[c-i] for i in 1..L) and all(L[c] <= L[c+j] for j in 1..R)
   if isPH: emit Swing(H, price=H[c], pivot_bar=c, confirm_bar=t)
   if isPL: emit Swing(L, price=L[c], pivot_bar=c, confirm_bar=t)
   # enforce alternation: if two H in a row, keep the higher (or insert the lowest low between them as an L)
```
- **Confirmed-only ZigZag / DC with a volatility threshold (provisional vs confirmed):**
```
state: mode ∈ {UP, DOWN}, ext_price, ext_bar, thr_at_ext
on bar close t (or per tick for DC on tick data):
   if mode == UP:
      if H[t] > ext_price:                         # provisional extreme moves -> this IS the "repaint"
           ext_price = H[t]; ext_bar = t; thr_at_ext = k * ATR(n)[t]   # freeze threshold at the extreme
      elif ext_price - L[t] >= thr_at_ext:          # DC confirmation (DCC)
           emit Swing(H, price=ext_price, pivot_bar=ext_bar, confirm_bar=t, status=CONFIRMED)
           mode = DOWN; ext_price = L[t]; ext_bar = t; thr_at_ext = k * ATR(n)[t]
   else: mirror
   publish provisional Swing(status=PROVISIONAL) separately for display only; never trade it
```
  - **Outside-bar ambiguity:** when one bar both extends the extreme and retraces θ (Sierra Chart's documented case), check *either* the extension *or* the reversal, never both on the same OHLC bar, unless intrabar order is known from a lower timeframe or tick data. A conservative rule extends first and evaluates the reversal from the next bar.
  - **Freezing θ at the extreme** stops the threshold from drifting while a leg develops. Drift can turn an already-confirmed swing into an unconfirmed one when ATR changes.
- **Event-time rule for signals and visual review:** every entry, stop or level derived from a swing uses data available at `confirm_bar`. On the review chart, draw the swing marker at `pivot_bar` (for readability) *and* a small marker at `confirm_bar`. This follows the Pine guidance to not hide the offset. The reviewer can then see the real lag, and that is often where an apparently "obvious" setup turns out to be untradeable.
- **Lag cost in price terms:** with DC/ZigZag you always give back at least θ from the extreme before knowing the swing exists. Glattfelder et al. find the average overshoot after a DC is ≈ θ (Section 6). A reversal entry at DCC therefore captures, on average, an overshoot about as large as what was given up. That is not an edge by itself (see the random-walk caveat in Section 6).
- **Higher-timeframe swings in a lower-timeframe system:** take the HTF swing list only from *closed* HTF bars (the `[1]` + lookahead_on pattern in Pine; the equivalent "use the prior completed bar" logic in NinjaTrader or custom Rithmic/Tradovate code). A weekly swing low confirmed with R=2 is not usable until two full weeks after the low's week closes.

### Gaps
- I found no published benchmark quantifying how much performance degrades when moving from repainting to confirmed-only swing logic in futures. Practitioner forums assert it is large, but this is anecdotal.

## 5. Parameter choices, volatility adaptation, and non-time bars

### Takeaway
The only parameters well documented in primary or platform sources are structural: fractal = 2/2 bars; DeMark Level 1–3 = 1–3 bars per side, with DeMark favoring Level 1; Gann charts = 1/2/3 bars; LMW kernel bandwidth = 0.3× the cross-validated bandwidth with 38-day windows and 1.5% equality tolerance (daily stocks). The major futures platforms ship ZigZag only in points or percent, not ATR. I found **no rigorous source** for "the right" ATR multiple for intraday ES/NQ/CL. Any specific value is a judgment call and should be chosen for visual fit, not optimized. The DC framework is natively event-based and so works the same on tick, volume, range or Renko bars. Bar-count pivots change meaning on non-time bars.

### Cited Findings
- Bill Williams fractal = 2 bars each side (5-bar pattern). Variants with 3/7/9 bars exist. — [LuxAlgo: Williams Fractal](https://www.luxalgo.com/library/concept/williams-fractal/); [TradingView Help](https://in.tradingview.com/support/solutions/43000591663-williams-fractal/)
- DeMark Level 1/2/3 = 1/2/3 bars each side. DeMark reportedly advised mostly Level 1, because higher levels take longer to confirm and price often breaks the line first. — [MarketInOut](https://www.marketinout.com/blog/demark-td-points-and-td-lines)
- LMW: the cross-validated bandwidth "places too much weight on prices far away from any given time t." They use a bandwidth of 0.3 × h*, where h* minimizes the cross-validation function. Their windows are 38 trading days (l=35, d=3), and their equality tolerances are 1.5% (H&S shoulders, double tops) and 0.75% (rectangle bottoms). — [LMW NBER WP 7613](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)
- NinjaTrader 8 ZigZag supports only `DeviationType.Points` or `DeviationType.Percent`. — [NT8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)
- Sierra Chart Zig Zag supports percent (Mode 1), fixed amount (Mode 3), and fixed amount plus a minimum bar count (Mode 2). No ATR mode is documented, and a "Reset Zig Zag at Start of Trading Day" option exists for session-based swings. — [Sierra Chart Zig Zag reference](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)
- DC thresholds are usually percentages. The DC scaling laws hold across roughly three orders of magnitude of threshold (e.g., 0.1% to 3% in their plots) for 13 FX pairs. For the 0.05% threshold, which "occurs on average every 15 minutes" in their FX data, they measure an average daily "coastline" (sum of threshold-sized moves) of 6.4%, ranging from 1.8% (EUR-CHF) to 9.1% (AUD-JPY) across pairs. — [Glattfelder et al. 2011](https://arxiv.org/pdf/0809.1040)
- Tsang et al. built DC specifically for tick-to-tick data, where it replaces fixed time intervals with event-driven sampling. — [Tsang DC4TD 2021](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)
- Osler documents that published support/resistance levels cluster at round numbers. Over 70% end in 0 and 96% end in 0 or 5. So round-number proximity is a natural extra "strength" attribute for a swing level. — [Osler 2000, FRBNY Economic Policy Review](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)

### Inferences
- **Starting points chosen for visual robustness, not tested or optimized.** Flag all of these to the user as judgment calls.
  - Trigger-degree pivots: 2/2 (fractal) to 3/3 on the execution timeframe. Context-degree pivots: 5/5 to 10/10, or the same 2/2 rule on a 3–5× higher timeframe.
  - ATR-ZigZag / DC thresholds: express θ as k × ATR(n) on the bar timeframe, with k in roughly the 1.5–3 range for "visually obvious" swings and a ladder (k, 2k, 4k) for the hierarchy. Freeze ATR at the extreme. For intraday futures, a session-aware ATR (excluding the overnight gap or computed on RTH only for ES/NQ) avoids thresholds distorted by the open. Unsourced: verify visually per instrument.
  - Equality tolerance for EQH/EQL and double tops: ~0.1–0.25 × ATR or a few ticks intraday, instead of LMW's percent-of-price (which suits daily stocks).
- **Adaptive alternatives to ATR:** (1) DC thresholds as a percentage of price, which is scale-free and suits weekly bars. (2) Thresholds scaled to a rolling median swing size from the higher-degree detector, which keeps the swing count per session roughly stable. (3) Sierra Chart Mode 2-style dual conditions (price amount AND minimum bars), which suppress one-bar spikes.
- **Non-time bars:**
  - *Tick/volume bars:* bar-count pivots still work. "R bars" now means R × (ticks or volume) of activity rather than minutes, so lag scales with activity. That is arguably better around the RTH open and news. DC applies unchanged.
  - *Range bars:* every bar has the same high-low range. An L/R pivot on range bars is effectively a price-threshold rule (R bars ≈ at least R × range of opposite movement under continuous trading), so it converges toward a ZigZag/DC with θ ≈ R × range size. Outside and inside bars largely disappear, which simplifies Gann/Williams rules.
  - *Renko:* classic Renko bricks carry no wicks and reverse only after a 2-brick move. A Renko reversal is therefore itself a DC event with θ = 2 × brick size. N-bar pivots on Renko add lag on top of that. Use the brick reversal itself as the swing, or the true high/low recorded inside the brick if the platform stores wicks.
  - On all non-time bars, the swing's *true* extreme price should come from the underlying tick data, not from a synthetic brick boundary.
- **Session handling:** for ES/NQ/CL, decide explicitly whether overnight (ETH) swings count. Sierra Chart's "Reset at Start of Trading Day" shows platform designers treat this as a necessary choice. Prior-session high/low and overnight high/low are effectively swing levels that every participant sees.

### Gaps
- I found no rigorous or primary source giving recommended ATR multiples for ZigZag on intraday ES/NQ/CL. Any number in circulation appears to be practitioner preference or backtest-optimized.
- I found no studies of swing definitions specifically on volume, tick, range or Renko bars. The inferences above follow from the construction of those bar types.
- I found no documentation confirming an ATR-based ZigZag in NinjaTrader 8 or Sierra Chart native studies. Third-party add-ons may exist but were not reviewed. Tradovate/Rithmic offer no swing studies relevant here as far as I found. Not researched.

## 6. Evidence base: what is and isn't supported

### Takeaway
There is **credible but indirect** evidence that levels at prior highs/lows matter. Osler (FRBNY) showed that support/resistance levels published by dealers, which practitioners typically derive from prior peaks and troughs, predicted intraday FX trend interruptions better than chance: bounces 60.8% vs 56.2%. Stop-loss orders cluster just beyond round numbers and propagate fast moves ("price cascades"). Kavajecz & Odders-White found that support/resistance levels coincide with peaks of limit-order-book depth. LMW found that local-extrema-based patterns carry incremental distributional information. The edges are **small** (a few percentage points), mostly from **FX and equities in the 1960s–2000s**, and **not demonstrated as net-of-cost profits**. The DC overshoot "law" partly matches random-walk expectations. I found no rigorous evidence specifically for BOS/CHoCH, 2B or liquidity-sweep strategies in futures. Those rest on practitioner anecdote.

### Cited Findings
- **Osler (2000), "Support for Resistance: Technical Analysis and Intraday Exchange Rates," FRBNY Economic Policy Review, July 2000:**
  - Data: support/resistance levels published daily by six firms (commercial banks, investment banks, real-time information providers) from Jan 1996 to Mar 1998, for USD vs DEM, JPY and GBP. Tested against indicative quotes at one-minute intervals, 9 a.m. to 4 p.m. New York time.
  - Method: bootstrap comparison against 10,000 sets of arbitrary levels. A "bounce" means the trend is interrupted after the rate comes within 0.01% of a level, with 0.00% and 0.02% also tested.
  - Result: rates bounced off arbitrary levels 56.2% of the time on average, versus 60.8% for published levels. In all 16 firm-currency pairs, published levels beat arbitrary ones, and the results are significant at 5% for all but three pairs. Bounce frequencies exceeded those of arbitrary levels by 4.2 percentage points (mark), 5.6 (yen) and 4.0 (pound).
  - Predictive power lasted at least five business days after publication. However, "none of the firms correctly assessed the relative likelihood of trend interruptions at the different levels," so firms' own strength ratings had no value.
  - Firms agreed with each other only about 30% of the time.
  - The paper quotes Murphy's practitioner definition: "Usually, a support level is identified beforehand by a previous reaction low," and "a resistance level is identified by a previous peak."
  — [Osler 2000 (PDF)](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)
- **Osler (2002), "Stop-Loss Orders and Price Cascades in Currency Markets," FRBNY Staff Report 150:**
  - Executed stop-loss buy orders cluster just above round numbers (ending in 00 or 50), and stop-loss sell orders just below. For example, 14.3% of executed stop-loss buys have requested rates ending in [01,10] vs 6.9% in [90,99]. Take-profit orders cluster more at the exact round number.
  - Trends are "unusually rapid" when rates reach documented stop-loss clusters. The response to stop-loss orders is larger and lasts longer than the response to take-profit orders, and "most results are statistically significant for hours, although not for days." Osler concludes stop-loss orders "propagate trends and are sometimes triggered in waves."
  — [Osler 2002, FRBNY SR150 (PDF)](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)
- **Kavajecz & Odders-White (2004), "Technical Analysis and Liquidity Provision," Review of Financial Studies 17(4):1043–1071:** support and resistance levels coincide with peaks in depth on the NYSE limit order book. Moving-average signals reveal the position of depth relative to the quote. The authors argue technical analysis is valuable because it locates liquidity, not because prices are predictable. A Taiwan replication reportedly found similar results. — [IDEAS/RePEc record](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html); [Taiwan replication (abstract)](https://www.sinoss.net/uploadfile/2013/0813/20130813093423563.pdf)
- **Lo, Mamaysky & Wang (2000), Journal of Finance (NBER WP 7613):**
  - The authors automate pattern detection via kernel-regression local extrema on U.S. stocks (NYSE/AMEX and Nasdaq), 1962–1996.
  - They find "several technical indicators do provide incremental information and may have some practical value," and that patterns provide incremental information "especially for Nasdaq stocks."
  - They caution this "does not necessarily imply that technical analysis can be used to generate 'excess' trading profits."
  — [NBER abstract](https://www.nber.org/papers/w7613); [full text](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)
- **Glattfelder, Dupuis & Olsen (2011), Quantitative Finance 11(4):**
  - On average a directional change of size θ "is followed by an overshoot of the same magnitude," so the total move ≈ 2θ. The overshoot "contains roughly twice as many ticks and takes twice as long to unfold."
  - **Caveat in the paper itself:** "This result is also found by computing the probable path of the price within a binomial tree," i.e., the ≈2θ total-move result also arises in a simple random-walk model. It describes price geometry and is not evidence of exploitable predictability.
  - The paper compares its laws against a Gaussian random walk model in its appendix tables.
  — [Glattfelder et al. (PDF)](https://arxiv.org/pdf/0809.1040)
- **DC-based trading research** exists, e.g., Bakhach, Tsang & Chinthalapati's TSFDC forecasting strategy. These are model and backtest studies, mainly on FX, and not independent confirmation of a structural edge. — [TSFDC record](https://law-journals-books.vlex.com/vid/tsfdc-trading-strategy-based-855661099); [Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)
- Osler also notes that practitioner level-setting includes the "50 percent rule" (major moves often retrace about 50%) and the 38.2%/61.8% Fibonacci levels. These are listed as *claims analysts use*, not tested results. — [Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)

### Inferences
- **What is reasonably supported** (for the user's "proven concepts" goal):
  1. Prices react more often than chance at levels practitioners publish, and those levels are typically prior swing highs/lows, round numbers and trendlines. The effect is a few percentage points at intraday horizons and lasts days.
  2. Stop orders cluster just beyond salient levels (round numbers, directly evidenced) and accelerate moves when triggered, with effects lasting hours. The mechanism plausibly extends to just beyond obvious swing highs/lows, but Osler's order data concerns round numbers, not swing points directly.
  3. Visible liquidity concentrates at technical S/R levels (equities).
  These give a *microstructure rationale* for both sides of swing-level trading: "bounce/failure" (2B, sweep, spring) when the stop cluster is absorbed, and "breakout continuation" (BOS) when the cascade runs. The evidence does not say which dominates in a given instance.
- **What is not supported by rigorous evidence I found:** the specific SMC constructs (BOS/CHoCH/order blocks/liquidity sweeps as entry rules), Sperandeo's 2B/1-2-3 win rates, Williams' intermediate-term-point trading rules, and Gann swing-chart trading rules. Their support is practitioner experience and vendor material. Treat them as *operationalizations* of the supported mechanisms above, not as independently proven edges.
- **Transfer risk:** the evidence comes from FX (1996–98 minute data, dealer order books ~1999–2000) and US equities (1962–1996 daily). CME futures have centralized, transparent order books and heavy algorithmic participation. Structural similarity (stop clustering, round-number salience) is plausible, but magnitudes may differ and edges may have decayed since publication.
- **Osler's "no firm could rank level strength" finding** cautions against elaborate "strong vs weak high" scoring schemes unless they have their own evidence.

### Gaps
- I did not retrieve Osler's 2003 Journal of Finance paper ("Currency Orders and Exchange Rate Dynamics: An Explanation for the Predictive Success of Technical Analysis"), which formalizes the order-clustering explanation. Cite it with care.
- I found no peer-reviewed study testing stop runs specifically at *prior swing highs/lows* (as opposed to round numbers or published levels) in CME futures. This is a key gap for "liquidity sweep" logic.
- I found no rigorous out-of-sample evidence on BOS/CHoCH, 2B, 1-2-3, Williams swing rules or Gann swing charts in futures.
- Post-publication decay of the Osler and Kavajecz effects in modern electronic futures markets is unknown.

## 7. Swing points as anchors for other tools (stops, Fibonacci, AVWAP/volume profile, measured moves)

### Takeaway
Confirmed swings are the natural, objective anchor for nearly every discretionary tool. Stops go just beyond the protecting swing. Fibonacci and percentage retracements run between the last confirmed opposite-type swings of the same degree. Anchored VWAP and anchored volume profile start at a swing's pivot bar, but only become usable at its confirmation bar. Measured moves project a prior leg from a new swing. The DC overshoot regularity (average overshoot ≈ threshold) gives a statistically grounded but non-predictive version of the measured-move idea. The automation requirement is the same as in Section 4: anchor at `pivot_bar`, activate at `confirm_bar`.

### Cited Findings
- **Stops beyond swings and stop clustering:** stop-loss buy orders cluster just above salient levels and sell stops just below, and their execution accelerates price ("price cascades"). Stops placed exactly at the obvious level are therefore exposed to sweep-and-cascade dynamics. — [Osler 2002, FRBNY SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)
- **Retracement levels:** practitioners derive S/R from prior reaction lows and peaks and from the 50% rule and 38.2%/61.8% retracements. Osler reports these as practitioner methods, not as validated results. — [Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)
- **Anchored VWAP:** Brian Shannon (AlphaTrends) popularized anchoring VWAP to chart events such as a notable swing high/low or a gap. Typical practice plots several AVWAPs at once, anchored at the most recent swing high, the most recent swing low, the start of the current trend and prior major tops/bottoms. Sources conflict on whether he first published it in *Technical Analysis Using Multiple Timeframes* (2008) or formalized it in *Maximum Trading Gains with Anchored VWAP* (2023). — [AlphaTrends: Anchoring the VWAP for better timing](https://alphatrends.net/?p=623098); [TrendSpider Help: Anchored VWAP](https://help.trendspider.com/kb/indicators/anchored-vwap-volume-weighted-average-price); [TrendSpider blog: Level up with VWAP](https://trendspider.com/blog/how-to-level-up-your-trading-with-vwap/)
- **Automated swing anchoring lags:** LuxAlgo's auto-anchored swing VWAP begins only after the swing is confirmed (a set number of bars each side), so the line appears several bars after the actual extreme. — [LuxAlgo: Auto-Anchored Swing VWAPs](https://www.luxalgo.com/library/indicator/yGQMVJ90-auto-anchored-swing-vwaps/)
- **Measured move / overshoot regularity:** on average, total move ≈ 2 × DC threshold (overshoot ≈ threshold), and the overshoot takes about twice as long as the DC section. The same factor arises in a binomial random walk. — [Glattfelder et al. 2011](https://arxiv.org/pdf/0809.1040)
- **Swing tolerance for pattern anchors:** LMW anchor double tops and head-and-shoulders on alternating local extrema with ±1.5% equality tolerances. — [LMW NBER WP 7613](https://www.nber.org/system/files/working_papers/w7613/w7613.pdf)
- **TD lines** are anchored on the two most recent qualifying TD points, a fully objective trendline anchor. — [MarketInOut](https://www.marketinout.com/blog/demark-td-points-and-td-lines)

### Inferences
- **Anchor-selection rules (codable, deterministic, visually checkable):**
```
StopLong  = protecting_swing_low.price - buffer          # protecting low = the HL that produced the last BOS (Section 3)
            buffer = max(1–2 ticks, 0.1–0.25*ATR)         # judgment call; deliberately beyond the obvious level because of stop clustering
Fib/retracement: anchor = (last confirmed SL, last confirmed SH) of the SAME detector/degree, chosen at the SH's confirm_bar;
                 re-anchor only when a new opposite swing confirms (never to the provisional ZigZag extreme)
AVWAP: start accumulation at pivot_bar (true extreme), but expose the line to rules only from confirm_bar onward
       (backfilled values between pivot_bar and confirm_bar are for display only)
Anchored volume profile: same pivot_bar→now span; same activation rule
Measured move: target = breakout_swing.price ± (prior leg length), where leg = |SH - SL| of the same degree
TD line: line through the two most recent qualifying TD points; break = close beyond line (DeMark qualifiers optional)
```
- **Degree consistency:** anchor tools on swings of the same degree as the trade's thesis. A 5-minute 2/2 fractal low under a trade based on a daily swing produces stops that are too tight and retracements that do not match what the reviewer sees on the higher-timeframe chart.
- **Where the evidence is honest about stops:** the Osler stop-cascade results support (a) not placing stops exactly at the obvious swing and (b) expecting fast moves once a well-known swing is taken out. They do not say what buffer size is optimal. That needs to be a stated assumption.
- **Measured moves:** the Glattfelder 2θ regularity can serve as a neutral, non-optimized target heuristic: after a DC of θ, an average further move of θ in the new direction is what a random walk would also produce. Use it as a *reference distance* for scaling targets and stops, not as a forecast.

### Gaps
- I found no rigorous evidence on whether Fibonacci ratios (38.2/50/61.8) anchored on swings outperform arbitrary retracement levels in futures. Osler lists them only as practitioner claims.
- I did not verify Al Brooks' measured-move rules (e.g., leg 1 = leg 2) or Shannon's exact AVWAP anchor rules from primary texts.
- I found no study on the effectiveness of AVWAP or anchored volume profile anchored on swings. The support is practitioner-based.

## 8. Swing points across timeframes: nesting, HTF bias with LTF triggers, alignment stacks, and look-ahead-free automation

### Takeaway
Multi-timeframe (MTF) swing analysis rests on one fact. A higher-timeframe (HTF) swing is a subset of lower-timeframe (LTF) swings: the HTF swing high is the highest LTF swing high inside it. An HTF trend change happens only when price closes beyond the HTF's *protected* swing, which is itself an LTF swing level. The established practitioner template is Dow's primary/secondary/minor trends, Elder's tide/wave/ripple and the modern SMC "HTF bias + LTF structure shift at an HTF level." Read every LTF move against the HTF trend as a *correction* until the HTF's own protected swing breaks, and enter when the LTF structure turns back in the HTF direction at an HTF level. Space layers about 4–6× apart and use only 2–3 per strategy. To compute it without look-ahead, every layer uses only its own closed bars and confirmed swings, while LTF price interaction with *already-confirmed* HTF levels is legitimate real-time information. Candlestick-type triggers (pin bar, engulfing, inside bar) show no standalone predictive value in the one rigorous test found (DJIA stocks, 1992–2002). Treat them as timing and stop-definition devices inside the HTF swing context.

### Cited Findings
**Classical nesting of trend degrees**
- Dow Theory has three degrees.
  - The primary trend lasts years.
  - Secondary reactions are counter-moves within the primary trend lasting "about 10 to 60 days," and they typically retrace "one-third to two-thirds" of the primary move since the previous secondary movement. A secondary reaction can also take the form of a "line" (a ~5% range lasting weeks).
  - Minor (daily) fluctuations are important for short-term trading but not for the broad trend.
  - A bull trend *starts* when a higher low is followed by a rally above the previous high. It *ends* when a lower high is followed by a decline below the previous low. The trend is presumed intact until a clear opposite signal.
  - Purists end a trend at the first break in the HH/HL sequence. Others require both a lower high and a lower low. The article recommends treating only "large corrections" (beyond the previous low in a bull trend) as primary-trend changes.
  — [Incredible Charts: Dow Theory – Trends](https://www.incrediblecharts.com/technical/dow_theory_trends.php) (secondary summary of Hamilton/Rhea)
- Larry Williams' hierarchy builds intermediate-term points from short-term points and long-term points from intermediate-term points, applying "lower highs on both sides" to the lower-degree swing list. This is the single-chart analogue of timeframe nesting. — [TradingView: Larry Williams Market Structure](https://www.tradingview.com/script/3bpbtsEs-Larry-Williams-Market-Structure)
- **Elder's Triple Screen** names three layers: the tide (long-term trend), the wave (intermediate counter-move on the trading chart) and the ripple (entry trigger).
  - Sources say each timeframe relates to the next by roughly a factor of five; some give a 4–6 range.
  - Examples: weekly tide / daily wave; for a 5-minute trader, a ~20–25-minute wave and a 1–2-hour tide.
  - One source credits the tide/wave/ripple metaphor to Robert Rhea (Dow Theory, 1930s) rather than Elder.
  - Dates conflict: 1986 development vs. publication in *Trading for a Living* (1993).
  — [TradingView: Triple Screen scripts (descriptions)](https://www.tradingview.com/scripts/triplescreen/); [Commodity Charting Tools blog: Triple Screen Trading System](https://commoditychartingtools.blogspot.com/2009/01/triple-screen-trading-system.html); [TheRightTrader: Triple Screen](https://therighttrader.com/learn/trend-analysis/triple-screen-trading-system); [AskTraders: Elder's Triple Screening Strategy](https://www.asktraders.com/learn-to-trade/trading-guide/elders-triple-screening-strategy/) (all secondary; Elder's text not retrieved)

**HTF bias, LTF entry, and conflict resolution (practitioner MTF structure guides)**
- LuxAlgo's MTF structure alignment concept:
  - Alignment means "requiring the swing structure of two or more timeframes to agree before acting." The test is whether "the leg you want to trade on the entry timeframe [is] pointing the same way as the leg that contains it." The state is "aligned when both point the same way; conflicted when the lower timeframe runs against the higher," and a conflict "most often marks a higher-timeframe correction in progress."
  - "Two or three timeframes is typical; beyond that, extra charts mostly add delay and contradiction rather than clarity." "A common convention steps each chart by a factor of about four to six" (tied to Elder).
  - The execution model is "higher-timeframe bias plus a lower-timeframe structure shift at a higher-timeframe level."
  - Conflict handling: stand aside, or wait for the LTF "change of character back in the higher-timeframe direction." An LTF break against the HTF trend "is treated as internal, corrective movement until the higher timeframe's own structure actually breaks."
  - "Do not let one chart's labels contaminate the other." Alignment "removes counter-trend trades and lowers trade frequency." "Nothing about alignment is guaranteed; test it against your own signals."
  - The page does not address repainting or unconfirmed HTF bars.
  — [LuxAlgo: Multi-timeframe Structure Alignment](https://www.luxalgo.com/library/concept/multi-timeframe-structure-alignment/)
- Other practitioner MTF structure guides describe the same top-down workflow:
  1. Set bias from the HTF swing sequence and its most recent BOS.
  2. Drop to the LTF and wait for its structure to turn in the bias direction (a micro-CHoCH/BOS) inside an HTF zone, such as the HTF higher-low area.
  3. Place stops beyond the relevant structure level.
  They also warn against flipping bias on every LTF CHoCH. — [AlphaExCapital: Forex market structure – BOS, CHoCH and trend](https://www.alphaexcapital.com/forex/price-action/forex-market-structure); [Mind Math Money: Market Structure Trading Masterclass (2026)](https://www.mindmathmoney.com/articles/market-structure-trading-the-complete-masterclass-2026-guide); [Backtrex: ICT market structure guide](https://backtrex.com/en/blog/ict-market-structure-beginner-guide); [TradingView: Multi-Timeframe Market Structure Continuation (script)](https://www.tradingview.com/script/IsMqzWek-Multi-Timeframe-Market-Structure-Continuation) (secondary, educational/vendor; describe practice, not evidence)

**Al Brooks on higher-timeframe context**
- Brooks Trading Course forum discussions:
  - A member relays Brooks' view that "any move on 5m chart can be caused by tests of S/R on other time frames."
  - Example readings where states differ by timeframe (monthly bull channel, weekly trading range, daily three bear bars, 5-minute bull trend).
  - "A trading range on one time frame might be part of a broad channel or even a tight channel on a higher time-frame."
  - Brooks sometimes wants one vs. two consecutive signal bars depending on higher-timeframe context.
  - The course does not detail exactly how he uses HTF charts.
  — [Brooks Trading Course forum: 5-bar rule on higher time frame](https://brookstradingcourse.com/support-forum/16-channels/5-bar-rule-on-higher-time-frame-on-breakout-above-bull-channel); [Brooks forum: How far to look back for trading range and context](https://brookstradingcourse.com/support-forum/18-trading-ranges/how-far-to-look-back-for-tranding-range-and-context); [Brooks forum: Pressure in a TR means nothing](https://www.brookstradingcourse.com/support-forum/10-buying-and-selling-pressure/pressure-in-a-tr-means-nothing/) (forum relays; individual quotes not matched to specific threads in my search, so treat as approximate)
- H1/H2 pullback entries are most reliable in trends. In trading ranges every push is a potential H1/H2 that fails, and a "trend pause" can look like a range. Signal bars are labeled in hindsight, after the entry bar forms. — [NexusFi: Signal bars & entry bars](https://nexusfi.com/a/strategies/signal-bars-entry-bars-price-action); [NexusFi: Al Brooks price action method](https://nexusfi.com/a/strategies/al-brooks-price-action-method) (secondary)
- **Breakout pullback / failed breakout (Brooks terms):**
  - A failed breakout reverses "within a bar or a few bars of the breakout."
  - A breakout pullback is a small pullback of about 1–5 bars shortly after a breakout, read as a setup for resumption.
  - A "failed failure" (a failure that fails and resumes in the breakout direction) is a breakout pullback.
  - Once a breakout has gone 2–3 bars without failing, a later "failure" more often just sets up a breakout-pullback entry.
  — [Brooks Trading Course forum: Failed breakout](https://www.brookstradingcourse.com/support-forum/15-breakouts/failed-breakout/); [Brooks forum: Successful vs failed BO of TRs](https://brookstradingcourse.com/support-forum/general-trading-discussion/successful-vs-failed-bo-of-trs); [Brainscape flashcards transcribing Brooks glossary](https://api.brainscape.com/flashcards/49-20717142/packs/23133273) (transcriptions; verify against *Trading Price Action* glossaries)

**Price-action bar patterns: the rigorous evidence is negative when they are used standalone**
- Marshall, Young & Rose, "Candlestick technical trading strategies: Can they create value for investors?" (*Journal of Banking & Finance* 30(8), 2006) tested 28 candlestick signals on DJIA stocks, 1992–2002, with a 10-day holding period. Bootstrap tests found no evidence that the signals predicted price moves. A 2007 follow-up by the same authors found the strategies generally unprofitable for large US stocks and suggested at most a complementary role. — [RePEc: JBF 2006](https://econpapers.repec.org/RePEc:eee:jbfina:v:30:y:2006:i:8:p:2303-2323); [CXO Advisory summary](https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/); [RePEc: J. Financial Transformation follow-up](https://econpapers.repec.org/RePEc:ris:jofitr:0834)

**Platform mechanics for synchronized MTF computation**
- NinjaTrader 8 multi-series:
  - `AddDataSeries` must be called in `OnStateChange` during `State.Configure` with hard-coded arguments. `BarsInProgress` identifies which series triggered `OnBarUpdate`.
  - Historically, bars process by timestamp: on equal timestamps, "calling the primary bar series of the corresponding timestamps first, and then calling the secondary series." This is "NOT guaranteed to be the same sequence that these events occurred in real-time."
  - With `Calculate.OnBarClose` (historical), a forming HTF bar is not visible ("would not be known at that time"). With `OnEachTick`/`OnPriceChange` in real time the script sees the in-progress HTF bar's OHLCV, so live and reloaded-historical results can differ.
  - "Bars are not considered closed until the first tick of the following bar comes in."
  - Tick Replay is needed for identical historical and real-time tick sequences. For backtests, submit orders to the most granular series.
  — [NinjaTrader 8 Help: Multi-Time Frame & Instruments](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)
- TradingView Pine `request.security()`:
  - With `gaps_off`, it "returns the last confirmed close from the hourly timeframe on all historical bars," but on realtime bars "returns the symbol's current close value, regardless of confirmation," i.e., the developing HTF bar is visible only in real time.
  - `gaps_on` returns `na` until new HTF data is confirmed.
  - An offset expression with `lookahead_on` (e.g., `hl2[1]`) "always uses the last confirmed value from the higher timeframe," and is "the only recommended method to avoid repainting."
  — [Pine Script User Manual: Other timeframes and data](https://www.tradingview.com/pine-script-docs/concepts/other-timeframes-and-data/); [Pine: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)

### Inferences
All items in this subsection are my synthesis unless a source is linked.

**(1) How swings nest, and mapping in both directions**
- **HTF → LTF mapping (exact, given identical data and session template):** a confirmed HTF swing high at HTF bar *k* has price = max(LTF highs within bar *k*'s time span). Its LTF location is the LTF bar holding that maximum, which on the LTF is usually the extreme of an LTF swing high of some degree. Store `ltf_bar_of_extreme` with each HTF swing so the review chart can draw HTF levels on the LTF chart from the exact bar.
- **LTF → HTF promotion:** an LTF swing becomes an HTF swing only when the HTF detector confirms it.
  - Bar-count on HTF bars: it must be the extreme of the HTF pivot bar and survive R HTF bars.
  - DC ladder on one series: an extreme confirmed at θ₁ is promoted to θ₂ if price retraces ≥ θ₂ from it before exceeding it.
  - Most LTF swings never promote. Inside an HTF leg, LTF swings are "internal" structure (same meaning as SMC internal vs. swing structure; Section 2).
- **Nesting consistency check (machine-checkable):** every HTF swing price must equal some LTF swing price (bar-count with consistent bars), or some lower-θ extreme (DC ladder). If it does not, the thresholds or session templates are mismatched. Run this check before trusting any MTF rule visually.
- **Which LTF break constitutes an HTF structure change.** By the Dow definition above, an HTF uptrend ends when an HTF lower high is followed by a decline below the HTF *protected* low, the HL that launched the last HTF BOS. That protected low is a specific price, and it is also an LTF swing low. Three detection grades, from earliest and noisiest to latest and cleanest:
  1. *LTF touch/sweep* of the HTF protected low. Not a change. It is a liquidity test and a candidate HTF 2B.
  2. *LTF close* below it, ideally preceded by an LTF LH below the HTF high (an LTF 1-2-3 top at HTF scale). This is a **provisional HTF CHoCH**: early, but it can be undone if the HTF bar closes back above (an HTF 2B/spring).
  3. *HTF bar close* below it. This is the **confirmed HTF CHoCH**: no look-ahead risk, but late (up to one full HTF bar).
  A system should label which grade it uses. A reasonable default is grade 3 for *bias* and grade 2 only as a "bias suspended / stand aside" flag.
- **Pullback anatomy across layers:** an HTF pullback in an HTF uptrend is, on the LTF, an LTF downtrend (LTF LH/LL) bounded above by the last HTF SH and below by the HTF protected low. Dow's secondary reaction (1/3–2/3 retracement of the primary leg) is the classical size template. It is not a rule, and Osler (Section 6) found practitioners' "level strength" judgments uninformative.

**(2) HTF bias + LTF trigger templates (codable; untested; for visual review)**
```
Template A — HTF-trend pullback continuation (Elder tide/wave/ripple in swing terms)
  HTF.trend == UP (confirmed HH+HL; last HTF event = BOS_UP)
  price < HTF.lastSH and price > HTF.protectedLow                 # inside HTF pullback ("wave")
  optional location filter: price within HTF retracement zone of the last HTF leg, or at HTF AVWAP from protectedLow  (anchors per Section 7)
  LTF.trend == DOWN (LTF LH/LL during the pullback)
  TRIGGER: LTF CHoCH_UP (LTF close above last confirmed LTF LH)    # the "ripple"
  stop: below the LTF swing low that preceded the CHoCH (tight) or below HTF.protectedLow (wide)
  invalidation of bias: HTF close < HTF.protectedLow (grade 3)

Template B — LTF swing failure (2B/sweep) at an HTF swing level
  level = confirmed HTF swing high (untaken) or HTF range high
  LTF: high > level + minPen, then LTF close < level within k LTF bars (2B on LTF) and LTF CHoCH_DOWN
  context: HTF.trend in {DOWN, RANGE}, or HTF uptrend extended into a prior HTF/next-higher-TF swing high
  stop: above max(high since penetration); target: HTF mid-range / HTF protected low
  optional stricter version: wait for the HTF bar to close back below level (HTF 2B), which adds up to one HTF bar of lag

Template C — HTF breakout-pullback (Brooks breakout pullback, swing terms)
  HTF BOS_UP (HTF close above HTF SH)
  LTF pullback toward the broken level that holds above it (LTF HL ≥ level - tol) within N HTF bars
  TRIGGER: LTF CHoCH_UP / LTF BOS_UP; stop below LTF HL; failure = HTF close back below level (failed breakout)
```
- Template B is the MTF form of Sperandeo's 2B and Wyckoff's spring/upthrust (Section 3). The HTF level gives location and the LTF structure gives timing. Osler's stop-clustering mechanism (Section 6) is the plausible rationale. The evidence is about round numbers and published levels, not specifically HTF swing levels.
- Template A is the MTF form of Brooks' H2 logic: the LTF downtrend inside the HTF pullback is the "two legs down," and the LTF CHoCH up is the resumption.

**(3) Alignment states across a stack and conflict resolution**
- **Per-layer state:** `trend ∈ {UP, DOWN, RANGE}`, `phase ∈ {IMPULSE, PULLBACK}` (impulse = price beyond the last BOS level in the trend direction; pullback = between protected swing and last extreme), `last_event ∈ {BOS, CHoCH, SWEEP}`, `bars_since_event`.
- **Suggested stacks** (ratio ≈ 4–6 per Elder/LuxAlgo; futures sessions change the arithmetic):

| Stack (bias / setup / trigger) | Ratios (ETH, ~23h/day) | Ratios (RTH-only ES/NQ, 6.5h) | Note |
|---|---|---|---|
| Weekly / Daily / 240m | 5 days; ~5.75 | 5; ~1.6 (too close) | Use ETH bars for this stack |
| Daily / 240m / 60m | ~5.75; 4 | ~1.6; 4 | ETH only |
| Daily / 60m / 15m | ~23; 4 | 6.5; 4 | RTH-friendly |
| 240m / 60m / 15m | 4; 4 | 4; 4 | Intraday swing |
| 60m / 15m / 3m | 4; 5 | 4; 5 | Intraday scalp-swing |
| Volume/range-bar tiers | choose bar sizes so the average bar count per HTF swing ≈ 4–6× the LTF | same | Activity-normalized; DC thresholds map naturally |
- **Resolution rules (deterministic):**
  1. *Bias* comes from the highest layer in the strategy's stack. A lower layer opposing it is classified as a correction until the higher layer's protected swing breaks, at grade 3 (per LuxAlgo above).
  2. *Entry* is allowed only when the trigger layer flips back into the bias direction.
  3. If the two upper layers conflict (e.g., weekly DOWN, daily UP), there are two options. One is to mark the state **CONFLICT**, trade only Template B at the higher layer's levels, or stand aside. The other is to adopt the nearer upper layer as bias and use the farther one only for targets and level maps. Pick one per strategy and document it.
  4. If the bias layer is in **RANGE**, prefer failure templates (B) at range edges over continuation templates (A/C).
  5. Use at most three layers per strategy. Additional layers become *level providers* (weekly/daily swing prices drawn on the chart), not state gates. This matches LuxAlgo's warning about delay and contradiction.
- **Alignment score** (optional, for the review dashboard): +1/−1 per layer trend, weighted by layer rank. Use it for display only, to avoid hidden optimization.

**(4) Scaling swing strength and thresholds per timeframe so each layer finds "its own" swings**
- **Bar-count detectors:** using the *same* L/R (e.g., 2/2 or 3/3) on each timeframe's own bars scales automatically, because the bars differ. This is the simplest choice, and it is visually consistent with what traders see on each chart.
- **ATR/DC detectors:** set θ_TF = k × ATR(n) computed on *that* timeframe's bars, with the same k at each layer. If everything is computed on one LTF series, use a θ ladder whose ratios match the ATR ratios between the timeframes it emulates. Under random-walk (diffusive) scaling, ATR grows roughly with √(time ratio), so a 4–6× time step ≈ 2–2.5× θ step. This is a heuristic: intraday volatility seasonality (open/close, news) breaks it, so measure the actual ATR ratios per instrument. Glattfelder et al.'s finding that DC statistics follow stable scaling laws across about three orders of magnitude of θ (Section 2) supports treating a θ ladder as a coherent multi-scale structure.
- **Target granularity check:** each HTF leg should usually contain a handful of LTF swings, not one and not dozens. If an HTF leg typically shows only 1 LTF swing, the layers are too close. If it shows more than about 10, the trigger layer is too noisy for visual review.
- **Weekly layer in futures:** the weekly bar boundary (Sunday evening ET open), holiday weeks and contract rolls matter. For HTF swing levels, compute on the contract or adjustment method that will actually be traded. Back-adjusted continuous series shift historical swing prices by the roll spread, while live participants see unadjusted levels. (Inference; verify platform-specific roll handling.)

**(5) Interpreting price-action triggers relative to HTF swing context**
Codable, untested definitions; the thresholds are judgment calls:
- **Pin bar / rejection bar:** wick in the rejection direction ≥ ~2/3 of the bar range, and close in the opposite third. Meaningful only when the wick *penetrates a confirmed swing level* of the same or higher layer and the close is back inside. The bar then *is* a one-bar sweep/2B (Section 3), so encode it as `SWEEP + close-location`, not as a free-standing pattern. Elsewhere (mid-range, no level) it has no swing meaning.
- **Engulfing bar:** body exceeds the prior bar's body and the close goes beyond the prior bar's open. At an HTF level, in the bias direction, it is the earliest bar-level proxy for an LTF CHoCH, but it is noisier. Prefer the LTF swing-based CHoCH and use the engulfing bar as an optional "early trigger" variant.
- **Inside bar break:** an inside bar is a 2-bar micro-range (and is ignored by Gann/Williams swing rules; Section 1). A break in the HTF bias direction during an HTF pullback means continuation (Template A at micro scale). A break against the bias into an HTF level means a fade candidate (Template B). Inside bars inside inside bars should be clustered (cf. Optuma's clustering option).
- **Breakout-pullback (Brooks):** in swing terms, an LTF HL forms above the broken HTF level within roughly 1–5 LTF bars after an HTF BOS (Template C). The Brooks rule that maturity matters (2–3 bars without failure) can be encoded as `bars_since_BOS ≥ 2` before treating a dip as a pullback rather than a failure.
- **Evidence posture:** the only rigorous test found (Marshall et al. 2006) shows candlestick signals alone did not predict DJIA stock returns. The defensible role of bar patterns is (a) timing inside a swing/level context and (b) defining a tight, objective stop (beyond the pattern's extreme). Any claim that pin bars or engulfing bars "work" in futures without that context is anecdotal.

**(6) Automation: synchronized MTF swing state without look-ahead**
```
# Build all bars from ONE raw stream (Rithmic/Tradovate ticks or 1-min) using ONE session template (exchange ETH or RTH)
for each layer TF in stack (low → high):
    bars[TF]  = resample(stream, TF, session_template, label = BAR_CLOSE_TIME)   # label by close time to make availability explicit
    engine[TF] = SwingEngine(detector = pivot(L,R) or DC(k*ATR_TF), tie_rule, outside_bar_rule)

on each LTF bar close at time t:
    for TF in stack where a TF bar closed at time ≤ t and not yet processed:
        engine[TF].update(bars[TF].last_closed)                 # confirmed swings only; emits Swing{..., confirm_time}
        snapshot[TF] = engine[TF].state()                        # trend, phase, lastSH, lastSL, protectedHigh/Low, last_event, confirm_time
    # Every rule reads only snapshot[TF] with snapshot.confirm_time ≤ t
    # Legitimate real-time info: LTF price vs. CONFIRMED HTF levels (touch, sweep, close beyond)
    # Not legitimate: whether the DEVELOPING HTF bar will become a pivot, or its final close
    developing[TF] = running OHLC of the current, unclosed TF bar     # display + grade-1/2 checks only, never bias
    evaluate templates A/B/C using snapshot[bias], snapshot[setup], engine[trigger] events
```
- **Bar labeling:** whether a platform stamps bars by *open* time or *close* time decides what "available at t" means. Labeling HTF bars by close time and checking `confirm_time ≤ t` makes look-ahead structurally impossible. Verify each platform's convention. NinjaTrader notes a bar is only closed when the next bar's first tick arrives, and Pine's realtime `request.security` returns developing values unless offset with `[1]` and `lookahead_on`.
- **Historical-vs-live parity:** both NinjaTrader (OnBarClose vs OnEachTick) and Pine (gaps_off realtime behavior) document that live MTF values can differ from reloaded history. For a system that will be reviewed visually *and* run live, (a) evaluate HTF state only at HTF bar close, and (b) build HTF bars yourself from the same stream that feeds execution, rather than mixing platform-supplied HTF series with self-built LTF bars.
- **Developing HTF bar policy:** pick one and display it.
  - *Strict*: ignore the developing HTF bar entirely; bias updates only at HTF close.
  - *Provisional overlay*: show the developing HTF bar's running extreme and a provisional HTF swing in a distinct style, used only for "bias suspended" flags (grade-2 events), never to open trades.
- **Event logging for review:** log each signal with the full stack snapshot (each layer's trend, phase and protected levels, with their confirm times). The reviewer can then replay the decision and confirm that no input was confirmed after the signal time.

### Gaps
- I did not retrieve Elder's *Trading for a Living* / *Come Into My Trading Room* text. The factor-of-five rule, and whether Elder or Rhea originated the tide/wave/ripple metaphor, are from secondary sources that conflict.
- I did not retrieve Rhea's/Hamilton's original text. The durations (secondary 10–60 days, 1/3–2/3 retracement) come from a secondary summary and refer to daily stock averages, not intraday futures.
- I found no primary Brooks text on exactly how he combines timeframes. The forum relays suggest his course does not formalize it.
- I found no rigorous study of MTF swing alignment (HTF bias + LTF trigger) improving outcomes in futures or elsewhere. All support is practitioner or vendor material, and LuxAlgo itself says alignment is unproven ("test it against your own signals").
- I found no rigorous futures evidence on pin bars, engulfing bars or inside-bar breaks, with or without swing context. Marshall et al. (stocks, daily) is negative for standalone candlesticks.
- I did not verify each platform's bar-timestamp convention (open vs close time) or Tradovate/Rithmic-specific multi-series APIs in this session.
- I found no rigorous source for optimal timeframe ratios beyond the practitioner 4–6× convention.
