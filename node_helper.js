/* Magic Mirror
    * Module: MMM-Fortune
    *
    * By Mykle1
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const fs = require('fs');

module.exports = NodeHelper.create({

    start: function() {
        this.fortune = {
            data: null
			
        };
    },

    getFortune: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).fortune;
				console.log(result);
                this.sendSocketNotification('FORTUNE_RESULT', result);                
                this.fortune.data = result;
                
            }
        });
    },

    
    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_FORTUNE') {
            if (this.fortune.data !== null) {
                this.sendSocketNotification('FORTUNE_RESULT', this.fortune.data);
            } else {
                this.getFortune(payload);
            }
        }
    }

});