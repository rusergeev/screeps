'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {

        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) !== OK) {
            let assignment = new RoomPosition(creep.memory.assignment.x, creep.memory.assignment.y, creep.memory.assignment.roomName);
            creep.moveTo(assignment, { visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
