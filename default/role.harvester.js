module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.harvesting && creep.isEmpty) {
            creep.memory.harvesting = true;
            creep.say('Harvest');
        }
        if(creep.memory.harvesting && creep.isFull) {
            creep.memory.harvesting = false;
            creep.say('Full');
        }
        if(creep.isFull && creep.hasMinerals && creep.room.storage) {
            creep.say('Deposite minerals');
            target = creep.room.storage;
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 1);
                }
            }
        }

	    if(creep.memory.harvesting) {

            let container =
                creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy
                })
                || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_CONTAINER) &&
                        s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy &&
                        (!s.room.controller || !s.pos.inRangeTo(s.room.controller, 3))
                })
                || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_CONTAINER) &&
                        s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy
                });

            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(container, 1);
                }
            } else if(target) {
                if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target,1);
                }
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {filter: s => s.energy > 0});
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(source, 1);
                }
            }


        }
        else {
            let target =  creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s =>
                        (s.structureType === STRUCTURE_EXTENSION ||
                            s.structureType === STRUCTURE_SPAWN )&& s.energy < s.energyCapacity ||
                        s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity/2})
                || creep.room.controller.pos.findInRange(4, FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER && s.energy < s.energyCapacity})[0]
                || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity});
            if(target !== null) {
                let result = creep.transfer(target, RESOURCE_ENERGY);
                switch(result) {
                    case OK:
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveToRange(target, 1);
                        break;
                    default:
                        console.log(creep, 'transfer to', target, 'result:', result)
                        break;
                }
            }
            else{
                target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if(target) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                }
            }

            if (!target) {
                target = Game.getObjectById(creep.memory.spawn);
                if (target) {
                    creep.moveToRange(target, 1);
                }
            }
   
        }
	}
};
