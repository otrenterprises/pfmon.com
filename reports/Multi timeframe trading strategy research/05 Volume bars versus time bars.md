# Volume candles keep price action, change its clock

**Price action works on volume candles.** A constant-volume bar still records the real first, highest, lowest and last traded prices, so swings, trendlines, signal bars, support and resistance, break of structure and every other concept in this set carry over mechanically; the only thing that changes is the x-axis, which now counts contracts instead of minutes. That change gives three concepts a new meaning: a bar's range becomes **price impact per fixed slice of volume**, its clock duration becomes a free **measure of activity**, and every bar-count rule (swing confirmation, indicator lookbacks, "within N bars") is now **measured in contracts**. One thing must not change: anything the calendar defines stays on clock time. That covers the weekly and daily candles, prior-day and prior-week levels, the opening range, the initial balance, session boundaries, news windows and flat-by-time rules. The statistical case for volume bars is real but partial. From Clark (1973) through Easley, López de Prado and O'Hara (2012) on E-mini S&P futures, sampling by volume removes most intraday seasonality and pulls returns closer to normal. Independent reproductions, though, find that returns stay fat-tailed and dependent and that time bars remain a competitive baseline. **No study shows that volume bars make price-action setups more profitable.** Their honest advantage is comparability: a 3 a.m. candle and a 9:31 a.m. candle represent the same amount of trading. This write-up recommends three volume-bar tiers sized from the instrument's 20-session ADV (VB-A = ADV/50, VB-B = ADV/250, VB-C = ADV/1000), recalibrated weekly and breaking at the Globex session start, stacked under W1 and D1 clock candles. Build the bars yourself with an exact-N split rule, then check them bar for bar against your charting platform before you trust any signal.

## A constant-volume bar changes the x-axis, not the market

"Volume candle" means two different things, so check which one you mean first. TradingView's built-in **"Volume candles" chart type is not a constant-volume bar**. Its candles "vary in thickness depending on the trading volume", which is width coding on time-based candles, and the chart type needs a Premium plan or higher ([TradingView](https://in.tradingview.com/support/solutions/43000724995); [FX News Group](https://fxnewsgroup.com/forex-news/platforms/tradingview-expands-range-of-chart-types-with-addition-of-volume-candles/)). If that is the chart you like, every time-bar rule in [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) applies unchanged. This write-up covers the other kind: a bar that closes when a fixed number of contracts has traded, however long that takes. Platforms name it differently:

| Platform or API | Name | Description in its docs |
|---|---|---|
| NinjaTrader 8 | Volume bar | Built from tick data ([NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)) |
| Sierra Chart | Volume Per Bar | ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)) |
| CQG | Constant Volume Bar | "Time is not a factor" ([CQG](https://help.cqg.com/cqgic/19/Documents/constantvolumebarcvb.htm)) |
| Quantower | Volume Bars | "Time is not involved in this aggregation" ([Quantower](https://help.quantower.com/quantower/analytics-panels/chart/chart-types/volume-bars)) |
| Rithmic | `VOLUME_BAR` | ([Rithmic/protos.json](../../Rithmic/protos.json)) |
| Tradovate chart API | `elementSizeUnit: "Volume"` | ([Tradovate/openapi.json](../../Tradovate/openapi.json)) |

Because each of these bars keeps true traded OHLC, price action's vocabulary survives intact. What changes is what one bar represents. The table sorts every concept in this set into three groups.

| Carries over unchanged | Changes meaning | Must stay on clock time |
|---|---|---|
| Price levels and support/resistance (a level is a price); LEVELS and PROFILE(P) computed from ticks; SWING, STRUCTURE, BOS, CHoCH logic; candle anatomy (body, wick, close location); stop-entry triggers beyond a signal bar | Range = price impact per V contracts; duration = activity; "N bars" = N × V contracts (swing confirmation, EMA/ATR lookbacks, setup expiry); trendline slope = points per contract; engulfing no longer implies more volume; raw bar volume is constant, so volume reads move to duration, delta and range | W1 and D1 candles; PDH/PDL/PDC, PWH/PWL/PWC, WO/DO, ONH/ONL, IBH/IBL, ORH/ORL; session boundaries and the daily halt; scheduled news windows; flat-by-time and setup-expiry deadlines; roll dates |

## Fifty years of volume-clock theory deliver partial gains

The idea that markets run on a "business clock" rather than a wall clock is decades older than trading software. **Mandelbrot and Taylor (1967)** observed that "price changes over a fixed number of transactions may have a Gaussian distribution", while changes over a fixed time "may follow a stable Paretian distribution, whose variance is infinite" (quoted in [Easley, López de Prado & O'Hara](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). **Clark (1973)** formalised this in *Econometrica* as a subordinated process. Price moves smoothly in an operational time, and trading volume drives how fast that time runs ([Econometric Society](https://www.econometricsociety.org/publications/econometrica/1973/01/01/subordinated-stochastic-process-model-finite-variance)). **Ané and Geman (2000)**, in the *Journal of Finance*, showed that a stochastic time change can recover near-normal returns. They also found the **cumulative number of trades a better clock than volume** ([IDEAS/RePEc](https://ideas.repec.org/a/bla/jfinan/v55y2000i5p2259-2284.html)). That last result is disputed. Murphy and Izzeldin's Monte Carlo experiments show that Ané and Geman's procedure cannot accurately recover the higher moments of the information flow, and in their data, returns conditioned on trade counts were not Gaussian ([IDEAS/RePEc](https://ideas.repec.org/p/wpa/wuwpfi/0512005.html)).

The futures-specific evidence comes from **Easley, López de Prado and O'Hara, "The Volume Clock" (*Journal of Portfolio Management*, 2012)**. They claim that volume time "removes most intra-session seasonal effects", "allows a partial recovery of Normality and the IID assumption", and deals with random, asynchronous transactions ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [SSRN](https://papers.ssrn.com/abstract=2034858)). Their Exhibit 2 compares standardised E-mini S&P 500 price changes sampled every minute with price changes sampled **"every 1/50 of the average daily volume"**, from January 2008 to October 2010. That evidence is a distribution plot with a normal curve overlaid, and the paper **reports no test statistics**. The same paper shows why time bars are awkward in ES. Volume concentrates in the first few seconds of each minute, in almost every hour of the day. The authors attribute this to TWAP/VWAP algorithms that trade in one-minute slots, and they warn that trading on round-minute boundaries is exploitable. Their advice to slower traders is to "adopt the HFT 'event-based time' paradigm" where possible.

López de Prado's *Advances in Financial Machine Learning* (2018), Chapter 2, turned this into the bar taxonomy most automation libraries now implement. The book itself was not read for this research; the points below come from secondary summaries ([Reasonable Deviations](https://reasonabledeviations.com/notes/adv_fin_ml/); [mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)):

- **Time bars** "should not be used because markets do not process information at a constant rate", and they show serial correlation, heteroskedasticity and non-normality.
- **Tick bars** behave "much more like i.i.d Gaussian", but opening and closing auctions can arrive as one huge tick.
- **Volume bars** improve on tick bars because trade sizes differ.
- **Dollar bars** are more robust to changes in price level.
- **Information-driven bars** (tick, volume and dollar imbalance bars, plus run bars) sample faster when signed order flow deviates from its EWMA expectation, that is, "more frequently when there is informed trading".

The book also recommends a symmetric CUSUM filter for event-based sampling instead of naive downsampling.

Independent reproductions temper these claims:

- The mlfinpy documentation says tick, volume and dollar bars "all exhibit a distribution significantly closer to normal" ([mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)).
- daru.finance reproduced the result across crypto, US equities and FX: all three bar types moved closer to normal, and volume bars were narrowly best ([daru.finance](https://daru.finance/research-review/lopez-de-prado)).
- Sefidian found that **neither volume-bar nor dollar-bar returns were Gaussian**, and only volume bars lowered serial correlation ([Sefidian](https://www.sefidian.com/2021/06/12/introduction-to-advanced-candlesticks-in-finance-tick-bars-dollar-bars-volume-bars-and-imbalance-bars/)).
- EODHD found spurious lag-1 autocorrelation in volume and dollar bars until off-market prints were filtered out ([EODHD](https://eodhd.com/financial-academy/?p=7012)).
- The largest recent comparison is a 2026 preprint on Binance BTCUSDT perpetuals. It concluded that "normality gains are regime-dependent and secondary" and **rejected Ljung-Box independence for every bar type**. Calendar bars were competitive, and information bars helped mainly on variance-ratio conformance: tick volatility bars cut |VR(4)−1| from 0.089 to 0.028 ([arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)). It covers crypto only and is not peer reviewed.

No peer-reviewed study since 2012 tests volume bars against time bars on ES, NQ or CL with modern data.

**The verdict is "partial gains."** Equal volume per bar roughly equalises variance per bar and strips out the open/lunch/overnight rhythm. That is a genuine improvement at the level of mechanism (Grade A). The strong form, that volume bars make returns IID normal, has been tested and does not hold (Grade D). None of this literature tests whether price-action setups work better on volume bars. For a trader who reads charts by eye, the defensible benefit is comparability, not edge.

### Mandelbrot's 1973 caveat decides what stays on clock time

Mandelbrot commented on Clark's paper in the same *Econometrica* issue. One passage from that comment governs how this user should mix bar types: "if price variation is to proceed smoothly in local time, then local time itself must flow at random and at a highly variable rate. Consequently, as long as the flow of local time remains unpredictable, concrete identification of the applicable local time leaves the problems of economic prediction unaffected" ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [IDEAS](https://ideas.repec.org/a/ecm/emetrp/v41y1973i1p157-59.html)). In plain terms, **you cannot know in advance how many minutes the next 5,000 contracts will take**. Volume time is excellent for describing what happened, but it cannot schedule anything.

So every rule with a clock deadline needs a clock anchor:

- The weekly bar closes on Friday afternoon, whatever the volume.
- CPI prints at 8:30 a.m. ET, whatever the volume.
- The ES maintenance halt starts at 16:00 CT.
- A "flat by the close" rule cannot be written in contracts.

This is the theoretical reason the shared conventions keep W1, D1 and all LEVELS on clock time. It is also why the builder in this write-up adds clock and news guards to an engine that otherwise runs on volume.

## Futures sessions stretch and squeeze volume bars

On a 23-hour Globex chart, volume bars **compress quiet periods into a few bars and expand busy periods into many**. Easley et al. describe ES volatility forecasting "over the next 50,000 contracts, whatever the number of (night-session) hours or (day-session) milliseconds it takes to exchange that volume" ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). In practice, an ETH volume chart looks like an RTH chart with a short overnight preamble, so separate RTH and ETH charts are less necessary than they are with time bars. Galen Woods makes the matching point from the time-bar side. A 5-minute bar at the open is a different object from a 5-minute bar after hours, whereas daily time bars make sense because each one covers a full session ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)).

Four futures details decide whether those bars can be reproduced.

**Session-start breaks and the partial last bar.** NinjaTrader 8 builds each session's bars "freshly... beginning from the first tick of the session". The last bar of a session "may contain a volume less than" the setting, and the "Break at EOD" property controls this ([NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)). Sierra Chart calls New Bar at Session Start "necessary" with Volume Per Bar. A bar that crosses into the next trading day is cut, and the trading day begins at the Session Start Time, or the Evening Start Time when an evening session is used ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). Practitioners disagree: one NexusFi user unchecks the option to avoid incomplete bars, another keeps it so VWAP and overnight statistics line up ([futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)). The vendor's documented requirement and the need for clean daily boundaries make **a break at the Globex session start** the default in this set. For ES that boundary falls at 17:00 CT, after the daily 16:00–17:00 CT maintenance period ([CME ES specs](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html)). The cost is one partial bar per session, which must be flagged.

**Large prints: split or overflow.** By default, Sierra Chart volume bars are "equal to or greater than" the setting. Split Data Records divides a record "to create 100% constant" bars, and only the Volume and Number of Trades fields are split. The final record in the data file is never split, so the very last bar can overshoot ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). NinjaTrader's pages do not say which rule it uses. Split gives bars of exactly N contracts and keeps the equal-participation property. Overflow makes one oversized bar per large print. Either convention is defensible; using different ones on the chart and in the bot is not.

**How trades are reported.** About **51.56% of ES trades in 2010–2011 were one lot**, and round sizes are heavily overrepresented: size 50 was 10.86 times as frequent as size 49 ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). Sierra Chart offers "Combine Trades Into Original Summary Trade" for CME and EUREX futures, because a feed can report one aggressor order as many fills ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). That changes trade counts but not volume totals.

**Rollovers and volume regimes.** Build each series on one contract month. A thin back month spliced into a continuous series distorts bar durations around the roll, and Easley et al. list calendar rolls among the "seasonal effects" that slower traders should avoid. Volume levels also drift. CME equity-index futures ADV ran about 6.5M contracts in Q1 2025, 5M in Q3 2025 and 7.2M in Q1 2026, and Micro E-mini S&P ADV rose 35% in 2025 to 1.2M (CME figures via search summaries; [Barchart](https://www.barchart.com/story/news/36882764/cme-group-reports-record-annual-adv-of-28-1-million-contracts-in-2025-up-6-year-over-year); [CME Equity Insights](https://www.cmegroup.com/news/2026/equity-insights-report-april-2026.html)). A bar size fixed last year draws a different chart this year, which is why this set recalibrates sizes weekly.

### Every platform builds a slightly different "volume bar"

| Platform / API | True constant-volume bar? | Large-print rule | Session break | Notes for this user |
|---|---|---|---|---|
| Sierra Chart | Yes ("Volume Per Bar") | Overflow by default; exact with Split Data Records (vendor-recommended) | New Bar at Session Start, documented as necessary | Best documented. Combine Trades option for CME |
| NinjaTrader 8 | Yes ("Volume") | Not documented | Fresh bars from each session's first tick; "Break at EOD" | Built from tick data; Tick Replay rebuilds historical bars from ticks |
| TradingView | **No**, natively ("Volume candles" = width-coded time candles) | n/a | n/a | Constant-volume only via community scripts: CBTV in a separate pane, LuxAlgo Volume Aggregation Bars |
| Quantower | Yes ("Volume Bars", lots or ticks per bar) | Not documented | Not documented | — |
| CQG | Yes (Constant Volume Bar) | Not documented | Not documented | "All volume studies and price-based studies work with CVB charts"; showing current volume tells you how close the bar is to completion |
| ATAS | Volume-based frames | Not documented | Not documented | The BTK bar algorithm is "not disclosed", so BTK bars are unsuitable for rule-based use |
| Rithmic R\|Protocol | Yes (`VOLUME_BAR`, server-built, live and replay) | Not documented; verify | `barSubType CUSTOM` with `customSessionOpenSsm/CloseSsm` | Use as a cross-check for a local builder |
| Tradovate API | Yes (`md/getChart`, `elementSizeUnit:"Volume"`) | Not documented | Not documented | No weekly chart unit; native desktop bar types unverified |

Sources: [Sierra Chart](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html); [NT8](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm); [TradingView](https://in.tradingview.com/support/solutions/43000724995); [CBTV](https://in.tradingview.com/script/3fKYlqbQ-Candles-Based-On-Traded-Volume); [LuxAlgo](https://www.luxalgo.com/library/indicator/JYq3JqgD-volume-aggregation-bars/); [Quantower](https://help.quantower.com/quantower/analytics-panels/chart/chart-types/volume-bars); [CQG help](https://help.cqg.com/cqgic/19/Documents/constantvolumebarcvb.htm); [CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts); [ATAS](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/); [Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json).

"Volume bar" is a family name, not one specification. Two charts both labelled "5,000 volume" can differ in session template, split rule and timestamp convention, and a visual review is valid only if the chart and the bot agree on all three. Sierra Chart and NinjaTrader 8 are the strongest review hosts. Both document volume bars, run multiple series up to weekly, and state explicit historical-versus-realtime rules ([07 Automation architecture](07%20Automation%20architecture.md)).

## Each candle becomes a fixed budget of contracts

Practitioners consistently report that bar reading transfers to volume charts:

- Galen Woods writes that "unlike range charts, we are able to apply bar pattern analysis on constant volume charts", because fixing volume lets you compare what price does for the same amount of activity: "Volume is the fuel of market movements" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)).
- On the Brooks Trading Course forum, the course admin was asked whether trendlines and signal bars from 5-minute charts carry over to tick charts. He answered "Yes, and yes", and said tick charts are especially useful for trendlines that run from the overnight into RTH. A moderator said price action "should work as well". He noted that roughly 6,500-volume ES charts closely resembled a 5-minute chart in 2021, and warned that faster charts give "more false signals" during breakouts ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)).
- Comparable tick and volume settings "plot price action so closely that it's impossible to tell which one is what" ([TradingMarkets](https://tradingmarkets.com/?p=676863)).

The dissent is about comfort, not mechanics. One NexusFi trader finds time charts far easier to read ([NexusFi](https://nexusfi.com/traders-hideout/23194-why-tick-charts-instead-time-based-charts-other-chart-types-2.html)), and forum commenters say Al Brooks himself trades 5-minute time charts ([NexusFi](https://nexusfi.com/traders-hideout/734-book-discussion-reading-price-charts-bar-bar-al-brooks-17.html)). Woods' own caution also stands: "most trading methods use time charts", and "the only way to find out is to test." None of this is controlled evidence. It is consistent practitioner consensus resting on an indirect mechanism: Grade B for "transfers", Grade C for any claim that price action works better on volume bars.

What changes is what the bar's geometry means. The rules below follow from the equal-volume construction. They are design reasoning, not tested results.

| Concept | On time bars | On constant-volume bars | Rule of use |
|---|---|---|---|
| Bar range | Mixes volatility with how busy the interval was | **Price displacement per V contracts**, a price-impact proxy in the style of Kyle's lambda or Amihud. Wide = thin book or one-sided aggression; narrow at a level = absorption | Compare with the trailing median range of the same tier, never with a time-bar ATR |
| Bar duration | Constant by definition | **A free activity signal.** Fast bars = participation surge (open, news, breakout); slow bars = disinterest | Log `t_close − t_open` on every bar. A fast, wide breakout shows impact plus urgency; a slow, narrow one is suspect |
| Pin bar / wick | An overnight wick can reflect a few hundred contracts | Rejection within a fixed participation budget, so wicks compare across sessions | Use the anatomy thresholds from [02](02%20Multi%20timeframe%20price%20action.md) unchanged |
| Engulfing | Often implies more volume than the prior bar | **Engulfs a bar of equal volume**, so it shows only that one side moved price further | Do not read "more volume" into it |
| Inside bar / NR | Contraction, partly an artifact of a quiet clock | Compression per unit volume: a cleaner contraction definition | NR and inside-bar rules carry over |
| Gaps | Possible between bars | Essentially none within a session; only at forced session breaks | Gap patterns exist only at the Globex open |
| Bar volume (VSA reads) | Varies | **Constant** (= V except partial bars) | Move "low volume" reads to duration, delta (buy minus sell aggressor volume) and range per volume; see [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) |
| Trendline | Slope in points per minute | Slope in **points per contract**, so the same line touches different bars on time and volume charts | Draw lines on the chart that triggers; never carry a line across bar types |
| Levels and profiles | Price-based | Price-based, unchanged | Compute LEVELS and PROFILE(P) from ticks on clock or session boundaries and overlay them. Never derive an opening range from "the first K volume bars" |
| Indicators | Lookback = fixed minutes | Lookback = fixed contracts. An EMA(20) on 2,000-lot bars covers the last 40,000 contracts: ten minutes at the open, or six hours overnight | ATR(L) gets closer to stationary. Oscillator thresholds tuned on M5 do not transfer |

Two rows matter most, because they are the genuinely new information the user gains.

**Range per bar becomes a liquidity reading.** Suppose the last three VB-B bars at a PDL each moved two ticks while the tier's trailing median range is eight ticks. The level absorbed three bars' worth of selling, which a time chart cannot show without a separate volume pane.

**Duration becomes a second dimension of every candle.** Automation should store it, and visual review should display it. A duration strip under the chart, coloured by percentile, is a simple aid. CQG's habit of showing the developing bar's volume helps too, because it tells the reader how close the bar is to closing ([CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts)).

With volume fixed, each bar has four free variables left: range, duration, delta and trade count. One inference, not a sourced result: overnight books are thinner, so overnight volume bars can be wider per contract than RTH bars. That difference is exactly what the range reading is supposed to reveal.

### Swings confirm after contracts, not minutes

SWING(L) needs no redefinition. The default detector in this set is the directional-change / ATR-ZigZag: reversal threshold k × ATR(L), k = 2.0, with ATR frozen at the extreme. It is driven by price events, and the swing-point research notes say it "works the same on tick, volume, range or Renko bars". Directional change was in fact designed for tick data ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md); [Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)).

Bar-count pivots keep their rule but change their unit. Pivot(3,3) on VB-B is confirmed after three more VB-B bars, which is **3 × ADV/250 ≈ 1.2% of a day's volume**. On VB-C it is 0.3%, and on VB-A it is 6%. That 6% can arrive within seconds of the RTH open, or take hours in the Asian session. The swing-point notes call this arguably better around the RTH open and news, because the lag scales with activity. A volume-chart swing therefore has a consistent meaning, "a reversal that held for R × V contracts", but an unpredictable clock duration. That is Mandelbrot's caveat at the level of a single bar.

Three implementation details follow:

1. **Two timestamps per swing.** As in every write-up in this set, each swing stores its extreme time and its confirmation time, and only confirmed swings drive decisions.
2. **The true extreme comes from ticks.** A self-built volume bar has its ticks by construction. Knowing the order of trades inside the bar also resolves the outside-bar ambiguity the swing notes describe, where one bar both extends the extreme and reverses by the threshold.
3. **Structure logic is unchanged.** STRUCTURE(L), BOS and CHoCH work as usual. The HTF trend-change grades apply with a volume tier as the higher layer:
   - G1 is a VB-C touch or sweep of a VB-A protected swing.
   - G2 is a VB-C or VB-B close beyond it, which means "stand aside".
   - G3 is a **VB-A bar close beyond it**, the only grade that changes intraday bias.

## Stack volume tiers beneath clock-time weeks and days

No published method exists for multi-timeframe analysis on stacks of volume bars, and nothing compares hybrid stacks against pure-volume ones. The stacks below are design proposals, and two principles fix their shape.

**First, W1 and D1 stay on clock time.** These are the candles other participants anchor to: settlement, prior-day and prior-week extremes, weekly opens. At daily-plus horizons, volume and clock time converge anyway, because each bar covers a full session. A 2,000,000-contract ES volume bar gives about one bar per day, and Sierra Chart treats Volume Per Bar as an intraday-only bar period ([futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)).

**Second, adjacent intraday tiers should sit about 3–6× apart.** [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) defends that band from Elder's factor of five, and a NexusFi trader's reported 2,000/6,000/18,000 ES ladder follows the same pattern ([NexusFi](https://nexusfi.com/showthread.php?p=656686)). VB-A, VB-B and VB-C are 5× and 4× apart by construction. Each is an integer multiple of the tier below (see the sizing section), and all three break at the same session start, so **every VB-A boundary is also a VB-B and a VB-C boundary**. A higher-tier close always coincides with a lower-tier close. That removes a class of alignment bugs that mixed clock layers create.

**What the tiers look like in clock time.** Averaged over a 1,380-minute Globex day, VB-A is about **28 minutes per bar**, VB-B about **5.5 minutes** and VB-C about **1.4 minutes**. That is arithmetic, not a forecast. RTH bars run much faster and Asian-session bars much slower, so the ratio between a clock layer and a volume layer is never constant. Judge it by the median number of lower-layer bars per upper-layer bar during the session you actually trade.

**Bridging D1 and VB-A.** On the same average, one D1 bar holds about 50 VB-A bars, too large a jump for adjacent structure layers. There are two bridges:

- An H4 clock layer: D1→H4 is about 5.75× on a 23-hour day, and H4→VB-A is about 9× on average.
- The shared hierarchy ladder: read SWING(VB-A) at k, 2k and 4k, so the 4k degree stands in for the missing intermediate tier.

**Scalping stacks (holds of seconds to minutes).** The pure-volume stack is the natural fit for this user; the hybrid moves the intraday context layer to clock time.

| Role | Pure-volume stack (default) | Hybrid stack |
|---|---|---|
| CONTEXT | D1 STRUCTURE (G3 only) and position in the W1 range; intraday bias = STRUCTURE(VB-A) | D1 STRUCTURE; intraday bias = STRUCTURE(H1) on clock time |
| LOCATION | PDH/PDL/PDC, ONH/ONL, IBH/IBL, ORH/ORL, PROFILE(RTH) and PROFILE(ON) POC/VAH/VAL, all from ticks on clock boundaries | Same |
| SETUP | VB-B: pullback or sweep into a LOCATION level in the CONTEXT direction; SWING(VB-B) defines the leg | VB-A: same rules |
| TRIGGER | VB-C: closed-bar BOS in the CONTEXT direction, or a sweep-and-reclaim close at the level | VB-B: same rules |
| MANAGEMENT | Stop beyond the VB-C trigger swing extreme; targets at the next LEVEL or the opposing VB-B swing; clock and news guards | Stop beyond the VB-B trigger swing; same targets and guards |

**Swing stacks (holds of hours to days; W1 cap).** Here the hybrid is the default. A swing trade lives on time-anchored levels, and its trigger needs to be precise, not frequent.

| Role | Hybrid stack (default) | Pure volume below D1 |
|---|---|---|
| CONTEXT | STRUCTURE(W1) and STRUCTURE(D1), G3 only; PWH/PWL/PWC and WO | Same |
| LOCATION | PDH/PDL; PROFILE(WEEK) and PROFILE(COMP(n)) edges and POCs | Same |
| SETUP | H4 on clock time: pullback into LOCATION; SWING(H4) at k | VB-A with SWING read at 4k (emulated higher degree) |
| TRIGGER | VB-A: closed-bar BOS or CHoCH back in the CONTEXT direction | VB-A SWING at k, or VB-B for a tighter stop |
| MANAGEMENT | Stop beyond the VB-A trigger swing or the H4 setup swing; risk scaled from ATR(D1) | Stop beyond the VB-A k-degree swing; same risk scaling |

Defining the HTF trend when the HTF is a volume chart takes one rule: **only completed VB-A bars count**. A VB-A bar completes at an unpredictable clock time. That does no harm as long as decisions read only bars that were closed at decision time; the join below enforces this. How these stacks combine with volume-profile locations and Fibonacci clusters is covered in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md), and specific setups are in [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md).

## Size the bars from ADV and freeze them for the week

The best-sourced anchor is Easley et al.'s **1/50 of average daily volume**, about 50 bars per Globex day at average activity ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). mlfinpy repeats the 1/50 suggestion for tick, volume and dollar bars ([mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)). MultiCharts forum posters add a 30-day lookback that could not be confirmed against the book ([MultiCharts forum](https://www.multicharts.com/discussion/viewtopic.php?p=140109)). The 1/50 rule is a statistical sampling choice backed by a visual-only exhibit, so it gets Grade B as a convention. It is also coarse for execution, which is why it becomes VB-A, the intraday-structure and swing-trigger tier, rather than the trigger tier.

Practitioners size execution charts to resemble the time chart they already know. Woods suggests taking "the long-term average range/volume of the time-frame you usually trade" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). NexusFi members advise checking a volume chart's average true range against your stop and target sizes: bars that are too small are noise, and bars that are too large give late entries and wide stops ([NexusFi](https://nexusfi.com/showthread.php?p=678596)).

The shared tiers formalise both views: **VB-A = ADV/50, VB-B = ADV/250, VB-C = ADV/1000**, where ADV is the instrument's 20-session average daily volume. These are pre-committed starting values, not optimised ones. Rounding must preserve the integer ratios, or tier boundaries stop coinciding. So round the smallest tier and derive the others from it:

```
# Run once per week, before the Sunday 17:00 CT Globex open (WO). Never intraday.
def weekly_sizes(daily_volume, n=20):
    # daily_volume: per CME trade date, volume of the DOMINANT contract month that day
    # (front month until the roll, then the next), full-size contract (ES, NQ, CL)
    adv  = mean(daily_volume[-n:])
    vb_c = round_sig(adv / 1000, 2)     # 2 significant figures, e.g. 1,437 -> 1,400
    vb_b = 4 * vb_c                     # = ADV/250 to rounding
    vb_a = 5 * vb_b                     # = ADV/50 to rounding
    return vb_a, vb_b, vb_c             # store V with every bar built this week

def drift_alarm(bars_per_session, target, tol=0.40, sessions=5):
    # Flag only, never auto-adjust: bars/session beyond ±40% of target for 5+ sessions
    return all(abs(b / target - 1) > tol for b in bars_per_session[-sessions:])
```

For a hypothetical ADV of 1,437,000 contracts, this gives VB-C = 1,400, VB-B = 5,600 and VB-A = 28,000. Compute the real value from your own Rithmic or Tradovate daily history; this research could not retrieve current full-size ES, NQ or CL ADV. If you choose RTH-only bars, compute ADV from RTH volume, so each tier still produces roughly its target number of bars per session.

Four rules keep the calibration honest:

1. **Size each instrument separately.** ES, NQ, CL and their micros have very different ADV, so never reuse a contract count across symbols.
2. **Build on the full-size contract when a micro is only the execution vehicle.** MES and MNQ bars measure a different participant mix from ES and NQ bars while tracking the same price. This is a design proposal.
3. **Freeze the size for the week and store it with each bar.** Resizing intraday redraws history and breaks every swing-based rule.
4. **Treat the drift alarm as a prompt to look, not to retune.** That keeps faith with "proven concepts, no optimisation." With weekly recalibration the alarm rarely fires. When it does, activity changed faster than a 20-session average can follow, which is itself context worth seeing.

Practitioner settings work as sanity checks. All are anecdotal and depend on the volume regime (Grade C).

| Reported ES setting | Source | Nearest tier and use |
|---|---|---|
| ~6,500 volume ≈ M5 chart (2021) | [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/) | VB-B-like execution chart |
| 8,000 tick "most of the time" (≈ 3–5-minute equivalent), 6,000/4,000 in slow markets; "2,000 ticks and lower is far too fast" | [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/) | Tick analogue of VB-B; a warning against reading VB-C on its own |
| 2,000 / 6,000 / 18,000 volume ladder (3×) | [NexusFi](https://nexusfi.com/showthread.php?p=656686) | A pure-volume three-tier stack |
| 2,584 or 4,181 "depending on the season" | [NexusFi](https://nexusfi.com/showthread.php?p=635515) | Seasonal resizing by eye; replaced here by weekly ADV |
| 50,000 and 200,000 contract buckets (2010–11) | [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf) | HFT inventory horizon and session-bucket examples, coarser than VB-A |
| 1,000 contracts | [CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts) | Documentation example only |
| 2,000,000 ≈ one bar per day | [futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html) | Shows why D1 stays on clock time |

Dollar bars keep notional per bar constant as price levels change, and López de Prado prefers them for robustness. They suit multi-year visual reviews, but within one contract month they are nearly identical to volume bars, so live trading does not need them ([Reasonable Deviations](https://reasonabledeviations.com/notes/adv_fin_ml/); [mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)).

## Tick bars are cousins; range, Renko and Heikin-Ashi are strangers

| Bar type | Closes when | Real traded OHLC? | Price-action fidelity | Automation notes |
|---|---|---|---|---|
| Volume (constant-volume) | V contracts trade | Yes | High: equal participation per bar | Totals do not depend on the feed; choose split or overflow (split here) |
| Tick (trades) | N trades print | Yes | High; indistinguishable from volume bars at comparable settings | Count depends on CME summary-trade vs split-fill reporting; Ané and Geman's preferred clock |
| Dollar | $N of notional trades | Yes | High (≈ volume bars intraday) | Better for multi-year normalisation |
| Range | Price range reaches R | Yes, but every bar has the same range | Low for candles: "most bar patterns and candlestick patterns are ineffective" | Pivots converge to a ZigZag with threshold ≈ R × range |
| Renko | Price exceeds the prior brick by one box | No wicks (classic) | Low: discards wicks and time, prints late | A brick reversal is itself a DC event (threshold = 2 × box); best variance-ratio conformance in the crypto preprint (\|VR(4)−1\| = 0.020) |
| Heikin-Ashi | Time-based | **No**: averaged, synthetic OHLC | Do not use for signals or stops | At most a trend-colour filter, with orders priced off real data |
| Kagi / Line Break / P&F | Reversal or breakout rules | No | Structural only | Swing and level detection, not candle patterns |
| Delta-volume / imbalance / run | Signed flow crosses a threshold | Yes | Order flow, not classic price action | Needs aggressor data (Rithmic provides it); adaptive EWMA thresholds make bars hard to reproduce on a chart |
| TradingView "Volume candles" | Time-based | Yes | Same as time bars | Width = volume; not a constant-volume bar |

Sources: [NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm); [Sierra Chart](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html); [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/); [TradingMarkets](https://tradingmarkets.com/?p=676863); [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1); [mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html); [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md).

Tick bars deserve a fair hearing, because Ané and Geman found trade count the better statistical clock. The case against them is practical:

- **Trade counts depend on the feed.** CME fills can be reported either as one aggressor summary trade or as many split fills, depending on the feed and its settings. Sierra Chart's "Combine Trades Into Original Summary Trade" exists precisely because the difference matters.
- **Volume per tick bar varies.** With half of ES trades a single lot and round sizes clustered, how much volume a tick bar holds depends on who is trading.
- **Volume totals do not depend on reporting.** They are identical under any reporting convention, so bars the bot builds from Rithmic `LastTrade` match bars the platform builds from its own feed.

That is the concrete reason to prefer volume over tick counts for CME data on Rithmic and Tradovate.

The other bar types fail for different reasons:

- **Range and Renko** are statistically tidy, but they discard the wick and close information that candlestick reading depends on.
- **Information-driven bars** are interesting as secondary triggers. Their EWMA-adaptive thresholds keep changing the bar size, though, which conflicts with this user's need to see the same candles the bot saw.
- **ATAS's BTK bars** are ruled out on transparency grounds: the vendor says the formation algorithm is not disclosed ([ATAS](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/)).

## Build every bar from exactly N contracts

A volume bar is simple to build live: add up traded size until it reaches V. Reproducibility depends on five decisions, each made once and logged with every bar: the split rule, the session-break rule, the timestamps, the higher-timeframe join and the contract month. The pseudocode below is a reference design for the repo's Rithmic or Tradovate stack, consistent with the pipeline in [07 Automation architecture](07%20Automation%20architecture.md).

**Rithmic inputs.** Subscribe to `LastTrade` (template 150). It carries:

- `tradePrice`, `tradeSize` and `aggressor` (BUY=1 / SELL=2);
- exchange-source time (`sourceSsboe/sourceUsecs/sourceNsecs`) and gateway receive time (`ssboe/usecs`);
- `isSnapshot`.

Drop snapshot messages so that database replays are not counted as trades, and assign trades to bars by exchange-source time ([Rithmic/protos.json](../../Rithmic/protos.json); [Rithmic Reference Guide](../../Rithmic/Reference_Guide.pdf)).

**Tradovate inputs.** Request a tick chart (`underlyingType:"Tick"`, `elementSize:1`). Packets carry relative time, price, size, optional bid/ask and a tick `id`. Because "tick stream data can arrive out of chronological order", sort and deduplicate by `id` before building ([Tradovate/openapi.json](../../Tradovate/openapi.json)).

**Data hygiene.** Filter out off-market prints: unfiltered ticks produced spurious autocorrelation in EODHD's volume bars ([EODHD](https://eodhd.com/financial-academy/?p=7012)). Not verified: whether either feed delivers CME summary trades or individual fills, and how block trades or spread-leg trades appear. Those details determine how often the split rule fires.

```
# One builder per (contract month, tier). V is frozen for the week. SPLIT convention.
on_trade(ts_exch, px, q, side):            # sorted by exchange time, snapshots dropped
    if bar is None: bar = open_bar(px, ts_exch)
    while q > 0:
        take = min(q, V - bar.vol)          # never exceed V
        bar.add(px, take, side, ts_exch)    # H/L/C, vol, buy_vol, sell_vol, n_trades, t_last
        q -= take
        if bar.vol == V:
            emit_closed(bar, t_close=ts_exch, partial=False)    # BarClosed exactly once
            bar = open_bar(px, ts_exch) if q > 0 else None
    # A 3,000-lot print on a 1,000-lot tier emits three zero-duration bars at one price.

on_session_end(ts):                         # timer at 16:00 CT; holiday table for early closes
    if bar: emit_closed(bar, t_close=bar.t_last, partial=True)  # flagged, prices kept
    bar = None                              # first trade after 17:00 CT opens a fresh bar

on_roll(new_contract):                      # roll calendar plus volume-crossover check
    close any open bar as partial; start fresh builders on new_contract

bar record: OHLC, vol, V, tier, contract, t_open, t_close, duration, n_trades,
            buy_vol, sell_vol, delta, range, range_per_vol, partial, from_split_print
```

**Partial bars and large prints.** Partial bars keep their prices, since a session high can sit in one. Exclude them from ATR(L), from range-per-volume comparisons and from duration statistics. Zero-duration split bars are legitimate, because V contracts really did trade, but flag them so a reviewer recognises the stack of identical candles. The overflow alternative puts the whole print into one bar. Whichever you choose must match the platform.

**Joining clock layers without look-ahead.** At each volume-bar close, the decision core sees only what existed at that trade's timestamp:

```
on_trade_closed_bars(trade, closed):        # all tiers closed by this trade
    for vb in sorted(closed, key=tier_size):          # VB-C, then VB-B, then VB-A
        update SWING[vb.tier], STRUCTURE[vb.tier]
    t = trade.ts_exch
    clock = {L: last_bar(L, close_time <= t) for L in (W1, D1, H4, H1)}   # never the forming bar
    dev   = developing_from_ticks(up_to=t)  # day high/low so far, ONH/ONL, IB, OR, developing PROFILE
    sw    = {L: [s for s in SWING[L] if s.confirm_time <= t] for L in layers}
    if guards_pass(closed, t): evaluate_setups(clock, dev, sw)          # once per trade
```

The ordering matters. All tiers that close on the same trade are updated before any setup is evaluated, so a TRIGGER on VB-C can see the VB-A close that happened on the same print. A D1 bar is known only after the session close, and a W1 bar only after Friday's close. Until then, use developing values computed from ticks and label them as developing. This is the engine-side equivalent of Pine's `[1]` plus `lookahead_on` pattern ([TradingView Pine docs](https://www.tradingview.com/pine-script-docs/concepts/repainting/); [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)).

One platform difference needs checking. Under `OnBarClose`, NinjaTrader does not consider a bar closed "until the first tick of the following bar comes in" ([NT8 Multi-Time Frame](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). A self-built volume bar closes on the trade that completes it ([07 Automation architecture](07%20Automation%20architecture.md)). In a quiet overnight market, those two moments can be far apart.

**Clock and news guards.** Swing confirmation is measured in contracts, so overnight a setup can be "three bars old" after four hours. A volume-driven engine therefore needs clock-time guards; the crypto preprint, for example, tracked forced "timeout" closes as a design element ([arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)). No source gives values for these guards, so the defaults in the starting setup are placeholders to fix before forward validation:

```
guards_pass(closed, t):
    trigger = smallest tier in closed
    if trigger.duration > P95_duration[trigger.tier]: return False  # stale bar (calibration window)
    if in_news_window(t):                             return False  # scheduled release ± window
    if minutes_to_session_end(t) < CUTOFF:            return False  # no new entries into the halt
    return True
# Separately: expire any armed setup whose CLOCK age exceeds SETUP_TTL, whatever its bar age.
```

**History and cross-checks.** Rithmic's history plant returns bars, not raw historical ticks:

- `RequestTickBarReplay` (206) with `barType VOLUME_BAR(3)` and a `barTypeSpecifier` bar size returns server-built volume bars with `numTrades`, `volume`, `bidVolume`, `askVolume`, OHLC and timestamp arrays.
- `RequestTickBarUpdate` (204) streams the same bars live.
- `barSubType CUSTOM` with `customSessionOpenSsm/CloseSsm` builds RTH-only bars ([Rithmic/protos.json](../../Rithmic/protos.json)).

Rithmic does not document whether its volume bars split a trade that crosses the boundary. Diff server `TickBar` output against the local builder to learn its convention empirically. Weekly resizing makes this important: past weeks can be rebuilt exactly at a new size only from your own tick archive, so record `LastTrade` continuously from day one. A 1-tick `TICK_BAR` replay might also work, but that is unverified.

Tradovate's `md/getChart` accepts `elementSizeUnit:"Volume"` and returns OHLC with up/down and bid/offer volume. It has no weekly unit, so W1 must be built from daily bars, and the spec does not state how much history it serves ([Tradovate/openapi.json](../../Tradovate/openapi.json)).

**Rollover.** Run the builder on the dominant contract. Switch on the roll date (the Monday before the third Friday, per CME's stated convention as quoted by secondary sources, plus a volume-crossover check) and start a fresh series. For a back-adjusted continuous chart used in visual review, adjust the OHLC prices but keep the bars as they were built per contract ([CME roll dates](https://www.cmegroup.com/trading/equity-index/rolldates.html); [07 Automation architecture](07%20Automation%20architecture.md)).

## How to visually verify your volume bars match your charting platform

A visual review only means something if the bot and the chart draw the same candles. Run this protocol on five full Globex sessions before reviewing any signal. Repeat it after any platform update, data-feed change or roll.

| Step | Compare | How | Pass condition |
|---|---|---|---|
| 1. Settings parity | Contract month (not a continuous symbol), size V, session template, session-start break, split rule | Sierra: Volume Per Bar, New Bar at Session Start on, Split Data Records on. NT8: Volume type, trading-hours template, Break at EOD | Written into the bot config, with a screenshot of the platform dialog |
| 2. Volume reconciliation | Sum of bar volumes per session vs the session total | Builder log vs the platform's daily volume | Exact match. A gap means dropped ticks, double-counted snapshots or filtered prints |
| 3. Bar count | Bars per session, per tier | Count both | Equal. A difference of one at session ends points to partial-bar handling |
| 4. Globex open | OHLC and times of the first 20 bars after 17:00 CT | Side by side | Identical OHLC; times equal once the labelling convention is known |
| 5. RTH open burst | The 20 bars after 08:30 CT | Side by side | Identical. This is where split and overflow diverge most |
| 6. Largest print | Bars around the session's biggest single trade | Find it in the tick log | Split: both show a stack of equal zero-duration bars. Overflow: both show one oversized bar |
| 7. Partial bar | Last bar before 16:00 CT | Inspect its volume | Below V on both, and flagged in the builder |
| 8. Timestamp convention | Does the platform label a bar by its open time or its close time? | Hover over a bar whose open and close you know from the log | Documented once; review markers use it |
| 9. Server cross-check | Rithmic `VOLUME_BAR` replay at the same size vs local bars | Diff OHLC per bar | Rithmic's split convention identified and recorded |
| 10. Swing overlay | The bot's SWING(L) extreme and confirmation markers on the platform chart | Export markers by timestamp | Both markers land on the same bars |
| 11. Week boundary | After the weekly size change | The platform redraws all history at the new V, while the bot's older bars keep their own V | Review past weeks at the V logged in the decision record |

The last row is the trap most likely to produce a false "the bot was wrong" verdict. Platforms rebuild history at whatever size is set now, so a signal from three weeks ago must be reviewed at the size logged for that week.

On host choice:

- **TradingView** cannot serve as the verification chart without community scripts.
- **Tradovate**'s native desktop bar behaviour is unverified. Its API also allows one simultaneous connection per customer by default and drops the oldest, so a Tradovate desktop chart and a Tradovate-API bot on the same login cannot both run ([Tradovate/openapi.json](../../Tradovate/openapi.json)).
- **Sierra Chart or NinjaTrader 8** on the same Rithmic feed is the cleanest review host.

## Recommended starting setup

These are pre-committed starting values. Most are drawn from the research notes; where the notes are silent, the value is labelled as a placeholder. Fix them before forward validation, and change them only by starting a new, version-tagged sample.

| Item | Starting value | Basis |
|---|---|---|
| Bar-building instrument | Full-size ES, NQ, CL; execute in MES/MNQ/MCL if desired | Design proposal |
| Session | ETH (Globex). Bars break at the 17:00 CT session start; the partial last bar closes at 16:00 CT | Sierra requirement; NT8 default behaviour |
| Sizes | VB-C = round_sig(ADV20/1000, 2); VB-B = 4 × VB-C; VB-A = 5 × VB-B | Shared convention; 1/50 rule (Grade B) |
| Recalibration | Weekly, before the Sunday 17:00 CT open; never intraday; drift alarm at ±40% for 5 sessions | Research notes; the alarm only flags |
| Large prints | Split (bars of exactly N) | Sierra's Split Data Records recommendation |
| Data hygiene | Drop `isSnapshot`; use exchange-source timestamps; filter off-market prints; sort Tradovate ticks by `id` | Rithmic and Tradovate specs; EODHD |
| Clock layers | W1 and D1 on the CME trade date (week opens Sunday 17:00 CT); H4 and H1 only in hybrid stacks | Shared convention |
| SWING(L) | DC/ATR-ZigZag with k = 2.0 × ATR(L), ATR(14) on the tier's own non-partial bars, frozen at the extreme; Pivot(3,3) as the alternative; ladder k/2k/4k on VB-A | Shared convention |
| Default stacks | Scalping: D1 + VB-A context, VB-B setup, VB-C trigger. Swing: W1 + D1 context, H4 setup, VB-A trigger | The stacking section of this write-up |
| Guards (placeholders) | Stale trigger: duration above the tier's 95th percentile over the calibration window. Setup TTL: 60 minutes (scalp) or one D1 session (swing). News: no new entries from 5 minutes before to 5 minutes after scheduled tier-1 releases (CPI, NFP, FOMC; EIA for CL), then wait for 3 VB-B closes. No new entries in the final 15 minutes before 16:00 CT | Unsourced; set by visual review, then freeze |

The learning path matters as much as the numbers. The Brooks moderator's advice, "Stay with the 5min while learning," translates into a concrete first step. Run VB-B beside an M5 chart for a fixed review period (two weeks is a reasonable placeholder) and mark where the two charts disagree on swings and signal bars, before any VB-C trigger goes near an order. Two more warnings point the same way. The course admin called 2,000 ticks and below "far too fast". A forum member reported that faster charts led to early profit-taking, stops too wide relative to targets, and higher commissions ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). Both are reasons to treat VB-C as a trigger-only tier, never a chart to read on its own.

## Evidence grades for every claim in this write-up

| Claim | Grade | Basis |
|---|---|---|
| Volume or transaction time removes most intraday seasonality and roughly equalises variance per bar | A | Clark 1973; Ané and Geman 2000; Easley et al. 2012 |
| Volume bars make returns IID normal | D (tested, not supported) | Reproductions: fat tails and Ljung-Box rejections persist |
| 1/50 of ADV as a sampling unit | B | Published convention with a visual-only exhibit; repeated in mlfinpy |
| Trade count is a better clock than volume | B (disputed) | Ané and Geman vs Murphy and Izzeldin |
| Volume bars are more portable than tick bars on CME feeds | B | Sierra Chart's documented summary-trade handling, plus the construction |
| Patterns, trendlines and swings transfer to volume bars | B | Practitioner consensus and CQG docs; no controlled test |
| Price action works better on volume bars than on time bars | C | Opinion only; untested |
| Range = impact per volume; duration = activity; engulfing reinterpretation | C (inference) | Derived from the construction |
| Range and Renko bars degrade candlestick reading | C | Practitioner view (Woods) plus the construction |
| Specific ES sizes (6,500 ≈ M5; 2,000/6,000/18,000) | C | Forum anecdotes; depend on the volume regime |
| VB-A/VB-B/VB-C tiers, stacks and guards | C (design) | This set's pre-committed proposals |
| Information-driven bars for discretionary price action | C | Evidence is ML-oriented only |

## Conclusion

The real choice is not volume candles *or* time candles. It is which clock answers which question. **The volume clock answers "how much trading has happened"**: structure, setups, triggers and swing confirmation all read better when every candle carries the same participation. **The wall clock answers "when"**: weekly and daily candles, session levels, news, the maintenance halt and every expiry rule. Mandelbrot's caveat makes this split a requirement, not a preference, because no one can say in advance how long the next N contracts will take. On those terms, the user's preference for volume candles is fully compatible with price action. What looks like a conflict is really a question of assigning each layer to the right clock.

The binding risks are practical, not theoretical. The academic case is modest and settled, and no evidence suggests that volume bars will create an edge that time bars lack. Failures will come from mismatches: a split rule the platform does not share, a session template that cuts bars differently, or a weekly size change that silently redraws the review chart. Those break the one thing this user depends on, seeing exactly what the bot saw. Verify bar-for-bar first. After that, the payoff is real if unglamorous: duration and range-per-volume become two extra readings on every candle, and a 3 a.m. bar finally means the same thing as a 9:31 a.m. bar.
