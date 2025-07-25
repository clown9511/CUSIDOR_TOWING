// Click to Chat - Share

/**
 * todo: remove gettings values from data attributes and using for most cases. 
 * will create variable.. ht_ctc_share_var like.. ht_ctc_share_var .. 
 */
(function ($) {

    // ready
    $(function () {

        var url = window.location.href;

        var is_mobile = 'no';
        var is_iphone = 'no';
        try {
            // Where user can install app. 
            // instead: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            if (typeof navigator.userAgent !== "undefined" && navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
                is_mobile = 'yes';
                console.log('User agent: is_mobile: ' + is_mobile);

                // if iphone
                if (navigator.userAgent.match(/iPhone/i)) {
                    is_iphone = 'yes';
                    console.log('User agent: is_iphone: ' + is_iphone);
                }

                // // if iphone chrome
                // if (navigator.userAgent.match(/CriOS/i)) {
                // }
                // // or
                // if (/iPhone/.test(navigator.userAgent) && /CriOS/.test(navigator.userAgent)) {
                // }
            }


        } catch (e) { }

        if ('no' == is_mobile) {
            // is_mobile yes/no,  desktop > 1025
            var is_mobile = (typeof screen.width !== "undefined" && screen.width > 1025) ? "no" : "yes";
            console.log('screen width: is_mobile: ' + is_mobile);
        }

        var post_title = (typeof document.title !== "undefined") ? document.title : '';

        var share = '';
        variable_ctc_share();

        /**
         * get ht_ctc_share_var and assing to ctc variable
         */
        function variable_ctc_share() {
            if (typeof ht_ctc_share_var !== "undefined") {
                share = ht_ctc_share_var;
                console.log('ht_ctc_share_var - share_var: ', share);
            }
        }

        function share_ht_ctc() {
            var ht_ctc_share = document.querySelector('.ht-ctc-share');
            if (ht_ctc_share) {
                share_display(ht_ctc_share);
                ht_ctc_share.addEventListener('click', function () {
                    ht_ctc_share_click(ht_ctc_share);
                });
            }

            // shortcode
            $(document).on('click', '.ht-ctc-sc-share', function () {

                data_link = this.getAttribute("data-ctc-link");
                data_link = encodeURI(data_link);
                window.open(data_link, '_blank', 'noopener');
                // analytics
                share_analytics(this);

            });

        }
        share_ht_ctc();

        // Hide based on device
        function share_display(p) {
            if (is_mobile == 'yes') {
                var display_mobile = p.getAttribute('data-display_mobile');
                if ('show' == display_mobile) {

                    // remove desktop style
                    var rm = document.querySelector('.ht_ctc_desktop_share');
                    (rm) ? rm.remove() : '';

                    var css = p.getAttribute('data-css');
                    var position_mobile = p.getAttribute('data-position_mobile');
                    p.style.cssText = position_mobile + css;
                    display(p)
                }
            } else {
                var display_desktop = p.getAttribute('data-display_desktop');
                if ('show' == display_desktop) {

                    // remove mobile style
                    var rm = document.querySelector('.ht_ctc_mobile_share');
                    (rm) ? rm.remove() : '';

                    var css = p.getAttribute('data-css');
                    var position = p.getAttribute('data-position');
                    p.style.cssText = position + css;
                    display(p)
                }
            }
        }

        function display(p) {
            // p.style.display = "block";
            try {
                var dt = parseInt(p.getAttribute('data-show_effect'));
                $(p).show(dt);
            } catch (e) {
                p.style.display = "block";
            }

            // hover effect
            ht_ctc_share_things(p);
        }

        function ht_ctc_share_things(p) {

            // animations
            var animateclass = p.getAttribute('data-an_type')
            var an_time = ($(p).hasClass('ht_ctc_entry_animation')) ? 1200 : 120;

            setTimeout(function () {
                p.classList.add('ht_ctc_animation', animateclass);
            }, an_time);

            // hover effects
            $(".ht-ctc-share").hover(function () {
                $('.ht-ctc-share .ht-ctc-cta-hover').show(220);
            }, function () {
                $('.ht-ctc-share .ht-ctc-cta-hover').hide(100);
            });
        }


        // floating style - click
        function ht_ctc_share_click(values) {
            // link
            share_link(values);
            // analytics
            share_analytics(values)
        }

        // analytics 
        function share_analytics(values) {

            console.log('share analytics');

            var id = values.getAttribute('data-share_text');

            // Google Analytics
            var ga_category = 'Click to Chat for WhatsApp';
            var ga_action = 'share: ' + id;
            var ga_label = post_title + ', ' + url;

            // if ga_enabled
            if ('yes' == values.getAttribute('data-is_ga_enable')) {
                console.log('google analytics');
                if (typeof gtag !== "undefined") {
                    console.log('gtag');
                    gtag('event', ga_action, {
                        'event_category': ga_category,
                        'event_label': ga_label,
                    });
                } else if (typeof ga !== "undefined" && typeof ga.getAll !== "undefined") {
                    console.log('ga');
                    var tracker = ga.getAll();
                    tracker[0].send("event", ga_category, ga_action, ga_label);
                    // ga('send', 'event', ga_category, ga_action, ga_label);
                } else if (typeof __gaTracker !== "undefined") {
                    console.log('__gaTracker');
                    __gaTracker('send', 'event', ga_category, ga_action, ga_label);
                }
            }

            // dataLayer
            if (typeof dataLayer !== "undefined") {
                console.log('dataLayer');
                dataLayer.push({
                    'event': 'Click to Chat',
                    'event_category': ga_category,
                    'event_label': ga_label,
                    'event_action': ga_action
                });
            }

            // google ads - call conversation code
            if ('yes' == values.getAttribute('data-ga_ads')) {
                console.log('google ads enabled');
                if (typeof gtag_report_conversion !== "undefined") {
                    console.log('calling gtag_report_conversion');
                    gtag_report_conversion();
                }
            }

            // FB Pixel
            if ('yes' == values.getAttribute('data-is_fb_pixel')) {
                console.log('fb pixel');
                if (typeof fbq !== "undefined") {
                    fbq('trackCustom', 'Click to Chat by HoliThemes', {
                        'Category': 'Click to Chat for WhatsApp',
                        'return_type': 'share',
                        'ID': id,
                        'Title': post_title,
                        'URL': url
                    });
                }
            }

        }

        // link share
        function share_link(values) {

            var share_text = values.getAttribute('data-share_text');
            var webandapi = values.getAttribute('data-webandapi');
            // web/api.whatsapp or api.whatsapp
            var share_nav = "api";
            if ('webapi' == webandapi) {
                share_nav = (is_mobile == 'yes') ? "api" : "web";
            }
            var base_link = 'https://' + share_nav + '.whatsapp.com/send';

            var target = '_blank';

            // if its an iphone, then target is _self
            if (is_iphone == 'yes') {
                target = '_self';
            }

            console.log('base_link: ', base_link);
            console.log('share_text: ', share_text);
            console.log('target: ', target);

            window.open(base_link + '?text=' + share_text, target, 'noopener');
        }

    });

})(jQuery);