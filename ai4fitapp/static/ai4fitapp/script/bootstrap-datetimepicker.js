/*@preserve
 * Tempus Dominus Bootstrap4 v5.1.2 (https://tempusdominus.github.io/bootstrap-4/)
 * Copyright 2016-2018 Jonathan Peterson
 * Licensed under MIT (https://github.com/tempusdominus/bootstrap-3/blob/master/LICENSE)
 */
if ("undefined" == typeof jQuery) throw new Error("Tempus Dominus Bootstrap4's requires jQuery. jQuery must be included before Tempus Dominus Bootstrap4's JavaScript.");
if (+function (a) {
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 === b[0] && 9 === b[1] && b[2] < 1 || b[0] >= 4) throw new Error("Tempus Dominus Bootstrap4's requires at least jQuery v3.0.0 but less than v4.0.0")
}(jQuery), "undefined" == typeof moment) throw new Error("Tempus Dominus Bootstrap4's requires moment.js. Moment.js must be included before Tempus Dominus Bootstrap4's JavaScript.");
var version = moment.version.split(".");
if (version[0] <= 2 && version[1] < 17 || version[0] >= 3) throw new Error("Tempus Dominus Bootstrap4's requires at least moment.js v2.17.0 but less than v3.0.0");
+function () {
    function a(a, b) {
        if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !b || "object" != typeof b && "function" != typeof b ? a : b
    }

    function b(a, b) {
        if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
        a.prototype = Object.create(b && b.prototype, {
            constructor: {
                value: a,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
    }

    function c(a, b) {
        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
    }

    var d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (a) {
        return typeof a
    } : function (a) {
        return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
    }, e = function () {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
            }
        }

        return function (b, c, d) {
            return c && a(b.prototype, c), d && a(b, d), b
        }
    }(), f = function (a, b) {
        var d = "datetimepicker", f = "" + d, g = "." + f, h = ".data-api",
            i = {DATA_TOGGLE: '[data-toggle="' + f + '"]'}, j = {INPUT: d + "-input"}, k = {
                CHANGE: "change" + g,
                BLUR: "blur" + g,
                KEYUP: "keyup" + g,
                KEYDOWN: "keydown" + g,
                FOCUS: "focus" + g,
                CLICK_DATA_API: "click" + g + h,
                UPDATE: "update" + g,
                ERROR: "error" + g,
                HIDE: "hide" + g,
                SHOW: "show" + g
            }, l = [{CLASS_NAME: "days", NAV_FUNCTION: "M", NAV_STEP: 1}, {
                CLASS_NAME: "months",
                NAV_FUNCTION: "y",
                NAV_STEP: 1
            }, {CLASS_NAME: "years", NAV_FUNCTION: "y", NAV_STEP: 10}, {
                CLASS_NAME: "decades",
                NAV_FUNCTION: "y",
                NAV_STEP: 100
            }], m = {
                up: 38,
                38: "up",
                down: 40,
                40: "down",
                left: 37,
                37: "left",
                right: 39,
                39: "right",
                tab: 9,
                9: "tab",
                escape: 27,
                27: "escape",
                enter: 13,
                13: "enter",
                pageUp: 33,
                33: "pageUp",
                pageDown: 34,
                34: "pageDown",
                shift: 16,
                16: "shift",
                control: 17,
                17: "control",
                space: 32,
                32: "space",
                t: 84,
                84: "t",
                delete: 46,
                46: "delete"
            }, n = ["times", "days", "months", "years", "decades"], o = {}, p = {}, q = {
                timeZone: "",
                format: !1,
                dayViewHeaderFormat: "MMMM YYYY",
                extraFormats: !1,
                stepping: 1,
                minDate: !1,
                maxDate: !1,
                useCurrent: !0,
                collapse: !0,
                locale: b.locale(),
                defaultDate: !1,
                disabledDates: !1,
                enabledDates: !1,
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down",
                    previous: "fa fa-chevron-left",
                    next: "fa fa-chevron-right",
                    today: "fa fa-calendar-check-o",
                    clear: "fa fa-delete",
                    close: "fa fa-times"
                },
                tooltips: {
                    today: "Go to today",
                    clear: "Clear selection",
                    close: "Close the picker",
                    selectMonth: "Select Month",
                    prevMonth: "Previous Month",
                    nextMonth: "Next Month",
                    selectYear: "Select Year",
                    prevYear: "Previous Year",
                    nextYear: "Next Year",
                    selectDecade: "Select Decade",
                    prevDecade: "Previous Decade",
                    nextDecade: "Next Decade",
                    prevCentury: "Previous Century",
                    nextCentury: "Next Century",
                    pickHour: "Pick Hour",
                    incrementHour: "Increment Hour",
                    decrementHour: "Decrement Hour",
                    pickMinute: "Pick Minute",
                    incrementMinute: "Increment Minute",
                    decrementMinute: "Decrement Minute",
                    pickSecond: "Pick Second",
                    incrementSecond: "Increment Second",
                    decrementSecond: "Decrement Second",
                    togglePeriod: "Toggle Period",
                    selectTime: "Select Time",
                    selectDate: "Select Date"
                },
                useStrict: !1,
                sideBySide: !1,
                daysOfWeekDisabled: !1,
                calendarWeeks: !1,
                viewMode: "days",
                toolbarPlacement: "default",
                buttons: {showToday: !1, showClear: !1, showClose: !1},
                widgetPositioning: {horizontal: "auto", vertical: "auto"},
                widgetParent: null,
                ignoreReadonly: !1,
                keepOpen: !1,
                focusOnShow: !0,
                inline: !1,
                keepInvalid: !1,
                keyBinds: {
                    up: function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") ? this.date(a.clone().subtract(7, "d")) : this.date(a.clone().add(this.stepping(), "m")), !0
                    }, down: function () {
                        if (!this.widget) return this.show(), !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") ? this.date(a.clone().add(7, "d")) : this.date(a.clone().subtract(this.stepping(), "m")), !0
                    }, "control up": function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") ? this.date(a.clone().subtract(1, "y")) : this.date(a.clone().add(1, "h")), !0
                    }, "control down": function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") ? this.date(a.clone().add(1, "y")) : this.date(a.clone().subtract(1, "h")), !0
                    }, left: function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") && this.date(a.clone().subtract(1, "d")), !0
                    }, right: function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") && this.date(a.clone().add(1, "d")), !0
                    }, pageUp: function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") && this.date(a.clone().subtract(1, "M")), !0
                    }, pageDown: function () {
                        if (!this.widget) return !1;
                        var a = this._dates[0] || this.getMoment();
                        return this.widget.find(".datepicker").is(":visible") && this.date(a.clone().add(1, "M")), !0
                    }, enter: function () {
                        return !!this.widget && (this.hide(), !0)
                    }, escape: function () {
                        return !!this.widget && (this.hide(), !0)
                    }, "control space": function () {
                        return !!this.widget && (this.widget.find(".timepicker").is(":visible") && this.widget.find('.btn[data-action="togglePeriod"]').click(), !0)
                    }, t: function () {
                        return !!this.widget && (this.date(this.getMoment()), !0)
                    }, delete: function () {
                        return !!this.widget && (this.clear(), !0)
                    }
                },
                debug: !1,
                allowInputToggle: !1,
                disabledTimeIntervals: !1,
                disabledHours: !1,
                enabledHours: !1,
                viewDate: !1,
                allowMultidate: !1,
                multidateSeparator: ","
            }, r = function () {
                function r(a, b) {
                    c(this, r), this._options = this._getOptions(b), this._element = a, this._dates = [], this._datesFormatted = [], this._viewDate = null, this.unset = !0, this.component = !1, this.widget = !1, this.use24Hours = null, this.actualFormat = null, this.parseFormats = null, this.currentViewMode = null, this.MinViewModeNumber = 0, this._int()
                }

                return r.prototype._int = function () {
                    var b = this._element.data("target-input");
                    this._element.is("input") ? this.input = this._element : void 0 !== b && ("nearest" === b ? this.input = this._element.find("input") : this.input = a(b)), this._dates = [], this._dates[0] = this.getMoment(), this._viewDate = this.getMoment().clone(), a.extend(!0, this._options, this._dataToOptions()), this.options(this._options), this._initFormatting(), void 0 !== this.input && this.input.is("input") && 0 !== this.input.val().trim().length ? this._setValue(this._parseInputDate(this.input.val().trim()), 0) : this._options.defaultDate && void 0 !== this.input && void 0 === this.input.attr("placeholder") && this._setValue(this._options.defaultDate, 0), this._options.inline && this.show()
                }, r.prototype._update = function () {
                    this.widget && (this._fillDate(), this._fillTime())
                }, r.prototype._setValue = function (a, b) {
                    var c = this.unset ? null : this._dates[b], d = "";
                    if (!a) return this._options.allowMultidate && 1 !== this._dates.length ? (d = this._element.data("date") + ",", d = d.replace(c.format(this.actualFormat) + ",", "").replace(",,", "").replace(/,\s*$/, ""), this._dates.splice(b, 1), this._datesFormatted.splice(b, 1)) : (this.unset = !0, this._dates = [], this._datesFormatted = []), void 0 !== this.input && (this.input.val(d), this.input.trigger("input")), this._element.data("date", d), this._notifyEvent({
                        type: r.Event.CHANGE,
                        date: !1,
                        oldDate: c
                    }), void this._update();
                    if (a = a.clone().locale(this._options.locale), this._hasTimeZone() && a.tz(this._options.timeZone), 1 !== this._options.stepping && a.minutes(Math.round(a.minutes() / this._options.stepping) * this._options.stepping).seconds(0), this._isValid(a)) {
                        if (this._dates[b] = a, this._datesFormatted[b] = a.format("YYYY-MM-DD"), this._viewDate = a.clone(), this._options.allowMultidate && this._dates.length > 1) {
                            for (var e = 0; e < this._dates.length; e++) d += "" + this._dates[e].format(this.actualFormat) + this._options.multidateSeparator;
                            d = d.replace(/,\s*$/, "")
                        } else d = this._dates[b].format(this.actualFormat);
                        void 0 !== this.input && (this.input.val(d), this.input.trigger("input")), this._element.data("date", d), this.unset = !1, this._update(), this._notifyEvent({
                            type: r.Event.CHANGE,
                            date: this._dates[b].clone(),
                            oldDate: c
                        })
                    } else this._options.keepInvalid ? this._notifyEvent({
                        type: r.Event.CHANGE,
                        date: a,
                        oldDate: c
                    }) : void 0 !== this.input && (this.input.val("" + (this.unset ? "" : this._dates[b].format(this.actualFormat))), this.input.trigger("input")), this._notifyEvent({
                        type: r.Event.ERROR,
                        date: a,
                        oldDate: c
                    })
                }, r.prototype._change = function (b) {
                    var c = a(b.target).val().trim(), d = c ? this._parseInputDate(c) : null;
                    return this._setValue(d), b.stopImmediatePropagation(), !1
                }, r.prototype._getOptions = function (b) {
                    return b = a.extend(!0, {}, q, b)
                }, r.prototype._hasTimeZone = function () {
                    return void 0 !== b.tz && void 0 !== this._options.timeZone && null !== this._options.timeZone && "" !== this._options.timeZone
                }, r.prototype._isEnabled = function (a) {
                    if ("string" != typeof a || a.length > 1) throw new TypeError("isEnabled expects a single character string parameter");
                    switch (a) {
                        case"y":
                            return this.actualFormat.indexOf("Y") !== -1;
                        case"M":
                            return this.actualFormat.indexOf("M") !== -1;
                        case"d":
                            return this.actualFormat.toLowerCase().indexOf("d") !== -1;
                        case"h":
                        case"H":
                            return this.actualFormat.toLowerCase().indexOf("h") !== -1;
                        case"m":
                            return this.actualFormat.indexOf("m") !== -1;
                        case"s":
                            return this.actualFormat.indexOf("s") !== -1;
                        case"a":
                        case"A":
                            return this.actualFormat.toLowerCase().indexOf("a") !== -1;
                        default:
                            return !1
                    }
                }, r.prototype._hasTime = function () {
                    return this._isEnabled("h") || this._isEnabled("m") || this._isEnabled("s")
                }, r.prototype._hasDate = function () {
                    return this._isEnabled("y") || this._isEnabled("M") || this._isEnabled("d")
                }, r.prototype._dataToOptions = function () {
                    var b = this._element.data(), c = {};
                    return b.dateOptions && b.dateOptions instanceof Object && (c = a.extend(!0, c, b.dateOptions)), a.each(this._options, function (a) {
                        var d = "date" + a.charAt(0).toUpperCase() + a.slice(1);
                        void 0 !== b[d] ? c[a] = b[d] : delete c[a]
                    }), c
                }, r.prototype._notifyEvent = function (a) {
                    a.type === r.Event.CHANGE && (a.date && a.date.isSame(a.oldDate)) || !a.date && !a.oldDate || this._element.trigger(a)
                }, r.prototype._viewUpdate = function (a) {
                    "y" === a && (a = "YYYY"), this._notifyEvent({
                        type: r.Event.UPDATE,
                        change: a,
                        viewDate: this._viewDate.clone()
                    })
                }, r.prototype._showMode = function (a) {
                    this.widget && (a && (this.currentViewMode = Math.max(this.MinViewModeNumber, Math.min(3, this.currentViewMode + a))), this.widget.find(".datepicker > div").hide().filter(".datepicker-" + l[this.currentViewMode].CLASS_NAME).show())
                }, r.prototype._isInDisabledDates = function (a) {
                    return this._options.disabledDates[a.format("YYYY-MM-DD")] === !0
                }, r.prototype._isInEnabledDates = function (a) {
                    return this._options.enabledDates[a.format("YYYY-MM-DD")] === !0
                }, r.prototype._isInDisabledHours = function (a) {
                    return this._options.disabledHours[a.format("H")] === !0
                }, r.prototype._isInEnabledHours = function (a) {
                    return this._options.enabledHours[a.format("H")] === !0
                }, r.prototype._isValid = function (b, c) {
                    if (!b.isValid()) return !1;
                    if (this._options.disabledDates && "d" === c && this._isInDisabledDates(b)) return !1;
                    if (this._options.enabledDates && "d" === c && !this._isInEnabledDates(b)) return !1;
                    if (this._options.minDate && b.isBefore(this._options.minDate, c)) return !1;
                    if (this._options.maxDate && b.isAfter(this._options.maxDate, c)) return !1;
                    if (this._options.daysOfWeekDisabled && "d" === c && this._options.daysOfWeekDisabled.indexOf(b.day()) !== -1) return !1;
                    if (this._options.disabledHours && ("h" === c || "m" === c || "s" === c) && this._isInDisabledHours(b)) return !1;
                    if (this._options.enabledHours && ("h" === c || "m" === c || "s" === c) && !this._isInEnabledHours(b)) return !1;
                    if (this._options.disabledTimeIntervals && ("h" === c || "m" === c || "s" === c)) {
                        var d = !1;
                        if (a.each(this._options.disabledTimeIntervals, function () {
                            if (b.isBetween(this[0], this[1])) return d = !0, !1
                        }), d) return !1
                    }
                    return !0
                }, r.prototype._parseInputDate = function (a) {
                    return void 0 === this._options.parseInputDate ? b.isMoment(a) || (a = this.getMoment(a)) : a = this._options.parseInputDate(a), a
                }, r.prototype._keydown = function (a) {
                    var b = null, c = void 0, d = void 0, e = void 0, f = void 0, g = [], h = {}, i = a.which, j = "p";
                    o[i] = j;
                    for (c in o) o.hasOwnProperty(c) && o[c] === j && (g.push(c), parseInt(c, 10) !== i && (h[c] = !0));
                    for (c in this._options.keyBinds) if (this._options.keyBinds.hasOwnProperty(c) && "function" == typeof this._options.keyBinds[c] && (e = c.split(" "), e.length === g.length && m[i] === e[e.length - 1])) {
                        for (f = !0, d = e.length - 2; d >= 0; d--) if (!(m[e[d]] in h)) {
                            f = !1;
                            break
                        }
                        if (f) {
                            b = this._options.keyBinds[c];
                            break
                        }
                    }
                    b && b.call(this) && (a.stopPropagation(), a.preventDefault())
                }, r.prototype._keyup = function (a) {
                    o[a.which] = "r", p[a.which] && (p[a.which] = !1, a.stopPropagation(), a.preventDefault())
                }, r.prototype._indexGivenDates = function (b) {
                    var c = {}, d = this;
                    return a.each(b, function () {
                        var a = d._parseInputDate(this);
                        a.isValid() && (c[a.format("YYYY-MM-DD")] = !0)
                    }), !!Object.keys(c).length && c
                }, r.prototype._indexGivenHours = function (b) {
                    var c = {};
                    return a.each(b, function () {
                        c[this] = !0
                    }), !!Object.keys(c).length && c
                }, r.prototype._initFormatting = function () {
                    var a = this._options.format || "L LT", b = this;
                    this.actualFormat = a.replace(/(\[[^\[]*])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (a) {
                        return b._dates[0].localeData().longDateFormat(a) || a
                    }), this.parseFormats = this._options.extraFormats ? this._options.extraFormats.slice() : [], this.parseFormats.indexOf(a) < 0 && this.parseFormats.indexOf(this.actualFormat) < 0 && this.parseFormats.push(this.actualFormat), this.use24Hours = this.actualFormat.toLowerCase().indexOf("a") < 1 && this.actualFormat.replace(/\[.*?]/g, "").indexOf("h") < 1, this._isEnabled("y") && (this.MinViewModeNumber = 2), this._isEnabled("M") && (this.MinViewModeNumber = 1), this._isEnabled("d") && (this.MinViewModeNumber = 0), this.currentViewMode = Math.max(this.MinViewModeNumber, this.currentViewMode), this.unset || this._setValue(this._dates[0], 0)
                }, r.prototype._getLastPickedDate = function () {
                    return this._dates[this._getLastPickedDateIndex()]
                }, r.prototype._getLastPickedDateIndex = function () {
                    return this._dates.length - 1
                }, r.prototype.getMoment = function (a) {
                    var c = void 0;
                    return c = void 0 === a || null === a ? b() : this._hasTimeZone() ? b.tz(a, this.parseFormats, this._options.locale, this._options.useStrict, this._options.timeZone) : b(a, this.parseFormats, this._options.locale, this._options.useStrict), this._hasTimeZone() && c.tz(this._options.timeZone), c
                }, r.prototype.toggle = function () {
                    return this.widget ? this.hide() : this.show()
                }, r.prototype.ignoreReadonly = function (a) {
                    if (0 === arguments.length) return this._options.ignoreReadonly;
                    if ("boolean" != typeof a) throw new TypeError("ignoreReadonly () expects a boolean parameter");
                    this._options.ignoreReadonly = a
                }, r.prototype.options = function (b) {
                    if (0 === arguments.length) return a.extend(!0, {}, this._options);
                    if (!(b instanceof Object)) throw new TypeError("options() this.options parameter should be an object");
                    a.extend(!0, this._options, b);
                    var c = this;
                    a.each(this._options, function (a, b) {
                        void 0 !== c[a] && c[a](b)
                    })
                }, r.prototype.date = function (a, c) {
                    if (c = c || 0, 0 === arguments.length) return this.unset ? null : this._options.allowMultidate ? this._dates.join(this._options.multidateSeparator) : this._dates[c].clone();
                    if (!(null === a || "string" == typeof a || b.isMoment(a) || a instanceof Date)) throw new TypeError("date() parameter must be one of [null, string, moment or Date]");
                    this._setValue(null === a ? null : this._parseInputDate(a), c)
                }, r.prototype.format = function (a) {
                    if (0 === arguments.length) return this._options.format;
                    if ("string" != typeof a && ("boolean" != typeof a || a !== !1)) throw new TypeError("format() expects a string or boolean:false parameter " + a);
                    this._options.format = a, this.actualFormat && this._initFormatting()
                }, r.prototype.timeZone = function (a) {
                    if (0 === arguments.length) return this._options.timeZone;
                    if ("string" != typeof a) throw new TypeError("newZone() expects a string parameter");
                    this._options.timeZone = a
                }, r.prototype.dayViewHeaderFormat = function (a) {
                    if (0 === arguments.length) return this._options.dayViewHeaderFormat;
                    if ("string" != typeof a) throw new TypeError("dayViewHeaderFormat() expects a string parameter");
                    this._options.dayViewHeaderFormat = a
                }, r.prototype.extraFormats = function (a) {
                    if (0 === arguments.length) return this._options.extraFormats;
                    if (a !== !1 && !(a instanceof Array)) throw new TypeError("extraFormats() expects an array or false parameter");
                    this._options.extraFormats = a, this.parseFormats && this._initFormatting()
                }, r.prototype.disabledDates = function (b) {
                    if (0 === arguments.length) return this._options.disabledDates ? a.extend({}, this._options.disabledDates) : this._options.disabledDates;
                    if (!b) return this._options.disabledDates = !1, this._update(), !0;
                    if (!(b instanceof Array)) throw new TypeError("disabledDates() expects an array parameter");
                    this._options.disabledDates = this._indexGivenDates(b), this._options.enabledDates = !1, this._update()
                }, r.prototype.enabledDates = function (b) {
                    if (0 === arguments.length) return this._options.enabledDates ? a.extend({}, this._options.enabledDates) : this._options.enabledDates;
                    if (!b) return this._options.enabledDates = !1, this._update(), !0;
                    if (!(b instanceof Array)) throw new TypeError("enabledDates() expects an array parameter");
                    this._options.enabledDates = this._indexGivenDates(b), this._options.disabledDates = !1, this._update()
                }, r.prototype.daysOfWeekDisabled = function (a) {
                    if (0 === arguments.length) return this._options.daysOfWeekDisabled.splice(0);
                    if ("boolean" == typeof a && !a) return this._options.daysOfWeekDisabled = !1, this._update(), !0;
                    if (!(a instanceof Array)) throw new TypeError("daysOfWeekDisabled() expects an array parameter");
                    if (this._options.daysOfWeekDisabled = a.reduce(function (a, b) {
                        return b = parseInt(b, 10), b > 6 || b < 0 || isNaN(b) ? a : (a.indexOf(b) === -1 && a.push(b), a)
                    }, []).sort(), this._options.useCurrent && !this._options.keepInvalid) for (var b = 0; b < this._dates.length; b++) {
                        for (var c = 0; !this._isValid(this._dates[b], "d");) {
                            if (this._dates[b].add(1, "d"), 31 === c) throw"Tried 31 times to find a valid date";
                            c++
                        }
                        this._setValue(this._dates[b], b)
                    }
                    this._update()
                }, r.prototype.maxDate = function (a) {
                    if (0 === arguments.length) return this._options.maxDate ? this._options.maxDate.clone() : this._options.maxDate;
                    if ("boolean" == typeof a && a === !1) return this._options.maxDate = !1, this._update(), !0;
                    "string" == typeof a && ("now" !== a && "moment" !== a || (a = this.getMoment()));
                    var b = this._parseInputDate(a);
                    if (!b.isValid()) throw new TypeError("maxDate() Could not parse date parameter: " + a);
                    if (this._options.minDate && b.isBefore(this._options.minDate)) throw new TypeError("maxDate() date parameter is before this.options.minDate: " + b.format(this.actualFormat));
                    this._options.maxDate = b;
                    for (var c = 0; c < this._dates.length; c++) this._options.useCurrent && !this._options.keepInvalid && this._dates[c].isAfter(a) && this._setValue(this._options.maxDate, c);
                    this._viewDate.isAfter(b) && (this._viewDate = b.clone().subtract(this._options.stepping, "m")), this._update()
                }, r.prototype.minDate = function (a) {
                    if (0 === arguments.length) return this._options.minDate ? this._options.minDate.clone() : this._options.minDate;
                    if ("boolean" == typeof a && a === !1) return this._options.minDate = !1, this._update(), !0;
                    "string" == typeof a && ("now" !== a && "moment" !== a || (a = this.getMoment()));
                    var b = this._parseInputDate(a);
                    if (!b.isValid()) throw new TypeError("minDate() Could not parse date parameter: " + a);
                    if (this._options.maxDate && b.isAfter(this._options.maxDate)) throw new TypeError("minDate() date parameter is after this.options.maxDate: " + b.format(this.actualFormat));
                    this._options.minDate = b;
                    for (var c = 0; c < this._dates.length; c++) this._options.useCurrent && !this._options.keepInvalid && this._dates[c].isBefore(a) && this._setValue(this._options.minDate, c);
                    this._viewDate.isBefore(b) && (this._viewDate = b.clone().add(this._options.stepping, "m")), this._update()
                }, r.prototype.defaultDate = function (a) {
                    if (0 === arguments.length) return this._options.defaultDate ? this._options.defaultDate.clone() : this._options.defaultDate;
                    if (!a) return this._options.defaultDate = !1, !0;
                    "string" == typeof a && (a = "now" === a || "moment" === a ? this.getMoment() : this.getMoment(a));
                    var b = this._parseInputDate(a);
                    if (!b.isValid()) throw new TypeError("defaultDate() Could not parse date parameter: " + a);
                    if (!this._isValid(b)) throw new TypeError("defaultDate() date passed is invalid according to component setup validations");
                    this._options.defaultDate = b, (this._options.defaultDate && this._options.inline || void 0 !== this.input && "" === this.input.val().trim()) && this._setValue(this._options.defaultDate, 0)
                }, r.prototype.locale = function (a) {
                    if (0 === arguments.length) return this._options.locale;
                    if (!b.localeData(a)) throw new TypeError("locale() locale " + a + " is not loaded from moment locales!");
                    this._options.locale = a;
                    for (var c = 0; c < this._dates.length; c++) this._dates[c].locale(this._options.locale);
                    this._viewDate.locale(this._options.locale), this.actualFormat && this._initFormatting(), this.widget && (this.hide(), this.show())
                }, r.prototype.stepping = function (a) {
                    return 0 === arguments.length ? this._options.stepping : (a = parseInt(a, 10), (isNaN(a) || a < 1) && (a = 1), void (this._options.stepping = a))
                }, r.prototype.useCurrent = function (a) {
                    var b = ["year", "month", "day", "hour", "minute"];
                    if (0 === arguments.length) return this._options.useCurrent;
                    if ("boolean" != typeof a && "string" != typeof a) throw new TypeError("useCurrent() expects a boolean or string parameter");
                    if ("string" == typeof a && b.indexOf(a.toLowerCase()) === -1) throw new TypeError("useCurrent() expects a string parameter of " + b.join(", "));
                    this._options.useCurrent = a
                }, r.prototype.collapse = function (a) {
                    if (0 === arguments.length) return this._options.collapse;
                    if ("boolean" != typeof a) throw new TypeError("collapse() expects a boolean parameter");
                    return this._options.collapse === a || (this._options.collapse = a, void (this.widget && (this.hide(), this.show())))
                }, r.prototype.icons = function (b) {
                    if (0 === arguments.length) return a.extend({}, this._options.icons);
                    if (!(b instanceof Object)) throw new TypeError("icons() expects parameter to be an Object");
                    a.extend(this._options.icons, b), this.widget && (this.hide(), this.show())
                }, r.prototype.tooltips = function (b) {
                    if (0 === arguments.length) return a.extend({}, this._options.tooltips);
                    if (!(b instanceof Object)) throw new TypeError("tooltips() expects parameter to be an Object");
                    a.extend(this._options.tooltips, b), this.widget && (this.hide(), this.show())
                }, r.prototype.useStrict = function (a) {
                    if (0 === arguments.length) return this._options.useStrict;
                    if ("boolean" != typeof a) throw new TypeError("useStrict() expects a boolean parameter");
                    this._options.useStrict = a
                }, r.prototype.sideBySide = function (a) {
                    if (0 === arguments.length) return this._options.sideBySide;
                    if ("boolean" != typeof a) throw new TypeError("sideBySide() expects a boolean parameter");
                    this._options.sideBySide = a, this.widget && (this.hide(), this.show())
                }, r.prototype.viewMode = function (a) {
                    if (0 === arguments.length) return this._options.viewMode;
                    if ("string" != typeof a) throw new TypeError("viewMode() expects a string parameter");
                    if (r.ViewModes.indexOf(a) === -1) throw new TypeError("viewMode() parameter must be one of (" + r.ViewModes.join(", ") + ") value");
                    this._options.viewMode = a, this.currentViewMode = Math.max(r.ViewModes.indexOf(a) - 1, this.MinViewModeNumber), this._showMode()
                }, r.prototype.calendarWeeks = function (a) {
                    if (0 === arguments.length) return this._options.calendarWeeks;
                    if ("boolean" != typeof a) throw new TypeError("calendarWeeks() expects parameter to be a boolean value");
                    this._options.calendarWeeks = a, this._update()
                }, r.prototype.buttons = function (b) {
                    if (0 === arguments.length) return a.extend({}, this._options.buttons);
                    if (!(b instanceof Object)) throw new TypeError("buttons() expects parameter to be an Object");
                    if (a.extend(this._options.buttons, b), "boolean" != typeof this._options.buttons.showToday) throw new TypeError("buttons.showToday expects a boolean parameter");
                    if ("boolean" != typeof this._options.buttons.showClear) throw new TypeError("buttons.showClear expects a boolean parameter");
                    if ("boolean" != typeof this._options.buttons.showClose) throw new TypeError("buttons.showClose expects a boolean parameter");
                    this.widget && (this.hide(), this.show())
                }, r.prototype.keepOpen = function (a) {
                    if (0 === arguments.length) return this._options.keepOpen;
                    if ("boolean" != typeof a) throw new TypeError("keepOpen() expects a boolean parameter");
                    this._options.keepOpen = a
                }, r.prototype.focusOnShow = function (a) {
                    if (0 === arguments.length) return this._options.focusOnShow;
                    if ("boolean" != typeof a) throw new TypeError("focusOnShow() expects a boolean parameter");
                    this._options.focusOnShow = a
                }, r.prototype.inline = function (a) {
                    if (0 === arguments.length) return this._options.inline;
                    if ("boolean" != typeof a) throw new TypeError("inline() expects a boolean parameter");
                    this._options.inline = a
                }, r.prototype.clear = function () {
                    this._setValue(null)
                }, r.prototype.keyBinds = function (a) {
                    return 0 === arguments.length ? this._options.keyBinds : void (this._options.keyBinds = a)
                }, r.prototype.debug = function (a) {
                    if ("boolean" != typeof a) throw new TypeError("debug() expects a boolean parameter");
                    this._options.debug = a
                }, r.prototype.allowInputToggle = function (a) {
                    if (0 === arguments.length) return this._options.allowInputToggle;
                    if ("boolean" != typeof a) throw new TypeError("allowInputToggle() expects a boolean parameter");
                    this._options.allowInputToggle = a
                }, r.prototype.keepInvalid = function (a) {
                    if (0 === arguments.length) return this._options.keepInvalid;
                    if ("boolean" != typeof a) throw new TypeError("keepInvalid() expects a boolean parameter");
                    this._options.keepInvalid = a
                }, r.prototype.datepickerInput = function (a) {
                    if (0 === arguments.length) return this._options.datepickerInput;
                    if ("string" != typeof a) throw new TypeError("datepickerInput() expects a string parameter");
                    this._options.datepickerInput = a
                }, r.prototype.parseInputDate = function (a) {
                    if (0 === arguments.length) return this._options.parseInputDate;
                    if ("function" != typeof a) throw new TypeError("parseInputDate() should be as function");
                    this._options.parseInputDate = a
                }, r.prototype.disabledTimeIntervals = function (b) {
                    if (0 === arguments.length) return this._options.disabledTimeIntervals ? a.extend({}, this._options.disabledTimeIntervals) : this._options.disabledTimeIntervals;
                    if (!b) return this._options.disabledTimeIntervals = !1, this._update(), !0;
                    if (!(b instanceof Array)) throw new TypeError("disabledTimeIntervals() expects an array parameter");
                    this._options.disabledTimeIntervals = b, this._update()
                }, r.prototype.disabledHours = function (b) {
                    if (0 === arguments.length) return this._options.disabledHours ? a.extend({}, this._options.disabledHours) : this._options.disabledHours;
                    if (!b) return this._options.disabledHours = !1, this._update(), !0;
                    if (!(b instanceof Array)) throw new TypeError("disabledHours() expects an array parameter");
                    if (this._options.disabledHours = this._indexGivenHours(b), this._options.enabledHours = !1, this._options.useCurrent && !this._options.keepInvalid) for (var c = 0; c < this._dates.length; c++) {
                        for (var d = 0; !this._isValid(this._dates[c], "h");) {
                            if (this._dates[c].add(1, "h"), 24 === d) throw"Tried 24 times to find a valid date";
                            d++
                        }
                        this._setValue(this._dates[c], c)
                    }
                    this._update()
                }, r.prototype.enabledHours = function (b) {
                    if (0 === arguments.length) return this._options.enabledHours ? a.extend({}, this._options.enabledHours) : this._options.enabledHours;
                    if (!b) return this._options.enabledHours = !1, this._update(), !0;
                    if (!(b instanceof Array)) throw new TypeError("enabledHours() expects an array parameter");
                    if (this._options.enabledHours = this._indexGivenHours(b), this._options.disabledHours = !1, this._options.useCurrent && !this._options.keepInvalid) for (var c = 0; c < this._dates.length; c++) {
                        for (var d = 0; !this._isValid(this._dates[c], "h");) {
                            if (this._dates[c].add(1, "h"), 24 === d) throw"Tried 24 times to find a valid date";
                            d++
                        }
                        this._setValue(this._dates[c], c)
                    }
                    this._update()
                }, r.prototype.viewDate = function (a) {
                    if (0 === arguments.length) return this._viewDate.clone();
                    if (!a) return this._viewDate = (this._dates[0] || this.getMoment()).clone(), !0;
                    if (!("string" == typeof a || b.isMoment(a) || a instanceof Date)) throw new TypeError("viewDate() parameter must be one of [string, moment or Date]");
                    this._viewDate = this._parseInputDate(a), this._viewUpdate()
                }, r.prototype.allowMultidate = function (a) {
                    if ("boolean" != typeof a) throw new TypeError("allowMultidate() expects a boolean parameter");
                    this._options.allowMultidate = a
                }, r.prototype.multidateSeparator = function (a) {
                    if (0 === arguments.length) return this._options.multidateSeparator;
                    if ("string" != typeof a || a.length > 1) throw new TypeError("multidateSeparator expects a single character string parameter");
                    this._options.multidateSeparator = a
                }, e(r, null, [{
                    key: "NAME", get: function () {
                        return d
                    }
                }, {
                    key: "DATA_KEY", get: function () {
                        return f
                    }
                }, {
                    key: "EVENT_KEY", get: function () {
                        return g
                    }
                }, {
                    key: "DATA_API_KEY", get: function () {
                        return h
                    }
                }, {
                    key: "DatePickerModes", get: function () {
                        return l
                    }
                }, {
                    key: "ViewModes", get: function () {
                        return n
                    }
                }, {
                    key: "Event", get: function () {
                        return k
                    }
                }, {
                    key: "Selector", get: function () {
                        return i
                    }
                }, {
                    key: "Default", get: function () {
                        return q
                    }, set: function (a) {
                        q = a
                    }
                }, {
                    key: "ClassName", get: function () {
                        return j
                    }
                }]), r
            }();
        return r
    }(jQuery, moment);
    (function (e) {
        var g = e.fn[f.NAME], h = ["top", "bottom", "auto"], i = ["left", "right", "auto"],
            j = ["default", "top", "bottom"], k = function (a) {
                var b = a.data("target"), c = void 0;
                return b || (b = a.attr("href") || "", b = /^#[a-z]/i.test(b) ? b : null), c = e(b), 0 === c.length ? c : (c.data(f.DATA_KEY) || e.extend({}, c.data(), e(this).data()), c)
            }, l = function (g) {
                function k(b, d) {
                    c(this, k);
                    var e = a(this, g.call(this, b, d));
                    return e._init(), e
                }

                return b(k, g), k.prototype._init = function () {
                    if (this._element.hasClass("input-group")) {
                        var a = this._element.find(".datepickerbutton");
                        0 === a.length ? this.component = this._element.find('[data-toggle="datetimepicker"]') : this.component = a
                    }
                }, k.prototype._getDatePickerTemplate = function () {
                    var a = e("<thead>").append(e("<tr>").append(e("<th>").addClass("prev").attr("data-action", "previous").append(e("<span>").addClass(this._options.icons.previous))).append(e("<th>").addClass("picker-switch").attr("data-action", "pickerSwitch").attr("colspan", "" + (this._options.calendarWeeks ? "6" : "5"))).append(e("<th>").addClass("next").attr("data-action", "next").append(e("<span>").addClass(this._options.icons.next)))),
                        b = e("<tbody>").append(e("<tr>").append(e("<td>").attr("colspan", "" + (this._options.calendarWeeks ? "8" : "7"))));
                    return [e("<div>").addClass("datepicker-days").append(e("<table>").addClass("table table-sm").append(a).append(e("<tbody>"))), e("<div>").addClass("datepicker-months").append(e("<table>").addClass("table-condensed").append(a.clone()).append(b.clone())), e("<div>").addClass("datepicker-years").append(e("<table>").addClass("table-condensed").append(a.clone()).append(b.clone())), e("<div>").addClass("datepicker-decades").append(e("<table>").addClass("table-condensed").append(a.clone()).append(b.clone()))]
                }, k.prototype._getTimePickerMainTemplate = function () {
                    var a = e("<tr>"), b = e("<tr>"), c = e("<tr>");
                    return this._isEnabled("h") && (a.append(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        title: this._options.tooltips.incrementHour
                    }).addClass("btn").attr("data-action", "incrementHours").append(e("<span>").addClass(this._options.icons.up)))), b.append(e("<td>").append(e("<span>").addClass("timepicker-hour").attr({
                        "data-time-component": "hours",
                        title: this._options.tooltips.pickHour
                    }).attr("data-action", "showHours"))), c.append(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        title: this._options.tooltips.decrementHour
                    }).addClass("btn").attr("data-action", "decrementHours").append(e("<span>").addClass(this._options.icons.down))))), this._isEnabled("m") && (this._isEnabled("h") && (a.append(e("<td>").addClass("separator")), b.append(e("<td>").addClass("separator").html(":")), c.append(e("<td>").addClass("separator"))), a.append(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        title: this._options.tooltips.incrementMinute
                    }).addClass("btn").attr("data-action", "incrementMinutes").append(e("<span>").addClass(this._options.icons.up)))), b.append(e("<td>").append(e("<span>").addClass("timepicker-minute").attr({
                        "data-time-component": "minutes",
                        title: this._options.tooltips.pickMinute
                    }).attr("data-action", "showMinutes"))), c.append(e("<td>").append(e("<a>").attr({
                        href: "#", tabindex: "-1", title: this._options.tooltips.decrementMinute
                    }).addClass("btn").attr("data-action", "decrementMinutes").append(e("<span>").addClass(this._options.icons.down))))), this._isEnabled("s") && (this._isEnabled("m") && (a.append(e("<td>").addClass("separator")), b.append(e("<td>").addClass("separator").html(":")), c.append(e("<td>").addClass("separator"))), a.append(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        title: this._options.tooltips.incrementSecond
                    }).addClass("btn").attr("data-action", "incrementSeconds").append(e("<span>").addClass(this._options.icons.up)))), b.append(e("<td>").append(e("<span>").addClass("timepicker-second").attr({
                        "data-time-component": "seconds",
                        title: this._options.tooltips.pickSecond
                    }).attr("data-action", "showSeconds"))), c.append(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        title: this._options.tooltips.decrementSecond
                    }).addClass("btn").attr("data-action", "decrementSeconds").append(e("<span>").addClass(this._options.icons.down))))), this.use24Hours || (a.append(e("<td>").addClass("separator")), b.append(e("<td>").append(e("<button>").addClass("btn btn-primary").attr({
                        "data-action": "togglePeriod",
                        tabindex: "-1",
                        title: this._options.tooltips.togglePeriod
                    }))), c.append(e("<td>").addClass("separator"))), e("<div>").addClass("timepicker-picker").append(e("<table>").addClass("table-condensed").append([a, b, c]))
                }, k.prototype._getTimePickerTemplate = function () {
                    var a = e("<div>").addClass("timepicker-hours").append(e("<table>").addClass("table-condensed")),
                        b = e("<div>").addClass("timepicker-minutes").append(e("<table>").addClass("table-condensed")),
                        c = e("<div>").addClass("timepicker-seconds").append(e("<table>").addClass("table-condensed")),
                        d = [this._getTimePickerMainTemplate()];
                    return this._isEnabled("h") && d.push(a), this._isEnabled("m") && d.push(b), this._isEnabled("s") && d.push(c), d
                }, k.prototype._getToolbar = function () {
                    var a = [];
                    if (this._options.buttons.showToday && a.push(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        "data-action": "today",
                        title: this._options.tooltips.today
                    }).append(e("<span>").addClass(this._options.icons.today)))), !this._options.sideBySide && this._hasDate() && this._hasTime()) {
                        var b = void 0, c = void 0;
                        "times" === this._options.viewMode ? (b = this._options.tooltips.selectDate, c = this._options.icons.date) : (b = this._options.tooltips.selectTime, c = this._options.icons.time), a.push(e("<td>").append(e("<a>").attr({
                            href: "#",
                            tabindex: "-1",
                            "data-action": "togglePicker",
                            title: b
                        }).append(e("<span>").addClass(c))))
                    }
                    return this._options.buttons.showClear && a.push(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        "data-action": "clear",
                        title: this._options.tooltips.clear
                    }).append(e("<span>").addClass(this._options.icons.clear)))), this._options.buttons.showClose && a.push(e("<td>").append(e("<a>").attr({
                        href: "#",
                        tabindex: "-1",
                        "data-action": "close",
                        title: this._options.tooltips.close
                    }).append(e("<span>").addClass(this._options.icons.close)))), 0 === a.length ? "" : e("<table>").addClass("table-condensed").append(e("<tbody>").append(e("<tr>").append(a)))
                }, k.prototype._getTemplate = function () {
                    var a = e("<div>").addClass("bootstrap-datetimepicker-widget dropdown-menu"),
                        b = e("<div>").addClass("datepicker").append(this._getDatePickerTemplate()),
                        c = e("<div>").addClass("timepicker").append(this._getTimePickerTemplate()),
                        d = e("<ul>").addClass("list-unstyled"),
                        f = e("<li>").addClass("picker-switch" + (this._options.collapse ? " accordion-toggle" : "")).append(this._getToolbar());
                    return this._options.inline && a.removeClass("dropdown-menu"), this.use24Hours && a.addClass("usetwentyfour"), this._isEnabled("s") && !this.use24Hours && a.addClass("wider"), this._options.sideBySide && this._hasDate() && this._hasTime() ? (a.addClass("timepicker-sbs"), "top" === this._options.toolbarPlacement && a.append(f), a.append(e("<div>").addClass("row").append(b.addClass("col-md-6")).append(c.addClass("col-md-6"))), "bottom" !== this._options.toolbarPlacement && "default" !== this._options.toolbarPlacement || a.append(f), a) : ("top" === this._options.toolbarPlacement && d.append(f), this._hasDate() && d.append(e("<li>").addClass(this._options.collapse && this._hasTime() ? "collapse" : "").addClass(this._options.collapse && this._hasTime() && "times" === this._options.viewMode ? "" : "show").append(b)), "default" === this._options.toolbarPlacement && d.append(f), this._hasTime() && d.append(e("<li>").addClass(this._options.collapse && this._hasDate() ? "collapse" : "").addClass(this._options.collapse && this._hasDate() && "times" === this._options.viewMode ? "show" : "").append(c)), "bottom" === this._options.toolbarPlacement && d.append(f), a.append(d))
                }, k.prototype._place = function (a) {
                    var b = a && a.data && a.data.picker || this, c = b._options.widgetPositioning.vertical,
                        d = b._options.widgetPositioning.horizontal, f = void 0,
                        g = (b.component && b.component.length ? b.component : b._element).position(),
                        h = (b.component && b.component.length ? b.component : b._element).offset();
                    if (b._options.widgetParent) f = b._options.widgetParent.append(b.widget); else if (b._element.is("input")) f = b._element.after(b.widget).parent(); else {
                        if (b._options.inline) return void (f = b._element.append(b.widget));
                        f = b._element, b._element.children().first().after(b.widget)
                    }
                    if ("auto" === c && (c = h.top + 1.5 * b.widget.height() >= e(window).height() + e(window).scrollTop() && b.widget.height() + b._element.outerHeight() < h.top ? "top" : "bottom"), "auto" === d && (d = f.width() < h.left + b.widget.outerWidth() / 2 && h.left + b.widget.outerWidth() > e(window).width() ? "right" : "left"), "top" === c ? b.widget.addClass("top").removeClass("bottom") : b.widget.addClass("bottom").removeClass("top"), "right" === d ? b.widget.addClass("float-right") : b.widget.removeClass("float-right"), "relative" !== f.css("position") && (f = f.parents().filter(function () {
                        return "relative" === e(this).css("position")
                    }).first()), 0 === f.length) throw new Error("datetimepicker component should be placed within a relative positioned container");
                    b.widget.css({
                        top: "top" === c ? "auto" : g.top + b._element.outerHeight() + "px",
                        bottom: "top" === c ? f.outerHeight() - (f === b._element ? 0 : g.top) + "px" : "auto",
                        left: "left" === d ? (f === b._element ? 0 : g.left) + "px" : "auto",
                        right: "left" === d ? "auto" : f.outerWidth() - b._element.outerWidth() - (f === b._element ? 0 : g.left) + "px"
                    })
                }, k.prototype._fillDow = function () {
                    var a = e("<tr>"), b = this._viewDate.clone().startOf("w").startOf("d");
                    for (this._options.calendarWeeks === !0 && a.append(e("<th>").addClass("cw").text("#")); b.isBefore(this._viewDate.clone().endOf("w"));) a.append(e("<th>").addClass("dow").text(b.format("dd"))), b.add(1, "d");
                    this.widget.find(".datepicker-days thead").append(a)
                }, k.prototype._fillMonths = function () {
                    for (var a = [], b = this._viewDate.clone().startOf("y").startOf("d"); b.isSame(this._viewDate, "y");) a.push(e("<span>").attr("data-action", "selectMonth").addClass("month").text(b.format("MMM"))), b.add(1, "M");
                    this.widget.find(".datepicker-months td").empty().append(a)
                }, k.prototype._updateMonths = function () {
                    var a = this.widget.find(".datepicker-months"), b = a.find("th"), c = a.find("tbody").find("span"),
                        d = this;
                    b.eq(0).find("span").attr("title", this._options.tooltips.prevYear), b.eq(1).attr("title", this._options.tooltips.selectYear), b.eq(2).find("span").attr("title", this._options.tooltips.nextYear), a.find(".disabled").removeClass("disabled"), this._isValid(this._viewDate.clone().subtract(1, "y"), "y") || b.eq(0).addClass("disabled"), b.eq(1).text(this._viewDate.year()), this._isValid(this._viewDate.clone().add(1, "y"), "y") || b.eq(2).addClass("disabled"), c.removeClass("active"), this._getLastPickedDate().isSame(this._viewDate, "y") && !this.unset && c.eq(this._getLastPickedDate().month()).addClass("active"), c.each(function (a) {
                        d._isValid(d._viewDate.clone().month(a), "M") || e(this).addClass("disabled")
                    })
                }, k.prototype._getStartEndYear = function (a, b) {
                    var c = a / 10, d = Math.floor(b / a) * a, e = d + 9 * c, f = Math.floor(b / c) * c;
                    return [d, e, f]
                }, k.prototype._updateYears = function () {
                    var a = this.widget.find(".datepicker-years"), b = a.find("th"),
                        c = this._getStartEndYear(10, this._viewDate.year()), d = this._viewDate.clone().year(c[0]),
                        e = this._viewDate.clone().year(c[1]), f = "";
                    for (b.eq(0).find("span").attr("title", this._options.tooltips.prevDecade), b.eq(1).attr("title", this._options.tooltips.selectDecade), b.eq(2).find("span").attr("title", this._options.tooltips.nextDecade), a.find(".disabled").removeClass("disabled"), this._options.minDate && this._options.minDate.isAfter(d, "y") && b.eq(0).addClass("disabled"), b.eq(1).text(d.year() + "-" + e.year()), this._options.maxDate && this._options.maxDate.isBefore(e, "y") && b.eq(2).addClass("disabled"), f += '<span data-action="selectYear" class="year old' + (this._isValid(d, "y") ? "" : " disabled") + '">' + (d.year() - 1) + "</span>"; !d.isAfter(e, "y");) f += '<span data-action="selectYear" class="year' + (d.isSame(this._getLastPickedDate(), "y") && !this.unset ? " active" : "") + (this._isValid(d, "y") ? "" : " disabled") + '">' + d.year() + "</span>", d.add(1, "y");
                    f += '<span data-action="selectYear" class="year old' + (this._isValid(d, "y") ? "" : " disabled") + '">' + d.year() + "</span>", a.find("td").html(f)
                }, k.prototype._updateDecades = function () {
                    var a = this.widget.find(".datepicker-decades"), b = a.find("th"),
                        c = this._getStartEndYear(100, this._viewDate.year()), d = this._viewDate.clone().year(c[0]),
                        e = this._viewDate.clone().year(c[1]), f = !1, g = !1, h = void 0, i = "";
                    for (b.eq(0).find("span").attr("title", this._options.tooltips.prevCentury), b.eq(2).find("span").attr("title", this._options.tooltips.nextCentury), a.find(".disabled").removeClass("disabled"), (0 === d.year() || this._options.minDate && this._options.minDate.isAfter(d, "y")) && b.eq(0).addClass("disabled"), b.eq(1).text(d.year() + "-" + e.year()), this._options.maxDate && this._options.maxDate.isBefore(e, "y") && b.eq(2).addClass("disabled"), i += d.year() - 10 < 0 ? "<span>&nbsp;</span>" : '<span data-action="selectDecade" class="decade old" data-selection="' + (d.year() + 6) + '">' + (d.year() - 10) + "</span>"; !d.isAfter(e, "y");) h = d.year() + 11, f = this._options.minDate && this._options.minDate.isAfter(d, "y") && this._options.minDate.year() <= h, g = this._options.maxDate && this._options.maxDate.isAfter(d, "y") && this._options.maxDate.year() <= h, i += '<span data-action="selectDecade" class="decade' + (this._getLastPickedDate().isAfter(d) && this._getLastPickedDate().year() <= h ? " active" : "") + (this._isValid(d, "y") || f || g ? "" : " disabled") + '" data-selection="' + (d.year() + 6) + '">' + d.year() + "</span>", d.add(10, "y");
                    i += '<span data-action="selectDecade" class="decade old" data-selection="' + (d.year() + 6) + '">' + d.year() + "</span>", a.find("td").html(i)
                }, k.prototype._fillDate = function () {
                    var a = this.widget.find(".datepicker-days"), b = a.find("th"), c = [], d = void 0, f = void 0,
                        g = void 0, h = void 0;
                    if (this._hasDate()) {
                        for (b.eq(0).find("span").attr("title", this._options.tooltips.prevMonth), b.eq(1).attr("title", this._options.tooltips.selectMonth), b.eq(2).find("span").attr("title", this._options.tooltips.nextMonth), a.find(".disabled").removeClass("disabled"), b.eq(1).text(this._viewDate.format(this._options.dayViewHeaderFormat)), this._isValid(this._viewDate.clone().subtract(1, "M"), "M") || b.eq(0).addClass("disabled"), this._isValid(this._viewDate.clone().add(1, "M"), "M") || b.eq(2).addClass("disabled"), d = this._viewDate.clone().startOf("M").startOf("w").startOf("d"), h = 0; h < 42; h++) {
                            if (0 === d.weekday() && (f = e("<tr>"), this._options.calendarWeeks && f.append('<td class="cw">' + d.week() + "</td>"), c.push(f)), g = "", d.isBefore(this._viewDate, "M") && (g += " old"), d.isAfter(this._viewDate, "M") && (g += " new"), this._options.allowMultidate) {
                                var i = this._datesFormatted.indexOf(d.format("YYYY-MM-DD"));
                                i !== -1 && d.isSame(this._datesFormatted[i], "d") && !this.unset && (g += " active")
                            } else d.isSame(this._getLastPickedDate(), "d") && !this.unset && (g += " active");
                            this._isValid(d, "d") || (g += " disabled"), d.isSame(this.getMoment(), "d") && (g += " today"), 0 !== d.day() && 6 !== d.day() || (g += " weekend"), f.append('<td data-action="selectDay" data-day="' + d.format("L") + '" class="day' + g + '">' + d.date() + "</td>"), d.add(1, "d")
                        }
                        a.find("tbody").empty().append(c), this._updateMonths(), this._updateYears(), this._updateDecades()
                    }
                }, k.prototype._fillHours = function () {
                    var a = this.widget.find(".timepicker-hours table"), b = this._viewDate.clone().startOf("d"), c = [],
                        d = e("<tr>");
                    for (this._viewDate.hour() > 11 && !this.use24Hours && b.hour(12); b.isSame(this._viewDate, "d") && (this.use24Hours || this._viewDate.hour() < 12 && b.hour() < 12 || this._viewDate.hour() > 11);) b.hour() % 4 === 0 && (d = e("<tr>"), c.push(d)), d.append('<td data-action="selectHour" class="hour' + (this._isValid(b, "h") ? "" : " disabled") + '">' + b.format(this.use24Hours ? "HH" : "hh") + "</td>"), b.add(1, "h");
                    a.empty().append(c)
                }, k.prototype._fillMinutes = function () {
                    for (var a = this.widget.find(".timepicker-minutes table"), b = this._viewDate.clone().startOf("h"), c = [], d = 1 === this._options.stepping ? 5 : this._options.stepping, f = e("<tr>"); this._viewDate.isSame(b, "h");) b.minute() % (4 * d) === 0 && (f = e("<tr>"), c.push(f)), f.append('<td data-action="selectMinute" class="minute' + (this._isValid(b, "m") ? "" : " disabled") + '">' + b.format("mm") + "</td>"), b.add(d, "m");
                    a.empty().append(c)
                }, k.prototype._fillSeconds = function () {
                    for (var a = this.widget.find(".timepicker-seconds table"), b = this._viewDate.clone().startOf("m"), c = [], d = e("<tr>"); this._viewDate.isSame(b, "m");) b.second() % 20 === 0 && (d = e("<tr>"), c.push(d)), d.append('<td data-action="selectSecond" class="second' + (this._isValid(b, "s") ? "" : " disabled") + '">' + b.format("ss") + "</td>"), b.add(5, "s");
                    a.empty().append(c)
                }, k.prototype._fillTime = function () {
                    var a = void 0, b = void 0, c = this.widget.find(".timepicker span[data-time-component]");
                    this.use24Hours || (a = this.widget.find(".timepicker [data-action=togglePeriod]"), b = this._getLastPickedDate().clone().add(this._getLastPickedDate().hours() >= 12 ? -12 : 12, "h"), a.text(this._getLastPickedDate().format("A")), this._isValid(b, "h") ? a.removeClass("disabled") : a.addClass("disabled")), c.filter("[data-time-component=hours]").text(this._getLastPickedDate().format("" + (this.use24Hours ? "HH" : "hh"))), c.filter("[data-time-component=minutes]").text(this._getLastPickedDate().format("mm")), c.filter("[data-time-component=seconds]").text(this._getLastPickedDate().format("ss")), this._fillHours(), this._fillMinutes(), this._fillSeconds()
                }, k.prototype._doAction = function (a, b) {
                    var c = this._getLastPickedDate();
                    if (e(a.currentTarget).is(".disabled")) return !1;
                    switch (b = b || e(a.currentTarget).data("action")) {
                        case"next":
                            var d = f.DatePickerModes[this.currentViewMode].NAV_FUNCTION;
                            this._viewDate.add(f.DatePickerModes[this.currentViewMode].NAV_STEP, d), this._fillDate(), this._viewUpdate(d);
                            break;
                        case"previous":
                            var g = f.DatePickerModes[this.currentViewMode].NAV_FUNCTION;
                            this._viewDate.subtract(f.DatePickerModes[this.currentViewMode].NAV_STEP, g), this._fillDate(), this._viewUpdate(g);
                            break;
                        case"pickerSwitch":
                            this._showMode(1);
                            break;
                        case"selectMonth":
                            var h = e(a.target).closest("tbody").find("span").index(e(a.target));
                            this._viewDate.month(h), this.currentViewMode === this.MinViewModeNumber ? (this._setValue(c.clone().year(this._viewDate.year()).month(this._viewDate.month()), this._getLastPickedDateIndex()), this._options.inline || this.hide()) : (this._showMode(-1), this._fillDate()), this._viewUpdate("M");
                            break;
                        case"selectYear":
                            var i = parseInt(e(a.target).text(), 10) || 0;
                            this._viewDate.year(i), this.currentViewMode === this.MinViewModeNumber ? (this._setValue(c.clone().year(this._viewDate.year()), this._getLastPickedDateIndex()), this._options.inline || this.hide()) : (this._showMode(-1), this._fillDate()), this._viewUpdate("YYYY");
                            break;
                        case"selectDecade":
                            var j = parseInt(e(a.target).data("selection"), 10) || 0;
                            this._viewDate.year(j), this.currentViewMode === this.MinViewModeNumber ? (this._setValue(c.clone().year(this._viewDate.year()), this._getLastPickedDateIndex()), this._options.inline || this.hide()) : (this._showMode(-1), this._fillDate()), this._viewUpdate("YYYY");
                            break;
                        case"selectDay":
                            var k = this._viewDate.clone();
                            e(a.target).is(".old") && k.subtract(1, "M"), e(a.target).is(".new") && k.add(1, "M");
                            var l = k.date(parseInt(e(a.target).text(), 10)), m = 0;
                            this._options.allowMultidate ? (m = this._datesFormatted.indexOf(l.format("YYYY-MM-DD")), m !== -1 ? this._setValue(null, m) : this._setValue(l, this._getLastPickedDateIndex() + 1)) : this._setValue(l, this._getLastPickedDateIndex()), this._hasTime() || this._options.keepOpen || this._options.inline || this._options.allowMultidate || this.hide();
                            break;
                        case"incrementHours":
                            var n = c.clone().add(1, "h");
                            this._isValid(n, "h") && this._setValue(n, this._getLastPickedDateIndex());
                            break;
                        case"incrementMinutes":
                            var o = c.clone().add(this._options.stepping, "m");
                            this._isValid(o, "m") && this._setValue(o, this._getLastPickedDateIndex());
                            break;
                        case"incrementSeconds":
                            var p = c.clone().add(1, "s");
                            this._isValid(p, "s") && this._setValue(p, this._getLastPickedDateIndex());
                            break;
                        case"decrementHours":
                            var q = c.clone().subtract(1, "h");
                            this._isValid(q, "h") && this._setValue(q, this._getLastPickedDateIndex());
                            break;
                        case"decrementMinutes":
                            var r = c.clone().subtract(this._options.stepping, "m");
                            this._isValid(r, "m") && this._setValue(r, this._getLastPickedDateIndex());
                            break;
                        case"decrementSeconds":
                            var s = c.clone().subtract(1, "s");
                            this._isValid(s, "s") && this._setValue(s, this._getLastPickedDateIndex());
                            break;
                        case"togglePeriod":
                            this._setValue(c.clone().add(c.hours() >= 12 ? -12 : 12, "h"), this._getLastPickedDateIndex());
                            break;
                        case"togglePicker":
                            var t = e(a.target), u = t.closest("a"), v = t.closest("ul"), w = v.find(".show"),
                                x = v.find(".collapse:not(.show)"), y = t.is("span") ? t : t.find("span"), z = void 0;
                            if (w && w.length) {
                                if (z = w.data("collapse"), z && z.transitioning) return !0;
                                w.collapse ? (w.collapse("hide"), x.collapse("show")) : (w.removeClass("show"), x.addClass("show")), y.toggleClass(this._options.icons.time + " " + this._options.icons.date), y.hasClass(this._options.icons.date) ? u.attr("title", this._options.tooltips.selectDate) : u.attr("title", this._options.tooltips.selectTime)
                            }
                            break;
                        case"showPicker":
                            this.widget.find(".timepicker > div:not(.timepicker-picker)").hide(), this.widget.find(".timepicker .timepicker-picker").show();
                            break;
                        case"showHours":
                            this.widget.find(".timepicker .timepicker-picker").hide(), this.widget.find(".timepicker .timepicker-hours").show();
                            break;
                        case"showMinutes":
                            this.widget.find(".timepicker .timepicker-picker").hide(), this.widget.find(".timepicker .timepicker-minutes").show();
                            break;
                        case"showSeconds":
                            this.widget.find(".timepicker .timepicker-picker").hide(), this.widget.find(".timepicker .timepicker-seconds").show();
                            break;
                        case"selectHour":
                            var A = parseInt(e(a.target).text(), 10);
                            this.use24Hours || (c.hours() >= 12 ? 12 !== A && (A += 12) : 12 === A && (A = 0)), this._setValue(c.clone().hours(A), this._getLastPickedDateIndex()), this._isEnabled("a") || this._isEnabled("m") || this._options.keepOpen || this._options.inline ? this._doAction(a, "showPicker") : this.hide();
                            break;
                        case"selectMinute":
                            this._setValue(c.clone().minutes(parseInt(e(a.target).text(), 10)), this._getLastPickedDateIndex()), this._isEnabled("a") || this._isEnabled("s") || this._options.keepOpen || this._options.inline ? this._doAction(a, "showPicker") : this.hide();
                            break;
                        case"selectSecond":
                            this._setValue(c.clone().seconds(parseInt(e(a.target).text(), 10)), this._getLastPickedDateIndex()), this._isEnabled("a") || this._options.keepOpen || this._options.inline ? this._doAction(a, "showPicker") : this.hide();
                            break;
                        case"clear":
                            this.clear();
                            break;
                        case"close":
                            this.hide();
                            break;
                        case"today":
                            var B = this.getMoment();
                            this._isValid(B, "d") && this._setValue(B, this._getLastPickedDateIndex())
                    }
                    return !1
                }, k.prototype.hide = function () {
                    var a = !1;
                    this.widget && (this.widget.find(".collapse").each(function () {
                        var b = e(this).data("collapse");
                        return !b || !b.transitioning || (a = !0, !1)
                    }), a || (this.component && this.component.hasClass("btn") && this.component.toggleClass("active"), this.widget.hide(), e(window).off("resize", this._place()), this.widget.off("click", "[data-action]"), this.widget.off("mousedown", !1), this.widget.remove(), this.widget = !1, this._notifyEvent({
                        type: f.Event.HIDE,
                        date: this._getLastPickedDate().clone()
                    }), void 0 !== this.input && this.input.blur(), this._viewDate = this._getLastPickedDate().clone()))
                }, k.prototype.show = function () {
                    var a = void 0, b = {
                        year: function (a) {
                            return a.month(0).date(1).hours(0).seconds(0).minutes(0)
                        }, month: function (a) {
                            return a.date(1).hours(0).seconds(0).minutes(0)
                        }, day: function (a) {
                            return a.hours(0).seconds(0).minutes(0)
                        }, hour: function (a) {
                            return a.seconds(0).minutes(0)
                        }, minute: function (a) {
                            return a.seconds(0)
                        }
                    };
                    if (void 0 !== this.input) {
                        if (this.input.prop("disabled") || !this._options.ignoreReadonly && this.input.prop("readonly") || this.widget) return;
                        void 0 !== this.input.val() && 0 !== this.input.val().trim().length ? this._setValue(this._parseInputDate(this.input.val().trim()), 0) : this.unset && this._options.useCurrent && (a = this.getMoment(), "string" == typeof this._options.useCurrent && (a = b[this._options.useCurrent](a)), this._setValue(a, 0))
                    } else this.unset && this._options.useCurrent && (a = this.getMoment(), "string" == typeof this._options.useCurrent && (a = b[this._options.useCurrent](a)), this._setValue(a, 0));
                    this.widget = this._getTemplate(), this._fillDow(), this._fillMonths(), this.widget.find(".timepicker-hours").hide(), this.widget.find(".timepicker-minutes").hide(), this.widget.find(".timepicker-seconds").hide(), this._update(), this._showMode(), e(window).on("resize", {picker: this}, this._place), this.widget.on("click", "[data-action]", e.proxy(this._doAction, this)), this.widget.on("mousedown", !1), this.component && this.component.hasClass("btn") && this.component.toggleClass("active"), this._place(), this.widget.show(), void 0 !== this.input && this._options.focusOnShow && !this.input.is(":focus") && this.input.focus(), this._notifyEvent({type: f.Event.SHOW})
                }, k.prototype.destroy = function () {
                    this.hide(), this._element.removeData(f.DATA_KEY), this._element.removeData("date")
                }, k.prototype.disable = function () {
                    this.hide(), this.component && this.component.hasClass("btn") && this.component.addClass("disabled"), void 0 !== this.input && this.input.prop("disabled", !0)
                }, k.prototype.enable = function () {
                    this.component && this.component.hasClass("btn") && this.component.removeClass("disabled"), void 0 !== this.input && this.input.prop("disabled", !1)
                }, k.prototype.toolbarPlacement = function (a) {
                    if (0 === arguments.length) return this._options.toolbarPlacement;
                    if ("string" != typeof a) throw new TypeError("toolbarPlacement() expects a string parameter");
                    if (j.indexOf(a) === -1) throw new TypeError("toolbarPlacement() parameter must be one of (" + j.join(", ") + ") value");
                    this._options.toolbarPlacement = a, this.widget && (this.hide(), this.show())
                }, k.prototype.widgetPositioning = function (a) {
                    if (0 === arguments.length) return e.extend({}, this._options.widgetPositioning);
                    if ("[object Object]" !== {}.toString.call(a)) throw new TypeError("widgetPositioning() expects an object variable");
                    if (a.horizontal) {
                        if ("string" != typeof a.horizontal) throw new TypeError("widgetPositioning() horizontal variable must be a string");
                        if (a.horizontal = a.horizontal.toLowerCase(), i.indexOf(a.horizontal) === -1) throw new TypeError("widgetPositioning() expects horizontal parameter to be one of (" + i.join(", ") + ")");
                        this._options.widgetPositioning.horizontal = a.horizontal
                    }
                    if (a.vertical) {
                        if ("string" != typeof a.vertical) throw new TypeError("widgetPositioning() vertical variable must be a string");
                        if (a.vertical = a.vertical.toLowerCase(), h.indexOf(a.vertical) === -1) throw new TypeError("widgetPositioning() expects vertical parameter to be one of (" + h.join(", ") + ")");
                        this._options.widgetPositioning.vertical = a.vertical
                    }
                    this._update()
                }, k.prototype.widgetParent = function (a) {
                    if (0 === arguments.length) return this._options.widgetParent;
                    if ("string" == typeof a && (a = e(a)), null !== a && "string" != typeof a && !(a instanceof e)) throw new TypeError("widgetParent() expects a string or a jQuery object parameter");
                    this._options.widgetParent = a, this.widget && (this.hide(), this.show())
                }, k._jQueryHandleThis = function (a, b, c) {
                    var g = e(a).data(f.DATA_KEY);
                    if ("object" === ("undefined" == typeof b ? "undefined" : d(b)) && e.extend({}, f.Default, b), g || (g = new k(e(a), b), e(a).data(f.DATA_KEY, g)), "string" == typeof b) {
                        if (void 0 === g[b]) throw new Error('No method named "' + b + '"');
                        return void 0 === c ? g[b]() : g[b](c)
                    }
                }, k._jQueryInterface = function (a, b) {
                    return 1 === this.length ? k._jQueryHandleThis(this[0], a, b) : this.each(function () {
                        k._jQueryHandleThis(this, a, b)
                    })
                }, k
            }(f);
        return e(document).on(f.Event.CLICK_DATA_API, f.Selector.DATA_TOGGLE, function () {
            var a = k(e(this));
            0 !== a.length && l._jQueryInterface.call(a, "toggle")
        }).on(f.Event.CHANGE, "." + f.ClassName.INPUT, function (a) {
            var b = k(e(this));
            0 !== b.length && l._jQueryInterface.call(b, "_change", a)
        }).on(f.Event.BLUR, "." + f.ClassName.INPUT, function (a) {
            var b = k(e(this)), c = b.data(f.DATA_KEY);
            0 !== b.length && (c._options.debug || window.debug || l._jQueryInterface.call(b, "hide", a))
        }).on(f.Event.KEYDOWN, "." + f.ClassName.INPUT, function (a) {
            var b = k(e(this));
            0 !== b.length && l._jQueryInterface.call(b, "_keydown", a)
        }).on(f.Event.KEYUP, "." + f.ClassName.INPUT, function (a) {
            var b = k(e(this));
            0 !== b.length && l._jQueryInterface.call(b, "_keyup", a)
        }).on(f.Event.FOCUS, "." + f.ClassName.INPUT, function (a) {
            var b = k(e(this)), c = b.data(f.DATA_KEY);
            0 !== b.length && c._options.allowInputToggle && l._jQueryInterface.call(b, "show", a)
        }), e.fn[f.NAME] = l._jQueryInterface, e.fn[f.NAME].Constructor = l, e.fn[f.NAME].noConflict = function () {
            return e.fn[f.NAME] = g, l._jQueryInterface
        }, l
    })(jQuery)
}();