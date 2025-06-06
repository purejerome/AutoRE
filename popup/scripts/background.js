let runState = { running: false, done: undefined, total: undefined };

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'start') {
    runState = { running: true, done: 0, total: msg.total };
    chrome.runtime.sendMessage({ action: "openLoading" });
    sendResponse({ ok: true });
    return;
  }
  if (msg.action === 'progress') {
    runState.done = msg.done;
    return;
  }
  if (msg.action === 'finish') {
    runState.running = false;
    runState.done = undefined;
    runState.total = undefined;
    chrome.runtime.sendMessage({ action: "closeLoading"});
    return;
  }
  if (msg.action === 'getState') {
    sendResponse(runState);
    return;
  }
});
