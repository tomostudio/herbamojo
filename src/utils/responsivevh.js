export class ResponsiveVH {
    targets = '.fitheight';
    constructer(obj) {
        if (obj.target && typeof obj.target === 'string') {
            this.targets = obj.target || '.fitheight';
        }
        else{
            this.target = '';
        }
        this.fitHeight();
        if (typeof document !== `undefined`) {
            window.addEventListener('resize', this.fitHeight, false);
        }
    }
    kill() {
        if (typeof document !== `undefined`) {
            window.removeEventListener('resize', this.fitHeight, false);
        }
    }
    fitHeight() {
        if (this.targets !== '') {
            const _t = document.querySelectorAll(this.targets);
            _t.forEach(target => {
                if (typeof window !== `undefined`) {
                    target.style.height = `${window.innerHeight}px`;
                }
            });
        }
    }
}
