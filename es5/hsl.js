"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.chroma = chroma;
exports.hslToRgb = hslToRgb;
exports.rgbToHsl = rgbToHsl;
var PI_DIV_THREE = Math.PI / 3.0;
var THREE_DIV_PI = 3.0 / Math.PI;

/**
 * Returns the chroma of s and l
 * @param {number} s - The saturation
 * @param {number} l - The luminosity
 * @returns {number}
 */
function chroma(s, l) {
	return (1.0 - Math.abs(2.0 * l - 1.0)) * s;
}

/**
 * Returns the [r,g,b] representation of [h,s,l]
 * @param {number[]} hsl - The hsl components
 * @returns {number[]}
 */
function hslToRgb(_ref) {
	var _ref2 = _slicedToArray(_ref, 3);

	var h = _ref2[0];
	var s = _ref2[1];
	var l = _ref2[2];

	h *= THREE_DIV_PI;

	var c = chroma(s, l);
	var x = c * (1.0 - Math.abs(h % 2.0 - 1.0));

	var r = void 0,
	    g = void 0,
	    b = void 0;

	if (h >= 0.0 && h < 1.0) r = c, g = x, b = 0.0;else if (h >= 1.0 && h < 2.0) r = x, g = c, b = 0.0;else if (h >= 2.0 && h < 3.0) r = 0.0, g = c, b = x;else if (h >= 3.0 && h < 4.0) r = 0.0, g = x, b = c;else if (h >= 4.0 && h < 5.0) r = x, g = 0.0, b = c;else r = c, g = 0.0, b = x;

	var min = l - 0.5 * c;

	return [r + min, g + min, b + min];
}

/**
 * Returns the [h,s,l] representation of [r,g,b]
 * @param {number[]} rgb - The rgb components
 * @returns {number[]}
 */
function rgbToHsl(_ref3) {
	var _ref4 = _slicedToArray(_ref3, 3);

	var r = _ref4[0];
	var g = _ref4[1];
	var b = _ref4[2];

	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);

	var h = void 0,
	    s = void 0,
	    l = void 0,
	    c = max - min;

	if (c === 0.0) h = 0.0;else if (max === r) h = (g - b) / c % 6.0;else if (max === g) h = (b - r) / c + 2.0;else h = (r - g) / c + 4.0;

	h *= PI_DIV_THREE;
	l = 0.5 * (max + min);

	if (c === 0.0) s = 0.0;else s = c / (1.0 - Math.abs(2.0 * l - 1.0));

	return [h, s, l];
}