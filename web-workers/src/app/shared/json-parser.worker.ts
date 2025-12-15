
/**
 * A simple web worker that parses JSON strings.
 * It listens for messages containing JSON strings,
 * parses them, and posts back the parsed object or an error message.
 * 
 * 
 * /// <reference lib="webworker" />
 * This tells TypeScript that this file runs in a Web Worker context, not in the browser main thread.
 * It loads worker-specific type definitions (postMessage, addEventListener, MessageEvent, etc.).
 */

/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  // addEventListener listens for messages sent to the worker
 try {
    // data is a JSON string
    const parsed = JSON.parse(data);

    postMessage({ // worker ↔ main thread
      success: true,
      payload: parsed
    });
  } catch (error) {
    postMessage({ // worker ↔ main thread
      success: false,
      error: (error as Error).message
    });
  }
});
