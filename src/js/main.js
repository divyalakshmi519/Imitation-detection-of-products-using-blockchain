(function($) {
    "use strict";

    // Use "mouseenter" and "mouseleave" for better hover handling
    $('nav .dropdown').on('mouseenter', function() {
        var $this = $(this);
        $this.addClass('show');
        $this.find('> a').attr('aria-expanded', true);
        $this.find('.dropdown-menu').addClass('show');
    }).on('mouseleave', function() {
        var $this = $(this);
        $this.removeClass('show');
        $this.find('> a').attr('aria-expanded', false);
        $this.find('.dropdown-menu').removeClass('show');
    });

})(jQuery);
