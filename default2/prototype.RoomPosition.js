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
                console.log(x,y, this.roomName);
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