'use strict';

//require('prototype.RoomPosition');
//require('prototype.Room');
//require('prototype.Creep');
//require('prototype.RoomObject');
//require('prototype.Source');

let roles = {
    spawn: {role: require('role.spawn'), memory: Memory.spawns, objects: Game.spawns},
    room: {role: require('role.room'), memory: Memory.rooms, objects: Game.rooms},
    creep: {role: require('role.creep'), memory: Memory.creeps, objects: Game.creeps},
};

module.exports.loop = function () {
    for (let role_name in roles) {
        try {
            let role = roles[role_name];
            let memory = role['memory'];
            let objects = role['objects'];
            for (let name in memory) {
                if (!objects[name]) {
                    console.log('Deleting: ' + name);
                    delete memory[name];
                    console.log('Clearing non-existing '+ role_name + ' memory:', name);
                }
            }
            for (let name in objects) {
                role['role'].run(objects[name]);
            }
        } catch (e) {
            console.log(role_name + ' exception', e);
        }
    }
};
