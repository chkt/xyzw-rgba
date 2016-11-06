import assert from 'assert';
import { describe, it } from 'mocha';

import Vector3RGB from '../source/Vector3RGB';



describe('Vector3RGB', () => {
	describe(".Define()", () => {
		it("should return a defined instance", () => {
			const ins = Vector3RGB.Define();

			assert(ins instanceof Vector3RGB);
		});

		it("should accept the floating point components as first argument", () => {
			const ins = Vector3RGB.Define([1.0, 0.5, 0.25]);

			assert.strictEqual(ins.x, 1.0);
			assert.strictEqual(ins.y, 0.5);
			assert.strictEqual(ins.z, 0.25);
			assert.strictEqual(ins.r, 255);
			assert.strictEqual(ins.g, 128);
			assert.strictEqual(ins.b, 64);
		});

		it("should optionally accept the target instance as second argument", () => {
			const rgb = new Vector3RGB();
			const ins = Vector3RGB.Define([1.0, 0.5, 0.25], rgb);

			assert.strictEqual(rgb, ins);
		});
	});

	describe(".CSS()", () => {
		it("should accept a css formated string representation of the color as first argument", () => {
			const colors = {
				[ "red" ] : [255, 0, 0],
				[ "#000" ] : [0, 0, 0],
				["black" ] : [0, 0, 0],
				[ "#ff8040" ] : [255, 128, 64],
				[ "rgb(255,128,64)" ] : [255, 128, 64]
			};

			for (let str in colors) {
				const ins = Vector3RGB.CSS(str);

				assert.strictEqual(ins.r, colors[str][0]);
				assert.strictEqual(ins.g, colors[str][1]);
				assert.strictEqual(ins.b, colors[str][2]);
			}
		});

		it("should optionally accept a matte color as second argument", () => {
			let ins = Vector3RGB.CSS("rgba(255,128,64,0.5)", new Vector3RGB([1.0, 1.0, 1.0]));

			assert.strictEqual(ins.r, 255);
			assert.strictEqual(ins.g, 192);
			assert.strictEqual(ins.b, 160);

			ins = Vector3RGB.CSS("rgba(255,128,64,0.5)", new Vector3RGB([0.0,0.0,0.0]));

			assert.strictEqual(ins.r, 128);
			assert.strictEqual(ins.g, 64);
			assert.strictEqual(ins.b, 32);
		});

		it("should optionally accept the target instance as third argument", () => {
			const rgb = new Vector3RGB();
			const ins = Vector3RGB.CSS("red", new Vector3RGB(), rgb);

			assert.strictEqual(rgb, ins);
		});
	});

	describe(".Int()", () => {
		it("should accept a 0xrrggbb formated integer as first argument", () => {
			const ins = Vector3RGB.Int(0xff8000);

			assert.strictEqual(ins.r, 255);
			assert.strictEqual(ins.g, 128);
			assert.strictEqual(ins.b, 0);
		});

		it("should optionally accept the target instance as second argument", () => {
			const rgb = new Vector3RGB();
			const ins = Vector3RGB.Int(0xff00ff, rgb);

			assert.strictEqual(ins, rgb);
		});
	});


	describe('#r', () => {
		it ("should return the rgb8 value of #n[0]", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.8]);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgb.x = f;

				assert.strictEqual(rgb.r, Math.floor(f * 256.0));
			}
		});

		it("should return the same values as set", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.8]);

			for (let i = 0; i < 256; i += 1) {
				rgb.r = i;

				assert.strictEqual(rgb.r, i);
			}
		});

		it("should set the rgb8 value of #n[0]", () => {
			const rgb = new Vector3RGB([0.0, 0.0, 0.0]);

			for (let i = 0; i < 256; i += 1) {
				rgb.r = i;

				assert.strictEqual(rgb.x, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#g', () => {
		it("should return the rgb8 value of #n[1]", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.8]);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgb.y = f;

				assert.strictEqual(rgb.g, Math.floor(f * 256.0));
			}
		});

		it("should return the same value as set", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.9]);

			for (let i = 0; i < 256; i += 1) {
				rgb.g = i;

				assert.strictEqual(rgb.g, i);
			}
		});

		it("should set the rgb8 value of #n[1]", () => {
			const rgb = new Vector3RGB([0.0, 0.0, 0.0]);

			for (let i = 0; i < 256; i += 1) {
				rgb.g = i;

				assert.strictEqual(rgb.y, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#b', () => {
		it("should return rgb8 value of #n[2]", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.8]);

			for (let f = 0.0; f < 1.0; f += 0.001) {
				rgb.z = f;

				assert.strictEqual(rgb.b, Math.floor(f * 256.0));
			}
		});

		it("should return the same value as set", () => {
			const rgb = new Vector3RGB([1.0, 0.9, 0.8]);

			for (let i = 0; i < 256; i += 1) {
				rgb.b = i;

				assert.strictEqual(rgb.b, i);
			}
		});

		it("should set the rgb8 value of #n[2]", () => {
			const rgb = new Vector3RGB([0.0, 0.0, 0.0]);

			for (let i = 0; i < 256; i += 1) {
				rgb.b = i;

				assert.strictEqual(rgb.z, i < 255 ? i / 256.0 : 1.0);
			}
		});
	});

	describe('#toCSS()', () => {
		it("should return a css formated string representation of the instance", () => {
			const rgb = new Vector3RGB();

			assert.strictEqual(rgb.toCSS(), '#000');

			rgb.r = 255;

			assert.strictEqual(rgb.toCSS(), 'red');

			rgb.g = 128;

			assert.strictEqual(rgb.toCSS(), '#ff8000');

			rgb.b = 64;

			assert.strictEqual(rgb.toCSS(), '#ff8040');
		});
	});

	describe("#toInt()", () => {
		it("should return a 0xrrggbb encoded representation of the instance", () => {
			const rgb = new Vector3RGB();

			assert.strictEqual(rgb.toInt(), 0x000000);

			rgb.r = 255;

			assert.strictEqual(rgb.toInt(), 0xff0000);

			rgb.g = 128;

			assert.strictEqual(rgb.toInt(), 0xff8000);

			rgb.b = 64;

			assert.strictEqual(rgb.toInt(), 0xff8040);
		});
	});

	describe("#toString()", () => {
		it("should return the result of #toCSS()", () => {
			const rgb = new Vector3RGB();

			for (let i = 0; i < 256; i += 1) {
				rgb.r = i;
				rgb.g = Math.floor(i * 0.5);
				rgb.b = Math.floor(i * 0.25);

				assert.strictEqual(rgb.toCSS(), String(rgb));
			}
		});
	});

	describe("#valueOf()", () => {
		it("should return the result of #toInt()", () => {
			const rgb = new Vector3RGB();

			for (let i = 0; i < 256; i += 1) {
				rgb.r = i;
				rgb.b = Math.floor(i * 0.5);
				rgb.g = Math.floor(i * 0.25);

				assert.strictEqual(rgb.toInt(), Number(rgb));
			}
		});
	});
});
