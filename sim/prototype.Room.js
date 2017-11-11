'use strict';

Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            if (!this.memory.source){
                this.memory.source = this.find(FIND_SOURCES).map(source => source.id);
                console.log(this.name + ' is looking for sources');
            }
            this._sources = this.memory.source.map(id => Game.getObjectById(id));
        }
        return this._sources;
    },
    enumerable: false,
    configurable: true
});
