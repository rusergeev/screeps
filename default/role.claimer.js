module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const flag = Game.flags[creep.memory.flag];
        if(flag && flag.room !== creep.room) {
            creep.moveToRange(flag, 1);
        }else {
            let structure = creep.room.controller;

            let result;
            if (structure.owner && structure.owner.username !== 'Sergeev') {
                result = creep.attackController(structure);
                console.log(creep, 'attacks', structure, 'in', creep.room);
            } else {
                result = creep.reserveController(structure);
                //console.log(creep, 'reserves', structure, 'in', creep.room);
            }

            if (result === ERR_NOT_IN_RANGE) {
                creep.moveToRange(creep.room.controller.pos, 1);
            }
        }
    }

};
