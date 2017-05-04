   /* Magic Mirror
    * Module: MMM-Fortune
    *
    * By Mykle1
    * 
    */
   Module.register("MMM-Fortune", {

       // Module config defaults.
       defaults: {
           updateInterval: 60 * 60 * 1000, // every hour
           fadeSpeed: 3000,
           initialLoadDelay: 1250, // ms seconds delay
           retryDelay: 2500,
           header: "Opening your fortune cookie!",
           maxWidth: "400px",
       },

       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },

       getStyles: function() {
           return ["MMM-Fortune.css", "font-awesome.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);

           // Set locale.
           moment.locale(config.language);

           this.today = "";
           this.fortune = [];
           this.url = "http://fortunecookieapi.herokuapp.com/v1/cookie?fortuneId=&lottoId=&lessonId=&limit=";
           this.scheduleUpdate();
       },

       getDom: function() {

           var fortune = this.fortune;
           var lesson = this.lesson;
           var lotto = this.lotto;


           var wrapper = document.createElement("div");
           wrapper.className = "wrapper";
           wrapper.style.maxWidth = this.config.maxWidth;


           if (!this.loaded) {
               wrapper.innerHTML = "Telling your fortune...";
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


           var title = document.createElement("h3");
           title.classList.add("small");
           title.innerHTML = this.fortune.message; // <- Objects goes in there 
           top.appendChild(title);


           var des = document.createElement("p");
           des.classList.add("xsmall", "bright");
           des.innerHTML = 'English phrase:  ' + '&nbsp; ' + lesson.english + '&nbsp; ' + '&nbsp; ' + 'In Chinese:  ' + '&nbsp; ' + lesson.chinese + '&nbsp; ' + '&nbsp; ' + '  Pronounced:  ' + lesson.pronunciation; // <- Objects goes in there
           top.appendChild(des);


           var des2 = document.createElement("p");
           des2.classList.add("xsmall", "bright");
           var numbers = lotto.numbers.sort(function(a, b) {
               return a - b
           });
           var lotNumbers = numbers;
           var showNumbers = lotNumbers.join(', ');
           des2.innerHTML = "Lucky Numbers ~ " + showNumbers;
           top.appendChild(des2);

           wrapper.appendChild(top);
           return wrapper;

       },

       processFortune: function(data) {
           //	console.log(data);
           //this.today = data.Today;
           this.fortune = data.fortune;
           this.lesson = data.lesson;
           this.lotto = data.lotto;
           this.loaded = true;
       },

       scheduleUpdate: function() {
           setInterval(() => {
               this.getFortune();
           }, this.config.updateInterval);

           this.getFortune(this.config.initialLoadDelay);
       },


       getFortune: function() {
           this.sendSocketNotification('GET_FORTUNE', this.url);
       },

       socketNotificationReceived: function(notification, payload) {
           if (notification === "FORTUNE_RESULT") {
               this.processFortune(payload);
               this.updateDom(this.config.fadeSpeed);
           }
           this.updateDom(this.config.initialLoadDelay);
       },

   });