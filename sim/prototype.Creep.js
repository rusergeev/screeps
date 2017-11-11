'use strict';

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        if (!this._isFull) {
            this._isFull = _.sum(this.carry) === this.carryCapacity;
        }
        return this._isFull;
    },
    enumerable: false,
    configurable: true
});

Creep.prototype.moveToX =
    function (x) {
        this.room.memory.step = this.room.memory.step || {};
        this.room.memory.step[this.pos] = this.room.memory.step[this.pos] || {pos: this.pos, count: 0};
        this.room.memory.step[this.pos].count++;
        return this.moveTo(x);
    };