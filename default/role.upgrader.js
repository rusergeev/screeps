
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
            let container =
                creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => (  (s.structureType === STRUCTURE_CONTAINER ||
                        s.structureType === STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy) / 2) ||
                        s.structureType === STRUCTURE_LINK
                });
            if (container) {
                creep.memory.container = container.id;

                let result = creep.withdraw(container, RESOURCE_ENERGY);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.say('Moving');
                        creep.moveToX(container);
                        break;
                    case ERR_FULL:
                        creep.memory.harvesting = false;
                        creep.say('Full');
                        break;
                }

            } else {
                let source = Game.getObjectById(creep.memory.source) || creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                let result = creep.harvest(source);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.say('Moving');
                        creep.moveToX(source);
                        break;
                    case ERR_FULL:
                        creep.memory.harvesting = false;
                        creep.say('Full');
                        break;
                    case OK:
                        creep.memory.source = source.id;
                        break;
                }
            }
        } else {
            let result = creep.upgradeController(creep.room.controller);
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.say('Moving');
                    creep.moveToX(creep.room.controller);
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.loading = true;
                    creep.say('Harvest');
                    break;
            }
        }
    }
};
