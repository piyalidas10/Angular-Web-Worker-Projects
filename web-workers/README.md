# WebWorkers

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.0.

## Large JSON parsing
### Create Web workers
1. Generate a Web Worker (Angular 19)
```
ng generate web-worker shared/json-parser
```
2. This configures your project to use web workers, if it isn't already.
```
web-workers\src\app\shared\json-parser.worker.ts
web-workers\tsconfig.worker.json
```

### Complete Data Flow (Important)
```
Main Thread
   |
   | worker.postMessage(JSON string)
   v
Worker Thread
   |
   | JSON.parse()
   v
Worker Thread
   |
   | postMessage(result)
   v
Main Thread
```

### Web worker code explaination

```
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
 try {
    // data is a JSON string
    const parsed = JSON.parse(data);

    postMessage({
      success: true,
      payload: parsed
    });
  } catch (error) {
    postMessage({
      success: false,
      error: (error as Error).message
    });
  }
});

```

1️⃣ Triple-slash directive
    -   This tells TypeScript that this file runs in a Web Worker context, not in the browser main thread.
    -   It loads worker-specific type definitions (postMessage, addEventListener, MessageEvent, etc.).

    🔴 Without this line

    -   TypeScript would complain:
        ```
        Cannot find name 'postMessage'
        Property 'data' does not exist on type 'Event'
        ```
    -   Very common when writing Angular workers. 
        ```
        addEventListener('message', ({ data }) => {
        ```
2️⃣ Register a message listener
    -   Listens for messages sent from the main thread using:
        worker.postMessage(...)
    -   'message' is the standard event fired when data arrives.

3️⃣ Send success response back to main thread
    -   postMessage sends data from worker → main thread.
    -   You’re sending a structured object:
        -   success: true → operation succeeded
        -   payload: parsed → parsed JSON result

### Visual comparison (important)
🧵 Inside a Web Worker
```
self.postMessage(data); // ✔ correct
postMessage(data);     // ✔ shorthand
window.postMessage     // ❌ DOES NOT EXIST
===========================================================
🧠 Inside Main Thread
worker.postMessage(data); // ✔ send to worker
window.postMessage(data); // ✔ cross-window messaging
```

### Where does this postMessage come from?

You are inside a Web Worker file.
```
addEventListener('message', ({ data }) => {
  ...
  postMessage(...)
});
```

In a worker context, the global object is NOT window.

👉 Worker global scope
    -   Dedicated Worker → DedicatedWorkerGlobalScope
    -   Shared Worker → SharedWorkerGlobalScope

In both cases:

postMessage === self.postMessage


✅ This is Worker → Main Thread communication

Why it works without window.
Main thread:
```
window.postMessage(...)  // browser tab ↔ tab / iframe
```

Worker thread:
```
postMessage(...)         // worker ↔ main thread
```

Different APIs, same method name.

## Real-time Market Calculation
Below is a real-world, production-style “Real-time Market Calculation” example using Web Workers in Angular 19, very close to what you’d do for stocks / crypto / trading dashboards.

### 🎯 Use case (realistic)

Incoming stream:
  - Live price ticks (WebSocket / polling)
  - Thousands of updates per second

Heavy calculations:
  - VWAP
  - Moving Average
  - High / Low
  - Volume aggregation
  - % Change

⚠️ Doing this on the UI thread = frozen charts
✅ Solution = Web Worker
```
WebSocket / API
      |
      | raw ticks
      v
Angular Service
      |
      | postMessage()
      v
Market Worker (CPU heavy)
      |
      | for-loops + aggregation
      v
Angular Component
      |
      | Signals / Change Detection
      v
UI (charts, tables)
```
### When THIS pattern is used in real systems

✅ Trading dashboards
✅ Order book aggregation
✅ Chart indicators (EMA, RSI, VWAP)
✅ Risk calculations
✅ Market surveillance

Web Workers are the “calculation engine” of real-time Angular apps.
Angular handles UI.
Workers handle math.