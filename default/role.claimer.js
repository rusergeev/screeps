module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        /*const flag = Game.flags.Flag1;
        const range = 1;
        if(creep.pos.findInRange(FIND_FLAGS, range, {filter: flag => flag.name = creep.memory.flag}).length === 0) {
            creep.moveToRange(flag, range);
        }*/
        let structure = Game.getObjectById(creep.memory.target || '59f1a5a182100e1594f3ed0d');
        if (creep.claimController(structure) === ERR_NOT_IN_RANGE) {
            creep.moveToRange(structure, 1);
        }
    }

};
