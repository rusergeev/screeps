'use strict';

let actions = {
    move : require('action.move'),
    pickup : require('action.pickup'),
    deliver : require('action.deliver'),
    withdraw : require('action.withdraw')
};

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        while(!actions[creep.action].run(creep));
    }
};
