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

function toPrecision(number) {
    number = Math.abs(number);
    var zero = number < 1,
        string = '' + number,
        indexOfDot = string.indexOf('.'),
        precision = 2;
    if (indexOfDot < 0) indexOfDot = 0;
    else if (zero) precision--;
    return Number(Math.abs(string).toPrecision(indexOfDot + precision));
}

const cclick = 'click touchstart';

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
                            this.$.html(toPrecision(x) + "x");
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

        theme: {
            colors: [],
            refresh: function () {
                var color;
                for (var i in this.colors) {
                    color = this.colors[i];
                    if (color.sourceColor !== undefined) continue;
                    color.set(color.get());
                }
            },
            updateElement: function () {
                var color;
                for (var i in this.colors) {
                    color = this.colors[i];
                    color.updateElement();
                }
                this.refresh();
            },
            setActiveButton: function (activeSelector, inactiveSelector) {
                $(activeSelector).addClass('border--c3');
                $(inactiveSelector).removeClass('border--c3').css('border-color', 'inherit');
                Appanel.fcBorder.updateElement();
                this.refresh();
            }
        },

        debugPad: $(".debug-pad"),

        debugFunc: function () {
            Appanel.focus.debugPad[0].innerText = "play:" + this.play + " timing:" + this.timing + " duration:" + this.duration + "s";
        },

        /**
         * when the numbers array is not empty then
         * - number is index of numbers array
         * - max is replaced with last index (length - 1) of numbers array
         * - zeroNumber is replaced with first index of numbers array
         */
        numbers: [],

        setNumbers: function (numbers) {
            if (numbers === undefined) numbers = [];

            this.numbers = numbers;
            if (this.numbers.length > 0) {
                this.setZeroNumber(0);
                this.setMaxNumber(numbers.length - 1);
                this.set(this.zeroNumber);
            }
        },

        nextNumber: [
            function (/* 0: count up from zeroNumber to max */) {
                var focus = Appanel.focus,
                    number = focus.number,
                    finished;

                if (focus.countDown) {
                    finished = number <= focus.zeroNumber;
                    number = finished ? focus.max : number - 1;
                } else {
                    finished = number >= focus.max;
                    number = finished ? focus.zeroNumber : number + 1;
                }

                if (finished && !focus.loop) {
                    focus.togglePlay('finished');
                    return;
                }

                focus.debugFunc.call(this);

                focus.initCircle(focus.set(number));

                if (focus.targetMax !== focus.max) focus.setTargetMax(focus.max);

                // update config
                focus.saveDefaultProfile();
            },
            function (/* 1: count up from zeroNumber to (targetMax + 1) when targetMax reach the max value then reset it to zeroNumber */) {
                var focus = Appanel.focus,
                    zero = focus.zeroNumber,
                    max = focus.targetMax === undefined ? zero + 1 : focus.targetMax,
                    number = focus.number,
                    finished = false;

                if (focus.countDown) {
                    if (number <= zero) {
                        finished = max >= focus.max;
                        max = finished ? focus.zeroNumber + 1 : max + 1;
                        number = max;
                    } else {
                        number--;
                    }
                } else {
                    if (number >= max) {
                        finished = max >= focus.max;
                        max = finished ? focus.zeroNumber + 1 : max + 1;
                        number = focus.zeroNumber;
                    } else {
                        number++;
                    }
                }

                if (finished && !focus.loop) {
                    focus.togglePlay('finished');
                    return;
                }

                focus.debugFunc.call(this);

                focus.setTargetMax(max);
                focus.initCircle(focus.set(number));

                // update config
                focus.saveDefaultProfile();
            }
        ],

        maxTick: 0,
        maxHand: 0,

        ticktock: $('.circle-inside'),
        hand: $('.circle-hand'),
        shortHand: $('.short-hand'),

        nextTick: function () {
            var focus = Appanel.focus,
                tick, hand, ratio, degree,
                maxTick = focus.maxTick,
                maxHand = focus.maxHand;

            focus.debugFunc.call(this);

            if (maxTick === 0) {
                maxTick = 2 * Math.PI * focus.ticktock.attr('r');
                focus.maxTick = maxTick;

                maxHand = 2 * Math.PI * focus.hand.attr('r');
                focus.maxHand = maxHand;
                focus.hand.css('stroke-dasharray', focus.maxHand);
                focus.hand.css('stroke-dashoffset', 0);
            }

            ratio = focus.number / (focus.targetMax - focus.zeroNumber + 1);
            tick = ratio * maxTick;
            focus.ticktock.css('stroke-dashoffset', maxTick - tick);

            hand = ratio * maxHand;
            focus.hand.css('stroke-dashoffset', maxHand - hand);

            degree = ratio * 360;
            focus.shortHand.css('transform', 'rotate(' + degree + 'deg)');
        },

        inputNumber: function (title, defaultNumber, handler) {
            var $maxValuePanel = $('.max-number-input-panel');
            $maxValuePanel.find('.max-number-input')[0].defaultValue = defaultNumber;

            // show dialog with max-number-input
            var dialogue = Appanel.selection('information', title, $maxValuePanel[0].innerHTML, {
                buttons: ['OK', 'Cancel']
            });

            Appanel.map([
                [dialogue, 'selection:open', function (ev, button) {
                    var $target = $(ev.target),
                        $input = $target.find('.max-number-input');
                    $input[0].select();
                    $input.focus();
                }],
                [dialogue, 'selection:closed', function (ev, button) {
                    if (button.button === 'OK') {
                        var number = $(ev.target).find('.max-number-input')[0].value;

                        handler(isNaN(number) ? number : Math.abs(number));

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

            var display = this.numbers.length > 0 ? (this.numbers.length > number ? this.numbers[number] : this.numbers[this.numbers.length - 1]) : number;
            this.mon1.html(display);
            this.mon2.html(display);

            if (number === this.zeroNumber) this.maxTick = 0;
            return display;
        },

        countDown: false,

        setCountDirection: function (countDown) {
            this.countDown = countDown;

            var active, inactive;
            if (countDown) {
                active = '.count-down';
                inactive = '.count-up';
            } else {
                active = '.count-up';
                inactive = '.count-down';
            }

            this.theme.setActiveButton(active, inactive);
        },

        loop: true,

        setLoop: function (loop) {
            this.loop = loop;

            var active, inactive;
            if (loop) {
                active = '.forever-loop';
                inactive = '.no-loop';
            } else {
                active = '.no-loop';
                inactive = '.forever-loop';
            }

            this.theme.setActiveButton(active, inactive);
        },

        setAnimationIndex: function (animationIndex, counterIndex) {
            this.animationIndex = animationIndex;
            this.counterIndex = counterIndex;

            $('.ani-' + animationIndex).addClass('border--c3');
            $('.counter-' + counterIndex).addClass('border--c3');
            Appanel.fcBorder.updateElement();

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
                                    /*run: this.debugFunc,*/
                                    run: this.nextTick,
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
                .off(cclick)
                .off('sweep:ready')
                .removeClass('hidden');
            this.pauseButton
                .off(cclick);
            this.resumeButton
                .off(cclick);

            /*handle play pause resume*/
            this.animated = animation.sweeper;
            $(this.playButton.selector + ',' + this.pauseButton.selector + ',' + this.resumeButton.selector)
                .off(cclick)
                .on(cclick, function () {
                    Appanel.focus.togglePlay()
                });
        },

        speedElement: $('.speed-number')[0],

        setMaxNumber: function (max) {
            if (this.numbers.length === 0) {
                this.max = max;
            } else {
                this.max = max >= this.numbers.length ? this.numbers.length - 1 : max;
            }
            $(".max-number").html(this.max);
            this.maxTick = this.zeroNumber;
        },

        setTargetMax: function (targetMax) {
            this.targetMax = targetMax;
            $(".last-max").html(targetMax);
        },

        setZeroNumber: function (number) {
            number = Math.abs(number);
            Appanel.focus.zeroNumber = number;
            $('.zero-number')[0].innerText = number;
        },

        setSpeedX: function (speed) {
            this.speed = toPrecision(speed);
            this.speedElement.innerText = this.speed + 'x';
            this.playButton.sweep("speedx", this.speed);
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

        togglePlay: function (specifiedState) {
            var state = specifiedState === undefined ? this.getState() : specifiedState,
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
                case 'finished':
                    this.stateText = "FINISHED";
                    this.playButton.sweep("pause");
                    this.resumeButton.removeClass("hidden");
                    this.pauseButton.addClass("hidden");
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

        addProfile: function () {
            this.profileCount++;
            Appanel.set('focus:profiles', this.profileCount);
            this.handleProfile();
            this.loadProfile(0, 'colors');
        },

        removeProfile: function () {
            this.profileCount--;
            Appanel.set('focus:profiles', this.profileCount);
            this.handleProfile();
            this.loadProfile(0, 'colors');
        },

        loadProfile: function (profileIndex, options) {
            var profile = Appanel.get("focus:profile-" + profileIndex);
            if (profile) {
                var loadNumbers, loadDurations, loadRange, loadIndexes, loadColors, defaultProfile = profileIndex === 0;
                if (options === undefined) {
                    loadNumbers = true;
                    loadColors = true;
                } else {
                    loadNumbers = options === 'numbers';
                    loadColors = options === 'colors';
                }
                if (loadNumbers) {
                    loadDurations = true;
                    loadRange = true;
                    loadIndexes = true;
                } else {
                    loadDurations = options === 'durations';
                    loadRange = options === 'range';
                    loadIndexes = options === 'indexes' || loadDurations;
                }

                if (loadDurations) {
                    this.setOutNumber(profile.out);
                    this.setAfterOutNumber(profile.afterOut);
                    this.setInNumber(profile.in);
                    this.setAfterInNumber(profile.afterIn);
                }

                if (loadRange) {
                    this.setNumbers(profile.numbers);
                    this.set(profile.startNumber);
                    this.setZeroNumber(profile.zeroNumber);
                    this.setMaxNumber(profile.max);
                    this.setTargetMax(profile.targetMax);
                    this.setSpeedX(profile.speed);
                    this.setCountDirection(profile.countDown);
                    this.setLoop(profile.loop);
                }

                if (loadIndexes) {
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
                    if (loadIndexes) refresh();
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
                    targetMax: this.targetMax,
                    startNumber: this.number,

                    numbers: this.numbers,
                    animationIndex: this.animationIndex,
                    counterIndex: this.counterIndex,
                    countDown: this.countDown,
                    loop: this.loop,

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

        /**
         * save config
         * usage: config.call(Appanel.focus);
         * this = Appanel.focus
         */
        saveDefaultProfile: function () {
            this.saveProfile(0);
            return this;
        },

        handleProfile: function () {
            var count = this.profileCount === undefined ? Appanel.get('focus:profiles') : this.profileCount,
                $container = $('.profiles'),
                $profile;

            if (this.profileTemplate === undefined) this.profileTemplate = $container[0].innerHTML;

            if (!count) count = 6;
            this.profileCount = count;
            $container[0].innerHTML = "";

            for (var i = 1; i <= count; i++) {
                $container.append(this.profileTemplate.replace('profile-number', i).replace('profile-count', count));

                $profile = $(".profile-" + i);
                if (i < count) {
                    $profile.find('.actions')[0].remove();
                } else {
                    $profile.find('.actions .add').on("click", function (ev) {
                        Appanel.focus.addProfile();
                    });
                    $profile.find('.actions .remove').on("click", function (ev) {
                        Appanel.focus.removeProfile();
                    });
                }

                $profile.find('.load').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index);
                });
                $profile.find('.numbers').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'numbers');
                });
                $profile.find('.durations').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'durations');
                });
                $profile.find('.range').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'range');
                });
                $profile.find('.indexes').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'indexes');
                });
                $profile.find('.colors').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.loadProfile(ev.data.index, 'colors');
                });
                $profile.find('.save').on("click", {control: this, index: i}, function (ev) {
                    ev.data.control.saveProfile(ev.data.index);
                });

                this.initProfile(i);
            }

            this.theme.updateElement();
        },

        initProfile: function (profileIndex) {
            var $profile = $(".profile-" + (profileIndex === 0 ? 1 : profileIndex)),
                $numbers = $profile,
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

                    numbers: [],
                    animationIndex: 2,
                    counterIndex: 0,
                    countDown: false,
                    loop: true,

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
            $profile.find('.color-number').css('color', profile.colorNumber)[0].innerText = profileIndex;
            $profile.find('.color-circle')
                .css('background-color', profile.colorBack)
                .css('border-right-color', profile.colorCircle1)
                .css('border-bottom-color', profile.colorCircle1)
                .css('border-left-color', profile.colorCircle2)
                .css('border-top-color', profile.colorCircle1);

            $profile.find('.load').attr('title', '-- profile ' + profileIndex + ' --\n' + JSON.stringify(profile).substr(1).replace('}', '').replaceAll(',"', '\n"'));

            var durations = profile.out + '|' + profile.afterOut + '\n' + profile.in + '|' + profile.afterIn;
            $numbers.find('.number-durations')[0].innerText = durations;
            $numbers.find('.durations .zoom').css('zoom', 1 - (durations.length * 0.02));

            $numbers.find('.number-range')[0].innerText = (profile.numbers === undefined || profile.numbers.length === 0)
                ? (profile.zeroNumber + '|' + profile.max + '\n' + toPrecision(profile.speed) + 'x')
                : (profile.numbers[0] + '|' + profile.numbers[profile.numbers.length - 1] + '\n' + toPrecision(profile.speed) + 'x');
            $numbers.find('.range .zoom').css('zoom', 1 - (durations.length * 0.03));

            $numbers.find('.number-indexes')[0].innerText = profile.animationIndex + '|' + profile.counterIndex;
            $numbers.find('.indexes .zoom').css('zoom', 1 - (durations.length * 0.01));
        },

        init: function () {
            Appanel.focus = this;

            // restore settings from profile-0.
            this.handleProfile();
            this.loadProfile(0);

            // start number
            this.initCircle(this.set(this.startNumber));

            // animation when speed is changed
            var speed = this.aniShowSpeedX,
                config = this.saveDefaultProfile;

            // listener mapper
            Appanel.map([
                ['.numbers', "click", function () {
                    let defaultValue = '',
                        numbers = Appanel.focus.numbers,
                        length = numbers.length;
                    if (length > 0) {
                        for (let i = 0; i < length; i++) {
                            defaultValue += ',' + numbers[i];
                        }
                        defaultValue = defaultValue.substring(1);
                    }

                    Appanel.util.input({
                        title: 'Numbers',
                        label: 'Comma separated values :',
                        placeHolder: 'leave blank to use default 0,1,2,3,..',
                        defaultValue: defaultValue,
                        handler: function (ev) {
                            var values = ev.value.split(','),
                                numbers = [],
                                item;
                            for (let i = 0; i < values.length; i++) {
                                item = values[i].trim();
                                if (item !== '')
                                    numbers.push(item);
                            }
                            Appanel.focus.setNumbers(numbers);
                            config.call(Appanel.focus);
                            /*refresh();*/
                        },
                        panelSelector: '.text-input-panel',
                        labelSelector: 'label',
                        inputSelector: 'input'
                    });
                }],
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
                    Appanel.focus.setTargetMax(Appanel.focus.zeroNumber);
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
                }],
                [$(".count-up").sweep(speed), "click", function (ev) {
                    Appanel.focus.setCountDirection(false);
                    config.call(Appanel.focus);
                }],
                [$(".count-down").sweep(speed), "click", function (ev) {
                    Appanel.focus.setCountDirection(true);
                    config.call(Appanel.focus);
                }],
                [$(".no-loop").sweep(speed), "click", function (ev) {
                    Appanel.focus.setLoop(false);
                    config.call(Appanel.focus);
                }],
                [$(".forever-loop").sweep(speed), "click", function (ev) {
                    Appanel.focus.setLoop(true);
                    config.call(Appanel.focus);
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
                    Appanel.util.input({
                            title: control.name + ' color',
                            label: 'Enter color below:',
                            placeHolder: '#ff00ff gold rgb(255,0,0) rgba(255,0,0,0.5)',
                            defaultValue: control.get(),
                            handler: function (ev, color) {
                                if (!CSS.supports('color', color)) {
                                    Appanel.util.warn('Invalid Color', `Entered value '${color}' is invalid, please try another words`, 10);
                                    return;
                                }
                                control.set(color);
                                Appanel.focus.saveDefaultProfile();
                            }
                        }
                    );
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
            Appanel.focus.theme.colors.push(Appanel[name]);
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
            this.stamp("circleInside", "stroke", $(".circle-inside"), "circle2");
            this.stamp("circleHand", "stroke", $(".circle-hand,.short-hand"), "circle1");
            this.stamp("shortHand", "fill", $(".short-hand"), "circle2");
            this.stamp("fcForeground", "color", $(".symbol--c3,.symbol--c3--at,.text--c3"), "number");
            this.stamp("fcBackgroundHover", "background-color", $(".background--c0--at"), "circle1");
            this.stamp("fcBackground", "background-color", $(".fcBackground"), "circle2");
            this.stamp("fcBorder", "border-color", $(".border--c3"), "circle1");

            this.stamp("backColor", "background-color", $(".back-color"), "back");
            this.stamp("numberColor", "background-color", $(".number-color"), "number");
            this.stamp("circle1Color", "background-color", $(".circle1-color"), "circle1");
            this.stamp("circle2Color", "background-color", $(".circle2-color"), "circle2");
        },
        updateElement: function () {
            this.element = $(this.element.selector);
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
