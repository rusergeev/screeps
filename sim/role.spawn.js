'use strict';

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
                const miner_abilities = [WORK, MOVE];
                let miners_number = source.workers.filter(worker => worker.role === 'miner').length;
                if ( miners_number === 0 && spawn.spawnCreep(miner_abilities, 'noname', {dryRun: true}) === OK) {
                    let newName = 'Miner' + Game.time;
                    let status = spawn.spawnCreep(miner_abilities, newName, {
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
                const transport_abilities = [CARRY, MOVE];
                let transport_number = source.workers.filter(worker => worker.role === 'transport').length;
                if (miners_number > 0 && transport_number < 1 &&
                    spawn.spawnCreep(transport_abilities, 'noname', {dryRun: true}) === OK) {
                    let newName = 'Transport' + Game.time;
                    let status = spawn.spawnCreep(transport_abilities, newName, {
                        memory: {
                            role: 'transport',
                            assignment: source.id,
                            target: source.container.id,
                            range: 1,
                            action: 'withdraw'
                        }
                    }) === OK ? 'OK' : 'failed';
                    console.log(spawn.name + ': spawning ' + newName + ' - ' + status);
                }
            }
        }

    }
};
