import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as vec3 from 'xyzw/dist/vector3';
import {
	Copy,
	Create,
	CssHsl, CssHslToRgb,
	Hsla, Rgb, assign, assignRgb,
	chroma,
	copy,
	cssHsl,
	cssHslAssignRgb,
	equals,
	hsla,
	normalizeHue, rgb, rgbToCss,
	toCss, toRgb
} from '../source/hsl';
import { angleUnit } from '../source/real';
import { cssFormat } from '../source/parse';
import * as hslaApi from '../source/hsla';
import { assertEqualsHsl as assertEquals, assertEqualsHsl, assertEqualsVec3 } from './assert/assert';
import { createColorSpace, createTransferFunction } from './mock/colorSpace';


const epsilon = 1e-10;


describe('equals', () => {
	it('should return true if a equals b', () => {
		const a = Create(Math.PI, 1.0 / 3.0, 2.0 / 3.0);
		const b = a;
		const c = Copy(a);
		const d = { ...a, lightness : Number.NaN };

		assert.strictEqual(equals(a, b), true);
		assert.strictEqual(equals(a, c), true);
		assert.strictEqual(equals(d, d), false);
		assert.strictEqual(equals(a, { ...a, hue : a.hue + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, saturation : a.saturation + 0.1 }), false);
		assert.strictEqual(equals(a, { ...a, lightness : a.lightness + 0.1 }), false);
		assert.strictEqual(equals(Create(Number.NaN), Create(Number.NaN)), false);
		assert.strictEqual(equals(Create(0.0, Number.NaN), Create(0.0, Number.NaN)), false);
		assert.strictEqual(equals(Create(0.0, 0.0, Number.NaN), Create(0.0, 0.0, Number.NaN)), false);
		assert.strictEqual(equals(Create(1.0), Create(1.01), 1e-3), false);
		assert.strictEqual(equals(Create(1.0), Create(1.01), 1e-1), true);
		assert.strictEqual(equals(Create(0.0, 1.0), Create(0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 1.0), Create(0.0, 1.01), 1e-1), true);
		assert.strictEqual(equals(Create(0.0, 0.0, 1.0), Create(0.0, 0.0, 1.01), 1e-3), false);
		assert.strictEqual(equals(Create(0.0, 0.0, 1.0), Create(0.0, 0.0, 1.01), 1e-1), true);
	});
});

describe('normalizeHue', () => {
	const TURN = Math.PI * 2.0;

	it('should return the normalized hue', () => {
		assert.deepStrictEqual(normalizeHue(Create()), 0.0);
		assert.deepStrictEqual(normalizeHue(Create(Number.NaN)), Number.NaN);
		assert.deepStrictEqual(normalizeHue(Create(0.0, Number.NaN)), 0.0);
		assert.deepStrictEqual(normalizeHue(Create(0.0, 0.0, Number.NaN)), 0.0);
		assert.deepStrictEqual(normalizeHue(Create(TURN * 0.5)), TURN * 0.5);
		assert.deepStrictEqual(normalizeHue(Create(TURN)), 0.0);
		assert.deepStrictEqual(normalizeHue(Create(TURN * 1.5)), TURN * 0.5);
		assert.deepStrictEqual(normalizeHue(Create(TURN * -0.5)), TURN * 0.5);
		assert.deepStrictEqual(normalizeHue(Create(TURN * -0.25)), TURN * 0.75);
	});
});

describe('chroma', () => {
	it('should return the chroma', () => {
		assert.strictEqual(chroma(Create()), 0.0);
		assert.strictEqual(chroma(Create(Number.NaN)), 0.0);
		assert.strictEqual(chroma(Create(0.0, Number.NaN)), Number.NaN);
		assert.strictEqual(chroma(Create(0.0, 0.0, Number.NaN)), Number.NaN);
		assert.strictEqual(chroma(Create(0.0, 0.0, 0.0)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 0.0, 1.0)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 1.0)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 0.0)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 0.5)), 1.0);
		assert.strictEqual(chroma(Create(0.0, 0.5, 0.5)), 0.5);
		assert.strictEqual(chroma(Create(0.0, 0.0, 0.5)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 0.25)), 0.5);
		assert.strictEqual(chroma(Create(0.0, 0.5, 0.25)), 0.25);
		assert.strictEqual(chroma(Create(0.0, 0.0, 0.25)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 0.75)), 0.5);
		assert.strictEqual(chroma(Create(0.0, 0.5, 0.75)), 0.25);
		assert.strictEqual(chroma(Create(0.0, 0.0, 0.75)), 0.0);
		assert.strictEqual(chroma(Create(0.0, -1.0, 0.5)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, -1.0)), 0.0);
		assert.strictEqual(chroma(Create(0.0, 1.1, 0.5)), 1.0);
		assert.strictEqual(chroma(Create(0.0, 1.0, 1.1)), 0.0);
	});
});

describe('Create', () => {
	it('should return a hsl', () => {
		assert.deepStrictEqual(Create(), { hue : 0.0, saturation : 0.0, lightness : 1.0 });
		assert.deepStrictEqual(Create(Number.NaN), { hue : Number.NaN, saturation : 0.0, lightness : 1.0 });
		assert.deepStrictEqual(Create(0.0, Number.NaN), { hue : 0.0, saturation : Number.NaN, lightness : 1.0 });
		assert.deepStrictEqual(Create(0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 1.0, lightness : Number.NaN });
		assert.deepStrictEqual(Create(1.0, 2.0, 3.0), { hue : 1.0, saturation : 2.0, lightness : 3.0 });
	});
});

describe('assign', () => {
	it('should assign a hsl', () => {
		const hsl = Create(1.1, 2.2, 3.3);

		assert.deepStrictEqual(assign(hsl), { hue : 0.0, saturation : 1.0, lightness : 1.0 });
		assert.deepStrictEqual(assign(hsl, Number.NaN), { hue : Number.NaN, saturation : 1.0, lightness : 1.0 });
		assert.deepStrictEqual(assign(hsl, 0.0, Number.NaN), { hue : 0.0, saturation : Number.NaN, lightness : 1.0 });
		assert.deepStrictEqual(assign(hsl, 0.0, 1.0, Number.NaN), { hue : 0.0, saturation : 1.0, lightness : Number.NaN });

		const r = assign(hsl, 1.0, 2.0, 3.0);

		assert.deepStrictEqual(r, { hue : 1.0, saturation : 2.0, lightness : 3.0 });
		assert.strictEqual(hsl, r);
	});
});

describe('Rgb', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TWELFTH = 1.0 / 12.0;
	const TURN = Math.PI * 2.0;

	it('should return a hsl representing a rgb color', () => {
		assert.deepStrictEqual(Rgb({ x : nan, y : 0.0, z : 0.0 }), { hue : nan, saturation : nan, lightness : nan });
		assert.deepStrictEqual(Rgb({ x : 0.0, y : nan, z : 0.0 }), { hue : nan, saturation : nan, lightness : nan });
		assert.deepStrictEqual(Rgb({ x : 0.0, y : 0.0, z : nan }), { hue : nan, saturation : nan, lightness : nan });
		assertEquals(Rgb({ x : 0.0, y : 0.0, z : 0.0 }), { hue : 0.0, saturation : 0.0, lightness : 0.0 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 1.0, z : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.5, z : 0.5 }), { hue : 0.0, saturation : 0.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : THIRD, y : THIRD, z : THIRD }), { hue : 0.0, saturation : 0.0, lightness : THIRD }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 0.0, z : 0.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.0, z : 0.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 1.0, z : 0.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 0.5, z : 0.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 0.0, z : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 0.0, z : 0.5 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 1.0, z : 0.0 }), { hue : SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 1.0, z : 1.0 }), { hue : 3.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 0.0, z : 1.0 }), { hue : 5.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 0.5, z : 0.5 }), { hue : 0.0, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 0.5, z : 0.0 }), { hue : TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 1.0, y : 0.0, z : 0.5 }), { hue : 11.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 1.0, z : 0.5 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 1.0, z : 0.5 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 1.0, z : 0.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.5, z : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.0, z : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.0, y : 0.5, z : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.6, y : 0.5, z : 0.4 }), { hue : TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.6, y : 0.4, z : 0.5 }), { hue : 11.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.4, y : 0.6, z : 0.5 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.6, z : 0.4 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.5, y : 0.4, z : 0.6 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(Rgb({ x : 0.4, y : 0.5, z : 0.6 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
	});

	it('should apply color conversions', () => {
		const t = createTransferFunction(0.5);

		assertEquals(Rgb({ x : 0.0, y : 2.0, z : 2.0 }, t), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, epsilon);
	});
});

describe('rgb', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TWELFTH = 1.0 / 12.0;
	const TURN = Math.PI * 2.0;

	it('should return a hsl representing a rgb color', () => {
		const hsl = Create();

		assert.deepStrictEqual(rgb(hsl, { x : nan, y : 0.0, z : 0.0 }), { hue : nan, saturation : nan, lightness : nan });
		assert.deepStrictEqual(rgb(hsl, { x : 0.0, y : nan, z : 0.0 }), { hue : nan, saturation : nan, lightness : nan });
		assert.deepStrictEqual(rgb(hsl, { x : 0.0, y : 0.0, z : nan }), { hue : nan, saturation : nan, lightness : nan });

		const r = rgb(hsl, { x : 0.0, y : 0.0, z : 0.0 });

		assertEquals(r, { hue : 0.0, saturation : 0.0, lightness : 0.0 }, epsilon);
		assert.strictEqual(hsl, r);

		assertEquals(rgb(hsl, { x : 1.0, y : 1.0, z : 1.0 }), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.5, z : 0.5 }), { hue : 0.0, saturation : 0.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : THIRD, y : THIRD, z : THIRD }), { hue : 0.0, saturation : 0.0, lightness : THIRD }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 0.0, z : 0.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.0, z : 0.0 }), { hue : 0.0, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 1.0, z : 0.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 0.5, z : 0.0 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 0.0, z : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 0.0, z : 0.5 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.25 }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 1.0, z : 0.0 }), { hue : SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 1.0, z : 1.0 }), { hue : 3.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 0.0, z : 1.0 }), { hue : 5.0 * SIXTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 0.5, z : 0.5 }), { hue : 0.0, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 0.5, z : 0.0 }), { hue : TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 1.0, y : 0.0, z : 0.5 }), { hue : 11.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 1.0, z : 0.5 }), { hue : THIRD * TURN, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 1.0, z : 0.5 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 1.0, z : 0.0 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.5, z : 1.0 }), { hue : 2.0 * THIRD * TURN, saturation : 1.0, lightness : 0.75 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.0, z : 1.0 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.0, y : 0.5, z : 1.0 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 1.0, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.6, y : 0.5, z : 0.4 }), { hue : TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.6, y : 0.4, z : 0.5 }), { hue : 11.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.4, y : 0.6, z : 0.5 }), { hue : (1.0 + 4.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.6, z : 0.4 }), { hue : (11.0 + 4.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.5, y : 0.4, z : 0.6 }), { hue : (1.0 + 8.0) * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
		assertEquals(rgb(hsl, { x : 0.4, y : 0.5, z : 0.6 }), { hue : (11.0 + 8.0) % 12.0 * TWELFTH * TURN, saturation : 0.2, lightness : 0.5 }, epsilon);
	});

	it('should apply color conversions', () => {
		const hsl = Create();
		const t = createTransferFunction(0.5);

		assertEqualsHsl(rgb(hsl, { x : 0.0, y : 2.0, z : 2.0 }, t), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, epsilon);
	});
});

describe('toRgb', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TURN = Math.PI * 2.0;

	it('should return a vector3 representing a hsl color', () => {
		assert.deepStrictEqual(toRgb(Create()), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(toRgb(Create(nan)), { x : nan, y : nan, z : nan });
		assert.deepStrictEqual(toRgb(Create(0.0, nan)), { x : nan, y : nan, z : nan });
		assert.deepStrictEqual(toRgb(Create(0.0, 0.0, nan)), { x : nan, y : nan, z : nan });
		assertEqualsVec3(toRgb(Create(0.0, 0.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 1.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 1.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 0.0, 0.5)), { x : 0.5, y : 0.5, z : 0.5 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 0.0, THIRD)), { x : THIRD, y : THIRD, z : THIRD }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(2.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(TURN, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(4.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(-1.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(SIXTH * TURN, 1.0, 0.5)), { x : 1.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(3.0 * SIXTH * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(5.0 * SIXTH * TURN, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 0.5, 0.5)), { x : 0.75, y : 0.25, z : 0.25 }, epsilon);
		assertEqualsVec3(toRgb(Create(0.0, 0.5, 0.25)), { x : 0.375, y : 0.125, z : 0.125 }, epsilon);
		assertEqualsVec3(toRgb(Create(SIXTH * TURN, 0.5, 0.5)), { x : 0.75, y : 0.75, z : 0.25 }, epsilon);
		assertEqualsVec3(toRgb(Create(SIXTH * TURN, 0.5, 0.25)), { x : 0.375, y : 0.375, z : 0.125 }, epsilon);
		assertEqualsVec3(toRgb(Create(2.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.75, z : 0.25 }, epsilon);
		assertEqualsVec3(toRgb(Create(2.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.375, z : 0.125 }, epsilon);
		assertEqualsVec3(toRgb(Create(3.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.75, z : 0.75 }, epsilon);
		assertEqualsVec3(toRgb(Create(3.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.375, z : 0.375 }, epsilon);
		assertEqualsVec3(toRgb(Create(4.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.25, z : 0.75 }, epsilon);
		assertEqualsVec3(toRgb(Create(4.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.125, z : 0.375 }, epsilon);
		assertEqualsVec3(toRgb(Create(5.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.75, y : 0.25, z : 0.75 }, epsilon);
		assertEqualsVec3(toRgb(Create(5.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.375, y : 0.125, z : 0.375 }, epsilon);
	});

	it('should apply color conversions', () => {
		const t = createTransferFunction(2.0);

		assertEqualsVec3(toRgb(Create(Math.PI, 1.0, 0.5), t), { x : 0.0, y : 2.0, z : 2.0 }, epsilon);
	});
});

describe('assignRgb', () => {
	const nan = Number.NaN;
	const THIRD = 1.0 / 3.0;
	const SIXTH = 1.0 / 6.0;
	const TURN = Math.PI * 2.0;

	it('should return a vector3 representing a hsl color', () => {
		const v = vec3.Create();

		assert.deepStrictEqual(assignRgb(v, Create()), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(assignRgb(v, Create(nan)), { x : nan, y : nan, z : nan });
		assert.deepStrictEqual(assignRgb(v, Create(0.0, nan)), { x : nan, y : nan, z : nan });
		assert.deepStrictEqual(assignRgb(v, Create(0.0, 0.0, nan)), { x : nan, y : nan, z : nan });

		const r = assignRgb(v, Create(0.0, 0.0, 1.0));

		assertEqualsVec3(r, { x : 1.0, y : 1.0, z : 1.0 }, epsilon);
		assert.strictEqual(v, r);

		assertEqualsVec3(assignRgb(v, Create(0.0, 1.0, 1.0)), { x : 1.0, y : 1.0, z : 1.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 1.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 0.0, 0.5)), { x : 0.5, y : 0.5, z : 0.5 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 0.0, THIRD)), { x : THIRD, y : THIRD, z : THIRD }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(2.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(TURN, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(4.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(-1.0 * THIRD * TURN, 1.0, 0.5)), { x : 0.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(SIXTH * TURN, 1.0, 0.5)), { x : 1.0, y : 1.0, z : 0.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(3.0 * SIXTH * TURN, 1.0, 0.5)), { x : 0.0, y : 1.0, z : 1.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(5.0 * SIXTH * TURN, 1.0, 0.5)), { x : 1.0, y : 0.0, z : 1.0 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 0.5, 0.5)), { x : 0.75, y : 0.25, z : 0.25 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(0.0, 0.5, 0.25)), { x : 0.375, y : 0.125, z : 0.125 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(SIXTH * TURN, 0.5, 0.5)), { x : 0.75, y : 0.75, z : 0.25 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(SIXTH * TURN, 0.5, 0.25)), { x : 0.375, y : 0.375, z : 0.125 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(2.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.75, z : 0.25 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(2.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.375, z : 0.125 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(3.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.75, z : 0.75 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(3.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.375, z : 0.375 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(4.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.25, y : 0.25, z : 0.75 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(4.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.125, y : 0.125, z : 0.375 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(5.0 * SIXTH * TURN, 0.5, 0.5)), { x : 0.75, y : 0.25, z : 0.75 }, epsilon);
		assertEqualsVec3(assignRgb(v, Create(5.0 * SIXTH * TURN, 0.5, 0.25)), { x : 0.375, y : 0.125, z : 0.375 }, epsilon);
	});

	it('should apply color conversions', () => {
		const v = vec3.Create();
		const t = createTransferFunction(2.0);

		assertEqualsVec3(assignRgb(v, Create(Math.PI, 1.0, 0.5), t), { x : 0.0, y : 2.0, z : 2.0 }, epsilon);
	});
});

describe('Hsla', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return an hsl representing an hsla', () => {
		assertEquals(Hsla(hslaApi.Create()), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, e);
		assertEquals(Hsla(hslaApi.Create(nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(Hsla(hslaApi.Create(0.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(Hsla(hslaApi.Create(0.0, 0.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(Hsla(hslaApi.Create(0.0, 0.0, 1.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(Hsla(hslaApi.Create(Math.PI, 1.0, 0.5, 0.5)), { hue : Math.PI, saturation : 1.0, lightness : 0.75 }, e);
		assertEquals(Hsla(
			hslaApi.Create(Math.PI, 1.0, 0.5, 0.5),
			Create(0.0, 0.0, 0.0)
		), { hue : Math.PI, saturation : 1.0, lightness : 0.25 }, e);
		assertEquals(Hsla(
			hslaApi.Create(Math.PI, 1.0, 0.5, 0.5),
			Create(0.0, 1.0, 0.5)
		), { hue : Math.PI, saturation : 0.0, lightness : 0.5 }, e);
	});
});

describe('hsla', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign an hsl to represent an hsla', () => {
		const color = Create();

		assertEquals(hsla(color, hslaApi.Create()), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, e);
		assertEquals(hsla(color, hslaApi.Create(nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(hsla(color, hslaApi.Create(0.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(hsla(color, hslaApi.Create(0.0, 0.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);
		assertEquals(hsla(color, hslaApi.Create(0.0, 0.0, 1.0, nan)), { hue : nan, saturation : nan, lightness : nan }, e);

		const r = hsla(color, hslaApi.Create(Math.PI, 1.0, 0.5, 0.5));

		assertEquals(r, { hue : Math.PI, saturation : 1.0, lightness : 0.75 }, e);
		assert.strictEqual(color, r);

		assertEquals(hsla(
			color,
			hslaApi.Create(Math.PI, 1.0, 0.5, 0.5),
			Create(0.0, 0.0, 0.0)
		), { hue : Math.PI, saturation : 1.0, lightness : 0.25 }, e);
		assertEquals(hsla(
			color,
			hslaApi.Create(Math.PI, 1.0, 0.5, 0.5),
			Create(0.0, 1.0, 0.5)
		), { hue : Math.PI, saturation : 0.0, lightness : 0.5 }, e);
	});
});

describe('CssHsl', () => {
	const e = 1e-10;

	it('should return an hsl representing a css hsl() color', () => {
		assertEquals(CssHsl('hsl(0,0%,0%)'), { hue : 0.0, saturation : 0.0, lightness : 0.0 }, e);
		assertEquals(CssHsl('hsl(0,0%,100%)'), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, e);
		assertEquals(CssHsl('hsl(0,100%,50%)'), { hue : 0.0, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(CssHsl('hsl( 180 , 100% , 50% )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(CssHsl('hsl(180deg,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(CssHsl('hsl(0.5turn,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(CssHsl(`hsl(${ Math.PI }rad,100%,50%)`), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(CssHsl('hsl(200grad,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
	});

	it('should throw for invalid hsl() strings', () => {
		assert.throws(() => CssHsl('hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => CssHsl('hsl(a,b,c)'), new Error("bad css color 'hsl(a,b,c)'"));
		assert.throws(() => CssHsl('hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => CssHsl('hsl(0,1,1%)'), new Error("bad css color 'hsl(0,1,1%)'"));
		assert.throws(() => CssHsl('hsl(0,1%,1)'), new Error("bad css color 'hsl(0,1%,1)'"));
		assert.throws(() => CssHsl('hsl(0,-1%,1%)'), new Error("bad css color 'hsl(0,-1%,1%)'"));
		assert.throws(() => CssHsl('hsl(0,1%,-1%)'), new Error("bad css color 'hsl(0,1%,-1%)'"));
		assert.throws(() => CssHsl('hsl(0,101%,1%)'), new Error("bad css color 'hsl(0,101%,1%)'"));
		assert.throws(() => CssHsl('hsl(0,1%,101%)'), new Error("bad css color 'hsl(0,1%,101%)'"));
		assert.throws(() => CssHsl('hsl(0foo,1%,1%)'), new Error("bad css color 'hsl(0foo,1%,1%)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEquals(CssHsl('hsl(0.5turn,100%,25%)', cs), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
	});
});

describe('cssHsl', () => {
	const e = 1e-10;

	it('should assign an hsl to represent a css hsl() color', () => {
		const color = Create();
		const r = cssHsl(color, 'hsl(0,0%,0%)');

		assertEquals(r, { hue : 0.0, saturation : 0.0, lightness : 0.0 }, e);
		assert.strictEqual(color, r);

		assertEquals(cssHsl(color, 'hsl(0,0%,100%)'), { hue : 0.0, saturation : 0.0, lightness : 1.0 }, e);
		assertEquals(cssHsl(color, 'hsl(0,100%,50%)'), { hue : 0.0, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(cssHsl(color, 'hsl( 180 , 100% , 50% )'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(cssHsl(color, 'hsl(180deg,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(cssHsl(color, 'hsl(0.5turn,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(cssHsl(color, `hsl(${ Math.PI }rad,100%,50%)`), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
		assertEquals(cssHsl(color, 'hsl(200grad,100%,50%)'), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
	});

	it('should throw for invalid hsl() strings', () => {
		const color = Create(Math.PI, 1.0, 0.5);
		const copied = Copy(color);

		assert.throws(() => cssHsl(color, 'hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.deepStrictEqual(color, copied);

		assert.throws(() => cssHsl(color, 'hsl(a,b,c)'), new Error("bad css color 'hsl(a,b,c)'"));
		assert.throws(() => cssHsl(color, 'hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,1,1%)'), new Error("bad css color 'hsl(0,1,1%)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,1%,1)'), new Error("bad css color 'hsl(0,1%,1)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,-1%,1%)'), new Error("bad css color 'hsl(0,-1%,1%)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,1%,-1%)'), new Error("bad css color 'hsl(0,1%,-1%)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,101%,1%)'), new Error("bad css color 'hsl(0,101%,1%)'"));
		assert.throws(() => cssHsl(color, 'hsl(0,1%,101%)'), new Error("bad css color 'hsl(0,1%,101%)'"));
		assert.throws(() => cssHsl(color, 'hsl(0foo,1%,1%)'), new Error("bad css color 'hsl(0foo,1%,1%)'"));
	});

	it('should apply color conversions', () => {
		const hsl = Create();
		const cs = createColorSpace(2.0);

		assertEquals(cssHsl(hsl, 'hsl(0.5turn,100%,25%)', cs), { hue : Math.PI, saturation : 1.0, lightness : 0.5 }, e);
	});
});

describe('CssHslToRgb', () => {
	const e = 1e-10;

	it('should return a vector3 representing a css hsl() color', () => {
		assertEqualsVec3(CssHslToRgb('hsl(0,0%,0%)'), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl(0,100%,50%)'), { x : 1.0, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl( 180 , 100% , 50% )'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl(180deg,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl(0.5turn,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(CssHslToRgb(`hsl(${ Math.PI }rad,100%,50%)`), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(CssHslToRgb('hsl(200grad,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
	});

	it('should throw for invalid hsl() strings', () => {
		assert.throws(() => CssHslToRgb('hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => CssHslToRgb('hsl(a,b,c)'), new Error("bad css color 'hsl(a,b,c)'"));
		assert.throws(() => CssHslToRgb('hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => CssHslToRgb('hsl(0,1,1%)'), new Error("bad css color 'hsl(0,1,1%)'"));
		assert.throws(() => CssHslToRgb('hsl(0,1%,1)'), new Error("bad css color 'hsl(0,1%,1)'"));
		assert.throws(() => CssHslToRgb('hsl(0,-1%,1%)'), new Error("bad css color 'hsl(0,-1%,1%)'"));
		assert.throws(() => CssHslToRgb('hsl(0,1%,-1%)'), new Error("bad css color 'hsl(0,1%,-1%)'"));
		assert.throws(() => CssHslToRgb('hsl(0,101%,1%)'), new Error("bad css color 'hsl(0,101%,1%)'"));
		assert.throws(() => CssHslToRgb('hsl(0,1%,101%)'), new Error("bad css color 'hsl(0,1%,101%)'"));
		assert.throws(() => CssHslToRgb('hsl(0foo,1%,1%)'), new Error("bad css color 'hsl(0foo,1%,1%)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec3(CssHslToRgb('hsl(0.5turn,100%,25%)', cs), { x : 0.0, y : 1.0, z : 1.0 }, e);
	});
});

describe('cssHslAssignRgb', () => {
	const e = 1e-10;

	it('should assign a vector3 to represent a css hsl() color', () => {
		const v = vec3.Create();
		const r = cssHslAssignRgb(v, 'hsl(0,0%,0%)');

		assertEqualsVec3(r, { x : 0.0, y : 0.0, z : 0.0 }, e);
		assert.strictEqual(v, r);

		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(0,100%,50%)'), { x : 1.0, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, 'hsl( 180 , 100% , 50% )'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(180deg,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(0.5turn,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, `hsl(${ Math.PI }rad,100%,50%)`), { x : 0.0, y : 1.0, z : 1.0 }, e);
		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(200grad,100%,50%)'), { x : 0.0, y : 1.0, z : 1.0 }, e);
	});

	it('should throw for invalid hsl() strings', () => {
		const v = vec3.Create(1.0, 2.0, 3.0);
		const w = vec3.Copy(v);

		assert.throws(() => cssHslAssignRgb(v, 'hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.deepStrictEqual(v, w);

		assert.throws(() => cssHslAssignRgb(v, 'hsl(a,b,c)'), new Error("bad css color 'hsl(a,b,c)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(foo)'), new Error("bad css color 'hsl(foo)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,1,1%)'), new Error("bad css color 'hsl(0,1,1%)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,1%,1)'), new Error("bad css color 'hsl(0,1%,1)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,-1%,1%)'), new Error("bad css color 'hsl(0,-1%,1%)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,1%,-1%)'), new Error("bad css color 'hsl(0,1%,-1%)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,101%,1%)'), new Error("bad css color 'hsl(0,101%,1%)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0,1%,101%)'), new Error("bad css color 'hsl(0,1%,101%)'"));
		assert.throws(() => cssHslAssignRgb(v, 'hsl(0foo,1%,1%)'), new Error("bad css color 'hsl(0foo,1%,1%)'"));
	});

	it('should apply color conversions', () => {
		const v = vec3.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(cssHslAssignRgb(v, 'hsl(0.5turn,100%,25%)', cs), { x : 0.0, y : 1.0, z : 1.0 }, e);
	});
});

describe('toCss', () => {
	const TURN = 2.0 * Math.PI;

	it('should return a css hsl() string', () => {
		assert.strictEqual(toCss(Create()), 'hsl(0,0%,100%)');
		assert.strictEqual(toCss(Create(0, 0, 0)), 'hsl(0,0%,0%)');
		assert.strictEqual(toCss(Create(0, 0, 0.5)), 'hsl(0,0%,50%)');
		assert.strictEqual(toCss(Create(0, 1.0, 0.5)), 'hsl(0,100%,50%)');
		assert.strictEqual(toCss(Create(TURN, 1.0, 0.5)), 'hsl(0,100%,50%)');
		assert.strictEqual(toCss(Create(TURN * 0.5, 1.0, 0.5)), 'hsl(180,100%,50%)');
		assert.strictEqual(toCss(Create(TURN * 1.5, 1.0, 0.5)), 'hsl(180,100%,50%)');
		assert.strictEqual(toCss(Create(-TURN * 0.5, 1.0, 0.5)), 'hsl(180,100%,50%)');
		assert.strictEqual(toCss(Create(1.5, 0.987, Math.PI * 0.1)), 'hsl(85.944,98.7%,31.416%)');
		assert.strictEqual(toCss(Create(-1.0, -0.1, -0.01)), 'hsl(0,0%,0%)');
		assert.strictEqual(toCss(Create(2.0, 1.1, 1.01)), 'hsl(0,0%,100%)');
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { decimals : 1 }),
			'hsl(85.9,98.7%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { decimals : 4 }),
			'hsl(85.9437,98.7%,31.4159%)'
		);
		assert.strictEqual(
			toCss(Create(0.5 * TURN, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.turn }),
			'hsl(0.5turn,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.turn }),
			'hsl(0.239turn,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(0.5 * TURN, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.rad }),
			'hsl(3.142rad,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.rad }),
			'hsl(1.5rad,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(0.5 * TURN, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.grad }),
			'hsl(200grad,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { angleUnit : angleUnit.grad }),
			'hsl(95.493grad,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(1.5, 0.987, Math.PI * 0.1), undefined, { format : cssFormat.css4 }),
			'hsl(85.944 98.7% 31.416%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toCss(Create(Number.NaN)), new Error('bad rgb64 [NaN,NaN,NaN]'));
		assert.throws(() => toCss(Create(0.0, Number.NaN)), new Error('bad rgb64 [NaN,NaN,NaN]'));
		assert.throws(() => toCss(Create(0.0, 0.0, Number.NaN)), new Error('bad rgb64 [NaN,NaN,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			toCss(Create(Math.PI, 1.0, 0.5), cs, { angleUnit : angleUnit.turn }),
			'hsl(0.5turn,100%,25%)'
		);
	});
});

describe('rgbToCss', () => {
	it('should return a css hsl() string from a rgb vector3', () => {
		assert.strictEqual(rgbToCss(vec3.Create()), 'hsl(0,0%,0%)');
		assert.strictEqual(rgbToCss(vec3.Create(1.0, 1.0, 1.0)), 'hsl(0,0%,100%)');
		assert.strictEqual(rgbToCss(vec3.Create(0.5, 0.5, 0.5)), 'hsl(0,0%,50%)');
		assert.strictEqual(rgbToCss(vec3.Create(1.0, 0.0, 0.0)), 'hsl(0,100%,50%)');
		assert.strictEqual(rgbToCss(vec3.Create(-1.0, -0.1, -0.01)), 'hsl(0,0%,0%)');
		assert.strictEqual(rgbToCss(vec3.Create(2.0, 1.1, 1.01)), 'hsl(0,0%,100%)');
		assert.strictEqual(rgbToCss(vec3.Create(0.0, 0.98765, 0.98765)), 'hsl(180,100%,49.383%)');
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 0.98765, 0.98765), undefined, { decimals : 1 }),
			'hsl(180,100%,49.4%)'
		);
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 0.98765, 0.98765), undefined, { decimals : 4 }),
			'hsl(180,100%,49.3825%)'
		);
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 1.0, 1.0), undefined, { angleUnit : angleUnit.turn }),
			'hsl(0.5turn,100%,50%)'
		);
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 1.0, 1.0), undefined, { angleUnit : angleUnit.rad }),
			'hsl(3.142rad,100%,50%)'
		);
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 1.0, 1.0), undefined, { angleUnit : angleUnit.grad }),
			'hsl(200grad,100%,50%)'
		);
		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 1.0, 1.0), undefined, { format : cssFormat.css4 }),
			'hsl(180 100% 50%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => rgbToCss(vec3.Create(Number.NaN)), new Error('bad rgb64 [NaN,0,0]'));
		assert.throws(() => rgbToCss(vec3.Create(0.0, Number.NaN)), new Error('bad rgb64 [0,NaN,0]'));
		assert.throws(() => rgbToCss(vec3.Create(0.0, 0.0, Number.NaN)), new Error('bad rgb64 [0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			rgbToCss(vec3.Create(0.0, 1.0, 1.0), cs, { angleUnit : angleUnit.turn }),
			'hsl(0.5turn,100%,25%)'
		);
	});
});

describe('Copy', () => {
	it('should return a hsl representing a copy', () => {
		const a = Create(Math.PI, 1.0, 5.0);
		const b = Copy(a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});

describe('copy', () => {
	it('should assign a hsl to represent a copy', () => {
		const a = Create(Math.PI, 1.0, 5.0);
		const b = Create();

		copy(b, a);

		assert.deepStrictEqual(a, b);
		assert.notStrictEqual(a, b);
	});
});
