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

Creep.prototype.moveToX = function (x) {
    this.room.memory.step = this.room.memory.step || {};
    this.room.memory.step[this.pos] = this.room.memory.step[this.pos] || {pos: this.pos, count: 0};
    this.room.memory.step[this.pos].count++;
    return this.moveTo(x);
};

Object.defineProperty(Creep.prototype, 'role', {
    get: function() {
        return this.memory.role;
    },
    set: function(v) {
        this.memory.role = v;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'assignment', {
    get: function() {
        if (!this._assignment) {
            this._assignment = Game.getObjectById(this.memory.assignment);
        }
        return this._assignment;
    },
    set: function(v) {
        this.memory.assignment = v.id;
        if (!this._assignment) {
            delete this._assignment;
        }
    },
    enumerable: false,
    configurable: true
});
