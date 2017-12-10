module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) !== OK) {
            let target = source.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: ss => ss.structureType === STRUCTURE_CONTAINER ||
                    ss.structureType === STRUCTURE_STORAGE   })[0]|| source;
            creep.moveTo(target, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
