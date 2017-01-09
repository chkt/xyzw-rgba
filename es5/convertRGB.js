'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.floatToInt = floatToInt;
exports.intToFloat = intToFloat;
exports.floatToPct = floatToPct;
exports.pctToFloat = pctToFloat;
exports.radToDeg = radToDeg;
exports.degToRad = degToRad;
exports.intIntIntToFloat = intIntIntToFloat;
exports.floatToIntIntInt = floatToIntIntInt;
exports.degPctPctToFloat = degPctPctToFloat;
exports.floatToDegPctPct = floatToDegPctPct;

var _Math = require('xyzw/es5/Math');

var _Math2 = _interopRequireDefault(_Math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The 1 / 256 constant
 * @private
 * @type {number}
 */
var ONE_DIV_TWOFIFTYSIX = 1.0 / 256.0;
/**
 * The deg to rad conversion constant
 * @private
 * @type {number}
 */
var DEG_TO_RAD = _Math2.default.PI / 180.0;
/**
 * The rad to deg conversion constant
 * @private
 * @type {number}
 */
var RAD_TO_DEG = 180.0 / _Math2.default.PI;
/**
 * The full circle in radians
 * @private
 * @type {number}
 */
var TWO_PI = _Math2.default.PI * 2.0;

/**
 * Returns the rgb8 value representing f
 * @param {number} f - The floating point value
 * @returns {int}
 */
function floatToInt(f) {
  return _Math2.default.clamp(_Math2.default.floor(f * 256.0), 0, 255);
}

/**
 * Returns the floating point value representing i
 * @param {int} i - The rgb8 value
 * @returns {number}
 */
function intToFloat(i) {
  return i < 255 ? i * ONE_DIV_TWOFIFTYSIX : 1.0;
}

/**
 * Returns the percent value representing f
 * @param {number} f - The floating point value
 * @returns {int}
 */
function floatToPct(f) {
  return _Math2.default.round(f * 100.0);
}

/**
 * Returns the floating point value representing i
 * @param {int} i - The percent value
 * @returns {number}
 */
function pctToFloat(i) {
  return i * 0.01;
}

/**
 * Returns the degree value representing f
 * @param {number} f - The radian value
 * @returns {int}
 */
function radToDeg(f) {
  f %= TWO_PI;
  f = _Math2.default.sign(f) !== -1 ? f : f + TWO_PI;

  return _Math2.default.round(f * RAD_TO_DEG);
}

/**
 * Returns the radian value representing i
 * @param {int} i - The degree value
 * @returns {number}
 */
function degToRad(i) {
  var f = i * DEG_TO_RAD;

  f %= TWO_PI;

  return _Math2.default.sign(f) !== -1 ? f : f + TWO_PI;
}

/**
 * Returns the floating point value representation of abc
 * @param {int[]} abc - The rgb8-rgb8-rgb8 components
 * @returns {number[]}
 */
function intIntIntToFloat(_ref) {
  var _ref2 = _slicedToArray(_ref, 3);

  var a = _ref2[0];
  var b = _ref2[1];
  var c = _ref2[2];

  return [intToFloat(a), intToFloat(b), intToFloat(c)];
}

/**
 * Returns the rgb8 representation of abc
 * @param {number[]} a - The float-float-float components
 * @returns {int[]}
 */
function floatToIntIntInt(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 3);

  var a = _ref4[0];
  var b = _ref4[1];
  var c = _ref4[2];

  return [floatToInt(a), floatToInt(b), floatToInt(c)];
}

/**
 * Returns the floating point representation of abc
 * @param {int[]} abc - The deg-pct-pct components
 * @returns {number[]}
 */
function degPctPctToFloat(_ref5) {
  var _ref6 = _slicedToArray(_ref5, 3);

  var a = _ref6[0];
  var b = _ref6[1];
  var c = _ref6[2];

  return [degToRad(a), pctToFloat(b), pctToFloat(c)];
}

/**
 * Returns the deg-pct-pct representation of abc
 * @param {number[]} abc - The float-float-float components
 * @returns {int[]}
 */
function floatToDegPctPct(_ref7) {
  var _ref8 = _slicedToArray(_ref7, 3);

  var a = _ref8[0];
  var b = _ref8[1];
  var c = _ref8[2];

  return [radToDeg(a), floatToPct(b), floatToPct(c)];
}