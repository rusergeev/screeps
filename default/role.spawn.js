
var roleSpawn = {

    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        var abilities = [WORK,CARRY,MOVE, MOVE];
        var super_abilities = [WORK, WORK, WORK, CARRY, CARRY,CARRY, MOVE, MOVE];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var source0 = _.filter(Game.creeps, (creep) => creep.memory.source == 0);
        var source1 = _.filter(Game.creeps, (creep) => creep.memory.source == 1);
        var resource =  (source0.length <= source1.length) ? 0 : 1;

        if (spawn.room.energyCapacityAvailable > 500){
            abilities = super_abilities;
        }

        if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) == OK )
        {
            if(harvesters.length + upgraders.length < 10)
            {
                if(harvesters.length <= upgraders.length) {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'harvester', source: resource}});
                } else {
                    var newName = 'Harvester' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'upgrader', source: resource}});
                }
            } else if (builders.length < 10){
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'builder', source: resource}});
            }
        }






    }
};

module.exports = roleSpawn;