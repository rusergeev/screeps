'use strict';

require('prototype.RoomPosition');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        try {
            let harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester').length;
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
                    while (cost + BODYPART_COST[WORK] <= spawn.room.energyAvailable){
                        abilities.push(WORK);
                        cost += BODYPART_COST[WORK];
                    }
                    spawn.spawnCreep(abilities, newName, {memory: {role: role, source: source}});
                    return;
                } else if ( transport === 0) {
                    let role = 'transport';
                    let target = spawn.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
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
            if (constructionSites > builders && builders < 2) {
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
            let upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader').length;
            if ( upgraders < 2 ) {
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

        } catch (e) {
            console.log(spawn + 'spawn exception: ', e);
        }
    }
};
