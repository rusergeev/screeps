require('Room.prototype');

let roles = {
    control: require('role.tech.control'),
};

module.exports = {
    /** @param {RoomObject} room **/
    run: function(room) {
        console.log('room ', room);
        roles['control'].run(room.controller);
    }
};