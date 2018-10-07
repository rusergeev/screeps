'use strict';

Room.prototype.find_cached = function (what, filter) {
    if (!this.memory.find_cache) {
        this.memory['find_cache'] = {};
    }
    if (!this.memory.find_cache[what] || this.memory.find_cache[what].time !== Game.time ){
        this.memory.find_cache[what] = {
            time: Game.time,
            value: this.find(what)
        };
        //console.log('fail cache for', what);
    } else {
        //console.log('OK cache for', what);
    }
    let result = this.memory.find_cache[what].value;
    //console.log('CACHE RES', result);
    let result_filtered  = filter ? _.filter(result, filter.filter) : result;
    //console.log('CACHE RES', result_filtered);
    return result_filtered;
};
