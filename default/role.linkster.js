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
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (  s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType === STRUCTURE_STORAGE   ) &&
                    s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)/2
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            let target = Game.getObjectById(creep.memory.link);

            console.log('link '+ creep.link+target);
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};
