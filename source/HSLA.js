import Math from 'xyzw/es5/Math';
import Vector3 from 'xyzw/es5/Vector3';
import Vector3RGB from './Vector3RGB';
import Vector4RGBA from './Vector4RGBA';

import * as hsl from './hsl';
import * as css from './css';
import { floatToDegPctPct } from './convertRGB';



/**
 * HSLA color model transform
 */
export default class HSLA {

	/**
	 * Returns a defined instance
	 * @param {number} h - The hue in radians
	 * @param {number} s - The saturation
	 * @param {number} l - The luminosity
	 * @param {number} a - The alpha
	 * @param {HSLA} [target] - The target instance
	 * @returns {HSLA}
	 */
	static Define(h, s, l, a, target) {
		if (target === undefined) target = new this(h, s, l, a);
		else this.call(target, h, s, l, a);

		return target;
	}

	/**
	 * Returns an instance representing v
	 * @param {Vector4} v - The source rgba vector
	 * @param {HSLA} [target] - The target instance
	 * @returns {HSLA}
	 */
	static RGBA(v, target) {
		const [h, s, l] = hsl.rgbToHsl(v.n.slice(0, 3));

		return this.Define(h, s, l, v.n[3], target);
	}

	/**
	 * Returns an instance representing v
	 * @param {Vector3} v - The source rgb vector
	 * @param {HSLA} [target] - The target instance
	 * @returns {HSLA}
	 */
	static RGB(v, target) {
		const [h, s, l] = hsl.rgbToHsl(v.n);

		return this.Define(h, s, l, 1.0, target);
	}


	/**
	 * Returns the copy of source
	 * @param {HSLA} source - The source instance
	 * @param {HSLA} [target] - The target instance
	 * @returns {HSLA}
	 */
	static Copy(source, target) {
		return this.Define(source.h, source.s, source.l, source.a, target);
	}


	/**
	 * Returns true if a == b, false otherwise
	 * @param {HSLA} a
	 * @param {HSLA} b
	 * @returns {boolean}
	 */
	static isEQ(a, b) {
		return a === b || a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
	}



	/**
	 * Creates a new instance
	 * @param {number} h - The hue in radians
	 * @param {number} s - The saturation
	 * @param {number} l - The luminosity
	 * @param {number} a - The alpha
	 */
	constructor(h, s, l, a) {
		/**
		 * The hue
		 * @type {Float}
		 */
		this.h = h;
		/**
		 * The saturation
		 * @type {Float}
		 */
		this.s = s;
		/**
		 * The luminosity
		 * @type {Float}
		 */
		this.l = l;
		/**
		 * The alpha
		 * @type {Float}
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
	define(h, s, l, a) {
		this.constructor.call(this, h, s, l, a);

		return this;
	}


	/**
	 * The chroma
	 * @type {number}
	 */
	get chroma() {
		return hsl.chroma(this.s, this.l);
	}


	/**
	 * The copy of source
	 * @param {HSLA} source - The source instance
	 * @returns {HSLA}
	 */
	copyOf(source) {
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
	toRGBA(target) {
		const rgb = hsl.hslToRgb([this.h, this.s, this.l]);

		if (target === undefined) target = new Vector4RGBA();

		target.n = [...rgb, this.a];

		return target;
	}

	/**
	 * Returns a Vector3 rgb representation of the instance
	 * @param {Vector3} [matte] - The alpha matte rgb vector
	 * @param {Vector3} [target] - The target vector
	 * @returns {Vector3}
	 */
	toRGB(matte = new Vector3([1.0, 1.0, 1.0]), target = undefined) {
		const rgb = hsl.hslToRgb([this.h, this.s, this.l]), a = this.a;
		const mn = matte.n;

		if (target === undefined) target = new Vector3RGB();

		target.n = [
			Math.mix(mn[0], rgb[0], a),
			Math.mix(mn[1], rgb[1], a),
			Math.mix(mn[2], rgb[2], a)
		];

		return target;
	}

	/**
	 * Returns a css-formated hsl or hsla representation of the instance
	 * @returns {string}
	 */
	toCSS() {
		const hsl = floatToDegPctPct([this.h, this.s, this.l]);

		return css.stringify({
			type : 'hsl',
			components : [...hsl, this.a]
		});
	}

	/**
	 * Returns a string representation of the instance
	 * @returns {string}
	 */
	toString() {
		return this.toCSS();
	}
}
