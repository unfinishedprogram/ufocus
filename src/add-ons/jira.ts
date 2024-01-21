const dom_watcher = new MutationObserver((mutationList) => {
    mutationList.some((mutation) => {
        if (mutation.type === "childList") {
            tryFocusButton()
            return true;
        }
    })
});

function tryFocusButton() {
    // button is already added
    if (document.querySelector("#uFocusButton")) {
        return;
    }
    const ticket = document.querySelector("section[role=dialog]");
    if (!ticket) {
        return;
    }
    const classList = "._1e0c1txw _2lx2vrvc _1n261q9c _1reo15vq _18m915vq _c71lzwfg _6myxpxbi _1loov47k _16jlkb7n _1o9zidpf _i0dl1wug _1bahesu3 _uiztglyw"
        .split(" ")
        .join(".");
    const buttonRow = ticket.querySelector(classList);
    const focusButton = document.createElement("button");
    focusButton.textContent = "uFocus";
    focusButton.id = "uFocusButton";
    focusButton.addEventListener("click", () => {
        const title = getTicketTitle();
        console.log("Here it the title", title);
    })
    buttonRow?.prepend(focusButton);

}

function getTicketTitle() {
    const selector = "h1[data-testid='issue.views.issue-base.foundation.summary.heading']";
    return document.querySelector(selector)?.textContent
}

function initialWatch() {
    console.log("Watching");
    const container = document.querySelector(".atlaskit-portal-container");
    if (!container) {
        setTimeout(initialWatch, 1000);
        return;
    }

    dom_watcher.observe(container, { childList: true, subtree: true });
}

setTimeout(initialWatch, 1000);