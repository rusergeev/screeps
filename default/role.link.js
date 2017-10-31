var roleBuilder = {
    /** @param {StructureLink} link **/
    run: function(link) {
        if(link.energy > 0){
            link.transferEnergy(Game.getObjectById('59f529e10dd3866d733f9c4c'))
        }
    }
};

module.exports = roleBuilder;