module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.loading && creep.isEmpty) {
            creep.memory.loading = true;
            creep.say('loading');
        }
        if(creep.memory.loading && creep.isFull) {
            creep.memory.loading = false;
            creep.say('working');
        }

	    if(!creep.memory.loading) {
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else {
                let structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART ||
                        (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)&& s.hits < 5000
                });
                if (structure) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure, {
                            noPathFinding: creep.has_path,
                            reusePath: 50,
                            visualizePathStyle: {stroke: '#ffffff'}
                        });
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {
                            noPathFinding: creep.has_path,
                            reusePath: 50,
                            visualizePathStyle: {stroke: '#ffffff'}
                        });
                    }
                }
            }
	    }
	}
};
