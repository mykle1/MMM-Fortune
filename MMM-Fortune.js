/* Magic Mirror
 * Module: MMM-Fortune
 *
 * By Mykle1
 * 
 */
Module.register("MMM-Fortune", {

    // Module config defaults.
    defaults: {
        mode: "Natural", // Natural, Enhanced, Lunar, naturalThumb, enhancedThumb
        updateInterval: 30 * 60 * 1000, // 30 minutes - Don't change!
        animationSpeed: 3000,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        useHeader: false,
        header: "********Please set header txt in config.js***** see README",
        maxWidth: "50%", // Should be the same as MaxHeight
        maxHeight: "50%", // Should be the same as MaxWidth
        rotateInterval: 10 * 1000,

    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.today = "";
        this.fortune = [];
		this.url = "http://fortunecookieapi.herokuapp.com/v1/cookie?fortuneId=&lottoId=&lessonId=&limit=";
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {
		
		var fortune = this.fortune;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
		wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Reading your fortune...";
            wrapper.className = "bright light small";
            return wrapper;
        }
		if (this.config.header != "") {
               var header = document.createElement("header");
               header.className = "header";
               header.innerHTML = this.config.header;
               wrapper.appendChild(header);
        }

		var top = document.createElement("div");
           top.classList.add("content");
		   
		var fortuneLogo = document.createElement("div");
           var fortuneIcon = document.createElement("img");
           fortuneIcon.src = fortune.strDrinkThumb;
           fortuneIcon.classList.add("imgDes");
           fortuneLogo.appendChild(fortuneIcon);
           top.appendChild(fortuneLogo);

		   var title = document.createElement("h3");
           title.classList.add("small");
           if (fortune.message === " ") {
               title.innerHTML = fortune.message + " YES ";
           } else {
               title.innerHTML = fortune.id + "  YEAH  "; // fortune.id undefined
           }
           top.appendChild(title);
		
        console.log("error6");
		   

           var des = document.createElement("p");
           des.classList.add("xsmall", "bright");
           des.innerHTML = fortune.message + " " + fortune.english + " - " + fortune.chinese + " " + fortune.pronunciation;
           top.appendChild(des); // message, english, chinese, pronunciation undefined
console.log("error7");
           wrapper.appendChild(top);

console.log("error8");
		  
		  return wrapper;

        },
        
    processFortune: function(data) {
        this.today = data.Today;
        this.fortune = data;
        this.loaded = true;
    },

	
    scheduleUpdate: function() {
        setInterval(() => {
            this.getFortune();
        }, this.config.updateInterval);
        this.getFortune(this.config.initialLoadDelay);
     //   var self = this;
    },


    getFortune: function() {
        this.sendSocketNotification('GET_FORTUNE', this.url);
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === "FORTUNE_RESULTS") {
            this.processFortune(payload);
			this.updateDom(this.config.fadeSpeed);
        }

        this.updateDom(this.config.initialLoadDelay);
    },

});