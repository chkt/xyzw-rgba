'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.addAliases = addAliases;
exports.resetAliases = resetAliases;
exports.parse = parse;
exports.stringify = stringify;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var INT_DEC = '\\s*(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\s*';
var INT_DEG = '\\s*(\\d|[1-9]\\d|[12]\\d{2}|3[0-5]\\d|360)\\s*';
var INT_PCT = '\\s*(\\d|[1-9]\\d|100)%\\s*';
var FLOAT_CLAMPED = '\\s*(0(?:\\.\\d+)?|1(?:\\.(?:0+|\\d+e-\\d+))?)\\s*';

var EXPR_HASH = new RegExp('^#([0-9a-f]{3}|[0-9a-f]{6})$', 'i');
var EXPR_RGB = new RegExp('^(rgb)\\(' + INT_DEC + ',' + INT_DEC + ',' + INT_DEC + '\\)$');
var EXPR_RGBA = new RegExp('^(rgb)a\\(' + INT_DEC + ',' + INT_DEC + ',' + INT_DEC + ',' + FLOAT_CLAMPED + '\\)$', 'i');
var EXPR_HSL = new RegExp('^(hsl)\\(' + INT_DEG + ',' + INT_PCT + ',' + INT_PCT + '\\)$');
var EXPR_HSLA = new RegExp('^(hsl)a\\(' + INT_DEG + ',' + INT_PCT + ',' + INT_PCT + ',' + FLOAT_CLAMPED + '\\)$', 'i');

var EXPRESSION_LIST = [EXPR_RGBA, EXPR_HSLA, EXPR_HSL, EXPR_RGB];

var COLOR_MAP = {
	black: '#000',
	silver: '#c0c0c0',
	gray: '#808080',
	white: '#fff',
	maroon: '#800000',
	red: '#f00',
	purple: '#800080',
	fuchsia: '#f0f',
	green: '#008000',
	lime: '#0f0',
	olive: '#808000',
	yellow: '#ff0',
	navy: '#000080',
	blue: '#00f',
	teal: '#008080',
	aqua: '#0ff',
	orange: '#ffa500'
};

var ALIAS_NAME = ['transparent'];

var ALIAS_STR = ['rgba(0,0,0,0)'];

/**
 * Returns the descriptor representing type, c0, c1, c2 and alpha
 * @private
 * @param {string} type - The color model type
 * @param {int} c0 - The first color component
 * @param {int} c1 - The second color component
 * @param {int} c2 - The third color component
 * @param {number} alpha - The alpha component
 * @returns {Object}
 */
function _getDescriptor(type, c0, c1, c2) {
	var alpha = arguments.length <= 4 || arguments[4] === undefined ? 1.0 : arguments[4];

	return {
		type: type,
		components: [c0, c1, c2, alpha]
	};
}

/**
 * Returns the color component representation of hash
 * @private
 * @param {string} hash - the hash encoded color
 * @returns {number[]}
 */
function _parseHash(hash) {
	var segs = hash.split('');

	if (segs.length === 3) {
		segs.splice(2, 0, segs[2]);
		segs.splice(1, 0, segs[1]);
		segs.splice(0, 0, segs[0]);
	}

	return [Number.parseInt('0x' + segs.slice(0, 2).join('')), Number.parseInt('0x' + segs.slice(2, 4).join('')), Number.parseInt('0x' + segs.slice(4, 6).join('')), 1.0];
}

/**
 * Returns the hash representation of rgb
 * @private
 * @param {int[]} rgb - The components
 * @returns {string}
 */
function _stringifyHash(rgb) {
	var res = '',
	    short = true;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = rgb[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var cmp = _step.value;

			var str = cmp.toString(16);

			if (str.length === 1) str = '0' + str;

			if (str[0] !== str[1]) short = false;

			res += str;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return short ? res[0] + res[2] + res[4] : res;
}

/**
 * Returns the hsl() or hsla() representation of h, s, l, a
 * @private
 * @param {number[]} [h, s, l, a] - The color components
 * @returns {string}
 * @throws {TypeError} if h is not an integer between 0 and 360
 * @throws {TypeError} if s is not an integer between 0 and 100
 * @throws {TypeError} if l is not an integer between 0 and 100
 * @throws {TypeError} if a is not a number between 0 and 1
 */
function _stringifyHSL(_ref) {
	var _ref2 = _slicedToArray(_ref, 4);

	var h = _ref2[0];
	var s = _ref2[1];
	var l = _ref2[2];
	var a = _ref2[3];

	if (!Number.isSafeInteger(h) || h < 0 || h > 360 || !Number.isSafeInteger(s) || s < 0 || s > 100 || !Number.isSafeInteger(l) || l < 0 || l > 100 || typeof a !== 'number' || a < 0 || a > 1) throw new TypeError();

	var hsl = h + ',' + s + '%,' + l + '%';

	return a === 1.0 ? 'hsl(' + hsl + ')' : 'hsla(' + hsl + ',' + a + ')';
}

/**
 * Returns the #rrggbb or rgba() representation of r, g, b, a
 * @private
 * @param {number[]} [r, g, b, a] - the color components
 * @returns {string}
 * @throws {TypeError} if r is not an integer between 0 and 255
 * @throws {TypeError} if g is not an integer between 0 and 255
 * @throws {TypeError} if b is not an integer between 0 and 255
 * @throws {TypeError} if a is not a number between 0 and 1
 */
function _stringifyRGB(_ref3) {
	var _ref4 = _slicedToArray(_ref3, 4);

	var r = _ref4[0];
	var g = _ref4[1];
	var b = _ref4[2];
	var a = _ref4[3];

	if (!Number.isSafeInteger(r) || r < 0 || r > 255 || !Number.isSafeInteger(g) || g < 0 || g > 255 || !Number.isSafeInteger(b) || b < 0 || b > 255 || typeof a !== 'number' || a < 0 || a > 1) throw new TypeError();

	if (a !== 1.0) return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

	var hash = _stringifyHash([r, g, b]);

	for (var name in COLOR_MAP) {
		if (COLOR_MAP[name] !== hash) continue;

		if (name.length < hash.length + 1) return name;

		break;
	}

	return '#' + hash;
}

function addAliases(items) {
	for (var name in items) {
		ALIAS_NAME.push(name);
		ALIAS_STR.push(items[name]);
	}
}

function resetAliases() {
	var len = ALIAS_STR.length;

	ALIAS_NAME.splice(0, len);
	ALIAS_NAME.push('transparent');

	ALIAS_STR.splice(0, len);
	ALIAS_STR.push('rgba(0,0,0,0)');
}

/**
 * Returns the component descriptor representing css
 * @param {string} css - The color
 * @returns {Object}
 * @throws {TypeError} if css is not a valid css color
 */
function parse(css) {
	if (typeof css !== 'string') throw new Error();

	css = css.trim();

	var index = ALIAS_NAME.indexOf(css);

	if (index !== -1) css = ALIAS_STR[index];

	var match = css.match(EXPR_HASH);

	if (match !== null) return _getDescriptor.apply(undefined, ['rgb'].concat(_toConsumableArray(_parseHash(match[1]))));

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = EXPRESSION_LIST[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var expr = _step2.value;

			var _match = css.match(expr);

			if (_match !== null) return _getDescriptor(_match[1], Number.parseInt(_match[2]), Number.parseInt(_match[3]), Number.parseInt(_match[4]), _match.length > 5 ? Number.parseFloat(_match[5]) : 1.0);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	throw new Error();
}

/**
 * Returns the shortest css string representing the color descriptor
 * @param {Object} descriptor
 * @param {string} descriptor.type - The color model type
 * @param {number[]} descriptor.components - The color components
 * @returns {string}
 * @throws {TypeError} if descriptor.type is not a valid color model type
 * @throws {TypeError} if descriptor.components is not an array
 */
function stringify(_ref5) {
	var type = _ref5.type;
	var components = _ref5.components;

	if (type !== 'rgb' && type !== 'hsl' || !Array.isArray(components)) throw new TypeError();

	var res = '';

	if (type === 'rgb') res = _stringifyRGB(components);else if (type === 'hsl') res = _stringifyHSL(components);else throw new Error();

	var index = ALIAS_STR.indexOf(res);

	if (index === -1) return res;

	var alias = ALIAS_NAME[index];

	return alias.length < res.length ? alias : res;
}

addAliases(COLOR_MAP);