'use strict';

require('prototype.RoomPosition');

Object.defineProperty(Source.prototype, 'ports', {
    get: function () {
        if (!this._ports) {
            if (!this.memory.ports) {
                this.memory.ports = this.pos.free_adj_pos_count()
            }
            this._ports = this.memory.ports
        }
        return this._ports;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'demand', {
    get: function () {
        if(!Memory.spawns_queue[source.id])
            return ports;
        else
            return 0;
    },
    enumerable: false,
    configurable: true
});