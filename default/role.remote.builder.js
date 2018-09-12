'use strict';

const whitelist = require('white.list');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const hostile = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK) })
            || creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK) });
        if (hostile.length > 0) {
            console.log(creep, 'flee from', hostile[0], 'in', creep.room);
            creep.moveToRange(hostile[0], 4, {flee: true});
            return;
        }

        const spawning_lairs = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: s => s.structureType === STRUCTURE_KEEPER_LAIR && s.ticksToSpawn < 10});
        if (spawning_lairs.length > 0) {
            console.log(creep, 'flee from', spawning_lairs[0], 'in', creep.room);
            creep.moveToRange(spawning_lairs[0], 4, {flee: true});
            return;
        }

        const flag = Game.flags[creep.memory.flag];
        if(flag && flag.room !== creep.room) {
            creep.moveToRange(flag, 1);
        } else {

            if (creep.memory.building && creep.carry.energy === 0) {
                creep.memory.building = false;
                creep.say('Harvest');
            }
            if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('Build');
            }

            if (creep.memory.building) {

                    const brown_flags = _.filter(Game.flags, f => f.color === COLOR_BROWN
                        && f.room === creep.room
                        && creep.room.lookForAt(LOOK_STRUCTURES, f).length > 0
                        && f.pos.isSafe()
                    );
                    if (brown_flags.length > 0) {
                        const structure = creep.room.lookForAt(LOOK_STRUCTURES, brown_flags[0])[0];
                        if (creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(structure, 1);
                        }
                        return;
                    }

                    let structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s => s.hits < s.hitsMax / 20
                        && s.structureType !== STRUCTURE_WALL
                        && s.structureType !== STRUCTURE_RAMPART
                        && s.pos.isSafe()
                });
                let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: s => s.pos.isSafe()});
                if(target && !structure) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 3);
                    }
                }else {
                    structure = structure || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => s.hits < s.hitsMax / 2
                            && s.structureType !== STRUCTURE_WALL
                            && s.structureType !== STRUCTURE_RAMPART
                            && s.pos.isSafe()
                    } );
                    if (structure) {
                        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(structure, 3);
                        }
                    } else {
                        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: c => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf( c.structureType) !== -1
                                && c.isActive()
                                && _.sum(c.store) < c.storeCapacity
                                && _.filter(c.room.lookForAt(LOOK_CREEPS, c), c => c.memory && c.memory.role && c.memory.role === 'miner').length === 0
                                && c.pos.isSafe()})
                            || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: c => c.structureType === STRUCTURE_TOWER
                                    && c.isActive()
                                    && _.sum(c.energy) < c.energyCapacity
                                    && c.pos.isSafe()});

                        if (container) {
                            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveToRange(container, 1);
                            }
                        } else {
                            if (creep.room.controller && creep.room.controller.owner && creep.room.controller.owner.username === 'Sergeev'){
                                let result = creep.upgradeController(creep.room.controller);
                                switch (result) {
                                    case ERR_NOT_IN_RANGE:
                                        creep.say('Moving');
                                        creep.moveToRange(creep.room.controller, 3);
                                        break;
                                    case ERR_NOT_ENOUGH_RESOURCES:
                                        creep.memory.building = false;
                                        creep.say('Harvest');
                                        break;
                                }
                            }else {
                                let structure =  creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                    filter: s => s.hits < s.hitsMax / 1.1
                                        && s.structureType !== STRUCTURE_WALL
                                        && s.structureType !== STRUCTURE_RAMPART
                                        && s.pos.isSafe()
                                });
                                if (structure) {
                                    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                                        creep.moveToRange(structure, 3);
                                    }
                                } else {
                                    const sources = creep.room.find(FIND_SOURCES_ACTIVE, {filter: s => s.pos.free_adj_pos()});
                                    if (sources) {
                                        sources.forEach( s => creep.room.createConstructionSite(s.pos.free_adj_pos()[getRandomInt(s.pos.free_adj_pos_count())], STRUCTURE_CONTAINER));
                                    } else {
                                        creep.memory.building = false;
                                        console.log(creep.room.name, 'needs more transport');
                                    }
                                }
                            }
                        }

                    }
                }
            }
            else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: s => s.pos.isSafe()});
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                } else {

                    const tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                        filter: s => _.sum(s.store) > 0
                            && s.pos.isSafe()
                    });
                    if (tombstone){
                        if (creep.withdraw(tombstone) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(target, 1);
                        }
                    } else {
                        let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                            filter: s => s.energy > 0
                                && s.pos.isSafe()
                        });
                        if (source) {
                            let result = creep.harvest(source);
                            switch (result) {
                                case OK:
                                case ERR_BUSY:
                                    break;
                                case ERR_INVALID_TARGET:
                                case ERR_NOT_ENOUGH_RESOURCES:
                                    creep.memory.building = true;
                                    break;
                                case ERR_NOT_IN_RANGE:
                                    creep.moveToRange(source, 1);
                                    break;
                                default:
                                    console.log(creep + ' cant harvest ' + source + ' : ' + result);
                                    break;
                            }
                        } else {
                                creep.memory.building = true;

                        }
                    }
                }
            }

        }
    }
};
