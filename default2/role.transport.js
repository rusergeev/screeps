'use strict';

require('prototype.Source');
require('prototype.Structure');
require('prototype.Creep');
require('prototype.RoomPosition');

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        try {

            if (!creep.memory.loading && creep.isEmpty) {
                creep.say('loading');
                creep.memory.loading = true;
            }

            if (creep.memory.loading && creep.isFull) {
                creep.say('delivering');
                creep.memory.loading = false;
            }

            if (creep.memory.loading) {
                creep.load();
            } else {
                creep.deliver();
            }

        } catch (e) {
            console.log(creep + 'transport exception: ', e);
        }
    }
};
