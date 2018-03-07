module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const route = Game.map.findRoute(creep.room, 'E35N47');
        if (route.length > 0) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
        } else {
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                console.log('destroy creep');
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                const t1 = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
                if(t1) {
                    console.log('destroy spawn');
                    let result = creep.attack(t1);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(t1);

                    }
                    console.log(result);
                }
            }
        }
    }
};