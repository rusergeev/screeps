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

Source.prototype.energy_around = function () {

    let x = this.room.lookForAtArea(LOOK_ENERGY,this.pos.x-1, this.pos.y-1, this.pos.x+1, this.pos.y+1, true).map(item => item.energy.energy);
    return  _.sum(x);
};