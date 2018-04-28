module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const route = Game.map.findRoute(creep.room, creep.memory.room || 'E36N48');
        if (route.length > 0) {
            creep.say('To ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
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
                    filter: (s) => s.hits < s.hitsMax / 20 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
                });
                let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if(target && !structure) {
                    if(creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(target, 3);
                    }
                }else {
                    structure = structure || creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.hits < s.hitsMax / 2 });
                    if (structure) {
                        // try to repair it, if it is out of range
                        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveToRange(structure, 3);
                        }
                    } else {
                        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: c => c.structureType === STRUCTURE_CONTAINER && c.energy});

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
