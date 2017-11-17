module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.moving) {
            let target = Game.getObjectById(creep.memory.move_target);
            let x = creep.pos.getRangeTo(target);
            if (x <= creep.memory.move_range) {
                creep.say('Arrived!');
                creep.memory.moving = false;
            }else {
                let result = creep.moveTo(target, {
                    noPathFinding: true,
                    reusePath: 50,
                    visualizePathStyle: {stroke: '#ffffff'}
                });
                return;
            }
        }
        if (creep.memory.harvesting) {
            let resource =
                Game.getObjectById(creep.memory.resource) ||
                Game.getObjectById(creep.memory.source).pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
                    filter: res => res.amount > (creep.carryCapacity - creep.carry.energy) / 2
                })[0];
            if (resource) {
                creep.memory.resource = resource.id;
                let result = creep.pickup(resource);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.say('Moving');
                        creep.memory.moving = true;
                        creep.memory.move_range = 1;
                        creep.memory.move_target = resource.id;
                        creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
                        break;
                    case ERR_FULL:
                        creep.memory.harvesting = false;
                        creep.say('Full');
                        break;
                }
            } else {
                delete creep.memory.resource;
                let container =
                    Game.getObjectById(creep.memory.container) ||
                    Game.getObjectById(creep.memory.source).pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
                if (container) {
                    creep.memory.container = container.id;
                    for (let resource in container.store) {
                        let result = creep.withdraw(container, resource);
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
                    }
                }
            }
        }
        else {
            let target =
                creep.room.storage ||
                creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure =>
                        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER].indexOf(structure.structureType) > -1 &&
                        structure.energy < structure.energyCapacity
                });
            if (target) {
                for (let resource in creep.carry) {
                    let result = creep.transfer(target, resource);
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.say('Moving');
                            creep.memory.moving = true;
                            creep.memory.move_range = 1;
                            creep.memory.move_target = target.id;
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        case ERR_NOT_ENOUGH_RESOURCES:
                            creep.memory.harvesting = true;
                            creep.say('Harvest');
                            break;
                    }
                }
            }
        }
    }
};
