'use strict';

require('prototype.RoomPosition');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        try {
            if (spawn.spawning !== null || !spawn.isActive()) {
                return;
            }
            let sources = spawn.room.find(FIND_SOURCES).map(source => source.id);
            const harvesters = _.filter(Game.creeps, creep =>
                ['harvester', 'atob'].indexOf(creep.memory.role) !== -1
                && creep.room === spawn.room).length;
            const atob_carry = _.sum(_.map(_.filter(Game.creeps, creep =>
                ['harvester', 'atob'].indexOf(creep.memory.role) !== -1
                && creep.room === spawn.room), c => c.getActiveBodyparts(CARRY)));
            //console.log(spawn.room, atob_carry);
            const miners = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 50)
                && creep.memory.role === 'miner'
                && creep.room === spawn.room).length;
            if ( atob_carry === 0
                || atob_carry < sources.length*15
                && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 16 * BODYPART_COST[CARRY] + 8 * BODYPART_COST[MOVE]]) ) {
                let role = 'atob';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                const CARRY_OR_WORK = (miners > 0) ? CARRY : WORK;
                if (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[CARRY_OR_WORK] <= spawn.room.energyAvailable) {
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(CARRY_OR_WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[CARRY_OR_WORK];
                }
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[CARRY_OR_WORK] <= spawn.room.energyAvailable && abilities.length < 30) {
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(CARRY_OR_WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[CARRY_OR_WORK];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role, spawn: spawn.id}});
                return;
            }
            if (spawn.room.energyAvailable < spawn.room.energyCapacityAvailable) {
                //return;
            }
            for (let i in sources) {
                let source = sources[i];
                let miner = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'miner' && creep.memory.source === source).length;
                let transport = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'transport' && creep.memory.source === source).length;
                if (miner < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 5 * BODYPART_COST[WORK] + 3 * BODYPART_COST[MOVE]])) {
                    let role = 'miner';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    let abilities = [MOVE, WORK];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[MOVE] + 2 * BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                    abilities.length < 6) {
                        abilities.push(MOVE);
                        abilities.push(WORK);
                        abilities.push(WORK);
                        cost += BODYPART_COST[MOVE] + 2 * BODYPART_COST[WORK];
                    }
                    if (cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                        abilities.length < 8) {
                        abilities.push(MOVE);
                        abilities.push(WORK);
                    }
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                    return;
                }
            }
            let constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length;
            let builders = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'builder' && creep.room === spawn.room).length;
            let structure = spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                    (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) && s.hits < 1750000
            });

            if ((!!structure || constructionSites > builders) && builders < sources.length
                && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 8 * BODYPART_COST[WORK] + 8 * BODYPART_COST[CARRY] + 8 * BODYPART_COST[MOVE]])) {
                let role = 'builder';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 24) {
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            let upgraders = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 50)
                && creep.memory.role === 'upgrader' && creep.room === spawn.room).length;
            if (upgraders < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 23 * BODYPART_COST[WORK] + 3 * BODYPART_COST[CARRY] + 12 * BODYPART_COST[MOVE]])) {
                let role = 'upgrader';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 15 * sources.length) {
                    abilities.push(MOVE);
                    abilities.push(WORK);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK];
                }
                while (cost + BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 16 * sources.length) {
                    abilities.push(CARRY);
                    cost += BODYPART_COST[CARRY];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (false && (spawn.room.name === 'E36N49' || spawn.room.name === 'E35N47') && sources.length > 1) {


                let medics = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'medic');
                //let destroyer_needs_medic = destroyers.filter( destroyer => medics.map(m => m.memory.patient).indexOf(destroyer.id) == -1)[0];
                const med_abilities = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                const med_abilities_cost = med_abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                if (medics.length < 5 && spawn.room.energyAvailable >= med_abilities_cost) {


                    let role = 'medic';
                    let newName = role + Game.time;

                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(med_abilities, newName, {memory: {role: role}});
                    return;
                }
                let blocker_abilities = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                let blocker_abilities_cost = blocker_abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);

                let blockers = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'blocker').length;
                if (blockers < 3 && spawn.room.energyAvailable >= blocker_abilities_cost) {
                    let role = 'blocker';
                    let newName = role + Game.time;

                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(blocker_abilities, newName, {memory: {role: role}});
                    return;
                }
                let destroyers = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'destroyer');
                const des_abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
                const des_abilities_cost = des_abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                if (destroyers.length < 3 && spawn.room.energyAvailable >= des_abilities_cost) {
                    let role = 'destroyer';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(des_abilities, newName, {memory: {role: role}});
                    return;
                }


                let claimers = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'claimer');
                if (claimers.length < 0 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 1 * BODYPART_COST[CLAIM] + 5 * BODYPART_COST[MOVE]])) {
                    let role = 'claimer';
                    let newName = role + Game.time;
                    let abilities = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE];
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }
                let watchdogs = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100) 
                && creep.memory.role === 'watchdog');
                const wd_abilities = [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];
                const wd_abilities_cost = wd_abilities.reduce(function (cost, part) {
                    return cost + BODYPART_COST[part];
                }, 0);
                if (Game.flags.Flag3 && watchdogs.length < 0 && spawn.room.energyAvailable >= wd_abilities_cost) {
                    let role = 'watchdog';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(wd_abilities, newName, {memory: {role: role}});
                    return;
                }

            }

            if (true) {
                const related_flags = _.filter(Game.flags, flag => flag.name.startsWith(spawn.room.name));
                for (let i in related_flags) {
                    const flag = related_flags[i];
                    if (flag.color === COLOR_RED) {
                        let role = 'watchdog';
                        let creeps = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name)+1))
                && creep.memory.role === role && creep.memory.flag === flag.name);
                        let abilities = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL, HEAL, HEAL];
                        //const abilities = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL];
                        if (flag.secondaryColor === COLOR_WHITE){
                            abilities = [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL];
                        }
                        const cost = abilities.reduce(function (cost, part) {
                            return cost + BODYPART_COST[part];
                        }, 0);
                        if (creeps.length < 1 && spawn.room.energyAvailable >= cost) {

                            let newName = role + Game.time;
                            console.log(spawn, 'spawning', newName, 'with', flag.name);
                            spawn.spawnCreep(abilities, newName, {memory: {role: role, flag: flag.name}});
                            return;
                        }
                    }
                    if (flag.color === COLOR_GREEN) {
                        if (flag.secondaryColor === COLOR_GREEN) {
                            const role = 'remote_builder';
                            const creeps = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name) + 1))
                                && creep.memory.role === role && creep.memory.flag === flag.name);
                            const abilities = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
                            let cost = abilities.reduce(function (cost, part) {
                                return cost + BODYPART_COST[part];
                            }, 0);
                            if (creeps.length < 1 && spawn.room.energyAvailable >= cost) {
                                let newName = role + Game.time;
                                console.log(spawn, 'spawning', newName, 'with', flag.name);
                                const target = (spawn.room.storage || spawn).id;
                                spawn.spawnCreep(abilities, newName, {
                                    memory: {
                                        role: role,
                                        flag: flag.name,
                                        target: target
                                    }
                                });
                                return;
                            }
                        }
                        if (flag.secondaryColor !== COLOR_WHITE) {
                            const role = 'claimer';
                            const creeps = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name)+1))
                                && creep.memory.role === role && creep.memory.flag === flag.name);
                            const abilities = [CLAIM, MOVE, CLAIM, MOVE];
                            const cost = abilities.reduce(function (cost, part) {
                                return cost + BODYPART_COST[part];
                            }, 0);
                            if (creeps.length < 1 && spawn.room.energyAvailable >= cost) {
                                let newName = role + Game.time;
                                console.log(spawn, 'spawning', newName, 'with', flag.name);
                                const target = (spawn.room.storage || spawn).id;
                                spawn.spawnCreep(abilities, newName, {
                                    memory: {
                                        role: role,
                                        flag: flag.name,
                                        target: target
                                    }
                                });
                                return;
                            }

                            if (flag.room){
                                const sources = flag.room.find(FIND_SOURCES).map(source => source.id);
                                for (let i in sources) {
                                    let source = sources[i];
                                    let miner = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name)+1))
                                        && creep.memory.role === 'miner' && creep.memory.source === source).length;
                                    if (miner < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 5 * BODYPART_COST[WORK] + 3 * BODYPART_COST[MOVE]])) {
                                        let role = 'miner';
                                        let newName = role + Game.time;
                                        console.log(spawn + ': spawning ' + newName);
                                        let abilities = [MOVE, WORK];
                                        let cost = abilities.reduce(function (cost, part) {
                                            return cost + BODYPART_COST[part];
                                        }, 0);
                                        while (cost + BODYPART_COST[MOVE] + 2 * BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                                        abilities.length < 6) {
                                            abilities.push(MOVE);
                                            abilities.push(WORK);
                                            abilities.push(WORK);
                                            cost += BODYPART_COST[MOVE] + 2 * BODYPART_COST[WORK];
                                        }
                                        if (cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                                            abilities.length < 8) {
                                            abilities.push(MOVE);
                                            abilities.push(WORK);
                                        }
                                        spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    if (flag.color === COLOR_YELLOW) {
                        const role = 'remote_harvester';
                        const creeps = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name)+1))
                            && creep.memory.role === role && creep.memory.flag === flag.name);
                        //const abilities = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                        let abilities = [WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                        /*if (spawn.room.name === 'E37N43'){
                            abilities = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                        }*/
                        const cost = abilities.reduce(function (cost, part) {
                            return cost + BODYPART_COST[part];
                        }, 0);
                        if (creeps.length < 1 && spawn.room.energyAvailable >= cost) {

                            let newName = role + Game.time;
                            console.log(spawn, 'spawning', newName, 'with', flag.name);
                            const target = (spawn.room.storage || spawn).id;
                            spawn.spawnCreep(abilities, newName, {
                                memory: {
                                    role: role,
                                    flag: flag.name,
                                    target: target
                                }
                            });
                            return;
                        }
                    }
                    if (flag.color === COLOR_ORANGE) {
                        const role = 'upgrader';
                        const creeps = _.filter(Game.creeps, creep => (!creep.ticksToLive || creep.ticksToLive > 100 * (Game.map.getRoomLinearDistance(flag.pos.roomName, spawn.room.name)+1) )
                && creep.memory.role === role && creep.memory.flag === flag.name);
                        if (creeps.length < 1) {
                            const newName = role + Game.time;
                            let abilities = [MOVE, CARRY, WORK, WORK, WORK, WORK];
                            let cost = abilities.reduce(function (cost, part) {
                                return cost + BODYPART_COST[part];
                            }, 0);
                            while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY]  + 4 * BODYPART_COST[WORK] <= spawn.room.energyAvailable) {
                                abilities.push(MOVE);
                                abilities.push(CARRY);
                                abilities.push(WORK);
                                abilities.push(WORK);
                                abilities.push(WORK);
                                abilities.push(WORK);
                                cost += BODYPART_COST[MOVE] + 4 * BODYPART_COST[WORK];
                            }
                            console.log(spawn, 'spawning', newName, 'with', flag.name);
                            spawn.spawnCreep(abilities, newName, {memory: {role: role, flag: flag.name}});
                            return;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
