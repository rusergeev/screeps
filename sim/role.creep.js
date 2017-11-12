let roles = {
    miner: require('role.miner'),
};

module.exports = {
    run: function(creep) {
        roles[creep.memory.role].run(creep);
    }
};
