module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('Harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('Build');
	    }

	    if(creep.memory.building) {
            const route = Game.map.findRoute(creep.room, 'W53N46');
            if(route.length > 0) {
                creep.say('Now heading to room '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }else {
                    let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if (target !== undefined) {
                        if (creep.build(target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }

            }
	    }
	    else {
            const route = Game.map.findRoute(creep.room, 'W53N44');
            if(route.length > 0) {
                creep.say('Now heading to room '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: s => ( (  s.structureType === STRUCTURE_CONTAINER ||
                            s.structureType === STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 2) ||
                            s.structureType === STRUCTURE_LINK && s.energy > (creep.carryCapacity - creep.carry.energy) / 2
                    });
                    if (container !== undefined) {
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
	}
};
