/* Magic Mirror
 * Module: MMM-Fortune
 *
 * By Mykle1
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {},

    getFortune: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body)[0];
                this.sendSocketNotification('FORTUNE_RESULT', result);
            }
        });
    },


    getDate: function() {
        return (new Date()).toLocaleDateString();
    },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_FORTUNE') {
            this.getFortune(payload);
        }
    }

});
