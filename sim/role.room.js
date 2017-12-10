'use strict';

//require('prototype.RoomPosition');
require('prototype.Room');
//require('prototype.RoomObject');
//require('prototype.Source');

let roles = {

};

module.exports = {
    /** @param {Room} room **/
    run: function (room) {
        //console.log(JSON.stringify(room));

        console.log(JSON.stringify(room.survivalInfo));
        //console.log(room.energyAvailable);
    }
};