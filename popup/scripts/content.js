
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

function checkAmount(button){
    const amount = button.innerText;
    return amount.includes("6")
}

async function playSong(soundCloudWidget, timeout = 1000) {
    soundCloudWidget.play()
    console.log("playing")
    console.log("done playng")
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
        let toast = document.querySelector(".Toastify__toast-container");
        return toast;
    }, 500);
    
    if(error_toast != null){
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
        if(new_modal == null){
            return "bad";
        }
        
        const close_button = new_modal.querySelector("button");
        close_button.click();
        old_modal = new_modal;
        count++;
    }
}


async function handleMainRunThrough(){
    let reaminingReposts = 10;
    let currentPage = 1;
    let errorCounts = 0;
    
    console.log("in")
    while(reaminingReposts > 0){
        const pagination = await objectFinder(() => {
            let pag = document.querySelector(".pagination");
            return pag;
        }, 500);
        
        const pageButtons = pagination.querySelectorAll(".page-item .page-link");
        const pageButtonsArray = Array.from(pageButtons);
        
        console.log(pageButtonsArray);
        let nextButton;
        
        for(let i = 0; i < pageButtonsArray.length; i++){
            if(parseInt(pageButtonsArray[i].innerText) == currentPage + 1){
                nextButton = pageButtonsArray[i];
                break;
            }
        }
        
        console.log(nextButton);
        
        const musicSections = await objectFinder(() => {
                        let mSections = document.querySelectorAll(".pd-jsxFDi");
                        if(mSections.length <= 0){
                            return null;
                        }
                        return Array.from(mSections).slice(0, reaminingReposts);
                    });
        if(musicSections == null){
            return "bad";
        }
        for(let i = 0; i < musicSections.length; i++){
            setColor(musicSections[i], 'orange', true);
            if(!checkAmount(musicSections[i].querySelector("button"))){
                musicSections[i].style.removeProperty('background-color');
                musicSections[i].classList.remove("pluse-bg");
                musicSections[i].style.setProperty('background-color', 'red', 'important');
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
                await new Promise((resolve) => setTimeout(resolve, 7000));
                const button = musicSections[i].querySelector("button");
                if(button.disabled){
                    setColor(musicSections[i], 'red', false);
                    errorCounts++;
                    continue;
                }
                button.click();
                
                const popup_modal = await objectFinder(() => {
                    let pop = document.querySelector(".modal-content");
                    return pop;
                });
                
                if(popup_modal == null){
                    setColor(musicSections[i], 'red', false);
                    errorCounts++;
                    continue;
                }
                
                if(modalWalkThrough(popup_modal) == "bad"){
                    setColor(musicSections[i], 'red', false);
                    errorCounts++;
                    continue;
                }
                
                setColor(musicSections[i], 'green', false);
                reaminingReposts--;
                return "bad"
            }catch(e){
                setColor(musicSections[i], 'red', false);
                errorCounts++;
            }
        }
        reaminingReposts = 0
        currentPage++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    return "good";
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.ping === true){
        sendResponse({ outcome: "success" });
        return;
    }
    if (message.action === "startclicker") {
        const location = window.location.href;
        const campaigns = document.querySelector('a[href="/browse/campaigns/recommended"]')
        if(!location.includes("/browse/campaigns/recommended")){
            if(campaigns){
                campaigns.click()
            }else{
                sendResponse({ outcome: "error", message: "Campaigns link not found" })
            }
        }
        const outcome = await handleMainRunThrough()
        if(outcome == "good"){
            sendResponse({ outcome: "success" });
        }else if(outcome == "bad"){
            sendResponse({ outcome: "error", message: "Error in main run through" })
        }
        return;
    }
    sendResponse({ outcome: "error", message: "Unknown action" });
    return;
});
