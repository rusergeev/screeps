module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let container = Game.getObjectById(creep.memory.container);
        if (creep.pos.isEqualTo(container.pos)) {
            let source = creep.pos.findInRange(FIND_SOURCES, 1);
            if (source.length > 0) {
                creep.harvest(source[0]);
            } else {
                console.log(" Miner could not find a source.");
            }
        }
        else {
            creep.moveTo(container);
        }
    }
};