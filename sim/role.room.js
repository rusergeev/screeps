'use strict';

let roles = {
    source: require('role.source'),
    controller: require('role.controller')
};

module.exports = {
    /** @param {RoomObject} room **/
    run: function (room) {
        roles['controller'].run(room.controller);
        let sources = room.sources;
        for (let name in sources) {
            let source = sources[name];
            roles['source'].run(source);
        }
    }
};