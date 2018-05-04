require('prototype.Creep');
module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.loading && creep.isEmpty) {
            creep.memory.loading = true;
            creep.say('loading');
        }
        if(creep.memory.loading && creep.isFull) {
            creep.memory.loading = false;
            creep.say('full');
        }

        const consumers  = [STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_POWER_SPAWN, STRUCTURE_NUKER, STRUCTURE_LINK];
        const storages = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];

	    if(creep.memory.loading) {
	        let container;
            let resource = creep.pos.findClosestByRange( FIND_DROPPED_RESOURCES, {
                filter: t => t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                    && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                    && t.amount >= creep.carryCapacity - _.sum(creep.carry)
            } );
            if ( !resource ) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: t => storages.indexOf(t.structureType) !== -1
                            && t.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                            && t.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                            && t.store[RESOURCE_ENERGY] >= creep.carryCapacity - _.sum(creep.carry)
                    })
                    || creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                        filter: t => t.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                            && t.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                            && t.store[RESOURCE_ENERGY] >= creep.carryCapacity - _.sum(creep.carry)
                    });
            }
            if ( !container ) {
                let containers = creep.room.find( FIND_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                        && t.store[RESOURCE_ENERGY] > 0
                } );
                containers.concat(
                    creep.pos.findClosestByRange( FIND_TOMBSTONES, {
                        filter: t => t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                            && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                            && t.store[RESOURCE_ENERGY] > 0
                    } )
                );
                containers.sort( (a,b) => b.store[RESOURCE_ENERGY]* (a.storeCapacity - _.sum(a.store)) - a.store[RESOURCE_ENERGY] * (b.storeCapacity - _.sum(b.store)) );
                container = containers[0];
            }

            if ( !container ) {
                let resources = creep.room.find( FIND_DROPPED_RESOURCES, {
                    filter: t => t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                } );

                resources.sort( (a,b) => b.amount - a.amount);
                resource = resources[0];
            }

            if (resource) {
                const result = creep.pickup(resource);
                switch (result) {
                    case OK:
                    case ERR_BUSY:
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveToRange(resource, 1);
                        break;
                    case ERR_FULL:
                        creep.say('WTF: full?');
                        break;
                    default:
                        console.log(creep, 'cant pickup', resource, ':', result);
                        break;
                }
            } else if (container) {
                const result = creep.withdraw(container, RESOURCE_ENERGY);
                switch (result) {
                    case OK:
                    case ERR_BUSY:
                        break;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        creep.say('empty: WTF?');
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveToRange(container, 1);
                        break;
                    case ERR_FULL:
                        creep.say('WTF: full?');
                        break;
                    default:
                        console.log(creep, 'cant withdraw', container, ':', result);
                        break;
                }
            } else if (creep.getActiveBodyparts(WORK) > 0){
                const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: t => t.energy > 0
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                });
                if (source) {
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveToRange(source, 1);
                    }
                } else {
                    creep.memory.loading = false;
                }
            } else {
                creep.memory.loading = false;
            }
        }
        else {
            let target;

            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: t => consumers.indexOf(t.structureType) !== -1
                        && t.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                        && t.energy === 0
                });
            }
            if (!target && creep.room.controller) {
                target = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
                    filter:
                        s => (s.structureType === STRUCTURE_CONTAINER ||
                            s.structureType === STRUCTURE_STORAGE)
                            && s.store[RESOURCE_ENERGY] < s.storeCapacity / 10
                }).sort(
                    (a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY] - a.storeCapacity + b.storeCapacity)[0];
            }
            if (!target) {
                let targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: t => consumers.indexOf( t.structureType) !==  -1
                    && t.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                    && t.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                });
                targets.sort((a,b) => a.energy - b.energy);
                target = targets[0];
            }

            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                        && _.sum(t.store) === 0
                });
            }

            if (!target) {
                let containers = creep.room.find( FIND_MY_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 1, {filter: c => c.getActiveBodyparts(ATTACK)}).length === 0
                        && t.pos.findInRange( FIND_HOSTILE_CREEPS, 3, {filter: c => c.getActiveBodyparts(RANGED_ATTACK)}).length === 0
                } );
                containers.sort( (a,b) => a.store[RESOURCE_ENERGY]*(b.storeCapacity - _.sum(b.store)) - b.store[RESOURCE_ENERGY] * (a.storeCapacity - _.sum(a.store)));
                target = containers[0];
            }

            let result = creep.transfer(target, RESOURCE_ENERGY);
            switch (result) {
                case OK:
                case ERR_FULL:
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToRange(target, 1);
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.say('WTF: not enough resources?');
                    break;
                default:
                    console.log(creep, 'cant transfer to', target, ' : ', result);
                    break;
            }
        }
	}
};
