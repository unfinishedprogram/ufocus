console.log("Hello guys");

import Dial from './dial';

const dial = new Dial();

const slider_input = document.getElementById('slider_percent') as HTMLInputElement;

slider_input.addEventListener('input', (e) => {
    const value = parseInt(slider_input.value) / 100;
    dial.percent = value;
});


document.body.appendChild(dial.element);