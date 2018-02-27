module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = true;
            creep.say('Harvest');
        }
        if(creep.memory.harvesting && _.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('Full');
        }
	    if(creep.memory.harvesting) {

            let  container =
                creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (  s.structureType === STRUCTURE_STORAGE ) &&
                    s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy
                })||
                creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (  s.structureType === STRUCTURE_CONTAINER ) &&
                    s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy
            });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(container, 1);
                }
            } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(source,1);
                }
            }

        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity) ||
                                structure.structureType === STRUCTURE_TOWER &&
                                structure.energy < structure.energyCapacity/2;
                    }
            }) || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_TOWER &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 1);
                }
            }
            else{
                target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(target) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                }
            }

        }
	}
};
