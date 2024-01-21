const QUERY_API = "http://ufocus.tech:3000/streaming/evaluation"; // PUT THE AWS LINK
const CURRENT_FOCUS_TASK = "I'm a software engineer trying to implement AWS in terraform";

let active = false;

const tab_relevance: Record<number, number> = {};
chrome.storage.session.set({ tab_relevance })


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
        const tabId = sender.tab!.id!;
        handleExtractedContent(request, tabId, sendResponse);
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

async function handleExtractedContent(content: string, tabId: number, sendResponse: (message: any) => void) {
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
    let json = await response.json();
    json.relevance = Math.min(100, json.relevance * 10 - 5 + Math.random() * 10);
    tab_relevance[tabId] = json.relevance;
    chrome.storage.session.set({ tab_relevance });
    sendResponse(json);
}