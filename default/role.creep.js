'use strict';

let roles = {
    miner : require('role.miner'),
    transport: require('role.transport'),
    builder: require('role.builder'),
    upgrader: require('role.upgrader'),
    harvester: require('role.harvester'),
    builder_exp: require('role.builder.experimental'),
    claimer: require('role.claimer'),
    destroyer: require('role.destroyer'),
    medic: require('role.medic'),
    blocker: require('role.blocker'),
    atob: require('role.atob'),
    harvester_exp: require('role.builder.experimental')
};

module.exports = {
    run: function(creep) {
        if(creep.isMoving && creep.rollToRange() === OK) {
            return;
        }
        if (roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        } else {
            console.log(creep + ': cannot handle role '+ creep.memory.role);
        }
    }
};
