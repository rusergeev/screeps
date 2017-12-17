'use strict';

require('prototype.Room');


let roles = {
    controller: require('role.controller'),
    source:  require('role.source')
};


module.exports = {
    /** @param {Room} room **/
    run: function (room) {
        if (room.controller){
            roles.controller.run(room.controller);
        }
        for (let name in room.sources){
            roles.source.run(room.sources[name]);
        }

        //stats
        let E = room.energyAvailable;
        let E_ = room.memory.energy || 0;
        let dE = (E - E_);
        console.log(room + ' energy ' + E);
        console.log(room + ' delta ' + dE);
        let t = Game.time;
        let t_ = room.memory.time || 0;
        let dt = (t - t_);
        let flow =  dE / dt;
        let ave_flow_ = room.memory.ave_flow;
        let ave_flow = ave_flow_ + (flow - ave_flow_) * dt / (t + dt);

        let inflow = Math.max(0, flow);
        let ave_inflow_ = room.memory.ave_inflow;
        let ave_inflow = ave_inflow_ + (inflow - ave_inflow_) * dt / (t + dt);

        let outflow = Math.max(0, -flow);
        let ave_outflow_ = room.memory.ave_outflow;
        let ave_outflow = ave_outflow_ + (outflow - ave_outflow_) * dt / (t + dt);

        room.memory.flow = flow;
        room.memory.ave_flow = ave_flow;
        room.memory.ave_inflow = ave_inflow;
        room.memory.ave_outflow = ave_outflow;
        room.memory.energy = E;
        room.memory.time = t;

        console.log(room + ' flow ' + room.memory.flow);
        console.log(room + ' ave flow ' + room.memory.ave_flow);
        console.log(room + ' ave inflow ' + room.memory.ave_inflow);
        console.log(room + ' ave outflow ' + room.memory.ave_outflow);
        // stat energy


    }
};