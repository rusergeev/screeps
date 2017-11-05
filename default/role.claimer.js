module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {

        const route = Game.map.findRoute(creep.room, 'W53N44');
        if(route.length > 0) {
            console.log('Now heading to room '+route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        }else{
            //creep.move(TOP);
            //creep.memory.role = 'builder';
            //let structure = Game.getObjectById('59fe2284b2c99b661227be6c');
            //creep.moveTo(structure);
            //if (creep.build(structure) === ERR_NOT_IN_RANGE) {
            //   creep.moveTo(structure);
            //}
        }
    }
};
