/*!
 * Color Manager.
 *
 * Register object as a base color or register as follower of base color.
 *
 * @name colors
 * @version 1.0.1
 * @requires jQuery v3.6+
 * @author Prazit Jitmanozot
 *
 * @usage
 * var colorManager = new Colors();
 * colorManager.add( 'base-color-name', $('.base-color'), 'css-property');
 * colorManager.add( 'color-follower1', $('.follower1,.follower2'), 'css-property', 'base-color-name');
 * colorManager.add( 'color-follower3', $('.follower3'), 'different-css-property', 'base-color-name');
 * colorManager.add( 'color-follower4', $('.follower1,.follower4,.base-color'), 'different-css-property', 'base-color-name');
 * colorManager['base-color-name'].set('gold');
 *
 * @demo focus-3-clock.html
 * @prototype focus-3.html
 *
 * Copyright (c) 2022 Prazit (R) Jitmanozot
 */
(function ($) {

    // variables must be declare by var before use, for development only
    'use strict';

    window['Colors'] = function () {
        Object.assign(this, {
            colors: [],
            add: function (name, prop, target, baseColorName) {
                this.colors.push(name);
                this[name] = {
                    name: name,
                    prop: prop,
                    element: target,
                    sourceColor: baseColorName,
                    child: [],
                    set: function (color) {
                        if (color) {
                            this.color = color;
                            if (this.prop instanceof String) {
                                this.element.css(this.prop, color);
                            } else {
                                for (var i = 0; i < this.prop.length; i++) {
                                    this.element.css(this.prop[i], color);
                                }
                            }
                            for (var i in this.child) {
                                this.child[i].set(color);
                            }
                            $(this).triggerHandler('setcolor');
                        }
                    },
                    get: function () {
                        return this.color;
                    },
                    updateElement: function () {
                        this.element = $(this.element.selector);
                    }
                };
                if (baseColorName !== undefined) {
                    this[baseColorName].child.push(this[name]);
                }
            },
            set: function (colors) {
                for (var i in colors) {
                    if (this[i] === undefined) {
                        console.warn('Color name "' + i + '" is not defined!');
                        continue;
                    }
                    this[i].set(colors[i]);
                }
            },
            refresh: function () {
                var color;
                for (var i in this.colors) {
                    color = this[this.colors[i]];
                    if (color.sourceColor !== undefined) continue;
                    color.set(color.get());
                }
            },
            updateElements: function () {
                var color;
                for (var i in this.colors) {
                    color = this[this.colors[i]];
                    color.updateElement();
                }
                this.refresh();
            }
        });
    };
})(jQuery);