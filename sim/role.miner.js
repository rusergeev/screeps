'use strict';

let actions = {
    move : require('action.move'),
    mine : require('action.mine')
};

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let action = actions[creep.action];
        if (action) {
            action.run(creep);
        } else {
            console.log(creep + ' action could not be handeled :' + creep.action);
        }
    }
};
