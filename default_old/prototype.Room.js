'use strict';

Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            if (!this.memory.sources){
                console.log(this.name + ' is looking for sources');
                this._sources = this.find(FIND_SOURCES);
                this.memory.sources = this._sources.map(source => source.id);
                this._sources.forEach(source => {
                    let result = this.createConstructionSite(source.pos.adj_pos_with_max_access(), source.id, STRUCTURE_CONTAINER);
                    if (result !== OK){
                        console.log(this + ' - source - ' + source + ' - error - ' + result);
                    }
                });
            } else {
                this._sources = this.memory.sources.map(id => Game.getObjectById(id));
            }

        }
        return this._sources;
    },
    enumerable: false,
    configurable: true
});
