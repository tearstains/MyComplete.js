(function (window, keyMap, $, ui) {


    var s;
    var myCompleteProto;
    var myComplete = function (element, options) {

        options = options || {};

        this.autoComplete = $(element);
        this.minLength = options.minLength || 1;
        this.dataSet = options.data || null;
        this.dataSource = options.request || "data/complete.json";
        this.delayTimer = null;
        this.onInputDelay = options.delay || 10;
        this.container = ui.createContainer(this.autoComplete);
        this.autoCompleteListClass = "autocomplete-list"
        this.matchedData = [];
        this.matchValue = "";
        this.lastValue = "";

        this.init();
    };

    myCompleteProto = myComplete.prototype;


    myCompleteProto.init = function () {
        s = this;
        // get data 
        s.getData(function () {

            // create behaviors
            s.container
                .mousedown(s.selectValue)
                .mouseover(s.highlightValue)
                .hide();


            s.autoComplete
                .keydown(s.performKeyAction)
                .focus(function (e) {
                    if (s.isMatched()) {

                        ui.repositionContainer(s.autoComplete)
                            .showContainer();
                    }
                })
                .blur(function (e) {
                    ui.hideContainer();
                });



        });
    };

    myCompleteProto.highlightValue = function (event) {
        $("." + s.autoCompleteListClass).removeClass("selected");


        s.matchValue = $(event.target).addClass("selected").html();

    };

    myCompleteProto.selectValue = function (event) {

        if ($("." + s.autoCompleteListClass + ".selected").isNotExist()) {
            return;
        }

        var matchValue = $("." + s.autoCompleteListClass + ".selected").html()
        ui.createTag(matchValue);
        s.clearValues();

    };
    myCompleteProto.clearValues = function () {
        s.autoComplete.val("");
        s.matchedData = []; // reset

    };
    myCompleteProto.performKeyAction = function (event) {
        if (keyMap[event.which] === "ENTER") {

            s.selectValue(event);
            event.stopPropagation();
            event.preventDefault();
        }
        else if (keyMap[event.which] === "UP") {
            ui.moveSelector("UP");
            event.stopPropagation();
            event.preventDefault();
        }
        else if (keyMap[event.which] === "DOWN") {
            ui.moveSelector("DOWN");
            event.stopPropagation();
            event.preventDefault();
        }
        else if (keyMap[event.which] === "ESC") {
            ui.hideContainer();
            event.stopPropagation();
            event.preventDefault();
        }
        else {

            s.delayTimer = (s.delayTimer) ? window.clearTimeout(s.delayTimer) : null;
            s.delayTimer = window.setTimeout(function () {

                var userInput = $.trim(s.autoComplete.val());

                s.matchedData = s.query(userInput);

                //todo : cache the result
                //if (s.lastValue === userInput && s.isMatched()) {
                //    console.log('same');
                //    ui.showContainer();
                //}

                if (userInput.length >= s.minLength && s.isMatched()) {

                    ui.emptyList()
                      .renderList(s.matchedData)
                      .repositionContainer(s.autoComplete)
                      .showContainer()
                      .scrollToTop();

                    s.lastValue = userInput;

                }
                else {
                    ui.hideContainer();
                }

            }, s.onInputDelay);
        }
    };





    myCompleteProto.getData = function (callback) {

        if (s.dataSet === null) {
            $.get(s.dataSource, function (data) {
                var parsedData = JSON.parse(data);
                s.dataSet = parsedData["dataSet"];

                callback.call(s);
            });
        }
        else {
            callback.call(s);
        }
    };



    myCompleteProto.query = function (userInput) {
        if (userInput.length === 0) {
            return [];
        }
        var regex = new RegExp("^" + userInput, "i");

        return $.grep(s.dataSet, function (item) {
            return regex.test(item);
        });
    };



    myCompleteProto.isMatched = function () {
        return (s.matchedData.length > 0);
    };



    window.myComplete = myComplete;
}(window, window.keyMap, window.utility, window.complete.ui));
