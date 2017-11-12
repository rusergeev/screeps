'use strict';

require('prototype.Room');
require('prototype.Creep');
require('prototype.RoomObject');
require('prototype.Source');

let creepRoles = require('creep.roles');
let roleSpawn = require('role.spawn');
let roleLink = require('role.link');
let roleRoom = require('role.room');
require('prototype.StructureTower');

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
            roleRoom.run(room);
        }

        let spawns = Game.spawns;
        for(let name in spawns){
            let spawn = spawns[name];
            roleSpawn.run(spawn);
        }
    } catch (e) {
        console.log('Brain Exeception', e);
    }
};
