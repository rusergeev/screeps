module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const route = Game.map.findRoute(creep.room, 'E35N48');
        if (route.length > 0) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
        } else {
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
            if (target) {
                if (creep.attack(target) !== OK) {
                    creep.moveToRange(target,1);
                }
            }
        }
    }
};