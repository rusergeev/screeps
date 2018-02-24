'use strict';

require('prototype.Source');

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        return _.sum(this.carry) === this.carryCapacity;
    },
    enumerable: false,
    configurable: true
});

Creep.prototype.moveToX = function (pos) {
    let result = this.moveTo(pos, { noPathFinding: true,visualizePathStyle: {stroke: '#ffffff'}});
    switch (result) {
        case OK:
        case ERR_TIRED:
            break;
        case ERR_NOT_FOUND:
            this.moveTo(pos, { noPathFinding: false, visualizePathStyle: {stroke: '#ffffff'}});
            break;
        default:
            console.log(this + ' cant move to ' + pos + ' : ' + result);
    }
    return result;
};
