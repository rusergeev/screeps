const whitelist = require('white.list');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let flag = Game.flags[creep.memory.flag];

        if(flag && flag.room !== creep.room) {
            creep.moveToRange(flag, 1);
            return;
        }

        let patient = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0];
        if (patient) {
            creep.heal(patient);
        }

        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: c => !whitelist.isFriend(c)

        });

        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }else {
                console.log(creep, 'attacks', target, 'of',target.owner.username,'at', creep.room.name);
            }
            return;
        } else {
            const spawning_lair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_KEEPER_LAIR && s.ticksToSpawn < 30});
            if (spawning_lair) {

                creep.moveToRange(spawning_lair, 1);
                return;
            }
        }


        /*else {
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