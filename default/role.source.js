var roleSource = {

    /** @param {StructureSpawn} spawn **/
    run: function(source) {
        var abilities = [WORK,CARRY,MOVE];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < 12 && spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) == OK) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep(abilities, newName, {memory: {role: 'harvester'}});
        }
    }
};

module.exports = roleSource;