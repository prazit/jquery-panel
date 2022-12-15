'use strict';

/**
 * Focus on Number version 3
 *
 * Favorite Profiles:
 * Appanel.set("focus:profile-1", {"out":6,"afterOut":1,"in":6,"afterIn":1,"speed":0.9,"zeroNumber":1,"max":"20","startNumber":36,"animationIndex":2,"colorBack":"black","colorNumber":"yellow","colorCircle1":"rgba(255,255,0,0.25)","colorCircle2":"rgba(255,255,0,0.01)"});
 * Appanel.set("focus:profile-6", {"out":4.5,"afterOut":0.5,"in":4.5,"afterIn":0.5,"speed":"10.1","zeroNumber":0,"max":"59","startNumber":36,"animationIndex":2,"colorBack":"black","colorNumber":"yellow","colorCircle1":"red","colorCircle2":"black"});
 */

function refresh() {
    var src = window.top.location.href,
        lastIndex = src.indexOf("?"),
        src = src.substr(0, lastIndex > 0 ? lastIndex : src.length) + '?refresh=' + Date().toString() + (Appanel.focus.getState() === 'playing' ? '&play' : '');
    window.top.location.href = src;
}

function hasParam(name) {
    var params = window.location.search.split('&'),
        param;
    for (var index in params) {
        if (params[index] === name) return true;
    }
    return false;
}

Appanel({
    focus: {

        //-- focus constants
        out: 6,	        // duration for animation go-out
        afterOut: 1,	// duration for animation after go-out
        in: 6,		    // duration for animation come-in
        afterIn: 1,	    // duration for animation after come-in
        speed: 1,	    // last speedX from config
        zeroNumber: 1,  // zero reset to this number
        max: 10,        // reach max number will reset to zeroNumber

        //-- focus system
        startNumber: 1,
        number: 999,
        mon1: $(".display-1"),
        mon2: $(".display-2"),
        playButton: $(".play.button"),
        pauseButton: $(".pause.button"),
        resumeButton: $(".resume.button"),

        stateText: 'READY',
        aniShowSpeedX: {
            on: "click",
            sweep: [{
                selector: ".speed",
                remove: "ani-bounceOut",
                add: "hidden",
                sweep: [{
                    run: function () {
                        var focus = Appanel.focus;
                        if (focus.stateText == null) {
                            var x = focus.playButton.sweep("speedx");
                            this.$.html(x.toPrecision(x > 1 ? 2 : 1) + "x");
                        } else {
                            this.$[0].innerText = '' + focus.stateText;
                            focus.stateText = null;
                        }
                    },
                    duration: 1,
                    play: "ani-bounceOut",
                    sweep: [{add: "hidden"}]
                }]
            }]
        },

        debugPad: $(".debug-pad"),

        debugFunc: function () {
            var msg = "Sweep Label:" + this.label + " play:" + this.play + " timing:" + this.timing + " duration:" + this.duration + "s";
            Appanel.focus.debugPad[0].innerText = msg;
        },

        nextNumber: [
            function (/* 0: count up from zeroNumber to max */) {
                var focus = Appanel.focus,
                    number = focus.number >= focus.max ? focus.zeroNumber : focus.number + 1;
                focus.debugFunc.call(this);

                focus.set(number);
                focus.initCircle(number);

                // update config
                focus.saveDefaultProfile();
            },
            function (/* 1: count up from zeroNumber to (lastMax + 1) when lastMax reach the max value then reset it to zeroNumber */) {
                var focus = Appanel.focus,
                    max = focus.lastMax === undefined ? focus.zeroNumber : focus.lastMax,
                    number = focus.number;

                if (number > max) {
                    max = number >= focus.max ? focus.zeroNumber : number;
                    number = focus.zeroNumber;
                } else {
                    number++;
                }

                focus.debugFunc.call(this);

                focus.setLastMax(max);
                focus.set(number);
                focus.initCircle(number);

                // update config
                focus.saveDefaultProfile();
            }
        ],

        inputNumber: function (title, defaultNumber, handler) {
            var $maxValuePanel = $('.max-number-input-panel');
            $maxValuePanel.find('.max-number-input')[0].defaultValue = defaultNumber;

            // show dialog with max-number-input
            var dialogue = Appanel.selection('information', title, $maxValuePanel[0].innerHTML, {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev, button) {
                    var $input = $(ev.target).find('.max-number-input');
                    $input[0].select();
                    $input.focus();
                }],
                [dialogue, 'selection:closed', function (ev, button) {
                    if (button.button === 'OK') {
                        var number = $(ev.target).find('.max-number-input')[0].value;
                        handler(number);

                        // update config
                        ev.data.saveDefaultProfile.call(ev.data);
                    }
                }, this]
            ]);
        },

        circle: $('.svg-circle'),
        circleSizes: {1: 75, 2: 100, 3: 130, 4: 200},
        lastCircleSize: 0,

        initCircle: function (number) {
            var index = ('' + number).length,
                size = this.circleSizes[index];
            this.circleSize(size);
        },

        circleSize: function (size) {
            if (size === this.lastCircleSize) return;
            this.lastCircleSize = size;

            this.circle
                .css('width', size + 'vh')
                .css('left', 'calc((100vw - ' + size + 'vh)/2)')
                .css('top', ((100 - size) / 2) + 'vh');
        },

        width: function () {
            return this.mon2.width() + 40;
        },

        set: function (number) {
            this.number = number;
            this.mon1.html(number);
            this.mon2.html(number);
        },

        setAnimationIndex: function (animationIndex, counterIndex) {
            this.animationIndex = animationIndex;
            this.counterIndex = counterIndex;

            $('.ani-' + animationIndex).addClass('border--c3');
            $('.counter-' + counterIndex).addClass('border--c3');
            Appanel.fcBorder.element = $(Appanel.fcBorder.element.selector);

            /**
             * css.animation-timing-function:
             * inherit
             * initial
             * unset
             * cubic-bezier [ https://www.cssportal.com/css-cubic-bezier-generator/ ]
             * ease
             * ease-in
             * ease-in-out
             * ease-out
             * jump-both
             * jump-end
             * jump-none
             * jump-start
             * linear
             * revert
             * step-end
             * step-start
             * steps
             **/
            var animations = [
                    {},
                    {},
                    {
                        normalClass: 'ani-c-normal',
                        sweeper: [{/* 0 */
                            label: "go-out",
                            duration: 0.01,
                            selector: this.mon1,
                            remove: 'hidden',
                            sweep: [{/* 1 */
                                duration: this.out,
                                timing: 'ease-in',
                                play: 'ani-c-goOut',
                                run: this.debugFunc,
                                sweep: [{/* 2 */
                                    duration: this.afterOut,
                                    timing: 'ease-out',
                                    play: 'ani-c-after-goOut',
                                    run: this.debugFunc,
                                    sweep: [{/* 3 */
                                        duration: this.in,
                                        timing: 'ease-in',
                                        play: 'ani-c-comeIn',
                                        run: this.debugFunc,
                                        sweep: [{/* 4 */
                                            duration: this.afterIn,
                                            timing: 'ease-out',
                                            play: 'ani-c-after-comeIn',
                                            run: this.nextNumber[counterIndex],
                                            sweep: [/* loop */'go-out']
                                        }]
                                    }, {/* 3 */
                                        selector: '.circle1',
                                        duration: this.in + this.afterIn,
                                        timing: "linear",
                                        play: 'ani-c-circle-hide',
                                        seep: []
                                    }, {/* 3 */
                                        selector: '.circle2',
                                        duration: this.in + this.afterIn,
                                        timing: "linear",
                                        play: 'ani-c-circle-show',
                                        seep: []
                                    }]
                                }]
                            }, {/* 1 */
                                selector: '.circle1',
                                duration: this.out + this.afterOut,
                                timing: "linear",
                                play: 'ani-c-circle-show',
                                sweep: []
                            }, {/* 1 */
                                selector: '.circle2',
                                duration: this.out + this.afterOut,
                                timing: "linear",
                                play: 'ani-c-circle-hide',
                                sweep: []
                            }]
                        }, {/* 0 */
                            duration: 0.01,
                            selector: this.mon2,
                            add: 'hidden',
                            loop: 1
                        }, {/* 0 */
                            duration: 0.01,
                            selector: '.circle',
                            remove: 'hidden',
                            loop: 1
                        }]
                    }],
                animation = animations[animationIndex],
                $number = $('.number'),
                element = this.playButton[0];

            $(animations).each(function (i, e) {
                $number.removeClass(e.normalClass);
            });
            $number.addClass(animation.normalClass);

            $number.each(function (i, e) {
                var $e = $(e),
                    style = $e.attr('style');
                if (style === undefined) return;
                if (e.sweepID !== undefined) delete e.sweepID;
                style.replaceAll(/-webkit-animation-duration:[^;]*;|animation-duration:[^;]*;|-webkit-animation-iteration-count:[^;]*;|animation-iteration-count:[^;]*;|-webkit-animation-timing-function:[^;]*;|animation-timing-function:[^;]*;|-webkit-transition-duration:[^;]*;|transition-duration:[^;]*;|-webkit-transition-timing-function:[^;]*;|transition-timing-function:[^;]*;/, '');
                $e.attr('style', style);
            });

            delete element.sweepContext;
            delete element.sweepID;

            /*reset before play*/
            this.playButton
                .off('click')
                .off('sweep:ready')
                .removeClass('hidden');
            this.pauseButton
                .off('click');
            this.resumeButton
                .off('click');

            /*handle play pause resume*/
            this.animated = animation.sweeper;
            $(this.playButton.selector + ',' + this.pauseButton.selector + ',' + this.resumeButton.selector)
                .off('click')
                .on('click', function () {
                    Appanel.focus.togglePlay()
                });
        },

        speedElement: $('.speed-number')[0],

        setMaxNumber: function (max) {
            this.max = max;
            $(".max-number").html(max);
        },

        setLastMax: function (last) {
            this.lastMax = last;
            $(".last-max").html(last);
        },

        setZeroNumber: function (number) {
            number = Math.abs(number);
            Appanel.focus.zeroNumber = number;
            $('.zero-number')[0].innerText = number;
        },

        setSpeedX: function (speed) {
            this.speed = speed;
            this.speedElement.innerText = speed + 'x';
            this.playButton.sweep("speedx", speed);
        },

        setOutNumber: function (number) {
            number = Math.abs(number);
            this.out = number;
            $('.out-number')[0].innerText = number;
        },

        setAfterOutNumber: function (number) {
            number = Math.abs(number);
            this.afterOut = number;
            $('.after-out-number')[0].innerText = number;
            this.saveDefaultProfile();
        },

        setInNumber: function (number) {
            number = Math.abs(number);
            this.in = number;
            $('.in-number')[0].innerText = number;
        },

        setAfterInNumber: function (number) {
            number = Math.abs(number);
            this.afterIn = number;
            $('.after-in-number')[0].innerText = number;
        },

        loadProfile: function (profileIndex, options) {
            var profile = Appanel.get("focus:profile-" + profileIndex);
            if (profile) {
                var loadNumbers, loadColors, defaultProfile = profileIndex === 0;
                if (options === undefined) {
                    loadNumbers = true;
                    loadColors = true;
                } else {
                    loadNumbers = options === 'numbers';
                    loadColors = options === 'colors';
                }

                if (loadNumbers) {
                    /*if (this.getState() !== 'playing')*/
                    this.set(profile.startNumber);
                    this.setZeroNumber(profile.zeroNumber);
                    this.setMaxNumber(profile.max);
                    this.setLastMax(profile.lastMax);
                    this.setSpeedX(profile.speed);
                    this.setOutNumber(profile.out);
                    this.setAfterOutNumber(profile.afterOut);
                    this.setInNumber(profile.in);
                    this.setAfterInNumber(profile.afterIn);
                    this.setAnimationIndex(profile.animationIndex, profile.counterIndex);
                }

                if (loadColors) {
                    Appanel.back.set(profile.colorBack);
                    Appanel.number.set(profile.colorNumber);
                    Appanel.circle1.set(profile.colorCircle1);
                    Appanel.circle2.set(profile.colorCircle2);

                    Appanel.fcBackgroundHover.element.off('mousein mouseout')
                        .each(function (i, e) {
                            var $e = $(e);
                            $e
                                .on('mouseover', {element: $e, color: Appanel.fcBackgroundHover}, function (ev) {
                                    ev.data.element.css('background-color', ev.data.color.get());
                                })
                                .on('mouseout', {element: $e, color: Appanel.fcBackground}, function (ev) {
                                    ev.data.element.css('background-color', ev.data.color.get());
                                })
                        });

                    $(Appanel.fcBackgroundHover).off('setcolor')
                        .on('setcolor', {color: Appanel.fcBackground}, function (ev) {
                            ev.data.color.set(ev.data.color.get());
                        });
                }

                if (!defaultProfile) {
                    Appanel.chains($(".profile-" + profileIndex), 'ani-c-comeIn,ani-c-goOut');
                    Appanel.focus.saveDefaultProfile();
                    if (loadNumbers) refresh();
                }
            }
        },

        lastSaved: null,

        saveProfile: function (profileIndex) {
            if (Appanel.back.get() === undefined) return;

            var profile = {
                    out: this.out,
                    afterOut: this.afterOut,
                    in: this.in,
                    afterIn: this.afterIn,

                    speed: this.speed,
                    zeroNumber: this.zeroNumber,
                    max: this.max,
                    lastMax: this.lastMax,
                    startNumber: this.number,

                    animationIndex: this.animationIndex,
                    counterIndex: this.counterIndex,

                    colorBack: Appanel.back.get(),
                    colorNumber: Appanel.number.get(),
                    colorCircle1: Appanel.circle1.get(),
                    colorCircle2: Appanel.circle2.get()
                },
                json = profileIndex + JSON.stringify(profile);
            if (json === this.lastSaved) return;
            this.lastSaved = json;

            Appanel.set("focus:profile-" + profileIndex, profile);
            this.initProfile(profileIndex);

            console.info('Appanel.set("focus:profile-' + profileIndex + '", ' + json + ');');
        },

        initProfile: function (profileIndex) {
            var $profile = $(".profile-" + (profileIndex === 0 ? 1 : profileIndex)),
                $numbers = $profile.find('.numbers'),
                profile = Appanel.get("focus:profile-" + profileIndex);

            if (!profile) {
                profile = {
                    out: 1,
                    afterOut: 1,
                    in: 1,
                    afterIn: 1,

                    speed: 1,
                    zeroNumber: 0,
                    max: 9,
                    startNumber: 0,

                    animationIndex: 2,
                    counterIndex: 0,

                    colorBack: 'black',
                    colorNumber: 'yellow',
                    colorCircle1: 'black',
                    colorCircle2: 'black'
                };
            }

            if (profileIndex === 0) {
                $profile.find('.color-back').attr('title', '-- profile 0 --\n' + JSON.stringify(profile).substr(1).replace('}', '').replaceAll(',"', '\n"'));
                return;
            }

            Appanel.chains($profile, 'ani-c-comeIn,ani-c-goOut');

            $profile.find('.color-back').css('background-color', profile.colorBack);
            $profile.find('.color-number').css('background-color', profile.colorNumber);
            $profile.find('.color-light-circle').css('background-color', profile.colorCircle1);
            $profile.find('.color-dark-circle').css('background-color', profile.colorCircle2);

            $profile.find('.load').attr('title', '-- profile ' + profileIndex + ' --\n' + JSON.stringify(profile).substr(1).replace('}', '').replaceAll(',"', '\n"'));

            var durations = profile.out + '|' + profile.afterOut + '|' + profile.in + '|' + profile.afterIn;
            $numbers.find('.number-durations')[0].innerText = durations;
            $numbers.find('.number-range')[0].innerText = profile.zeroNumber + '|' + profile.startNumber + '|' + profile.max;
            $numbers.find('.number-indexes')[0].innerText = profile.animationIndex + '|' + profile.counterIndex;
            $numbers.css('zoom', 1 - (durations.length * 0.03));
        },

        handleProfile: function () {
            var count = 6,
                $profile;
            for (var i = 1; i <= count; i++) {
                $profile = $(".profile-" + i);
                $profile.find('.load').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index);
                });
                $profile.find('.numbers').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'numbers');
                });
                $profile.find('.colors').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'colors');
                });
                $profile.find('.save').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.saveProfile(ev.data.index);
                });
                this.initProfile(i);
            }
        },

        /**
         * save config
         * usage: config.call(Appanel.focus);
         * this = Appanel.focus
         */
        saveDefaultProfile: function () {
            this.saveProfile(0);
            return this;
        },

        togglePlay: function () {
            var state = this.getState(),
                starter = {
                    speedx: this.speed,
                    on: "sweep:ready",
                    add: "hidden",
                    sweep: this.animated
                },
                aniSpeedX = this.aniShowSpeedX.sweep[0];
            $(aniSpeedX.selector).sweep($.extend(aniSpeedX, {on: 'sweep:ready'}));

            switch (state) {
                case 'playing':
                    this.stateText = "PAUSED";
                    this.playButton.sweep("pause");
                    this.resumeButton.removeClass("hidden");
                    this.pauseButton.addClass("hidden");
                    break;
                case 'paused':
                    this.stateText = "RESUME PLAY";
                    this.playButton.sweep("resume");
                    this.pauseButton.removeClass("hidden");
                    this.resumeButton.addClass("hidden");
                    break;
                case 'initialized':
                    this.stateText = "ANI" + this.animationIndex + "\nCNT" + this.counterIndex;
                    this.playButton.off('sweep:ready').sweep(starter);
                    this.pauseButton.removeClass("hidden");
                    this.playButton.addClass("hidden");
                    break;
                default:
                    console.warn('focus.togglePlay: invalid state "', state, '"');
            }

            console.debug('togglePlay(state:', state, ') to state:', this.getState());
        },

        getState: function () {
            if (!this.pauseButton.hasClass('hidden')) {
                return 'playing';
            } else if (!this.resumeButton.hasClass('hidden')) {
                return 'paused';
            } else if (!this.playButton.hasClass('hidden')) {
                return 'initialized';
            }
        },

        init: function () {
            Appanel.focus = this;

            // restore settings from profile-0.
            this.handleProfile();
            this.loadProfile(0);

            // start number
            this.set(this.startNumber);
            this.initCircle(this.startNumber);

            // animation when speed is changed
            var speed = this.aniShowSpeedX,
                config = this.saveDefaultProfile;

            // listener mapper
            Appanel.map([
                ['.after-in-number', "click", function () {
                    Appanel.focus.inputNumber('After In Animated Duration', Appanel.focus.afterIn, function (number) {
                        Appanel.focus.setAfterInNumber(number);
                        config.call(Appanel.focus);
                        refresh();
                    });
                }],
                ['.in-number', "click", function () {
                    Appanel.focus.inputNumber('In Animated Duration', Appanel.focus.in, function (number) {
                        Appanel.focus.setInNumber(number);
                        config.call(Appanel.focus);
                        refresh();
                    });
                }],
                ['.after-out-number', "click", function () {
                    Appanel.focus.inputNumber('After Out Animated Duration', Appanel.focus.afterOut, function (number) {
                        Appanel.focus.setAfterOutNumber(number);
                        config.call(Appanel.focus);
                        refresh();
                    });
                }],
                ['.out-number', "click", function () {
                    Appanel.focus.inputNumber('Out Animated Duration', Appanel.focus.out, function (number) {
                        Appanel.focus.setOutNumber(number);
                        config.call(Appanel.focus);
                        refresh();
                    });
                }],
                ['.speed-number', "click", function () {
                    Appanel.focus.inputNumber('Speed Number', Appanel.focus.playButton.sweep("speedx"), function (number) {
                        Appanel.focus.setSpeedX(number);
                        config.call(Appanel.focus);
                    });
                }],
                [$(".speed-reset").sweep(speed), "click", function () {
                    Appanel.focus.setSpeedX(1);
                }],
                [$(".speed-down").sweep(speed), "click", function () {
                    var x = Appanel.focus.speed;
                    if (x >= 0.2) {
                        x -= 0.1;
                    }
                    Appanel.focus.setSpeedX(x);
                    config.call(Appanel.focus);
                }],
                [$(".speed-up").sweep(speed), "click", function () {
                    var x = Appanel.focus.speed + 0.1;
                    Appanel.focus.setSpeedX(x);
                    config.call(Appanel.focus);
                }],
                [$(".big-speed-down").sweep(speed), "click", function () {
                    var x = Appanel.focus.speed;
                    if (x >= 2.0) {
                        x -= 1.0;
                    }
                    Appanel.focus.setSpeedX(x);
                    config.call(Appanel.focus);
                }],
                [$(".big-speed-up").sweep(speed), "click", function () {
                    var x = Appanel.focus.speed + 1.0;
                    Appanel.focus.setSpeedX(x);
                }],
                [".plus", "click", function () {
                    Appanel.focus.set(Appanel.focus.number + 1);
                    config.call(Appanel.focus);
                }],
                [".zero", "click", function () {
                    Appanel.focus.number = Appanel.focus.zeroNumber - 1;
                    Appanel.focus.setLastMax(Appanel.focus.zeroNumber);
                    config.call(Appanel.focus);
                }],
                [".zero-number", "click", function () {
                    Appanel.focus.inputNumber('Zero Number', Appanel.focus.zeroNumber, function (number) {
                        Appanel.focus.setZeroNumber(number);
                        config.call(Appanel.focus);
                    });
                }],
                [".minus", "click", function () {
                    if (Appanel.focus.number > 0) {
                        Appanel.focus.set(Appanel.focus.number - 1);
                        config.call(Appanel.focus);
                    }
                }],
                [".max-plus", "click", function () {
                    $(".max-number").html(++Appanel.focus.max);
                    config.call(Appanel.focus);
                }],
                [$(".max-number").html(this.max), "click", function () {
                    Appanel.focus.inputNumber('Maximum Number', Appanel.focus.max, function (number) {
                        Appanel.focus.setMaxNumber(number);
                        config.call(Appanel.focus);
                    });
                }],
                [".max-minus", "click", function () {
                    if (Appanel.focus.max > 0) {
                        $(".max-number").html(--Appanel.focus.max);
                        config.call(Appanel.focus);
                    }
                }],
                [$(".ani-0").sweep(speed), "click", function () {
                    Appanel.focus.setAnimationIndex(0, Appanel.focus.counterIndex);
                    config.call(Appanel.focus);
                    refresh();
                }],
                [$(".ani-1").sweep(speed), "click", function () {
                    Appanel.focus.setAnimationIndex(1, Appanel.focus.counterIndex);
                    config.call(Appanel.focus);
                    refresh();
                }],
                [$(".ani-2").sweep(speed), "click", function () {
                    Appanel.focus.setAnimationIndex(2, Appanel.focus.counterIndex);
                    config.call(Appanel.focus);
                    refresh();
                }],
                [$(".counter-0").sweep(speed), "click", function () {
                    Appanel.focus.setAnimationIndex(Appanel.focus.animationIndex, 0);
                    config.call(Appanel.focus);
                    refresh();
                }],
                [$(".counter-1").sweep(speed), "click", function () {
                    Appanel.focus.setAnimationIndex(Appanel.focus.animationIndex, 1);
                    config.call(Appanel.focus);
                    refresh();
                }]
            ]);

        } // end of init
    },

    color: {
        set: function (color) {
            if (color) {
                this.color = color;
                this.element.css(this.prop, color);
                for (var i in this.child) {
                    this.child[i].set(color);
                }
                $(this).triggerHandler('setcolor');
            }
        },
        get: function () {
            return this.color;
        },
        handle: function () {
            if (this.sourceColor !== undefined) return;

            var i,
                color,
                element,
                colors = ["black", "gray", "silver", "white", "red", "orange", "yellow"];

            for (var i in colors) {
                color = colors[i];
                element = $("." + color + "-" + this.name);
                element
                    .attr('title', this.name + ' color to ' + color)
                    .on("click", {control: this, color: color, element: element}, function (ev) {
                        Appanel.chains(ev.data.element, 'ani-c-comeIn,ani-c-goOut');
                        ev.data.control.set(ev.data.color);
                        Appanel.focus.saveDefaultProfile();
                    });
            }

            $('.' + this.name + '-color')
                .attr('title', this.name + ' color')
                .on("click", {control: this}, function (ev) {
                    var control = ev.data.control;
                    Appanel.chains($(ev.currentTarget), 'ani-c-comeIn,ani-c-goOut');
                    Appanel.focus.inputNumber(control.name + ' color', control.get(), function (color) {
                        control.set(color);
                        Appanel.focus.saveDefaultProfile();
                    });
                });
        },
        stamp: function (name, prop, target, sourceColor) {
            Appanel[name] = $.extend({}, this, {
                name: name,
                prop: prop,
                element: target,
                sourceColor: sourceColor,
                child: []
            });
            Appanel[name].handle();
            if (sourceColor !== undefined) {
                Appanel[sourceColor].child.push(Appanel[name]);
            }
        },
        init: function () {
            this.stamp("back", "background-color", $("body"));
            this.stamp("number", "color", $(".number"));
            this.stamp("circle1", "stroke", $(".circle1"));
            this.stamp("circle2", "stroke", $(".circle2"));

            this.stamp("circle0", "stroke", $(".circle"), "circle1");
            this.stamp("fcForeground", "color", $(".symbol--c3,.symbol--c3--at,.text--c3"), "number");
            this.stamp("fcBackgroundHover", "background-color", $(".background--c0--at"), "circle1");
            this.stamp("fcBackground", "background-color", $(".fcBackground"), "circle2");
            this.stamp("fcBorder", "border-color", $(".border--c3"), "circle1");

            this.stamp("backColor", "background-color", $(".back-color"), "back");
            this.stamp("numberColor", "background-color", $(".number-color"), "number");
            this.stamp("circle1Color", "background-color", $(".circle1-color"), "circle1");
            this.stamp("circle2Color", "background-color", $(".circle2-color"), "circle2");
        }
    },

    language: {
        loading: 'กำลังโหลด',
        close: 'ปิด'
    },

    ready: function () {
        this.color.init();
        this.focus.init();

        $('.css-trans').css('transition-timing-function', 'ease-in-out');

        var onResize = function (ev) {
            var focus = Appanel.focus;
            focus.mon1.css('font-size', window.innerHeight / 2);
            focus.mon1.parent('div').css('height', window.innerHeight / 2 * 1.1);
            if (focus.windowonresize !== undefined) focus.windowonresize(ev);
        };
        onResize();

        if (window.onresize !== null) this.focus.windowonresize = window.onresize;
        window.onresize = onResize;

        $(window).on('keyup', function (ev) {
            if (ev.which === 32) {
                Appanel.focus.togglePlay();
            }
        });

        if (hasParam('play')) {
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                Appanel.focus.togglePlay();
            }, 500);
        }
    }
});
