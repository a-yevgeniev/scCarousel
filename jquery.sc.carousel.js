(function ($) {
    var options;

    var methods = {
        init: function (params) {
            var $this = $(this),
                thumbList = $this.find('ul'),
                count = thumbList.children().length,
                current,
                nextBtn = $this.find('.btn-next-img'),
                prevBtn = $this.find('.btn-prev-img'),
                data = $this.data('scCarousel');

            var defaults = { count: count };
            options = $.extend({}, defaults, params);

            var getSizes = function () {
                var _width = thumbList.children().eq(0).width(),
                    PADDING_WIDTH = 100;

                return {
                    thumbWidth: _width,
                    visibleCount: options.visibleCount ? options.visibleCount : Math.floor(($this.width() - PADDING_WIDTH) / _width)
                };
            };

            var updNavBtns = function () {
                prevBtn.toggleClass('disabled', !(current > 0));
                nextBtn.toggleClass('disabled', !(current < options.count - 1));
            };

            var manipulate = function (doCentering, setCurrent, doAnimation) {
                var sizes = getSizes();
                if (doCentering) {
                    $('.carousel-centering').width(Math.min(options.count, sizes.visibleCount) * sizes.thumbWidth);
                };

                if (setCurrent) {
                    $this.scCarousel('setCurrentId', current);
                    thumbList.children().removeClass('selected').eq(current).addClass('selected');
                    updNavBtns();
                };

                if (doAnimation) {
                    var shift = Math.min(Math.max(current - 1, 0), Math.max(options.count - sizes.visibleCount, 0)) * sizes.thumbWidth;
                    $this.trigger('scCarousel.onBeforeAnimation');
                    thumbList.parent().animate({ left: -shift + 'px' }, function () {
                        $this.trigger('scCarousel.onAfterAnimation');
                    });
                };
            };

            var bindEvents = function () {
                if (data) {
                    return;
                };

                nextBtn.click(function () {
                    if (current < options.count - 1) {
                        current++;
                        manipulate(false, true, true);
                    }
                });
                prevBtn.click(function () {
                    if (current > 0) {
                        current--;
                        manipulate(false, true, true);
                    }
                });
                thumbList.find('a').each(function (i) {
                    $(this).click(function () {
                        if (current != i) {
                            current = i;
                            manipulate(false, true, true);
                        };
                        return false;
                    });
                });

                $(window).resize(_.debounce(function () {
                    manipulate(true, false, true);
                }, 250));
            };

            current = data ? data.current : 0;
            bindEvents();
            manipulate(true, true, false);

            return this;
        },
        goTo: function (index) {
            $(this).find('.hyp-thumbnail').eq(index).click();
        },
        setCurrentId: function (id) {
            $(this).data('scCarousel', { current: id });
        },
        getCurrentId: function () {
            var _data = $(this).data('scCarousel'),
                _id = _data ? _data.current : -1;

            return _id;
        }
    };

    $.fn.scCarousel = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };

})(jQuery);