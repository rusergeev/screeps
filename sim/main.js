'use strict';

require('prototype.RoomPosition');
require('prototype.Room');
require('prototype.Creep');
require('prototype.RoomObject');
require('prototype.Source');

let roles = {
    spawn: require('role.spawn'),
    room: require('role.room'),
    creep: require('role.creep')
};

module.exports.loop = function () {
    try {

        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                console.log('Deleting: '+ name);
                let assignment = Game.getObjectById(Memory.creeps[name].assignment);
                console.log('Assignment: '+ assignment);
                if (assignment) {
                    console.log('Releaseing: '+ name);
                    assignment.release(Memory.creeps[name].id);
                }
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        let rooms = Game.rooms;
        for (let name in rooms){
            let room = rooms[name];
            roles['room'].run(room);
        }

        let spawns = Game.spawns;
        for(let name in spawns){
            let spawn = spawns[name];
            roles['spawn'].run(spawn);
        }

        let creeps = Game.creeps;
        for (let name in creeps) {
            let creep = creeps[name];
            roles['creep'].run(creep);
        }

    } catch (e) {
        console.log('Brain Exeception', e);
    }
};
