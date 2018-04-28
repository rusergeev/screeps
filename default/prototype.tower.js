const whitelist = require('white.list');

StructureTower.prototype.defend =
    function () {
        let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: c => !whitelist.isFriend(c)});
        if (target) {
            this.attack(target);
        } else {
            let target = this.pos.findClosestByRange(FIND_CREEPS, {
                filter: (s) => s.hits < s.hitsMax
            });
            if (target) {
                this.heal(target);
            } else {
                let structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < s.hitsMax / 1.5 && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART) ||
                        ((s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && s.hits < 1000)
                });
                if (!structure && this.room.controller.level > 4) {
                    structure =
                       this.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && s.hits < 17510})
                    || this.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && s.hits < 175100})
                    || this.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL) && s.hits < 1751000});
                }
                if (structure) {
                    this.repair(structure);
                }
            }
        }
    };
