Appanel({
    util: {
        disableRefresh: false,

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

            var inputPanel = $(o.panelSelector);
            inputPanel.find(o.labelSelector).text(o.label);
            inputPanel.find(o.inputSelector).each(function (i, e) {
                e.defaultValue = o.defaultValue;
                $(e).attr('placeHolder', o.placeHolder);
            });

            // show dialog with max-number-input
            var dialogue = Appanel.selection('information', o.title, inputPanel.html(), {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev, button) {
                    var $input = $(ev.target).find(o.inputSelector);
                    if ($input.length > 0) {
                        $input.on('keyup keydown keypress', function (ev) {
                            ev.stopPropagation();
                        });
                        $input[0].select();
                        $input.focus();
                    }
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
            $e.append($('.circle-progress')[0].outerHTML.replace('hidden', ''));
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                $e.remove();
            }, seconds * 1000);
            Appanel.chains($e.find('.circle-progress > circle'), 'ani-hide-circle-progress:' + seconds);
        },

        warn: function (title, text, seconds) {
            var $container = $('.message-container'),
                $message;

            $container.append(
                $('.warning-message')[0].outerHTML
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