module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const route = Game.map.findRoute(creep.room, 'E35N47');
        if ( route.length > 0) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
        }  else {
            let target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (s) => s.hits < s.hitsMax / 1.2
            });
            if (target) {
                if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};