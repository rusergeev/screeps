module.exports =  {

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
                filter: s => (  s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType == STRUCTURE_STORAGE   ) &&
                    s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)/2
            });
            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_LINK &&
                        s.pos.findInRange(FIND_STRUCTURES, 2, {
                            filter: ss => ss.structureType === STRUCTURE_CONTAINER ||
                                ss.structureType === STRUCTURE_STORAGE   }).length !== 0});

            if (target === undefined) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
            }
            if (target === undefined) {
                creep.say('Storage!');
                target = creep.room.storage;
            }
            if(target !== undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(target !== undefined) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};
