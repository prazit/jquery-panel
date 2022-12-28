Appanel({
    util: {

        defaults: {
            input: '<b><label class="text--c0">Please enter value:</label></b><br/>' +
                '<input type="text" class="padding--x5 text--c0 width--x300"/>',
            warn: {
                container: '<div class="message-container on-top-left css-trans layer-9"></div>',
                message: '<div class="warning-message hidden css-trans rounded--x10 margin--x10 padding--x10 background--c3 text--cred background--cyellow">' +
                    '    <h1 class="symbol sym-warning"> message-title</h1>' +
                    '    <p class="text--c0">message-text</p>' +
                    '</div>'
            },
            removeAfter: [
                /*0*/'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"' +
                '     viewBox="0 0 31.415926535897932384626433832795 2"' +
                '     class="circle-progress pull-right hidden"' +
                '     style="width:100%;"' +
                '     fill="transparent">' +
                '    <line x1="0" y1="1" x2="31.415926535897932384626433832795" y2="1"' +
                '            class="opacity--x30"' +
                '            stroke="silver"' +
                '            stroke-linecap="butt"' +
                '            stroke-opacity="1"' +
                '            stroke-width="0.2"' +
                '            stroke-dashoffset="0"' +
                '            stroke-dasharray="31.415926535897932384626433832795"/>' +
                '    <line x1="0" y1="1" x2="31.415926535897932384626433832795" y2="1"' +
                '            class="progress"' +
                '            stroke="red"' +
                '            stroke-linecap="butt"' +
                '            stroke-opacity="1"' +
                '            stroke-width="0.2"' +
                '            stroke-dashoffset="0"' +
                '            stroke-dasharray="31.415926535897932384626433832795"/>' +
                '</svg>',
                /*1*/'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"' +
                '     viewBox="0 0 12 12"' +
                '     class="circle-progress pull-right hidden"' +
                '     style="width:20px;transform:rotate(-90deg);"' +
                '     fill="transparent">' +
                '    <circle cx="6" cy="6" r="5"' +
                '            class="opacity--x30"' +
                '            stroke="silver"' +
                '            stroke-linecap="round"' +
                '            stroke-opacity="1"' +
                '            stroke-width="2"' +
                '            stroke-dashoffset="0"' +
                '            stroke-dasharray="31.415926535897932384626433832795"/>' +
                '    <circle cx="6" cy="6" r="5"' +
                '            class="progress"' +
                '            stroke="red"' +
                '            stroke-linecap="round"' +
                '            stroke-opacity="1"' +
                '            stroke-width="2"' +
                '            stroke-dashoffset="0"' +
                '            stroke-dasharray="31.415926535897932384626433832795"/>' +
                '</svg>'
            ],
            seeNMove: ''
        },

        input: function (title, label, defaultValue, handler, data) {
            var o = {
                title: 'Title',
                label: 'Label:',
                placeHolder: '',
                defaultValue: '',
                handler: function () {
                },
                data: {},
                panelSelector: '.input-panel',
                labelSelector: 'label',
                inputSelector: 'input'
            };

            if (typeof (title) !== 'string') {
                o = Object.assign(o, title);
            } else {
                // backward compatible
                o = Object.assign(o, {
                    title: title,
                    label: label,
                    defaultValue: defaultValue,
                    handler: handler
                });
                if (data !== undefined) o.data = data;
            }

            // show dialog with max-number-input
            var inputPanel = $(o.panelSelector);
            var dialogue = Appanel.selection('information', o.title, inputPanel.length === 0 ? this.defaults.input : inputPanel.html(), {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev) {
                    var $panel = $(ev.target),
                        $input = $panel.find(o.inputSelector);

                    $panel.find(o.labelSelector).text(o.label);
                    $panel.find(o.inputSelector).each(function (i, e) {
                        e.defaultValue = o.defaultValue;
                        $(e).attr('placeHolder', o.placeHolder);
                    });

                    $input.on('keyup keydown keypress', function (ev) {
                        ev.stopPropagation();
                    });
                    if ($input.length > 0) $input[0].select();
                    $input.focus();
                }],
                [dialogue, 'selection:closed', function (ev, button) {
                    if (button.button === 'OK') {
                        var $input = $(ev.target).find(o.inputSelector),
                            value = $input[0].value;
                        if ($input.attr('type').toLowerCase() === 'number') {
                            value = value.indexOf('.') > 0 ? parseFloat(value) : parseInt(value);
                        }
                        o.data.value = value;
                        o.handler(o.data, value);
                    }
                }, o]
            ]);
        },

        /**
         * Often Use
         *
         * :: clock-1.html ::
         * Appanel.util.seeNMove(Appanel.clock.backgroundAttributes,'member',['clockXInPercent','clockYInPercent','clockWInPercent','clockHInPercent','clockDegree'],0.001);
         * Appanel.util.seeNMove(Appanel.clock.backgroundAttributes,'member',['relativeX','relativeY'],1);
         * Appanel.util.seeNMove($('.cover'),'css',['left','top','width','height'],1);
         */
        seeNMove: function (selector, functionName, properties, step) {
            var inputPanel = $('.seenmove-panel'),
                target = typeof (selector) === 'string' ? $(selector) : selector,
                propertyHtml = inputPanel[0].innerHTML,
                html = '',
                x, unitX, num;

            if (step === undefined) step = 1;

            for (let i = 0; i < properties.length; i++) {
                x = target[functionName](properties[i]);
                num = parseFloat(x);
                unitX = (x + '').substr(num.toString().length);
                x = num;

                html += propertyHtml
                    .replace('property', 'property-' + properties[i])
                    .replace('property-label', properties[i])
                    .replace('property-value', x)
                    .replace('property-display', x)
                    .replace('property-step', step)
                    .replace('property-unit', unitX);
            }

            // show dialog with max-number-input
            var dialogue = Appanel.selection('information', 'See n Move', html, {buttons: ['Close']});

            Appanel.map([
                [dialogue, 'selection:open', function (ev) {
                    var panel = $(ev.target),
                        mapper = [],
                        property, inputX, firstInput, displayX,
                        keyupHandler = function (ev) {
                            var value = ev.currentTarget.value,
                                data = ev.data,
                                type = $(ev.currentTarget).attr('type').toLowerCase();
                            if (type === 'number') value = value.indexOf('.') > 0 ? parseFloat(value) : parseInt(value);
                            if (data.unit.trim() !== '') value += data.unit;
                            data.target[data.functionName](data.property, value);
                            data.display.text(data.target[data.functionName](data.property));
                        };

                    /*on keyup then set property*/
                    for (let i = 0; i < properties.length; i++) {
                        property = panel.find('.property-' + properties[i]);
                        inputX = property.find('.input');
                        if (i === 0) firstInput = inputX;
                        mapper.push([inputX, 'keyup', keyupHandler, {
                            target: target,
                            property: properties[i],
                            display: property.find('.display'),
                            functionName: functionName,
                            unit: property.find('.unit')[0].innerText
                        }]);
                    }
                    Appanel.map(mapper);

                    /*focus on first input*/
                    firstInput[0].select();
                    firstInput.focus();
                }]
            ]);
        },

        disableRefresh: false,

        refresh: function () {
            if (this.disableRefresh) {
                console.warn('Ignore refresh by disableRefresh is true.');
                return;
            }
            var src = window.top.location.href,
                lastIndex = src.indexOf("?");
            src = src.substr(0, lastIndex > 0 ? lastIndex : src.length) + '?refresh=' + (new Date()).toLocaleTimeString();
            window.top.location.href = src;
        },

        refreshAfter: function (seconds) {
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                Appanel.util.refresh();
            }, seconds * 1000);
        },

        removeAfter: function (seconds, $e, progressType) {
            var $progressBar = $('.circle-progress'),
                html = $progressBar.length === 0 ? this.defaults.removeAfter[progressType === undefined ? 0 : progressType] : $('.circle-progress')[0].outerHTML;
            $e.append(html.replace('hidden', ''));
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                $e.remove();
            }, seconds * 1000);
            Appanel.chains($e.find('.circle-progress > .progress'), 'ani-hide-circle-progress:' + seconds);
        },

        warn: function (title, text, seconds) {
            var $container = $('.message-container'),
                $message = $('.warning-message'),
                html = $message.length === 0 ? this.defaults.warn.message : $message[0].outerHTML;

            if ($container.length === 0) {
                $('body').append(this.defaults.warn.container);
                $container = $($container.selector);
            }

            $container.append(
                html
                    .replace('message-title', title)
                    .replace('message-text', text)
            );

            $message = $container.find('.warning-message')
                .removeClass('warning-message')
                .removeClass('hidden');

            this.removeAfter(seconds === undefined ? 6 : seconds, $message);
        },

        myURL: function () {
            var location = window.location;
            src = location.origin + location.pathname;
            src.indexOf('clock-1.html');
            return src.replace('.html', '');
        },

        compare: function (left, right, deep, rootName) {
            if (deep === undefined) deep = 0;
            else if (deep > focus) return;
            if (rootName === undefined) rootName = '';
            var print = true;
            for (let name in left) {
                if ($.isFunction(left[name]) && !$.isFunction(right[name])) {
                    if (print) console.warn(rootName + '.' + name + ': left is Function but right is ', typeof (right[name]));
                } else if (typeof (left[name]) === 'object') {
                    if (deep < focus) this.compare(left[name], right[name], deep + 1, rootName + '.' + name);
                } else if (left[name] !== right[name]) {
                    if (print) console.warn(rootName + '.' + name + ': left =', left[name], 'right =', right[name]);
                }
            }
            if (deep === 0) console.debug('comparation completed.')
        },

        clearSweep: function ($element, callback) {
            var e, $e, length = $element.length;
            if (length == 0) {
                console.warn('Ignore clearSweep with zero length');
                return;
            }

            for (let i = 0; i < $element.length; i++) {
                e = $element[i];
                delete e.sweepID;
                delete e.sweepContext;
                delete e.chainsID;
                $e = $(e)
                    .removeClass('ani-clock')
                    .removeClass('css-trans')
                    .css('transform', '')
                    .css('animation-duration', '')
                    .css('animation-iteration-count', '')
                    .css('animation-timing-function', '');
                Appanel.chains($e, 'ani-clock-reset:0.001');
            }

            if (callback !== undefined) Appanel.clock.setTimeout(function () {
                callback.call(Appanel.clock);
            }, 10);

            return this;
        }

    }
});