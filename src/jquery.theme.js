/*!
 * Color Manager.
 *
 * Register object as a base color or register as follower of base color.
 *
 * @name theme
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

    window['Theme'] = function () {
        Object.assign(this, {
            theme: [],

            /**
             * Add/Replace Property.
             * @param name - define unique name for the property
             * @param prop - css property name or array of css property name
             * @param target - jQuery Object from script like this: $('.your-target');
             * @param sourcePropertyName - existing property name to follow
             */
            add: function (name, prop, target, sourcePropertyName) {
                this.theme.push(name);
                this[name] = {
                    name: name,
                    prop: prop,
                    element: target,
                    sourceProperty: sourcePropertyName,
                    child: [],
                    set: function (value) {
                        if (value) {
                            this.color = value;
                            if (this.prop instanceof String) {
                                this.element.css(this.prop, value);
                            } else {
                                for (var i = 0; i < this.prop.length; i++) {
                                    this.element.css(this.prop[i], value);
                                }
                            }
                            for (var i in this.child) {
                                this.child[i].set(value);
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
                if (sourcePropertyName !== undefined) {
                    this[sourcePropertyName].child.push(this[name]);
                }
            },

            /**
             * Set Property by Profile/Set of property.
             * @param profile - object like this: { name1:value1, name2:value2,.. }
             */
            set: function (profile) {
                for (var i in profile) {
                    if (this[i] === undefined) {
                        console.warn('Color name "' + i + '" is not defined!');
                        continue;
                    }
                    this[i].set(profile[i]);
                }
            },

            /**
             * Get all properties value as a profile/set of proproty.
             */
            get: function () {
                var color, theme = {};
                for (var i in this.theme) {
                    color = this[this.theme[i]];
                    if (color.sourceProperty !== undefined) continue;
                    theme[this.theme[i]] = color.get();
                }
                return theme;
            },

            refresh: function () {
                var color;
                for (var i in this.theme) {
                    color = this[this.theme[i]];
                    if (color.sourceProperty !== undefined) continue;
                    color.set(color.get());
                }
            },

            updateElements: function () {
                var color;
                for (var i in this.theme) {
                    color = this[this.theme[i]];
                    color.updateElement();
                }
                this.refresh();
            }
        });
    };

    /**
     * Profile of Theme/CSS Property Set.
     *
     * @param name - profile prefix name.
     * @param theme - initialized theme (instant of Theme())
     * @constructor
     */
    window['Profile'] = function (name, theme) {

        var ids = Appanel.get(this.name + ":profiles");
        if (!ids) ids = [];

        Object.assign(this, {
            name: name,
            ids: ids,
            theme: theme,
            contains: function (profileId) {
                return this.ids.indexOf(profileId) >= 0;
            },
            load: function (profileId) {
                var profile = Appanel.get(this.name + ":profile-" + profileId);
                if (profile) {
                    if (!this.contains(profileId)) {
                        this.ids.push(profileId);
                        Appanel.set(this.name + ":profiles", this.ids);
                    }
                    this.theme.set(profile);
                    return profile;
                }
                return null;
            },
            save: function (profileId, profile) {
                if (!this.contains(profileId)) {
                    this.ids.push(profileId);
                    Appanel.set(this.name + ":profiles", this.ids);
                }
                if (profile !== undefined) {
                    this.theme.set(profile);
                }
                Appanel.set(this.name + ":profile-" + profileId, this.theme.get());
            },
            remove: function (profileId) {
                ids.pop(profileId);
                Appanel.set(this.name + ":profiles", this.ids);
            }
        });

    };

})(jQuery);