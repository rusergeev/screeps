var creepRoles = require('creep.roles');
var roleSpawn = require('role.spawn');
var roleLink = require('role.link');
require('prototype.tower');

module.exports.loop = function () {
    try {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let rooms = Game.rooms;

        for( var name in rooms){
            let room = rooms[name];

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

    } catch (e) {
        console.log('Brain Exeception', e);
    }
};