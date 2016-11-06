import assert from 'assert';
import { describe, it } from 'mocha';

import Vector3RGB from '../source/Vector3RGB';



describe('Vector3RGB', () => {
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

				assert.strictEqual(rgb.x, i / 256.0);
			}
		});
	});

	describe('#g', () => {
		it("should return the rgb scaled value of #n[1]", () => {
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

		it("should set the rgb scale value of #n[1]", () => {
			const rgb = new Vector3RGB([0.0, 0.0, 0.0]);

			for (let i = 0; i < 256; i += 1) {
				rgb.g = i;

				assert.strictEqual(rgb.y, i / 256.0);
			}
		});
	});

	describe('#b', () => {
		it("should return rgb scaled value of #n[2]", () => {
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

		it("should set the rgb scale value of #n[2]", () => {
			const rgb = new Vector3RGB([0.0, 0.0, 0.0]);

			for (let i = 0; i < 256; i += 1) {
				rgb.b = i;

				assert.strictEqual(rgb.z, i / 256.0);
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
