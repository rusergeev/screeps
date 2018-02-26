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
                let source = Game.getObjectById(this.memory.source);
                let port = source.port;
                let energy = source.room.lookForAt(LOOK_ENERGY, port)[0];

                if (energy) {
                    let result = this.pickup(energy);
                    switch (result) {
                        case OK:
                            break;
                        case ERR_NOT_IN_RANGE:
                            let port = Game.getObjectById(this.memory.source).port;
                            this.memory.destination = port;
                            this.moveToRange(port, 1);
                            break;
                        case ERR_FULL:
                            this.memory.loading = false;
                            this.say('full: WTF?');
                            break;
                        default:
                            console.log(this + ' cant pickup ' + energy + ' : ' + result);
                            break;
                    }
                } else {
                    let container = _.filter(
                        source.room.lookForAt(LOOK_STRUCTURES, port),
                        s => s.structureType === STRUCTURE_CONTAINER)[0];
                    if (container) {
                        let result = this.withdraw(container, RESOURCE_ENERGY);
                        switch (result) {
                            case OK:
                                break;
                            case ERR_NOT_IN_RANGE:
                                let port = Game.getObjectById(this.memory.source).port;
                                this.memory.destination = port;
                                this.moveToRange(port, 1);
                                break;
                            case ERR_FULL:
                                this.memory.loading = false;
                                this.say('full: WTF?');
                                break;
                            default:
                                console.log(this + ' cant pickup ' + container + ' : ' + result);
                                break;
                        }
                    }
                }
            } else {
                let target = Game.getObjectById(creep.memory.target);
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
