let roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    miner: require('role.miner'),
    transport: require('role.transport'),
    linkster: require('role.linkster'),
    claimer: require('role.claimer'),
    helper_upgrader: require('role.upgrader.experimental'),
    helper_builder: require('role.builder.experimental'),
    helper_harvester: require('role.harvester.experimental')

};

module.exports = {
    run: function(creep) {
        roles[creep.memory.role].run(creep);
    }
};
