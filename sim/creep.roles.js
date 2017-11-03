let roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    miner: require('role.miner'),
    medic: require('role.medic'),
    linkster: require('role.linkster')
};

module.exports = {
    run: function(creep) {
        roles[creep.memory.role].run(creep);
    }
}
