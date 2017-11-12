'use strict';

let roles = {

};

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        let sources = spawn.room.sources;
        let spawning = spawn.spawning;
        if (spawning) {
            let creep = Game.creeps[spawning.name];
            if (!creep.memory.id) {
                creep.assignment.assign(creep);
            }
        } else {

            for (let name in sources) {
                let source = sources[name];
                let workers = source.workers;
                const abilities = [WORK, WORK, MOVE];
                if (workers.length < 1 && spawn.spawnCreep(abilities, 'noname', {dryRun: true}) === OK) {
                    let newName = 'Miner' + Game.time;
                    let status = spawn.spawnCreep(abilities, newName, {
                        memory: {
                            role: 'miner',
                            assignment: source.id,
                            target: source.container.id,
                            range: 0,
                            action: 'mine'
                        }
                    }) === OK ? 'OK' : 'failed';
                    console.log(spawn.name + ': spawning ' + newName + ' - ' + status);
                }
            }
        }


    }
};
