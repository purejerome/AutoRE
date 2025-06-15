const REURL = "https://repostexchange.com/";
const LOGIN_URL = "https://repostexchange.com/welcome";

const body = document.querySelector("body");
const logoutview = body.querySelector("#logoutview");
const loginview = body.querySelector("#loginview");
const fourofourview = body.querySelector("#fourofourview");
const loadingview2 = body.querySelector("#loadingview");
const splash_text2 = loadingview2.querySelector("#splash-text");


document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.startsWith(REURL)) {
        chrome.tabs.update(tab.id, { url: REURL });
    }
    
    handleTab(tab)
    
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (tab.active && changeInfo.url) {
            handleTab(tab);
        }
    }) 
})

async function handleTab(tab){
    const { running, done, total, 
        doneRequests, totalRequests } = await chrome.runtime.sendMessage({ action: "getState" });
    console.log("Current state:", { running, done, total, doneRequests, totalRequests });
    if(running){
        loginview.classList.add("hidden");
        logoutview.classList.add("hidden");
        fourofourview.classList.add("hidden");
        loadingview2.classList.remove("hidden");
        if(doneRequests !== undefined && totalRequests !== undefined){
            splash_text2.innerText = `${doneRequests} out of ${totalRequests} requests successfully handled.`;
        }
        else if(done !== undefined && total !== undefined){
            splash_text2.innerText = `${done} out of ${total} reposts successfully handled.`;
        }
        else{
            splash_text2.innerText = "Loading...";
        }
        return;
    }
    
    if(!tab.url.startsWith(REURL)){
        loginview.classList.add("hidden");
        logoutview.classList.add("hidden");
        loadingview2.classList.add("hidden");
        fourofourview.classList.remove("hidden");
    }
    else{
        if(tab.url.startsWith(LOGIN_URL)){
            loginview.classList.add("hidden");
            logoutview.classList.remove("hidden");
            fourofourview.classList.add("hidden");
            loadingview2.classList.add("hidden");
        }
        else{
            loginview.classList.remove("hidden");
            logoutview.classList.add("hidden");
            fourofourview.classList.add("hidden");
            loadingview2.classList.add("hidden");
        }
    }
}
