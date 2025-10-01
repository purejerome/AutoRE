
async function objectFinder(findingFunction, timeout = 1000) {
    let objects = null;
    let find_attempts = 0;
    while((objects == null || objects == undefined) && find_attempts < 10){
        objects = findingFunction();
        if((objects == null || objects == undefined)){
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
    console.log("amount: ", amount);
    console.log("includes: ", amount.includes(`${repostValue}`));
    return amount.includes(`${repostValue}`)
}

async function playSong(soundCloudWidget, seekTo = 1000) {
    console.log("Playing song...");
    console.log("sc widget: ", soundCloudWidget);
    soundCloudWidget.seekTo(seekTo)
    // const pauseButton = await objectFinder(() => {
    //     let pause = document.querySelector("img[alt='Pause']");
    //     return pause;
    // }, 500);
    // pauseButton.click();
}

function waitForWidgetReady(iframe, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (!iframe) return reject(new Error("iframe is null"));

    let widget = SC.Widget(iframe);
    if (widget != null) { resolve(widget); }
    
    const timer = setTimeout(() => reject(new Error("READY timeout")), timeout);
    while(widget == null){
        widget = SC.Widget(iframe);
        if(widget != null && iframe.contentWindow){
            onReady();
        }
    }

    const onReady = () => {
        console.log(iframe)
        clearTimeout(timer);
        resolve(widget);
    };
    
    console.log("Waiting for SoundCloud widget to be ready...");
    // widget.bind(SC.Widget.Events.READY, function() {
    //     console.log('SoundCloud widget is ready!');
    //     onReady();
    // });
    // while(widget == null){
    //     widget = SC.Widget(iframe);
        // if(widget != null && iframe.contentWindow){
        //     onReady();
        // }
    // }
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
        const parent = inputs[i].parentElement;
        if(parent.innerText.includes("Like the track")){
            console.log("inside like the track")
            const plus_one_container = parent.parentElement.parentElement.querySelector(".col-4");
            console.log("plus_one_container: ", plus_one_container);
            if(plus_one_container == null){
                inputs[i].click();
            }else{
                if(!plus_one_container.innerText.includes("1")){
                    inputs[i].click();
                }
            }
        }
        else if(inputs[i].type == "checkbox" && inputs[i].checked && !inputs[i].disabled){
            inputs[i].click();
        }
        // if(i < inputs.length - 1){
        //     if(inputs[i].type == "checkbox" && inputs[i].checked && !inputs[i].disabled){
        //         inputs[i].click();
        //     }
        // }else{
        //     const parent = inputs[i].parentElement.parentElement.parentElement;
        //     const plus_one_container = parent.querySelector(".col-4");
            // if(plus_one_container == null){
            //     inputs[i].click();
            // }else{
            //     if(!plus_one_container.innerText.includes("1")){
            //         inputs[i].click();
            //     }
            // }
            
        // }
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
        
        if(new_modal != null){
            const close_button = new_modal.querySelector("button");
            close_button.click();
            old_modal = new_modal;
        }else{
            console.log("NO SECOND OR THIRD");
            break;
        }
        count++;
    }
    
    let modalCheck =  await objectFinder(() => {
        let new_modal = document.querySelector(".modal-content");
        if(new_modal == null || new_modal == old_modal){
            return null;
        }
        return new_modal;
    }, 100);
    let checkCount = 0;
    
    while(modalCheck != null && checkCount < 2){
        modalCheck = await objectFinder(() => {
            let new_modal = document.querySelector(".modal-content");
            if(new_modal == null || new_modal == old_modal){
                return null;
            }
            return new_modal;
        }, 100);
        checkCount++;
    }
    
    if(modalCheck != null){
        return "bad";
    }
    console.log("modal walkthrough done");
    
    let pauseButton = null;
    pauseButton = await objectFinder(() => {
        let pause = document.querySelector("img[alt='Pause']");
        return pause;
    }, 500);
    pauseButton.click();
}

async function runThroughSongs(musicSections, reaminingReposts, 
    errorCounts, repostValue, totalReposts, isCampaign = true, startingReposts){
    let valueError = 0;
    let buttonSearchValue = isCampaign ? '.ob-campaigns-repost-button' : 'div[data-scope="tooltip"] button';
    for(let i = 0; i < musicSections.length && errorCounts < 6; i++){
            setColor(musicSections[i], 'orange', true);
            console.log(musicSections[i].querySelector(buttonSearchValue))
            if(!checkAmount(musicSections[i].querySelector(buttonSearchValue), repostValue)){
                musicSections[i].style.removeProperty('background-color');
                musicSections[i].classList.remove("pluse-bg");
                musicSections[i].style.setProperty('background-color', 'gray', 'important');
                valueError++;
                if(valueError >= 5){
                    errorCounts = 6;
                }
                continue;
            }
            console.log("continueing");
            const bounds = musicSections[i].getBoundingClientRect()
            window.scrollTo(0, bounds.top + window.scrollY - 100);
            const frame = await objectFinder(() => {
                let f = musicSections[i].querySelector("iframe");
                return f;
            })
            try{
                var soundCloudWidget = await waitForWidgetReady(frame)
                let seekTo = 1000;
                console.log("waiting before clicking")
                await new Promise((resolve) => setTimeout(resolve, 3000));
                console.log("clicking")
                await playSong(soundCloudWidget, seekTo);
                let pauseButtonCheck = null;
                let pauseButtonCheckCount = 0
                // for(let j = 0; j < 3; j++){
                //     await playSong(soundCloudWidget);
                // }
                // let pauseButton = null;
                while( pauseButtonCheckCount < 3){
                    pauseButtonCheck = await objectFinder(() => {
                        let pause = document.querySelector("img[alt='Pause']");
                        return pause;
                    }, 200);
                    if(pauseButtonCheck != null){
                        break;
                    }
                    seekTo += 1000;
                    pauseButtonCheckCount++;
                    await playSong(soundCloudWidget, seekTo);
                }
                await new Promise((resolve) => setTimeout(resolve, 35000));
                const button = musicSections[i].querySelector(buttonSearchValue);
                if(button.disabled){
                    setColor(musicSections[i], 'red', false);
                    console.log("button disabled")
                    errorCounts++;
                    continue;
                }
                button.click();
                await new Promise((resolve) => setTimeout(resolve, 100));
                
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
                await new Promise((resolve) => setTimeout(resolve, 200));
                if(isCampaign){
                    updateSplashText(totalReposts, startingReposts);
                }else{
                    updateSplashTextRequests(totalReposts, startingReposts);
                }
            }catch(e){
                console.log("no frame?")
                console.error("Error playing song:", e);
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
        let pag = document.querySelector("nav[data-scope='pagination']");
        return pag;
    }, 500);
    
    const pageButtons = await objectFinder(() => {
        let pagButtons = pagination.querySelectorAll("button[data-part='item']");
        if(pagButtons.length <= 0){
            return null;
        }
        return pagButtons;
    }, 500);
    
    const pageButtonsArray = Array.from(pageButtons);
    
    if(currentPage == 1){
        const activePage = await objectFinder(() => {
            let aPage = pagination.querySelector("button[data-part='item'][data-selected][aria-current='page']");
            return aPage;
        }, 200);
        console.log("activePage: ", activePage);
        console.log("activePage.innerText: ", activePage.innerText);
        if(activePage.innerText != "1"){
            pageButtonsArray[0].click();
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
    while(reaminingReposts > 0){
        console.log("in")
        let nextButton = null;
        
        if(isCampaign){
            nextButton = await findNextButton(currentPage);
        }
        
        // const music_string = isCampaign ? ".ob-campaigns-campaigncard" : 'div[class="pd-jsxFDi pd-hYZFkb"]';
        const music_string = 'div[class="pd-fPSBzf pd-cMGtQw"]'
        
        const musicSections = await objectFinder(() => {
                        let mSections = document.querySelectorAll(music_string);
                        if(mSections.length <= 0){
                            return null;
                        }
                        if(isCampaign){
                            if(currentPage == 1){
                                return Array.from(mSections).slice(0, reaminingReposts);
                            }else{
                                return Array.from(mSections).slice(1, reaminingReposts + 1);
                            }
                        }else{
                            return Array.from(mSections);
                        }
                    });
        console.log("musicSections: ", musicSections);
        if(musicSections == null){
            return "bad";
        }
        
        
        
        ({reaminingReposts, errorCounts, totalReposts} = await runThroughSongs(musicSections, reaminingReposts, errorCounts, 
            repostValue, totalReposts, isCampaign, reposts));
        console.log("reaminingReposts: ", reaminingReposts);
        console.log("errorCounts: ", errorCounts);
        if(errorCounts >= 6){
            console.log("error counts reached 6, breaking");
            return "bad";
        }
        
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

function updateSplashText(count, totalReposts){
    const splashText = `${count} out of ${totalReposts} reposts successfully handled.`;
    chrome.runtime.sendMessage({action: "progress", done: count});
    chrome.runtime.sendMessage({action: "updateSplashText", text: splashText});
}

function updateSplashTextRequests(requestCount, totalRepostsRequests){
    const splashText = `${requestCount} out of ${totalRepostsRequests} requests successfully handled.`;
    chrome.runtime.sendMessage({action: "progressRequests", doneRequests: requestCount});
    chrome.runtime.sendMessage({action: "updateSplashText", text: splashText});
}

function createToast(title, message, isSuccess) {
    const toast = document.createElement("div");
    const toastBody = document.createElement("div");
    const toastTitle = document.createElement("strong");
    const toastMessage = document.createElement("p");
    const toastImage = document.createElement("img");
    
    toastImage.src = chrome.runtime.getURL("images/AutoRELogo.png");
    toastImage.alt = "AutoRE Logo";
    toast.className = "AutoREToast";
    if (isSuccess) {
        toast.classList.add("success");
    }else{
        toast.classList.add("error");
    }
    toastTitle.innerText = title;
    toastMessage.innerText = message;
    toastBody.appendChild(toastTitle);
    toastBody.appendChild(toastMessage);
    toast.appendChild(toastImage);
    toast.appendChild(toastBody);
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 5000);
    }, 500);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.ping === true){
        sendResponse({ outcome: "success" });
        console.log("Ping received from popup");
        console.log(message, sender, sendResponse)
        return;
    }
    if (message.action === "startclicker") {
        chrome.runtime.sendMessage({action: "start", total: message.reposts});
        chrome.runtime.sendMessage({action: "running"});
        (async () => {
            const engage = document.querySelector('a[href="/engage"]')
            console.log("engage: ", engage);
            const respostValue = message.respostValue;
            console.log("respostValue: ", respostValue);
            const reposts = message.reposts;
            const location = window.location.href;
            if(reposts > 0){
                console.log("inside");
                if(!location.includes("/engage")){
                    if(engage){
                        engage.click()
                    }else{
                        createToast("Error", "Could not find enage button.", false);
                        chrome.runtime.sendMessage({action: "finish"});
                        sendResponse({ outcome: "error", message: "Engage link not found" })
                        return
                    }
                }
                
                const repostTab = await objectFinder(() => {
                    let rTab = document.querySelector('button[data-value="repost_campaigns"]');
                    if(rTab == null){
                        return null;
                    }
                    return rTab;
                })
                
                repostTab.click();
                await new Promise((resolve) => setTimeout(resolve, 1000));
                
                const outcomeCampaign = await handleRunThrough(true, reposts, respostValue);
                if(outcomeCampaign == "bad"){
                    console.log("bad outcome in campaign run through")
                    chrome.runtime.sendMessage({action: "finish"});
                    createToast("Error", "There were many errors when reposting tracks.", false);
                    sendResponse({ outcome: "error", message: "Error in main run through" })
                    return
                }
            }
            // const request = document.querySelector('a[href="/me/repost-requests/requested"]')
            // const requestText = request.innerText;
            // const match = requestText.match(/^Requests (\d+)$/);
            // const engage = document.querySelector('a[href="/engage"]')
            const directRequestTab = await objectFinder(() => {
                let rTab = document.querySelector('button[data-value="incoming_requests"]');
                if(rTab == null){
                    return null;
                }
                return rTab;
            })
            const directRequestTabText = directRequestTab.innerText.replace(/\s+/g, ' ').trim();
            console.log("directRequestTabText: ", directRequestTabText);
            const match = directRequestTabText.match(/Direct Requests (\d+)$/);
            console.log("match: ", match);
            if(match){
                directRequestTab.click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log("Repost requests found: ", match[1]);
                const repostsRequests = parseInt(match[1]);
                chrome.runtime.sendMessage({action: "startRequests", totalRequests: repostsRequests});
                const secondRepostValue = respostValue - 4;
                console.log("repostValue: ", respostValue);
                console.log(message);
                console.log("secondRepostValue: ", secondRepostValue);
                const requestOutcome = await handleRunThrough(false, repostsRequests, secondRepostValue);
                if(requestOutcome == "bad"){
                    chrome.runtime.sendMessage({action: "finish"});
                    createToast("Error", "There were many errors when reposting tracks.", false);
                    sendResponse({ outcome: "error", message: "Error in repost run through" })
                    return
                }
            }
            createToast("Success", "Reposting ending successfully(or mostly at least).", true);
            chrome.runtime.sendMessage({action: "finish"});
            sendResponse({ outcome: "success" });
            return
        })();
        return true;
    }
});
