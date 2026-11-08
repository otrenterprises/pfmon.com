# Volume profiles map value, not edges

Volume profile and its parent framework, auction market theory, are best used as a **deterministic map of where contracts changed hands**. That map shows the locations where reactions are more likely. It is not a catalogue of proven setups. The framework comes from Peter Steidlmayer's work at the CBOT in the 1980s and James Dalton's *Mind Over Markets* (1990). It describes each session as an auction that rotates between balance and imbalance. Its components (POC, 70% value area, HVN/LVN, single prints, poor highs and lows, naked POCs, initial balance) can be computed exactly from Rithmic tick prints for every dimension a futures trader needs: RTH, ETH, overnight, week, month, multi-week composite and swing-anchored. Platform definitions conflict, though. Sierra Chart, TradingView and the CBOT-style "Method A" draw value areas a tick or more apart on the same data. The engine must therefore hard-code one method, single-row expansion from the POC until at least 70% (Sierra-Chart-style), and the review charts must match it. Of the eleven named setups reviewed here, only the 80% rule has ever been counted in public. That informal ES test found a complete fill in **16 of 41 triggers (39–40%)**, not 80%. No peer-reviewed study tests value areas, the 80% rule or HVN/LVN behaviour in futures. The strongest evidence is indirect: support and resistance levels coincide with order-book depth (Kavajecz & Odders-White 2004), and stop orders cluster just beyond salient levels (Osler 2003). In practice, use higher-dimension profiles for CONTEXT and LOCATION, clock-time auction tests for SETUP and volume bars for TRIGGER. Take conservative first targets (prior POC before the far value-area edge), and treat every threshold as a pre-committed value to review on charts, never to tune.

*Reading notes.* This is write-up 03 of the series indexed in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md). It covers the volume-profile dimension on its own. How profile levels combine with swings, price action and Fibonacci grids is left to [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md). The numbered VP-xx proposals are in [09 Proposals volume profile](09%20Proposals%20volume%20profile.md). Names follow the series conventions:

- PROFILE(P), with P ∈ {RTH, ETH, ON, WEEK, MONTH, COMP(n weeks), ANCH(A→B)}
- the layer roles CONTEXT, LOCATION, SETUP, TRIGGER and MANAGEMENT
- volume bars VB-A, VB-B and VB-C
- time bars W1 through M1
- the LEVELS names (PDH/PDL/PDC, ONH/ONL, PWH/PWL/PWC, WO/DO, IBH/IBL, ORH/ORL)

Two labels mark unsourced material. **Design proposal** marks this report's own engineering synthesis, not a sourced rule. **Background** marks standard Market Profile lore that the research notes could not check against Steidlmayer's or Dalton's own books. Every numeric default is a pre-committed starting value drawn from the notes. None has been optimized.

## Auction market theory reads every session as a two-sided auction

Market Profile charts were developed in the late 1980s by **Peter Steidlmayer at the Chicago Board of Trade** ([TradingView TPO help](https://www.tradingview.com/support/solutions/43000713306-time-price-opportunity-tpo-indicator/)). One practitioner site places him at the CME, which is an error in that source. Dalton's *Mind Over Markets* (1990) turned the idea into a trader's vocabulary and codified the opening classifications. Dalton argued that the open is uniquely informative because overnight inventory, news and institutional participation collide early ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)). His auction language describes "a drive, a test then a drive, a rejection that reverses, and a two-sided auction" ([therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive)).

The core model is simple. A market advertises price to find the other side. When both sides transact repeatedly inside a range, that range becomes accepted value, and the market is **in balance**. When one side overwhelms the other, price moves directionally and searches for new value, and the market is **in imbalance**. Modern practitioner playbooks such as Fabio Valentini's still frame trading this way, as continuation when the market is out of balance and "searching for new value" ([TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy)).

Three further terms carry most of the theory's explanatory weight (Background):

- **Initiative activity** is buying above value or selling below it. Participants accept new prices.
- **Responsive activity** is buying below value or selling above it. Participants fade price back toward value.
- **The other-timeframe (OTF) participant** is the larger, longer-horizon player. Their entry produces range extension, trend days and value migration. Day-timeframe participants mostly supply two-sided liquidity inside the session.

The notes could not retrieve Steidlmayer's *Markets and Market Logic*, the CBOT handbook or Dalton's books, so these definitions are standard lore, not verified quotations.

For automation, one consequence matters more than any definition. Every rule in this framework is phrased as **acceptance** (time and volume building at a price) versus **rejection** (a fast exit on little volume). None of the sources give numerical thresholds for either. An engine therefore has to declare its own acceptance metric once (Section 6) and apply it everywhere.

The framework comes in two flavours that are easy to confuse. A **TPO profile** counts time at price: one letter per 30-minute period that traded at a row. A **volume profile** counts contracts at price. Sierra Chart keeps the two separate. Its TPO POC is "the price level where most of the trading is occurring timewise", it computes a distinct Volume POC, and it can draw the value area from volume instead of TPOs ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). The 80% rule "works with either a TPO or volume profile, though the two can differ slightly" ([LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/)). The table below assigns each construct to its natural unit (Design proposal, following the notes' synthesis).

| Construct | Natural unit | Reason | Engine source |
|---|---|---|---|
| IB, M30 acceptance periods, 80% rule, open types | TPO / clock time | Defined in time-period terms | M30, M5, M1 clock bars built from ticks |
| Single prints, poor highs/lows, excess | TPO | Sierra defines them in sub-period terms | M30 TPO rows |
| POC, VAH/VAL, HVN/LVN, nPOC, composites, anchored | Volume | Liquidity levels; exact from ticks; robust in thin hours | 1-tick volume histogram |
| TPO POC vs. volume POC divergence | Both | Cheap diagnostic of thin, drifting trade | Both |

The thin-hours point decides the RTH/ETH question. Globex spends many overnight hours at prices where few contracts trade. A TPO profile that includes ETH therefore **overweights overnight drift** relative to where size actually changed hands. A volume profile does not. For ES, NQ and CL with Rithmic ticks, volume-at-price is exact, while TPO is derived from bar time. That makes volume the default weighting for every PROFILE(P) in this series. TPO logic is kept only where a rule is defined in periods.

## Platform definitions disagree, so one algorithm must rule

The most precise definitions available come from platform documentation, not from the books. Platforms disagree with each other in ways that move levels by a tick or more. A trader who reviews an automated engine's levels on a chart must know exactly which definition each platform uses.

### POC and the value area: three algorithms, one tick apart

The **point of control (POC)** is the row with the most volume (or TPOs). Sierra Chart breaks ties toward the row closest to the middle of the profile. If two tied rows are equidistant from the middle, the lower one wins. Its Volume POC uses the same rule ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). TradingView simply defines the POC as "the price level for the time period with the highest traded volume" ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

The **value area (VA)** is the band around the POC that contains 70% of activity, bounded by VAH and VAL. Three algorithms are documented:

| Method | Expansion step | Stopping rule | Tie handling | Consequence |
|---|---|---|---|---|
| Sierra Chart (default) | One row: compare the next row above with the next row below, add the larger, carry the other forward | Stop when the included total **reaches or exceeds** 70% | Equal rows: include both | VA holds ≥70% |
| TradingView volume profile | One row: add the larger row **if it fits** within the remaining target | Stop once the next row **would exceed** 70% | Closer to POC wins; if equidistant, the row above | VA holds ≤70%, can be one row narrower |
| Linnsoft "Method A" (eSignal-like; "CBOT style" by convention) | Two rows: compare the two prices above with the two below, add the larger pair | Until the target is met or exceeded | Not stated | VA ≥70%, coarser steps |
| Sierra "Count Two Levels at a Time" option | Two rows | Mechanics not in the portion read | — | — |

Sources: [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html), [TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/), [Linnsoft TPO Profile Charts](https://www.linnsoft.com/tpo). A 2013 Sierra support thread noted that Sierra's formula differed from Method A and asked for Method A as an option ([Sierra Chart Support Board 2713](https://www.sierrachart.com/SupportBoard.php?ThreadID=2713)). The author of the only public 80%-rule test also listed vendor disagreement on value-area boundaries as a limitation of his own results ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)).

The series therefore commits to a **single method**, used for every P:

- **Weighting:** volume, not TPOs.
- **Row size:** 1-tick rows.
- **POC tie rule:** nearest to the profile middle, then the lower row.
- **VA:** single-row expansion from the POC with carry-forward. Equal rows are both included. Stop as soon as the included volume is ≥70%.

This is Sierra Chart's default made explicit. It is the most precisely documented of the three. It is conservative, because the band always contains at least 70%. It is fully deterministic. The cost is known in advance: a TradingView chart can show a value area one row narrower than the engine's, and that is expected, not a bug (see the verification section).

The **developing POC (dPOC)** and developing value area are the same calculations repeated as the session unfolds (Background). They migrate. Any setup that uses them must log the value it saw at trigger time, because the end-of-day POC visible later will differ ([07 Automation architecture](07%20Automation%20architecture.md)).

### Nodes: HVN and LVN have no canonical threshold

A **high-volume node (HVN)** is a local peak in the volume histogram, where both sides traded heavily. A **low-volume node (LVN)** is "a local trough where very little volume ever traded" ([LuxAlgo, HVN/LVN detector](https://www.luxalgo.com/library/indicator/CHxGnqBD-volume-profile-with-hvn-lvn-detector/)). No source fixes how deep a trough must be to count, so every implementation embeds its own threshold:

- **Sierra Chart's "Peaks and Valleys"** is a raw local-extremum rule. "Sensitivity" sets how many rows are searched above and below; for example, 10 with 1-tick rows searches ±10 ticks. Peaks and valleys "are always determined from the Total Volume at each price level" ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)).
- **Open-source TradingView scripts** smooth first. One defines an HVN as "a secondary local peak in the smoothed distribution" after Nadaraya-Watson kernel smoothing ([TradingView NW Volume Profile](https://jp.tradingview.com/script/wqEZomb4-NW-Volume-Profile-Kernel-Smoothed-Dots3Red/)). Another measures HVN prominence as "the peak minus the higher of the troughs on either side" ([TradingView HVN Zones](https://www.tradingview.com/script/6TPrx1GV-HVN-Zones/)).

The series convention follows the smoothing camp: HVN/LVN are **peaks and valleys of a smoothed histogram that pass a prominence threshold**. The algorithm and its starting values are in Section 6. The convention will not match Sierra's raw Peaks and Valleys exactly, so node comparisons against Sierra are qualitative.

### Auction-completion marks: single prints, poor extremes, excess, naked POC

Several components describe whether an auction finished its business at a price. Sierra Chart defines most of them algorithmically, so they can be ported directly ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)):

- **Single print.** "The first TPO within a sub-period that exceeds the high or low of all of the prior TPOs." It is confirmed only if the following sub-period (or every later sub-period, in a second mode) stays beyond that price. It is never identified in the first or last sub-period. It is retracted if a later sub-period trades back into it.
- **Poor high or low.** A TPO extreme that *equals* an earlier one. "Price Increments" = 0 counts only exact matches; 1 or more allows that many increments of slack. The comparison can run within the same profile, against the prior profile, or both.
- **Excess** (Background). A tail of two or more single TPOs at a session extreme. It marks a sharp rejection and a completed auction. A poor high or low is the absence of excess: a flat, multi-period extreme that signals an unfinished auction, which tends to be revisited. Trader Dale's recent material treats a failed or unfinished auction as a level the market tends to revisit ([Trader Dale blog, Feb 2026](https://trader-dale.blogspot.com/2026/02/order-flow-failed-auction-unfinished.html)).
- **Naked POC (nPOC)** (Background). A prior profile's POC that has not been traded through since that profile closed. Sierra Chart implements it without using the name. "Extend Point of Control … Until Future Intersection" extends the POC line until a later volume profile, or a later chart bar ("Future Intersection Method"), covers that price ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)).

Single prints, poor extremes and excess are all defined in TPO (time) terms. Volume-based versions, such as "a run of rows whose volume is below some percentile," are **practitioner inventions with no standard**. The engine therefore computes the canonical TPO versions on clock-time M30 periods and treats volume analogs as secondary diagnostics.

### Initial balance, day types and open types

The **initial balance (IB)** is a number of sub-periods from the profile start. Two 30-minute sub-periods make the conventional one-hour IB, giving IBH and IBL "without any extensions". Sierra reports extensions as IE%, IEH and IEL, with up to four extension-percentage lines ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). The series convention is IBH/IBL = the first 60 minutes of RTH. **Range extension** is any trade beyond the IB (Background).

**Profile shapes** summarize where volume concentrated ([LuxAlgo, Profile Shape Taxonomy](https://www.luxalgo.com/library/concept/profile-shape-taxonomy/)):

- **D-shape:** a symmetric middle bulge, meaning balanced and rotational.
- **P-shape:** an upper bulge with a thin lower tail. It reads as short covering in a downtrend, or as continuation finding value higher.
- **b-shape:** a lower bulge with a thin upper tail, meaning long liquidation stabilizing low.
- **Double distribution:** two fat regions separated by a thin neck of single prints.

Early P and b shapes often become D shapes, so the taxonomy says to classify tentatively before midday and firmly late. It gives no numeric thresholds.

**Day types** are where the sources disagree most:

| Day type | Definition | Where sources conflict |
|---|---|---|
| Normal | Wide IB contains the whole session; two-sided rotation | — |
| Normal variation | Extends the IB on one side | "Roughly doubling it" vs. "by around the width of the initial balance" |
| Trend | Narrow IB, persistent one-way extension, close near the extreme, little rotation | Mechanical multiples "vary between authors" |
| Neutral (extreme / center) | Extension on both sides; extreme closes near one end, center mid-range ("unresolved balance") | — |
| Double distribution | Two distributions separated by single prints; Dalton treats it as a trend-type day | — |
| Non-trend | Named but not defined in the source | — |

Sources: [LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/); [therighttrader, Double Distribution Day](https://therighttrader.com/learn/trading-strategies/double-distribution-day). Day-type frequencies also conflict. One blog cites ~50% normal variation, ~10% double distribution and under 5% trend days ([bullbear-university](https://bullbear-university.blogspot.com/2013/09/anticipating-trading-days-market.html)). A NexusFi post on ES reports 54% normal variation, ~16% trend and 25% neutral ([NexusFi thread](https://nexusfi.com/showthread.php?p=823821)). Neither states a methodology. Both agree on one thing: **the IB is broken on most days**, so a bare IB break is common, not a rare event.

**Open types** classify the first 30–60 minutes of RTH, read on 1–5-minute charts ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)):

| Open type | Behaviour | Reference it creates |
|---|---|---|
| Open-drive (OD) | Moves directionally from the first prints and never trades back through the open | The open as a "do not revisit" level |
| Open-test-drive (OTD) | Probes one side, finds no business, then drives the other way through the open | The rejected probe extreme as the stop reference |
| Open-rejection-reverse (ORR) | An early directional run is rejected and trades back through the open | Downgrades the day toward two-sided trade |
| Open-auction (OA) | Rotates on both sides of the open, usually inside prior value | Argues for a responsive, rotational session |

Two refinements come from other sources. OTD tests a level "with volume drying up", while ORR meets "high opposing volume" ([NexusFi, Open type classification](https://nexusfi.com/a/concepts/open-type-classification)). Conviction opens tend to hold one side of session VWAP, while auctions straddle it ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)).

The same source grades **open location** in three tiers:

1. **Inside prior value:** overnight agreement, favouring rotation.
2. **Outside value but inside the prior range.**
3. **Outside the prior range.** An out-of-range open followed by a drive is "the strongest continuation read". An out-of-range open that stalls sets up a snap-back toward old value.

## Seven profile dimensions stack from the session to the anchored leg

Every dimension the series needs is supported by at least one platform. Sierra Chart's Volume by Price study builds profiles by:

- bar count;
- fixed time (seconds through years, with weeks, months and years starting on calendar boundaries);
- session or trading day;
- a start date-time to the end or to an end date-time;
- visible bars, all bars, or a specified volume;
- "Based on TPO Chart" and "Based on Zig Zag Study".

Fixed-time profiles are exact only when the chart's bar period evenly divides the profile length ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)). TradingView offers six profile types (auto anchored, fixed range, periodic, session, session HD and visible range), all computed from lower-timeframe data of the same symbol ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

For CME products, the engine defines seven profiles. The session windows follow the series convention: trade date rolls at 17:00 CT, maintenance runs 16:00–17:00 CT, and the equity-index RTH is 08:30–15:00 CT, matching the 09:30–16:00 ET cash session (see [07 Automation architecture](07%20Automation%20architecture.md)). These times are Background, not verified against CME in the notes. Some platform templates end equity-index RTH at 15:15 CT, so whichever window the engine uses must match the chart template exactly. CL's conventional "pit-session" RTH is roughly 09:00–14:30 ET (Background) and needs the same confirmation.

| P | Window | Built from | Scalping role | Swing role | Outputs used |
|---|---|---|---|---|---|
| RTH | 08:30–15:00 CT (equity index) | RTH ticks | SETUP and LOCATION: IB, open type, 80% rule, day type, prior-day VA | SETUP: prior-day value relationship | POC, VAH/VAL, IBH/IBL, singles, poor H/L |
| ON | 17:00 CT → RTH open, same trade date | Pre-RTH ETH ticks | CONTEXT for the open: overnight inventory, ONH/ONL, ON POC | — | ONH/ONL, ON POC/VA |
| ETH | Full trade date, 17:00 CT → 16:00 CT | All ticks | LOCATION: liquidity levels that include overnight trade | LOCATION | POC, HVN/LVN |
| WEEK | Sunday 17:00 CT → Friday 16:00 CT | Sum of ETH daily histograms | CONTEXT: weekly value migration | LOCATION and SETUP | POC, VA, nPOC, HVN/LVN |
| MONTH | Calendar month | Sum of daily histograms | CONTEXT: distant targets | CONTEXT and LOCATION | POC, VA, nPOC |
| COMP(n) | n weeks, or from the start of the current balance | Sum of histograms | CONTEXT: balance edges | LOCATION: balance edges, HVN/LVN | VAH/VAL, HVN/LVN, POC |
| ANCH(A→B) | Between two confirmed swings of SWING(L) | Per-minute histograms sliced at A and B | LOCATION: LVNs on the impulse leg | LOCATION | Anchored POC, HVN/LVN |

Sierra Chart mirrors the RTH/ETH split with its "Use Separate Profile for Evening Session" option. That option requires Evening Session Times and works only with 1-day fixed-time profiles. A second option, "Exclude Evening Session Profiles Except for Last Day", strips evening data from the calculation. In TPO charts, "Always Start Letters at Primary Session Start Time" keeps letter A at the RTH open ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141); [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). The rule of thumb is that IB, open-type and 80%-rule logic is defined on **RTH only**, and ETH volume belongs in the profile only if you trade ETH. Note that the 15:00–16:00 CT post-close hour belongs to the ETH profile but to neither RTH nor ON (Design proposal).

### Value migration is the multi-timeframe read

Comparing consecutive value areas is the core cross-period signal ([LuxAlgo, Value Migration](https://www.luxalgo.com/library/concept/value-migration/)). A POC that migrates along with the value area strengthens the read. A POC still anchored in the old area argues that the migration is tentative. In Dalton-derived usage, an "outside day" has a value area that overlaps the prior day's at both extremes ([NexusFi, Market Profile TPO charts](https://nexusfi.com/a/strategies/market-profile-tpo-charts)). The "migration" label itself is mostly later writers' terminology.

| Current VA vs. prior VA (same P) | Read | Typical tactic implication |
|---|---|---|
| Entirely higher | Bullish migration, OTF buying | Favour responsive buys at the new VAL; avoid fading highs |
| Entirely lower | Bearish migration, OTF selling | Mirror |
| Overlapping, shifted higher or lower | Tentative migration | Require acceptance before trusting direction |
| Inside / unchanged | Balance | Fade the edges, target the POC |
| Outside (engulfing) | Value expansion, two-sided volatility | Stand aside until a new edge is accepted |

### The stack, layer by layer

Practitioner consensus, untested, sorts the dimensions into a hierarchy:

- **Higher-dimension HVNs and VA edges** form the map: where price is expected to stall, which makes them targets.
- **Higher-dimension LVNs** mark where price is expected to travel fast or reject, which makes them entries and stops.
- **Lower-dimension structure** supplies the trigger: an IB break, an open type, acceptance or rejection over M30 periods.
- A trade aligned with value migration on two or more dimensions (for example, daily and weekly value both higher) is "with the OTF."

The table maps that hierarchy onto the series' layer roles for both trading styles (Design proposal):

| Layer | Scalping stack | Swing stack |
|---|---|---|
| CONTEXT | WEEK value migration; prior RTH vs. prior-prior RTH VA relationship; D1 bar | W1 bar; MONTH and COMP(n) value migration |
| LOCATION | Prior RTH VAH/VAL/POC, ON POC, ONH/ONL, nearest nPOCs, ETH HVN/LVN | WEEK/COMP HVN/LVN and VA edges, PWH/PWL, weekly/monthly nPOCs, ANCH LVNs |
| SETUP | Open type, IB status, 80% rule state on M30 | Daily value relationship; look-above-and-fail at a COMP edge |
| TRIGGER | VB-C bars: delta and range-per-volume at the level | VB-A or H1 close accepting or rejecting the level |
| MANAGEMENT | Stop beyond the rejected extreme or LVN; first target the prior POC or dPOC | Stop beyond the balance edge or LVN; first target the COMP POC, then the opposite edge |

Trader Dale publishes swing-trading material that applies volume profile on higher timeframes in this spirit ([Trader Dale blog, May 2026](https://trader-dale.blogspot.com/2026/05/swing-trading-with-volume-profile.html)). His explicit rules sit in paid books and were not extracted.

### Nested profiles are not independent evidence

A weekly profile is literally the sum of its daily histograms when the row size is the same. That makes composites cheap and exact to build. It also creates a counting trap. When the current week's POC sits at the same price as one of its own sessions' POCs, the coincidence is **partly mechanical**, because that session's volume is part of the week. The series confluence rule treats volume-at-price as the dimension that is independent of swing and Fibonacci levels. Within the profile dimension, overlapping levels from nested windows should count as **one** LOCATION, not two (Design proposal).

Contract rolls add a practical hazard. Composites must be built from the **front month actually traded**, or price levels from the old contract will be offset by the roll spread. The architecture notes recommend shifting pre-roll profiles by the logged spread or flagging them "pre-roll" with reduced weight ([07 Automation architecture](07%20Automation%20architecture.md)).

## Eleven named setups, and only one has ever been counted

The setups below are taught with varying precision and are almost entirely untested. The table summarizes them with the series' evidence grades:

- **A:** peer-reviewed support for the underlying mechanism.
- **B:** platform/practitioner consensus with indirect empirical support.
- **C:** anecdotal or vendor-only.
- **D:** tested and not supported as a standalone signal.

The rule specs assemble the documented conventions into automatable form. Where the notes give a value, it is used as a pre-committed default. Where they give none, the parameter is named and marked as a placeholder. Concrete, ID'd versions belong in [09 Proposals volume profile](09%20Proposals%20volume%20profile.md).

| Setup | Session | Regime | LOCATION | TRIGGER | First target | Published stats | Grade |
|---|---|---|---|---|---|---|---|
| 80% rule | RTH | Open outside prior VA | Prior RTH VA edge | Two M30 periods inside VA with closes inside | Prior POC, then opposite VA edge | 16 of 41 full fills (39%); 40% with consecutive periods | **D** as advertised; C for the POC-target variant |
| VA rejection / acceptance | RTH | Balance → fade; acceptance → continue | Prior VAH/VAL | Failed vs. accepted M30 periods beyond the edge | POC (fade) / next reference (continuation) | None | C |
| Open types | RTH first 30–60 min | Any | Open, prior VA, prior range | Rules-based OD/OTD/ORR/OA classifier | Depends on type | "No reliable published win rate" | C |
| nPOC magnet | ETH or RTH | Initiative activity toward it | Nearest nPOC | Used as target, not entry | The nPOC | One unvetted "directional" claim | C |
| LVN rejection / breakout | Any | Imbalance | LVN zone | Rejection or traversal on VB bars | Next HVN / POC | None | C |
| HVN reversion | Any | Balance | HVN edge | Failed push away from HVN | HVN center / POC | None | C (location itself B) |
| Look-above-and-fail / balance breakout | RTH or ETH | Multi-day balance | COMP VAH/VAL or range edge | Failed vs. accepted auction beyond the edge | Balance POC, then opposite edge | None | C |
| Poor high/low repair | RTH | Any | Prior poor extreme | Used as target | The poor extreme | None | C |
| IB extension | RTH | Narrow IB favoured | IBH/IBL | Trade beyond IB after 60 min | 1.5× and 2× IB width | Day-type frequencies conflict | C |
| Single-print fills | RTH | Ambiguous | Confirmed single-print zone | Used as level, not signal | Zone far edge | 3 of 16 80%-rule fills came via singles | C |
| Valentini trend model | Any | Out of balance | LVN on the reclaim leg | Aggressive buying/selling at the LVN (footprint) | POC of the target balance | None | C |

### The 80% rule: the only setup with a count, and the count disappoints

**Rules.** Price opens outside the prior session's value area, re-enters it and holds inside. The usual confirmation is two 30-minute TPO brackets of acceptance, and the target is the opposite VA edge ([MetroTrade](https://www.metrotrade.com/what-is-the-80-rule-in-futures-trading/); [LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/)).

**Attribution and confirmation variants.** Some sources trace the first published statement to Dalton Capital Management's *Profile Reports* (1987–1991). Others tie the two-period convention to Steidlmayer and the CBOT manual ([NexusFi, 80% Rule](https://nexusfi.com/a/concepts/80-percent-rule)). Dalton's own wording on p. 279 of *Mind Over Markets* reportedly "does not state the half-hour periods must be consecutive" ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). Confirmation criteria vary between sources:

- price need not close each period inside;
- two consecutive 30-minute closes inside are required;
- the entire 30-minute bar must trade inside;
- the rule also applies to opens inside value that then leave value.

Source for the variants: [LuxAlgo, 80% Rule](https://www.luxalgo.com/library/concept/80-percent-rule/).

**The count.** The only public test ran on ES day sessions from 10 April 2008 ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). Of **119 trading days**, 76 opened outside the prior VA. Of those, 41 met two half-hour periods inside the VA, and **16 of the 41 (39%) filled the prior VA completely**. Requiring consecutive periods gave 40 triggers and the same 16 fills (40%). Three of the fills came via single prints. The author called it "far from an extensive sample size," and vendor VA differences add noise. The test is informal, but it is the only count found, and it contradicts the rule's name by a factor of two.

It also says something useful about scale. At about one trigger every three sessions, a forward sample of 40 triggers takes roughly six months per instrument. The test did not measure partial fills, so how often the prior POC is reached is unknown.

**Automatable spec (Design proposal).**

| Step | Rule |
|---|---|
| Profile | PROFILE(RTH) of the prior session, final values |
| Precondition | RTH open outside [VAL, VAH] |
| Trigger | Two M30 periods (consecutive by default; non-consecutive as a logged flag) that trade inside the VA and close inside |
| Entry | Close of the second qualifying period, or a retest of the entry-side VA edge |
| Stop | Beyond the entry-side VA edge by a buffer, or beyond the session extreme |
| Targets | **Prior POC first**, then the opposite VA edge as a runner |
| Invalidation | An M30 close back outside the entry-side edge before entry |

Grade **D** as advertised, since the only test does not support "80%". The POC-target variant is **C**, because it is untested either way.

### Value-area rejection and acceptance

The general form of the 80% rule applies at any VA edge. Rotational sessions (normal, normal variation and neutral-center) favour **fading value-area edges** ([LuxAlgo, Day-type Taxonomy](https://www.luxalgo.com/library/concept/day-type-taxonomy/)). On trend days, "the trade is with the extension" ([therighttrader, Trend Day](https://therighttrader.com/learn/trading-strategies/trend-day)).

The spec (Design proposal) splits on acceptance:

- **Rejection:** price trades beyond VAH or VAL, but fewer than two M30 periods close beyond it, and the acceptance metric (Section 6) fails. Fade back inside, with the POC as the first target and the stop beyond the probe extreme.
- **Acceptance:** two M30 closes beyond the edge and the volume-share test passes. Trade continuation toward the next reference in the stack: a prior range extreme, an nPOC or a higher-dimension HVN.

Open location sets the prior. An inside-value open favours rejection logic. An out-of-range open with a drive favours acceptance logic. Grade **C**.

### Open types

The notes support only a rules-based classifier, never a probability. The page that defines the four types states no probabilities, and its "raise the odds" language is unsourced ([LuxAlgo, Open Types](https://www.luxalgo.com/library/concept/open-types/)). There is "no reliable published win rate for the opening drive" ([therighttrader, Opening Drive](https://therighttrader.com/learn/trading-strategies/opening-drive)). A circulating ~75% ORR-extension figure has no source.

The classifier runs on M1/M5 clock bars over the first 30 minutes of RTH (Design proposal):

- **OD:** price never trades back through the open by more than *k*, and the 30-minute range is at least *m* × its 20-session median.
- **OTD:** an early probe of at least *p* against the eventual direction fails, then price crosses the open and extends beyond the probe's opposite side.
- **ORR:** an initial run of at least *p*, then a cross back through the open with the rejection extreme intact.
- **OA:** multiple crosses of the open with no extension beyond the opening range.

Each label carries two context flags, open-location tier and VWAP side. The notes give no values for *k*, *p* and *m*. The placeholders proposed here are k = 0.25 × ATR(M5), p = 0.5 × ATR(M5) and m = 1.0. Fix them once after visual review of about 20 sessions and never touch them again. Grade **C**.

### Naked POC magnets

**Tracking.** Keep every RTH, WEEK and MONTH POC that has not been intersected since its profile closed. Sierra Chart's "Until Future Intersection" with the Chart Bars method is the reference behaviour ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)).

**Use.** Take the nearest nPOC in the direction of current initiative activity as a **target, never an entry** (Design proposal).

**Touch rule.** Conventions differ on whether an ETH trade "fills" an RTH POC. The default proposed here is that any ETH trade counts. That is conservative, because fewer naked levels survive.

**Evidence.** The only supporting claim is an unvetted summary that says retest frequency was "directionally" validated on internal data, with no methodology ([portfoliowebsite research summary](https://portfoliowebsite-3hz.pages.dev/research/futures-ta/companions/research-summary.html)). The Chung & Bellotti finding that bounce probability at intraday levels decays over time ([arXiv 2101.07410](https://arxiv.org/abs/2101.07410v1)) argues for reporting each nPOC's age and preferring young ones. Grade **C**.

### LVN rejection and breakout

Practitioners use LVNs in contradictory ways:

- as targets ([faders substack](https://faders.substack.com/p/volume-profile));
- as entry zones, because "large players tend to skip price during discovery" ([nemissa substack](https://nemissa.substack.com/p/trading-with-the-volume-profile));
- as rejection points on pullbacks (the Valentini model below).

The contradiction resolves only through regime. **In imbalance** (value migrating), an LVN on the pullback is a rejection point, and an LVN that breaks is expected to be traversed quickly. **In balance**, the LVN at a balance edge is the place where a breakout either accelerates or fails.

The spec (Design proposal) classifies the regime first, using the value-migration table. In imbalance, it enters on VB-C rejection evidence inside an ANCH(A→B) or COMP LVN zone, with the stop beyond the zone and the target at the next HVN. Grade **C**. The mechanism is discussed in the evidence section.

### HVN reversion

In balance (overlapping value, D-shaped profiles), fade moves away from an HVN edge back toward the HVN center or POC. The location has some indirect support, because support and resistance coincide with book depth. The setup itself does not, and it carries the mechanical confound discussed later. Grade **C** for the setup and **B** for the HVN as a LOCATION.

### Look-above-and-fail and balance breakout

This is the multi-day mirror of the 80% rule (Background). Price auctions above a balance high (prior VAH, COMP VAH or range high) and fails to win acceptance: fewer than two M30 periods beyond, or less than *X*% of session volume beyond. It then returns inside, and the trade targets the balance POC, then the opposite edge.

The breakout is the same test passing. Acceptance beyond the edge triggers continuation toward the next higher-dimension reference (a WEEK or MONTH nPOC or HVN). The notes give no value for *X*, and Section 6 proposes a placeholder. Grade **C**.

### Poor high and low repair

Flag a prior session extreme as poor when two or more M30 periods share it within 0–1 tick, following Sierra's definition with Price Increments = 0 or 1 ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). Treat it as a magnet and target for later sessions, and expire the flag once the level is exceeded. This matches the "unfinished auction gets revisited" teaching ([Trader Dale blog, Feb 2026](https://trader-dale.blogspot.com/2026/02/order-flow-failed-auction-unfinished.html)). Grade **C**.

### Initial-balance extension

**Trigger.** Trade beyond IBH or IBL by at least one tick after the first 60 minutes of RTH.

**Filter.** The setup is stronger when the IB is narrow. The notes propose **IB width below 0.6 × its 20-day median**, which fits the narrow-IB description of trend days.

**Targets.** **1.5× and 2× IB-width extensions**, mirroring Sierra's four configurable extension lines.

**The honest caveat.** Both day-type surveys imply that some range extension happens on most sessions: normal variation alone is ~50–54% of days. A one-tick IB break is therefore a filter, not an event. Whatever edge exists must come from the narrow-IB condition and the follow-through, and the frequency of genuine trend days is itself disputed (<5% vs. ~16%). Grade **C**.

### Single-print fills

Confirmed RTH single-print zones (Sierra definition) are tracked across sessions as gaps in the auction. Practitioners treat them two ways. If the move that created them continues, the zone acts as support or resistance. If it doesn't, the zone becomes a target to "fill." Because the direction is ambiguous, they are **levels, not directional signals**. The only number available is tangential: 3 of the 16 complete 80%-rule fills in the 2008 test came via single prints ([teamlbr, 2008](https://teamlbr.blogspot.com/2008/09/mp-value-area-rule-80-rule.html)). Grade **C**.

### Fabio Valentini's trend model, as described second-hand

The secondary description runs as follows ([TradeZella, Auction Market Strategy](https://www.tradezella.com/strategies/auction-market-strategy); [TradeZella, Auction Market Playbook](https://www.tradezella.com/playbooks/auction-market-playbook)):

- **Context:** the market is out of balance.
- **Location:** mark LVNs on the reclaim leg.
- **Trigger:** "big buy aggression hitting right at that LVN on the footprint", which is order-flow confirmation.
- **Target:** the POC inside the prior balance.

Neither page is Valentini's own text. The description doesn't make clear which balance's POC is meant. For a continuation trade, the natural reading is the next high-volume area in the trade's direction.

An automatable translation (Design proposal):

- **LOCATION:** an ANCH(A→B) profile over the impulse leg, using confirmed swings from [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md), with its LVN zones.
- **TRIGGER:** a VB-C bar inside an LVN zone whose aggressor delta (ask-aggressor minus bid-aggressor volume, from Rithmic's aggressor flag) is a large fraction of the bar's volume, in the trend direction. The threshold is a placeholder for visual review.
- **MANAGEMENT:** stop beyond the LVN zone; target the POC of the next balance in the trade direction.

Grade **C**.

## VWAP is the profile's mean and an established benchmark

VWAP is cumulative value traded divided by cumulative volume, the volume-weighted **mean** of the same distribution whose **mode** is the POC. Berkowitz, Logue & Noser (1988, *Journal of Finance*) formalized it as a benchmark for NYSE transaction costs ([Wikipedia, VWAP](https://en.wikipedia.org/wiki/Volume-weighted_average_price)). Madhavan (2002) explains the justification: a volume-weighted average of trades on both sides is an unbiased estimate of the prices faced. He also warns that "uncritical use of VWAP as a benchmark can promote trading behavior that actually increases costs and risk," and that VWAP understates costs in trending stocks ([Madhavan 2002](https://www.smallake.kr/wp-content/uploads/2014/07/TP_Spring_2002_Madhavan.pdf)). Optimal VWAP execution has its own literature ([arXiv 1509.08503](https://arxiv.org/pdf/1509.08503)).

The futures-relevant fact sits in the volume-bar research. Easley, López de Prado & O'Hara found that ES volume concentrates in the first seconds of each minute, and they attribute this to TWAP/VWAP algorithms trading in 1-minute slots ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)). Benchmark-driven flow is demonstrably present in ES. Whether VWAP levels predict reactions is a separate question, and the notes found no evidence on it.

Brian Shannon calls anchored VWAP the most valuable tool in his trading and VWAP the "ultimate sentiment indicator" ([AOL/Yahoo Finance interview](https://www.aol.com/news/heres-traders-vwap-ultimate-sentiment-151803452.html)). Common anchors are earnings, swing highs and lows, gaps and high-volume news candles, with "no single correct anchor" ([TrendSpider, Anchored VWAP](https://trendspider.com/learning-center/anchored-vwap/)). Numeric add-ons circulating online, such as "RVOL ≥1.5", are not Shannon's. His own rules were not retrievable.

For futures (Design proposal):

- An RTH-anchored and an ETH-anchored session VWAP are different series. Pick one per strategy and name it.
- Weekly and monthly VWAPs anchor at WO and the month open.
- AVWAPs anchor at the same confirmed swings as ANCH(A→B). Then "fair value" (AVWAP) and "accepted price" (anchored POC) can be compared. AVWAP near the anchored POC suggests balance; AVWAP drifting away suggests migration.

Standard-deviation bands use the volume-weighted variance σ² = Σvᵢ(pᵢ − VWAP)² / Σvᵢ (Background). Both VWAP and σ fall out of the same histogram the profile engine already holds. Grade **A** as an execution benchmark and **C** as a trading level.

## Tick prints make the profile exact; bars only approximate it

Sierra Chart says chart data should contain **1-tick or 1-second records** for accuracy. With coarser records, the volume at a price becomes the "average volume per price based upon the price range of the data record", a uniform spread across each bar's high–low. Its row-size setting ("Ticks Per Volume Bar") defaults to **2**, and the docs say to set it to 1 for maximum detail ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)). TradingView builds profiles from lower-timeframe bars without documenting its intra-bar rule. It splits Renko candle volume evenly across bricks. It warns that on Heikin Ashi, Renko, Kagi, P&F and Range charts "the prices shown are not actual prices and the volume is distorted" ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

The pseudocode below is the engine design (Design proposal), built from those docs and the notes' synthesis.

### Bucketing and histogram storage

Prices become **integer tick indices**, never float keys. Volume is stored per minute so that any window, including an anchor inside a session, can be summed exactly. The per-minute layout also matches Rithmic's minute-profile history.

```python
# Rithmic LastTrade (template 150): tradePrice, tradeSize, aggressor (BUY=1, SELL=2), isSnapshot, ssboe/usecs
def on_trade(ts, price, size, aggressor, is_snapshot):
    if is_snapshot or not plausible(price, size):   # snapshots come from the database, not the exchange
        return
    i = round(price / TICK)                          # integer row key at 1-tick rows
    td, seg = trade_date_and_segment(ts)             # td rolls at 17:00 CT; seg in {ON, RTH, POST}
    cell = H[td][seg][floor_minute(ts)][i]
    cell.total += size
    if aggressor == BUY:    cell.ask_aggr += size    # buyer lifted the offer
    elif aggressor == SELL: cell.bid_aggr += size    # seller hit the bid
    else:                   cell.no_aggr  += size

def profile(window):                                 # RTH, ETH, ON, WEEK, MONTH, COMP(n), ANCH(A->B)
    out = SparseHist()
    for minute in minutes_in(window):                # ANCH slices at the anchor minutes of A and B
        out.add(H_minute(minute))
    return out
```

Final per-session histograms are persisted, so a WEEK, MONTH or COMP profile is a sparse sum that never rereads ticks. A row size of *k* ticks, if ever needed, is `floor(i / k)` applied on read.

### POC and value area under the single committed method

```python
def poc(h):                                          # h: dict row -> volume, rows span [lo, hi]
    vmax = max(h.values())
    mid = (min(h) + max(h)) / 2
    return min((r for r, v in h.items() if v == vmax), key=lambda r: (abs(r - mid), r))

def value_area(h, pct=0.70):                         # Sierra-style: one row, carry, stop at >= target
    lo, hi, p = min(h), max(h), poc(h)
    target, inc = pct * sum(h.values()), h[p]
    up, dn, vah, val = p + 1, p - 1, p, p
    while inc < target and (up <= hi or dn >= lo):
        vu = h.get(up, 0) if up <= hi else -1
        vd = h.get(dn, 0) if dn >= lo else -1
        if vu > vd:   inc += vu; vah = up; up += 1
        elif vd > vu: inc += vd; val = dn; dn -= 1
        else:         inc += vu + vd; vah, val = up, dn; up += 1; dn -= 1   # equal rows: include both
    return val, vah
```

The POC can be maintained incrementally at O(1) per print by updating the running maximum, with the tie rule re-evaluated whenever a row equals the maximum. Full value-area recomputation is O(rows). A session holds a few hundred rows, so recomputing at every M30 close and every VB-B close is cheap, and a true incremental VA is unnecessary. The **developing series** (dPOC, dVAH, dVAL) is sampled at each M30 close and stored, because the 80% rule and every acceptance check read it.

### HVN and LVN detection by smoothing and prominence

```python
def nodes(h, sigma_ticks, prom_frac=0.30, lvn_depth=0.35):
    x = dense_array(h)                               # zeros for untraded rows inside [lo, hi]
    s = gaussian_filter1d(x, sigma_ticks)            # session: sigma 2-4 ticks; scale up for WEEK/COMP
    hvn, _ = find_peaks(s, prominence=prom_frac * s.max())
    zones = peak_widths(s, hvn, rel_height=0.5)      # HVN zone = width at half prominence
    lvn = [v for v in find_peaks(-s)[0]
           if (a := nearest_peak_left(hvn, v)) is not None and (b := nearest_peak_right(hvn, v)) is not None
           and s[v] <= lvn_depth * min(s[a], s[b])]  # valley at most 0.35x the smaller neighbour peak
    share = [integrate(s, z) / s.sum() for z in zones]
    return hvn, zones, lvn, share
```

These starting values trace back to a Python reference implementation. That implementation used SciPy `gaussian_kde` with an "arbitrary" bandwidth, `find_peaks` with minimum prominence 0.3 × the maximum, and widths at half relative height capped with reference to hourly ATR. It ran on EURUSD 1-minute tick volume, and its author calls it "only a starting point" ([Minh, Medium](https://metaminh.medium.com/how-to-analyze-volume-profiles-with-python-3166bb10ff24)). The 0.35 LVN depth ratio is the notes' proposal. So is scaling σ with the horizon's median M30 range or ATR. Fix all of these per instrument and per P before forward validation.

### Shape and day-type classifiers

Neither taxonomy has sourced thresholds, so the values below are the notes' proposals. The precedence order is added here to make the classes contiguous.

```python
def shape(h, hi, lo, poc_row, singles_in_neck):
    r = (poc_row - lo) / (hi - lo)
    low3, high3 = vol_share(h, lo, lo + (hi - lo) / 3), vol_share(h, hi - (hi - lo) / 3, hi)
    if two_prominent_hvns_with_lvn_between(h) and singles_in_neck: return "DOUBLE"
    if thin_profile(h):                          return "TREND"   # low max-row share, range >= 2-3x median daily, >= 2x IB
    if r > 0.60 and low3 < 0.20:                 return "P"       # evaluated before D (the bands overlap)
    if r < 0.40 and high3 < 0.20:                return "b"
    if 0.35 <= r <= 0.65:                        return "D"
    return "UNCLASSIFIED"                        # all labels stay 'provisional' until late session

def day_type(ibh, ibl, high, low, close, ib_median20):
    ibw = ibh - ibl
    re_up, re_dn = max(0, high - ibh), max(0, ibl - low)
    pos = (close - low) / (high - low)
    if re_up < TICK and re_dn < TICK:          return "NORMAL"
    if re_up >= TICK and re_dn >= TICK:        return "NEUTRAL_EXTREME" if pos <= 0.2 or pos >= 0.8 else "NEUTRAL_CENTER"
    re = max(re_up, re_dn)
    if re >= 1.0 * ibw and ibw < 0.6 * ib_median20 and (pos >= 0.8 or pos <= 0.2):
        return "TREND"                           # 1.0x boundary is the low end of the sources' 1-2x
    return "NORMAL_VARIATION"
```

### Trackers for naked POCs, single prints and poor extremes

```python
def on_profile_final(P, poc_price, t_close):         # P in {RTH, WEEK, MONTH}
    naked.append(dict(dim=P, price=poc_price, born=t_close))

def on_bar_close(bar):                               # every ETH M1 bar: 'any ETH trade fills' default
    for n in list(naked):
        if bar.low <= n["price"] <= bar.high:        # Sierra 'Chart Bars' intersection method
            n["filled"] = bar.t; naked.remove(n)

def singles(periods):                                # M30 TPO periods of one RTH profile
    zones = []
    for k in range(1, len(periods) - 1):             # never in first or last sub-period
        prior_hi, prior_lo = max_high(periods[:k]), min_low(periods[:k])
        new = rows_of(periods[k]) & (rows_above(prior_hi) | rows_below(prior_lo))
        if new and later_periods_stay_beyond(periods[k + 1:], new):   # mode: next only, or all forward
            zones.append(new)
    return retract_rows_traded_into(zones, periods)  # persist the unfilled zones across sessions

def poor_high(periods, n_ticks=0):                   # n_ticks 0 or 1, per Sierra 'Price Increments'
    top = max_high(periods)
    return sum(p.high >= top - n_ticks * TICK for p in periods) >= 2
```

Excess at an extreme is a run of at least two single-TPO rows (Background). The volume analogs are diagnostics only. A poor high is flagged when the top 1–2 rows hold at least the profile's median row volume. Excess is flagged when at least 3 extreme rows sit below the 10th percentile of row volume.

### Acceptance, the metric every rule needs

```python
def accepted_beyond(level, side, periods, vol_window, y=0.15):
    m30_beyond = sum(closes_beyond(p, level, side) for p in periods)
    vol_share  = volume_beyond(vol_window, level, side) / total(vol_window)
    return m30_beyond >= 2 and vol_share >= y        # y: placeholder, not from the notes
```

The two-period count comes from the 80%-rule tradition. The volume-share floor *y* has no sourced value. The 0.15 shown is a placeholder to be fixed once by visual review. The same function serves the 80% rule, VA acceptance, look-above-and-fail and the balance breakout, which keeps one definition of "acceptance" across the whole dimension.

### Developing versus final, and the bar-data error

Every profile value carries a status. `profile_developing(session_id, as_of_seq)` is kept separate from `profile_final(session_id)`. Prior-session and prior-week values are final and safe. Each trigger's decision record logs `profile_values_used{developing|final}` so review can compare the chart with what the engine actually saw ([07 Automation architecture](07%20Automation%20architecture.md)).

When ticks are unavailable, the fallback spreads each bar's volume uniformly over its range, and the profile is flagged `approx`:

```python
def spread_bar(h, bar):                              # fallback only
    rows = range(round(bar.low / TICK), round(bar.high / TICK) + 1)
    for r in rows:
        h[r] += bar.volume / len(rows)
```

The error is bounded by bar range. The notes estimate POC and VA edges within about 1–2 ticks on 1-minute ES bars, but no published quantification exists. The distortion is worst exactly where it matters most. LVNs are created by fast moves, and fast moves produce the widest bars, so a bar-built profile fills in the very troughs the engine is trying to find. The fallback is therefore unsuitable for LVN logic.

## Rithmic delivers aggressor-tagged profiles; Tradovate delivers daily histograms

Both APIs in the repo can feed this engine, but they differ in resolution and history. The table summarizes what the repo's specifications expose ([Rithmic/protos.json](../../Rithmic/protos.json); [Rithmic Reference Guide](../../Rithmic/Reference_Guide.pdf); [Tradovate/openapi.json](../../Tradovate/openapi.json)).

| Need | Rithmic R\|Protocol | Tradovate | Caveat |
|---|---|---|---|
| Live prints with aggressor | `LastTrade` (150): `tradePrice`, `tradeSize`, `aggressor` (BUY=1/SELL=2), `isSnapshot`, `ssboe/usecs`, source nanoseconds | `md/getChart` Tick: `tks[]` with relative `t`, `p`, size `s`, optional bid/ask `b`/`a`, tick `id`; `eoh` marks end of history | Tradovate ticks "can arrive out of chronological order": sort and dedupe by `id` |
| Historical per-price volume | `RequestVolumeProfileMinuteBars` (208→209): per-minute OHLC/volume plus `profilePrice[]`, `profileNoAggressorVolume[]`, `profileBidVolume[]`, `profileAskVolume[]` and per-side trade counts | `md/getChart` with `withHistogram: true` (contents not described in the notes) | Rithmic history is bar-shaped; no raw historical ticks |
| Volume-at-price snapshot | `RequestGetVolumeAtPrice` (119→120): `tradePrice[]`, `volumeAtPrice[]` | `md/subscribeHistogram`: `tradeDate`, `base` price, `items` keyed by price offset → volume (e.g., `"-14":5906.67`), `refresh` flag | Rithmic coverage (trade date vs. Globex open) undocumented; Tradovate histogram is per trade date |
| Weekly / monthly aggregation | `WEEKLY_BAR` exists; monthly built locally | No weekly unit; build from daily | Profiles are summed locally either way |
| Truncation | "If … the number of returned bars is a round number (such as 10000) … the request was truncated" | History depth for `md/getChart` not stated | ~1,380 minute bars per Globex day; ~6,900 per week; ~30,000 per month |

The architecture notes prefer Rithmic for this dimension. It supplies aggressor-side ticks (needed for bid/ask profiles, footprint-style triggers and the volume-bar builder) and minute-resolution profile history for seeding. Tradovate is a workable second path ([07 Automation architecture](07%20Automation%20architecture.md)). Seeding a month of profiles means paginating minute-profile requests by time window and verifying continuity outside the daily maintenance break. Recording live ticks from day one makes the engine's own archive the exact replay source.

Three details need checking before anyone relies on them (Design proposal):

- **Total volume.** The engine should assume total volume at a price = no-aggressor + bid + ask volume, and verify it by reconciling each minute's summed arrays against that minute's `volume` field.
- **Bid/ask mapping.** Map `profileBidVolume` to sell-aggressor volume only after comparing it with locally aggregated `LastTrade` prints for the same minutes.
- **Fractional volumes.** The fractional volume in Tradovate's histogram example (5906.67) suggests the values may not be raw integer contract counts. Treat that histogram as a cross-check, not as the engine's source of record.

Whether Rithmic delivers CME summary trades or individual fills does not affect volume-at-price totals. It does affect trade counts ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)).

## Volume bars change the time axis, never the histogram

A volume profile is a function of **price only**. A profile built from ticks is identical whether it is drawn beside time candles or constant-volume candles. Pairing profiles with the series' VB-A/VB-B/VB-C bars (ADV/50, ADV/250 and ADV/1000 of 20-session average daily volume, recalibrated weekly, breaking at session start) therefore needs no compromise on the profile side, as long as the profile is never rebuilt from the bars themselves. Building it from VB-A bars would reintroduce the uniform-spread error at its worst, because large volume bars are wide. Sierra Chart requires "New Bar at Session Start" for Volume Per Bar, which matches the series' session-break rule ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). See [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md) for sizing.

What does not transfer is everything defined by the clock: IB, ORH/ORL, the M30 periods behind the 80% rule and acceptance counts, open types, TPO single prints and poor extremes, DO and WO. These are computed from tick-built clock bars and overlaid on the volume chart, never derived from "the first K volume bars". The table separates the two clocks.

| Construct | Clock | Computed on | Displayed on |
|---|---|---|---|
| POC, VA, HVN/LVN, nPOC for every P | None (price axis) | 1-tick histograms from ticks | Any chart |
| IBH/IBL, ORH/ORL, open type, 80%-rule periods | Clock | M30/M5/M1 bars from ticks | Overlaid on VB charts |
| Single prints, poor highs/lows, excess (TPO) | Clock | M30 TPO rows | Overlaid |
| Acceptance volume share | Volume | Tick histogram | — |
| TRIGGER evidence (delta, range per volume, bar duration) | Volume | VB-C / VB-B | VB charts |

There is also a positive fit (Design proposal). Volume bars compress the overnight into a few candles, just as a volume profile down-weights thin overnight trade that a TPO profile would overweight. The chart and the histogram therefore agree on what mattered.

Volume bars also add trigger information that time bars confound. Each bar holds the same number of contracts, so **range per bar is a price-impact proxy** in the spirit of Kyle's λ, and bar duration is a free activity variable. At a profile LOCATION, rejection should look like narrowing VB-C ranges and slowing bars as passive size absorbs the push. Traversal of an LVN should look like fast, wide bars.

One non-standard idea is worth logging, though not trading yet. Counting how many VB-C bars touched each price gives a "TPO in volume time". Rows touched by only one VB-C bar are then a volume-clock analog of single prints. It is not established anywhere, and it would need its own visual review.

## How to visually verify the profile engine against your charting platform

The user's validation method is visual review plus forward testing. That only works if the chart shows the same levels the engine computed, so verification comes first. Match the settings, then compare the outputs one construct at a time.

**Settings to match:**

- **Session template:** RTH window, evening session, trade-date start.
- **Row size: 1 tick.** Sierra's default is 2, so this must be changed.
- **Data:** 1-tick or 1-second records, not minute bars.
- **Value area:** 70%, single-row (Sierra's two-level option off), computed from volume rather than TPO ("Value Area Highlight Based On Volume" on TPO charts).
- **TPO settings:** 30-minute sub-periods with letters starting at the RTH open, and an IB of two sub-periods.

All of these are documented options in Sierra Chart ([Sierra Chart Volume by Price docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141); [Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). On TradingView, expect value areas up to one row narrower (its ≤70% rule), profiles built from lower-timeframe bars, and an "up/down volume" split by bar direction ("if close >= open, we take it as an up volume"). That split is not aggressor data, so never compare delta against it ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

| Check | Engine output | Platform reference | Expected agreement (Design proposal) | If it disagrees, suspect |
|---|---|---|---|---|
| Session totals | Σ histogram volume per P | Platform session volume; Rithmic `TimeBar` volume | Near-identical | Session template, filtered or off-book prints, missing minutes |
| POC | Price, with tie rule | Volume POC | Exact | Near-tie between rows, row size, bar-built data |
| VAH / VAL | Committed method | Sierra volume VA at 70%, single-row | Exact vs. Sierra; ≤1 row vs. TradingView | Algorithm, TPO-vs-volume weighting |
| HVN / LVN | Smoothed-prominence nodes | Sierra Peaks and Valleys (raw ±Sensitivity) | Same major nodes; minor ones differ | Expected; check σ and prominence by eye |
| nPOC list | Naked set with ages | "Extend POC Until Future Intersection", Chart Bars method | Same set | ETH-vs-RTH touch rule |
| IB, singles, poor H/L | TPO trackers | Sierra TPO IB, singles, poor highs (Price Increments 0 or 1) | Exact | Sub-period alignment, single-print mode |
| Day type, shape | Classifier labels | Your own read of the profile | Agree on clear days; flag disagreements | Thresholds (log, don't retune mid-sample) |
| dPOC at trigger | Value in the decision record | Replay to the trigger time | Exact to the logged value | Look-ahead or developing/final mix-up |
| Contract | Front month actually traded | Chart symbol | Same contract, not back-adjusted | Roll handling |

The working routine is a daily diff (Design proposal):

1. The engine exports every active level (P, type, price, status, age) as horizontal lines for the platform.
2. For the first 20 sessions, every level is checked against the platform's own study.
3. Any non-zero difference in POC or VA against matched Sierra settings is treated as an engine bug until explained.

Tradovate's market replay (`replay/initializeclock`) or Rithmic minute-profile history lets you step back to a trigger time and confirm that the developing values on screen equal the ones in the decision record ([Tradovate/openapi.json](../../Tradovate/openapi.json)). Only once levels match does reviewing the setups themselves mean anything.

## The evidence supports locations, not the advertised win rates

The peer-reviewed literature supports the general idea that **prices react where liquidity and orders concentrate**. It does not support any specific profile setup:

- **Kavajecz & Odders-White** (2004, *Review of Financial Studies*) found that support and resistance levels coincide with peaks in limit-order-book depth. Technical analysis may have value even in efficient markets because it locates liquidity provision ([IDEAS/RePEc](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). A Taiwan Stock Exchange follow-up reports the same link ([sinoss.net](https://www.sinoss.net/uploadfile/2013/0813/20130813093423563.pdf)).
- **Osler** (2003, *Journal of Finance*) studied about **9,700 stop-loss and take-profit orders** at a large FX dealing bank (September 1999 to April 2000). Take-profit orders cluster at round numbers, which helps explain reversals at support and resistance. Stop-losses cluster just beyond round numbers, which helps explain faster moves after breaks ([IDEAS/RePEc](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [NY Fed Staff Report 125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.html)).
- **Chung & Bellotti** (2021, arXiv) found that intraday levels bounced off several times are more likely to bounce again, that this bounce probability decays over time, and that the effect is not explained by simple AR(1) processes. They also note that support and resistance have "no clear mathematical definition" in the literature ([arXiv 2101.07410](https://arxiv.org/abs/2101.07410v1)).
- **Kyle** (1985, *Econometrica*) supplies λ, the price impact per unit of signed order flow. It is the natural language for why an LVN records a place where little volume moved price a lot ([Econometric Society](https://econometricsociety.org/publications/econometrica/1985/11/01/continuous-auctions-and-insider-trading)).
- Round-number clustering also appears in institutional equity executions, but that is equities, not futures ([PolyU thesis](https://theses.lib.polyu.edu.hk/bitstream/200/10670/3/5110.pdf)).

Against that, the notes found **no peer-reviewed test** of Market Profile, value areas, the 80% rule, naked POCs or HVN/LVN behaviour in ES, NQ or CL. Practitioner sources present no out-of-sample testing ([NexusFi, 80% Rule](https://nexusfi.com/a/concepts/80-percent-rule)). TradingView itself describes volume profile as reactive, a record of past activity rather than a forecast ([TradingView Volume Profile help](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)).

The mechanisms remain plausible but unproven for these setups:

- **HVNs might slow price** because they are where liquidity providers absorbed flow cheaply. If resting liquidity re-forms at previously accepted prices, which the Kavajecz & Odders-White depth link makes credible, returning price meets depth.
- **LVNs might be traversed fast** because they record high past impact. That future λ at the same price stays high is an assumption: liquidity is not stationary. Osler's stop clustering gives a separate route to fast moves through extremes and round numbers, but it was shown for those levels, not for LVNs.

Two cautions temper all of this:

- **A mechanical confound.** Volume at price partly reflects time spent at price. A profile is largely a record of where price was, so HVN "support" is partly the mean reversion any range-bound series shows.
- **Level decay.** Chung & Bellotti's decay result argues against treating old nodes as permanent.

That is why profile levels as LOCATIONs earn a **B**, while the setups built on them sit at **C**. The 80% rule as advertised is the one **D**. Several sources the notes could not reach could revise these grades: Dalton's *Markets in Profile*, Trader Dale's books, a 2026 CQG primer on Market Profile value areas ([CQG](https://news.cqg.com/workspaces/2026/06/cqg-primer-market-profile-value-areas-mpva)), and NinjaTrader, ATAS or Quantower profile documentation.

## Conclusion

The profile engine is stronger than the profile setups. It can be computed exactly from aggressor-tagged ticks, summed across any window and checked against a chart to the tick. That makes it the most auditable dimension in the series and the best foundation for unattended automation reviewed by eye. The named setups are the weak part, and the one measured number cuts against them. The practical correction is not to abandon the 80% rule but to retarget it. Take the prior POC as the first objective, count your own fill rate forward, and expect a sample of about 40 triggers to take roughly half a year per instrument. Plan validation horizons on that scale rather than hoping a few weeks will settle anything.

Two design consequences follow that the notes do not state outright. First, **regime classification is the strategy**. The same LVN is an entry to fade or a level to break depending on whether value is migrating, so the balance/imbalance read from the value-migration table has to be decided before any node is touched. Second, **nested profiles share their data**. A daily POC inside a weekly POC is one observation, not two. The genuinely independent confirmation for a profile level comes from outside the dimension, from the swing and Fibonacci work, and that interaction is the subject of [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md).
