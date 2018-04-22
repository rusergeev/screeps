module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {


        const route = Game.map.findRoute(creep.room, 'E36N49');
        if (route.length > 0) {
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveToRange(exit, 0);
            console.log(creep, 'rolls to', exit, 'at', creep.room);
            return;
        }

        if (!creep.room.controller.safeMode) {

            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                console.log('destroy creep');
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.moveToRange(target);
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

            const t3 = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES) || creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
            if (t3) {
                console.log('destroy structures', t3);
                let result = creep.attack(t3);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveToRange(t3, 1);
                }
                //console.log(creep, result);
                return;
            }
        }

    }
};