export let firstload = false;

export class LoaderClass {
    loadcheck = {
        time: false,
        data: false,
        page: false,
        reload: false,
        image: false
    }
    delay = {
        firstload: 0,
        default: 250,
        reload: 250,
    }
    timeout = {
        time: null
    }
    images ={
        check: true,
        init: false,
        list: null,
        loaded: 0,
    }
    constructor(obj) {
        this.loadcheck.time = false;
        this.loadcheck.data = false;
        this.loadcheck.page = false;
        this.loadcheck.reload = false;
        this.loadcheck.images = false;
        this.images.check = obj.checkimage !== undefined ? obj.checkimage : true;

        if (obj.intervalcheck !== null && obj.intervalcheck !==  undefined && typeof obj.intervalcheck === 'function') this.intervalcheck = obj.intervalcheck_function;
        if (obj.postload !== null && obj.postload !==  undefined && typeof obj.postload === 'function') this.postload = obj.postload;

        this.delay.firstload = obj.firstload_delay;

        if(!this.images.check)this.loadcheck.images = true;
    }
    intervalcheck() {}
    postload() {}
    reset() {
        this.loadcheck.page = false;
    }
    load() {
        this.intervalcheck();
        if (this.loadcheck.time && this.loadcheck.data && this.loadcheck.reload && this.loadcheck.images && !this.loadcheck.page) {
            if(this.delay.firstload > 0){
                if (firstload) {
                    firstload = true;
                    setTimeout(this.loadfinish, this.delay.firstload);
                } else {
                    this.loadcheck.page = true;
                    this.loadfinish();
                }
            }
            else{
                this.loadcheck.page = true;
                this.loadfinish();
            }
        }
    }
    loadfinish(){
        if (this.loadcheck.time && this.loadcheck.data && this.loadcheck.reload && this.loadcheck.images && this.loadcheck.page)  this.postload();
    }
    mountload() {
        this.loadcheck.data = true;
        this.load();
        if(!this.images.init && this.images.check){
            this.images.init = true;
            this.images.list = document.querySelectorAll('img');
            this.imageload();
        }
    }
    imageload(){
        
        if(this.images.check){
            this.images.list.forEach((image)=>{
                const eachimageloaded = (e) => {
                    e.target.removeEventListener("load", eachimageloaded.bind(this), false);
                    this.images.loaded++;
                    this.imageloadfinish();
                }
                image.addEventListener("load", eachimageloaded.bind(this), false);
            });
        }
    }
    imageloadfinish(){
        
        if( this.images.loaded >= this.images.list.length){
            this.loadcheck.images = true;
            this.images.init = false;
            this.load();
        }
    }
    renderload() {
        if(firstload){
            if (!this.loadcheck.time) {
                if (this.timeout.time != null) clearTimeout(this.timeout.time);
                this.timeout.time = setTimeout(() => {
                    this.loadcheck.time = true;
                    this.loadcheck.reload = true;
                    this.load();
                }, this.delay.default);
            } else {
                if (this.timeout.time != null) clearTimeout(this.timeout.time);
                this.timeout.time = setTimeout(() => {
                    this.loadcheck.reload = true;
                    this.load();
                }, this.minReloadTime);
            }
        }
        else{
            if (this.timeout.time != null) clearTimeout(this.timeout.time);
            this.timeout.time = setTimeout(() => {
                this.loadcheck.time = true;
                this.loadcheck.reload = true;
                this.load();
                firstload = true;
            }, this.delay.firstload);
        }
    }
}
