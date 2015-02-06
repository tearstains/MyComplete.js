(function () {


    var $ = function (obj) {
        return new MyQuery(obj);
    };

    var MyQuery = function (obj) {

        if (this === window) {
            return new MyQuery(obj);
        }

        if (typeof obj === "string") {
            this.el = document.querySelectorAll(obj);
        }
        else {
            this.el = [obj];
        }

        return this;
    };


    MyQuery.prototype.append = function (htmlNode) {

        if (typeof htmlNode.nodeType !== "undefined" && htmlNode.nodeType === 1) {
            this.el[0].appendChild(htmlNode);
        } else if (htmlNode instanceof MyQuery) {
            this.el[0].appendChild(htmlNode.el[0]);
        } else {
            throw { message: "Invalid argument" };

        }
        return this;
    }

    MyQuery.prototype.insertBefore = function (MyQueryObject) {


        var parent = MyQueryObject.el[0].parentNode;

        parent.insertBefore(this.el[0], MyQueryObject.el[0]);


        return this;
    }



    MyQuery.prototype.isNotExist = function () {

        return this.el.length === 0;
    }


    MyQuery.prototype.isExist = function () {

        return this.el.length > 0;

    }



    MyQuery.prototype.html = function (html) {
        if (typeof html !== "undefined") {
            this.el[0].innerHTML = html;

            return this;
        } else {
            return this.el[0].innerHTML;
        }
    };

    MyQuery.prototype.val = function (input) {
        if (typeof input !== "undefined") {
            this.el[0].value = input;;

            return this;
        } else {
            return this.el[0].value;
        }
    };



    MyQuery.prototype.getRect = function () {

        return this.el[0].getBoundingClientRect();
    }

    MyQuery.prototype.css = function (style) {

        $.each(this.el, function (item) {

            for (var k in style) {
                if (style.hasOwnProperty(k)) {
                    item.style[k] = style[k];
                }
            }
        });


        return this;
    }

    MyQuery.prototype.remove = function () {

        var $wrapper = this.el[0];

        //remove event hacks
        var elClone = $wrapper.cloneNode(true);
        $wrapper.parentNode.replaceChild(elClone, $wrapper);

        elClone.parentNode.removeChild(elClone);

        return this;

    }

    MyQuery.prototype.empty = function () {

        var $wrapper = this.el[0];

        while ($wrapper.firstChild) {
            var node = $wrapper.firstChild;

            var elClone = node.cloneNode(true);
            node.parentNode.replaceChild(elClone, node);
            elClone.parentNode.removeChild(elClone);

        }

        return this;

    }



    MyQuery.prototype.on = function (eventName, callback) {

        $.each(this.el, function (item) {
            item.addEventListener(eventName, callback, false);

        });
        return this;

    }

    MyQuery.prototype.mouseover = function (fn) {
        var that = this;

        that.on("mouseover", function (e) {
            fn.call(that, e);
        });

        return this;
    };

    MyQuery.prototype.mousedown = function (fn) {
        var that = this;

        that.on("mousedown", function (e) {
            fn.call(that, e);
        });

        return this;
    };
    MyQuery.prototype.focus = function (fn) {
        var that = this;

        that.on("focus", function (e) {
            fn.call(that, e);
        });

        return this;
    };
    MyQuery.prototype.blur = function (fn) {
        var that = this;

        that.on("blur", function (e) {
            fn.call(that, e);
        });

        return this;
    };
    MyQuery.prototype.keydown = function (fn) {
        var that = this;

        that.on("keydown", function (e) {
            fn.call(that, e);
        });

        return this;
    };


    MyQuery.prototype.removeClass = function (className) {

        $.each(this.el, function (item) {
            if ($(item).hasClass(className)) {

                var regex = new RegExp("\\s*" + className + "\\s*", "g"),
                    newClassName = item.className.replace(regex, " ");

                item.className = newClassName;
            }
        });
        return this;
    }

    MyQuery.prototype.hasClass = function (className) {

        return (" " + this.el[0].className + " ").indexOf(" " + className + " ") > -1;

    };

    MyQuery.prototype.addClass = function (className) {

        $.each(this.el, function (item) {
            if (!$(item).hasClass(className)) {
                item.className += " " + className;
            }
        });

        return this;

    };

    MyQuery.prototype.hide = function () {

        this.el[0].style.display = "none";

        return this;

    };

    MyQuery.prototype.show = function () {

        this.el[0].style.display = "block";

        return this;

    };

    $.createElement = function (obj) {
        if (!obj || !obj.tagName) {
            throw { message: "Invalid argument" };
        }

        var el = document.createElement(obj.tagName);
        obj.id && (el.id = obj.id);
        obj.className && (el.className = obj.className);
        obj.html && (el.innerHTML = obj.html);

        if (typeof obj.attributes !== "undefined") {
            var attr = obj.attributes,
                prop;

            for (prop in attr) {
                if (attr.hasOwnProperty(prop)) {
                    el.setAttribute(prop, attr[prop]);
                }
            }
        }

        if (typeof obj.children !== "undefined") {
            var child,
                i = 0;

            while (child = obj.children[i++]) {
                el.appendChild(this.createElement(child));
            }
        }

        return el;
    };


    $.getBesideNode = function (elementSet, target) {

        var group = $(elementSet);
        var target = $(target);

        var i = Array.prototype.indexOf.call(group.el, target.el[0]);

        var nextNode = null,
            prevNode = null;

        if (typeof group.el[i + 1] !== "undefined") {
            nextNode = group.el[i + 1];
        }
        if (typeof group.el[i - 1] !== "undefined") {
            prevNode = group.el[i - 1];
        }

        return {
            next: nextNode,
            prev: prevNode
        };
    };


    $.map = function (array, mapping) {
        array = array || [];
        var result = [];
        for (var i = 0, j = array.length; i < j; i++)
            result.push(mapping(array[i]));
        return result;
    },

    $.extend = function (target) {
        if (!arguments[1]) {
            return;
        }

        for (var i = 1, l = arguments.length; i < l; i++) {
            var source = arguments[i];

            for (var pop in source) {
                if (!target[prop] && source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
    }


    $.stringIsNullOrEmpty = function (string) {
        return (typeof string === 'undefined' || string === null || string == '');
    }

    $.trim = function (userInput) {
        return userInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };


    $.each = function (array, action) {
        for (var i = 0, j = array.length; i < j; i++) {
            action(array[i]);
        }
    };

    $.grep = function (array, predicate) {
        array = array || [];
        var result = [];
        for (var i = 0, j = array.length; i < j; i++) {
            if (predicate(array[i])) {
                result.push(array[i]);
            }
        }
        return result;
    };

    $.get = function (url, callback) {
        var xhr;

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        }
        else {
            // code for IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //handle async=true
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        }

        xhr.open("GET", url, true);
        xhr.send("");
    };

    if (!window.utility) {
        window.utility = {};
    }

    window.utility = $;

}());
