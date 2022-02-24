import * as assert from 'assert';
import { describe, it } from 'mocha';
import { vector4 as vec4 } from 'xyzw';
import { angleUnit } from '../source/real';
import { cssFormat, cssPrecision } from '../source/parse';
import * as hslApi from '../source/hsl';
import {
	Copy,
	Create,
	CssHsla,
	CssHslaToRgba,
	Hsl,
	Rgba,
	assign,
	assignRgba,
	copy,
	cssHsla,
	cssHslaAssignRgba, equals, hsl, rgba, rgbaToCss, toCss, toRgba
} from '../source/hsla';
import { assertEqualsHsla as assertEquals, assertEqualsVec4 } from './assert/assert';
import { createColorSpace, createTransferFunction } from './mock/colorSpace';


const epsilon = 1e-10;


describe('equals', () => {
	it('should return true if a equals b', () => {
		const a = Create(Math.PI, 1.0 / 3.0, 2.0 / 3.0, 0.5);
		const b = a;
		const c = Copy(a);
		const d = { ...a, lightness : Number.NaN };

		assert.strictEqual(equals(a, b), true);
		assert.strictEqual(equals(a, c), true);
		assert.strictEqual(equals(d, d), false);
		assert.strictEqual(equals(a, { ...a, hue : a.hue + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, saturation : a.saturation + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, lightness : a.lightness + 0.1 }), false);
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
	it('should return a hsla', () => {
		assert.deepStrictEqual(Create(), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(Number.NaN), { hue : Number.NaN, saturation : 0.0, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, Number.NaN), { hue : 0.0, saturation : Number.NaN, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 1.0, lightness : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(Create(0.0, 0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : Number.NaN });
		assert.deepStrictEqual(Create(1.0, 2.0, 3.0, 4.0), { hue : 1.0, saturation : 2.0, lightness : 3.0, alpha : 4.0 });
	});
});

describe('assign', () => {
	it('should assign a hsla', () => {
		const hsla = Create(1.1, 2.2, 3.3, 4.4);

		assert.deepStrictEqual(assign(hsla), { hue : 0.0, saturation : 1.0, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(hsla, Number.NaN), { hue : Number.NaN, saturation : 1.0, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(hsla, 0.0, Number.NaN), { hue : 0.0, saturation : Number.NaN, lightness : 1.0, alpha : 1.0 });
		assert.deepStrictEqual(assign(hsla, 0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 1.0, lightness : Number.NaN, alpha : 1.0 });
		assert.deepStrictEqual(assign(hsla, 0.0, 0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : Number.NaN });

		const r = assign(hsla, 1.0, 2.0, 3.0, 4.0);

		assert.deepStrictEqual(r, { hue : 1.0, saturation : 2.0, lightness : 3.0, alpha : 4.0 });
		assert.strictEqual(hsla, r);
	});
});

describe('Rgba', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TWELFTH = 1.0 / 12.0;
	const TURN = Math.PI * 2.0;

	it('should return a hsla representing a rgba color', () => {
		assert.deepStrictEqual(Rgba({ x : nan, y : 0.0, z : 0.0, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : nan, z : 0.0, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : 0.0, z : nan, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(Rgba({ x : 0.0, y : 0.0, z : 0.0, w : nan }), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : nan });
		assertEquals(Rgba({ x : 0.0, y : 0.0, z : 0.0, w : 0.0 }), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 0.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 1.0, z : 1.0, w : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.5, z : 0.5, w : THIRD }), { hue : 0.0, saturation : 0.0, lightness : 0.5, alpha : THIRD }, epsilon);
		assertEquals(Rgba({ x : THIRD, y : THIRD, z : THIRD, w : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : THIRD, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 0.0, z : 0.0, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.0, z : 0.0, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 1.0, z : 0.0, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 0.5, z : 0.0, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 0.0, z : 1.0, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 0.0, z : 0.5, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 1.0, z : 0.0, w : 1.0 }), { hue : SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 1.0, z : 1.0, w : 1.0 }), { hue : 3.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 0.0, z : 1.0, w : 1.0 }), { hue : 5.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 0.5, z : 0.5, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 0.5, z : 0.0, w : 1.0 }), { hue : TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 1.0, y : 0.0, z : 0.5, w : 1.0 }), { hue : 11.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 1.0, z : 0.5, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 1.0, z : 0.5, w : 1.0 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 1.0, z : 0.0, w : 1.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.5, z : 1.0, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.0, z : 1.0, w : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.0, y : 0.5, z : 1.0, w : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.6, y : 0.5, z : 0.4, w : 1.0 }), { hue : TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.6, y : 0.4, z : 0.5, w : 1.0 }), { hue : 11.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.4, y : 0.6, z : 0.5, w : 1.0 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.6, z : 0.4, w : 1.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.5, y : 0.4, z : 0.6, w : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(Rgba({ x : 0.4, y : 0.5, z : 0.6, w : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
	});

	it('should apply color conversions', () => {
		const t = createTransferFunction(0.5);

		assertEquals(Rgba({ x : 0.0, y : 1.0, z : 1.0, w : 0.2 }, t), { hue : Math.PI, saturation : 1.0, lightness : 0.25, alpha : 0.2 }, epsilon);
	});
});

describe('rgba', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TWELFTH = 1.0 / 12.0;
	const TURN = Math.PI * 2.0;

	it('should return a hsla representing a rgba color', () => {
		const color = Create();

		assert.deepStrictEqual(rgba(color, { x : nan, y : 0.0, z : 0.0, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(color, { x : 0.0, y : nan, z : 0.0, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(color, { x : 0.0, y : 0.0, z : nan, w : 1.0 }), { hue : nan, saturation : nan, lightness : nan, alpha : 1.0 });
		assert.deepStrictEqual(rgba(color, { x : 0.0, y : 0.0, z : 0.0, w : nan }), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : nan });

		const r = rgba(color, { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });

		assertEquals(r, { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 0.0 }, epsilon);
		assert.strictEqual(color, r);

		assertEquals(rgba(color, { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.5, z : 0.5, w : THIRD }), { hue : 0.0, saturation : 0.0, lightness : 0.5, alpha : THIRD }, epsilon);
		assertEquals(rgba(color, { x : THIRD, y : THIRD, z : THIRD, w : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : THIRD, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.0, z : 0.0, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 0.5, z : 0.0, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 0.0, z : 0.5, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.25, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 1.0, z : 0.0, w : 1.0 }), { hue : SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 1.0, z : 1.0, w : 1.0 }), { hue : 3.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 0.0, z : 1.0, w : 1.0 }), { hue : 5.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 0.5, z : 0.5, w : 1.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 0.5, z : 0.0, w : 1.0 }), { hue : TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 1.0, y : 0.0, z : 0.5, w : 1.0 }), { hue : 11.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 1.0, z : 0.5, w : 1.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 1.0, z : 0.5, w : 1.0 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 1.0, z : 0.0, w : 1.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.5, z : 1.0, w : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.75, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.0, z : 1.0, w : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.0, y : 0.5, z : 1.0, w : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.6, y : 0.5, z : 0.4, w : 1.0 }), { hue : TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.6, y : 0.4, z : 0.5, w : 1.0 }), { hue : 11.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.4, y : 0.6, z : 0.5, w : 1.0 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.6, z : 0.4, w : 1.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.5, y : 0.4, z : 0.6, w : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
		assertEquals(rgba(color, { x : 0.4, y : 0.5, z : 0.6, w : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5, alpha : 1.0 }, epsilon);
	});

	it('should apply color conversions', () => {
		const color = Create();
		const t = createTransferFunction(0.5);

		assertEquals(rgba(color, { x : 0.0, y : 1.0, z : 1.0, w : 0.2 }, t), { hue : Math.PI, saturation : 1.0, lightness : 0.25, alpha : 0.2 }, epsilon);
	});
});

describe('toRgba', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TURN = Math.PI * 2.0;

	it('should return a vector4 representing a hsla color', () => {
		assertEqualsVec4(toRgba(Create()), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : 0.0, w : nan }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.0, 0.5)), { x : 0.0, y : 0.0, z : 0.0, w : 0.5 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 1.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 1.0, 1.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 1.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, 0.5, 1.0)), { x : 0.5, y : 0.5, z : 0.5, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.0, THIRD, 1.0)), { x : THIRD, y : THIRD, z : THIRD, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(2.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(4.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(-1.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(3.0 * SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(5.0 * SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.25, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(0.0, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.125, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.75, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.375, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(2.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.75, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(2.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.375, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(3.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.75, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(3.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.375, z : 0.375, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(4.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.25, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(4.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.125, z : 0.375, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(5.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.25, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(toRgba(Create(5.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.125, z : 0.375, w : 1.0 }, epsilon);
	});

	it('should apply color conversions', () => {
		const t = createTransferFunction(2.0);

		assertEqualsVec4(toRgba(Create(Math.PI, 1.0, 0.25, 0.2), t), { x : 0.0, y : 1.0, z : 1.0, w : 0.2 }, epsilon);
	});
});

describe('assignRgba', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TURN = Math.PI * 2.0;

	it('should return a vector4 representing a hsla color', () => {
		const v = vec4.Create();

		assertEqualsVec4(assignRgba(v, Create()), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : 0.0, w : nan }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.0, 0.5)), { x : 0.0, y : 0.0, z : 0.0, w : 0.5 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, epsilon);

		const r = assignRgba(v, Create(0.0, 0.0, 1.0, 1.0));

		assertEqualsVec4(r, { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assert.strictEqual(v, r);

		assertEqualsVec4(assignRgba(v, Create(0.0, 1.0, 1.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 1.0, 0.0, 1.0)), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, 0.5, 1.0)), { x : 0.5, y : 0.5, z : 0.5, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.0, THIRD, 1.0)), { x : THIRD, y : THIRD, z : THIRD, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(2.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(4.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(-1.0 * THIRD * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 1.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(3.0 * SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 0.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(5.0 * SIXTH * TURN, 1.0, 0.5, 1.0)), { x : 1.0, y : 0.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.25, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(0.0, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.125, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.75, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.375, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(2.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.75, z : 0.25, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(2.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.375, z : 0.125, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(3.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.75, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(3.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.375, z : 0.375, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(4.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.25, y : 0.25, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(4.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.125, y : 0.125, z : 0.375, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(5.0 * SIXTH * TURN, 0.5, 0.5, 1.0)), { x : 0.75, y : 0.25, z : 0.75, w : 1.0 }, epsilon);
		assertEqualsVec4(assignRgba(v, Create(5.0 * SIXTH * TURN, 0.5, 0.25, 1.0)), { x : 0.375, y : 0.125, z : 0.375, w : 1.0 }, epsilon);
	});

	it('should apply color conversions', () => {
		const v = vec4.Create();
		const t = createTransferFunction(2.0);

		assertEqualsVec4(assignRgba(v, Create(Math.PI, 1.0, 0.25, 0.2), t), { x : 0.0, y : 1.0, z : 1.0, w : 0.2 }, epsilon);
	});
});

describe('Hsl', () => {
	it('should return an hsla representing an hsl', () => {
		assertEquals(Hsl(hslApi.Create()), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(Hsl(hslApi.Create(Number.NaN)), { hue : Number.NaN, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(Hsl(hslApi.Create(0.0, Number.NaN)), { hue : 0.0, saturation : Number.NaN, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(Hsl(hslApi.Create(0.0, 0.0, Number.NaN)), { hue : 0.0, saturation : 0.0, lightness : Number.NaN, alpha : 1.0 }, epsilon);
		assertEquals(Hsl(hslApi.Create(), Number.NaN), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : Number.NaN }, epsilon);
		assertEquals(Hsl(hslApi.Create(1.0, 2.0, 3.0), 4.0), { hue : 1.0, saturation : 2.0, lightness : 3.0, alpha : 4.0 }, epsilon);
	});
});

describe('hsl', () => {
	it('should assign an hsla to represent an hsl', () => {
		const color = Create();

		assertEquals(hsl(color, hslApi.Create()), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(hsl(color, hslApi.Create(Number.NaN)), { hue : Number.NaN, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(hsl(color, hslApi.Create(0.0, Number.NaN)), { hue : 0.0, saturation : Number.NaN, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(hsl(color, hslApi.Create(0.0, 0.0, Number.NaN)), { hue : 0.0, saturation : 0.0, lightness : Number.NaN, alpha : 1.0 }, epsilon);
		assertEquals(hsl(color, hslApi.Create(), Number.NaN), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : Number.NaN }, epsilon);

		const res = hsl(color, hslApi.Create(1.0, 2.0, 3.0), 4.0);

		assertEquals(res, { hue : 1.0, saturation : 2.0, lightness : 3.0, alpha : 4.0 }, epsilon);
		assert.strictEqual(color, res);
	});
});

describe('CssHsla', () => {
	it('should return an hsla representing a css hsla() color', () => {
		assertEquals(CssHsla('hsla(0,0%,0%,0)'), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 0.0 }, epsilon);
		assertEquals(CssHsla('hsl(0,0%,0%)'), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 1.0 }, epsilon);
		assertEquals(CssHsla('hsla(0,0%,100%)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(CssHsla('hsla( 0 , 0% , 100% )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(CssHsla('hsla(0 0% 100%)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(CssHsla('hsla( 0   0%   100% )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(CssHsla('hsl(0,0%,100%,0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla(0,0%,100%,0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla( 0 , 0% , 100% , 0.5 )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla(0 0% 100%/0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla( 0   0%   100% / 0.5 )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla(200grad,100%,50%,0.5)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla( 180deg , 100% , 50% , 0.5 )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla(`hsla(${ Math.PI }rad 100% 50%/0.5)`), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(CssHsla('hsla( 0.5turn   100%   50% / 0.5 )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
	});

	it('should throw for invalid hsla() strings', () => {
		assert.throws(() => CssHsla('hsla(foo)'), new Error("bad css color 'hsla(foo)'"));
		assert.throws(() => CssHsla('hsla(a,b,c,d)'), new Error("bad css color 'hsla(a,b,c,d)'"));
		assert.throws(() => CssHsla('hsla(0,0,0%,0)'), new Error("bad css color 'hsla(0,0,0%,0)'"));
		assert.throws(() => CssHsla('hsla(0,0%,0,0)'), new Error("bad css color 'hsla(0,0%,0,0)'"));
		// assert.throws(() => CssHsla('hsla(-1,0%,0%,0)'), new Error("bad css color 'hsla(-1,0%,0%,0)'"));
		assert.throws(() => CssHsla('hsla(0,-1,0%,0)'), new Error("bad css color 'hsla(0,-1,0%,0)'"));
		assert.throws(() => CssHsla('hsla(0,0%,-1,0)'), new Error("bad css color 'hsla(0,0%,-1,0)'"));
		assert.throws(() => CssHsla('hsla(0,0%,0%,-1)'), new Error("bad css color 'hsla(0,0%,0%,-1)'"));
		// assert.throws(() => CssHsla('hsla(361,0%,0%,0)'), new Error("bad css color 'hsla(-361,0%,0%,0)'"));
		assert.throws(() => CssHsla('hsla(0,101%,0%,0)'), new Error("bad css color 'hsla(0,101%,0%,0)'"));
		assert.throws(() => CssHsla('hsla(0,0%,101%,0)'), new Error("bad css color 'hsla(0,0%,101%,0)'"));
		assert.throws(() => CssHsla('hsla(0,0%,0%,1.1)'), new Error("bad css color 'hsla(0,0%,0%,1.1)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEquals(
			CssHsla('hsla(0.5turn,100%,25%,0.2)', cs),
			{ hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.2 },
			epsilon
		);
	});
});

describe('cssHsla', () => {
	it('should assign an hsla to represent a css hsla() color', () => {
		const color = Create();

		assertEquals(cssHsla(color, 'hsla(0,0%,0%,0)'), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 0.0 }, epsilon);
		assertEquals(cssHsla(color, 'hsl(0,0%,0%)'), { hue : 0.0, saturation : 0.0, lightness : 0.0, alpha : 1.0 }, epsilon);

		const res = cssHsla(color, 'hsla(0,0%,100%)');

		assertEquals(res, { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assert.strictEqual(color, res);

		assertEquals(cssHsla(color, 'hsla( 0 , 0% , 100% )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(cssHsla(color, 'hsla(0 0% 100%)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(cssHsla(color, 'hsla( 0   0%   100% )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 1.0 }, epsilon);
		assertEquals(cssHsla(color, 'hsl(0,0%,100%,0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla(0,0%,100%,0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla( 0 , 0% , 100% , 0.5 )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla(0 0% 100%/0.5)'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla( 0   0%   100% / 0.5 )'), { hue : 0.0, saturation : 0.0, lightness : 1.0, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla(200grad,100%,50%,0.5)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla( 180deg , 100% , 50% , 0.5 )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, `hsla(${ Math.PI }rad 100% 50%/0.5)`), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
		assertEquals(cssHsla(color, 'hsla( 0.5turn   100%   50% / 0.5 )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.5 }, epsilon);
	});

	it('should throw for invalid hsla() strings', () => {
		const color = Create();

		assert.throws(() => cssHsla(color, 'hsla(foo)'), new Error("bad css color 'hsla(foo)'"));
		assert.throws(() => cssHsla(color, 'hsla(a,b,c,d)'), new Error("bad css color 'hsla(a,b,c,d)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0,0%,0)'), new Error("bad css color 'hsla(0,0,0%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0%,0,0)'), new Error("bad css color 'hsla(0,0%,0,0)'"));
		// assert.throws(() => cssHsla(color, 'hsla(-1,0%,0%,0)'), new Error("bad css color 'hsla(-1,0%,0%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,-1,0%,0)'), new Error("bad css color 'hsla(0,-1,0%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0%,-1,0)'), new Error("bad css color 'hsla(0,0%,-1,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0%,0%,-1)'), new Error("bad css color 'hsla(0,0%,0%,-1)'"));
		// assert.throws(() => cssHsla(color, 'hsla(361,0%,0%,0)'), new Error("bad css color 'hsla(-361,0%,0%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,101%,0%,0)'), new Error("bad css color 'hsla(0,101%,0%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0%,101%,0)'), new Error("bad css color 'hsla(0,0%,101%,0)'"));
		assert.throws(() => cssHsla(color, 'hsla(0,0%,0%,1.1)'), new Error("bad css color 'hsla(0,0%,0%,1.1)'"));
	});

	it('should apply color conversions', () => {
		const color = Create();
		const cs = createColorSpace(2.0);

		assertEquals(
			cssHsla(color, 'hsla(0.5turn,100%,25%,0.2)', cs),
			{ hue : Math.PI, saturation : 1.0, lightness : 0.5, alpha : 0.2 },
			epsilon
		);
	});
});

describe('CssHslaToRgba', () => {
	it('should return a vector4 representing a css hsla() color', () => {
		assertEqualsVec4(CssHslaToRgba('hsla(0,0%,0%,0)'), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsl(0,0%,0%)'), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 0 , 0% , 100% )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla(0 0% 100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 0   0%   100% )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsl(0,0%,100%,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla(0,0%,100%,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 0 , 0% , 100% , 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla(0 0% 100%/0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 0   0%   100% / 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla(200grad,100%,50%,0.5)'), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 180deg , 100% , 50% , 0.5 )'), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba(`hsla(${ Math.PI }rad 100% 50%/0.5)`), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(CssHslaToRgba('hsla( 0.5turn   100%   50% / 0.5 )'), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
	});

	it('should throw for invalid hsla() strings', () => {
		assert.throws(() => CssHslaToRgba('hsla(foo)'), new Error("bad css color 'hsla(foo)'"));
		assert.throws(() => CssHslaToRgba('hsla(a,b,c,d)'), new Error("bad css color 'hsla(a,b,c,d)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0,0%,0)'), new Error("bad css color 'hsla(0,0,0%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0%,0,0)'), new Error("bad css color 'hsla(0,0%,0,0)'"));
		// assert.throws(() => CssHslaToRgba('hsla(-1,0%,0%,0)'), new Error("bad css color 'hsla(-1,0%,0%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,-1,0%,0)'), new Error("bad css color 'hsla(0,-1,0%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0%,-1,0)'), new Error("bad css color 'hsla(0,0%,-1,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0%,0%,-1)'), new Error("bad css color 'hsla(0,0%,0%,-1)'"));
		// assert.throws(() => CssHslaToRgba('hsla(361,0%,0%,0)'), new Error("bad css color 'hsla(-361,0%,0%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,101%,0%,0)'), new Error("bad css color 'hsla(0,101%,0%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0%,101%,0)'), new Error("bad css color 'hsla(0,0%,101%,0)'"));
		assert.throws(() => CssHslaToRgba('hsla(0,0%,0%,1.1)'), new Error("bad css color 'hsla(0,0%,0%,1.1)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec4(
			CssHslaToRgba('hsla(0.5turn,100%,25%,0.2)', cs),
			{ x : 0.0, y : 1.0, z : 1.0, w : 0.2 },
			epsilon
		);
	});
});

describe('cssHslAssignRgb', () => {
	it('should assign a vector4 to represent a css hsla() color', () => {
		const v = vec4.Create();

		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla(0,0%,0%,0)'), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsl(0,0%,0%)'), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 0 , 0% , 100% )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla(0 0% 100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 0   0%   100% )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsl(0,0%,100%,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla(0,0%,100%,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 0 , 0% , 100% , 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla(0 0% 100%/0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 0   0%   100% / 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);

		const r = cssHslaAssignRgba(v, 'hsla(200grad,100%,50%,0.5)');

		assertEqualsVec4(r, { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assert.strictEqual(v, r);

		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 180deg , 100% , 50% , 0.5 )'), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, `hsla(${ Math.PI }rad 100% 50%/0.5)`), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
		assertEqualsVec4(cssHslaAssignRgba(v, 'hsla( 0.5turn   100%   50% / 0.5 )'), { x : 0.0, y : 1.0, z : 1.0, w : 0.5 }, epsilon);
	});

	it('should throw for invalid hsla() strings', () => {
		const v = vec4.Create();

		assert.throws(() => cssHslaAssignRgba(v, 'hsla(foo)'), new Error("bad css color 'hsla(foo)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(a,b,c,d)'), new Error("bad css color 'hsla(a,b,c,d)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0,0%,0)'), new Error("bad css color 'hsla(0,0,0%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0%,0,0)'), new Error("bad css color 'hsla(0,0%,0,0)'"));
		// assert.throws(() => cssHslaAssignRgba(v, 'hsla(-1,0%,0%,0)'), new Error("bad css color 'hsla(-1,0%,0%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,-1,0%,0)'), new Error("bad css color 'hsla(0,-1,0%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0%,-1,0)'), new Error("bad css color 'hsla(0,0%,-1,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0%,0%,-1)'), new Error("bad css color 'hsla(0,0%,0%,-1)'"));
		// assert.throws(() => cssHslaAssignRgba(v, 'hsla(361,0%,0%,0)'), new Error("bad css color 'hsla(-361,0%,0%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,101%,0%,0)'), new Error("bad css color 'hsla(0,101%,0%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0%,101%,0)'), new Error("bad css color 'hsla(0,0%,101%,0)'"));
		assert.throws(() => cssHslaAssignRgba(v, 'hsla(0,0%,0%,1.1)'), new Error("bad css color 'hsla(0,0%,0%,1.1)'"));
	});

	it('should apply color conversions', () => {
		const v = vec4.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec4(
			cssHslaAssignRgba(v, 'hsla(0.5turn,100%,25%,0.2)', cs),
			{ x : 0.0, y : 1.0, z : 1.0, w : 0.2 },
			epsilon
		);
	});
});

describe('toCss', () => {
	it('should return a css hsla() string', () => {
		assert.strictEqual(toCss(Create()), 'hsl(0,0%,100%)');
		assert.strictEqual(toCss(Create(Math.PI, 1.0, 0.5, 0.4)), 'hsla(180,100%,50%,0.4)');
		assert.strictEqual(toCss(Create(-Math.PI, 1.0, 0.5, 0.4)), 'hsla(180,100%,50%,0.4)');
		assert.strictEqual(toCss(Create(Math.PI * 3.0, 1.0, 0.5, 0.4)), 'hsla(180,100%,50%,0.4)');
		assert.strictEqual(toCss(Create(Math.PI, -1.0, -0.1, -0.01)), 'hsla(0,0%,0%,0)');
		assert.strictEqual(toCss(Create(Math.PI, 2.0, 1.1, 1.01)), 'hsl(0,0%,100%)');
		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5, 0.5), undefined, { precision : cssPrecision.uint8 }),
			'hsla(180,100%,50%,0.502)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5, 0.5), undefined, { precision : cssPrecision.float64 }),
			'hsla(180,100%,50%,0.5)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5, Math.PI * 0.1), undefined, {
				precision : cssPrecision.uint8,
				decimals : 1
			}),
			'hsla(180,100%,50%,0.314)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				decimals : 2
			}),
			'hsla(180,100%,50%,0.31)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI * 4.0 / 6.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.turn
			}),
			'hsla(0.3333turn,100%,50%,0.314)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI * 4.0 / 6.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.rad
			}),
			'hsla(2.094rad,100%,50%,0.314)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI * 5.0 / 6.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.deg
			}),
			'hsla(150.1,100%,50%,0.314)'
		);
		assert.strictEqual(
			toCss(Create(Math.PI * 4.0 / 6.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.grad
			}),
			'hsla(133.3grad,100%,50%,0.314)'
		);
		assert.strictEqual(
			toCss(Create(0.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				format : cssFormat.css4
			}),
			'hsl(0 100% 50%/0.314)'
		);
		assert.strictEqual(
			toCss(Create(0.0, 1.0, 0.5, 1.0), undefined, {
				format : cssFormat.css4
			}),
			'hsl(0 100% 50%)'
		);
		assert.strictEqual(
			toCss(Create(0.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				percent : true
			}),
			'hsla(0,100%,50%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(0.0, 1.0, 0.5, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				percent : true,
				decimals : 4
			}),
			'hsla(0,100%,50%,31.42%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toCss(Create(Number.NaN)), new Error('bad rgba64 [NaN,NaN,NaN,1]'));
		assert.throws(() => toCss(Create(0.0, Number.NaN)), new Error('bad rgba64 [NaN,NaN,NaN,1]'));
		assert.throws(() => toCss(Create(0.0, 0.0, Number.NaN)), new Error('bad rgba64 [NaN,NaN,NaN,1]'));
		assert.throws(() => toCss(Create(0.0, 0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5, 0.2), cs, {
				angleUnit : angleUnit.turn,
				precision : cssPrecision.float64
			}),
			'hsla(0.5turn,100%,25%,0.2)'
		);
	});
});

describe('rgbaToCss', () => {
	it('should return a css hsl() string from a rgb vector3', () => {
		assert.strictEqual(rgbaToCss(vec4.Create()), 'hsl(0,0%,0%)');
		assert.strictEqual(rgbaToCss(vec4.Create(0.0, 0.5, 1.0, 0.4)), 'hsla(209.9,100%,50%,0.4)');
		assert.strictEqual(rgbaToCss(vec4.Create(-1.0, -0.1, -0.01, -0.001)), 'hsla(0,0%,0%,0)');
		assert.strictEqual(rgbaToCss(vec4.Create(2.0, 1.1, 1.01, 1.001)), 'hsl(0,0%,100%)');
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, 0.5), undefined, { precision : cssPrecision.uint8 }),
			'hsla(209.9,100%,50%,0.502)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, 0.5), undefined, { precision : cssPrecision.float64 }),
			'hsla(210,100%,50%,0.5)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				precision : cssPrecision.uint8,
				decimals : 1
			}),
			'hsla(209.9,100%,50%,0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				decimals : 2
			}),
			'hsla(210,100%,50%,0.31)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.turn
			}),
			'hsla(0.583turn,100%,50%,0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.rad
			}),
			'hsla(3.663rad,100%,50%,0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.deg
			}),
			'hsla(209.9,100%,50%,0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				angleUnit : angleUnit.grad
			}),
			'hsla(233.2grad,100%,50%,0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				format : cssFormat.css4
			}),
			'hsl(209.9 100% 50%/0.314)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, 1.0), undefined, {
				format : cssFormat.css4
			}),
			'hsl(209.9 100% 50%)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				percent : true
			}),
			'hsla(209.9,100%,50%,31.4%)'
		);
		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 0.5, 1.0, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				percent : true,
				decimals : 4
			}),
			'hsla(210,100%,50%,31.42%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => rgbaToCss(vec4.Create(Number.NaN)), new Error('bad rgba64 [NaN,0,0,1]'));
		assert.throws(() => rgbaToCss(vec4.Create(0.0, Number.NaN)), new Error('bad rgba64 [0,NaN,0,1]'));
		assert.throws(() => rgbaToCss(vec4.Create(0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,NaN,1]'));
		assert.throws(() => rgbaToCss(vec4.Create(0.0, 0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			rgbaToCss(vec4.Create(0.0, 1.0, 1.0, 0.2), cs, {
				angleUnit : angleUnit.turn,
				precision : cssPrecision.float64
			}),
			'hsla(0.5turn,100%,25%,0.2)'
		);
	});
});

describe('Copy', () => {
	it('should return a hsla representing a copy', () => {
		const a = Create(Math.PI, 1.0, 5.0, 0.75);
		const b = Copy(a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});

describe('copy', () => {
	it('should assign a hsla to represent a copy', () => {
		const a = Create(Math.PI, 1.0, 5.0, 0.75);
		const b = Create();

		copy(b, a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});
