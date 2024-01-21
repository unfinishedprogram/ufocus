type Color = [number, number, number];

function colorLerp(colors: [Color, Color], percent: number): Color {
    const [c_a, c_b] = colors;
    const [r1, g1, b1] = c_a;
    const [r2, g2, b2] = c_b;
    const r = r1 + (r2 - r1) * percent;
    const g = g1 + (g2 - g1) * percent;
    const b = b1 + (b2 - b1) * percent;
    return [r, g, b];
}

function colorThlerp(colors: [Color, Color, Color], percent: number): Color {
    if (percent > 0.5) {
        return colorLerp([colors[1], colors[2]], (percent - 0.5) * 2);
    } else {
        return colorLerp([colors[0], colors[1]], percent * 2);
    }
}

function makeArrow() {
    let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let square = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    square.setAttribute('d', "M0 0h24v24H0z");

    arrow.appendChild(path);
    arrow.appendChild(square);

    return arrow;
}

let block_timeout: ReturnType<typeof setTimeout>;

const scale = 1.7;
export default class Dial {
    $_colors_main: [Color, Color, Color] = [[0xD1, 0x3B, 0x3B], [0xD5, 0x99, 0x52], [0x52, 0xA5, 0x6C]];
    $_colors_faint: [Color, Color, Color] = [[255, 128, 128], [255, 255, 128], [128, 255, 128]];
    $_percent: number = 0;

    $_circle_elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    $_svg_text_elm = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    $size = 96 * scale;
    $radius = 30 * scale;
    $stroke_width = this.$size / 8;

    $circle_center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    $threshold = 0.8;
    $threshold_arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    $threshold_text = document.createElementNS('http://www.w3.org/2000/svg', 'text');


    constructor() {
        const padding = 32 * scale;

        this.element.setAttribute('width', `${this.$size + padding}`);
        this.element.setAttribute('height', `${this.$size + padding}`);
        this.element.setAttribute('viewBox', `${-padding / 2} ${-padding / 2} ${this.$size + padding} ${this.$size + padding}`);

        this.element.classList.add('dial');

        let width = this.$size / 8;
        let height = this.$size / 8;
        let center = this.$size / 2;

        this.$threshold_arrow.setAttribute('d',
            `M ${center - width / 2} ${0} L ${center} ${height} L ${center + width / 2} ${0} Z`);

        this.$threshold_arrow.setAttribute('stroke', 'black');
        this.$threshold_arrow.setAttribute('stroke-width', `${this.$size / 32}`);
        this.$threshold_arrow.setAttribute('stroke-linecap', 'round');
        this.$threshold_arrow.setAttribute('stroke-linejoin', 'round');
        this.$threshold_arrow.classList.add('dial_threshold_arrow');

        this.$_circle_elm.setAttribute('cx', `${this.$size / 2}`);
        this.$_circle_elm.setAttribute('cy', `${this.$size / 2}`);
        this.$_circle_elm.setAttribute('r', this.$radius.toString());
        this.$_circle_elm.setAttribute('fill', 'none');
        this.$_circle_elm.setAttribute('stroke-width', this.$stroke_width.toString());
        this.$_circle_elm.setAttribute("stroke-linecap", "round");
        this.$_circle_elm.classList.add('dial_circle');

        this.$circle_center.setAttribute('cx', `${this.$size / 2}`);
        this.$circle_center.setAttribute('cy', `${this.$size / 2}`);
        this.$circle_center.setAttribute('r', `${this.$radius - this.$stroke_width / 4}`);
        this.$circle_center.setAttribute('fill', 'white');
        this.$circle_center.classList.add('dial_circle_center');

        this.element.appendChild(this.$_circle_elm);
        this.element.appendChild(this.$circle_center);
        this.element.appendChild(this.$_svg_text_elm);
        this.element.appendChild(this.$threshold_text);

        this.$_svg_text_elm.setAttribute('x', `${this.$size / 2}`);
        this.$_svg_text_elm.setAttribute('y', `${this.$size / 2 + 1}`);
        this.$_svg_text_elm.setAttribute('text-anchor', 'middle');
        this.$_svg_text_elm.setAttribute('dominant-baseline', 'middle');

        this.$_svg_text_elm.textContent = '0';
        this.$_svg_text_elm.setAttribute('font-size', `${this.$size / 4}`);
        this.$_svg_text_elm.setAttribute("font-family", "sans-serif");
        this.$_svg_text_elm.setAttribute("font-weight", "bold");

        this.$threshold_text.setAttribute('x', `${this.$size / 2}`);
        this.$threshold_text.setAttribute('y', `${this.$size / 2 + 1}`);
        this.$threshold_text.setAttribute('font-size', `${this.$size / 8}`);
        this.$threshold_text.setAttribute("font-family", "sans-serif");

        this.$threshold_arrow.addEventListener("mousedown", (evt) => {
            const update_pos = (evt: MouseEvent) => {
                // Translate the mouse position to svg relative position 
                const rect = this.element.getBoundingClientRect();
                const x = evt.clientX - rect.left;
                const y = evt.clientY - rect.top;

                // Calculate the angle of the mouse position
                const a = Math.atan2(y - (this.$size + padding) / 2, x - (this.$size + padding) / 2) * 180 / Math.PI;
                const angle = ((a + 90) + 360) % 360;
                console.log(angle);
                this.threshold = (angle / 360);
            }

            update_pos(evt);

            let drag = (evt: MouseEvent) => {
                update_pos(evt);
            }

            document.addEventListener("mousemove", drag);

            const on_mouseup = () => {
                document.removeEventListener("mousemove", drag);
                document.removeEventListener("mouseup", on_mouseup);
            }

            document.addEventListener("mouseup", on_mouseup);
            document.addEventListener("mouseleave", on_mouseup);
        });


        this.element.appendChild(this.$threshold_arrow);

        this.percent = 0;
        this.threshold = 0.8;

        chrome.storage.local.get(["block_threshold", "relevance"], (result) => {
            console.log("local:", result);
            if (result.block_threshold) {
                this.threshold = result.block_threshold;
            }

            if (result.relevance) {
                this.percent = result.relevance / 100;
            }
        });
    }

    set threshold(value: number) {
        this.$threshold = value;
        const threshold_angle = 360 * this.$threshold;

        let arrow_rotate = threshold_angle % 360;
        this.$threshold_arrow.setAttribute('transform', `rotate(${arrow_rotate} ${this.$size / 2} ${this.$size / 2})`);

        // translate the text to the edge of the dial circle
        const text_angle = (arrow_rotate - 90) % 360;
        const text_radius = this.$radius + this.$stroke_width * 2;
        const text_x = text_radius * Math.cos(text_angle * Math.PI / 180);
        const text_y = text_radius * Math.sin(text_angle * Math.PI / 180);

        this.$threshold_text.setAttribute('x', `${this.$size / 2 + text_x}`);
        this.$threshold_text.setAttribute('y', `${this.$size / 2 + text_y}`);


        // Change anchor based on position
        if (arrow_rotate > 180) {
            this.$threshold_text.setAttribute('text-anchor', 'end');
        } else {
            this.$threshold_text.setAttribute('text-anchor', 'start');
        }

        clearTimeout(block_timeout);
        block_timeout = setTimeout(() => {
            chrome.storage.local.set({ block_threshold: this.$threshold });
            console.log("Updating storage")
        }, 100);

        this.$threshold_text.textContent = `${Math.ceil(this.$threshold * 100)}%`;
    }

    get threshold(): number {
        return this.$threshold;
    }

    set text(value: string) {
        this.$_svg_text_elm.textContent = value;
    }

    set percent(value: number) {
        let color = colorThlerp(this.$_colors_main, value);

        this.element.setAttribute("style", `
            --dial-color: rgb(${color.join(',')});
            --glow-color: rgba(${color.join(',')}, 0.5);`
        );

        const angle = 360 * value;
        const circumference = 2 * Math.PI * this.$radius;
        const strokeOffset = (1 / 4) * circumference;
        const strokeDasharray = (angle / 360) * circumference;

        this.$_svg_text_elm.textContent = `${Math.ceil(value * 100)}`;

        // Use dasharray to make part of the arc hidden
        this.$_circle_elm.setAttribute("stroke", "var(--dial-color)");
        this.$_circle_elm.setAttribute('stroke-dasharray', [strokeDasharray, circumference - strokeDasharray].join(","));
        this.$_circle_elm.setAttribute('stroke-dashoffset', strokeOffset.toString());
    }
}