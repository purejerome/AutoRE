// const start_button = document.getElementById("start")

// const injected = new Set();

// start_button.addEventListener("click", async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     console.log("cliecked")
    
//     if (tab) {
//         chrome.scripting.executeScript(
//             {
//                 target: { tabId: tab.id },
//                 files: ["/popup/scripts/content.js"],
//             },
//             async () => {
//                 await chrome.tabs.sendMessage(tab.id, { action: "startclicker" }, (response) => {
//                     if (response && response.outcome === "success") {
//                         console.log("good job");
//                         console.log(response);
//                     }
//                 });
//             }
//         );
//     }
// })

const start_button = document.getElementById("start")

const injected = new Set();

start_button.addEventListener('click',  async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

//   console.log("Starting clicker on tab: ", tab.id);
//   console.log(injected);
//   console.log(!injected.has(tab.id));
//   if (!injected.has(tab.id)) {
//     await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['/popup/scripts/content.js']
//     });
//     injected.add(tab.id);
//   }
//   console.log("made it")
  console.log("Sending message to tab: ", tab.id);
  chrome.tabs.sendMessage(tab.id, { ping: true }, async (response) => {
    console.log("sending")
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['popup/scripts/content.js'],
      });
      console.log("SENDING SENGIN")
    }
    chrome.tabs.sendMessage(tab.id, { action: 'startclicker' });
})
//   chrome.tabs.sendMessage(tab.id, { action: 'startclicker' });
});
