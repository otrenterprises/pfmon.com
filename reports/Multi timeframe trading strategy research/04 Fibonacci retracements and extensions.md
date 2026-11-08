# Use Fibonacci as a ruler, not an oracle

**Fibonacci levels have no demonstrated edge of their own. They are still a useful, automatable way to measure pullbacks and space targets.** Retracements, extensions and projections are fixed fractions of a confirmed swing leg. Only some of the popular ratios come from the golden ratio: 50% is a convention, and ICT's 0.62/0.705/0.79 and the golden pocket's 0.65 are rounded or arbitrary. The rigorous tests agree. Batchelor and Ramyar on the Dow, Tsinaslanidis, Guijarro and Voukelatos on three equity markets, and Forexop's 40,243 FX corrections all find no extra reactions at Fibonacci ratios. The one positive paper, Shanaev and Gibson's working paper, singles out the 0%, 50% and 100% levels. Those are the swing extremes and the midpoint, not φ. So Fibonacci gets three supporting jobs in this set. It is a standard ruler for pullback depth. It is a target ladder that can be fully computed at entry. And it is one LOCATION input to confluence through FIB-CLUSTER: at least 3 levels from at least 2 distinct anchors within 0.2 × ATR(L). It never supplies CONTEXT or TRIGGER, and Fibonacci time is excluded. Every setup with explicit rules grades C: Boroden's clusters and Type 1/2/3 trades, DiNapoli, the ICT OTE core, the golden pocket and harmonics. Standalone retracements, time ratios and Elliott ratio forecasts grade D. Automating Fibonacci is easy once every grid comes from the shared confirmed-swing engine. The hidden cost is a **confirmation-lag tax**: with a 2 × ATR reversal detector, a leg must be longer than 4 × ATR for its 50% level to still lie ahead of price when the leg is confirmed. You asked for Fibonacci "maybe." The answer is yes, in a supporting role, with a visual control test agreed in advance that can justify dropping it.

*Write-up 04 of the set described in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md). The swing engine is defined in [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md). How Fibonacci interacts with structure and volume profile is covered in [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md). Executable proposals (FIB-01…) are in [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md). Every number below is a starting value fixed in advance from the research notes. None of them is optimized, and anything labelled "design proposal" or "inference" is this write-up's reasoning, not a sourced rule.*

## The golden ratio explains most levels, but not 50%, 0.65 or ICT's band

Every Fibonacci tool does the same thing: it takes a swing leg and marks fixed fractions of its length. Practitioner sources use the same menu. Retracements are 23.6%, 38.2%, 50%, 61.8% and 78.6%; extensions and projections are usually 127.2% and 161.8% ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)). Academic descriptions split the leg into 23.6%, 38.2%, 50%, 61.8% and 100% ([Shaker, Asad & Zulfiqar 2018](https://arpgweb.com/pdf-files/ijefr4%286%29159-164.pdf)). Where each number comes from is another matter. Computing the powers and roots of φ = 1.6180340 shows which levels really derive from the golden ratio. The arithmetic below was computed for this write-up.

| Level | Exact derivation | Golden-ratio derivative? | Where it appears |
|---|---|---|---|
| 0.236 | 1/φ³ = 0.236068 | Yes | Shallow retracement; left out of this set's grid |
| 0.382 | 1/φ² = 0.381966 | Yes | Retracement; DiNapoli F38 |
| 0.5 | 1/2 | **No**: a convention (origin not sourced in the notes) | Retracement; ICT "equilibrium" |
| 0.618 | 1/φ = 0.618034 | Yes | Retracement; DiNapoli F61; Boroden's single favorite |
| 0.62, 0.705, 0.79 | 0.618 and 0.786 rounded; 0.705 = (0.62 + 0.79)/2 | **No**: rounded conventions | ICT OTE band |
| 0.65 | None | **No**: arbitrary | Upper edge of the golden pocket |
| 0.707, 1.414 | 1/√2, √2 | **No** | Some platform grids |
| 0.786 | √(1/φ) = 0.786151 | Yes (= √0.618) | Deep retracement; Gartley D |
| 0.886 | φ^(−1/4) = 0.886652 | Yes (= √0.786) | Bat D, Deep Crab B; left out of this set's grid |
| 1.0, 2.0 | Trivial multiples | **No** | AB=CD, DiNapoli OP |
| 1.13 | φ^(1/4) = 1.1278 (= 1/0.886) | Yes | Harmonic ratios |
| 1.272 | √φ = 1.272020 (= 1/0.786) | Yes | Extension; Boroden's first objective |
| 1.618 | φ | Yes | Extension; DiNapoli XOP |
| 2.24 | √5 = 2.236 (= 2φ − 1) | Related to φ | Harmonic ratios |
| 2.618, 4.236 | φ², φ³ | Yes | Extended targets; SXOP |
| 3.618 | φ + 2 | Related to φ | Harmonic ratios |

This matters for honesty, not for execution. **There is no mathematical reason a futures market should respect φ.** Any effect has to be behavioral: orders placed where traders expect other traders to act. The evidence section tests exactly that. Level density, on the other hand, is a design decision. Between 23.6% and 88.6%, a full grid has up to seven levels, about one every 12–15% of the leg, so almost every pullback ends "near a Fib level." This set therefore commits to the shared four-level retracement grid {0.382, 0.5, 0.618, 0.786}.

0.236 is left out because, as the anchoring section shows, it is almost never tradeable in real time. With the shared detector, the leg would have to exceed about 8.5 × ATR for 0.236 to still be ahead of price when the leg is confirmed. 0.886 is left out because it only matters inside harmonic pattern definitions. Adding it lengthens the grid without adding evidence. 50% stays even though φ does not produce it. It is the level with the strongest empirical hint, though from an unrefereed paper.

### One notation for retracements, extensions and projections

Sources use three kinds of construction and name them inconsistently. This set uses the shared FIB(A→B) names. A is the leg's origin, B its confirmed end, and C a confirmed pullback point after B. The formulas are written for an up leg (A low, B high); mirror them for down legs.

| Construct (name in this set) | Formula | Where it lands | Computable from | Names in the sources |
|---|---|---|---|---|
| Retracement, RETR(x) | B − x·(B − A), x ∈ {0.382, 0.5, 0.618, 0.786} | Between B and A | Confirmed B | Retracement; DiNapoli F38/F61 |
| Extension, EXT(x) | A + x·(B − A), x ∈ {1.272, 1.618} | Beyond B | Confirmed B | Impulse extension; ICT "negative" levels |
| Boroden extension, BEXT(x) | Q − x·(Q − P) on a leg P→Q, x ∈ {1.272, 1.618} | Beyond the leg's origin P | Confirmed Q | Boroden "1.272 extension of the prior swing", "internal price extension" |
| Projection, PROJ(x) | C ± x·\|B − A\|, x ∈ {0.618, 1.0, 1.618} | Beyond B (targets) or below the pullback start (symmetry) | Confirmed C | DiNapoli COP/OP/XOP; AB=CD at x = 1.0; Boroden "symmetry" |

The one real naming conflict is the word "extension." The shared convention defines it as the leg extended beyond its own end, A + x·(B − A). That matches LuxAlgo's guidance that extensions and projections belong to impulse legs ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)). Boroden means something else. Her first Type 1 objective is "the 1.272 extension of the prior swing": the correction B→C that just finished, carried 127.2% back beyond its own origin B ([TradingMarkets: Carolyn Boroden on Fibonacci Price Clusters](https://tradingmarkets.com/?p=661586)). Arithmetically, that is the retracement formula with x > 1 applied to the correction leg. So this document keeps the shared name for A + x·(B − A) and calls Boroden's construct BEXT. The two land at different prices. In the hypothetical example below, EXT 1.272 is 27.2 points above B, while BEXT 1.272 of the 60-point correction is 16.3 points above B.

| Hypothetical ES-like leg: A = 6000.00, B = 6100.00, C = 6040.00 (pullback depth r = 0.60) | Formula | Price |
|---|---|---|
| RETR 0.382 / 0.5 / 0.618 / 0.786 | 6100 − x·100 | 6061.80 / 6050.00 / 6038.20 / 6021.40 |
| EXT 1.272 / 1.618 | 6000 + x·100 | 6127.20 / 6161.80 |
| BEXT 1.272 / 1.618 of the correction B→C | 6040 + x·60 | 6116.32 / 6137.08 |
| PROJ 0.618 (COP) / 1.0 (OP, AB=CD) / 1.618 (XOP) | 6040 + x·100 | 6101.80 / 6140.00 / 6201.80 |

The formulas also fix the order in which targets can sit. Write pullback depth as r = (B − C)/(B − A). **DiNapoli's COP sits above B only when r < 0.618**, so it is not a target at all for deep entries. BEXT 1.272 stays at or below OP whenever r ≤ 0.786. Both facts follow from the formulas: COP − B = (0.618 − r)·(B − A), and BEXT 1.272 ≤ OP exactly when 1.272·r ≤ 1. These are properties of the ruler, not of the market, and the target ladder later in this report is built around them. Levels are rounded to the instrument's tick (0.25 for ES/NQ, 0.01 for CL) before any order uses them.

### DiNapoli and Boroden anchor the same leg in different ways

DiNapoli uses only two retracements, F38 and F61, computed per reaction: F38 = focus − 0.382 × (focus − reaction) and F61 = focus − 0.618 × (focus − reaction). The "focus number" is the extreme of the move, and each "reaction" is a pullback swing inside it ([LuxAlgo DiNapoli Levels](https://www.luxalgo.com/library/concept/dinapoli-levels.md)). Every reaction inside a thrust produces its own F38/F61 from the same focus. So DiNapoli's grids share the B anchor and vary A. His profit targets are projections: COP = C + 0.618 × (B − A), OP = C + 1.0 × (B − A) and XOP = C + 1.618 × (B − A) (same source). CQG ships them as the "Expansion (DNExp)" study, whose help page misspells COP as "Contacted" ([CQG Expansion (DNExp)](https://help.cqg.com/cqgic/25/Documents/expansiondnexp.htm)). Some sources add an SXOP at 2.618 and use the set for staged partial exits ([ForTraders](https://fortraders.org/en/indicators/two-types-fibonacci-extensions.html); [TradingView DiNapoli Objective Points](https://fr.tradingview.com/script/NzIARSQk-Dinapoli-Objective-Points-OPs)).

**Sources disagree on where the projection is anchored.** LuxAlgo projects from C, the end of the reaction; other descriptions measure "from the end of a corrective wave B" ([LuxAlgo DiNapoli Levels](https://www.luxalgo.com/library/concept/dinapoli-levels/); [CQG DiNapoli Studies](https://help.cqg.com/cqgic/25/Documents/dinapolistudies.htm)). Some of this is just lettering: in a 0-A-B labelling, the end of the reaction is called "B." The notes could not rule out a genuine difference, though, so check the platform. On a known leg, OP must equal the end of the reaction plus the thrust length. In this set, PROJ is always anchored at the confirmed C.

Boroden draws retracements from swing lows to highs for support and from highs to lows for resistance. She uses "internal price extensions" of the prior corrective move, and she projects prior corrective swings from new swings, which she calls "symmetry." If she could keep only one ratio, it would be .618 ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)).

## Anchors decide everything: an objective grid starts with the swing engine

A Fibonacci grid is only as objective as the swing detector that feeds it. Every automated Fib tool in the notes is a swing detector plus a grid on the latest confirmed leg. TradingView community scripts use a ZigZag with "Depth" (minimum bars between pivots) and "Deviation" (sensitivity) ([TradingView: Fib Retracement (AUTO)](https://www.tradingview.com/script/HdVXYTjV-Fib-Retracement-AUTO)), and one defaults to deviation 2 and depth 10 ([TradingView: Cap's Dual Auto Fib](https://in.tradingview.com/script/4aTOhLkL-Cap-s-Dual-Auto-Fib-Retracement)). "Auto Structure Fibonacci" confirms a swing high only after price falls ATR(14) × 3.0 from it ([TradingView: Auto Structure Fibonacci](https://www.tradingview.com/script/VqR24zzI-Auto-Structure-Fibonacci/)). A ProRealTime indicator uses a Donchian-style ZigZag ([ProRealCode](https://www.prorealcode.com/prorealtime-indicators/automatic-fibonacci-levels-on-the-latest-swing/)), and LuxAlgo's golden-pocket tool confirms pivots with a 20-bar swing length ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)). One script even exposes an explicit repainting switch ([TradingView: Auto Fib Retracement victhoreb](https://in.tradingview.com/script/Pv9yc2mz-Auto-Fib-Retracement-victhoreb)).

The academic testers had the same problem. Tsinaslanidis, Guijarro and Voukelatos built an algorithm to find Fib levels and zones specifically to remove the subjectivity of hand-drawn levels ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495)). Forexop split 13 years of FX data by taking the largest wave, splitting it at its largest counter-move, and repeating ([Forexop](https://forexop.com/?p=7920)). That method is objective but needs hindsight, because the largest wave is only known afterwards. It works for labelling a review chart, never for live triggering.

So Fib inherits every ambiguity in the swing definition. A different depth, deviation or ATR multiple gives a different leg and therefore different levels. This set removes that freedom by deriving every grid from SWING(L) as defined in [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md). SWING(L) is the directional-change detector with a reversal of k = 2.0 × ATR(L), with ATR frozen at the extreme, and every swing stores both when its extreme printed and when it was confirmed. The anchor rule follows from that detector. A grid runs between the last two confirmed opposite swings of the same detector and degree. It is created at the end swing's confirmation bar. It re-anchors only when a new opposite swing confirms, never to the provisional ZigZag extreme, which NinjaTrader says "should be thought of temporary" ([NinjaTrader 8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)).

| Anchoring decision | Default in this set (fixed in advance) | Basis |
|---|---|---|
| Swing detector | SWING(L): DC/ATR-ZigZag, k = 2.0 × ATR(L), ATR frozen at the extreme; alternative Pivot(L, 3/3) | Shared convention; the notes suggest k = 2–3; the ATR rule scales across ES/NQ/CL and across M1–W1 |
| Which legs get a grid | Legs with confirmed A and B and \|B − A\| ≥ 3.0 × ATR(L) measured at B | The notes' reference algorithm; filters noise |
| Which layer's swings | Each grid uses its own layer's swings: the last 3 qualifying legs on the LOCATION layer, plus the dominant leg one layer up | LuxAlgo's "last two or three significant legs ... plus the dominant leg one timeframe up" ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)); the degree-consistency rule in 01 |
| Wick or body | Wicks: true traded extremes from tick data | Every tool reviewed and Boroden/DiNapoli measure from extremes; no source compared the two |
| Price scale | Arithmetic | Log scale (offered by [Martyv Auto Fib](https://in.tradingview.com/script/OEcKDPrO-Martyv-Auto-Fib-Retracement-with-Logarithmic-Support)) only matters for large percentage legs on W1 |
| Activation | At B's confirmation time on the grid's own layer, never earlier | Non-repainting |
| Invalidation | A close of the grid's layer beyond A; optional "deep" variant at a close beyond 0.786 | Shared convention; Elliott wave-2 rule; LuxAlgo origin and 0.786 invalidation |
| After invalidation | The detector's next qualifying leg defines the next grid; no anchor shopping | Notes |
| Session | ETH (Globex) data on every layer; an RTH variant for ES/NQ must use session-aware ATR and say so | Design proposal |
| Contract roll | D1/W1 legs that span a roll are computed on an additively back-adjusted series and flagged for review | Inference (see below) |

### Confirmation lag taxes every Fibonacci entry

Anchoring only on confirmed swings has a cost that finished charts hide. A directional-change swing high is confirmed only once price has retraced the threshold from it. The extreme is known in hindsight, while the confirmation is a real-time event ([Tsang DC Notations 2014](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf)). When B confirms, the leg has therefore already retraced at least k × ATR / |B − A|. With k = 2.0, part or all of a leg's grid is used up before the grid legitimately exists. The table follows directly from the detector definition (inference).

| Leg size, in ATR(L) at B | Depth already reached when B confirms | Retracement levels still ahead of price |
|---|---|---|
| 3 | ≥ 0.667 | 0.786 only |
| 4 | ≥ 0.500 | 0.618 and 0.786 (0.5 is touched) |
| 5 | ≥ 0.400 | 0.5, 0.618, 0.786 |
| 6 | ≥ 0.333 | All four |
| 8 | ≥ 0.250 | All four |

This has three design consequences. First, **resting limit orders at the shallow levels of a just-finished leg are usually impossible**. The levels truly still ahead of price come from older legs, from the higher layer's legs and from the deep end of the newest leg. Second, levels already crossed when a grid activates are marked PASSED and never receive resting orders, although a trade can still start from such a grid if price is sitting inside the zone and a TRIGGER fires. Third, a reviewer should expect the engine to skip many textbook 0.382 and 0.5 bounces that look obvious on a finished chart, because no confirmed-swing system could have taken them.

There is a documented alternative, early activation, but it is not the default. Early activation arms the grid as soon as the lower layer's SWING confirms B and cancels any resting order if price prints beyond B before a fill. It trades more often and re-quotes more often. Pivot(L, 3/3) anchors confirm after a fixed three bars rather than a fixed price distance, so they often activate with the shallow levels still intact. The cost is that they do not scale with volatility.

### Repainting is an order-management problem, not a drawing problem

Platform documentation agrees on the fix. NinjaTrader says its ZigZag is "only meaningful to work with in Calculate.OnBarClose mode" ([NinjaTrader 8 Help: ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)). Sierra Chart notes that real-time and recalculated legs can differ when one bar both extends and reverses, and that "Calculate New Values on Bar Close" removes the difference ([Sierra Chart Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). Pine's manual calls past-plotted pivots "potentially misleading" ([Pine Script User Manual: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)).

In this set, a grid cannot be edited once it is active. A new projection point or a replacement leg creates a new version, and resting orders tied to the old version are cancelled. The grid dies on a close beyond A on its own layer. That matches the Elliott rule that wave 2 cannot retrace more than 100% of wave 1 ([TradingView: Elliott Wave explanation](https://il.tradingview.com/chart/CRUDEOIL1%21/u6QWFgV0-Elliot-Wave-Explanation-I-live-Example-Crudeoil)) and LuxAlgo's invalidation at the swing origin. LuxAlgo also offers an earlier "deep" invalidation at 0.786, and registers zone tests on wicks but breaks only on closes ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)). This set keeps the wick/close split and keeps the 0.786 invalidation only as an option. After an invalidation, the detector's next leg defines the next grid. Nobody goes looking for a different anchor to rescue a failed setup.

Two futures-specific choices remain. For the **session**, this set runs the Fibonacci swing engines on ETH data for every layer. Overnight extremes are real traded prices, and Sierra Chart's "Reset Zig Zag at Start of Trading Day" option ([Sierra Chart Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)) shows that platform designers treat session handling as a decision you have to make explicitly. For **contract rolls**, D1 and W1 legs can straddle a quarterly roll. An unadjusted chart puts the roll gap inside the leg and distorts every ratio. An additively back-adjusted series keeps the leg's length and places the levels at prices of the contract actually being traded. That is the inference behind the default, and the swing research behind 01 notes that each platform's roll handling still has to be checked.

## Clusters are the only Fibonacci construct with an automation rationale

Practitioners broadly agree that single Fib levels are weak. Tradable zones are where at least three Fibonacci relationships from different swings or timeframes fall inside a tight band. **Boroden's rule is "at least three Fibonacci price relationships."** Her spread guide is about 2 points at most in the S&P, ideally, and 3–4 points in Nasdaq futures, and symmetry projections of prior corrective swings count toward the three ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)). LuxAlgo describes the generic algorithm. It collects levels from several significant swings and requires at least k coincident levels (k is commonly 3) from at least 2 different swings. It sets the tolerance as "a fraction of the recent average range," weights clusters that span timeframes higher, and treats agreement with non-Fib references as stronger. LuxAlgo also credits Robert Fischer's 1990s books with formalizing multi-swing grids ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)). Clusters are the one Fib construct with a defensible case for automation. They combine several anchors, so the result depends less on any single anchor choice, and they bring in the higher-timeframe leg naturally.

Boroden's point bands have to be rescaled. The interview's date, and so the index level behind "2 points," was never established. A fixed point band means something different at a different price level and volatility, and it says nothing about CL. An ATR-relative band keeps the "tight" intent. **This set defines FIB-CLUSTER as at least 3 levels from at least 2 distinct anchors whose combined span is no wider than w = 0.2 × ATR(L), where L is the LOCATION layer.** That is the middle of the notes' suggested range of 0.15–0.25 × ATR(14). Merged zones are capped at 0.5 × ATR(L) so that stop distances stay tradeable for scalps. As a hypothetical: if ATR(M15) on ES were 10 points, w would be 2.0 points, exactly Boroden's figure. In a week when that ATR doubles, w doubles with it.

| Contributor (long setup; mirror for shorts) | Formula | Legs used | Basis |
|---|---|---|---|
| RETR | B − x·(B − A), x ∈ {0.382, 0.5, 0.618, 0.786} | Last 3 qualifying up legs on the LOCATION layer, plus the dominant up leg one layer up | Boroden; LuxAlgo |
| BEXT | Q − x·(Q − P), x ∈ {1.272, 1.618} | Most recent confirmed counter-rally P→Q inside the current pullback | Boroden's internal extension of the prior corrective move |
| PROJ (symmetry) | B − x·\|prior correction\|, x ∈ {0.618, 1.0, 1.618} | B = start of the pullback; prior correction = the last completed down leg on the same layer before the impulse | Boroden symmetry |
| PROJ (ABC) | Q − x·\|B − P\|, x ∈ {0.618, 1.0, 1.618} | A two-leg pullback B→P→Q (first leg down to P, counter-rally up to Q) | AB=CD; DiNapoli projections |

Three counting rules close the loopholes. **A distinct anchor is a different leg**, meaning a leg that differs in at least one endpoint, so several ratios of the same leg never count as separate anchors. With legs of at least 3 ATR they cannot fall inside one 0.2-ATR window anyway, because adjacent ratios are at least 0.118 of the leg apart, which is 0.35 ATR or more. The 0% and 100% levels are excluded because they are SWING levels belonging to the structure dimension. Under the set's confluence rule, a cluster that coincides with a prior swing extreme cannot claim that coincidence as a second, independent confirmation; volume-at-price is the independent dimension ([03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md); [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)). Finally, **the decision is binary**: a zone either qualifies or it doesn't. LuxAlgo's suggested weights, with higher timeframes and diverse anchors scoring more, can be shown on the review chart, but nothing should depend on them. Osler found that among FX firms publishing support and resistance, "none of the firms correctly assessed the relative likelihood of trend interruptions at the different levels" ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). That is a warning against trusting strength scores that lack evidence of their own.

**Clusters also form by chance more often than intuition suggests.** Suppose the contributor table yields 24 levels spread over a pullback range 8 × ATR deep, three per ATR. A 0.2-ATR window then holds 0.6 levels on average. If the levels were random, a Poisson approximation puts the chance of at least 3 in a given window at about 2.3%. An 8-ATR range holds 40 such windows, so you would expect roughly one chance "cluster" per pullback. This is illustrative arithmetic, not a measured rate. Real grids are not random: overlapping legs create structured near-coincidences. That is exactly why the mere existence of a cluster proves little, and why the verification section adds a control grid.

### Boroden's three trade types map cleanly onto layers

Boroden read trend on 2- or 5-minute charts and built clusters from 15-minute, 60-minute and daily swings. Her trade types differ by trend alignment and by whether a trigger is required ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)):

| Boroden type | Her rule | Translation into this set's layers (design proposal) |
|---|---|---|
| Type 1, highest probability | With the immediate trend; enter at the cluster with no trigger; stop "just a few ticks" beyond the far edge of the cluster | STRUCTURE(TRIGGER layer) is in the setup direction when the zone forms. TRIGGER = resting limit at the middle of the zone. Stop = far edge of the zone ± STOP_BUFFER |
| Type 2 | A higher-timeframe cluster against the immediate trend; needs a lower-timeframe trigger: a swing violation, MA cross, Haggerty 1-2-3, or a double top/bottom confirmed by breaking the middle swing; enter on the break or on a pullback after it; no trigger means no trade | STRUCTURE(TRIGGER layer) is against the setup direction. TRIGGER = CHoCH on the TRIGGER layer after the zone is tested and before it breaks |
| Type 3 | A two-step (ABC, "Gartley-style") pattern into a cluster, against the short-term trend | Type 2 plus a precondition: the pullback is a confirmed two-leg ABC on the TRIGGER layer, so PROJ (ABC) contributes. Lowest priority |

Management under all three: move the stop to breakeven as soon as possible, then trail. The first target is "the 1.272 extension of the prior swing," which is BEXT here. Symmetry and extension targets are not always met, which is why she trails stops (same source). Elsewhere she treats a single symmetry projection as a setup in the trend direction, strengthened by additional relationships ([TradingMarkets: Symmetry](https://tradingmarkets.com/recent/how_i_identify_powerful_setups_using_symmetry-664959)).

The translation keeps only the swing-violation trigger. A moving-average cross would add a second, independent TRIGGER condition, which breaks the set's rule of one condition per role. CHoCH also reuses the same swing engine as the grid ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)).

### DiNapoli, Fischer, Elliott and Miner: what survives verification

**DiNapoli** contributes two rules that can be automated. First, overlapping F38/F61 levels from different reactions form a "confluence area," with no numeric tolerance given. Second, the "single penetration" setup: the first pullback into the 38.2% of a fresh thrust, with the trend, with the stop beyond the 61.8% of the same reaction ([LuxAlgo DiNapoli Levels](https://www.luxalgo.com/library/concept/dinapoli-levels.md)). In this framework, "DiNapoli mode" is an optional contributor set. Its legs share B (the focus) and take A from each confirmed TRIGGER-layer reaction low inside the thrust. Note the conflict with the confirmation-lag tax: a fresh thrust's 38.2% is only still ahead of price at confirmation for legs longer than about 5.2 ATR. DiNapoli's displaced-moving-average setups could not be verified from reachable sources and are left out.

**Fischer's** grids are known only through LuxAlgo's attribution.

**Constance Brown's and Robert Miner's** preferred level sets were never retrieved. That includes Miner's dynamic price-and-time projections and his dual-timeframe momentum method. Nothing in this set relies on them.

**Elliott** guidelines from secondary sources say wave 2 commonly retraces 50–61.8% of wave 1, sometimes to 78.6%. Wave 3 commonly measures 1.618 × wave 1 projected from the end of wave 2, with 2.618 the next reference when it extends, and wave 4 commonly retraces about 38.2% of wave 3, within 38.2–61.8%. The hard rules are that wave 2 cannot retrace beyond the start of wave 1 and wave 4 cannot overlap wave 1 ([The Right Trader: Elliott Wave Fibonacci Ratios](https://therighttrader.com/learn/elliott-wave-and-cycles/elliott-wave-fibonacci-ratios); [LuxAlgo Fib Wave Relationships](https://www.luxalgo.com/library/concept/fib-wave-relationships.md); [Wikipedia: Elliott wave principle](https://Www.Wikipedia.org/wiki/Elliot_wave)). Wave counting cannot be automated objectively. The ratios are useful vocabulary for "normal" depth, and the hard rules are already built into the grid's invalidation. Batchelor and Ramyar's test of successive-trend ratios (evidence section) is the reason Elliott ratio forecasts grade D.

## Modern setups repackage one pullback trade

Strip away the branding and the golden pocket, ICT's OTE, DiNapoli and Boroden share one five-part core: (1) a strong, objectively measured impulse, ideally one that breaks prior structure; (2) a first pullback into a 0.5–0.786 zone, or DiNapoli's shallower 0.382 for very strong thrusts; (3) an entry on a lower-timeframe structure trigger or with a limit order at a cluster; (4) a stop beyond 0.786 or beyond the 100% origin; and (5) targets at the prior extreme, then the 1.272/1.618 extensions or the 1.0 projection. What each setup adds is a structural prerequisite or a labelling convention, never a better ratio. Grades follow the shared scale. The basis for them is in the evidence section.

**Golden pocket, grade C.** The band runs from the 0.618 retracement to 0.65. LuxAlgo's implementation draws pockets on every confirmed swing (swing length 20) and keeps the 3 most recent. It tracks each pocket as fresh, tested, broken or invalidated, invalidates at 0.786 or at the swing origin, and registers tests on wicks but breaks on closes. It makes no performance claims and gives no rationale for 0.65, which is a user-adjustable default ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)). The notes could not trace 0.65 to any named author. The band is only 0.032 of the leg wide, about 0.13 ATR on a 4-ATR leg, which is narrower than the cluster tolerance. In practice the golden pocket is the 0.618 level with a zone around it. This set keeps its lifecycle rules (they reappear in the reference algorithm) and drops the label.

**ICT Optimal Trade Entry, grade C.** The band is 0.62–0.79, centered on 0.705. It is valid only after a market structure shift or break of structure that comes with aggressive displacement. Execution typically waits for a lower-timeframe shift inside the zone, and the stop goes at the 100% level ([LuxAlgo Optimal Trade Entry](https://www.luxalgo.com/library/concept/optimal-trade-entry.md); [ChartingLens: ICT OTE](https://chartinglens.com/blog/ict-optimal-trade-entry-ote); [InnerCircleTrader.net](https://innercircletrader.net/tutorials/ict-fibonacci-levels/)). There is no reliable published win rate, and performance claims on ICT sites are not independently verified ([Equiti: OTE vs Fibonacci](https://www.equiti.com/jo-en/news/trading-ideas/ote-vs-fibonacci-ict-trading/)). One source lists targets at the 0, −1 and −1.5 extensions, but the attribution is uncertain ([The Right Trader: Optimal Trade Entry](https://therighttrader.com/learn/smart-money-concepts/optimal-trade-entry)).

The special numbers add nothing. On a 100-point ES leg, 0.62 versus 0.618 is 0.2 points, less than one tick, and 0.79 versus 0.786 is 0.4 points, about 1.6 ticks. **The useful part of OTE is the prerequisite.** The testable core in this set's names is: (1) a qualifying impulse of at least 3 × ATR(L) whose close produced a BOS on layer L, or a CHoCH for a reversal OTE; (2) the first pullback into the RETR band 0.618–0.786 of that leg; (3) TRIGGER = CHoCH on the next layer down, inside the band; (4) a stop beyond A plus STOP_BUFFER; and (5) the standard target ladder. That core inherits the C grade of BOS-based structure ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)).

**50% equilibrium and premium/discount, grade C.** ICT's rule is that the 50% of a dealing range separates "premium" above, the sell zone, from "discount" below, the buy zone. The only source is a practitioner blog ([Premium and Discount Zones](https://dhanith-trading-blog.vercel.app/blog/premium-and-discount-zones)). In this set's names it means: take longs only at r ≥ 0.5 of the governing FIB(A→B). Osler lists the "50 percent rule" only as a method practitioners use ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). Shanaev and Gibson name 50% among the most important levels, but in an unrefereed working paper. So it is **the cheapest, most defensible single filter in the Fibonacci family**. It needs no ratio, no cluster machinery and no new parameter beyond the governing leg.

**Harmonic patterns, grade C.** Harmonics are the most rule-dense use of Fibonacci. Secondary sources partly disagree on the ratios, mostly on the Bat's B point, and Carney's own tables were not reached:

| Pattern | B (of XA) | D completion | Notes |
|---|---|---|---|
| Gartley | 0.618 | 0.786 XA; C = 0.382–0.886 AB; BC projection 1.272–1.618 | Gartley's 1935 original reportedly used thirds; Fibonacci ratios were added later by Carney and Pesavento (secondary claim, not checked against Gartley's book) |
| Bat | 0.382–0.50 (some sources: ≤ 0.618) | 0.886 XA | Sources disagree on B |
| Butterfly | ≈ 0.786 | ≈ 1.27 XA (some sources: 1.27–1.618) | Sometimes credited to Bryce Gilmore, with Carney supplying the ratios |
| Crab / Deep Crab | Deep Crab ≈ 0.886 | 1.618 XA | Carney's most extreme extension pattern |

Sources: [LuxAlgo Harmonic Patterns](https://www.luxalgo.com/library/concept/harmonic-patterns.md); [LuxAlgo Bat](https://www.luxalgo.com/library/concept/bat.md); [LuxAlgo Crab](https://www.luxalgo.com/library/concept/crab.md); [Admiral Markets](https://admiralmarkets.com/education/articles/forex-strategy/harmonic-trading-patterns); [IG](https://www.ig.com/uk/trading-strategies/top-7-harmonic-patterns-every-trader-should-know-210608).

The positive evidence comes from vendors. A Nasdaq-100 backtest reports the bullish Gartley hitting its target 60% of the time with a 4.46% average return per trade ([LiberatedStockTrader: Gartley Pattern](https://www.liberatedstocktrader.com/gartley-pattern/)). Other sites claim more than 70% or 85% success with nothing verifiable behind it ([TradeAlgo](https://www.tradealgo.com/trading-guides/technical-analysis/harmonic-patterns-how-to-trade-gartley-butterfly-bat-and-crab-formations)). A skeptical site argues that no reliable statistical evidence exists ([AlgoStorm](https://algostorm.com/harmonic-chart-patterns/)), and the notes found no peer-reviewed study either way.

Automating harmonics is mechanical but fragile. A pattern needs five confirmed swings, so it is very sensitive to the detector settings. D cannot be a confirmed swing at entry, because confirming it takes another 2 × ATR. So the D zone is really a cluster made of an XA retracement, a BC projection and AB=CD. This set leaves harmonics out of the first automation pass. At most, a harmonic label goes on a FIB-CLUSTER that already qualifies.

**Extension and projection targets, grade C.** Boroden's first Type 1 objective is BEXT 1.272, and she trails stops because symmetry and extension targets are not always met ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)). DiNapoli's COP/OP/XOP are used as staged take-profits ([ForTraders](https://fortraders.org/en/indicators/two-types-fibonacci-extensions.html)). The default ladder here is T1 = B, T2 = EXT 1.272, T3 = EXT 1.618, chosen because **all three are known at entry**, so the whole bracket can be placed on the fill and never changes. Boroden's BEXT and DiNapoli's projections need a confirmed C. By the time C confirms, price is already at least 2 × ATR off the low, so they are management updates rather than entry brackets. The geometry above also rules COP out as a target for entries deeper than 0.618.

For a neutral sense of scale, Glattfelder, Dupuis and Olsen found that a directional change of size θ is followed on average by an overshoot of about θ. The paper itself notes this also arises in a binomial random walk, so it gives a reference distance, not a forecast ([Glattfelder et al. 2011](https://arxiv.org/pdf/0809.1040)).

### Fibonacci time fails its only rigorous test; leave it out

Fibonacci time zones are vertical lines at 1, 2, 3, 5, 8, 13, 21… bars after a chosen swing ([Fidelity](https://fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/fibonacci-time-zones); [Babypips](https://www.babypips.com/forexpedia/fibonacci-time-zones)). The first lines bunch together near the start, so some practitioners begin at 13 or 21 ([SuperMoney](https://www.supermoney.com/encyclopedia/fibonacci-time-zone)), and CQG's implementation starts at the third interval ([CQG FiboTZ](https://help.cqg.com/cqgic/21/Documents/fibonaccitimezonesfibotz.htm)). Babypips claims about 70% predictive power, from a single unverified source. Boroden projects Fibonacci ratios of the durations between swing pairs and looks for several cycles converging. In one of her examples, a time window coinciding with a price hit marked a pivotal high ([TradingMarkets: Fibonacci Time and Price](https://tradingmarkets.com/recent/using_fibonacci_time_and_price_relationships_in_all_time_frames-671446)).

The only rigorous test is Batchelor and Ramyar's. It included the durations of successive Dow trends alongside their lengths and found "a few significant ratios ... but no more than would be expected by chance" ([City Research Online](https://openaccess.city.ac.uk/16276/)). Time projections also double the anchoring problem, since each duration needs two anchors. They produce wide windows, and with several cycles running, some window almost always sits near any turn. On volume bars, "bars" become units of traded activity, which is no longer Fibonacci time at all. **Grade D. Leave it out of triggering.** At most, show it as a zero-weight annotation on review charts.

## The evidence finds nothing at the ratios and something at the extremes

| Study | Data | Finding | Limits |
|---|---|---|---|
| Batchelor & Ramyar 2006, Cass discussion paper ([City Research Online](https://openaccess.city.ac.uk/16276/)) | Dow Jones Industrial Average; length and duration ratios of successive trends; stationary bootstrap | "A few significant ratios appear, but no more than would be expected by chance" | Index trends only. A press summary gives 1914–2002 and "no evidence Fibonacci numbers work" ([Scribd reproduction](https://www.scribd.com/document/505062350/numbers)); sample period not checked against the paper |
| Tsinaslanidis, Guijarro & Voukelatos, *Expert Systems with Applications* ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0957417421012495); [ResearchGate](https://www.researchgate.net/publication/354702159_Automatic_identification_and_evaluation_of_Fibonacci_retracements_Empirical_evidence_from_three_equity_markets)) | Three equity markets; automatically identified Fib zones | **No support for Fib retracements as a standalone rule.** Wider zones show higher bounce probability. The authors find the lack of prior evidence surprising | Full text not accessed; effect sizes unknown |
| Forexop ([Forexop](https://forexop.com/?p=7920)) | 1-minute Dukascopy data, 9 G10 USD pairs, Oct 2003–May 2016, **40,243 corrections** deeper than 15% | ~83% end between 15% and 61.8%; ~17% go beyond 61.8%; log-normal distribution with no peaks at Fib levels | No formal significance test or random-level comparison; FX only |
| Shanaev & Gibson 2022, SSRN working paper ([SSRN 4212430](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212430)) | International stock indices and FX; S&P 500 stocks | Predictive power. The abstract names 0%, "38.1%", 50%, "61.2%" and 100% as most important (figures as returned). A long/short strategy earns significant Fama-French alpha | Unrefereed; full text not accessed; publication status unknown |
| LiberatedStockTrader ([blog](https://www.liberatedstocktrader.com/how-to-use-fibonacci-retracement/)) | 102 stocks and indexes | Fib retracement failed to predict a turning point 63% of the time | Blog; no baseline |
| Shaker, Asad & Zulfiqar 2018 ([IJEFR](https://arpgweb.com/pdf-files/ijefr4%286%29159-164.pdf)) | 4 Pakistani cement stocks, Q1 2017 | 27% of support levels and 36% of resistance levels "followed" Fib | Tiny sample; no baseline |
| Gupta 2011 ([Macalester](https://digitalcommons.macalester.edu/cgi/viewcontent.cgi?httpsredir=1&article=1041&context=economics_honors_projects)) | Stylized model | Traders who see Fib levels work use them more, which reinforces them | Undergraduate thesis; summary only |
| Osler 2003, *Journal of Finance* ([RePEc](https://ideas.repec.org/a/bla/jfinan/v58y2003i5p1791-1819.html); [NY Fed SR125](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.html); [NY Fed SR150](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.html)) | About 9,700 orders at one large dealing bank, Sept 1999–Apr 2000 | Take-profit orders cluster at round numbers; stop-losses cluster just beyond them and accelerate moves | FX and round numbers, not Fib levels; statistics cannot prove causality |

**Hit rates mean nothing without a baseline of random levels the same width.** With four levels spaced 0.118–0.168 of the leg apart, any pullback ending between 0.382 and 0.786 is within about 0.084 of the leg from some level. Tsinaslanidis's link between zone width and bounce probability is what you would expect mechanically from a wider net. Osler's 2000 study shows what the right test looks like. FX support and resistance levels published by six firms produced bounces 60.8% of the time, against 56.2% for 10,000 sets of arbitrary levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)). The published levels were mostly prior peaks and troughs. The 50% rule and the 38.2/61.8 retracements appear in that paper only as methods practitioners use, not as tested results. Kavajecz and Odders-White add that support and resistance levels coincide with peaks in limit-order-book depth ([RePEc](https://ideas.repec.org/a/oup/rfinst/v17y2004i4p1043-1071.html)). The supported effect, in other words, sits at **swing extremes, round numbers and visible liquidity**.

Shanaev and Gibson's emphasis on 0%, 50% and 100% points the same way. Their "Fibonacci" effect looks mostly like a structure effect, which is why this set counts swing extremes as SWING levels in [01](01%20Swing%20points%20across%20timeframes.md) rather than as Fibonacci.

Forexop's distribution is useful as a base rate even though it rejects Fibonacci as a phenomenon. If only about 17% of corrections in that sample went beyond 61.8%, then a stop beyond 0.786 or 1.0 sits outside the bulk of normal pullbacks. That is a legitimate reason to place a stop there, with nothing to do with φ. The same numbers carry an uncomfortable implication. **An entry at 0.618 joins the minority of corrections that have already gone deep**, and the notes give no figure for how often those continue rather than fail. Transfer is also uncertain: the sample is FX, segmented with hindsight.

Osler's order-clustering work is the plausible mechanism, and it sets limits. For a self-fulfilling effect at Fib levels, many participants would have to anchor the same grid. That is plausible for obvious D1, W1 and H4 legs and implausible for idiosyncratic M1 or VB-C anchors. Stops clustering "just beyond" salient levels also means price should be expected to sweep slightly through a level, which is why stops need a buffer. No peer-reviewed study of Fib reactions in ES, NQ or CL was found, and no academic test of OTE, the golden pocket or DiNapoli's setups exists in the notes.

| Setup or claim | Explicit rules? | Evidence grade | Role in this set |
|---|---|---|---|
| Fib retracement as a standalone support/resistance signal | Yes | **D** | Never on its own |
| Fibonacci time zones and time ratios | Yes | **D** | Excluded; optional zero-weight annotation |
| Elliott ratio forecasts (wave 3 = 1.618 × wave 1, etc.) | Guidelines | **D** | Depth vocabulary only |
| Boroden price cluster plus Type 1/2/3 trades | Yes | **C** | FIB-CLUSTER as a LOCATION input; types map to TRIGGER choice |
| DiNapoli confluence, single penetration, COP/OP/XOP | Yes | **C** | Optional contributor mode; projections as management updates |
| ICT OTE | Partial | **C** | Testable core only (impulse + BOS, 0.618–0.786, LTF CHoCH) |
| Golden pocket | Yes | **C** | Label dropped; lifecycle rules kept |
| 50% / premium–discount | Yes | **C** | Simple location filter |
| Harmonic patterns | Yes (ratio tolerances) | **C** | Not in the first pass; at most a label on a qualifying cluster |
| Extension/projection target ladder | Yes | **C** | MANAGEMENT spacing convention, not a forecast |
| Stops beyond 0.786/1.0 as outside "normal" depth | n/a | **B** | MANAGEMENT |
| Swing extremes (0%/100%) and midpoints as reaction levels | n/a | **B** | Counted as SWING levels in 01, not as Fib |
| Order clustering at salient levels (mechanism) | n/a | **A** (round numbers, FX) | Rationale for stop buffers and obvious higher-timeframe anchors |

The recommended role follows from this evidence, and it is deliberately modest:

- **A ruler.** Express every pullback's depth as a fraction r of a confirmed qualifying leg. That makes setups comparable across ES, NQ and CL and from W1 down to VB-C, and puts stops beyond r = 0.786 or 1.0 in the same units.
- **A target ladder.** B, EXT 1.272 and EXT 1.618 space partial exits by a convention computed at entry.
- **One confluence input.** FIB-CLUSTER can nominate a LOCATION. It counts only when an independent dimension, volume-at-price, agrees with it, and only if it is never double-counted against swing levels from the same anchors.

Fibonacci never sets CONTEXT, because bias comes from G3 STRUCTURE on the highest layer. It never sets TRIGGER either; triggers come from CHoCH and BOS on a lower layer.

To be candid about where Fib earns its place: ATR multiples or plain thirds (which Gartley's original pattern reportedly used) could do the ruler job just as well. Fibonacci's only extra claim is that other people watch it, and that claim is strongest on obvious higher-timeframe legs. Fibonacci on M1 or VB-C legs has no special standing.

## A non-repainting reference algorithm for futures

The whole method is deterministic and evaluated at bar close. It can run as a separate engine that computes zones on completed bars and places or cancels bracket orders through Rithmic R|Protocol or Tradovate. Bars for every layer are built from one tick stream with one session template, which the swing notes recommend to avoid look-ahead and live-versus-history mismatches (see [01](01%20Swing%20points%20across%20timeframes.md) and [07 Automation architecture](07%20Automation%20architecture.md)). The parameters below are fixed in advance, sourced from the notes where possible, and not optimized.

| Parameter | Default | Basis |
|---|---|---|
| Swing detector | DC reversal 2.0 × ATR14(L), ATR frozen at the extreme | Shared convention; notes suggest k = 2–3 |
| Minimum qualifying leg | 3.0 × ATR(L) at B | Notes' reference algorithm |
| Ratios | RETR 0.382/0.5/0.618/0.786; EXT and BEXT 1.272/1.618; PROJ 0.618/1.0/1.618 | Shared convention; Boroden; DiNapoli |
| Contributors | Last 3 qualifying legs per direction on LOCATION, plus 1 dominant leg one layer up | LuxAlgo |
| Cluster tolerance | 0.2 × ATR(LOCATION), frozen when the zone forms | Shared convention; notes suggest 0.15–0.25 |
| Maximum zone width | 0.5 × ATR(LOCATION) | Notes |
| Stop buffer | max(2 ticks, 0.15 × ATR(LOCATION)); if 01 commits to a different buffer, use 01's so Fib and swing stops agree | Midpoint of the swing notes' 0.1–0.25 × ATR range; Osler's stop clustering |
| Targets | T1 = B, T2 = EXT 1.272, T3 = EXT 1.618, in equal thirds; breakeven at T1; trail after T2 | Boroden and DiNapoli staging; notes; thirds are a design choice |
| Session | ETH | Design proposal |

```text
# FIB REFERENCE ENGINE (design proposal). Every rule reads only objects with confirm_time <= now.
# Grids and zones are immutable once active: any change creates a new version and cancels orders
# tied to the old one.

# 1. SWINGS (one engine per layer; definition owned by 01) --------------------------------------
for L in stack:
    SWING[L] = DirectionalChange(threshold = 2.0 * ATR14(L), freeze_atr_at_extreme = True)
    # Swing = {id, type H|L, price = true traded extreme from ticks, pivot_time, confirm_time,
    #          atr_at_extreme, layer}

# 2. GRIDS ------------------------------------------------------------------------------------
on SWING[L] confirms swing B at time t:
    A   = last confirmed opposite swing before B on L
    dir = +1 if B.type == H else -1
    S   = |B.price - A.price| / B.atr_at_extreme
    if S >= 3.0:
        g = Grid(layer=L, A, B, dir, activated=t, version=1, state=ACTIVE)
        g.RETR[x] = B - x*(B - A)   for x in [0.382, 0.5, 0.618, 0.786]
        g.EXT[x]  = A + x*(B - A)   for x in [1.272, 1.618]
        g.r_act   = |B - extreme_since(B, t)| / |B - A|        # confirmation-lag tax
        mark g.RETR[x] PASSED for every x <= g.r_act           # never receives a resting order
        POOL[L][dir].push(g); POOL[L][dir].keep_last(3)        # older grids become AGED_OUT
    for g in POOL[L][-dir] where B is the first confirmed swing after g.B:   # B ends g's correction
        C = B; g2 = g.new_version()
        g2.PROJ[x] = C + g.dir * x * |g.B - g.A|   for x in [0.618, 1.0, 1.618]   # COP / OP / XOP
        g2.BEXT[x] = C + g.dir * x * |g.B - C|     for x in [1.272, 1.618]        # Boroden targets

# 3. CLUSTERS (LOCATION layer LOC, setup direction d) -----------------------------------------
on bar close of LOC:
    gov = newest ACTIVE grid in POOL[LOC][d]                   # the impulse being retraced
    G   = ACTIVE grids in POOL[LOC][d]  +  newest ACTIVE grid in POOL[up(LOC)][d]
    lv  = [RETR levels of G that are FRESH and not PASSED]
    lv += BEXT(P->Q, x) = Q - x*(Q - P) for x in [1.272, 1.618]
          if the pullback since gov.B contains a confirmed counter-swing P->Q on LOC
    lv += PROJ_SYM(x) = gov.B - d*x*|prior correction| for x in [0.618, 1.0, 1.618]
    lv += PROJ_ABC(x) = Q - d*x*|gov.B - P| for x in [0.618, 1.0, 1.618]
          if the pullback is a confirmed two-leg B->P->Q
    keep levels strictly between gov.A and current price (the entry side, inside the leg)
    exclude every 0% and 100% level (those are SWING levels; see 01 and 06)
    w     = 0.2 * ATR14(LOC)                                   # frozen into each zone it creates
    win   = windows of sorted lv with span <= w, >= 3 levels, >= 2 distinct legs
    zones = merge overlapping windows; split any zone wider than 0.5*ATR14(LOC) at its largest
            gap; drop sub-zones that no longer qualify; pad each zone by 1 tick; state = FRESH

# 4. ENTRY (one pre-declared condition per role) ----------------------------------------------
CONTEXT  : STRUCTURE(bias layer) == d at grade G3              # Fib never sets bias
LOCATION : cluster mode -> price reaches a FRESH zone
           band mode    -> first pullback into gov.RETR[0.618..0.786] after gov produced a BOS
TRIGGER  : if STRUCTURE(TRIGGER layer) == d when the zone forms (Boroden Type 1):
               resting limit at the zone midpoint; cancel if a TRIGGER-layer CHoCH against d
               occurs before the fill (the setup then becomes Type 2)
           else (Type 2, and every band-mode entry):
               market entry on the close of the first CHoCH(TRIGGER layer) in direction d that
               occurs after the zone is TESTED and before it is BROKEN

# 5. STOP --------------------------------------------------------------------------------------
cluster mode : stop = far edge of the zone - d * STOP_BUFFER   # Boroden: "a few ticks" beyond
band mode    : stop = gov.A - d * STOP_BUFFER                  # OTE / golden-pocket: beyond 100%
STOP_BUFFER  = max(2 ticks, 0.15 * ATR14(LOC))

# 6. TARGETS (all known at entry, so the full bracket is placed on the fill) -------------------
T1 = gov.B ; T2 = gov.EXT[1.272] ; T3 = gov.EXT[1.618]         # equal thirds
on T1 fill: stop -> entry price
on T2 fill: trail stop beyond each newly confirmed SWING(TRIGGER layer) swing in direction d
# Documented alternatives, applied only as management updates after C confirms:
#   Boroden T2 = BEXT[1.272] of gov.B->C ; DiNapoli T2/T3 = OP / XOP (never COP when r > 0.618)

# 7. LIFECYCLE AND LOGGING ----------------------------------------------------------------------
level : FRESH -> USED (touched after activation) | PASSED (already crossed at activation)
zone  : FRESH -> TESTED (first wick) -> TRADED | BROKEN (LOC close beyond far edge)
        | VOID (governing grid invalidated); one trade per zone, a zone never re-arms
grid  : ACTIVE -> INVALIDATED (LOC close beyond A against dir) | AGED_OUT
log   : every event with grid/zone ids and versions, A/B/C pivot_time and confirm_time,
        ATR values used, w, zone members, and the full layer-stack snapshot
```

Five rules make this non-repainting in the strict sense. First, anchors are confirmed swings, and a grid exists only from B's confirmation time. Second, higher-timeframe legs come only from closed higher-timeframe bars; the swing notes describe the equivalent of Pine's `[1]`-offset pattern ([Pine Script User Manual: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). Third, grids and zones get new versions and are never edited. Fourth, provisional grids on a still-extending leg may be drawn dashed for review, but orders are never placed off them. Fifth, ATR values are frozen at the moment they are used, so recomputing history reproduces exactly what the live engine logged.

The layer stacks below show where Fibonacci fits. They are design proposals; executable versions belong to [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md). Adjacent layers sit roughly 4–6× apart, following the swing notes' practitioner convention.

| Style | CONTEXT | LOCATION (grids and clusters) | TRIGGER | MANAGEMENT |
|---|---|---|---|---|
| Swing | W1 or D1 STRUCTURE (G3) | Last 3 H4 legs plus the dominant D1 leg; w = 0.2 × ATR(H4) | H1 CHoCH | Buffer from ATR(H4); ladder from the governing H4 leg |
| Intraday, time bars | H4 STRUCTURE | Last 3 H1 legs plus the dominant H4 leg; w = 0.2 × ATR(H1) | M15 CHoCH | Buffer from ATR(H1) |
| Intraday, volume bars | D1 (clock time) or VB-A STRUCTURE | Last 3 VB-B legs plus the dominant VB-A leg; w = 0.2 × ATR(VB-B) | VB-C CHoCH | Buffer from ATR(VB-B) |
| Scalp | M30 STRUCTURE | Last 3 M5 legs plus the dominant M30 leg; w = 0.2 × ATR(M5) | M1 CHoCH | Buffer from ATR(M5) |

The candid caveat from the evidence applies directly. The lower the LOCATION layer, the weaker the case that anyone else has drawn the same grid. A scalp stack whose clusters come from M5 or VB-C legs should be the first to be dropped if the control test below is a draw.

## Volume bars change when a grid exists, not where its levels sit

Fibonacci arithmetic uses price only. On constant-volume bars it is therefore identical to time bars whenever the same anchors are chosen. Each VB-A, VB-B or VB-C bar contains all the trades of its slice, so its high and low are true traded extremes. The swing notes add that on any non-time bar a swing's extreme should come from tick data, not from a synthetic bar boundary. What changes is which swings get chosen and when they confirm. The directional-change detector was built for event-driven sampling of tick data rather than fixed time intervals ([Tsang DC4TD 2021](https://www.bracil.net/finance/papers/Tsang-DC4TD-JCEBS-2021.pdf)), so it carries over to volume bars unchanged. Bar-count pivots, by contrast, change meaning: "R bars" becomes R units of traded activity, so their lag scales with activity rather than with minutes (see [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md)). The rest of this table is inference from those properties and from the shared VB definitions.

| Aspect | Time bars | VB-A / VB-B / VB-C | Consequence for Fib |
|---|---|---|---|
| Level arithmetic | Price only | Identical | Same anchors give identical levels on both charts |
| Anchor prices | Bar extremes | Bar extremes = true traded extremes | Identical whenever the same swing is selected |
| Which swings qualify | 2.0 × ATR(time layer) | 2.0 × ATR(VB layer), a different threshold | The leg set, and so the grid set, differs |
| Confirmation in clock time | Fixed bar duration | Faster when activity is high (open, news), slower overnight | Grids activate sooner after fast moves |
| Confirmation-lag tax, in ATR | k/S | k/S | Unchanged; the leg-size table applies as is |
| Weekly bar-size recalibration | Not applicable | ATR(VB) steps when the bar size changes | ATR frozen at extremes and w frozen at zone formation absorb the step; log each recalibration |
| Session boundaries | ETH/RTH template | Bars break at session start | No bar straddles a session; legs may still span sessions, which is fine for price-only levels |
| Fibonacci time | Clock-bar counts | Activity counts | Another reason to exclude time |
| D1/W1 contributors | Clock time | Stay on clock time | Drawn as fixed prices on the VB chart from the exact extreme bar |

The practical rule is simple. A volume-bar Fibonacci stack is the time-bar stack with SWING(L) and ATR(L) recomputed on VB-A, VB-B and VB-C. It keeps the same ratios, tolerance multiple, invalidation and ladder, and the same pre-commitment to clock-time D1/W1 legs as level providers. Because the confirmation-lag tax is unchanged in ATR terms, volume bars do not rescue the shallow levels. They only move, in clock time, the point at which the grid activates.

## How to visually verify auto-Fib grids and clusters

You plan to judge each proposal by eye and by forward validation, so the review chart has to make every hidden choice visible. The checks below are design proposals. Together they turn "the levels look right" into a set of pass/fail observations.

| Check | What the review chart must show | Pass | Red flag |
|---|---|---|---|
| Anchors are confirmed swings | A swing marker at each extreme's time plus a smaller marker at its confirmation bar (per 01); every grid drawn starting at its activation bar | Every grid begins at B's confirmation marker | A grid drawn from B itself, or anchored to a swing with no confirmation marker |
| Leg qualifies | Leg size in ATR(L) printed on the leg | ≥ 3.0 on every grid | Grids on small legs; anchors that differ from what the swing panel shows |
| Arithmetic | Price labels on every level; spot-check one leg by hand against the worked example | Hand calculation matches to the tick | Platform OP/COP anchored at B instead of C (the DiNapoli ambiguity) |
| Confirmation-lag tax | r_act printed on activation; PASSED levels greyed out | Engine never rests orders at PASSED levels | A "perfect" 0.382 bounce that the log shows as traded |
| Replay parity | Step bar by bar; grids change only at logged events (activation, new version, invalidation, aging out) | The historical redraw matches the live log exactly | A grid that moves between events, or a zone that appears earlier on reload |
| Cluster audit | Each zone lists its members: leg id, layer, kind, ratio, price; plus span versus w and the distinct-leg count | ≥ 3 members, ≥ 2 legs, span ≤ w, no 0%/100% members | Same-leg members, swing extremes counted as Fib, zones wider than 0.5 × ATR |
| Tolerance sanity | w shown in ticks for ES/NQ (0.25) and CL (0.01) | w is several ticks wide | w under 2 ticks means the LOCATION layer is too fine; move it up a layer rather than change the definition |
| Higher-timeframe mapping | HTF legs drawn on the LTF chart from the exact bar holding the extreme | Every HTF anchor equals an LTF swing price (the nesting check in 01) | An HTF anchor price that matches no LTF swing (mismatched sessions or thresholds) |
| Invalidation and lifecycle | Grid end markers on closes beyond A; zone state colors (fresh/tested/traded/broken/void) | One trade per zone; zones never re-arm | Re-entries into a used zone; grids that survive a close beyond A |
| Roll and session | Roll dates marked; the session template stated on the chart | D1/W1 legs that span a roll are flagged; ETH or RTH declared | Unflagged roll gaps inside a leg |

The most important check is a **control grid**, an informal visual version of Osler's comparison against arbitrary levels. Alongside the real grid, the engine computes a second grid with identical anchors, contributors, tolerance and cluster rules, using ratios shifted 0.06 shallower: {0.322, 0.44, 0.558, 0.726} for retracements, with the extension and projection ratios shifted by the same 0.06. Shallower levels get touched more often, so this control is deliberately generous. That is a design choice. Over a few weeks of forward review, tally how often each grid produces qualifying zones and how often price visibly reacts at them before the stop. Keep the tally for real and control zones separately, on the same instruments and layers.

If you cannot tell the two apart, Fibonacci adds nothing beyond structure and volume in your stack. FIB-CLUSTER should then be removed from LOCATION, keeping only the ruler and the ladder. If the real clusters look clearly better, the slot is earned for that stack and layer, not in general. This is not a backtest. It is a structured way of looking, set up so that the reviewer's eye cannot quietly favor the levels it expects to work.

## Conclusion

The question for automation is not which ratio to trust. It is which levels exist in real time. Once anchors must be confirmed swings, the confirmation-lag tax decides what can be traded far more than any argument over 0.618 versus 0.62 or 0.65, differences that fall below a tick on typical ES legs. That pushes a Fibonacci system toward three things: older and higher-layer legs, deep entries, and trigger-based execution. Resting limits at shallow levels of the newest leg drop out. A finished chart hides all of this, and that explains much of Fibonacci's reputation.

Fibonacci's lasting value to this project is as a coordinate system. Measuring depth in r and targets in leg multiples makes ES, NQ and CL setups comparable from W1 down to VB-C, and it lets the engine fix the entire bracket at the moment of the fill. Whether Fibonacci deserves more than that, a LOCATION vote through FIB-CLUSTER, is a falsifiable question you can settle by eye with the control grid. If the control grid looks just as good, the rational move is to keep swing extremes, the 50% midpoint and volume-at-price, and let φ go.
