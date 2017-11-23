'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let target = creep.target.pos.findInRange(FIND_DROPPED_RESOURCES,0)[0];
        let picking = creep.pickup(target);
        console.log(picking);
        switch (picking){
            case ERR_NOT_IN_RANGE:
                creep.moving();
                return false;
            case ERR_INVALID_TARGET:
                let target = creep.assignment.container;
                if (target){
                    creep.target = target;
                    creep.action = 'withdraw';
                    return false;
                }
                break;
            case ERR_FULL:
                creep.say('Deliver');
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
