# Replayable engines make unattended futures triggers safe

*Document 07 of the multi-timeframe strategy research set ([00 Index and reading guide](00%20Index%20and%20reading%20guide.md)). Section 2 defines the shared building blocks that [08 Proposals price action and swing](08%20Proposals%20price%20action%20and%20swing.md), [09 Proposals volume profile](09%20Proposals%20volume%20profile.md), [10 Proposals Fibonacci](10%20Proposals%20Fibonacci.md) and [11 Proposals confluence](11%20Proposals%20confluence.md) reference by name. The optional options-gamma context feed is covered in [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md). Repository paths are relative to this file. Design proposals and inferences are labelled as such, and every numeric default is a pre-committed starting value drawn from the research notes, not an optimized one.*

The safe way to automate these strategies is to build one deterministic, single-writer engine whose every decision is a pure function of an append-only event log, so each trigger can be replayed tick for tick and redrawn "as of" the moment it fired. For a trader who validates visually and forward instead of backtesting, that replayability is the substitute for a backtest: it is the only way to prove the chart under review is the chart the engine actually saw. The repo's Rithmic R|Protocol definitions already expose nearly every primitive the strategy family needs, including aggressor-tagged trades (`LastTrade` 150), server-built time bars up to weekly (200/202), volume bars (204/206), minute-resolution volume-at-price history for seeding weekly and monthly profiles (208/209), server-side brackets (330), cancel-all (346), exit-position (3504) and live auto-liquidation thresholds (`AccountRmsUpdates` 356). What is missing is a host fit for unattended orders. The current harness runs in a browser tab with a hardcoded 30-second heartbeat, no reconnect logic and logging through file downloads. The recommended production target is therefore a supervised headless service on a private Chicago-area server, connected through R|Protocol to a dedicated Rithmic account that is never traded by hand. That host needs time sync, out-of-band alerting, secrets kept outside the repo and logs, and off-server backups of the event log. Tradovate stays an optional secondary path, and production R|Protocol access probably requires a conformance or approval step that must be confirmed with Rithmic. Safety then comes from defense in depth rather than any single control: every position is born with a broker-held stop, engine limits sit strictly inside broker auto-liquidation, which sits inside prop-firm rules, and a stale feed, a reject storm or a lost order channel halts new entries automatically. Validation runs in frozen-rule stages (signal-only, simulated execution, replay rehearsal, one micro contract) judged on pre-declared expectancy, MAE/MFE and slippage. Roughly 70–150 trades are needed to show a modest +0.2R edge, so the honest early goal is to catch broken rules and broken plumbing, not to prove profitability. Two questions remain unverified and should gate any unattended position held across a session break: whether Rithmic and Tradovate stop legs rest at CME or on broker servers, and whether resting brackets survive the daily 16:00–17:00 CT maintenance halt.

## 1. One append-only event log makes every trigger replayable

The core design decision (a design proposal synthesized from the automation notes) is that ticks, bar closes, order and fill notifications, risk updates and timer firings all enter one durable, sequence-numbered log *before* anything acts on them, and a single-threaded decision core consumes that log in order. Everything downstream of raw trades is then reproducible: bars, swings, profiles, Fibonacci grids, setup states and intended orders. Replaying the log through the same code version must regenerate identical decisions. This is a stronger property than "the strategy is rule-based", and it is the property visual review depends on. Platform documentation shows why it cannot be taken for granted. NinjaTrader warns that its real-time multi-series event order "is NOT guaranteed to be the same sequence" as on historical data, and that historical bars process only on bar close unless Tick Replay is used ([NinjaTrader 8 Help: Multi-Time Frame & Instruments](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). TradingView's `request.security()` "can return unconfirmed values on realtime bars" that later repaint ([TradingView Pine docs: Repainting](https://br.tradingview.com/pine-script-docs/en/v5/concepts/Repainting.html)). A hand-built engine gets this parity only if it is designed in from the start.

```
 ┌──────────────────── I/O ADAPTERS (the only code with sockets) ─────────────────────┐
 │ Rithmic (primary): TICKER_PLANT  HISTORY_PLANT  ORDER_PLANT  PNL_PLANT             │
 │ Tradovate (optional secondary path): md WebSocket, trading WebSocket               │
 │ External context feeds (optional): e.g. daily/intraday GEX levels (see doc 12)     │
 └───────────────┬─────────────────────────────────────────────────────▲──────────────┘
                 │ normalize → {seq, recv_ts, exch_ts, source, type, payload}   │ broker msgs
                 ▼                                                             │
 ┌───────────────────────────────────────────┐                                 │
 │ EVENT LOG  append-only, flushed before use │──► replay / audit / journal    │
 └───────────────┬───────────────────────────┘                                 │
 ════════════════╪═══════ single-threaded decision core (deterministic) ═══════╪═══════
                 ▼                                                             │
   BAR BUILDERS   time: W1 D1 H4 H1 M30 M15 M5 M1   volume: VB-A VB-B VB-C      │
                 ▼  BarClosed (once) / BarUpdated (developing, display only)   │
   FEATURE LAYERS ATR(L) · SWING(L) · STRUCTURE(L) · LEVELS · PROFILE(P) · FIB  │
                  (+ optional CONTEXT FEED mapper: index levels → ES/NQ prices) │
                 ▼                                                             │
   LEVELS REGISTRY  level_id · price/zone · dimension · provenance · known_at   │
                 ▼                                                             │
   SETUP STATE MACHINES  one per candidate, keyed by setup_id                  │
                 ▼  intents                                                    │
   RISK MANAGER  pre-trade veto + continuous limits ──► KILL SWITCH            │
                 ▼  approved intents                                           │
   ORDER MANAGER  sole talker to the order channel; tracks broker order state ─┘
                 ▼
   JOURNAL / DECISION LOG ──(async)──► pfmon journal (React + AWS)
```

| Component | Consumes | Emits | Invariant it must never break |
|---|---|---|---|
| Adapters | Network frames | Normalized events | Only component with sockets. Drops `isSnapshot=true` trades and quotes so database snapshots are never counted as prints |
| External context feeds (optional) | Vendor files or APIs (e.g., GEX levels) | `ContextUpdate` events with publish time and `known_at` | Logged like market data; never fetched inside the decision core; a missing feed degrades to "no context", never blocks exits |
| Event log | Normalized events | Durable sequence-numbered records | Written and flushed before any consumer sees the event |
| Bar builders | Trades, calendar timer events | `BarClosed` exactly once per bar; `BarUpdated` for the developing bar | Identical code for seeding, live and replay |
| Feature layers | Closed bars of their own layer | Versioned outputs stamped `known_at` | Never publish a value before its confirmation time |
| LEVELS registry | Feature outputs | Level records with deterministic `level_id`, dimension tag, status | IDs are pure functions of provenance |
| Setup state machines | As-of feature snapshot, fills, timers | Intents (`ENTER`, `MODIFY`, `CANCEL`, `EXIT`) | Act on transitions, never on "condition still true" |
| Risk manager | Intents, P&L, RMS/auto-liq updates | Approve or veto; kill-switch trips | Nothing reaches the broker without passing it |
| Order manager | Approved intents | Broker messages; broker-side order state | Only component allowed to talk to the order plant |
| Journal | Every transition, order, fill | Decision records; journal rows for pfmon | Append-only, keyed by `setup_id` |

The adapters carry two protocol details that matter for correctness. Rithmic's guide says `LastTrade` arrives either live "or as a snapshot from the database", with `is_snapshot` "present only if the message received is from database", so snapshot prints must be flagged and excluded from bars and profiles. Multi-message responses must be read by checking for `rq_hndlr_rp_code` (more messages coming) before `rp_code` (final), which is essential for paginated history ([Rithmic Reference Guide](../../Rithmic/Reference_Guide.pdf), §2.1.b, §2.2.c, §3). On the Tradovate path, tick packets "can arrive out of order", and "it is the client's responsibility to store and sort" them, so the adapter sorts by tick `id` and deduplicates history against real time ([Tradovate/openapi.json](../../Tradovate/openapi.json), Using Tick Charts). One inference about the pfmon integration follows from the invariants. Journal rows should be pushed to the React + AWS journal asynchronously from the local log, so a web-backend outage never blocks or delays trading decisions.

### External context feeds plug in as logged, as-of events

The project is futures-first. Equities and equity options may later serve as research inputs or an optional execution vehicle, and the user may add S&P and Nasdaq options dealer-gamma (GEX) levels as an intraday CONTEXT feed. That feed, and whether it carries any evidential weight, is the subject of [12 Options gamma and equity context](12%20Options%20gamma%20and%20equity%20context.md). The architecture only needs to guarantee that such a feed cannot break determinism or look-ahead safety (design proposal). An adapter outside the decision core polls or receives the vendor data and writes each update into the event log as a `ContextUpdate`, with the vendor's publish time, the receive time and a `known_at` equal to the later of the two. The decision core never calls out to the vendor, so replay reproduces the feed exactly as it arrived. Levels quoted on the cash index (SPX, NDX) are mapped to futures prices with the basis observed at `known_at`, for example `es_price = spx_level + (ES_last − SPX_last)` sampled when the update was logged. That basis is logged with the mapped level and never recomputed later. Mapped levels enter the LEVELS registry with their own dimension tag (`EXTERNAL`) and a staleness expiry, so a confluence rule can never count them as GEOMETRY or PROFILE. A late or missing feed degrades every dependent setup to "no context" (stand aside) and never blocks management of open positions. An equity or options execution vehicle, if one is added, would be a separate order adapter behind the same risk manager. It is out of scope here.

```python
def on_context_update(e):                            # e logged by the adapter: vendor_ts, recv_ts, payload
    known_at = max(e.vendor_ts, e.recv_ts)
    basis = last_trade("ES") - last_index("SPX", at=known_at)   # sampled once, logged, never recomputed
    for lvl in e.payload.levels:                     # e.g. {"kind": "GEX_FLIP", "index_price": 6000.0}
        registry.upsert(kind=lvl.kind, layer="EXTERNAL", dimension="EXTERNAL",
                        price=round_to_tick(lvl.index_price + basis), known_at=known_at,
                        provenance={"feed": e.source, "basis": basis, "vendor_ts": e.vendor_ts},
                        invalidation_rule=f"age>{CONTEXT_TTL}")
```

### Setup state machines act on transitions, never on states

Each candidate setup is one state-machine instance. Transitions fire only on explicit logged events (bar close, fill notification, timer, risk veto), and every transition is persisted with the `seq` of the event that caused it. The automation notes propose the state set below. Terminal states are never re-entered, which stops an engine from re-sending an order "because the condition is still true".

```
            arm: CONTEXT+LOCATION+SETUP true at a layer's BarClosed
  IDLE ─────────────────────────────────────────────► ARMED
                                                       │  │ expiry timer / invalidation event
                     TRIGGER true + risk approved      │  └──────────► EXPIRED | INVALIDATED
                                                       ▼
                                                 ORDER_PENDING ──reject──► REJECTED
                                                       │  └──cancel / entry expiry──► CANCELLED
                                        fill (full or partial)
                                                       ▼
                                                 IN_POSITION ──bracket legs confirmed working──► MANAGED
                                                                                                   │
                                                              exit fill (stop / target / time / kill)
                                                                                                   ▼
                                                                                                CLOSED
  any state ──inconsistency with broker or local invariant──► ERROR   (never auto-resent; human review)
```

### Setup IDs double as order tags, which makes retries harmless

Idempotency comes from deriving `setup_id = hash(strategy_version, setup_type, level_id, arming_bar_id)` and sending it (or a short form) as Rithmic `userTag`, Tradovate `clOrdId`, or the Tradovate order-strategy `uuid`. Both APIs echo these back on notifications: `RequestNewOrder` and `RequestBracketOrder` carry `userTag` and `windowName`, `RithmicOrderNotification` (351) returns `userTag` and `basketId`, and Tradovate's `placeorder`/`placeoso`/`placeoco` accept `clOrdId` ([Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json)). Before any send, the order manager checks both its persisted state and the broker's working orders for that tag. A reconnect re-snapshot or a duplicated notification then becomes a no-op. The design only works if `level_id` is itself deterministic, a function of level kind, layer and provenance (anchor pivot IDs, profile period) rather than a counter. Otherwise the same setup rebuilt after a restart gets a new ID and looks new. Maximum tag lengths are not stated in the repo specs, so a short hash should be used and its length verified on paper accounts (inference).

### Restart means reconcile with the broker first and re-arm last

Recovery after a crash, deploy or reconnect follows one fixed order: load local state, query the broker, reconcile, rebuild features, and only then allow new arming. Rithmic provides the queries `RequestShowOrders` (320), `RequestShowBrackets` (338), `RequestShowBracketStops` (340), `RequestPnLPositionSnapshot` (402), `RequestReplayExecutions` (3506) and the order-history family (318–327). Tradovate's `user/syncrequest` "returns all data associated with the user" and then streams `props` events with `entityType`/`eventType` ([Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json)).

```python
def on_start():
    local  = load_persisted_setups()                 # last transition per setup_id
    broker = query_broker()                          # Rithmic 320, 338, 340, 402, 3506 | Tradovate user/syncrequest
    for tag, b in broker.orders_and_positions():
        s = local.get(tag)
        if s and consistent(s, b): resume_management(s, b)
        elif s:                    transition(s, ERROR); alert("state mismatch", s, b)   # never re-send
        else:                      handle_orphan(b, policy=ORPHAN_POLICY)                # chosen in advance
    for s in local.open_without_broker_counterpart():
        transition(s, ERROR); alert("local position/order unknown to broker", s)
    rebuild_features_from_history()                  # Section 3 seeding + own tick archive
    for s in local.armed():
        if s.arming_bar_closed_during_downtime and not s.rules.allow_late_arming:
            transition(s, EXPIRED, reason="DOWNTIME")
    enable_arming()                                  # only now
```

The pre-committed orphan policy for unattended mode is *flatten and alert*. That is only safe if the automated strategies trade a dedicated account that the user never trades by hand, so an "orphan" can only be an engine defect. This matches the user's plan for a separate, dedicated Rithmic account. The notes allow a "protect-only" alternative, but it needs a stop price the engine does not know for a position it did not open. A dedicated login is also forced on the Tradovate path by its connection limit (Section 3).

### Sessions, holidays and rolls belong in a dated calendar, not in code

| Item | Rule used by the engine | Source / status |
|---|---|---|
| Globex hours (ES) | Sunday–Friday 17:00–16:00 CT, daily maintenance 16:00–17:00 CT | [CME E-mini S&P 500 specs](https://cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html) |
| Trade date / week | Trade date starts 17:00 CT on the prior calendar day; week starts Sunday 17:00 CT | Inference from CME hours |
| ETH vs RTH | ETH = full Globex session. RTH (equity index) = 08:30–15:00 CT, matching the 09:30–16:00 ET cash session. CL's RTH convention must be confirmed before use | Notes inference; CL unverified |
| ON window | 17:00 CT to 08:30 CT | Notes inference |
| No-entry windows | No new entries 16:00–17:00 CT or in the last minutes before it | Notes inference |
| Halts | `MarketMode` (157) halt or `tradeDate` change = hard "no new orders" | [Rithmic/protos.json](../../Rithmic/protos.json) |
| Holidays (upcoming) | Thu Nov 26, 2026: day session closed, Globex reopens 17:00 CT for Friday. Fri Nov 27: early close ~12:00 CT. Fri Dec 25: closed | [CrossTrade CME hours 2026](https://crosstrade.io/blog/cme-trading-hours-2026) (secondary; verify with [CME holiday calendar](https://www.cmegroup.com/cn-t/us-holidays/), finalized ~2 weeks ahead) |
| Equity roll | "Monday prior to the third Friday": 2026 Mar 16, Jun 15, Sep 14. By the same rule, **Mon Dec 14, 2026** (third Friday Dec 18; inference) | [CME roll dates](https://www.cmegroup.com/trading/equity-index/rolldates.html) (page returned 503); [Sierra Chart thread on the convention change](https://www.sierrachart.com/SupportBoard.php?ThreadID=74678) |
| Session definitions via API | Tradovate `/productSession/item` (`openTime`, `startTime`, `stopTime`, `closeTime`, `sundayOpenTime`); Rithmic `customSessionOpenSsm/CloseSsm` on tick-bar requests | [Tradovate/openapi.json](../../Tradovate/openapi.json); [Rithmic/protos.json](../../Rithmic/protos.json) |

Rollover needs two separate decisions. The *traded symbol* switches on the calendar date, confirmed by a volume-crossover check and by Rithmic `FrontMonthContractUpdate` (159) or Tradovate `/contract/rollcontract`. *Multi-week features* (W1/D1 swings, ATR, Fib legs, COMP profiles) are computed on a back-adjusted (difference-adjusted) series so that point distances survive the roll. Their levels are then translated into the new contract by adding the logged roll spread, and pre-roll profiles are either shifted by the same spread or flagged with reduced weight. The volume-bar notes add that volume bars should be built per contract with no open bar carried across the switch ([05 Volume bars versus time bars](05%20Volume%20bars%20versus%20time%20bars.md)). A further inference: the ADV that sizes VB-A/B/C must come from a "front month at each date" volume series. The new contract's own 20-session history is tiny before the roll and would shrink bars by an order of magnitude in roll week.

## 2. Shared building blocks: twelve definitions the proposals reuse by name

The proposal documents describe strategies as layer stacks with one role per layer (CONTEXT, LOCATION, SETUP, TRIGGER, MANAGEMENT) and refer to the blocks below by these exact names. Each block is a pure function of closed bars or raw trades. Each output carries a `known_at` timestamp, and no rule may read an output before its `known_at`. The table summarizes inputs, outputs and look-ahead rules. The evidence column repeats the grade assigned in the dimension write-ups ([01](01%20Swing%20points%20across%20timeframes.md)–[05](05%20Volume%20bars%20versus%20time%20bars.md)), so a reader of this file can see which blocks carry evidential weight and which are bookkeeping.

| Block | Inputs | Outputs | Update cadence | Known at | Mechanism evidence |
|---|---|---|---|---|---|
| TIME bars W1…M1 | Trades, calendar timers | OHLCV, bid/ask volume, high/low timestamps | Boundary timer | Bar close boundary | n/a (construction) |
| VB-A/B/C | Trades, ADV(20) | Same plus duration, `partial` flag | Volume threshold | Completing trade | A for partial statistical normalization; C for price-action transfer |
| ATR(L) | Closed bars of L | Wilder 14-period ATR | Each L close | L close | n/a (ruler) |
| SWING(L) | Closed bars of L, ATR(L) | Swings with `pivot_ts` and `confirm_ts` | Each L close | `confirm_ts` | B (prior highs/lows as watched levels) |
| STRUCTURE(L) | Confirmed swings, closes | State, BOS/CHoCH/SWEEP events, protected swings, G1–G3 | Each L close | Event bar close | C |
| LEVELS | Trades, calendar | PDH/PDL/PDC, ONH/ONL, PWH/PWL/PWC, WO/DO, IBH/IBL, ORH/ORL | Period end (running while forming) | End of defining window | B |
| PROFILE(P) | Trades with aggressor; 209 minute profiles for seeding | POC, VAH/VAL, dPOC, HVN/LVN, nPOC, singles, poor high/low | Developing per M1/M30; final at period end | Period end (final) or `as_of` (developing) | C for locations; D for the "80%" fill claim |
| FIB(A→B) | Two confirmed same-layer swings (and C) | Retracement, extension, projection levels | New confirmed swing | `confirm_ts` of B (or C) | D standalone |
| FIB-CLUSTER | Active grids across layers | Zones with member lists | Grid change | Latest member `known_at` | C |
| LEVELS registry | All feature outputs | Level records with dimension tags | Any feature event | Per record | n/a |
| Confluence gate | Registry, STRUCTURE states | Pass/fail per role, dimension set | Setup evaluation | Evaluation time | n/a |
| As-of join | All layers | `asof(L, t)` snapshots | Every timestamp batch | — | n/a |

### 2.1 TIME bars are aligned to the CME trade date and closed by logged timers

Time bars use clock time, as do W1, D1 and every time-based LEVEL, even in stacks that otherwise use volume bars. D1 defaults to the Globex trade-date bar (17:00–16:00 CT). A proposal that wants RTH daily bars says so, and its ATR is then RTH-only. W1 runs Sunday 17:00 CT to Friday 16:00 CT. Intraday layers anchor at 17:00 CT on the ETH template or 08:30 CT on the RTH template. On ETH, H4 bars start at 17:00, 21:00, 01:00, 05:00, 09:00 and 13:00 CT, and the 13:00–16:00 bar is flagged `short`. This alignment is a design choice, and server-built 240-minute bars may align differently, which the parity check in Section 3 will reveal. Bars close on a calendar `BOUNDARY` timer event written into the log, not when the next trade arrives. That keeps replay deterministic and avoids NinjaTrader-style "bars are not considered closed until the first tick of the following bar comes in" ([NinjaTrader 8 Help](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). Bar assignment uses the exchange-source timestamp (`sourceSsboe/sourceUsecs` on `LastTrade`), and the receive time is stored to measure feed latency ([Rithmic/protos.json](../../Rithmic/protos.json)).

```python
# TIME(L), L ∈ {M1, M5, M15, M30, H1, H4, D1, W1}
def on_trade(t):                                   # t: non-snapshot LastTrade, exch_ts = source time
    for L in TIME_LAYERS:
        b = open_bar[L] or open_new(L, start=boundary_floor(L, t.exch_ts), price=t.price)
        b.update(t.price, t.size, t.aggressor, t.exch_ts)   # tracks h_ts / l_ts = time of high / low print
        # aggressor BUY → ask_vol (lifted the offer); SELL → bid_vol
def on_boundary(L, ts):                            # logged TIMER event from the session calendar
    if open_bar[L]:
        emit BarClosed(L, open_bar[L], close_ts=ts, short=open_bar[L].span < nominal(L))
    open_bar[L] = None                             # empty intervals produce no bar
# Late trade: exch_ts < boundary but logged after the BOUNDARY event → counted in the next bar, flagged LATE.
# Boundary timer fires at boundary + 1 s receive-time grace (design default).
```

### 2.2 VB bars split large prints so the three tiers nest exactly

VB-A, VB-B and VB-C are constant-volume bars sized at ADV/50, ADV/250 and ADV/1000 of the instrument's 20-session average daily volume, so roughly 50, 250 and 1,000 bars form on an average full Globex day. The 1/50 rule is the Easley–López de Prado–O'Hara sampling used for E-mini S&P 500 futures ([Volume Clock, 2012](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf)), and the two finer tiers follow the 4–5× spacing convention. Three construction rules make the tiers reproducible (design proposals from the volume-bar notes). First, a print that crosses the threshold is **split** across bars, as Sierra Chart's "Split Data Records" does to create "100% constant" bars ([Sierra Chart Chart Settings](https://www.sierrachart.com/index.php?page=doc/ChartSettings.html)). Second, every tier **breaks at the Globex session start** (17:00 CT), and the cut bar is flagged `partial` and excluded from range comparisons, ATR and pivot counts. Third, sizes are **recalibrated weekly** at the first session of the week and never intraday. The fact that does the most work is that the sizes are derived from the smallest tier upward as exact integer multiples (VB-B = 4×VB-C, VB-A = 5×VB-B). With splitting and identical session breaks, every VB-A boundary then coincides exactly with a VB-B and a VB-C boundary, so cross-tier alignment needs no tolerance. Under the overflow convention or independent rounding, that guarantee disappears. For a hypothetical ADV of 1,200,000 contracts (illustrative only; compute real ADV from the user's own history), the sizes would be VB-C 1,200, VB-B 4,800 and VB-A 24,000.

```python
def weekly_recalibrate(adv20):                       # first session of the week; adv20 from front-month-at-date series
    c = nice_round(adv20 / 1000, sig_digits=2)       # VB-C
    size.update({"VB-C": c, "VB-B": 4 * c, "VB-A": 20 * c})   # 20 = 4 × 5, i.e. VB-A = 5 × VB-B
def on_trade(t):
    for L in ("VB-C", "VB-B", "VB-A"):
        q = t.size
        while q > 0:
            b = open_bar[L] or start_bar(L, t)       # remainder of a split print opens the next bar at same price/ts
            take = min(q, size[L] - b.vol)
            b.update(t.price, take, t.aggressor, t.exch_ts); q -= take
            if b.vol == size[L]:
                emit BarClosed(L, b, close_ts=t.exch_ts, duration=t.exch_ts - b.open_ts, partial=False)
                open_bar[L] = None
def on_session_start(ts):                            # 17:00 CT (or 08:30 CT for an RTH template)
    for L in VB_LAYERS:
        if open_bar[L]: emit BarClosed(L, open_bar[L], close_ts=ts, partial=True)
        open_bar[L] = None
```

Two clock guards apply because volume time cannot be converted back into clock time in advance. Mandelbrot made this point about operational time itself ([Volume Clock PDF](https://c.mql5.com/forextsd/forum/173/the_volume_clock_-_insights_into_the_high_frequency_paradigm.pdf), quoting the 1973 comment). Every armed setup carries a clock-time expiry stated by its proposal, and no TRIGGER may fire on a VB bar that took more than 30 minutes to form (design default, not from data). Features are computed on the full-size contract (ES, NQ, CL) even when the order goes to the micro, because micro volume measures different participation ([05](05%20Volume%20bars%20versus%20time%20bars.md)). Off-market prints should be filtered before building bars, since unfiltered ticks produced spurious autocorrelation in one reproduction ([EODHD](https://eodhd.com/financial-academy/?p=7012)).

### 2.3 ATR(L) is one Wilder average per layer, gap-free on RTH layers

ATR(L) is the 14-period Wilder ATR on layer L's own closed bars. On RTH-based layers it is session-aware: the first bar of each RTH session uses high minus low, excluding the overnight gap. Partial VB bars and `short` time bars are skipped. The value is known at the close of the bar that updates it. One smoothing method is used everywhere, and a minimum of 100 seeded bars warms it up (design default).

```python
def atr_update(L, bar):
    if bar.partial or bar.short: return
    pc = None if (L.rth_based and first_bar_of_session(L, bar)) else last_close[L]
    tr = bar.h - bar.l if pc is None else max(bar.h, pc) - min(bar.l, pc)
    atr[L] = tr if atr[L] is None else (13 * atr[L] + tr) / 14
    last_close[L] = bar.c; publish("ATR", L, atr[L], known_at=bar.close_ts)
```

### 2.4 SWING(L) stores two timestamps, and only the second one may trade

The default detector is directional change (an ATR ZigZag): a swing high is confirmed when price retraces k × ATR(L) from the running extreme, with **k = 2.0** and ATR **frozen at the moment the extreme printed**, so a later volatility change cannot un-confirm a swing. This follows the DC framework's split between the extreme point, known only in hindsight, and the confirmation point, a real-time event ([Tsang, DC Notations](https://bracil.net/ccfea/WorkingPapers/2014/Tsang-DC_Notations2014.pdf); [Glattfelder, Dupuis & Olsen](https://arxiv.org/pdf/0809.1040)). It also follows NinjaTrader's warning that a developing ZigZag leg "should be thought of temporary" ([NT8 ZigZag](https://static.ninjatrader.com/support/helpGuides/nt8/zigzag.htm)). Neither NinjaTrader nor Sierra Chart ships an ATR mode natively, so this is custom code ([Sierra Chart Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). The alternative is Pivot(L,R) bar-count pivots, default 3/3. A bar that both extends the extreme and retraces the threshold is resolved conservatively: extend first, and test the reversal only from the next bar. Sierra Chart documents exactly this case as a source of real-time-versus-recalculation differences ([Sierra Chart Zig Zag](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=133&Name=Zig_Zag)). The swing price and `pivot_ts` come from the tick-level high/low recorded by the bar builder, never from a synthetic bar boundary.

```python
K = 2.0                                              # degree 0; ladder k, 2k, 4k emulates higher degrees on one series
def swing_update(L, bar, k=K):
    s = state[L]
    if s.mode == UP:
        if bar.h > s.ext_price:                      # provisional extreme moves (display only, never traded)
            s.ext_price, s.ext_ts = bar.h, bar.h_ts
            s.thr = k * ATR(L)                       # freeze threshold at the extreme
            return                                   # conservative outside-bar rule
        if s.ext_price - bar.l >= s.thr:             # DC confirmation; '>=' documented
            emit Swing(type=H, price=s.ext_price, pivot_ts=s.ext_ts, confirm_ts=bar.close_ts,
                       layer=L, degree=log2(k / K), status=CONFIRMED)
            s.mode, s.ext_price, s.ext_ts, s.thr = DOWN, bar.l, bar.l_ts, k * ATR(L)
    else:
        ...                                          # mirror for lows

def pivot_update(L, bars, left=3, right=3):          # alternative detector Pivot(L, 3, 3)
    c = len(bars) - 1 - right
    if c - left < 0: return
    if all(bars[c].h > bars[c-i].h for i in range(1, left+1)) and \
       all(bars[c].h >= bars[c+j].h for j in range(1, right+1)):      # tie rule: strict left, >= right
        emit Swing(H, bars[c].h, pivot_ts=bars[c].h_ts, confirm_ts=bars[-1].close_ts, layer=L)
    ...                                              # mirror for lows; enforce H/L alternation (keep the more extreme)
```

On the review chart each swing is drawn at `pivot_ts` with a second marker at `confirm_ts`, following Pine's advice not to hide the plotting offset ([Pine Script: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). The ladder k, 2k, 4k needs a machine check before any multi-degree rule is trusted: every higher-degree swing price must equal some lower-degree swing price, and a failure means mismatched thresholds or sessions ([01 Swing points across timeframes](01%20Swing%20points%20across%20timeframes.md)).

### 2.5 STRUCTURE(L) is a state machine over confirmed swings and closes

STRUCTURE(L) takes values in {UP, DOWN, RANGE, TRANSITION}. Swings are labeled HH/HL/LH/LL, or EQH/EQL when within **0.15 × ATR(L)** of the prior same-type swing. A BOS is a *close* beyond the last confirmed swing in the trend direction. A CHoCH is the first close beyond the protected swing against the trend, and it moves the state to TRANSITION until a BOS in the new direction confirms it. A SWEEP is a wick beyond an untaken confirmed swing with a close back inside, so a BOS and a SWEEP can never fire on the same bar. RANGE is declared when a CHoCH is not followed by a BOS in the new direction within **4 confirmed swings**, with bounds at the highest SH and lowest SL of those swings. That count is a pre-committed default, since the notes give the rule but no number. The BOS/CHoCH vocabulary is a vendor convention with no canonical standard, so every parameter above is fixed in writing rather than inherited ([LuxAlgo SMC](https://www.luxalgo.com/library/indicator/smart-money-concepts-smc/)).

```python
TOL = 0.15                                           # × ATR(L), equal highs/lows
def on_swing(L, s):
    ref = st[L].last_SH if s.type == H else st[L].last_SL; tol = TOL * ATR(L)
    s.label = ("FIRST" if ref is None else
               ("HH" if s.type == H else "HL") if s.price > ref.price + tol else
               ("LH" if s.type == H else "LL") if s.price < ref.price - tol else
               ("EQH" if s.type == H else "EQL"))
    set_last(st[L], s)
def on_bar_close(L, bar):
    x = st[L]
    if x.last_SH and not x.last_SH.taken and bar.c > x.last_SH.price:
        if x.state == UP:  emit("BOS_UP");  x.protected_low = lowest_SL_since(x.last_break)  # HL that launched it
        else:              emit("CHoCH_UP"); x.state = TRANSITION; x.dir = UP; x.protected_low = x.last_SL
        if x.state == TRANSITION and x.dir == UP and x.since_choch_has_BOS_UP(): x.state = UP
        x.last_SH.taken = True; x.last_break = bar
    elif x.last_SH and not x.last_SH.taken and bar.h >= x.last_SH.price + tick and bar.c < x.last_SH.price:
        emit("SWEEP_HIGH", level=x.last_SH)
    ...                                              # mirror for lows; protected-swing CHoCH; RANGE after 4 swings

def htf_grade(H, LTF, t):                            # HTF uptrend shown; mirror for downtrend
    p = st[H].protected_low.price
    if asof_bar(H, t).c < p:             return "G3"  # HTF bar closed beyond: confirmed, the only grade used for bias
    if asof_bar(LTF, t).c < p:           return "G2"  # LTF close beyond: provisional → "stand aside"
    if developing(H, t).low <= p:        return "G1"  # touch/sweep: test only
    return None
```

### 2.6 LEVELS are always computed from clock time, never from volume bars

| Level | Definition | Session | Known at |
|---|---|---|---|
| PDH / PDL / PDC | High, low, last trade of the prior RTH day (settlement logged separately) | RTH | Prior RTH close (15:00 CT) |
| ONH / ONL | High, low from 17:00 CT to 08:30 CT | ETH | 08:30 CT (running value labeled developing before) |
| PWH / PWL / PWC | Prior Globex week high, low, last trade | ETH | Friday 16:00 CT |
| WO / DO | First trade after Sunday 17:00 CT / first trade of the trade date at 17:00 CT | ETH | At the print |
| IBH / IBL | High, low of the first 60 minutes of RTH | RTH | 09:30 CT |
| ORH / ORL | High, low of the opening range; length stated per strategy | RTH | End of the stated window |

These levels are what other participants anchor to, so they stay on clock time even in volume-bar stacks. The volume-bar notes are explicit that the opening range, prior-day levels and weekly open must never be derived from "first K volume bars" ([05](05%20Volume%20bars%20versus%20time%20bars.md)). An early-close holiday session is a short session: it still defines the next day's PDH/PDL/PDC, and the record carries a `short_session` flag. The evidence for prior highs and lows as reaction points is indirect but real. Published dealer support/resistance levels, typically prior peaks and troughs, interrupted intraday FX trends 60.8% of the time versus 56.2% for arbitrary levels ([Osler 2000](https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf)).

### 2.7 PROFILE(P) stores per-minute volume-at-price so seeded and live data share one code path

PROFILE(P) is built from tick prints at 1-tick rows, with integer tick-index keys and never float prices. The storage unit is the key design choice (a design proposal): one volume-at-price record per instrument per minute, split into bid-aggressor, ask-aggressor and no-aggressor volume. That is exactly the shape of Rithmic's `ResponseVolumeProfileMinuteBars` (209), which returns per-minute `profilePrice[]`, `profileBidVolume[]`, `profileAskVolume[]` and `profileNoAggressorVolume[]` arrays ([Rithmic/protos.json](../../Rithmic/protos.json)). Seeded history from 209 and live records built from `LastTrade` therefore feed the same composer, and every P ∈ {RTH, ETH, ON, WEEK, MONTH, COMP(n weeks), ANCH(A→B)} is just a sum over a span of minutes. A weekly profile is exactly the sum of its sessions when row size is constant ([03 Volume profile across timeframes](03%20Volume%20profile%20across%20timeframes.md)). Totals must include the no-aggressor column. ANCH(A→B) spans from swing A's `pivot_ts` to swing B's `pivot_ts`, is usable only from B's `confirm_ts`, and is approximate to the minute at its endpoints.

The value area uses one method everywhere: Sierra Chart's single-row expansion from the POC, adding the larger adjacent row and carrying the other forward, until the total reaches or exceeds 70%, including both rows when they tie. POC ties go to the row nearest the profile middle, then the lower row ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). TradingView stops *before* exceeding 70% and the classic two-row "Method A" adds pairs, so levels differ by a tick or more across vendors ([TradingView Volume Profile](https://www.tradingview.com/support/solutions/43000502040-volume-profile/)). The review chart must therefore use the engine's own rendering or an identically configured Sierra profile, not a third-party default.

```python
minute_vap[m][i] = {"bid": 0, "ask": 0, "none": 0}   # i = round(price / tick_size)
def on_trade(t): minute_vap[minute(t.exch_ts)][tick_index(t.price)][side(t)] += t.size

def profile(P, as_of):
    span = calendar_span(P, as_of)                   # ANCH(A→B): [A.pivot_ts, B.pivot_ts], known from B.confirm_ts
    H = sum_rows(minute_vap[m] for m in span)        # total = bid + ask + none
    final = period_closed(P, as_of)
    return dict(POC=poc(H), **value_area(H), **nodes(H, sigma(P)),
                status="final" if final else "developing", as_of=as_of)

def value_area(H, pct=0.70):                         # Sierra single-row with carry, stop at >= 70%
    target = pct * total(H); p = poc(H); lo = hi = p; acc = H[p]
    while acc < target and (hi < top(H) or lo > bottom(H)):
        vu = H.get(hi + 1, 0) if hi < top(H) else -1
        vd = H.get(lo - 1, 0) if lo > bottom(H) else -1
        if vu > vd:   hi += 1; acc += vu
        elif vd > vu: lo -= 1; acc += vd
        else:         hi += 1; lo -= 1; acc += vu + vd           # tie: include both
    return {"VAL": lo, "VAH": hi}

def nodes(H, sigma_ticks):                           # HVN/LVN on a Gaussian-smoothed dense histogram
    y = gaussian_smooth(dense(H), sigma_ticks)
    hvn = find_peaks(y, prominence=0.30 * y.max())
    lvn = [v for v in valleys(y) if y[v] <= 0.35 * min(y[left_peak(v)], y[right_peak(v)])]
    return {"HVN": with_zones(hvn, rel_height=0.5), "LVN": lvn}
def sigma(P): return 3 if P.sessions == 1 else round(3 * sqrt(P.sessions))   # ticks
```

The node parameters are pre-committed rather than discovered. The 0.3 × max prominence follows a published reference implementation that calls itself "only a starting point" ([Minh, Medium](https://metaminh.medium.com/how-to-analyze-volume-profiles-with-python-3166bb10ff24)). The 3-tick kernel is the midpoint of the notes' 2–4-tick range for session profiles. The √(sessions) scaling for WEEK, MONTH and COMP is a design inference from the diffusive √time heuristic in the swing notes, so a weekly profile smooths at about 7 ticks and a monthly one at about 14. The remaining outputs are bookkeeping. The **dPOC** is sampled at every M30 close and logged at every trigger. An **nPOC** is a final session, week or month POC not yet traded at by any subsequent trade, ETH included (Sierra's "Until Future Intersection" with the Chart Bars method) ([Sierra Chart Volume by Price](https://www.sierrachart.com/index.php?page=doc/StudiesReference.php&ID=141)). **Single prints** and **poor high/low** use Sierra's TPO definitions on M30 sub-periods of the RTH session, with poor extremes matched within 1 tick ([Sierra Chart TPO docs](https://www.sierrachart.com/index.php?page=doc/StudiesReference/TimePriceOpportunityCharts.html)). Prior-period profiles are final and safe to use. The current session's profile is always labeled `developing` with its `as_of` sequence number, because the "end-of-day POC" a reviewer sees later will differ from what the engine saw at 10:15.

### 2.8 FIB(A→B) grids are versioned objects that die, never mutate

A FIB grid is drawn on a confirmed swing leg A→B of one layer. Retracements sit at 0.382, 0.5, 0.618 and 0.786 of the leg measured back from B. Extensions sit at A + 1.272×(B−A) and A + 1.618×(B−A), beyond B. Projections from a confirmed pullback point C sit at C ± 0.618, 1.0 and 1.618 × |B−A| in the leg's direction. A close beyond A on layer L invalidates the grid. Grids are drawn on the last 3 confirmed legs per layer whose size is at least 3 × ATR(L), following the reference algorithm in the Fibonacci notes ([04 Fibonacci retracements and extensions](04%20Fibonacci%20retracements%20and%20extensions.md)). The automation rule is that a grid is identified by its anchor pivot IDs and is *never* edited. When a new confirmed swing changes the latest leg, a new grid version is created and the old one keeps its levels until its own invalidation. A still-extending leg yields only a provisional, display-only grid, because an unconfirmed end anchor moves the whole grid and is the classic auto-Fib repaint ([LuxAlgo Golden Pocket](https://www.luxalgo.com/library/indicator/golden-pocket/)).

```python
RETR, EXT, PROJ = (0.382, 0.5, 0.618, 0.786), (1.272, 1.618), (0.618, 1.0, 1.618)
def on_confirmed_swing(L, s):
    for (A, B) in last_legs(L, n=3, min_size=3.0 * ATR(L)):
        gid = ("FIB", L, A.id, B.id)
        if gid in grids: continue                    # immutable
        d = B.price - A.price
        grids[gid] = Grid(gid, [B.price - x * d for x in RETR] + [A.price + x * d for x in EXT],
                          known_at=B.confirm_ts, origin=A.price, status="ACTIVE")
    for (A, B, C) in last_abc(L):                    # C = confirmed pullback after B
        gid = ("PROJ", L, A.id, B.id, C.id)
        if gid not in grids:
            sgn = 1 if B.price > A.price else -1
            grids[gid] = Grid(gid, [C.price + sgn * x * abs(B.price - A.price) for x in PROJ],
                              known_at=C.confirm_ts, origin=A.price, status="ACTIVE")
def on_bar_close(L, bar):
    for g in active_grids(L):
        if closed_beyond_origin(bar.c, g): g.status = "INVALIDATED"; registry.invalidate(g.gid)
```

### 2.9 FIB-CLUSTER requires three levels from two anchors inside 0.2 ATR

A FIB-CLUSTER is at least 3 levels from at least 2 distinct grids falling within **0.2 × ATR(L)**, where L is the layer playing the LOCATION role. The grouping below anchors each window at its lowest member rather than chaining neighbors, so a zone can never be wider than the tolerance. Without that anchoring, single-linkage chaining can glue a dozen levels into a zone too wide to stop behind. This matches the generic algorithm described by LuxAlgo (pool, sort, group within a tolerance that is "a fraction of the recent average range", keep groups of ≥3 from ≥2 swings) ([LuxAlgo Fib Clusters](https://www.luxalgo.com/library/concept/fib-clusters.md)) and Boroden's "at least three Fibonacci price relationships" ([TradingMarkets: Boroden](https://tradingmarkets.com/?p=661586)).

```python
def fib_clusters(L_loc, layers, t):
    tol = 0.2 * ATR(L_loc)
    pool = sorted(((lvl, g.gid, g.known_at) for g in grids_active(layers) if g.known_at <= t
                   for lvl in g.levels), key=lambda x: x[0])
    zones, i = [], 0
    while i < len(pool):
        j = i
        while j + 1 < len(pool) and pool[j + 1][0] - pool[i][0] <= tol: j += 1
        m = pool[i:j + 1]
        if len(m) >= 3 and len({x[1] for x in m}) >= 2:
            zones.append(Zone(lo=m[0][0], hi=m[-1][0], members=m, known_at=max(x[2] for x in m),
                              dimension="GEOMETRY"))
            i = j + 1
        else:
            i += 1
    return zones
```

### 2.10 The LEVELS registry tags every level with the dimension it belongs to

Every actionable price (swing extremes, LEVELS, profile outputs, Fib levels and clusters) becomes a registry record. The `dimension` tag is what enforces the shared confluence rule. Swing levels and Fib levels share anchors and both get `GEOMETRY`. Volume-at-price outputs get `PROFILE`, the genuinely independent dimension. Clock-time reference levels get `REFERENCE`. The concept-interplay notes explain why: five Fib lines in a zone "are still one geometric fact" ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)).

```python
LevelRecord = dict(
    level_id   = hash(kind, layer, provenance),      # deterministic → stable setup_id across restarts
    kind       = "SWING_H|SWING_L|PDH|...|POC|VAH|VAL|HVN|LVN|NPOC|FIB|FIB_CLUSTER",
    layer      = "W1|D1|...|M1|VB-A|VB-B|VB-C|PROFILE(P)",
    price=None, lo=None, hi=None,                    # point or zone
    dimension  = "GEOMETRY|PROFILE|REFERENCE|EXTERNAL",   # EXTERNAL = optional context feeds (doc 12)
    provenance = {"block": "...", "anchors": [...], "profile": "WEEK 2026-W45", "grid": gid},
    known_at=..., created_seq=...,
    status     = "ACTIVE|TESTED|TAKEN|INVALIDATED|EXPIRED",
    invalidation_rule="close_beyond_origin|traded_through|period_rollover|age>N", touches=0)
```

### 2.11 The confluence gate asks for one pre-declared condition per role

Each proposal declares exactly one condition per role. The gate evaluates them against an as-of snapshot and returns the first failing role, which goes into the decision record. Confluence is counted in dimensions, not lines: a LOCATION satisfied by a GEOMETRY zone plus a PROFILE level touches two dimensions, while three coincident Fib levels touch one. Required one-per-role conditions are preferred to weighted scores because a score adds a free parameter per weight plus a threshold, and the overfitting literature shows false discoveries grow with the configurations tried ([Bailey, Borwein, López de Prado & Zhu](https://scholarworks.wmich.edu/math_pubs/40/)).

```python
ROLES = ("CONTEXT", "LOCATION", "SETUP", "TRIGGER", "MANAGEMENT")
def gate(setup, snap):
    for role in ROLES:
        if not setup.rule[role].holds(snap): return False, role, None
    dims = {r.dimension for r in setup.location_levels(snap)}
    return True, None, dims                          # dims logged; GEOMETRY counts once
```

### 2.12 The as-of join processes every layer before any setup evaluates

When several bars close at the same instant (M5, M15, H1 and possibly D1 at a boundary), the engine processes *all* closes at that timestamp first, low layer to high, updating every feature. Setups evaluate only after that, against `asof(L, t)` for each layer. This barrier deliberately differs from NinjaTrader's "primary bars series will always be processed first" ordering, which leaves the just-closed higher-timeframe bar invisible to the primary series at that instant ([NinjaTrader 8 Help](https://static.ninjatrader.com/support/helpGuides/nt8/multi-time_frame__instruments.htm)). Lower-layer price interaction with *already-confirmed* higher-layer levels (a touch, sweep or close beyond) is legitimate real-time information. The developing higher-layer bar is available only through the separate `developing(L, t)` call, used for G1/G2 checks and display, never for bias.

```python
def on_timestamp_batch(t, events):
    for e in sorted(bar_closes(events), key=layer_rank):   # M1…W1 and VB-C…VB-A
        update_features(e)                                 # ATR, SWING, STRUCTURE, LEVELS, PROFILE, FIB, registry
    snap = {L: asof(L, t) for L in ALL_LAYERS}             # each: last state with known_at <= t
    for m in active_setups(): m.evaluate(snap, developing=lambda L: developing(L, t))
```

## 3. The repo's Rithmic protos cover the data and order surface; history is bar-shaped

Parsing `Rithmic/protos.json` and the template map confirms that R|Protocol, as defined in the repo, covers essentially everything this strategy family needs. Every template number below was checked against [Rithmic/template-mapping.js](../../Rithmic/template-mapping.js), and fields and enums against [Rithmic/protos.json](../../Rithmic/protos.json). The Tradovate column was checked against [Tradovate/openapi.json](../../Tradovate/openapi.json).

| Need | Rithmic (plant: template) | Tradovate | Caveat |
|---|---|---|---|
| Trades with aggressor | TICKER: `RequestMarketDataUpdate` 100 (`LAST_TRADE` bit) → `LastTrade` 150: `tradePrice`, `tradeSize`, `aggressor` BUY/SELL, `isSnapshot`, exchange-source and gateway timestamps | `md/getChart` with `underlyingType:"Tick"`: `tks[]` with optional bid/ask fields | Tradovate packets can arrive out of order |
| BBO | `BestBidOffer` 151 | `md/subscribeQuote` | One subscription per type per contract (Tradovate) |
| Halts, limits | `MarketMode` 157, `OrderPriceLimits` 163 | `/productSession/item` | — |
| Time bars | HISTORY: `RequestTimeBarUpdate` 200 (live), `RequestTimeBarReplay` 202; `barType` SECOND, MINUTE, DAILY, WEEKLY → `TimeBar` 250 / 203 with bid/ask volume and settlement | `md/getChart` `MinuteBar`, `DailyBar` | **No monthly unit in either; no weekly unit in Tradovate** |
| Volume bars | `RequestTickBarUpdate` 204 / `RequestTickBarReplay` 206; `barType` TICK, RANGE, VOLUME; `barTypeSpecifier` (size); `customSessionOpenSsm/CloseSsm` → `TickBar` 251 / 207 | `md/getChart` `elementSizeUnit:"Volume"` | Split vs overflow and `barTypeSpecifier` format undocumented |
| Volume profile | `RequestVolumeProfileMinuteBars` 208 → 209: per-minute per-price bid, ask and no-aggressor volume and trade counts. `RequestGetVolumeAtPrice` 119 → 120: snapshot arrays | `md/subscribeHistogram` (per `tradeDate`); `withHistogram` on charts | 119 coverage (trade date vs session) undocumented |
| Pagination | `RequestResumeBars` 210 → 211 | `timeRange.asMuchAsElements` | Rithmic warns a round-number count "such as 10000" may mean truncation |
| Front month | `RequestFrontMonthContract` 113 → 114; `FrontMonthContractUpdate` 159 | `/contract/rollcontract` | — |
| Tick size, point value | Not used here | `/product/item` (`tickSize`, `valuePerPoint`) | Read at startup rather than hardcoding |

| Order or risk function | Rithmic (ORDER / PNL plants) | Tradovate |
|---|---|---|
| New order | `RequestNewOrder` 312: LIMIT, MARKET, STOP_LIMIT, STOP_MARKET, MIT, LIT; DAY, GTC, IOC, FOK; `cancelAfterSecs`, `cancelAtSsboe`; `userTag`; `manualOrAuto` | `/order/placeorder`: Limit, MIT, Market, QTS, Stop, StopLimit, TrailingStop, TrailingStopLimit; Day, FOK, GTC, GTD, IOC; `expireTime`; `clOrdId`; `isAutomated` |
| Bracket | `RequestBracketOrder` 330: `bracketType` incl. TARGET_AND_STOP(_STATIC); multi-level `targetTicks[]`/`stopTicks[]`; break-even; trailing; `stopMarketOnReject`; `stopMarketAtSsboe`/`targetMarketAtSsboe` time exits | `/order/placeoso` (`bracket1` + optional `bracket2`, linked OCO); `/orderStrategy/startorderstrategy` multibracket |
| OCO / link | `RequestOCOOrder` 328; `RequestLinkOrders` 344 | `/order/placeoco` |
| Modify bracket | `RequestUpdateTargetBracketLevel` 332, `RequestUpdateStopBracketLevel` 334 | `/orderStrategy/modifyorderstrategy`, `/order/modifyorder` |
| Cancel all / flatten | `RequestCancelAllOrders` 346; `RequestExitPosition` 3504 | `/order/cancelorder`; `/order/liquidatepositions` ("a request… not a guarantee") |
| Order state stream | `RequestSubscribeForOrderUpdates` 308 → `RithmicOrderNotification` 351 (incl. `TRIGGER_PENDING`, `ORDER_SENT_TO_EXCH`), `ExchangeOrderNotification` 352 (`FILL`, `REJECT`, `confirmedId`, `exchReceiptSsboe`); `RequestSubscribeToBracketUpdates` 336 → `BracketUpdates` 353 | `user/syncrequest` → `props` events |
| Reconciliation | 320, 318–327, 338, 340, 402, 3506 | `user/syncrequest` |
| Broker risk | `RequestAccountRmsInfo` 304 → 305 (`lossLimit`, `autoLiquidate`, `autoLiquidateThreshold`, `maxOrderQuantity`); `RequestProductRmsInfo` 306 → 307; `RequestAccountRmsUpdates` 3508 → `AccountRmsUpdates` 356 (`autoLiqThresholdCurrentValue`, `autoLiqPeakAccountBalance`) | `userAccountAutoLiq` (daily/weekly loss, `trailingMaxDrawdown`, `trailingMaxDrawdownMode` EOD/RealTime, `flattenTimestamp`), `userAccountPositionLimit`, `userAccountRiskParameter` |
| P&L | `RequestPnLPositionUpdates` 400 → 450/451 | Position and cash entities via sync |
| Session control | `ForcedLogout` 77, `Reject` 75, heartbeat 18/19 | `shutdown` event (`Maintenance`, `ConnectionQuotaReached`, `IPQuotaReached`); `h` frames |

Three gaps shape the startup design. **Rithmic exposes no raw historical tick-by-tick trades and no historical BBO or depth**: history is bar-shaped, consisting of time bars, tick/range/volume bars and minute profiles ([Rithmic/protos.json](../../Rithmic/protos.json), templates 10–3509). Exact past VB bars can therefore come only from server `VOLUME_BAR` replay (whose split semantics are unverified) or from the engine's own tick archive. The single cheapest risk reduction in the whole project is to start recording ticks continuously from day one, long before any strategy code exists. **Neither API has a monthly bar, and Tradovate has no weekly unit**, so higher timeframes are built from daily bars, and W1 on the Tradovate path is always a local aggregate. **History depth and the `barTypeSpecifier` format are undocumented** in the 20-page draft Reference Guide. Seeding code must detect truncation, not assume it away.

| Block to seed | Request | Depth (pre-committed) | Notes |
|---|---|---|---|
| SWING/STRUCTURE(W1) | 202 `WEEKLY_BAR` | 2 years | Cross-check against W1 aggregated from D1 |
| D1, monthly aggregates, ADV(20) | 202 `DAILY_BAR` | 2 years | ADV from the front-month-at-date series |
| H4…M1 | 202 `MINUTE_BAR`, period 1, aggregated locally | 8 weeks | Pulling only M1 and aggregating locally keeps seeded and live H4/H1/M30/M15/M5 on one code path |
| VB-A/B/C | 206 `VOLUME_BAR` at each size, then own archive | VB-A 8 weeks; VB-B 2 weeks; VB-C 5 days | VB-C at ~1,000 bars/day reaches the 10,000 truncation hint in 10 days; paginate |
| PROFILE RTH/ETH/ON/WEEK/MONTH/COMP | 208 → 209 summed by span | Prior month plus COMP window | ~1,380 minute bars per 23-hour day, ~6,900 per week and ~30,000 per month, above the "10000" hint: page by time window via 210 and verify no missing minutes outside maintenance |
| nPOC list | 209 per session | 20 sessions | Naked status re-derived by scanning later minutes |
| LEVELS | 202 MINUTE/DAILY | 2 weeks | — |

Every seeded series ends with a parity check: the last seeded bars must equal the first live-built bars (or bars rebuilt from recorded ticks over the overlap), and live local bars are continuously compared to server `TimeBar`/`TickBar` subscriptions within a tolerance. That comparison doubles as FIA's recommended check that "actionable data is reasonable" ([FIA 2024 §3.1](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf)), and it is the only way to learn empirically how Rithmic's volume bars treat a boundary-crossing print.

Access, not capability, is the binding constraint on each route. Rithmic is the primary route, because it supplies aggressor-side ticks, server volume bars for cross-checking and minute profile history, and because the user's deployment plan is a dedicated Rithmic account. Tradovate remains an optional secondary path, useful for its Market Replay and as a fallback data source. Tradovate's spec says API use requires "a LIVE account with more than $1000 in equity", an API Access subscription and an API key ([Tradovate/openapi.json](../../Tradovate/openapi.json)). Secondary sources report that prop-firm and evaluation accounts are not eligible, and forum users say personal API keys do not reach prop accounts ([ThorTradeCopier](https://thortradecopier.com/blog/rithmic-vs-tradovate); [Tradovate community](https://community.tradovate.com/t/api-access-for-propfirm-accounts/10348)). Tradovate also allows "one simultaneous client connection per customer" and "will disconnect the oldest ones", so a desktop Tradovate or NinjaTrader session on the same login silently cuts the bot's order monitoring ([Tradovate/openapi.json](../../Tradovate/openapi.json)). On the Rithmic side, `systems.js` lists `Rithmic Paper Trading`, `Rithmic 01` and many prop systems (TopstepTrader, Apex and others) but no `Rithmic Test` ([Rithmic/config/systems.js](../../Rithmic/config/systems.js)). An unofficial client describes "Rithmic Test" as the pre-approval system, and a vendor page says conformance, credentials and provider permission are separate hurdles and that API access may not cover paper-trading demos ([rithmic-rs config.rs](https://docs.rs/crate/rithmic-rs/latest/source/src/config.rs); [PickMyTrade](https://pickmytrade.io/help/rithmic/rithmic-api-overview/)). That conflicts with the repo's own logger example showing a successful Paper Trading login, which may be illustrative. The login message itself suggests the application has an identity Rithmic can approve: `RequestLogin` carries `appName`, `appVersion`, `systemName`, `osPlatform` and `macAddr`, and `ResponseLogin` returns `fcmId`, `ibId` and `uniqueUserId` ([Rithmic/protos.json](../../Rithmic/protos.json)). The notes do not confirm the actual production-approval steps, the test system to use, or which live system name and gateway the user's FCM will assign. Treat all three as **verify with Rithmic (and the FCM)** before planning dates. For prop accounts the Rithmic route is the realistic one, subject to the firm's permission.

## 4. The browser harness is a test bench; the trading host is a private server

The repo's Rithmic module is a well-factored "Clean Proto-Factory System" with a `ConnectionManager`, a `ProtoFactory` that builds any message from `protos.json`, a template-mapping decoder and a `sendMessage(plant, messageName, data)` API, served by `python -m http.server 8000` and opened in a browser ([Rithmic/README.md](../../Rithmic/README.md)). It was built to test connectivity and decoding, and it does that job. It was not built to be left alone with orders, and an honest reading of the code shows four blocking gaps.

| Concern | Today (repo) | Required for unattended | Recommendation (no code changes made) |
|---|---|---|---|
| Host | Browser tab; background tabs commonly throttle timers | Supervised headless process with restart on crash | Node service reusing `protos.json`, `ProtoFactory` and the decoder, which appear portable (inference) |
| Heartbeat | `heartbeatInterval: 30000` hardcoded, sent on `setInterval` | Interval taken from `ResponseLogin.heartbeatInterval` | Read the server value. Send a heartbeat whenever idle. Alarm when no response arrives within 2× the interval |
| Reconnect | None; the timer is cleared in `ws.onclose` | Backoff, re-login, re-subscribe, reconcile before arming | Implement the Section 1 restart path for every disconnect, not just process starts |
| Logging | One `.txt` download per decoded message, `maxFilesPerDay: 10000` | Append-only, flushed event log | JSONL or SQLite WAL on disk, the single source for replay, audit and journal ingestion |
| Order authority | Any UI code can call `sendMessage` to ORDER_PLANT | Only the order manager, behind the risk manager | Enforce in code structure: the order-plant handle is private to one module |
| Watchdog | None | Out-of-process watchdog able to cancel and flatten | Separate process and connection, with its own alerting (push/SMS) |
| Hosting location | Local machine | Private server (the user's plan) for the dedicated Rithmic account | See the deployment table below. Exception: Topstep forbids VPS, VPN and remote servers for order placement |

The evidence for the table is direct. `connection-manager.js` sets `heartbeatInterval: 30000` and `connectionTimeout: 10000`, sends `RequestHeartbeat` on a timer and clears it on close, and a grep finds no reconnect or retry logic ([Rithmic/connection/connection-manager.js](../../Rithmic/connection/connection-manager.js)). Rithmic's guide says the heartbeat interval "is specified in the login response" and that the server "will terminate such connections for not keeping the link active" ([Rithmic Reference Guide](../../Rithmic/Reference_Guide.pdf), Heartbeats). A fixed 30 s timer is therefore correct only by coincidence, and in a throttled background tab it may not fire on time at all. The data logger saves each response through the browser's download mechanism with a daily cap ([Rithmic/DATA_LOGGER_README.md](../../Rithmic/DATA_LOGGER_README.md)). That is useful for inspecting messages but unusable as a durable, ordered, replayable log. Tradovate's protocol is stricter still: the server sends a heartbeat "about every 2.5 seconds" and the client "must also send a response beat" of `[]` ([Tradovate/openapi.json](../../Tradovate/openapi.json)). Token renewal before `expirationTime` via `/auth/renewaccesstoken`, and treating `ForcedLogout` (77) or a Tradovate `shutdown` event as kill-switch triggers, round out the required changes.

The hosting constraint deserves emphasis because it inverts the usual advice. Topstep's terms allow custom bots through the TopstepX/ProjectX API but prohibit VPS, VPN and remote servers for order placement ("your server can watch and record, but it cannot trade"), exclude the API from Live Funded Accounts, and say API-executed orders "cannot be reviewed, adjusted, or reversed" ([Topstep: TopstepX API Access](https://help.topstep.com/en/articles/11187768-topstepx-api-access); [Topstep: Prohibited Conduct](https://help.topstep.com/en/articles/10296582-prohibited-conduct)). "Move it to a server" therefore means "a supervised headless process on the user's own machine, with power, sleep and network settings hardened" for that firm. A cloud host is acceptable only where the account's rules permit it. The `TopstepTrader` Rithmic system in `systems.js` may be legacy given Topstep's move to TopstepX (unverified), and connectivity to a prop system is not permission to automate on it.

## 5. No input may be newer than the decision it drives

Every feature is defined by information that existed at decision time, and every trigger writes an immutable record of exactly that information. These rules are the engine-side equivalent of Pine's documented non-repainting pattern, which combines an `[1]` offset with `lookahead_on` and calls the combination "the only recommended method to avoid repainting" ([Pine Script: Repainting](https://www.tradingview.com/pine-script-docs/concepts/repainting/)). The table states each rule, its enforcement and what the reviewer sees.

| Rule | Forbids | Enforcement | What the reviewer sees |
|---|---|---|---|
| Confirmed swings only | Trading a pivot before `confirm_ts` | Readers filter `confirm_ts ≤ t` | Pivot marker plus a dashed "known from" marker |
| Closed higher-layer bars for bias | Using the developing W1/D1/H4 close | `asof()` vs separate `developing()`; bias uses G3 only | Developing bar drawn in a distinct style |
| Developing vs final profiles | Treating today's POC as fixed | `status` + `as_of` on every profile value | Value at trigger time printed on the chart |
| Immutable Fib grids | Re-anchoring an armed setup's grid | Grid IDs from anchor pivot IDs; invalidate, never edit | Grid version label on each level |
| Volume bars close on the completing trade | Inferring a close later | Evaluate only on `BarClosed` | VB close timestamp in the record |
| Time-based levels from clock time | Deriving ONH or IBH from VB counts | LEVELS built only from trades and calendar | Level provenance shows the time window |
| Same builder for seeded and live | Construction drift at the seam | One code path, overlap parity check | Parity status in the run header |
| Exchange timestamps for assignment | Gateway jitter moving trades between bars | Bars keyed by source time; receive time logged | Latency column |
| Barrier at shared timestamps | Evaluating before all layers update | Section 2.12 batch rule | — |
| Timers are logged events | Wall-clock nondeterminism | Calendar emits `BOUNDARY`/`EXPIRY` into the log | — |
| No same-bar extend-and-reverse | Outside-bar ambiguity | Conservative SWING rule | — |
| No late arming after downtime | Acting on setups armed while the engine was down | Restart path marks them `EXPIRED` | Downtime band on the chart |

The decision record is written on every state transition, append-only and keyed by `setup_id`. Its job is to let a reviewer reconstruct the engine's view without trusting the engine.

```json
{
  "strategy_version": "PA-01@v3", "git_sha": "…", "config_hash": "…",
  "setup_id": "9f2c…", "transition": "ARMED→ORDER_PENDING", "event_seq": 18342271,
  "exch_ts": "2026-11-09T15:42:07.118Z", "recv_ts": "2026-11-09T15:42:07.131Z",
  "symbol": "ESZ6", "exec_symbol": "MESZ6", "last_trade": 6012.25, "bbo": [6012.00, 6012.25],
  "stack": {"CONTEXT": "D1", "LOCATION": "H1", "SETUP": "VB-B", "TRIGGER": "VB-C", "MANAGEMENT": "VB-C"},
  "closed_bar_ids": {"D1": "…", "H1": "…", "VB-B": "…", "VB-C": "…"},
  "developing": {"D1": {"o": 5998.5, "h": 6015.0, "l": 5990.25, "as_of_seq": 18342271}},
  "structure": {"D1": {"state": "UP", "protected_low": 5961.0, "grade": null}, "H1": {"state": "TRANSITION"}},
  "swings_used": [{"pivot_id": "…", "price": 5990.25, "pivot_ts": "…", "confirm_ts": "…"}],
  "levels_used": [{"level_id": "…", "kind": "VAL", "dimension": "PROFILE", "profile": "WEEK 2026-W45", "status": "final"}],
  "fib_grids_used": ["FIB/H1/…/…"], "cluster": {"lo": 6008.0, "hi": 6009.5, "members": 4, "anchors": 2},
  "atr": {"D1": 71.2, "H1": 14.8, "VB-C": 2.1},
  "gate": {"passed": true, "dimensions": ["GEOMETRY", "PROFILE"]},
  "risk_state": {"day_R": -0.6, "trades_today": 1, "consec_losses": 1, "dist_to_liq_usd": 1840},
  "intended_order": {"type": "LIMIT", "price": 6009.75, "stop": 6004.25, "targets": [6018.0], "qty": 2, "expiry_s": 1800},
  "reason_codes": ["LOC_CLUSTER+VAL", "TRIG_CHOCH_UP_VBC"]
}
```

Visual audit then has three parts (design proposal). The as-of renderer draws the chart truncated at `event_seq`, with only the levels, pivots and grids known then, next to the hindsight chart. Entries, exits and invalidations are annotated with `setup_id`. A determinism test replays the event log through the engine and asserts hash-identical decision records, and any mismatch is by definition look-ahead or nondeterminism. No industry-standard decision-record schema for retail automated futures systems was found, so the schema above is a recommendation, not a standard.

## 6. Every position is born with a broker-held stop

Execution choices follow from three facts. CME changes what client order types mean. Linked orders live on broker servers, not at the exchange. And the customer's own disconnect does not cancel anything. At CME, stop orders are stop-with-protection: activated "when the market trades at or through the stop trigger price", they "can only be executed within the protection range limit", typically trigger ± half the non-reviewable range, and any remainder rests at the protection limit. iLink returns them as stop-limit on acceptance and as a limit once triggered ([CME Order Types for Futures and Options](https://cmegroupclientsite.atlassian.net/wiki/display/EPICSANDBOX/Order+Types+for+Futures+and+Options); [CME iLink Order Types](https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457227032/iLink+Order+Types)). Market orders are protected at "the current best bid or offer, plus or minus 50 percent of the product's Non-Reviewable Trading Range". A third-party example puts ES at a 6-point NRR, giving 3 points (12 ticks) of protection ([CME Market Integrity Controls](https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/46170793); [NexusFi](https://nexusfi.com/a/exchanges/price-banding-market-protection-mechanisms)). Price banding rejects orders outside the band, velocity logic pauses markets that move "too far, too fast", and CME may widen both around "significant economic numbers" ([CME: Price Limits and Circuit Breakers](https://www.cmegroup.com/education/articles-and-reports/understanding-price-limits-and-circuit-breakers)). A protective stop can therefore fail to fill fully through a gap. Stops bound slippage; they do not guarantee an exit.

| Situation | Order | Rationale | Accepted cost |
|---|---|---|---|
| Fade or reversal at a LOCATION level | Limit 1–2 ticks in front of the level, with expiry (`cancelAfterSecs` or `GTD` + `expireTime`) | Resting liquidity clusters at obvious prices, and price often front-runs them (practitioner convention, not a sourced statistic) | Adverse selection: a fill often means the level is being traded through |
| Trigger-confirmed reversal (e.g., VB-C CHoCH at an H1 level) | Limit at the retest, or stop-limit beyond the trigger bar | Entry tied to the TRIGGER event | Missed retests |
| Breakout or acceptance | Stop-limit: trigger beyond the level, limit a few ticks further | Bounds slippage below the protection range | Non-fills on fast breaks, logged |
| Protective stop | Broker-held bracket stop leg submitted with the entry (`RequestBracketOrder` 330 / `placeoso`) | Exists at the broker the moment the entry fills | Gap risk beyond protection |
| Targets | Bracket target legs (limits); multi-level `targetQuantity[]` | OCO with the stop | Partial target fills |
| Time exit | `stopMarketAtSsboe`/`targetMarketAtSsboe` (Rithmic); `flattenTimestamp` (Tradovate) as backstop | Flat-by-time survives an engine crash | Exit at market-with-protection |
| Kill | `RequestCancelAllOrders` 346 + `RequestExitPosition` 3504; `/order/liquidatepositions` | One action, broker-side | "Not a guarantee" (Tradovate's words) |

| Behavior | Where it lives | Status |
|---|---|---|
| Limit orders | CME book | Standard |
| CME stop and market orders | Exchange stop-with-protection / market-with-protection | CME docs |
| Rithmic `STOP_MARKET` and bracket stop legs | CME-native resting stop, or held at Rithmic and released on trigger | **Unverified** |
| Tradovate `Stop` and OSO bracket legs | Same question | **Unverified** |
| OCO linkage, brackets, multibracket strategies | Broker/platform servers, not the exchange | Inference from both specs |
| Trailing and break-even (`trailingStopTriggerTicks`, `breakEvenTicks`, Tradovate `TrailingStop`) | Broker-simulated; works only while the broker server is healthy | Inference |
| `cancelAfterSecs`, `releaseAtSsboe`, `ifTouched*` conditions | Broker-held | Inference |
| Resting brackets across the 16:00–17:00 CT maintenance halt and the weekend | Unknown for both brokers | **Unverified** |
| Cancel-on-disconnect when the *customer* disconnects from the broker | "Typically unsupported" | [FIA 2024 §1.4](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf) |

The bracket-routing question can be answered empirically on paper during Stage 0 (a proposed test, inferred from the proto fields). Place a bracket and watch the stop leg's notifications. If it shows an `ExchangeOrderNotification` with a `confirmedId` and `exchReceiptSsboe` while still resting, it sits at CME. If it sits in `TRIGGER_PENDING` on `RithmicOrderNotification` and only reaches `ORDER_SENT_TO_EXCH` when price trades through, Rithmic holds it ([Rithmic/protos.json](../../Rithmic/protos.json)). Leaving a paper bracket open through one maintenance halt and one weekend answers the persistence question. **Until both answers are known, unattended mode should be intraday-only and flat by 15:50 CT.** Multi-session swing setups stay in signal-only or attended mode.

Stop placement uses the stop-clustering evidence: executed stop-loss orders cluster just beyond round numbers and their triggering propagates fast moves, "price cascades" that last hours ([Osler 2002](https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.pdf)). MANAGEMENT stops therefore sit beyond the protecting swing or level plus a buffer of **max(2 ticks, 0.15 × ATR(L))** unless a proposal states otherwise (pre-committed within the notes' 1–2 tick / 0.1–0.25 ATR range). Partial fills are handled by sizing bracket legs to filled quantity; Rithmic's `stopQuantityReleased`/`targetQuantityReleased` in `BracketUpdates` suggest proportional release, which must be verified. The unfilled remainder is cancelled at the setup's expiry or the next close of its TRIGGER layer, whichever comes first, and is never left unmanaged. Rejects are classified (price band, RMS limit, market state, malformed) and are terminal for that order. An intent is retried at most once, after re-running every pre-trade check, and a second reject trips the kill switch. On loss of the order channel the engine stops arming and sends nothing, relies on the broker-held stop, alerts loudly, and reconciles on reconnect. Every new or modified order passes the pre-trade checks below. They map directly onto FIA's price-tolerance, maximum-order-size and maximum-position controls, which "should be applied when a new order is submitted or when an existing order is modified" ([FIA 2024 §1.1–1.3](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf)).

```python
def pre_trade_ok(intent, mkt, acct, cal):
    return all([
        intent.symbol == cal.front_month(intent.root),               # roll calendar + FrontMonthContractUpdate
        mkt.mode == "OPEN" and not mkt.halted,                       # MarketMode 157
        mkt.low_limit <= intent.price <= mkt.high_limit,             # OrderPriceLimits 163
        abs(intent.price - mkt.ref_price) <= max(8 * tick, 1.0 * ATR("M1")),   # self-imposed price tolerance
        intent.qty <= MAX_ORDER_QTY and acct.pos_after(intent) <= MAX_POSITION,
        intent.risk_usd <= acct.R_usd,
        not acct.daily_halted and not cal.in_blackout(now()) and not cal.in_session_end_window(now()),
        not broker_has_working(intent.setup_id),                     # idempotency
        mkt.last_tick_age_s <= STALE_S and mkt.spread_ticks <= SPREAD_MAX,      # FIA reasonability
    ])
```

Message hygiene keeps the bot clear of both rate penalties and regulatory risk. Resting entries are re-quoted at most on a close of their TRIGGER layer and only when the level moved by at least 2 ticks. Every cancel carries a `reason_code`. Every order is marked automated, with `manualOrAuto=AUTO` on Rithmic and `isAutomated:true` on Tradovate, where the spec says it "must be true if this isn't an order made directly by a human" ([Tradovate/openapi.json](../../Tradovate/openapi.json)).

## 7. Four nested fences keep an unattended engine inside its limits

Risk control is layered so each layer stops trading strictly before the layer outside it would. Engine strategy limits halt one setup type. Engine account limits halt all new entries. Broker limits (Rithmic RMS, Tradovate auto-liquidation) flatten. Prop-firm rules end the account. The engine must *read* the outer layers so it stays inside them: `AccountRmsUpdates` (356) streams `autoLiqThresholdCurrentValue` and `autoLiqPeakAccountBalance`, and Tradovate's `userAccountAutoLiq` exposes daily and weekly loss limits, `trailingMaxDrawdown` and `trailingMaxDrawdownMode` (EOD or RealTime) ([Rithmic/protos.json](../../Rithmic/protos.json); [Tradovate/openapi.json](../../Tradovate/openapi.json)). On prop accounts these values are probably firm-controlled and read-only (inference).

```
┌ Prop-firm rules: trailing drawdown, daily loss, automation policy ─────────────────────────┐
│ ┌ Broker / FCM: Rithmic RMS lossLimit + autoLiquidate · Tradovate userAccountAutoLiq ───┐ │
│ │ ┌ Engine account limits: daily R, weekly R, distance-to-liquidation buffer ────────┐ │ │
│ │ │ ┌ Engine strategy limits: trades/day, consecutive losses, repeated executions ─┐ │ │ │
│ │ │ │ ┌ Per trade: 1R stop, size floor, pre-trade checks, broker-held stop ─────┐ │ │ │ │
│ │ │ │ └──────────────────────────────────────────────────────────────────────┘ │ │ │ │
```

| Control | Pre-committed default | Basis |
|---|---|---|
| Risk per trade | 1R = a fixed dollar amount set by the user; `qty = floor(R_usd / (stop_ticks × tick_value))`; **skip if qty < 1 micro** rather than widen | Automation notes |
| Stop distance | max(structure stop + buffer, 1.0 × ATR(TRIGGER layer)) | Notes give k × ATR; k = 1.0 is this document's starting value |
| Daily loss | 2R, then no new entries until the next trade date | Notes range 2–3R; conservative end for unattended use |
| Trades per day | 3 per instrument | Notes range 3–5 |
| Consecutive losses | 3, then stop for the day | Notes |
| Repeated automated executions | 3 fills of the same setup type in a session without human acknowledgement disables that type | FIA §3.2 concept; count is a design default |
| Weekly loss | 2× the daily limit (also set Tradovate `weeklyLossAutoLiq` slightly beyond) | Design default |
| Liquidation buffer | Block entries whose worst case (stop + slippage allowance + open-profit giveback) exceeds distance-to-liquidation − 1R | Notes formula; buffer is a design default |
| News blackout | No new entries from T−10 to T+30 minutes around tier-1 releases | Notes range T−5/10 to T+15/30; wide end |
| Session filters | No entries 16:00–17:00 CT; none in the 15 minutes after the 17:00 CT reopen or before 15:00 CT and 16:00 CT, unless the setup is an opening setup by design | Notes give the rule; 15 minutes is a design default |
| Flat-by time (intraday) | 15:50 CT, broker-side backstop | Ten minutes before maintenance; design default |
| Stale market data | No tick for 10 s in RTH or 60 s in ETH, a crossed BBO, or a spread above 4 ticks blocks entries | FIA §3.1 concept; numbers are design defaults to verify per instrument |
| Stale order channel | No heartbeat response or order-plant traffic within 2× the server interval | Notes |
| Message-rate cap | More than 5 order messages per second or 30 per minute per strategy trips the kill switch | Design default |

Sizing is where micros earn their place. Using standard CME multipliers quoted in the notes, MES is $1.25 per tick (0.25 point × $5), ES $12.50, MNQ $0.50 and NQ $5.00, and one mini equals ten micros. CL and MCL values should be read at startup from Tradovate `/product/item` (`tickSize`, `valuePerPoint`) or the contract specification rather than hardcoded. The notes observe that structure stops on H4 and D1 setups run 20–60+ ES points. With R = $200, a 40-point stop is 160 ticks: $200 per MES contract, so 1 MES, but $2,000 per ES, so the trade is skipped. Higher-timeframe structure trades are affordable at a small fixed R only in micros, and micro granularity also keeps actual risk close to R on intraday trades.

The kill switch is layered as FIA recommends: "a control that, when activated, immediately disables all trading activity", built "on a sufficiently granular level to identify individual trading systems" and operable separately from the trading application ([FIA 2024 §1.5](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf)). Layer (a) is an in-app command that cancels all (346), flattens (3504 or `liquidatepositions`) and disables arming until a manual reset. Layer (b) is an out-of-process watchdog that does the same if the engine hangs. Layer (c) is broker RMS or auto-liquidation set slightly beyond the engine's own limits. Layer (d) is a documented manual fallback (R|Trader, the Tradovate web platform, or the broker desk) for when the API path is down. The disconnect policy follows from where stops live.

| Condition | Detection | Action |
|---|---|---|
| Market data stale or unreasonable | Tick age, crossed or wide BBO, local vs server bar mismatch | Block entries, keep brackets, alert |
| Order channel stale | No heartbeat response within 2× interval | Send nothing, alert by push/SMS, rely on broker stops, reconcile on reconnect |
| Both channels down | Both of the above | Broker-held stops are the only protection; manual fallback |
| `ForcedLogout` 77 / Tradovate `shutdown` | Message | Kill switch |
| Reject storm or runaway messaging | Second reject on one intent; rate cap breach | Kill switch |
| `MarketMode` halt or price outside `OrderPriceLimits` | Message | Block entries |

"Auto-flatten on disconnect" works only if the order path survives, for example when only market data dies. The design must assume flattening is impossible during an outage, which is why no unattended position may exist without a broker-held stop.

News blackouts come from a machine-readable calendar. The remaining 2026 FOMC meeting is **December 8–9** (with projections), and 2027 meetings fall on Jan 26–27, Mar 16–17, Apr 27–28, Jun 8–9, Jul 27–28, Sep 14–15, Oct 26–27 and Dec 7–8 ([Federal Reserve FOMC calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm)). The Fed's page does not list statement times, and the conventional 2:00 p.m. ET statement is unverified here. The Employment Situation (NFP) releases at 8:30 a.m. ET on **Friday, December 4, 2026**, then Jan 8, Feb 5, Mar 5, Apr 2, May 7, Jun 4, Jul 2, Aug 6, Sep 3, Oct 8, Nov 5 and Dec 3, 2027 ([BLS schedule](https://www.bls.gov/schedule/news_release/empsit.htm)). CPI dates were not retrieved and must be added before CPI days can be blacked out.

Prop-firm drawdown is modeled explicitly. On Rithmic, `distance_to_liquidation = balance − autoLiqThresholdCurrentValue`. On Tradovate it is the trailing-max-drawdown equivalent. Under **RealTime** trailing, open profit raises the peak, so profit given back counts against the drawdown. Under **EOD** trailing, only the closing balance trails. The giveback term in the liquidation buffer exists for the RealTime case. Topstep's automation terms are covered in Section 4. For Apex, sources **conflict**: several 2026 vendor guides say bots are allowed in evaluations but not on funded accounts, one audit lists automation as allowed, and a German-language site says it is prohibited outright ([PickMyTrade](https://blog.pickmytrade.trade/apex-funded-automation-rules-2026/); [TradingAudit](https://tradingaudit.pages.dev/rules/apex); [PropTradingVibes](https://proptradingvibes.com/de/blog/apex-trader-funding-rules-overview)). Get written rules from the firm before automating there.

The regulatory boundary is CME Rule 575, effective September 15, 2014. It prohibits entering orders "with the intent to cancel" before execution, with prohibited intent "including recklessness", and requires that "all orders must be entered for the purpose of executing bona fide transactions" ([CME RA1405-5](https://www.cmegroup.com/tools-information/lookups/advisories/market-regulation/CME_CBOT_NYMEX_COMEX_RA1405-5.html)). Advisory **RA2608-5** (dated July 30, 2026, effective August 13, 2026) updates the Rule 575 FAQ, "adds examples of prohibited disruptive messaging activity" and addresses closing-period conduct. Its full text could not be fetched ([CME RA2608-5](https://www.cmegroup.com/content/dam/cmegroup/notices/market-regulation/2026/07/cme-group-ra2608-5.pdf)). A buggy cancel-replace loop is not manipulation, but under a recklessness standard it is not obviously safe either. The design rules follow: submit only orders the strategy intends to fill, with no probes, decoys or stacked resting orders; cap message rates; treat a runaway loop as a kill-switch event; avoid placing or cancelling near settlement except for genuine execution; and log a reason code on every cancel. CFTC's 2021 Electronic Trading Risk Principles place pre-trade control obligations on exchanges, which pass them down to participants ([CFTC final rule](https://www.cftc.gov/LawRegulation/FederalRegister/finalrules/2020-27622.html)).

| FIA 2024 control | Section | Engine implementation |
|---|---|---|
| Price tolerance, max order size, max intraday position | §1.1–1.3 | `pre_trade_ok` on every new and modified order |
| Cancel-on-disconnect | §1.4 | Assumed unavailable; broker-held stops; expiry on every entry |
| Kill switch | §1.5 | Layers (a)–(d) |
| Market data reasonability | §3.1 | Stale, spread and local-vs-server bar checks |
| Repeated automated execution limit | §3.2 | 3 fills of the same setup type disables it until a human re-enables |
| Exchange messaging programs | §3.3 | Rate caps; re-quote only at bar close with 2-tick hysteresis |
| Post-trade reconciliation and alerts | §4.1–4.2 | Broker-vs-engine reconciliation at each restart and at the end of each trade date |
| Testing before release | §5 | Section 8 stages; new `strategy_version` per change |

## 8. Forward validation freezes rules and counts, rather than tuning

Not backtesting does not mean not testing. "Not optimizing" means parameters are fixed from experience and the research notes *before* data collection and are never tuned to the sample. "Not testing" would mean going live without evidence. Forward testing with frozen, version-tagged rules is legitimate out-of-sample evidence, and FIA's guidance that organizations test "before any new system, new versions or updates are released to the production environment" applies to a one-person operation too ([FIA 2024 §5](https://fia.org/sites/default/files/2024-07/FIA_WP_AUTOMATED%20TRADING%20RISK%20CONTROLS_FINAL_0.pdf)). Every rule or parameter change increments `strategy_version` and `config_hash`, and statistics restart or are reported separately. That rule blocks slow, unacknowledged curve-fitting through repeated small tweaks. The concept-interplay notes add a subtler trap: reviewing charts and keeping the rules that "look right" is itself an informal multiple-testing loop ([06 How the dimensions interact](06%20How%20the%20dimensions%20interact.md)). The defenses are to freeze rules before reviewing a batch, record every firing including the ugly ones, and judge on forward instances only.

| Stage | Duration / sample | What runs | What is measured | Advance when | Abort when |
|---|---|---|---|---|---|
| 0. Plumbing | 1–2 weeks, paper | Connect, reconnect, restart-reconcile, kill switch, bracket place/modify, forced failures (kill mid-trade, drop network, invalid price, reject), bracket-routing and maintenance-halt tests (Section 6) | Pass/fail checklist | Every check passes | Any unsafe outcome |
| 1. Signal-only | ≥4–6 weeks **and** ≥30–50 signals per setup type, whichever is later | Decision records and annotations; no orders | Agreement rate, false-trigger categories, hypothetical R using conservative fills | Agreement ≥ 80% and zero look-ahead defects in the determinism test | Repeated look-ahead or misclassification defects (fix → new version) |
| 2. Simulated execution | ≥50–100 trades total | Real orders on Rithmic Paper Trading or Tradovate demo | Fill vs hypothetical price, stop slippage, partials, rejects, latency; E, p, MAE/MFE | After ≥50 trades: E > 0 with lower 80% bound > −0.1R, slippage within budget | E < −0.3R after 30 trades, or any risk-control failure |
| 3. Replay rehearsal | Targeted days | Tradovate Market Replay (0–400% speed, throwaway account) or the engine's own recorded ticks | Behavior on FOMC, NFP, roll week, holiday half-days, gap opens | Blackouts, flattening and roll switch all behave correctly | Any wrong behavior |
| 4. One micro live | Ongoing | 1 MES/MNQ/MCL | Same statistics plus live-vs-sim slippage | Pre-declared scaling rule | Same abort rules |

Sim fills are optimistic because queue position is not modeled faithfully. NinjaTrader says the same of its own replay, which "was NOT designed to provide accuracy in backtesting concerning order fills" ([NinjaTrader: Tick Replay](https://static.ninjatrader.com/support/helpGuides/nt8/developing_for__tick_replay.htm)). Every limit entry is therefore scored twice: once as filled on touch, and once in a conservative column that counts a fill only if price traded at least 1 tick through the limit. The Stage 1 checklist asks six questions of each signal. Were the levels visible at the time on the as-of chart? Was the swing confirmed before use? Does the CONTEXT layer match the user's discretionary read? Would the user have taken it (yes, no, maybe)? Was the invalidation rule correct? Did the hypothetical fill assume a touch-only fill that probably would not have happened?

The statistics are simple and computed per setup type and in aggregate, in R multiples: win rate *p*, average win *W*, average loss *L*, expectancy `E = p·W − (1−p)·L` (the mean R per trade), profit factor, maximum consecutive losses, maximum drawdown in R, the MAE and MFE distributions in R, entry and stop slippage in ticks, and limit fill rate. MAE shows whether stops sit beyond normal noise. MFE shows whether targets are realistic. Sample size follows from the standard error of mean R, `SE ≈ sd(R)/√n`. The figures below are standard statistical reasoning, not citations, with sd(R) of 1.0–1.5R typical for 1R-stop, 1.5–2R-target systems per the notes.

| Trades (n) | SE at sd = 1.0R | SE at sd = 1.5R | What the sample can tell you |
|---|---|---|---|
| 30 | 0.18R | 0.27R | Reject "badly broken" (E ≤ −0.3R); cannot confirm an edge |
| 50 | 0.14R | 0.21R | The Stage 2 gate: lower 80% bound > −0.1R |
| 100 | 0.10R | 0.15R | A rough read on a modest edge |
| 70–150 | — | — | Needed to show E = +0.2R > 0 at ~95% one-sided confidence, from `n ≈ (1.645·sd/E)²` |

Two practical consequences follow. First, confluence is expensive in samples: four roughly independent filters each passing 30% of candidates jointly pass about 0.8% (0.3⁴), so a high-confluence D1 setup may fire only a few times a year per instrument ([06](06%20How%20the%20dimensions%20interact.md)). Such setups need identical rules across ES, NQ and CL to accumulate instances, and they will spend a long time in Stage 1. Segmenting by session, layer or level type is for diagnosis only; with small n, segment differences are mostly noise and must not drive mid-sample changes. Second, the calendar right now is unusually dense. A Stage 1 window opening in mid-November 2026 contains Thanksgiving and its half-day (Nov 26–27), NFP (Dec 4), FOMC (Dec 8–9), the December equity roll (Dec 14 by the stated rule), Christmas (Dec 25), the January NFP (Jan 8) and the January FOMC (Jan 26–27). Blackouts will thin the signal count, and the window is unrepresentative for statistics. Those same days are exactly the Stage 3 rehearsal set. Recording ticks through them is worth more than any early expectancy estimate.

## 9. NinjaTrader 8 and Sierra Chart are credible hosts; webhook bridges are not unattended-safe

For a user who will not backtest, a platform's backtester matters least. What matters is identical historical and real-time signal logic, server-side brackets, clean logging and sim/replay modes. NinjaTrader 8 and Sierra Chart both document their parity rules explicitly. NinjaTrader states that historical bars process on bar close and that `AddDataSeries` must be hardcoded in `State.Configure` ([NT8 AddDataSeries](https://static.ninjatrader.com/support/helpGuides/nt8/adddataseries.htm)). Sierra's ACSIL never places orders "on historical bars or while historical data is being downloaded", defaults `sc.AllowOnlyOneTradePerBar` to TRUE, and supports "server-side brackets" while marking some order types `_CLIENT_SIDE` ([Sierra Chart ACSIL Trading](https://www.sierrachart.com/index.php?page=doc/ACSILTrading.html)). That is a real head start over a custom engine until it passes its own determinism test. TradingView with a webhook bridge is the fastest prototype and the weakest unattended host. Webhooks are cancelled if the receiver takes "longer than three seconds", "may occasionally fail to reach the specified URL", and have no documented retry ([TradingView webhooks](https://www.tradingview.com/support/solutions/43000529348-about-webhooks/)). TradersPost "will never retry failed or rejected orders" and has a 1-minute-chart minimum ([TradersPost Known Limitations](https://docs.traderspost.io/docs/learn/known-limitations)). TradingView's built-in "Volume candles" are width-coded time candles, not constant-volume bars ([TradingView Volume candles](https://in.tradingview.com/support/solutions/43000724995)).

| Platform | Volume bars | MTF to W1 | Volume-at-price in code | Server-side brackets | Parity documentation | Main drawbacks for this family |
|---|---|---|---|---|---|---|
| Custom on repo Rithmic layer | Local from `LastTrade` or server `VOLUME_BAR` | `WEEKLY_BAR`; monthly built | 209 minute profiles; local aggressor ticks | `RequestBracketOrder` 330 | Only what the engine's own tests prove | All engineering risk; harness must be rebuilt as a service; API access/conformance hurdles |
| NinjaTrader 8 | Native (break-at-EOD option; split rule undocumented) | Native Week, Month | Order Flow+ Volumetric per-price bid/ask (doc inconsistency noted) | ATM/managed orders; server-side behavior per connection unverified | Strong (OnBarClose, Tick Replay caveats) | Windows desktop; hardcoded series; historical vs real-time differences without Tick Replay |
| Sierra Chart | Native, with documented split and new-bar-at-session-start rules | Native | ACSIL volume-at-price per bar (name to verify) | Supported | Strong (no orders on historical bars; one trade per bar) | C++ learning curve; some client-side order types; separate chart per timeframe |
| TradingView + TradersPost/PickMyTrade | Community scripts only | `request.security` | Limited | Bridge-dependent | Bar-close alerts only | Late or lost alerts, no retries, 3 s timeout; hard to log state at signal time |
| ATAS | Yes; BTK algorithm undisclosed | Yes | Strong cluster focus | Not verified | Not reviewed | C# automation docs not reviewed |
| MotiveWave | Yes | Yes | Profile study "calculates no trading signals"; code in the Java SDK | Not verified | Not reviewed | Smaller community |
| Quantower | Yes ("Time is not involved in this aggregation") | Yes | Not verified | Not verified | Not reviewed | Sparse authoritative automation docs |

Sources for the less-documented rows: [ATAS help](https://help.atas.net/en/support/solutions/articles/72000649737-creating-custom-indicators-and-trading-bots-in-atas), [MotiveWave Volume Profile](https://motivewave.com/studies/volume_profile.htm), [Quantower Volume Bars](https://help.quantower.com/quantower/analytics-panels/chart/chart-types/volume-bars) and [NinjaTrader Volumetric Bars](https://docs.ninjatrader.com/ninjascript/order_flow_volumetric_bars). A hybrid is possible, with the pfmon engine computing signals and decision records while NinjaTrader or Sierra executes or serves as the visual confirmation chart. Two systems must then agree on state, and on the Tradovate path they compete for its single connection, so a single host is simpler for a first deployment. The recommendation here is the custom path. The deciding factors are fit with the pfmon journal, exact control of VB construction and profile definitions shared by engine and review chart, and the fact that the Rithmic surface is already mapped. The platform rows remain the fallback if Phase 1–3 engineering stalls. Whichever host is chosen, the review chart's bar size, session template, split rule and value-area method must match the engine's exactly, or the bot "sees" different candles than the user ([05](05%20Volume%20bars%20versus%20time%20bars.md)).

## 10. Recommended build path: three order-free phases before the first order

The sequence below front-loads the work that makes later stages trustworthy. It records data before it computes anything, proves determinism before it trades, and verifies stop routing before it holds risk. No order is sent until Phase 5, by which time weeks of recorded ticks exist for replay.

| Phase | Deliverable | Exit criterion |
|---|---|---|
| P0. Access and policy | Written confirmation of R|Protocol API permission and conformance path for the target systems, Tradovate API eligibility, and each prop firm's automation and hosting rules. A dedicated automation account per firm | All three answered in writing; host location decided per account |
| P1. Headless recorder | Supervised service: login with server-provided heartbeat, reconnect with backoff, `LastTrade`/`BestBidOffer`/`MarketMode` subscriptions, append-only event log, gap report. **No orders** | Two weeks of continuous recording with explained gaps only |
| P2. Bar builders and seeding | TIME and VB builders; weekly ADV recalibration; seeding via 202/206/209 with 210 pagination and truncation checks; continuous local-vs-server bar parity | Parity within tolerance; seeded-to-live seam identical; VB split behavior of the server characterized |
| P3. Feature layers and as-of charts | ATR, SWING, STRUCTURE, LEVELS, PROFILE, FIB, FIB-CLUSTER, registry; as-of renderer; determinism replay test | Replaying a week of log reproduces hash-identical feature outputs |
| P4. Signal-only (Stage 1) | Setup machines for the first proposals from [08](08%20Proposals%20price%20action%20and%20swing.md)–[11](11%20Proposals%20confluence.md); decision records; review workflow; journal ingestion | Stage 1 exit criteria per setup type |
| P5. Order and risk managers on paper (Stages 0 and 2) | Order manager behind risk manager; brackets; kill switch layers (a)–(d); watchdog; stop-routing and maintenance-halt tests | Stage 0 checklist passes, then Stage 2 gate |
| P6. Replay rehearsal (Stage 3) | Recorded FOMC, NFP, roll, holiday and gap days replayed through the engine; Tradovate Market Replay as a cross-check | Correct behavior on every rehearsal day |
| P7. One micro live (Stage 4) | 1 micro per setup type; **intraday-only, flat by 15:50 CT** until bracket persistence across the halt is verified | Pre-declared scaling rule; live-vs-sim slippage within budget |
| P8. Extend | Swing (multi-session) setups unattended only after P5 proves broker-held stops persist; new instruments and setup types each enter at P4 with a new `strategy_version` | Same gates, per version |

## Conclusion

The useful reframing is that, for a trader who will not backtest, the validation instrument is determinism rather than any statistic. A forward test is only as honest as the chart it is reviewed on, and only an engine whose every decision replays identically from a durable log can produce the as-of chart that separates "the setup worked" from "the setup looks like it worked in hindsight". That moves the critical path away from strategy logic and toward plumbing: a recorder, bar builders with parity checks, and a determinism test all come before the first signal. The cheapest high-value act available today is to start recording ticks, because Rithmic will never hand back the raw history that later replay and VB reconstruction need.

The largest remaining risk sits in execution, not in swing, profile or Fibonacci definitions. Nobody has yet verified whether the stop protecting an unattended position rests at CME or on a broker server, or whether it survives the nightly halt. Until a paper test answers that, the honest scope of "leave it alone" is intraday and flat before maintenance, and swing setups stay supervised. A handful of small, structural design choices carry more weight than any parameter. VB tiers are derived as exact multiples from VB-C upward with split prints, so they nest without tolerance. Volume-at-price is stored per minute in the same shape as Rithmic's 209 records, so seeded and live profiles share one code path. Level IDs are deterministic, so idempotency survives restarts. Swing, Fib and profile levels carry dimension tags, so confluence counts independent facts rather than coincident lines. None of these choices adds an optimizable parameter, which keeps the project inside "proven concepts, frozen rules" while making each trigger auditable after the fact.
