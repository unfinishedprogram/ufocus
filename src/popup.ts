
import Dial from './dial';

const dial = new Dial();

document.querySelector("#spinner")?.appendChild(dial.element);
setInterval(() => {
    dial.percent = Math.random();
}, 1000)
