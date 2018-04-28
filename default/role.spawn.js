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
                if (cost + BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK] <= spawn.room.energyAvailable) {
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[WORK];
                }
                while (cost + BODYPART_COST[MOVE] + 2*BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 15){
                    abilities.push(MOVE);
                    abilities.push(CARRY);
                    abilities.push(CARRY);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[CARRY] + BODYPART_COST[CARRY];
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
                if (miner < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 5*BODYPART_COST[WORK]+3*BODYPART_COST[MOVE]])) {
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
                } else if ( transport < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 16*BODYPART_COST[CARRY]+8*BODYPART_COST[MOVE]]) ) {
                    let role = 'transport';
                    let target = spawn.room.storage
                        || spawn.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
                    if (target === undefined) {
                        target = spawn;
                    }
                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                    while (cost + BODYPART_COST[MOVE]+ 2 * BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 18){
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
            let constructionSites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length;
            let builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder' && creep.room === spawn.room).length;
            let structure = spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                    (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)&& s.hits < 1750000
            });

            if ((!!structure || constructionSites > builders) && builders < sources.length
                && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 8*BODYPART_COST[WORK] + 8*BODYPART_COST[CARRY] + 8*BODYPART_COST[MOVE]])) {
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
            let upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader' && creep.room === spawn.room).length;
            if ( upgraders < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 23*BODYPART_COST[WORK] + 3*BODYPART_COST[CARRY] + 12*BODYPART_COST[MOVE]])) {
                let role = 'upgrader';
                let newName = role + Game.time;
                let abilities = [MOVE, CARRY, WORK];
                let cost = abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);
                while (cost + BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK] <= spawn.room.energyAvailable && abilities.length < 15*sources.length){
                    abilities.push(MOVE);
                    abilities.push(WORK);
                    abilities.push(WORK);
                    cost += BODYPART_COST[MOVE] + BODYPART_COST[WORK] + BODYPART_COST[WORK];
                }
                while (cost + BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 16*sources.length){
                    abilities.push(CARRY);
                    cost += BODYPART_COST[CARRY];
                }
                console.log(spawn + ': spawning ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                return;
            }
            if (false && (spawn.room.name === 'E36N49' || spawn.room.name === 'E35N47' )&& sources.length > 1) {


                let medics = _.filter(Game.creeps, creep => creep.memory.role === 'medic' );
                //let destroyer_needs_medic = destroyers.filter( destroyer => medics.map(m => m.memory.patient).indexOf(destroyer.id) == -1)[0];
                const med_abilities = [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
                const med_abilities_cost = med_abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                if ( medics.length < 5 && spawn.room.energyAvailable >= med_abilities_cost) {


                    let role = 'medic';
                    let newName = role + Game.time;

                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(med_abilities, newName, {memory: {role: role}});
                    return;
                }
                let blocker_abilities = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                let blocker_abilities_cost = blocker_abilities.reduce(function (cost, part) {return cost + BODYPART_COST[part];}, 0);

                let blockers = _.filter(Game.creeps, creep => creep.memory.role === 'blocker' ).length;
                if (blockers < 3 && spawn.room.energyAvailable >= blocker_abilities_cost) {
                    let role = 'blocker';
                    let newName = role + Game.time;

                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(blocker_abilities, newName, {memory: {role: role}});
                    return;
                }
                let destroyers = _.filter(Game.creeps, creep => creep.memory.role === 'destroyer' );
                const des_abilities = [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
                const des_abilities_cost = des_abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                if (destroyers.length < 3 && spawn.room.energyAvailable >= des_abilities_cost) {
                    let role = 'destroyer';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(des_abilities, newName, {memory: {role: role}});
                    return;
                }


                let claimers = _.filter(Game.creeps, creep => creep.memory.role === 'claimer' );
                if (claimers.length < 0 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 1*BODYPART_COST[CLAIM] + 5*BODYPART_COST[MOVE]])) {
                    let role = 'claimer';
                    let newName = role + Game.time;
                    let abilities = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE];
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: role}});
                    return;
                }
                let watchdogs = _.filter(Game.creeps, creep => creep.memory.role === 'watchdog' );
                const wd_abilities = [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];
                const wd_abilities_cost = wd_abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                if (Game.flags.Flag3 && watchdogs.length < 0 && spawn.room.energyAvailable >= wd_abilities_cost) {
                    let role = 'watchdog';
                    let newName = role + Game.time;
                    console.log(spawn + ': spawning ' + newName);
                    spawn.spawnCreep(wd_abilities, newName, {memory: {role: role}});
                    return;
                }

            }

            if (false) {
                let role = 'atob';
                let creeps = _.filter(Game.creeps, creep => creep.memory.role === role ).length;
                if (creeps < 1 && spawn.room.energyAvailable >= _.min([spawn.room.energyCapacityAvailable, 16*BODYPART_COST[CARRY] + 8*BODYPART_COST[MOVE]])) {
                    let source = Game.rooms.E39N46.storage;
                    let target = Game.rooms.E39N47.storage;

                    let newName = role + Game.time;
                    let abilities = [MOVE, CARRY, CARRY];
                    let cost = abilities.reduce(function (cost, part) {
                        return cost + BODYPART_COST[part];
                    }, 0);
                    while (cost + BODYPART_COST[MOVE] + 2 * BODYPART_COST[CARRY] <= spawn.room.energyAvailable && abilities.length < 15) {
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
            if (true) {
                const related_flags = _.filter(Game.flags, flag => flag.name.startsWith(spawn.room.name));
                for(let i in related_flags){
                    const flag = related_flags[i];
                    if(flag.color === COLOR_RED) {
                        let watchdogs = _.filter(Game.creeps, creep => creep.memory.role === 'watchdog' && creep.memory.flag === flag.name);
                        const abilities = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL];
                        //const abilities = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL,HEAL];
                        const cost = abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                        if (watchdogs.length < 1 && spawn.room.energyAvailable >= cost) {
                            let role = 'watchdog';
                            let newName = role + Game.time;
                            console.log(spawn + ': spawning ' + newName);
                            spawn.spawnCreep(abilities, newName, {memory: {role: role, flag: flag.name}});
                            return;
                        }
                    }
                    if(flag.color === COLOR_GREEN) {
                        let r_builders = _.filter(Game.creeps, creep => creep.memory.role === 'remote_builder' && creep.memory.flag === flag.name);
                        const abilities = [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                        const cost = abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                        if (r_builders.length < 1 && spawn.room.energyAvailable >= cost) {
                            let role = 'remote_builder';
                            let newName = role + Game.time;
                            console.log(spawn + ': spawning ' + newName);
                            const target = (spawn.room.storage||spawn).id;
                            spawn.spawnCreep(abilities, newName, {memory: {role: role, flag: flag.name, target: target}});
                            return;
                        }
                    }
                    if(flag.color === COLOR_YELLOW) {
                        let r_builders = _.filter(Game.creeps, creep => creep.memory.role === 'remote_harvester' && creep.memory.flag === flag.name);
                        const abilities = [WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                        const cost = abilities.reduce(function (cost, part) { return cost + BODYPART_COST[part];}, 0);
                        if (r_builders.length < 1 && spawn.room.energyAvailable >= cost) {
                            let role = 'remote_harvester';
                            let newName = role + Game.time;
                            console.log(spawn + ': spawning ' + newName);
                            const target = (spawn.room.storage||spawn).id;
                            spawn.spawnCreep(abilities, newName, {memory: {role: role, flag: flag.name, target: target}});
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
