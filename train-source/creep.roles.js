var roleHarvester = require('role.harvester');

module.exports = {
    run: function(creep) {

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
    }
}