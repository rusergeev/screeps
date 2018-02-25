'use strict';

require('prototype.Source');
require('prototype.Creep');

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        try {
            let source = Game.getObjectById(creep.memory.source);
            let result = creep.harvest(source);
            switch (result) {
                case OK:
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToX(source.port);
                    break;
                default:
                    console.log(creep + ' cant harvest ' + source + ' : ' + result);
                    break;
            }
        } catch (e) {
            console.log(creep + 'miner exception: ', e);
        }
    }
};
