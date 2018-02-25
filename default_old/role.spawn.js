module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        if (Game.time % 2 !== 0) {return;}
        let abilities = [WORK, CARRY, MOVE, MOVE];
        let harvester_abilities = abilities;
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.room === spawn.room);
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room === spawn.room);
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room === spawn.room);

        let energy = spawn.room.energyAvailable;
        if (energy >= 550) {
            abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 800) {
            abilities = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1050) {
            abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1800) {
            abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (harvesters.length < 2) {
            let newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep(harvester_abilities, newName, {memory: {role: 'harvester'}});
        } else  if (spawn.room.energyAvailable > spawn.room.energyCapacityAvailable/2) {
            let links = spawn.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_LINK &&
                    s.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: ss => ss.structureType === STRUCTURE_CONTAINER ||
                            ss.structureType === STRUCTURE_STORAGE
                    }).length !== 0
            });
            let linkster_link_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'linkster' && creep.room === spawn.room).map(c => c.memory.link);
            if (links.length !== linkster_link_ids.length) {
                let linkster_abilities = [CARRY, MOVE, CARRY];
                if (spawn.spawnCreep(linkster_abilities, "dry-run", {dryRun: true}) === OK) {
                    for (let name in links) {
                        let link = links[name];
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

            let sources = spawn.room.find(FIND_SOURCES).concat(spawn.room.find(FIND_MINERALS, {
                filter: m => m.pos.findInRange(FIND_STRUCTURES, 0, {
                    filter: s => s.structureType === STRUCTURE_EXTRACTOR
                }).length === 1 && m.amount >= 50
            }));
            let miners_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && creep.room === spawn.room).map(c => c.memory.source);
            let transport_ids = _.filter(Game.creeps, (creep) => creep.memory.role === 'transport' && creep.room === spawn.room).map(c => c.memory.source);
            if (sources.length > miners_ids.length) {
                let miner_abilities = [WORK, MOVE];
                if (spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) === OK) {
                    for (let name in sources) {
                        let source = sources[name];
                        if (miners_ids.indexOf(source.id) === -1) {
                            let w = Math.min(Math.floor((energy - BODYPART_COST[MOVE]) / BODYPART_COST[WORK]), Math.ceil(source.energyCapacity / ENERGY_REGEN_TIME / HARVEST_POWER));
                            let m = Math.min(Math.floor((energy - w * BODYPART_COST[WORK]) / BODYPART_COST[MOVE]), Math.ceil(w / 2));
                            let miner_abilities = [];
                            for (let i = 0; i < w; i++) {
                                miner_abilities.push(WORK);
                            }
                            for (let i = 0; i < m; i++) {
                                miner_abilities.push(MOVE);
                            }
                            let newName = 'Miner' + Game.time;
                            console.log('Spawning new miner: [WORK]x' + w + ' [MOVE]x' + m + ' : ' + newName);
                            spawn.spawnCreep(miner_abilities, newName, {
                                memory: {
                                    role: 'miner',
                                    source: source.id
                                }
                            });
                        }
                    }
                }
            } else if (sources.length > transport_ids.length) {
                let transport_abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                if (spawn.spawnCreep(transport_abilities, "dry-run", {dryRun: true}) === OK) {
                    for (let name in sources) {
                        let source = sources[name];
                        if (transport_ids.indexOf(source.id) === -1) {
                            let target =
                                source.room.storage ||
                                source.pos.findClosestByRange(FIND_STRUCTURES, {
                                    filter: structure =>
                                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER].indexOf(structure.structureType) > -1 &&
                                        structure.energy < structure.energyCapacity
                                });
                            let path = source.pos.findPathTo(target, {ignoreCreeps: true});
                            let t = Object.keys(path).length * 2;
                            let c = Math.min(Math.floor((energy - BODYPART_COST[MOVE]) / BODYPART_COST[CARRY]), Math.ceil(t * source.energyCapacity / ENERGY_REGEN_TIME / CARRY_CAPACITY));
                            let m = Math.min(Math.floor((energy - c * BODYPART_COST[CARRY]) / BODYPART_COST[MOVE]), Math.ceil(c / 2));
                            let transport_abilities = [];
                            for (let i = 0; i < c; i++) {
                                transport_abilities.push(CARRY);
                            }
                            for (let i = 0; i < m; i++) {
                                transport_abilities.push(MOVE);
                            }
                            let newName = 'Transport' + Game.time;
                            console.log('Spawning new transport:(t=' + t + ') [CARRY]x' + c + ' [MOVE]x' + m + ' : ' + newName);
                            spawn.spawnCreep(transport_abilities, newName, {
                                memory: {
                                    role: 'transport',
                                    source: source.id
                                }
                            });
                        }
                    }
                }
            }
        }
        if (spawn.room.energyAvailable === spawn.room.energyCapacityAvailable) {
             if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) === OK) {
                if (upgraders.length < 1) {
                    let newName = 'Upgrader' + Game.time;
                    let n = Math.min(Math.floor(energy / (BODYPART_COST[CARRY] + BODYPART_COST[MOVE] + 2*BODYPART_COST[WORK])), 8);
                    let upgrader_abilities = [];
                    for (let i = 0; i < n; i++) {
                        upgrader_abilities.push(CARRY);
                        upgrader_abilities.push(MOVE);
                        upgrader_abilities.push(WORK);
                        upgrader_abilities.push(WORK);
                    }
                    console.log('Spawning new upgrader: [CARRY][MOVE][WORK]x' + n + ':' + newName);
                    let result = spawn.spawnCreep(upgrader_abilities, newName, {memory: {role: 'upgrader'}});
                    console.log(result);
                } else if (builders.length < 3 && spawn.room.find(FIND_CONSTRUCTION_SITES).length > 1) {

                    let newName = 'Builder' + Game.time;
                    console.log('Spawning new builder: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'builder'}});
                } else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'helper_upgrader').length < 0) {
                    let newName = 'UHelper' + Game.time;
                    console.log('Spawning new helper_upgrader: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_upgrader'}});
                } else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'helper_builder').length < 0) {
                    let newName = 'BHelper' + Game.time;
                    console.log('Spawning new helper_builder: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'helper_builder'}});
                } else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'helper_harvester').length < 1
                    && spawn.room.storage && spawn.room.storage.id === Game.spawns.Spawn3.room.storage.id) {
                    let newName = 'HHelper' + Game.time;
                    console.log('Spawning new helper_harvester: ' + newName);
                    spawn.spawnCreep(harvester_abilities, newName, {
                        memory: {
                            role: 'helper_harvester',
                            storage: Game.spawns.Spawn3.room.storage.id,
                            target: Game.spawns.Spawn2.room.storage.id
                        }
                    });
                } else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'destroyer').length < 3){
                    let newName = 'Destroyer' + Game.time;
                    let n = Math.floor(energy / (BODYPART_COST[TOUGH] + BODYPART_COST[ATTACK] + 2*BODYPART_COST[MOVE]));
                    let abilities = [];
                    for (let i = 0; i < n; i++) {
                        abilities.push(TOUGH);
                    }
                    for (let i = 0; i < n; i++) {
                        abilities.push(ATTACK);
                    }
                    for (let i = 0; i < 2*n; i++) {
                        abilities.push(MOVE);
                    }

                    console.log('Spawning new destroyer: [TOUGH][ATTACK][MOVE]x' + n + ':' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'destroyer'}});
                } else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'medic').length < _.filter(Game.creeps, (creep) => creep.memory.role === 'destroyer').length) {
                    let newName = 'Medic' + Game.time;
                    let n = Math.floor(energy / (3*BODYPART_COST[TOUGH] + BODYPART_COST[HEAL] + 4*BODYPART_COST[MOVE]));
                    let abilities = [];
                    for (let i = 0; i < 3*n; i++) {
                        abilities.push(TOUGH);
                    }
                    for (let i = 0; i < n; i++) {
                        abilities.push(HEAL);
                    }
                    for (let i = 0; i < 4*n; i++) {
                        abilities.push(MOVE);
                    }

                    console.log('Spawning new medic: [TOUGH][HEAL][MOVE]x' + n + ':' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'medic'}});
                }
            }

        }
    }
};
