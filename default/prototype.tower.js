StructureTower.prototype.defend =
    function () {
        let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            this.attack(target);
        }else {
            let structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax / 1.5 && s.structureType != STRUCTURE_WALL
            });
            if (structure) {
                this.repair(structure);
            }
        }
    };