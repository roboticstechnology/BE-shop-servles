const log = console.log;

export class Cashe {
    #CASHE_EXPIRES_IN = 2 * 60 * 1000;

    constructor() {
        this.data = null;
        this.time = null;
    }

    get getData() {
        if (Date.now() - this.time > this.#CASHE_EXPIRES_IN) return false
        return this.data;
    }

    set Data(data) {
        this.data = data;
        this.Time = Date.now();
    }
    set Time(time) {
        this.time = time
    }
}