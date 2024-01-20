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

export default class Dial {
    $_colors_main: [Color, Color, Color] = [[255, 0, 0], [255, 255, 0], [0, 255, 0]];
    $_colors_faint: [Color, Color, Color] = [[255, 128, 128], [255, 255, 128], [128, 255, 128]];
    $_percent: number = 0;

    $_circle_elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    $_svg_text_elm = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    $size = 96;
    $radius = 30;
    $stroke_width = this.$size / 8;

    $circle_center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    constructor() {
        this.element.setAttribute('width', `${this.$size}`);
        this.element.setAttribute('height', `${this.$size}`);
        this.element.classList.add('dial');

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

        this.$_svg_text_elm.setAttribute('x', `${this.$size / 2}`);
        this.$_svg_text_elm.setAttribute('y', `${this.$size / 2 + 1}`);
        this.$_svg_text_elm.setAttribute('text-anchor', 'middle');
        this.$_svg_text_elm.setAttribute('dominant-baseline', 'middle');

        this.$_svg_text_elm.textContent = '0';
        this.$_svg_text_elm.setAttribute('font-size', `${this.$size / 4}`);
        this.$_svg_text_elm.setAttribute("font-family", "sans-serif");
        this.$_svg_text_elm.setAttribute("font-weight", "bold");
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