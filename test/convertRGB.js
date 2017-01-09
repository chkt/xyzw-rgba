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

	it("should clamp rgb8 values between 0 and 255", () => {
		assert.strictEqual(convert.floatToInt(-1.0), 0);
		assert.strictEqual(convert.floatToInt(2.0), 255);
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


describe("floatToPct()", () => {
	it("should return the integer percent value corresponding to each floating point value input", () => {
		const iv = 0.005 - Number.EPSILON;

		for (let i = 0; i <= 100; i += 1) {
			const f = i * 0.01;

			assert.strictEqual(convert.floatToPct(f), i);
			assert.strictEqual(convert.floatToPct(f - iv), i);
			assert.strictEqual(convert.floatToPct(f + iv), i);
		}
	});

	it("should clamp integer values between 0 and 100", () => {
		assert.strictEqual(convert.floatToPct(-1.0), 0);
		assert.strictEqual(convert.floatToPct(2.0), 100);
	});
});

describe("pctToFloat()", () => {
	it("should return the floating point value corresponding to each percent input", () => {
		for (let i = 0; i < 255; i += 1) assert(Math.abs(convert.pctToFloat(i) - i / 100) < 1.0e-10, "not cleanly converting percents to floating point values");
	});

	it("should return 1.0 for the percent value 100", () => {
		assert.strictEqual(1.0, convert.pctToFloat(100));
	});
});


describe("radToDeg()", () => {
	it("should the integer degree value corresponding to each radian input value", () => {
		for (let rad = 0; rad < Math.PI * 2.0; rad += Math.PI * 0.01) {
			const deg = Math.round(rad * 180.0 / Math.PI);

			assert.strictEqual(convert.radToDeg(rad), deg);
		}
	});

	it("should return the single rotation equivalent for multiple rotations", () => {
		for (let rad = Math.PI; rad < Math.PI * 20.0; rad += Math.PI * 2.0) assert.strictEqual(convert.radToDeg(rad), 180);
	});

	it("should return the positive complement for negative rotations", () => {
		for (let rad = -Math.PI; rad > -Math.PI * 20.0; rad -= Math.PI * 2.0) assert.strictEqual(convert.radToDeg(rad), 180);
	});
});

describe("degToRad()", () => {
	it("should return the radian value corresponding to each integer degree value", () => {
		for (let deg = 0; deg < 360; deg += 1) {
			const rad = deg * Math.PI / 180.0;

			assert(
				Math.abs(convert.degToRad(deg) - rad) < 1.0e-10,
				`degToRad returned ${ convert.degToRad(deg) } for ${ deg }, expected ${ rad }`
			);
		}
	});

	it("should return the single rotation equivalent for multiple rotations", () => {
		for (let deg = 180; deg < 3600; deg += 360) assert(
			Math.abs(convert.degToRad(deg) - Math.PI) < 1.0e-10,
			`degToRad returned ${ convert.degToRad(deg) } for ${ deg }, expected ${ Math.PI }`
		);
	});

	it("should return the positive complement for negative rotations", () => {
		for (let deg = -180; deg > -3600; deg -= 360) assert(
			Math.abs(convert.degToRad(deg) - Math.PI) < 1.0e-10,
			`degToRad returned ${ convert.degToRad(deg) } for ${ deg }, expected ${ Math.PI }`
		);
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
				const output = [
					convert.degToRad(deg),
					convert.pctToFloat(pct),
					convert.pctToFloat(100 - pct)
				];

				const res = convert.degPctPctToFloat(input);

				assert(
					Math.abs(res[0] - output[0]) < 1.0e-10,
					`degPctPctToFloat[0] returned ${ convert.degPctPctToFloat(input)[0] } for ${ input[0] }, expected ${ output[0] }`
				);

				assert(
					Math.abs(res[1] - output[1]) < 1.0e-10,
					`degPctPctToFloat[1] returned ${ convert.degPctPctToFloat(input)[1] } for ${ input[1] }, expected ${ output[1] }`
				);

				assert(
					Math.abs(res[2] - output[2]) < 1.0e-10,
					`degPctPctToFloat[2] returned ${ convert.degPctPctToFloat(input)[2] } for ${ input[2] }, expected ${ output[2] }`
				);
			}
		}
	});
});

describe("floatToDegPctPct()", () => {
	it("should return deg, percent and percent values corresponding to rad, float and float", () => {
		for (let rad = 0; rad <= Math.PI * 2.0; rad += 0.01) {
			for (let float = 0; float <= 1.0; float += 0.01) {
				const input = [rad, float, 1.0 - float];

				const output = [
					convert.radToDeg(rad),
					convert.floatToPct(float),
					convert.floatToPct(1.0 - float)
				];

				const res = convert.floatToDegPctPct(input);

				assert.strictEqual(res[0], output[0]);
				assert.strictEqual(res[1], output[1]);
				assert.strictEqual(res[2], output[2]);
			}
		}
	});
});
