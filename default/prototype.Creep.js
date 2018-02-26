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

Object.defineProperty(Creep.prototype, 'isMoving', {
    get: function() {
        return this.memory.path !== undefined;
    },
    enumerable: false,
    configurable: true
});

Creep.prototype.moveToRange = function (destination, range) {

    let pos = destination.pos === undefined ? destination : destination.pos;
    let pos_json = JSON.stringify(pos);
    if (!this.memory.path || pos_json !== this.memory.path_destination || range !== this.memory.path_range) {
        this.say('pathing 🐽');
        this.memory.path = this.pos.findPathTo(pos, {
            range: range,
            ignoreCreeps: true,
            costCallback:
                function (roomName, costMatrix) {
                    Game.rooms[roomName].find(FIND_CREEPS, {filter: c => !c.isMoving}).forEach(function (c) {
                        costMatrix.set(c.pos.x, c.pos.y, 0xff);
                    });
                }
        });
        this.memory.path_destination = pos_json;
        this.memory.path_range = range;
        new RoomVisual(this.room.name).poly(this.memory.path, {
            stroke: '#fff', strokeWidth: .15,
            opacity: .2, lineStyle: 'dashed'
        });
    }

    return this.rollToRange();
};

Creep.prototype.rollToRange = function () {

    if (this.spawning || this.fatigue) {
        return OK;
    }

    let destination = JSON.parse(this.memory.path_destination);
    let range = this.memory.path_range;

    if (this.pos.inRangeTo(destination, range)) {
        delete this.memory.path;
        delete this.memory.path_destination;
        delete this.memory.path_range;
        return ERR_NO_PATH;
    }

    let result = this.moveByPath(this.memory.path);
    switch (result) {
        case OK:
            break;
        case ERR_TIRED:
            result = OK;
            break;
        case ERR_NOT_FOUND:
            delete this.memory.path;
            this.moveToRange(destination, range);
            this.say('moving to range: WTF?');
            break;
        default:
            console.log(this + ' cant move to' + destination + ' range ' + range + ': ' + result);
            break;
    }
    return result;
};
