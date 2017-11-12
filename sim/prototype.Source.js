'use strict';

Object.defineProperty(Source.prototype, 'container', {
    get: function() {
        if (!this._container) {
            if (!this.memory._container) {
                this.memory._container =
                    this.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => (s.structureType === STRUCTURE_CONTAINER )}) ||
                    this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {filter: s => (s.structureType === STRUCTURE_CONTAINER )});
            }
        }
        return this._container;
    },
    enumerable: false,
    configurable: true
});