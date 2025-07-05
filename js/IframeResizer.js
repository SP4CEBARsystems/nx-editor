export default class IframeResizer {
    constructor() {
        this.outer = document.getElementById('outer');
        this.inner = document.getElementById('player');
        if (!this.outer || !this.inner) {
            return;
        }
        this.updateScale();
        new ResizeObserver(this.updateScale.bind(this)).observe(this.outer);

    }

    updateScale() {
        if (!this.outer || !this.inner) {
            return;
        }
        const scaleX = this.outer.clientWidth / this.inner.offsetWidth;
        const scaleY = this.outer.clientHeight / this.inner.offsetHeight;
        this.inner.style.transform = `scale(${Math.min(scaleX, scaleY)})`;
    }
}
