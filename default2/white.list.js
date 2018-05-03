module.exports = {

    isFriend: function (creep) {
        //console.log('isFiriend', creep, creep.owner.username);
        return creep.owner.username === 'maxibra' && creep.getActiveBodyparts(ATTACK) === 0 && creep.getActiveBodyparts(RANGED_ATTACK) === 0;
    }

}