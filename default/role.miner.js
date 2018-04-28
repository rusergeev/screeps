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
                    //console.log(creep, ' cant harvest: should wait ');
                    break;
                case ERR_NOT_IN_RANGE:
                    let container = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType === STRUCTURE_CONTAINER })[0];
                    if (container)
                        creep.moveToRange(container, 0);
                    else if (source.port)
                        creep.moveToRange(source.port, 0);
                    else
                        creep.moveToRange(source, 1);
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
