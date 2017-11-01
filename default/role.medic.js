var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.healing && creep.carry.energy == 0) {
            creep.memory.healing = false;
            creep.say('Harvest');
        }
        if(!creep.memory.healing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.healing = true;
            creep.say('Heal');
        }

        if(creep.memory.healing) {
            var target = creep.pos.findClosestByPath(FIND_CREEPS, {
                filter: (s) => s.hits < s.hitsMax/2 //&& s.structureType != STRUCTURE_WALL
            });
            if(target != undefined) {
                if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax/2 && s.structureType != STRUCTURE_WALL
                });
                if (structure != undefined) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => ((  s.structureType == STRUCTURE_CONTAINER ||
                                s.structureType == STRUCTURE_STORAGE ) &&
                                s.store[RESOURCE_ENERGY] > creep.carryCapacity - creep.carry.energy)||
                    s.structureType == STRUCTURE_LINK && s.energy > creep.carryCapacity - creep.carry.energy
            });
            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleBuilder;