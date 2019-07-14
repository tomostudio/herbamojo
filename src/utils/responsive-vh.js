export class ResponsiveVH {
    target = '.fitheight';
    constructor(obj) {
        if (obj.target && typeof obj.target === 'string') {
            this.target = obj.target || '.fitheight';
        } else {
            this.target = '';
        }

        if (typeof document !== `undefined`) {

            window.addEventListener('resize', this.fitHeight.bind(this), false);
        }
        this.fitHeight();
    }
    kill() {
        if (typeof document !== `undefined`) {
            window.removeEventListener('resize', this.fitHeight.bind(this), false);
        }
    }
    fitHeight() {

        if (this.target !== '') {
            const _t = document.querySelectorAll(this.target);
            _t.forEach(t => {
                if (typeof window !== `undefined`) {
                    t.style.height = `${window.innerHeight}px`;
                }
            });
        }
    }
}
