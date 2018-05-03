require('prototype.Creep');
module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.isEmpty) {
            creep.memory.harvesting = true;
            creep.say('Harvest');
        }
        if(creep.memory.harvesting && creep.isFull) {
            creep.memory.harvesting = false;
            creep.say('Full');
        }
	    if(creep.memory.harvesting) {
            let source = Game.getObjectById(creep.memory.source);

            let result = creep.withdraw(source, RESOURCE_ENERGY);
            switch (result) {
                case OK:
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.say('empty: WTF?');
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToRange(source, 1);
                    break;
                case ERR_FULL:
                    creep.say('WTF: full?');
                    break;
                default:
                    console.log(creep + ' cant withdraw ' + source + ' : ' + result);
                    break;
            }
        }
        else {
            let target = Game.getObjectById(creep.memory.target);
            let result = creep.transfer(target, RESOURCE_ENERGY);
            switch (result) {
                case OK:
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveToRange(target, 1);
                    break;
                case ERR_FULL:
                    creep.drop();
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.say('WTF: not enough resources?');
                    break;
                default:
                    console.log(creep + ' cant transfer to ' + target + ' : ' + result);
                    break;
            }
        }

	}
};
