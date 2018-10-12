(function (g) {
    function t(a, b, d) {
        return "rgba(" + [Math.round(a[0] + (b[0] - a[0]) * d), Math.round(a[1] + (b[1] - a[1]) * d), Math.round(a[2] + (b[2] - a[2]) * d), a[3] + (b[3] - a[3]) * d].join(",") + ")"
    }

    var u = function () {
    }, o = g.getOptions(), i = g.each, p = g.extend, z = g.format, A = g.pick, q = g.wrap, l = g.Chart, n = g.seriesTypes, v = n.pie, m = n.column, w = HighchartsAdapter.fireEvent, x = HighchartsAdapter.inArray, r = [];
    p(o.lang, {drillUpText: "◁ Back to {series.name}"});
    o.drilldown = {
        activeAxisLabelStyle: {
            cursor: "pointer", color: "#0d233a", fontWeight: "bold",
            textDecoration: "underline"
        },
        activeDataLabelStyle: {cursor: "pointer", color: "#0d233a", fontWeight: "bold", textDecoration: "underline"},
        animation: {duration: 500},
        drillUpButton: {position: {align: "right", x: -10, y: 10}}
    };
    g.SVGRenderer.prototype.Element.prototype.fadeIn = function (a) {
        this.attr({opacity: 0.1, visibility: "inherit"}).animate({opacity: A(this.newOpacity, 1)}, a || {duration: 250})
    };
    l.prototype.addSeriesAsDrilldown = function (a, b) {
        this.addSingleSeriesAsDrilldown(a, b);
        this.applyDrilldown()
    };
    l.prototype.addSingleSeriesAsDrilldown =
        function (a, b) {
            var d = a.series, c = d.xAxis, f = d.yAxis, h;
            h = a.color || d.color;
            var e, y = [], g = [], k;
            k = d.levelNumber || 0;
            b = p({color: h}, b);
            e = x(a, d.points);
            i(d.chart.series, function (a) {
                if (a.xAxis === c)y.push(a), g.push(a.userOptions), a.levelNumber = a.levelNumber || k
            });
            h = {
                levelNumber: k,
                seriesOptions: d.userOptions,
                levelSeriesOptions: g,
                levelSeries: y,
                shapeArgs: a.shapeArgs,
                bBox: a.graphic.getBBox(),
                color: h,
                lowerSeriesOptions: b,
                pointOptions: d.options.data[e],
                pointIndex: e,
                oldExtremes: {
                    xMin: c && c.userMin, xMax: c && c.userMax, yMin: f &&
                    f.userMin, yMax: f && f.userMax
                }
            };
            if (!this.drilldownLevels)this.drilldownLevels = [];
            this.drilldownLevels.push(h);
            h = h.lowerSeries = this.addSeries(b, !1);
            h.levelNumber = k + 1;
            if (c)c.oldPos = c.pos, c.userMin = c.userMax = null, f.userMin = f.userMax = null;
            if (d.type === h.type)h.animate = h.animateDrilldown || u, h.options.animation = !0
        };
    l.prototype.applyDrilldown = function () {
        var a = this.drilldownLevels, b;
        if (a && a.length > 0)b = a[a.length - 1].levelNumber, i(this.drilldownLevels, function (a) {
            a.levelNumber === b && i(a.levelSeries, function (a) {
                a.levelNumber ===
                b && a.remove(!1)
            })
        });
        this.redraw();
        this.showDrillUpButton()
    };
    l.prototype.getDrilldownBackText = function () {
        var a = this.drilldownLevels;
        if (a && a.length > 0)return a = a[a.length - 1], a.series = a.seriesOptions, z(this.options.lang.drillUpText, a)
    };
    l.prototype.showDrillUpButton = function () {
        var a = this, b = this.getDrilldownBackText(), d = a.options.drilldown.drillUpButton, c, f;
        this.drillUpButton ? this.drillUpButton.attr({text: b}).align() : (f = (c = d.theme) && c.states, this.drillUpButton = this.renderer.button(b, null, null, function () {
                a.drillUp()
            },
            c, f && f.hover, f && f.select).attr({
                align: d.position.align,
                zIndex: 9
            }).add().align(d.position, !1, d.relativeTo || "plotBox"))
    };
    l.prototype.drillUp = function () {
        for (var a = this, b = a.drilldownLevels, d = b[b.length - 1].levelNumber, c = b.length, f = a.series, h = f.length, e, g, j, k, l = function (b) {
            var c;
            i(f, function (a) {
                a.userOptions === b && (c = a)
            });
            c = c || a.addSeries(b, !1);
            if (c.type === g.type && c.animateDrillupTo)c.animate = c.animateDrillupTo;
            b === e.seriesOptions && (j = c)
        }; c--;)if (e = b[c], e.levelNumber === d) {
            b.pop();
            g = e.lowerSeries;
            if (!g.chart)for (; h--;)if (f[h].options.id ===
                e.lowerSeriesOptions.id) {
                g = f[h];
                break
            }
            g.xData = [];
            i(e.levelSeriesOptions, l);
            w(a, "drillup", {seriesOptions: e.seriesOptions});
            if (j.type === g.type)j.drilldownLevel = e, j.options.animation = a.options.drilldown.animation, g.animateDrillupFrom && g.animateDrillupFrom(e);
            j.levelNumber = d;
            g.remove(!1);
            if (j.xAxis)k = e.oldExtremes, j.xAxis.setExtremes(k.xMin, k.xMax, !1), j.yAxis.setExtremes(k.yMin, k.yMax, !1)
        }
        this.redraw();
        this.drilldownLevels.length === 0 ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({text: this.getDrilldownBackText()}).align();
        r.length = []
    };
    m.prototype.supportsDrilldown = !0;
    m.prototype.animateDrillupTo = function (a) {
        if (!a) {
            var b = this, d = b.drilldownLevel;
            i(this.points, function (a) {
                a.graphic.hide();
                a.dataLabel && a.dataLabel.hide();
                a.connector && a.connector.hide()
            });
            setTimeout(function () {
                i(b.points, function (a, b) {
                    var h = b === (d && d.pointIndex) ? "show" : "fadeIn", e = h === "show" ? !0 : void 0;
                    a.graphic[h](e);
                    if (a.dataLabel)a.dataLabel[h](e);
                    if (a.connector)a.connector[h](e)
                })
            }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));
            this.animate =
                u
        }
    };
    m.prototype.animateDrilldown = function (a) {
        var b = this, d = this.chart.drilldownLevels, c = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1].shapeArgs, f = this.chart.options.drilldown.animation;
        if (!a)i(d, function (a) {
            if (b.userOptions === a.lowerSeriesOptions)c = a.shapeArgs
        }), c.x += this.xAxis.oldPos - this.xAxis.pos, i(this.points, function (a) {
            a.graphic && a.graphic.attr(c).animate(a.shapeArgs, f);
            a.dataLabel && a.dataLabel.fadeIn(f)
        }), this.animate = null
    };
    m.prototype.animateDrillupFrom = function (a) {
        var b =
            this.chart.options.drilldown.animation, d = this.group, c = this;
        i(c.trackerGroups, function (a) {
            if (c[a])c[a].on("mouseover")
        });
        delete this.group;
        i(this.points, function (c) {
            var h = c.graphic, e = g.Color(c.color).rgba, i = g.Color(a.color).rgba, j = function () {
                h.destroy();
                d && (d = d.destroy())
            };
            h && (delete c.graphic, b ? h.animate(a.shapeArgs, g.merge(b, {
                step: function (a, b) {
                    b.prop === "start" && e.length === 4 && i.length === 4 && this.attr({fill: t(e, i, b.pos)})
                }, complete: j
            })) : (h.attr(a.shapeArgs), j()))
        })
    };
    v && p(v.prototype, {
        supportsDrilldown: !0,
        animateDrillupTo: m.prototype.animateDrillupTo,
        animateDrillupFrom: m.prototype.animateDrillupFrom,
        animateDrilldown: function (a) {
            var b = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], d = this.chart.options.drilldown.animation, c = b.shapeArgs, f = c.start, h = (c.end - f) / this.points.length, e = g.Color(b.color).rgba;
            if (!a)i(this.points, function (a, b) {
                var i = g.Color(a.color).rgba;
                a.graphic.attr(g.merge(c, {
                    start: f + b * h,
                    end: f + (b + 1) * h
                }))[d ? "animate" : "attr"](a.shapeArgs, g.merge(d, {
                    step: function (a, b) {
                        b.prop ===
                        "start" && e.length === 4 && i.length === 4 && this.attr({fill: t(e, i, b.pos)})
                    }
                }))
            }), this.animate = null
        }
    });
    g.Point.prototype.doDrilldown = function (a) {
        for (var b = this.series.chart, d = b.options.drilldown, c = (d.series || []).length, f; c-- && !f;)d.series[c].id === this.drilldown && x(this.drilldown, r) === -1 && (f = d.series[c], r.push(this.drilldown));
        w(b, "drilldown", {point: this, seriesOptions: f});
        f && (a ? b.addSingleSeriesAsDrilldown(this, f) : b.addSeriesAsDrilldown(this, f))
    };
    q(g.Point.prototype, "init", function (a, b, d, c) {
        var f = a.call(this,
            b, d, c), h = b.chart, e = (a = b.xAxis && b.xAxis.ticks[c]) && a.label;
        if (f.drilldown) {
            if (g.addEvent(f, "click", function () {
                    f.doDrilldown()
                }), e) {
                if (!e.basicStyles)e.basicStyles = g.merge(e.styles);
                e.addClass("highcharts-drilldown-axis-label").css(h.options.drilldown.activeAxisLabelStyle).on("click", function () {
                    i(e.ddPoints, function (a) {
                        a.doDrilldown && a.doDrilldown(!0)
                    });
                    h.applyDrilldown()
                });
                if (!e.ddPoints)e.ddPoints = [];
                e.ddPoints.push(f)
            }
        } else if (e && e.basicStyles)e.styles = {}, e.css(e.basicStyles);
        return f
    });
    q(g.Series.prototype,
        "drawDataLabels", function (a) {
            var b = this.chart.options.drilldown.activeDataLabelStyle;
            a.call(this);
            i(this.points, function (a) {
                if (a.drilldown && a.dataLabel)a.dataLabel.attr({"class": "highcharts-drilldown-data-label"}).css(b).on("click", function () {
                    a.doDrilldown()
                })
            })
        });
    var s, o = function (a) {
        a.call(this);
        i(this.points, function (a) {
            a.drilldown && a.graphic && a.graphic.attr({"class": "highcharts-drilldown-point"}).css({cursor: "pointer"})
        })
    };
    for (s in n)n[s].prototype.supportsDrilldown && q(n[s].prototype, "drawTracker",
        o)
})(Highcharts);
