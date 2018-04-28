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

            const flag = Game.flags[creep.memory.flag];
            if(flag && flag.room !== creep.room) {
                creep.moveToRange(flag, 1);

            } else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                } else {
                    let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => (s.structureType === STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0
                    });
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(container, 1);
                        }
                    } else {
                        let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {filter: s => s.energy > 0});
                        if (source) {
                            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                                creep.moveToRange(source, 1);
                            }
                        } else {
                            creep.memory.harvesting = false;
                            let target = Game.getObjectById(creep.memory.target);
                            creep.moveToRange(target, 1);
                        }
                    }
                }
            }
   
        } else {
            let target = Game.getObjectById(creep.memory.target);
            let result = creep.transfer(target, RESOURCE_ENERGY);
            switch (result) {
                case OK:
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToRange(target, 1);
                    break;
                case ERR_FULL:
                    creep.drop(RESOURCE_ENERGY);
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.say('WTF: not enough resources?');
                    break;
                default:
                    console.log(creep + ' cant transfer to ' + target + ' : ' + result);
                    break;
            }
        }
	}
};
