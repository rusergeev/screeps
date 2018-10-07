const whitelist = require('white.list');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        //creep.moveToRange(Game.flags.Flag1,1);
        //return;

        let target = Game.flags.Flag1 || Game.flags.Flag2;
        if (target) {
            console.log(creep, creep.room,'destroy zabor');
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveToRange(target);
            }
            return;
        }



        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{filter: c => !whitelist.isFriend(c)});
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

        if(!creep.pos.findInRange(flag,distance)[0]) {
            creep.moveToRange(flag, distance);
        }
    }

};