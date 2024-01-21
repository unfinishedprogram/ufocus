import { extractContent, sanitizeText } from "./content_extractor";
import { RelevanceQueryResult } from "./types";

async function relevanceQuery(content: string): Promise<RelevanceQueryResult> {
    const response = await chrome.runtime.sendMessage(content) as RelevanceQueryResult;
    return response;
}

async function main() {
    const URL = window.location.href;
    const storageKey = `uFocus-${URL}`;
    const visited = window.localStorage.getItem(storageKey);
    // TODO: comment this out when not testing
    // if (visited === "true") {
    //     return
    // }
    window.localStorage.setItem(storageKey, "true");
    const content = extractContent(window);
    const sanitizedText = sanitizeText(content);
    const result = await relevanceQuery(sanitizedText);
    processResult(result);
}

function processResult(result: RelevanceQueryResult) {
  console.log("processing result");
  console.table(result);
  if (result.relevance < 6) {
    blockPage();
  }
}

async function fetchCompleteResult() {
    const body = JSON.stringify({
        request_id: "1",
    });
    console.log(body);
    const response = await fetch("http://localhost:3000/streaming/complete",
        {
            method: "POST",
            headers: {
                "access-control-request-headers": "content-type",
                "Content-Type": "application/json; charset=utf8"
            },
            body
        });

    console.log(await response.json())
}

function blockPage() {
    console.log("Block page.");
    const div = document.createElement("div");
    div.className = "modal";

    document.body.prepend(div);
    const cssUrl = chrome.runtime.getURL("blocker.css")
    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = cssUrl;
    document.head.appendChild(cssLink);

    // Create frame to position elements
    const frameDiv = document.createElement("div");

    // create button
    const whitelistButton = document.createElement("button");
    whitelistButton.textContent = "Whitelist this topic."
    whitelistButton.addEventListener('click', () => {
        div.remove();
    });

    const continueButton = document.createElement("button");
    continueButton.textContent = "Just this once";
    continueButton.style.backgroundColor = "#D13B3B"
    continueButton.addEventListener('click', () => {
        div.remove();
    });


    frameDiv.innerHTML = `
        <div class="blocker-frame">
          <h1> This page is NOT relevant to your work! </h1>
          <p> A lot of times we are tempted to doom scroll! Be brave and leave. </p>
        </div>
      `

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button-div"
    buttonDiv.append(whitelistButton, continueButton);

    frameDiv.querySelector(".blocker-frame")!.append(buttonDiv)

    div.appendChild(frameDiv);
}

console.log("processing");
main()