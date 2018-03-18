
require('prototype.Creep');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (!creep.memory.loading && creep.isEmpty) {
            creep.say('loading');
            creep.memory.loading = true;
        }

        if (creep.memory.loading && creep.isFull) {
            creep.say('upgrading');
            creep.memory.loading = false;
        }

        if (creep.memory.loading) {
            /*
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target, 1);
                    return;
                }
            }
            */

            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (  (
                        s.structureType === STRUCTURE_CONTAINER ||
                        s.structureType === STRUCTURE_STORAGE
                    ) && s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 2
                )
            });
            if (container) {
                creep.memory.container = container.id;

                let result = creep.withdraw(container, RESOURCE_ENERGY);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.say('Moving');
                        creep.moveToRange(container, 1);
                        break;
                    case ERR_FULL:
                        creep.memory.harvesting = false;
                        creep.say('Full');
                        break;
                }

            } else {
                let source = Game.getObjectById(creep.memory.source) || creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if (source) {
                    let result = creep.harvest(source);
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.say('Moving');
                            creep.moveToRange(source, 1);
                            break;
                        case ERR_FULL:
                            creep.memory.harvesting = false;
                            creep.say('Full');
                            break;
                        case OK:
                            creep.memory.source = source.id;
                            break;
                    }
                } else {
                    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    if (target) {
                        if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                            creep.moveToRange(target, 1);
                            return;
                        }
                    }
                }
            }
        } else {
            let result = creep.upgradeController(creep.room.controller);
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.say('Moving');
                    creep.moveToRange(creep.room.controller, 3);
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.loading = true;
                    creep.say('Harvest');
                    break;
            }
        }
    }
};
