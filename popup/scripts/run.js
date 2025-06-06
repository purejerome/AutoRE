const followInput = document.getElementById("follower-count");
const repostInput = document.getElementById("repost-amount");
const start_button = document.getElementById("start");
const splash_text = document.getElementById("splash-text");
const loadingview = body.querySelector("#loadingview");
const loginviewRun = body.querySelector("#loginview");

function toggleButtonState(){
    const buttonState = followInput.value.trim() && repostInput.value.trim();
    start_button.disabled = !buttonState;
}

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
    if(combinedValue < 0 || combinedValue > 10){
        e.preventDefault();
    }
});

followInput.addEventListener("input", toggleButtonState);
repostInput.addEventListener("input", toggleButtonState);

const injected = new Set();

start_button.addEventListener('click',  async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  const followers = parseInt(followInput.value, 10);
  const repostsRemaining = parseInt(repostInput.value, 10);
  
  splash_text.innerText = `0 out of ${repostsRemaining} reposts successfully handled.`;
  
  const respostValueFromFollowers = Math.floor(followers / 100) + 1;
  
  console.log("Sending message to tab: ", tab.id);
  try{
    const pingResponse = await chrome.tabs.sendMessage(tab.id, { ping: true })
    console.log("ping response", pingResponse);
  }catch{
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
    console.log(chrome.runtime.lastError);
  }
  try{
    const runResponse = await chrome.tabs.sendMessage(tab.id, { action: 'startclicker', respostValue: respostValueFromFollowers, reposts: repostsRemaining });
    console.log("Run response:", runResponse);
  }catch{
    console.error("Error sending startclicker message:", chrome.runtime.lastError);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openLoading') {
        turnOnLoadingView();
    } else if (request.action === 'closeLoading') {
        turnOffLoadingView();
    }
    return true;
});

function turnOnLoadingView(){
    loadingview.classList.remove("hidden");
    loginviewRun.classList.add("hidden");
}

function turnOffLoadingView(){
    loadingview.classList.add("hidden");
    loginviewRun.classList.remove("hidden");
}


// loadingview.classList.remove("hidden");
// loginviewRun.classList.add("hidden");



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateSplashText') {
            splash_text.innerText = request.text;
        }
        return true;
    }
);
