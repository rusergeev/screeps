module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('Harvest');
        }
        if(!creep.memory.building && _.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('Build');
        }

        if(creep.memory.building) {
            let structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 20 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
            });
            let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: c=>c.structureType === STRUCTURE_EXTENSION})
                || creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: c=>c.structureType === STRUCTURE_CONTAINER})
                || creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if(target && !structure) {
                if(creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 3);
                }
            }else {
                structure = structure || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                        (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)&& s.hits < 1750000
                });
                if (structure) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveToRange(structure, 3);
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(creep.room.controller, 3);
                    }
                }

            }

        }
        else {
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: t => t.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length === 0
            });
            if(target) {
                if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target,1);
                }
                return;
            }

            let container = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: t => _.sum(t.store) > 0})
            || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => ((s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType === STRUCTURE_STORAGE) &&
                    _.sum(s.store) > (creep.carryCapacity - creep.carry.energy) / 4) ||
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
