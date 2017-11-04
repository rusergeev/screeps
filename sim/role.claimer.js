module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const route = Game.map.findRoute(creep.room, 'W53N45');
        if(route.length > 0) {
            console.log('Now heading to room '+route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        }else{
            let structure = Game.getObjectById('59bbc3ef2052a716c3ce71b5');
            if (creep.claimController(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
    }
};