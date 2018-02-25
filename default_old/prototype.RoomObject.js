'use strict';

    Object.defineProperty(RoomObject.prototype, 'memory', {
    get: function () {
        if (!Memory.objects) {
            Memory.objects = {};
        }
        if (!Memory.objects[this.id]) {
            Memory.objects[this.id] = {};
        }
        return Memory.objects[this.id];
    },
    set: function (v) {
        return _.set(Memory, 'objects.' + this.id, v);
    },
    configurable: true,
    enumerable: false,
});
