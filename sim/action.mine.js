'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.harvest(creep.assignment) === ERR_NOT_IN_RANGE) {
            creep.moving();
        }
    }
};