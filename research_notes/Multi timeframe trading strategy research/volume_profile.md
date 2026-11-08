# Volume Profile and Auction Market Theory Across Multiple Timeframes: Concepts, Setups, Automation, and Evidence

Scope note for the report writer: Primary sources fetched this session were Sierra Chart's TPO and Volume by Price documentation, TradingView's Volume Profile help page, a 2008 ES test of the 80% rule, and abstracts or records for the academic papers. Dalton's and Steidlmayer's books were not available online, so book-level definitions come from secondary practitioner sites (LuxAlgo Library, NexusFi, MetroTrade, therighttrader). Statements marked "background knowledge, not verified this session" are standard Market Profile lore from my training data. They are labelled so they can be checked or dropped. Platform docs (Sierra Chart, TradingView) are the most precise sources here for definitions and algorithms. Practitioner rules are mostly anecdotal and are flagged as such.

---

## 1. Foundations: Auction Market Theory, Steidlmayer/CBOT Market Profile, Dalton, balance vs. imbalance, initiative vs. responsive, other-timeframe participants; TPO vs. volume profile

### Takeaway
Market Profile (TPO) was developed by J. Peter Steidlmayer at the CBOT in the 1980s and codified for traders by James Dalton's *Mind Over Markets* (1990). It treats each session as an auction that rotates between balance (two-sided trade around accepted value) and imbalance (directional search for new value). TPO profiles count time at price. Volume profiles count contracts at price. Both are standard and platforms let you derive the value area from either, but they can give different levels.

### Cited Findings
- Market Profile charts were developed in the late 1980s by Peter Steidlmayer at the Chicago Board of Trade — [TradingView TPO help](https://www.tradingview.com/support/solutions/43000713306-time-price-opportunity-tpo-indicator/). One practitioner site instead says Steidlmayer was "at the Chicago Mercantile Exchange." That is an error in the secondary source, since CBOT is the standard attribution — [MetroTrade](https://www.metrotrade.com/what-is-the-80-rule-in-futures-trading/) (as summarized in search results).
- The open-type taxonomy credits Steidlmayer's 1980s CBOT work with reframing each session as an auction, and Dalton's *Mind Over Markets* (1990) with codifying the opening classifications. Dalton argued the open is uniquely informative because overnight inventory, news, and institutional participation collide early — [LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/).
- Dalton's auction vocabulary in *Mind Over Markets* (1990) includes "a drive, a test then a drive, a rejection that reverses, and a two-sided auction" — [therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive).
- Fabio Valentini's practitioner playbook frames the market as moving between balance and imbalance. A "Trend Model" trades continuation when the market is out of balance and "searching for new value" — [TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy). This is a secondary description, not Valentini's own text.
- In Sierra Chart, the TPO POC is "the price level where most of the trading is occurring timewise." There is a separate Volume POC, and the platform offers "Value Area Highlight Based On Volume," which colors the value area from the Volume Profile instead of the TPO profile, with its own "Volume Value Area %" — [Sierra Chart TPO Profile Charts docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- The 80% rule "works with either a TPO or volume profile, though the two can differ slightly" — [LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/) (via search summary).
- TradingView's volume profile classifies up/down volume by bar direction, "if close >= open, we take it as an up volume, if close < open, it's down volume." It is a proxy, not real aggressor data. On CFDs, forex, and indices it uses tick volume (count of price updates), not traded contracts — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/).

### Inferences
- Background knowledge, not verified this session. In Dalton's framework, *initiative* activity is buying above value or selling below value, meaning participants accept new prices. *Responsive* activity is buying below value or selling above value, meaning fading back toward value. The *other-timeframe (OTF)* participant is the longer-horizon, larger player whose entry produces range extension, trend days, and value migration. *Day-timeframe* participants mostly provide two-sided liquidity within the session.
- TPO vs. volume, and when each matters (my synthesis):
  - **Use TPO** for structural rules defined in time-period terms, such as IB, single prints, poor highs/lows, the 80% rule's "two 30-minute periods," and open types. Sierra Chart defines singles and poor highs/lows in TPO sub-period terms.
  - **Use volume** for liquidity levels, such as HVN/LVN, volume POC, and composite or anchored profiles. It is also the right choice in thin sessions. The ETH/Globex overnight session spends many hours at prices with little volume, so a TPO profile that includes ETH overweights overnight drift relative to where contracts actually changed hands.
  - For ES/NQ/CL with Rithmic tick data, volume-at-price is exact, while TPO is derived from bar time. Computing both and flagging divergence between TPO POC and volume POC is cheap and informative.
- Because all the rules below are framed as "acceptance" (time and volume building at a price) vs. "rejection" (fast exit and low volume), an automated system needs explicit, numerical acceptance criteria. None of the sources give canonical thresholds (see Section 4).

### Gaps
- No primary text from Steidlmayer (*Markets and Market Logic*), the CBOT Market Profile handbook, or Dalton's books was retrievable, so their exact definitions of initiative/responsive, OTF, and balance were not verified this session.
- No CME Group education page on Market Profile was fetched.

---

## 2. Core components and precise definitions (POC, VA/VAH/VAL algorithms, HVN/LVN, single prints, poor highs/lows, excess, naked POC, developing POC/VA, IB and range extension, profile shapes, day types)

### Takeaway
Platform docs give precise and mutually inconsistent definitions. Sierra Chart and TradingView both expand the 70% value area one row at a time from the POC, but with different stopping and tie rules. The legacy CBOT/"Method A" expands two rows at a time. As a result, VAH/VAL differ across vendors by a tick or more. Shape and day-type taxonomies are qualitative in the available sources, with no canonical numeric thresholds.

### Cited Findings
**POC**
- Sierra Chart TPO POC is the price row with the most TPOs. Ties go to the row closest to the middle of the profile, and if two tied rows are equidistant from the middle, the lower row wins. The Volume POC is the highest-volume row with the same tie rules — [Sierra Chart TPO docs, "How POC and Value Area Are Calculated"](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- TradingView defines POC as "the price level for the time period with the highest traded volume" — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/).

**Value Area (70%)**
- Sierra Chart (single-row method, default 70%):
  1. Target = total TPOs (or volume) × VA%.
  2. Start at the POC and compare the row one above with the row one below.
  3. Add the larger row and carry the other forward into the next comparison.
  4. Continue outward until the included count *reaches or exceeds* the target.
  5. If the two compared rows are equal, include both.
  - The Volume VA uses the same process with volume, and the doc notes that equal-volume ties are unlikely.
  - A "Count Two Levels at a Time for Value Area" option switches to a two-row method. The excerpt read did not describe its mechanics.
  — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- TradingView volume profile:
  1. Start at the POC and compare the next row above and below.
  2. Add the larger row *if it fits within the remaining target*.
  3. Stop once the next row would exceed the target.
  4. Ties go to the row closer to the POC; if equidistant, the row above.
  — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/). TradingView's TPO indicator uses a similar row-pair procedure and, on equal pairs, adds the row closest to the POC — [TradingView TPO help](https://www.tradingview.com/support/solutions/43000713306-time-price-opportunity-tpo-indicator/) (via search summary).
- Linnsoft "Method A" (described as similar to eSignal, and the classic two-row CBOT style):
  1. Target = 70% of total TPOs.
  2. Starting at the POC, inspect the two prices above and the two prices below.
  3. Add the larger pair and repeat, two prices at a time, until the target is met or exceeded.
  — [Linnsoft TPO Profile Charts](https://www.linnsoft.com/tpo). A 2013 Sierra Chart support thread noted that Sierra's formula differed from IRT Method A and requested it as an option — [Sierra Chart Support Board thread 2713](https://www.sierrachart.com/SupportBoard.php?ThreadID=2713).
- Value Area boundaries "vary across quote vendors," which the author noted as a limitation of his 80%-rule test — [teamlbr blog, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html).

**Single prints, poor highs/lows, IB, naked POC**
- Sierra Chart defines a single as "the first TPO within a sub-period that exceeds the high or low of all of the prior TPOs":
  - It is confirmed only if the following sub-period(s) stay beyond that price.
  - Singles are not identified in the first or last sub-period.
  - A single can be retracted if a later sub-period trades back into it.
  - There are two modes: compare only to the next sub-period, or check all forward sub-periods and adjust the single's start and end.
  — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- Sierra Chart defines a poor high/low as one where a TPO high or low *equals* a previous one:
  - "Price Increments" = 0 counts only exact matches; a value of 1 or more counts levels within that many increments.
  - Comparison scope can be the same profile, the prior profile, or both.
  — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- Sierra Chart's Initial Balance Range is defined as a number of sub-periods from profile start (for example, two 30-minute sub-periods make a one-hour IB). IB High and IB Low are "without any extensions." Extensions are reported as IE%, IEH, and IEL, with up to four extension-percentage lines — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- Sierra Chart's "Extend Point of Control … Until Future Intersection" extends the POC line "until it encounters a future Volume Profile which covers the price range which intersects" it, or until a chart bar intersects it ("Future Intersection Method": Volume Profiles vs. Chart Bars). This is the platform implementation of a naked/virgin POC, though the doc does not use the term — [Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141).
- Sierra Chart "Peaks and Valleys" is the closest built-in HVN/LVN detector:
  - "Sensitivity" is the number of rows searched above and below; for example, 10 with 1 tick per row searches ±10 ticks.
  - A peak is a row whose neighbouring rows have lower (or, below, lower-or-equal) volume. A valley is the reverse.
  - "Peaks and Valleys are always determined from the Total Volume at each price level."
  — [Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141).
- HVN is described in one open-source TradingView script as "a secondary local peak in the smoothed distribution" (Nadaraya-Watson kernel smoothing) — [TradingView, NW Volume Profile Kernel Smoothed](https://jp.tradingview.com/script/wqEZomb4-NW-Volume-Profile-Kernel-Smoothed-Dots3Red/). An LVN is described as "a local trough where very little volume ever traded" — [LuxAlgo, Volume Profile with HVN/LVN detector](https://www.luxalgo.com/library/indicator/CHxGnqBD-volume-profile-with-hvn-lvn-detector/) (via search summary).

**Profile shapes**
- D-shape is a symmetric middle bulge, meaning balanced and rotational.
- P-shape is a bulge in the upper portion with a thin lower tail: short covering in downtrends, or continuation finding value higher.
- b-shape is a lower bulge with a thin upper tail: long liquidation stabilizing low.
- Double distribution is two fat regions separated by a thin neck of single prints.
- Classify tentatively before midday and firmly late, because early P/b shapes often become D. No numeric thresholds are given.
— [LuxAlgo, Profile Shape Taxonomy](https://www.luxalgo.com/library/concept/profile-shape-taxonomy/).

**Day types (IB = first hour)**
- **Normal day:** wide IB contains the whole session, with two-sided rotation.
- **Normal variation:** extends the IB on one side. Sources disagree on how far: "roughly doubling it" vs. "by around the width of the initial balance."
- **Trend day:** narrow IB, persistent one-way extension, close near the extreme, little rotation.
- **Neutral:** extension on both sides. *Neutral extreme* closes near one extreme; a mid-range close "reflects unresolved balance."
- **Non-trend** and **double-distribution trend** days are named but not defined on the page. The source notes mechanical extension multiples "vary between authors."
— [LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/).
- Double distribution is "two distributions separated by single prints," and Dalton treats it as a trend-type day — [therighttrader, Double Distribution Day](https://therighttrader.com/learn/trading-strategies/double-distribution-day) (via search summary).
- Day-type frequencies are informal and conflict between sources. One blog cites ~50% normal variation, ~10% double distribution, and <5% trend days — [bullbear-university blog](https://bullbear-university.blogspot.com/2013/09/anticipating-trading-days-market.html). A NexusFi post on ES reports 54% normal variation, ~16% trend, and 25% neutral — [NexusFi thread](https://nexusfi.com/showthread.php?p=823821). Both figures were seen only via search summary, and neither has stated methodology.

### Inferences
- **Vendor VA definitions do not match.** Sierra stops at ≥70%, TradingView stops before exceeding 70% (≤70%), and Method A adds pairs of rows. VAH/VAL can therefore differ by one or more rows between platforms on the same data. An automated system should hard-code one definition and use it for both computing levels and the visual review charts.
- **Volume-profile analogs of TPO-defined concepts are not standardized.** Single prints, poor highs, and excess are defined in TPO/time terms. Volume-based versions (for example, "a run of ≥N ticks whose volume is <x% of the profile median") are practitioner inventions and need explicit, documented thresholds.
- **Background knowledge, not verified this session:**
  - *Excess* is a tail of two or more single TPOs at a session extreme, meaning a sharp rejection and a completed auction.
  - A *poor high/low* is the lack of excess (flat, multiple-TPO extreme), meaning an unfinished auction that tends to be revisited.
  - A *naked POC* is a prior session's POC that has not been traded through since that session closed.
  - The *developing POC/VA* is the POC/VA recomputed as the session progresses.
  - *Range extension* is any trade beyond the IB.

### Gaps
- Sierra Chart's exact "two levels at a time" mechanics (tie rules, odd/even row handling) were in an unread portion of the doc.
- No primary CBOT handbook text for the original value-area algorithm was found. "Method A" is attributed to the CBOT style only by convention.
- No numeric, source-backed thresholds were found for shape classification, excess tail length, or the IB-extension multiples that separate normal variation from trend days.
- NinjaTrader Order Flow Volume Profile, ATAS, and Quantower docs were not fetched.

---

## 3. Multi-timeframe / multi-dimension profiles (RTH vs. ETH, overnight, weekly, monthly, composite, anchored/swing-based, value migration, nested profiles)

### Takeaway
Platforms support all the needed dimensions: session, evening/overnight, calendar week/month/year, arbitrary date ranges, bar-count, and swing-anchored (zig-zag) profiles. Value-area relationships between consecutive periods (higher, lower, overlapping, inside, outside) are the core multi-timeframe read. How composite HVN/LVN "act as reference" for intraday trades is practitioner teaching only, not tested.

### Cited Findings
- Sierra Chart's Volume by Price period types include:
  - Multiple profiles by bar count or by fixed time (seconds, minutes, days, weeks, months, years; weeks, months, and years start on the calendar boundary)
  - Session start to end, and trading day start to end
  - From a start date-time to the end, or to an end date-time
  - Visible bars, all bars, and specified volume
  - "Based on TPO Chart" and "Based on Zig Zag Study"
  Fixed-time profiles are exact only when the bar period evenly divides the fixed length — [Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141).
- Sierra Chart's RTH/ETH handling:
  - "Use Separate Profile for Evening Session" requires Evening Session Times and works only with 1-day fixed-time profiles.
  - "Exclude Evening Session Profiles Except for Last Day" removes evening data from the calculation.
  - Profiles start at Session Start Time, or at Evening Start when the evening session is used.
  — [Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141). In TPO charts, day and evening sessions can be separate profiles, and "Always Start Letters at Primary Session Start Time" keeps letter A at the RTH open — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).
- TradingView lists six profile types: auto anchored, fixed range, periodic, session, session HD, and visible range. Profiles are computed from lower-timeframe data of the same symbol — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/).
- Value migration:
  - Higher value is bullish migration, lower value is bearish, and overlapping value is balance. Relationship types are entirely higher/lower, overlapping to one side, unchanged, or engulfing.
  - A POC migrating with the VA strengthens the read. A POC anchored in the old area argues the migration is tentative.
  — [LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/) (via search summary).
  - In Dalton's terms, an "outside day" has a value area that overlaps the prior day's on both extremes — search summary of Dalton-derived sources, e.g. [NexusFi, Market Profile TPO charts](https://nexusfi.com/a/strategies/market-profile-tpo-charts). This is secondary and the "migration" label is mostly later writers' terminology.
- Open location relative to the prior day is graded in three tiers: inside value, outside value but inside range, and outside range. An inside-value open implies overnight agreement and favors rotation. An out-of-range open plus a drive is "the strongest continuation read." An out-of-range open that stalls sets up a snap-back toward old value. The pre-bell references are the prior day's high, low, VA, and POC, plus the overnight range — [LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/).
- Trader Dale publishes swing-trading content using volume profile on higher timeframes, e.g. [Trader Dale blog, "Swing trading with volume profile" (May 2026)](https://trader-dale.blogspot.com/2026/05/swing-trading-with-volume-profile.html). Rule specifics were not extracted.

### Inferences
- **Recommended dimension stack for ES/NQ/CL** (my synthesis, built from the platform capabilities above):
  1. RTH session profile, the primary structure for the IB, open types, the 80% rule, and day types.
  2. ETH/overnight profile, kept separate, used for the overnight high/low/POC and inventory reads.
  3. Full 24-hour (ETH+RTH) volume profile, for liquidity levels.
  4. Weekly profile, calendar boundary Sunday open to Friday close.
  5. Monthly profile.
  6. Composite over a balance area: multi-day or multi-week, anchored at the start of the current balance.
  7. Swing-anchored profiles from the last significant swing high/low (Sierra's "Based on Zig Zag Study"), or from events such as FOMC, CPI, roll date, or a gap.
- **Hierarchy logic** (practitioner consensus, not tested):
  - Higher-dimension HVNs and VA edges define the "map" (where to expect stalls, i.e. targets).
  - Higher-dimension LVNs define where price is expected to travel fast or to reject (entries and stops).
  - Lower-dimension structure supplies the trigger: IB break, open type, acceptance or rejection in 30-minute periods.
  - A trade aligned with value migration on two or more dimensions (for example, daily VA higher and weekly VA higher) is "with the OTF."
- **Futures-specific handling:**
  - Contract roll: use back-adjusted or continuous data carefully. Composites should be built from the *front-month actually traded*, or price-level references from the old contract will be offset by the roll spread.
  - Include ETH only if you trade ETH. Many Market Profile references (IB, 80% rule) are defined on RTH only.
  - Background knowledge, not verified this session: CME equity-index RTH is conventionally taken as 09:30–16:00 ET, aligned with the cash index. CL "pit-session" conventions are roughly 09:00–14:30 ET. Exact conventions should be confirmed from CME.
- **Nested profiles:** a weekly profile is the sum of its daily volume-at-price histograms if the same row size is used. Composites can therefore be built by adding stored per-session histograms, which is cheap and exact with tick data (see Section 6).

### Gaps
- No rigorous source tested whether weekly or composite HVNs/LVNs predict intraday reactions.
- Dalton's *Markets in Profile* (2007), the main text on long-term/composite profile reading and OTF behaviour, was not retrieved.
- Exact CME RTH/ETH session times for ES/NQ/CL were not verified this session.

---

## 4. Established volume profile / Market Profile strategies with explicit rules (80% rule, VA rejection/acceptance, open types, POC/naked POC, LVN/HVN, balance breakout / look-above-and-fail, poor high/low repair, IB breakout, single-print fills; practitioner variants)

### Takeaway
The best-documented rules are the 80% rule and open types. Even these have inconsistent confirmation criteria across sources. The one informal test found (ES, 2008, 119 days) showed complete fills only ~39–40% of the time when triggered, not 80%. Most other setups are taught qualitatively. Their "rules" are practitioner conventions without published methodology, so they should be used as conditional context with visual review, not as proven edges.

### Cited Findings
**80% rule (Value Area rule)**
- Price opens outside the prior session's value area, re-enters it, and holds inside. The usual confirmation is two 30-minute TPO brackets of acceptance, and the target is the opposite VA edge — [MetroTrade](https://www.metrotrade.com/what-is-the-80-rule-in-futures-trading/); [LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/).
- Attribution varies. Some trace the first published statement to Dalton Capital Management's *Profile Reports* (1987–1991). Others tie the two-period convention to Steidlmayer and the CBOT manual — [NexusFi, 80% Rule](https://nexusfi.com/a/concepts/80-percent-rule); [MetroTrade](https://www.metrotrade.com/what-is-the-80-rule-in-futures-trading/) (via search summaries).
- *Mind Over Markets* (p. 279) reportedly "does not state the half-hour periods must be consecutive," only that the market must print inside the VA during two half-hour periods — [teamlbr blog](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html).
- Confirmation variants:
  - Price does not need to close each 30-minute period inside.
  - Some require two consecutive 30-minute *closes* inside.
  - Others require the *entire* 30-minute bar to trade inside VA.
  - Some extend the rule to opens inside value that then leave value.
  — [search summary of LuxAlgo/NexusFi/MetroTrade pages](https://www.luxalgo.com/library/concept/80-percent-rule/).
- Informal ES test, day session, starting 10 Apr 2008 (end date not stated):
  - 119 trading days, of which 76 opened outside the prior VA.
  - 41 met two half-hour periods inside the VA; 16 of those completely filled the prior VA (39%).
  - With two *consecutive* periods: 40 qualified and 16 filled (40%).
  - 3 filled via single prints.
  The author called it "far from an extensive sample size" — [teamlbr blog, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html).

**Open types (first 30–60 min of RTH)**
- **Open-drive (OD):** price moves directionally from the first prints and never trades back through the open. The open becomes a "do not revisit" reference while the premise holds.
- **Open-test-drive (OTD):** probes one side, finds no business, then drives the opposite way through the open. The rejected probe extreme is the stop reference.
- **Open-rejection-reverse (ORR):** an early directional run is rejected and trades back through the open, downgrading the day toward two-sided trade.
- **Open-auction (OA):** rotates on both sides of the open, usually inside prior value, and argues for a responsive, rotational session.
- Classification uses 1–5-minute charts in the first 30–60 min, giving the label ~30 minutes to confirm. Conviction opens tend to hold one side of session VWAP; auctions straddle it. The page states no probabilities, and its claims ("raise the odds," "often precede") are unsourced.
— [LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/).
- OTD vs. ORR distinction: OTD is a test of a key level "with volume drying up," whereas ORR meets "high opposing volume" — [NexusFi, Open type classification](https://nexusfi.com/a/concepts/open-type-classification) (forum-derived). A page giving per-open-type probabilities (e.g. ~75% ORR extension) does not cite a source — search summary; treat as unverified.
- There is "no reliable published win rate for the opening drive" — [therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive).

**Day-type-driven tactics**
- Rotational (normal / normal variation / neutral-center) days favor fading VA edges — [LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/). On trend days, "the trade is with the extension" — [therighttrader, Trend Day](https://therighttrader.com/learn/trading-strategies/trend-day) (via search summary).

**Practitioner variants**
- **Fabio Valentini "Trend Model"** (secondary description):
  - Context: market out of balance.
  - Mark LVNs on the reclaim leg.
  - Trigger: "big buy aggression hitting right at that LVN on the footprint" (order-flow confirmation).
  - Target: the POC inside the prior balance.
  — [TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy). A related playbook page: [TradeZella, Auction Market Playbook](https://www.tradezella.com/playbooks/auction-market-playbook). Neither is Valentini's own text.
- **Trader Dale:** setups are based on "identifying areas where there is high or low liquidity in the market using the volume profile." He claims to give "exact steps" so viewers have "a complete set of rules" — [Trader Dale webinar summary](https://videohighlight.com/v/FGAmaUCOlLM). His full rule sets are in *Volume Profile: The Insider's Guide to Trading* and *Order Flow Trading Setups* (paid). A 2026 post treats a failed/unfinished auction as a level the market tends to revisit — [Trader Dale blog, Feb 2026](https://trader-dale.blogspot.com/2026/02/order-flow-failed-auction-unfinished.html).
- **LVN uses** among practitioners: LVNs as targets, e.g. [faders substack](https://faders.substack.com/p/volume-profile), and LVNs as entry zones because "large players tend to skip price during discovery" — [search summary of substack practitioner posts](https://nemissa.substack.com/p/trading-with-the-volume-profile). Both are anecdotal.
- **Naked POC retests:** one unvetted "research summary" claims naked-POC retest frequency was "directionally" validated on the author's internal data, with no methodology shown — [portfoliowebsite companion doc](https://portfoliowebsite-3hz.pages.dev/research/futures-ta/companions/research-summary.html) (via search summary). Treat as anecdotal.

### Inferences
Candidate auto-triggerable rule specs below are my synthesis of the conventions above. They are not proven. Thresholds are flagged as free parameters to be visually reviewed, not optimized.

- **80% rule (RTH, prior-RTH VA)**
  - Precondition: RTH open is outside the prior VA.
  - Trigger: two 30-minute periods (consecutive by default, with a flag for non-consecutive) in which price trades inside the VA, with the 30-minute close inside.
  - Entry: at the close of the second period, or on a retest of the VA edge.
  - Target: the opposite VA edge, with the prior POC as a partial-profit level.
  - Stop: back outside the entry-side VA edge by X ticks, or beyond the session extreme.
  - Given the 39–40% full-fill result, consider the prior POC as the primary target.
- **Open-type classifier** (rules-based, first 30 min of RTH):
  - **OD:** price never trades back through the open by more than k ticks, and the 30-minute range is ≥ m × the median 30-minute range.
  - **OTD:** an early probe of ≥ p ticks against the eventual direction that fails, then price crosses the open and extends beyond the probe's opposite side.
  - **ORR:** an initial run of ≥ p ticks, then a cross back through the open with the rejection extreme intact.
  - **OA:** multiple crosses of the open with no extension beyond the opening-range bounds.
  - Context flags: open location tier (inside VA / outside VA but inside range / outside range) and VWAP side.
- **Look-above-and-fail / look-below-and-fail** (background knowledge, not verified this session): price auctions above a balance high (prior VAH, composite VAH, or range high), fails to get acceptance (for example, fewer than two 30-minute periods or less than X% of session volume beyond the level), and returns inside. The target is the balance POC, then the opposite edge. This is the mirror of the 80% rule applied to a multi-day composite.
- **IB breakout/extension:**
  - Trigger: trade beyond the IB high/low by ≥1 tick after the IB period ends.
  - Stronger when the IB is narrow relative to its 20-day median (my threshold proposal: <0.6×), which is typical of trend days per the narrow-IB description above.
  - Targets: 1.5× and 2× IB-width extensions. Sierra provides four configurable extension-percentage lines.
- **Poor high/low repair:** flag a prior session extreme as poor when two or more TPO periods share the high/low (Sierra's definition with Price Increments = 0 or 1). Treat the level as a magnet/target for the next sessions, and expire the flag once it is exceeded.
- **Single-print fill:** confirmed RTH single-print zones (Sierra's definition) are tracked as gaps in the auction. Practitioners treat them either as support/resistance (if the move that created them continues) or as targets to "fill." The direction is ambiguous, so use them as levels, not directional signals.
- **Naked POC magnet:** keep a list of prior session/week/month POCs not yet intersected (Sierra's "Until Future Intersection" with the Chart Bars method). Use the nearest naked POC in the direction of current initiative activity as a target, not an entry.
- **LVN/HVN:**
  - In balance (overlapping value, D-shapes), fade moves from HVN edges back to the HVN/POC.
  - In imbalance (value migrating), treat LVNs as rejection points on pullbacks (Valentini-style) and as zones expected to be traversed quickly when broken.
  - The two uses can conflict, so regime classification (balance vs. imbalance) must come first.

### Gaps
- Dalton's original 80%-rule statement and the conditions on p. 279 were not directly verified.
- Trader Dale's explicit entry/stop/target rules are in paid books and were not extracted.
- No primary Valentini source was found.
- Tom Alexander (*Practical Trading Applications of Market Profile*) and Tick Data-style references were not researched.
- No out-of-sample, published-methodology study of open types, IB breakouts, naked POC retests, single-print fills, or poor-high repair was found.

---

## 5. Volume-weighted relatives: VWAP, anchored VWAP (Brian Shannon), standard-deviation bands

### Takeaway
VWAP is the volume-weighted mean of price over a window, the "average" counterpart of the volume profile's "mode" (POC). It is academically established as an execution benchmark, not as a trading signal. Brian Shannon popularized *anchored* VWAP from events (swings, gaps, earnings). His specific rules were not retrievable from a primary source this session.

### Cited Findings
- VWAP = cumulative value traded ÷ cumulative volume traded over the window. Berkowitz, Logue & Noser (1988, *Journal of Finance*) formalized VWAP as a benchmark for total transaction costs on the NYSE — [Wikipedia, VWAP](https://en.wikipedia.org/wiki/Volume-weighted_average_price).
- Madhavan (2002): the theoretical justification for a VWAP benchmark comes from Berkowitz, Logue & Noser (a volume-weighted average of trades on both sides gives an unbiased estimate of prices faced). Madhavan also argues that "uncritical use of VWAP as a benchmark can promote trading behavior that actually increases costs and risk." VWAP benchmarks underestimate costs vs. pre-trade benchmarks when the stock is trending — [Madhavan, "VWAP Strategies," *Trading* (Spring 2002)](https://www.smallake.kr/wp-content/uploads/2014/07/TP_Spring_2002_Madhavan.pdf).
- There is academic literature on optimal VWAP execution, e.g. [arXiv 1509.08503, "Volume Weighted Average Price Optimal Execution"](https://arxiv.org/pdf/1509.08503).
- Brian Shannon (AlphaTrends) calls anchored VWAP the most valuable tool for his trading. He has described VWAP as the "ultimate sentiment indicator" — [AOL/Yahoo Finance interview](https://www.aol.com/news/heres-traders-vwap-ultimate-sentiment-151803452.html). He reportedly taught anchoring at events such as a swing or a gap in *Technical Analysis Using Multiple Timeframes* (2008) — search summary of [AlphaTrends](https://alphatrends.net/?p=669613), not directly verified.
- Common anchors in secondary sources: earnings days, swing highs/lows, gap opens, IPO days, and high-volume news candles. There is "no single correct anchor" — [TrendSpider, Anchored VWAP](https://trendspider.com/learning-center/anchored-vwap/) (via search summary). Specific numeric thresholds circulating online (e.g. "RVOL ≥1.5") are not from Shannon — search summary caveat.
- Session VWAP side is used as a cross-check on open types: conviction opens hold one side, auctions straddle — [LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/).

### Inferences
- **For futures:**
  - Anchor session VWAP at the RTH open, or at the ETH open (18:00 ET for CME Globex products; background knowledge). The two choices are different series.
  - Anchor weekly/monthly VWAP at the week/month open.
  - Anchor AVWAPs at the same swing/event anchors used for anchored volume profiles, so "fair value" (AVWAP) and "accepted price" (anchored POC) can be compared. AVWAP near the anchored POC suggests balance; AVWAP drifting away from the POC suggests migration.
- **Standard-deviation bands** (background knowledge, not verified this session): the usual definition is volume-weighted variance σ² = Σ vᵢ(pᵢ − VWAP)² / Σ vᵢ, with bands at VWAP ± kσ. With a volume-at-price histogram this is computed exactly from the rows, so VWAP/σ come "for free" from the same data structure as the profile.

### Gaps
- No primary Shannon text (*Maximum Trading Gains with Anchored VWAP*, 2023) was retrieved, and the AlphaTrends "Anchoring the VWAP" page returned 404. His explicit rules remain unverified.
- No authoritative source for VWAP standard-deviation band definitions was fetched.
- No evidence was found on whether VWAP/AVWAP levels are predictive in futures, as opposed to being execution benchmarks.

---

## 6. Algorithms for automation: building volume-at-price from tick vs. bar data, bucketing, incremental POC/VA, HVN/LVN detection, shape classification, naked POC, single prints, poor highs/lows

### Takeaway
With Rithmic tick prints (price, size), volume-at-price is exact: a hash map from tick-index to cumulative contracts, merged across sessions for composites. Bar-derived profiles spread each bar's volume evenly across its range, which smears peaks. Sierra Chart explicitly recommends 1-tick or 1-second records for accuracy. HVN/LVN detection is best done on a smoothed histogram (Gaussian/KDE) with prominence-filtered peak/valley finding. Every threshold is a free parameter that needs fixing a priori and visual review.

### Cited Findings
- **Bar vs. tick:**
  - Sierra Chart says chart data should contain 1-tick or 1-second records for good accuracy. With coarser records, the volume at a price is the "average volume per price based upon the price range of the data record," i.e. a uniform spread across the bar's high–low.
  - Ticks Per Volume Bar (row size) defaults to 2. "Set this to 1" for maximum detail. For daily+ charts it advises 4–10 to limit CPU.
  — [Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141).
- TradingView builds profiles from lower-timeframe bars of the same symbol, and the selection logic varies by indicator. On Renko it divides a candle's volume evenly across its N bricks. It does not document its intra-bar distribution rule. It warns that on Heikin Ashi, Renko, Kagi, P&F, and Range charts "the prices shown are not actual prices and the volume is distorted" — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/).
- **KDE + peak detection** (Python reference implementation):
  - Use SciPy `gaussian_kde` over the price distribution (the bandwidth `kde_factor` was "arbitrary").
  - Run `find_peaks` with minimum prominence `kdy.max() * 0.3`, where prominence is the vertical distance from a peak to its lowest contour line.
  - Measure peak widths at half relative height, with a maximum width of 20 pips (chosen with reference to ~14-pip hourly ATR).
  - Integrate the normalized PDF over each node's base to get its volume share (e.g. [0.63, 0.37]).
  - Data was OANDA EURUSD 1-minute *tick volume*. The author calls it "only a starting point," with no profitability claims.
  — [Minh, "How to Analyze Volume Profiles With Python" (Medium)](https://metaminh.medium.com/how-to-analyze-volume-profiles-with-python-3166bb10ff24).
- An open-source TradingView script defines HVN zone prominence as "the peak minus the higher of the troughs on either side," and ends each zone where volume has fallen partway toward that trough — [TradingView, HVN Zones](https://www.tradingview.com/script/6TPrx1GV-HVN-Zones/) (via search summary). Another applies Nadaraya-Watson kernel smoothing before finding levels — [TradingView NW Volume Profile](https://jp.tradingview.com/script/wqEZomb4-NW-Volume-Profile-Kernel-Smoothed-Dots3Red/).
- Sierra Chart's built-in peak/valley rule is a local max/min within ±Sensitivity rows on *total* volume ([docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)). Its POC/VA tie rules and expansion algorithm are given in Section 2 ([TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)).
- Sierra's single-print and poor-high/low definitions are algorithmic (confirmation by subsequent sub-periods, retraction on re-entry, equality within N increments) and can be ported directly — [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html).

### Inferences
This is engineering synthesis built from the docs above. Thresholds are proposals, not sourced.

1. **Ingest and bucketing.**
   - For each trade print (ts, price, size, [aggressor side if the feed provides it]), compute `i = round(price / tick_size)` as an integer key; never use float keys.
   - For a row size of k ticks, use `row = floor(i / k)`.
   - Store per-session histograms `H_s[i] += size`, split into RTH and ETH, and optionally into bid-aggressor and ask-aggressor volume.
   - Composites (week, month, N-day, anchored) = Σ H_s over the range, with partial-session slicing for anchors inside a session.
   - Persist per-session histograms so composites never require re-reading ticks.
2. **Bar-data fallback error.**
   - Uniform spreading across [L, H] blurs each bar's volume over its range. The error is roughly bounded by the bar range.
   - With 1-minute ES bars of a few ticks, POC and VA edges are typically off by ≤1–2 ticks. HVN/LVN shapes in fast markets are distorted more, because LVNs created by fast moves are exactly where bars are widest.
   - Use tick or 1-second data, per Sierra's recommendation. If bars are unavoidable, use the smallest available bars. Uniform distribution is the stated convention; alternatives such as weighting toward the close are unvalidated.
3. **POC (incremental).**
   - Maintain the running max as each print updates one row (O(1) per print).
   - Apply a deterministic tie rule and document it: Sierra uses nearest-to-profile-middle, then lower.
   - The developing POC is the POC series sampled at each bar close or each 30-minute period.
4. **Value Area.**
   - Pick one algorithm explicitly: Sierra one-row-with-carry to ≥70%, TradingView to ≤70%, or two-row CBOT/Method A.
   - Recomputing from scratch each update is O(rows). A session typically has a few hundred rows, so full recomputation at each bar close is fine; true incremental VA is unnecessary.
   - Record the developing VAH/VAL per 30-minute period, which the 80% rule and acceptance checks need.
5. **HVN/LVN.**
   - Smooth the 1-tick histogram with a Gaussian kernel, σ ≈ 2–4 ticks for a session profile, scaled up for weekly/composite. A proposal is σ ∝ the median 30-minute range or ATR of the profile's horizon.
   - Run `find_peaks` on the smoothed curve for HVNs, and `find_peaks` on its negative for LVNs.
   - Filter by prominence relative to the max (start from the 0.3× convention above). Filter LVNs by depth relative to the neighbouring peaks, e.g. an LVN valley ≤ 0.35× the smaller adjacent peak.
   - Use `peak_widths` at 0.5 relative height to get node zones.
   - Report each node's volume share by integrating the zone.
   - Fix parameters per instrument and horizon a priori, then visually review. Do not optimize them.
6. **Shape classifier** (my proposal, not sourced):
   - Let `r = (POC − Low) / (High − Low)` and compute volume skew over price.
   - **P:** r > 0.6 and the lower third holds < 20% of volume.
   - **b:** mirror of P.
   - **D:** 0.35 ≤ r ≤ 0.65 and roughly symmetric volume about the POC.
   - **Double distribution:** two prominent peaks with an LVN between holding < x% of the smaller peak's height, plus TPO single prints in the neck.
   - **Thin/trend:** max-row share of volume is low, range ≥ 2–3× the median daily range, and range ≥ 2× IB.
   - Classify "provisional" until late session, per the LuxAlgo caveat.
7. **Day type** (RTH, IB = first two 30-minute periods):
   - RE_up = max(0, High − IBH) and RE_dn = max(0, IBL − Low).
   - **Normal:** no RE, or RE < 1 tick.
   - **Normal variation:** one-sided RE ≤ ~1× IB width.
   - **Trend:** one-sided RE ≥ ~1–2× IB width, narrow IB (< 0.6× median), and close in the extreme 10–20% of range.
   - **Neutral:** RE on both sides. *Extreme* if the close is in the outer 20% of range, *center* otherwise.
   - **Double distribution:** two prominent nodes separated by singles.
   - The thresholds conflict across sources (Section 2), so fix them a priori.
8. **Naked POC tracker.**
   - On each profile close (session, week, month), push its POC with its dimension tag.
   - On each subsequent bar, mark a POC touched when bar.low ≤ POC ≤ bar.high (Sierra's "Chart Bars" method). Optionally require a 1-tick trade-through.
   - Decide whether ETH trades count, since this differs between RTH-only and 24-hour conventions.
   - Report the nearest naked POCs above and below, with age.
9. **Single prints** (TPO): port Sierra's definition. In each 30-minute sub-period, rows that extend beyond all prior TPOs become candidates. Confirm them if later sub-periods stay beyond, and retract them on re-entry. Persist unfilled singles across sessions as "single-print zones."
10. **Poor high/low and excess** (TPO):
    - **Poor:** the session high (low) is touched in two or more 30-minute periods within N ticks (N = 0–1), per Sierra.
    - **Excess:** a tail of two or more single-TPO rows at the extreme (background convention).
    - Volume analog: a poor high has the top 1–2 ticks holding a meaningful share of volume (e.g. ≥ the profile's median row); excess is a run of ≥3 rows below the 10th percentile of row volume at the extreme.
11. **Acceptance metric** (needed by the 80% rule, look-above-and-fail, and balance breakout): count 30-minute periods trading beyond a level, and the fraction of session volume and time beyond it. Define "accepted" as ≥2 periods and ≥ y% of volume (y is a free parameter).

### Gaps
- Rithmic's documentation was not consulted to confirm whether trade messages carry an aggressor-side flag or are aggregated at the exchange-match level. Tradovate tick-data specifics were also not checked.
- NinjaTrader Order Flow Volume Profile, ATAS, and Quantower docs, and their HVN/LVN/peak definitions, were not fetched.
- No published quantification was found of the POC/VA error introduced by bar-based distribution in futures.
- No open-source library implementing CBOT-style Market Profile end to end (IB, singles, day types) was verified this session.

---

## 7. Evidence base: academic and microstructure support for volume-at-price, value areas, VWAP, price clustering, and HVN/LVN behaviour

### Takeaway
There is solid peer-reviewed evidence that technical support/resistance levels coincide with limit-order-book depth peaks (Kavajecz & Odders-White 2004), that stop-loss and take-profit orders cluster around round numbers (Osler 2003), and that some intraday S/R levels show non-random bounce persistence that decays (Chung & Bellotti 2021). VWAP is well established as an execution benchmark. No peer-reviewed test of Market Profile value areas, the 80% rule, or HVN/LVN behaviour in futures was found. The only test found of a VA rule (the 80% rule, ES 2008) contradicts its name. Overall evidence quality for the specific setups is low and anecdotal. The microstructure explanations are plausible but unproven for these setups specifically.

### Cited Findings
- **Kavajecz & Odders-White (2004, *Review of Financial Studies* 17(4): 1043–1071):** support and resistance levels coincide with peaks in depth on the limit order book. Moving-average forecasts reveal information about where depth sits relative to price. Technical analysis may have value even in efficient markets because it locates liquidity provision — [IDEAS/RePEc](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html). Only the abstract was seen. A Taiwan Stock Exchange follow-up reports S/R related to liquidity peaks on the book — [sinoss.net PDF (Chinese, English abstract)](https://www.sinoss.net/uploadfile/2013/0813/20130813093423563.pdf).
- **Osler (2003, *Journal of Finance* 58(5): 1791–1819):**
  - Data: ~9,700 stop-loss and take-profit orders at a large FX dealing bank, 1 Sep 1999 – 11 Apr 2000, covering USD/JPY, USD/GBP, and EUR/USD.
  - Take-profit orders cluster strongly at round numbers, which explains reversals at S/R.
  - Stop-loss orders cluster just beyond round numbers, which explains faster trends after S/R breaks.
  — [IDEAS/RePEc](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [NY Fed Staff Report 125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.html).
- **Chung & Bellotti (2021, arXiv 2101.07410):**
  - Uses a heuristic algorithm to discover intraday S/R levels.
  - Levels bounced off several times are more likely to bounce again, and bounce probability decays over time.
  - The levels are not explained by simple AR(1) processes.
  - The paper notes "no clear mathematical definition" of S/R exists in the literature, and cites stacked limit orders (Chiao & Wang 2009) as one explanation.
  — [arXiv 2101.07410](https://arxiv.org/abs/2101.07410v1). Only the abstract and excerpts were seen.
- **Kyle (1985, *Econometrica*), "Continuous Auctions and Insider Trading":** λ is the slope of price on signed net order flow, a measure of price impact inversely related to market depth/liquidity — [Econometric Society](https://econometricsociety.org/publications/econometrica/1985/11/01/continuous-auctions-and-insider-trading); [QuantT explainer](https://www.quantt.co.uk/resources/kyle-model-and-kyles-lambda). Later work finds λ is stochastic and path-dependent — search summary of [arXiv 2206.08117](https://ar5iv.labs.arxiv.org/html/2206.08117).
- **Round-number clustering** in institutional equity executions (Abel Noser data), with higher costs on round-number trades — [PolyU thesis](https://theses.lib.polyu.edu.hk/bitstream/200/10670/3/5110.pdf). This is equities, not futures.
- **VWAP:** Berkowitz, Logue & Noser (1988) establish it as a cost benchmark; Madhavan (2002) critiques its uncritical use — [Wikipedia](https://en.wikipedia.org/wiki/Volume-weighted_average_price); [Madhavan 2002](https://www.smallake.kr/wp-content/uploads/2014/07/TP_Spring_2002_Madhavan.pdf).
- **Market Profile / value areas:**
  - A search for peer-reviewed tests found none. Practitioner sources present no out-of-sample testing — [search summary incl. MetroTrade, NexusFi](https://nexusfi.com/a/concepts/80-percent-rule).
  - The only test located is the informal ES 2008 test showing a 39–40% full-fill rate for the 80% rule on 41 triggers — [teamlbr blog](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html).
  - There is "no reliable published success rate for value-area trades" (search summary) and "no reliable published win rate for the opening drive" — [therighttrader](https://therighttrader.com/learn/trading-strategies/opening-drive).
- TradingView itself describes volume profile as reactive, showing past activity rather than forecasting — [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/).

### Inferences
- **Why HVNs might stall price** (plausible mechanism, unproven for HVNs specifically):
  - An HVN is where both sides transacted heavily, i.e. where liquidity providers were willing to absorb flow. In inventory models and Kyle-style terms, the price impact per contract was low there.
  - If resting liquidity tends to re-form at previously accepted prices, which is consistent with Kavajecz & Odders-White's S/R-depth link, returning price meets depth and slows.
- **Why LVNs might be traversed fast or reject:**
  - An LVN records past high price impact (high λ), where order-flow imbalance moved price with little volume.
  - Whether the *future* λ at that price is also high is an assumption. Liquidity is not stationary, so this is a hypothesis, not an established fact.
  - Osler's stop-cluster finding offers a separate mechanism for fast moves *through* levels: clustered stops just beyond prior extremes and round numbers.
- **Mechanical confound:** volume at price partly reflects time spent at price. A profile is largely a record of where price was. HVN "support" is therefore partly mean reversion in any range-bound series, and the Chung & Bellotti result that bounces decay over time cautions against treating old HVNs as permanent.
- **Implication for a no-backtest workflow:**
  - Treat profile levels as *locations* where reactions are more likely (supported indirectly by the S/R-depth and order-clustering literature).
  - Treat the named setups' win rates (80%, etc.) as marketing-grade claims.
  - Prefer setups with a structural stop (beyond a rejected extreme, LVN, or VA edge) and conservative first targets (prior POC rather than the far VA edge).

### Gaps
- No peer-reviewed study of Market Profile, volume profile, POC, VA, naked POC, or HVN/LVN behaviour in futures (ES/NQ/CL) was found.
- The full texts of Kavajecz & Odders-White and Chung & Bellotti were not read, so their sample details and effect sizes are unverified.
- Inventory models (Ho & Stoll 1981; Amihud & Mendelson) were not fetched this session, so the inventory-model explanation is background knowledge.
- A 2026 CQG primer on Market Profile Value Areas exists but was not read — [CQG](https://news.cqg.com/workspaces/2026/06/cqg-primer-market-profile-value-areas-mpva).
- No futures-specific round-number clustering study was found.
