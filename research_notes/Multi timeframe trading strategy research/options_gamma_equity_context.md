# Options Dealer Gamma Exposure (GEX), Equity-Market Internals, and Equities/Options as an Optional Vehicle for ES/NQ Intraday Trading

Scope note: this is an OPTIONAL add-on dimension, kept separate from the core price-action/swing, volume-profile and Fibonacci research. Futures (ES/MES, NQ/MNQ) are the primary target. Evidence quality is graded throughout: [ACADEMIC] = peer-reviewed or SSRN working paper; [EXCHANGE] = Cboe/CME/Nasdaq/SEC material; [VENDOR] = data/analytics vendor claim (commercial interest); [PRACTITIONER] = blog/forum/education site. Research current as of 2026-11-08. Many academic findings below were read through abstracts, seminar listings, or secondary summaries (Quantpedia, Alpha Architect, search-engine summaries), not full texts; this is flagged where relevant. Nothing here is tax advice.

---

## Key Question 1: What is dealer gamma exposure, what is the mechanism, and what assumptions sit behind public GEX estimates (and why can they be wrong)?

### Takeaway
GEX estimates how much options market makers must buy or sell the underlying (or ES futures) per 1% index move to stay delta-neutral: when dealers are net long gamma they hedge against the move (dampening, mean reversion); when net short gamma they hedge with the move (amplification, momentum). Every public GEX number rests on an unobservable assumption about who holds which side of the open interest (usually the SqueezeMetrics "naive dealer" convention: dealers long calls, short puts), so the sign, the size and the "gamma flip" level are model outputs, not observed facts.

### Cited Findings
- Mechanism (short gamma): hedging a short gamma position requires trading in the direction of price moves, which creates momentum; Baltussen, Da, Lammers & Martens frame this as the mechanism linking option market makers and leveraged ETF rebalancing to market intraday momentum. [ACADEMIC] — [Baltussen et al., JFE 2021 (EconPapers)](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [working-paper PDF](https://www3.nd.edu/~zda/intramom.pdf)
- Mechanism (pinning / long gamma near strikes): delta-hedgers who are long options sell stock when price rises above a strike and buy when it falls below, pushing price toward the strike. [ACADEMIC] — [Pearson, Poteshman & White working paper (OU)](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)
- Barbon & Buraschi's framing: dealers are short gamma on the downside and long gamma on the upside, so a large negative aggregate gamma imbalance should coincide with larger volatility and short-term momentum. [ACADEMIC, via summary] — [Gamma Fragility (Barbon site)](https://abarbon.com/papers/gamma-fragility); [Alexandria/UniSG record](https://www.alexandria.unisg.ch/261487)
- SqueezeMetrics' original GEX white paper (revised Dec 2017) uses "a few assumptions" to overcome the problem that the true dealer position per strike is unknown; secondary sources describe its sign rule as the "naive dealer" assumption: dealers are long the calls customers sold and short the puts customers bought. [VENDOR white paper; secondary description] — [GEX white paper (copy hosted by Slope of Hope)](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf); [LuxAlgo concept page](https://www.luxalgo.com/library/concept/gamma-exposure/)
- SqueezeMetrics' headline empirical claim: daily S&P 500 volatility was markedly lower when GEX was high and rose sharply as GEX fell below zero. [VENDOR, via secondary] — [QuantumAlgo guide](https://www.quantum-algo.com/blog/guides/gamma-exposure/)
- SpotGamma itself states that many gamma models assume all calls are sold to dealers and all puts are bought from dealers, and that this "cannot be 100% true" (it applies its own positioning adjustments). [VENDOR] — [SpotGamma: SPX gamma model positioning adjustments](https://spotgamma.com/spx-gamma-model-positioning-adjustments/)
- GEX estimates depend on assumptions about who is on which side of a trade, so different providers' numbers differ. [PRACTITIONER] — [Convextrade glossary](https://convextrade.com/glossary/dealer-gamma-exposure)
- A 2026 MPRA working paper argues GEX carries a quantifiable 30–50% error margin (critic's claim; not independently verified in this session). [ACADEMIC working paper, unrefereed] — [IDEAS/RePEc MPRA 129365](https://ideas.repec.org/p/pra/mprapa/129365.html)
- Exchange-level data show actual positioning differs from the naive convention: Cboe (which sees each SPX transaction's customer/market-maker side and open/close) finds 0DTE customer flow "remarkably balanced" and market-maker net gamma small and frequently changing sign (see Q2). Cboe also notes outsiders' estimates of customer balance are assumption-based because they lack the side breakdown. [EXCHANGE] — [Cboe, "Much Ado About 0DTEs" (Sep 2023)](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)
- Dealers may hold offsetting positions in other expiries or equivalent products (E-mini options, SPY 0DTE), and may hedge 0DTE options with other options rather than futures, so single-product GEX can misstate the hedge flow that reaches ES. [EXCHANGE] — [Cboe (Sep 2023)](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)

### Inferences
- Two families of estimates exist: (a) open-interest (OI) based with a sign convention (SqueezeMetrics-style; cheap; stale intraday because OI is published once per day, see Q3), and (b) trade-classified/side-aware flow (Cboe Open-Close data, academic "net market-maker gamma" from exchange data; more accurate; costlier; delayed by minutes). The academic papers with the strongest identification (Adams et al.; Cboe internal analyses) use side-aware data, not the naive convention.
- Practical consequence: a "gamma flip" level from a naive-convention model is a modeled price where an assumed inventory changes sign. If the convention is wrong (e.g., heavy customer call buying, or customers selling puts), the true flip can be far away or the sign can be inverted. It should be used as a soft regime prior, not a hard switch.
- The mechanism only matters to the extent hedge flow is large relative to liquidity. Cboe estimates SPX 0DTE net hedging at 0.04%–0.17% of daily S&P futures liquidity on average (see Q2), which is a reason to expect modest, conditional effects rather than deterministic levels.

### Gaps
- Could not retrieve the full SqueezeMetrics white paper text; exact wording of its assumptions and its sample statistics should be checked against the original (sqzme.co).
- Could not verify the MPRA "30–50% error" methodology.
- No independent, published head-to-head comparison of vendor GEX (SpotGamma vs SqueezeMetrics vs MenthorQ) against true exchange-side positioning was found.

---

## Key Question 2: What does the academic and exchange evidence say about gamma's effect on index/index-futures intraday behavior (volatility, mean reversion vs momentum, pinning, intraday momentum, 0DTE)? What is established vs contested?

### Takeaway
Reasonably established: (1) expiration-day strike clustering ("pinning") in optioned stocks; (2) market intraday momentum (first half-hour/rest-of-day predicts last half-hour) exists broadly in futures and is concentrated on days when estimated dealer/leveraged-ETF gamma is negative; (3) positive net market-maker gamma is associated with lower short-horizon S&P volatility and more order-flow reversal. Contested: whether 0DTE dealer gamma is net short (vendor/media narrative) or net long/near-flat (Cboe data, Adams et al., Dim/Eraker/Vilkov) — the better-identified evidence leans toward 0DTE dampening, not amplifying, volatility on average, with fat-tailed exceptions.

### Cited Findings
**Pinning (Ni, Pearson & Poteshman 2005)**
- NPP (Journal of Financial Economics 78(1), 49–87, 2005) find closing prices of optioned stocks cluster at strike prices on expiration dates; attributed to delta-hedge rebalancing by market makers and to manipulation by proprietary traders. [ACADEMIC] — [EconPapers record](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)
- Reported magnitude (per abstract-based summary): returns of optioned stocks altered by at least 16.5 bp on average on each expiration date, roughly $9 billion of aggregate market-cap shifts; clustering is statistically significant but not present for every stock on every expiry. [ACADEMIC via summary] — [EconPapers record](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87); [FXStreet explainer](https://www.fxstreet.com/education/lessons-from-the-pros-options-201501200000)
- Pearson, Poteshman & White: strong evidence of option hedging altering stock prices is limited to expiration dates (working paper version). [ACADEMIC] — [OU PDF](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)
- A formal pinning model (Avellaneda & Lipkin line of work) is summarized in Avellaneda's slides. [ACADEMIC slides] — [NYU slides](https://math.nyu.edu/inmemoriam/avellaneda/PinningSlides.pdf)

**Market intraday momentum and hedging demand**
- Gao, Han, Li & Zhou, "Market intraday momentum," JFE 129(2), 394–414 (2018): the return from the prior close through the first half-hour predicts the last half-hour return (SPY high-frequency data 1993–2013); stronger on more volatile days, higher-volume days, recession days and major macro-news days; present in ten other ETFs; explained by infrequent rebalancing and late-informed trading. [ACADEMIC] — [EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414); [WUSTL profile](https://profiles.wustl.edu/en/publications/market-intraday-momentum/)
- Cross-country replication (Li, Sakkas & Urquhart, Journal of Financial Markets): significant predictability in 12 of 16 developed markets. [ACADEMIC] — [Reading accepted version](https://reading-9.eprints-hosting.org/95566/1/Accepted-Version.pdf)
- Baltussen, Da, Lammers & Martens, "Hedging demand and market intraday momentum," JFE 142(1), 377–403 (2021): using 60+ futures on equities, bonds, commodities and currencies, 1974–2020, the last-30-minute return is positively predicted by the rest-of-day return, economically and statistically highly significant, and it reverts over the next days. [ACADEMIC] — [EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Erasmus repository](https://pure.eur.nl/en/publications/hedging-demand-and-market-intraday-momentum/)
- Baltussen et al. link it to gamma hedging using S&P 500 index option and leveraged-ETF data: momentum is present when negative gamma exposure is present and strengthens with its size; a secondary summary says the pattern is much stronger on negative-gamma days and largely absent on positive-gamma days. [ACADEMIC via secondary] — [Alpha Architect summary (search snippet; page blocked to fetch)](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)
- Related: Da and coauthors document an end-of-day reversal in individual stocks distinct from market-level intraday momentum and not explained by gamma hedging. [ACADEMIC] — [Da, EOD paper PDF](https://www3.nd.edu/~zda/EOD.pdf)

**Gamma Fragility (Barbon & Buraschi) and leveraged-ETF extension**
- Barbon & Buraschi, "Gamma Fragility: Asset Pricing Implications of Delta-Hedging" (working paper, last revised 2021-03-19): intraday momentum (reversal) is explained by the interaction of negative (positive) ex-ante aggregate dealer gamma imbalance and illiquidity; stronger in the least liquid underlyings; gamma imbalance is related to frequency and magnitude of flash-crash events; distinguished from information and funding-liquidity channels. Stock-level proxy computed from a large equity-options panel. [ACADEMIC] — [Barbon site](https://abarbon.com/papers/gamma-fragility); [UniSG](https://www.alexandria.unisg.ch/261487)
- Barbon, Beckmeyer, Buraschi & Moerke (2021): large negative aggregate gamma imbalance (scaled by dollar volume) produces end-of-day momentum, positive produces reversal; effects quickly revert at the next day's open (temporary price pressure). [ACADEMIC] — [SSRN 3925725](https://papers.ssrn.com/abstract=3925725)

**0DTE studies (the contested area)**
- Adams et al., "Do S&P500 Options Increase Market Volatility? Evidence from 0DTEs" (SSRN 5641974; summarized Feb 2026): index volatility ~60 annualized bp lower on days with 0DTE trading; identification uses Tue/Thu 0DTE availability before May 2022 (when 0DTEs became available every business day); market makers hold larger net gamma on expiration days and it stays positive through the day; higher net gamma predicts lower S&P 500 volatility over the next 10 minutes (fading after ~1 hour), stronger E-mini order-flow reversals, and negative high-frequency momentum; hedging needs ~1% of shares per 1% index move pre-2022, raised ~0.15 pp by 0DTE presence; two-stage multiplier of −4 (1 bp more hedging need → 4 bp lower realized vol); pre-existing longer-dated positions rolling into 0DTE status add ~24 bp to hedging needs vs ~3 bp from new same-day 0DTE positions. Uses E-mini order flow and the Ni, Pearson, Poteshman & White hedging-needs framework. [ACADEMIC via Quantpedia summary] — [Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/); [Resonanz Capital commentary](https://resonanzcapital.com/insights/every-day-the-market-hires-a-counter-trend-trader)
- Dim, Eraker & Vilkov, "0DTEs: Trading, Gamma Risk and Volatility Propagation" (SSRN 4692190, 2024): high open-interest gamma in 0DTEs does not propagate past volatility, contrary to the view that 0DTE delta hedging amplifies moves; intraday 0DTE volume shocks do not amplify recent index returns; 0DTE and underlying markets have become more integrated with a marginally stronger link between index volatility and 0DTE trading. [ACADEMIC, seminar abstract] — [Oxford Mathematical Institute seminar listing (11 Apr 2024)](https://www.maths.ox.ac.uk/node/67396); SSRN id per [Harbourfront Quant](https://harbourfrontquant.substack.com/p/the-rise-of-0dte-options-cause-for)
- A secondary summary attributes to Dim/Eraker/Vilkov that aggregate 0DTE gamma moves inversely with realized intraday volatility (stabilizing) and that the 0DTE volatility risk premium is the largest among tenors (secondary only; not verified against the paper). [ACADEMIC via secondary] — [Harbourfront Quant](https://harbourfrontquant.substack.com/p/impact-of-zero-dte-options-on-the)
- A Princeton thesis finds 0DTE trading is related to intraday volatility but the evidence does not support the canonical gamma-hedging feedback channel as the primary mechanism (student thesis; lower weight). [ACADEMIC, thesis] — [Princeton thesis record](https://theses-dissertations.princeton.edu/entities/publication/61115cd1-cb09-4a8b-9230-ff488fc2a386)
- Cboe (Mandy Xu, Sep 2023), using actual SPX market-maker positions: 0DTE customer flow "remarkably balanced"; daily average market-maker net gamma ranges $170mm–$670mm; at 3:30pm median +$173mm, interquartile −$1.1bn to +$2.4bn, whiskers −$5bn to +$7.7bn; average net gamma equals 0.04%–0.17% of daily S&P futures liquidity (~$400bn/day), 3:30pm whiskers 1.3%–1.9%; example day (Aug 15, 2023) flipped from ~+$2bn at 3pm to ~−$500mm by 3:30pm. [EXCHANGE] — [Cboe Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)
- Cboe (May 2025): SPX 0DTE volume grew >5x in 3 years to ~2M contracts/day; retail ~50–60% of SPX 0DTE (fell 57%→47% during the April 2025 vol spike, rebounded to ~60%); >95% of 0DTE trades are limited-risk (long options or spreads), only 4% naked short; net MM gamma hedging "de minimis," at best 0.2% of SPX daily liquidity; MM hedging flows unlikely a significant driver of the April 2025 volatility. [EXCHANGE — note Cboe has a commercial interest in 0DTE's reputation] — [Cboe May 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)
- Out-of-sample test (Maurer, posted by OptionMetrics May 2026): dealer gamma adds forecasting power for overnight gap magnitude only in low-VIX (calm) regimes (~15% reduction in calm-regime quantile loss at τ=0.99; Holm correction across 100 Clark-West tests); pooling regimes washes the effect out; author calls it "the inverse of the practitioner narrative" that gamma matters most in stress. [ACADEMIC working paper via vendor page] — [OptionMetrics research page](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/)

### Inferences
- Established enough to use as a context prior: (i) a GEX-negative day raises the odds that late-session moves continue in the day's direction (Baltussen; Barbon et al.), with reversal over the next day(s)/next open; (ii) high positive net gamma raises odds of short-horizon reversal in ES order flow and lower 10–60 minute volatility (Adams et al.); (iii) expiry-day closes gravitate to heavy strikes in single names (NPP) — the index-level analogue is plausible but less documented.
- The 0DTE "volatility bomb" narrative is not supported by the best-identified evidence on average; however the Cboe distribution has fat tails (−$5bn to +$7.7bn at 3:30pm) and sign flips within 30 minutes, so tail days can still see meaningful late-day flow. A context filter should therefore be conditional and update intraday, not set once at the open.
- Effect horizons matter for ES/NQ intraday automation: Adams' predictive effect decays within ~1 hour; Baltussen's operates in the last 30 minutes; Barbon et al.'s reverts at the next open. Gamma context is thus most relevant to (a) holding-period/target selection late in the RTH session and (b) whether to fade or follow extensions, not to multi-day swing targets.
- The Gao/Baltussen intraday-momentum result directly overlaps the core research's intraday-momentum concept: GEX sign is the published conditioning variable that strengthens or kills it, which is a concrete, concept-driven (not optimized) way to use gamma.

### Gaps
- No Nasdaq-100/NQ-specific gamma study was found; Baltussen et al. cover 60+ futures, but whether NQ is included and its specific results were not verified. Practitioners apply SPX logic to NDX/QQQ by analogy.
- Full texts of Baltussen et al., Adams et al., and Dim/Eraker/Vilkov were not read; coefficients, exact gamma-sign methodology (naive vs signed volume) for Baltussen, and sample periods for Adams are unverified.
- No peer-reviewed study found that validates vendor "call wall/put wall" as support/resistance levels for index futures.
- Evidence on vanna/charm flows into expiration (practitioner staple) was not found in academic sources in this session; treat as vendor narrative.

---

## Key Question 3: Practitioner frameworks and data sources — SpotGamma, SqueezeMetrics, MenthorQ, Cboe, OPRA vendors; cost, latency, update frequency, licensing; and how to compute a rough GEX oneself

### Takeaway
Vendors publish modeled levels (zero gamma/"Volatility Trigger," call wall, put wall, Hedge Wall, key gamma strike) with proprietary positioning adjustments and typically intraday refreshes for SPX/SPY/QQQ/NDX but end-of-day for futures options; definitions are vendor-specific and largely unverifiable. A DIY OI-based GEX is straightforward from an options chain (OPRA via Databento or similar) but inherits the naive sign assumption and once-a-day OI; side-aware intraday data exists (Cboe Open-Close 10-minute and, since 2026, 1-minute) at extra cost and with licensing limits.

### Cited Findings
**SpotGamma (all VENDOR)**
- Call Wall = strike with the largest call gamma concentration, treated as resistance ("a ceiling"); Put Wall = strike with the largest put gamma concentration, treated as support, "a high-probability structural level, not a guaranteed floor." — [SpotGamma: Call Wall/Put Wall explained](https://spotgamma.com/call-wall-put-wall-explained/); [SpotGamma Put Wall support article](https://support.spotgamma.com/hc/en-us/articles/15297856056979-Put-Wall); [SpotGamma GEX page](https://spotgamma.com/gamma-exposure-gex/)
- Zero Gamma = modeled spot price where aggregate GEX crosses zero; SpotGamma's support page says it is not support/resistance but informative of regime. — [SpotGamma Zero Gamma article](https://support.spotgamma.com/hc/en-us/articles/15297958613907-Zero-Gamma)
- SpotGamma sources conflict on whether the "Volatility Trigger" equals zero gamma or sits several points above it as an earlier warning level. — [SpotGamma key levels section](https://support.spotgamma.com/hc/en-us/sections/1500001160601-SpotGamma-Key-Levels); [SpotGamma: how to trade GEX levels](https://spotgamma.com/how-to-trade-gex-levels/)
- Hedge Wall: described in the HIRO guide as a volatility flip line (above it, lower realized volatility; below it, higher); sits between Put Wall and Call Wall alongside the "Key Gamma Strike." Walls are computed from SpotGamma's Total Open Interest model and update through the session. — [SpotGamma HIRO User Guide (Oct 2025 PDF)](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf)
- No published formula for the walls was found. — (search of [SpotGamma](https://spotgamma.com/how-to-trade-gex-levels/) materials)

**SqueezeMetrics**
- Original GEX white paper (rev. Dec 2017) with naive-dealer convention; uses option delta to gauge the breadth of hedging; relates GEX sign to subsequent S&P volatility. [VENDOR] — [GEX white paper copy](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf); [QuantumAlgo summary](https://www.quantum-algo.com/blog/guides/gamma-exposure/)

**MenthorQ (VENDOR)**
- Futures gamma levels (from futures options) update end-of-day; stocks/ETFs/indices update 14 times per day; recommended intraday workaround is to project SPX/SPY/QQQ/NDX levels onto ES/NQ charts. — [MenthorQ guide: gamma levels on futures options](https://menthorq.com/guide/gamma-levels-on-futures-options/)
- Integrations include NinjaTrader, Sierra Chart, TradingView, TrendSpider with "Auto Ratio Conversion"; NinjaTrader access via machine ID plus API key. — [MenthorQ integrations lesson](https://menthorq.com/academy/getting-started/lessons/menthorq-integrations/)
- A third-party (German) review says in third-party platforms futures data remains ~20 minutes delayed per terms, and that MenthorQ's "only platform with native futures gamma levels" claim could not be verified. [PRACTITIONER review] — [Kagels Trading review](https://www.kagels-trading.de/menthorq-erfahrungen/)

**Exchange/raw data**
- Cboe DataShop Open-Close: classifies volume by participant type (customer, professional customer, etc.), buy/sell and open/close; covers Cboe options exchanges (C1, C2, BZX, EDGX); 10-minute interval snapshots delivered a few minutes after each interval; OHLC/total volume/open interest only in end-of-day files; interval history from 2011 (C1) and 2019 (BZX/C2/EDGX). [EXCHANGE] — [DataShop volume summary](https://datashop.cboe.com/volume-summary-data); [Open-Close product page](https://datashop.cboe.com/open-close-cboe-c2-exchange)
- A one-minute Open-Close product has been added (captured every minute, delivered within ~5 minutes); its fees were approved in February 2026. [EXCHANGE/SEC] — [SR-CBOE-2026-011](https://cdn.cboe.com/resources/regulation/rule_filings/approved/2026/SR-CBOE-2026-011.pdf); [SEC 34-104796](https://www.sec.gov/files/rules/sro/cboe/2026/34-104796.pdf)
- Cboe describes its futures summary data as proprietary with external redistribution prohibited (options-data terms not checked). [EXCHANGE] — [DataShop futures EOD](https://datashop.cboe.com/futures-exchange-end-of-day)
- Databento OPRA: real-time is included with any OPRA subscription; historical via usage-based pricing; OPRA end-of-day summary includes OHLC, volume and open interest (statistics schema); pcap-derived history from 2023-03-28 (earlier data subsampled); live access requires a licensing questionnaire to set subscriber status and venue contracts. No Greeks product found — Greeks must be computed from quotes. [VENDOR docs] — [Databento OPRA.PILLAR docs](https://databento.com/docs/datasets/opra-pillar); [Databento OPRA launch blog](https://databento.com/blog/opra-data); [Databento catalog](https://databento.com/catalog/opra/OPRA.PILLAR)
- Some vendors (e.g., Intrinio) do supply delta/gamma/theta/vega with options data. [VENDOR] — [Intrinio options FAQ](https://help.intrinio.com/options-faqs)
- Free/low-cost web GEX calculators exist (e.g., FlashAlpha). [VENDOR] — [FlashAlpha GEX calculator](https://flashalpha.com/tools/gex-calculator)

### Inferences
- DIY GEX (naive convention), per strike K and expiry T, for an index with option multiplier M (100 for SPX/SPY/QQQ/NDX options):
  - Dollar gamma per 1% move: GEX_K = Γ(K,T,S,σ) × OI × M × S² × 0.01, where Γ is Black-Scholes gamma per option (per 1 point of S). Derivation: Δ-change per 1% move = Γ × (0.01·S); dollar value = that × S × M × OI.
  - Sign: +GEX for calls, −GEX for puts (dealers long calls / short puts). Total = Σ over strikes and expiries.
  - Zero-gamma level: re-evaluate Γ for every option at a grid of hypothetical spot levels (e.g., ±5% in 0.1% steps) holding IV and OI fixed, sum, and locate the sign change; Call Wall/Put Wall ≈ strikes with max call-GEX and max |put-GEX| (vendor definitions vary).
  - Convert to ES contracts per 1% move: total $GEX ÷ (ES multiplier $50 × ES price) — gives an intuitive "hedge contracts per 1%" number to compare with typical ES volume (contract specs should be verified on CME).
- Known DIY limitations: sign assumption (the dominant error); OI is end-of-day only, so today's 0DTE opening flow is invisible until tomorrow (although Adams et al. find pre-existing positions rolling into 0DTE status contribute far more expiry-day hedging need, ~24 bp, than new same-day 0DTE positions, ~3 bp — partially mitigating this); single-product view (SPX only vs SPX+SPY+ES options+QQQ+NDX); IV surface/skew assumptions change Γ; ignores vanna (delta change with IV) and charm (delta change with time), which dominate into expiry; customer vs firm vs MM classification unknown.
- Automation implications: vendor intraday refresh (e.g., MenthorQ 14x/day; SpotGamma intraday) is coarse relative to 1-minute ES bars; DIY OPRA-based recompute every 1–5 minutes is feasible on a private server but Greeks computation across thousands of SPX strikes and licensing for automated/non-display use must be cleared with the vendor (OPRA and Cboe both have subscriber/usage classifications).
- For "proven concept, no backtest" use, the least assumption-laden signal is coarse: sign of aggregate GEX (or spot above/below a zero-gamma estimate with a buffer), not exact wall prices.

### Gaps
- Current prices for SpotGamma, SqueezeMetrics, MenthorQ, Databento OPRA live, ORATS, Polygon/Massive, Cboe Open-Close (10-min and 1-min) were not retrieved; check vendor pricing pages.
- ORATS and Polygon/Massive documentation was not reviewed in this session.
- Whether vendor API terms permit automated order triggering (non-display use) was not verified for any vendor.
- SqueezeMetrics current product/API status not checked.

---

## Key Question 4: How to map GEX levels from SPX/NDX/SPY/QQQ onto ES/NQ prices and keep the mapping current intraday

### Takeaway
Map index/ETF strike levels to futures with either a live additive spread (ES − SPX) or a live ratio (ES/SPX, NQ/NDX, ES/SPY, NQ/QQQ), computed from simultaneous prices during RTH; the spread embeds cost-of-carry (rates minus dividends, shrinking toward expiry), and ETF ratios also drift with ETF dividends/expenses. Lock or refresh the conversion at defined times, and freeze it overnight when the cash index is not trading.

### Cited Findings
- CME: fair value is the theoretical futures price given index level, dividends, days to expiration and interest rates; formula Fair Value = Cash × [1 + r × (days/360)] − Dividends (CME example: 1146 cash, 5.7%, 78 days, 3.47 dividend points → 1156.68; illustrative older rate regime). [EXCHANGE] — [CME Calculating Fair Value](https://www.cmegroup.com/trading/equity-index/fairvalue.html)
- Basis is positive when financing exceeds dividends forgone; some sources define "basis" as futures minus cash, others as futures minus fair value — terminology varies. [PRACTITIONER] — [NexusFi cost of carry](https://nexusfi.com/a/concepts/futures-pricing-cost-of-carry); [FlashAlpha ES fair value](https://flashalpha.com/articles/es-futures-fair-value-basis-explained)
- Fair value changes continuously as inputs change; arbitrage keeps futures near fair value but with costs (basket spreads, financing, dividend-forecast error). [PRACTITIONER] — [NexusFi cost of carry](https://nexusfi.com/a/concepts/futures-pricing-cost-of-carry); [NexusFi index arbitrage](https://nexusfi.com/a/exchanges/index-arbitrage-fair-value)
- MenthorQ: index/ETF levels won't line up on futures charts without adjustment; supports Spread or Ratio conversion (pairings SPX→ES, SPY→ES, QQQ→NQ, NDX→NQ). [VENDOR] — [MenthorQ levels conversion guide](https://menthorq.com/guide/levels-conversion/)
- MenthorQ's open-source TradingView "Levels Conversion" script computes ratio automatically and can lock it at snapshot times (defaults 10:00 AM and 3:30 PM ET); mixing ratio methods across platforms misaligns levels. [VENDOR] — [TradingView: MenthorQ Levels Conversion](https://www.tradingview.com/script/KcR9Nfs8-MenthorQ-Levels-Conversion)

### Inferences
- Recommended automatable mapping (concept, not vendor-specific):
  1. During RTH, every N seconds compute spread_ES = ES_mid − SPX_last and ratio_NQ = NQ_mid / NDX_last; smooth with a short rolling median (e.g., 1–5 minutes) to suppress SPX print staleness (SPX is a calculated index; its last value lags constituent quotes).
  2. ES_level = SPX_strike + spread_ES (additive is natural for ES because basis is a point amount); NQ_level = NDX_strike × ratio_NQ (ratio is more robust for NQ's larger price scale). For SPY/QQQ-derived levels, use ES/SPY and NQ/QQQ live ratios directly (SPY ≈ SPX/10 and QQQ ≈ NDX/~40 only approximately; both drift with ETF dividends/fees and over time, so never hard-code).
  3. Outside RTH (cash index not updating), freeze the last RTH conversion (or use a fair-value model: rate × days/360 minus expected dividends) and mark levels "stale."
  4. Recompute at quarterly roll: the basis jumps when switching from the expiring to the next ES/NQ contract (the new contract carries ~3 more months of carry).
  5. Snap mapped levels to the ES tick (0.25) and display a tolerance band (e.g., ± a few ticks) rather than a line, given basis noise and level-model uncertainty.
- Basis magnitude scales with (rate − dividend yield) × time to expiry; with materially positive short rates the ES premium is tens of points early in the quarter and decays to ~0 at expiration — so a fixed offset is wrong by the decay amount over days.
- Gamma from CME options on ES (and NQ options) is a separate inventory; vendor "futures gamma levels" come from those, but most index-gamma research uses SPX. If combining, convert all to a common $-gamma-per-1% unit before summing.

### Gaps
- No primary CME document on current (Nov 2026) ES/NQ basis levels was retrieved; current rate/dividend inputs not checked.
- No source found documenting typical intraday noise in the ES−SPX spread, to set tolerance bands empirically.

---

## Key Question 5: How practitioners use GEX regime and levels intraday for ES/NQ (fade vs follow, walls as targets, OPEX/quad witching/0DTE behavior, vanna/charm) — evidence-backed vs vendor claims — and how to automate a CONTEXT filter

### Takeaway
The evidence-backed uses are coarse: (1) regime prior — positive aggregate gamma favors mean reversion/fading and smaller late-day continuation; negative gamma favors continuation, especially in the last 30 minutes, with reversal next day; (2) expiry-day strike gravitation. Walls-as-support/resistance, Volatility Trigger/Hedge Wall semantics, and vanna/charm "window of weakness" narratives are vendor claims without independent validation found. A context filter should modify size/targets/permission of core-strategy signals, never generate entries by itself.

### Cited Findings
- Vendor framing: Call Wall as ceiling/resistance, Put Wall as floor/support (not guaranteed), Zero Gamma as regime marker, Hedge Wall as volatility flip line. [VENDOR] — [SpotGamma call/put wall](https://spotgamma.com/call-wall-put-wall-explained/); [SpotGamma Zero Gamma](https://support.spotgamma.com/hc/en-us/articles/15297958613907-Zero-Gamma); [SpotGamma HIRO guide](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf)
- Evidence for regime-conditional late-day momentum: negative gamma → intraday momentum (strengthening with exposure size), largely absent on positive-gamma days; reverses over following days. [ACADEMIC] — [Baltussen et al. (EconPapers)](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Alpha Architect summary](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)
- Evidence for positive-gamma dampening: higher MM net gamma predicts lower next-10-minute S&P vol, stronger E-mini order-flow reversals, negative HF momentum, decaying in ~1 hour. [ACADEMIC via summary] — [Quantpedia on Adams et al.](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/)
- Negative (positive) gamma imbalance × illiquidity → momentum (reversal), end-of-day effects revert at next open. [ACADEMIC] — [Gamma Fragility](https://abarbon.com/papers/gamma-fragility); [SSRN 3925725](https://papers.ssrn.com/abstract=3925725)
- Expiration-day clustering at strikes (single stocks). [ACADEMIC] — [NPP 2005](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)
- Expiration-day hedging needs are dominated by pre-existing positions rolling into 0DTE status (~24 bp) rather than new 0DTE opens (~3 bp). [ACADEMIC via summary] — [Quantpedia on Adams et al.](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/)
- Intraday sign flips of 0DTE MM gamma within 30 minutes are documented (Aug 15, 2023: +$2bn at 3pm → −$500mm at 3:30pm). [EXCHANGE] — [Cboe Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)
- Dealer gamma's incremental forecasting power for overnight gaps appears in calm (low-VIX) regimes, not stressed ones. [ACADEMIC] — [OptionMetrics/Maurer 2026](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/)

### Inferences
Candidate automatable CONTEXT filter (all thresholds are starting conventions for visual review, not optimized values):
- Inputs (per session): GEX_sign and magnitude (vendor or DIY), ZG_ES (mapped zero gamma, with a band of ± k ticks or ±0.25% of price), CW_ES / PW_ES (mapped call/put walls), largest-0DTE-OI strike(s) mapped to ES, calendar flags (daily 0DTE, weekly, monthly OPEX = 3rd Friday, quarterly = quad witching), data timestamp/staleness flag, VIX regime flag (calm/stressed) as a second dimension.
- Regime state machine:
  - POSITIVE: ES above ZG_ES + band and GEX > 0 → "mean-reversion favored": allow fade-type core setups at range extremes; cap breakout targets at the nearer of CW_ES/PW_ES; tighten time stops (Adams effect horizon ~1 h).
  - NEGATIVE: ES below ZG_ES − band or GEX < 0 → "momentum favored": allow breakout/continuation core setups; widen stops/reduce size (volatility expected higher); enable the last-30-minute intraday-momentum module (Gao/Baltussen) only in this state; plan for next-open reversal (don't carry late-day momentum overnight on that basis alone).
  - NEUTRAL: within the ZG band or stale data → no gamma adjustment (fall back to core rules).
- Level usage: treat walls as "no-new-entry-in-direction-of-wall within X ticks" zones and as candidate profit-target confluence with volume-profile/Fib levels, rather than as entry triggers (vendor-only evidence).
- Expiry handling: on monthly/quarterly OPEX and in the final ~60–90 minutes of daily 0DTE sessions, flag a "pin-risk zone" around the largest 0DTE strikes; reduce breakout permissions near those strikes; after expiry (next session) mark old levels expired.
- Hysteresis/anti-flip: require the regime to persist for M bars (e.g., two 5-minute closes) beyond the band before switching, because modeled ZG moves and MM gamma can flip within 30 minutes.
- Logging: record regime state at each core-strategy signal so the user can visually review whether gamma context helped, without formal backtesting.
- Vanna/charm narratives (e.g., IV crush into OPEX forcing dealer buying; "window of weakness" after OPEX) should be displayed as annotations at most, not rules, pending evidence.

### Gaps
- No academic test found of walls/zero gamma as ES support/resistance or of SpotGamma's Volatility Trigger/Hedge Wall predictive value.
- No academic evidence found on vanna/charm flows into OPEX or quad witching for indices.
- No evidence found on how GEX context interacts specifically with NQ vs ES (e.g., whether QQQ/NDX gamma matters for NQ as SPX does for ES).

---

## Key Question 6: Equity-market internals (NYSE TICK, ADD, VOLD, mega-cap leadership for NQ) for filtering index futures intraday — evidence and data availability

### Takeaway
Internals are widely used by discretionary index-futures traders, but the evidence base is practitioner research (notably Brett Steenbarger's 2004–2008 blog studies with small samples), not peer-reviewed work. Conventional thresholds (TICK ±1000 extremes; persistent one-sided ADD/VOLD as "trend day" evidence) are rules of thumb. Data availability via Rithmic is uncertain; internals typically come from a separate equity data feed (e.g., NinjaTrader/Kinetick/IQFeed packs) with vendor-specific symbols.

### Cited Findings
- Definitions: $TICK = number of NYSE stocks on an uptick minus those on a downtick; $ADD = advancing minus declining NYSE issues; VOLD = up-volume minus down-volume. [PRACTITIONER] — [LuxAlgo TICK concept](https://www.luxalgo.com/library/concept/tick-index/); [NexusFi market internals](https://nexusfi.com/a/indicators/market-internals)
- Steenbarger (2006): since 2004 (N = 695 days), 50 days had NYSE TICK below −1100; two days later SPY averaged +0.37%; when daily TICK never went below −500 (N = 45), next two days averaged −0.14%; on panic-selling days without a significant buying episode, next day averaged −0.12%. [PRACTITIONER, small sample, no costs] — [TraderFeed, Oct 2006](https://traderfeed.blogspot.com/2006/10/when-selling-becomes-extreme-what-does.html)
- Steenbarger: when the market fell ≥1% and the Adjusted TICK was very weak (< −650), next day averaged −0.07% vs +0.25% when stronger; with Adjusted TICK neither strong nor weak (N = 592), average five-day SPY gain only +0.06%. [PRACTITIONER] — [TradingMarkets/Steenbarger](https://tradingmarkets.com/?p=653282); [TraderFeed: NYSE TICK and momentum](https://traderfeed.blogspot.com/2006/07/nyse-tick-and-momentum-effects.html)
- Steenbarger on using TICK to gauge intraday swings (2008). [PRACTITIONER] — [TraderFeed, Oct 2008](https://traderfeed.blogspot.com/2008/10/gauging-intraday-swings-with-nyse-tick.html)
- Conventional thresholds: ±800 to ±1000 as meaningful extremes; one source describes ±700 as ~1σ and beyond ±1000 as ~2σ (rules of thumb, not tested). [PRACTITIONER] — [NexusFi: trading with market internals](https://nexusfi.com/a/strategies/trading-with-market-internals); [LuxAlgo TICK](https://www.luxalgo.com/library/concept/tick-index/)
- No peer-reviewed or recent (post-2010) out-of-sample test of TICK/ADD/VOLD on S&P futures was found in this search. — (search summary over [NexusFi](https://nexusfi.com/a/strategies/trading-with-market-internals) and [TraderFeed](https://traderfeed.blogspot.com/2006/10/when-selling-becomes-extreme-what-does.html) results)
- Symbol formats vary by provider: TICK as $TICK, ^TICK, $TICK.X; ADD as $ADD, ^ADD, $ADVD; VOLD as $VOLD, ^VOLD or $UVOL−$DVOL. [PRACTITIONER] — [NinjaTrader indicators site: market internals](https://ninjatrader-indicators-site.pages.dev/indicators/market-internals)
- A NexusFi thread reports a NinjaTrader 8 user on Rithmic data lacking internals; the suggested workaround was a NinjaTrader Brokerage market-internals data pack (TICK, TRIN, ADD, VOLD). Forum evidence only. [PRACTITIONER] — [NexusFi: market internals data](https://nexusfi.com/a/data/market-internals-data)
- Older NinjaTrader forum thread: mapping VOLD to an IQFeed symbol and data-server support issues. [PRACTITIONER] — [NinjaTrader forum: VOLD/ADD/TICK/TRIN](https://forum.ninjatrader.com/forum/ninjatrader-7/platform-technical-support/46137-vold-add-tick-trin); [MotiveWave forum on internals](https://forum.motivewave.com/threads/tick-add-and-other-market-internals.2764)

### Inferences
- Mechanistic logic (why internals could help ES): ES is arbitrage-linked to the S&P basket, so breadth of buying/selling across NYSE stocks proxies basket-wide program activity; a TICK +1000 burst is often index-arbitrage/program buying. This is a correlation/confirmation signal, not a cause.
- Automatable uses (concept-based, conventional thresholds for review):
  - Trend-day filter: if |ADD| stays beyond a large fraction of issues (e.g., > ~60–70% net advancers/decliners) and VOLD is one-sided for the first 60–90 minutes, permit continuation setups and suppress fades in the opposite direction.
  - Exhaustion/fade context: TICK beyond ±1000 against a range-bound (positive-gamma, balanced ADD) backdrop → permit fades at core-strategy levels; the same reading inside a one-sided ADD/VOLD day → treat as continuation pressure instead.
  - Cross-check with gamma regime: positive gamma + balanced ADD → range/fade; negative gamma + one-sided ADD/VOLD → momentum; conflicting signals → neutral.
- NQ: NYSE internals are a weaker fit; NASDAQ equivalents ($TICKQ, $ADDQ, $VOLQ in some feeds) and mega-cap leadership (e.g., a basket of the largest NDX weights vs NQ) are the analogous tools. Divergence (NQ making highs while the largest constituents lag) is a commonly cited caution flag — unvalidated.
- Data plumbing: plan a second market-data feed for internals (equity/index data) alongside Rithmic futures data; normalize symbols in a config map.

### Gaps
- No primary Rithmic documentation found on whether R|Trader/R|API carries NYSE/NASDAQ internals; verify with Rithmic or the FCM.
- No evidence found (academic or credible practitioner) for mega-cap leadership/breadth filters on NQ intraday.
- No rigorous evidence for ADD/VOLD trend-day thresholds; the numeric thresholds above are conventions to be reviewed visually.

---

## Key Question 7: Practical considerations for applying futures-derived signals to SPY/QQQ/SPX/NDX options or equities as an optional vehicle

### Takeaway
Equities/options are a viable secondary vehicle for RTH-only signals, but they require a second broker API (Rithmic is a futures route), different hours and gap exposure, a deliberate options-delta/expiry choice, and attention to 0DTE spreads; index options (SPX/NDX) receive Section 1256 60/40 treatment like ES/NQ futures, while SPY/QQQ options and shares do not (verify with a tax professional — not tax advice).

### Cited Findings
- SPX options (cash-settled, broad-based index) are Section 1256 contracts with 60/40 long-/short-term treatment; SPY is an ETF and SPY options are equity options taxed under ordinary holding-period rules. [PRACTITIONER — not tax advice] — [Terms.law Section 1256 guide](https://terms.law/Trading-Legal/guides/section-1256-contracts.html); [Why SPX and not SPY](https://boxspread-site.pages.dev/articles/why-spx-and-not-spy); [Morkel Financial: SPX vs SPY tax](https://morkelfinancial.com/blog/spx-vs-spy-options-tax-treatment); [TradersPost: index options 60/40](https://blog.traderspost.io/article/index-options-tax-treatment-the-6040-advantage)
- Broker 1099 reporting of broad-based-ETF options can be inconsistent (forum reports). [PRACTITIONER] — [Motley Fool discussion](https://discussion.fool.com/t/have-you-used-section-1256-for-index-options/124606); [OptionStrategist note](https://optionstrategist.com/node/2556)
- 0DTE structure: >95% of SPX 0DTE trades are limited-risk (long options/spreads); ~2M contracts/day; retail 50–60%. [EXCHANGE] — [Cboe May 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)
- 98% of SPX 0DTE volume trades electronically. [EXCHANGE] — [Cboe Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)
- NDX options: Nasdaq's product page lists Monday/Wednesday/Friday PM-settled expirations plus AM-settled third-Friday monthlies; an IBKR interview and a Nasdaq article describe daily expirations existing across NDX, QQQ, SPY, SPX; Nasdaq-100 Micro Index options (XND) exist. [EXCHANGE/broker] — [Nasdaq NDX options](https://www.nasdaq.com/nasdaq-100-index-options); [IBKR Campus interview](https://www.interactivebrokers.com/campus/?p=186384); [Nasdaq article on expiry-day trading](https://www.nasdaq.com/articles/analyzing-expiry-date-options-trading); [XND launch](https://finance.yahoo.com/news/nasdaq-launches-nasdaq-100-micro-120000842.html)

### Inferences
- Signal transfer: compute signals on ES/NQ (23-hour data, deeper book), then map entry/stop/target prices to SPY/QQQ (live ratio) or select SPX/NDX/XSP/SPY/QQQ options by delta. Only RTH signals are executable in equities/ETF options (overnight/pre-market futures signals face gap risk at the cash open; extended-hours ETF share trading exists but is thin; SPX has a Cboe Global Trading Hours session — verify current hours).
- Options-vehicle choices for a directional futures signal: (a) ~0.50–0.70 delta single options for simplicity; (b) debit vertical spreads to cap premium decay and reduce vega/IV-crush exposure; (c) avoid naked short 0DTE premium in automation. On 0DTE, gamma and theta are extreme: stop logic must be in underlying-price terms (mapped from ES), with a max-premium-loss backstop, since option quotes widen in fast markets.
- Contract sizing equivalence (verify contract specs on CME/Cboe): size by delta-dollars rather than contract counts: target $-delta = ES contracts × $50 × ES price (NQ: × $20 × NQ price); options contracts = target $-delta ÷ (option delta × 100 × underlying price); ETF shares = target $-delta ÷ ETF price.
- Settlement differences: SPX/NDX cash-settled and European (no early assignment; AM vs PM settlement matters for monthly expiries); SPY/QQQ physically settled and American (early assignment risk on short legs near ex-dividend).
- Broker/API: Rithmic is a futures-only route (per user's description); equity/ETF options would need a second broker API (common candidates include IBKR TWS/Client Portal API, Schwab, Tradier, TastyTrade — not evaluated in this session). The automation architecture should treat "vehicle" as an adapter layer so the futures signal engine is unchanged.
- Tax note (not advice): ES/NQ futures and SPX/NDX/XSP index options are generally Section 1256; SPY/QQQ shares and options are not — a reason to prefer index options over ETF options if options are used at all, subject to liquidity and contract size.

### Gaps
- Rithmic's lack of equity-options routing is taken from the assignment; not verified against Rithmic documentation in this session.
- Current bid-ask spreads/liquidity statistics for SPX vs SPY vs QQQ vs NDX 0DTE options were not retrieved.
- Exact current trading hours (SPX GTH, extended-hours ETF options) were not verified.
- Whether NDX/XND options qualify for Section 1256 (broad-based) was not explicitly confirmed by a source in this session (likely by analogy to SPX; confirm with a tax professional).

---

## Key Question 8: Recent 0DTE / expiration market-structure changes relevant as of November 2026

### Takeaway
SPX has had expirations every business day since May 2022; 0DTE now dominates SPX volume (~2M contracts/day by 2025). In 2026 the SEC approved Nasdaq ISE rules allowing A.M.-settled NDX options expiring Monday–Friday (excluding the third Friday), and Cboe added a 1-minute Open-Close data product; proposals extending daily/any-weekday expirations to more products (including single stocks) are in progress. Gamma context models must therefore handle daily expiries for both SPX and NDX.

### Cited Findings
- 0DTEs became available every business day for SPX from May 2022; Adams et al. use the pre-May-2022 Tuesday/Thursday availability for identification. [ACADEMIC via summary] — [Quantpedia on Adams et al.](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/)
- SPX 0DTE volume >5x in three years to ~2M contracts/day (Cboe, May 2025). [EXCHANGE] — [Cboe May 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)
- SEC approved on June 16, 2026 a Nasdaq ISE rule permitting A.M.-settled NDX options expiring Monday through Friday (excluding the third Friday), allowing nonconsecutive weekly and end-of-month expirations (SR-ISE-2026-22); a parallel Phlx filing exists. Whether all of these expirations have launched could not be confirmed. [SEC/Federal Register via aggregator] — [PolicyRisk: Federal Register 2026-12402](https://policyrisk.com/federal-register/2026-12402); [SEC Phlx filing 34-105733](https://www.sec.gov/files/rules/sro/phlx/2026/34-105733.pdf)
- Nasdaq proposals for options expiring on any weekday (not just Fridays) and press coverage of extending 0DTE toward single stocks. [SEC/press] — [PolicyRisk: Federal Register 2026-09122](https://policyrisk.com/federal-register/2026-09122); [Tiger news: Nasdaq plan for single stocks](https://www.itiger.com/news/1126550493)
- Cboe 1-minute Open-Close product fees approved February 2026. [SEC] — [SEC 34-104796](https://www.sec.gov/files/rules/sro/cboe/2026/34-104796.pdf)
- Market makers may hedge SPX 0DTE exposure in E-mini or SPY 0DTE options (i.e., daily-expiry products exist across SPX, SPY and E-mini options). [EXCHANGE] — [Cboe Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)

### Inferences
- With daily expiries in SPX and (increasingly) NDX, the "expiry-day" effects that NPP and Adams document now occur every session in some form; the calendar flag in the context filter should distinguish daily 0DTE (small, often balanced), weekly/month-end, monthly AM-settled third-Friday, and quarterly expirations (where large pre-existing OI rolls into 0DTE status — the larger hedging-need component per Adams).
- NDX daily-expiry expansion makes NDX-derived (vs QQQ-derived) gamma levels more relevant for NQ going forward; models built on Mon/Wed/Fri NDX assumptions need updating.

### Gaps
- Could not confirm the live listing status (as of Nov 2026) of the ISE/Phlx daily A.M.-settled NDX expirations, or whether QQQ has every-weekday expirations at all times.
- No Fed/BIS note on 0DTE was retrieved in this session (BIS Quarterly Review has discussed 0DTE; not verified here).
