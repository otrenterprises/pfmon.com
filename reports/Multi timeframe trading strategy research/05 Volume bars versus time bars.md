# Volume candles keep price action, change its clock

**Price action works on volume candles.** A constant-volume bar still records the real traded open, high, low and close. Swings, trendlines, signal bars, support and resistance, break of structure and every other concept in this set therefore carry over mechanically. Only the x-axis changes: it now counts contracts instead of minutes. Three things take on a new meaning. A bar's range becomes **price impact per fixed slice of volume**. Its clock duration becomes a free **activity signal**. Every bar-count rule (swing confirmation, indicator lookbacks, "within N bars") is now **measured in contracts**. One thing must not move: whatever the calendar defines stays on clock time, including weekly and daily candles, prior-day and prior-week levels, opening range, initial balance, session boundaries, news windows and flat-by-time rules.

The statistical case for volume bars is real but partial. From Clark (1973) through Easley, López de Prado and O'Hara (2012) on E-mini S&P futures, volume sampling removes most intraday seasonality and pulls returns closer to normal. Independent reproductions, however, find that returns stay fat-tailed and dependent, and that time bars remain a competitive baseline. **No study shows that volume bars make price-action setups more profitable.** Their honest advantage is comparability: a 3 a.m. candle and a 9:31 a.m. candle represent the same amount of trading.

The recipe here is three tiers sized from the instrument's 20-session ADV: VB-A = ADV/50, VB-B = ADV/250 and VB-C = ADV/1000. Recalibrate them weekly, break them at the Globex session start, and stack them under W1 and D1 clock candles. Build the bars yourself, splitting large prints so every bar holds exactly V contracts (V is the tier's bar size). Then verify them bar for bar against your charting platform before trusting any signal.

## A constant-volume bar changes the x-axis, not the market

First check which "volume candle" you mean. TradingView's built-in **"Volume candles" chart type is not a constant-volume bar**. Its candles "vary in thickness depending on the trading volume", which is width coding on time-based candles ([TradingView](https://in.tradingview.com/support/solutions/43000724995); [FX News Group](https://fxnewsgroup.com/forex-news/platforms/tradingview-expands-range-of-chart-types-with-addition-of-volume-candles/)). If that is the chart you like, every time-bar rule in [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) applies unchanged. This write-up covers the other kind of bar, which closes once a fixed number of contracts has traded, however long that takes. NinjaTrader 8 calls it a Volume bar, Sierra Chart "Volume Per Bar", CQG a Constant Volume Bar ("Time is not a factor"), Quantower "Volume Bars", Rithmic `VOLUME_BAR`, and Tradovate's chart API `elementSizeUnit:"Volume"` (platform table below). All of them keep true traded OHLC, so the vocabulary of price action survives. What changes is what one bar represents:

| Carries over unchanged | Changes meaning | Must stay on clock time |
|---|---|---|
| Price levels and support/resistance (a level is a price); LEVELS and PROFILE(P) computed from ticks; SWING, STRUCTURE, BOS, CHoCH logic; candle anatomy; stop-entry triggers beyond a signal bar | Range = price impact per V contracts; duration = activity; "N bars" = N × V contracts (swing confirmation, EMA/ATR lookbacks, setup expiry); trendline slope = points per contract; engulfing no longer implies more volume; raw bar volume is constant, so volume reads move to duration, delta and range | W1 and D1 candles; PDH/PDL/PDC, PWH/PWL/PWC, WO/DO, ONH/ONL, IBH/IBL, ORH/ORL; session boundaries and the daily halt; scheduled news; flat-by-time and expiry deadlines; roll dates |

## Fifty years of volume-clock theory deliver partial gains

Markets run on a "business clock", not a wall clock. That idea is decades older than trading software:

| Work | Finding | Source |
|---|---|---|
| **Mandelbrot and Taylor (1967)** | "Price changes over a fixed number of transactions may have a Gaussian distribution"; over a fixed time, they "may follow a stable Paretian distribution, whose variance is infinite" | Quoted in [Easley, López de Prado & O'Hara](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf) |
| **Clark (1973)**, *Econometrica* | Price is a subordinated process: it moves smoothly in an operational time whose speed is set by volume | [Econometric Society](https://www.econometricsociety.org/publications/econometrica/1973/01/01/subordinated-stochastic-process-model-finite-variance) |
| **Ané and Geman (2000)**, *Journal of Finance* | A stochastic time change recovers near-normal returns; the **cumulative number of trades is a better clock than volume** | [IDEAS/RePEc](https://ideas.repec.org/a/bla/jfinan/v55y2000i5p2259-2284.html) |

Murphy and Izzeldin dispute Ané and Geman. Their Monte Carlo experiments show the higher moments of the information flow cannot be accurately recovered with that procedure. In their own data, returns conditioned on trade counts were not Gaussian ([IDEAS/RePEc](https://ideas.repec.org/p/wpa/wuwpfi/0512005.html)).

The futures evidence comes from **Easley, López de Prado and O'Hara, "The Volume Clock" (*Journal of Portfolio Management*, 2012)**. They claim volume time "removes most intra-session seasonal effects", "allows a partial recovery of Normality and the IID assumption", and handles random, asynchronous transactions ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [SSRN](https://papers.ssrn.com/abstract=2034858)). Their Exhibit 2 compares E-mini S&P 500 price changes sampled every minute with changes sampled **"every 1/50 of the average daily volume"**, from 2008 to October 2010. It is a visual distribution plot, and **no test statistics are reported**.

The same paper shows why time bars are awkward in ES. Volume concentrates in the first seconds of each minute in almost every hour, which the authors attribute to TWAP/VWAP algorithms trading in one-minute slots. They warn that trading on round-minute boundaries is exploitable, and they advise slower traders to "adopt the HFT 'event-based time' paradigm."

López de Prado's *Advances in Financial Machine Learning* (2018) turned this into the bar taxonomy that automation libraries implement. The book was not read directly for this research; the account below relies on secondary summaries ([Reasonable Deviations](https://reasonabledeviations.com/notes/adv_fin_ml/); [mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)):

| Bar type | Claim in the AFML taxonomy |
|---|---|
| Time bars | "Should not be used because markets do not process information at a constant rate"; they show serial correlation, heteroskedasticity and non-normality |
| Tick bars | Behave "much more like i.i.d Gaussian", but an auction can arrive as one huge tick |
| Volume bars | Improve on tick bars, because trade sizes differ |
| Dollar bars | More robust to changes in price level |
| Imbalance and run bars | Sample faster when signed flow deviates from its EWMA expectation, "more frequently when there is informed trading" |

The book also recommends a symmetric CUSUM filter for event-based sampling.

Independent reproductions temper these claims:

| Reproduction | Result | Source |
|---|---|---|
| mlfinpy documentation | Tick, volume and dollar bars "all exhibit a distribution significantly closer to normal" | [mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html) |
| daru.finance (crypto, US equities, FX) | All three moved closer to normal; volume bars were narrowly best | [daru.finance](https://daru.finance/research-review/lopez-de-prado) |
| Sefidian | **Neither volume-bar nor dollar-bar returns were Gaussian**; only volume bars lowered serial correlation | [Sefidian](https://www.sefidian.com/2021/06/12/introduction-to-advanced-candlesticks-in-finance-tick-bars-dollar-bars-volume-bars-and-imbalance-bars/) |
| EODHD | Spurious lag-1 autocorrelation until off-market prints were filtered | [EODHD](https://eodhd.com/financial-academy/?p=7012) |
| 2026 preprint, BTCUSDT perpetuals | "Normality gains are regime-dependent and secondary"; **Ljung-Box independence rejected for every bar type**; calendar bars competitive; information bars helped mainly on variance-ratio conformance (tick volatility bars cut \|VR(4)−1\| from 0.089 to 0.028) | [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1) |

The 2026 preprint covers crypto only and is not peer reviewed. No peer-reviewed study since 2012 tests volume against time bars on ES, NQ or CL with modern data.

**The verdict is "partial gains."** Equal volume per bar roughly equalises variance per bar and strips out the open/lunch/overnight rhythm. That is a genuine, mechanism-level improvement (Grade A). The strong form, that volume bars make returns IID normal, was tested and does not hold (Grade D). Nothing in this literature tests price-action setups. For a trader who reads charts by eye, the defensible benefit is comparability, not edge.

### Mandelbrot's 1973 caveat decides what stays on clock time

Mandelbrot commented on Clark's paper in the same *Econometrica* issue, and that comment governs how to mix bar types: "if price variation is to proceed smoothly in local time, then local time itself must flow at random and at a highly variable rate. Consequently, as long as the flow of local time remains unpredictable, concrete identification of the applicable local time leaves the problems of economic prediction unaffected" ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [IDEAS](https://ideas.repec.org/a/ecm/emetrp/v41y1973i1p157-59.html)).

In plain terms, **nobody knows in advance how many minutes the next 5,000 contracts will take**. Volume time describes what happened, but it cannot schedule anything. Any rule with a clock deadline therefore needs a clock anchor. The weekly bar closes on Friday afternoon and CPI prints at 8:30 a.m. ET, whatever the volume. The ES maintenance halt starts at 16:00 CT, and a "flat by the close" rule cannot be written in contracts. This is why the shared conventions keep W1, D1 and all LEVELS on clock time. It is also why the builder below adds clock and news guards to a volume-driven engine.

## Futures sessions stretch and squeeze volume bars

On a 23-hour Globex chart, volume bars **compress quiet periods into a few bars and expand busy periods into many**. Easley et al. forecast ES "over the next 50,000 contracts, whatever the number of (night-session) hours or (day-session) milliseconds it takes" ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). An ETH volume chart therefore reads like an RTH chart with a short overnight preamble, so separate RTH and ETH charts matter less than with time bars. Galen Woods makes the mirror-image point: a 5-minute bar at the open differs from one after hours, while a daily bar covers a full session ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). Four details decide whether volume bars can be reproduced.

**Session-start breaks and the partial last bar.** NinjaTrader 8 builds each session's bars "freshly... beginning from the first tick of the session". The last bar "may contain a volume less than" the setting, and the "Break at EOD" property controls this ([NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)). Sierra Chart says New Bar at Session Start is "necessary" with Volume Per Bar: it cuts a bar that crosses into the next trading day ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). Practitioners disagree. One NexusFi user disables the setting to avoid incomplete bars; another keeps it so VWAP and overnight statistics align ([futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)). Sierra's documented requirement and the need for clean daily boundaries make **a break at the Globex session start** the default here. For ES that is 17:00 CT, after the daily 16:00–17:00 CT maintenance period ([CME ES specs](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html)). The cost is one partial bar per session, which must be flagged.

**Large prints: split or overflow.** Sierra Chart bars are "equal to or greater than" the setting unless Split Data Records is on. That option divides records "to create 100% constant" bars, splitting only the Volume and Number of Trades fields. The final record in the data file is never split, so the very last bar can overshoot. NinjaTrader's pages do not document which rule it uses. Splitting keeps every bar at exactly V contracts and so preserves equal participation, while overflow makes one oversized bar per large print. Either is defensible, but the chart and the bot must use the same one.

**Trade reporting.** About **51.56% of ES trades in 2010–2011 were one lot**, and round sizes were heavily overrepresented: size 50 was 10.86 times as frequent as size 49 ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). Sierra Chart offers "Combine Trades Into Original Summary Trade" for CME futures, because one aggressor order can be reported as many fills ([Sierra Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). That changes trade counts but not volume totals.

**Rollovers and regimes.** Build each series on one contract month. A thin back month spliced into a continuous series distorts bar durations, and Easley et al. list calendar rolls among the "seasonal effects" to avoid. Volume levels also drift: CME equity-index futures ADV ran about 6.5M contracts in Q1 2025, 5M in Q3 2025 and 7.2M in Q1 2026, and Micro E-mini S&P ADV rose 35% in 2025 to 1.2M (CME releases via search summaries: [Barchart](https://www.barchart.com/story/news/36882764/cme-group-reports-record-annual-adv-of-28-1-million-contracts-in-2025-up-6-year-over-year); [CME Equity Insights](https://www.cmegroup.com/news/2026/equity-insights-report-april-2026.html)). A bar size fixed last year draws a different chart this year, which is why sizes are recalibrated weekly.

### Every platform builds a slightly different "volume bar"

| Platform / API | True constant-volume bar? | Large-print rule | Session break | Notes |
|---|---|---|---|---|
| Sierra Chart | Yes ("Volume Per Bar") | Overflow by default; exact with Split Data Records (vendor-recommended) | New Bar at Session Start, documented as necessary | Best documented; Combine Trades option for CME |
| NinjaTrader 8 | Yes ("Volume") | Not documented | Fresh bars from each session's first tick; "Break at EOD" | Built from tick data; Tick Replay rebuilds history from ticks |
| TradingView | **No**: "Volume candles" are width-coded time candles | n/a | n/a | Constant-volume only via community scripts (CBTV in a separate pane; LuxAlgo Volume Aggregation Bars) |
| Quantower | Yes ("Volume Bars", lots or ticks per bar) | Not documented | Not documented | — |
| CQG | Yes (Constant Volume Bar) | Not documented | Not documented | "All volume studies and price-based studies work with CVB charts"; current-volume display shows how close a bar is to completion |
| ATAS | Volume-based frames | Not documented | Not documented | BTK bar algorithm "not disclosed", so unsuitable for rule-based use |
| Rithmic R\|Protocol | Yes (`VOLUME_BAR`, server-built, live and replay) | Not documented; verify | `barSubType CUSTOM` with `customSessionOpenSsm/CloseSsm` | Cross-check for a local builder |
| Tradovate API | Yes (`md/getChart`, `elementSizeUnit:"Volume"`) | Not documented | Not documented | No weekly chart unit; native desktop bar types unverified |

Sources: [Sierra Chart](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html); [NT8](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm); [TradingView](https://in.tradingview.com/support/solutions/43000724995); [CBTV](https://in.tradingview.com/script/3fKYlqbQ-Candles-Based-On-Traded-Volume); [LuxAlgo](https://www.luxalgo.com/library/indicator/JYq3JqgD-volume-aggregation-bars/); [Quantower](https://help.quantower.com/quantower/analytics-panels/chart/chart-types/volume-bars); [CQG help](https://help.cqg.com/cqgic/19/Documents/constantvolumebarcvb.htm); [CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts); [ATAS](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/); [Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json).

"Volume bar" is a family name. Two charts labelled "5,000 volume" can still differ in session template, split rule and timestamp convention, and a visual review is valid only when chart and bot agree on all three. Sierra Chart and NinjaTrader 8 are the strongest review hosts. Both document volume bars, run multiple series up to weekly, and state explicit rules for historical versus real-time processing ([07 Automation architecture](07%20Automation%20architecture.md)).

## Each candle becomes a fixed budget of contracts

Practitioners consistently say bar reading transfers. Galen Woods writes that "unlike range charts, we are able to apply bar pattern analysis on constant volume charts", because fixed volume lets you compare what price does for the same activity: "Volume is the fuel of market movements" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)).

On the Brooks Trading Course forum, the admin was asked whether 5-minute trendlines and signal bars carry over to tick charts. He answered "Yes, and yes", and called tick charts especially useful for trendlines that run from the overnight into RTH. A moderator said price action "should work as well" and noted that roughly 6,500-volume ES charts resembled a 5-minute chart in 2021. He also warned that faster charts mean "more false signals" during breakouts ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). Comparable tick and volume settings "plot price action so closely that it's impossible to tell which one is what" ([TradingMarkets](https://tradingmarkets.com/?p=676863)).

The dissent is about comfort, not mechanics. One NexusFi trader finds time charts far easier to read ([NexusFi](https://nexusfi.com/traders-hideout/23194-why-tick-charts-instead-time-based-charts-other-chart-types-2.html)), forum commenters say Al Brooks himself trades 5-minute time charts ([NexusFi](https://nexusfi.com/traders-hideout/734-book-discussion-reading-price-charts-bar-bar-al-brooks-17.html)), and Woods cautions that "the only way to find out is to test." None of this is controlled evidence: "patterns transfer" rests on consensus plus an indirect mechanism (Grade B), and "patterns work *better*" is opinion (Grade C).

What changes is the meaning of the bar's geometry. The rules below are derived from the equal-volume construction itself. They are design reasoning, not tested results.

| Concept | On time bars | On constant-volume bars | Rule of use |
|---|---|---|---|
| Bar range | Mixes volatility with how busy the interval was | **Price displacement per V contracts**, a Kyle's-lambda/Amihud-style impact proxy. Wide = thin book or one-sided aggression; narrow at a level = absorption | Compare with the tier's trailing median range, never with a time-bar ATR |
| Bar duration | Constant by definition | **Free activity signal.** Fast bars = participation surge (open, news, breakout); slow bars = disinterest | Log `t_close − t_open`. A fast, wide breakout shows impact plus urgency; slow and narrow is suspect |
| Pin bar / wick | An overnight wick can reflect a few hundred contracts | Rejection within a fixed participation budget, so wicks compare across sessions | Anatomy thresholds from [02](02%20Multi%20timeframe%20price%20action.md), unchanged |
| Engulfing | Often implies more volume than the prior bar | **Engulfs a bar of equal volume**: shows only which side moved price further | Do not read "more volume" into it |
| Inside bar / NR | Contraction, partly a quiet-clock artifact | Compression per unit volume, a cleaner definition | Rules carry over |
| Gaps | Possible between bars | None within a session; only at forced session breaks | Gap patterns exist only at the Globex open |
| Bar volume (VSA reads) | Varies | **Constant** (= V except partial bars) | Move "low volume" reads to duration, delta and range per volume; see [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) |
| Trendline | Slope in points per minute | Slope in **points per contract**; the same line touches different bars on the two charts | Draw lines on the chart that triggers; never carry a line across bar types |
| Levels and profiles | Price-based | Unchanged | Compute LEVELS and PROFILE(P) from ticks on clock boundaries and overlay them; never derive an opening range from "the first K volume bars" |
| Indicators | Lookback = fixed minutes | Lookback = fixed contracts: EMA(20) on 2,000-lot bars is the last 40,000 contracts, ten minutes at the open or six hours overnight | ATR(L) gets closer to stationary; M5-tuned oscillator thresholds do not transfer |

Two rows carry the new information the user gains.

**Range per bar becomes a liquidity reading.** Suppose the last three VB-B bars at a PDL each moved two ticks while the tier's median is eight. The level absorbed three bars' worth of selling. A time chart cannot show that without a separate volume pane.

**Duration becomes a second dimension of every candle.** Store it in automation, and show it in visual review as a duration strip coloured by percentile. CQG's display of developing-bar volume adds a cue for how close the current bar is to closing ([CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts)).

With volume fixed, the free variables in each bar are range, duration, delta and trade count. One further inference, not a sourced result: overnight books are thinner, so overnight volume bars can be wider per contract. That is exactly what the range reading is meant to reveal.

### Swings confirm after contracts, not minutes

SWING(L) needs no redefinition. The default detector is a directional-change (DC) / ATR-ZigZag with reversal threshold k × ATR(L), k = 2.0, and ATR frozen at the extreme. Because it reacts to price events, it "works the same on tick, volume, range or Renko bars"; directional change was in fact built for tick data ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md); [Tsang DC4TD](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)).

Bar-count pivots keep their rule but change their unit. Pivot(3,3) on VB-B confirms after three more VB-B bars, which is **3 × ADV/250, about 1.2% of a day's volume**. The same rule is 0.3% on VB-C and 6% on VB-A. That can mean seconds after the RTH open or hours in the Asian session. The swing-point notes call this arguably better around the open and news, because lag scales with activity. A volume-chart swing therefore has a consistent meaning, "a reversal that held for R × V contracts", but an unpredictable clock duration. This is Mandelbrot's caveat at the level of a single bar.

Each swing stores its extreme time and its confirmation time, as everywhere in this set, and only confirmed swings drive decisions. The true extreme price comes from tick data, which a self-built volume bar has by construction. Knowing the trade order inside a bar also settles the outside-bar case from the swing notes, where one bar both extends the extreme and reverses by the threshold.

STRUCTURE(L), BOS and CHoCH keep their logic. The HTF trend-change grades apply with a volume tier as the higher layer:

| Grade | Event | Meaning |
|---|---|---|
| G1 | A VB-C touch or sweep of a VB-A protected swing | A test only |
| G2 | A VB-C or VB-B close beyond it | Stand aside |
| G3 | A **VB-A bar close beyond it** | The only grade that changes intraday bias |

## Stack volume tiers beneath clock-time weeks and days

There is no published method for multi-timeframe analysis on volume-bar hierarchies, and no study compares hybrid stacks with pure-volume ones. The stacks below are design proposals, shaped by two principles.

**W1 and D1 stay on clock time.** These are the candles other participants anchor to: settlement, prior-period extremes and weekly opens. At daily-plus horizons volume time and clock time converge anyway, because each bar covers a full session. A 2,000,000-contract ES bar yields about one bar per day, and Sierra Chart treats Volume Per Bar as an intraday-only period ([futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)).

**Adjacent intraday tiers sit about 3–6× apart.** That is the band [02](02%20Multi%20timeframe%20price%20action.md) derives from Elder's factor of five, and it matches the 2,000/6,000/18,000 ES ladder one NexusFi trader reported ([NexusFi](https://nexusfi.com/showthread.php?p=656686)). VB-A, VB-B and VB-C are 5× and 4× apart. Each tier is an integer multiple of the next, and all three break at the same session start, so **every VB-A boundary is also a VB-B and VB-C boundary**. That removes a class of alignment bugs that mixed clock layers create.

**What the tiers mean in clock time.** Averaged over a 1,380-minute Globex day, the tiers work out to about **28 minutes per VB-A bar, 5.5 per VB-B and 1.4 per VB-C**. This is arithmetic, not a forecast. RTH bars run much faster and Asian-session bars much slower, so the ratio between a clock layer and a volume layer is never constant. Judge it by the median number of lower-layer bars per upper-layer bar in the session you trade.

**Bridging the gap below D1.** One D1 bar holds about 50 VB-A bars, too large a jump for adjacent structure layers. One bridge is an H4 clock layer: D1→H4 is about 5.75× on a 23-hour day, and H4→VB-A about 9× on average. The other is the shared ladder: read SWING(VB-A) at k, 2k and 4k, so the 4k degree stands in for the missing tier.

**Scalping stacks (seconds to minutes).** The pure-volume stack suits this user. The hybrid moves intraday context to clock time.

| Role | Pure-volume stack (default) | Hybrid stack |
|---|---|---|
| CONTEXT | D1 STRUCTURE (G3 only) and position in the W1 range; intraday bias = STRUCTURE(VB-A) | D1 STRUCTURE; intraday bias = STRUCTURE(H1) |
| LOCATION | PDH/PDL/PDC, ONH/ONL, IBH/IBL, ORH/ORL, PROFILE(RTH) and PROFILE(ON) POC/VAH/VAL, all from ticks on clock boundaries | Same |
| SETUP | VB-B: pullback or sweep into a LOCATION level in the CONTEXT direction; SWING(VB-B) defines the leg | VB-A, same rules |
| TRIGGER | VB-C: closed-bar BOS in the CONTEXT direction, or sweep-and-reclaim close at the level | VB-B, same rules |
| MANAGEMENT | Stop beyond the VB-C trigger swing; targets at the next LEVEL or opposing VB-B swing; clock and news guards | Stop beyond the VB-B trigger swing; same targets and guards |

**Swing stacks (hours to days; W1 cap).** The hybrid is the default here, because a swing trade lives on time-anchored levels and its trigger needs precision, not frequency.

| Role | Hybrid stack (default) | Pure volume below D1 |
|---|---|---|
| CONTEXT | STRUCTURE(W1) and STRUCTURE(D1), G3 only; PWH/PWL/PWC and WO | Same |
| LOCATION | PDH/PDL; PROFILE(WEEK) and PROFILE(COMP(n)) edges and POCs | Same |
| SETUP | H4: pullback into LOCATION; SWING(H4) at k | VB-A with SWING read at 4k |
| TRIGGER | VB-A: closed-bar BOS or CHoCH back in the CONTEXT direction | VB-A SWING at k, or VB-B for a tighter stop |
| MANAGEMENT | Stop beyond the VB-A trigger swing or H4 setup swing; risk scaled from ATR(D1) | Stop beyond the VB-A k-degree swing; same risk scaling |

When the higher timeframe is itself a volume chart, one rule defines its trend: **only completed VB-A bars count**. A VB-A bar completes at an unpredictable clock time. That is harmless as long as decisions read only bars closed at decision time, and the join below enforces this. [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) covers how these stacks combine with profile locations and Fibonacci clusters, and [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md) turns them into setups.

## Size the bars from ADV and freeze them for the week

The best-sourced anchor is Easley et al.'s **1/50 of average daily volume**, about 50 bars per Globex day ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). mlfinpy repeats it for tick, volume and dollar bars ([mlfinpy](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)). A 30-day lookback cited on the MultiCharts forum could not be confirmed against the book ([MultiCharts forum](https://www.multicharts.com/discussion/viewtopic.php?p=140109)). The 1/50 figure is a statistical sampling convention backed by a visual-only exhibit, so it earns Grade B. It is also coarse for execution, which is why it becomes VB-A rather than a trigger tier.

Practitioners size execution charts to resemble the time chart they know. Woods suggests taking "the long-term average range/volume of the time-frame you usually trade" ([Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)). NexusFi members advise checking a volume chart's average true range against your stop and target sizes: bars that are too small are noise, and bars that are too large give late entries and wide stops ([NexusFi](https://nexusfi.com/showthread.php?p=678596)).

The shared tiers formalise both views: **VB-A = ADV/50, VB-B = ADV/250, VB-C = ADV/1000**, with ADV taken over the instrument's last 20 sessions. These are pre-committed starting values, not optimised ones. Rounding must preserve the integer ratios, so round the smallest tier and derive the others from it:

```
# Run once per week, before the Sunday 17:00 CT Globex open (WO). Never intraday.
def weekly_sizes(daily_volume, n=20):
    # per CME trade date: volume of the DOMINANT contract month that day,
    # full-size contract (ES, NQ, CL); use RTH volume if bars are RTH-only
    adv  = mean(daily_volume[-n:])
    vb_c = round_sig(adv / 1000, 2)     # 2 significant figures, e.g. 1,437 -> 1,400
    vb_b = 4 * vb_c                     # = ADV/250 to rounding
    vb_a = 5 * vb_b                     # = ADV/50 to rounding
    return vb_a, vb_b, vb_c             # store V with every bar built this week

def drift_alarm(bars_per_session, target, tol=0.40, sessions=5):
    # flag only, never auto-adjust
    return all(abs(b / target - 1) > tol for b in bars_per_session[-sessions:])
```

For a hypothetical ADV of 1,437,000, this gives VB-C = 1,400, VB-B = 5,600 and VB-A = 28,000. This research could not retrieve current full-size ES, NQ or CL ADV, so compute the real value from your own Rithmic or Tradovate history.

Four rules keep the calibration honest. **Size each instrument separately**, because ES, NQ, CL and their micros have very different ADV. **Build on the full-size contract when a micro is only the execution vehicle**: MES and MNQ bars measure a different participant mix while tracking the same price (a design proposal). **Freeze the size for the week and store it with each bar**, because resizing intraday redraws history and breaks every swing rule. **Treat the drift alarm as a prompt to look, not to retune.** With weekly recalibration it rarely fires, and when it does, activity has moved faster than a 20-session average can follow, which is useful context in itself.

Practitioner settings serve as sanity checks. All are anecdotal and depend on the volume regime (Grade C).

| Reported ES setting | Source | Nearest tier and use |
|---|---|---|
| ~6,500 volume ≈ M5 chart (2021) | [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/) | VB-B-like execution chart |
| 8,000 tick "most of the time" (≈ 3–5-minute), 6,000/4,000 when slow; "2,000 ticks and lower is far too fast" | [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/) | Tick analogue of VB-B; a warning against reading VB-C on its own |
| 2,000 / 6,000 / 18,000 volume ladder (3×) | [NexusFi](https://nexusfi.com/showthread.php?p=656686) | A pure-volume three-tier stack |
| 2,584 or 4,181 "depending on the season" | [NexusFi](https://nexusfi.com/showthread.php?p=635515) | Seasonal resizing by eye; replaced here by weekly ADV |
| 50,000 and 200,000 contract buckets (2010–11) | [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf) | HFT horizon examples, coarser than VB-A |
| 1,000 contracts | [CQG primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts) | Documentation example only |
| 2,000,000 ≈ one bar per day | [futures.io](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html) | Why D1 stays on clock time |

Dollar bars keep notional per bar constant as price levels change, and López de Prado prefers them for robustness. That suits multi-year reviews. Within one contract month, though, they are nearly identical to volume bars and add nothing for live trading ([Reasonable Deviations](https://reasonabledeviations.com/notes/adv_fin_ml/)).

## Tick bars are cousins; range, Renko and Heikin-Ashi are strangers

| Bar type | Closes when | Real traded OHLC? | Price-action fidelity | Automation notes |
|---|---|---|---|---|
| Volume | V contracts trade | Yes | High: equal participation per bar | Totals do not depend on how the feed reports trades; split rule here |
| Tick (trades) | N trades print | Yes | High; indistinguishable from volume at comparable settings | Count depends on CME summary vs split-fill reporting; Ané and Geman's preferred clock |
| Dollar | $N of notional trades | Yes | High (≈ volume intraday) | Multi-year normalisation |
| Range | Range reaches R | Yes, but range fixed | Low: "most bar patterns and candlestick patterns are ineffective" | Pivots converge to a ZigZag with threshold ≈ R × range |
| Renko | Price exceeds prior brick by a box | No wicks (classic) | Low: discards wicks and time, prints late | Reversal is itself a DC event (threshold = 2 boxes); best variance-ratio conformance in the crypto preprint (\|VR(4)−1\| = 0.020) |
| Heikin-Ashi | Time | **No**: averaged OHLC | Never for signals or stops | Trend-colour filter at most |
| Kagi / Line Break / P&F | Reversal or breakout rules | No | Structural only | Swing and level detection, not candles |
| Delta-volume / imbalance / run | Signed flow crosses a threshold | Yes | Order flow, not classic price action | Needs aggressor data (Rithmic has it); adaptive EWMA thresholds hinder chart reproduction |
| TradingView "Volume candles" | Time | Yes | Same as time bars | Width = volume |

Sources: [NT8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm); [Sierra Chart](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html); [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/); [TradingMarkets](https://tradingmarkets.com/?p=676863); [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1); [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md).

Tick bars deserve a fair hearing, since Ané and Geman found trade count the better statistical clock. The case against them is practical. Depending on feed and settings, CME fills arrive either as one aggressor summary trade or as many split fills, and Sierra's "Combine Trades" option exists because the difference matters. With half of ES trades a single lot and round sizes clustered, a tick bar's volume content also shifts with the participant mix. Volume totals come out identical under any reporting convention. Bars built from Rithmic `LastTrade` therefore match bars the platform builds from its own feed, and that is the concrete reason to prefer volume bars for CME data on Rithmic and Tradovate.

Range and Renko bars are statistically tidy, but they discard the wick and close that candle reading needs. Information-driven bars are interesting as secondary triggers. Their EWMA-adaptive thresholds keep changing the bar size, though, which conflicts with seeing the same candles the bot saw. ATAS's BTK bars fail on transparency, because the vendor says the formation algorithm is not disclosed ([ATAS](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/)).

## Build every bar from exactly N contracts

Live building is simple: accumulate traded size until it reaches V. Reproducibility comes from five decisions, made once and logged with every bar: the split rule, the session break, the timestamps, the higher-timeframe join and the contract month. The design below fits the repo's Rithmic or Tradovate stack and the pipeline in [07 Automation architecture](07%20Automation%20architecture.md).

**Rithmic input.** Rithmic `LastTrade` (template 150) carries `tradePrice`, `tradeSize`, `aggressor`, exchange-source time (`sourceSsboe/sourceUsecs/sourceNsecs`), gateway receive time and `isSnapshot`. Drop snapshots so database replays are not counted as trades, and assign trades to bars by exchange-source time ([Rithmic/protos.json](../../Rithmic/protos.json); [Rithmic Reference Guide](../../Rithmic/Reference_Guide.pdf)).

**Tradovate input.** Tradovate tick charts (`underlyingType:"Tick"`, `elementSize:1`) deliver price, size, optional bid/ask and a tick `id`. Because "tick stream data can arrive out of chronological order", sort and deduplicate by `id` first ([Tradovate/openapi.json](../../Tradovate/openapi.json)).

**Cleaning and open questions.** Filter off-market prints; unfiltered ticks produced spurious autocorrelation in EODHD's tests ([EODHD](https://eodhd.com/financial-academy/?p=7012)). Two things were not verified: whether either feed delivers CME summary trades or individual fills, and how block or spread-leg trades appear. Both determine how often the split rule fires.

```
# One builder per (contract month, tier). V frozen for the week. SPLIT convention.
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

**Partial bars and large prints.** Partial bars keep their prices, because a session high can live in one. Exclude them from ATR(L), from range-per-volume comparisons and from duration statistics. Zero-duration split bars are legitimate, since V contracts did trade, but flag them so a reviewer recognises the stack of identical candles. Overflow would put the whole print in one bar instead. Either way, match the platform.

**Joining clock layers without look-ahead.** At each close, the decision core sees only what existed at that trade's timestamp:

```
on_trade_closed_bars(trade, closed):        # all tiers closed by this trade
    for vb in sorted(closed, key=tier_size):          # VB-C, then VB-B, then VB-A
        update SWING[vb.tier], STRUCTURE[vb.tier]
    t     = trade.ts_exch
    clock = {L: last_bar(L, close_time <= t) for L in (W1, D1, H4, H1)}  # never the forming bar
    dev   = developing_from_ticks(up_to=t)  # day high/low so far, ONH/ONL, IB, OR, developing PROFILE
    sw    = {L: [s for s in SWING[L] if s.confirm_time <= t] for L in layers}
    if guards_pass(closed, t): evaluate_setups(clock, dev, sw)         # once per trade
```

Every tier that closes on a trade is updated before any setup is evaluated. A VB-C trigger can therefore see a VB-A close produced by the same print. A D1 bar is known only after the session close, and a W1 bar only after Friday's close. Until then, use values computed from ticks and label them as developing. This is the engine-side equivalent of Pine's `[1]` plus `lookahead_on` ([TradingView Pine docs](https://www.tradingview.com/pine-script-docs/concepts/repainting/); [02](02%20Multi%20timeframe%20price%20action.md)). Verify one platform difference. Under `OnBarClose`, NinjaTrader treats a bar as open "until the first tick of the following bar comes in" ([NT8 Multi-Time Frame](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)), whereas a self-built bar closes on its completing trade. Overnight, those moments can be far apart.

**Clock and news guards.** Swing confirmation runs in contracts, so overnight a setup can be "three bars old" after four hours. A volume-driven engine therefore carries clock guards; the crypto preprint tracked forced "timeout" closes as a design element ([arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)). No source supplies values, so the starting-setup defaults are placeholders:

```
guards_pass(closed, t):
    trig = smallest tier in closed
    if trig.duration > P95_duration[trig.tier]: return False   # stale bar (calibration window)
    if in_news_window(t):                       return False   # scheduled release ± window
    if minutes_to_session_end(t) < CUTOFF:      return False   # no new entries into the halt
    return True
# Separately: expire any armed setup whose CLOCK age exceeds SETUP_TTL, whatever its bar age.
```

**History and cross-checks.** Rithmic's history plant returns bars, not raw historical ticks. `RequestTickBarReplay` (206) with `barType VOLUME_BAR(3)` and a `barTypeSpecifier` size returns server-built volume bars with `numTrades`, `volume`, `bidVolume`, `askVolume`, OHLC and timestamp arrays. `RequestTickBarUpdate` (204) streams them live, and `barSubType CUSTOM` with `customSessionOpenSsm/CloseSsm` gives RTH-only bars ([Rithmic/protos.json](../../Rithmic/protos.json)). Rithmic does not document its boundary rule, so diff its bars against the local builder to learn it.

Weekly resizing makes the archive essential. Past weeks can be rebuilt exactly at a new size only from your own ticks, so record `LastTrade` from day one; a 1-tick `TICK_BAR` replay may work but is unverified. Tradovate's `md/getChart` accepts `elementSizeUnit:"Volume"` and returns OHLC with up/down and bid/offer volume. It has no weekly unit, so W1 must come from daily bars, and its history depth is unstated ([Tradovate/openapi.json](../../Tradovate/openapi.json)).

**Rollover.** Run the builder on the dominant contract. Switch on the roll date and start a fresh series; CME's stated convention, per secondary sources, is the Monday before the third Friday, checked against volume crossover. For a back-adjusted review chart, adjust OHLC prices but keep the bars as built per contract ([CME roll dates](https://www.cmegroup.com/trading/equity-index/rolldates.html); [07](07%20Automation%20architecture.md)).

## How to visually verify your volume bars match your charting platform

Visual review means something only if the bot and the chart draw the same candles. Run this protocol over five full Globex sessions before reviewing any signal. Repeat it after any platform update, feed change or roll.

| Step | Compare | How | Pass condition |
|---|---|---|---|
| 1. Settings parity | Contract month (not continuous), V, session template, session break, split rule | Sierra: Volume Per Bar, New Bar at Session Start, Split Data Records. NT8: Volume type, trading-hours template, Break at EOD | Written into the bot config with a screenshot of the dialog |
| 2. Volume reconciliation | Sum of bar volumes per session vs session total | Builder log vs platform daily volume | Exact match; a gap means dropped ticks, double-counted snapshots or filtered prints |
| 3. Bar count | Bars per session, per tier | Count both | Equal; off by one at session ends points to partial-bar handling |
| 4. Globex open | First 20 bars after 17:00 CT | Side by side | Identical OHLC; times equal once labelling is known |
| 5. RTH open burst | 20 bars after 08:30 CT | Side by side | Identical; split and overflow diverge most here |
| 6. Largest print | Bars around the session's biggest trade | Locate it in the tick log | Split: a stack of equal zero-duration bars on both. Overflow: one oversized bar on both |
| 7. Partial bar | Last bar before 16:00 CT | Inspect volume | Below V on both; flagged by the builder |
| 8. Timestamp convention | Is the bar labelled by its open or its close time? | Hover a bar known from the log | Documented once; review markers use it |
| 9. Server cross-check | Rithmic `VOLUME_BAR` replay vs local bars at the same V | Diff OHLC per bar | Rithmic's split convention identified and recorded |
| 10. Swing overlay | Bot's SWING(L) extreme and confirmation markers | Export by timestamp onto the platform chart | Both markers land on the same bars |
| 11. Week boundary | After the weekly size change | Platform redraws history at the new V; the bot's old bars keep theirs | Review past weeks at the V logged in the decision record |

The last row is the trap most likely to produce a false "the bot was wrong" verdict. Platforms rebuild history at whatever size is set now, so a signal from three weeks ago must be reviewed at the size logged for that week. Three platform cautions apply. TradingView cannot verify anything without community scripts. Tradovate's native desktop bars are unverified. Tradovate's API also defaults to one simultaneous connection per customer and drops the oldest, so a desktop chart and an API bot on the same login cannot both run ([Tradovate/openapi.json](../../Tradovate/openapi.json)). Sierra Chart or NinjaTrader 8 on the same Rithmic feed is the cleanest review host.

## Recommended starting setup

These values are pre-committed and come from the research notes. Where the notes are silent, the entry is labelled as a placeholder. Fix all of them before forward validation, and change any one only by starting a new, version-tagged sample.

| Item | Starting value | Basis |
|---|---|---|
| Bar-building instrument | Full-size ES, NQ, CL; execute in MES/MNQ/MCL if desired | Design proposal |
| Session | ETH (Globex); break at the 17:00 CT start; partial last bar closes at 16:00 CT | Sierra requirement; NT8 behaviour |
| Sizes | VB-C = round_sig(ADV20/1000, 2); VB-B = 4 × VB-C; VB-A = 5 × VB-B | Shared convention; 1/50 rule (Grade B) |
| Recalibration | Weekly, before the Sunday 17:00 CT open; never intraday; drift alarm ±40% for 5 sessions | Notes; alarm only flags |
| Large prints | Split (exactly-N bars) | Sierra Split Data Records recommendation |
| Data hygiene | Drop `isSnapshot`; exchange-source timestamps; filter off-market prints; sort Tradovate ticks by `id` | Rithmic and Tradovate specs; EODHD |
| Clock layers | W1 and D1 on the CME trade date (week opens Sunday 17:00 CT); H4/H1 only in hybrid stacks | Shared convention |
| SWING(L) | DC/ATR-ZigZag, k = 2.0 × ATR(L); ATR(14) on the tier's non-partial bars, frozen at the extreme; Pivot(3,3) alternative; ladder k/2k/4k on VB-A | Shared convention |
| Default stacks | Scalping: D1 + VB-A context, VB-B setup, VB-C trigger. Swing: W1 + D1 context, H4 setup, VB-A trigger | Stacking section above |
| Guards (placeholders) | Stale trigger: duration above the tier's 95th percentile. Setup TTL: 60 minutes (scalp) or one D1 session (swing). News: no new entries 5 minutes either side of scheduled tier-1 releases (CPI, NFP, FOMC; EIA for CL), then wait 3 VB-B closes. No new entries in the last 15 minutes before 16:00 CT | Unsourced; set by visual review, then freeze |

The learning path matters as much as the numbers. The Brooks moderator's "Stay with the 5min while learning" translates into a first step. Run VB-B beside M5 for a fixed review period (two weeks is a placeholder), and mark where the two charts disagree on swings and signal bars, before any VB-C trigger goes near an order. Two more warnings come from the same forum ([Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)). The course admin calls 2,000 ticks and below "far too fast". A member reports that fast charts led to early profit-taking, stops too wide relative to targets, and higher commissions. Both warnings make VB-C a trigger-only tier, never a chart to read in isolation.

## Evidence grades for every claim in this write-up

| Claim | Grade | Basis |
|---|---|---|
| Volume/transaction time removes most intraday seasonality and roughly equalises variance per bar | A | Clark 1973; Ané and Geman 2000; Easley et al. 2012 |
| Volume bars make returns IID normal | D (tested, not supported) | Reproductions: fat tails and Ljung-Box rejections persist |
| 1/50 of ADV as a sampling unit | B | Published convention; visual-only exhibit; repeated by mlfinpy |
| Trade count is a better clock than volume | B (disputed) | Ané and Geman vs Murphy and Izzeldin |
| Volume bars are more portable than tick bars on CME feeds | B | Sierra's documented summary-trade handling; construction |
| Patterns, trendlines and swings transfer to volume bars | B | Practitioner consensus and CQG docs; no controlled test |
| Price action works better on volume bars than time bars | C | Opinion only; untested |
| Range = impact per volume; duration = activity; engulfing reinterpretation | C (inference) | Derived from the construction |
| Range and Renko bars degrade candlestick reading | C | Practitioner view plus construction |
| Specific ES sizes (6,500 ≈ M5; 2,000/6,000/18,000) | C | Forum anecdotes; regime-dependent |
| VB-A/VB-B/VB-C tiers, stacks and guards | C (design) | This set's pre-committed proposals |
| Information-driven bars for discretionary price action | C | ML-oriented evidence only |

## Conclusion

The real choice is not volume candles *or* time candles but which clock answers which question. **The volume clock answers "how much trading has happened"**: structure, setups, triggers and swing confirmation read more consistently when every candle carries the same participation. **The wall clock answers "when"**: weekly and daily candles, session levels, news, the halt and every expiry rule. Mandelbrot's caveat makes that split a requirement rather than a taste. Seen this way, the preference for volume candles is fully compatible with price action; the apparent conflict reduces to assigning each layer to the right clock.

The binding risks are practical, not theoretical. The academic case is modest and settled, and nothing suggests volume bars create an edge time bars lack. What will break the system is mismatch: a split rule the platform does not share, a session template that cuts bars differently, or a weekly resize that silently redraws the review chart. Each undermines what this user depends on most, seeing exactly what the bot saw. Verify bar for bar first. After that the payoff is real if unglamorous: duration and range per volume become two extra readings on every candle, and a 3 a.m. bar finally means the same thing as a 9:31 a.m. bar.
