'use strict';

let actions = {
    move : require('action.move'),
    mine : require('action.mine')
};

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        while(!actions[creep.action].run(creep));
    }
};
