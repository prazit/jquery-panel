Appanel({
    util: {

        defaults: {
            input: '<div class="top-margin--x10"><b><label class="text--c0">Please enter value:</label></b><br/>' +
                '<input type="text" class="rounded--x5 padding--x5 border--c2 text--c0 width--x300 border--x2"/></div>',
            message: {
                container: '<div class="message-container on-top-left fixed css-trans layer-9"></div>',
                card: '<div class="message-card hidden css-trans rounded--x10 margin--x10 padding--x10 background--c3 message-classes">' +
                    '    <h1 class="symbol message-icon">&nbsp;message-title</h1>' +
                    '    <p class="text-classes">message-text</p>' +
                    '</div>',
                types: {
                    warn: {
                        mainClasses: 'text--cred background--cyellow',
                        icon: 'sym-warning',
                        textClasses: 'text--c0',
                        chainsClasses: 'ani-fadeInLeft'
                    },
                    error: {
                        mainClasses: 'text--cyellow background--cred',
                        icon: 'sym-times-circle',
                        textClasses: '',
                        chainsClasses: 'ani-rotateInUpLeft'
                    },
                    info: {
                        mainClasses: 'text--c0 background--cwhite',
                        icon: 'sym-info-circle',
                        textClasses: '',
                        chainsClasses: 'ani-lightSpeedIn'
                    }
                }
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
            seeNMove:
                '    <div class="property fit-width">' +
                '        <div>' +
                '            <b class="label fweight--x700">property-label:</b>' +
                '            ( <span class="unit">property-unit</span> )' +
                '        </div>' +
                '        <div class="columns fit-width">' +
                '            <input class="input column-1-2" type="number" value="property-value" step="property-step" class="text--c0"/>' +
                '            <label class="display column-1-2 right-text">property-display</label>' +
                '        </div>' +
                '    </div>'
        },

        error: function (title, text, seconds) {
            this.message(title, text, seconds, this.defaults.message.types.error);
        },

        warn: function (title, text, seconds) {
            this.message(title, text, seconds, this.defaults.message.types.warn);
        },

        info: function (title, text, seconds) {
            this.message(title, text, seconds, this.defaults.message.types.info);
        },

        message: function (title, text, seconds, type) {
            var $container = $('.message-container'),
                $message = $('.message-card'),
                html = $message.length === 0 ? this.defaults.message.card : $message[0].outerHTML;

            if ($container.length === 0) {
                $('body').append(this.defaults.message.container);
                $container = $($container.selector);
            }

            if (type === undefined) type = this.defaults.message.types.info;
            $container.append(
                html
                    .replace('message-classes', type.mainClasses)
                    .replace('message-icon', type.icon)
                    .replace('text-classes', type.textClasses)
                    .replace('message-title', title)
                    .replace('message-text', text)
            );

            $message = $container.find('.message-card')
                .removeClass('message-card')
                .removeClass('hidden');

            Appanel.chains($message, type.chainsClasses);

            this.removeAfter(seconds === undefined ? 6 : seconds, $message);
        },

        merge: function (jQueries) {
            var merged = jQueries[0];
            for (let i = 1; i < jQueries.length; i++) {
                merged = merged.add(jQueries[i]);
            }
            return merged;
        },

        input: function (title, label, defaultValue, handler, data) {
            var o = {
                title: 'Title',
                label: 'Label:',
                placeHolder: '',
                defaultValue: '',
                data: {},
                handler: function (data, enteredValue) {
                },
                panelSelector: '.input-panel',
                labelSelector: 'label',
                inputSelector: 'input',
                zoom: 1
            };

            if (typeof (title) !== 'string') {
                o = Object.assign(o, title);
            } else {
                o.title = title;
            }

            // backward compatible
            if (label !== undefined) o.label = label;
            if (defaultValue !== undefined) o.defaultValue = defaultValue;
            if (handler !== undefined) o.handler = handler;
            if (data !== undefined) o.data = data;

            // show dialog with all inputs
            var inputPanel = $(o.panelSelector),
                html = inputPanel.length === 0 ? this.defaults.input : inputPanel.html(),
                dialogue = Appanel.selection('information', o.title, html, {buttons: ['OK', 'Cancel']});

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
                        /*TODO: enter = OK, esc = Cancel*/
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

            new Appanel.Timeout(function () {
                $('#panel-selection').css('zoom', o.zoom);
            }, 200);
        },

        inputs: function (options) {
            var o = Object.assign({
                title: 'Title',
                inputs: [
                    {
                        label: 'Label:',
                        placeHolder: 'enter text here',
                        defaultValue: '',
                        type: 'text'
                    },
                    /*{
                        label: 'Label 2:',
                        placeHolder: '',
                        defaultValue: '',
                        type: 'text'
                    }*/
                ],
                data: {},
                handler: function (data, enteredValues) {/*sample only*/
                },
                panelSelector: '.input-panel',
                labelSelector: 'label',
                inputSelector: 'input',
                zoom: 1
            }, options);

            var inputPanel = $(o.panelSelector),
                inputTemplate = inputPanel.length === 0 ? this.defaults.input : inputPanel.html(),
                html = '',
                inputCount = o.inputs.length;
            for (let i = 0; i < inputCount; i++) {
                html += inputTemplate;
            }

            // show dialog with all inputs
            var dialogue = Appanel.selection('information', o.title, html, {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev) {
                    var $panel = $(ev.target),
                        $inputs = $panel.find(o.inputSelector);

                    $panel.find(o.labelSelector).each(function (i, e) {
                        console.debug('each.i:', i, ', each.e:', e);
                        $(e).text(o.inputs[i].label);
                    });
                    $inputs.each(function (i, e) {
                        e.defaultValue = o.inputs[i].defaultValue;
                        $(e)
                            .attr('placeHolder', o.inputs[i].placeHolder)
                            .attr('type', o.inputs[i].type);
                    });

                    $inputs.on('keyup keydown keypress', function (ev) {
                        ev.stopPropagation();
                    });
                    if ($inputs.length > 0) $inputs[0].select();
                    $($inputs[0]).focus();
                }],
                [dialogue, 'selection:closed', function (ev, button) {
                    if (button.button === 'OK') {
                        var $input = $(ev.target).find(o.inputSelector),
                            value = [],
                            v;
                        $input.each(function (i, e) {
                            v = e.value;
                            if ($(e).attr('type').toLowerCase() === 'number') {
                                v = e.value.indexOf('.') > 0 ? parseFloat(v) : parseInt(v);
                            }
                            value[i] = v;
                        });
                        o.data.values = value;
                        o.handler(o.data, value);
                    }
                }, o]
            ]);

            new Appanel.Timeout(function () {
                $('#panel-selection').css('zoom', o.zoom);
            }, 200);
        },

        /**
         * Often Use:
         * Appanel.clock.disableActivated = true;
         * Appanel.util.seeNMove('.move-me','attr','x','y');
         * Appanel.util.seeNMove('.move-me','css',['left','top'],1);
         * Appanel.util.seeNMove(Appanel.clock.backgroundAttributes,'member',['clockXInPercent','clockYInPercent','clockWInPercent','clockHInPercent'],0.001);
         * Appanel.util.seeNMove(Appanel.clock.backgroundAttributes,'member',['clockXDegree','clockYDegree','clockZDegree','clockPerspective','clockPerspectiveXOrigin','clockPerspectiveYOrigin'],0.5);
         * new Appanel.Timeout(function(){clearTimeout(Appanel.util.timeout);$('#panel-selection').css('left',150).css('top',120);},200);
         */
        seeNMove: function (selector, functionName, properties, step, handler) {
            var inputPanel = $('.seenmove-panel'),
                target = typeof (selector) === 'string' ? $(selector) : selector,
                propertyHtml = inputPanel.length > 0 ? inputPanel[0].innerHTML : this.defaults.seeNMove,
                html = '',
                x, unitX, num;

            if (step === undefined) step = 1;

            for (let i = 0; i < properties.length; i++) {
                x = target[functionName](properties[i]);
                num = parseFloat(x);
                if (isNaN(num)) {
                    num = 0;
                    unitX = '';
                } else {
                    unitX = (x + '').substr(num.toString().length);
                }
                x = num;

                html += propertyHtml
                    .replace('property', 'property-' + properties[i])
                    .replace('property-label', properties[i])
                    .replace('property-value', x)
                    .replace('property-display', x)
                    .replace('property-step', step)
                    .replace('property-unit', unitX);
            }

            // show dialog
            var dialogue = Appanel.selection('information', 'See n Move', html, {buttons: ['Close']}),
                mapper = [
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
                ];

            if (handler !== undefined) {
                mapper.push([dialogue, 'selection:closed', function (ev) {
                    ev.data.handler(ev);
                }, {handler: handler}]);
            }

            Appanel.map(mapper);

            if (Appanel.clock !== undefined) {
                new Appanel.Timeout(function () {
                    $('#panel-selection').css('zoom', Appanel.clock.ui.zoom.invertZoom);
                }, 200);
            }
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

        refreshAfter: function (seconds, refreshFunc, caller) {
            if (refreshFunc === undefined) refreshFunc = Appanel.util.refresh;
            new Appanel.Timeout(refreshFunc, seconds * 1000, caller);
        },

        refreshEvery: function (seconds, refreshFunc, caller) {
            if (refreshFunc === undefined) refreshFunc = Appanel.util.refresh;
            new Appanel.Interval(refreshFunc, seconds * 1000, caller);
        },

        removeAfter: function (seconds, $e, progressType) {
            var $progressBar = $('.circle-progress'),
                html = $progressBar.length === 0 ? this.defaults.removeAfter[progressType === undefined ? 0 : progressType] : $('.circle-progress')[0].outerHTML;
            $e.append(html.replace('hidden', ''));
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                Appanel.chains($e, 'ani-fadeOutUp:0.8,hidden');
                timeout = setTimeout(function () {
                    $e.remove();
                }, 1000);
            }, seconds * 1000);
            Appanel.chains($e.find('.circle-progress > .progress'), 'ani-hide-circle-progress:' + seconds);
        },

        removeSameValue: function (source, target) {
            console.debug('removeSameValue: target:', target);
            for (let i in source) {
                if (source[i] === target[i]) {
                    console.debug('removeSameValue: field:', i, ', target-value:', target[i], ', source-value:', source[i]);
                    delete target[i];
                }
            }
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

    },

    Timeout: function (func, millis, caller) {
        if (func !== undefined) {
            this.set(func, millis, caller);
        }
    },

    Interval: function (func, millis, caller) {
        if (func !== undefined) {
            this.set(func, millis, caller);
        }
    },

    ready: function () {
        /* init Timeout,Interval prototypes */
        let prototype = {
            timeout: null,
            defaultMillis: 200,
            set: function (func, millis, caller) {
                if (this.timeout != null) this.clear();
                if (caller === undefined) caller = this;
                let This = this;
                this.timeout = window['set' + this.name](function () {
                    if (This.clearFirst) This.clear();
                    func.call(caller);
                }, millis === undefined ? this.defaultMillis : millis);
            },
            clear: function () {
                window['clear' + this.name](this.timeout);
                this.timeout = null;
            }
        };
        Appanel.Timeout.prototype = Object.assign({name: 'Timeout', clearFirst: true}, prototype);
        Appanel.Interval.prototype = Object.assign({name: 'Interval', clearFirst: false}, prototype);
    }

});