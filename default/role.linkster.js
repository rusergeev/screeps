module.exports =  {

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
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (  s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType === STRUCTURE_STORAGE   ) &&
                    s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)/2
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let target = Game.getObjectById(creep.memory.link);
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};
