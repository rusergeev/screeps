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

                console.log('added demands: source: '+ source +' miners '+ miners.length + ' demand ' + demand  + ' ports ' + source.ports);
                Memory.spawns_queue[source.id] = {
                    demand: demand,
                    memory: {
                        source: source.id,
                        role: 'miner'
                    }
                }
            }
            //stats
            let resources = source.pos.findInRange(FIND_DROPPED_RESOURCES, 1,
                { filter: r => r.resourceType === RESOURCE_ENERGY});
            let E = _.sum(resources.map(r => r.amount));
            let E_ = source.memory.energy;
            let dE = (E - E_);
            console.log(source + ' energy ' + E);
            console.log(source + ' delta ' + dE);
            if ( !source.memory.start_time && dE > 0 ){
                source.memory.start_time = source.memory.time;
            }
            let start_time = source.memory.start_time  || 0;
            let t = Game.time - start_time;
            let t_ = source.memory.time;
            let dt = (t - t_);
            let flow =  dE / dt;
            let ave_flow_ = source.memory.ave_flow;



            let ave_flow = ave_flow_ + (flow - ave_flow_) * dt / (t + dt);

            source.memory.flow = flow;
            source.memory.ave_flow = ave_flow;
            source.memory.energy = E;
            source.memory.time = t;

            console.log(source + ' flow ' + source.memory.flow);
            console.log(source + ' ave flow ' + source.memory.ave_flow);

            // grafana

            if(source.memory.start_time){
                Memory.stats['rooms.' + source.room.name + '.sources.' + source.id + '.energy'] = E;
                Memory.stats['rooms.' + source.room.name + '.sources.' + source.id + '.flow'] = flow;
                Memory.stats['rooms.' + source.room.name + '.sources.' + source.id + '.ave.flow'] = ave_flow;

            }

        } catch (e) {
            console.log(source + ' exception', e);
        }
    }
};
