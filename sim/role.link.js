'use strict';

module.exports = {
    /** @param {StructureLink} link **/
    run: function (link) {
        let links = link.room.find(FIND_STRUCTURES, {filter: s => s.id != link.id});
        for (let name in links) {
            if (link.energy > 0) {
                let other = links[name];
                link.transferEnergy(other);
            }
        }
    }
};
