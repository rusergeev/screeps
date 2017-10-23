var actionRecharge = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var doing = creep.carry.energy < creep.carryCapacity;
        if(doing) {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: s => (  s.structureType == STRUCTURE_CONTAINER ||
                                s.structureType == STRUCTURE_STORAGE ) &&
                                s.store[RESOURCE_ENERGY] > 0
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }else {
            creep.say('Full');
        }
        return doing;
    }
};

module.exports = actionRecharge;