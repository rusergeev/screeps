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
                let assignment = Memory.creeps[name].assignment;
                if (assignment) {

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

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            creepRoles.run(creep);
        }

    } catch (e) {
        console.log('Brain Exeception', e);
    }
};
