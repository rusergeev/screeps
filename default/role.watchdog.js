const whitelist = require('white.list');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let flag = Game.flags[creep.memory.flag];
        let patient = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0];
        if (patient) {
            creep.heal(patient);
        }

        let target;
        if (flag && flag.secondaryColor === COLOR_RED) {

            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: c => !whitelist.isFriend(c)});
        } else {

            target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4, {filter: c => !whitelist.isFriend(c)})[0];
        }
        if (target) {
            console.log(creep, 'attacks', target, 'of',target.owner.username,'at', creep.room.name);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        } /*else {
            let patient = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (patient) {
                if (creep.heal(patient) === ERR_NOT_IN_RANGE) {
                    console.log(creep, 'rolls to', patient, 'at', creep.room)
                    creep.moveToRange(patient, 1);
                }
            }
        }*/

        const range = 1;
        if(flag && !creep.pos.isNearTo(flag)){
            creep.moveToRange(flag, range);
        }
    }

};