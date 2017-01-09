'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math = require('xyzw/es5/Math');

var _Math2 = _interopRequireDefault(_Math);

var _Vector2 = require('xyzw/es5/Vector4');

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
 * RGBA Four component vector representation
 */
var Vector4RGBA = function (_Vector) {
	_inherits(Vector4RGBA, _Vector);

	function Vector4RGBA() {
		_classCallCheck(this, Vector4RGBA);

		return _possibleConstructorReturn(this, (Vector4RGBA.__proto__ || Object.getPrototypeOf(Vector4RGBA)).apply(this, arguments));
	}

	_createClass(Vector4RGBA, [{
		key: 'toCSS',


		/**
   * Returns a css color string representation of the instance
   * @returns {string}
   */
		value: function toCSS() {
			var n = this.n;

			return css.stringify({
				type: 'rgb',
				components: [(0, _convertRGB.floatToInt)(n[0]), (0, _convertRGB.floatToInt)(n[1]), (0, _convertRGB.floatToInt)(n[2]), _Math2.default.clamp(n[3], 0.0, 1.0)]
			});
		}

		/**
   * Returns a 0xaarrggbb hex encoded integer representation of the instance
   * @returns {int}
   */

	}, {
		key: 'toInt',
		value: function toInt() {
			var n = this.n;

			return (0, _convertRGB.floatToInt)(n[3]) << 24 | (0, _convertRGB.floatToInt)(n[0]) << 16 | (0, _convertRGB.floatToInt)(n[1]) << 8 | (0, _convertRGB.floatToInt)(n[2]);
		}

		/**
   * Returns a css color string representation of the instance
   * @returns {string}
   */

	}, {
		key: 'toString',
		value: function toString() {
			return this.toCSS();
		}

		/**
   * Returns a aarrggbb hex encoded int representation of the instance
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
   * Alias of {@link Vector4#x}
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
   * Alias of {@link Vector4#y}
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
   * Alias of {@link Vector4#z}
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

		/**
   * The a component
   * Alias of {@link Vector4#w}
   * @type {number}
   */

	}, {
		key: 'a',
		get: function get() {
			return this.n[3];
		},
		set: function set(n) {
			this.n[3] = n;
		}
	}], [{
		key: 'Define',


		/**
   * Returns a defined instance
   * @param {number[]} n - The components
   * @param {Vector4RGBA} target - The target instance
   * @returns {Vector4RGBA}
   */
		value: function Define(n) {
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			if (target === undefined) target = new this(n);else this.call(target, n);

			return target;
		}

		/**
   * Returns an instance representing string
   * @param {string} string - The css color string
   * @param {Vector4RGBA} [target] - The target instance
   * @returns {Vector4RGBA}
   */

	}, {
		key: 'CSS',
		value: function CSS(string) {
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			var _css$parse = css.parse(string);

			var type = _css$parse.type;
			var components = _css$parse.components;

			var a = components.pop();
			var rgb = type === 'rgb' ? (0, _convertRGB.intIntIntToFloat)(components) : hsl.hslToRgb((0, _convertRGB.degPctPctToFloat)(components));

			return this.Define([rgb[0], rgb[1], rgb[2], a], target);
		}

		/**
   * Returns an instance representing 0xaarrggbb hex encoded i
   * @param {int} i - The hex encoded color
   * @param {Vector4RGBA} [target] - The target instance
   * @returns {Vector4RGBA}
   */

	}, {
		key: 'Int',
		value: function Int(i) {
			var target = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

			return this.Define([(0, _convertRGB.intToFloat)(i >> 16 & 0xff), (0, _convertRGB.intToFloat)(i >> 8 & 0xff), (0, _convertRGB.intToFloat)(i & 0xff), (0, _convertRGB.intToFloat)(i >> 24 & 0xff)], target);
		}
	}]);

	return Vector4RGBA;
}(_Vector3.default);

exports.default = Vector4RGBA;