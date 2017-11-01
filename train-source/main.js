'use strict';

let roles = {
    room: require('role.room'),
    spawn: require('role.spawn')
};

module.exports.loop = function () {
    console.log('tick ',Game.time);
    var rooms = {};
    let spawns = Game.spawns;
    for(var name in spawns){
        let spawn = spawns[name];
        rooms[spawn.room.name] = spawn.room;
        roles['spawn'].run(spawn);
    }
    for( var name in rooms){
        let room = rooms[name];
        roles['room'].run(room);
    }
};