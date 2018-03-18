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
                case ERR_BUSY:
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    console.log(creep + ' cant harvest: should wait ');
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToRange(source.port, 0);
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
