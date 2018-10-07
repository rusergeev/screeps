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
       const brown_flags = _.filter(Game.flags, f => f.color === COLOR_BROWN
            && f.room === creep.room
   
        );
        let flag_target;
        if (brown_flags.length > 0) {
            flag_target = creep.room.lookForAt(LOOK_STRUCTURES, brown_flags[0])[0];
        }
        const target = flag_target || creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: c => !whitelist.isFriend(c)

        }) ;

        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }else {
                console.log(creep, 'attacks', target, 'of',target.owner,'at', creep.room.name);
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

        const t1 = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if (t1) {
            console.log('destroy spawn');
            let result = creep.attack(t1);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveToRange(t1, 1);
            }
            return;
        }



        const t3 = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: s => !s.energy &&  _.sum(s.store) == 0
                || (s.structureType !== STRUCTURE_CONTROLLER
                && s.structureType !== STRUCTURE_STORAGE
                && s.structureType !== STRUCTURE_NUKER
                && s.structureType !== STRUCTURE_TERMINAL
                && s.structureType !== STRUCTURE_EXTENSION)
        } );
        if (t3) {
            console.log('destroy structures', t3);
            let result = creep.attack(t3);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveToRange(t3, 1);
            }
            //console.log(creep, result);
            return;
        }

        const t4 = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
        if (t4) {
            console.log('destroy construction site', t4);
            let result = creep.attack(t4);
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveToRange(t4, 1);
            }
            console.log(creep, result);
            return;
        }

        const range = 1;
        if(flag && !creep.pos.isNearTo(flag)){
            creep.moveToRange(flag, range);
        }
    }

};