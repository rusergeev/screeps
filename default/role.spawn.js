'use strict';

require('prototype.RoomPosition');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        try {
            let sources = spawn.room.find(FIND_SOURCES).map(source => source.id);
            for (let i in sources) {
                let source = sources[i];
                let miner = _.filter(Game.creeps, creep => creep.memory.role === 'miner' && creep.memory.source === source ).length;
                let transport = _.filter(Game.creeps, creep => creep.memory.role === 'transport' && creep.memory.source === source ).length;
                if (miner === 0) {
                    let role = 'miner';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    let abilities = [MOVE, WORK, WORK];
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                    return;
                } else if ( transport === 0) {
                    let role = 'transport';
                    let target = spawn.id;
                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source, target: target}});
                    return;
                }
            }
            let constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES).length;
            let builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder').length;
            if (constructionSites > builders && builders < 2) {
                let role = 'builder';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            let upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader').length;
            if ( upgraders < 1 ) {
                let role = 'upgrader';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if ( 1 ) {

            }
        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
