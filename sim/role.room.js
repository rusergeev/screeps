'use strict';

require('prototype.Room');


let roles = {
    controller: require('role.controller'),
    source:  require('role.source')
};

module.exports = {
    /** @param {Room} room **/
    run: function (room) {
        if (room.controller){
            roles.controller.run(room.controller);
        }
        for (let name in room.sources){
            roles.source.run(room.sources[name]);
        }
    }
};