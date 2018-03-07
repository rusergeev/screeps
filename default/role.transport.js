'use strict';

require('prototype.Source');
require('prototype.Structure');
require('prototype.Creep');
require('prototype.RoomPosition');

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        try {

            if (!creep.memory.loading && creep.isEmpty) {
                creep.say('loading');
                creep.memory.loading = true;
            }

            if (creep.memory.loading && creep.isFull) {
                creep.say('delivering');
                creep.memory.loading = false;
            }

            if (creep.memory.loading) {
                let source = Game.getObjectById(creep.memory.source);
                let port = source.port;
                let energy = source.room.lookForAt(LOOK_ENERGY, port)[0];

                if (energy) {
                    let result = creep.pickup(energy);
                    switch (result) {
                        case OK:
                            break;
                        case ERR_NOT_IN_RANGE:
                            let port = Game.getObjectById(creep.memory.source).port;
                            creep.memory.destination = port;
                            creep.moveToRange(port, 1);
                            break;
                        case ERR_FULL:
                            creep.memory.loading = false;
                            creep.say('full: WTF?');
                            break;
                        default:
                            console.log(creep + ' cant pickup ' + energy + ' : ' + result);
                            break;
                    }
                } else {
                    let container = _.filter(
                        source.room.lookForAt(LOOK_STRUCTURES, port),
                            s => s.structureType === STRUCTURE_CONTAINER)[0];
                    if (container) {
                        let result = creep.withdraw(container, RESOURCE_ENERGY);
                        switch (result) {
                            case OK:
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                creep.say('empty: WTF?');
                                break;
                            case ERR_NOT_IN_RANGE:
                                let port = Game.getObjectById(creep.memory.source).port;
                                creep.memory.destination = port;
                                creep.moveToRange(port, 1);
                                break;
                            case ERR_FULL:
                                creep.memory.loading = false;
                                creep.say('full: WTF?');
                                break;
                            default:
                                console.log(creep + ' cant withdraw ' + container + ' : ' + result);
                                break;
                        }
                    }
                }
            } else {
                let   target = creep.room.controller.pos.findInRange( FIND_STRUCTURES, 3, { filter:
                            s => s.structureType === STRUCTURE_CONTAINER
                                && _.sum(s.store) < s.storeCapacity/2}).sort(
                                    (a,b) => _.sum(a.store)-_.sum(b.store)-a.storeCapacity+b.storeCapacity)[0];

                if (!target) {
                    target = Game.getObjectById(creep.memory.target);
                }
                let result = creep.transfer(target, RESOURCE_ENERGY);
                switch (result) {
                    case OK:
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.memory.destination = target.pos;
                        creep.moveToRange(target, 1);
                        break;
                    case ERR_FULL:
                        creep.drop(RESOURCE_ENERGY);
                        break;
                    default:
                        console.log(creep + ' cant transfer to ' + target + ' : ' + result);
                        break;
                }
            }

        } catch (e) {
            console.log(creep + 'transport exception: ', e);
        }
    }
};
