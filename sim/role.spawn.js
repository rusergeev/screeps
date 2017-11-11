'use strict';

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        let sources = spawn.room.sources;
        let spawning = spawn.spawning;
        if (spawning){
            let creep = Game.creeps[spawning.name];
            if (creep.memory.assignme) {
                creep.memory.assignme = undefined;
                let source = Game.getObjectById(creep.memory.source);
                source.memory.workers.push(creep.id);
                console.log(creep.id);
            }
        } else {

            for (let name in sources) {
                let source = sources[name];
                let workers = source.workers;
                const abilities = [WORK, MOVE];
                if (workers.length < 1 && spawn.spawnCreep(abilities, 'noname', {dryRun: true}) === OK) {
                    let newName = 'Miner' + Game.time;
                    if (spawn.spawnCreep(abilities, newName, {memory: {role: 'miner', source: source.id, assignme: true}})) {
                        source.workers.push(spawn.spawning);
                    }
                }
            }
        }

    }
};
