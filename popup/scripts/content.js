// ,
//   "content_scripts": [
//     {
//       "matches": ["https://repostexchange.com/*"],
//       "js": ["/popup/scripts/content.js"]
//     }
//   ]



async function objectFinder(findingFunction){
    let objects = null;
    let find_attempts = 0;
    while(objects == null && find_attempts < 10){
        objects = findingFunction();
        if(objects == null){
            find_attempts++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }else{
            return objects;
        }
    }
    return objects;
}

function checkAmount(){
    
}

async function handleMainRunThrough(){
    console.log("in")
    let reaminingReposts = 10;
    while(reaminingReposts > 0){
        const musicSections = await objectFinder(() => {
                        let mSections = document.querySelectorAll(".pd-jsxFDi");
                        if(mSections.length <= 0){
                            mSections = null;
                        }
                        return Array.from(mSections).slice(0, reaminingReposts);
                    });
        if(musicSections == null){
            return "bad";
        }
        for(let i = 0; i < musicSections.length; i++){
            const grayButton = musicSections[i].querySelector("button");
            const amount = grayButton.innerText;
        }
        reaminingReposts = 0
        console.log(reaminingReposts)
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "startclicker") {
        const location = window.location.href;
        const campaigns = document.querySelector('a[href="/browse/campaigns/recommended"]')
        if(!location.includes("/browse/campaigns/recommended")){
            if(campaigns){
                campaigns.click()
                    
                // const observer = new MutationObserver((mutationsList, observer) => {
                //     const targetContent = document.querySelectorAll(".pd-jsxFDi");
                //     if (targetContent.length >= 11) {
                //         observer.disconnect();
                //         console.log("Disconnecting observer");
                //         handleMainRunThrough()
                //     }
                // });
                // observer.observe(document.body, { childList: true, subtree: true });
            }else{
                sendResponse({ outcome: "error", message: "Campaigns link not found" })
                return
            }
        }
        const outcome = await handleMainRunThrough()
        if(outcome == "good"){
            sendResponse({ outcome: "success" });
        }else if(outcome == "bad"){
            sendResponse({ outcome: "error", message: "Error in main run through" })
        }
    }
});
