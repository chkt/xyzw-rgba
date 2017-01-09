'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math = require('xyzw/es5/Math');

var _Math2 = _interopRequireDefault(_Math);

var _Vector2 = require('xyzw/es5/Vector3');

var _Vector3 = _interopRequireDefault(_Vector2);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

var _hsl = require('./hsl');

var hsl = _interopRequireWildcard(_hsl);

var _convertRGB = require('./convertRGB');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * RGB three component vector representation
 */
var Vector3RGB = function (_Vector) {
	_inherits(Vector3RGB, _Vector);

	function Vector3RGB() {
		_classCallCheck(this, Vector3RGB);

		return _possibleConstructorReturn(this, (Vector3RGB.__proto__ || Object.getPrototypeOf(Vector3RGB)).apply(this, arguments));
	}

	_createClass(Vector3RGB, [{
		key: 'toCSS',


		/**
   * Returns a css representation of the instance
   * @param {bool} [fast=false] - True if string should be generated fast, false if generated string should be small
   * @returns {string}
   */
		value: function toCSS() {
			var fast = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			var n = this.n;

			var rgba = [(0, _convertRGB.floatToInt)(n[0]), (0, _convertRGB.floatToInt)(n[1]), (0, _convertRGB.floatToInt)(n[2]), 1.0];

			if (fast) return 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';

			return css.stringify({
				type: 'rgb',
				components: rgba
			});
		}

		/**
   * Returns a 0xrrggbb hex encoded integer representation of the instance
   * @returns {int}
   */

	}, {
		key: 'toInt',
		value: function toInt() {
			var n = this.n;

			return (0, _convertRGB.floatToInt)(n[0]) << 16 | (0, _convertRGB.floatToInt)(n[1]) << 8 | (0, _convertRGB.floatToInt)(n[2]);
		}

		/**
   * Returns a css representation of the instance
   * @returns {string}
   */

	}, {
		key: 'toString',
		value: function toString() {
			return this.toCSS();
		}

		/**
   * Returns a rrggbb hex encoded representation of the instance
   * @returns {int}
   */

	}, {
		key: 'valueOf',
		value: function valueOf() {
			return this.toInt();
		}
	}, {
		key: 'r',


		/**
   * The r component
   * Alias of {@link Vector3#x}
   * @type {number}
   */
		get: function get() {
			return (0, _convertRGB.floatToInt)(this.n[0]);
		},
		set: function set(n) {
			this.n[0] = (0, _convertRGB.intToFloat)(n);
		}

		/**
   * The g component
   * Alias of {@link Vector3#y}
   * @type {number}
   */

	}, {
		key: 'g',
		get: function get() {
			return (0, _convertRGB.floatToInt)(this.n[1]);
		},
		set: function set(n) {
			this.n[1] = (0, _convertRGB.intToFloat)(n);
		}

		/**
   * The b component
   * Alias of {@link Vector3#z}
   * @type {number}
   */

	}, {
		key: 'b',
		get: function get() {
			return (0, _convertRGB.floatToInt)(this.n[2]);
		},
		set: function set(n) {
			this.n[2] = (0, _convertRGB.intToFloat)(n);
		}
	}], [{
		key: 'Define',


		/**
   * Returns a new instance
   * @param {number[]} n - The components
   * @param {Vector3RGB} [target] - The target instance
   * @returns {Vector3RGB}
   */
		value: function Define(n) {
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			if (target === undefined) target = new this(n);else this.call(target, n);

			return target;
		}

		/**
   * Returns an instance representing string
   * @param {string} string - The css color string
   * @param {Vector3} matte - The transparency matte vector
   * @param {Vector3RGB} [target] - The target instance
   * @returns {Vector3RGB}
   */

	}, {
		key: 'CSS',
		value: function CSS(string) {
			var matte = arguments.length <= 1 || arguments[1] === undefined ? new _Vector3.default([1.0, 1.0, 1.0]) : arguments[1];
			var target = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

			var _css$parse = css.parse(string);

			var type = _css$parse.type;
			var components = _css$parse.components;

			var a = components.pop();
			var rgb = type === 'rgb' ? (0, _convertRGB.intIntIntToFloat)(components) : hsl.hslToRgb((0, _convertRGB.degPctPctToFloat)(components));
			var mn = matte.n;

			return this.Define([_Math2.default.mix(mn[0], rgb[0], a), _Math2.default.mix(mn[1], rgb[1], a), _Math2.default.mix(mn[2], rgb[2], a)], target);
		}

		/**
   * Returns an instance representing 0xrrggbb hex encoded i
   * @param {int} i - The bit encoded Int
   * @param {Vector3} [target] - The target instance
   * @returns {Vector3RGB}
   */

	}, {
		key: 'Int',
		value: function Int(i) {
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			return this.Define([(0, _convertRGB.intToFloat)(i >> 16 & 0xff), (0, _convertRGB.intToFloat)(i >> 8 & 0xff), (0, _convertRGB.intToFloat)(i & 0xff)], target);
		}
	}]);

	return Vector3RGB;
}(_Vector3.default);

exports.default = Vector3RGB;