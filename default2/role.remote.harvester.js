'use strict';

const whitelist = require('white.list');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const hostile = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => !whitelist.isFriend(c)});
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
                creep.moveToRange(flag, 1);

            } else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: t => t.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length === 0
                });
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                } else {
                    const container = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: t => _.sum(t.store) > 0})
                    || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => (s.structureType === STRUCTURE_CONTAINER) && _.sum(s.store) > 0
                            && s.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length === 0
                    });
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(container, 1);
                        }
                    } else {
                        const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                            filter: s => s.energy > 0 && s.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length === 0
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
};
