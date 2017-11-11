'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        creep.moveToMy(creep.moving.target, creep.moving.range);

    }
};