'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.pos.getRangeTo(creep.assignment) === creep.range) {
            creep.action = 'mine';
            creep.say('Mining');
        } else {
            let result = creep.moveTo(
                creep.assignment,
                { noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: { stroke: '#ffffff' } });
            if (!creep.has_path){
                creep.say('Pathing...')
            }
        }
    }
};
