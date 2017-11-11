'use strict';

let roles = {
    miner : require('role.miner')
};

module.exports = {
    /** @param {Source} source **/
    run: function(source) {
        let workers = source.workers;
        for(let name in workers) {
            let worker = workers[name]
            console.log('worker :' + name + ' - ' + worker + ' - ' + worker.memory.role);
            roles[worker.memory.role].run(worker);
        }
    }
};