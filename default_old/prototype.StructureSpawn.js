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
    enumerable: true,
    configurable: true
});

Object.defineProperty(StructureSpawn.prototype, 'orders', {
    get: function () {
        if (!this._orders) {
            this._orders = this.room.sources;
        }
        return this._orders;
    },
    enumerable: true,
    configurable: true
});