const followInput = document.getElementById("follower-count");
const repostInput = document.getElementById("repost-amount");
const start_button = document.getElementById("start");
const cancel_button = document.getElementById("cancel");
const splash_text = document.getElementById("splash-text");
const loadingview = body.querySelector("#loadingview");
const loginviewRun = body.querySelector("#loginview");
let tabID = null;

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
// start_button.addEventListener('click', async () => {
//     chrome.notifications.create({
//         type: 'basic',
//         iconUrl: '/images/AutoRELogo.png',
//         title: 'Error',
//         message: 'There was an error in reposting tracks.',
//     });
// })

start_button.addEventListener('click',  async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  tabID = tab.id;
  
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
    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['popup/css/toast.css'],
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
    if (runResponse && runResponse.error) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '/images/AutoRELogo.png',
            title: 'Success',
            message: 'Reposting ending successfully(or mostly at least).',
        });
    }else{
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '/images/AutoRELogo.png',
            title: 'Error',
            message: 'There were many errors when reposting tracks.',
        });
    }
  }catch{
    console.error("Error sending startclicker message:", chrome.runtime.lastError);
  }
});

cancel_button.addEventListener('click', async () => {
    chrome.tabs.reload(tabID, { bypassCache: true });
    await chrome.runtime.sendMessage({ action: 'finish' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openLoading') {
        turnOnLoadingView();
    } else if (request.action === 'closeLoading') {
        turnOffLoadingView();
    }
    return;
});

function turnOnLoadingView(){
    loadingview.classList.remove("hidden");
    loginviewRun.classList.add("hidden");
}

function turnOffLoadingView(){
    loadingview.classList.add("hidden");
    loginviewRun.classList.remove("hidden");
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'loading' && tabId === tabID) {
//         console.log(`Tab ${tabId} is reloading...`);
//         chrome.runtime.sendMessage({ action: 'finish' });
//     }
// });


// loadingview.classList.remove("hidden");
// loginviewRun.classList.add("hidden");



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateSplashText') {
            splash_text.innerText = request.text;
        }
        return;
    }
);
