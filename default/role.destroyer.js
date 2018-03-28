module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (!creep.room.controller.safeMode) {

            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                console.log('destroy creep');
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            const t1 = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
            if (t1) {
                console.log('destroy spawn');
                let result = creep.attack(t1);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveToRange(t1, 1);
                }
                return;
            }

            const t2 = creep.room.controller;
            if (false&&t2 && !t2.my) {
                console.log('destroy controller');
                let result = creep.attackController(t2);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveToRange(t2, 1);
                }
                return;
            }

            const t3 = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if (t3) {
                console.log('destroy structures');
                let result = creep.attack(t3);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveToRange(t3, 1);
                }
                return;
            }
        }
        const route = Game.map.findRoute(creep.room, 'E37N47');
        if (route.length > 0) {
            console.log('Now heading to room ' + route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
        }
    }
};