/*jslint sub:true,laxbreak:true*/
/*globals window,jQuery*/
/***
 *      Author: KodingSykosis
 *        Date: 01/06/2014
 *     Version: 1.0.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This widget extends an input field to provided a multiselect
 *              field.
 *
 *        Name: kodingsykosis.Tags
 *
 *    Requires: jQueryUI 1.8.2 or better
 ***/

(function ($) {
    //Old IE Hacks
    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop == 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            };
            return this;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    
    //http://darcyclarke.me/development/detect-attribute-changes-with-jquery
    //http://jsfiddle.net/kodingsykosis/k3Q72/
    if (typeof $.fn.watch === 'undefined')
    $.fn.watch = function (props, callback) {
        return this.each(function () {
            var elem = $(this),
                prop = (elem.data('watching') || []).concat(props.split(' '));

            elem.data('watching', prop);
            elem.on('mutation DOMAttrModified propertychange', function (e) {
                var propName = e.attributeName || e.originalEvent.propertyName;
                var _props = $(this).data('watching');
                if (_props.indexOf(propName) > -1) {
                    callback.apply(this, arguments);
                }
            });

            //Stupid IE8 and it's undefined error shit
            var mutationObserver = (typeof WebKitMutationObserver === 'undefined'
                                    ? (typeof MutationObserver === 'undefined'
                                       ? undefined
                                       : MutationObserver)
                                    : WebKitMutationObserver);

            //Support MutationObservers
            if (typeof mutationObserver !== 'undefined') {
                var observer = new mutationObserver(function (mutations) {
                    mutations.forEach(function (e) {
                        var evt = $.Event('mutation', e);
                        evt.type = 'mutation';
                        $(e.target).triggerHandler(evt);
                    });
                });

                observer.observe(this, { 
                    attributes: true, 
                    attributeOldValue: true, 
                    subtree: false,
                    characterData: true,
                    attributeFilter: prop
                });
            }
        });
    };
    
    //FixMe: http://bugs.jqueryui.com/ticket/8932
    var orgHeight = $.fn.height;
    $.fn.height = function (height) {
        if (!height || this.css('box-sizing') !== 'border-box') {
            return orgHeight.apply(this, arguments);
        }

        var paddingTop = this.css('padding-top'),
            paddingBottom = this.css('padding-bottom'),
            paddingVert = parseFloat(paddingTop || 0) + parseFloat(paddingBottom || 0);

        return orgHeight.call(this, height - paddingVert);
    };
    
    
    $.widget("kodingsykosis.tags", {
        options: {
            delimiter: ','
        },

        // Set up the widget
        _create: function () {
            var self = this;
            this.wrap = $('<div>', {
                'class': 'ui-tags-wrap'
            });
            
            this.element
                .addClass('ui-tags-source')
                .hide();

            var style = window.getComputedStyle(this.element[0]);
            this.wrap
                .css({
                    width: style.width,
                    height: style.height,
                    float: style.float,
                    position: style.position,
                    top: style.top,
                    left: style.left,
                    right: style.right,
                    bottom: style.bottom,
                    lineHeight: style.lineHeight,
                    fontSize: style.fontSize
                });

            this.element
                .watch('disabled', $.proxy(this._onDisabledChanged, this))
                .wrap(this.wrap);

            this.wrap =
                this.element
                    .parent();
                    
            var tags = 
                (this.element
                     .val() || '').split(this.options['delimiter'])
                     
            this.tags = $('<ul>', {
                'class': 'ui-tags'
            });
        },
        
        _init: function () {

        },
        
        _destroy: function () {
            
        },
        
        import: function(tags) {
            
        }
		
    });
})(jQuery);