import Math from 'xyzw/es5/Math';
import Vector4 from 'xyzw/es5/Vector4';

import * as css from './css';
import * as hsl from './hsl';
import {
	floatToInt,
	intToFloat,
	intIntIntToFloat,
	degPctPctToFloat
} from './convertRGB';



/**
 * RGBA Four component vector representation
 */
export default class Vector4RGBA extends Vector4 {

	/**
	 * Returns a defined instance
	 * @param {number[]} n - The components
	 * @param {Vector4RGBA} target - The target instance
	 * @returns {Vector4RGBA}
	 */
	static Define(n, target = undefined) {
		if (target === undefined) target = new this(n);
		else this.call(target, n);

		return target;
	}


	/**
	 * Returns an instance representing string
	 * @param {string} string - The css color string
	 * @param {Vector4RGBA} [target] - The target instance
	 * @returns {Vector4RGBA}
	 * @constructor
	 */
	static CSS(string, target = undefined) {
		const { type, components } = css.parse(string);
		const a = components.pop();
		const rgb = type === 'rgb' ? intIntIntToFloat(components) : hsl.hslToRgb(degPctPctToFloat(components));

		return this.Define([
			rgb[0],
			rgb[1],
			rgb[2],
			a
		], target);
	}

	/**
	 * Returns an instance representing 0xaarrggbb hex encoded i
	 * @param {int} i - The hex encoded color
	 * @param {Vector4RGBA} [target] - The target instance
	 * @returns {Vector4RGBA}
	 */
	static Int(i, target = undefined) {
		return this.Define([
			intToFloat(i >> 16 & 0xff),
			intToFloat(i >> 8 & 0xff),
			intToFloat(i & 0xff),
			intToFloat(i >> 24 & 0xff)
		], target);
	}


	/**
	 * The r component
	 * Alias of {@link Vector4#x}
	 * @type {number}
	 */
	get r() {
		return floatToInt(this.n[0]);
	}

	set r(n) {
		this.n[0] = intToFloat(n);
	}


	/**
	 * The g component
	 * Alias of {@link Vector4#y}
	 * @type {number}
	 */
	get g() {
		return floatToInt(this.n[1]);
	}

	set g(n) {
		this.n[1] = intToFloat(n);
	}


	/**
	 * The b component
	 * Alias of {@link Vector4#z}
	 * @type {number}
	 */
	get b() {
		return floatToInt(this.n[2]);
	}

	set b(n) {
		this.n[2] = intToFloat(n);
	}


	/**
	 * The a component
	 * Alias of {@link Vector4#w}
	 * @type {number}
	 */
	get a() {
		return this.n[3];
	}

	set a(n) {
		this.n[3] = n;
	}


	/**
	 * Returns a css color string representation of the instance
	 * @returns {string}
	 */
	toCSS() {
		const n = this.n;

		return css.stringify({
			type : 'rgb',
			components : [
				floatToInt(n[0]),
				floatToInt(n[1]),
				floatToInt(n[2]),
				n[3]
			]
		});
	}

	/**
	 * Returns a 0xaarrggbb hex encoded integer representation of the instance
	 * @returns {int}
	 */
	toInt() {
		const n = this.n;

		return floatToInt(n[3]) << 24 |
			floatToInt(n[0]) << 16 |
			floatToInt(n[1]) << 8 |
			floatToInt(n[2]);
	}


	/**
	 * Returns a css color string representation of the instance
	 * @returns {string}
	 */
	toString() {
		return this.toCSS();
	}

	/**
	 * Returns a aarrggbb hex encoded int representation of the instance
	 * @returns {int}
	 */
	valueOf() {
		return this.toInt();
	}
}
