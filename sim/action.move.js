'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.pos.getRangeTo(creep.assignment) === creep.range) {
            creep.action = 'mine';
            creep.say('Mining');
            if (!creep.assignment.container) {
                if (creep.room.createConstructionSite(creep.pos, creep.assignment.id, STRUCTURE_CONTAINER) !== OK) {
                    console.log('Construction site creation err');
                }
            }
        } else {
            let result = creep.moveTo(
                creep.assignment,
                { noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: { stroke: '#ffffff' } });
            if (!creep.has_path){
                creep.say('Pathing...');

            }
        }
    }
};
