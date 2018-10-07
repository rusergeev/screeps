require('prototype.Creep');
require('prototype.Room');
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

/*
        let spawn = creep.pos.findClosestByRange(STRUCTURE_SPAWN, {filter: s.energy < s.energyCapacity});
        if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE){
            creep.moveTo(spawn);
        }


        return;*/

        const consumers  = [STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_POWER_SPAWN, /*STRUCTURE_NUKER,*/ STRUCTURE_LINK];
        const storages = [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];

	    if(creep.memory.loading) {
	        let container = Game.getObjectById(creep.memory.container);
            let resource = Game.getObjectById(creep.memory.resource);
            if ( !resource && !container) {
                resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: t => t.pos.isSafe()
                        && t.amount >= creep.carryCapacity - _.sum(creep.carry)
                });
            }
            if ( !resource && !container) {
                container =
                    creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                        filter: t => t.pos.isSafe()
                            && t.store[RESOURCE_ENERGY] >= creep.carryCapacity - _.sum(creep.carry)
                    })
                || creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: t => storages.indexOf(t.structureType) !== -1
                            && t.pos.isSafe()
                            && (t.pos.findInRange( FIND_MY_STRUCTURES, 4, {filter: s => s.structureType === STRUCTURE_CONTROLLER}).length === 0 || t.store[RESOURCE_ENERGY] > 2000)
                            && t.store[RESOURCE_ENERGY] >= creep.carryCapacity - _.sum(creep.carry)
                    });
            }
            if ( !resource  && !container ) {
                let containers = creep.room.find_cached( FIND_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.isSafe()
                        && t.pos.findInRange( FIND_MY_STRUCTURES, 4, {filter: s => s.structureType === STRUCTURE_CONTROLLER}).length === 0
                        && t.store[RESOURCE_ENERGY] > 0
                } );
                containers.concat(
                    creep.pos.findClosestByRange( FIND_TOMBSTONES, {
                        filter: t => t.pos.isSafe()
                            && t.store[RESOURCE_ENERGY] > 0
                    } )
                );
                containers.sort( (a,b) => b.store[RESOURCE_ENERGY]* (a.storeCapacity - _.sum(a.store))*a.pos.getRangeTo(creep) - a.store[RESOURCE_ENERGY] * (b.storeCapacity - _.sum(b.store))*b.pos.getRangeTo(creep)  );
                container = containers[0];
            }

            if ( !resource  && !container ) {
                let resources = creep.room.find_cached( FIND_DROPPED_RESOURCES, {
                    filter: t => t.pos.isSafe()
                } );

                resources.sort( (a,b) => b.amount*a.pos.getRangeTo(creep) - a.amount*b.pos.getRangeTo(creep));
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
                        && t.pos.isSafe()
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
            let target = Game.getObjectById(creep.memory.target);

            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: t => consumers.indexOf(t.structureType) !== -1
                        && t.pos.isSafe()
                        && t.energy < 50
                });
            }
            if (!target && creep.room.controller) {
                target = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
                    filter:
                        s => (s.structureType === STRUCTURE_CONTAINER ||
                            s.structureType === STRUCTURE_STORAGE)
                            && s.store[RESOURCE_ENERGY] < 1000
                }).sort(
                    (a, b) => (b.store[RESOURCE_ENERGY] - b.storeCapacity)*a.pos.getRangeTo(creep) - (a.store[RESOURCE_ENERGY] - a.storeCapacity)*b.pos.getRangeTo(creep))[0];
            }
            if (!target) {
                let targets = creep.room.find_cached(FIND_MY_STRUCTURES, {
                    filter: t => consumers.indexOf( t.structureType) !==  -1
                    && t.pos.isSafe()
                    && t.energy < t.energyCapacity
                });
                targets.sort((a,b) => (b.energy-b.energyCapacity)*a.pos.getRangeTo(creep) - (a.energy-a.energyCapacity)*b.pos.getRangeTo(creep)  );
                target = targets[0];
            }
            if (!target && creep.room.controller) {
                target = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 4, {
                    filter:
                        s => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK].indexOf(s.structureType) !== -1
                            && s.store[RESOURCE_ENERGY] < s.storeCapacity / 10
                }).sort(
                    (a, b) => (b.store[RESOURCE_ENERGY]-b.storeCapacity)*a.pos.getRangeTo(creep) - (a.store[RESOURCE_ENERGY]-a.storeCapacity)*b.pos.getRangeTo(creep) )[0];
            }
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.isSafe()
                        && _.sum(t.store) === 0
                });
            }

            if (!target) {
                let containers = creep.room.find_cached( FIND_MY_STRUCTURES, {
                    filter: t => storages.indexOf(t.structureType) !== -1
                        && t.pos.isSafe()
                } );
                containers.sort( (a,b) => a.store[RESOURCE_ENERGY]*(b.storeCapacity - _.sum(b.store))*a.pos.getRangeTo(creep) - b.store[RESOURCE_ENERGY]*(a.storeCapacity - _.sum(a.store))*b.pos.getRangeTo(creep) );
                target = containers[0];
            }

            if (!target) {
                let creeps = creep.room.find_cached( FIND_MY_CREEPS, {
                    filter: t => ['upgrader', 'builder'].indexOf(t.memory.role) !== -1
                        && t.pos.isSafe()
                } );
                creeps.sort( (a,b) => a.carry[RESOURCE_ENERGY]*a.pos.getRangeTo(creep)  - b.carry[RESOURCE_ENERGY]*b.pos.getRangeTo(creep) );
                target = creeps[0];
            }

            if(!target ){
                let spawn = Game.getObjectById(creep.memory.spawn);
                if (spawn.room !== creep.room) {
                    creep.moveToRange(spawn, 1);
                    return;
                }
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
