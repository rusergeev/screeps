module.exports = {

    isFriend: function (creep) {
        //console.log('isFiriend', creep, creep.owner.username);
        return false;
        return creep.owner.username === 'maxibra' && creep.getActiveBodyparts(ATTACK) === 0 && creep.getActiveBodyparts(RANGED_ATTACK) === 0;
    }

}