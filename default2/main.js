'use strict';

let roles = {
    spawn: require('role.spawn'),
    room: require('role.room'),
    creep:  require('role.creep')
};

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
            roles['creep'].run(creep);
        }

        for (let name in Game.spawns) {
            let spawn = Game.spawns[name];
            roles['spawn'].run(spawn);
        }

        for( let name in Game.rooms) {
            roles['room'].run(Game.rooms[name]);
        }

        let towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
        for (let tower of towers) {
            tower.defend();
        }
        const brown_flags_0 = _.filter(Game.flags, f => f.color === COLOR_BROWN && f.room && f.room.lookForAt(LOOK_STRUCTURES, f).length === 0);
        if (brown_flags_0.length > 0)
            brown_flags_0.forEach(f => f.remove());
    } catch (e) {
        console.log('main exception:', e);
    }
};
