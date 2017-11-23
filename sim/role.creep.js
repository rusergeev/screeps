let roles = {
    miner: require('role.miner'),
    transport: require('role.transport')
};

module.exports = {
    run: function(creep) {
        if (roles[creep.role]) {
            roles[creep.role].run(creep);
        } else {
            console.log(creep + ': cannot handle role '+ creep.role);
        }
    }
};
