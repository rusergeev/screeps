'use strict';

require('prototype.RoomPosition');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        try {
            let harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester' && creep.room === spawn.room).length;
            if ( harvesters < 2 ) {
                let role = 'harvester';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable){
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (spawn.room.energyAvailable !== spawn.room.energyCapacityAvailable) {
                return;
            }
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
                    let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                    while (cost + BODYPART_COST[WORK] <= spawn.room.energyAvailable && cost < BODYPART_COST[MOVE]+ 5*BODYPART_COST[WORK]){
                        abilities.push(WORK);
                        cost += BODYPART_COST[WORK];
                    }
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                    return;
                } else if ( transport === 0) {
                    let role = 'transport';
                    let target = spawn.room.storage
                        || spawn.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
                    if (target === undefined) {
                        target = spawn;
                    }
                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                    while (cost + BODYPART_COST[MOVE]+ 2 * BODYPART_COST[CARRY] <= spawn.room.energyAvailable){
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
            let builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder').length;
            let structure = spawn.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                    (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)&& s.hits < 5000
            });
            if ((!!structure || constructionSites > builders) && builders < 2) {
                let role = 'builder';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable){
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
                if (builders_exp < 1) {
                    let role = 'builder_exp';
                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, WORK];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable) {
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
            if ( upgraders < 1) {
                let role = 'upgrader';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[WORK] <= spawn.room.energyAvailable){
                    abilities.push(WORK);
                    cost += BODYPART_COST[WORK];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (false && sources.length > 1) {
                let destroyers = _.filter(Game.creeps, creep => creep.memory.role === 'destroyer' && creep.room === spawn.room).length;
                if (destroyers < 1) {
                    let role = 'destroyer';
                    let newName = role + Game.time;
                    let abilities = [ATTACK, MOVE];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[ATTACK] + BODYPART_COST[MOVE] <= spawn.room.energyAvailable) {
                        abilities.push(ATTACK);
                        abilities.push(MOVE);
                        cost += BODYPART_COST[ATTACK] + BODYPART_COST[MOVE];
                    }
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }

                let medics = _.filter(Game.creeps, creep => creep.memory.role === 'medic' && creep.room === spawn.room).length;
                if (medics < 0) {
                    let role = 'medic';
                    let newName = role + Game.time;
                    let abilities = [HEAL, MOVE];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[HEAL] + BODYPART_COST[MOVE] <= spawn.room.energyAvailable) {
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
                let role = 'blocker';
                let newName = role + Game.time;
                let abilities = [MOVE];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
