const followInput = document.getElementById("follower-count");
const repostInput = document.getElementById("repost-amount");

followInput.addEventListener("keydown", (e) => {
    const num = parseInt(e.key, 10);
    if(isNaN(num)) return;
    const combinedValue = parseInt(String(followInput.value) + String(num));
    if(combinedValue < 1){
        e.preventDefault();
    }
});
repostInput.addEventListener("keydown", (e) => {
    const num = parseInt(e.key, 10);
    if(isNaN(num)) return;
    const combinedValue = parseInt(String(repostInput.value) + String(num));
    if(combinedValue < 1 || combinedValue > 10){
        e.preventDefault();
    }
});

const start_button = document.getElementById("start")

const injected = new Set();

start_button.addEventListener('click',  async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  console.log("Sending message to tab: ", tab.id);
  chrome.tabs.sendMessage(tab.id, { ping: true }, async (response) => {
    console.log("sending")
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['popup/scripts/SC_Widget.js'],
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['popup/css/color_fades.css'],
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['popup/scripts/content.js'],
      });
      console.log("SENDING SENGIN")
    }
    chrome.tabs.sendMessage(tab.id, { action: 'startclicker' });
})
});
