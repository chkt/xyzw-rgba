import Math from 'xyzw/es5/Math';
import Vector3 from 'xyzw/es5/Vector3';

import * as css from './css';
import * as hsl from './hsl';
import {
	floatToInt,
	intToFloat,
	intIntIntToFloat,
	degPctPctToFloat
} from './convertRGB';



/**
 * RGB three component vector representation
 */
export default class Vector3RGB extends Vector3 {

	/**
	 * Returns a new instance
	 * @param {number[]} n - The components
	 * @param {Vector3RGB} [target] - The target instance
	 * @returns {Vector3RGB}
	 */
	static Define(n, target = undefined) {
		if (target === undefined) target = new this(n);
		else this.call(target, n);

		return target;
	}


	/**
	 * Returns an instance representing string
	 * @param {string} string - The css color string
	 * @param {Vector3} matte - The transparency matte vector
	 * @param {Vector3RGB} [target] - The target instance
	 * @returns {Vector3RGB}
	 */
	static CSS(string, matte = new Vector3([1.0, 1.0, 1.0]), target = undefined) {
		const { type, components } = css.parse(string);
		const a = components.pop();
		const rgb = type === 'rgb' ? intIntIntToFloat(components) : hsl.hslToRgb(degPctPctToFloat(components));
		const mn = matte.n;

		return this.Define([
			Math.mix(mn[0], rgb[0], a),
			Math.mix(mn[1], rgb[1], a),
			Math.mix(mn[2], rgb[2], a)
		], target);
	}

	/**
	 * Returns an instance representing 0xrrggbb hex encoded i
	 * @param {int} i - The bit encoded Int
	 * @param {Vector3} [target] - The target instance
	 * @returns {Vector3RGB}
	 */
	static Int(i, target = undefined) {
		return this.Define([
			intToFloat(i >> 16 & 0xff),
			intToFloat(i >> 8 & 0xff),
			intToFloat(i & 0xff)
		], target);
	}


	/**
	 * The r component
	 * Alias of {@link Vector3#x}
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
	 * Alias of {@link Vector3#y}
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
	 * Alias of {@link Vector3#z}
	 * @type {number}
	 */
	get b() {
		return floatToInt(this.n[2]);
	}

	set b(n) {
		this.n[2] = intToFloat(n);
	}


	/**
	 * Returns a css representation of the instance
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
				1.0
			]
		});
	}


	/**
	 * Returns a 0xrrggbb hex encoded integer representation of the instance
	 * @returns {int}
	 */
	toInt() {
		const n = this.n;

		return floatToInt(n[0]) << 16 | floatToInt(n[1]) << 8 | floatToInt(n[2]);
	}


	/**
	 * Returns a css representation of the instance
	 * @returns {string}
	 */
	toString() {
		return this.toCSS();
	}

	/**
	 * Returns a rrggbb hex encoded representation of the instance
	 * @returns {int}
	 */
	valueOf() {
		return this.toInt();
	}
}
