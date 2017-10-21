var creepRoles = require('creep.roles');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 12 && Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], "dry-run", {dryRun: true}) == OK) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepRoles.run(creep);
    }
};