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
            let storage = Game.getObjectById(creep.memory.target || '59edd32f75ec8b050d6a20bc');
            if (storage) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
        else {
            var target = Game.getObjectById(creep.memory.storage || '5a0492b7e4d99c4dfa41ee49');
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }

	}
};
