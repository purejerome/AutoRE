let runState = { running: false, done: undefined, total: undefined,
     doneRequests: undefined, totalRequests: undefined };

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'start') {
    runState = { running: true, done: 0, total: msg.total, 
      doneRequests: undefined , totalRequests: undefined };
    chrome.runtime.sendMessage({ action: "openLoading" });
    sendResponse({ ok: true });
    return;
  }
  if (msg.action === 'progress') {
    runState.done = msg.done;
    return;
  }
  if(msg.action === 'startRequests') {
    runState.doneRequests = 0;
    runState.totalRequests = msg.totalRequests;
    sendResponse({ ok: true });
    return;
  }
  if( msg.action === 'progressRequests') {
    runState.doneRequests = msg.doneRequests;
    return;
  }
  if (msg.action === 'finish') {
    runState.running = false;
    runState.done = undefined;
    runState.total = undefined;
    runState.doneRequests = undefined;
    runState.totalRequests = undefined;
    chrome.runtime.sendMessage({ action: "closeLoading"});
    return;
  }
  if (msg.action === 'getState') {
    sendResponse(runState);
    return;
  }
});


// chrome.alarms.onAlarm.addListener((alarm) => {
//     console.log("good")
//     if(alarm.name == "repostAlarm"){
//         chrome.notifications.create({
//             title: 'Repost Alarm',
//             message: 'You are now able to start reposting!',
//             iconUrl: '/images/AutoRELogo.png',
//             type: 'basic'
//         });
//     }
// });
