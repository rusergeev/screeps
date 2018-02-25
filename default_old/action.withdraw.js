'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let withdrawing = creep.withdraw(creep.target, RESOURCE_ENERGY);
        switch (withdrawing){
            case ERR_NOT_IN_RANGE:
                creep.moving();
                return false;
            case ERR_INVALID_TARGET:
                creep.action = 'pickup';
                console.log('invalid target');
                return false;
            case ERR_FULL:
                creep.action = 'deliver';
                return false;
            case ERR_INVALID_ARGS:

            case OK:
                return true;
            default:
                console.log('withdrawing ' + withdrawing);
        }
        return true;
    }
};
