'use strict';

Object.defineProperty(StructureSpawn.prototype, 'targets', {
    get: function () {
        if (!this._sources) {
            this._sources = this.room.sources;
        }
        return this._sources.map(source => source.container);
    },
    enumerable: false,
    configurable: true
});
