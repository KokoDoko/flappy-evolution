export class Pipe {
    constructor({ x, y, height, className }) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = 80; // assumed constant width
        this.className = className;
        this.element = document.createElement('div');
        this.element.className = 'pipe ' + className;
        this.element.style.width = this.width + 'px';
        this.element.style.height = height + 'px';
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.gameElement = document.getElementById('game');
        this.gameElement.append(this.element);
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
