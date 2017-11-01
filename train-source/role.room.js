require('Room.prototype');

let roles = {
    mine: require('role.energy.mine'),
    tech: require('role.tech.control'),
    war: require('role.military')
};

module.exports = {
    /** @param {RoomObject} room **/
    run: function(room) {
        console.log('room ', room);
        let sources = room.sources;
        for(var name in sources){
            let source = sources[name];
            roles['mine'].run(source);
        }
        roles['mine'].run(room.controller);
    }
};