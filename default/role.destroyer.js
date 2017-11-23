module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const route = Game.map.findRoute(creep.room, 'W53N46');
        if (route.length > 0) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};