var actionHarvest = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var doing = creep.carry.energy < creep.carryCapacity;
        if(doing) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }else {
            creep.say('Full');
        }
        return doing;
    }
};

module.exports = actionHarvest;