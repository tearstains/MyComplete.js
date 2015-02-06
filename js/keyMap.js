(function() {

    var keyMap = {
        "13" : "ENTER",
        "27" : "ESC",
        "32" : "SPACE",
        "37" : "LEFT",
        "38" : "UP",
        "39" : "RIGHT",
        "40" : "DOWN"
    };

    if (!window.keyMap) {
        window.keyMap = {};
    }

    window.keyMap = keyMap;

}());
