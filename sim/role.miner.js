'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveToX(source);
        }
    }
};
