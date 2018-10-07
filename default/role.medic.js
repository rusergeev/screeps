module.exports = {
    find_a_destroyer: function(creep) {
        let destroyers = _.filter(Game.creeps, creep => creep.memory.role === 'destroyer');
        let medics = _.filter(Game.creeps, creep => creep.memory.role === 'medic');
        let destroyer_needs_medic = destroyers.filter(destroyer => medics.map(m => m.memory.patient).indexOf(destroyer.id) === -1)[0];
        if (destroyer_needs_medic) {
            creep.memory.patient = destroyer_needs_medic.id;
            console.log(creep, 'found', destroyer_needs_medic);
        }
    return destroyer_needs_medic;
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        //creep.memory.patient = '5adfb72916b2ab2a2a2bc3ff';
            /*let target = Game.getObjectById(creep.memory.patient)
                || this.find_a_destroyer(creep)
                || creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (s) => s.hits < s.hitsMax / 1.2
                });*/
        let target = Game.getObjectById(creep.memory.patient)
            || creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (s) => s.hits < s.hitsMax });
            if (target) {
                if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                    console.log(creep, 'rolls to', target, 'at', creep.room);
                    creep.moveTo(target);
                }
            }else {

                creep.moveToRange(Game.flags.Flag2,1);
            }

    }
};