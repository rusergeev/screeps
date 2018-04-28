const whitelist = require('white.list');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        let patient = creep.pos.findInRange(FIND_MY_CREEPS, 1, { filter: c => c.hits < c.hitsMax })[0];
        if (patient) {
            creep.heal(patient);
        }

        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: c => !whitelist.isFriend(c)});
        if (target) {
            console.log(creep, 'destroy creep at', creep.room.name);
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }else{
            let patient = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (patient) {
                if (creep.heal(patient) === ERR_NOT_IN_RANGE) {
                    console.log(creep, 'rolls to', patient, 'at', creep.room)
                    creep.moveToRange(patient, 1);
                }
            } /*else {
                const lair = creep.room.find(FIND_STRUCTURES,{filter: s => s.structureType === STRUCTURE_KEEPER_LAIR}).sort(function(a, b) {
                    return a.ticksToSpawn - b.ticksToSpawn;
                })[0];
                if(lair) {
                    creep.moveToRange(lair, 1);
                }
            }*/
        }

        const flag = Game.flags[creep.memory.flag];
        const range = 1;
        if(flag && creep.pos.findInRange(FIND_FLAGS, range, {filter: flag => flag.name = creep.memory.flag}).length === 0) {
            creep.moveToRange(flag, range);
        }
    }

};