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
            const route = Game.map.findRoute(creep.room, 'E36N49');
            if(route.length > 0) {
                creep.say('To '+route[0].room);
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveToRange(exit,0);
            }else {
                //creep.memory.role = 'upgrader';
                //return;
                let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 3);
                    }
                } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(creep.room.controller, 3);
                }

            }
	    }
        else {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target,1);
                    return;
                }
            }
            if (0){ }
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => ((s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType === STRUCTURE_STORAGE) &&
                    s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 4) ||
                    s.structureType === STRUCTURE_LINK && s.energy > (creep.carryCapacity - creep.carry.energy) / 2
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(container, 1);
                }
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {filter: s => s.energy > 0});
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(source, 1);
                }
            }


        }
    }
};
