(function (window, $) {



    var ui = {
        AC_MAX_LIST_COUNT: 5,
        AC_LIST_OFFSET: 30,
        AC_WRAPPER_OFFSET: 5,
        autoCompleteContainerClass: "autocomplete-container",
        autoCompleteListClass: "autocomplete-list",
        container: null, // main object
        isListOpening: false,

        createWrapper: function (autoComplete) {


            var wrapper = $.createElement({
                tagName: "ul",
                className: "tag",
                children: [
                    {
                        tagName: "li",
                        className: "tag-new"
                    }
                ]
            });


            $("body").append(wrapper);
            $('.tag-new').append(autoComplete);
            $(wrapper).mousedown(function (e) {

                
                autoComplete.el[0].focus();
                e.stopPropagation();
                e.preventDefault();

            })


        },
        createContainer: function (autoComplete) {

            ui.createWrapper(autoComplete);


            var el = $.createElement({
                tagName: "div",
                className: this.autoCompleteContainerClass,
            });

            this.container = $(el);

            $("body").append(this.container);

            return this.container;


        },
        createList: function (data) {

            var fragment = $(document.createDocumentFragment());
            var classname = this.autoCompleteListClass;
            $.each(data, function (item) {
                var child = $.createElement({
                    tagName: "div",
                    className: classname,
                    html: item,

                });

                fragment.append(child);
            });

            return fragment;

        },
        renderList: function (data) {

            var el = ui.createList(data);

            this.container.append(el);

            return this;

        },
        scrollToTop: function () {


            this.container.el[0].scrollTop = 0;

            return this;

        },

        emptyList: function () {
            this.container.empty();
            return this;

        },

        showContainer: function () {
            if (!this.isListOpening) {
                this.container.show();
            }
            this.isListOpening = true;
            return this;

        },

        hideContainer: function () {
            if (this.isListOpening) {
                this.container.hide();
            }
            this.isListOpening = false;
            return this;
        },

        repositionContainer: function (dom) {
            var rect = dom.getRect();
            var style = {
                top: parseInt(rect.top + rect.height + this.AC_WRAPPER_OFFSET, 10) + "px",
                left: parseInt(rect.left, 10) + "px"
            }
            this.container.css(style);
            return this;
        },
        createTag: function (value) {

            if (!this.isListOpening) {
                return;
            }


            var that = this;

            value = $.trim(value);

            if (value === '') {
                return false;
            }

            var el = $.createElement({
                tagName: "li",
                className: "tag-choice",
                children: [
                    {
                        tagName: "span",
                        className: "tag-label",
                        html: value
                    },
                    {
                        tagName: "a",
                        className: "tag-close",
                        children: [
                            {
                                tagName: "span",
                                className: "text-icon",
                                html: "×"
                            }
                        ]
                    }
                ]
            });


            $(el).mousedown(function (e) {

                this.remove();
                e.stopPropagation();
                e.preventDefault();

            })
            .insertBefore($(".tag-new"));


            if (this.isListOpening) {
                this.container.hide();

            }
            this.isListOpening = false;

        },
        moveSelector: function (direction) {

            var nodes = $.getBesideNode("." + this.autoCompleteListClass, "." + this.autoCompleteListClass + ".selected");

            if (nodes.prev && direction === "UP" || nodes.next && direction === "DOWN") {

                $("." + this.autoCompleteListClass).removeClass("selected");

                if (direction === "UP") {
                    $(nodes.prev).addClass("selected");
                }
                else {
                    $(nodes.next).addClass("selected");
                }

                this.scrollContainer(direction);
            }
        },
        scrollContainer: function (direction) {

            var $wrapper = $("." + this.autoCompleteContainerClass).el[0],
                $selectedListItem = $("." + this.autoCompleteListClass + ".selected").el[0];

            if ($selectedListItem.offsetTop >= $wrapper.scrollTop &&
                    $selectedListItem.offsetTop <= $wrapper.scrollTop + (this.AC_MAX_LIST_COUNT - 1) * this.AC_LIST_OFFSET) {
            }
            else {
                if (direction === "UP") {
                    $wrapper.scrollTop -= this.AC_LIST_OFFSET;
                }
                else {
                    $wrapper.scrollTop += this.AC_LIST_OFFSET;
                }
            }
        },

    }



    if (!window.complete) {
        window.complete = {};
    }
    window.complete.ui = ui;


}(window, window.utility));
