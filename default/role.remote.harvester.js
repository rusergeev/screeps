'use strict';

const whitelist = require('white.list');

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

        if(!creep.memory.harvesting && creep.isEmpty) {
            creep.memory.harvesting = true;
            creep.say('Harvest');
        }
        if(creep.memory.harvesting && creep.isFull) {
            creep.memory.harvesting = false;
            creep.say('Full');
        }
        if(creep.isFull && creep.hasMinerals && creep.room.storage) {
            creep.say('Deposite minerals');
            const target = creep.room.storage;
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 1);
                }
            }
        }

	    if(creep.memory.harvesting) {

            const flag = Game.flags[creep.memory.flag];
            if(flag && flag.room !== creep.room) {

                if (!creep.room.controller) {
                    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: s => s.pos.isSafe()});
                    if (target) {
                        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(target, 1);
                        }
                    } else {

                        const tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                            filter: s => s.store[RESOURCE_ENERGY] > 0 && s.pos.isSafe()
                        });
                        if (tombstone) {
                            if (creep.withdraw(tombstone) === ERR_NOT_IN_RANGE) {
                                creep.moveToRange(target, 1);
                            }
                        } else {
                            creep.moveToRange(flag, 1);
                        }

                    }
                } else {
                    creep.moveToRange(flag, 1);
                }
            } else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: t => t.pos.isSafe() && t.amount > 50
                });
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                } else {
                    const container = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: t => _.sum(t.store) > 0})
                        || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: s => (!s.isActive()) && (_.sum(s.store) > 0 || s.energy > 0)
                                && s.pos.isSafe()
                        })
                        || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: s => (
                                s.structureType === STRUCTURE_CONTAINER
                                || s.structureType === STRUCTURE_STORAGE
                                || s.structureType === STRUCTURE_TERMINAL
                                || s.structureType === STRUCTURE_NUKER
                                || s.structureType === STRUCTURE_TOWER
                                ) && (_.sum(s.store) > 0 || s.energy)
                                && s.pos.isSafe()
                        });
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(container, 1);
                        }
                    } else {
                        const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                            filter: s => s.energy > 0 && s.pos.isSafe()
                        });
                        if (source) {
                            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                                creep.moveToRange(source, 1);
                            }
                        } else {
                            creep.memory.harvesting = false;
                        }
                    }
                }
            }
   
        } else {
            const target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: s => s.pos.isSafe()});
            const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax / 4
                    && [STRUCTURE_ROAD, STRUCTURE_CONTAINER].indexOf( s.structureType) !== -1
                    && s.pos.isSafe()
            } );
            if(target && !creep.pos.isInDoors()) {
                if(creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 3);
                }
            } else if (structure && !creep.pos.isInDoors()){
                if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(structure, 3);
                }
            } else {
                const target = Game.getObjectById(creep.memory.target);
                const result = creep.transfer(target, RESOURCE_ENERGY);
                switch (result) {
                    case OK:
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveToRange(target, 1);
                        break;
                    case ERR_FULL:
                        creep.drop(RESOURCE_ENERGY);
                        break;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        creep.say('WTF: not enough resources?');
                        break;
                    default:
                        console.log(creep + ' cant transfer to ' + target + ' : ' + result);
                        break;
                }
            }
        }
	}
};
