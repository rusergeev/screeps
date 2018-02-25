'use strict';

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        let moving = creep.pos.getRangeTo(creep.target) !== creep.range;
         if(moving){
            creep.moveTo(creep.target, {noPathFinding: creep.has_path, reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
        }else{
             creep.arrived();
         }
        return moving;
    }
};
