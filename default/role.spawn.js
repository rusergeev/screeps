
let roleSpawn = {

    /** @param {StructureSpawn} spawn **/
    run: function(spawn) {
        let abilities = [WORK, CARRY, MOVE, MOVE];
        let harvester_abilities = abilities;
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        
        let energy = spawn.room.energyAvailable;
        if (energy >= 550){
            abilities = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 800){
            abilities = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1050){
            abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if (energy >= 1800){
            abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                         CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                         MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            harvester_abilities = [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        }

        let links = spawn.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_LINK &&
                    s.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: ss => ss.structureType == STRUCTURE_CONTAINER ||
                                      ss.structureType == STRUCTURE_STORAGE   }).length != 0});
        let linkster_link_ids = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkster').map(c => c.memory.link);
        if(links.length != linkster_link_ids.length) {
            var linkster_abilities = [CARRY, MOVE, CARRY, MOVE, TOUGH, TOUGH, TOUGH, TOUGH];
            if (spawn.spawnCreep(linkster_abilities, "dry-run", {dryRun: true}) == OK) {
                for (var i in links) {
                    var link = links[i];
                    if (linkster_link_ids.indexOf(link.id) == -1) {
                        var newName = 'Linkster' + Game.time;
                        console.log('Spawning new linkster: ' + newName);
                        spawn.spawnCreep(linkster_abilities, newName, {
                            memory: {
                                role: 'linkster',
                                link: link.id
                            }
                        });
                    }
                }
            }
        }

        let containers = spawn.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});
        var miners_container_ids = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').map(c => c.memory.container);
        if (containers.length > miners_container_ids.length) {
            var miner_abilities = [WORK, WORK, WORK, WORK, WORK, MOVE,TOUGH,TOUGH,TOUGH,TOUGH];
            if (spawn.spawnCreep(miner_abilities, "dry-run", {dryRun: true}) == OK) {
                for (var i in containers) {
                    var container = containers[i];
                    if (miners_container_ids.indexOf(container.id) == -1) {
                        var newName = 'Miner' + Game.time;
                        console.log('Spawning new miner: ' + newName);
                        spawn.spawnCreep(miner_abilities, newName, {
                            memory: {
                                role: 'miner',
                                container: container.id
                            }
                        });
                    }
                }
            }
        } else if (spawn.spawnCreep(abilities, "dry-run", {dryRun: true}) == OK) {
            if (harvesters.length + upgraders.length < 4) {
                if (harvesters.length <= upgraders.length) {
                    let newName = 'Harvester' + Game.time;
                    console.log('Spawning new harvester: ' + newName);
                    spawn.spawnCreep(harvester_abilities, newName, {memory: {role: 'harvester'}});
                } else {
                    let newName = 'Upgrader' + Game.time;
                    console.log('Spawning new upgrader: ' + newName);
                    spawn.spawnCreep(abilities, newName, {memory: {role: 'upgrader'}});
                }
            } else if (builders.length < 1) {
                let newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep(abilities, newName, {memory: {role: 'builder'}});
            }
        }

    }
};

module.exports = roleSpawn;
