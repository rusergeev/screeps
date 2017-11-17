module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.moving) {
            let target = Game.getObjectById(creep.memory.move_target);
            let x = creep.pos.getRangeTo(target);
            if (x <= creep.memory.move_range) {
                creep.say('Arrived!');
                creep.memory.moving = false;
            } else {
                let result = creep.moveTo(target, {
                    noPathFinding: true,
                    reusePath: 50,
                    visualizePathStyle: {stroke: '#ffffff'}
                });
                return;
            }
        }

        if (creep.memory.harvesting) {
            let container =
                //Game.getObjectById(creep.memory.container) ||
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
                        creep.memory.moving = true;
                        creep.memory.move_range = 1;
                        creep.memory.move_target = container.id;
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
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
                        creep.memory.moving = true;
                        creep.memory.move_range = 1;
                        creep.memory.move_target = source.id;
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
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
                    creep.memory.moving = true;
                    creep.memory.move_range = 2;
                    creep.memory.move_target = creep.room.controller.id;
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.harvesting = true;
                    creep.say('Harvest');
                    break;
            }
        }
    }
};
