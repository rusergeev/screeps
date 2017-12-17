'use strict';

require('prototype.Source');
require('prototype.RoomObject');

let roles = {

};

module.exports = {
    /** @param {Source} source **/
    run: function (source) {
        try {
            let miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && creep.memory.source === source.id);
            if (source.ports > miners.length && !Memory.spawns_queue[source.id] ) {

                let demand = 5 - _.sum(miners.map(creep => creep.getActiveBodyparts(WORK)));

                console.log('added demands: source: '+ source +'source.workers.length '+ miners.length + ' demand ' + demand );
                Memory.spawns_queue[source.id] = {
                    demand: demand,
                    roi: 0,
                    memory: {
                        source: source.id,
                        role: 'miner',
                        assignment: source.id
                    }
                }
            }
        } catch (e) {
            console.log(source + ' exception', e);
        }
    }
};
