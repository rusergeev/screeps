module.exports = {
    find: function(creep) {
        return creep.room.find(FIND_SOURCES)[0];
    }
};