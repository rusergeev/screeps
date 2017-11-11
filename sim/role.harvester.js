'use strict';

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = true;
            creep.say('Harvest');
        }
        if(creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Full');
        }
	    if(creep.memory.harvesting) {

            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (  s.structureType === STRUCTURE_CONTAINER ) &&
                                s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)/2
            });
            if (!container) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (  s.structureType === STRUCTURE_STORAGE ) &&
                        s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)*2
                });
            }
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToX(container);
                }
            }else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveToX(source);
                }
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_SPAWN ||
                                structure.structureType === STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                    }
            });
            if (!target) {
                creep.say('Storage!');
                target = creep.room.storage;
            }
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToX(target);
                }
            }else{
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(target) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToX(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
	}
};
