'use strict';

require('prototype.Source');

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        return _.sum(this.carry) === this.carryCapacity;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'isEmpty', {
    get: function() {
        return _.sum(this.carry) === 0;
    },
    enumerable: false,
    configurable: true
});

Creep.prototype.moveToX = function (pos) {
    if (this.spawning || this.fatigue) {
        return OK;
    }
    let pos_json = JSON.stringify(pos);
    if(!this.memory.path || pos_json !== this.memory.path_destination) {
        this.say('pathing 🐽');
        this.memory.path = this.pos.findPathTo(pos, {ignoreCreeps: true});
        this.memory.path_destination = pos_json;
    }

    let result = this.moveByPath(this.memory.path);
    switch (result) {
        case OK:

        case ERR_TIRED:
            break;
        case ERR_NOT_FOUND:
            delete this.memory.path;
            this.moveToX(pos);
            break;
        default:
            console.log(this + ' cant move to' + pos + ' : ' + result);
            break;
    }
    return result;
};

Creep.prototype.pickupX = function (energy) {

    if (this.memory.destination) {
        let destination  = new RoomPosition(this.memory.destination.x, this.memory.destination.y, this.memory.destination.roomName);
        if (this.pos.isNearTo(destination)) {
            delete this.memory.destination;
        } else {
            return this.moveToX(destination);
        }
    }

    let result = this.pickup(energy);
    switch (result) {
        case OK:
            break;
        case ERR_NOT_IN_RANGE:
            let port = Game.getObjectById(this.memory.source).port;
            this.memory.destination = port;
            this.moveToX(port);
            break;
        case ERR_FULL:
            this.memory.loading = false;
            this.say('full: WTF?');
            break;
        default:
            console.log(this + ' cant pickup ' + energy + ' : ' + result);
            break;
    }
    return result;
};

Creep.prototype.withdrawX = function (from) {

    if (this.memory.destination) {
        let destination  = new RoomPosition(this.memory.destination.x, this.memory.destination.y, this.memory.destination.roomName);
        if (this.pos.isNearTo(destination)) {
            delete this.memory.destination;
        } else {
            return this.moveToX(destination);
        }
    }

    let result = this.withdraw(from, RESOURCE_ENERGY);
    switch (result) {
        case OK:
            break;
        case ERR_NOT_IN_RANGE:
            let port = Game.getObjectById(this.memory.source).port;
            this.memory.destination = port;
            this.moveToX(port);
            break;
        case ERR_FULL:
            this.memory.loading = false;
            this.say('full: WTF?');
            break;
        default:
            console.log(this + ' cant pickup ' + from + ' : ' + result);
            break;
    }
    return result;
};

Creep.prototype.load = function () {
    let source = Game.getObjectById(this.memory.source);
    let port = source.port;
    let energy = source.room.lookForAt(LOOK_ENERGY, port)[0];

    if (energy) {
        this.pickupX(energy);
    } else {
        let container = _.filter(
            source.room.lookForAt(LOOK_STRUCTURES, port),
            s => s.structureType === STRUCTURE_CONTAINER)[0];
        if (container) {
            this.withdrawX(container);
        }
    }
};

Creep.prototype.deliver = function () {

    if (this.memory.destination) {
        let destination  = new RoomPosition(this.memory.destination.x, this.memory.destination.y, this.memory.destination.roomName);
        if (this.pos.isNearTo(destination)) {
            delete this.memory.destination;
        } else {
            return this.moveToX(destination);
        }
    }

    let target = Game.getObjectById(this.memory.target);
    let result = this.transfer(target, RESOURCE_ENERGY);
    switch (result) {
        case OK: break;
        case ERR_NOT_IN_RANGE:
            let port = Game.getObjectById(this.memory.target).port;
            this.memory.destination = port;
            this.moveToX(port);
            break;
        case ERR_FULL:
            this.drop(RESOURCE_ENERGY);
            break;
        default:
            console.log(this + ' cant transfer to ' + target + ' : ' + result);
            break;
    }
    return result;
};