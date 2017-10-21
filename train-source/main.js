var creepRoles = require('creep.roles');
var roleSpawn = require('role.spawn');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepRoles.run(creep);
    }

    for(var name in Game.spawns) {
        var spawn = Game.spawns[name];
        roleSpawn.run(spawn);
    }

};