# PFMON Project File Tree

```
D:\Coding\PFMON\
├── .claude/
│   └── settings.local.json
├── AWS/
│   ├── api-gateway-documentation.md
│   ├── aws-infrastructure-production.yaml
│   └── lambda-functions/
│       ├── api-journal-entries.js
│       ├── api-user-profiles.js
│       ├── layers/
│       │   └── pfmon-jwt-layer-v2.zip
│       └── post-registration-trigger.js
├── public/
│   └── index.html
├── Rithmic/
│   ├── config/
│   │   ├── client-messages.js
│   │   ├── credentials.json
│   │   └── systems.js
│   ├── connection/
│   │   ├── connection-manager.js
│   │   └── message-decoder.js
│   ├── proto-factory/
│   │   ├── index.js
│   │   ├── lightweight-reader.js
│   │   ├── lightweight-writer.js
│   │   ├── proto-factory.js
│   │   ├── test-factory.js
│   │   └── type-mapper.js
│   ├── app.js
│   ├── index.html
│   ├── protos.json
│   ├── README.md
│   ├── Reference_Guide.pdf
│   ├── style.css
│   └── template-mapping.js
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ConnectionWidget.jsx
│   │   │   ├── QuickStatsCard.jsx
│   │   │   ├── RecentTradesWidget.jsx
│   │   │   └── SystemStatusCard.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── AWSTest.jsx
│   │   └── JournalApiTest.jsx
│   ├── context/
│   │   ├── ConnectionContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── auth/
│   │   │   └── useAuth.js
│   │   ├── data/
│   │   │   └── useAnalytics.js
│   │   ├── trading/
│   │   │   └── useConnections.js
│   │   └── useApi.js
│   ├── pages/
│   │   ├── Accounts.jsx
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Journal.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── auth/
│   │   │   └── AuthService.js
│   │   ├── data/
│   │   │   ├── AnalyticsService.js
│   │   │   └── JournalService.js
│   │   ├── trading/
│   │   │   └── ConnectionService.js
│   │   └── ApiService.js
│   ├── App.jsx
│   ├── aws-config.js
│   ├── index.css
│   └── index.js
├── API_ENDPOINTS.md
├── API_INTEGRATION_TEST_SUMMARY.md
├── CURRENT_INFRASTRUCTURE_STATUS.md
├── INTEGRATION_PLAN.md
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

**Total Files:** 60
**Excluded:** node_modules, DELETE folders, .git