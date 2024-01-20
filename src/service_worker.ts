import { ExtractedContent } from "./content_extractor/types";
import { RelevanceQueryResult } from "./types";

const QUERY_API = ""; // PUT THE AWS LINK
const CURRENT_FOCUS_TASK = "I'm a software engineer trying to implement AWS in terraform";

let active = false;


// initial app state
chrome.runtime.onInstalled.addListener(() => {
    active = false;
})

// inject script on each tab switch
chrome.tabs.onActivated.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.tabId },

        files: ["protector.js"]
    })
})

// message listener for the injected script
chrome.runtime.onMessage.addListener(
    function (request: ExtractedContent, sender, sendResponse) {

        handleExtractedContent(request, sendResponse);
        return true;
    }
);

async function handleExtractedContent(content: ExtractedContent, sendResponse: (message: any) => void) {
    const body = JSON.stringify({
        page_body: content.main_content,
        user_agent: CURRENT_FOCUS_TASK
    });
    console.log(body);
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