
async function objectFinder(findingFunction, timeout = 1000) {
    let objects = null;
    let find_attempts = 0;
    while(objects == null && find_attempts < 10){
        objects = findingFunction();
        if(objects == null){
            find_attempts++;
            await new Promise((resolve) => setTimeout(resolve, timeout));
        }else{
            return objects;
        }
    }
    return objects;
}

function checkAmount(button, repostValue){
    const amount = button.innerText;
    return amount.includes(`${repostValue}`)
}

async function playSong(soundCloudWidget, timeout = 1000) {
    soundCloudWidget.play()
    soundCloudWidget.pause()
}

function waitForWidgetReady(iframe, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!iframe) return reject(new Error("iframe is null"));

    let widget = SC.Widget(iframe);
    if (widget != null) {
        resolve(widget);
    }

    const timer = setTimeout(() => reject(new Error("READY timeout")), timeout);
    const onReady = () => {
      clearTimeout(timer);
      resolve(widget);
    };
    while(widget == null){
        widget = SC.Widget(iframe);
        if(widget != null){
            onReady();
        }
    }
  });
}

function setColor(element, color, pending){
    if(pending){
        element.style.setProperty('background-color', color, 'important');
        element.classList.add("pluse-bg");
    }else{
        element.style.removeProperty('background-color');
        element.classList.remove("pluse-bg");
        element.style.setProperty('background-color', color, 'important');
    }
}

async function modalWalkThrough(modal){
    const buttons = await objectFinder(() => {
        let buttonElements = modal.querySelectorAll("button");
        if(buttonElements.length <= 0){
            return null;
        }
        return Array.from(buttonElements);
    }, 500);
    if(buttons == null){
        console.log("no buttons found");
        return "bad";
    }
    const inputs = await objectFinder(() => {
        let inputElements = modal.querySelectorAll("input");
        if(inputElements.length <= 0){
            return null;
        }
        return Array.from(inputElements);
    }, 500);
    if(inputs == null){
        console.log("no inputs found");
        return "bad";
    }
    for(let i = 0; i < inputs.length; i++){
        if(i < inputs.length - 1){
            if(inputs[i].type == "checkbox" && inputs[i].checked && !inputs[i].disabled){
                inputs[i].click();
            }
        }else{
            const parent = inputs[i].parentElement.parentElement.parentElement;
            const plus_one_container = parent.querySelector(".col-4");
            if(plus_one_container == null){
                inputs[i].click();
            }else{
                if(!plus_one_container.innerText.includes("1")){
                    inputs[i].click();
                }
            }
            
        }
    }
    buttons[1].click();
    count = 0;
    
    const error_toast = await objectFinder(() => {
        let toast = document.querySelector(".Toastify__toast--error");
        return toast;
    }, 500);
    
    if(error_toast != null){
        buttons[0].click();
        console.log(error_toast.innerText)
        console.log("error toast found");
        if(error_toast.innerText.includes("You have reached your 12-hour repost limit.")){
            return "super_bad";
        }
        return "bad";
    }
    
    let old_modal = modal;
    while(count < 3){
        const new_modal = await objectFinder(() => {
            let new_modal = document.querySelector(".modal-content");
            if(new_modal == null || new_modal == old_modal){
                return null;
            }
            return new_modal;
        }, 500);
        if(new_modal == null && count < 2){
            console.log("no new modal found");
            return "bad";
        }
        
        if(new_modal != null){
            const close_button = new_modal.querySelector("button");
            close_button.click();
            old_modal = new_modal;
        }
        count++;
    }
}

async function runThroughSongs(musicSections, reaminingReposts, 
    errorCounts, repostValue, totalReposts){
    let valueError = 0;
    for(let i = 0; i < musicSections.length && errorCounts < 6; i++){
            setColor(musicSections[i], 'orange', true);
            if(!checkAmount(musicSections[i].querySelector("button"), repostValue)){
                musicSections[i].style.removeProperty('background-color');
                musicSections[i].classList.remove("pluse-bg");
                musicSections[i].style.setProperty('background-color', 'gray', 'important');
                valueError++;
                if(valueError >= 5){
                    errorCounts = 6;
                }
                continue;
            }
            const bounds = musicSections[i].getBoundingClientRect()
            window.scrollTo(0, bounds.top + window.scrollY - 100);
            const frame = await objectFinder(() => {
                let f = musicSections[i].querySelector("iframe");
                return f;
            })
            try{
                var soundCloudWidget = await waitForWidgetReady(frame)
                frame.click()
                frame.click()
                frame.click()
                for(let j = 0; j < 3; j++){
                    await playSong(soundCloudWidget);
                }
                const pauseButton = await objectFinder(() => {
                    let pause = document.querySelector("img[alt='Pause']");
                    return pause;
                }, 500);
                await new Promise((resolve) => setTimeout(resolve, 7000));
                pauseButton.click();
                const button = musicSections[i].querySelector("button");
                if(button.disabled){
                    setColor(musicSections[i], 'red', false);
                    console.log("button disabled")
                    errorCounts++;
                    continue;
                }
                button.click();
                
                const popup_modal = await objectFinder(() => {
                    let pop = document.querySelector(".modal-content");
                    return pop;
                });
                
                if(popup_modal == null){
                    console.log("no popup modal")
                    setColor(musicSections[i], 'red', false);
                    console.log("no popup modal")
                    errorCounts++;
                    continue;
                }
                
                const modalWalkResult = await modalWalkThrough(popup_modal);
                if(modalWalkResult == "bad"){
                    console.log("bad modal walkthrough")
                    setColor(musicSections[i], 'red', false);
                    errorCounts++;
                    continue;
                } else if(modalWalkResult == "super_bad"){
                    console.log("super bad modal walkthrough")
                    setColor(musicSections[i], 'red', false);
                    reaminingReposts = 0;
                    errorCounts = 6;
                    continue;
                }
                
                setColor(musicSections[i], 'green', false);
                reaminingReposts--;
                totalReposts++;
                updateSplashText(totalReposts);
            }catch(e){
                console.log("no frame?")
                setColor(musicSections[i], 'red', false);
                errorCounts++;
            }
            await new Promise((resolve) => setTimeout(resolve, 3500));
        }
        return {reaminingReposts, errorCounts, totalReposts}
}

async function findNextButton(currentPage){
    let nextButton = null;
    const pagination = await objectFinder(() => {
        let pag = document.querySelector(".pagination");
        return pag;
    }, 500);
    
    const pageButtons = pagination.querySelectorAll(".page-item .page-link");
    const pageButtonsArray = Array.from(pageButtons);
    
    if(currentPage == 1){
        const activePage = pagination.querySelector(".page-item.active .page-link");
        if(activePage.innerText != "1"){
            pageButtonsArray[1].click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
    
    for(let i = 0; i < pageButtonsArray.length; i++){
        if(parseInt(pageButtonsArray[i].innerText) == currentPage + 1){
            nextButton = pageButtonsArray[i];
            break;
        }
    }
    return nextButton;
}

async function handleRunThrough(isCampaign = true, reposts, repostValue){
    let reaminingReposts = reposts;
    let currentPage = 1;
    let errorCounts = 0;
    let totalReposts = 0;
    
    console.log("in")
    while(reaminingReposts > 0 && errorCounts < 6){
        let nextButton = null;
        
        if(isCampaign){
            nextButton = await findNextButton(currentPage);
        }
        
        
        
        const musicSections = await objectFinder(() => {
                        let mSections = document.querySelectorAll(".pd-jsxFDi");
                        if(mSections.length <= 0){
                            return null;
                        }
                        if(isCampaign){
                            return Array.from(mSections).slice(0, reaminingReposts);
                        }else{
                            return Array.from(mSections);
                        }
                    });
        if(musicSections == null){
            return "bad";
        }
        
        ({reaminingReposts, errorCounts, totalReposts} = await runThroughSongs(musicSections, reaminingReposts, errorCounts, 
            repostValue, totalReposts));
        console.log("reaminingReposts: ", reaminingReposts);
        console.log("errorCounts: ", errorCounts);
        if(isCampaign && reaminingReposts > 0 && errorCounts < 6){
            console.log("going next page")
            currentPage++;
            if(reaminingReposts > 0 && nextButton != null){
                nextButton.click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } else if(reaminingReposts > 0 && nextButton == null){
                return "bad";
            }
        } else if(!isCampaign){
            if(errorCounts >= 6){
                return "bad";
            }else{
                break;
            }
        }
    }
    return "good";
}

function updateSplashText(totalReposts){
    const splashText = `${count} out of ${totalReposts} reposts successfully handled.`;
    chrome.runtime.sendMessage({action: "updateSplashText", text: splashText});
}

let count = 0
function countUpTest(){
    const splashText = `${count} out of 10 reposts successfully handled.`;
    chrome.runtime.sendMessage({action: "progress", done: count});
    chrome.runtime.sendMessage({action: "updateSplashText", text: splashText});
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.ping === true){
        sendResponse({ outcome: "success" });
        console.log("Ping received from popup");
        console.log(message, sender, sendResponse)
        return;
    }
    if (message.action === "startclicker") {
        console.log("startclicker action received");
        chrome.runtime.sendMessage({action: "start", total: message.reposts});
        chrome.runtime.sendMessage({action: "running"});
        (async () => {
        for (let i = 0; i < 10; i++) {
            await countUpTest(message.reposts);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            count++;
        }
        chrome.runtime.sendMessage({action: "finish"});
        sendResponse({ outcome: 'success' });   // delivered!
        })();
        // (async () => {
        //     const respostValue = message.respostValue;
        //     const reposts = message.reposts;
        //     const location = window.location.href;
        //     const campaigns = document.querySelector('a[href="/browse/campaigns/recommended"]')
        //     if(!location.includes("/browse/campaigns/recommended")){
        //         if(campaigns){
        //             campaigns.click()
        //         }else{
        //             sendResponse({ outcome: "error", message: "Campaigns link not found" })
        //             return
        //         }
        //     }
        //     const outcomeCampaign = await handleRunThrough(true, reposts, respostValue);
        //     if(outcomeCampaign == "bad"){
        //         sendResponse({ outcome: "error", message: "Error in main run through" })
        //         return
        //     }
        //     const request = document.querySelector('a[href="/me/repost-requests/requested"]')
        //     const spans = request.querySelectorAll("span");
        //     if(spans.length <= 1){
        //         console.log("no reposts")
        //     }else{
        //         request.click();
        //         await new Promise((resolve) => setTimeout(resolve, 2000));
        //         console.log("spans: ", spans);
        //         console.log("innnnnnn")
        //         const repostsRequests = parseInt(spans[1].innerText);
        //         const requestOutcome = await handleRunThrough(false, repostsRequests, respostValue);
        //         if(requestOutcome == "bad"){
        //             sendResponse({ outcome: "error", message: "Error in repost run through" })
        //             return
        //         }
        //     }
        //     sendResponse({ outcome: "success" });
        //     return
        // })();
        return true;
    }
});
