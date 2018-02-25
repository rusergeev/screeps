'use strict';

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        return _.sum(this.carry) === this.carryCapacity;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'isEmpty', {
    get: function() {
        return this._isFull = _.sum(this.carry) === 0;
    },
    enumerable: false,
    configurable: true
});