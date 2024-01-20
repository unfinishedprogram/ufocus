let active = false;


// initial app state
chrome.runtime.onInstalled.addListener(() => {
    active = false;
})

chrome.tabs.onActivated.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.tabId },

        files: ["protector.js"]
    })
})