import assert from 'assert';
import { describe, it } from 'mocha';

import Vector4 from 'xyzw/es5/Vector4';
import Vector4RGBA from '../source/Vector4RGBA';
import Vector3 from 'xyzw/es5/Vector3';
import Vector3RGB from '../source/Vector3RGB';
import HSLA from '../source/HSLA';



describe('HSLA', () => {
	describe('.Define()', () => {
		it("should set the hue, saturation, luminosity and alpha", () => {
			const ins = HSLA.Define(0.0, 1.0, 0.5, 0.75);

			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 0.75);
		});

		it("should accept an instance as optional fifth argument", () => {
			const hsla = new HSLA(0.1, 0.0, 0.0, 0.0);
			const ins = HSLA.Define(0.0, 1.0, 0.5, 0.75, hsla);

			assert.strictEqual(hsla, ins);
			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 0.75);
		});
	});

	describe('.RGBA()', () => {
		it("should return an instance set from a Vector4 instance", () => {
			const rgba = new Vector4RGBA([1.0, 0.0, 0.0, 0.75]);
			const hsla = HSLA.RGBA(rgba);

			assert.strictEqual(hsla.h, 0.0);
			assert.strictEqual(hsla.s, 1.0);
			assert.strictEqual(hsla.l, 0.5);
			assert.strictEqual(hsla.a, 0.75);
		});

		it("should accept a second optional target argument", () => {
			const rgba = new Vector4RGBA([1.0, 0.0, 0.0, 0.75]);
			const hsla = new HSLA(0.1, 0.0, 0.0, 0.0);
			const ins = HSLA.RGBA(rgba, hsla);

			assert.strictEqual(hsla, ins);
			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 0.75);
		});
	});

	describe('.RGB()', () => {
		it("should return an instance set from a Vector3 instance", () => {
			const rgb = new Vector3RGB([1.0, 0.0, 0.0]);
			const hsla = HSLA.RGB(rgb);

			assert.strictEqual(hsla.h, 0.0);
			assert.strictEqual(hsla.s, 1.0);
			assert.strictEqual(hsla.l, 0.5);
			assert.strictEqual(hsla.a, 1.0);
		});

		it("should accept a second optional target argument", () => {
			const rgb = new Vector3RGB([1.0, 0.0, 0.0]);
			const hsla = new HSLA(0.1, 0.0, 0.0, 0.0);
			const ins = HSLA.RGB(rgb, hsla);

			assert.strictEqual(ins, hsla);
			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 1.0);
		});
	});

	describe('.Copy()', () => {
		it("should return a copy of the first argument", () => {
			const source = new HSLA(0.0, 1.0, 0.5, 0.75);
			const target = HSLA.Copy(source);

			assert.strictEqual(source === target, false);
			assert.strictEqual(source.h, target.h);
			assert.strictEqual(source.s, target.s);
			assert.strictEqual(source.l, target.l);
			assert.strictEqual(source.a, target.a);
		});

		it("should accept an instance as optional second argument", () => {
			const source = new HSLA(0.0, 1.0, 0.5, 0.75);
			const target = new HSLA(0.1, 0.0, 0.0, 0.0);
			const ins = HSLA.Copy(source, target);

			assert.strictEqual(target, ins);
		});
	});

	describe('.isEQ()', () => {
		it("should return true if arguments are identical", () => {
			const a = new HSLA(0, 1.0, 0.5, 1.0), b = a;

			assert.strictEqual(HSLA.isEQ(a, b), true);
		});

		it("should return true if arguments represent the same color", () => {
			const a = new HSLA(0, 1.0, 0.5, 1.0);
			const b = new HSLA(0, 1.0, 0.5, 1.0);

			assert.strictEqual(HSLA.isEQ(a, b), true);

			b.h = 1.0;

			assert.strictEqual(HSLA.isEQ(a, b), false);

			b.h = 0;
			b.s = 0.5;

			assert.strictEqual(HSLA.isEQ(a, b), false);

			b.s = 1.0;
			b.l = 1.0;

			assert.strictEqual(HSLA.isEQ(a, b), false);

			b.l = 0.5;
			b.a = 0.0;

			assert.strictEqual(HSLA.isEQ(a, b), false);

			b.a = 1.0;

			assert.strictEqual(HSLA.isEQ(a, b), true);
		});
	});

	describe('.constructor()', () => {
		it("should set the hue, saturation, luminosity and alpha", () => {
			const ins = new HSLA(0.0, 1.0, 0.5, 0.75);

			assert(ins instanceof HSLA);
			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 0.75);
		});
	});

	describe('#define()', () => {
		it("should set the hue, saturation, luminosity and alpha", () => {
			const ins = new HSLA(0.1, 0.0, 0.0, 0.0);

			ins.define(0.0, 1.0, 0.5, 0.75);

			assert.strictEqual(ins.h, 0.0);
			assert.strictEqual(ins.s, 1.0);
			assert.strictEqual(ins.l, 0.5);
			assert.strictEqual(ins.a, 0.75);
		});

		it("should return the instance", () => {
			const hsla = new HSLA(0.1, 0.0, 0.0, 0.0);
			const ins = hsla.define(0.0, 1.0, 0.5, 1.0);

			assert.strictEqual(hsla, ins);
		});
	});

	describe('#chroma()', () => {});

	describe('#copyOf()', () => {
		it("should set the hue, saturation, luminosity and alpha the same as source", () => {
			const target = new HSLA(0.1, 0.0, 0.0, 0.0);
			const source = new HSLA(0.0, 1.0, 0.5, 0.75);

			target.copyOf(source);

			assert.strictEqual(source.h, target.h);
			assert.strictEqual(source.s, target.s);
			assert.strictEqual(source.l, target.l);
			assert.strictEqual(source.a, target.a);
		});

		it("should return the instance", () => {
			const target = new HSLA(0.1, 0.0, 0.0, 0.0);
			const source = new HSLA(0.0, 1.0, 0.5, 0.75);
			const ins = target.copyOf(source);

			assert.strictEqual(ins, target);
		});
	});

	describe('#toRGBA()', () => {
		it("should return a Vector4RGBA instance representing the instance", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 0.75);
			const rgba = hsla.toRGBA();

			assert(rgba instanceof Vector4RGBA);
			assert.strictEqual(rgba.r, 255);
			assert.strictEqual(rgba.g, 0);
			assert.strictEqual(rgba.b, 0);
			assert.strictEqual(rgba.a, 0.75);
		});

		it("should accept a Vector4 instance as optional second target argument", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 0.75);
			const rgb = new Vector4();
			const res = hsla.toRGBA(rgb);

			assert.strictEqual(res, rgb);
			assert.strictEqual(res.x, 1.0);
			assert.strictEqual(res.y, 0.0);
			assert.strictEqual(res.z, 0.0);
			assert.strictEqual(res.w, 0.75);
		});
	});

	describe('#toRGB()', () => {
		it("should return a Vector3RGB instance representing the instance", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 1.0);
			const rgb = hsla.toRGB();

			assert(rgb instanceof Vector3RGB);
			assert.strictEqual(rgb.r, 255);
			assert.strictEqual(rgb.g, 0);
			assert.strictEqual(rgb.b, 0);
		});

		it("should accept a Vector3 matte color as optional second argument", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 0.5);
			let rgb = hsla.toRGB(new Vector3([1.0, 1.0, 1.0]));

			assert.strictEqual(rgb.r, 255);
			assert.strictEqual(rgb.g, 128);
			assert.strictEqual(rgb.b, 128);

			rgb = hsla.toRGB(new Vector3([0.0, 0.0, 0.0]));

			assert.strictEqual(rgb.r, 128);
			assert.strictEqual(rgb.g, 0);
			assert.strictEqual(rgb.b, 0);
		});

		it("should accept a Vector3 instance as optional third target argument", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 1.0);
			const rgb = new Vector3();
			const ins = hsla.toRGB(new Vector3([1.0, 1.0, 1.0]), rgb);

			assert.strictEqual(ins, rgb);
			assert.strictEqual(rgb.x, 1.0);
			assert.strictEqual(rgb.y, 0.0);
			assert.strictEqual(rgb.z, 0.0);
		});
	});

	describe('#toCSS()', () => {
		it("should return a hsl formated css string for solid colors", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 0.75);

			assert.strictEqual(hsla.toCSS(), 'hsla(0,100%,50%,0.75)');

			hsla.define(0.0, 1.0, 0.5, 1.0);

			assert.strictEqual(hsla.toCSS(), 'hsl(0,100%,50%)');
		});
	});

	describe('#toString()', () => {
		it("should return the value of #toCSS()", () => {
			const hsla = new HSLA(0.0, 1.0, 0.5, 0.75);

			assert.strictEqual(hsla.toCSS(), String(hsla));
		});
	});
});
