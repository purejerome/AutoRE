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

  console.log("Starting clicker on tab: ", tab.id);
  console.log(injected);
  console.log(!injected.has(tab.id));
  if (!injected.has(tab.id)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['/popup/scripts/content.js']
    });
    injected.add(tab.id);
  }

  chrome.tabs.sendMessage(tab.id, { action: 'startclicker' });
});
