'use strict';

require('Room.prototype');

Object.defineProperty(StructureSpawn.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            this._sources = this.room.sources;
        }
        return this._sources;
    },
    enumerable: false,
    configurable: true
});