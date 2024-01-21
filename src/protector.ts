import { extractContent, sanitizeText } from "./content_extractor";
import { RelevanceQueryResult } from "./types";

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
  // if (result.score < 6) {
  blockPage();
  // }
}

function blockPage() {
  console.log("Block page.");
  console.log(document.body);
  const div = document.createElement("div");
  div.className = "modal";

  document.body.prepend(div);
  const css = chrome.runtime.getURL("blocker.css")
  document.head.innerHTML += `
    <link rel="stylesheet" type="text/css" href="${css}">
  `

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
  // frameDiv.append(button);

  div.appendChild(frameDiv);
}


main()