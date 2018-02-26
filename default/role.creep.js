'use strict';

let roles = {
    miner : require('role.miner'),
    transport: require('role.transport'),
    builder: require('role.builder'),
    upgrader: require('role.upgrader')
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
