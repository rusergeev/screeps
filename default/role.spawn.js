'use strict';

require('prototype.RoomPosition');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        try {
            if (spawn.spawning !== null) {
                return;
            }
            let sources = spawn.room.find(FIND_SOURCES).map(source => source.id);
            let harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester' && creep.room === spawn.room).length;
            if ( harvesters < sources.length ) {
                let role = 'harvester';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 24){
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK];
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
                let miner = _.filter(Game.creeps, creep => creep.memory.role === 'miner' && creep.memory.source === source ).length;
                let transport = _.filter(Game.creeps, creep => creep.memory.role === 'transport' && creep.memory.source === source ).length;
                if (miner < 1 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 5*BODYPART_COST[WORK]+3*BODYPART_COST[MOVE])) {
                    let role = 'miner';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    let abilities = [MOVE, WORK];
                    let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                    while (cost + BODYPART_COST[MOVE] + 2*BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                    abilities.length < 6){
                        abilities.push(MOVE);
                        abilities.push(WORK);
                        abilities.push(WORK);
                        cost += BODYPART_COST[MOVE] + 2*BODYPART_COST[WORK];
                    }
                    if(cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= spawn.room.energyAvailable &&
                        abilities.length < 8){
                        abilities.push(MOVE);
                        abilities.push(WORK);
                    }
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                    return;
                } else if ( transport < 1 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 16*BODYPART_COST[CARRY]+8*BODYPART_COST[MOVE]) ) {
                    let role = 'transport';
                    let target = spawn.room.storage
                        || spawn.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
                    if (target === undefined) {
                        target = spawn;
                    }
                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                    while (cost + BODYPART_COST[MOVE]+ 2 * BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 24){
                        abilities.push(MOVE);
                        abilities.push(CARRY);
                        abilities.push(CARRY);
                        cost += BODYPART_COST[MOVE]+ 2 * BODYPART_COST[CARRY];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source, target: target.id}});

                    return;
                }
            }
            let constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES).length;
            let builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder' && creep.room === spawn.room).length;
            let structure = spawn.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                    (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)&& s.hits < 750000
            });

            if ((!!structure || constructionSites > builders) && builders < sources.length
                && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 8*BODYPART_COST[WORK] + 8*BODYPART_COST[CARRY] + 8*BODYPART_COST[MOVE])) {
                let role = 'builder';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 24){
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (false) {
                let builders_exp = _.filter(Game.creeps, creep => creep.memory.role === 'builder_exp').length;
                if (builders_exp < 2
                    && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 8*BODYPART_COST[WORK] + 8*BODYPART_COST[CARRY] + 8*BODYPART_COST[MOVE])) {
                    let role = 'builder_exp';
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
            }
            let upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader' && creep.room === spawn.room).length;
            if ( upgraders < 1 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 32*BODYPART_COST[WORK] + 3*BODYPART_COST[CARRY] + 15*BODYPART_COST[MOVE])) {
                let role = 'upgrader';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 47){
                    abilities.push(MOVE);
                    abilities.push(WORK);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK];
                }
                while (cost + BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 50){
                    abilities.push(CARRY);
                    cost += BODYPART_COST[CARRY];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (false && sources.length > 1) {
                let destroyers = _.filter(Game.creeps, creep => creep.memory.role === 'destroyer' ).length;
                if (destroyers < 5 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 25*BODYPART_COST[ATTACK] + 25*BODYPART_COST[MOVE])) {
                    let role = 'destroyer';
                    let newName = role + Game.time;
                    let abilities = [ATTACK, MOVE];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[ATTACK] + BODYPART_COST[MOVE] <= spawn.room.energyAvailable && abilities.length < 50) {
                        abilities.push(ATTACK);
                        abilities.push(MOVE);
                        cost += BODYPART_COST[ATTACK] + BODYPART_COST[MOVE];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }

                let medics = _.filter(Game.creeps, creep => creep.memory.role === 'medic' ).length;
                if (medics < 0 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 25*BODYPART_COST[HEAL] + 25*BODYPART_COST[MOVE])) {
                    let role = 'medic';
                    let newName = role + Game.time;
                    let abilities = [HEAL, MOVE];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[HEAL] + BODYPART_COST[MOVE] <= spawn.room.energyAvailable && abilities.length < 50) {
                        abilities.push(HEAL);
                        abilities.push(MOVE);
                        cost += BODYPART_COST[HEAL] + BODYPART_COST[MOVE];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }
            }
            if (false){
                let blockers = _.filter(Game.creeps, creep => creep.memory.role === 'blocker' && creep.room === spawn.room).length;
                if (blockers < 3 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 25*BODYPART_COST[TOUGH] + 25*BODYPART_COST[MOVE])) {
                    let role = 'blocker';
                    let newName = role + Game.time;
                    let abilities = [MOVE, TOUGH];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[MOVE] + BODYPART_COST[TOUGH] <= spawn.room.energyAvailable && abilities.length < 50) {
                        abilities.push(MOVE);
                        abilities.push(TOUGH);
                        cost += BODYPART_COST[MOVE] + BODYPART_COST[TOUGH];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }
            }
            if (false) {
                let role = 'atob';
                let creeps = _.filter(Game.creeps, creep => creep.memory.role === role ).length;
                if (creeps < 1 && spawn.room.energyAvailable < _.min(spawn.room.energyCapacityAvailable, 16*BODYPART_COST[CARRY] + 8*BODYPART_COST[MOVE])) {
                    let source = Game.rooms.E39N46.storage;
                    let target = Game.rooms.E39N47.storage;

                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[MOVE] + 2 * BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 24) {
                        abilities.push(MOVE);
                        abilities.push(CARRY);
                        abilities.push(CARRY);
                        cost += BODYPART_COST[MOVE] + 2 * BODYPART_COST[CARRY];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source.id, target: target.id}});
                    return;
                }
            }
        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
