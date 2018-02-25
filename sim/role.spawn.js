'use strict';

require('prototype.StructureSpawn');
require('prototype.Source');

module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function (spawn) {
        if (spawn.spawning) return;
        for (let source_id in Memory.spawns_queue) {
            let order = Memory.spawns_queue[source_id];
            if (order) {
                let newName = order.memory.role + Game.time;
                console.log(spawn.name + ': spawning ' + newName);
                if (spawn.spawnCreep([MOVE, WORK], newName, {memory: Object.assign({}, order.memory)}) === OK) {
                    order.demand--;
                }
                if (order.demand) {
                    delete Memory.spawns_queue[source_id];
                }
            }
        }
    }
};
