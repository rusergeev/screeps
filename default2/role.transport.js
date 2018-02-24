'use strict';

require('prototype.Source');
require('prototype.Creep');
require('prototype.RoomPosition');

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        try {
            if (creep.isFull) {
                let target = Game.getObjectById(creep.memory.target);
                let result = creep.transfer(target, RESOURCE_ENERGY);
                switch (result) {
                    case OK: break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveToX(target);
                        break;
                    case ERR_FULL:
                        creep.drop(RESOURCE_ENERGY);
                        break;
                    default:
                        console.log(creep + ' cant transfer to ' + target + ' : ' + result);
                        break;
                }
                creep.moveToX(target);
            } else {
                let source = Game.getObjectById(creep.memory.source);
                let port = source.port;
                let energy = source.room.lookForAt(LOOK_ENERGY, port)[0];
                let container = _.filter(
                    source.room.lookForAt(LOOK_STRUCTURES, port),
                    s => s.structureType === STRUCTURE_CONTAINER )[0];
                if (energy) {
                    let result = creep.pickup(energy);
                    switch (result) {
                        case OK:
                            break;
                        case ERR_INVALID_TARGET:
                            if (!creep.pos.isNearTo(source.port)) {
                                creep.moveToX(source.port);
                            }
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveToX(source.port);
                            break;
                        default:
                            console.log(creep + ' cant pickup ' + energy + ' : ' + result);
                            break;
                    }
                } else if (container) {
                    let result = creep.withdraw(container, RESOURCE_ENERGY);
                    switch (result) {
                        case OK:
                            break;
                        case ERR_INVALID_TARGET:
                            if (!creep.pos.isNearTo(source.port)) {
                                creep.moveToX(source.port);
                            }
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveToX(source.port);
                            break;
                        default:
                            console.log(creep + ' cant withdraw from ' + container + ' : ' + result);
                            break;
                    }
                }
            }

        } catch (e) {
            console.log(creep + 'transport exception: ', e);
        }
    }
};
