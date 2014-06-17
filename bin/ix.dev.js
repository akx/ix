!function(e) {
    if ("object" == typeof exports) module.exports = e(); else if ("function" == typeof define && define.amd) define(e); else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), 
        f.Ix = e();
    }
}(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'");
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, f, f.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(_dereq_, module, exports) {
            (function() {
                var ixtok, ixcore, lenna, DEFAULT_OPTIONS, Ix;
                ixtok = _dereq_("./ixtok");
                ixcore = _dereq_("./ixcore");
                lenna = _dereq_("./ixlenna");
                DEFAULT_OPTIONS = {
                    autosave: true
                };
                Ix = function() {
                    Ix.displayName = "Ix";
                    var prototype = Ix.prototype, constructor = Ix;
                    function Ix(options) {
                        this.options = import$(import$({}, DEFAULT_OPTIONS), options);
                        this.options.autosave = this.options.autosave || !!(typeof window != "undefined" && window !== null && window.localStorage);
                        this.compiler = new ixtok.Compiler();
                        this.core = new ixcore.Core();
                        this.canvas = this.options.canvas || document.createElement("canvas");
                        this._initCodeEditor();
                        this._initImageElement();
                        this._initFileInput();
                    }
                    prototype._initCodeEditor = function() {
                        var self, that, x0$;
                        self = this;
                        if (that = this.options.codeEditor) {
                            x0$ = that;
                            if (this.options.autosave) {
                                x0$.value = window.localStorage.getItem("ixcode") || x0$.value;
                            }
                            x0$.addEventListener("input", function() {
                                self.setCode(this.value);
                            }, false);
                            x0$.addEventListener("change", function() {
                                self.setCode(this.value);
                            }, false);
                            x0$.addEventListener("keypress", function(event) {
                                if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
                                    return self.process();
                                }
                            }, false);
                            self.setCode(x0$.value);
                        }
                    };
                    prototype._initImageElement = function() {
                        var self;
                        self = this;
                        if (!this.options.imageElement) {
                            this.options.imageElement = document.createElement("img");
                        }
                        if (!this.options.imageElement.src) {
                            this.options.imageElement.src = lenna;
                        }
                        this.options.imageElement.addEventListener("load", function() {
                            self.setImage(this);
                        }, false);
                        if (this.options.imageElement.complete) {
                            this.setImage(this.options.imageElement);
                        }
                    };
                    prototype._initFileInput = function() {
                        var self, fi, sr;
                        self = this;
                        if (fi = this.options.fileInput) {
                            fi.addEventListener("change", function() {
                                self.options.imageElement.src = URL.createObjectURL(fi.files[0]);
                            });
                        }
                        if (sr = this.options.saveButton) {
                            sr.addEventListener("click", function() {
                                self.saveImage();
                            });
                        }
                    };
                    prototype.setCode = function(code) {
                        var log, that, exc;
                        if (this.options.autosave) {
                            window.localStorage.setItem("ixcode", code);
                        }
                        try {
                            log = this.core.setCode(this.compiler.compile(code));
                            if (that = this.options.logDiv) {
                                that.textContent = log;
                            }
                        } catch (e$) {
                            exc = e$;
                            if (that = this.options.logDiv) {
                                that.textContent = "error: " + exc;
                            }
                        }
                    };
                    prototype._appendLog = function(text) {
                        var that;
                        if (that = this.options.logDiv) {
                            that.textContent += "\n" + text;
                        }
                    };
                    prototype.setImage = function(image) {
                        var width, height, x0$, x1$, ref$, ref1$;
                        if (!(image != null && image.complete)) {
                            return;
                        }
                        width = image.width, height = image.height;
                        x0$ = document.createElement("canvas");
                        x0$.width = width;
                        x0$.height = height;
                        x1$ = x0$.getContext("2d");
                        x1$.drawImage(image, 0, 0);
                        this.imageData = x1$.getImageData(0, 0, width, height);
                        ref1$ = this.canvas;
                        ref1$.width = (ref$ = this.imageData).width;
                        ref1$.height = ref$.height;
                        this.core.source = this.imageData;
                    };
                    prototype.saveImage = function() {
                        var x0$, link, x1$, event;
                        x0$ = link = document.createElement("a");
                        x0$.href = this.canvas.toDataURL();
                        x0$.download = "ix-" + +new Date() + ".png";
                        x1$ = event = document.createEvent("MouseEvents");
                        x1$.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        link.dispatchEvent(event);
                    };
                    prototype.process = function() {
                        var core, ref$, width, height, ctx, x0$, copy, recur, vars, i$, x1$, ref1$, len$, async, ref2$, appendLog, stepSize, that, start, callback, duration, ref3$;
                        core = this.core;
                        ref$ = this.canvas, width = ref$.width, height = ref$.height;
                        ctx = this.canvas.getContext("2d");
                        ctx.globalCompositeOperation = "copy";
                        x0$ = core.code.options;
                        copy = !!x0$.copy;
                        recur = !!x0$.recur;
                        if (copy || recur) {
                            ctx.putImageData(this.imageData, 0, 0);
                        } else {
                            ctx.fillStyle = "black";
                            ctx.fillRect(0, 0, width, height);
                        }
                        core.source = this.imageData;
                        core.dest = ctx.getImageData(0, 0, width, height);
                        if (recur) {
                            core.source = core.dest;
                        }
                        vars = {};
                        for (i$ = 0, len$ = (ref1$ = this.options.variableInputs || []).length; i$ < len$; ++i$) {
                            x1$ = ref1$[i$];
                            vars[x1$.dataset["var"] || "?"] = 0 | x1$.value;
                        }
                        async = window.requestAnimationFrame && !core.code.options.sync;
                        if ((ref2$ = this.options.codeEditor) != null) {
                            ref2$.readonly = true;
                        }
                        appendLog = bind$(this, "_appendLog");
                        if (async) {
                            core.beginProcessAsync(1e4, vars);
                            stepSize = (that = 0 | core.code.options.stepsize) ? that : core.vars.w * 5 * 5;
                            start = +new Date();
                            callback = function() {
                                var x, to$, done, delay;
                                for (x = 0, to$ = stepSize; x < to$; ++x) {
                                    if (core.step()) {
                                        done = true;
                                        appendLog("finished in " + (+new Date() - start) + " msec");
                                        break;
                                    }
                                }
                                ctx.putImageData(core.dest, 0, 0);
                                if (!done) {
                                    if (delay = 0 | core.code.options.delay) {
                                        return setTimeout(callback, delay);
                                    } else {
                                        return requestAnimationFrame(callback);
                                    }
                                }
                            };
                            callback();
                        } else {
                            duration = core.process(1e4, vars);
                            appendLog("finished in " + duration + " msec");
                        }
                        if ((ref3$ = this.options.codeEditor) != null) {
                            ref3$.readonly = false;
                        }
                        ctx.putImageData(core.dest, 0, 0);
                    };
                    return Ix;
                }();
                module.exports = Ix;
                function import$(obj, src) {
                    var own = {}.hasOwnProperty;
                    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
                    return obj;
                }
                function bind$(obj, key) {
                    return function() {
                        return obj[key].apply(obj, arguments);
                    };
                }
            }).call(this);
        }, {
            "./ixcore": 5,
            "./ixlenna": 6,
            "./ixtok": 9
        } ],
        2: [ function(_dereq_, module, exports) {
            (function() {
                var Bit;
                Bit = function() {
                    Bit.displayName = "Bit";
                    var prototype = Bit.prototype, constructor = Bit;
                    function Bit(number) {
                        this.number = number != null ? number : 0;
                    }
                    prototype.write = function(value, size) {
                        var mask;
                        mask = (1 << size) - 1;
                        value &= mask;
                        this.number = this.number << size | value;
                    };
                    prototype.writeMsb = function(value, destSize, origSize) {
                        value >>= origSize - destSize;
                        this.write(value, destSize);
                    };
                    prototype.read = function(size) {
                        var mask, value;
                        mask = (1 << size) - 1;
                        value = this.number & mask;
                        this.number >>= size;
                        return value;
                    };
                    prototype.readMsb = function(readSize, origSize) {
                        var cvalue, value;
                        cvalue = this.read(readSize);
                        value = cvalue << origSize - readSize;
                        return value;
                    };
                    return Bit;
                }();
                module.exports = Bit;
            }).call(this);
        }, {} ],
        3: [ function(_dereq_, module, exports) {
            (function() {
                var blenders;
                blenders = {
                    none: function(base, adj) {
                        return base;
                    },
                    normal: function(base, adj) {
                        return adj;
                    },
                    add: function(base, adj) {
                        return base + adj;
                    },
                    invert: function(base, adj) {
                        return 255 - (0 | adj) & 255;
                    },
                    darken: function(base, adj) {
                        return Math.min(base, adj);
                    },
                    multiply: function(base, adj) {
                        return base * adj / 255;
                    },
                    colorburn: function(base, adj) {
                        if (adj <= 0) {
                            return 0;
                        } else {
                            return Math.max(255 - (255 - base) * 255 / adj, 0);
                        }
                    },
                    linearburn: function(base, adj) {
                        return Math.max(0, base + adj - 255);
                    },
                    lighten: function(base, adj) {
                        return Math.max(base, adj);
                    },
                    screen: function(base, adj) {
                        return 255 - (255 - base) * (255 - adj) / 255;
                    },
                    colordodge: function(base, adj) {
                        if (adj >= 255) {
                            return 255;
                        } else {
                            return Math.min(base * 255 / (255 - adj), 255);
                        }
                    },
                    lineardodge: function(base, adj) {
                        return Math.min(base + adj, 255);
                    },
                    overlay: function(base, adj) {
                        if (base < 128) {
                            return 2 * base * adj / 255;
                        } else {
                            return 255 - 2 * (255 - base) * (255 - adj) / 255;
                        }
                    },
                    softlight: function(base, adj) {
                        if (base < 128) {
                            return ((adj >> 1) + 64) * base * (2 / 255);
                        } else {
                            return 255 - (191 - (adj >> 1)) * (255 - base) * (2 / 255);
                        }
                    },
                    hardlight: function(base, adj) {
                        if (adj < 128) {
                            return 2 * base * adj / 255;
                        } else {
                            return 255 - 2 * (255 - base) * (255 - adj) / 255;
                        }
                    },
                    difference: function(base, adj) {
                        return Math.abs(base - adj);
                    },
                    exclusion: function(base, adj) {
                        return 255 - ((255 - base) * (255 - adj) / 255 + base * adj / 255);
                    },
                    subtract: function(base, adj) {
                        return Math.max(base - adj, 0);
                    }
                };
                module.exports = blenders;
            }).call(this);
        }, {} ],
        4: [ function(_dereq_, module, exports) {
            (function() {
                var rgb2hsl_l, rgb2hsv_v, rgb2hsv_s, rgb2hsl, rgb2hsv, luminance_x, luminance, hsv2rgb, out$ = typeof exports != "undefined" && exports || this;
                out$.rgb2hsl_l = rgb2hsl_l = function(r, g, b) {
                    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
                };
                out$.rgb2hsv_v = rgb2hsv_v = function(r, g, b) {
                    return Math.max(r, g, b) / 255;
                };
                out$.rgb2hsv_s = rgb2hsv_s = function(r, g, b) {
                    var min, max, delta;
                    min = Math.min(r, g, b) / 255;
                    max = Math.max(r, g, b) / 255;
                    delta = max - min;
                    return delta / max;
                };
                out$.rgb2hsl = rgb2hsl = function(r, g, b) {
                    var min, max, l, s, h;
                    r /= 255;
                    g /= 255;
                    b /= 255;
                    min = Math.min(r, g, b);
                    max = Math.max(r, g, b);
                    l = (max + min) / 2;
                    if (max == min) {
                        s = 0;
                        h = Number.NaN;
                    } else {
                        s = l < .5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
                    }
                    if (r == max) {
                        h = (g - b) / (max - min);
                    } else if (g == max) {
                        h = 2 + (b - r) / (max - min);
                    } else if (b == max) {
                        h = 4 + (r - g) / (max - min);
                    }
                    h /= 6;
                    if (h < 0) {
                        h += 1;
                    }
                    return {
                        h: h,
                        s: s,
                        l: l
                    };
                };
                out$.rgb2hsv = rgb2hsv = function(r, g, b) {
                    var min, max, delta, v, h, s;
                    min = Math.min(r, g, b);
                    max = Math.max(r, g, b);
                    delta = max - min;
                    v = max / 255;
                    if (max == 0) {
                        h = 0;
                        s = 0;
                    } else {
                        s = delta / max;
                        if (r === max) {
                            h = (g - b) / delta;
                        }
                        if (g === max) {
                            h = 2 + (b - r) / delta;
                        }
                        if (b === max) {
                            h = 4 + (r - g) / delta;
                        }
                        h /= 6;
                        if (h < 0) {
                            h += 1;
                        }
                    }
                    return {
                        h: h,
                        s: s,
                        v: v
                    };
                };
                luminance_x = function(x) {
                    x /= 255;
                    if (x <= .03928) {
                        return x / 12.92;
                    }
                    return Math.pow((x + .055) / 1.055, 2.4);
                };
                out$.luminance = luminance = function(r, g, b) {
                    return .2126 * luminance_x(r) + .7152 * luminance_x(g) + .0722 * luminance_x(b);
                };
                out$.hsv2rgb = hsv2rgb = function(h, s, v) {
                    var i, f, p, q, t;
                    v *= 255;
                    if (s <= 0) {
                        return {
                            r: v,
                            g: v,
                            b: v
                        };
                    }
                    h *= 6;
                    while (h < 0) {
                        h += 6;
                    }
                    while (h > 6) {
                        h -= 6;
                    }
                    i = Math.floor(h);
                    f = h - i;
                    p = v * (1 - s);
                    q = v * (1 - s * f);
                    t = v * (1 - s * (1 - f));
                    switch (i) {
                      case 0:
                        return {
                            r: v,
                            g: t,
                            b: p
                        };

                      case 1:
                        return {
                            r: q,
                            g: v,
                            b: p
                        };

                      case 2:
                        return {
                            r: p,
                            g: v,
                            b: t
                        };

                      case 3:
                        return {
                            r: p,
                            g: q,
                            b: v
                        };

                      case 4:
                        return {
                            r: t,
                            g: p,
                            b: v
                        };

                      default:
                        return {
                            r: v,
                            g: p,
                            b: q
                        };
                    }
                };
            }).call(this);
        }, {} ],
        5: [ function(_dereq_, module, exports) {
            (function() {
                var ixops, wrap, ixcolor, ixblend, TIMER_STEP, timer, ref$, arithop, Core, out$ = typeof exports != "undefined" && exports || this;
                ixops = _dereq_("./ixops");
                _dereq_("./ixops_lib");
                wrap = _dereq_("./ixutil").wrap;
                ixcolor = _dereq_("./ixcolor");
                ixblend = _dereq_("./ixblend");
                TIMER_STEP = 5e3;
                timer = typeof window != "undefined" && window !== null && ((ref$ = window.performance) != null && ref$.now) ? function() {
                    return window.performance.now();
                } : function() {
                    return +new Date();
                };
                arithop = function(op, val1, val2, mode, invert) {
                    var ref$, retval;
                    if (invert) {
                        ref$ = [ val1, val2 ], val2 = ref$[0], val1 = ref$[1];
                    }
                    retval = 0;
                    switch (op) {
                      case "add":
                        retval = val1 + val2;
                        break;

                      case "sub":
                        retval = val1 - val2;
                        break;

                      case "mul":
                        retval = val1 * val2;
                        break;

                      case "div":
                        retval = val1 / val2;
                        break;

                      case "mod":
                        retval = val1 % val2;
                        break;

                      case "and":
                        retval = val1 & val2;
                        break;

                      case "or":
                        retval = val1 | val2;
                        break;

                      case "xor":
                        retval = val1 ^ val2;
                        break;

                      case "shl":
                        retval = val1 << val2;
                        break;

                      case "shr":
                        retval = val1 >> val2;
                        break;

                      case "rol":
                        retval = import$(val1, val2);
                        break;

                      case "ror":
                        retval = val1 >>> val2;
                        break;

                      default:
                        throw Error("unimplemented");
                    }
                    return retval;
                };
                out$.Core = Core = function() {
                    Core.displayName = "Core";
                    var prototype = Core.prototype, constructor = Core;
                    function Core() {
                        this.code = null;
                        this.source = null;
                        this.dest = null;
                        this.blend = null;
                        this.vars = {};
                    }
                    prototype.setCode = function(code) {
                        var log;
                        this.code = code;
                        log = code.dump().join("\n");
                        return log;
                    };
                    prototype.setSource = function(source) {
                        this.source = source;
                    };
                    prototype.step = function() {
                        var Vars, ref$, ref1$, sd, dd, w4, roffset, woffset, r, g, b, bl;
                        Vars = this.vars;
                        if (!(0 <= (ref$ = Vars.x) && ref$ < Vars.w && (0 <= (ref1$ = Vars.y) && ref1$ < Vars.h)) || !!Vars.halt) {
                            return true;
                        }
                        if (this.stepCounter++ == TIMER_STEP) {
                            this.stepCounter = 0;
                            if (timer() - this.start >= this.timeLimit) {
                                return true;
                            }
                        }
                        sd = this.source.data;
                        dd = this.dest.data;
                        w4 = Vars.w * 4;
                        roffset = w4 * (0 | Vars.y) + 4 * (0 | Vars.x) + (0 | Vars.roff);
                        if (Vars.rwrap) {
                            roffset = wrap(roffset, sd.length);
                        }
                        Vars.r = sd[roffset];
                        Vars.g = sd[roffset + 1];
                        Vars.b = sd[roffset + 2];
                        Vars.dx = Vars.x;
                        Vars.dy = Vars.y;
                        this.execute(this.timeLimit);
                        if (Vars.xwrap) {
                            Vars.dx = wrap(Vars.dx, Vars.w);
                        }
                        if (Vars.ywrap) {
                            Vars.dy = wrap(Vars.dy, Vars.h);
                        }
                        if (this.code.options.sourcemap) {
                            woffset = roffset;
                            roffset = w4 * (0 | Vars.dy) + 4 * (0 | Vars.dx) + (0 | Vars.woff);
                            Vars.r = sd[roffset];
                            Vars.g = sd[roffset + 1];
                            Vars.b = sd[roffset + 2];
                        } else {
                            woffset = w4 * (0 | Vars.dy) + 4 * (0 | Vars.dx) + (0 | Vars.woff);
                            if (Vars.wwrap) {
                                woffset = wrap(woffset, dd.length);
                            }
                        }
                        if (0 <= woffset && woffset < dd.length - 3) {
                            r = Vars.r, g = Vars.g, b = Vars.b;
                            if (bl = this.blend) {
                                dd[woffset] = bl(dd[woffset], r);
                                dd[woffset + 1] = bl(dd[woffset + 1], g);
                                dd[woffset + 2] = bl(dd[woffset + 2], b);
                            } else {
                                dd[woffset] = r;
                                dd[woffset + 1] = g;
                                dd[woffset + 2] = b;
                            }
                        }
                        Vars.x += 0 | Math.max(1, Vars.xd);
                        if (Vars.x >= Vars.w || Vars.x < 0) {
                            Vars.x = 0;
                            Vars.y += 0 | Math.max(1, Vars.yd);
                        }
                        Vars.step++;
                    };
                    prototype._initialize = function(variables, timeLimit) {
                        this.vars = import$({
                            x: 0,
                            y: 0,
                            xd: 1,
                            yd: 1,
                            w: this.source.width,
                            h: this.source.height,
                            xwrap: 0,
                            ywrap: 0,
                            wwrap: 0,
                            rwrap: 0,
                            step: 0,
                            roff: 0,
                            woff: 0
                        }, variables || {});
                        this.start = timer();
                        this.stepCounter = 0;
                        this.blend = null;
                        return this.timeLimit = timeLimit;
                    };
                    prototype.process = function(timeLimit, variables) {
                        var time;
                        timeLimit == null && (timeLimit = 2e3);
                        variables == null && (variables = null);
                        this._initialize(variables, timeLimit);
                        for (;;) {
                            if (this.step()) {
                                break;
                            }
                        }
                        time = timer() - this.start;
                        console.log("finished in " + time);
                        return time;
                    };
                    prototype.beginProcessAsync = function(timeLimit, variables) {
                        timeLimit == null && (timeLimit = 2e3);
                        variables == null && (variables = null);
                        this._initialize(variables, timeLimit);
                    };
                    prototype.execute = function(timeLimit) {
                        var start, ref$, tok, i$, x0$, ref1$, len$, that, val, j$, x1$, ref2$, len1$, val1, val2, k$, x2$, ref3$, len2$, retval;
                        timeLimit == null && (timeLimit = 100);
                        start = timer();
                        this.stack = [];
                        this.ip = 0;
                        while (0 <= (ref$ = this.ip) && ref$ < this.code.tokens.length) {
                            tok = this.code.tokens[this.ip];
                            this.next = tok.j || this.ip + 1;
                            switch (tok.type) {
                              case "load":
                                this.push(this.load(tok.value));
                                break;

                              case "mload":
                                for (i$ = 0, len$ = (ref1$ = tok.value).length; i$ < len$; ++i$) {
                                    x0$ = ref1$[i$];
                                    this.push(this.load(x0$));
                                }
                                break;

                              case "save":
                                this.save(tok.value, (that = tok["const"]) ? that : this.pop());
                                break;

                              case "msave":
                                val = (that = tok["const"]) ? that : this.pop();
                                for (j$ = 0, len1$ = (ref2$ = tok.value).length; j$ < len1$; ++j$) {
                                    x1$ = ref2$[j$];
                                    this.save(x1$, val);
                                }
                                break;

                              case "augsave":
                                val1 = this.load(tok.value);
                                val2 = this.pop();
                                this.save(tok.value, arithop(tok.op, val1, val2, null, tok.invert));
                                break;

                              case "maugsave":
                                val2 = this.pop();
                                for (k$ = 0, len2$ = (ref3$ = tok.value).length; k$ < len2$; ++k$) {
                                    x2$ = ref3$[k$];
                                    val1 = this.load(x2$);
                                    this.save(x2$, arithop(tok.op, val1, val2, null, tok.invert));
                                }
                                break;

                              case "number":
                                this.push(tok.value);
                                break;

                              case "arith":
                                val2 = tok["const"] || this.pop();
                                val1 = this.pop();
                                this.push(arithop(tok.op, val1, val2, tok.mode, tok.invert));
                                break;

                              case "test":
                                val1 = tok.var1 ? this.load(tok.var1) : this.pop();
                                val2 = (that = tok.var2) ? this.load(that) : tok["const"];
                                retval = false;
                                switch (tok.test) {
                                  case "=":
                                    retval = val1 == val2;
                                    break;

                                  case "<":
                                    retval = val1 < val2;
                                    break;

                                  case ">":
                                    retval = val1 > val2;
                                    break;

                                  case "!":
                                    retval = val1 != val2;
                                    break;

                                  case "&":
                                    retval = !!(val1 & val2);
                                    break;

                                  case "|":
                                    retval = !!(val1 | val2);
                                    break;

                                  case "^":
                                    retval = !!(val1 ^ val2);
                                    break;

                                  case "%":
                                    retval = !!(val1 % val2);
                                    break;

                                  default:
                                    throw Error("unimplemented");
                                }
                                this.next = retval ? tok.jt : tok.jf;
                                break;

                              case "ident":
                                ixops.exec(this, tok.value, tok);
                                break;

                              case "start":
                              case "else":
                              case "end":
                                0;
                                break;

                              default:
                                console.log(this.ip, tok);
                                throw Error("unimplemented");
                            }
                            this.ip = this.next;
                        }
                    };
                    prototype.pop = function() {
                        return this.stack.pop() || 0;
                    };
                    prototype.peek = function() {
                        return this.stack[0] || 0;
                    };
                    prototype.push = function(v) {
                        this.stack.push(v);
                    };
                    prototype.load = function(n) {
                        var v, w2, h2, x, y;
                        v = this.vars;
                        switch (n) {
                          case "top":
                            return this.peek();

                          case "luma":
                            return ixcolor.luminance(v.r, v.g, v.b);

                          case "hue":
                            return ixcolor.rgb2hsv(v.r, v.g, v.b).h;

                          case "sat":
                            return ixcolor.rgb2hsv_s(v.r, v.g, v.b);

                          case "val":
                            return ixcolor.rgb2hsv_v(v.r, v.g, v.b);

                          case "light":
                            return ixcolor.rgb2hsl_l(v.r, v.g, v.b);

                          case "dst":
                            w2 = v.w / 2;
                            h2 = v.h / 2;
                            x = (v.x - w2) / w2;
                            y = (v.y - h2) / h2;
                            return Math.sqrt(x * x + y * y);

                          case "ang":
                            w2 = v.w / 2;
                            h2 = v.h / 2;
                            x = (v.x - w2) / w2;
                            y = (v.y - h2) / h2;
                            return Math.atan2(y, x) / 6.28318530718;

                          default:
                            return 0 | v[n];
                        }
                    };
                    prototype.save = function(n, v) {
                        this.vars[n] = v;
                    };
                    prototype.clear = function() {
                        this.stack = [];
                    };
                    return Core;
                }();
                function import$(obj, src) {
                    var own = {}.hasOwnProperty;
                    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
                    return obj;
                }
            }).call(this);
        }, {
            "./ixblend": 3,
            "./ixcolor": 4,
            "./ixops": 7,
            "./ixops_lib": 8,
            "./ixutil": 10
        } ],
        6: [ function(_dereq_, module, exports) {
            (function() {
                module.exports = "data:image/jpeg;base64,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";
            }).call(this);
        }, {} ],
        7: [ function(_dereq_, module, exports) {
            (function() {
                var ops, matchCache, register, undef, match, exec, out$ = typeof exports != "undefined" && exports || this;
                ops = {};
                matchCache = {};
                out$.register = register = function(name, func) {
                    ops[name] = func;
                };
                undef = function(core, ident) {
                    console.log("unimplemented ident " + ident);
                };
                out$.match = match = function(ident) {
                    var func, that, matches, re, name, ref$;
                    func = null;
                    if (ops[ident]) {
                        return ident;
                    }
                    if (that = matchCache[ident]) {
                        return that;
                    }
                    matches = [];
                    re = new RegExp("^" + ident + ".*", "i");
                    for (name in ref$ = ops) {
                        func = ref$[name];
                        if (re.exec(name)) {
                            matches.push(name);
                            if (matches.length > 1) {
                                break;
                            }
                        }
                    }
                    if (matches.length == 1) {
                        return matchCache[ident] = matches[0];
                    }
                    return matchCache[ident] = null;
                };
                out$.exec = exec = function(core, ident, op) {
                    var func;
                    func = ops[ident];
                    func(core, op["var"], op.num);
                };
            }).call(this);
        }, {} ],
        8: [ function(_dereq_, module, exports) {
            (function() {
                var register, wrap, ixblend, ixbit, ixcolor, M_PI_2, register_wrapped, packimpl, copyLineCore, sample;
                register = _dereq_("./ixops").register;
                wrap = _dereq_("./ixutil").wrap;
                ixblend = _dereq_("./ixblend");
                ixbit = _dereq_("./ixbit");
                ixcolor = _dereq_("./ixcolor");
                M_PI_2 = 6.28318530718;
                register("break", function(core) {
                    core.ip = core.next = -1;
                });
                register("halt", function(core) {
                    core.vars.halt = true;
                });
                register("dup", function(core, arg) {
                    var val, x, to$;
                    if (arg) {
                        val = core.peek();
                        for (x = 1, to$ = 0 | arg; x < to$; ++x) {
                            core.push(val);
                        }
                    } else {
                        core.push(core.peek());
                    }
                });
                register("clear", function(core) {
                    core.clear();
                });
                register("blend", function(core, arg) {
                    core.blend = ixblend[arg] || null;
                });
                register("swap", function(core) {
                    var a, b;
                    a = core.pop();
                    b = core.pop();
                    core.push(a);
                    core.push(b);
                });
                register("swizzle", function(core, arg) {
                    var q, i$, len$, ch, soff, i, len1$, v;
                    if (!arg) {
                        return;
                    }
                    q = [];
                    for (i$ = 0, len$ = arg.length; i$ < len$; ++i$) {
                        ch = arg[i$];
                        q.push(0 | core.stack[core.stack.length - 1 - (0 | ch)]);
                    }
                    soff = core.stack.length - 1;
                    for (i = 0, len1$ = q.length; i < len1$; ++i) {
                        v = q[i];
                        core.stack[soff - i] = v;
                    }
                });
                register("randf", function(core) {
                    core.push(Math.random());
                });
                register("rand8", function(core) {
                    core.push(0 | Math.random() * 256);
                });
                register("rand16", function(core) {
                    core.push(0 | Math.random() * 65536);
                });
                register("abs", function(core) {
                    core.push(Math.abs(core.pop()));
                });
                register("round", function(core) {
                    core.push(0 | Math.round(core.pop()));
                });
                register_wrapped = function(name, func, mul) {
                    register(name + "", function(core, arg$, narg) {
                        var val;
                        val = func(mul * core.pop());
                        if (narg) {
                            val *= parseFloat(narg);
                        }
                        core.push(val);
                    });
                    register("abs" + name, function(core, arg$, narg) {
                        var val;
                        val = Math.abs(func(mul * core.pop()));
                        if (narg) {
                            val *= parseFloat(narg);
                        }
                        core.push(val);
                    });
                };
                register_wrapped("sin", Math.sin, M_PI_2);
                register_wrapped("cos", Math.cos, M_PI_2);
                register_wrapped("tan", Math.tan, M_PI_2);
                register_wrapped("sqrt", Math.sqrt, 1);
                register_wrapped("pow2", function(it) {
                    return it * it;
                }, 1);
                register_wrapped("pow3", function(it) {
                    return it * it * it;
                }, 1);
                packimpl = function(core, spec, value, assignToVars) {
                    var x0$, i, to$, name, size;
                    x0$ = new ixbit(0 | value);
                    for (i = 0, to$ = spec.length; i < to$; i += 2) {
                        name = spec[i];
                        size = 0 | spec[i + 1];
                        if (assignToVars) {
                            core.vars[name] = x0$.readMsb(size, 8);
                        } else {
                            x0$.writeMsb(0 | core.vars[name], size, 8);
                        }
                    }
                    return x0$.number;
                };
                register("pack", function(core, arg) {
                    var value;
                    if (!arg) {
                        arg = "r5g6b5";
                    }
                    value = packimpl(core, arg, 0, false);
                    core.push(value);
                });
                register("unpack", function(core, arg) {
                    if (!arg) {
                        arg = "b5g6r5";
                    }
                    packimpl(core, arg, core.pop(), true);
                });
                register("fromhsv", function(core) {
                    var hue, sat, val, ref$, ref1$;
                    hue = core.pop();
                    sat = core.pop();
                    val = core.pop();
                    ref1$ = ixcolor.hsv2rgb(hue, sat, val), (ref$ = core.vars).r = ref1$.r, ref$.g = ref1$.g, 
                    ref$.b = ref1$.b;
                });
                register("loadvsh", function(core) {
                    var x0$, x1$;
                    x0$ = core.vars;
                    x1$ = ixcolor.rgb2hsv(x0$.r, x0$.g, x0$.b);
                    core.push(x1$.v);
                    core.push(x1$.s);
                    core.push(x1$.h);
                });
                copyLineCore = function(sourceY, source, destY, dest, width, roff, woff) {
                    var bytes, srcOffset, destOffset, i;
                    roff == null && (roff = 0);
                    woff == null && (woff = 0);
                    bytes = width * 4;
                    srcOffset = bytes * sourceY;
                    destOffset = bytes * destY;
                    for (i = 0; i < bytes; ++i) {
                        dest.data[destOffset + i + woff] = source.data[srcOffset + i + roff];
                    }
                };
                register("copyline", function(core) {
                    var sourceY, destY;
                    sourceY = core.pop();
                    destY = core.pop();
                    copyLineCore(sourceY, core.source, destY, core.dest, core.vars.w, core.vars.roff, core.vars.woff);
                });
                sample = function(core, x, y) {
                    var v, d, srcOffset;
                    v = core.vars;
                    d = core.source.data;
                    x = wrap(x, v.w);
                    y = wrap(y, v.h);
                    srcOffset = 0 | v.w * 4 * y + 4 * (0 | x);
                    v.r = d[srcOffset];
                    v.g = d[srcOffset + 1];
                    return v.b = d[srcOffset + 2];
                };
                register("samplex", function(core) {
                    sample(core.vars.x - core.pop(), core.vars.y);
                });
                register("sampley", function(core) {
                    sample(core.vars.x, core.vars.y - core.pop());
                });
                register("samplexy", function(core) {
                    sample(core.vars.x - core.pop(), core.vars.y - core.pop());
                });
            }).call(this);
        }, {
            "./ixbit": 2,
            "./ixblend": 3,
            "./ixcolor": 4,
            "./ixops": 7,
            "./ixutil": 10
        } ],
        9: [ function(_dereq_, module, exports) {
            (function() {
                var Tokenizer, ixops, escapeRegexp, ops, modes, opsRegexpBit, k, modesRegexpBit, ident, makeTokenizer, processJumps, CompiledCode, optimize, Compiler;
                Tokenizer = _dereq_("./tokenizer");
                ixops = _dereq_("./ixops");
                escapeRegexp = function(it) {
                    return it.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                };
                ops = {
                    "+": "add",
                    "-": "sub",
                    "*": "mul",
                    "/": "div",
                    "%": "mod",
                    "&": "and",
                    "|": "or",
                    "^": "xor",
                    "<-<": "rol",
                    ">->": "ror",
                    "<<": "shl",
                    ">>": "shr"
                };
                modes = {
                    "8T": "trunc8",
                    "8W": "wrap8",
                    "16T": "trunc16",
                    "16W": "wrap16"
                };
                opsRegexpBit = "(" + function() {
                    var results$ = [];
                    for (k in ops) {
                        results$.push(escapeRegexp(k));
                    }
                    return results$;
                }().join("|") + ")";
                modesRegexpBit = "(" + function() {
                    var results$ = [];
                    for (k in modes) {
                        results$.push(escapeRegexp(k));
                    }
                    return results$;
                }().join("|") + ")";
                ident = function(it) {
                    var ident;
                    ident = ixops.match(it[1]);
                    if (!ident) {
                        throw new Error("unknown identifier: " + it[1]);
                    }
                    return {
                        type: "ident",
                        value: ident,
                        "var": it[2],
                        num: it[2] ? parseFloat(it[2]) : null
                    };
                };
                makeTokenizer = function() {
                    var x0$, t;
                    x0$ = t = new Tokenizer();
                    x0$.rule(/\s+/);
                    x0$.rule(/#.+?\n/);
                    x0$.rule(/\$([a-z]+)(?:=([a-z0-9]+))?/, function(it) {
                        return {
                            type: "option",
                            name: it[1],
                            value: it[2] || true
                        };
                    });
                    x0$.rule(/0?x([-0-9a-f]+)/i, function(it) {
                        return {
                            type: "number",
                            value: parseInt(it[1], 16)
                        };
                    });
                    x0$.rule(/0?b([-01]+)/i, function(it) {
                        return {
                            type: "number",
                            value: parseInt(it[1], 2)
                        };
                    });
                    x0$.rule(new RegExp(modesRegexpBit + "([-0-9]+)(.)?" + opsRegexpBit), function(it) {
                        return {
                            type: "arith",
                            op: ops[it[4]],
                            invert: it[3] == ".",
                            "const": parseInt(it[2]),
                            mode: modes[it[1]]
                        };
                    });
                    x0$.rule(/([-0-9]+)/i, function(it) {
                        return {
                            type: "number",
                            value: parseInt(it[1], 10)
                        };
                    });
                    x0$.rule(/<([a-z,]+)/i, function(it) {
                        var type, value, res$, i$, x1$, ref$, len$;
                        type = "load";
                        value = it[1];
                        if (value.indexOf(",") > -1) {
                            res$ = [];
                            for (i$ = 0, len$ = (ref$ = value.split(",")).length; i$ < len$; ++i$) {
                                x1$ = ref$[i$];
                                if (x1$.length) {
                                    res$.push(x1$);
                                }
                            }
                            value = res$;
                            type = "mload";
                        }
                        return {
                            type: type,
                            value: value
                        };
                    });
                    x0$.rule(new RegExp(">(.?)" + opsRegexpBit + "([a-z,]+)"), function(it) {
                        var value, type, res$, i$, x1$, ref$, len$;
                        value = it[3];
                        type = "augsave";
                        if (value.indexOf(",") > -1) {
                            res$ = [];
                            for (i$ = 0, len$ = (ref$ = value.split(",")).length; i$ < len$; ++i$) {
                                x1$ = ref$[i$];
                                if (x1$.length) {
                                    res$.push(x1$);
                                }
                            }
                            value = res$;
                            type = "maugsave";
                        }
                        return {
                            type: type,
                            value: value,
                            invert: it[1] == ".",
                            op: ops[it[2]]
                        };
                    });
                    x0$.rule(/>([a-z,]+)/i, function(it) {
                        var value, type, res$, i$, x1$, ref$, len$;
                        value = it[1];
                        type = "save";
                        if (value.indexOf(",") > -1) {
                            res$ = [];
                            for (i$ = 0, len$ = (ref$ = value.split(",")).length; i$ < len$; ++i$) {
                                x1$ = ref$[i$];
                                if (x1$.length) {
                                    res$.push(x1$);
                                }
                            }
                            value = res$;
                            type = "msave";
                        }
                        return {
                            type: type,
                            value: value
                        };
                    });
                    x0$.rule(/([a-z]+)=([-0-9]+)/i, function(it) {
                        return {
                            type: "save",
                            "const": parseInt(it[2]),
                            value: it[1]
                        };
                    });
                    x0$.rule(/\?([a-z]+)\s*([<>=!&^|%])\s*([-0-9]+)/, function(it) {
                        return {
                            type: "test",
                            test: it[2],
                            var1: it[1],
                            "const": parseInt(it[3])
                        };
                    });
                    x0$.rule(/\?([<>=!&^|%])\s*([-0-9]+)/, function(it) {
                        return {
                            type: "test",
                            test: it[1],
                            "const": parseInt(it[2])
                        };
                    });
                    x0$.rule(/\?([a-z]+)\s*([<>=!&^|%])\s*([a-z]+)/i, function(it) {
                        return {
                            type: "test",
                            test: it[2],
                            var1: it[1],
                            var2: it[3]
                        };
                    });
                    x0$.rule(/\?([<>=!&^|%])\s*([a-z]+)/i, function(it) {
                        return {
                            type: "test",
                            test: it[1],
                            "var": it[2]
                        };
                    });
                    x0$.rule(/(else|\\)/i, function() {
                        return {
                            type: "else",
                            value: this.braceStack ? this.braceStack[this.braceStack.length - 1] || null : null
                        };
                    });
                    x0$.rule(/\{/, function() {
                        var v;
                        this.braceId = (0 | this.braceId) + 1;
                        (this.braceStack || (this.braceStack = [])).push(v = "" + this.braceId);
                        return {
                            type: "start",
                            value: v
                        };
                    });
                    x0$.rule(/\}/, function() {
                        return {
                            type: "end",
                            value: this.braceStack.pop()
                        };
                    });
                    x0$.rule(/([a-z][a-z0-9]*):\((.+?)\)/i, ident);
                    x0$.rule(/([a-z][a-z0-9]*)(?::(\S+))?/i, ident);
                    x0$.rule(new RegExp(modesRegexpBit + "(.?)" + opsRegexpBit), function(it) {
                        return {
                            type: "arith",
                            op: ops[it[3]],
                            invert: it[2] == ".",
                            mode: modes[it[1]]
                        };
                    });
                    x0$.rule(new RegExp("(.?)" + opsRegexpBit), function(it) {
                        return {
                            type: "arith",
                            op: ops[it[2]],
                            invert: it[1] == "."
                        };
                    });
                    return t;
                };
                processJumps = function(tokens) {
                    var aat, idx, len$, tok, braceId, endIndex, elseIndex, eidx, to$, ttok, results$ = [];
                    aat = function(index, attr) {
                        var ref$;
                        attr == null && (attr = "type");
                        return (ref$ = tokens[index]) != null ? ref$[attr] : void 8;
                    };
                    for (idx = 0, len$ = tokens.length; idx < len$; ++idx) {
                        tok = tokens[idx];
                        if (tok.type == "test") {
                            tok.jt = -1;
                            tok.jf = -1;
                            if (idx == tokens.length - 1) {
                                continue;
                            }
                            if (aat(idx + 1) == "start") {
                                braceId = aat(idx + 1, "value");
                                endIndex = null;
                                elseIndex = null;
                                for (eidx = idx, to$ = tokens.length; eidx < to$; ++eidx) {
                                    ttok = tokens[eidx];
                                    if (ttok.type == "else" && ttok.value == braceId) {
                                        elseIndex = eidx;
                                    }
                                    if (ttok.type == "end" && ttok.value == braceId) {
                                        endIndex = eidx;
                                        break;
                                    }
                                }
                                if (endIndex == null) {
                                    throw new Error("no end brace found");
                                }
                                tok.jt = idx + 2;
                                if (elseIndex) {
                                    tok.jf = elseIndex + 1;
                                    results$.push(tokens[elseIndex].j = endIndex + 1);
                                } else {
                                    results$.push(tok.jf = endIndex + 1);
                                }
                            } else {
                                tok.jt = idx + 1;
                                if (aat(idx + 2) == "else") {
                                    tok.jf = idx + 3;
                                    results$.push(tokens[idx + 2].j = idx + 4);
                                } else {
                                    results$.push(tok.jf = idx + 2);
                                }
                            }
                        }
                    }
                    return results$;
                };
                CompiledCode = function() {
                    CompiledCode.displayName = "CompiledCode";
                    var prototype = CompiledCode.prototype, constructor = CompiledCode;
                    function CompiledCode(tokens, rest, options) {
                        this.tokens = tokens;
                        this.rest = rest;
                        this.options = options;
                    }
                    prototype.dump = function() {
                        var out, options, st, i, ref$, len$, t, idt, r, ref1$;
                        out = [];
                        out.push(this.tokens.length + " insns.");
                        options = Object.keys(this.options).sort();
                        if (options.length) {
                            out.push("options: " + options.join(", "));
                        }
                        st = 0;
                        for (i = 0, len$ = (ref$ = this.tokens).length; i < len$; ++i) {
                            t = ref$[i];
                            if (t.type == "end") {
                                st--;
                            }
                            if (st < 0) {
                                st = 0;
                            }
                            idt = repeatString$("--", st) + (st ? " " : "");
                            r = "[" + i + "] " + idt + t.type + " ";
                            if (t.value) {
                                r += "v=" + t.value + " ";
                            }
                            if (t.mode) {
                                r += "m=" + t.mode + " ";
                            }
                            if (t["const"]) {
                                r += "c=" + t["const"] + " ";
                            }
                            if (t.op || t.op1) {
                                r += "op1=" + (t.op || t.op1) + " ";
                            }
                            if (t.op2) {
                                r += "op2=" + t.op2 + " ";
                            }
                            if (t.var1 || t["var"]) {
                                r += "var1=" + (t["var"] || t.var1) + " ";
                            }
                            if (t.var2) {
                                r += "var2=" + t.var2 + " ";
                            }
                            if (t.invert) {
                                r += "(invert)";
                            }
                            if (t.jt) {
                                r += "jt=" + t.jt + " ";
                            }
                            if (t.jf) {
                                r += "jf=" + t.jf + " ";
                            }
                            if (t.j) {
                                r += "j=" + t.j + " ";
                            }
                            out.push(r);
                            if (t.type == "start") {
                                st++;
                            }
                        }
                        if ((ref1$ = this.rest) != null && ref1$.length) {
                            out.push("(unparsed:) " + this.rest);
                        }
                        return out;
                    };
                    return CompiledCode;
                }();
                optimize = function(tokensIn) {
                    var tokensOut, idx, ct, nt, pt, ref$, ref1$;
                    tokensOut = [];
                    idx = 0;
                    while (idx < tokensIn.length) {
                        ct = tokensIn[idx];
                        nt = tokensIn[idx + 1];
                        pt = tokensIn[idx - 1];
                        if (ct && nt && ct.type == "number" && nt.type == "arith" && !nt["const"]) {
                            tokensOut.push((ref$ = import$({}, nt), ref$["const"] = ct.value, ref$));
                            idx += 2;
                            continue;
                        }
                        if (ct && pt) {
                            if ((ct.type == "else" || ct.type == "end") && ct.j && !(pt.j || pt.jt || pt.jf)) {
                                pt.j = (ref1$ = ct.j, delete ct.j, ref1$);
                            }
                        }
                        tokensOut.push(ct);
                        idx++;
                    }
                    return tokensOut;
                };
                Compiler = function() {
                    Compiler.displayName = "Compiler";
                    var prototype = Compiler.prototype, constructor = Compiler;
                    function Compiler() {
                        this.tokenizer = makeTokenizer();
                    }
                    prototype.compile = function(source) {
                        var ref$, tokens, rest, options;
                        ref$ = this.tokenizer.scan(source), tokens = ref$.tokens, rest = ref$.rest;
                        options = {};
                        tokens = tokens.filter(function(token) {
                            if (token.type == "option") {
                                options[token.name] = token.value;
                                return false;
                            }
                            return true;
                        });
                        processJumps(tokens);
                        tokens = optimize(tokens);
                        return new CompiledCode(tokens, rest, options);
                    };
                    return Compiler;
                }();
                module.exports.Compiler = Compiler;
                module.exports.makeTokenizer = makeTokenizer;
                function repeatString$(str, n) {
                    for (var r = ""; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
                    return r;
                }
                function import$(obj, src) {
                    var own = {}.hasOwnProperty;
                    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
                    return obj;
                }
            }).call(this);
        }, {
            "./ixops": 7,
            "./tokenizer": 11
        } ],
        10: [ function(_dereq_, module, exports) {
            (function() {
                var wrap, out$ = typeof exports != "undefined" && exports || this;
                out$.wrap = wrap = function(val, max) {
                    while (val < 0) {
                        val += max;
                    }
                    return val % max;
                };
            }).call(this);
        }, {} ],
        11: [ function(_dereq_, module, exports) {
            (function() {
                var Tokenizer;
                Tokenizer = function() {
                    Tokenizer.displayName = "Tokenizer";
                    var prototype = Tokenizer.prototype, constructor = Tokenizer;
                    function Tokenizer() {
                        this.rules = [];
                    }
                    prototype.rule = function(regexp, callback) {
                        var type;
                        if (!regexp.exec) {
                            throw new Error("pass regexps to rule");
                        }
                        if (callback && !callback.call) {
                            if (typeof callback === "string") {
                                type = callback;
                                callback = function(m) {
                                    return {
                                        type: type,
                                        value: m[1] || m[0]
                                    };
                                };
                            } else {
                                type = callback;
                                callback = function(m) {
                                    var ref$;
                                    return ref$ = import$({}, type), ref$.value = m[1] || m[0], ref$;
                                };
                            }
                        }
                        this.rules.push({
                            regexp: regexp,
                            callback: callback
                        });
                        return this;
                    };
                    prototype.scan = function(text) {
                        var tokens, rest, rules, state, next;
                        tokens = [];
                        rest = text;
                        rules = this.rules;
                        state = {};
                        next = function() {
                            var i$, x0$, ref$, len$, ref1$, match, that;
                            for (i$ = 0, len$ = (ref$ = rules).length; i$ < len$; ++i$) {
                                x0$ = ref$[i$];
                                if (((ref1$ = match = x0$.regexp.exec(rest)) != null ? ref1$.index : void 8) == 0) {
                                    rest = rest.substr(match[0].length);
                                    if (that = x0$.callback) {
                                        tokens.push(that.call(state, match));
                                    }
                                    return true;
                                }
                            }
                            return false;
                        };
                        while (rest.length) {
                            if (!next()) {
                                break;
                            }
                        }
                        return {
                            tokens: tokens,
                            rest: rest
                        };
                    };
                    return Tokenizer;
                }();
                module.exports = Tokenizer;
                function import$(obj, src) {
                    var own = {}.hasOwnProperty;
                    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
                    return obj;
                }
            }).call(this);
        }, {} ]
    }, {}, [ 1 ])(1);
});