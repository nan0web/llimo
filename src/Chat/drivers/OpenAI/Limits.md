# Limits:

## GPT-4.1

### Error

```
429 Request too large for gpt-4.1 in organization org-IGFSC87hwg9oDTHPLgNawweQ on tokens per min (TPM): Limit 30000, Requested 42257. The input or output tokens must be reduced in order to run successfully. Visit https://platform.openai.com/account/rate-limits to learn more.
    at APIError.generate (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/core/error.mjs:59:20)
    at OpenAI.makeStatusError (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/client.mjs:156:32)
    at OpenAI.makeRequest (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/client.mjs:301:30)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async OpenAIDriver.stream (file:///Users/i/src/nan.web/packages/app/src/llm/Chat/drivers/ChatDriver.js:318:19)
    at async CoderAgent.process (file:///Users/i/src/nan.web/packages/app/src/llm/agents/Agent/Agent.js:135:20)
    at async processInput (file:///Users/i/src/nan.web/packages/app/apps/core/App.js:465:29)
    at async processChat (file:///Users/i/src/nan.web/packages/app/apps/core/App.js:511:13)
    at async file:///Users/i/src/nan.web/packages/app/apps/core/App.js:566:4 {
  status: 429,
  headers: Headers {
    date: 'Sun, 20 Jul 2025 11:24:20 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '406',
    connection: 'keep-alive',
    vary: 'Origin',
    'x-ratelimit-limit-requests': '500',
    'x-ratelimit-limit-tokens': '30000',
    'x-ratelimit-remaining-requests': '499',
    'x-ratelimit-remaining-tokens': '29999',
    'x-ratelimit-reset-requests': '120ms',
    'x-ratelimit-reset-tokens': '0s',
```

## GPT-4o

### Error

```
unable to complete request Error: 429 Request too large for gpt-4o in organization org-IGFSC87hwg9oDTHPLgNawweQ on t          RateLimitError: 429 Request too large for gpt-4o in organization org-IGFSC87hwg9oDTHPLgNawweQ on tokens per min (TPM): Limit 30000, Requested 42257. The input or output tokens must be reduced in order to run successfully. Visit https://platform.openai.com/account/rate-limits to learn more.
    at APIError.generate (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/core/error.mjs:59:20)
    at OpenAI.makeStatusError (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/client.mjs:156:32)
    at OpenAI.makeRequest (file:///Users/i/node_modules/.pnpm/openai@5.9.2_ws@8.18.3/node_modules/openai/client.mjs:301:30)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async OpenAIDriver.stream (file:///Users/i/src/nan.web/packages/app/src/llm/Chat/drivers/ChatDriver.js:318:19)
    at async CoderAgent.process (file:///Users/i/src/nan.web/packages/app/src/llm/agents/Agent/Agent.js:135:20)
    at async processInput (file:///Users/i/src/nan.web/packages/app/apps/core/App.js:465:29)
    at async processChat (file:///Users/i/src/nan.web/packages/app/apps/core/App.js:511:13)
    at async file:///Users/i/src/nan.web/packages/app/apps/core/App.js:566:4 {
  status: 429,
  headers: Headers {
    date: 'Sun, 20 Jul 2025 11:25:35 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '405',
    connection: 'keep-alive',
    vary: 'Origin',
    'x-ratelimit-limit-requests': '500',
    'x-ratelimit-limit-tokens': '30000',
    'x-ratelimit-remaining-requests': '499',
    'x-ratelimit-remaining-tokens': '29999',
    'x-ratelimit-reset-requests': '120ms',
    'x-ratelimit-reset-tokens': '0s',
    'x-request-id': 'req_f1b2d51aac2075d1c02f4887cef52a1f',
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    'cf-cache-status': 'DYNAMIC',
    'set-cookie': '__cf_bm=Qhzgm7t9h2HLUHmbjdijTEz_Nb1L0p47Exf6kinICpI-1753010735-1.0.1.1-s_gMxZODprSfpDl226ktl_lvLwlBxdT1hZc3NsLybHumLDo9apIfhZj_9WGUoL1S1RxQYyYSiZmAMKaXfvY5HKhfmw7J7SLbyMQ0RG5aIL0; path=/; expires=Sun, 20-Jul-25 11:55:35 GMT; domain=.api.openai.com; HttpOnly; Secure; SameSite=None, _cfuvid=1RMU_BkFWIfX2ZYJZPEOG5OCPupKFgEeDqaUD5y2nok-1753010735965-0.0.1.1-604800000; path=/; domain=.api.openai.com; HttpOnly; Secure; SameSite=None',
    'x-content-type-options': 'nosniff',
    server: 'cloudflare',
    'cf-ray': '96221944cf68d58b-KBP',
    'alt-svc': 'h3=":443"; ma=86400'
  },
  requestID: 'req_f1b2d51aac2075d1c02f4887cef52a1f',
  error: {
    message: 'Request too large for gpt-4o in organization org-IGFSC87hwg9oDTHPLgNawweQ on tokens per min (TPM): Limit 30000, Requested 42257. The input or output tokens must be reduced in order to run successfully. Visit https://platform.openai.com/account/rate-limits to learn more.',
    type: 'tokens',
    param: null,
    code: 'rate_limit_exceeded'
  },
  code: 'rate_limit_exceeded',
  param: null,
  type: 'tokens'
}
```
