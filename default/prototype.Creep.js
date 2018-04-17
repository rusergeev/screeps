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
        return this.carry[RESOURCE_ENERGY] === 0;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'hasMinerals', {
    get: function() {
        return _.sum(this.carry) - this.carry[RESOURCE_ENERGY] > 0;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'isMoving', {
    get: function() {
        return this.memory.path !== undefined && !this.memory.stuck;
    },
    enumerable: false,
    configurable: true
});

Creep.prototype.moveToRange = function (destination, range) {

    let pos = destination.pos === undefined ? destination : destination.pos;
    let pos_json = JSON.stringify(pos);
    if (!this.memory.path || pos_json !== this.memory.path_destination || range !== this.memory.path_range) {
        this.say('pathing =/');
        this.memory.path = this.pos.findPathTo(pos, {
            range: range,
            ignoreCreeps: true,
            ignoreDestructibleStructures: false,
            costCallback:
                function (roomName, costMatrix) {
                    const room = Game.rooms[roomName];
                    if (room !== undefined){
                        room.find(FIND_CREEPS, {filter: c => c.my && !c.isMoving}).forEach(function (c) {
                            costMatrix.set(c.pos.x, c.pos.y, 0xff);
                        });
                    }
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
    try {
        if (this.spawning || this.fatigue) {
            this.memory.stuck = true;
            return OK;
        }

        let prev_pos = this.memory.path_prev_pos;

        if (prev_pos !== undefined && this.pos.isEqualTo(prev_pos)) {
            console.log(this, ": stuck!");
            this.say("stuck =(");
            delete this.memory.path;
            delete this.memory.path_destination;
            delete this.memory.path_range;
            delete this.memory.path_prev_pos;
            this.memory.stuck = true;
            return ERR_NO_PATH;
        } else {
            this.memory.path_prev_pos = this.pos;
        }

        let destination = JSON.parse(this.memory.path_destination);
        let range = this.memory.path_range;

        if (this.pos.inRangeTo(destination, range)) {
            delete this.memory.path;
            delete this.memory.path_destination;
            delete this.memory.path_range;
            delete this.memory.path_prev_pos;
            return ERR_NO_PATH;
        }

        let result = this.moveByPath(this.memory.path);
        switch (result) {
            case OK:
                this.memory.stuck = false;
                break;
            case ERR_TIRED:
                result = OK;
                break;
            case ERR_NOT_FOUND:
                delete this.memory.path;
                this.say('out of range: WTF?');
                break;
            default:
                console.log(this + ' cant move to' + JSON.stringify(destination) + ' range ' + range + ': ' + result);
                break;
        }
        return result;
    } catch (e) {
        console.log(this, '- roll exception:', e);
        delete this.memory.path;
        delete this.memory.path_destination;
        delete this.memory.path_range;
        delete this.memory.path_prev_pos;
    }

};
