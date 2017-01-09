import assert from 'assert';
import { describe, it } from 'mocha';

import Vector4RGBA from '../source/Vector4RGBA';



const components = [0.75,0.5,0.25,1.0];



describe('Vector4RGBA', () => {
	describe('.Define()', () => {
		it("should return a defined instance", () => {
			const ins = Vector4RGBA.Define();

			assert(ins instanceof Vector4RGBA);
		});

		it("should accept the floating point components as first argument", () => {
			const ins = Vector4RGBA.Define(components);

			assert.strictEqual(ins.x, 0.75);
			assert.strictEqual(ins.y, 0.5);
			assert.strictEqual(ins.z, 0.25);
			assert.strictEqual(ins.w, 1.0);
			assert.strictEqual(ins.r, 192);
			assert.strictEqual(ins.g, 128);
			assert.strictEqual(ins.b, 64);
			assert.strictEqual(ins.a, 1.0);
		});

		it("should optionally accept the target instance as second argument", () => {
			const rgba = new Vector4RGBA();
			const ins = Vector4RGBA.Define(components, rgba);

			assert.strictEqual(rgba, ins);
		});
	});

	describe('.CSS()', () => {
		it("should accept a css formated string representation of the color as first argument", () => {
			const colors = {
				[ "red" ] : [255, 0, 0, 1.0],
				[ "#000" ] : [0, 0, 0, 1.0],
				[ "black" ] : [0, 0, 0, 1.0],
				[ "#ff8040" ] : [255, 128, 64, 1.0],
				[ "rgb(255,128,64)" ] : [255, 128, 64, 1.0],
				[ "rgba(255,128,64,0.1)" ] : [255, 128, 64, 0.1],
				[ "hsl(0,100%,50%)" ] : [255, 0, 0, 1.0],
				[ "hsla(0,100%,50%,0.1)" ] : [255, 0, 0, 0.1]
			};

			for (let str in colors) {
				const ins = Vector4RGBA.CSS(str);

				assert.strictEqual(ins.r, colors[str][0]);
				assert.strictEqual(ins.g, colors[str][1]);
				assert.strictEqual(ins.b, colors[str][2]);
				assert.strictEqual(ins.a, colors[str][3]);
			}
		});

		it("should optionally accept the target instance as second argument", () => {
			const rgba = new Vector4RGBA();
			const ins = Vector4RGBA.CSS("red", rgba);

			assert.strictEqual(rgba, ins);
		});
	});

	describe('.Int()', () => {
		it("should accept a 0xaarrggbb formated integer as first argument", () => {
			const ins = Vector4RGBA.Int(0x40ff8000);

			assert.strictEqual(ins.r, 255);
			assert.strictEqual(ins.g, 128);
			assert.strictEqual(ins.b, 0);
			assert.strictEqual(ins.a, 0.25);
		});

		it("should optionally accept the target instance as second argument", () => {
			const rgba = new Vector4RGBA();
			const ins = Vector4RGBA.Int(0x40ff8000, rgba);

			assert.strictEqual(ins, rgba);
		});
	});

	describe('#r', () => {
		it("should return the rgb8 value of #n[0]", () => {
			const rgba = new Vector4RGBA(components);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgba.x = f;

				assert.strictEqual(rgba.r, Math.floor(f * 256.0));
			}
		});

		it("should return the same values as set", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.r = i;

				assert.strictEqual(rgba.r, i);
			}
		});

		it("should set the rgb8 value of #n[0]", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.r = i;

				assert.strictEqual(rgba.x, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#g', () => {
		it("should return the rgb8 value of #n[1]", () => {
			const rgba = new Vector4RGBA(components);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgba.y = f;

				assert.strictEqual(rgba.g, Math.floor(f * 256.0));
			}
		});

		it("should return the same value as set", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.g = i;

				assert.strictEqual(rgba.g, i);
			}
		});
		it("should set the rgb8 value of #n[1]", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.g = i;

				assert.strictEqual(rgba.y, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#b', () => {
		it("should return the rgb8 value of #n[2]", () => {
			const rgba = new Vector4RGBA(components);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgba.z = f;

				assert.strictEqual(rgba.b, Math.floor(f * 256.0));
			}
		});

		it("should return the same value as set", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.b = i;

				assert.strictEqual(rgba.b, i);
			}
		});
		it("should set the rgb8 value of #n[2]", () => {
			const rgba = new Vector4RGBA(components);

			for (let i = 0; i < 256; i += 1) {
				rgba.b = i;

				assert.strictEqual(rgba.z, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#a', () => {
		it("should be an alias to #n[3], #w", () => {
			const rgba = new Vector4RGBA(components);

			assert.strictEqual(rgba.w, rgba.a);
			assert.strictEqual(rgba.a, rgba.n[3]);

			rgba.w = 0.1;

			assert.strictEqual(rgba.w, rgba.a);
			assert.strictEqual(rgba.a, rgba.n[3]);
			assert.strictEqual(rgba.a, 0.1);
		});
	});

	describe('#toCSS()', () => {
		it("should return a css formated string representation of the instance", () => {
			const rgba = new Vector4RGBA();

			assert.strictEqual(rgba.toCSS(), '#000');

			rgba.r = 255;

			assert.strictEqual(rgba.toCSS(), 'red');

			rgba.g = 128;

			assert.strictEqual(rgba.toCSS(), '#ff8000');

			rgba.b = 64;

			assert.strictEqual(rgba.toCSS(), '#ff8040');

			rgba.a = 0.5;

			assert.strictEqual(rgba.toCSS(), 'rgba(255,128,64,0.5)');
		});

		it("should return clamped values for out of gamut values", () => {
			const rgba = new Vector4RGBA([
				-1.0,
				-1.0,
				-1.0,
				-1.0
			]);

			assert.strictEqual(rgba.toCSS(), 'transparent');

			rgba.define([
				2.0,
				2.0,
				2.0,
				2.0
			]);

			assert.strictEqual(rgba.toCSS(), '#fff');
		});
	});

	describe('#toInt()', () => {
		it ("should return a 0xaarrggbb encoded representation of the instance", () => {
			const rgba = new Vector4RGBA();

			assert.strictEqual(rgba.toInt(), 0xff000000 >> 0);

			rgba.r = 255;

			assert.strictEqual(rgba.toInt(), 0xffff0000 >> 0);

			rgba.g = 128;

			assert.strictEqual(rgba.toInt(), 0xffff8000 >> 0);

			rgba.b = 64;

			assert.strictEqual(rgba.toInt(), 0xffff8040 >> 0);

			rgba.a = 0.5;

			assert.strictEqual(rgba.toInt(), 0x80ff8040 >> 0);
		});
	});

	describe('#toString()', () => {
		it("should return the result of #toCSS()", () => {
			const rgba = new Vector4RGBA();

			for (let i = 0; i < 256; i += 1) {
				rgba.r = i;
				rgba.g = Math.floor(i * 0.5);
				rgba.b = Math.floor(i * 0.25);
				rgba.a = i / 256;

				assert.strictEqual(rgba.toCSS(), String(rgba));
			}
		});
	});

	describe('#valueOf()', () => {
		it("should return the result of #toInt()", () => {
			const rgba = new Vector4RGBA();

			for (let i = 0; i < 256; i += 1) {
				rgba.r = i;
				rgba.g = Math.floor(i * 0.5);
				rgba.b = Math.floor(i * 0.25);
				rgba.a = i / 256;

				assert.strictEqual(rgba.toInt(), Number(rgba));
			}
		});
	});
});
