'use strict';

let roles = {
    miner : require('role.miner'),
    transport: require('role.transport')
};

module.exports = {
    run: function(creep) {
        if (roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        } else {
            console.log(creep + ': cannot handle role '+ creep.memory.role);
        }
    }
};
