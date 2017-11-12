'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if(creep.harvest(creep.assignment) === ERR_NOT_IN_RANGE){
            creep.say('Moving');
            creep.switch_to_moving();
        } else if (!creep.assignment.container) {
            if (creep.room.createConstructionSite(creep.pos, creep.assignment.id, STRUCTURE_CONTAINER) !== OK) {
                console.log('Construction site creation err');
            }
        }
    }
};