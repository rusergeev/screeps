module.exports = {
    /** @param {StructureLink} link **/
    run: function(link) {
        let links = link.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_LINK && s.id != link.id
                      && s.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: ss => ss.structureType === STRUCTURE_CONTAINER
                            ||  ss.structureType === STRUCTURE_STORAGE   }).length === 0
        });
        for( let name in links){
            if(link.energy > 0){
                let other = links[name];
                link.transferEnergy(other);
            }
        }
    }
};
