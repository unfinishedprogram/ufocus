import extractContent from "./content_extractor";
import { ExtractedContent } from "./content_extractor/types";
import { RelevanceQueryResult } from "./types";

console.log("this page is good")

function makeOrange(color: string): void {
    document.body.style.backgroundColor = color;
}

function randInt(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor() {
    let r = randInt(0, 255);
    let g = randInt(0, 255);
    let b = randInt(0, 255);
    return `rgb(${r}${g}${b})`;
}

makeOrange(randomColor())

async function relevanceQuery(content: ExtractedContent) {
    console.log("Sending message")
    const response = await chrome.runtime.sendMessage(content) as RelevanceQueryResult;
    console.log(response);
    return response;
}

async function main() {
    console.log("mama");
    const URL = window.location.href;
    const storageKey = `uFocus-${URL}`;
    const visited = window.localStorage.getItem(storageKey);
    // TODO: comment this out when not testing
    // if (visited === "true") {
    //     return
    // }
    window.localStorage.setItem(storageKey, "true");
    const content = extractContent(window);
    await relevanceQuery(content);
}

main()