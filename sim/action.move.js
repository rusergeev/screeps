'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.pos.getRangeTo(creep.target) === creep.range) {
            creep.arrived();
        } else {
            creep.moveTo(creep.target,
                {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
            if (!creep.has_path) {
                creep.say('Pathing...');

            }
        }
    }
};
