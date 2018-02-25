module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const route = Game.map.findRoute(creep.room, 'W53N46');
        if(false && route.length > 0) {
            console.log('Now heading to room '+route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
        }else{
            let structure = Game.getObjectById(creep.memory.target || '59bbc3ef2052a716c3ce71b2');
            if (creep.claimController(structure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }        }
    }
};
