const QUERY_API = "http://ufocus.tech:3000/streaming/evaluation"; // PUT THE AWS LINK
const CURRENT_FOCUS_TASK = "I'm a software engineer trying to implement AWS in terraform";

let active = false;


// initial app state
chrome.runtime.onInstalled.addListener(() => {
    active = false;
})

// inject script on each tab switch
// chrome.tabs.onActivated.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.tabId },

//         files: ["protector.js"]
//     })
// })

// message listener for the injected script
chrome.runtime.onMessage.addListener(
    function (request: string, sender, sendResponse) {
        handleExtractedContent(request, sendResponse);
        return true;
    }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status != 'complete') {
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId },
        files: ["protector.js"]
    })
});

async function handleExtractedContent(content: string, sendResponse: (message: any) => void) {
    const user_agent = (await chrome.storage.local.get("selected_profile"))?.persona;

    const body = JSON.stringify({
        user_agent,
        page_body: content,
        // user_agent: CURRENT_FOCUS_TASK,
        request_id: "1",
    });

    const response = await fetch(QUERY_API,
        {
            method: "POST",
            headers: {
                "access-control-request-headers": "content-type",
                "Content-Type": "application/json; charset=utf8"
            },
            body
        });
    if (!response.ok) {
        sendResponse(await response.text());
        return;
    }
    sendResponse(await response.json());

}