# Dealer gamma gates the trade, never triggers it

Options dealer gamma exposure (GEX) belongs in ES/NQ automation only as a coarse CONTEXT label that can veto trades, and its best-supported job is deciding whether to take the late-session intraday-momentum trade. The mechanism is sound: dealers who are net long gamma hedge against moves and damp them, while net-short dealers hedge with the move and amplify it. The strongest evidence ties this to futures directly. Across **60+ futures from 1974 to 2020**, the last-30-minute return follows the rest-of-day return, and the effect is concentrated on days when estimated option-dealer and leveraged-ETF gamma is negative ([Baltussen et al., JFE 2021](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Alpha Architect](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)). Expiration-day pinning in optioned stocks is also established ([Ni, Pearson & Poteshman 2005](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)). Everything finer is weaker. Public GEX numbers model once-a-day open interest under a "naive dealer" sign convention that SpotGamma itself says "cannot be 100% true" ([SpotGamma](https://spotgamma.com/spx-gamma-model-positioning-adjustments/)). Cboe, which sees both sides of every SPX trade, finds 0DTE customer flow "remarkably balanced" and market-maker hedging at **0.04%–0.17% of daily S&P futures liquidity** ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). Call walls, put walls, the Volatility Trigger, the Hedge Wall and vanna/charm flows have no independent validation. The design below is therefore a four-state filter, GAMMA_REGIME ∈ {POSITIVE, NEGATIVE, NEAR_FLIP, UNKNOWN}, with a ±0.25% buffer around mapped zero gamma and two M5 closes of persistence. It can only SHADOW (veto but log) host signals from the PA-, VP- and CX-families, never create them. Walls serve only as no-new-entry zones and target confluence. Start with low-cost end-of-day data in signal-only mode, and treat equities or SPX/SPY options as an optional cash-hours vehicle through a second broker API, because Rithmic is a futures route.

*Reading notes.* This is write-up 12 of the series indexed in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md). It is an optional dimension, separate from swings, price action, volume profile and Fibonacci. [06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md) already rules that gamma, if used, sits in the CONTEXT role and is never an extra location vote, and the regime router in [11 Proposals confluence](11%20Proposals%20confluence.md) accepts GAMMA_REGIME as an optional input. Gamma applies to ES/MES and NQ/MNQ only. Times are Eastern, and RTH means the 09:30–16:00 ET cash session (08:30–15:00 CT). Grades follow the series scale: A, peer-reviewed support for the mechanism; B, practitioner consensus with partial empirical support; C, vendor-only or anecdotal; D, tested and not supported. *Design proposal* marks this report's own engineering and *Inference* marks reasoning from the sources. Every numeric default is a pre-committed starting value from the notes, or is labelled a design proposal where the notes give none. None is optimized. Nothing here is tax advice.

## Long-gamma dealers lean against moves; short-gamma dealers chase them

An options market maker hedges the delta of its book in the underlying or in ES futures, and gamma is the rate at which that hedge must change as price moves. With a net-long-gamma book, a rise increases delta, so the dealer sells into the rise and buys the dip: the hedge leans against the move. Delta-hedgers long options "sell stock when price rises above a strike and buy when it falls below", pushing price toward the strike ([Pearson, Poteshman & White](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)). A net-short book inverts this. The dealer buys as price rises and sells as it falls, which creates momentum; Baltussen, Da, Lammers and Martens use that mechanism to link option market makers and leveraged-ETF rebalancing to market intraday momentum ([working paper](https://www3.nd.edu/~zda/intramom.pdf)). Barbon and Buraschi describe the usual configuration as dealers short gamma on the downside and long on the upside, so a large negative aggregate imbalance should coincide with higher volatility and short-term momentum ([Gamma Fragility](https://abarbon.com/papers/gamma-fragility)).

GEX expresses this as the dollars of underlying dealers must trade per 1% index move to stay delta-neutral. The sign says which way the hedge pushes; the size relative to liquidity says whether the push matters. Cboe puts SPX 0DTE net hedging at 0.04%–0.17% of the roughly **$400bn** of daily S&P futures liquidity, with 3:30 pm tails of 1.3%–1.9% ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). Expect modest, conditional effects, not levels that work deterministically.

### Public GEX is a model of who holds the open interest

No public dataset shows dealer positions by strike. SqueezeMetrics' original white paper (revised December 2017) uses "a few assumptions" to fill the gap ([white paper copy](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf)), and secondary sources call its sign rule the **naive-dealer convention**: dealers are long the calls customers sold and short the puts customers bought, so calls add gamma and puts subtract it ([LuxAlgo](https://www.luxalgo.com/library/concept/gamma-exposure/)). SpotGamma states that assuming every call is sold to dealers and every put bought from them "cannot be 100% true" and applies its own adjustments ([SpotGamma](https://spotgamma.com/spx-gamma-model-positioning-adjustments/)). Providers' side assumptions differ, so their numbers differ ([Convextrade](https://convextrade.com/glossary/dealer-gamma-exposure)), and a 2026 MPRA working paper claims a 30–50% error margin, with a method not verified here ([MPRA 129365](https://ideas.repec.org/p/pra/mprapa/129365.html)).

The exchange that sees both sides contradicts the convention where it matters most. Cboe observes each SPX trade's customer or market-maker side and open/close flag, and it finds 0DTE customer flow balanced and market-maker net gamma small and often changing sign. It also notes that outsiders' estimates rest on assumptions because they lack the side breakdown, and that dealers may offset SPX exposure in E-mini or SPY 0DTE options or hedge options with options. Single-product GEX can therefore misstate the flow that actually reaches ES ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). *Inference:* a "gamma flip" is a modeled price where an assumed inventory changes sign. If customers are heavy call buyers or put sellers, the true flip can be far away or inverted, so a strategy should treat it as a soft prior with a buffer, never a hard switch.

## Peer-reviewed work supports a regime prior, not a map of levels

The evidence sorts into three tiers. Pinning and gamma-conditioned late-session momentum are established, 0DTE effects are contested, and every named level beyond zero gamma is vendor-only. Several key papers were read only through abstracts or summaries, as the table notes.

| Finding | Status | Grade | Sources |
|---|---|---|---|
| Long-gamma hedging pushes price toward strikes; short-gamma hedging trades with the move | Established mechanism | A | [Pearson, Poteshman & White](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf); [Baltussen et al.](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403) |
| Expiration-day closes cluster at strikes in optioned stocks | Established for single stocks | A | [NPP 2005](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87) |
| Index-level pinning on monthly and quarterly expiries | Plausible analogue, less documented | B | NPP by analogy; [Adams et al. via Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/) |
| Early or rest-of-day return predicts the last 30 minutes | Established | A | [Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414); Baltussen et al.; [Li, Sakkas & Urquhart](https://reading-9.eprints-hosting.org/95566/1/Accepted-Version.pdf) |
| That momentum is concentrated on negative-gamma days | Established; gamma detail read via summary | A | [Alpha Architect](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/); [Barbon et al. 2021](https://papers.ssrn.com/abstract=3925725) |
| Positive market-maker gamma lowers 10–60 minute volatility and strengthens ES order-flow reversal | Working paper, via summary | B | [Adams et al. via Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/) |
| 0DTE hedging amplifies index volatility on average | Tested, not supported | D | Adams et al.; [Dim, Eraker & Vilkov](https://www.maths.ox.ac.uk/node/67396); [Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) |
| Dealer gamma helps forecast overnight gap size, in calm regimes only | One out-of-sample working paper | B | [Maurer via OptionMetrics](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/) |
| Call/Put Wall as resistance/support; zero gamma, Volatility Trigger, Hedge Wall as levels | Vendor only; definitions inconsistent | C | [SpotGamma walls](https://spotgamma.com/call-wall-put-wall-explained/); [SpotGamma key levels](https://support.spotgamma.com/hc/en-us/sections/1500001160601-SpotGamma-Key-Levels) |
| Vanna/charm flows into OPEX; post-OPEX "window of weakness" | No academic source found | C | none in the notes |
| NQ-specific gamma behavior | Not studied in the notes | none | none |

### Pinning and late-day momentum are the established core

Ni, Pearson and Poteshman find that optioned stocks close at strikes more often on expiration dates, which they attribute to market makers' delta-hedge rebalancing and to manipulation by proprietary traders. Returns shift by **at least 16.5 bp** on average per expiration, about $9 billion of market cap in aggregate, though not for every stock on every expiry ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)). Strong evidence of hedging moving prices is limited to expiration dates ([Pearson, Poteshman & White](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)). The index analogue is plausible but less documented. Adams et al. sharpen it: longer-dated positions rolling into 0DTE status add **~24 bp** to expiry-day hedging needs versus ~3 bp from new same-day positions ([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/)). *Inference:* big monthly and quarterly expiries matter more for pinning than routine dailies. On the momentum side, Barbon, Beckmeyer, Buraschi and Moerke find that a large negative gamma imbalance, scaled by dollar volume, produces end-of-day momentum and a positive one produces reversal, with both reverting at the next open ([SSRN 3925725](https://papers.ssrn.com/abstract=3925725)). The effect is strongest in the least liquid underlyings and tracks flash-crash frequency ([Gamma Fragility](https://abarbon.com/papers/gamma-fragility)).

### Intraday momentum is the bridge from gamma to futures trading

[02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) treats Gao, Han, Li and Zhou as the nearest rigorous evidence that early-session direction persists. In SPY from 1993 to 2013, the return from the prior close through the first half-hour predicts the last half-hour with an **R² of about 1.6%**. The effect is stronger on volatile, high-volume, recession and macro-news days, and is explained by infrequent rebalancing and late-informed trading ([Gao et al., JFE 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). It replicates in 12 of 16 developed markets ([Li, Sakkas & Urquhart](https://reading-9.eprints-hosting.org/95566/1/Accepted-Version.pdf)). Baltussen et al. supply the conditioning variable. Across more than 60 equity, bond, commodity and currency futures from 1974 to 2020, the rest-of-day return predicts the last 30 minutes and then reverts over the following days ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Erasmus](https://pure.eur.nl/en/publications/hedging-demand-and-market-intraday-momentum/)). Using S&P 500 option and leveraged-ETF data, they find the momentum present when negative gamma exposure is present and stronger as it grows; a secondary summary says it is largely absent on positive-gamma days ([Alpha Architect](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)).

This is the strongest bridge in the dimension: a published futures effect with a published conditioning variable, so gating it by gamma sign follows the concept rather than an optimization. GEX-01 is built on it. Three inferences temper it. Baltussen's measure includes leveraged-ETF rebalancing, which always runs with the day's move; an SPX-only GEX omits it, and the paper's sign method (naive or signed volume) was not verified. Both samples predate routine daily 0DTEs, and Adams et al. find positive market-maker gamma on expiry days, so negative-gamma days may now be rarer, which nobody has measured. NQ's inclusion and results were not checked. The horizons also differ, and they set the design. Adams' damping decays within about an hour, which argues for time stops on fades. Baltussen's momentum acts in the last 30 minutes, which sets the trade window. Barbon's effect reverts at the next open, which rules out carrying the trade. Gamma therefore governs late-session holding periods, targets and fade-versus-follow choices, not multi-day swing targets. Da's end-of-day reversal in single stocks is a separate effect that gamma does not explain ([Da EOD paper](https://www3.nd.edu/~zda/EOD.pdf)).

### 0DTE effects remain contested, and the better data lean toward damping

Adams et al. (SSRN 5641974, read via summary) identify their effect from the Tuesday/Thursday 0DTE schedule that ran before May 2022. Index volatility runs about **60 annualized bp lower** on 0DTE days. Market makers hold larger net gamma on expiry days, and it stays positive through the day. Higher net gamma predicts lower volatility over the next 10 minutes, fading after about an hour, along with stronger E-mini order-flow reversals and negative high-frequency momentum. The estimated multiplier is −4: one more basis point of hedging need means four fewer of realized volatility ([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/); [Resonanz Capital](https://resonanzcapital.com/insights/every-day-the-market-hires-a-counter-trend-trader)). Dim, Eraker and Vilkov find high 0DTE open-interest gamma does not propagate past volatility, and volume shocks do not amplify returns ([Oxford seminar](https://www.maths.ox.ac.uk/node/67396); [Harbourfront Quant](https://harbourfrontquant.substack.com/p/the-rise-of-0dte-options-cause-for)). A Princeton thesis, weighted lower, finds no support for gamma-hedging feedback as the main channel ([Princeton](https://theses-dissertations.princeton.edu/entities/publication/61115cd1-cb09-4a8b-9230-ff488fc2a386)).

Cboe's figures agree, though Cboe has a commercial stake in 0DTE's reputation. Daily average market-maker net gamma runs **$170mm–$670mm**. At 3:30 pm the median is +$173mm, the interquartile range spans −$1.1bn to +$2.4bn, and the whiskers reach −$5bn and +$7.7bn ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). By 2025, SPX 0DTE volume had grown more than fivefold in three years to about 2M contracts a day, retail made up 50–60%, more than 95% of trades were limited-risk, and only 4% were naked short. Cboe calls market-maker hedging "de minimis", at most 0.2% of SPX liquidity ([Cboe, May 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)). The "volatility bomb" grades **D** on average, but the tails are real: on August 15, 2023, net gamma swung from about +$2bn at 3 pm to −$500mm by 3:30. A filter must update intraday and require persistence. The newest result inverts practitioner lore. Out of sample, dealer gamma improves forecasts of overnight gap size only in low-VIX regimes, with about a **15% reduction** in 99th-percentile quantile loss after a Holm correction across 100 Clark-West tests. Pooled across regimes the effect washes out ([Maurer, OptionMetrics, May 2026](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/)).

### Walls, triggers and vanna/charm flows are vendor constructs

SpotGamma calls the Call Wall, the strike with the largest call gamma, "a ceiling", and the Put Wall "a high-probability structural level, not a guaranteed floor". It says Zero Gamma is not support or resistance but "informative of regime" ([walls](https://spotgamma.com/call-wall-put-wall-explained/); [Put Wall](https://support.spotgamma.com/hc/en-us/articles/15297856056979-Put-Wall); [Zero Gamma](https://support.spotgamma.com/hc/en-us/articles/15297958613907-Zero-Gamma)). Its own pages disagree on whether the Volatility Trigger equals zero gamma or sits several points above it ([how to trade GEX levels](https://spotgamma.com/how-to-trade-gex-levels/)). The Hedge Wall is a "volatility flip line", and the walls update through the session ([HIRO User Guide](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf)). No wall formula is published, no peer-reviewed study tests walls or zero gamma as ES levels, and no academic source covers vanna/charm into OPEX. All grade **C** and appear here only as annotations, no-entry zones and target confluence.

## Every GEX number starts from once-a-day open interest

Vendors publish modeled levels with proprietary adjustments, typically refreshed intraday for SPX, SPY, QQQ and NDX but only end-of-day for futures options. A DIY estimate from an options chain is easy but inherits the naive sign and daily open interest (OI). Side-aware intraday data exists at extra cost.

| Source | What it provides | Cadence and latency | Main limit for automation |
|---|---|---|---|
| SpotGamma (vendor) | Call/Put Wall, Zero Gamma, Volatility Trigger, Hedge Wall, Key Gamma Strike | Updated through the session ([HIRO guide](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf)) | Formulas unpublished; automated-use terms unverified |
| MenthorQ (vendor) | Index/ETF and futures-options gamma levels; NinjaTrader, Sierra and TradingView feeds with "Auto Ratio Conversion" | Indices/ETFs 14×/day; futures EOD ([guide](https://menthorq.com/guide/gamma-levels-on-futures-options/); [integrations](https://menthorq.com/academy/getting-started/lessons/menthorq-integrations/)) | A review reports ~20-minute delayed futures data on third-party platforms ([Kagels](https://www.kagels-trading.de/menthorq-erfahrungen/)) |
| SqueezeMetrics (vendor) | Original naive-dealer GEX ([white paper](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf)) | Daily | Current product and API status not checked |
| Databento OPRA (vendor docs) | Real-time quotes; EOD statistics with OHLC, volume and OI; pcap history from 2023-03-28 ([docs](https://databento.com/docs/datasets/opra-pillar); [blog](https://databento.com/blog/opra-data)) | Real-time quotes; OI once a day | **No Greeks**; live use requires a licensing questionnaire |
| Cboe DataShop Open-Close (exchange) | Volume by participant type, buy/sell and open/close on Cboe venues ([summary](https://datashop.cboe.com/volume-summary-data); [product](https://datashop.cboe.com/open-close-cboe-c2-exchange)) | 10-minute snapshots a few minutes late; a 1-minute product within ~5 minutes, fees approved Feb 2026 ([SR-CBOE-2026-011](https://cdn.cboe.com/resources/regulation/rule_filings/approved/2026/SR-CBOE-2026-011.pdf); [SEC 34-104796](https://www.sec.gov/files/rules/sro/cboe/2026/34-104796.pdf)) | Cost; OI only in EOD files; options redistribution terms not checked |
| Intrinio / FlashAlpha (vendor) | Options data with Greeks ([FAQ](https://help.intrinio.com/options-faqs)); a free web GEX calculator ([tool](https://flashalpha.com/tools/gex-calculator)) | Not checked / on demand | Not evaluated / a cross-check, not a feed |

The notes retrieved no current prices. More importantly, for no vendor did they verify whether the terms permit non-display use, meaning software that triggers orders. OPRA and Cboe both classify subscribers and uses, so clear this in writing before any order depends on gamma data.

### Computing a rough GEX yourself

For strike K and expiry T, with multiplier M = 100 (SPX, SPY, QQQ, NDX) and Black-Scholes gamma Γ per point of S, dollar gamma per 1% move is **GEX_K = Γ(K,T,S,σ) × OI × M × S² × 0.01**. The delta change per 1% move is Γ × 0.01·S, and multiplying by S, M and OI gives dollars. Calls count positive and puts negative under the naive convention, and the total sums across all strikes and expiries. Dividing by $50 × ES price restates it as ES contracts per 1% move. At a hypothetical ES of 6,000, $1bn per 1% is about 3,333 contracts, which can be compared with ES volume.

```python
# DIY naive-dealer GEX (Design proposal; formula from the notes). Run pre-RTH on prior-day OI.
def gex_snapshot(chain, S, r, q, now):
    total, by_strike = 0.0, defaultdict(lambda: [0.0, 0.0])   # [call_gex, put_gex]
    for opt in chain:                                         # every listed expiry, not only 0DTE
        T = year_frac(now, opt.expiry_ts)                     # to the actual AM or PM settlement time
        iv = implied_vol(opt.mid, S, opt.K, T, r, q, opt.type)    # OPRA has no Greeks: compute them
        g = bs_gamma(S, opt.K, T, iv, r, q) * opt.oi * 100 * S * S * 0.01
        sign = +1 if opt.type == CALL else -1                 # naive dealer: long calls, short puts
        total += sign * g
        by_strike[opt.K][0 if opt.type == CALL else 1] += g
    call_wall = max(by_strike, key=lambda k: by_strike[k][0])
    put_wall = max(by_strike, key=lambda k: by_strike[k][1])
    return total, call_wall, put_wall

def zero_gamma(chain, S, r, q, now):                          # IV and OI held fixed
    grid = [S * (1 + i / 1000) for i in range(-50, 51)]       # ±5% in 0.1% steps
    G = [gex_at_spot(chain, s, r, q, now) for s in grid]
    crossings = [interp(grid, G, i) for i in range(len(G) - 1) if G[i] * G[i + 1] < 0]
    return min(crossings, key=lambda x: abs(x - S)) if crossings else None   # nearest to spot
```

The limits matter more than the arithmetic. The sign assumption is the dominant error. OI is published once a day, so today's 0DTE opening flow stays invisible until tomorrow, although Adams' 24 bp versus 3 bp split softens this. The estimate covers one product unless SPY, ES options, QQQ and NDX are converted to the same unit and summed. The IV surface changes Γ. Vanna and charm, which dominate into expiry, are ignored. Recomputing every 1–5 minutes from live quotes is feasible on a private server, but it means Greeks for thousands of SPX strikes and still rests on yesterday's OI. The least assumption-laden output is therefore the coarse one, the sign of the total or spot versus zero gamma with a buffer, not exact wall prices.

## SPX strikes reach ES through a live basis, NDX strikes through a live ratio

Index and ETF levels do not line up on futures charts without conversion, because futures carry financing and dividends. CME defines fair value as **Cash × [1 + r × (days/360)] − Dividends**. Its older worked example takes 1146 cash, 5.7%, 78 days and 3.47 dividend points to 1156.68 ([CME fair value](https://www.cmegroup.com/trading/equity-index/fairvalue.html)). Basis is positive when financing exceeds forgone dividends, terminology varies, and arbitrage keeps futures near fair value but not on it ([NexusFi](https://nexusfi.com/a/concepts/futures-pricing-cost-of-carry); [FlashAlpha](https://flashalpha.com/articles/es-futures-fair-value-basis-explained); [NexusFi index arbitrage](https://nexusfi.com/a/exchanges/index-arbitrage-fair-value)). Because basis decays toward zero at expiry, a hard-coded offset drifts wrong by the decay accumulated since it was set. MenthorQ supports spread and ratio conversion for SPX→ES, SPY→ES, QQQ→NQ and NDX→NQ ([MenthorQ conversion](https://menthorq.com/guide/levels-conversion/)). Its TradingView script can lock the ratio at 10:00 and 15:30 ET, and it warns that mixing methods across platforms misaligns levels ([TradingView script](https://www.tradingview.com/script/KcR9Nfs8-MenthorQ-Levels-Conversion)).

| Source level | Target | Method | Reason |
|---|---|---|---|
| SPX strike | ES | Additive live spread ES − SPX | Basis is a point amount |
| NDX strike | NQ | Live ratio NQ / NDX | Robust at NQ's larger price scale |
| SPY / QQQ strike | ES / NQ | Live ratio ES/SPY, NQ/QQQ | SPY ≈ SPX/10 and QQQ ≈ NDX/~40 only roughly; both drift |
| ES/NQ options gamma | ES/NQ | Native | Separate inventory; convert to dollar gamma per 1% before summing |

```python
# Level mapping (Design proposal; steps from the notes). Cash index values need an index feed.
WINDOW = 180                                  # 3-minute rolling median, inside the notes' 1-5 min range

def on_timer_10s(now):
    if not is_rth(now):                       # cash index not updating: freeze last RTH values
        mapping.stale = True
        return
    if age(SPX.last) > 15 or age(NDX.last) > 15:
        return                                # SPX is a calculated index; skip stale prints
    basis_es.push(now, ES.mid - SPX.last)
    ratio_nq.push(now, NQ.mid / NDX.last)
    ratio_es_spy.push(now, ES.mid / SPY.last)
    ratio_nq_qqq.push(now, NQ.mid / QQQ.last)
    mapping.stale = False

def map_level(src, K):
    x = {"SPX": K + basis_es.median(WINDOW), "NDX": K * ratio_nq.median(WINDOW),
         "SPY": K * ratio_es_spy.median(WINDOW), "QQQ": K * ratio_nq_qqq.median(WINDOW)}[src]
    return Band(center=snap(x, 0.25), half_width=zone_width())   # a band, never a line

def on_front_month_change(old, new):          # roll: new contract carries ~3 more months of carry
    for buf in (basis_es, ratio_nq, ratio_es_spy, ratio_nq_qqq):
        buf.clear()
    remap_all_levels(); log_roll(old, new)
```

Outside RTH, keep the last RTH conversion (or the CME fair-value model) and mark every level stale; consumers treat stale levels as information only (*Design proposal*). The notes found no source on typical ES−SPX spread noise, so band widths borrow the series' ATR tolerance rule. They also did not establish whether Rithmic carries cash-index values, so plan on the same second feed that internals need (*Inference*).

## GAMMA_REGIME: four states, a 0.25% buffer and two closes of persistence

The filter reduces the coarse outputs to one label per instrument, evaluated on RTH M5 closes, and that label is all other families see. Its inputs are GEX_total, mapped zero gamma (ZG), the mapped Call Wall (CW) and Put Wall (PW), PIN zones (the top-two-OI strikes of the expiring series), an EXPIRY flag, the data's as-of timestamp, and a VIX flag used only by GEX-05.

```python
# GAMMA_REGIME state machine (thresholds from the notes; structure is a design proposal)
def on_m5_close(sym, bar, d):                     # d: latest gamma inputs for sym
    if not is_rth(bar.close_ts) or d.stale(bar.close_ts) or mapping.stale:
        return publish(sym, UNKNOWN)              # data failure: switch at once, no persistence
    band = 0.0025 * bar.close                     # ±0.25% of the futures price
    if bar.close > d.zg + band and d.gex_total > 0:
        cand = POSITIVE
    elif bar.close < d.zg - band or d.gex_total < 0:
        cand = NEGATIVE                           # one negative input suffices (risk asymmetry)
    else:
        cand = NEAR_FLIP
    st = S[sym]
    st.count = st.count + 1 if cand == st.pending else 1
    st.pending = cand
    if st.count >= 2 and cand != st.state:        # two consecutive M5 closes before switching
        log_transition(sym, st.state, cand, bar, d)
        st.state = cand
    publish(sym, st.state, flags=expiry_flags(bar), levels=(d.cw, d.pw, d.pin))
# Each RTH session starts UNKNOWN, so the earliest valid state is at 09:40 ET.
```

Vendor data counts as stale once it is older than twice its advertised refresh, and DIY end-of-day data is valid for exactly one session (*Design proposal*). Today's end-of-day OI is published after today's close, so using it inside today's session, replays included, is look-ahead. NEAR_FLIP and UNKNOWN both leave host rules unchanged, as the notes prescribe for the neutral case. They stay separate states so the forward log can show whether trades near the flip behave differently.

### What the label changes in the other families

**SHADOW** means the host signal still arms and writes its full decision record but sends no order, so forward data can show whether the gate helped without a backtest.

| GAMMA_REGIME | Balance / mean-reversion families (VP value-edge and HVN fades, failed-break reversals) | Continuation / breakout families (PA breakouts, IB extension, BOS continuation) | Late-session momentum (GEX-01) | Management overlays |
|---|---|---|---|---|
| POSITIVE | ARM | ARM, targets capped at the nearer wall in the path | OFF (shadow record kept) | 60-minute time stop on fades |
| NEGATIVE | SHADOW | ARM | ARM | Flat by 15:59 ET; no overnight carry on momentum grounds |
| NEAR_FLIP / UNKNOWN | Host rules | Host rules | OFF | None; tagged |

The asymmetry is deliberate (*Inference*). The notes prescribe capped breakout targets and tighter time stops in positive gamma, not a ban, because momentum there is merely absent: breakouts stall rather than reverse violently. In negative gamma, momentum strengthens with exposure and Barbon ties the imbalance to flash crashes. Fading into short-gamma amplification is the combination with fat-tailed losses, so that is what the gate removes. Host stops already scale with ATR, so higher volatility automatically shrinks size at constant risk; a separate gamma sizing rule would count the same thing twice.

**Walls** apply in any state with valid data. The wall zone is the wall price ± 0.25 × ATR(D1), applying 06's rule that tolerance scales with the ATR of the timeframe that defines the zone. A new long whose entry sits within the zone below the mapped Call Wall is shadowed, as is a new short within the zone above the Put Wall. A wall may cap or replace a host target within the zone width. It never supplies LOCATION and is never a confluence vote. **Vanna and charm** narratives appear only as text annotations on expiry weeks.

| Flag | Definition | Effect |
|---|---|---|
| DAILY | An expiring series is listed today, derived from the chain rather than a calendar | Annotate PIN zones in the final 90 minutes; no permission change (Cboe: small, balanced) |
| MONTHLY | Third-Friday standard expiry (AM-settled monthlies alongside PM-settled dailies) | GEX-04 pin rule in the final 90 minutes |
| QUARTERLY | Third Friday of Mar/Jun/Sep/Dec, coinciding with ES/NQ expiry | GEX-04 pin rule; session annotation; roll checks |
| POST_EXPIRY | First session after any expiry | Mark expired-series levels EXPIRED; rebuild from new OI |

Flags must come from listed expirations because holidays move them. Secondary sources citing CME's roll calendar put the June 2026 equity-index expiry on Thursday, June 18, because of Juneteenth ([CME roll dates](https://www.cmegroup.com/trading/equity-index/rolldates.html)).

| Parameter | Default | Basis |
|---|---|---|
| Zero-gamma buffer | ±0.25% of futures price | Notes |
| Persistence | 2 consecutive M5 closes | Notes |
| Session | RTH only; ETH publishes UNKNOWN | Notes (freeze outside RTH) + design proposal |
| Basis smoothing | 3-minute rolling median, 10-second samples | Within the notes' 1–5 minutes |
| Wall and pin zone | ±0.25 × ATR(D1) | Series tolerance rule (06) |
| Pin window | Final 90 minutes of RTH | Notes: 60–90 minutes |
| Fade time stop in POSITIVE | 60 minutes | Adams horizon ~1 hour |
| Late-session window | 15:30–16:00 ET | Gao; Baltussen |
| VIX calm flag | VIX close below its trailing 252-session median | Design proposal; the notes give no threshold |

Every host decision record in [07 Automation architecture](07%20Automation%20architecture.md) gains the gamma state and last-transition sequence, GEX_total, mapped ZG and band, mapped walls and pin zones, the expiry flag, the data source and as-of time, the basis used, the stale flag, and the gate action (ARM, SHADOW or NONE).

## Market internals are practitioner tools on an unverified feed

NYSE $TICK counts stocks on an uptick minus those on a downtick, $ADD counts advancing minus declining issues, and VOLD is up-volume minus down-volume ([LuxAlgo](https://www.luxalgo.com/library/concept/tick-index/); [NexusFi](https://nexusfi.com/a/indicators/market-internals)). The evidence is Brett Steenbarger's blog research from 2004–2008. Over 695 days, the 50 days with TICK below −1100 were followed two days later by an average SPY gain of **+0.37%**, while days when TICK never fell below −500 (N = 45) were followed by **−0.14%**. Samples are small and costs ignored ([TraderFeed, Oct 2006](https://traderfeed.blogspot.com/2006/10/when-selling-becomes-extreme-what-does.html); [TradingMarkets](https://tradingmarkets.com/?p=653282); [TraderFeed, 2008](https://traderfeed.blogspot.com/2008/10/gauging-intraday-swings-with-nyse-tick.html)). Conventional extremes are ±800 to ±1000, with one source calling ±700 about one standard deviation and ±1000 about two ([NexusFi](https://nexusfi.com/a/strategies/trading-with-market-internals)). No peer-reviewed or post-2010 out-of-sample test was found. *Inference:* the arbitrage tie between ES and the S&P basket is real, and broad TICK bursts often reflect program activity, so internals confirm rather than cause. Grade **C**.

The data is the practical obstacle. A NinjaTrader user on Rithmic data reported no internals and was pointed to a separate data pack ([NexusFi](https://nexusfi.com/a/data/market-internals-data)). Symbols vary by provider: $TICK, ^TICK or $TICK.X; $ADD or $ADVD; $VOLD or $UVOL−$DVOL ([symbol list](https://ninjatrader-indicators-site.pages.dev/indicators/market-internals); [NinjaTrader forum](https://forum.ninjatrader.com/forum/ninjatrader-7/platform-technical-support/46137-vold-add-tick-trin)). Plan a second feed and a symbol map, and verify Rithmic coverage with the FCM. For NQ, the NASDAQ equivalents ($TICKQ, $ADDQ, $VOLQ) and mega-cap leadership are the analogues, and neither has any validation.

```python
# INTERNALS_STATE (Design proposal; 0.65 interprets the notes' "~60-70%" as a breadth share)
def on_m15_close(t):                          # from 10:30 ET, after the IB hour
    if not internals_feed_ok():
        return UNKNOWN
    last4 = window_m15(4)                     # the full prior hour
    a = [x.adv / (x.adv + x.dec) for x in last4]
    v = [x.uvol / (x.uvol + x.dvol) for x in last4]
    if min(a) >= 0.65 and min(v) >= 0.65: return TREND_UP
    if max(a) <= 0.35 and max(v) <= 0.35: return TREND_DOWN
    return BALANCED
```

Internals are off by default. If enabled, they join gamma inside one pre-declared CONTEXT classifier, following the notes: positive gamma with balanced breadth reads as range, negative gamma with one-sided breadth reads as momentum, and a conflict reads as neutral. They are never a second vote, and TICK beyond ±1000 is an annotation only.

## Equities and index options can carry futures signals only in cash hours

Signals should still be computed on ES/NQ, with 23-hour data and the deeper book, and then translated. Only RTH signals transfer cleanly. Overnight signals face gap risk at the cash open, extended-hours ETF trading is thin, and SPX's Global Trading Hours session needs its current hours verified. The notes offer three vehicle choices for a directional signal: single options of about 0.50–0.70 delta, debit verticals that cap premium decay and IV-crush exposure, and no naked short 0DTE premium in automation. On 0DTE, gamma and theta are extreme, so stops must be set in underlying price mapped from ES, with a maximum-premium-loss backstop, because quotes widen in fast markets. More than 95% of SPX 0DTE trades are already limited-risk, and 98% of the volume trades electronically ([Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact); [Cboe 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)).

Size by delta-dollars, not contract counts. Target $-delta is ES contracts × $50 × ES price (MES × $5, NQ × $20, MNQ × $2). Option contracts are target $-delta ÷ (option delta × 100 × underlying price), and ETF shares are target $-delta ÷ ETF price. At hypothetical prices, one MES at 6,000 carries $30,000 of delta, and a 0.60-delta option on a $600 ETF carries $36,000, so one contract is about 1.2 MES.

| Vehicle | Settlement and style | Tax treatment per practitioner sources (not advice) | Fit |
|---|---|---|---|
| SPX options, and XSP (listed alongside SPX in the notes) | SPX: cash-settled, European | Section 1256, 60/40 ([Terms.law](https://terms.law/Trading-Legal/guides/section-1256-contracts.html); [Morkel](https://morkelfinancial.com/blog/spx-vs-spy-options-tax-treatment); [TradersPost](https://blog.traderspost.io/article/index-options-tax-treatment-the-6040-advantage)) | First choice for ES signals if liquidity suits the size |
| NDX options; Micro XND ([launch](https://finance.yahoo.com/news/nasdaq-launches-nasdaq-100-micro-120000842.html)) | NDX: cash-settled, European; AM vs PM settlement matters on monthlies | Likely 1256 by analogy; not confirmed | NQ signals |
| SPY / QQQ options | Physical, American; early-assignment risk on short legs near ex-dividend | Ordinary equity-option rules ([boxspread](https://boxspread-site.pages.dev/articles/why-spx-and-not-spy)) | Liquidity fallback |
| SPY / QQQ shares | Delta-one | Ordinary | Simplest translation |

Broker 1099 reporting of 1256 treatment can be inconsistent ([Motley Fool](https://discussion.fool.com/t/have-you-used-section-1256-for-index-options/124606); [OptionStrategist](https://optionstrategist.com/node/2556)), so confirm treatment with a tax professional. Because Rithmic is a futures route, the vehicle needs a second broker API and an options quote feed for Greeks. The notes name IBKR, Schwab, Tradier and TastyTrade as common candidates without evaluating them. Architecturally it is an adapter beneath the order manager in [07 Automation architecture](07%20Automation%20architecture.md): the signal engine stays unchanged, and the second broker gets its own reconciliation, kill switch and limits.

## Daily expirations now span SPX and are spreading to NDX

SPX has listed expirations every business day since May 2022, and 0DTE reached about 2M contracts a day by 2025 ([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/); [Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)). NDX is mixed. Nasdaq's product page lists Monday/Wednesday/Friday PM-settled expirations plus AM-settled third-Friday monthlies, while an IBKR interview and a Nasdaq article describe daily expirations across NDX, QQQ, SPY and SPX ([Nasdaq NDX](https://www.nasdaq.com/nasdaq-100-index-options); [IBKR Campus](https://www.interactivebrokers.com/campus/?p=186384); [Nasdaq article](https://www.nasdaq.com/articles/analyzing-expiry-date-options-trading)). On **June 16, 2026** the SEC approved a Nasdaq ISE rule (SR-ISE-2026-22) permitting A.M.-settled NDX options expiring Monday through Friday, excluding the third Friday, and a parallel Phlx filing exists. Whether they have launched was not confirmed ([PolicyRisk](https://policyrisk.com/federal-register/2026-12402); [SEC Phlx filing](https://www.sec.gov/files/rules/sro/phlx/2026/34-105733.pdf)). Proposals for any-weekday expirations extend toward single stocks ([PolicyRisk](https://policyrisk.com/federal-register/2026-09122); [Tiger](https://www.itiger.com/news/1126550493)), and Cboe's 1-minute Open-Close fees were approved in February 2026. Two inferences follow. Expiry-day effects now occur every session in some form, which is why EXPIRY comes from listed chains. A.M.-settled NDX dailies would also settle on the opening print, moving that series' hedge unwind to the open. NDX-derived gamma therefore becomes more relevant to NQ than QQQ-derived gamma.

## Six GEX proposals use gamma only to gate, size or stop other families' trades

All six share the same rules. They trade ES/NQ in RTH only. Gamma can shadow a host signal but never create one, and every shadowed signal keeps its record. Gamma sits in CONTEXT as a gate and is never counted as a location vote. Risk comes from [07 Automation architecture](07%20Automation%20architecture.md): server-side stops, daily limits, news blackouts, one position per instrument, and 1 MES/MNQ during validation. Any parameter change increments strategy_version and restarts the sample. Host families are cited generally: [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md), [09 Proposals volume profile](09%20Proposals%20volume%20profile.md) and [11 Proposals confluence](11%20Proposals%20confluence.md).

### GEX-01 Gamma-gated late-session intraday momentum

| At a glance | |
|---|---|
| Style / hold | Time-window continuation into the cash close; ≤ 29 minutes (15:30–15:59 ET) |
| Instruments | ES/MES primary; NQ/MNQ secondary (gamma conditioning unverified for NQ) |
| Evidence grade | **A** for the effect and its gamma conditioning; **B** for the DIY or vendor proxy of gamma |
| Complexity | Low: one decision per session |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | GAMMA_REGIME = NEGATIVE, persisted, as of the 15:30 M5 close | M5 regime ribbon | Same (clock time) |
| LOCATION | None (time-window effect); the wall rule still applies | — | — |
| SETUP | Sign of ROD = ln(ES at 15:30 / PDC) | M30 bar ending 15:30; PDC from D1 | Same: the published effect is defined on clock time |
| TRIGGER | Close of the 15:00–15:30 ET M30 bar | M30 | Same |
| MANAGEMENT | Stop 1.0 × ATR(M30); flat 15:59:00 ET | M30 ATR; M1 monitor | VB-B for monitoring only |

In POSITIVE the signal is recorded as SHADOW, which rebuilds the published contrast forward, since momentum should be weak on those days. NEAR_FLIP and UNKNOWN produce no trade. PDC is the front contract's last trade at or before 16:00 ET in the prior RTH session; after a roll, use the new contract's own prior close. The setup uses Baltussen's rest-of-day return rather than Gao's first half-hour because that is the version tested on futures with gamma conditioning, and Gao's sign is logged as a diagnostic. At 15:30:00 ET, send a marketable limit in the ROD direction at best offer plus one tick for a long, cancelled after 60 seconds (*Design proposal*). The server-side stop sits at entry ∓ 1.0 × ATR(M30). There is no target, because the effect runs to the close. Exit at market at 15:59:00 ET; that design proposal keeps the order out of the settlement minute, where CME's RA2608-5 addresses closing-period conduct ([CME RA2608-5](https://www.cmegroup.com/content/dam/cmegroup/notices/market-regulation/2026/07/cme-group-ra2608-5.pdf)). Never carry the trade, because momentum reverts over following days and at the next open. Skip early-close sessions, tier-1 releases inside 15:30–16:00, and sessions with an open position in the instrument. News earlier in the day is not a filter, since Gao finds the effect stronger on macro-news days.

```python
# GEX-01 state machine: IDLE -> EVALUATE -> {SHADOWED | SKIPPED | ORDER_PENDING} -> IN_POSITION -> CLOSED
on BarClosed("M30", sym, bar) where bar.close_ts == "15:30 ET":
    if early_close() or blackout(15.5, 16.0) or has_position(sym):
        return record(SKIPPED)
    g = gamma_regime(sym, as_of=bar.close_ts)
    side = sign(ln(bar.close / PDC(sym)))
    if side == 0:
        return record(SKIPPED)
    if g.state != NEGATIVE or wall_blocks(side, bar.close, g):
        return record(SHADOWED, g)
    stop = bar.close - side * 1.0 * ATR("M30", sym)
    send_marketable_limit(sym, side, qty=size_for(stop), ttl_s=60, tag=setup_id())
    schedule("15:59:00 ET", flatten, setup_id())
```

| Parameter | Window | Setup | Regime | Stop | Entry TTL | Exit | Size |
|---|---|---|---|---|---|---|---|
| Default | 15:30–16:00 ET | Sign of ROD | NEGATIVE, 2 × M5 | 1.0 × ATR(M30) | 60 s | 15:59:00 ET | 1 MES |

The visual review checks four things. Was the regime NEGATIVE on data dated before 15:30, and was PDC taken from the right contract? What were MFE and MAE over the last 30 minutes? Did the regime flip after 15:30, as in Cboe's August 2023 example? How do traded NEGATIVE days compare with shadowed POSITIVE ones? The main failure modes are the proxy mismatch (SPX-only GEX omits leveraged-ETF flow), a sign error from the naive convention, a post-2022 regime change, and a small R² that guarantees many losing days. ES and NQ results are highly correlated and count as roughly one stream. At one trade per negative-gamma day, the 70–150 trades that 07 says are needed to distinguish +0.2R from zero will take a year or more. Relations: GEX-01 implements 02's intraday-momentum concept, GEX-05 enforces its no-carry rule, an open GEX-03 position pre-empts it, and GEX-06 can translate it but not into 0DTE single options.

### GEX-02 Positive-gamma balance fade at prior value edges

| At a glance | |
|---|---|
| Style / hold | Fade of a failed probe beyond the prior RTH value area; 5–60 minutes |
| Instruments | ES/MES, NQ/MNQ |
| Evidence grade | **B** context (positive-gamma damping); **C** setup (value-edge fade); **C** walls as targets |
| Complexity | Medium |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | Host balance read: RTH opens inside prior PROFILE(RTH) value, gated by GAMMA_REGIME = POSITIVE | D1 prior profile; M5 ribbon | Same (clock time) |
| LOCATION | Prior-session VAH (short) or VAL (long) | Clock-time level | Same |
| SETUP | Probe ≥ 1 tick beyond the edge | M5 | VB-B |
| TRIGGER | First close back inside value within 3 bars of the probe extreme | M5 close | VB-B close |
| MANAGEMENT | Stop at probe extreme + 0.25 × ATR(trigger layer); T1 prior POC; T2 opposite VA edge, capped at a mapped wall in the path; 60-minute time stop | ATR(M5) | ATR(VB-B) |

In POSITIVE the trade runs with the wall cap and time stop. In NEGATIVE it is shadowed. In NEAR_FLIP or UNKNOWN the plain host VP-family rule applies, without gamma overlays and tagged. Value areas use the single committed algorithm in [03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md), where rotational sessions favor fading value edges and the prior POC is the recommended first objective. Entry is a stop order one tick beyond the trigger bar, below its low for a short, valid for two bars. A regime change after entry does not force an exit; the host stop governs and the change is logged. No entries come after 15:00 ET, leaving that window to GEX-01. GEX-04 adds pin rules on MONTHLY and QUARTERLY days.

```python
# GEX-02: IDLE -> PROBED -> ARMED -> ORDER_PENDING -> IN_POSITION -> CLOSED; also SHADOWED / EXPIRED
on BarClosed(L, sym, bar):                         # L = M5 (time) or VB-B (volume)
    edge = prior_profile(sym).vah_or_val_near(bar)
    if st.idle and opened_inside_prior_value(sym) and probes_beyond(bar, edge, ticks=1):
        st.probe_extreme, st.bars = bar.extreme(edge.side), 0
        st.to(PROBED)
    elif st.probed:
        st.bars += 1
        if closes_back_inside(bar, edge):
            g = gamma_regime(sym, as_of=bar.close_ts)
            if g.state == NEGATIVE or wall_blocks(edge.fade_side, bar.close, g):
                return st.to(SHADOWED, g)
            t2 = cap_at_wall(opposite_edge(edge), g) if g.state == POSITIVE else opposite_edge(edge)
            arm_stop_entry(bar, side=edge.fade_side, valid_bars=2,
                           stop=st.probe_extreme + edge.away * 0.25 * ATR(L, sym),
                           targets=(prior_poc(sym), t2),
                           time_stop_min=60 if g.state == POSITIVE else None)
        elif st.bars > 3:
            st.to(EXPIRED)
```

The visual review checks four things: whether the open sat inside prior value under the committed method, whether the regime was POSITIVE as of the trigger, whether the mapped wall sat within its band, and how often T1 was reached compared with shadowed NEGATIVE-day fades. The failure modes are a trend day emerging after a positive-gamma open, a value-area algorithm that differs from the one charted, walls displaced by basis error, and damping that lasts only about an hour. GEX-02 builds on the VP-family value-edge fades, uses GEX-04 on expiry days, and feeds the CX router.

### GEX-03 Negative-gamma continuation filter for IB extensions

| At a glance | |
|---|---|
| Style / hold | Initial-balance extension continuation; 30 minutes to flat at 15:59 ET |
| Instruments | ES/MES, NQ/MNQ |
| Evidence grade | **B** context (negative-gamma momentum is documented end-of-day and last-30-minute, not for mid-session breakouts); **C** setup |
| Complexity | Medium |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | GAMMA_REGIME = NEGATIVE, persisted; optionally the combined gamma + internals classifier, if pre-declared | M5 ribbon; M15 internals | Same (clock time) |
| LOCATION | IBH (long) or IBL (short) | Clock-time levels | Same |
| SETUP | IB complete at 10:30 ET with width < 0.6 × 20-session median IB width | M30 | M30 (clock time) |
| TRIGGER | Close ≥ 1 tick beyond IBH/IBL between 10:30 and 14:30 ET | M5 close | VB-B close |
| MANAGEMENT | Stop at IB midpoint; T1/T2 at the 1.5× and 2× IB-width extension lines from 03; flat 15:59 ET | M30 | M30 |

In POSITIVE the host IB-extension rule runs with targets capped at the nearer wall, per the matrix. In NEGATIVE this proposal uses uncapped targets and the end-of-session hold. Entry is a stop order one tick beyond the trigger bar, valid for two bars. The IB-midpoint stop is a design proposal: returning to the middle of a narrow IB negates the extension. The rule allows one trade per direction per session, the wall no-entry rule applies, and GEX-04 blocks pin-zone entries in the final 90 minutes of MONTHLY and QUARTERLY days. The 0.6 × median filter and the extension targets come from 03, which grades the setup C because some range extension happens on most sessions.

```python
# GEX-03: IDLE -> IB_READY -> ARMED -> ORDER_PENDING -> IN_POSITION -> CLOSED; also SHADOWED / EXPIRED
at "10:30 ET": ib = IB(sym); st.ready = ib.width < 0.6 * median_ib_width(sym, 20)
on BarClosed(L, sym, bar) where st.ready and "10:30" <= bar.close_ts <= "14:30 ET":
    side = +1 if bar.close >= ib.high + TICK else -1 if bar.close <= ib.low - TICK else 0
    if side == 0 or traded_today(sym, side):
        return
    g = gamma_regime(sym, as_of=bar.close_ts)
    if g.state != NEGATIVE:
        return host_ib_extension(bar, g)          # host rule; wall cap if POSITIVE
    if wall_blocks(side, bar.close, g) or pin_blocks(side, bar, g):
        return record(SHADOWED, g)
    arm_stop_entry(bar, side, valid_bars=2, stop=ib.mid,
                   targets=ib_extensions(ib, side, (1.5, 2.0)), flatten_at="15:59:00 ET")
```

The visual review checks the IB width and its 20-session median, the regime as of the break, whether the move stalled at a mapped wall, and MFE to the 1.5× line compared with capped POSITIVE-day breaks. The failure modes are end-of-day OI that says negative while intraday customer flow has turned positive, news-driven IB breaks, and the scarcity of narrow-IB days. GEX-03 builds on the VP-family IB extension and the PA-family breakouts, and it shares the one-position rule with GEX-01.

### GEX-04 Expiry-day pin awareness and no-new-entry rule

| At a glance | |
|---|---|
| Style / hold | Permission and target overlay on all families; not applicable |
| Instruments | ES/NQ |
| Evidence grade | **B** (NPP is A for single stocks; the index analogue and roll-into-0DTE effect are B) |
| Complexity | Low to medium |

| Role | Condition (time-bar and volume-bar stacks identical: clock-time levels) |
|---|---|
| CONTEXT | EXPIRY ∈ {MONTHLY, QUARTERLY} and inside the final 90 minutes of RTH |
| LOCATION | PIN zones: the top-two-OI strikes of the expiring PM-settled series within 1 × ATR(D1) of the RTH open, mapped ± 0.25 × ATR(D1) |
| SETUP / TRIGGER | Inherited from the host |
| MANAGEMENT | Shadow new continuation entries inside a PIN zone or whose T1 lies beyond one; fades toward a pin may use the strike as target confluence; mark levels EXPIRED at 16:00 ET |

The proximity filter is a design proposal, because a far strike cannot pin. DAILY flags draw zones without changing permissions. Expiring AM-settled monthly OI is gone after the Friday opening print, so it is annotated only from the Thursday close to the Friday open (*Inference* from the notes' AM/PM distinction).

```python
def pin_gate(intent, bar, g):                    # risk manager calls this before any new entry
    if g.expiry not in (MONTHLY, QUARTERLY) or minutes_to_close(bar) > 90:
        return ALLOW
    z = g.pin_zones
    if intent.kind == CONTINUATION and (inside(intent.entry, z) or crosses(intent.entry, intent.t1, z)):
        return SHADOW
    if intent.kind == FADE and toward(intent, z):
        intent.t1 = nearest_zone_center(intent, z)   # target confluence only
    return ALLOW
```

The visual review checks whether the pins came from the correct expiring series, whether mapping held within the band, where the close landed relative to the zones, and whether shadowed breakouts were in fact stopped by the pin. The failure modes are day-old OI, AM/PM confusion, unconfirmed NDX dailies, and pins that simply fail, since NPP's clustering is not universal. GEX-04 applies to every family, supplies targets to GEX-02 and restricts GEX-03.

### GEX-05 Overnight carry guard in calm regimes

| At a glance | |
|---|---|
| Style / hold | Management overlay for positions held through the cash close; not applicable |
| Instruments | ES/NQ |
| Evidence grade | **A/B** for not carrying late-day momentum; **B** for gap sizing (one unrefereed out-of-sample study) |
| Complexity | Low |

| Role | Condition |
|---|---|
| CONTEXT | VIX_REGIME (CALM or STRESSED) and GAMMA_REGIME at the 15:55 M5 close |
| LOCATION / SETUP / TRIGGER | Inherited from the host |
| MANAGEMENT | R1 active; R2 log-only; R3 opt-in |

Under rule R1, GEX-01 trades and any host position whose rationale is negative-gamma late-day momentum must be flat by 15:59 ET. Rule R2 records, for swing variants of host families that hold across 16:00 ET, the VIX regime, the gamma regime and the realized overnight range to the next RTH open. Rule R3 carries half size in CALM regimes when gamma has the sign Maurer associates with larger gaps. R3 stays off because the notes record that gamma's power exists only in calm regimes at the 99th percentile, but not which sign predicts larger gaps. The mechanism points to negative gamma, which is an inference, so the rule switches on only once the user confirms the sign in the paper. The half-size factor is a design proposal. There is also a futures nuance (*Inference*). ES trades through the night, so a Globex stop limits most of the gap that a cash-index study measures. What remains is slippage in thin overnight books, the 17:00–18:00 ET maintenance break and weekends, and that residual is what R3 would size for.

```python
on BarClosed("M5", sym, bar) where bar.close_ts == "15:55 ET":
    for pos in open_positions(sym):
        if pos.tag in GEX01_TAGS or pos.rationale == NEG_GAMMA_MOMENTUM:
            schedule("15:59:00 ET", flatten, pos)                       # R1
        elif pos.holds_overnight:
            log_carry(pos, vix_regime(), gamma_regime(sym).state)       # R2
            if R3_ENABLED and vix_regime() == CALM and gamma_regime(sym).state == MAURER_RISK_SIGN:
                reduce_to(pos, ceil_half(pos.qty))                      # R3, opt-in
```

The visual review checks that every R1 position exited before 16:00, and whether logged overnight ranges look wider on calm, negative-gamma nights. The failure modes are a missing VIX feed, enabling R3 before the sign is confirmed, and weekend gaps that dominate the realized risk. GEX-05 pairs with GEX-01 and protects the swing variants in 08, 09 and 11.

### GEX-06 Futures signal to SPX/SPY option or share vehicle

| At a glance | |
|---|---|
| Style / hold | Execution adapter; hold inherited from the host |
| Instruments | SPX/XSP/SPY options or SPY shares for ES signals; NDX/XND/QQQ for NQ signals |
| Evidence grade | Inherits the host's grade; vehicle mechanics are exchange and practitioner facts |
| Complexity | High: second broker, options quotes, Greeks |

| Role | Condition |
|---|---|
| CONTEXT / LOCATION / SETUP / TRIGGER | Inherited from the ES/NQ host signal, whose time-bar and volume-bar stacks stay on the futures chart unchanged |
| Eligibility | Signal fires in RTH between 09:45 and 15:00 ET (design proposal: avoids opening spreads and late 0DTE gamma) |
| MANAGEMENT | Host stop and targets mapped to the underlying via the live basis or ratio; exit when the mapped level trades; premium backstop |

The default is a single option of 0.60 delta, the middle of the notes' 0.50–0.70 range, with 1–7 days to expiry. The alternative is a debit vertical, long a 0.60 delta and short at the strike nearest the mapped T1, so the spread reaches full value at the host's target. 0DTE is allowed only as a debit vertical, and naked short premium never. The expiry window and short-at-T1 rule are design proposals. Orders go in as a limit at mid, stepped one tick toward the far side every 5 seconds for at most 3 steps, then cancelled (*Design proposal*). Exit on the mapped underlying stop, with a backstop exit if the option's mark falls to 50% of premium paid. That figure is a design proposal, because the notes call for a backstop without giving a number. Close short SPY/QQQ legs before ex-dividend dates and expiry. Prefer the cash-settled index products, falling back to SPY/QQQ only when index liquidity is inadequate at size, and skip any trade whose quoted spread exceeds a tenth of the option's expected gain to T1 (*Design proposal*).

```python
class OptionVehicle(VehicleAdapter):              # second broker; the futures engine is unchanged
    def open(self, intent):                       # intent from an ES/NQ host, in futures prices
        if not ("09:45" <= intent.ts <= "15:00 ET"):
            return reject("window")
        u_stop, u_t1 = map_to_underlying(intent.stop), map_to_underlying(intent.t1)
        leg = pick_by_delta(self.chain, side=intent.side, delta=0.60, dte=(1, 7))
        qty = round(target_delta_dollars(intent) / (abs(leg.delta) * 100 * self.underlying.last))
        if qty < 1 or spread(leg) > abs(u_t1 - self.underlying.last) * abs(leg.delta) / 10:
            return reject("size_or_spread")
        self.order = place_stepped_limit(leg, qty, start="mid", step_ticks=1, every_s=5, max_steps=3)
        self.watch(u_stop, u_t1, premium_floor=0.5 * leg.mid)
```

The visual review checks whether the mapped underlying levels matched the futures levels at signal time, the fill against mid, whether the exit followed the mapped stop, and the tracking error against futures-equivalent P&L. The failure modes are spreads blowing out in fast markets, SPX print lag distorting the mapping, 0DTE gamma, early assignment on SPY short legs, two brokers meaning two kill switches, and options-data licensing. GEX-06 is a vehicle layer under any family and inherits GEX-04 and GEX-05.

## How to visually verify gamma levels and the regime filter

Gamma levels are the least observable inputs in the series, so verify them before setup review means anything.

| Check | How | Pass condition (Design proposal) | If it fails, suspect |
|---|---|---|---|
| DIY vs reference sign | Compare GEX_total sign each morning with a vendor or [FlashAlpha](https://flashalpha.com/tools/gex-calculator) for 20 sessions | Same sign on clear days; disagreements cluster near zero | Sign convention, missing expiries, IV inputs |
| Zero gamma | DIY and vendor ZG on one SPX chart | Within the ±0.25% band on most days | Grid range, multiple crossings, stale OI |
| Basis | Rolling ES − SPX against CME fair value with current inputs | Close agreement, decaying toward zero through the quarter | SPX print lag, wrong contract |
| Mapped levels | Engine ES levels against the vendor's own ES-converted levels | Inside the tolerance band | Spread vs ratio, lock time |
| Regime ribbon | Color M5 bars by state with as-of stamps | ≤ 2 transitions on most sessions; more means log it, don't retune | Noisy intraday refresh |
| As-of correctness | Replay to each signal | Only prior-day OI and earlier snapshots visible | Look-ahead |
| Expiry flags and roll | Against listed chains; basis on switch day | Exact flags; one logged basis jump | Holidays, NDX status, mixed contracts |
| Shadow tagging | Every shadowed signal has a record | 100% | Gate applied before logging |

The routine is a daily overlay (*Design proposal*). The engine exports ZG, wall and pin bands, and the regime ribbon, to the charting platform. Before the open, the user confirms the bands sit where the reference puts them. After the close, each traded and shadowed signal is reviewed against the as-of chart. Frequent regime flips and walls that consistently miss the reference by more than the band are the two failures to catch early.

## Recommended starting point

Spend the first two weeks on plumbing alone: build the mapping and a DIY end-of-day GEX from Databento OPRA EOD statistics (OI) plus quotes for implied volatility, and cross-check against a free calculator, with nothing trading. Then run GAMMA_REGIME in signal-only mode for at least the 4–6 weeks or 30–50 signals per host type that [07 Automation architecture](07%20Automation%20architecture.md) sets as the minimum. Write the label into every PA-, VP- and CX-family decision record, let GEX-01 to GEX-04 produce shadow records, and keep internals off. Next, simulate GEX-01 at 1 MES and switch on GEX-04, which only ever removes trades. Add intraday vendor levels or Cboe Open-Close data only if the end-of-day regime proves stable and useful in the log, and only after clearing non-display licensing in writing. Add the equities or options vehicle last, once the second-broker adapter passes the same plumbing and kill-switch tests as the futures path. This order front-loads the cheapest, best-supported pieces and defers the two hardest dependencies, data licensing and a second broker, until forward evidence shows gamma context earns its cost.

## Conclusion

The evidence ranks gamma outputs in the reverse of how they are marketed. The coarsest output, the sign of aggregate exposure, has the best support from Baltussen's 60-market study and Barbon's next-open reversal, while the most precise outputs, wall prices and the Volatility Trigger, have none. A non-backtesting trader can therefore use gamma without trusting any vendor level, as a one-bit switch on an effect that was already in the strategy set. The shadow mechanism keeps this honest, because every vetoed signal is still recorded. Forward data then answers the question the literature cannot yet answer for 2026. Daily 0DTEs have made positive market-maker gamma routine on expiry days, and Cboe's side-aware data shows balanced customer flow, so negative-gamma days may now be rarer and weaker than in any published sample. A year of GEX-01 and GEX-02 logs comparing traded and shadowed outcomes will show whether gamma still separates the days, and that evidence should decide whether intraday data, licensing and a second broker are worth paying for.
