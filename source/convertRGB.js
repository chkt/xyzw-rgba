import Math from 'xyzw/es5/Math';



/**
 * The 1 / 256 constant
 * @private
 * @type {number}
 */
const ONE_DIV_TWOFIFTYSIX = 1.0 / 256.0;
/**
 * The deg to rad conversion constant
 * @private
 * @type {number}
 */
const DEG_TO_RAD = Math.PI / 180.0;
/**
 * The rad to deg conversion constant
 * @private
 * @type {number}
 */
const RAD_TO_DEG = 180.0 / Math.PI;
/**
 * The full circle in radians
 * @private
 * @type {number}
 */
const TWO_PI = Math.PI * 2.0;



/**
 * Returns the rgb8 value representing f
 * @param {number} f - The floating point value
 * @returns {int}
 */
export function floatToInt(f) {
	return Math.clamp(Math.floor(f * 256.0), 0, 255);
}

/**
 * Returns the floating point value representing i
 * @param {int} i - The rgb8 value
 * @returns {number}
 */
export function intToFloat(i) {
	return i < 255 ? i * ONE_DIV_TWOFIFTYSIX : 1.0;
}

/**
 * Returns the percent value representing f
 * @param {number} f - The floating point value
 * @returns {int}
 */
export function floatToPct(f) {
	return Math.clamp(Math.round(f * 100.0), 0, 100);
}

/**
 * Returns the floating point value representing i
 * @param {int} i - The percent value
 * @returns {number}
 */
export function pctToFloat(i) {
	return i * 0.01;
}

/**
 * Returns the degree value representing f
 * @param {number} f - The radian value
 * @returns {int}
 */
export function radToDeg(f) {
	f %= TWO_PI;
	f = Math.sign(f) !== -1 ? f : f + TWO_PI;

	return Math.round(f * RAD_TO_DEG);
}

/**
 * Returns the radian value representing i
 * @param {int} i - The degree value
 * @returns {number}
 */
export function degToRad(i) {
	let f = i * DEG_TO_RAD;

	f %= TWO_PI;

	return Math.sign(f) !== -1 ? f : f + TWO_PI;
}


/**
 * Returns the floating point value representation of abc
 * @param {int[]} abc - The rgb8-rgb8-rgb8 components
 * @returns {number[]}
 */
export function intIntIntToFloat([a, b, c]) {
	return [
		intToFloat(a),
		intToFloat(b),
		intToFloat(c)
	];
}

/**
 * Returns the rgb8 representation of abc
 * @param {number[]} a - The float-float-float components
 * @returns {int[]}
 */
export function floatToIntIntInt([a, b, c]) {
	return [
		floatToInt(a),
		floatToInt(b),
		floatToInt(c)
	];
}

/**
 * Returns the floating point representation of abc
 * @param {int[]} abc - The deg-pct-pct components
 * @returns {number[]}
 */
export function degPctPctToFloat([a, b, c]) {
	return [
		degToRad(a),
		pctToFloat(b),
		pctToFloat(c)
	];
}

/**
 * Returns the deg-pct-pct representation of abc
 * @param {number[]} abc - The float-float-float components
 * @returns {int[]}
 */
export function floatToDegPctPct([a, b, c]) {
	return [
		radToDeg(a),
		floatToPct(b),
		floatToPct(c)
	];
}
