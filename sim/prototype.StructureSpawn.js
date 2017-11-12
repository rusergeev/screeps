'use strict';

Object.defineProperty(Source.prototype, 'container', {
    get: function () {
        if (!this._container) {
            if (!this.memory.container) {
                this._container =
                    this.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => (s.structureType === STRUCTURE_CONTAINER )})[0] ||
                    this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {filter: s => (s.structureType === STRUCTURE_CONTAINER )})[0];
                this.memory.container = this._container.id;
                console.log(this.memory.container);
            } else {
                this._container = Game.getObjectById(this.memory.container);
            }
        }
        return this._container;
    },
    enumerable: false,
    configurable: true
});
