
import Dial from './dial';

const dial = new Dial();

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
}

initializeNav();

document.querySelector("#spinner")?.appendChild(dial.element);
setInterval(() => {
    dial.percent = Math.random();
}, 1000)
