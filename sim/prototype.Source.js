'use strict';

Object.defineProperty(Source.prototype, 'workers', {
    get: function() {
        if (!this._workers) {
            if (!this.memory.workers){
                this.memory.workers = [];
                console.log(this.name + ' init workers with empty []');
            }
            this._workers = this.memory.workers.map(id => Game.getObjectById(id));
        }
        return this._workers;
    },
    set: function(v){
        console.log('set'+v);
        this.memory.workers = v;
        this._workers = this.memory.workers;
    },
    push: function(v){
        console.log('push'+v);
        this.memory.workers.push(v);
        this._workers = this.memory.workers.map(id => Game.getObjectById(id));
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'demand', {
    get: function() {
        if (!this._demand) {
            if (!this.memory.demand) {
                this.memory.demand = {WORK: _.ceil(this.energyCapacityAvailable/HARVEST_POWER/ENERGY_REGEN_TIME)
                    - _.sum(this.workers.map(creep => creep.getActiveBodyparts(WORK)))};
                console.log(this.name + ' is looking for demand');
            }
            this._workers = this.memory.demand;
        }
        return this._demand;
    },
    enumerable: false,
    configurable: true
});