'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let mining =  creep.harvest(creep.assignment) !== ERR_NOT_IN_RANGE;
        if(!mining){
            creep.moving();
        }
        return mining;
    }
};
