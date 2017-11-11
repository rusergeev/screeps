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
            const route = Game.map.findRoute(creep.room, 'W53N46');
            if(route.length > 0) {
                creep.say('To '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            } else {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (  s.structureType === STRUCTURE_CONTAINER ) &&
                        s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 2
                });
                if (!container) {
                    container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: s => (  s.structureType === STRUCTURE_STORAGE ) &&
                            s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) * 2
                    });
                }
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
        else {
            const route = Game.map.findRoute(creep.room, 'W53N44');
            if(route.length > 0) {
                creep.say('To '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            } else {
                creep.say('Storage!');
                var target = creep.room.storage;
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }

	}
};
