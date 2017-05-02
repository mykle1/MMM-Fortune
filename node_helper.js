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
            timestamp: null,
            data: null
        };
        this.path = "modules/MMM-Fortune/fortune.json";
        if (fs.existsSync(this.path)) {
            var temp = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (temp.timestamp === this.getDate()) {
                this.fortune = temp;
            }
            //console.log(temp);
        }

    },

    getFortune: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).fortune[0];
				console.log(result);
                this.sendSocketNotification('FORTUNE_RESULT', result);
                this.fortune.timestamp = this.getDate();
                this.fortune.data = result;
                this.fileWrite();
            }
        });
    },

    fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.fortune), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The Fortune file was saved!");
        });
    },

    getDate: function() {
        return (new Date()).toLocaleDateString();
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_FORTUNE') {
            if (this.fortune.timestamp === this.getDate() && this.fortune.data !== null) {
                this.sendSocketNotification('FORTUNE_RESULT', this.fortune.data);
            } else {
                this.getFortune(payload);
            }
        }
    }

});