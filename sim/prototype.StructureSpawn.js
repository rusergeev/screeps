'use strict';

Object.defineProperty(StructureSpawn.prototype, 'targets', {
    get: function () {
        if (!this._sources) {
            this._sources = this.room.sources;
        }
        return this._sources.sort(function(a, b) {
            return a.pos.dispa - b;
        });
    },
    enumerable: false,
    configurable: true
});
