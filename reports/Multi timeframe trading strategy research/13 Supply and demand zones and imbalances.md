# Zones locate liquidity; imbalance labels only describe it

*File 13 of the multi-timeframe research set: supply and demand zones, price-action imbalances (displacement candles, fair value gaps, order blocks) and order-flow footprint imbalances, treated as their own dimension, with proposals SD-01 to SD-08. Reading order and file map: [00 Index and reading guide](00%20Index%20and%20reading%20guide.md).*

Supply and demand zones, fair value gaps (FVGs), order blocks and footprint imbalances are four vocabularies for one object: **the origin of a fast departure from a swing extreme**, sampled at different resolutions and from different data. Only the mechanism underneath them has rigorous support. Prices react more often than chance at levels where orders rest. Stop-loss orders cluster just beyond salient prices, book depth peaks at technical levels, and intraday bounce odds rise with prior bounces and decay with age ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [Kavajecz & Odders-White 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html); [Chung & Bellotti](https://arxiv.org/abs/2101.07410v1)). None of the named constructs has been validated. **No peer-reviewed study tests FVGs, order blocks, breakers, the 50% "consequent encroachment" line or footprint stacks.** The one tick-level FVG test found fill rates converging on a random-level baseline, with bar-based backtests overstating performance roughly fourfold ([Curupira](https://curupira-blog.pages.dev/blog/fvg-magnetism-fair-value-gaps)). The evidence also contradicts a core retail rule: "fresh" zones are not stronger, because levels with *more* prior bounces were *more* likely to bounce again. Order-flow imbalance does move price, but in the E-mini its shocks "dissipate almost entirely within a second", so a footprint stack read at bar close describes intent rather than predicting the next minute ([arXiv 2508.06788](https://arxiv.org/abs/2508.06788v2)). The usable product is therefore one zone registry, fed by look-ahead-free detectors that stamp every object with its `known_at` time and share one state machine, used for LOCATION while swing structure supplies CONTEXT and TRIGGER. Eight proposals follow. Two rest on B-grade location evidence, five are C-grade codifications, and one FVG proposal is graded D and kept as a control experiment. Start with SD-01, SD-06 and SD-02, signal-only.

Every number below is a pre-committed starting value drawn from the research notes, or is labelled a design proposal. None is optimized, and none comes from a profitable backtest. Shared names (layers, roles, SWING(L), STRUCTURE(L), BOS, CHoCH, G1–G3, LEVELS, evidence grades) follow [00 Index and reading guide](00%20Index%20and%20reading%20guide.md).

# Part 1: research write-up

## 1. A zone is the base price left in a hurry, graded by a checklist nobody published

Sam Seiden's Online Trading Academy (OTA) framework is the parent of nearly every retail supply/demand method. A **zone is the small base, one to a handful of overlapping candles, that a strong and fast move left from**. Its quality is judged with "odds enhancers", described by OTA as "a simple, yet very specific set of criteria that helps us determine a quality demand or supply level vs one that is not" ([FXStreet/OTA](https://www.fxstreet.com/amp/education/lessons-from-the-pros-201109070000)). The enhancers that surface publicly are consistent. On strength of departure: "If price leaves quickly, it shows a large imbalance of supply and demand and, therefore, a stronger zone" ([FXStreet/OTA 2015](https://www.fxstreet.com/education/lesson-from-the-pros-stocks-201504280000)). On time at level: "the less time price spends at a level, the more out of balance supply and demand is at the level" ([FXStreet/OTA 2016](https://www.fxstreet.com/education/lessons-from-the-pros-201601260000)). On profit margin: "The larger the profit zone, the higher the probability" ([FXStreet/OTA](https://www.fxstreet.com/amp/education/lessons-from-the-pros-201601260000)). Zones at the *origin* of a strong move "greatly increase the odds", while zones in the middle of a move "will not yield as good results" ([NexusFi, OTA-linked](https://nexusfi.com/showthread.php?p=150046)). The higher-timeframe "curve" decides direction, because "larger time frame levels trump smaller time frame levels" ([FXStreet/OTA Q&A](https://www.fxstreet.com/education/lessons-from-the-pros-201106070000)).

**The full checklist was never published.** An OTA author wrote that articles "typically go over two" enhancers, that the Professional Trader class covers four, and that the XLT class covers "the remaining four", which implies eight in total ([FXStreet/OTA](https://www.fxstreet.com/education/lessons-from-the-pros-201406030000)). A forum post recalls a six-item scored list (strength, profit margin, big picture, retracement, time at level, return to level) with "8 or more" meaning a good trade. It is from memory and unverified ([BabyPips](https://forums.babypips.com/t/odd-enhancers-sam-seiden/39321)). Even "freshness" exists publicly only in a forum member's words: "The more times, the more supply will be 'eaten up'" ([NexusFi](https://nexusfi.com/showthread.php?p=150046)). Two caveats follow. The FXStreet reprints returned HTTP 403 to the researcher, so quotes come from search extracts. And **every numeric threshold in circulation ("base body ≤ 50%", "2 extended-range candles", "2:1 imbalance") comes from community scripts and course copies, not from a canonical rulebook.** They are usable conventions, not standards.

### Four base patterns, two lines and one drawing convention

The OTA-descended convention names four leg-base-leg sequences. Rally-base-rally (RBR) and drop-base-rally (DBR) create demand; drop-base-drop (DBD) and rally-base-drop (RBD) create supply. RBR and DBD are continuations, DBR and RBD are reversals, and "many practitioners grade reversal formations at range extremes highest". The departure must be "a run of strong, one-directional candles leaving an area quickly", and "departures that break a prior swing point" carry more weight. The **distal line** is the base's far extreme (lowest wick for demand). The **proximal line** is the near edge, commonly the candle bodies. "Set and forget" means a limit at the proximal edge, a stop beyond the distal and a target at the next opposing zone. LuxAlgo, which documents all of this, adds that the method "guarantees nothing" and that impulsive departures are "far easier to see in hindsight than in real time" ([LuxAlgo: Supply & Demand Zones](https://www.luxalgo.com/library/concept/supply-and-demand-zones.md)). Drawing conventions conflict: wick-to-wick is aggressive, body-to-wick conservative, and one tutorial runs the distal line to the extreme of the whole leg-in/base/leg-out formation. The sources agree on one point only: "Neither is objectively correct; pick one convention, apply it consistently" ([MAK Trading School](https://maktradingschool.com/?p=3615); [El Trader Financiado](https://www.eltraderfinanciado.com/en/blog/supply-and-demand-zones)).

This file pre-commits to **body-to-wick** (design choice). For demand, proximal = the highest body top, max(open, close), among the base candles. Distal = the lowest low among the base candles and the first leg-out candle. Supply mirrors this. The stop follows from the distal line, so the convention must be global. If the bot and the reviewer draw differently, every stop will look wrong in review.

### The thresholds in circulation, and the defaults chosen here

| Element | Values in circulation | Source | Default in this file |
|---|---|---|---|
| Base ("boring") candle | Body ≤ 50% of range; "< 50%" strict | [LuxAlgo library](https://www.luxalgo.com/library/indicator/KRlFYBWy-demand-and-supply-candles-open/); [TradingView](https://www.tradingview.com/script/aoBHw1zq-Boring-Explosive-Candle-Muthu-S/?amp) | Body ≤ 0.50 × range |
| Leg ("explosive") candle | Body > 60% **and** range above an ATR threshold; body ≥ 50%; body ≥ 70%; range ≥ 1.9× base candle | [LuxAlgo library](https://www.luxalgo.com/library/indicator/KRlFYBWy-demand-and-supply-candles-open/); [LuxAlgo: Demand Zone Candles](https://www.luxalgo.com/library/indicator/vphHn1sk-demand-zone-candles/) | Body ≥ 0.60 × range, range ≥ 1.5 × ATR(L), close in outer 25% (= DISPLACEMENT, §2) |
| Moreno leg-out | "ideally 2 ERC candles" closing "about 80%" of their range; legs with body > 50% | [Scribd: Scoring imbalances](https://www.scribd.com/document/537054945/07-Scoring-imbalances); [Scribd: What is S&D](https://www.scribd.com/document/619830759/What-is-Supply-and-Demand) | Covered by the leg rule and the arming rule |
| Moreno validity | "needs to make 2:1 imbalance and consolidate away at least 1 full OHLC candle" (unverified post) | [ForexFactory](https://www.forexfactory.com/thread/post/6962697) | ARMED when excursion ≥ 2 × zone height **and** one bar lies fully outside |
| Base length | 1–3 candles score best ("time at level"); "1–3 full / 4–6 half / > 6 zero" tables are unverified lore | OTA articles; notes' gaps | 1–6 bars accepted; count logged, not scored |
| Profit margin | "≥ 3:1" tables unverified | Notes' gaps | ≥ 2.0R to the opposing armed zone where a proposal uses it |

Alfonso Moreno's "Set and Forget" course copies describe the same object as a demand "valley" with a bearish leg-in, a base and a bullish leg-out ([Scribd](https://www.scribd.com/document/626416000/Set-and-Forget-Cource-1)). Wyckoff's accumulation range is the large-base version. It has a selling climax absorbed "by larger professional interests", a secondary test on "significantly reduced" volume, and a spring that breaks range support and quickly reverses, where "the volume signature is the final arbiter" ([StockCharts](https://articles.stockcharts.com/article/articles-wyckoff-2015-07-wyckoff-power-charting-lets-review)). For automation, Wyckoff is a structure-plus-volume pattern (range, sweep of the extreme, quieter test), not a new zone type. Its spring is SD-06's sweep-and-reclaim at a range scale.

One tension should stay visible rather than be averaged away (inference from the notes). OTA says a **short** stay at the base implies more unfilled orders. Auction theory says **long** time and volume at a price implies acceptance, an HVN that also acts as support. Both can hold in different roles. A brief base launching a fast leg is an *origin*; a long base is *value*. Their scores must not be merged into one number.

## 2. Price-action imbalances are candle arithmetic with rival definitions

### Displacement is the departure leg under another name

ICT-derived sources do not formally define displacement beyond "aggressive"; LuxAlgo calls it "a move aggressive enough to outrun available liquidity" ([LuxAlgo: FVG concept](https://www.luxalgo.com/library/concept/fair-value-gap.md)). It is the same geometry as OTA's strength of departure and Moreno's extended-range candle. The vocabulary differs, the object does not. This file uses one codable definition everywhere (design, from the notes' ranges): **DISPLACEMENT(L, i)** holds when bar i on layer L has range ≥ 1.5 × ATR(L) (ATR computed through bar i−1, so the bar never sets its own threshold), body ≥ 0.60 × range, and a close in the outer 25% of its range in the direction of the body.

### Two popular FVG implementations share one inequality and little else

An FVG is three-candle arithmetic. It is bullish when candle 3's low is above candle 1's high: "the middle candle moves so fast that the first candle's high and the third candle's low never overlap" ([LuxAlgo: FVG concept](https://www.luxalgo.com/library/concept/fair-value-gap.md)). The core inequality is shared. The extra conditions are not.

| Rule | LuxAlgo FVG script (TradingView) | python `smartmoneyconcepts` (code read directly) |
|---|---|---|
| Bullish condition | low > high(t−2) **and** close(t−1) > high(t−2) **and** (low − high(t−2)) / high(t−2) > threshold | high.shift(1) < low.shift(−1) **and** middle candle close > open |
| Size filter | Percent threshold, or "Auto" (cumulative mean of relative FVG heights; changed July 2023 "allowing for more frequent" gaps) | None |
| Where the signal is stored | Zone [high(t−2), low] at candle 3 | At the **middle candle**, using next-candle data |
| Mitigation | Far edge (full fill); wick vs close not stated | First candle from i+2 touching the **proximal** edge |
| Merging | "Dynamic" option tracks a partly filled gap | `join_consecutive` merges adjacent same-direction gaps |

Sources: [TradingView: FVG [LuxAlgo]](https://www.tradingview.com/script/jWY4Uiez-Fair-Value-Gap-LuxAlgo); [LuxAlgo library: FVG](https://www.luxalgo.com/library/indicator/fair-value-gap/); [raw smc.py](https://raw.githubusercontent.com/joshyattridge/smart-money-concepts/master/smartmoneyconcepts/smc.py). The LuxAlgo Pine source was not read directly, so its wick-vs-close test and exact Auto formula are inferred from page text.

### The python library looks ahead in three places

The most-used open-source SMC code produces look-ahead in a naive historical or live run, and each case is visible in the source ([raw smc.py](https://raw.githubusercontent.com/joshyattridge/smart-money-concepts/master/smartmoneyconcepts/smc.py)). **First**, `fvg()` stores the gap on the middle candle using `shift(-1)`, so that row contains candle 3's low before candle 3 exists. **Second**, `swing_highs_lows(swing_length=50)` uses a centered window built with `shift(-(swing_length))`, so a swing labelled at bar t is knowable only at bar t + 50. **Third**, `ob()` finds the last swing high below the current bar by binary search over all swing indices, "without checking the swing's confirmation time." With the default length of 50, a swing high labelled at bar 1,000 can seed a BOS and an order block at bar 1,020, thirty bars before anyone could have known the swing existed (worked illustration of the code path, not a measured result). The fix is the confirmation-clock rule used throughout this file. An FVG is known at the **close of candle 3**. An order block is known at the **close of the BOS bar**, and only if the broken swing's `confirm_ts` is at or before that close.

### Inverse gaps, balanced ranges, volume imbalances and voids

The FVG family has four relatives ([LuxAlgo: FVG concept](https://www.luxalgo.com/library/concept/fair-value-gap.md)). An **inversion FVG (IFVG)** is "a fair value gap that price has closed through", whose role flips. A **balanced price range** is two opposing FVGs overlapping, "the same span rebalanced from both directions". A **volume imbalance** is a gap between candle *bodies* while wicks overlap. A **liquidity void** "usually refers to a larger untraded span". The midpoint, **consequent encroachment (CE)**, is called a "decision line", and a midpoint touch is "filled enough" for many models. The same page concedes that "raw three-candle gaps print constantly", that "a fill is a scenario to plan around, not a certainty", and it cites no statistics. Size filters should be ATR-relative, not percent of price. A percent threshold behaves differently on ES (≈ 6,000+), NQ (≈ 20,000+) and CL (≈ 60–80). This file uses a minimum gap of 0.25 × ATR(L) of the detection layer and a maximum of 1.5 × ATR(L) (design, from the notes' 0.25–0.5 and 1.0–1.5 ranges).

### Order blocks, breakers and mitigation blocks are zone subtypes, not new evidence

LuxAlgo defines an order block (OB) as "the last opposing candle before a strong move" and a **breaker** as "a formerly valid Order Block that has been broken and is now acting as the opposite polarity". A **mitigation block** differs from a breaker by the failed swing: in the bearish case, a lower high forms without trading above the reference high, and "any sweep of the extreme reclassifies the setup as a potential breaker" ([LuxAlgo: Mitigation Block](https://www.luxalgo.com/library/concept/mitigation-block.md)). In LuxAlgo's own OB tool, polarity labels "are backpainted, while block and breaker detection itself runs in real time" ([LuxAlgo: OB & Breaker Blocks](https://www.luxalgo.com/library/indicator/order-blocks-breaker-blocks.md)). Its advanced SMC script filters OBs "too small to be significant or too large (often caused by news spikes)" with an ATR multiplier ([LuxAlgo: SMC Advanced](https://www.luxalgo.com/library/indicator/srwLDKbR-smart-money-concepts-advanced)). The python code is more concrete. A bullish OB exists only after a close above the last swing high (a close-based BOS), and the OB candle is the one with **the lowest low between that swing high and the breaking candle** ([raw smc.py](https://raw.githubusercontent.com/joshyattridge/smart-money-concepts/master/smartmoneyconcepts/smc.py)). That candle is the swing low of the leg that broke structure. **An order block is therefore the extreme candle of an OTA demand base whose departure produced a BOS.** This file treats "OB" as a subtype tag (`bos_on_departure = true`) on a zone, not as a separate concept with its own vote. Breakers and IFVGs are both "role reversal after a close-through" and share one flip mechanism (§4).

### "Mitigation" has four incompatible meanings

| Meaning | Event | Who uses it | Registry state (§8) |
|---|---|---|---|
| First touch | Price trades to the proximal edge | python `fvg()` MitigatedIndex | TOUCHED |
| Midpoint | Price trades to the CE | LuxAlgo concept page ("filled enough") | MID_TOUCHED |
| Full fill | Price trades to the distal edge | LuxAlgo FVG script; python `ob()` wick rule (`low < bottom`), which converts the OB to a breaker | FILLED |
| Close-through | A bar closes beyond the distal edge | LuxAlgo OB tool "Close" mode; python `close_mitigation` (`min(open, close) < bottom`) | INVALIDATED (optional flip child) |

Two systems that both say "unmitigated FVG" can therefore disagree on most gaps. The registry tracks all four as separate timestamped transitions, so every popular definition can be reproduced and compared visually without re-detection.

## 3. Footprint imbalance is a measured ratio; academic order-flow imbalance is a different object

"Imbalance" names two different things. **Price-action imbalance** is inferred from OHLC geometry: price moved without overlap, so trade was presumably one-sided. **Order-flow imbalance** is measured from aggressor-classified volume at each price. The footprint version compares diagonally. Sierra Chart's documentation states it most precisely: "the Bid Volume at one price level is compared diagonally to the Ask Volume at the next higher price level". Its two formulas are "Ask Volume at Price level − Bid Volume at Previous Price level" and "Ask Volume at Next Price level − Bid Volume at Price level". The highest bid and lowest ask in a bar cannot be dominant, because nothing lies beyond them to compare ([Sierra Chart: Numbers Bars](https://www.sierrachart.com/index.php?page=doc/NumbersBars.php)).

| Platform | Comparison | Ratio default | Volume filter | Stacks |
|---|---|---|---|---|
| NinjaTrader 8 Volumetric | Diagonal (Horizontal mode since 8.0.19.0) | **1.5** (doc example 989/518 = 1.91 → imbalance) | **Minimum delta 10**; ticks per level 1 | "Cluster" imbalances can form S/R areas |
| ATAS | Bid at a price vs ask at the price directly above | **150%** (2018 blog default) | — | "two, three and more imbalances which go one after another" |
| Quantower (Rithmic plug-in post) | Ask vs bid one level below | Users "settle somewhere around **200–300%**" | — | "Several"; no minimum count or invalidation rule |
| Sierra Chart Numbers Bars | Both diagonals; dominant side | Percent thresholds .25/.50/.75; actual-volume 100/200/300; comparisons ≥ 100% possible | Minimum-volume compare threshold **0**; "zeros as ones" option | Via the Volume at Price Threshold Alert V2 study |
| ATAS marketplace "Imbalance Levels" (third party) | — | **5×** | — | ≥ 3 levels; discards levels touched by the very next candle |
| Stacked-imbalance zone feature (LuxAlgo platform docs) | — | — | — | "Min stacked rows, default 3"; zone extends right "until price trades back into it" |

Sources: [NinjaTrader 8](https://static.ninjatrader.com/support/helpGuides/nt8/order_flow_volumetric_bars.htm); [ATAS help](https://help.atas.net/en/support/solutions/articles/72000606631); [ATAS blog](https://atas.net/blog/imbalance-why-the-size-matters/); [Quantower](https://www.quantower.com/blog/imbalance-footprint-chart-and-rithmic-plugin); [Sierra Chart](https://www.sierrachart.com/index.php?page=doc/NumbersBars.php); [Sierra support](https://www.sierrachart.com/SupportBoard.php?ThreadID=62014); [ATAS marketplace](https://marketplace.atas.net/product/imbalance-levels); [LuxAlgo docs: Footprint](https://docs.luxalgo.com/platform/charts/order-flow/footprint).

The defaults range from 1.5× to 5×, and that spread is the honest summary: **no platform default is evidence of anything.** The surrounding vocabulary is equally descriptive. **Absorption** is "heavy aggressive volume that fails to move price because passive orders soak it up". An **unfinished auction** is "an auction that ended while both sides were still trading", which the market "frequently, but not always, revisits". Isolated imbalances are mostly noise, while stacks signal initiative. The bid/ask split identifies the aggressor only, not ownership, and without reliable classification "the cells are approximations" ([LuxAlgo: Footprint Concepts](https://www.luxalgo.com/library/concept/footprint-concepts.md)). Quantower says stacks "tend to become support or resistance", yet also "if price slices back through the stack, the aggression was genuine and momentum carries" ([Quantower](https://www.quantower.com/blog/imbalance-footprint-chart-and-rithmic-plugin)). That leaves it ambiguous whether a hold or a slice-through is the signal, so each setup must pre-register one reading. Delta or CVD divergence belongs only at *confirmed* swings: a higher swing high while the leg's summed delta makes a lower high.

### Four different things are called "imbalance"

| Object | Computed from | Asserts one-sidedness by | Natural output | Data needed | Evidence |
|---|---|---|---|---|---|
| **PA-IMB**: FVG, displacement, volume imbalance | OHLC of time or volume bars | Absence of overlap | A price range with a CE | Any feed | C to D (§6) |
| **FP-IMB**: diagonal and stacked footprint imbalance | Aggressor-tagged prints per price row | Measured ratio | A set of rows; ≥ 3 consecutive = a stacked zone | Trades with aggressor flag (Rithmic `LastTrade`) | C |
| **Book OFI** (Cont, Kukanov & Stoikov) | Changes in best-bid and best-ask queues: limit adds, cancels, market orders | Net queue pressure | A time series, not a zone | Top-of-book event data | A for contemporaneous and very short horizons |
| **Signed trade imbalance** (Chordia & Subrahmanyam) | Buyer- minus seller-initiated trades, Lee–Ready classified | Net signed trades per period | A daily series per stock | Trades and quotes | A for price pressure; the lagged effect reverses |

The academic objects are not the footprint heuristic. Cont, Kukanov and Stoikov find "a linear relation between order flow imbalance and price changes, with a slope inversely proportional to the market depth", and they find the relation to trade volume "noisy and less robust" (NYSE TAQ, 50 stocks; *Journal of Financial Econometrics* 2014) ([arXiv 1011.6402](https://arxiv.org/abs/1011.6402); [RePEc](https://ideas.repec.org/a/oup/jfinec/v12y2014i1p47-88..html)). Chordia and Subrahmanyam's daily stock imbalance relates to returns through price pressure. The positive lagged relation reverses once current imbalance is controlled for, and imbalance strategies are statistically significant before costs that may erode them (*JFE* 2004) ([UPenn mirror](https://www.cis.upenn.edu/~mkearns/finread/stock-misbalance.pdf)). In the E-mini at one-second resolution, price and flow impacts are significant, but shocks "dissipate almost entirely within a second" ([arXiv 2508.06788](https://arxiv.org/abs/2508.06788v2); author unverified). Multi-asset cross-impact "decays rapidly in time" ([arXiv 2112.13213](https://arxiv.org/pdf/2112.13213v3)). The objects can still coincide on a chart. A displacement bar that leaves an FVG often holds stacked ask imbalances inside the gap, which makes "FVG range contains ≥ 3 stacked same-side FP rows" a codable descriptive flag.

**Starting parameters (design choices, not standards).** The diagonal ratio is **3.0** (300%, the top of Quantower's band). The minimum volume `vmin` on the dominant side is the 75th percentile of non-zero row volumes over the last 50 bars of the same layer. NinjaTrader's "min delta 10" is too low for ES in RTH, so the floor must scale with the instrument. A stack is **≥ 3 consecutive rows**. Rows are **1 tick for ES/MES, 4 ticks for NQ/MNQ and 2 ticks for CL/MCL**, within the notes' 2–4 range for the sparser contracts. A zero denominator is replaced by 1, following Sierra's "zeros as ones", so a 25-versus-0 cell does not become infinite.

## 4. Every zone is a swing extreme seen at higher resolution

Every object in this dimension is anchored to a swing. A demand base *is* the swing-low region. An order block is the extreme candle before a BOS. An FVG sits inside the displacement leg that created a new swing. Structure therefore supplies two things. It supplies the **qualifier**: did the departure close beyond a confirmed prior swing? And it supplies the **confirmation clock**: a zone that depends on a swing cannot exist before that swing is confirmed. The rule is `known_at = max(departure_close, swing_confirm_ts, bos_close)`, and no alert, trade or statistic may use the base candle's own timestamp ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md) gives the swing detector and its two timestamps). Each zone carries four structure tags, all cheap to compute from SWING(L) and STRUCTURE(L) (design from the notes):

| Tag | Meaning |
|---|---|
| `origin_swing_id` | The confirmed swing the base sits at |
| `bos_on_departure` | True if the departure leg closed beyond the last confirmed opposite swing ("BOS zone", the OB subtype); false = "internal" |
| `swing_level` | Internal or swing structure, matching LuxAlgo's split between short-lookback internal structure and long-lookback swing structure ([TradingView: SMC [LuxAlgo]](https://www.tradingview.com/script/CnB3fSph-Smart-Money-Concepts-SMC-LuxAlgo/)) |
| `swept_liquidity_before_departure` | True if the base's wick took out a prior equal low or swing low before the departure |

**Role reversal** (breaker, IFVG, "flip zone") is the same mechanism under three names. A *close* beyond the distal line invalidates the zone for its original polarity. It can optionally spawn a child zone with the same bounds and opposite polarity, tagged `parent_id`. No study tests role reversal at the zone level. Osler's order-clustering evidence supports acceleration *through* a level, not a polarity flip ([NY Fed SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf)). Flips are therefore off by default in every trigger except SD-03, which tests them explicitly, but they are always drawn in visual review.

**Sweeps into zones** are where the strongest evidence and this dimension meet. Osler found take-profit orders clustering *at* round numbers, which can explain reversals at support and resistance, and stop-loss orders clustering just *beyond* them, which can explain faster moves once a level breaks. The data were about 9,700 orders at one dealing bank, September 1999 to April 2000 ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). In her earlier test, published levels interrupted intraday FX trends **60.8% of the time against 56.2% for arbitrary levels** ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). A demand zone sitting just below an equal-lows cluster is the cleanest structural picture of that mechanism. The stops below the lows are the fuel, the zone's resting bids are the reflecting barrier, and a close back above the swept lows is the observable that the stops were absorbed. Two cautions bound this. Osler's data are about round numbers, not swing points. And a vendor's unverified tests found swept levels predicted *continuation* more often than reversal ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)). That is why the reclaim, not the sweep, is the trigger.

One design proposal makes zone invalidation consistent with the shared trend-change grades. **Z1** = a lower-layer wick beyond the distal (a test; the registry marks FILLED). **Z2** = a lower-layer close beyond the distal (provisional; working orders are cancelled and the setup stands aside). **Z3** = a close beyond the distal on the zone's own layer (INVALIDATED). Z1–Z3 mirror G1–G3, so a lower-timeframe close-through never kills a higher-timeframe zone on its own.

## 5. Higher-timeframe zones pick the side; lower layers only sharpen the entry

Every framework agrees on the layering. Seiden uses a larger chart to see where price sits on the "larger time frame supply/demand curve", and that decides buys versus sells on the smaller chart. A smaller-timeframe buy at or near higher-timeframe supply has very low odds ([FXStreet/OTA Q&A](https://www.fxstreet.com/education/lessons-from-the-pros-201106070000)). LuxAlgo says "a lower-timeframe zone nested inside a higher-timeframe one can fine-tune the entry while the larger zone frames the trade", and warns against "a demand zone directly beneath heavy higher-timeframe supply" ([LuxAlgo: Zone Scoring & Refinement](https://www.luxalgo.com/library/concept/zone-scoring-and-refinement.md)). It defines the curve as the range between the freshest higher-timeframe supply and demand zones. "Low on the curve" means near demand relative to the distance up to supply, and the curve gives location only ([LuxAlgo: Curve Position](https://www.luxalgo.com/library/concept/curve-position.md)). No source says how to set the curve when several candidate zones exist. This file's mechanical rule is a design proposal:

> **CURVE(t)** = (P − D) / (S − D), clamped to [0, 1]. P is the last trade. D is the proximal of the nearest ARMED D1 demand zone at or below P, and S is the proximal of the nearest ARMED D1 supply zone at or above P. If either side is missing on D1, use W1 zones. If still missing, use the last confirmed D1 swing low and high.

| Role | Layers (time bars) | Volume-bar version | Job |
|---|---|---|---|
| CONTEXT | W1 and D1 zones → CURVE; or STRUCTURE(D1/H4) | Clock time, unchanged | Which side is allowed |
| LOCATION | D1 or H4 zone, ARMED | Clock time, unchanged | Where to act |
| SETUP | H1 (swing) or M15 (intraday) refinement inside the zone; sweep or touch state | H1 stays on clock; intraday refinement on VB-A | Arms the trigger |
| TRIGGER | M15 or M5 structure shift, reclaim, or footprint stack | VB-A, VB-B or VB-C | When to act |
| MANAGEMENT | Stop beyond the refined distal; failsafe beyond the HTF distal; target at the opposing zone | Same prices | Risk and exit |

Each layer holds exactly one role, so a zone layer never also supplies the trigger. Adjacent layers sit about 4–6× apart, consistent with [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md). The **refinement algorithm** (from the notes) is look-ahead-free by construction. When price first enters a higher-timeframe zone Z, scan the lower-timeframe bars that formed Z (the same timestamps, all long closed) for a base, departure or OB lying inside Z. If one exists, it becomes the refined child zone, with bounds clipped to Z. Otherwise, use Z's proximal edge.

Two counting rules prevent false confidence. First, an H1 FVG inside a D1 FVG is **the same displacement sampled at two resolutions**. It counts once, and the lower-timeframe gap only sharpens the entry. The same holds for an OB inside an FVG inside a zone: one event, three labels. Second, a **W1** three-candle FVG spans about three weeks and usually coincides with a macro event, so the sample is tiny. W1 serves as curve and location only, never as a trigger. The only quantitative signal on nesting is a blog test on EURUSD. Daily-FVG context with 4H execution was the one configuration with any edge before costs: **+2,505 pips, profit factor 1.17, over 1,034 out-of-sample trades**. Trading daily FVGs on daily bars lost 216 pips ([Curupira](https://curupira-blog.pages.dev/blog/fvg-magnetism-fair-value-gaps)). That is consistent with the layering principle and proves nothing about futures.

## 6. The evidence supports liquidity at levels, not the named constructs

### Supported: resting orders, clustered stops and decaying bounces

The academic support is for **liquidity at levels**. Osler's stop and take-profit clustering explains both halves of zone trading: the reflection and the break ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html)). Kavajecz and Odders-White found that support and resistance levels coincide with peaks in limit-order-book depth. They argued technical rules work by **locating depth already on the book**, which is consistent with efficiency, and follow-ups in Taiwan and Chinese A-shares found similar links ([RFS 2004](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html); [Springer follow-up](https://link.springer.com/chapter/10.1007/978-1-4471-4600-1_44)). Chung and Bellotti's heuristic intraday levels "reverse price trends statistically significantly". **Levels with more prior bounces are more likely to bounce again, and bounce probability decays over time.** AR(1) processes do not explain the effect, and the authors attribute it to "a large volume of limit orders stacked at certain price levels" ([arXiv 2101.07410](https://arxiv.org/abs/2101.07410v1); a 2022 journal listing exists but is unverified as the same version: [IDEAS](https://ideas.repec.org/a/gam/jmathe/v10y2022i20p3888-d947666.html)). Support predicts trend interruptions better than resistance, but in one test still failed to beat buy-and-hold ([Zapranis & Tsinaslanidis](https://ideas.repec.org/a/taf/apfiec/v22y2012i19p1571-1585.html)). Order-flow imbalance explains contemporaneous price change strongly (Cont et al.), and in ES the effect lives at about one second (§3). None of this tests OTA bases specifically. Chung and Bellotti's levels are defined by bounces, not by base-and-departure geometry.

### Mixed: opening moves and gaps point both ways

Large opening moves in US stock index futures were followed by "highly significant intraday price reversals" from November 1987 to September 2002, more so after large *positive* opens. Significance was "sharply reduced" after a bid-ask cost proxy ([Grant, Wolf & Yu 2005](https://ideas.repec.org/a/eee/jbfina/v29y2005i5p1311-1327.html)). Yet the S&P 500 ETF's first half-hour return, measured from the prior close, predicts the last half-hour return from 1993 to 2013. The working paper reports an out-of-sample R² of about 1.2%, versions differ, and the effect replicates internationally and in commodity futures ([Gao, Han, Li & Zhou 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). On NASDAQ-100 futures, "a simplistic view of momentum and reversal proves untenable" ([Yu, Rentzler & Wolf](https://www.joim.com/nasdaq-100-index-futures-intraday-momentum-reversal)). A displacement bar alone therefore predicts neither continuation nor reversal; time of day and magnitude matter (SD-08). Gap fills split the same way. Daily gaps across stocks, FX and commodities from 2000 to 2015 behaved mostly "not inconsistent with market efficiency", and a follow-up on US stocks contradicted "the myth that price gaps tend to get filled" ([Caporale & Plastun](https://bura.brunel.ac.uk/bitstream/2438/25828/5/FullText.pdf)). Yet small ES RTH opening gaps filled very often in 2002–2004: **93% (71/76) at ≤ 1 point, 60% near 5 points, 40% (6/15) near 10 points** ([MyPivots](https://mypivots.com/gapfill)). As LuxAlgo notes, "any gap-fill statistic depends entirely on the definition used" ([LuxAlgo: Gap Fill](https://www.luxalgo.com/library/concept/gap-fill.md)).

### Contradicted: freshness

The retail rule that the first return to a zone is strongest, and that each touch "eats up" orders, is **contradicted** by the one study that measures it. Chung and Bellotti found more prior bounces mean a *higher* bounce probability. A weakly sourced TradingView post claims a 28.4% average support bounce rate and argues zones act as momentum barriers ([TradingView](https://www.tradingview.com/chart/NQ1!/E9llteXp-Support-and-Resistance-in-Financial-Markets/)), which conflicts with Chung and Bellotti and settles nothing. **Touch count is therefore logged as a feature, never used to auto-discard a zone.** Age, which the evidence does support, is what retires zones (§8).

### Untested or failed: FVGs, order blocks, breakers, CE and footprint stacks

No peer-reviewed study of FVGs, order blocks, breakers, mitigation blocks or consequent encroachment was found. LuxAlgo calls its own supply/demand checklist not "tested science" ([LuxAlgo: Zone Scoring](https://www.luxalgo.com/library/concept/zone-scoring-and-refinement.md)). The best available test is a non-peer-reviewed tick-replay study on EURUSD with about 42 million ticks ([Curupira](https://curupira-blog.pages.dev/blog/fvg-magnetism-fair-value-gaps)). **FVG fill rates converged with a random-level baseline (close ± 0.5 × ATR) by 240 bars.** Search snippets give about 91.2% versus 90.7%, a figure the researcher could not see in the fetched page. The "magnetic pull" matches what random-walk revisits produce. The best trade configuration reached profit factor 1.114 at 1.7:1 and, by the author's estimate, does not survive costs. **OHLC-bar backtests inflated daily-FVG profit factor to 4.28 against 0.80–1.17 on tick replay**, and a touch-entry strategy made +91 pips on bars but −452 on ticks. That last result is a direct warning for any zone-touch logic evaluated on bars. Other claims are vendor-grade: about 8 in 10 BTC 1-hour FVGs filled within 100 bars ([TradingView](https://www.tradingview.com/script/KDRll5dY/)). Edgeful calls fill-betting "actually the lower probability play" without methodology ([Edgeful](https://www.edgeful.com/blog/posts/fair-value-gap-best-practices-guide)), and tastylive (2015) reported a "very low probability" of filling short-timeframe gaps ([tastylive](https://tastylive.com/shows/market-measures/episodes/gap-reversals-04-14-2015)). No peer-reviewed study tests footprint diagonal or stacked imbalances, absorption or unfinished auctions in futures.

### Every concept, graded on the shared scale

The shared scale grades the *mechanism*: A = peer-reviewed support, B = consistent consensus with partial or indirect empirical support, C = anecdotal or vendor-only, D = tested and not supported as a standalone signal. A C-grade rule built on an A-grade mechanism is still a C-grade rule.

| Concept | Grade | What the grade rests on |
|---|---|---|
| Resting liquidity and stop/take-profit clustering at salient levels | **A** (mechanism) | Osler 2000/2003; Kavajecz & Odders-White 2004. FX and equities, 1990s–2000s; magnitude in modern CME books unknown |
| Bounce odds rise with prior bounces and decay with age | **A**, provisionally | Chung & Bellotti, a single study with unverified journal status. Supports age limits; contradicts freshness |
| OTA/Moreno base zone as a LOCATION | **B** | Broad practitioner consensus on the geometry; indirect support only through the two rows above |
| Odds-enhancer scores, numeric thresholds, "set and forget" | C | Unpublished checklist; community scripts |
| HTF curve / premium–discount; MTF zone nesting | C | Vendor logic; one EURUSD blog test |
| Freshness (first touch strongest) | **D** | Contradicted by Chung & Bellotti |
| Sweep of equal highs/lows or swing extremes | A mechanism, **C rule** | Osler's clusters are at round numbers, not swings; a vendor reports continuation after sweeps |
| Opening-move direction (reversal vs momentum) | A-grade studies in conflict; **C** as a trigger basis | Grant, Wolf & Yu vs Gao et al.; costs weaken the reversal |
| Small ES RTH opening-gap fill | C | 2002–2004 practitioner sample |
| Generic daily gap fill | D | Caporale & Plastun |
| FVG fill or "magnet" | **D** | Fill rates ≈ random baseline; best configuration fails costs (blog-grade test) |
| FVG or CE as support/resistance | C | Vendor-only; no statistics published |
| Order block, breaker, mitigation block, IFVG/flip | C | Vendor-only; no test found; Osler supports acceleration, not flips |
| Displacement as a definable bar | n/a | A definition; its predictive content is the opening-move row |
| Footprint diagonal/stacked imbalance, absorption, unfinished auction | C | Platform heuristics with no published validation |
| Book OFI and signed trade imbalance at sub-second to contemporaneous horizons | **A** | Cont et al.; Chordia & Subrahmanyam; ES one-second study |
| OFI as a minutes-horizon predictor for retail execution | **D** | ES shocks dissipate within about a second |
| Wyckoff spring as a zone sweep | C | Practitioner literature |

The practical reading for a trader who will not backtest (inference from the notes): prefer triggers whose mechanism has support. Those are the sweep of a stop cluster, the reaction at a level with prior bounces or resting depth, and time-of-day context. Treat FVG, OB and footprint labels as **descriptions** that make visual review faster, not as votes. With Rithmic depth data, the Kavajecz and Odders-White idea also becomes directly observable: does resting depth actually sit inside detected zones? That would turn a narrative into a measurable filter without a backtest.

## 7. On volume bars an FVG is an LVN by construction, so count it once

FVGs, liquidity voids, single prints and low-volume nodes (LVNs) describe one physical fact: **little trade happened at those prices.** They measure it with different instruments: candle overlap, time spent (TPO) and contracts traded (volume profile). LuxAlgo calls single prints "close cousins" of LVNs and FVGs: "A low-volume node is thinness measured in contracts traded; a single print is thinness measured in time spent". The FVG "is candle arithmetic… visible on any chart" ([LuxAlgo: Single Prints](https://www.luxalgo.com/library/concept/single-prints.md); [LuxAlgo: HVN/LVN](https://www.luxalgo.com/library/concept/high-low-volume-nodes.md)).

The notes derive a stronger statement for constant-volume bars (a derivation, not a measurement). On bars of fixed volume V, a bullish FVG means the middle bar alone traded the gap prices [H1, L3], and bars 1 and 3 did not. If the middle bar's range is R ticks and the gap is G ticks, the gap rows hold at most about V, and typically about **V × G / R**. A balanced price, by contrast, collects volume from many bars. **On volume bars an FVG is therefore nearly a sufficient condition for a local LVN; on time bars it is not**, because a one-minute news bar can carry enormous volume across its whole range, and a time-bar FVG can sit on a high-volume band. Volume bars also change FVG geometry. A displacement that is one time bar becomes several volume bars, because the volume clock speeds up in fast markets. It then appears as several smaller consecutive FVGs, or as none if the bars overlap. This file therefore merges consecutive same-direction gaps and filters gap height on the volume bar's own ATR ([05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md)).

| Pair | Relationship | Counting rule |
|---|---|---|
| FVG and LVN on volume bars | Same fact, two instruments | **One** "thin-traded band" factor, not two |
| FVG and LVN on time bars | Overlap not guaranteed | The FVG implies thinness only if a profile confirms it |
| Base zone and HVN | A short base often shows as a small HVN in the leg's anchored profile, with an LVN above (the departure) | A profile-native cross-check of the candle detector; still the same leg |
| OB + FVG + Fib OTE | OB at the leg origin (≈ 78.6–100% retrace); FVG mid-leg (CE often near 50–62%); OTE 0.62–0.79 | **One** location event with sub-labels |
| Zone and composite HVN/POC from a *different* period | Different input | Independent; this is genuine confluence |
| Zone and FIB-CLUSTER from *different* anchors | Partly independent | Count once per distinct leg |
| Zone and footprint absorption or stack | Different data (order flow) | Independent in data and time; use as TRIGGER, not LOCATION |
| Zone and options levels | Different market | Independent (see [12](12%20Options%20gamma%20and%20equity%20context.md)) |

ICT's OTE is the 0.62–0.79 band of the impulse leg, "best when it overlaps an order block or FVG" ([LuxAlgo: OTE](https://www.luxalgo.com/library/concept/optimal-trade-entry/)). The table explains why that overlap is mostly guaranteed by the geometry of a single leg. [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md) and [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) reach the same conclusion from the Fib side. In the shared registry ([07 Automation architecture](07%20Automation%20architecture.md)), base zones, OBs, FVGs and flips carry the `GEOMETRY` dimension tag plus a `leg_id`, so the confluence gate collapses them. Profile levels stay `PROFILE`, the independent dimension. Footprint stacks never enter the LOCATION gate in this file's proposals, so they need no new tag.

## 8. One registry and one clock make detection look-ahead-free

Every object here is known only after a confirming event. A zone is known at the departure close, an FVG at candle 3's close, an OB at the BOS close (provided the broken swing was already confirmed), and a footprint stack at its bar's close. All detectors run on `BarClosed` events, built from one tick stream after the as-of barrier of [07 Automation architecture](07%20Automation%20architecture.md) §2.12. The pseudocode below is a design proposal assembled from the notes' rules.

### Detection rules with explicit `known_at`

```python
# Shared predicates. ATR is always read through bar i-1, so a bar never sets its own threshold.
def is_base(b):              return b.body <= 0.50 * b.range
def DISPLACEMENT(L, i):
    b, atr = bar(L, i), ATR(L).asof(i - 1)
    return b.range >= 1.5 * atr and b.body >= 0.60 * b.range and close_in_outer(b, 0.25)

# --- Base/departure zone (OTA/Moreno), any layer L ---
def on_close_base(L, i):
    if not DISPLACEMENT(L, i): return
    base, j = [], i - 1
    while j >= 0 and len(base) < 6 and is_base(bar(L, j)) and (not base or overlaps(bar(L, j), base[-1])):
        base.append(bar(L, j)); j -= 1
    if not base or crosses_session_or_roll(bar(L, j), bar(L, i)): return
    pol  = DEMAND if bar(L, i).close > bar(L, i).open else SUPPLY
    prox, dist = body_to_wick(base, first_leg_out=bar(L, i), pol=pol)      # global convention (§1)
    h, atr = abs(prox - dist), ATR(L).asof(i - 1)
    if not 0.10 * atr <= h <= 1.0 * atr: return log_reject("width", L, i)
    REG.create(type="BASE", layer=L, pol=pol, prox=prox, dist=dist, ce=(prox + dist) / 2,
               pattern=classify(leg_in=bar(L, j), leg_out=bar(L, i)),       # RBR / DBR / RBD / DBD
               n_base=len(base), departure_atr=bar(L, i).range / atr, leg_id=LEG(L).current,
               origin_swing_id=SWING(L).nearest_extreme(base), state="PENDING",
               known_at=bar(L, i).close_ts)

# --- FVG (bullish shown): c1 = i-2, c2 = i-1, c3 = i ---
def on_close_fvg(L, i):
    c1, c2, c3, atr = bar(L, i - 2), bar(L, i - 1), bar(L, i), ATR(L).asof(i - 1)
    if crosses_session_or_roll(c1, c3) or c1.partial or c3.partial: return
    g = c3.low - c1.high
    if g > 0 and c2.close > c1.high and 0.25 * atr <= g <= 1.5 * atr:      # LuxAlgo close-beyond rule
        z = REG.create(type="FVG", layer=L, pol=DEMAND, prox=c3.low, dist=c1.high, ce=(c3.low + c1.high) / 2,
                       displacement=DISPLACEMENT(L, i - 1), smc_flag=(c2.close > c2.open),
                       leg_id=LEG(L).current, state="ARMED",                # c3 lies fully outside the gap
                       known_at=c3.close_ts)                                # NOT c2's timestamp (smc.py)
        REG.join_consecutive(z)                                             # merge with an FVG created at i-1

# --- Order block / BOS zone ---
def on_close_ob(L, i):
    S = SWING(L).last_high(confirmed_by=bar(L, i).close_ts)                 # the check smc.py omits
    if S and not S.taken and bar(L, i).close > S.price:
        S.taken = True
        k = argmin_last(lambda b: b.low, range(S.pivot_idx + 1, i)) or (i - 1)
        z = REG.create(type="OB", layer=L, pol=DEMAND, prox=body_top(bar(L, k)), dist=bar(L, k).low,
                       bos_level=S.price, bos_on_departure=True, swing_level=S.degree,
                       leg_id=LEG(L).current, state="PENDING",
                       known_at=max(bar(L, i).close_ts, S.confirm_ts))
        REG.link_subtype(z)        # a BASE zone on the same leg overlapping >= 50% absorbs it as its OB tag
```

### The zone registry and its state machine

One table holds every type: BASE, FVG, OB, FP_STACK, and FLIP children. Each record carries identity and provenance (`id, type, polarity, layer, instrument, contract/roll_id, created_bar, known_at, pattern, origin_swing_id, bos_on_departure, swept_liquidity_before_departure, leg_id, parent_id`). It carries geometry (`prox, dist, ce, height, height_atr, refined_child_ids`). And it carries unweighted features (`n_base, departure_atr, has_fvg, fp_stack_inside, margin_R, curve_at_touch, touches, age_bars`, plus optional `resting_depth_inside` from Rithmic depth snapshots). No weights are baked in: proposals read features as one condition per role. Records publish to the shared LEVELS registry of [07](07%20Automation%20architecture.md) with status ACTIVE (ARMED), TESTED (TOUCHED, MID_TOUCHED, FILLED), INVALIDATED or EXPIRED.

| State | Entered when | Notes |
|---|---|---|
| PENDING | A detector creates the record at `known_at` | Not tradable. A close beyond the distal before arming means INVALIDATED |
| ARMED | BASE/OB: excursion from proximal ≥ 2 × height **and** one bar of the zone's layer lies fully outside (Moreno's 2:1). FVG/FP_STACK: at creation if the creating bar lies outside, else at the first bar that does | `armed_at` stamped |
| TOUCHED(n) | Price trades to the proximal | n increments only after a valid departure (below) |
| MID_TOUCHED | Price trades to the CE | |
| FILLED | Price trades to the distal without a zone-layer close beyond it (Z1) | Still active |
| *Z2 flag* | A lower-layer bar closes beyond the distal | Cancel working orders; stand aside; not a state change |
| INVALIDATED | A bar of the zone's own layer closes beyond the distal (Z3) | Optionally spawns a FLIP child: same bounds, opposite polarity, `parent_id` |
| EXPIRED | `age_bars > max_age(layer)` | |
| MERGED | Absorbed by an overlapping same-polarity zone | Keeps a pointer to the survivor |

Touch order inside a bar comes from ticks, never from OHLC. The Curupira touch-entry result (+91 pips on bars, −452 on ticks) is the reason.

### Touches, width caps, age limits and merging

| Parameter | Pre-committed default | Basis |
|---|---|---|
| New touch | Counted only after price has been ≥ 0.5 × height beyond the proximal for ≥ 3 bars of the zone's layer | Notes: "≥ x × height or ≥ m bars" to avoid jitter; values are design |
| Width, BASE/OB | 0.10–1.0 × ATR(L); outside → rejected and logged | Notes: w_min ≈ 0.1, w_max 1.0–1.5 ATR |
| Width, FVG | Gap 0.25–1.5 × ATR(L) | Notes: ≥ 0.25–0.5 ATR; news-spike cap |
| Width, FP_STACK | ≥ 3 rows; no ATR cap | Platform default of 3 rows |
| `max_age` | W1 26 bars (design); D1 60 bars; H4 120 bars (≈ 20 ETH sessions, matching 08's level age); H1 200 bars; M15, M5 and VB tiers 2 sessions | Notes: D1 60–120, H1 ≈ 200, intraday 1–2 sessions; Chung & Bellotti decay |
| Merge | Same polarity and layer, overlap ≥ 50% of the smaller height (or gap < 0.25 × ATR(L)): take the union if it stays within the width cap, else keep the zone with larger `departure_atr`; the other becomes MERGED | LuxAlgo's two merge options; the tie-break is design |
| Opposite-polarity overlap | Never merged; labelled BPR for display | LuxAlgo balanced price range |
| Cross-layer nesting | Never merged; recorded as `refined_child_ids` (§5) | Design |

### Futures hygiene: rolls, sessions and the maintenance break

Three engineering rules come from the notes. First, build zones on the **actually traded contract**. At roll, D1 and W1 zones transfer to the new contract shifted by the calendar-spread price at the roll timestamp and are tagged `rolled = true`. Zones on H1 and below simply expire (design). A roll gap must never create a base or an FVG. Second, decide ETH versus RTH once per layer. ETH is the default here. RTH-only charts manufacture daily "gaps" that are opening gaps, not three-candle FVGs. The MyPivots ES statistics are RTH close-to-open gaps and belong to SD-08's context, not to the FVG detector. Third, the CME daily maintenance halt (17:00–18:00 ET) and the weekend reopen create gaps on 24-hour time charts, so no FVG or base may span a session break, and partial volume bars at session start are excluded from detection. Features are computed on the full-size contract even when orders go to the micro ([07](07%20Automation%20architecture.md) §2.2).

### Building footprints from Rithmic `LastTrade` aggressor flags

Rithmic's `LastTrade` message (template 150) carries `tradePrice`, `tradeSize`, an `aggressor` of BUY or SELL, and an `isSnapshot` flag for replayed database values ([07](07%20Automation%20architecture.md) §3). The aggressor flag gives exact buy and sell volume, better than Lee–Ready or tick-rule inference ([NinjaTrader 8](https://static.ninjatrader.com/support/helpGuides/nt8/order_flow_volumetric_bars.htm) documents the tick-rule fallback for last-only data).

```python
ROW_TICKS = {"ES": 1, "MES": 1, "NQ": 4, "MNQ": 4, "CL": 2, "MCL": 2}   # design; full-size contract feeds features
def on_trade(t):                                     # non-snapshot LastTrade only
    if t.is_snapshot: return
    r = row_index(t.price, ROW_TICKS[root(t)])       # integer key, never a float price
    for L in FOOTPRINT_LAYERS:                       # time bars and VB tiers; VB prints are split as in 07 §2.2
        fp = open_fp[L]
        if   t.aggressor == "BUY":  fp.ask[r] += t.size        # lifted the offer
        elif t.aggressor == "SELL": fp.bid[r] += t.size        # hit the bid
        else:                       fp.none[r] += t.size       # no aggressor: excluded from ratios

def on_close_fp(L, i, R=3.0, MIN_ROWS=3):
    fp, vmin = footprint(L, i), pct(nonzero_row_vol(L, last=50), 75)
    lo, hi = fp.min_row, fp.max_row
    buy  = {r for r in range(lo + 1, hi + 1) if fp.ask[r] >= vmin and fp.ask[r] >= R * max(fp.bid[r - 1], 1)}
    sell = {r for r in range(lo, hi)         if fp.bid[r] >= vmin and fp.bid[r] >= R * max(fp.ask[r + 1], 1)}
    for run in consecutive_runs(buy, MIN_ROWS):
        REG.create(type="FP_STACK", layer=L, pol=DEMAND, prox=row_top(max(run)), dist=row_bottom(min(run)),
                   rows=len(run), state="ARMED" if bar(L, i).close > row_top(max(run)) else "PENDING",
                   known_at=bar(L, i).close_ts)
    for run in consecutive_runs(sell, MIN_ROWS): ...                            # mirror, SUPPLY
    bar(L, i).features.update(delta=sum(fp.ask.values()) - sum(fp.bid.values()),
                              absorption_low=absorption(fp, side="SELL"), unfinished_high=fp.ask[hi] > 0 and fp.bid[hi] > 0)
```

The lowest row cannot carry a buy imbalance and the highest cannot carry a sell imbalance, as in Sierra's rule. Absorption at a low is coded as aggressive sell volume in the bottom two rows ≥ 2.0 × its 50-bar average, while the bar extends no more than max(2 ticks, 0.10 × ATR(L)) below the prior bar's low and closes in its upper half (design values). Whether Rithmic delivers CME aggressor summary trades or individual fills was not verified. That changes print counts but not per-price aggressor volume totals, which is what the footprint uses.

## 9. How to visually verify zones, FVGs and footprint imbalances on your charts

Visual review is the user's only validation step before forward testing, so the charts must show *when* each object became knowable, not just where it is. Draw every zone as a rectangle from its base bars, and put a second marker at `known_at`. Nothing may be actionable left of that marker, which is where "obvious" setups usually turn out to be untradeable, as the Pine documentation's warning about plotting pivots in the past makes clear ([Pine Script: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). The checklist below should be run on a frozen batch of charts, recording every instance including ugly ones, because review is itself a fitting loop ([Bailey et al.](https://scholarworks.wmich.edu/math_pubs/40/)).

1. **Clock.** For every zone, FVG and OB, the `known_at` marker sits at the departure close, candle 3's close or the BOS close. For OBs, the broken swing's confirmation marker lies left of the BOS bar.
2. **Drawing.** Proximal and distal follow the body-to-wick convention on every zone, and the stop sits at distal plus the buffer, not at the distal itself.
3. **Platform cross-check.** Overlay a known indicator, such as LuxAlgo's FVG with its threshold at 0, and explain every difference by a documented rule: the close-beyond-candle-1 condition, the ATR size filter, the session-break exclusion, or the mitigation definition. An unexplained difference is a bug.
4. **States.** Each zone's state log (TOUCHED, MID_TOUCHED, FILLED, Z2 flags, INVALIDATED) matches what the tick-replayed chart shows. A lower-layer close-through never invalidated a higher-layer zone, and jitter at the edge did not inflate the touch count.
5. **Volume-bar FVGs.** Overlay a session volume profile and confirm that volume-bar FVGs sit in thin bands, as the §7 derivation predicts. On time bars, expect exceptions on news bars, and treat each one as a case where "thin" was false.
6. **Footprint parity.** Configure one platform identically: NinjaTrader Volumetric (Diagonal, ratio 3.0, minimum delta = `vmin`, the same ticks per level and session template), Sierra Numbers Bars, or an ATAS cluster. Compare a sample of bars cell by cell. Mismatches usually trace to zero-denominator handling, row aggregation, or how implied and spread fills are classified.
7. **Rolls and breaks.** No zone or FVG spans a roll, the 17:00–18:00 ET maintenance halt or the weekend reopen, and rolled HTF zones show the `rolled` tag.
8. **Random-zone control (design proposal).** During forward validation, log "shadow" zones of identical height at random offsets of close ± 0.5 × ATR, mirroring the Curupira baseline. Count reactions at real and shadow zones the same way. This is not a backtest. It is a running control against the "magnet" illusion that fooled bar-based FVG tests.

# Part 2: proposals SD-01 to SD-08

## 10. Eight proposals share one registry, one risk frame and one order vocabulary

Each proposal below uses this dimension for LOCATION. Swing structure supplies CONTEXT and TRIGGER, and swings anchor the zones. Fibonacci and volume profile are never required components. Where a pairing with them is worth trying, it appears only under Relations and belongs in [11 Proposals confluence](11%20Proposals%20confluence.md). Every proposal is a hypothesis to forward-validate signal-only first, following [07 Automation architecture](07%20Automation%20architecture.md) §8.

### Common rules every SD proposal inherits

| Rule | Pre-committed default | Basis |
|---|---|---|
| Risk unit | 1R = a fixed dollar risk; `qty = floor(1R / (stop_ticks × tick_value))`; skip the trade if qty < 1 micro | [08](08%20Proposals%20price%20action%20and%20swing.md) |
| Daily loss cap | −2R per strategy; no new entries until the next trade date | 07 |
| Trade caps | 3 trades per day per strategy; ≤ 2 entries per zone (one re-arm after a stop-out if the zone is not INVALIDATED) | 07; per-zone cap is design |
| Consecutive losses | 3 → that strategy is disabled for the day | 07 |
| News blackout | No new entries from T−10 to T+30 minutes around scheduled high-impact releases (FOMC, CPI, NFP; EIA for CL). Resting limits are cancelled for the window. Scalps (SD-05, SD-07) flatten at T−2 min | 07; 08 |
| Sessions | ETH unless stated. RTH = 09:30–16:00 ET for ES/NQ, 09:00–14:30 ET for CL. No new entries 16:45–18:30 ET. Intraday proposals are flat 5 minutes before the RTH close | 08 |
| Stop buffer `buf` | max(2 ticks, 0.15 × ATR(trigger layer)). For resting-limit proposals, the trigger layer is the layer on which the limit is managed | Shared convention |
| Minimum stop | Widen a structural stop to 0.5 × ATR(trigger layer) if it is closer | Design |
| Orders | E1 close-trigger, E2 stop-entry and E3 level limit, with `slip` and `rr_floor` (skip if T1 < 1.0R) as defined in 08. An E3 fill counts in review only if price traded through the limit by ≥ 1 tick. Every entry carries a server-side bracket | 08; 07 |
| Confirmed inputs | Swings by `confirm_ts`; zones by `known_at`/`armed_at`; HTF bars only once closed | 01; 07 |
| Volume bars | VB-A/B/C sizes and nesting per 00; ignore a trigger bar that took > 30 minutes; every armed setup has a clock expiry | 05; 07 |
| Positions | One open position per instrument across the SD family | Design |
| Versioning | Any rule change starts a new `strategy_version` and a new sample | 07 |

### Shared building blocks

| Name | Meaning |
|---|---|
| `ZONE(L)` | Registry query on layer L: `type, pol, prox, dist, ce, height, state, touches, known_at, armed_at, leg_id, bos_on_departure, parent_id` (§8) |
| `DISPLACEMENT(L, i)` | Range ≥ 1.5 × ATR(L) through i−1, body ≥ 0.60 × range, close in the outer 25% (§2) |
| `FVG(L)` | LuxAlgo-rule gaps, 0.25–1.5 × ATR(L), consecutive gaps merged, `known_at` = candle 3 close (§8) |
| `FP_STACK(L, i)` | ≥ 3 consecutive same-side diagonal imbalance rows in bar i at ratio 3.0 with `vmin` (§3, §8) |
| `CURVE(t)` | Position between the nearest ARMED D1 demand and supply proximals, clamped to 0–1 (§5) |
| `MARGIN(Z)` | (proximal of the nearest ARMED opposing zone on Z's layer or higher − Z.prox) / (Z.prox − Z.dist + buf), in R |
| `REFINE(Z, L′)` | Lower-layer child zone built from the closed L′ bars that formed Z (§5) |
| `ZGRADE(Z, lo)` | Z1 / Z2 / Z3 against Z's distal, with `lo` as the lower layer (§4) |
| `POOL(L)` | Equal-lows (highs) cluster: ≥ 2 confirmed SWING(L) lows within 0.15 × ATR(L); level = the lowest low (highest high) |

### Eight proposals at a glance

| ID | Name | Style | Stack: time · volume | Regime | Evidence | Complexity |
|---|---|---|---|---|---|---|
| SD-01 | HTF zone with LTF CHoCH refinement | Swing (intraday variant) | D1 / H4 / H1 / M15 · D1 / H4 / H1 / VB-A | Price at the cheap or rich end of the HTF curve | B | High |
| SD-02 | BOS-origin zone, first-pullback limit | Swing | D1 / H4 · H4 / VB-A (intraday variant) | Fresh trend leg | C | Low |
| SD-03 | Flip-zone retest | Intraday to swing | H1 / M15 · H1 / VB-A | Breakout, transition | C | Med |
| SD-04 | Displacement-origin pullback | Intraday (RTH) | H1 / M15 · H1 / VB-A | Intraday trend | C | Med |
| SD-05 | FVG partial-fill continuation (control) | Scalp | M15 / M5 · VB-A / VB-B | Intraday trend | D | Low |
| SD-06 | Equal-lows sweep into an HTF zone, then reclaim | Intraday | D1 / H4 / M15 / M5 · D1 / H4 / VB-A / VB-B | HTF range or pullback | B | Med |
| SD-07 | Stacked footprint trigger inside an HTF zone | Scalp | H4 / M1 · H4 / VB-C | Price inside an HTF zone | C | High |
| SD-08 | Opening displacement: hold or fail | Intraday (RTH open) | D1 / M5 · D1 / VB-B | Sessions with an opening displacement | C | Med |

All proposals are written for longs; mirror every rule for shorts.

## SD-01 HTF zone with LTF CHoCH refinement

**At a glance.** Style: swing, with an intraday variant · Hold: 1–10 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: price arriving at an HTF zone at the cheap end of the curve, in a range or a pullback · Evidence: B for the location, C for the trigger · Complexity: High.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | CURVE ≤ 0.30 | D1 zones (W1 fallback) | Same, clock time |
| LOCATION | ARMED D1 or H4 demand zone with MARGIN ≥ 2.0R | D1 / H4 | Same, clock time |
| SETUP | Price has entered the zone; refined child built | H1 | H1 (clock) |
| TRIGGER | CHoCH_UP through a swing high formed after the touch | M15 | VB-A |
| MANAGEMENT | Stop under the in-zone low; Z3 failsafe; 2R and the opposing zone | H1 swings | Same |

On clock time stay W1, D1, H4 and H1 bars and their zones, CURVE, sessions, the blackout and the 10-session time stop. The **intraday variant** moves down one step: H4 zone, M15 refinement, M5 (VB-B) trigger, flat by the RTH close.

**Concept basis.** This is Seiden's rule that "larger time frame levels trump smaller" combined with LuxAlgo's nested refinement (§5). The supported mechanism is the reaction at levels where orders rest (§6, A), and the CHoCH lets the structure dimension do the timing ([01](01%20Swing%20points%20across%20timeframes.md); [02](02%20Multi%20timeframe%20price%20action.md)). Touch count is logged, not filtered, because freshness is contradicted.

**Context filter.** CURVE ≤ 0.30 at the trigger bar's close (≥ 0.70 for shorts).

**Location.** An ARMED (or TOUCHED, MID_TOUCHED, FILLED) D1 or H4 demand zone, not EXPIRED, with MARGIN ≥ 2.0R.

**Setup.** An H1 bar trades to or below the proximal. At that close, REFINE(Z, H1) builds the child zone; if none exists, Z itself is used.

**Trigger.** An M15 bar closes above a confirmed M15 swing high whose pivot formed after the touch (CHoCH_UP), with no M15 or H1 close below Z's distal since the touch (no Z2).

**Entry order.** E1 at the trigger close plus `slip`, valid for one M15 bar.

**Risk & management.** Stop = min(child distal, lowest low since the touch) − buf(M15). Failsafe: exit at market if an H4 bar (D1 for a D1 zone) closes below Z's distal (Z3). T1 = +2.0R; take 50% and move the stop to breakeven. T2 = the opposing zone used in MARGIN. Trail the rest under confirmed H1 swing lows − buf(H1). Time stop: the first H4 close after 10 sessions without T1.

**Filters.** ETH; blackout; ≤ 2 entries per zone; skip if ATR(D1) > 2.0 × its 100-session median (design, as in 08).

**Automation spec.**

```python
# IDLE → WATCH → IN_ZONE → ORDER_PENDING → IN_POSITION → MANAGED → CLOSED
# IN_ZONE ⇄ SUSPENDED (Z2; resumes on an H1 close back inside) ; → INVALIDATED (Z3) ; → EXPIRED
on_close(H1):
    for Z in demand_zones(D1, H4, states=ARMED..FILLED):
        if st[Z] == IDLE and MARGIN(Z) >= 2.0:                 st[Z] = WATCH
        if st[Z] == WATCH and H1.low <= Z.prox:                st[Z], Z.child, Z.t_touch = IN_ZONE, REFINE(Z, H1), H1.close_ts
        if st[Z] in (WATCH, IN_ZONE) and H1.low > Z.prox + Z.height and bars_since_touch(Z, H4) >= 3:
            st[Z] = EXPIRED                                    # left the zone without a trigger
on_close(M15):
    for Z in in_zone_setups():
        g = ZGRADE(Z, lo=M15)
        if g == "Z3": st[Z] = INVALIDATED; continue
        st[Z] = SUSPENDED if g == "Z2" else IN_ZONE
        ev = STRUCTURE(M15)
        if st[Z] == IN_ZONE and CURVE(M15.close_ts) <= 0.30 and ev.event == "CHoCH_UP" \
           and ev.broken_swing.pivot_ts > Z.t_touch and RISK.ok():
            stop = min(Z.child.dist, low_since(Z.t_touch)) - BUF(M15)
            ENTER(E1, LONG, M15.close, expiry=M15, bracket=(stop, T1=r_multiple(2.0), T2=opposing(Z).prox))
            st[Z] = ORDER_PENDING
```

| Parameter | Default | Reason |
|---|---|---|
| `curve_long` / `curve_short` | 0.30 / 0.70 | Notes' curve thresholds |
| `margin_min` | 2.0R | Notes: 2–3; low end chosen |
| Zone layers · refine · trigger | D1, H4 · H1 · M15 CHoCH (close-based) | 4–6× layer spacing |
| `t1` · `time_stop` | 2.0R · 10 sessions | Design |
| Inherited | `buf`, minimum stop, `slip`, `rr_floor`, caps | Common rules |

**Visual review checklist.**
1. The zone's `known_at` and `armed_at` markers lie left of the touch.
2. The CURVE value at the trigger is printed, with the demand and supply zones it used drawn.
3. The broken M15 swing high's confirmation marker lies inside the zone episode, after the touch.
4. No M15 or H1 close below the distal precedes the trigger, and the touch count is shown.

**Failure modes & regime fit.** The setup works when the HTF range or pullback holds. It loses when a strong HTF trend runs through demand: "low on the curve" can mean the curve itself is collapsing, so CURVE goes stale when its opposing zone is old. Deep wicks before the CHoCH widen stops. In trends with no ARMED zones it is silent, which is acceptable.

**Relations.** PA-01 has the same tide-wave-ripple shape with an ATR-depth location ([08](08%20Proposals%20price%20action%20and%20swing.md)). Run one or the other per D1 leg. SD-02 works the same zones with a resting limit, and the first fill owns the zone. SD-07 is an alternative TRIGGER to swap in, never to stack. An HVN cross-check of the zone, or a Fib depth reading, belongs in the CX family.

## SD-02 BOS-origin zone, first-pullback limit

**At a glance.** Style: swing · Hold: 1–15 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: a fresh H4 trend leg inside a D1 uptrend · Evidence: C · Complexity: Low.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars (intraday variant) |
|---|---|---|---|
| CONTEXT | STRUCTURE(D1).state = UP | D1 | H4 (clock) |
| LOCATION | Demand zone with `bos_on_departure` and touches = 0 | H4 | VB-A |
| SETUP | ARMED; departure extreme ≥ 2.0R above the proximal | H4 | VB-A |
| TRIGGER | Resting E3 limit at the proximal (the limit is the trigger) | H4-managed | VB-A-managed |
| MANAGEMENT | Stop at distal − buf; T1 at the departure extreme | H4 | VB-A |

The swing version is entirely on clock time. The volume variant runs intraday on VB-A zones with H4 context, and its limits expire after 2 sessions.

**Concept basis.** OTA's set-and-forget: limit at the proximal, stop beyond the distal, target the opposing move ([LuxAlgo: S&D Zones](https://www.luxalgo.com/library/concept/supply-and-demand-zones.md)). Moreno's 2:1 plus "consolidate away" supplies the arming rule. The BOS requirement is the order block restated (§2): "departures that break a prior swing point" carry more weight. **The touches = 0 condition is the freshness assumption graded D in §6.** It is kept deliberately, because a resting limit at the proximal can only test the first return. Read against SD-01's touch-count field, its forward log is the cleanest test of freshness on the user's own data.

**Context filter.** STRUCTURE(D1).state = UP. A G2 flag against the D1 trend cancels the limit until it clears; a G3 CHoCH_DOWN invalidates the setup.

**Location.** An H4 BASE or OB zone with `bos_on_departure = true`, `swing_level = swing`, touches = 0, within the width cap.

**Setup.** The zone is ARMED, and X, the highest high since `known_at`, satisfies (X − prox) ≥ 2.0 × (prox − dist + buf).

**Trigger and entry order.** E3 buy limit at the proximal, placed at the first H4 close after the setup holds. It is re-checked at each H4 close and valid until the zone EXPIRES (120 H4 bars). It is cancelled during blackouts and from Friday 16:45 ET to Sunday 18:30 ET, then re-placed.

**Risk & management.** Stop = distal − buf(H4). T1 = X, a retest of the departure extreme; take 50% and move the stop to breakeven. T2 = the nearest ARMED H4 or D1 supply proximal above X; with none, trail under confirmed H4 swing lows − buf(H4). Time stop: 15 sessions.

**Filters.** ETH; one fill per zone (after the first touch the zone no longer qualifies); news and weekend cancellation as above.

**Automation spec.**

```python
# IDLE → LIMIT_WORKING → IN_POSITION → MANAGED → CLOSED ; LIMIT_WORKING → PAUSED (blackout, weekend, G2) → LIMIT_WORKING
# terminal: EXPIRED (zone age), INVALIDATED (zone Z3 or D1 G3), USED (touched with no fill)
on_close(H4):
    for Z in ZONE(H4) where Z.pol == DEMAND and Z.bos_on_departure and Z.touches == 0 and Z.state == "ARMED":
        X = high_since(Z.known_at)
        ok = STRUCTURE(D1).state == "UP" and (X - Z.prox) >= 2.0 * (Z.prox - Z.dist + BUF(H4))
        if st[Z] == IDLE and ok and RISK.ok():
            ENTER(E3, LONG, Z.prox, expiry=Z.expiry, bracket=(Z.dist - BUF(H4), T1=X, T2=opposing(Z).prox))
            st[Z] = LIMIT_WORKING
        if st[Z] == LIMIT_WORKING and (in_blackout() or weekend_window() or G2_against(D1)): pause(Z)
```

| Parameter | Default | Reason |
|---|---|---|
| Zone layer · BOS required | H4 · yes | OB restated; LuxAlgo's swing-break weighting |
| `touches` | 0 | Deliberate freshness test |
| `reward_to_extreme` | ≥ 2.0R | Notes' profit-margin range, low end |
| Expiry · time stop | 120 H4 bars · 15 sessions | Registry age; design |

**Visual review checklist.**
1. The base, the departure bar and the broken H4 swing are shown, with the swing's confirmation marker left of the departure close.
2. The `armed_at` marker sits where the 2:1 excursion and one fully-outside bar first coincide.
3. The limit line sits exactly on the proximal, and the fill is counted only if price traded through by ≥ 1 tick.
4. The stop sits at distal − buf.

**Failure modes & regime fit.** Resting limits are adversely selected: they fill on every collapse. The loss case is a failed breakout that V-reverses through the zone. Trends that never pull back produce no fill, which is a miss, not a loss. Weekend and news cancellation limit gap fills.

**Relations.** PA-03 owns the first pullback after a break in the PA family; on the same H4 BOS, run only one. SD-01 may trade later touches of the same zone once SD-02's limit is used. FIB-07 measures the same leg ([10](10%20Proposals%20Fibonacci.md)): one location event, so never both.

## SD-03 Flip-zone retest

**At a glance.** Style: intraday to swing · Hold: 1 hour to 3 sessions · Instruments: ES/MES, NQ/MNQ, CL/MCL on ETH · Regime: breakout or transition · Evidence: C · Complexity: Med.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | The invalidating close was also an H1 BOS_UP or CHoCH_UP | H1 | H1 (clock) |
| LOCATION | FLIP child (demand) of an ARMED H1 supply zone, first return | H1 | H1 |
| SETUP | Child ARMED within 24 H1 bars of the flip | H1 | H1 |
| TRIGGER | Rejection close back above the child proximal | M15 | VB-A |
| MANAGEMENT | Stop under the child distal; T1 at the breakout-leg high | M15 | VB-A |

H1 bars and zones, sessions and the blackout stay on clock time.

**Concept basis.** Breakers, IFVGs and flip zones share one claim: a level closed through changes role (§2, §4). The practitioner story is that participants trapped on the wrong side exit at breakeven on the retest. It is untested. Osler supports acceleration *through* levels, not polarity flips. SD-03 is the only SD proposal in which flips trade, so its forward log isolates that claim.

**Context filter.** The H1 close above the supply zone's distal must also register as STRUCTURE(H1) BOS_UP or CHoCH_UP.

**Location.** The FLIP child keeps the parent's bounds. Its proximal is the old distal (the top edge) and its distal is the old proximal. Only the first return counts.

**Setup.** The child is ARMED (high ≥ child.prox + 1.0 × height, with one H1 bar fully above) within 24 H1 bars of the flip; otherwise it EXPIRES.

**Trigger.** An M15 bar with low ≤ child.prox and close > child.prox, within 3 M15 bars of the first entry into the child, with no M15 close below child.dist.

**Entry order.** E1 at the trigger close plus `slip`, valid one M15 bar.

**Risk & management.** Stop = child.dist − buf(M15). T1 = the highest high since the flip (50% off, stop to breakeven). T2 = +2.0R or the nearest ARMED opposing zone, whichever is nearer. Time stop: 12 H1 bars.

**Filters.** ETH; blackout; one trade per child; parents wider than the 1.0 × ATR(H1) cap never produce children.

**Automation spec.**

```python
# FLIPPED(child) → ARMED → RETEST → ORDER_PENDING → IN_POSITION → CLOSED ; terminal EXPIRED, INVALIDATED
on_zone_invalidated(P):                                  # emitted by the registry on a Z3 close
    if P.layer == H1 and P.pol == SUPPLY and STRUCTURE(H1).event in ("BOS_UP", "CHoCH_UP"):
        C = REG.flip(P)                                  # same bounds, pol=DEMAND, parent_id=P.id, known_at=close
on_close(M15):
    for C in flips(H1, state="ARMED"):
        if M15.low <= C.prox and M15.close > C.prox and bars_since_first_entry(C, M15) <= 3 \
           and not closed_below(C.dist, M15, since=C.first_entry) and RISK.ok():
            ENTER(E1, LONG, M15.close, expiry=M15, bracket=(C.dist - BUF(M15), T1=high_since(C.known_at), T2=r_or_zone(2.0)))
```

| Parameter | Default | Reason |
|---|---|---|
| Parent layer · trigger | H1 · M15 (VB-A) | 4× spacing |
| `arm_away` · `arm_window` | 1.0 × height · 24 H1 bars | Design |
| `rejection_window` | 3 M15 bars | Mirrors 08's `k_2b` |

**Visual review checklist.**
1. The parent zone and the H1 close that broke it are shown, with the structure label on that close.
2. The child is drawn in the new colour, with `parent_id` displayed.
3. The trigger bar wicks into the child and closes above its proximal.
4. The stop sits below the old proximal minus buf.

**Failure modes & regime fit.** It works in breakouts that retest. It fails when the break was a stop run that fully reverses, which is SD-06's thesis on the other side. Choppy ranges flip zones back and forth.

**Relations.** PA-03's breakout-pullback and CX-05's accepted break retest test the same retest on swing and profile levels ([08](08%20Proposals%20price%20action%20and%20swing.md); [11](11%20Proposals%20confluence.md)). On one level, run one.

## SD-04 Displacement-origin pullback

**At a glance.** Style: intraday (RTH) · Hold: 20 minutes to 4 hours · Instruments: ES/MES, NQ/MNQ (CL/MCL in its RTH) · Regime: intraday trend · Evidence: C · Complexity: Med.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | STRUCTURE(H1).state = UP | H1 | H1 (clock) |
| LOCATION | Origin = [min(low[d−1], low[d]), open[d]], height ≤ 1.0 × ATR(setup) | M15 | VB-A |
| SETUP | DISPLACEMENT bar d that closes above the last confirmed setup-layer swing high | M15 | VB-A, also duration ≤ 0.5 × the 20-bar median |
| TRIGGER | E3 limit at the origin top | M15-managed | VB-A-managed |
| MANAGEMENT | Stop under the origin; T1 at the displacement high | M15 | VB-A |

H1 bars, RTH windows, the blackout and the 120-minute expiry stay on clock time. The location is derived from the setup bar.

**Concept basis.** The displacement is OTA's departure and Moreno's extended-range candle (§2). Its origin is the single-bar order block. The duration filter uses a volume-bar-native fact: a wide *and* fast bar means impact plus urgency ([05](05%20Volume%20bars%20versus%20time%20bars.md)). The time box is the hypothesis. The origin is assumed to matter only while the move is fresh, consistent with stop-driven moves that stay significant "for hours, although not for days" ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)) and with bounce odds that decay with age. Displacement's own predictive content is mixed (§6), hence grade C.

**Context filter.** STRUCTURE(H1).state = UP on ETH swings.

**Setup.** DISPLACEMENT(M15, d) closes between 10:00 and 15:00 ET (CL: 09:30–13:30 ET) above the last confirmed M15 swing high. SD-08 owns the first 30 minutes.

**Location.** The origin box as in the table. Reject it if its height exceeds 1.0 × ATR(M15).

**Trigger and entry order.** E3 buy limit at open[d], placed at d's close. It is valid for 8 setup-layer bars and at most 120 minutes. Cancel it if price trades above high[d] + 1.0 × range[d] before the fill.

**Risk & management.** Stop = origin bottom − buf(M15). T1 = high[d] (50% off, stop to breakeven), subject to `rr_floor`. T2 = high[d] + range[d], a measured-move reference distance, not a forecast. Otherwise exit 5 minutes before the RTH close.

**Filters.** RTH only; blackout (news displacements are excluded by the window); one entry per displacement.

**Automation spec.**

```python
# IDLE → LIMIT_WORKING → IN_POSITION → MANAGED → CLOSED ; terminal EXPIRED (bars/clock), RAN_AWAY, INVALIDATED (Z3 on M15)
on_close(M15, d):
    s = STRUCTURE(M15)
    if STRUCTURE(H1).state == "UP" and DISPLACEMENT(M15, d) and s.event == "BOS_UP" \
       and in_window("10:00", "15:00") and RISK.ok():
        lo, top = min(bar(M15, d - 1).low, bar(M15, d).low), bar(M15, d).open
        if top - lo <= 1.0 * ATR(M15).asof(d - 1):
            ENTER(E3, LONG, top, expiry=min(8 * M15, minutes(120)),
                  bracket=(lo - BUF(M15), T1=bar(M15, d).high, T2=bar(M15, d).high + bar(M15, d).range),
                  cancel_if=lambda px: px > bar(M15, d).high + bar(M15, d).range)
```

| Parameter | Default | Reason |
|---|---|---|
| `DISPLACEMENT` | 1.5 ATR · body 0.60 · outer 25% | §2 shared definition |
| `vb_fast` | duration ≤ 0.5 × 20-bar median (VB only) | Design from 05's "fast and wide" |
| `expiry` | 8 bars and ≤ 120 minutes | Design; Osler "hours" |
| `window` | 10:00–15:00 ET (CL 09:30–13:30) | Design |

**Visual review checklist.**
1. The displacement bar is highlighted, with its range in ATR printed and the broken swing's confirmation marker to its left.
2. On volume bars, the bar's duration is printed next to the 20-bar median.
3. The origin box spans the prior bar's low to the displacement open, and the limit expiry is marked in clock time.
4. Unfilled cases are counted alongside filled ones.

**Failure modes & regime fit.** It works in orderly intraday trends. It fails on blow-off displacements that fully retrace, and on late-day displacements with little time left. It misses moves that never pull back.

**Relations.** SD-05 works the *same* displacement at the shallower CE. Never run both on one leg; the first order to fill owns it. VP-07's breakout-leg LVN hold is the profile-dimension version of the same pullback ([09](09%20Proposals%20volume%20profile.md)).

## SD-05 FVG partial-fill continuation on volume bars (control experiment)

**At a glance.** Style: scalp · Hold: 5–60 minutes · Instruments: ES/MES, NQ/MNQ, RTH 10:00–15:30 ET · Regime: intraday trend · Evidence: **D** · Complexity: Low.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | STRUCTURE(VB-A).state = UP | M15 | VB-A |
| LOCATION | The FVG's CE | M5 | VB-B |
| SETUP | Bullish FVG(VB-B) whose middle bar is a DISPLACEMENT | M5 | VB-B |
| TRIGGER | E3 limit at the CE | M5-managed | VB-B-managed |
| MANAGEMENT | Stop under the FVG distal; T1 at the high since the gap | M5 | VB-B |

The RTH window, blackout and the 45-minute expiry stay on clock time.

**Concept basis.** This is the most popular retail ICT entry: a midpoint touch as "filled enough" ([LuxAlgo: FVG concept](https://www.luxalgo.com/library/concept/fair-value-gap.md)). It is **graded D** because the only tick-level test found fill rates matching a random baseline, and its best configuration failed costs (§6). It is included as a **control experiment**, the cheapest way to see whether FVGs add anything on the user's own ES and NQ data. On volume bars the FVG ≈ LVN (§7), so no LVN or OTE condition may be stacked on it.

**Context filter.** STRUCTURE(VB-A).state = UP.

**Setup.** FVG(VB-B) is created with `displacement = true`, gap 0.25–1.5 × ATR(VB-B), and consecutive gaps merged.

**Location, trigger and entry order.** E3 buy limit at the CE, placed at `known_at`. It is valid for 10 VB-B bars and at most 45 minutes, and cancelled if the gap reaches FILLED first.

**Risk & management.** Stop = the FVG distal (candle 1's high) − buf(VB-B). T1 = the highest high since `known_at` (50% off, stop to breakeven). T2 = +2.0R. Time stop: 20 VB-B bars.

**Filters.** RTH 10:00–15:30 ET; blackout; ≤ 3 trades per day.

**Automation spec.**

```python
# IDLE → LIMIT_WORKING → IN_POSITION → CLOSED ; terminal EXPIRED, FILLED_FIRST ; every signal also logs a SHADOW twin
on_fvg_created(G):                                     # registry event at candle-3 close, layer VB-B
    if G.pol == DEMAND and G.displacement and STRUCTURE(VB_A).state == "UP" and in_window("10:00", "15:30") and RISK.ok():
        ENTER(E3, LONG, G.ce, expiry=min(10 * VB_B, minutes(45)),
              bracket=(G.dist - BUF(VB_B), T1=high_since(G.known_at), T2=r_multiple(2.0)))
        log_shadow(height=G.height, center=VB_B.close + uniform(-0.5, 0.5) * ATR(VB_B))   # §9 control
```

| Parameter | Default | Reason |
|---|---|---|
| Gap filter | 0.25–1.5 × ATR(VB-B) | §2 |
| Entry depth | CE (50%) | The tested claim |
| `expiry` | 10 bars and ≤ 45 minutes | Design |
| Retirement rule | After 100 signals, retire if the CE-reaction rate does not exceed the shadow zones' rate | Design; pre-committed before the sample starts |

**Visual review checklist.**
1. The three candles are marked, with `known_at` on candle 3, not candle 2.
2. Merged consecutive gaps show as one box.
3. A session profile overlay shows the gap in a thin band (§7).
4. The shadow zone for the same signal is drawn in grey, and its reaction is scored the same way.

**Failure modes & regime fit.** This is expected to look better on bars than on ticks. Review fills only with the traded-through rule. It fails in rotations where gaps fill completely.

**Relations.** SD-04 is the deep-pullback alternative on the same leg; run one. FIB-07 and CX-10 also enter retraces of a single impulse leg ([10](10%20Proposals%20Fibonacci.md); [11](11%20Proposals%20confluence.md)). FVG, OTE and order block there would be one location event, not three.

## SD-06 Equal-lows sweep into an HTF zone, then reclaim

**At a glance.** Style: intraday · Hold: 30 minutes to 1 day · Instruments: ES/MES, NQ/MNQ, CL/MCL, ETH 03:00–16:00 ET · Regime: HTF range or pullback · Evidence: B (indirect support from stop clustering and depth at levels; the specific sweep rule is unvalidated) · Complexity: Med.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | CURVE ≤ 0.50 | D1 zones | Clock time |
| LOCATION | ARMED H4 or D1 demand zone with a POOL(M15) level 0–0.5 × ATR(H4) above its proximal | H4 / D1 | Clock time |
| SETUP | A sweep bar trades ≥ `minpen` below the pool and reaches the proximal | M15 | VB-A |
| TRIGGER | A close back above the pool level within 3 setup bars of the sweep | M5 | VB-B |
| MANAGEMENT | Stop under min(sweep low, zone distal); T1 at the nearest swing high | M5 / M15 | VB-B / VB-A |

D1, H4, CURVE, the session window and the 6-hour time stop stay on clock time.

**Concept basis.** Stop-loss orders cluster just beyond salient prices and accelerate moves when hit, while take-profit and resting orders reflect price at the level ([Osler 2003](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). Depth peaks at technical levels ([Kavajecz & Odders-White](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). The pool supplies the stops, the zone supplies the resting bids, and the reclaim is the observable that the stops were absorbed (§4). Wyckoff's spring is the same event at a range scale. The weak points are that Osler's clusters are at round numbers, not swings, and that a vendor reports sweeps leading to continuation more often ([ThorTradeCopier](https://thortradecopier.com/blog/does-ict-smart-money-concepts-work)). The reclaim close is therefore mandatory.

**Context filter.** CURVE ≤ 0.50.

**Location.** An ARMED H4 or D1 demand zone. POOL(M15) is ≥ 2 confirmed M15 swing lows within 0.15 × ATR(M15), and its level lies between Z.prox and Z.prox + 0.5 × ATR(H4).

**Setup.** An M15 bar trades below the pool by ≥ `minpen` = max(1 tick, 0.10 × ATR(M15)), and its low is ≤ Z.prox.

**Trigger.** An M5 bar closes above the pool level within 3 M15 bars (45 minutes) of the sweep bar, with no M15 close below Z.dist in between (no Z2).

**Entry order.** E1 at the trigger close plus `slip`, valid one M5 bar.

**Risk & management.** Stop = min(sweep low, Z.dist) − buf(M5). T1 = the nearest confirmed M15 swing high ≥ 1R above entry, else +2.0R (50% off, stop to breakeven). T2 = the nearest ARMED opposing H4 zone's proximal. Time stop: 6 hours.

**Filters.** ETH 03:00–16:00 ET; blackout; one trade per pool.

**Automation spec.**

```python
# IDLE → POOL_OVER_ZONE → SWEPT → ORDER_PENDING → IN_POSITION → CLOSED ; terminal EXPIRED (45 min after sweep), SUSPENDED/INVALIDATED (Z2/Z3)
on_close(M15):
    for Z in demand_zones(H4, D1, state=ARMED..FILLED):
        P = POOL(M15).nearest_above(Z.prox, within=0.5 * ATR(H4))
        if P and st[Z] == IDLE: st[Z] = POOL_OVER_ZONE; Z.pool = P
        if st[Z] == POOL_OVER_ZONE and M15.low <= P.level - MINPEN(M15) and M15.low <= Z.prox:
            st[Z], Z.sweep_low, Z.t_sweep = SWEPT, M15.low, M15.close_ts
on_close(M5):
    for Z in swept_setups():
        if minutes_since(Z.t_sweep) > 45 or closed_below(Z.dist, M15, since=Z.t_sweep): st[Z] = EXPIRED; continue
        if M5.close > Z.pool.level and CURVE(M5.close_ts) <= 0.50 and RISK.ok():
            stop = min(Z.sweep_low, Z.dist) - BUF(M5)
            ENTER(E1, LONG, M5.close, expiry=M5, bracket=(stop, T1=next_swing_high_or_r(M15, 1.0, 2.0), T2=opposing(Z).prox))
```

| Parameter | Default | Reason |
|---|---|---|
| Pool | ≥ 2 M15 swing lows within 0.15 × ATR(M15) | Shared EQ tolerance |
| `pool_gap` | ≤ 0.5 × ATR(H4) above the proximal | Notes' sweep-into-zone rule |
| `minpen` · `reclaim_window` | max(1 tick, 0.10 × ATR(M15)) · 3 M15 bars | 08 family defaults |
| `curve_max` | 0.50 | Design: lower half of the HTF range |

**Visual review checklist.**
1. The pool's member lows are marked with their confirmation markers, and the zone is drawn below them.
2. The sweep bar's wick crosses the pool and reaches the proximal.
3. The M5 reclaim close is above the pool level within 45 minutes.
4. The stop sits below the lower of the sweep low and the distal.

**Failure modes & regime fit.** It works in ranges and pullbacks where stops are absorbed. It fails in trend days, where the sweep is the start of the cascade and the reclaim is brief. The 45-minute window and the Z2 rule cut those short.

**Relations.** PA-02 and PA-14 trade the same mechanism without a zone ([08](08%20Proposals%20price%20action%20and%20swing.md)). When an ARMED zone sits under the pool, SD-06 owns the level. CX-10 enters a Fib retrace after the same reclaim and CX-09 trades the spring at composite value ([11](11%20Proposals%20confluence.md)); never both on one event.

## SD-07 Stacked footprint trigger inside an HTF zone

**At a glance.** Style: scalp · Hold: 1–20 minutes · Instruments: ES/MES first; NQ/MNQ and CL/MCL with wider rows · Session: RTH · Regime: price inside an HTF zone · Evidence: C · Complexity: High.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | STRUCTURE(H4).state ≠ DOWN | H4 | Clock time |
| LOCATION | Price inside an ARMED H4 or D1 demand zone | H4 / D1 | Clock time |
| SETUP | Zone touched within the last 30 minutes, no Z2 | M1 | VB-C |
| TRIGGER | Up-closing bar with FP_STACK ≥ 3 buy rows, lowest row inside the zone | M1 | VB-C |
| MANAGEMENT | Stop under the stack; 1R and 2R; 15-minute time stop | M1 | VB-C |

H4, D1, the RTH window, the 30-minute setup window and the 15-minute time stop stay on clock time.

**Concept basis.** The zone narrative says unfilled demand rests at the base. A buy stack inside the zone is the measurable event that aggressive buyers actually appeared there. The trigger turns the story into a pre-registered observable. It is **not** a forecast. Order-flow imbalance explains *contemporaneous* price change ([Cont et al.](https://arxiv.org/abs/1011.6402)), and in ES shocks "dissipate almost entirely within a second" ([arXiv 2508.06788](https://arxiv.org/abs/2508.06788v2)). By the bar close, the stack's impact is already in the price. Quantower's hold-versus-slice ambiguity (§3) is resolved by pre-registration: the stack counts in its own direction, with no retest required. The data come from Rithmic `LastTrade` aggressor flags (§8).

**Context filter.** STRUCTURE(H4).state ≠ DOWN.

**Location and setup.** An ARMED (through FILLED) H4 or D1 demand zone, touched within the last 30 minutes, with no VB-B or M5 close below its distal.

**Trigger.** A VB-C bar closes up (close > open, close in the upper half of its range) containing FP_STACK ≥ 3 buy rows at ratio 3.0 with `vmin`, and the stack's lowest row lies inside [Z.dist, Z.prox].

**Entry order.** E1 at the trigger close plus `slip`, valid one VB-C bar.

**Risk & management.** Stop = min(stack bottom, bar low) − buf(VB-C), widened to 0.5 × ATR(VB-C). T1 = +1.0R (50% off, stop to breakeven). T2 = +2.0R. Time stop: 15 minutes.

**Filters.** RTH 09:35–15:50 ET; blackout; partial VB bars excluded; features computed on the full-size contract.

**Automation spec.**

```python
# IDLE → ZONE_TOUCHED (30-min clock) → ORDER_PENDING → IN_POSITION → CLOSED ; terminal EXPIRED, SUSPENDED (Z2)
on_close(VB_C, i):
    for Z in demand_zones(H4, D1, state=ARMED..FILLED):
        if not (touched_within(Z, minutes(30)) and STRUCTURE(H4).state != "DOWN" and not Z2_flag(Z, lo=VB_B)): continue
        b, stacks = bar(VB_C, i), FP_STACK(VB_C, i, side="BUY")
        S = next((s for s in stacks if Z.dist <= s.bottom <= Z.prox), None)
        if S and b.close > b.open and b.close >= b.low + 0.5 * b.range and not b.partial and RISK.ok():
            stop = min(S.bottom, b.low) - BUF(VB_C)
            ENTER(E1, LONG, b.close, expiry=VB_C, bracket=(stop, T1=r_multiple(1.0), T2=r_multiple(2.0)), time_stop=minutes(15))
```

| Parameter | Default | Reason |
|---|---|---|
| Ratio · rows · `vmin` | 3.0 · ≥ 3 · 75th percentile of non-zero rows over 50 bars | §3 |
| Ticks per row | ES 1, NQ 4, CL 2 | §3 design |
| Zero handling | Denominator max(x, 1) | Sierra "zeros as ones" |
| `touch_window` · `time_stop` | 30 minutes · 15 minutes | Design; short-lived effect |

**Visual review checklist.**
1. The trigger bar's footprint is shown cell by cell, with the stacked rows highlighted inside the zone rectangle.
2. A platform footprint with identical settings (§9) shows the same stack.
3. The zone's touch is within 30 minutes of the trigger.
4. The stop sits under the stack bottom or the bar low minus buf.

**Failure modes & regime fit.** It works at zone reactions. It fails when the stack is the last push before absorption by larger sellers. Absorption on the opposite side is the warning sign, and it is logged for review. In fast markets VB-C bars compress into seconds, so the clock guards matter.

**Relations.** SD-07 is an alternative TRIGGER for SD-01 and SD-06: swap it in, never stack it. Before trading it, log FP_STACK on every SD-01 and SD-06 signal as a feature. VP-08 uses aggressor delta at profile nodes, an independent location ([09](09%20Proposals%20volume%20profile.md)).

## SD-08 Opening displacement: hold or fail

**At a glance.** Style: intraday, RTH open to close · Hold: 30 minutes to the close · Instruments: ES/MES, NQ/MNQ (CL/MCL MOM branch only, from its 09:00 ET open) · Regime: sessions whose first 30 minutes contain a displacement · Evidence: C (A-grade studies conflict) · Complexity: Med.

**Role map and chart stack.**

| Role | One condition | Time bars | Volume bars |
|---|---|---|---|
| CONTEXT | Branch fixed at 10:00 ET: \|r30\| ≥ 0.5 × ATR(D1) → REV, else MOM | D1, clock | D1, clock |
| LOCATION | Origin of the first DISPLACEMENT(M5) in 09:30–10:00 in the direction of r30 | M5 | VB-B |
| SETUP | MOM: origin not INVALIDATED by 10:00. REV: none beyond the branch | M5 | VB-B |
| TRIGGER | MOM: E3 limit at the origin top, 10:00–13:00. REV: M5 close below the origin bottom, 10:00–12:00 | M5 | VB-B |
| MANAGEMENT | MOM: T1 at the session extreme, rest to 15:55. REV: T1 at PDC | M5 | VB-B |

Here r30 = last trade at 10:00 ET − PDC, Gao's first-half-hour return measured from the prior close. All windows, PDC and ATR(D1) stay on clock time.

**Concept basis.** Large opening moves in index futures reversed intraday, especially after positive opens, though costs cut the significance ([Grant, Wolf & Yu](https://ideas.repec.org/a/eee/jbfina/v29y2005i5p1311-1327.html)). The first half-hour predicts the last half-hour ([Gao et al.](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). On NASDAQ-100 futures, "a simplistic view of momentum and reversal proves untenable" ([Yu, Rentzler & Wolf](https://www.joim.com/nasdaq-100-index-futures-intraday-momentum-reversal)). **The disambiguation by magnitude is a design hypothesis.** The notes give no threshold for a "large" opening move, so 0.5 × ATR(D1) is a pre-committed design value. The opening displacement's origin is the observable that separates the two readings: momentum needs it to hold, reversal needs it to fail. The non-selected branch is logged as a shadow signal on every qualifying day, so forward validation compares both readings on the same sessions.

**Context filter.** At 10:00 ET compute r30. REV if |r30| ≥ 0.5 × ATR(D1), else MOM. No trade if no DISPLACEMENT(M5) in the direction of r30 closed between 09:30 and 10:00. Half-days and FOMC days are skipped.

**Location.** The origin = [min(low[d−1], low[d]), open[d]] of that displacement bar, as in SD-04. A height above 1.0 × ATR(M5) disqualifies the day.

**Trigger and entry order.** *MOM:* E3 buy limit at open[d], live 10:00–13:00 ET. *REV:* an M5 close below the origin bottom between 10:00 and 12:00 ET (the origin is INVALIDATED), then E1 sell at that close minus `slip`.

**Risk & management.** *MOM:* stop = origin bottom − buf(M5). T1 = the session high so far (50% off, stop to breakeven, subject to `rr_floor`); the rest is held to 15:55 ET, matching the last-half-hour window Gao measures. *REV:* stop = origin top + buf(M5), the failed origin used as a flip. T1 = PDC (skip if < 1R away); the rest exits at 15:55 ET.

**Filters.** RTH; blackout; one trade per session per instrument.

**Automation spec.**

```python
# PRE_OPEN → OBSERVE (09:30–10:00) → BRANCH_MOM | BRANCH_REV | NO_TRADE → ORDER_PENDING → IN_POSITION → CLOSED (15:55)
on_clock("10:00"):
    r30 = last_trade() - LEVELS.PDC
    d = first_bar(M5, "09:30", "10:00", pred=lambda i: DISPLACEMENT(M5, i) and sign(bar(M5, i)) == sign(r30))
    if d is None or session_flag in ("HALF_DAY", "FOMC"): return NO_TRADE
    O = origin(d)                                         # [min(low[d-1], low[d]), open[d]]
    branch = "REV" if abs(r30) >= 0.5 * ATR(D1) else "MOM"
    log_shadow(other_branch(branch), O)                   # forward comparison of both readings
    if branch == "MOM" and not invalidated(O, M5, until="10:00"):
        ENTER(E3, side(r30), O.top, window=("10:00", "13:00"),
              bracket=(O.bottom - BUF(M5), T1=session_extreme(side(r30)), exit_at="15:55"))
on_close(M5) while branch == "REV" and in_window("10:00", "12:00"):
    if closes_beyond(O.bottom, M5) and dist(LEVELS.PDC) >= 1.0 * risk(O.top + BUF(M5)) and RISK.ok():
        ENTER(E1, opposite(side(r30)), M5.close, expiry=M5, bracket=(O.top + BUF(M5), T1=LEVELS.PDC, exit_at="15:55"))
```

(Prices are mirrored for a down-open: the origin is then [open[d], max(high[d−1], high[d])].)

| Parameter | Default | Reason |
|---|---|---|
| `large_open` | \|r30\| ≥ 0.5 × ATR(D1) | Design; no threshold in the notes |
| Observation · MOM window · REV window | 09:30–10:00 · 10:00–13:00 · 10:00–12:00 ET | Gao's first half-hour; design windows |
| Exit time | 15:55 ET | Last half-hour; flat before the close |

**Visual review checklist.**
1. PDC, the 10:00 ET value and r30 in ATR(D1) units are printed, with the chosen branch.
2. The displacement bar and the origin box are shown, with `known_at` at the bar's close.
3. The shadow branch's hypothetical entry is drawn in grey.
4. No entry occurs before 10:00 ET.

**Failure modes & regime fit.** Both readings fail on two-way days that cross the origin repeatedly. Event-driven opens can produce displacements that are news, not overreaction. The 0.5 × ATR(D1) split may simply be wrong. That is the point of the shadow log.

**Relations.** PA-11 trades Gao's last half-hour directly ([08](08%20Proposals%20price%20action%20and%20swing.md)), so never run PA-11 and the SD-08 MOM branch on the same session. PA-10, PA-15 and VP-02 read the open through swing, overnight and profile lenses. A GEX-family gamma regime can gate either branch ([12](12%20Options%20gamma%20and%20equity%20context.md)).

## Start with SD-01, SD-06 and SD-02, and keep these pairs apart

**SD-01** comes first. It has the best-supported location in the family, and it exercises every piece of the registry: detection, arming, CURVE, MARGIN, refinement and the Z1–Z3 grades. Its swing horizon leaves time to review each signal against the chart. **SD-06** comes second. It joins the strongest mechanism in the evidence (stop clustering beyond salient lows) to a zone, and it fires intraday often enough to build a forward sample within weeks. **SD-02** runs third, signal-only. It is fully mechanical, and its first-touch premise runs against Chung and Bellotti. Logged next to SD-01's touch counts, it gives a direct forward test of freshness on CME data. From day one, record FP_STACK, absorption and resting depth inside every SD-01 and SD-06 zone as features, without trading them. That builds the footprint sample SD-07 needs at no risk. Run SD-05 only as the declared control, with its shadow zones.

| Do not run together | Why | Rule |
|---|---|---|
| SD-01 and SD-02 on one zone | Same location, two entries | The first fill owns the zone |
| SD-04 and SD-05 | Same displacement leg (origin vs CE) | Pick one per instrument |
| SD-06 with PA-02 or PA-14 on one pool | SD-06 is the stricter subset | SD-06 owns the level when a zone sits under it |
| SD-03 with PA-03 or CX-05 on one level | The same retest thesis | One per level |
| SD-08 MOM with PA-11 on one session | The same Gao effect | One per session and instrument |
| SD-05 or SD-04 with FIB-07 or CX-10 | One impulse leg labelled as FVG, OB and OTE | One location event |
| SD-07 stacked on SD-01 or SD-06 | Two triggers for one role | Swap, never stack |

## Conclusion

The dimension's real content is smaller and sturdier than its vocabulary. Bases, order blocks, FVGs, breakers and stacks are states and resolutions of one object, the origin of a departure from a swing, and a single registry with explicit `known_at` times and a shared state machine can reproduce every popular definition for side-by-side review. Seen that way, the evidence redirects three common habits. Zones should retire by **age**, not by touch, because repeated bounces strengthened levels while time weakened them. FVG-plus-LVN on volume bars, and OB-plus-FVG-plus-OTE on one leg, are **one fact** counted once. And footprint stacks are **observations of intent** at a level, not forecasts, because order-flow impact in ES is spent within a second.

The most promising next step needs no backtest. Rithmic depth snapshots can show whether resting liquidity actually sits inside detected zones, which is the Kavajecz–Odders-White mechanism measured directly. Shadow random zones logged alongside every live signal guard against the "magnet" illusion that inflated bar-based FVG tests. If detected zones hold more depth and react more often than random boxes of the same height, the zone story has earned its place as a LOCATION filter on this data. If they do not, the registry has still done its job, because it will have shown that cheaply and in forward time.
