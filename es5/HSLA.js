'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math = require('xyzw/es5/Math');

var _Math2 = _interopRequireDefault(_Math);

var _Vector = require('xyzw/es5/Vector3');

var _Vector2 = _interopRequireDefault(_Vector);

var _Vector3RGB = require('./Vector3RGB');

var _Vector3RGB2 = _interopRequireDefault(_Vector3RGB);

var _Vector4RGBA = require('./Vector4RGBA');

var _Vector4RGBA2 = _interopRequireDefault(_Vector4RGBA);

var _hsl = require('./hsl');

var hsl = _interopRequireWildcard(_hsl);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

var _convertRGB = require('./convertRGB');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * HSLA color model transform
 */
var HSLA = function () {
	_createClass(HSLA, null, [{
		key: 'Define',


		/**
   * Returns a defined instance
   * @param {number} h - The hue in radians
   * @param {number} s - The saturation
   * @param {number} l - The luminosity
   * @param {number} a - The alpha
   * @param {HSLA} [target] - The target instance
   * @returns {HSLA}
   */
		value: function Define(h, s, l, a, target) {
			if (target === undefined) target = new this(h, s, l, a);else this.call(target, h, s, l, a);

			return target;
		}

		/**
   * Returns an instance representing v
   * @param {Vector4} v - The source rgba vector
   * @param {HSLA} [target] - The target instance
   * @returns {HSLA}
   */

	}, {
		key: 'RGBA',
		value: function RGBA(v, target) {
			var _hsl$rgbToHsl = hsl.rgbToHsl(v.n.slice(0, 3));

			var _hsl$rgbToHsl2 = _slicedToArray(_hsl$rgbToHsl, 3);

			var h = _hsl$rgbToHsl2[0];
			var s = _hsl$rgbToHsl2[1];
			var l = _hsl$rgbToHsl2[2];


			return this.Define(h, s, l, v.n[3], target);
		}

		/**
   * Returns an instance representing v
   * @param {Vector3} v - The source rgb vector
   * @param {HSLA} [target] - The target instance
   * @returns {HSLA}
   */

	}, {
		key: 'RGB',
		value: function RGB(v, target) {
			var _hsl$rgbToHsl3 = hsl.rgbToHsl(v.n);

			var _hsl$rgbToHsl4 = _slicedToArray(_hsl$rgbToHsl3, 3);

			var h = _hsl$rgbToHsl4[0];
			var s = _hsl$rgbToHsl4[1];
			var l = _hsl$rgbToHsl4[2];


			return this.Define(h, s, l, 1.0, target);
		}

		/**
   * Returns the copy of source
   * @param {HSLA} source - The source instance
   * @param {HSLA} [target] - The target instance
   * @returns {HSLA}
   */

	}, {
		key: 'Copy',
		value: function Copy(source, target) {
			return this.Define(source.h, source.s, source.l, source.a, target);
		}

		/**
   * Returns true if a == b, false otherwise
   * @param {HSLA} a
   * @param {HSLA} b
   * @returns {boolean}
   */

	}, {
		key: 'isEQ',
		value: function isEQ(a, b) {
			return a === b || a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
		}

		/**
   * Creates a new instance
   * @param {number} h - The hue in radians
   * @param {number} s - The saturation
   * @param {number} l - The luminosity
   * @param {number} a - The alpha
   */

	}]);

	function HSLA(h, s, l, a) {
		_classCallCheck(this, HSLA);

		/**
   * The hue
   * @type {number}
   */
		this.h = h;
		/**
   * The saturation
   * @type {number}
   */
		this.s = s;
		/**
   * The luminosity
   * @type {number}
   */
		this.l = l;
		/**
   * The alpha
   * @type {number}
   */
		this.a = a;
	}

	/**
  * Redefines the instance
  * @param {number} h - The hue in radians
  * @param {number} s - The saturation
  * @param {number} l - The luminosity
  * @param {number} a - The alpha
  * @returns {HSLA}
  */


	_createClass(HSLA, [{
		key: 'define',
		value: function define(h, s, l, a) {
			this.constructor.call(this, h, s, l, a);

			return this;
		}

		/**
   * The chroma
   * @type {number}
   */

	}, {
		key: 'copyOf',


		/**
   * The copy of source
   * @param {HSLA} source - The source instance
   * @returns {HSLA}
   */
		value: function copyOf(source) {
			this.h = source.h;
			this.s = source.s;
			this.l = source.l;
			this.a = source.a;

			return this;
		}

		/**
   * Returns a Vector4 rgba representation of the instance
   * @param {Vector4} [target] - the target vector
   * @returns {Vector4}
   */

	}, {
		key: 'toRGBA',
		value: function toRGBA(target) {
			var rgb = hsl.hslToRgb([this.h, this.s, this.l]);

			if (target === undefined) target = new _Vector4RGBA2.default();

			target.n = [].concat(_toConsumableArray(rgb), [this.a]);

			return target;
		}

		/**
   * Returns a Vector3 rgb representation of the instance
   * @param {Vector3} [matte] - The alpha matte rgb vector
   * @param {Vector3} [target] - The target vector
   * @returns {Vector3}
   */

	}, {
		key: 'toRGB',
		value: function toRGB() {
			var matte = arguments.length <= 0 || arguments[0] === undefined ? new _Vector2.default([1.0, 1.0, 1.0]) : arguments[0];
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			var rgb = hsl.hslToRgb([this.h, this.s, this.l]),
			    a = this.a;
			var mn = matte.n;

			if (target === undefined) target = new _Vector3RGB2.default();

			target.n = [_Math2.default.mix(mn[0], rgb[0], a), _Math2.default.mix(mn[1], rgb[1], a), _Math2.default.mix(mn[2], rgb[2], a)];

			return target;
		}

		/**
   * Returns a css-formated hsl or hsla representation of the instance
   * @returns {string}
   */

	}, {
		key: 'toCSS',
		value: function toCSS() {
			var hsl = (0, _convertRGB.floatToDegPctPct)([this.h, this.s, this.l]);

			return css.stringify({
				type: 'hsl',
				components: [].concat(_toConsumableArray(hsl), [this.a])
			});
		}

		/**
   * Returns a string representation of the instance
   * @returns {string}
   */

	}, {
		key: 'toString',
		value: function toString() {
			return this.toCSS();
		}
	}, {
		key: 'chroma',
		get: function get() {
			return hsl.chroma(this.s, this.l);
		}
	}]);

	return HSLA;
}();

exports.default = HSLA;