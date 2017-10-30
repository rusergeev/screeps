
var roleSpawn = {

    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        var abilities = [WORK,CARRY,MOVE, MOVE];
        var super_abilities = [WORK, WORK, WORK, CARRY, CARRY,CARRY, MOVE, MOVE];
        var hyper_abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY,CARRY, CARRY, MOVE, MOVE, MOVE];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var medics = _.filter(Game.creeps, (creep) => creep.memory.role == 'medic');

        let energy = spawn.room.energyCapacityAvailable;
        if (energy >= 500){
            abilities = super_abilities;
        }
        if (energy >= 800){
            abilities = hyper_abilities;
        }

        let containers = spawn.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
        var miners_container_ids = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').map(c => c.memory.container);
        if (containers.length != miners_container_ids.length){
            var miner_abilities = [WORK, WORK, WORK, WORK, WORK, MOVE];
            if(spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) == OK){
                for (var i in containers) {
                    var container = containers[i];
                    if (miners_container_ids.indexOf(container.id) == -1) {
                        var source = container.pos.findInRange(FIND_SOURCES, 1);
                        var newName = 'Miner' + Game.time;
                        console.log('Spawning new miner: ' + newName);
                        spawn.spawnCreep(miner_abilities, newName, {memory: {role: 'miner', container: container.id}});
                    }
                }
            }
        }

        if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) == OK )
        {
            if(harvesters.length + upgraders.length < 4)
            {
                if(harvesters.length <= upgraders.length) {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'harvester'}});
                } else {
                    var newName = 'Upgrader' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'upgrader'}});
                }
            } else if (builders.length < 8){
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'builder'}});
            }
        }


    }
};

module.exports = roleSpawn;