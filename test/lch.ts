import * as assert from 'assert';
import { describe, it } from 'mocha';
import { angleUnit } from '../source/real';
import { cssPrecision } from '../source/parse';
import * as labApi from '../source/lab';
import {
	Copy,
	Create,
	CssLch,
	Lab,
	assign,
	assignLab,
	copy,
	cssLch,
	equals,
	isChromaHuePowerless,
	isHuePowerless,
	lab,
	toCss,
	toLab
} from '../source/lch';
import { assertEqualsLab, assertEqualsLch } from './assert/assert';


describe('equals', () => {
	it('should return true if a equals b', () => {
		const a = Create();
		const b = a;
		const c = Copy(a);
		const d = { ...a, lightness : Number.NaN };

		assert.strictEqual(equals(a, b), true);
		assert.strictEqual(equals(a, c), true);
		assert.strictEqual(equals(d, d), false);
		assert.strictEqual(equals(a, { ...a, lightness : a.lightness + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, chroma : a.chroma + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, hue : a.hue + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, alpha : a.alpha + 0.1 }), false);
		assert.strictEqual(equals(Create(Number.NaN), Create(Number.NaN)), false);
		assert.strictEqual(equals(Create(0.0, Number.NaN), Create(0.0, Number.NaN)), false);
		assert.strictEqual(equals(Create(0.0, 0.0, Number.NaN), Create(0.0, 0.0, Number.NaN)), false);
		assert.strictEqual(equals(Create(0.0, 0.0, 0.0, Number.NaN), Create(0.0, 0.0, 0.0, Number.NaN)), false);
		assert.strictEqual(equals(Create(1.0), Create(1.01), 1e-3), false);
		assert.strictEqual(equals(Create(1.0), Create(1.01), 1e-1), true);
		assert.strictEqual(equals(Create(0.0, 1.0), Create(0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 1.0), Create(0.0, 1.01), 1e-1), true);
		assert.strictEqual(equals(Create(0.0, 0.0, 1.0), Create(0.0, 0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 0.0, 1.0), Create(0.0, 0.0, 1.01), 1e-1), true);
		assert.strictEqual(equals(Create(0.0, 0.0, -Math.PI), Create(0.0, 0.0, Math.PI)), true);
		assert.strictEqual(equals(Create(0.0, 0.0, -Math.PI), Create(0.0, 0.0, Math.PI * 3.0)), true);
		assert.strictEqual(equals(Create(0.0, 0.0, 0.0, 1.0), Create(0.0, 0.0, 0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 0.0, 0.0, 1.0), Create(0.0, 0.0, 0.0, 1.01), 1e-1), true);
	});
});

describe('isChromeHuePowerless', () => {
	it('should return true if both chroma and hue are powerless', () => {
		assert.strictEqual(isChromaHuePowerless(Create(100.0, 0.0, 0.0, 1.0)), false);
		assert.strictEqual(isChromaHuePowerless(Create(100.0, 0.0, 0.0, 0.0)), false);
		assert.strictEqual(isChromaHuePowerless(Create(0.0, 0.0, 0.0, 1.0)), true);
		assert.strictEqual(isChromaHuePowerless(Create(0.0, 0.0, 0.0, 0.0)), true);
		assert.strictEqual(isChromaHuePowerless(Create(Number.NaN, 0.0, 0.0, 1.0)), true);
		assert.strictEqual(isChromaHuePowerless(Create(100.0, Number.NaN, 0.0, 1.0)), false);
		assert.strictEqual(isChromaHuePowerless(Create(100.0, 0.0, Number.NaN, 1.0)), false);
		assert.strictEqual(isChromaHuePowerless(Create(100.0, 0.0, 0.0, Number.NaN)), false);
		assert.strictEqual(isChromaHuePowerless(Create(0.01, 0.0, 0.0, 1.0), 1e-1), true);
		assert.strictEqual(isChromaHuePowerless(Create(0.01, 0.0, 0.0, 1.0), 1e-3), false);
	});
});

describe('isHuePowerless', () => {
	it('should return true if hue is powerless', () => {
		assert.strictEqual(isHuePowerless(Create(100.0, 0.0, 0.0, 1.0)), true);
		assert.strictEqual(isHuePowerless(Create(100.0, 0.0, 0.0, 0.0)), true);
		assert.strictEqual(isHuePowerless(Create(0.0, 0.0, 0.0, 1.0)), true);
		assert.strictEqual(isHuePowerless(Create(0.0, 0.0, 0.0, 0.0)), true);
		assert.strictEqual(isHuePowerless(Create(100.0, 100.0, 0.0, 1.0)), false);
		assert.strictEqual(isHuePowerless(Create(100.0, 0.0, 0.0, 0.0)), true);
		assert.strictEqual(isHuePowerless(Create(0.0, 100.0, 0.0, 1.0)), true);
		assert.strictEqual(isHuePowerless(Create(0.0, 0.0, 0.0, 0.0)), true);
		assert.strictEqual(isHuePowerless(Create(Number.NaN, 100.0, 0.0, 1.0)), true);
		assert.strictEqual(isHuePowerless(Create(100.0, Number.NaN, 0.0, 1.0)), true);
		assert.strictEqual(isHuePowerless(Create(100.0, 100.0, Number.NaN, 1.0)), false);
		assert.strictEqual(isHuePowerless(Create(100.0, 100.0, 0.0, Number.NaN)), false);
		assert.strictEqual(isHuePowerless(Create(0.01, 1.0, 0.0, 1.0), 1e-1), true);
		assert.strictEqual(isHuePowerless(Create(0.01, 1.0, 0.0, 1.0), 1e-3), false);
		assert.strictEqual(isHuePowerless(Create(1.0, 0.01, 0.0, 1.0), 1e-1), true);
		assert.strictEqual(isHuePowerless(Create(1.0, 0.01, 0.0, 1.0), 1e-3), false);
	});
});

describe('Create', () => {
	it('should return a L*C*h° color', () => {
		assert.deepStrictEqual(Create(), { lightness : 100.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(Number.NaN), { lightness : Number.NaN, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, Number.NaN), { lightness : 0.0, chroma : Number.NaN, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 0.0, Number.NaN), { lightness : 0.0, chroma : 0.0, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 0.0, 0.0, Number.NaN), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : Number.NaN });
		assert.deepStrictEqual(Create(1.0, 2.0, 3.0, 4.0), { lightness : 1.0, chroma : 2.0, hue : 3.0, alpha : 4.0 });
	});
});

describe('assign', () => {
	it('should assign a L*C*h° color', () => {
		const lch = Create(1.0, 2.0, 3.0, 4.0);

		assert.deepStrictEqual(assign(lch), { lightness : 100.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lch, Number.NaN), { lightness : Number.NaN, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lch, 0.0, Number.NaN), { lightness : 0.0, chroma : Number.NaN, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lch, 0.0, 0.0, Number.NaN), { lightness : 0.0, chroma : 0.0, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(assign(lch, 0.0, 0.0, 0.0, Number.NaN), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : Number.NaN });

		const r = assign(lch, 1.0, 2.0, 3.0, 4.0);

		assert.deepStrictEqual(r, { lightness : 1.0, chroma : 2.0, hue : 3.0, alpha : 4.0 });
		assert.strictEqual(lch, r);
	});
});

describe('Lab', () => {
	const epsilon = 1e-10;

	it('should return a L*C*h° color representing a L*a*b* color', () => {
		assert.deepStrictEqual(Lab(labApi.Create()), { lightness : 100.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Lab(labApi.Create(Number.NaN)), { lightness : Number.NaN, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Lab(labApi.Create(50.0, Number.NaN)), { lightness : 50.0, chroma : Number.NaN, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(Lab(labApi.Create(50.0, 1.0, Number.NaN)), { lightness : 50.0, chroma : Number.NaN, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(Lab(labApi.Create(50.0, 1.0, 1.0, Number.NaN)), { lightness : 50.0, chroma : Math.sqrt(1.0 + 1.0), hue : Math.PI * 0.25, alpha : Number.NaN });
		assert.deepStrictEqual(
			Lab(labApi.Create(10.0, 100.0, 0.0, 0.1)),
			{ lightness : 10.0, chroma : Math.sqrt(100.0 ** 2), hue : 0.0, alpha : 0.1 }
		);
		assert.deepStrictEqual(
			Lab(labApi.Create(20.0, 0.0, 100.0, 0.2)),
			{ lightness : 20.0, chroma : Math.sqrt(100.0 ** 2), hue : Math.PI * 0.5, alpha : 0.2 }
		);
		assert.deepStrictEqual(
			Lab(labApi.Create(30.0, -100.0, 0.0, 0.3)),
			{ lightness : 30.0, chroma : Math.sqrt(100.0 ** 2), hue : Math.PI, alpha : 0.3 }
		);
		assert.deepStrictEqual(
			Lab(labApi.Create(40.0, 0.0, -100.0, 0.4)),
			{ lightness : 40.0, chroma : Math.sqrt(100.0 ** 2), hue : -Math.PI * 0.5, alpha : 0.4 }
		);
		assertEqualsLch(
			Lab(labApi.Create(50.0, 50.0 * Math.cos(Math.PI * 1.125), 50.0 * Math.sin(Math.PI * 1.125), 0.5)),
			{ lightness : 50.0, chroma : 50.0, hue : Math.PI * -0.875, alpha : 0.5 },
			epsilon
		);
	});
});

describe('lab', () => {
	const epsilon = 1e-10;

	it('should assign a L*C*h° color to represent a L*a*b* color', () => {
		const lch = Create();

		assert.deepStrictEqual(lab(lch, labApi.Create()), { lightness : 100.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(lab(lch, labApi.Create(Number.NaN)), { lightness : Number.NaN, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(lab(lch, labApi.Create(50.0, Number.NaN)), { lightness : 50.0, chroma : Number.NaN, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(lab(lch, labApi.Create(50.0, 1.0, Number.NaN)), { lightness : 50.0, chroma : Number.NaN, hue : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(lab(lch, labApi.Create(50.0, 1.0, 1.0, Number.NaN)), { lightness : 50.0, chroma : Math.sqrt(1.0 + 1.0), hue : Math.PI * 0.25, alpha : Number.NaN });

		const r = lab(lch, labApi.Create(10.0, 100.0, 0.0, 0.1));

		assert.deepStrictEqual(r, { lightness : 10.0, chroma : Math.sqrt(100.0 ** 2), hue : 0.0, alpha : 0.1 });
		assert.strictEqual(lch, r);

		assert.deepStrictEqual(
			lab(lch, labApi.Create(20.0, 0.0, 100.0, 0.2)),
			{ lightness : 20.0, chroma : Math.sqrt(100.0 ** 2), hue : Math.PI * 0.5, alpha : 0.2 }
		);
		assert.deepStrictEqual(
			lab(lch, labApi.Create(30.0, -100.0, 0.0, 0.3)),
			{ lightness : 30.0, chroma : Math.sqrt(100.0 ** 2), hue : Math.PI, alpha : 0.3 }
		);
		assert.deepStrictEqual(
			lab(lch, labApi.Create(40.0, 0.0, -100.0, 0.4)),
			{ lightness : 40.0, chroma : Math.sqrt(100.0 ** 2), hue : Math.PI * -0.5, alpha : 0.4 }
		);
		assertEqualsLch(
			lab(lch, labApi.Create(50.0, 50.0 * Math.cos(Math.PI * 1.125), 50.0 * Math.sin(Math.PI * 1.125), 0.5)),
			{ lightness : 50.0, chroma : 50.0, hue : Math.PI * -0.875, alpha : 0.5 },
			epsilon
		);
	});
});

describe('toLab', () => {
	const epsilon = 1e-10;

	it('should return a L*a*b* color representing a L*C*h° color', () => {
		assert.deepStrictEqual(toLab(Create()), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(toLab(Create(Number.NaN)), { lightness : Number.NaN, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(toLab(Create(50.0, Number.NaN)), { lightness : 50.0, a : Number.NaN, b : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(toLab(Create(50.0, 1.0, Number.NaN)), { lightness : 50.0, a : Number.NaN, b : Number.NaN, alpha : 1.0 });
		assertEqualsLab(toLab(Create(50.0, 1.0, Math.PI, Number.NaN)), { lightness : 50.0, a : -1.0, b : 0.0, alpha : Number.NaN }, epsilon);
		assertEqualsLab(
			toLab(Create(10.0, 100.0, 0.0, 0.1)),
			{ lightness : 10.0, a : 100.0, b : 0.0, alpha : 0.1 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(20.0, 100.0, Math.PI * 0.5, 0.2)),
			{ lightness : 20.0, a : 0.0, b : 100.0, alpha : 0.2 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(30.0, 100.0, Math.PI, 0.3)),
			{ lightness : 30.0, a : -100.0, b : 0.0, alpha : 0.3 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(40.0, 100.0, Math.PI * 1.5, 0.4)),
			{ lightness : 40.0, a : 0.0, b : -100.0, alpha : 0.4 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(50.0, 100.0, Math.PI * 2.0, 0.5)),
			{ lightness : 50.0, a : 100.0, b : 0.0, alpha : 0.5 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(60.0, 100.0, Math.PI * -0.5, 0.6)),
			{ lightness : 60.0, a : 0.0, b : -100.0, alpha : 0.6 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(70.0, 100.0, Math.PI * 2.5, 0.7)),
			{ lightness : 70.0, a : 0.0, b : 100.0, alpha : 0.7 },
			epsilon
		);
		assertEqualsLab(
			toLab(Create(80.0, 50.0, Math.PI * 1.125, 0.8)),
			{ lightness : 80.0, a : 50.0 * Math.cos(Math.PI * 1.125), b : 50.0 * Math.sin(Math.PI * 1.125), alpha : 0.8 },
			epsilon
		);
	});
});

describe('assignLab', () => {
	const epsilon = 1e-10;

	it('should assign a L*a*b* color to represent a L*C*h° color', () => {
		const labColor = labApi.Create();

		assert.deepStrictEqual(assignLab(labColor, Create()), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assignLab(labColor, Create(Number.NaN)), { lightness : Number.NaN, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assignLab(labColor, Create(50.0, Number.NaN)), { lightness : 50.0, a : Number.NaN, b : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(assignLab(labColor, Create(50.0, 1.0, Number.NaN)), { lightness : 50.0, a : Number.NaN, b : Number.NaN, alpha : 1.0 });
		assertEqualsLab(assignLab(labColor, Create(50.0, 1.0, Math.PI, Number.NaN)), { lightness : 50.0, a : -1.0, b : 0.0, alpha : Number.NaN }, epsilon);

		const r = assignLab(labColor, Create(10.0, 100.0, 0.0, 0.1));

		assertEqualsLab(r, { lightness : 10.0, a : 100.0, b : 0.0, alpha : 0.1 }, epsilon);
		assert.strictEqual(labColor, r);

		assertEqualsLab(
			assignLab(labColor, Create(20.0, 100.0, Math.PI * 0.5, 0.2)),
			{ lightness : 20.0, a : 0.0, b : 100.0, alpha : 0.2 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(30.0, 100.0, Math.PI, 0.3)),
			{ lightness : 30.0, a : -100.0, b : 0.0, alpha : 0.3 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(40.0, 100.0, Math.PI * 1.5, 0.4)),
			{ lightness : 40.0, a : 0.0, b : -100.0, alpha : 0.4 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(50.0, 100.0, Math.PI * 2.0, 0.5)),
			{ lightness : 50.0, a : 100.0, b : 0.0, alpha : 0.5 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(60.0, 100.0, Math.PI * -0.5, 0.6)),
			{ lightness : 60.0, a : 0.0, b : -100.0, alpha : 0.6 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(70.0, 100.0, Math.PI * 2.5, 0.7)),
			{ lightness : 70.0, a : 0.0, b : 100.0, alpha : 0.7 },
			epsilon
		);
		assertEqualsLab(
			assignLab(labColor, Create(80.0, 50.0, Math.PI * 1.125, 0.8)),
			{ lightness : 80.0, a : 50.0 * Math.cos(Math.PI * 1.125), b : 50.0 * Math.sin(Math.PI * 1.125), alpha : 0.8 },
			epsilon
		);
	});
});

describe('CssLch', () => {
	const epsilon = 1e-10;
	const turn = Math.PI * 2.0;

	it('should return a L*C*h° color representing a lch() string', () => {
		assert.deepStrictEqual(CssLch('lch(0 0 0)'), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(CssLch('lch(0 0 0/0)'), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : 0.0 });
		assert.deepStrictEqual(CssLch('lch( 100   50   90 )'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 1.0 });
		assert.deepStrictEqual(CssLch('lch( 100   50   90  /  0.5 )'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.5 });
		assert.deepStrictEqual(CssLch('lch(100% 50% 90deg)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 1.0 });
		assert.deepStrictEqual(CssLch('lch(100% 50% 90deg/75%)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 });
		assert.deepStrictEqual(CssLch('lch( 100%   50%   90deg )'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 1.0 });
		assert.deepStrictEqual(CssLch('lch( 100%   50%   90deg  /  75% )'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 });
		assertEqualsLch(CssLch('lch(100% 50 90 / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50% 90 / 0.75)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50 0.25turn / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50 1.57rad / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : 1.57, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50 90deg / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50 100grad / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(100 50 90 / 75%)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(200 150 -90 / 0.75)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.75, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(200% 150% 90 / 75%)'), { lightness : 200.0, chroma : 225.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(CssLch('lch(-200 -150 90 / -0.75)'), { lightness : 0.0, chroma : 0.0, hue : turn * 0.25, alpha : 0.0 }, epsilon);
		assertEqualsLch(CssLch('lch(-200% -150% 90 / -75%)'), { lightness : 0.0, chroma : 0.0, hue : turn * 0.25, alpha : 0.0 }, epsilon);
		assertEqualsLch(CssLch('lch(200 150 90 / 2.0)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.25, alpha : 1.0 }, epsilon);
		assertEqualsLch(CssLch('lch(200 150 90 / 200%)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.25, alpha : 1.0 }, epsilon);
	});

	it('should throw for invalid lch() strings', () => {
		assert.throws(() => CssLch('lch(foo)'), new Error("bad css color 'lch(foo)'"));
		assert.throws(() => CssLch('lch(a 0 0 / 0)'), new Error("bad css color 'lch(a 0 0 / 0)'"));
		assert.throws(() => CssLch('lch(0 b 0 / 0)'), new Error("bad css color 'lch(0 b 0 / 0)'"));
		assert.throws(() => CssLch('lch(0 0 c / 0)'), new Error("bad css color 'lch(0 0 c / 0)'"));
		assert.throws(() => CssLch('lch(0 0 0 / d)'), new Error("bad css color 'lch(0 0 0 / d)'"));
		assert.throws(() => CssLch('lch(0a 0 0 / 0)'), new Error("bad css color 'lch(0a 0 0 / 0)'"));
		assert.throws(() => CssLch('lch(0 0b 0 / 0)'), new Error("bad css color 'lch(0 0b 0 / 0)'"));
		assert.throws(() => CssLch('lch(0 0 0c / 0)'), new Error("bad css color 'lch(0 0 0c / 0)'"));
		assert.throws(() => CssLch('lch(0 0 0 / 0d)'), new Error("bad css color 'lch(0 0 0 / 0d)'"));
	});
});

describe('cssLch', () => {
	const epsilon = 1e-10;
	const turn = Math.PI * 2.0;

	it('should assign a L*C*h° color to represent a lch() string', () => {
		const lch = Create();

		assert.deepStrictEqual(cssLch(lch, 'lch(0 0 0)'), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(cssLch(lch, 'lch(0 0 0/0)'), { lightness : 0.0, chroma : 0.0, hue : 0.0, alpha : 0.0 });

		const r = cssLch(lch, 'lch( 100   50   90 )');

		assert.deepStrictEqual(r, { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 1.0 });
		assert.strictEqual(lch, r);

		assert.deepStrictEqual(cssLch(lch, 'lch( 100   50   90  /  0.5 )'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.5 });
		assert.deepStrictEqual(cssLch(lch, 'lch(100% 50% 90deg)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 1.0 });
		assert.deepStrictEqual(cssLch(lch, 'lch(100% 50% 90deg/75%)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 });
		assert.deepStrictEqual(cssLch(lch, 'lch( 100%   50%   90deg )'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 1.0 });
		assert.deepStrictEqual(cssLch(lch, 'lch( 100%   50%   90deg  /  75% )'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 });
		assertEqualsLch(cssLch(lch, 'lch(100% 50 90 / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50% 90 / 0.75)'), { lightness : 100.0, chroma : 75.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50 0.25turn / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50 1.57rad / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : 1.57, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50 90deg / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50 100grad / 0.75)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(100 50 90 / 75%)'), { lightness : 100.0, chroma : 50.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(200 150 -90 / 0.75)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.75, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(200% 150% 90 / 75%)'), { lightness : 200.0, chroma : 225.0, hue : turn * 0.25, alpha : 0.75 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(-200 -150 90 / -0.75)'), { lightness : 0.0, chroma : 0.0, hue : turn * 0.25, alpha : 0.0 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(-200% -150% 90 / -75%)'), { lightness : 0.0, chroma : 0.0, hue : turn * 0.25, alpha : 0.0 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(200 150 90 / 2.0)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.25, alpha : 1.0 }, epsilon);
		assertEqualsLch(cssLch(lch, 'lch(200 150 90 / 200%)'), { lightness : 200.0, chroma : 150.0, hue : turn * 0.25, alpha : 1.0 }, epsilon);
	});

	it('should throw for invalid lch() strings', () => {
		const lch = Create();

		assert.throws(() => cssLch(lch, 'lch(foo)'), new Error("bad css color 'lch(foo)'"));
		assert.throws(() => cssLch(lch, 'lch(a 0 0 / 0)'), new Error("bad css color 'lch(a 0 0 / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 b 0 / 0)'), new Error("bad css color 'lch(0 b 0 / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 0 c / 0)'), new Error("bad css color 'lch(0 0 c / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 0 0 / d)'), new Error("bad css color 'lch(0 0 0 / d)'"));
		assert.throws(() => cssLch(lch, 'lch(0a 0 0 / 0)'), new Error("bad css color 'lch(0a 0 0 / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 0b 0 / 0)'), new Error("bad css color 'lch(0 0b 0 / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 0 0c / 0)'), new Error("bad css color 'lch(0 0 0c / 0)'"));
		assert.throws(() => cssLch(lch, 'lch(0 0 0 / 0d)'), new Error("bad css color 'lch(0 0 0 / 0d)'"));
	});
});

describe('toCss', () => {
	const THIRD = 1.0 / 3.0;

	it('should return a lch() string', () => {
		assert.strictEqual(toCss(Create()), 'lch(100 0 0)');
		assert.strictEqual(toCss(Create(75.0, 50.0, Math.PI, 0.25)), 'lch(75 50 180/0.251)');
		assert.strictEqual(toCss(Create(-75.0, -50.0, -Math.PI, -0.25)), 'lch(0 0 180/0)');
		assert.strictEqual(toCss(Create(175.0, 150.0, Math.PI * 3.0, 1.25)), 'lch(175 150 180)');
		assert.strictEqual(
			toCss(Create(0.5, 0.5, Math.PI, 0.5), { precision : cssPrecision.uint8 }),
			'lch(0.5 0.5 180/0.502)'
		);
		assert.strictEqual(
			toCss(Create(0.5, 0.5, Math.PI, 0.5), { precision : cssPrecision.float64 }),
			'lch(0.5 0.5 180/0.5)'
		);
		assert.strictEqual(
			toCss(Create(THIRD, THIRD, Math.PI * 2.0 / 7.0, 0.5), {
				precision : cssPrecision.uint8,
				decimals : 2
			}),
			'lch(0.33 0.33 51.43/0.5)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				percent : true,
				precision : cssPrecision.uint8
			}),
			'lch(75% 33.333% 180/50.2%)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				percent : true,
				precision : cssPrecision.float64
			}),
			'lch(75% 33.333% 180/50%)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				percent : true,
				precision : cssPrecision.uint8,
				decimals : 2
			}),
			'lch(75% 33.33% 180/50.2%)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				angleUnit : angleUnit.turn
			}),
			'lch(75 50 0.5turn/0.502)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				angleUnit : angleUnit.rad
			}),
			'lch(75 50 3.142rad/0.502)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				angleUnit : angleUnit.deg
			}),
			'lch(75 50 180/0.502)'
		);
		assert.strictEqual(
			toCss(Create(75.0, 50.0, Math.PI, 0.5), {
				angleUnit : angleUnit.grad
			}),
			'lch(75 50 200grad/0.502)'
		);
	});

	it('should throw for NaN color components');
});

describe('Copy', () => {
	it('should return a L*C*h° representing a copy', () => {
		const a = Create(100.0, 50.0, Math.PI, 0.5);
		const b = Copy(a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});

describe('copy', () => {
	it('should assign a L*C*h° to represent a copy', () => {
		const a = Create(100.0, 50.0, Math.PI, 0.5);
		const b = Create();
		const r = copy(b, a);

		assert.deepStrictEqual(a, b);
		assert.deepStrictEqual(a, r);
		assert.notStrictEqual(a, b);
		assert.strictEqual(b, r);
	});
});
