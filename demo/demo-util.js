Appanel({
    util: {

        defaults: {
            input: '<b><label class="text--c0">Please enter value:</label></b><br/>' +
                '<input type="text" class="padding--x5 text--c0 width--x300"/>',
            warn: {
                container: '<div class="message-container on-top-left css-trans"></div>',
                message: '<div class="warning-message hidden css-trans rounded--x10 margin--x10 padding--x10 background--c3 text--cred background--cyellow">' +
                    '    <h1 class="symbol sym-warning"> message-title</h1>' +
                    '    <p class="text--c0">message-text</p>' +
                    '</div>'
            },
            removeAfter: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"' +
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
                '</svg>'
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
                    handler: handler,
                    data: data
                });
            }

            // show dialog with max-number-input
            var inputPanel = $(o.panelSelector);
            var dialogue = Appanel.selection('information', o.title, inputPanel.length === 0 ? this.defaults.input : inputPanel.html(), {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev, button) {
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
                    //var o = ev.data;
                    if (button.button === 'OK') {
                        o.data.value = $(ev.target).find(o.inputSelector)[0].value;
                        o.handler(o.data, o.data.value);
                    }
                }, o]
            ]);
        },

        seeNMove: function (selector, functionName, propertyX, propertyY, step) {
            var inputPanel = $('.seenmove-panel'),
                target = typeof (selector) === 'string' ? $(selector) : selector,
                x = target[functionName](propertyX),
                y = target[functionName](propertyY),
                num;

            num = parseFloat(x);
            unitX = (x + '').substr(num.toString().length);
            x = num;

            num = parseFloat(y);
            unitY = (y + '').substr(num.toString().length);
            y = num;

            inputPanel.find('.label-x').text(propertyX + ':');
            inputPanel.find('.label-y').text(propertyY + ':');

            inputPanel.find('.unit-x').text(unitX);
            inputPanel.find('.unit-y').text(unitY);

            if (step !== undefined) {
                inputPanel.find('.input-x').attr('step', step);
                inputPanel.find('.input-y').attr('step', step);
            }

            // show dialog with max-number-input
            var dialogue = Appanel.selection('information', 'See n Move', inputPanel[0].innerHTML, {buttons: ['Close']});

            Appanel.map([
                [dialogue, 'selection:open', function (ev) {
                    var panel = $(ev.target),
                        inputX = panel.find('.input-x'),
                        inputY = panel.find('.input-y'),
                        displayX = panel.find('.display-x'),
                        displayY = panel.find('.display-y'),
                        data = ev.data;

                    /*on keyup then set property*/
                    Appanel.map([
                        [inputX, 'keyup', function (ev) {
                            var value = ev.currentTarget.value,
                                data = ev.data;
                            data.target[data.functionName](data.property, value + data.unit);
                            data.display.text(data.target[data.functionName](data.property));
                        }, {target: ev.data.target, property: data.propertyX, display: displayX, functionName: data.functionName, unit: data.unitX}],
                        [inputY, 'keyup', function (ev) {
                            var value = ev.currentTarget.value,
                                data = ev.data;
                            data.target[data.functionName](data.property, value + data.unit);
                            data.display.text(data.target[data.functionName](data.property));
                        }, {target: ev.data.target, property: data.propertyY, display: displayY, functionName: data.functionName, unit: data.unitY}]
                    ]);

                    inputX[0].value = parseFloat(data.target[data.functionName](data.propertyX));
                    inputY[0].value = parseFloat(data.target[data.functionName](data.propertyY));

                    displayX.text(inputX[0].value);
                    displayY.text(inputY[0].value);

                    inputX[0].select();
                    inputX.focus();
                }, {target: target, propertyX: propertyX, propertyY: propertyY, functionName: functionName, unitX: unitX, unitY: unitY}]
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

        removeAfter: function (seconds, $e) {
            var $progressBar = $('.circle-progress'),
                html = $progressBar.length === 0 ? this.defaults.removeAfter : $('.circle-progress')[0].outerHTML;
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