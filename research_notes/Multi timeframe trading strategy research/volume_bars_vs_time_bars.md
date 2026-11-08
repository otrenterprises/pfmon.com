# Volume Bars (Constant-Volume Candles) vs. Time Bars: Statistics, Price Action, Swing Analysis, Multi-Timeframe Stacks, and Automation for Futures

Scope: the user's direct question, "I personally like volume candles over time candles but I'm not sure how that would work with price action." Futures focus (ES/NQ/CL-type, Rithmic/Tradovate tick data). No backtesting, so the emphasis is on robust concepts and clear rules. Anecdotal and forum claims are flagged. Research date: November 2026.

Confidence key used below: **[Primary]** = peer-reviewed paper, the original author's paper, or official platform docs. **[Secondary]** = blog/reproduction/summary. **[Anecdotal]** = forum post or practitioner opinion.

---

## 1. Theory: the statistical case for volume and information-driven bars

### Takeaway
The "volume clock" idea is old and well grounded: Mandelbrot & Taylor (1967), Clark (1973) and Ané & Geman (2000) argue that returns look far more Gaussian/IID when sampled in transaction or volume time than in clock time. Easley, López de Prado & O'Hara (2012) show this on E-mini S&P 500 futures (1-minute vs. 1/50-of-ADV sampling). But independent reproductions say the gains are **partial**: distributions get closer to normal and intraday seasonality largely disappears, yet returns stay fat-tailed, serial-correlation gains are inconsistent, and calendar bars remain a competitive baseline.

### Cited Findings
**Foundational literature**
- Mandelbrot & Taylor (1967), as quoted in Easley et al.: "Price changes over a fixed number of transactions may have a Gaussian distribution. Price changes over a fixed time period may follow a stable Paretian distribution, whose variance is infinite... the Gaussian random walk as applied to transactions is compatible with a symmetric stable Paretian random walk as applied to fixed time intervals." [Primary, quoted] — [Easley, López de Prado & O'Hara, "The Volume Clock" (2012 draft PDF)](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- Clark, "A Subordinated Stochastic Process Model with Finite Variance for Speculative Prices," *Econometrica* 41(1), 135–155 (1973). He uses Bochner's subordinated process to model prices, with an operational (stochastic) clock linked to trading volume as the subordinator. [Primary, abstract-level] — [Econometric Society listing](https://www.econometricsociety.org/publications/econometrica/1973/01/01/subordinated-stochastic-process-model-finite-variance)
- Mandelbrot's 1973 comment on Clark, in the same issue (pp. 157–159), adds a key caveat: "if price variation is to proceed smoothly in local time, then local time itself must flow at random and at a highly variable rate. Consequently, as long as the flow of local time remains unpredictable, concrete identification of the applicable local time leaves the problems of economic prediction unaffected." [Primary, quoted] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [IDEAS listing of the comment](https://ideas.repec.org/a/ecm/emetrp/v41y1973i1p157-59.html)
- Ané & Geman, "Order Flow, Transaction Clock, and Normality of Asset Returns," *Journal of Finance* 55(5), 2259–2284 (2000). A stochastic time change can recover near-normal returns. They found the **cumulative number of trades** a better clock than volume, and they model the clock nonparametrically, with time-change and price processes allowed to be jump diffusions. [Primary, abstract-level] — [IDEAS/RePEc](https://ideas.repec.org/a/bla/jfinan/v55y2000i5p2259-2284.html)
- Murphy & Izzeldin (2005) dispute Ané & Geman. Monte Carlo experiments show the third and higher moments of the latent information flow cannot be accurately recovered with Ané & Geman's univariate procedure. In their data, returns conditioned on the (recentered) number of trades were **not** Gaussian. [Primary working paper, abstract-level] — [IDEAS/RePEc](https://ideas.repec.org/p/wpa/wuwpfi/0512005.html)

**Easley, López de Prado & O'Hara (2012), "The Volume Clock: Insights into the High Frequency Paradigm," *Journal of Portfolio Management*, Fall 2012**
- They claim three advantages for volume time: "First, this time transformation removes most intra-session seasonal effects; second, it allows a partial recovery of Normality and the IID assumption; third, sampling in a volume-clock metric addresses the problem of random and asynchronous transactions." [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [SSRN abstract](https://papers.ssrn.com/abstract=2034858)
- **This is the key futures evidence.** Exhibit 2 ("Partial recovery of Normality through a price sampling process subordinated to a volume clock") compares standardized E-mini S&P 500 futures price changes sampled every minute against sampling "every 1/50 of the average daily volume," with a standard normal overlaid. The sample runs Jan 1, 2008 to Oct 22, 2010. The evidence is a visual distribution plot, and the paper reports no test statistics. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- They give ES-scale example bucket sizes: "dividing the session into equal volume buckets (e.g. in 200,000 contract increments...)", and an HFT market maker "turning her inventory over for every 50,000 contracts exchanged." [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- On intraday volume concentration in ES (Nov 2010 to Nov 2011): "The largest concentrations of volume within a minute tend to occur during the first few seconds, for almost every hour of the day," especially 02:00–03:00 GMT (European equity open), 13:00–14:00 GMT (US open) and 20:00–21:00 GMT (US close). They attribute this to TWAP/VWAP algorithms trading in 1-minute slots. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- About 51.56% of E-mini S&P 500 trades (Nov 2010 to Nov 2011) were for one contract. Round sizes are overrepresented: size 10 is 2.9x as frequent as size 9, and size 50 is 10.86x as frequent as size 49. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- Advice to slower traders: "Choice #1: Where possible, LFT firms should adopt the HFT 'event-based time' paradigm"; "Choice #3: Join the herd. Trade with volume bursts, like at the opening and closing of the session"; "Choice #6: Avoid seasonal effects" (end-of-day hedges, calendar rolls, etc.). [Primary, opinion] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)

**López de Prado, *Advances in Financial Machine Learning* (2018), Chapter 2 (secondary summaries; the book itself was not read directly)**
- Time bars "should not be used because markets do not process information at a constant rate," and they show "poor statistical properties, like serial correlation, heteroskedasticity, and non-normality." [Secondary summary of book] — [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/)
- Tick bars produce returns that "behave much more like i.i.d Gaussian," with one caveat: opening and closing auctions can be reported as one huge tick, creating outliers. Volume bars improve on tick bars because trades differ in size. Dollar bars are "more robust" to changes in price and share count. [Secondary] — [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/)
- Information-driven bars:
  - Tick imbalance bars (TIB) sign each tick by the tick rule and sample when cumulative signed imbalance exceeds its expected value. They are "produced more frequently when there is informed trading."
  - Volume and dollar imbalance bars replace the sign with signed volume or dollars.
  - Run bars sample when the current buy or sell run exceeds its expectation.
  - Expected values (E[T], P[b=1]) come from EWMAs of prior bars.

  [Secondary] — [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/); [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)
- The book also recommends event-based sampling with a symmetric CUSUM filter (S_t = max(0, S_{t-1} + y_t − E_{t-1}[y_t])) instead of naive downsampling. [Secondary] — [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/)
- The mlfinpy library docs say tick, volume and dollar bars "all exhibit a distribution significantly closer to normal" than time bars, consistent with the Volume Clock paper. They also say "Dollar bars are the most stable of the 4 types." [Secondary] — [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)

**Independent tests and reproductions (mixed results)**
- Sefidian's blog reproduction: volume bars show generally lower serial correlation than time bars, but dollar bars do not. Neither volume- nor dollar-bar log-returns are Gaussian. [Secondary, non-peer-reviewed] — [Sefidian Academy](https://www.sefidian.com/2021/06/12/introduction-to-advanced-candlesticks-in-finance-tick-bars-dollar-bars-volume-bars-and-imbalance-bars/)
- The daru.finance reproduction covered crypto, US equities and FX. Dollar, volume and tick bars all moved returns closer to normal in each market, and volume bars edged out the others on pure normality. López de Prado prefers dollar bars for robustness. [Secondary] — [daru.finance López de Prado review](https://daru.finance/research-review/lopez-de-prado)
- EODHD found suspicious lag-1 autocorrelation in volume and dollar bars built from unfiltered tick data, so it filters off-market prints before building bars. Data hygiene matters. [Secondary] — [EODHD Financial Academy](https://eodhd.com/financial-academy/?p=7012)
- Fayyaz, Jabbar, Qureshi & Jalil, arXiv:2608.26158 (2026, preprint, crypto: Binance BTCUSDT perpetual futures, 2020–2025). Compares dollar, volume, volatility, range, Renko and hybrid bars built from tick vs. 1-minute data, using a 14-day calibration window and a time-bar baseline. Findings [Preprint, not peer reviewed]:
  - "Normality gains are regime-dependent and secondary."
  - Ljung-Box independence was rejected for **all** series at the sample sizes studied.
  - Calendar-bar baselines are competitive. Information bars help mainly on variance-ratio conformance (tick Renko |VR(4)−1| = 0.020; tick volatility bars cut |VR(4)−1| from 0.089 to 0.028) and on low "timeout" rates.
  - Minute-built dollar bars had lower excess kurtosis than tick-built ones (23.7 vs. 50.4). The paper attributes much of the apparent tick underperformance to sampling frequency.

  — [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)

### Inferences
- The statistical case is real but modest. Volume sampling mainly fixes heteroskedasticity and intraday seasonality (equal volume per bar roughly equalizes variance per bar). Even under the volume clock, returns stay fat-tailed and show some dependence. "Closer to IID normal" is an accurate description. "IID normal" is not.
- The statistical benefits matter most for statistical or ML models: z-scores, volatility normalization, fixed-threshold stops in "per-bar" units. For discretionary price-action reading, the more practical benefit is that each candle represents comparable participation. A 3-a.m. candle and a 9:31 a.m. candle are "worth" the same amount of trading.
- Mandelbrot's caveat applies directly to the user. Volume time cannot be converted back into clock time ahead of time, because you can't know how long the next N contracts will take. Anything with a clock deadline (news releases, session close, flat-by-time rules, weekly bar close) still needs a time anchor.
- Ané & Geman found the number of trades an even better clock than volume. That argues tick bars may be statistically as good or better. But CME trade-reporting conventions (summary trades vs. split fills, see Section 2) make trade counts feed-dependent. Volume totals are not, so volume bars are the more portable choice for Rithmic/Tradovate data.

### Gaps
- I did not access AFML Chapter 2 tables directly. López de Prado's specific Jarque-Bera or serial-correlation numbers for E-mini bars are not verified here.
- I found no peer-reviewed study since 2012 that tests volume bars vs. time bars specifically on ES/NQ/CL with modern (2020s) data. The 2012 Exhibit 2 is visual-only, and the 2026 arXiv paper is crypto-only.
- I did not verify whether information-driven bars (imbalance/run) outperform plain volume bars for discretionary price action. The evidence is ML-oriented.

---

## 2. Practical behavior of volume bars in futures (sessions, platforms, partial bars, splits)

### Takeaway
Volume bars compress quiet periods (overnight, Asia, lunch) into few bars and expand busy periods (open, close, news) into many. That removes most intraday seasonality. Platforms differ on two details that matter for automation: (1) whether a new bar is forced at session start, which leaves a partial last bar, and (2) whether a large print that overshoots the threshold is **split** across bars (exact-volume bars) or left as **overflow** (bars of "N or more"). Sierra Chart documents both behaviors. NinjaTrader documents session behavior but not the split rule.

### Cited Findings
**Session behavior / seasonality**
- Volume time "removes most intra-session seasonal effects." [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- Easley et al. describe ES volatility forecasting "over the next 50,000 contracts, whatever the number of (night-session) hours or (day-session) milliseconds it takes to exchange that volume." Volume bars stretch over hours at night and compress to seconds in the day session. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- Galen Woods argues that a 5-minute bar at the open is very different from one after hours, which is why he sees more value in non-time charts for intraday trading. He sees daily time charts as sensible because each bar covers a full session. [Anecdotal/practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)

**NinjaTrader 8 [Primary docs]**
- "A Volume bar is based on a specific number of units traded (volume). A bar will continue to develop until the specified volume is reached," and a new bar starts once that level is surpassed. — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)
- "Each new session will have bars freshly built beginning from the first tick of the session." The last bar of a session in a 10,000 Volume chart "may contain a volume less than 10,000." This "can be changed via the 'Break at EOD' Data Series property." — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)
- Volume bars are built from tick data. With Tick Replay, historical bars are built from the provider's or local repository's tick data. — [NinjaTrader 8 Bar Types](https://ninjatrader.com/support/helpGuides/nt8/bar_types.htm) (via search summary)
- The NT8 docs do **not** state whether a single trade that crosses the threshold is split or carried over (see Gaps).

**Sierra Chart [Primary docs]**
- Volume Per Bar: "with a setting of 100000, each bar will be equal to or greater than 100000 shares/contracts." Without splitting, bars can overshoot. — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- "It is recommended that you enable Chart Settings >> Chart Data >> Split Data Records when using Volume bars." With splitting, records are divided "to create 100% constant" bars, and "Only the Volume and Number of Trades fields are split and distributed among the bars to match the setting." "Splitting of a data record does not occur on the last record in the Intraday data file," so "the very last bar in the chart can exceed the Number of Trades, Volume, Range, Reversal setting." — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- "When using Volume Per Bar, it is necessary that New Bar at Session Start be enabled." With it enabled, a bar that crosses into the next trading day "will be cut and a new bar will be started." This applies to Number of Trades, Volume, Range, Reversal, Renko, Delta Volume, Price Change and P&F bars. The trading day starts at the Session Start Time, or the Evening Start Time if Use Evening Session is enabled. — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- **Conflicting practitioner advice:** a NexusFi user says unchecking "New Bar At Session Start" removes incomplete bars at session boundaries. Another prefers it on so VWAP and overnight high/low statistics align with session starts. A moderator notes that with it on, "you will have an incomplete bar almost all the time as the last bar of the previous session." This contradicts Sierra's own docs, which say the setting is necessary for Volume Per Bar. [Anecdotal] — [NexusFi/futures.io Sierra Chart thread](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)
- "Combine Trades Into Original Summary Trade" (CME Group and EUREX futures only) merges fills into the original aggressor summary trade. "Trades which are combined into a larger quantity summary trade are always at the same price." It requires a tick-by-tick data configuration. — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- Sierra Chart also offers "Number of Trades Per Bar," Range Per Bar variants, Reversal bars, Renko, "Delta Volume Per Bar" (a bar forms until |Ask Vol − Bid Vol| ≥ setting) and "Price Change" bars. — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)

**Other platforms**
- **TradingView pitfall:** the built-in "Volume candles" chart type is **not** constant-volume bars. The candles "vary in thickness depending on the trading volume," which is width coding on (apparently) time-based candles. Premium plan or higher is required. [Primary docs] — [TradingView Volume candles](https://in.tradingview.com/support/solutions/43000724995); [FX News Group](https://fxnewsgroup.com/forex-news/platforms/tradingview-expands-range-of-chart-types-with-addition-of-volume-candles/)
- On TradingView, true fixed-volume bars come only from community Pine scripts:
  - "Candles Based On Traded Volume" (CBTV) indexes bars by total volume and runs in a separate pane below the time chart.
  - LuxAlgo's "Volume Aggregation Bars" (page dated June 2026) builds bars at volume thresholds.

  TradingView separately supports tick-based intervals. [Third-party scripts] — [CBTV script](https://in.tradingview.com/script/3fKYlqbQ-Candles-Based-On-Traded-Volume); [LuxAlgo Volume Aggregation Bars](https://www.luxalgo.com/library/indicator/JYq3JqgD-volume-aggregation-bars/); [TradingView tick-based intervals](https://in.tradingview.com/support/solutions/43000709225)
- Quantower: "Chart type Volume Bars are built based on volume data — tick or exchange volume when available. Time is not involved in this aggregation." The user sets lots (or ticks) per bar. [Primary docs] — [Quantower Volume Bars](https://help.quantower.com/quantower/analytics-panels/chart/chart-types/volume-bars)
- CQG Constant Volume Bar (CVB): built from tick or exchange volume, "Time is not a factor." "All volume studies and price-based studies work with CVB charts." Displaying current volume "gives you an idea of how close the current bar is to completion." The example uses 1,000 contracts. [Primary docs] — [CQG CVB help](https://help.cqg.com/cqgic/19/Documents/constantvolumebarcvb.htm); [CQG Primer: Volume Based Charts](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts)
- ATAS offers volume-based frames such as BTK bars ("more bars would be formed... during the periods of high market activity"), but "the algorithms of formation of BTK bars are not disclosed." [Primary vendor blog] — [ATAS: Types of frames, part 2](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/)

**Contract facts relevant to sizing**
- ES = $50 × S&P 500 index. The minimum tick is 0.25 index points = $12.50. [Primary/broker spec] — [NinjaTrader ES contract specs](https://ninjatrader.com/futures/futures-contracts/equity-index/e-mini-s-p-500/)
- CME reported 2025 Micro E-mini S&P 500 futures ADV up 35% to 1.2M contracts. Equity index futures ADV was about 6.5M (Q1 2025), 5M (Q3 2025) and 7.2M (Q1 2026, +11% y/y). Volume regimes shift quarter to quarter by tens of percent. [Primary CME releases, via search summaries] — [CME 2025 annual ADV release (Barchart)](https://www.barchart.com/story/news/36882764/cme-group-reports-record-annual-adv-of-28-1-million-contracts-in-2025-up-6-year-over-year); [CME Equity Insights April 2026](https://www.cmegroup.com/news/2026/equity-insights-report-april-2026.html)

### Inferences
- **Session boundaries.** Use one consistent rule across chart and bot: either force a new bar at the session start (CME Globex day = evening open after the daily maintenance halt), or let bars run continuously. Forcing a break means one partial bar per session, which should be flagged and excluded from "equal-volume" logic such as range-per-volume comparisons. Running continuously means one bar can straddle the daily halt and the weekend, hiding a price jump inside a single candle. For price action, forcing a break at the Globex session start (Sierra's documented requirement) is the cleaner default.
- **RTH vs. ETH.** Volume bars on a 24-hour (ETH) feed already compress the overnight into a few bars, so running two separate charts is less necessary than with time bars. If the user wants RTH-only structure, start bars at 09:30 ET with New Bar at Session Start, but recognise that opening-range and prior-day levels then depend on which session template is used.
- **Overflow vs. split.** Splitting gives exact-N bars, which preserves the "equal participation per candle" property needed to compare ranges. Overflow is acceptable, but a single 2,000-lot print on a 1,000-lot chart then makes one "double" bar. For an automated build, split (Section 7).
- **Tick (number-of-trades) bars depend on the feed.** Whether CME fills are reported as one aggressor summary trade or many split fills changes trade counts (hence Sierra's "Combine Trades" option). Volume totals are invariant to that. This is a concrete practical reason to prefer volume bars over tick bars with Rithmic/Tradovate data.
- **Rollovers.** Build volume bars on the specific contract month and switch to the next contract when its volume dominates. Mixing a back-month with thin volume into a continuous series would distort bar durations around the roll.

### Gaps
- The NinjaTrader 8 split/overflow rule for a single trade that crosses the volume threshold is not documented on the pages read.
- I couldn't verify Tradovate's native chart bar types (whether "Volume" bars exist and how they handle splits or sessions), or MotiveWave's documentation.
- ES/NQ/CL full-size futures ADV for 2025–2026 could not be retrieved (CME pages returned 503). Only Micro ES and aggregate equity-index ADV were found.
- Bar timestamp conventions (open time vs. close time stamping) for volume bars in NT8/Sierra were not verified. This matters for HTF alignment.
- Whether Rithmic's last-trade feed includes CME block trades or other off-book prints, which would create huge single "prints" in volume bars, was not verified.

---

## 3. Price action and swing analysis on volume bars

### Takeaway
Standard bar and candlestick reading (signal bars, trendlines, swings) carries over to volume charts. Practitioners, including Al Brooks' course staff, say so explicitly, and analysts note that constant-volume charts, unlike range charts, keep bar-pattern analysis meaningful. What changes is the **meaning of range and duration**. Each bar holds equal volume, so bar range ≈ price impact per unit of volume (a liquidity/aggression proxy), and bar duration ≈ inverse activity. Time-anchored levels (opening range, prior-day high/low, weekly open) and period-based indicators need care.

### Cited Findings
- Galen Woods: "unlike range charts, we are able to apply bar pattern analysis on constant volume charts," while "most bar patterns and candlestick patterns are ineffective on range charts." He also cautions: "Be very careful when trying out charts without a time base"; "most trading methods use time charts"; "The only way to find out is to test." [Practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)
- Woods' rationale is that fixed volume lets you compare what price does for the same amount of activity: "Volume is the fuel of market movements." [Practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)
- **Brooks Trading Course forum** [Anecdotal, staff statements; Al Brooks himself does not post in the thread]:
  - Asked whether trend lines and signal bars from 5-minute charts carry over to tick charts, the BTC Admin answered "Yes, and yes." He finds tick charts especially useful for overnight-to-RTH trend lines.
  - Moderator ludopuig said price action "Should work as well." He noted that roughly 2,000-tick or 6,500-volume ES charts closely resemble a 5-minute chart (2021). He warned that faster charts mean "a very fast chart during BOs with more false signals" and advised: "Stay with the 5min while learning!"
  - The BTC Admin uses "8,000 tick most of the time," targeting about a 3–5-minute equivalent, and drops to 6,000/4,000 in slow markets. He says "2,000 ticks and lower is far too fast."
  - A member reported that lower timeframes led to early profit-taking, too-wide stops relative to targets, and higher commissions.

  — [Brooks Trading Course forum: tick chart](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)
- Al Brooks himself reportedly uses time charts: 5-minute RTH ES, with 15/60-minute for context. This is secondhand from forum commenters, and I found no primary Brooks source on volume charts. [Anecdotal] — [NexusFi Al Brooks book discussion](https://nexusfi.com/traders-hideout/734-book-discussion-reading-price-charts-bar-bar-al-brooks-17.html)
- Comparable tick and volume chart settings "plot price action so closely that it's impossible to tell which one is what." [Practitioner] — [TradingMarkets](https://tradingmarkets.com/?p=676863)
- Practitioners disagree on usability. One NexusFi user finds time charts much easier to read than "tick charts of any stripe." [Anecdotal] — [NexusFi: why tick charts instead of time charts](https://nexusfi.com/traders-hideout/23194-why-tick-charts-instead-time-based-charts-other-chart-types-2.html)
- CQG states "All volume studies and price-based studies work with CVB charts." Mechanically true, but the lookback now spans variable clock time. [Primary docs] — [CQG Primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts)
- Volume-clock theory: event-based sampling equalizes information per observation, and time bars oversample quiet periods and undersample active ones. [Primary/Secondary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf); [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/)

### Inferences
These are interpretation rules derived from the equal-volume construction. They are my reasoning, not sourced empirical results.
- **Bar range = price displacement per fixed volume.** Range ÷ volume is a Kyle's-lambda/Amihud-style impact proxy.
  - A wide-range volume bar means the book was thin or aggression was one-sided: N contracts moved price a lot.
  - A narrow-range bar at a level means absorption or balance: N contracts traded with little displacement.
  - On time bars these two cases are confounded with "how busy was this minute"; on volume bars they are not.
  - Rule idea: compare the current bar's range to the trailing median range of the last K volume bars. Avoid comparing against time-bar ATR.
- **Bar duration (wall-clock seconds per bar) is a new, free activity variable.** Fast bars = participation surge (news, open, breakout). Slow bars = disinterest. A breakout whose bars are fast and wide is a strong "impact + urgency" signal. A breakout on slow, narrow bars is suspect. Duration should be logged per bar for automation.
- **Candlestick patterns.**
  - **Pin bar / rejection wick:** on a volume bar, the wick formed within a fixed participation budget, so a long wick means price was rejected within N contracts. This arguably makes wicks more comparable across sessions than on time bars, where an overnight 5-minute wick may reflect only a few hundred contracts.
  - **Engulfing:** an engulfing bar engulfs a bar of *equal* volume, so it no longer implicitly signals "more volume" as on time charts. Its meaning reduces to directional displacement dominance.
  - **Inside bars:** inside bars indicate compression per unit volume, a cleaner definition of contraction.
- **No intrasession gaps.** Under continuous Globex trading, volume bars essentially never gap within a session. Gap-based patterns only exist at session breaks, and only if bars are forced to break there.
- **Swing points.** Fractal or N-bar swing pivots on volume bars are confirmed after N × V contracts trade, not after N × minutes. Overnight, confirmation can take hours; at 09:30 ET it can take seconds. Swing *significance* also changes: a swing on a 2,000-lot ES chart is "a reversal that held for k × 2,000 contracts." That is more consistent than time-bar swings in information content, but its clock duration is unpredictable (Mandelbrot's caveat).
- **Support/resistance and trendlines.** Price levels are bar-type agnostic, since a level is a price. Trendlines are *not*: the x-axis is volume, so a line's slope is "points per contract," and the same trendline drawn on a time chart and a volume chart will touch different points. Overnight-to-RTH trendlines become more drawable because the overnight compresses, as the BTC Admin noted.
- **Time-anchored levels still require time data.** Opening range (first N minutes), prior day/week high-low-close, session VWAP, and the weekly open are defined in clock or session terms. Compute them from tick or time data and overlay them on the volume chart. Never derive them from "first K volume bars."
- **Indicators change meaning.**
  - A 20-period EMA on 2,000-volume bars = the last 40,000 contracts. That may span 10 minutes at the open or 6+ hours overnight.
  - ATR(14) on volume bars measures range per 14 × V contracts, which is closer to a stationary volatility measure than time ATR, since it removes most seasonality.
  - Oscillators with time-calibrated thresholds (e.g., RSI behaviour tuned on 5-minute bars) cannot be assumed to transfer.

### Gaps
- I found no rigorous study showing that specific candlestick patterns have different (or better) predictive behaviour on volume bars than on time bars in futures. All pattern-transfer claims are practitioner opinion.
- I found no primary Al Brooks statement on volume charts.
- No source quantified how swing-pivot counts or trendline reliability differ between volume and time bars.

---

## 4. Multi-timeframe (MTF) analysis with volume bars

### Takeaway
There is no standard "volume-bar MTF" methodology in the sources. The robust practical approach is a **hybrid stack**: volume bars for execution and intraday structure, plus time bars (daily/weekly, optionally 60m/240m) for context and time-anchored levels. A pure volume ladder (each tier 3–5× the one below) also works for intraday structure, and some practitioners use exactly that (e.g., 2,000/6,000/18,000 ES).

### Cited Findings
- One NexusFi trader reports using 2,000, 6,000 and 18,000 volume charts for ES (a 3× ladder). Another uses 2,584 or 4,181 (Fibonacci numbers) "depending on the season." [Anecdotal; surfaced via NexusFi search results, exact post attribution not individually verified] — [NexusFi thread](https://nexusfi.com/showthread.php?p=656686); [NexusFi thread](https://nexusfi.com/showthread.php?p=635515)
- NexusFi members advise against bars that are too small (noise) or too large (late entries, wide stops). They suggest checking the average true range of a volume chart to see if bar size fits the trading style, and using volume charts alongside other charts rather than alone. [Anecdotal] — [NexusFi thread](https://nexusfi.com/showthread.php?p=678596)
- A 2,000,000-contract volume setting gives about one bar per day on ES, which is far too coarse for intraday use. A moderator notes that Sierra Chart's Volume Per Bar is an intraday-only bar period. [Anecdotal] — [futures.io Sierra Chart thread](https://futures.io/sierra-chart/38958-volume-per-bar-chart-bar-period-not-intraday-2.html)
- Al Brooks' own reported stack is time-based: 5-minute execution with 15/60-minute context. [Anecdotal, secondhand] — [NexusFi Al Brooks book discussion](https://nexusfi.com/traders-hideout/734-book-discussion-reading-price-charts-bar-bar-al-brooks-17.html)
- Galen Woods considers daily time bars sensible because each bar covers a full session, and non-time charts most useful intraday. [Practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)
- The Volume Clock's ES example bucket sizes (50,000 and 200,000 contracts) and its 1/50-of-ADV sampling are natural mid-tier references. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)

### Inferences
**Recommended hybrid stack (design proposal, not sourced as a tested method):**

| Role | Bar type | Sizing rule | Purpose |
|---|---|---|---|
| Weekly context | 1-week time bars (cap) | Calendar | Weekly trend, prior-week H/L/C, weekly open |
| Daily context | Daily (Globex session) time bars | Session | Prior-day H/L/C, daily swings, ATR(daily) for risk scaling |
| Intraday structure | Volume bars, "HTF-V" | ≈ ADV/12 to ADV/25 | Swing structure, trend leg identification (each bar ≈ a 30–90-minute RTH equivalent at average activity) |
| Setup | Volume bars, "MTF-V" | ≈ 3–5× execution bar | Pullback structure, pattern context |
| Execution/trigger | Volume bars, "LTF-V" | ≈ ADV/150 to ADV/300 | Signal bars, entries, stop placement |

- **Why time bars at the top.** The daily and weekly bars are what other participants anchor to: prior-day/week levels, settlement, weekly opens. At daily-plus horizons, the bar count per period is roughly equal under either clock anyway. Volume bars would only make the higher timeframes misalign with sessions and weeks, and the 1-week cap is naturally a calendar unit.
- **Why a 3–5× ratio between volume tiers.** This mirrors conventional time ladders (5m→15m→60m) and the reported 2,000/6,000/18,000 practice. Too small a ratio (<3×) makes tiers redundant. Too large (>6×) leaves the setup tier blind to execution-tier structure.
- **Pure volume ladder alternative.** For a scalper who doesn't want time bars below daily: LTF-V = V, MTF-V = 4V, HTF-V = 16V, plus daily and weekly time bars. Swing definitions (e.g., 3-bar fractal or a percentage/ATR zigzag) should be identical across tiers so higher-tier swings are coarser versions of lower-tier swings.
- **Defining "HTF trend" when the HTF is a volume chart.** Use only completed HTF-V bars. A volume-bar HTF completes at unpredictable clock times, which is fine for automation as long as signals use only bars that are closed at decision time (Section 7).

### Gaps
- I found no published or academic MTF framework built specifically on volume-bar hierarchies, and no evidence comparing hybrid vs. pure-volume stacks.
- The ADV fractions in the table are my calibration proposals derived from the 1/50 rule and practitioner settings, not sourced recommendations. The user should eyeball them on charts.

---

## 5. Sizing and calibrating volume bars

### Takeaway
The best-sourced rule of thumb is the Easley–López de Prado–O'Hara sampling of **1/50 of average daily volume** (≈50 bars per full Globex day at average activity). That is a statistical-sampling choice and coarse for execution. Practitioners size execution bars to look like a 3–5-minute RTH chart. For stability, set the bar size from a trailing average of daily volume (forum sources cite about 30 days; mlfinpy and López de Prado use EWMAs for imbalance thresholds), and change it only on a fixed schedule, never intraday.

### Cited Findings
- The Volume Clock's Exhibit 2 samples ES "every 1/50 of the average daily volume." [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)
- mlfinpy: "it is suggested that using 1/50 of the average daily dollar value, would result in more desirable statistical properties." It attributes this to the Volume Clock paper, and gives the same 1/50 note for volume and tick bars using average daily volume. [Secondary] — [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)
- MultiCharts forum posters say the recommended threshold is the "Moving Average of the Last 30 days DAILY DollarValue divided by 50." I couldn't confirm this against the book itself. [Anecdotal] — [MultiCharts forum](https://www.multicharts.com/discussion/viewtopic.php?p=140109)
- López de Prado's imbalance/run bars set expected thresholds dynamically via EWMAs of prior bars (mlfinpy hyperparameter `num_prev_bars`, with an initial `expected_num_ticks_init`). [Secondary] — [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html); [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/)
- Dollar bars are recommended as more robust to price-level changes. [Secondary] — [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/); [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)
- The 2026 crypto study recalibrated thresholds over a rolling 14-day window and tracked "timeout percentage," meaning bars forced closed by a time limit. A max-duration guard is a recognised design element. [Preprint] — [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)
- Practitioner calibration heuristic: "take the long-term average range/volume of the time-frame you usually trade" (e.g., average 5-minute volume → volume-bar size). [Practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)
- Practitioner ES settings [Anecdotal, regime-dependent]:
  - About 6,500 volume ≈ a 5-minute chart (2021) — [Brooks Trading Course forum](https://www.brookstradingcourse.com/support-forum/general-trading-discussion/tick-chart/)
  - 2,000/6,000/18,000 volume ladder — [NexusFi](https://nexusfi.com/showthread.php?p=656686)
  - 1,000-contract example in CQG docs — [CQG Primer](https://news.cqg.com/workspaces/2023/11/cqg-primer-volume-based-charts)
- Volume regimes shift materially. CME equity index futures ADV moved between about 5M and 7.2M contracts/day across quarters of 2025–Q1 2026, and Micro ES ADV rose 35% in 2025. [Primary CME, via search summaries] — [CME 2025 annual ADV (Barchart)](https://www.barchart.com/story/news/36882764/cme-group-reports-record-annual-adv-of-28-1-million-contracts-in-2025-up-6-year-over-year); [CME Equity Insights April 2026](https://www.cmegroup.com/news/2026/equity-insights-report-april-2026.html)

### Inferences
- **Calibration formula (proposal):** `V_bar = round_to_nice( EWMA_or_SMA_20to30d(daily contract volume of the traded contract) / target_bars_per_day )`.
  - Execution tier: about 150–300 bars/day, roughly 3–5-minute RTH equivalents, since most volume prints in RTH.
  - Setup tier: about 40–75 bars/day (≈ the 1/50 rule).
  - Structure tier: about 12–25 bars/day.
- **Hold the size fixed for a period** (e.g., recalc on the first session of each month or after each quarterly roll). Round to a "nice" number so chart structure is reproducible when reviewed visually. Intraday re-sizing would re-draw history and break swing-based rules.
- **Separate sizing per instrument.** ES, NQ, CL and their micros have very different ADV. Never reuse a contract count across symbols. MES/MNQ volume bars measure different participation from ES/NQ bars, so build on the full-size contract if the micro is just the execution vehicle.
- **Regime guard.** If live bars per day drift beyond ±40% of target for 5+ sessions, flag for recalibration rather than auto-adjusting. That keeps the "proven concepts, no optimization" spirit.
- **Dollar bars for multi-year review.** For long reviews, where ES has roughly doubled in price over a few years, dollar bars keep notional per bar constant. For intraday use within one contract month, volume bars and dollar bars are nearly identical.

### Gaps
- I couldn't retrieve current (2025–2026) full-size ES, NQ or CL ADV, so no concrete contract counts are given. They need to be computed from the user's own Rithmic/Tradovate history.
- I could not verify that the 30-day lookback in the 1/50 rule comes from López de Prado; it is forum-sourced.

---

## 6. Alternative bar types: brief comparison for price action and automation

### Takeaway
Tick and volume bars are close cousins and look nearly identical at comparable settings. Range, Renko, Kagi, Line Break and P&F bars are price-driven and alter or discard the OHLC information that candlestick reading relies on. Heikin-Ashi bars are averaged, synthetic prices and should never be used for entries or stops. For an automated system that respects classic price action, volume bars (or tick bars) on real OHLC are the safest non-time choice.

### Cited Findings
- **Tick bars:** a bar closes after a set number of trades. They have similar statistical motivation to volume bars, and Ané & Geman found trade count to be the best clock. But auction prints can create outliers, and trade counts depend on how fills are reported (CME summary vs. split fills). [Primary/Secondary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm); [IDEAS: Ané & Geman](https://ideas.repec.org/a/bla/jfinan/v55y2000i5p2259-2284.html); [Reasonable Deviations AFML notes](https://reasonabledeviations.com/notes/adv_fin_ml/); [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- **Range bars:** "The bar will continue to develop until the price range is broken." In NT8, "a tick in a Range bar represents a price increment." [Primary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm). Sierra Chart's "New Bar on Range Met" variant: "The trade that extends the bar range to the specified range, will not in and of itself start a new bar." [Primary] — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html). Range charts make "most bar patterns and candlestick patterns... ineffective." [Practitioner] — [Trading Setups Review](https://www.tradingsetupsreview.com/trading-charts-without-time-range-tick-volume/)
- **Renko:** "A new brick is plotted when price exceeds the High or Low of the previous brick by a specified amount." [Primary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm). In the 2026 crypto study, tick-built Renko had the best random-walk conformance (|VR(4)−1| = 0.020, lag-1 autocorrelation 0.002). [Preprint] — [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)
- **Heikin-Ashi:** NT8 describes these as time-based bars that use "averaged formulas to calculate OHLC values," with values rounded to tick size. They are not actual traded OHLC. [Primary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)
- **Kagi / Line Break / Point & Figure:** these are reversal-amount or breakout-driven constructions. For example, Line Break: "No new bar is drawn if price does not exceed the High or Low of the previous bar." P&F: "There can never be two columns of X's or O's next to each other." [Primary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)
- **Reversal / Delta-volume / Price-change bars (Sierra Chart):**
  - Reversal bars are cut at session start when New Bar at Session Start is on.
  - Delta Volume Per Bar closes when |ask vol − bid vol| reaches the setting. This is an order-flow analog of López de Prado's volume imbalance bars.
  - Price Change bars close after N price changes.

  [Primary] — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- **Comparable tick and volume settings look indistinguishable.** [Practitioner] — [TradingMarkets](https://tradingmarkets.com/?p=676863)

### Inferences
| Bar type | Price-action fidelity | Automation notes |
|---|---|---|
| Volume | High: real OHLC, equal participation per bar | Feed-invariant totals. Choose split vs. overflow (split recommended). |
| Tick (trades) | High: real OHLC | Count depends on CME summary vs. split-fill reporting. Pick one convention. |
| Dollar | High (≈ volume intraday) | Better for multi-year normalization. |
| Range | Low for candlesticks: every bar has the same range, so wicks/bodies mean little | Good for trailing logic. Bar close is a price event, so "close" carries no info. |
| Renko | Low: discards wicks and time, and the bar prints late | Statistically tidy, but entries lag the actual price. Backfilled bricks can mislead. |
| Heikin-Ashi | **Do not use for signals/stops**: synthetic OHLC | Fine as a trend-colour filter only, with orders priced off real data. |
| Kagi/Line Break/P&F | Structural only | Useful for swing/level detection, not candle patterns. |
| Delta-volume / imbalance | Order-flow information, not classic PA | Interesting as a secondary trigger. Needs aggressor-side data (Rithmic provides it). |

### Gaps
- No futures-specific comparative study of these bar types for discretionary pattern efficacy was found. The crypto preprint is the only quantitative comparison retrieved, and it is not peer reviewed.
- "Momentum bars" (e.g., third-party or vendor-specific "BTK" bars) are proprietary or undisclosed. ATAS states the BTK formation algorithm is not disclosed ([ATAS](https://atas.net/atas-possibilities/charts/types-of-frames-in-the-atas-platform-and-their-application-part-2/)), so they are unsuitable for a transparent, rule-based system.

---

## 7. Automation: building volume bars from Rithmic/Tradovate tick data and aligning with HTF time bars

### Takeaway
Building volume bars live is simple: accumulate last-trade size until it reaches V. Three design decisions make the system reproducible:
1. Split large prints so each bar holds exactly V contracts, as Sierra's Split Data Records does.
2. Define a session-break rule (new bar at Globex session start, flag partial bars).
3. Timestamp each bar with both its open and close time, then join HTF time-bar information using only bars **closed at or before** the volume bar's close timestamp.

Swing confirmation lag is then measured in contracts, so add a clock-time guard for quiet periods.

### Cited Findings
- Sierra Chart's documented model:
  - Without splitting, bars are "equal to or greater than" the setting.
  - With Split Data Records, "Only the Volume and Number of Trades fields are split and distributed among the bars to match the setting." Open/high/low/close of a 1-tick record are shared.
  - The final, in-progress record is not split.

  [Primary] — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- Sierra Chart notes that "a single 1 Tick data record can have a volume more than 1" and "splitting may be necessary to distribute the volume across more than one chart bar." [Primary] — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- CME fills can be combined into the original aggressor summary trade (all at one price) in Sierra Chart for CME/EUREX futures. Feed representation of trades varies, which affects trade-count bars and the size of individual "prints." [Primary] — [Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)
- NinjaTrader restarts bars at each session's first tick and allows an incomplete final bar, configurable via "Break at EOD." Historical bars built through Tick Replay use the provider's tick data. [Primary] — [NinjaTrader 8 Bar Types](https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm)
- Filter bad or off-market prints before building bars. Unfiltered ticks produced spurious lag-1 autocorrelation in volume/dollar bars. [Secondary] — [EODHD](https://eodhd.com/financial-academy/?p=7012)
- Event-based bars can carry a "timeout" (forced close after a maximum duration). The crypto study reports timeout percentages of 0.0% (tick pipeline) vs. 0.9% (minute pipeline) for dollar bars. [Preprint] — [arXiv 2608.26158](https://arxiv.org/html/2608.26158v1)
- López de Prado's information-driven bars require trade signing (tick rule) or aggressor-side data. Thresholds come from EWMA expectations that are reset when a bar forms. [Secondary] — [mlfinpy docs](https://mlfinpy.readthedocs.io/en/latest/FinancialDataStructure.html)
- HFT practice measures horizons in volume ("over the next 50,000 contracts"). Trading on round-minute boundaries is exploitable, which is an argument against time-boundary-triggered execution. [Primary] — [Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)

### Inferences
**Reference algorithm (proposal):**
1. **Input:** a stream of trades (exchange timestamp, price, size, aggressor side) for one contract month. Drop prints flagged as non-tradable or off-book if the feed marks them (verify feed flags; see Gaps).
2. **State:** `remaining = V`, current bar OHLC, `t_open`, `t_close`, buy_vol, sell_vol, n_trades.
3. **For each trade of size q:**
   - While q ≥ remaining: add `remaining` to the bar at this price, close the bar with `t_close = trade.ts`, emit it, set `q -= remaining`, start a new bar at the same price and timestamp, and reset `remaining = V`.
   - Then add the leftover q to the open bar.
   - A single 3,000-lot print on a 1,000-lot chart therefore emits up to 3 bars with identical price and timestamp. This is the "split" convention, and it keeps every bar at exactly V.
   - Alternative "overflow" convention: put the whole print in the current bar and close it, so the bar has volume > V.
   - Pick one and record it, because it changes chart appearance around block-like prints.
4. **Session rule:** at the Globex session open (or the RTH open, if using an RTH template), force-close the current bar, mark it `partial = true`, and start fresh. Exclude partial bars from range/volume comparisons and from swing-pivot counting, or treat them as a separator.
5. **Per-bar fields to store:** OHLC, volume (= V unless partial), `t_open`, `t_close`, duration = `t_close − t_open`, n_trades, buy/sell aggressor volume (delta), range, and range/volume.
6. **HTF time-bar alignment (no look-ahead):** at volume-bar close time `t_close`, use only HTF time bars whose close time ≤ `t_close`. If a "developing" HTF value is used (e.g., today's high so far), compute it from ticks up to `t_close` only. Never use the HTF bar that closes later. A daily bar is only known at settlement, and a weekly bar only at the Friday close.
7. **HTF volume-bar alignment:** a higher-tier volume bar is "known" only when its own last contract prints. Because tiers are integer multiples (with the same session-break rule), each HTF-V bar boundary coincides exactly with an LTF-V bar boundary, which keeps alignment clean.
8. **Swing confirmation lag:** a k-bar fractal pivot is confirmed after k × V more contracts.
   - **Clock guard:** if a signal fires on a volume bar that took longer than X minutes (e.g., deep overnight), or if a pending setup has not triggered within T minutes, cancel it. Liquidity conditions have changed even though "few bars" elapsed.
   - **Event guard:** suspend new entries from a few minutes before scheduled releases until N volume bars after them, since the release window compresses many bars into seconds.
9. **Rollover:** run the builder on the contract with dominant volume. On roll day, start a new bar series and do not carry an open bar across contracts. If a back-adjusted continuous series is needed for visual review, apply the price adjustment to OHLC but keep the bars as built per contract.
10. **Reproducibility:** because the user reviews proposals visually, the charting platform's volume-bar settings (size, session template, split vs. overflow, New Bar at Session Start) must match the bot's builder exactly, or the bot will "see" different candles than the user.

### Gaps
- Whether Rithmic or Tradovate last-trade feeds deliver CME aggressor summary trades or individual fills by default, and how block trades or spread-leg fills appear, was not verified. This directly affects print sizes and tick-bar counts.
- Time-stamping conventions (bar labelled by open vs. close time) in NinjaTrader and Sierra volume bars were not verified. This matters for matching platform charts to a custom builder.
- No source gives empirically justified values for the clock-time guards (max bar duration, setup expiry). These are design proposals requiring visual review.
