/**
 * Client Message Index - Complete
 * 
 * Automatically generated from protos.json analysis.
 * Contains ALL client-originating messages (60 total) with complete field definitions and enums.
 * 
 * Each message entry contains:
 * - templateId: The unique template ID from protos.json
 * - description: Human-readable description
 * - fields: Complete field definitions with types and rules
 * - enums: Associated enum definitions for validation
 * - plants: Which plant types support this message
 */

export const CLIENT_MESSAGES = {
    // === SYSTEM & AUTHENTICATION MESSAGES ===
    
    'RequestLogin': {
        templateId: 10,
        description: 'Login to a plant',
        fields: {
            'user': { type: 'string', rule: 'optional' },
            'password': { type: 'string', rule: 'optional' },
            'appName': { type: 'string', rule: 'optional' },
            'appVersion': { type: 'string', rule: 'optional' },
            'systemName': { type: 'string', rule: 'optional' },
            'infraType': { type: 'SysInfraType', rule: 'optional' },
            'templateVersion': { type: 'string', rule: 'optional' },
            'userMsg': { type: 'string', rule: 'repeated' },
            'macAddr': { type: 'string', rule: 'repeated' },
            'osVersion': { type: 'string', rule: 'optional' },
            'osPlatform': { type: 'string', rule: 'optional' },
            'aggregatedQuotes': { type: 'bool', rule: 'optional' }
        },
        enums: {
            'SysInfraType': { 'TICKER_PLANT': 1, 'ORDER_PLANT': 2, 'HISTORY_PLANT': 3, 'PNL_PLANT': 4, 'REPOSITORY_PLANT': 5 }
        },
        plants: ['ORDER_PLANT', 'PNL_PLANT', 'TICKER_PLANT', 'HISTORY_PLANT']
    },

    'RequestLogout': {
        templateId: 12,
        description: 'Logout from a plant',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT', 'PNL_PLANT', 'TICKER_PLANT', 'HISTORY_PLANT']
    },

    'RequestReferenceData': {
        templateId: 14,
        description: 'Request reference data for symbol',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT', 'ORDER_PLANT']
    },

    'RequestRithmicSystemInfo': {
        templateId: 16,
        description: 'Request Rithmic system information',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT', 'PNL_PLANT', 'TICKER_PLANT', 'HISTORY_PLANT']
    },

    'RequestHeartbeat': {
        templateId: 18,
        description: 'Send heartbeat to maintain connection',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'ssboe': { type: 'int32', rule: 'optional' },
            'usecs': { type: 'int32', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT', 'PNL_PLANT', 'TICKER_PLANT', 'HISTORY_PLANT']
    },

    'RequestRithmicSystemGatewayInfo': {
        templateId: 20,
        description: 'Request gateway information for system',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'systemName': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT', 'PNL_PLANT', 'TICKER_PLANT', 'HISTORY_PLANT']
    },

    // === MARKET DATA MESSAGES (TICKER_PLANT) ===

    'RequestMarketDataUpdate': {
        templateId: 100,
        description: 'Subscribe/unsubscribe to market data updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'request': { type: 'Request', rule: 'optional' },
            'updateBits': { type: 'uint32', rule: 'optional' }
        },
        enums: {
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 },
            'UpdateBits': { 'LAST_TRADE': 1, 'BBO': 2, 'ORDER_BOOK': 4, 'OPEN': 8, 'OPENING_INDICATOR': 16, 'HIGH_LOW': 32, 'HIGH_BID_LOW_ASK': 64, 'CLOSE': 128, 'CLOSING_INDICATOR': 256, 'SETTLEMENT': 512, 'MARKET_MODE': 1024, 'OPEN_INTEREST': 2048, 'MARGIN_RATE': 4096, 'HIGH_PRICE_LIMIT': 8192, 'LOW_PRICE_LIMIT': 16384, 'PROJECTED_SETTLEMENT': 32768, 'ADJUSTED_CLOSE': 65536 }
        },
        plants: ['TICKER_PLANT']
    },

    'RequestGetInstrumentByUnderlying': {
        templateId: 102,
        description: 'Get instruments by underlying symbol',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'underlyingSymbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'expirationDate': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestMarketDataUpdateByUnderlying': {
        templateId: 105,
        description: 'Subscribe to market data by underlying',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'underlyingSymbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'expirationDate': { type: 'string', rule: 'optional' },
            'request': { type: 'Request', rule: 'optional' },
            'updateBits': { type: 'uint32', rule: 'optional' }
        },
        enums: {
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 },
            'UpdateBits': { 'LAST_TRADE': 1, 'BBO': 2, 'ORDER_BOOK': 4, 'OPEN': 8, 'OPENING_INDICATOR': 16, 'HIGH_LOW': 32, 'HIGH_BID_LOW_ASK': 64, 'CLOSE': 128, 'CLOSING_INDICATOR': 256, 'SETTLEMENT': 512, 'MARKET_MODE': 1024, 'OPEN_INTEREST': 2048, 'MARGIN_RATE': 4096, 'HIGH_PRICE_LIMIT': 8192, 'LOW_PRICE_LIMIT': 16384, 'PROJECTED_SETTLEMENT': 32768 }
        },
        plants: ['TICKER_PLANT']
    },

    'RequestGiveTickSizeTypeTable': {
        templateId: 107,
        description: 'Request tick size type table',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'tickSizeType': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestSearchSymbols': {
        templateId: 109,
        description: 'Search for symbols matching criteria',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'searchText': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'productCode': { type: 'string', rule: 'optional' },
            'instrumentType': { type: 'InstrumentType', rule: 'optional' },
            'pattern': { type: 'Pattern', rule: 'optional' }
        },
        enums: {
            'InstrumentType': { 'FUTURE': 1, 'FUTURE_OPTION': 2, 'FUTURE_STRATEGY': 3, 'EQUITY': 4, 'EQUITY_OPTION': 5, 'EQUITY_STRATEGY': 6, 'INDEX': 7, 'INDEX_OPTION': 8, 'SPREAD': 9, 'SYNTHETIC': 10 },
            'Pattern': { 'EQUALS': 1, 'CONTAINS': 2 }
        },
        plants: ['TICKER_PLANT']
    },

    'RequestProductCodes': {
        templateId: 111,
        description: 'Request product codes for exchange',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'exchange': { type: 'string', rule: 'optional' },
            'giveToiProductsOnly': { type: 'bool', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestFrontMonthContract': {
        templateId: 113,
        description: 'Request front month contract information',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'needUpdates': { type: 'bool', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestDepthByOrderSnapshot': {
        templateId: 115,
        description: 'Request depth by order snapshot',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'depthPrice': { type: 'double', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestDepthByOrderUpdates': {
        templateId: 117,
        description: 'Subscribe to depth by order updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'request': { type: 'Request', rule: 'optional' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'depthPrice': { type: 'double', rule: 'optional' }
        },
        enums: {
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 }
        },
        plants: ['TICKER_PLANT']
    },

    'RequestGetVolumeAtPrice': {
        templateId: 119,
        description: 'Request volume at price information',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    'RequestAuxilliaryReferenceData': {
        templateId: 121,
        description: 'Request auxiliary reference data',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['TICKER_PLANT']
    },

    // === HISTORICAL DATA MESSAGES (HISTORY_PLANT) ===

    'RequestTimeBarUpdate': {
        templateId: 200,
        description: 'Subscribe to time bar updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'request': { type: 'Request', rule: 'optional' },
            'barType': { type: 'BarType', rule: 'optional' },
            'barTypePeriod': { type: 'int32', rule: 'optional' }
        },
        enums: {
            'BarType': { 'SECOND_BAR': 1, 'MINUTE_BAR': 2, 'DAILY_BAR': 3, 'WEEKLY_BAR': 4 },
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 }
        },
        plants: ['HISTORY_PLANT']
    },

    'RequestTimeBarReplay': {
        templateId: 202,
        description: 'Request historical time bar data',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'barType': { type: 'BarType', rule: 'optional' },
            'barTypePeriod': { type: 'int32', rule: 'optional' },
            'startIndex': { type: 'int32', rule: 'optional' },
            'finishIndex': { type: 'int32', rule: 'optional' },
            'userMaxCount': { type: 'int32', rule: 'optional' },
            'direction': { type: 'Direction', rule: 'optional' },
            'timeOrder': { type: 'TimeOrder', rule: 'optional' },
            'resumeBars': { type: 'bool', rule: 'optional' }
        },
        enums: {
            'BarType': { 'SECOND_BAR': 1, 'MINUTE_BAR': 2, 'DAILY_BAR': 3, 'WEEKLY_BAR': 4 },
            'Direction': { 'FIRST': 1, 'LAST': 2 },
            'TimeOrder': { 'FORWARDS': 1, 'BACKWARDS': 2 }
        },
        plants: ['HISTORY_PLANT']
    },

    'RequestTickBarUpdate': {
        templateId: 204,
        description: 'Subscribe to tick bar updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'request': { type: 'Request', rule: 'optional' },
            'barType': { type: 'BarType', rule: 'optional' },
            'barSubType': { type: 'BarSubType', rule: 'optional' },
            'barTypeSpecifier': { type: 'string', rule: 'optional' },
            'customSessionOpenSsm': { type: 'int32', rule: 'optional' },
            'customSessionCloseSsm': { type: 'int32', rule: 'optional' }
        },
        enums: {
            'BarType': { 'TICK_BAR': 1, 'RANGE_BAR': 2, 'VOLUME_BAR': 3 },
            'BarSubType': { 'REGULAR': 1, 'CUSTOM': 2 },
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 }
        },
        plants: ['HISTORY_PLANT']
    },

    'RequestTickBarReplay': {
        templateId: 206,
        description: 'Request historical tick bar data',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'barType': { type: 'BarType', rule: 'optional' },
            'barSubType': { type: 'BarSubType', rule: 'optional' },
            'barTypeSpecifier': { type: 'string', rule: 'optional' },
            'startIndex': { type: 'int32', rule: 'optional' },
            'finishIndex': { type: 'int32', rule: 'optional' },
            'userMaxCount': { type: 'int32', rule: 'optional' },
            'customSessionOpenSsm': { type: 'int32', rule: 'optional' },
            'customSessionCloseSsm': { type: 'int32', rule: 'optional' },
            'direction': { type: 'Direction', rule: 'optional' },
            'timeOrder': { type: 'TimeOrder', rule: 'optional' },
            'resumeBars': { type: 'bool', rule: 'optional' }
        },
        enums: {
            'BarType': { 'TICK_BAR': 1, 'RANGE_BAR': 2, 'VOLUME_BAR': 3 },
            'BarSubType': { 'REGULAR': 1, 'CUSTOM': 2 },
            'Direction': { 'FIRST': 1, 'LAST': 2 },
            'TimeOrder': { 'FORWARDS': 1, 'BACKWARDS': 2 }
        },
        plants: ['HISTORY_PLANT']
    },

    'RequestVolumeProfileMinuteBars': {
        templateId: 208,
        description: 'Request volume profile minute bars',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'barTypePeriod': { type: 'int32', rule: 'optional' },
            'startIndex': { type: 'int32', rule: 'optional' },
            'finishIndex': { type: 'int32', rule: 'optional' },
            'userMaxCount': { type: 'int32', rule: 'optional' },
            'resumeBars': { type: 'bool', rule: 'optional' }
        },
        enums: {},
        plants: ['HISTORY_PLANT']
    },

    'RequestResumeBars': {
        templateId: 210,
        description: 'Resume bar data request',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'requestKey': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['HISTORY_PLANT']
    },

    // === ACCOUNT & LOGIN MANAGEMENT (ORDER_PLANT) ===

    'RequestLoginInfo': {
        templateId: 300,
        description: 'Request login information',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestAccountList': {
        templateId: 302,
        description: 'Request list of available trading accounts',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'userType': { type: 'UserType', rule: 'optional' }
        },
        enums: {
            'UserType': { 'USER_TYPE_FCM': 1, 'USER_TYPE_IB': 2, 'USER_TYPE_TRADER': 3 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestAccountRmsInfo': {
        templateId: 304,
        description: 'Request account risk management info',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'userType': { type: 'UserType', rule: 'optional' }
        },
        enums: {
            'UserType': { 'USER_TYPE_FCM': 1, 'USER_TYPE_IB': 2, 'USER_TYPE_TRADER': 3 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestProductRmsInfo': {
        templateId: 306,
        description: 'Request product risk management info',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestSubscribeForOrderUpdates': {
        templateId: 308,
        description: 'Subscribe for order updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestTradeRoutes': {
        templateId: 310,
        description: 'Request available trade routes',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'subscribeForUpdates': { type: 'bool', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    // === ORDER MANAGEMENT (ORDER_PLANT) ===

    'RequestNewOrder': {
        templateId: 312,
        description: 'Submit a new order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'userTag': { type: 'string', rule: 'optional' },
            'windowName': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'quantity': { type: 'int32', rule: 'optional' },
            'price': { type: 'double', rule: 'optional' },
            'triggerPrice': { type: 'double', rule: 'optional' },
            'transactionType': { type: 'TransactionType', rule: 'optional' },
            'duration': { type: 'Duration', rule: 'optional' },
            'priceType': { type: 'PriceType', rule: 'optional' },
            'tradeRoute': { type: 'string', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' },
            'trailingStop': { type: 'bool', rule: 'optional' },
            'trailByTicks': { type: 'int32', rule: 'optional' },
            'trailByPriceId': { type: 'int32', rule: 'optional' },
            'releaseAtSsboe': { type: 'int32', rule: 'optional' },
            'releaseAtUsecs': { type: 'int32', rule: 'optional' },
            'cancelAtSsboe': { type: 'int32', rule: 'optional' },
            'cancelAtUsecs': { type: 'int32', rule: 'optional' },
            'cancelAfterSecs': { type: 'int32', rule: 'optional' },
            'ifTouchedSymbol': { type: 'string', rule: 'optional' },
            'ifTouchedExchange': { type: 'string', rule: 'optional' },
            'ifTouchedCondition': { type: 'Condition', rule: 'optional' },
            'ifTouchedPriceField': { type: 'PriceField', rule: 'optional' },
            'ifTouchedPrice': { type: 'double', rule: 'optional' }
        },
        enums: {
            'TransactionType': { 'BUY': 1, 'SELL': 2 },
            'Duration': { 'DAY': 1, 'GTC': 2, 'IOC': 3, 'FOK': 4 },
            'PriceType': { 'LIMIT': 1, 'MARKET': 2, 'STOP_LIMIT': 3, 'STOP_MARKET': 4, 'MARKET_IF_TOUCHED': 5, 'LIMIT_IF_TOUCHED': 6 },
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 },
            'Condition': { 'EQUAL_TO': 1, 'NOT_EQUAL_TO': 2, 'GREATER_THAN': 3, 'GREATER_THAN_EQUAL_TO': 4, 'LESSER_THAN': 5, 'LESSER_THAN_EQUAL_TO': 6 },
            'PriceField': { 'BID_PRICE': 1, 'OFFER_PRICE': 2, 'TRADE_PRICE': 3, 'LEAN_PRICE': 4 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestModifyOrder': {
        templateId: 314,
        description: 'Modify an existing order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'windowName': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'quantity': { type: 'int32', rule: 'optional' },
            'price': { type: 'double', rule: 'optional' },
            'triggerPrice': { type: 'double', rule: 'optional' },
            'priceType': { type: 'PriceType', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' },
            'trailingStop': { type: 'bool', rule: 'optional' },
            'trailByTicks': { type: 'int32', rule: 'optional' },
            'ifTouchedSymbol': { type: 'string', rule: 'optional' },
            'ifTouchedExchange': { type: 'string', rule: 'optional' },
            'ifTouchedCondition': { type: 'Condition', rule: 'optional' },
            'ifTouchedPriceField': { type: 'PriceField', rule: 'optional' },
            'ifTouchedPrice': { type: 'double', rule: 'optional' }
        },
        enums: {
            'PriceType': { 'LIMIT': 1, 'MARKET': 2, 'STOP_LIMIT': 3, 'STOP_MARKET': 4, 'MARKET_IF_TOUCHED': 5, 'LIMIT_IF_TOUCHED': 6 },
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 },
            'Condition': { 'EQUAL_TO': 1, 'NOT_EQUAL_TO': 2, 'GREATER_THAN': 3, 'GREATER_THAN_EQUAL_TO': 4, 'LESSER_THAN': 5, 'LESSER_THAN_EQUAL_TO': 6 },
            'PriceField': { 'BID_PRICE': 1, 'OFFER_PRICE': 2, 'TRADE_PRICE': 3, 'LEAN_PRICE': 4 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestCancelOrder': {
        templateId: 316,
        description: 'Cancel an existing order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'windowName': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' }
        },
        enums: {
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 }
        },
        plants: ['ORDER_PLANT']
    },

    // === ORDER HISTORY & QUERIES (ORDER_PLANT) ===

    'RequestShowOrderHistoryDates': {
        templateId: 318,
        description: 'Request available order history dates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowOrders': {
        templateId: 320,
        description: 'Show current orders',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowOrderHistory': {
        templateId: 322,
        description: 'Show order history',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowOrderHistorySummary': {
        templateId: 324,
        description: 'Show order history summary',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'date': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowOrderHistoryDetail': {
        templateId: 326,
        description: 'Show order history detail',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' },
            'date': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    // === ADVANCED ORDER TYPES (ORDER_PLANT) ===

    'RequestOCOOrder': {
        templateId: 328,
        description: 'Submit One-Cancels-Other order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'userTag': { type: 'string', rule: 'repeated' },
            'windowName': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'symbol': { type: 'string', rule: 'repeated' },
            'exchange': { type: 'string', rule: 'repeated' },
            'quantity': { type: 'int32', rule: 'repeated' },
            'price': { type: 'double', rule: 'repeated' },
            'triggerPrice': { type: 'double', rule: 'repeated' },
            'transactionType': { type: 'TransactionType', rule: 'repeated' },
            'duration': { type: 'Duration', rule: 'repeated' },
            'priceType': { type: 'PriceType', rule: 'repeated' },
            'tradeRoute': { type: 'string', rule: 'repeated' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'repeated' },
            'trailingStop': { type: 'bool', rule: 'repeated' },
            'trailByTicks': { type: 'int32', rule: 'repeated' },
            'trailByPriceId': { type: 'int32', rule: 'repeated' },
            'cancelAtSsboe': { type: 'int32', rule: 'optional' },
            'cancelAtUsecs': { type: 'int32', rule: 'optional' },
            'cancelAfterSecs': { type: 'int32', rule: 'optional' }
        },
        enums: {
            'TransactionType': { 'BUY': 1, 'SELL': 2 },
            'Duration': { 'DAY': 1, 'GTC': 2, 'IOC': 3, 'FOK': 4 },
            'PriceType': { 'LIMIT': 1, 'MARKET': 2, 'STOP_LIMIT': 3, 'STOP_MARKET': 4 },
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestBracketOrder': {
        templateId: 330,
        description: 'Submit bracket order with targets and stops',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'userTag': { type: 'string', rule: 'optional' },
            'windowName': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'quantity': { type: 'int32', rule: 'optional' },
            'price': { type: 'double', rule: 'optional' },
            'triggerPrice': { type: 'double', rule: 'optional' },
            'transactionType': { type: 'TransactionType', rule: 'optional' },
            'duration': { type: 'Duration', rule: 'optional' },
            'priceType': { type: 'PriceType', rule: 'optional' },
            'tradeRoute': { type: 'string', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' },
            'userType': { type: 'UserType', rule: 'optional' },
            'bracketType': { type: 'BracketType', rule: 'optional' },
            'breakEvenTicks': { type: 'int32', rule: 'optional' },
            'breakEvenTriggerTicks': { type: 'int32', rule: 'optional' },
            'targetQuantity': { type: 'int32', rule: 'repeated' },
            'targetTicks': { type: 'int32', rule: 'repeated' },
            'stopQuantity': { type: 'int32', rule: 'repeated' },
            'stopTicks': { type: 'int32', rule: 'repeated' },
            'trailingStopTriggerTicks': { type: 'int32', rule: 'optional' },
            'trailingStopByLastTradePrice': { type: 'bool', rule: 'optional' },
            'targetMarketOrderIfTouched': { type: 'bool', rule: 'optional' },
            'stopMarketOnReject': { type: 'bool', rule: 'optional' },
            'targetMarketAtSsboe': { type: 'int32', rule: 'optional' },
            'targetMarketAtUsecs': { type: 'int32', rule: 'optional' },
            'stopMarketAtSsboe': { type: 'int32', rule: 'optional' },
            'stopMarketAtUsecs': { type: 'int32', rule: 'optional' },
            'targetMarketOrderAfterSecs': { type: 'int32', rule: 'optional' },
            'releaseAtSsboe': { type: 'int32', rule: 'optional' },
            'releaseAtUsecs': { type: 'int32', rule: 'optional' },
            'cancelAtSsboe': { type: 'int32', rule: 'optional' },
            'cancelAtUsecs': { type: 'int32', rule: 'optional' },
            'cancelAfterSecs': { type: 'int32', rule: 'optional' },
            'ifTouchedSymbol': { type: 'string', rule: 'optional' },
            'ifTouchedExchange': { type: 'string', rule: 'optional' },
            'ifTouchedCondition': { type: 'Condition', rule: 'optional' },
            'ifTouchedPriceField': { type: 'PriceField', rule: 'optional' },
            'ifTouchedPrice': { type: 'double', rule: 'optional' }
        },
        enums: {
            'TransactionType': { 'BUY': 1, 'SELL': 2 },
            'Duration': { 'DAY': 1, 'GTC': 2, 'IOC': 3, 'FOK': 4 },
            'PriceType': { 'LIMIT': 1, 'MARKET': 2, 'STOP_LIMIT': 3, 'STOP_MARKET': 4, 'MARKET_IF_TOUCHED': 5, 'LIMIT_IF_TOUCHED': 6 },
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 },
            'UserType': { 'USER_TYPE_ADMIN': 0, 'USER_TYPE_FCM': 1, 'USER_TYPE_IB': 2, 'USER_TYPE_TRADER': 3 },
            'BracketType': { 'STOP_ONLY': 1, 'TARGET_ONLY': 2, 'TARGET_AND_STOP': 3, 'STOP_ONLY_STATIC': 4, 'TARGET_ONLY_STATIC': 5, 'TARGET_AND_STOP_STATIC': 6 },
            'Condition': { 'EQUAL_TO': 1, 'NOT_EQUAL_TO': 2, 'GREATER_THAN': 3, 'GREATER_THAN_EQUAL_TO': 4, 'LESSER_THAN': 5, 'LESSER_THAN_EQUAL_TO': 6 },
            'PriceField': { 'BID_PRICE': 1, 'OFFER_PRICE': 2, 'TRADE_PRICE': 3, 'LEAN_PRICE': 4 }
        },
        plants: ['ORDER_PLANT']
    },

    // === BRACKET ORDER MANAGEMENT (ORDER_PLANT) ===

    'RequestUpdateTargetBracketLevel': {
        templateId: 332,
        description: 'Update target level in bracket order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' },
            'level': { type: 'int32', rule: 'optional' },
            'targetTicks': { type: 'int32', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestUpdateStopBracketLevel': {
        templateId: 334,
        description: 'Update stop level in bracket order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' },
            'level': { type: 'int32', rule: 'optional' },
            'stopTicks': { type: 'int32', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestSubscribeToBracketUpdates': {
        templateId: 336,
        description: 'Subscribe to bracket order updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowBrackets': {
        templateId: 338,
        description: 'Show bracket orders',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowBracketStops': {
        templateId: 340,
        description: 'Show bracket stop orders',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    // === UTILITY & ADMIN MESSAGES (ORDER_PLANT) ===

    'RequestListExchangePermissions': {
        templateId: 342,
        description: 'List exchange permissions for user',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'user': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestLinkOrders': {
        templateId: 344,
        description: 'Link orders together',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'repeated' },
            'ibId': { type: 'string', rule: 'repeated' },
            'accountId': { type: 'string', rule: 'repeated' },
            'basketId': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestCancelAllOrders': {
        templateId: 346,
        description: 'Cancel all orders for account',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'userType': { type: 'UserType', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' }
        },
        enums: {
            'UserType': { 'USER_TYPE_ADMIN': 0, 'USER_TYPE_FCM': 1, 'USER_TYPE_IB': 2, 'USER_TYPE_TRADER': 3 },
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestEasyToBorrowList': {
        templateId: 348,
        description: 'Subscribe to easy-to-borrow list updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'request': { type: 'Request', rule: 'optional' }
        },
        enums: {
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 }
        },
        plants: ['ORDER_PLANT']
    },

    // === PNL & POSITION MESSAGES (PNL_PLANT) ===

    'RequestPnLPositionUpdates': {
        templateId: 400,
        description: 'Subscribe to PnL and position updates',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'request': { type: 'Request', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {
            'Request': { 'SUBSCRIBE': 1, 'UNSUBSCRIBE': 2 }
        },
        plants: ['PNL_PLANT']
    },

    'RequestPnLPositionSnapshot': {
        templateId: 402,
        description: 'Request current PnL and position snapshot',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['PNL_PLANT']
    },

    // === AGREEMENTS & COMPLIANCE MESSAGES (ORDER_PLANT) ===

    'RequestListUnacceptedAgreements': {
        templateId: 500,
        description: 'List unaccepted market data agreements',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestListAcceptedAgreements': {
        templateId: 502,
        description: 'List accepted market data agreements',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestAcceptAgreement': {
        templateId: 504,
        description: 'Accept a market data agreement',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'agreementId': { type: 'string', rule: 'optional' },
            'marketDataUsageCapacity': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestShowAgreement': {
        templateId: 506,
        description: 'Show details of a market data agreement',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'agreementId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestSetRithmicMrktDataSelfCertStatus': {
        templateId: 508,
        description: 'Set Rithmic market data self-certification status',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'agreementId': { type: 'string', rule: 'optional' },
            'marketDataUsageCapacity': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    // === EXTENDED ORDER MESSAGES (ORDER_PLANT) ===

    'RequestModifyOrderReferenceData': {
        templateId: 3500,
        description: 'Modify order reference data',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'userTag': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'basketId': { type: 'string', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestOrderSessionConfig': {
        templateId: 3502,
        description: 'Request order session configuration',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'shouldDeferRequest': { type: 'bool', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestExitPosition': {
        templateId: 3504,
        description: 'Exit position with market order',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'windowName': { type: 'string', rule: 'optional' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'symbol': { type: 'string', rule: 'optional' },
            'exchange': { type: 'string', rule: 'optional' },
            'tradingAlgorithm': { type: 'string', rule: 'optional' },
            'manualOrAuto': { type: 'OrderPlacement', rule: 'optional' }
        },
        enums: {
            'OrderPlacement': { 'MANUAL': 1, 'AUTO': 2 }
        },
        plants: ['ORDER_PLANT']
    },

    'RequestReplayExecutions': {
        templateId: 3506,
        description: 'Replay historical executions',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated' },
            'fcmId': { type: 'string', rule: 'optional' },
            'ibId': { type: 'string', rule: 'optional' },
            'accountId': { type: 'string', rule: 'optional' },
            'startIndex': { type: 'int32', rule: 'optional' },
            'finishIndex': { type: 'int32', rule: 'optional' }
        },
        enums: {},
        plants: ['ORDER_PLANT']
    },

    'RequestAccountRmsUpdates': {
        templateId: 3508,
        description: 'Subscribe to account RMS updates (use request: "subscribe", updateBits: 1)',
        fields: {
            'userMsg': { type: 'string', rule: 'repeated', placeholder: '["RMS update request"]' },
            'fcmId': { type: 'string', rule: 'optional', placeholder: 'FCM ID (if known)' },
            'ibId': { type: 'string', rule: 'optional', placeholder: 'IB ID (if known)' },
            'accountId': { type: 'string', rule: 'optional', placeholder: 'Account ID (if known)' },
            'request': { type: 'string', rule: 'optional', placeholder: 'subscribe (lowercase)' },
            'updateBits': { type: 'int32', rule: 'optional', placeholder: '1 for AUTO_LIQ_THRESHOLD_CURRENT_VALUE' }
        },
        enums: {
            'UpdateBits': { 'AUTO_LIQ_THRESHOLD_CURRENT_VALUE': 1 }
        },
        plants: ['ORDER_PLANT']
    }
};

/**
 * Get all available client message names
 */
export function getClientMessageNames() {
    return Object.keys(CLIENT_MESSAGES);
}

/**
 * Get message configuration by name
 */
export function getClientMessage(messageName) {
    return CLIENT_MESSAGES[messageName];
}

/**
 * Get messages available for a specific plant type
 */
export function getMessagesForPlant(plantType) {
    const plantName = {
        1: 'TICKER_PLANT',
        2: 'ORDER_PLANT', 
        3: 'HISTORY_PLANT',
        4: 'PNL_PLANT'
    }[plantType];

    if (!plantName) return [];

    return Object.entries(CLIENT_MESSAGES)
        .filter(([name, config]) => config.plants.includes(plantName))
        .map(([name]) => name);
}

/**
 * Get field definitions for a message
 */
export function getMessageFields(messageName) {
    const config = CLIENT_MESSAGES[messageName];
    return config ? config.fields : {};
}

/**
 * Get enum definitions for a message
 */
export function getMessageEnums(messageName) {
    const config = CLIENT_MESSAGES[messageName];
    return config ? config.enums : {};
}

/**
 * Get required fields for a message (fields with rule 'required')
 */
export function getRequiredFields(messageName) {
    const fields = getMessageFields(messageName);
    return Object.entries(fields)
        .filter(([name, def]) => def.rule === 'required')
        .map(([name]) => name);
}

/**
 * Get optional fields for a message (fields with rule 'optional')
 */
export function getOptionalFields(messageName) {
    const fields = getMessageFields(messageName);
    return Object.entries(fields)
        .filter(([name, def]) => def.rule === 'optional')
        .map(([name]) => name);
}

/**
 * Get repeated fields for a message (fields with rule 'repeated')
 */
export function getRepeatedFields(messageName) {
    const fields = getMessageFields(messageName);
    return Object.entries(fields)
        .filter(([name, def]) => def.rule === 'repeated')
        .map(([name]) => name);
}

/**
 * Validate message data against field definitions
 */
export function validateMessageData(messageName, data) {
    const config = CLIENT_MESSAGES[messageName];
    if (!config) {
        throw new Error(`Unknown client message: ${messageName}`);
    }

    const requiredFields = getRequiredFields(messageName);
    const missing = requiredFields.filter(field => 
        data[field] === undefined || data[field] === null || data[field] === ''
    );

    if (missing.length > 0) {
        throw new Error(`Missing required fields for ${messageName}: ${missing.join(', ')}`);
    }

    return true;
}

/**
 * Validate enum value for a field
 */
export function validateEnumValue(messageName, fieldName, value) {
    const enums = getMessageEnums(messageName);
    const fields = getMessageFields(messageName);
    
    const fieldDef = fields[fieldName];
    if (!fieldDef) return true; // Field doesn't exist
    
    const enumDef = enums[fieldDef.type];
    if (!enumDef) return true; // Not an enum field
    
    // Check if value is valid enum value (by name or by number)
    const validValues = Object.values(enumDef);
    const validNames = Object.keys(enumDef);
    
    return validValues.includes(value) || validNames.includes(value);
}

/**
 * Convert enum name to enum value
 */
export function getEnumValue(messageName, fieldName, enumName) {
    const enums = getMessageEnums(messageName);
    const fields = getMessageFields(messageName);
    
    const fieldDef = fields[fieldName];
    if (!fieldDef) return null;
    
    const enumDef = enums[fieldDef.type];
    if (!enumDef) return null;
    
    return enumDef[enumName] || null;
}

/**
 * Get all enum options for a field
 */
export function getEnumOptions(messageName, fieldName) {
    const enums = getMessageEnums(messageName);
    const fields = getMessageFields(messageName);
    
    const fieldDef = fields[fieldName];
    if (!fieldDef) return [];
    
    const enumDef = enums[fieldDef.type];
    if (!enumDef) return [];
    
    return Object.entries(enumDef).map(([name, value]) => ({ name, value }));
}