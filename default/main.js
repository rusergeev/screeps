var creepRoles = require('creep.roles');
var roleSpawn = require('role.spawn');
require('prototype.tower');

module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepRoles.run(creep);
    }

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        roleSpawn.run(spawn);
    }

    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.defend();
    }
};