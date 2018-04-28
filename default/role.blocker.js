module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const flag = Game.flags.Flag4;
        const distance = 2;
        if(!creep.pos.findInRange(flag,distance)[0]) {
            creep.moveToRange(flag, distance);
        }
    }
};