# Dealer gamma gates the trade, never triggers it

Options dealer gamma exposure (GEX) belongs in ES/NQ automation only as a coarse CONTEXT label that can veto trades. Its best-supported job is deciding whether to take the late-session intraday-momentum trade. The mechanism is sound. Dealers who are net long gamma hedge against price moves and damp them. Dealers who are net short gamma hedge with the move and amplify it. The strongest evidence ties this directly to futures: across **60+ futures from 1974 to 2020**, the last-30-minute return follows the rest-of-day return, and the effect is concentrated on days when estimated option-dealer and leveraged-ETF gamma is negative ([Baltussen et al., JFE 2021](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Alpha Architect summary](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)). Expiration-day pinning in optioned stocks is also established ([Ni, Pearson & Poteshman 2005](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)).

Everything finer than that is weaker. Public GEX numbers model once-a-day open interest under a "naive dealer" sign convention, and SpotGamma, which sells such numbers, says that convention "cannot be 100% true" ([SpotGamma](https://spotgamma.com/spx-gamma-model-positioning-adjustments/)). Cboe can see both sides of each trade. It finds SPX 0DTE customer flow "remarkably balanced" and puts market-maker hedging at **0.04%–0.17% of daily S&P futures liquidity** ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). Call walls, put walls, the Volatility Trigger, the Hedge Wall and vanna/charm flows have no independent validation.

This report therefore designs a four-state filter, GAMMA_REGIME ∈ {POSITIVE, NEGATIVE, NEAR_FLIP, UNKNOWN}. It uses a ±0.25% buffer around the mapped zero-gamma level and needs two M5 closes to persist before it changes state. It can veto host signals from the PA-, VP- and CX-families, which means suppressing the order while still logging the signal (SHADOW). It can never create one. Walls serve only as no-new-entry zones and as target confluence. Start with low-cost end-of-day data and run the filter in signal-only mode. Equities or SPX/SPY options are an optional vehicle for cash hours only, through a second broker API, because Rithmic is a futures route.

*Reading notes.* This is write-up 12 of the series indexed in [00 Index and reading guide](00%20Index%20and%20reading%20guide.md). It is an optional dimension, kept apart from swings ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)), price action ([02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md)), volume profile ([03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md)) and Fibonacci. Section 06 ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)) already rules that gamma, if used, sits in the CONTEXT role and is never counted as a location vote. The regime router in [11 Proposals confluence](11%20Proposals%20confluence.md) takes GAMMA_REGIME as an optional input.

Gamma applies to ES/MES and NQ/MNQ only, never CL. Times are Eastern. RTH means the 09:30–16:00 ET cash session (08:30–15:00 CT). Evidence grades follow the series scale:

| Grade | Meaning |
|---|---|
| A | Peer-reviewed support for the mechanism |
| B | Practitioner consensus with partial empirical support |
| C | Vendor-only or anecdotal |
| D | Tested and not supported |

Two labels mark material that is not sourced. *Design proposal* marks this report's own engineering. *Inference* marks reasoning drawn from the sources. Every numeric default is a pre-committed starting value taken from the research notes, or labelled as a design proposal where the notes give none. None has been optimized. Nothing here is tax advice.

## Long-gamma dealers lean against moves; short-gamma dealers chase them

An options market maker usually hedges the delta of its book in the underlying or in ES futures. Gamma is the rate at which that hedge must change as price moves.

When the book is net long gamma, the hedge leans against the move. A rise increases the book's delta, so the dealer sells into it. A fall reduces delta, so the dealer buys the dip. Delta-hedgers who are long options near a strike "sell stock when price rises above a strike and buy when it falls below", which pushes price toward the strike ([Pearson, Poteshman & White](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)).

A net-short-gamma book inverts this. The dealer must buy as price rises and sell as it falls, which creates momentum. Baltussen, Da, Lammers and Martens use that mechanism to link option market makers, and leveraged-ETF rebalancing, to market intraday momentum ([Baltussen et al. working paper](https://www3.nd.edu/~zda/intramom.pdf)). Barbon and Buraschi describe the usual configuration: dealers are short gamma on the downside and long gamma on the upside. A large negative aggregate imbalance should therefore coincide with higher volatility and short-term momentum ([Gamma Fragility](https://abarbon.com/papers/gamma-fragility)).

GEX turns this into a number: the dollars of underlying that dealers must trade per 1% index move to stay delta-neutral. The sign says which way the hedge pushes. The size relative to market liquidity says whether the push matters, and that second part is often forgotten. Cboe estimates SPX 0DTE net hedging at 0.04%–0.17% of the roughly **$400bn** of daily S&P futures liquidity, with 3:30 pm tails reaching 1.3%–1.9% ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). The reasonable expectation is a modest, conditional effect, not price levels that act deterministically.

### Public GEX is a model of who holds the open interest

No public dataset shows dealer positions by strike. SqueezeMetrics' original GEX white paper (revised December 2017) uses "a few assumptions" to fill that gap ([white paper copy](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf)). Secondary sources call its sign rule the **naive-dealer convention**: dealers are long the calls customers sold and short the puts customers bought, so calls add positive gamma and puts subtract it ([LuxAlgo](https://www.luxalgo.com/library/concept/gamma-exposure/)).

SpotGamma states that many models assume every call is sold to dealers and every put bought from them, that this "cannot be 100% true", and that it applies its own positioning adjustments ([SpotGamma](https://spotgamma.com/spx-gamma-model-positioning-adjustments/)). Providers make different side assumptions, so their numbers differ ([Convextrade](https://convextrade.com/glossary/dealer-gamma-exposure)). A 2026 MPRA working paper claims a 30–50% error margin. Its method was not verified ([MPRA 129365](https://ideas.repec.org/p/pra/mprapa/129365.html)).

The exchange that sees both sides contradicts the convention where it matters most. Cboe observes the customer or market-maker side and the open/close flag of each SPX trade. It finds 0DTE customer flow balanced and market-maker net gamma small and often changing sign. It also notes three problems with outside estimates. Outsiders lack the side breakdown, so their numbers rest on assumptions. Dealers may offset SPX risk in E-mini or SPY 0DTE options. And they may hedge options with other options rather than futures. Single-product GEX can therefore misstate the hedge flow that actually reaches ES ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)).

*Inference:* a "gamma flip" level is a modeled price at which an assumed inventory changes sign. If customers are heavy call buyers or put sellers, the true flip can be far away, or the sign can be inverted. In a strategy it is a soft regime prior with a buffer, never a hard switch.

## Peer-reviewed work supports a regime prior, not a map of levels

The evidence sorts into three tiers:

| Tier | What it covers |
|---|---|
| Established | Pinning and gamma-conditioned late-session momentum |
| Contested | 0DTE effects |
| Vendor-only | Every named level beyond zero gamma |

Several key papers were read through abstracts or secondary summaries, and the table says where.

| Finding | Status | Grade | Sources |
|---|---|---|---|
| Long-gamma hedging pushes price toward strikes; short-gamma hedging trades with the move | Established mechanism | A | [Pearson, Poteshman & White](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf); [Baltussen et al.](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403) |
| Expiration-day closes cluster at strikes in optioned stocks | Established for single stocks | A | [NPP 2005](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87) |
| The same pinning at index level on monthly and quarterly expiries | Plausible analogue, less documented | B | NPP by analogy; [Adams et al. via Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/) |
| Early-session or rest-of-day return predicts the last 30 minutes | Established | A | [Gao et al. 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414); [Baltussen et al.](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Li, Sakkas & Urquhart](https://reading-9.eprints-hosting.org/95566/1/Accepted-Version.pdf) |
| That momentum is concentrated on negative-gamma days | Established; gamma detail read via summary | A | [Alpha Architect](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/); [Barbon et al. 2021](https://papers.ssrn.com/abstract=3925725) |
| Positive market-maker gamma lowers 10–60 minute volatility and strengthens ES order-flow reversal | Working paper, read via summary | B | [Adams et al. via Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/) |
| 0DTE hedging amplifies index volatility on average | Tested; not supported | D | Adams et al.; [Dim, Eraker & Vilkov](https://www.maths.ox.ac.uk/node/67396); [Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact) |
| Dealer gamma helps forecast overnight gap size, in calm regimes only | One out-of-sample working paper | B | [Maurer via OptionMetrics](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/) |
| Call Wall and Put Wall act as resistance and support | Vendor only | C | [SpotGamma](https://spotgamma.com/call-wall-put-wall-explained/) |
| Zero gamma, Volatility Trigger and Hedge Wall as tradable levels | Vendor only; definitions inconsistent | C | [SpotGamma key levels](https://support.spotgamma.com/hc/en-us/sections/1500001160601-SpotGamma-Key-Levels) |
| Vanna/charm flows into OPEX; post-OPEX "window of weakness" | No academic source found | C | none in the notes |
| NQ-specific gamma behavior | Not studied in the notes | none | none |

### Pinning and late-day momentum are the established core

Ni, Pearson and Poteshman (*Journal of Financial Economics*, 2005) find that optioned stocks close at strike prices more often on expiration dates. They attribute this to market makers' delta-hedge rebalancing and to manipulation by proprietary traders. Returns shift by **at least 16.5 bp** on average each expiration, about $9 billion of market cap in aggregate. The clustering does not appear for every stock on every expiry ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:78:y:2005:i:1:p:49-87)). Pearson, Poteshman and White find strong evidence of hedging moving stock prices only on expiration dates ([OU working paper](https://ou.edu/dam/price/Finance/CFS/paper/pdf/pearsonPoteshmanWhite.pdf)).

The index analogue is plausible but less documented. One finding sharpens it. Adams et al. report that longer-dated positions rolling into 0DTE status add **~24 bp** to expiry-day hedging needs, against ~3 bp from new same-day positions ([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/)). *Inference:* large monthly and quarterly expiries matter more for pinning than routine daily ones.

On the momentum side, Barbon, Beckmeyer, Buraschi and Moerke find that a large negative aggregate gamma imbalance, scaled by dollar volume, produces end-of-day momentum, and a positive one produces reversal. Both effects revert at the next day's open ([SSRN 3925725](https://papers.ssrn.com/abstract=3925725)). Barbon and Buraschi add that the effect is strongest in the least liquid underlyings and is related to flash-crash frequency ([Gamma Fragility](https://abarbon.com/papers/gamma-fragility)).

### Intraday momentum is the bridge from gamma to futures trading

Report [02 Multi timeframe price action](02%20Multi%20timeframe%20price%20action.md) treats Gao, Han, Li and Zhou as the nearest rigorous evidence that the early-session direction persists. In SPY data from 1993 to 2013, the return from the prior close through the first half-hour predicts the last half-hour, with an **R² of about 1.6%**. The effect is stronger on volatile, high-volume, recession and macro-news days. It is explained by infrequent rebalancing and late-informed trading ([Gao et al., JFE 2018](https://econpapers.repec.org/RePEc:eee:jfinec:v:129:y:2018:i:2:p:394-414)). It replicates in 12 of 16 developed markets ([Li, Sakkas & Urquhart](https://reading-9.eprints-hosting.org/95566/1/Accepted-Version.pdf)).

An R² of 1.6% is small. Baltussen et al. supply the conditioning variable. Across more than 60 equity, bond, commodity and currency futures from 1974 to 2020, the last-30-minute return is predicted by the rest-of-day return, and it reverts over the following days ([EconPapers](https://econpapers.repec.org/RePEc:eee:jfinec:v:142:y:2021:i:1:p:377-403); [Erasmus repository](https://pure.eur.nl/en/publications/hedging-demand-and-market-intraday-momentum/)). Using S&P 500 index-option and leveraged-ETF data, they find the momentum present when negative gamma exposure is present, and stronger as it grows. A secondary summary says it is largely absent on positive-gamma days ([Alpha Architect](https://alphaarchitect.com/hot-topic-does-gamma-hedging-actually-affect-stock-prices/)).

This is the strongest bridge in the whole dimension. A published effect in futures has a published conditioning variable, so gating it by gamma sign follows the concept rather than an optimization. Proposal GEX-01 below is built on it.

Three inferences temper it:

1. **The study's gamma measure differs from what the user can buy.** Baltussen's measure includes leveraged-ETF rebalancing, which always runs with the day's move whatever the options positioning. An SPX-only GEX omits that component. The study's sign method was also not verified, and could be naive-convention or signed-volume.
2. **The samples end before daily 0DTEs.** Gao's ends in 2013 and Baltussen's in 2020. Since 2022 daily SPX expiries have been standard, and Adams et al. find market makers' expiry-day gamma stays positive. Negative-gamma days may now be rarer than in the samples, and nobody has measured it.
3. **NQ is unverified.** Its inclusion in the 60+ futures, and its own results, were not checked.

The effects also act on different horizons:

| Study | Horizon | What it implies |
|---|---|---|
| Adams et al. | Positive-gamma dampening decays within about an hour | Time stops on fades |
| Baltussen et al. | Momentum acts in the last 30 minutes | When to take the momentum trade |
| Barbon et al. | Effects revert at the next open | Do not carry the trade overnight |

Gamma context therefore governs late-session holding periods, targets and fade-versus-follow decisions, not multi-day swing targets. Da's end-of-day reversal in single stocks is a separate effect that gamma does not explain, and it should not be mixed in ([Da EOD paper](https://www3.nd.edu/~zda/EOD.pdf)).

### 0DTE effects remain contested, and the better data lean toward damping

Adams et al. (SSRN 5641974, via summary) identify their effect using the pre-May-2022 Tuesday/Thursday 0DTE schedule. They find:

1. **Lower volatility:** index volatility runs about **60 annualized bp lower** on days with 0DTE trading.
2. **Positive gamma:** market makers hold larger net gamma on expiry days, and it stays positive through the day.
3. **Short-horizon effects:** higher net gamma predicts lower volatility over the next 10 minutes, fading after about an hour. It also predicts stronger E-mini order-flow reversals and negative high-frequency momentum.
4. **A −4 multiplier:** one extra basis point of hedging need means four basis points lower realized volatility.

([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/); [Resonanz Capital](https://resonanzcapital.com/insights/every-day-the-market-hires-a-counter-trend-trader))

Dim, Eraker and Vilkov find that high 0DTE open-interest gamma does not propagate past volatility, and that intraday 0DTE volume shocks do not amplify index returns ([Oxford seminar listing](https://www.maths.ox.ac.uk/node/67396); [Harbourfront Quant](https://harbourfrontquant.substack.com/p/the-rise-of-0dte-options-cause-for)). A Princeton thesis, weighted lower, rejects gamma feedback as the main channel ([Princeton](https://theses-dissertations.princeton.edu/entities/publication/61115cd1-cb09-4a8b-9230-ff488fc2a386)).

Cboe's own figures point the same way, though Cboe has a commercial stake in 0DTE's reputation. Daily average market-maker net gamma ranges from **$170mm to $670mm**. At 3:30 pm the median is **+$173mm**, the interquartile range runs from −$1.1bn to +$2.4bn, and the whiskers reach −$5bn and +$7.7bn ([Cboe, Sep 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)). By 2025:

| Measure | Value |
|---|---|
| SPX 0DTE volume | About 2M contracts a day, more than five times the level three years earlier |
| Retail share | 50–60% |
| Limited-risk trades (long options or spreads) | More than 95% |
| Naked short trades | 4% |
| Market-maker hedging | "De minimis", at most 0.2% of SPX liquidity |

([Cboe, May 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact))

The "0DTE volatility bomb" therefore grades **D** on average. The tails are still real. On August 15, 2023, net gamma swung from about +$2bn at 3 pm to about −$500mm by 3:30 pm. A context filter must update intraday and require persistence.

The newest result runs against practitioner lore. In an out-of-sample test, dealer gamma improves forecasts of overnight gap size only in low-VIX regimes: about a **15% reduction** in quantile loss at the 99th percentile, after a Holm correction across 100 Clark-West tests. Pooling all regimes washes the effect out, and the author calls it "the inverse of the practitioner narrative" ([Maurer, OptionMetrics, May 2026](https://optionmetrics.com/research/dealer-gamma-exposure-and-overnight-gap-risk-incremental-information-in-low-volatility-regimes/)).

### Walls, triggers and vanna/charm flows are vendor constructs

SpotGamma defines its levels as follows, and its own sources disagree on one of them:

| Level | SpotGamma definition |
|---|---|
| Call Wall | Strike with the largest call gamma; "a ceiling" |
| Put Wall | Strike with the largest put gamma; "a high-probability structural level, not a guaranteed floor" |
| Zero Gamma | Not support or resistance, but informative of regime |
| Volatility Trigger | Sources conflict: equal to zero gamma, or several points above it as an earlier warning |
| Hedge Wall | A "volatility flip line" between the walls; walls update through the session |

([SpotGamma walls](https://spotgamma.com/call-wall-put-wall-explained/); [Put Wall article](https://support.spotgamma.com/hc/en-us/articles/15297856056979-Put-Wall); [Zero Gamma article](https://support.spotgamma.com/hc/en-us/articles/15297958613907-Zero-Gamma); [how to trade GEX levels](https://spotgamma.com/how-to-trade-gex-levels/); [HIRO User Guide](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf))

No published wall formula was found. No peer-reviewed study tests walls or zero gamma as ES support and resistance, and no academic source covers vanna/charm flows into OPEX. All of these grade **C**. In this design they appear only as annotations, no-entry zones and target confluence.

## Every GEX number starts from once-a-day open interest

Vendors publish modeled levels with proprietary adjustments, typically refreshed intraday for SPX, SPY, QQQ and NDX but only end-of-day for futures options. A DIY estimate is easy from an options chain but inherits the naive sign and daily open interest (OI). Side-aware intraday data exists at extra cost.

| Source | What it provides | Cadence and latency | Main limit for automation | Type |
|---|---|---|---|---|
| SpotGamma | Call/Put Wall, Zero Gamma, Volatility Trigger, Hedge Wall, Key Gamma Strike | Updated through the session ([HIRO guide](https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide-2.pdf)) | Formulas unpublished; automated-use terms unverified | Vendor |
| MenthorQ | Index/ETF levels, futures-options gamma, NinjaTrader/Sierra/TradingView feeds with "Auto Ratio Conversion" | Indices/ETFs 14×/day; futures EOD ([guide](https://menthorq.com/guide/gamma-levels-on-futures-options/); [integrations](https://menthorq.com/academy/getting-started/lessons/menthorq-integrations/)) | A review reports ~20-minute delayed futures data on third-party platforms ([Kagels](https://www.kagels-trading.de/menthorq-erfahrungen/)) | Vendor |
| SqueezeMetrics | Original naive-dealer GEX ([white paper](https://slopeofhope.com/wp-content/uploads/2020/11/GEX-white_paper.pdf)) | Daily | Current product/API status not checked | Vendor |
| Databento OPRA | Real-time quotes; EOD statistics with OHLC, volume and OI; pcap history from 2023-03-28 ([docs](https://databento.com/docs/datasets/opra-pillar); [blog](https://databento.com/blog/opra-data)) | Real-time quotes; OI once a day | **No Greeks**; live use needs a licensing questionnaire | Vendor |
| Cboe DataShop Open-Close | Volume by participant type, buy/sell and open/close, Cboe venues only ([volume summary](https://datashop.cboe.com/volume-summary-data); [product page](https://datashop.cboe.com/open-close-cboe-c2-exchange)) | 10-minute snapshots a few minutes late; a 1-minute product delivered within ~5 minutes, fees approved Feb 2026 ([SR-CBOE-2026-011](https://cdn.cboe.com/resources/regulation/rule_filings/approved/2026/SR-CBOE-2026-011.pdf); [SEC 34-104796](https://www.sec.gov/files/rules/sro/cboe/2026/34-104796.pdf)) | Cost; OI only in EOD files; redistribution terms unverified for options | Exchange |
| Intrinio | Options data with delta, gamma, theta and vega ([FAQ](https://help.intrinio.com/options-faqs)) | Not checked | Not evaluated | Vendor |
| FlashAlpha | Free web GEX calculator ([tool](https://flashalpha.com/tools/gex-calculator)) | On demand | A cross-check, not a documented feed | Vendor |

Two gaps block automated use. The notes retrieved no current prices for any vendor. And they did not verify, for any vendor, whether the terms permit non-display use, meaning software that triggers orders. OPRA and Cboe both classify subscribers and uses, so that permission must be cleared in writing before any order depends on gamma data.

### Computing a rough GEX yourself

For strike K and expiry T, with option multiplier M = 100 (SPX, SPY, QQQ and NDX) and Black-Scholes gamma Γ per one point of S, the dollar gamma per 1% move is:

**GEX_K = Γ(K,T,S,σ) × OI × M × S² × 0.01**

The delta change per 1% move is Γ × 0.01·S. Multiplying by S, M and OI gives dollars. Under the naive convention calls count positive and puts negative, and the total is the sum over all strikes and expiries.

To read the total in futures terms, divide it by $50 × ES price. With a hypothetical ES at 6,000, $1bn of gamma per 1% equals about 3,333 ES contracts per 1% move, a number that can be compared directly with ES volume.

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

The limits matter more than the arithmetic:

1. **The sign assumption** is the dominant error.
2. **OI is published once a day.** Today's 0DTE opening flow is invisible until tomorrow. Adams' 24 bp versus 3 bp split softens this, because pre-existing positions dominate expiry-day hedging needs.
3. **One product at a time.** The estimate sees SPX alone and misses SPY, ES options, QQQ and NDX unless they are converted to the same dollar-gamma-per-1% unit and summed.
4. **Volatility inputs.** The IV surface and skew change Γ.
5. **Missing Greeks.** Vanna (delta change with IV) and charm (delta change with time) are ignored, and they dominate into expiry.
6. **Recompute cost.** Recomputing every 1–5 minutes from live OPRA quotes is feasible on a private server, but it means Greeks for thousands of SPX strikes, and it still uses yesterday's OI.

The least assumption-laden output is therefore the coarse one: the sign of the total, or spot above or below zero gamma with a buffer. Exact wall prices carry the most assumptions.

## SPX strikes reach ES through a live basis, NDX strikes through a live ratio

Index and ETF levels do not line up on futures charts without conversion, because futures carry financing and dividends. CME defines fair value as **Cash × [1 + r × (days/360)] − Dividends**. Its older worked example takes 1146 cash, a 5.7% rate, 78 days and 3.47 dividend points to 1156.68 ([CME fair value](https://www.cmegroup.com/trading/equity-index/fairvalue.html)). Basis is positive when financing exceeds forgone dividends, although sources define it differently ([NexusFi](https://nexusfi.com/a/concepts/futures-pricing-cost-of-carry); [FlashAlpha](https://flashalpha.com/articles/es-futures-fair-value-basis-explained)). Arbitrage keeps futures near fair value, but not exactly at it ([NexusFi index arbitrage](https://nexusfi.com/a/exchanges/index-arbitrage-fair-value)).

The basis shrinks toward zero at expiration. A hard-coded offset is therefore wrong by the decay accumulated over the days since it was set. MenthorQ supports spread and ratio conversion for SPX→ES, SPY→ES, QQQ→NQ and NDX→NQ ([MenthorQ conversion](https://menthorq.com/guide/levels-conversion/)). Its open-source TradingView script can lock the ratio at 10:00 and 15:30 ET, and warns that mixing methods across platforms misaligns levels ([TradingView script](https://www.tradingview.com/script/KcR9Nfs8-MenthorQ-Levels-Conversion)).

| Source level | Target | Method | Reason |
|---|---|---|---|
| SPX strike | ES | Additive live spread ES − SPX | Basis is a point amount |
| NDX strike | NQ | Live ratio NQ / NDX | More robust at NQ's larger price scale |
| SPY strike | ES | Live ratio ES / SPY | SPY ≈ SPX/10 only roughly; drifts with dividends and fees |
| QQQ strike | NQ | Live ratio NQ / QQQ | QQQ ≈ NDX/~40 only roughly; never hard-code |
| ES/NQ options gamma | ES/NQ | Native | A separate inventory; convert to dollar gamma per 1% before summing with index gamma |

```python
# Level mapping (Design proposal; steps from the notes). Cash index values need an index feed.
SAMPLE_EVERY = 10   # seconds
WINDOW = 180        # 3-minute rolling median, inside the notes' 1-5 minute range

def on_timer(now):
    if not is_rth(now):                       # 09:30-16:00 ET only; the cash index is not updating
        mapping.stale = True                  # keep the last RTH basis and ratio
        return
    if age(SPX.last) > 15 or age(NDX.last) > 15:
        return                                # SPX is a calculated index; skip stale prints
    basis_es.push(now, ES.mid - SPX.last)
    ratio_nq.push(now, NQ.mid / NDX.last)
    ratio_es_spy.push(now, ES.mid / SPY.last)
    ratio_nq_qqq.push(now, NQ.mid / QQQ.last)
    mapping.stale = False

def map_level(src, K):
    if src == "SPX": x = K + basis_es.median(WINDOW)
    elif src == "NDX": x = K * ratio_nq.median(WINDOW)
    elif src == "SPY": x = K * ratio_es_spy.median(WINDOW)
    elif src == "QQQ": x = K * ratio_nq_qqq.median(WINDOW)
    return Band(center=snap(x, 0.25), half_width=zone_width())   # a band, not a line

def on_front_month_change(old, new):          # quarterly roll: new contract carries ~3 more months of carry
    for buf in (basis_es, ratio_nq, ratio_es_spy, ratio_nq_qqq):
        buf.clear()
    remap_all_levels()
    log_roll(old, new)
```

Outside RTH, keep the last RTH conversion, or the CME fair-value model, and mark every level stale. *Design proposal:* consumers treat stale levels as information only.

Two gaps remain. The notes found no source on typical intraday noise in the ES−SPX spread, so the band width below borrows the series' ATR tolerance rule instead. They also did not establish whether Rithmic carries cash-index values. Plan on the same second data feed that internals need (*Inference*).

## GAMMA_REGIME: four states, a 0.25% buffer and two closes of persistence

The filter turns the coarse outputs into one label per instrument. Only the label is visible to other families. It is evaluated on M5 closes in RTH.

| Input | Definition |
|---|---|
| GEX_total | Sign and size: vendor value, or DIY from prior-day OI |
| ZG_ES, ZG_NQ | Mapped zero-gamma level |
| CW, PW | Mapped Call Wall and Put Wall |
| PIN | Top-two-OI strikes of the expiring series |
| EXPIRY | Calendar flag, defined below |
| as_of | Data timestamp |
| VIX_REGIME | Used only by GEX-05 |

```python
# GAMMA_REGIME state machine (thresholds from the notes; structure is a design proposal)
def on_m5_close(sym, bar, d):                     # d: latest gamma inputs for sym
    if not is_rth(bar.close_ts) or d.stale(bar.close_ts) or mapping.stale:
        return publish(sym, UNKNOWN)              # data failure: switch at once, no persistence
    band = 0.0025 * bar.close                     # ±0.25% of the futures price
    if bar.close > d.zg + band and d.gex_total > 0:
        cand = POSITIVE
    elif bar.close < d.zg - band or d.gex_total < 0:
        cand = NEGATIVE                           # one negative input is enough (risk asymmetry)
    else:
        cand = NEAR_FLIP
    st = S[sym]
    st.count = st.count + 1 if cand == st.pending else 1
    st.pending = cand
    if st.count >= 2 and cand != st.state:        # two consecutive M5 closes before switching
        log_transition(sym, st.state, cand, bar, d)
        st.state = cand
    publish(sym, st.state, flags=expiry_flags(bar), levels=(d.cw, d.pw, d.pin))
# The state starts each RTH session as UNKNOWN, so the earliest valid state is at 09:40 ET.
```

**Staleness** (*Design proposal*). Vendor data is stale once it is older than twice its advertised refresh interval. DIY end-of-day data is valid for exactly one session.

**Look-ahead.** Today's end-of-day OI is published after today's close. Using it inside today's session, including in replays, is look-ahead.

**NEAR_FLIP versus UNKNOWN.** Both leave host rules unchanged, as the notes prescribe for the neutral case. They are separate states so that the forward log can show whether trades near the flip behave differently.

### What the label changes in the other families

The modulation below is the core design choice. One term is needed first. **SHADOW** means the host signal still arms and writes its full decision record, but no order is sent. Shadowed signals let forward data show whether the gate helped, with no backtest.

| GAMMA_REGIME | Balance / mean-reversion families (VP value-edge and HVN fades, failed-break reversals) | Continuation / breakout families (PA breakouts, IB extension, BOS continuation) | Late-session momentum (GEX-01) | Management overlays |
|---|---|---|---|---|
| POSITIVE | ARM | ARM, with targets capped at the nearer wall in the path | OFF; shadow record kept | 60-minute time stop on fades (Adams horizon) |
| NEGATIVE | SHADOW | ARM | ARM | Flat by 15:59 ET; no overnight carry on momentum grounds |
| NEAR_FLIP | Host rules | Host rules | OFF | None; tagged |
| UNKNOWN | Host rules | Host rules | OFF | None; tagged |

The asymmetry is deliberate (*Inference*). The notes say positive gamma calls for capping breakout targets and tightening time stops, not banning breakouts. The reason is that momentum is merely absent in positive gamma, so breakouts tend to stall rather than reverse violently. In negative gamma, momentum strengthens with exposure, and Barbon and Buraschi tie the imbalance to flash-crash frequency. Fading an extension into short-gamma amplification is the combination with fat-tailed losses, so that is the one the gate removes.

Host stops already scale with ATR, so higher volatility in negative gamma automatically shrinks position size at constant risk. A separate gamma sizing rule would adjust for the same thing twice.

**Walls** apply in any state with valid data. A new long whose entry lies within the wall zone below the mapped Call Wall is shadowed, and so is a new short within the zone above the Put Wall. The wall zone is the wall price ± 0.25 × ATR(D1), applying the series rule from 06 that tolerance scales with the ATR of the timeframe that defines the zone. A wall may also replace or cap a host target that lies within the zone width. It never supplies LOCATION and is never counted as a confluence vote.

**Vanna and charm** narratives appear only as text annotations on expiry weeks, with no rule attached.

| Flag | Definition | Effect |
|---|---|---|
| DAILY | An expiring series is listed on the underlying today; derived from the chain, not a calendar | Annotate PIN zones in the final 90 minutes; no permission change, because Cboe finds daily flow small and balanced |
| MONTHLY | Third-Friday standard expiry (AM-settled SPX/NDX monthlies alongside PM-settled dailies) | GEX-04 pin rule active in the final 90 minutes |
| QUARTERLY | Third Friday of Mar/Jun/Sep/Dec, coinciding with ES/NQ expiry | GEX-04 pin rule; whole-session annotation; roll checks |
| POST_EXPIRY | First session after any expiry | Mark expired-series levels EXPIRED; rebuild from new OI |

Holiday shifts are real. Secondary sources citing CME's roll calendar list the June 2026 equity-index expiry on Thursday, June 18, because of Juneteenth ([CME roll dates](https://www.cmegroup.com/trading/equity-index/rolldates.html)). Flags must therefore come from listed expirations.

| Parameter | Default | Basis |
|---|---|---|
| Zero-gamma buffer | ±0.25% of futures price | Notes |
| Persistence | 2 consecutive M5 closes | Notes |
| Session | RTH only; ETH publishes UNKNOWN | Notes (freeze outside RTH) + design proposal |
| Basis smoothing | 3-minute rolling median, 10-second samples | Within the notes' 1–5 minutes |
| Wall and pin zone | ±0.25 × ATR(D1) | Series tolerance rule (06) |
| Pin window | Final 90 minutes of RTH | Notes give 60–90 minutes |
| Fade time stop in POSITIVE | 60 minutes | Adams effect horizon ~1 hour |
| Late-session window | 15:30–16:00 ET | Gao; Baltussen |
| VIX calm flag | VIX close below its trailing 252-session median | Design proposal; the notes give no threshold |

Every host decision record gains these fields:

| Field | Content |
|---|---|
| gamma_state, transition_seq | Current state and the sequence number of the last transition |
| gex_total, zg_mapped, band | Total GEX, mapped zero gamma and the buffer used |
| cw_mapped, pw_mapped, pin_zones | Mapped walls and pin zones |
| expiry_flag | DAILY, MONTHLY, QUARTERLY or POST_EXPIRY |
| data_source, data_as_of | Which feed supplied the inputs, and when |
| basis_used, mapping_stale | Conversion applied and whether it was frozen |
| gate_action | ARM, SHADOW or NONE |

These fields extend the schema in [07 Automation architecture](07%20Automation%20architecture.md).

## Market internals are practitioner tools on an unverified feed

The three main internals are simple counts:

| Internal | Definition |
|---|---|
| NYSE $TICK | Stocks on an uptick minus stocks on a downtick |
| $ADD | Advancing issues minus declining issues |
| VOLD | Up-volume minus down-volume |

([LuxAlgo](https://www.luxalgo.com/library/concept/tick-index/); [NexusFi](https://nexusfi.com/a/indicators/market-internals))

The evidence is Brett Steenbarger's blog research from 2004–2008. In one study of 695 days, the 50 days when TICK fell below −1100 were followed two days later by an average SPY gain of **+0.37%**. Days when TICK never fell below −500 (N = 45) were followed by **−0.14%**. The samples are small and costs are ignored ([TraderFeed, Oct 2006](https://traderfeed.blogspot.com/2006/10/when-selling-becomes-extreme-what-does.html); [TradingMarkets](https://tradingmarkets.com/?p=653282); [TraderFeed, 2008](https://traderfeed.blogspot.com/2008/10/gauging-intraday-swings-with-nyse-tick.html)).

Conventional extremes are ±800 to ±1000. One source calls ±700 about one standard deviation and ±1000 about two ([NexusFi](https://nexusfi.com/a/strategies/trading-with-market-internals)). No peer-reviewed or post-2010 out-of-sample test was found. *Inference:* the mechanical link is real, because ES is arbitrage-tied to the S&P basket and broad TICK bursts often reflect program activity. That makes internals confirmation, not cause. Grade **C**.

Data is the practical obstacle. A NinjaTrader user on Rithmic data reported having no internals, and the suggested fix was a separate data pack ([NexusFi](https://nexusfi.com/a/data/market-internals-data)). Symbols also differ by provider: $TICK, ^TICK or $TICK.X; $ADD or $ADVD; $VOLD or $UVOL−$DVOL ([symbol list](https://ninjatrader-indicators-site.pages.dev/indicators/market-internals); [NinjaTrader forum](https://forum.ninjatrader.com/forum/ninjatrader-7/platform-technical-support/46137-vold-add-tick-trin)). Plan a second feed and a symbol config map, and verify Rithmic coverage with the FCM. For NQ, the NASDAQ equivalents ($TICKQ, $ADDQ, $VOLQ) and mega-cap leadership are the analogues. Neither has any validation in the notes.

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

Internals are off by default. If enabled, they join gamma inside one pre-declared CONTEXT classifier, as the notes suggest:

| Gamma | Internals | Combined context |
|---|---|---|
| POSITIVE | BALANCED | Range |
| NEGATIVE | One-sided | Momentum |
| Any | Conflicting | Neutral |

They are never a second vote. TICK beyond ±1000 is an annotation only.

## Equities and index options can carry futures signals only in cash hours

Signals should keep being computed on ES/NQ, with 23-hour data and the deeper book, and then be translated to another vehicle. Only RTH signals transfer cleanly. Overnight futures signals face gap risk at the cash open. Extended-hours ETF trading is thin, and SPX's Cboe Global Trading Hours session needs its current hours verified.

The notes give three options-vehicle choices:

1. **Single options** of about 0.50–0.70 delta, for simplicity.
2. **Debit vertical spreads**, which cap premium decay and IV-crush exposure.
3. **No naked short 0DTE premium** in automation.

On 0DTE, gamma and theta are extreme. Stops must therefore be expressed in underlying price, mapped from ES, with a maximum-premium-loss backstop, because option quotes widen in fast markets. More than 95% of SPX 0DTE trades are already limited-risk, and 98% of SPX 0DTE volume trades electronically ([Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact); [Cboe 2023](https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options)).

Size by delta-dollars, not contract counts:

| Quantity | Formula |
|---|---|
| Target $-delta | ES contracts × $50 × ES price (MES: × $5; NQ: × $20; MNQ: × $2) |
| Option contracts | Target $-delta ÷ (option delta × 100 × underlying price) |
| ETF shares | Target $-delta ÷ ETF price |

Illustration with hypothetical prices: one MES at 6,000 carries $30,000 of delta. A 0.60-delta option on a $600 ETF carries $36,000, so a single contract is about 1.2 MES.

| Vehicle | Settlement and style | US tax treatment, per practitioner sources (not advice) | Fit |
|---|---|---|---|
| SPX options, and XSP (listed alongside SPX in the notes) | SPX: cash-settled, European | Section 1256, 60/40 ([Terms.law](https://terms.law/Trading-Legal/guides/section-1256-contracts.html); [Morkel Financial](https://morkelfinancial.com/blog/spx-vs-spy-options-tax-treatment); [TradersPost](https://blog.traderspost.io/article/index-options-tax-treatment-the-6040-advantage)) | First choice for ES signals if liquidity suits the size |
| NDX options; Micro XND ([launch](https://finance.yahoo.com/news/nasdaq-launches-nasdaq-100-micro-120000842.html)) | NDX: cash-settled, European; AM vs PM settlement matters on monthlies | Likely 1256 by analogy; not confirmed | NQ signals |
| SPY / QQQ options | Physical, American; early assignment risk on short legs near ex-dividend | Ordinary equity-option rules ([boxspread](https://boxspread-site.pages.dev/articles/why-spx-and-not-spy)) | Liquidity fallback |
| SPY / QQQ shares | Delta-one | Ordinary | Simplest translation |

Broker 1099 reporting of 1256 treatment can be inconsistent ([Motley Fool discussion](https://discussion.fool.com/t/have-you-used-section-1256-for-index-options/124606); [OptionStrategist](https://optionstrategist.com/node/2556)); confirm with a tax professional.

Rithmic is a futures route, so this vehicle needs a second broker API. The notes name IBKR, Schwab, Tradier and TastyTrade as common candidates without evaluating them. It also needs an options quote feed for Greeks. Architecturally, the vehicle is an adapter below the order manager in [07 Automation architecture](07%20Automation%20architecture.md). The signal engine stays unchanged, and the second broker gets its own reconciliation, kill switch and risk limits.

## Daily expirations now span SPX and are spreading to NDX

Market structure as of November 2026:

1. **SPX** has had expirations every business day since May 2022. 0DTE now dominates its volume, at about 2M contracts a day by 2025 ([Quantpedia](https://quantpedia.com/do-sp500-0dtes-options-increase-market-volatility/); [Cboe 2025](https://www.cboe.com/insights/posts/0-dt-es-decoded-positioning-trends-and-market-impact)).
2. **NDX** has a mixed record. Nasdaq's product page lists Monday/Wednesday/Friday PM-settled expirations plus AM-settled third-Friday monthlies. An IBKR interview and a Nasdaq article describe daily expirations across NDX, QQQ, SPY and SPX ([Nasdaq NDX](https://www.nasdaq.com/nasdaq-100-index-options); [IBKR Campus](https://www.interactivebrokers.com/campus/?p=186384); [Nasdaq article](https://www.nasdaq.com/articles/analyzing-expiry-date-options-trading)).
3. **New NDX rules.** On **June 16, 2026** the SEC approved a Nasdaq ISE rule permitting A.M.-settled NDX options expiring Monday through Friday, excluding the third Friday (SR-ISE-2026-22). A parallel Phlx filing exists. Whether these expirations have launched could not be confirmed ([PolicyRisk](https://policyrisk.com/federal-register/2026-12402); [SEC Phlx filing](https://www.sec.gov/files/rules/sro/phlx/2026/34-105733.pdf)).
4. **Any-weekday expirations** are proposed for more products, including single stocks ([PolicyRisk](https://policyrisk.com/federal-register/2026-09122); [Tiger](https://www.itiger.com/news/1126550493)).
5. **Cboe's 1-minute Open-Close** data product had its fees approved in February 2026.

Two inferences follow. Pin effects that once happened monthly now happen every session in some form, which is why EXPIRY is derived from listed chains, not a fixed calendar. And A.M.-settled NDX dailies would settle on the opening print, concentrating that series' hedge unwind at the open rather than the close. NDX-derived gamma becomes more relevant to NQ than QQQ-derived gamma, and any model built on Monday/Wednesday/Friday assumptions needs updating.

## Six GEX proposals use gamma only to gate, size or stop other families' trades

All six share the same rules:

| Rule | What it requires |
|---|---|
| Session | ES/NQ only, RTH only |
| Gate is veto-only | Gamma can shadow a host signal, never create one |
| Shadow logging | Every shadowed signal keeps a full decision record |
| One condition per role | Gamma sits in CONTEXT as a gate and is never counted as a LOCATION vote |
| Risk | Inherited from [07 Automation architecture](07%20Automation%20architecture.md): server-side stops, daily limits, news blackouts, one position per instrument, 1 MES/MNQ during validation |
| Versioning | Any parameter change increments strategy_version and restarts the sample |

Host families are referenced generally, without specific IDs: [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md), [09 Proposals volume profile](09%20Proposals%20volume%20profile.md), [11 Proposals confluence](11%20Proposals%20confluence.md).

### GEX-01 Gamma-gated late-session intraday momentum

| At a glance | |
|---|---|
| Style | Time-window continuation into the cash close |
| Hold | ≤ 29 minutes (15:30–15:59 ET) |
| Instruments | ES/MES primary; NQ/MNQ secondary (gamma conditioning unverified for NQ) |
| Evidence grade | **A** for the effect and its gamma conditioning; **B** for the DIY or vendor proxy of gamma |
| Complexity | Low: one decision per session |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | GAMMA_REGIME = NEGATIVE, persisted, as of the 15:30 M5 close | M5 regime ribbon | Same (clock time) |
| LOCATION | None (a time-window effect); the wall rule still applies | — | — |
| SETUP | Sign of ROD = ln(ES at 15:30 / PDC) | M30 bar ending 15:30; PDC from D1 | Same: the published effect is defined on clock time |
| TRIGGER | Close of the 15:00–15:30 ET M30 bar | M30 | Same |
| MANAGEMENT | Stop 1.0 × ATR(M30); flat 15:59:00 ET | M30 ATR; M1 monitor | VB-B for monitoring only |

**Context filter, location and setup.** The trade runs only in NEGATIVE. In POSITIVE, the signal is recorded as SHADOW, which builds the published contrast forward: momentum should be weak on those days. NEAR_FLIP and UNKNOWN produce no trade.

There is no location. PDC is the front contract's last trade at or before 16:00 ET in the prior RTH session; after a roll, use the new contract's own prior close. The setup uses Baltussen's rest-of-day return rather than Gao's first half-hour, because that is the version tested on futures with gamma conditioning. Gao's first-half-hour sign is logged as a diagnostic.

**Trigger and entry order.** At 15:30:00 ET, send a marketable limit in the ROD direction, at the best offer plus one tick for a long, cancelled if unfilled after 60 seconds (*Design proposal*).

**Risk and management.** A server-side stop goes at entry ∓ 1.0 × ATR(M30). There is no target, because the effect runs to the close. Exit at market at 15:59:00 ET, a design proposal that keeps the exit out of the settlement minute, where CME's RA2608-5 addresses closing-period conduct ([CME RA2608-5](https://www.cmegroup.com/content/dam/cmegroup/notices/market-regulation/2026/07/cme-group-ra2608-5.pdf)). Never carry the trade: momentum reverts over the following days and at the next open.

**Filters.** Skip early-close sessions, any tier-1 release inside 15:30–16:00, and sessions where the instrument already has an open position. News earlier in the day is not a filter, because Gao finds the effect stronger on macro-news days.

```python
# GEX-01 state machine: IDLE -> EVALUATE -> {SHADOWED | SKIPPED | ORDER_PENDING} -> IN_POSITION -> CLOSED
on BarClosed("M30", sym, bar) where bar.close_ts == "15:30 ET":
    if early_close() or blackout(15.5, 16.0) or has_position(sym):
        return record(SKIPPED)
    g = gamma_regime(sym, as_of=bar.close_ts)
    rod = ln(bar.close / PDC(sym))
    side = sign(rod)
    if side == 0:
        return record(SKIPPED)
    if g.state != NEGATIVE or wall_blocks(side, bar.close, g):
        return record(SHADOWED, g, rod)
    stop = bar.close - side * 1.0 * ATR("M30", sym)
    send_marketable_limit(sym, side, qty=size_for(stop), ttl_s=60, tag=setup_id())
    schedule("15:59:00 ET", flatten, setup_id())
```

| Parameter | Default |
|---|---|
| Window | 15:30–16:00 ET |
| Setup | Sign of ROD |
| Regime | NEGATIVE, 2 × M5 persistence |
| Stop | 1.0 × ATR(M30) |
| Entry TTL | 60 s |
| Exit | 15:59:00 ET |
| Size | 1 MES |

**Visual review checklist.**

1. Was the regime NEGATIVE on data dated before 15:30?
2. Was PDC taken from the right contract?
3. What were MFE and MAE over the last 30 minutes?
4. Did the regime flip between 15:30 and 16:00, as in Cboe's August 2023 example?
5. How do traded NEGATIVE days compare with shadowed POSITIVE days?

**Failure modes.**

1. **Proxy mismatch:** SPX-only GEX omits leveraged-ETF flow.
2. **Inverted sign** from the naive convention.
3. **Regime change after the samples:** the post-2022 daily-0DTE regime may differ from the study periods.
4. **A small R²** means many losing days.
5. **ES and NQ are not two samples:** they are highly correlated, so their results count as roughly one stream.

At one trade per negative-gamma day, the 70–150 trades that 07 says are needed to distinguish +0.2R from zero will take a year or more.

**Relations.** Implements the intraday-momentum concept in 02. GEX-05 enforces the no-carry rule. GEX-03 positions take precedence under the one-position rule. GEX-06 can translate it, but not with 0DTE single options.

### GEX-02 Positive-gamma balance fade at prior value edges

| At a glance | |
|---|---|
| Style | Fade of a failed probe beyond the prior RTH value area |
| Hold | 5–60 minutes |
| Instruments | ES/MES, NQ/MNQ |
| Evidence grade | **B** context (positive-gamma damping); **C** setup (value-edge fade); **C** walls as targets |
| Complexity | Medium |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | Host balance read: RTH opens inside prior PROFILE(RTH) value; gated by GAMMA_REGIME = POSITIVE | D1 prior profile; M5 ribbon | Same (clock time) |
| LOCATION | Prior-session VAH (short) or VAL (long) | Clock-time level | Same |
| SETUP | Probe ≥ 1 tick beyond the edge | M5 | VB-B |
| TRIGGER | First close back inside value within 3 bars of the probe extreme | M5 close | VB-B close |
| MANAGEMENT | Stop beyond probe extreme + 0.25 × ATR of the trigger layer; T1 prior POC; T2 opposite VA edge, capped at a mapped wall in the path; 60-minute time stop | ATR(M5) | ATR(VB-B) |

**Context filter.** In POSITIVE the trade is taken with the wall cap and the gamma time stop. In NEGATIVE it is shadowed. In NEAR_FLIP or UNKNOWN, the plain host VP-family rule applies, without the gamma overlays and tagged accordingly.

**Location and setup.** Value areas use the single committed algorithm in 03, and rotational sessions there favor fading value edges.

**Entry and management.** Enter with a stop order one tick beyond the trigger bar, below its low for a short, valid for two bars. T1 is the prior POC, which 03 recommends as the first objective. A regime change after entry does not force an exit; the host stop governs, and the change is logged.

**Filters.** No entries after 15:00 ET, to leave the late-session window to GEX-01. On MONTHLY and QUARTERLY days, GEX-04 adds its pin rules.

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

**Visual review checklist.**

1. Did the open sit inside prior value under the committed value-area method?
2. Was the regime POSITIVE as of the trigger?
3. Was the mapped wall within its band, checked against the basis?
4. How often was T1 reached?
5. Did shadowed NEGATIVE-day fades fail more often?

**Failure modes.**

1. **A trend day emerges** after a positive-gamma open.
2. **The value-area algorithm differs** from the one charted.
3. **Basis error** displaces the walls.
4. **The damping is brief:** Adams' effect lasts about an hour.

**Relations.** Built on the VP-family value-edge fades (03, 09). Uses GEX-04 on expiry days. Feeds the CX router.

### GEX-03 Negative-gamma continuation filter for IB extensions

| At a glance | |
|---|---|
| Style | Initial-balance extension continuation on negative-gamma days |
| Hold | 30 minutes to session end (flat 15:59 ET) |
| Instruments | ES/MES, NQ/MNQ |
| Evidence grade | **B** context (negative-gamma momentum is documented as end-of-day and last-30-minute momentum, not for mid-session breakouts); **C** setup |
| Complexity | Medium |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | GAMMA_REGIME = NEGATIVE, persisted; optionally the combined gamma + internals classifier, if pre-declared | M5 ribbon; M15 internals | Same (clock time) |
| LOCATION | IBH (long) or IBL (short) | Clock-time levels | Same |
| SETUP | IB complete at 10:30 ET with width < 0.6 × 20-session median IB width | M30 | M30 (clock time) |
| TRIGGER | Close ≥ 1 tick beyond IBH/IBL between 10:30 and 14:30 ET | M5 close | VB-B close |
| MANAGEMENT | Stop at IB midpoint; T1/T2 at the 1.5× and 2× IB-width extension lines (03); flat 15:59 ET | M30 | M30 |

**Context filter.** In POSITIVE, the host IB-extension rule runs with targets capped at the nearer wall, per the matrix. In NEGATIVE, this proposal applies uncapped targets and the end-of-session hold.

**Entry and stop.** A buy stop one tick above the trigger bar (sell stop for shorts), valid for two bars. The IB-midpoint stop is a design proposal: returning to the middle of a narrow IB negates the extension.

**Filters.** One trade per direction per session. The wall no-entry rule applies. On MONTHLY and QUARTERLY days, GEX-04 blocks entries in the final 90 minutes near pin zones. The 0.6 × median and the extension targets come from the IB-extension discussion in 03, where the setup grades C because some range extension happens on most sessions.

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

**Visual review checklist.**

1. Were the IB width and the 20-session median correct?
2. Was the regime NEGATIVE as of the break?
3. Did the move stall at a mapped wall?
4. What was the MFE to the 1.5× extension?
5. How do NEGATIVE-day breaks compare with capped POSITIVE-day breaks?

**Failure modes.**

1. **Stale positioning:** EOD OI says negative while intraday customer flow has turned it positive.
2. **News-driven breaks** of the IB.
3. **Small samples:** narrow-IB days are scarce.

**Relations.** Built on the VP-family IB extension (03, 09) and the PA-family breakouts (08). It shares the one-position rule with GEX-01; an open GEX-03 trade in the ROD direction makes GEX-01 redundant.

### GEX-04 Expiry-day pin awareness and no-new-entry rule

| At a glance | |
|---|---|
| Style | Permission and target overlay on all families |
| Hold | Not applicable |
| Instruments | ES/NQ |
| Evidence grade | **B** (NPP is A for single stocks; the index analogue and roll-into-0DTE effect are B) |
| Complexity | Low to medium |

| Role | Condition | Time-bar stack | Volume-bar stack |
|---|---|---|---|
| CONTEXT | EXPIRY ∈ {MONTHLY, QUARTERLY} and time within the final 90 minutes of RTH | Clock | Clock |
| LOCATION | PIN zones: the top-two-OI strikes of the expiring PM-settled series, within 1 × ATR(D1) of the RTH open, mapped ± 0.25 × ATR(D1) | M5 levels | Same levels on VB-B |
| SETUP and TRIGGER | Inherited from the host | — | — |
| MANAGEMENT | Shadow new continuation entries inside a PIN zone or whose T1 lies beyond one; fades toward a pin may use the strike as target confluence; mark levels EXPIRED at 16:00 ET | — | — |

The 1 × ATR(D1) proximity filter is a design proposal: a strike far from price cannot pin. On DAILY flags, pin zones are drawn without changing permissions. Expiring AM-settled monthly OI is gone after the Friday opening print, so it is annotated from the Thursday close to the Friday open only (*Inference* from the notes' AM/PM distinction).

```python
def pin_gate(intent, bar, g):                    # called by the risk manager before any new entry
    if g.expiry not in (MONTHLY, QUARTERLY) or minutes_to_close(bar) > 90:
        return ALLOW
    zones = g.pin_zones
    if intent.kind == CONTINUATION and (inside(intent.entry, zones) or crosses(intent.entry, intent.t1, zones)):
        return SHADOW
    if intent.kind == FADE and toward(intent, zones):
        intent.t1 = nearest_zone_center(intent, zones)    # target confluence only
    return ALLOW
```

**Visual review checklist.**

1. Were the PIN strikes taken from the correct expiring series?
2. Did the mapping hold within its band?
3. Where did the close land relative to the zones?
4. Were shadowed breakouts actually stopped by the pin?

**Failure modes.**

1. **OI is a day old** and misses same-day flow.
2. **AM/PM confusion** in which series pins at the close.
3. **Unconfirmed NDX dailies.**
4. **The pin does not hold:** NPP's clustering is not universal.

**Relations.** Applies to every family. Supplies targets to GEX-02. Restricts GEX-03.

### GEX-05 Overnight carry guard in calm regimes

| At a glance | |
|---|---|
| Style | Management overlay for positions held through the cash close |
| Hold | Not applicable |
| Instruments | ES/NQ |
| Evidence grade | **A/B** for no-carry of late-day momentum; **B** for gap sizing (one unrefereed out-of-sample study) |
| Complexity | Low |

| Role | Condition |
|---|---|
| CONTEXT | VIX_REGIME (CALM or STRESSED) and GAMMA_REGIME at the 15:55 M5 close |
| LOCATION, SETUP, TRIGGER | Inherited from the host |
| MANAGEMENT | R1, R2 and R3 below |

The overlay has three rules:

1. **R1, active.** GEX-01 trades, and any host position whose stated rationale is negative-gamma late-day momentum, must be flat by 15:59 ET.
2. **R2, log-only by default.** For swing variants of host families that hold across 16:00 ET, record VIX_REGIME, GAMMA_REGIME and the realized overnight range to the next RTH open.
3. **R3, opt-in.** In CALM regimes, carry half size when gamma has the sign that Maurer associates with larger gaps.

R3 stays off for a specific reason. The notes record that gamma's forecasting power for gap size exists only in calm regimes, at the 99th percentile. They do not record which sign predicts larger gaps. The mechanism points to negative gamma, but that is an inference, and the rule switches on only after the user confirms the sign in the paper. The half-size factor is a design proposal.

Futures nuance (*Inference*): ES trades through the night, so a Globex stop limits most of the "gap" a cash-index study measures. The residual risks are slippage in thin overnight books, the 17:00–18:00 ET maintenance break and weekends. Those are what R3 would size for.

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

**Visual review checklist.**

1. Did every R1 position exit before 16:00?
2. Does the overnight range on CALM plus negative-gamma nights look wider in the log?

**Failure modes.**

1. **The VIX feed is missing.**
2. **The sign is wrong** if R3 is enabled early.
3. **Weekend gaps dominate** the realized risk.

**Relations.** Pairs with GEX-01. Protects the swing variants in 08, 09 and 11.

### GEX-06 Futures signal to SPX/SPY option or share vehicle

| At a glance | |
|---|---|
| Style | Execution adapter |
| Hold | Inherited from the host |
| Instruments | SPX/XSP/SPY options or SPY shares for ES signals; NDX/XND/QQQ for NQ signals |
| Evidence grade | Inherits the host's grade; vehicle mechanics are exchange and practitioner facts |
| Complexity | High: second broker, options quotes, Greeks |

| Role | Condition |
|---|---|
| CONTEXT, LOCATION, SETUP, TRIGGER | Inherited from the ES/NQ host signal, which stays on the futures chart (both stacks unchanged) |
| Eligibility | Signal fires in RTH between 09:45 and 15:00 ET (design proposal: avoids opening spreads and late 0DTE gamma) |
| MANAGEMENT | Host stop and targets mapped to the underlying through the live basis or ratio; option exit when the mapped level trades; premium backstop |

**Entry order.** The default is a single option of 0.60 delta, the middle of the notes' 0.50–0.70 range, with 1–7 days to expiry. The alternative is a debit vertical: long a 0.60 delta, short at the strike nearest the mapped T1, so the spread reaches full value at the host's target. 0DTE is allowed only as a debit vertical, and naked short premium is never allowed. The expiry window and the short-strike-at-T1 rule are design proposals. The order is a limit at mid, stepped one tick toward the far side every 5 seconds for at most 3 steps, then cancelled (*Design proposal*).

**Risk.** Contracts follow the delta-dollar formula. Exit on the mapped underlying stop, with a backstop exit if the option's mark falls to 50% of the premium paid (*Design proposal*; the notes call for a backstop but give no number). Close any short SPY/QQQ legs before ex-dividend dates and before expiry.

**Filters.** Prefer the cash-settled European index products. Use SPY/QQQ only when index-option liquidity is inadequate at the order size. Skip the trade if the quoted spread exceeds the host's planned profit to T1 divided by 10 (*Design proposal*).

```python
class OptionVehicle(VehicleAdapter):              # second broker; the futures engine is unchanged
    def open(self, intent):                       # intent from an ES/NQ host, in futures prices
        if not ("09:45" <= intent.ts <= "15:00 ET"):
            return reject("window")
        u_stop, u_t1 = map_to_underlying(intent.stop), map_to_underlying(intent.t1)
        leg = pick_by_delta(self.chain, side=intent.side, delta=0.60, dte=(1, 7))
        qty = round(target_delta_dollars(intent) / (abs(leg.delta) * 100 * self.underlying.last))
        if qty < 1 or spread(leg) > (abs(u_t1 - self.underlying.last) * abs(leg.delta)) / 10:
            return reject("size_or_spread")
        self.order = place_stepped_limit(leg, qty, start="mid", step_ticks=1, every_s=5, max_steps=3)
        self.watch(u_stop, u_t1, premium_floor=0.5 * leg.mid)
```

**Visual review checklist.**

1. Did the mapped underlying levels match the futures levels at signal time?
2. What was the fill relative to mid?
3. Did the option exit when the mapped stop traded?
4. How large was the tracking error between option P&L and the futures-equivalent P&L?

**Failure modes.**

1. **Spreads blow out** in fast markets.
2. **SPX print lag** distorts the mapping.
3. **0DTE gamma** swamps the position.
4. **Early assignment** on SPY short legs.
5. **Two brokers** mean two kill switches.
6. **Options data licensing** must be in place.

**Relations.** A vehicle layer under any family. It inherits GEX-04 and GEX-05.

## How to visually verify gamma levels and the regime filter

Gamma levels are the least directly observable inputs in the series. Verify them before any setup review means anything.

| Check | How | Pass condition (Design proposal) | If it fails, suspect |
|---|---|---|---|
| DIY vs reference sign | Compare GEX_total sign each morning with a vendor or [FlashAlpha](https://flashalpha.com/tools/gex-calculator) for 20 sessions | Same sign on clear days; disagreements cluster near zero | Sign convention, missing expiries, IV inputs |
| Zero gamma | Plot DIY and vendor ZG on one SPX chart | Within the ±0.25% band on most days | Grid range, multiple crossings, stale OI |
| Basis | Rolling ES − SPX against CME fair value with current inputs | Close agreement, decaying toward zero through the quarter | SPX print lag, wrong contract |
| Mapped levels | Engine ES levels against the vendor's own ES-converted levels | Inside the tolerance band | Spread vs ratio, lock time |
| Regime ribbon | Color M5 bars by state, with data as-of stamps | ≤ 2 transitions on most sessions; more means log it, don't retune | Noisy intraday refresh |
| As-of correctness | Replay to each signal | Only prior-day OI and earlier snapshots visible | Look-ahead |
| Expiry flags | Against listed chains | Exact | Holidays, NDX daily status |
| Roll | Basis jump on the switch | One logged jump | Mixed contracts |
| Shadow tagging | Every shadowed signal has a record | 100% | Gate applied before logging |

The working routine is a daily overlay (*Design proposal*):

1. The engine exports ZG, wall and pin bands, plus the regime ribbon, to the charting platform.
2. Before the open, the user checks that the bands sit where the reference source puts them.
3. After the close, the user reviews each traded and shadowed signal against the as-of chart.

The two failure patterns to watch are frequent regime flips and walls that consistently miss the reference by more than the band.

## Recommended starting point

**Steps 1–2: build and observe.**

1. **Plumbing, weeks 1–2.** Build the mapping and a DIY end-of-day GEX from Databento OPRA EOD statistics (OI) plus quotes for implied volatility. Cross-check against a free calculator. Nothing trades.
2. **Signal-only, at least 4–6 weeks or 30–50 signals per host type.** This is the minimum in [07 Automation architecture](07%20Automation%20architecture.md). GAMMA_REGIME runs in signal-only mode. It is written into every PA-, VP- and CX-family decision record, and GEX-01 to GEX-04 produce shadow records. Internals stay off.

**Steps 3–5: trade in stages.**

3. **Simulation.** Simulate GEX-01 at 1 MES and turn on GEX-04, which only ever removes trades.
4. **Intraday data, only if justified.** Consider intraday vendor levels or Cboe Open-Close data only if the end-of-day regime proves stable and useful in the log, and only after clearing non-display licensing in writing.
5. **Equities and options last.** Add the vehicle only after the second-broker adapter passes the same plumbing and kill-switch tests as the futures path.

This order front-loads the cheapest and best-supported pieces. It also delays the two hardest dependencies, data licensing and a second broker, until there is forward evidence that gamma context earns its cost.

## Conclusion

The evidence ranks gamma outputs in the opposite order to how they are marketed. The coarsest output, the sign of aggregate exposure, has the best support, through Baltussen's 60-market study and Barbon's next-open reversal. The most precise outputs, wall prices and the Volatility Trigger, have none. A non-backtesting trader can therefore benefit from gamma without trusting any vendor level, by using it as a one-bit switch on an effect that was already in the strategy set.

The shadow mechanism is what makes this honest. Every vetoed signal is still recorded, so forward data answers the question the literature cannot answer for 2026. Daily 0DTEs have made positive market-maker gamma routine on expiry days, Cboe's side-aware data shows balanced customer flow, and so negative-gamma days may have become rarer and weaker than in any published sample. A year of GEX-01 and GEX-02 logs comparing traded and shadowed outcomes shows whether gamma still separates the days. That is the evidence that should decide whether intraday vendor data, licensing and a second broker are worth paying for.
