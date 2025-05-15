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
    if(tab.url.startsWith(LOGIN_URL)){
        let body = document.querySelector("body");
        body.innerHTML = `
        <div class="container">
            <h1>Login to Repost Exchange</h1>
            <p>To use this extension, please log in to your Repost Exchange account.</p>
            <p>Once you are logged in, please refresh this page.</p>
            </div>
            `
    }
    else{
        let body = document.querySelector("body");
        body.innerHTML = `
        <div class="container">
            <h1>Repost Exchange</h1>
            <p>Welcome to Repost Exchange!</p>
            <p>To use this extension, please log in to your Repost Exchange account.</p>
            <p>Once you are logged in, please refresh this page.</p>
            </div>
            `
    }
}
