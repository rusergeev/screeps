'use strict';

let roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    miner: require('role.miner'),
    linkster: require('role.linkster'),
    claimer: require('role.claimer')
};

module.exports = {
    run: function(creep) {
        roles[creep.memory.role].run(creep);
    }
};
