
import Dial from './dial';
import ProfileManager from './profile_manager';
import { Profile } from './types';

const dial = new Dial();

async function setupProfiles() {
    let current = (await chrome.storage.local.get("selected_profile")).selected_profile as Profile;

    console.log("current");
    console.log(current);
    document.getElementById("current_profile")!.innerHTML = current?.name;
    console.log(document.getElementById("current_profile"));

    let manager = new ProfileManager();
    let profile_manager = document.getElementById("page1-wrapper");
    profile_manager?.appendChild(manager.$container_elm);
}

function setupSettings() { }

function initializeNav() {
    let page1_button = document.querySelector("a.nav_button1");
    let page2_button = document.querySelector("a.nav_button2");
    let page3_button = document.querySelector("a.nav_button3");

    console.log(page1_button, page2_button, page3_button)

    page1_button?.addEventListener("click", () =>
        document.getElementById("scroll_container")?.setAttribute("style", "--page:1")
    );
    page2_button?.addEventListener("click", () =>
        document.getElementById("scroll_container")?.setAttribute("style", "--page:2")
    );
    page3_button?.addEventListener("click", () =>
        document.getElementById("scroll_container")?.setAttribute("style", "--page:3")
    );

    setupProfiles();
    setupSettings();
}

initializeNav();

document.querySelector("#spinner")?.appendChild(dial.element);
