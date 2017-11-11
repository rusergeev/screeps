'use strict';

let roles = {
    contractor: require('role.tech.contractor'),
    company: require('role.tech.company'),
    industry: require('role.tech.industry')
};

module.exports = {
    /** @param {StructureController} controller **/
    run: function(controller) {
        console.log('controller ', controller);


    }
};