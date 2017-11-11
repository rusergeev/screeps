'use strict';

require('prototype.Source');

let roles = {
    miner : require('role.miner')
};

module.exports = {
    /** @param {Source} source **/
    run: function(source) {
        let workers = source.workers;
        for(let name in workers) {
            let worker = workers[name];
            console.log('worker' + worker);
            roles[worker.role].run(worker);
        }
    }
};