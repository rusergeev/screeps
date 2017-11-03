module.exports = {

    /** @param {StructureSpawn} spawn **/
    run: function(source) {
        const abilities = [WORK,CARRY,MOVE];
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < 12 && spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) == OK) {
            let newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep(abilities, newName, {memory: {role: 'harvester'}});
        }
    }
};
