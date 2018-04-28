module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const flag = Game.flags[creep.memory.flag];
        if(flag && flag.room !== creep.room) {
            creep.moveToRange(flag, 1);
        } else {

            if (creep.memory.building && creep.carry.energy === 0) {
                creep.memory.building = false;
                creep.say('Harvest');
            }
            if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('Build');
            }

            if (creep.memory.building) {
                let structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s => s.hits < s.hitsMax / 20 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
                });
                let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if(target && !structure) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 3);
                    }
                }else {
                    structure = structure || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART});
                    if (structure) {
                        // try to repair it, if it is out of range
                        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveToRange(structure, 3);
                        }
                    } else {
                        let container = creep.room.storage || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: c => c.structureType === STRUCTURE_CONTAINER && _.sum(c.store) < c.storeCapacity});

                        if (container) {
                            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveToRange(container, 1);
                            }
                        } else {
                            if (creep.room.controller && creep.room.controller.my){
                                let result = creep.upgradeController(creep.room.controller);
                                switch (result) {
                                    case ERR_NOT_IN_RANGE:
                                        creep.say('Moving');
                                        creep.moveToRange(creep.room.controller, 3);
                                        break;
                                    case ERR_NOT_ENOUGH_RESOURCES:
                                        creep.memory.building = false;
                                        creep.say('Harvest');
                                        break;
                                }
                            }else {
                                creep.memory.role = 'remote_harvester';
                            }
                        }

                    }
                }
            }
            else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 1);
                    }
                } else {
                    let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {filter: s => s.energy > 0});
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(source, 1);
                    }
                }
            }

        }
    }
};
