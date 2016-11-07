import assert from 'assert';
import { describe, it } from 'mocha';

import * as convert from '../source/convertRGB';


describe("floatToInt()", () => {
	it("should return the rgb8 corresponding to each floating point value input", () => {
		const step = 1.0 / 256.0;

		for (let i = 0; i < 256; i += 1) {
			const f = i * step;

			assert.strictEqual(convert.floatToInt(f), i);
			assert.strictEqual(convert.floatToInt(f + step * 0.5), i);
			assert.strictEqual(convert.floatToInt(f + step - Number.EPSILON), i);
		}
	});

	it("should return 255 for the floating point value input 1.0", () => {
		assert.strictEqual(convert.floatToInt(1.0), 255);
	});
});

describe("intToFloat()", () => {
	it("should return the floating point value corresponding to each rgb8 input", () => {
		for (let i = 0; i < 255; i += 1) assert.strictEqual(convert.intToFloat(i), i / 256);
	});

	it("should return 1.0 for the rgb8 value 255", () => {
		assert.strictEqual(convert.intToFloat(255), 1.0);
	});
});

describe("floatToIntIntInt()", () => {
	it("should return the rgb8 corresponding to each floating point value input", () => {
		const step = 1.0 / 256.0;

		for (let i = 0; i < 256; i += 1) {
			const f0 = i * step, output = [i, i, i], start = [f0, f0, f0];
			const f1 = f0 + step * 0.5, mid = [f1, f1, f1];
			const f2 = f0 + step - Number.EPSILON, end = [f2, f2, f2];

			assert.deepStrictEqual(convert.floatToIntIntInt(start), output);
			assert.deepStrictEqual(convert.floatToIntIntInt(mid), output);
			assert.deepStrictEqual(convert.floatToIntIntInt(end), output);
		}
	});

	it("should return 255 for the floating point value input 1.0", () => {
		const input = [1.0, 0.0, 0.0], output = [255, 0, 0];

		assert.deepStrictEqual(convert.floatToIntIntInt(input), output);
	});
});

describe("intIntIntToFloat()", () => {
	it ("should return the floating point values corresponding to each rgb8 input", () => {
		for (let i = 0; i < 255; i += 1) {
			const f = i / 256, input = [i, i, i], output = [f, f, f];

			assert.deepStrictEqual(convert.intIntIntToFloat(input), output);
		}
	});

	it("should return 1.0 for the rgb8 value 255", () => {
		const input = [255, 0, 0], output = [1.0, 0.0, 0.0];

		assert.deepStrictEqual(convert.intIntIntToFloat(input), output);
	});
});

describe("degPctPctToFloat()", () => {
	it("should return the floating point values corresponding to deg, percent and percent value", () => {
		for (let deg = 0; deg <= 360; deg += 1) {
			for (let pct = 0; pct <= 100; pct += 1) {
				const input = [deg, pct, 100 - pct];
				const output = [deg / 360 * Math.PI * 2.0, pct / 100.0, 1.0 - pct / 100.0];
				const res = convert.degPctPctToFloat(input);

				assert(Math.abs(res[0] - output[0]) < 1.0e-10);
				assert(Math.abs(res[1] - output[1]) < 1.0e-10);
				assert(Math.abs(res[2] - output[2]) < 1.0e-10);
			}
		}
	});
});

describe("floatToDegPctPct()", () => {
	it("should return deg, percent and percent values corresponding to rad, float and float", () => {
		for (let rad = 0; rad <= Math.PI * 2.0; rad += 0.01) {
			for (let float = 0; float <= 1.0; float += 0.01) {
				const input = [rad, float, 1.0 - float];
				const output = [rad / (Math.PI * 2.0) * 360.0, float * 100, 100 - float * 100];
				const res = convert.floatToDegPctPct(input);

				assert(Math.abs(res[0] - output[0]) < 1.0e-10);
				assert(Math.abs(res[1] - output[1]) < 1.0e-10);
				assert(Math.abs(res[2] - output[2]) < 1.0e-10);
			}
		}
	});
});
