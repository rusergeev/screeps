'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let source = creep.assignment;
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveToX(source);
        }
    }
};
