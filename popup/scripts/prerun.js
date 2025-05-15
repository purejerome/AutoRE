const REURL = "https://repostexchange.com/";
const LOGIN_URL = "https://repostexchange.com/welcome";


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
    console.log("hello")
    const body = document.querySelector("body");
    const logoutview = body.querySelector("#logoutview");
    const loginview = body.querySelector("#loginview");
    const fourofourview = body.querySelector("#fourofourview");
    console.log(logoutview)
    console.log(tab.url)
    console.log(tab.url.startsWith(LOGIN_URL))
    if(!tab.url.startsWith(REURL)){
        loginview.classList.add("hidden");
        logoutview.classList.add("hidden");
        fourofourview.classList.remove("hidden");
    }
    else{
        if(tab.url.startsWith(LOGIN_URL)){
            loginview.classList.add("hidden");
            logoutview.classList.remove("hidden");
            fourofourview.classList.add("hidden");
        }
        else{
            loginview.classList.remove("hidden");
            logoutview.classList.add("hidden");
            fourofourview.classList.add("hidden");
        }
    }
}
