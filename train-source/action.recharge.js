var actionRecharge = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var doing = creep.carry.energy < creep.carryCapacity;
        if(doing) {

            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (  s.structureType == STRUCTURE_CONTAINER ||
                                s.structureType == STRUCTURE_STORAGE ) &&
                                s.store[RESOURCE_ENERGY] > 0
            });
            if (container) {
                
                creep.say('Container...');
                if (creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.say('Source...');
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