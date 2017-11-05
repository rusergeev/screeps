let creepRoles = require('creep.roles');
let roleSpawn = require('role.spawn');
let roleLink = require('role.link');
require('prototype.tower');

module.exports.loop = function () {
    try {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            creepRoles.run(creep);
        }

        for (let name in Game.spawns) {
            var spawn = Game.spawns[name];
            roleSpawn.run(spawn);

            let links = spawn.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_LINK &&
                    s.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: ss => ss.structureType === STRUCTURE_CONTAINER ||
                            ss.structureType === STRUCTURE_STORAGE   }).length !== 0});

            for( let name in links) {
                roleLink.run(links[name]);
            }
        }

        let towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
        for (let tower of towers) {
            tower.defend();
        }



    } catch (e) {
        console.log('Brain Exeception', e);
    }
};