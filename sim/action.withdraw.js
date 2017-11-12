'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let picking = creep.pickup(creep.target);
        switch (picking){
            case ERR_NOT_IN_RANGE:
                creep.moving();
                return false;
            case ERR_INVALID_TARGET:
                //var target = creep.target.pos.findInRange(FIND_DROPPED_RESOURCES,0)[0];
                let target = creep.target.pos.findInRange(FIND_STRUCTURES, 0, {filter: s => s.structureType === STRUCTURE_CONTAINER})[0];
                if (target){
                    creep.target = target;
                    creep.action = 'withdraw';
                    return false;
                }
            case ERR_FULL:
                creep.action = 'deliver';
                return false;
            case OK:
                return true;
            default:
                console.log('picking ' + picking);
        }
        return true;
    }
};
