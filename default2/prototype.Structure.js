'use strict';

require('prototype.RoomPosition');
require('prototype.RoomObject');

Object.defineProperty(Structure.prototype, 'port', {
    get: function () {
        if (!this._port) {
            if (!this.memory.port) {
                this.memory.port = this.pos.adj_pos_with_max_access();
            }
            console.log(this.memory.port.x, this.memory.port.y, this.memory.port.roomName);
            this._port = new RoomPosition(this.memory.port.x, this.memory.port.y, this.memory.port.roomName);
        }
        return this._port;
    },
    enumerable: false,
    configurable: true
});