'use strict';

RoomPosition.prototype.free_adj_pos_count = function () {
    let freeSpaceCount = 0;
    [this.x - 1, this.x, this.x + 1].forEach(x => {
        [this.y - 1, this.y, this.y + 1].forEach(y => {
            if (Game.map.getTerrainAt(x, y, this.roomName) !== 'wall') {
                freeSpaceCount++;
            }
        });
    });
    return freeSpaceCount;
};

RoomPosition.prototype.free_adj_pos = function () {
    let free_pos = [];
    [this.x - 1, this.x, this.x + 1].forEach(x => {
        [this.y - 1, this.y, this.y + 1].forEach(y => {
            if (Game.map.getTerrainAt(x, y, this.roomName) !== 'wall') {
                free_pos.push(new RoomPosition(x, y, this.roomName));
            }
        });
    });
    return free_pos;
};

RoomPosition.prototype.adj_pos_with_max_access = function () {
    let candidates = this.free_adj_pos();
    let candidates_space_count = candidates.map(x => x.free_adj_pos_count());
    let max = candidates_space_count.reduce(function (a, b) {
        return Math.max(a, b);
    });
    let i = candidates_space_count.indexOf(max);
    return candidates[i];
};

RoomPosition.prototype.isInDoors = function () {
    return this.x === 0 || this.x === 49 || this.y === 0 || this.y === 49;
};

RoomPosition.prototype.isSafe = function(){
    return this.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK) }).length === 0
        && this.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK) }).length === 0
        && this.findInRange(FIND_STRUCTURES, 3, {
            filter: s => s.structureType === STRUCTURE_KEEPER_LAIR
                && s.ticksToSpawn < 20})
};