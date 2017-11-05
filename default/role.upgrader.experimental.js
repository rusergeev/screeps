module.exports =  {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('Harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('Upgrade');
	    }

	    if(creep.memory.upgrading) {
            const route = Game.map.findRoute(creep.room, 'W53N45');
            if(route.length > 0) {
                creep.say('Now heading to room '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }else {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            const route = Game.map.findRoute(creep.room, 'W53N44');
            if(route.length > 0) {
                var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(target) {
                    if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {

                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: s => ( (  s.structureType === STRUCTURE_CONTAINER ||
                            s.structureType === STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) * 2) ||
                            s.structureType === STRUCTURE_LINK && s.energy > (creep.carryCapacity - creep.carry.energy) * 2
                    });
                }

                if (target) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }

                if (!target){
                    creep.say('To '+route[0].room);
                    const exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            } else {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (  (s.structureType === STRUCTURE_CONTAINER ||
                        s.structureType === STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 2) ||
                        s.structureType === STRUCTURE_LINK && s.energy > (creep.carryCapacity - creep.carry.energy) / 2
                });
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
                    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
	}
};
