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
                    let newName = role + Game.time + spawn.name;
                    console.log(spawn + ': spawning ' + newName);
                    let abilities = [MOVE, WORK, WORK];
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                } else if ( transport === 0) {
                    let role = 'transport';
                    let target = spawn.id;
                    let newName = role + Game.time + spawn.name;
                    let abilities = [MOVE, CARRY, CARRY];
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source, target: target}});
                }
            }
        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
