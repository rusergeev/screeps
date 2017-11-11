'use strict';

Object.defineProperty(RoomObject.prototype, 'memory', {
    get: function () {
        if (!Memory.objects) {
            Memory.objects = {};
        }
        if (!Memory.objects[this.id]) {
            Memory.objects[this.id] = {};
        }
        return Memory.objects[this.id];
    },
    set: function (v) {
        return _.set(Memory, 'objects.' + this.id, v);
    },
    configurable: true,
    enumerable: false,
});

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

/** @param {Creep} creep **/
RoomObject.prototype.assign = function (creep) {
    creep.memory.id = creep.id;
    this.memory.workers.push(creep.memory.id);
    delete this._workers;
};

/** @param {Int} creep_id **/
RoomObject.prototype.release = function (creep_id) {
    let index = this.memory.workers.indexOf(creep_id);
    if (index > -1) {
        this.memory.workers.splice(index, 1);
        delete this._workers;
    } else {
        console.error(this.id + ': could not release creep ' + creep);
    }
};