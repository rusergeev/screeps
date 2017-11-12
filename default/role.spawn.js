module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        let abilities = [WORK, CARRY, MOVE, MOVE];
        let harvester_abilities = abilities;
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.room === spawn.room);
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room === spawn.room);
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room === spawn.room);
        
        let energy = spawn.room.energyAvailable;
        if (energy >= 550){
            abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 800){
            abilities = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1050){
            abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1800){
            abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                         CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }

        let links = spawn.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_LINK &&
                    s.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: ss => ss.structureType === STRUCTURE_CONTAINER ||
                                      ss.structureType === STRUCTURE_STORAGE   }).length !== 0});
        let linkster_link_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'linkster' && creep.room === spawn.room).map(c => c.memory.link);
        if(links.length !== linkster_link_ids.length) {
            let linkster_abilities = [CARRY, MOVE, CARRY];
            if (spawn.spawnCreep(linkster_abilities, "dry-run", {dryRun: true}) === OK) {
                for (var i in links) {
                    let link = links[i];
                    if (linkster_link_ids.indexOf(link.id) === -1) {
                        let newName = 'Linkster' + Game.time;
                        console.log('Spawning new linkster: ' + newName);
                        spawn.spawnCreep(linkster_abilities, newName, {
                            memory: {
                                role: 'linkster',
                                link: link.id
                            }
                        });
                    }
                }
            }
        }

        let sources = spawn.room.find(FIND_SOURCES);
        let miners_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && creep.room === spawn.room).map(c => c.memory.source);
        if (sources.length > miners_ids.length) {
            let miner_abilities = [WORK, WORK, WORK, WORK, WORK, MOVE,TOUGH,TOUGH,TOUGH,TOUGH];
            if (spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) === OK) {
                for (var i in sources) {
                    let source = sources[i];
                    if (miners_ids.indexOf(source.id) === -1) {
                        let newName = 'Miner' + Game.time;
                        console.log('Spawning new miner: ' + newName);
                        spawn.spawnCreep(miner_abilities, newName, {
                            memory: {
                                role: 'miner',
                                source: source.id
                            }
                        });
                    }
                }
            }
        } else if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) === OK) {
            if (harvesters.length < 1) {
                let newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep(harvester_abilities, newName, {memory: {role: 'harvester'}});
            } else if (upgraders.length < 1 ){
                let newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'upgrader'}});
            } else if (builders.length < 3 && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                let newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'builder'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_upgrader').length < 0) {
                let newName = 'UHelper' + Game.time;
                console.log('Spawning new helper_upgrader: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_upgrader'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_builder' ).length < 0) {
                let newName = 'BHelper' + Game.time;
                console.log('Spawning new helper_builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_builder'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_harvester' ).length < 0) {
                let newName = 'HHelper' + Game.time;
                console.log('Spawning new helper_harvester: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_harvester'}});
            }
        }
    }
};
