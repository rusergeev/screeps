module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const route = Game.map.findRoute(creep.room, 'E39N46');
        if ( route.length > 0 ) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
        } else {
            let structure = Game.getObjectById(creep.memory.target || '59f1a5a282100e1594f3ed1c');
            if (creep.claimController(structure) === ERR_NOT_IN_RANGE) {
                creep.moveToRange(structure, 1);
            }
        }
    }
};