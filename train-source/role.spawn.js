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
            let linkster_abilities = [CARRY, MOVE, CARRY, MOVE, TOUGH, TOUGH, TOUGH, TOUGH];
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

        let x_room = Game.rooms['W53N46'];
        let x_containers = x_room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_CONTAINER});
        let x_miners_container_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && creep.room === x_room).map(c => c.memory.container);
        if (x_containers.length > x_miners_container_ids.length) {
            let miner_abilities = [WORK, WORK, WORK, WORK, WORK, MOVE,TOUGH,TOUGH,TOUGH,TOUGH];
            if (spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) === OK) {
                for (var i in x_containers) {
                    let container = x_containers[i];
                    if (x_miners_container_ids.indexOf(container.id) === -1) {
                        let newName = 'Miner' + Game.time;
                        console.log('Spawning new miner: ' + newName);
                        spawn.spawnCreep(miner_abilities, newName, {
                            memory: {
                                role: 'miner',
                                container: container.id
                            }
                        });
                    }
                }
            }
        }

        let containers = spawn.room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_CONTAINER});
        let miners_container_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && creep.room === spawn.room).map(c => c.memory.container);
        if (containers.length > miners_container_ids.length) {
            let miner_abilities = [WORK, WORK, WORK, WORK, WORK, MOVE,TOUGH,TOUGH,TOUGH,TOUGH];
            if (spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) === OK) {
                for (var i in containers) {
                    let container = containers[i];
                    if (miners_container_ids.indexOf(container.id) === -1) {
                        let newName = 'Miner' + Game.time;
                        console.log('Spawning new miner: ' + newName);
                        spawn.spawnCreep(miner_abilities, newName, {
                            memory: {
                                role: 'miner',
                                container: container.id
                            }
                        });
                    }
                }
            }
        } else if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) === OK) {
            if (harvesters.length + upgraders.length < 4) {
                if (harvesters.length <= upgraders.length) {
                    let newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    spawn.spawnCreep(harvester_abilities, newName, {memory: {role: 'harvester'}});
                } else {
                    let newName = 'Upgrader' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'upgrader'}});
                }
            } else if (builders.length < 1) {
                let newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'builder'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_upgrader').length < 5) {
                let newName = 'UHelper' + Game.time;
                console.log('Spawning new helper_upgrader: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_upgrader'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_builder' ).length < 0) {
                let newName = 'BHelper' + Game.time;
                console.log('Spawning new helper_builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_builder'}});
            } else if ( _.filter(Game.creeps, (creep) => creep.memory.role === 'helper_harvester' ).length < 5) {
                let newName = 'HHelper' + Game.time;
                console.log('Spawning new helper_harvester: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_harvester'}});
            }
        }
    }
};
