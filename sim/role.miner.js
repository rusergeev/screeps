'use strict';

require('prototype.RoomObject');

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {

        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) !== OK) {
            creep.moveTo(source, { visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
