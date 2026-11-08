# Multi-timeframe strategy research: index and reading guide

## Purpose and honest framing

This set of write-ups researches the core trading dimensions one at a time:

- swing points and price action across multiple timeframes
- volume profile
- Fibonacci retracements and extensions
- supply and demand zones and imbalance candles (file 13, which has its own section on how it ties into the other three)

An optional fifth input, options dealer gamma for ES/NQ, is covered separately in file 12. The set then explains how the three core dimensions play off each other and turns the research into strategy proposals that can be triggered automatically and left to run. The project is **primarily for futures trading**: CME equity index and energy futures (ES/MES, NQ/MNQ, CL/MCL). Equities and equity options appear only as an optional, secondary context input and execution vehicle, in file 12. The eventual deployment target is a **private server running against a separate, dedicated trading account, most likely through Rithmic** (R|Protocol). The repository's Tradovate integration remains an alternative route.

This is not a search for a holy grail, and nothing here is a profitable backtest. The proposals are built on concepts with a documented mechanism and long practitioner use. Each concept carries an explicit evidence grade, and the grades are often modest. The strongest rigorous evidence supports price levels in general, for example support/resistance and stop clustering. No peer-reviewed study supports Fibonacci ratios or volume-profile nodes specifically in futures (see [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)). "Proven concepts" therefore means proven *mechanisms and definitions*, not proven profits. Every numeric default is a pre-committed starting value drawn from the research notes, not an optimized one.

There is no backtesting step. The validation path is:

1. Visually review each proposal on charts against its frozen rules.
2. Forward-validate it: signal-only first, then simulated execution, then the minimum live size. The protocol is in [07 Automation architecture](07%20Automation%20architecture.md).

Changing a rule creates a new version and restarts its sample, so the review loop does not quietly turn into curve-fitting. The dimensions are deliberately kept separate. They are combined only by giving each one a distinct role on a distinct timeframe layer, never by blending them into a single score.

## The files

All files live in this folder. Cross-references use relative links with URL-encoded spaces.

| # | File | Scope |
|---|---|---|
| 00 | [00 Index and reading guide](00%20Index%20and%20reading%20guide.md) | This file: purpose, file map, reading orders, shared conventions glossary, evidence-grade legend |
| 01 | [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md) | Swing point definitions, swing hierarchy, market structure and the multi-timeframe swing framework |
| 02 | [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) | Multi-timeframe price action frameworks, timeframe stacks, and automatable setups and triggers |
| 03 | [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md) | Volume profile and auction market theory across session, weekly, monthly, composite and anchored profiles, and how to compute them |
| 04 | [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md) | Fibonacci levels, anchoring, clusters, the evidence and automation |
| 05 | [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md) | Volume (constant-volume) bars vs time bars, and how price action works on volume bars |
| 06 | [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) | How the three dimensions interact: pairwise mechanisms, the role-by-layer framework, worked templates, named methods, confluence math and pitfalls, evidence base, scalping vs swing |
| 07 | [07 Automation architecture](07%20Automation%20architecture.md) | Automation architecture, data and APIs (Rithmic, Tradovate), risk controls and forward validation |
| 08 | [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md) | Strategy proposals built on swing structure and price action (PA-xx) |
| 09 | [09 Proposals volume profile](09%20Proposals%20volume%20profile.md) | Volume-profile-led strategy proposals (VP-xx) |
| 10 | [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md) | Fibonacci-led strategy proposals (FIB-xx) |
| 11 | [11 Proposals confluence](11%20Proposals%20confluence.md) | Proposals that combine two or three dimensions, plus regime routing between them (CX-xx) |
| 12 | [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md) | Optional context dimension for intraday ES/NQ: S&P/NASDAQ options dealer gamma exposure (GEX: zero-gamma/flip level, call/put walls, 0DTE effects) and equity-market internals; how equities or equity options could serve as an optional execution vehicle; its own GEX-xx proposals |
| 13 | [13 Supply and demand zones and imbalances](13%20Supply%20and%20demand%20zones%20and%20imbalances.md) | Supply/demand zones (Seiden/OTA, Moreno), price-action imbalances (displacement, fair value gaps, order blocks) and footprint order-flow imbalances: definitions, swing and multi-timeframe links, evidence grades, a look-ahead-free zone registry, and its own SD-xx proposals |

Proposal IDs use the prefixes PA-, VP-, FIB-, CX-, GEX- and SD-, numbered within each file. Each proposal states its layers, its one condition per role, its defaults and its evidence grade.

### Proposal catalogue

There are 73 proposals in total. Each file names its own suggested starting set and the combinations that must not run together.

| File | IDs | Count | Suggested first proposals (from each file's closing section) |
|---|---|---|---|
| [08](08%20Proposals%20price%20action%20and%20swing.md) | PA-01 to PA-15 | 15 | PA-11, PA-01, PA-04 (PA-12 in a separate swing sleeve) |
| [09](09%20Proposals%20volume%20profile.md) | VP-01 to VP-15 | 15 | VP-03, VP-05, VP-14 |
| [10](10%20Proposals%20Fibonacci.md) | FIB-01 to FIB-13 | 13 (11 setups plus 2 modules, FIB-05 and FIB-12) | FIB-08, FIB-02, FIB-06, with FIB-05 and FIB-12 running inside them |
| [11](11%20Proposals%20confluence.md) | CX-00 to CX-15 | 16 (CX-00 is the regime router) | CX-08, CX-01, CX-15 |
| [12](12%20Options%20gamma%20and%20equity%20context.md) | GEX-01 to GEX-06 | 6 (context overlays, never triggers) | The GAMMA_REGIME filter in signal-only mode, then GEX-01 |
| [13](13%20Supply%20and%20demand%20zones%20and%20imbalances.md) | SD-01 to SD-08 | 8 | SD-01, SD-06, SD-02 (SD-02 signal-only) |

## Suggested reading orders

**To start automating quickly:**

1. Read this file's conventions so the names in every other file make sense.
2. Read [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) for the role-by-layer tables, the two worked templates (one swing, one scalp) and the closing design principles.
3. Read [07 Automation architecture](07%20Automation%20architecture.md) for the engine design, Rithmic/Tradovate data, risk controls and the forward-validation stages you will run before going live.
4. Pick one proposals file that matches how you already trade: [08](08%20Proposals%20price%20action%20and%20swing.md) for price action, [09](09%20Proposals%20volume%20profile.md) for volume profile, [10](10%20Proposals%20Fibonacci.md) for Fibonacci or [13](13%20Supply%20and%20demand%20zones%20and%20imbalances.md) for supply/demand zones and imbalances. Choose one or two proposals and run them signal-only first.
5. Move to [11 Proposals confluence](11%20Proposals%20confluence.md) once a single-dimension proposal is running cleanly.
6. Use [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md) if your trigger layer runs on volume bars. Consult 01, 03 and 04 only for the definitions your chosen proposals reference.
7. Add [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md) only if you trade ES/NQ intraday and want the optional options-derived context input.

**For the full theory:**

1. [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md). Swing definitions come first because market structure and every Fibonacci grid are built on them.
2. [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md). Stacks, alignment and triggers build on the swing framework.
3. [13 Supply and demand zones and imbalances](13%20Supply%20and%20demand%20zones%20and%20imbalances.md). Zones, fair value gaps and order blocks are anchored on the swings from 01 and the structure from 02.
4. [05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md). This shows how swings and price action change on constant-volume bars before profiles enter.
5. [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md). This is the independent volume-at-price dimension.
6. [04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md). The geometry is drawn on the swings from 01.
7. [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md). This joins the three without double-counting.
8. [07 Automation architecture](07%20Automation%20architecture.md). This covers how any of it runs unattended and how it is validated.
9. Files 08 to 11, the proposals, in order.
10. File 12, the optional options and equity context.

## Shared conventions (canonical glossary)

Every file in this set uses these names, so the documents cross-reference cleanly. Synonyms are not used. All numeric defaults are pre-committed starting values drawn from the research notes, not optimized. Individual files may introduce further defaults for their own rules, and each such default is stated where it is used.

### Instruments and sessions

| Term | Definition |
|---|---|
| Instruments | CME equity index and energy futures: ES/MES, NQ/MNQ, CL/MCL |
| ETH | Electronic (Globex) session, about 23 hours |
| RTH | Regular trading hours (cash hours) |
| Session rule | Every rule states whether it uses ETH or RTH |

### Layers and roles

| Term | Definition |
|---|---|
| Layer | One chart series in a stack. Each layer has exactly one role |
| CONTEXT | Bias: which direction, if any, is allowed |
| LOCATION | Where to act |
| SETUP | The state that arms a trigger at a location |
| TRIGGER | When to act |
| MANAGEMENT | Stops and targets |
| Highest layer | 1-week candles (W1). Nothing above weekly is used as a decision layer |
| Time-bar labels | W1, D1, H4, H1, M30, M15, M5, M1 |
| Volume-bar labels | VB-A, VB-B, VB-C: constant-volume bars sized ADV/50, ADV/250 and ADV/1000 of the instrument's 20-session average daily volume, about 5× and 4× apart. Recalibrated weekly. Bars break at session start |
| Clock-time rule | Time-based reference levels and the W1/D1 bars always stay on clock time |

### Volatility, swings and structure

| Term | Definition |
|---|---|
| ATR(L) | 14-period ATR on layer L's own bars (session-aware for RTH-based layers) |
| SWING(L) | Confirmed swing highs/lows on layer L. Default detector: directional-change / ATR-ZigZag with reversal threshold k × ATR(L), k = 2.0, ATR frozen at the extreme. Alternative: Pivot(L,R) bar-count pivots, default 3/3. Each swing stores its extreme time and its confirmation time; only confirmed swings may drive decisions. To emulate higher degrees on one series, use the ladder k, 2k, 4k |
| STRUCTURE(L) | State ∈ {UP, DOWN, RANGE, TRANSITION}, derived from confirmed alternating swings |
| BOS | Break of structure: a close beyond the last confirmed swing in the trend direction |
| CHoCH | Change of character: the first close beyond the protected swing against the trend |
| G1 | HTF trend-change grade 1: an LTF touch or sweep of the HTF protected swing. A test only |
| G2 | HTF trend-change grade 2: an LTF close beyond the HTF protected swing. Provisional; "stand aside" |
| G3 | HTF trend-change grade 3: an HTF bar close beyond the HTF protected swing. Confirmed; use for bias |
| Equal highs/lows tolerance | 0.15 × ATR(L) |

### Reference levels

| Term | Definition |
|---|---|
| PDH / PDL / PDC | Prior RTH day high / low / close |
| ONH / ONL | Overnight high / low |
| PWH / PWL / PWC | Prior week high / low / close |
| WO / DO | Weekly open / daily open |
| IBH / IBL | RTH initial balance high / low (first 60 minutes) |
| ORH / ORL | Opening range high / low; each strategy states its range length |

### Volume profile

| Term | Definition |
|---|---|
| PROFILE(P) | Volume-at-price built from tick prints (Rithmic LastTrade with aggressor side) at 1-tick rows |
| P (profile window) | One of RTH, ETH, ON, WEEK, MONTH, COMP(n weeks), ANCH(A→B). ANCH(A→B) is anchored between two confirmed swings |
| POC | Point of control: the highest-volume row |
| VAH / VAL | Value area high / low. 70%, single-row expansion from the POC until ≥70% (Sierra-Chart-style). One method is used everywhere |
| dPOC | Developing POC |
| HVN / LVN | High / low volume nodes: smoothed-histogram peaks / valleys with a prominence threshold |
| nPOC | Naked POC: a prior POC not yet traded through |
| Single prints | Thin, one-sided rows left by a fast auction move |
| Poor high / poor low | A flat extreme without excess, read as an unfinished auction. This is not the same as a price-action equal high/low |

### Fibonacci

| Term | Definition |
|---|---|
| FIB(A→B) | Grid on a confirmed swing leg A→B |
| Retracements | 0.382, 0.5, 0.618, 0.786 of the leg, measured back from B |
| Extensions | A + 1.272 × (B − A) and A + 1.618 × (B − A) (beyond B) |
| Projections | C ± 0.618 / 1.0 / 1.618 × \|B − A\| from a confirmed pullback point C |
| Invalidation | The grid is invalidated on a close beyond A |
| FIB-CLUSTER | ≥3 levels from ≥2 distinct anchors within 0.2 × ATR(L) |

### Confluence

| Rule | Definition |
|---|---|
| One condition per role | Each role gets one pre-declared condition |
| No double-counting | Fib levels and swing levels share anchors and must not be counted as independent confirmation |
| Independent dimension | Volume-at-price is the independent dimension |

### Cross-references

Other files are linked with relative markdown links using URL-encoded spaces, for example [01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md).

## Parameter reconciliation

The files were written in parallel, and a few defaults that the shared conventions left open came out slightly different. Use the canonical value below everywhere unless a proposal explicitly overrides it for its own rule, and freeze it before forward testing begins.

| Parameter | Canonical value | Where files differ |
|---|---|---|
| Stop buffer beyond a level or zone | max(2 ticks, 0.10 × ATR(stop layer)) | 01, 08, 09, 10 and 11 use 0.10. 04, 06, 07 and 13 state 0.15, which is the more conservative variant. Pick one and use it in every family. |
| When a market counts as RANGE | A CHoCH with no BOS in the new direction within 4 confirmed swings ([07](07%20Automation%20architecture.md) §2.5) | 01 proposes a TRANSITION → RANGE timeout of 3 confirmed swings. 07 and 11 use 4, and 07 is the engine specification. |
| D1 bar and DO | D1 = the full Globex trade date; DO = the 17:00 CT (18:00 ET) Globex open | A proposal that means the RTH open (09:30 ET) says so explicitly (for example PA-10). |
| Volume-bar tiers | Round VB-C = ADV/1000 first, then VB-B = 4 × VB-C and VB-A = 5 × VB-B, so bar boundaries nest exactly | 01, 02, 05 and 07 agree. The nominal ADV/250 and ADV/50 are approximations of this. |
| Risk limits for unattended running | 2R daily loss, 4R weekly loss, at most 3 trades per instrument per day, stop after 3 consecutive losses, news blackout from 10 minutes before to 30 minutes after scheduled high-impact releases | 05 lists a ±5-minute blackout as a placeholder; use 07's window. |
| Minimum stop distance | 1 × ATR(trigger layer) | 08, 09 and 11 agree. |
| Holding through the 16:00–17:00 CT break | Flat by 15:50 CT until a paper test confirms where broker-held stops rest and that they survive the halt | Swing proposals (for example PA-12, VP-12 to VP-14, FIB-06) stay signal-only or attended until then ([07](07%20Automation%20architecture.md) §6). |

## Evidence-grade legend

| Grade | Meaning |
|---|---|
| A | Peer-reviewed support for the underlying mechanism |
| B | Consistent platform or practitioner consensus with partial or indirect empirical support |
| C | Anecdotal or vendor-only |
| D | Tested and not supported as a standalone signal |

How to read the grades:

- **A grade describes the mechanism a claim rests on, not a strategy's profitability.** An A-grade mechanism (for example, stop orders clustering just beyond salient prices) implemented through a C-grade rule (a specific sweep-and-reclaim definition) is still a C-grade rule.
- **A D grade does not forbid a tool.** It forbids treating the tool as an edge on its own. Fibonacci ratios, for instance, are graded D as standalone levels but remain usable as a measurement convention for pullback depth and target spacing.
- **Grades never substitute for forward validation.** They only tell you how much prior support a concept brings before your own frozen-rule sample begins.

## Underlying research notes

The research notes behind files 01–13, with every source link, live in [../../research_notes/Multi timeframe trading strategy research/](../../research_notes/Multi%20timeframe%20trading%20strategy%20research/). They are:

- `swing_point_theory.md`
- `multi_timeframe_price_action.md`
- `volume_profile.md`
- `fibonacci.md`
- `volume_bars_vs_time_bars.md`
- `concept_interplay.md`
- `automation_architecture.md`
- `options_gamma_equity_context.md` (file 12)
- `supply_demand_imbalance.md` (file 13)

The write-ups label design proposals and inferences as such. Where a write-up and the notes differ on a cited fact, the notes and their linked sources are the reference.
