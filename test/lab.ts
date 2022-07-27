import * as assert from 'assert';
import { describe, it } from 'mocha';
import { assertEqualsLab as assertEquals } from './assert/assert';
import { vector4 as vec4 } from 'xyzw';
import { cssPrecision } from '../source/parse';
import { srgb } from '../source/colorSpace';
import {
	Copy,
	Create,
	CssLab,
	Rgba,
	assign,
	assignRgba,
	copy,
	cssLab,
	d50,
	d65,
	equals,
	rgba,
	toCss,
	toRgba
} from '../source/lab';


describe('equals', () => {
	it('should return true if a equals b', () => {
		const a = Create(100.0, 0.0, 0.0);
		const b = a;
		const c = Copy(a);
		const d = { ...a, lightness : Number.NaN };

		assert.strictEqual(equals(a, b), true);
		assert.strictEqual(equals(a, c), true);
		assert.strictEqual(equals(d, d), false);
		assert.strictEqual(equals(a, { ...a, lightness : a.lightness + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, a : a.a + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, b : a.b + 0.1 }), false);
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
		assert.strictEqual(equals(Create(0.0, 0.0, 0.0, 1.0), Create(0.0, 0.0, 0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 0.0, 0.0, 1.0), Create(0.0, 0.0, 0.0, 1.01), 1e-1), true);
	});
});

describe('Create', () => {
	it('should return a L*a*b* color', () => {
		assert.deepStrictEqual(Create(), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(Number.NaN), { lightness : Number.NaN, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, Number.NaN), { lightness : 0.0, a : Number.NaN, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 1.0, Number.NaN), { lightness : 0.0, a : 1.0, b : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 0.0, 1.0, Number.NaN), { lightness : 0.0, a : 0.0, b : 1.0, alpha : Number.NaN });
		assert.deepStrictEqual(Create(1.0, 2.0, 3.0, 4.0), { lightness : 1.0, a : 2.0, b : 3.0, alpha : 4.0 });
	});
});

describe('assign', () => {
	it('should assign a L*a*b* color', () => {
		const lab = Create(101.1, 202.2, 303.3, 4.4);

		assert.deepStrictEqual(assign(lab), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lab, Number.NaN), { lightness : Number.NaN, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lab, 0.0, Number.NaN), { lightness : 0.0, a : Number.NaN, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(lab, 0.0, 100.0, Number.NaN), { lightness : 0.0, a : 100.0, b : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(assign(lab, 0.0, 0.0, 100.0, Number.NaN), { lightness : 0.0, a : 0.0, b : 100.0, alpha : Number.NaN });

		const r = assign(lab, 100.0, 20.0, 30.0, 4.0);

		assert.deepStrictEqual(r, { lightness : 100.0, a : 20.0, b : 30.0, alpha : 4.0 });
		assert.strictEqual(lab, r);
	});
});

describe('Rgba', () => {
	const epsilon = 1e-2;
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;

	it('should return a L*a*b* color representing a rgba color', () => {
		assert.deepStrictEqual(Rgba({ x : nan, y : 0.0, z : 0.0, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : nan, z : 0.0, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : 0.0, z : nan, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : 0.0, z : 0.0, w : nan }), { lightness : 0.0, a : 0.0, b : 0.0, alpha : nan });
		assertEquals(Rgba({ x : 0.0, y : 0.0, z : 0.0, w : 0.0 }), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 0.0 }, epsilon);
		assertEquals(
			Rgba({ x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 100.0, a : 0.01, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 100.0, a : 0.01, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.5, y : 0.5, z : 0.5, w : THIRD }, d50, srgb.expand),
			{ lightness : 53.39, a : 0.0, b : 0.0, alpha : THIRD },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.5, y : 0.5, z : 0.5, w : THIRD }, d65, srgb.expand),
			{ lightness : 53.39, a : 0.0, b : 0.0, alpha : THIRD },
			epsilon
		);
		assertEquals(
			Rgba({ x : THIRD, y : THIRD, z : THIRD, w : 1.0 }, d50, srgb.expand),
			{ lightness : 36.15, a : 0.0, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : THIRD, y : THIRD, z : THIRD, w : 1.0 }, d65, srgb.expand),
			{ lightness : 36.15, a : 0.0, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 54.28, a : 80.83, b : 69.91, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 53.23, a : 80.11, b : 67.22, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 1.0, z : 0.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 97.61, a : -15.75, b : 93.39, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 1.0, z : 0.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 97.14, a : -21.55, b : 94.48, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 87.82, a : -79.28, b : 80.99, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 87.74, a : -86.18, b : 83.18, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 1.0, z : 1.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 90.67, a : -50.65, b : -14.97, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 1.0, z : 1.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 91.12, a : -48.07, b : -14.13, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 29.57, a : 68.31, b : -112.03, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 32.30, a : 79.20, b : -107.86, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 0.0, z : 1.0, w : 1.0 }, d50, srgb.expand),
			{ lightness : 60.17, a : 93.57, b : -60.51, alpha : 1.0 },
			epsilon
		);
		assertEquals(
			Rgba({ x : 1.0, y : 0.0, z : 1.0, w : 1.0 }, d65, srgb.expand),
			{ lightness : 60.32, a : 98.26, b : -60.84, alpha : 1.0 },
			epsilon
		);
	});
});

describe('rgba', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;

	it('should assign a L*a*b* color representing a rgba color', () => {
		const lab = Create();

		assert.deepStrictEqual(rgba(lab, { x : nan, y : 0.0, z : 0.0, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : nan, z : 0.0, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : 0.0, z : nan, w : 1.0 }), { lightness : nan, a : nan, b : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : 0.0, z : 0.0, w : nan }), { lightness : 0.0, a : 0.0, b : 0.0, alpha : nan });

		const res = rgba(lab, { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });

		assert.deepStrictEqual(res, Rgba({ x : 0.0, y : 0.0, z : 0.0, w : 0.0 }));
		assert.strictEqual(lab, res);

		assert.deepStrictEqual(
			rgba(lab, { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, d65, srgb.expand),
			Rgba({ x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, d65, srgb.expand)
		);
		assert.deepStrictEqual(rgba(lab, { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }), Rgba({ x : 1.0, y : 1.0, z : 1.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 0.5, y : 0.5, z : 0.5, w : THIRD }), Rgba({ x : 0.5, y : 0.5, z : 0.5, w : THIRD }));
		assert.deepStrictEqual(rgba(lab, { x : THIRD, y : THIRD, z : THIRD, w : 1.0 }), Rgba({ x : THIRD, y : THIRD, z : THIRD, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }), Rgba({ x : 1.0, y : 0.0, z : 0.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 1.0, y : 1.0, z : 0.0, w : 1.0 }), Rgba({ x : 1.0, y : 1.0, z : 0.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }), Rgba({ x : 0.0, y : 1.0, z : 0.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : 1.0, z : 1.0, w : 1.0 }), Rgba({ x : 0.0, y : 1.0, z : 1.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }), Rgba({ x : 0.0, y : 0.0, z : 1.0, w : 1.0 }));
		assert.deepStrictEqual(rgba(lab, { x : 1.0, y : 0.0, z : 1.0, w : 1.0 }), Rgba({ x : 1.0, y : 0.0, z : 1.0, w : 1.0 }));
	});
});

describe('toRgba', () => {
	const epsilon = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing a L*a*b* color', () => {
		assert.deepStrictEqual(toRgba({ lightness : nan, a : 0.0, b : 0.0, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(toRgba({ lightness : 0.0, a : nan, b : 0.0, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(toRgba({ lightness : 0.0, a : 0.0, b : nan, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(toRgba({ lightness : 0.0, a : 0.0, b : 0.0, alpha : nan }), { x : 0.0, y : 0.0, z : 0.0, w : nan });
		assertEquals(Rgba(toRgba({ lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 })), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(toRgba({ lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 })), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(toRgba({ lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 })), { lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(
			Rgba(toRgba({ lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 }, d65, srgb.compress), d65, srgb.expand),
			{ lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(Rgba(toRgba({ lightness : 50.0, a : 0.0, b : 100.0, alpha : 1.0 })), { lightness : 50.0, a : 0.0, b : 100.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(toRgba({ lightness : 50.0, a : -100.0, b : 0.0, alpha : 1.0 })), { lightness : 50.0, a : -100.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(toRgba({ lightness : 50.0, a : 0.0, b : -100.0, alpha : 1.0 })), { lightness : 50.0, a : 0.0, b : -100.0, alpha : 1.0 }, epsilon);
	});
});

describe('assignRgba', () => {
	const epsilon = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector4 to represent a L*a*b* color', () => {
		const v = vec4.Create();

		assert.deepStrictEqual(assignRgba(v, { lightness : nan, a : 0.0, b : 0.0, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(assignRgba(v, { lightness : 0.0, a : nan, b : 0.0, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(assignRgba(v, { lightness : 0.0, a : 0.0, b : nan, alpha : 1.0 }), { x : nan, y : nan, z : nan, w : 1.0 });
		assert.deepStrictEqual(assignRgba(v, { lightness : 0.0, a : 0.0, b : 0.0, alpha : nan }), { x : 0.0, y : 0.0, z : 0.0, w : nan });
		assertEquals(Rgba(assignRgba(v, { lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 })), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 }, epsilon);

		const r = assignRgba(v, { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 });

		assertEquals(Rgba(r), { lightness : 100.0, a : 0.0, b : 0.0, alpha : 1.0 }, epsilon);
		assert.strictEqual(v, r);

		assertEquals(Rgba(assignRgba(v, { lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 })), { lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(
			Rgba(assignRgba(v, { lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 }, d65, srgb.compress), d65, srgb.expand),
			{ lightness : 50.0, a : 100.0, b : 0.0, alpha : 1.0 },
			epsilon
		);
		assertEquals(Rgba(assignRgba(v, { lightness : 50.0, a : 0.0, b : 100.0, alpha : 1.0 })), { lightness : 50.0, a : 0.0, b : 100.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(assignRgba(v, { lightness : 50.0, a : -100.0, b : 0.0, alpha : 1.0 })), { lightness : 50.0, a : -100.0, b : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba(assignRgba(v, { lightness : 50.0, a : 0.0, b : -100.0, alpha : 1.0 })), { lightness : 50.0, a : 0.0, b : -100.0, alpha : 1.0 }, epsilon);
	});
});

describe('CssLab', () => {
	it('should return a Lab color representing a lab() string', () => {
		assert.deepStrictEqual(CssLab('lab(0 0 0)'), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(CssLab('lab(0 0 0/0)'), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 0.0 });
		assert.deepStrictEqual(CssLab('lab( 100   50   25 )'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 1.0 });
		assert.deepStrictEqual(CssLab('lab( 100   50   25  /  0.5 )'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.5 });
		assert.deepStrictEqual(CssLab('lab(100% 50% 25%)'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 1.0 });
		assert.deepStrictEqual(CssLab('lab(100% 50% 25%/75%)'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab( 100%   50%   25% )'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 1.0 });
		assert.deepStrictEqual(CssLab('lab( 100%   50%   25%  /  75% )'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(100% 50 25 / 0.75)'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(100 50% 25 / 0.75)'), { lightness : 100.0, a : 62.5, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(100 50 25% / 0.75)'), { lightness : 100.0, a : 50.0, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(100 50 25 / 75%)'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(200 150 -150 / 0.75)'), { lightness : 200.0, a : 150.0, b : -150.0, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(200% 150% -150% / 75%)'), { lightness : 200.0, a : 187.5, b : -187.5, alpha : 0.75 });
		assert.deepStrictEqual(CssLab('lab(-200 150 -150 / -0.75)'), { lightness : 0.0, a : 150.0, b : -150.0, alpha : 0.0 });
		assert.deepStrictEqual(CssLab('lab(-200% 150% -150% / -75%)'), { lightness : 0.0, a : 187.5, b : -187.5, alpha : 0.0 });
		assert.deepStrictEqual(CssLab('lab(200 150 -150 / 2.0)'), { lightness : 200.0, a : 150.0, b : -150.0, alpha : 1.0 });
		assert.deepStrictEqual(CssLab('lab(200% 150% -150% / 200%)'), { lightness : 200.0, a : 187.5, b : -187.5, alpha : 1.0 });
	});

	it('should throw for invalid lab() strings', () => {
		assert.throws(() => CssLab('lab(foo)'), new Error("bad css color 'lab(foo)'"));
		assert.throws(() => CssLab('lab(a 0 0 / 0)'), new Error("bad css color 'lab(a 0 0 / 0)'"));
		assert.throws(() => CssLab('lab(0 b 0 / 0)'), new Error("bad css color 'lab(0 b 0 / 0)'"));
		assert.throws(() => CssLab('lab(0 0 c / 0)'), new Error("bad css color 'lab(0 0 c / 0)'"));
		assert.throws(() => CssLab('lab(0 0 0 / d)'), new Error("bad css color 'lab(0 0 0 / d)'"));
		assert.throws(() => CssLab('lab(0a 0 0 / 0)'), new Error("bad css color 'lab(0a 0 0 / 0)'"));
		assert.throws(() => CssLab('lab(0 0b 0 / 0)'), new Error("bad css color 'lab(0 0b 0 / 0)'"));
		assert.throws(() => CssLab('lab(0 0 0c / 0)'), new Error("bad css color 'lab(0 0 0c / 0)'"));
		assert.throws(() => CssLab('lab(0 0 0 / 0d)'), new Error("bad css color 'lab(0 0 0 / 0d)'"));
	});
});

describe('cssLab', () => {
	it('should return a Lab color representing a lab() string', () => {
		const lab = Create();

		assert.deepStrictEqual(cssLab(lab, 'lab(0 0 0)'), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 1.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab(0 0 0/0)'), { lightness : 0.0, a : 0.0, b : 0.0, alpha : 0.0 });

		const r = cssLab(lab, 'lab( 100   50   25 )');

		assert.deepStrictEqual(r, { lightness : 100.0, a : 50.0, b : 25.0, alpha : 1.0 });
		assert.strictEqual(lab, r);

		assert.deepStrictEqual(cssLab(lab, 'lab( 100   50   25  /  0.5 )'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.5 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100% 50% 25%)'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 1.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100% 50% 25%/75%)'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab( 100%   50%   25% )'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 1.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab( 100%   50%   25%  /  75% )'), { lightness : 100.0, a : 62.5, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100% 50 25 / 0.75)'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100 50% 25 / 0.75)'), { lightness : 100.0, a : 62.5, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100 50 25% / 0.75)'), { lightness : 100.0, a : 50.0, b : 31.25, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(100 50 25 / 75%)'), { lightness : 100.0, a : 50.0, b : 25.0, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(200 150 -150 / 0.75)'), { lightness : 200.0, a : 150.0, b : -150.0, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(200% 150% -150% / 75%)'), { lightness : 200.0, a : 187.5, b : -187.5, alpha : 0.75 });
		assert.deepStrictEqual(cssLab(lab, 'lab(-200 150 -150 / -0.75)'), { lightness : 0.0, a : 150.0, b : -150.0, alpha : 0.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab(-200% 150% -150% / -75%)'), { lightness : 0.0, a : 187.5, b : -187.5, alpha : 0.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab(200 150 -150 / 2.0)'), { lightness : 200.0, a : 150.0, b : -150.0, alpha : 1.0 });
		assert.deepStrictEqual(cssLab(lab, 'lab(200% 150% -150% / 200%)'), { lightness : 200.0, a : 187.5, b : -187.5, alpha : 1.0 });
	});

	it('should throw for invalid lab() strings', () => {
		const lab = Create();

		assert.throws(() => cssLab(lab, 'lab(foo)'), new Error("bad css color 'lab(foo)'"));
		assert.throws(() => cssLab(lab, 'lab(a 0 0 / 0)'), new Error("bad css color 'lab(a 0 0 / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 b 0 / 0)'), new Error("bad css color 'lab(0 b 0 / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0 c / 0)'), new Error("bad css color 'lab(0 0 c / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0 0 / d)'), new Error("bad css color 'lab(0 0 0 / d)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0 0 / d)'), new Error("bad css color 'lab(0 0 0 / d)'"));
		assert.throws(() => cssLab(lab, 'lab(0a 0 0 / 0)'), new Error("bad css color 'lab(0a 0 0 / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0b 0 / 0)'), new Error("bad css color 'lab(0 0b 0 / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0 0c / 0)'), new Error("bad css color 'lab(0 0 0c / 0)'"));
		assert.throws(() => cssLab(lab, 'lab(0 0 0 / 0d)'), new Error("bad css color 'lab(0 0 0 / 0d)'"));
	});
});

describe('toCss', () => {
	const THIRD = 1.0 / 3.0;
	const nan = Number.NaN;

	it('should return a css lab() string', () => {
		assert.strictEqual(toCss(Create()), 'lab(100 0 0)');
		assert.strictEqual(toCss(Create(75.0, 50.0, -50.0, 0.25)), 'lab(75 50 -50/0.251)');
		assert.strictEqual(toCss(Create(150.0, 180.0, -180.0, 1.1)), 'lab(150 180 -180)');
		assert.strictEqual(toCss(Create(-150.0, -180.0, 180.0, -0.1)), 'lab(0 -180 180/0)');
		assert.strictEqual(
			toCss(Create(0.5, 0.5, 0.5, 0.5), { precision : cssPrecision.uint8 }),
			'lab(0.5 0.5 0.5/0.502)'
		);
		assert.strictEqual(
			toCss(Create(0.5, 0.5, 0.5, 0.5), { precision : cssPrecision.float64 }),
			'lab(0.5 0.5 0.5/0.5)'
		);
		assert.strictEqual(
			toCss(Create(THIRD, THIRD, THIRD, 0.5), {
				precision : cssPrecision.uint8,
				decimals : 2
			}),
			'lab(0.33 0.33 0.33/0.5)'
		);
		assert.strictEqual(
			toCss(Create(100.0, 50.0, -50.0, 0.5), {
				percent : true,
				precision : cssPrecision.uint8
			}),
			'lab(100% 40% -40%/50.2%)'
		);
		assert.strictEqual(
			toCss(Create(100.0, 50.0, -50.0, 0.5), {
				percent : true,
				precision : cssPrecision.float64
			}),
			'lab(100% 40% -40%/50%)'
		);
		assert.strictEqual(
			toCss(Create(THIRD, THIRD * 1.25, THIRD * 1.25, 0.5), {
				percent : true,
				precision : cssPrecision.uint8,
				decimals : 2
			}),
			'lab(0.33% 0.33% 0.33%/50.2%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toCss(Create(nan)), new Error('bad lab "NaN 0.00 0.00 1.00"'));
		assert.throws(() => toCss(Create(0.0, nan)), new Error('bad lab "0.00 NaN 0.00 1.00"'));
		assert.throws(() => toCss(Create(0.0, 0.0, nan)), new Error('bad lab "0.00 0.00 NaN 1.00"'));
		assert.throws(() => toCss(Create(0.0, 0.0, 0.0, nan)), new Error('bad lab "0.00 0.00 0.00 NaN"'));
	});
});

describe('Copy', () => {
	it('should return a L*a*b* color representing a copy', () => {
		const a = Create(100.0, 80.0, -80.0, 0.5);
		const b = Copy(a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});

describe('copy', () => {
	it('should assign a L*a*b* color to represent a copy', () => {
		const a = Create(100.0, 80.0, -80.0, 0.5);
		const b = Create();
		const r = copy(b, a);

		assert.deepStrictEqual(a, b);
		assert.deepStrictEqual(a, r);
		assert.notStrictEqual(a, b);
		assert.strictEqual(b, r);
	});
});
