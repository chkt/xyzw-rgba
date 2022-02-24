import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Create } from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import {
	Align,
	Ceil,
	Clamp,
	Floor, Matte, Max,
	Min,
	Mono,
	Round,
	align,
	ceil,
	clamp,
	floor,
	matte,
	max,
	// eslint-disable-next-line @typescript-eslint/no-shadow
	min, mono, round, toString
} from '../source/vector3';
import { assertEqualsVec3 as assertEquals } from './assert/assert';


describe('Mono', () => {
	const e = 1e-10;

	it('should return a vector3 representing a mono-channel color', () => {
		assertEquals(Mono(), { x : 1.0, y : 1.0, z : 1.0 }, e);
		assertEquals(Mono(Number.NaN), { x : Number.NaN, y : Number.NaN, z : Number.NaN }, e);
		assertEquals(Mono(0.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(Mono(0.5), { x : 0.5, y : 0.5, z : 0.5 }, e);
		assertEquals(Mono(Math.PI), { x : Math.PI, y : Math.PI, z : Math.PI }, e);
	});
});

describe('mono', () => {
	const e = 1e-10;

	it('should assign a vector3 to represent a mono-channel color', () => {
		const v = Create();

		assertEquals(mono(v), { x : 1.0, y : 1.0, z : 1.0 }, e);
		assertEquals(mono(v, Number.NaN), { x : Number.NaN, y : Number.NaN, z : Number.NaN }, e);

		const r = mono(v, 0.0);

		assertEquals(r, { x : 0.0, y : 0.0, z : 0.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(mono(v, 0.5), { x : 0.5, y : 0.5, z : 0.5 }, e);
		assertEquals(mono(v, Math.PI), { x : Math.PI, y : Math.PI, z : Math.PI }, e);
	});
});

describe('Matte', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the composition of base and fill', () => {
		assertEquals(Matte(Create(), vec4.Create()), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(Matte(Create(nan), vec4.Create()), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(Matte(Create(0.0, nan), vec4.Create()), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(Matte(Create(0.0, 0.0, nan), vec4.Create()), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(Matte(Create(), vec4.Create(nan)), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(Matte(Create(), vec4.Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(Matte(Create(), vec4.Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(Matte(Create(), vec4.Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan }, e);
		assertEquals(Matte(Create(1.0, 1.0, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.5)), { x : 1.0, y : 0.75, z : 0.5 }, e);
		assertEquals(Matte(Create(0.0, 0.0, 0.0), vec4.Create(1.0, 0.5, 0.0, 0.5)), { x : 0.5, y : 0.25, z : 0.0 }, e);
		assertEquals(Matte(Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.5)), { x : 0.5, y : 0.5, z : 0.5 }, e);
		assertEquals(Matte(Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.25)), { x : 0.25, y : 0.5, z : 0.75 }, e);
		assertEquals(Matte(Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.75)), { x : 0.75, y : 0.5, z : 0.25 }, e);
	});
});

describe('matte', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the composition of base and fill', () => {
		const v = Create();

		assertEquals(matte(v, Create(), vec4.Create()), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(matte(v, Create(nan), vec4.Create()), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(matte(v, Create(0.0, nan), vec4.Create()), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(matte(v, Create(0.0, 0.0, nan), vec4.Create()), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(matte(v, Create(), vec4.Create(nan)), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(matte(v, Create(), vec4.Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(matte(v, Create(), vec4.Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(matte(v, Create(), vec4.Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan }, e);

		const r = matte(v, Create(1.0, 1.0, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.5));

		assertEquals(r, { x : 1.0, y : 0.75, z : 0.5 }, e);
		assert.strictEqual(v, r);

		assertEquals(matte(v, Create(0.0, 0.0, 0.0), vec4.Create(1.0, 0.5, 0.0, 0.5)), { x : 0.5, y : 0.25, z : 0.0 }, e);
		assertEquals(matte(v, Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.5)), { x : 0.5, y : 0.5, z : 0.5 }, e);
		assertEquals(matte(v, Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.25)), { x : 0.25, y : 0.5, z : 0.75 }, e);
		assertEquals(matte(v, Create(0.0, 0.5, 1.0), vec4.Create(1.0, 0.5, 0.0, 0.75)), { x : 0.75, y : 0.5, z : 0.25 }, e);
	});
});

describe('Floor', () => {
	const e = 1e-10;

	it('should return the floor value of each vector entry', () => {
		assert.deepStrictEqual(Floor(Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Floor(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Floor(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(Floor(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });
		assertEquals(Floor(Create(1.0, 2.0, 3.0)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Floor(Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Floor(Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Floor(Create(1.5, 2.5, 3.5)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Floor(Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
	});
});

describe('floor', () => {
	const e = 1e-10;

	it('should assign the floor value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(floor(v, Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(floor(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(floor(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(floor(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });

		const r = floor(v, Create(1.0, 2.0, 3.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(floor(v, Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(floor(v, Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(floor(v, Create(1.5, 2.5, 3.5)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(floor(v, Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
	});
});

describe('Round', () => {
	const e = 1e-10;

	it('should return the rounded value of each vector entry', () => {
		assert.deepStrictEqual(Round(Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Round(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Round(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(Round(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });
		assertEquals(Round(Create(1.0, 2.0, 3.0)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Round(Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Round(Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Round(Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(Round(Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
	});
});

describe('round', () => {
	const e = 1e-10;

	it('should assign the rounded value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(round(v, Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(round(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(round(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(round(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });

		const r = round(v, Create(1.0, 2.0, 3.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(round(v, Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(round(v, Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(round(v, Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(round(v, Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
	});
});

describe('Ceil', () => {
	const e = 1e-10;

	it('should return the ceiling value of each vector entry', () => {
		assert.deepStrictEqual(Ceil(Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Ceil(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Ceil(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(Ceil(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });
		assertEquals(Ceil(Create(1.0, 2.0, 3.0)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Ceil(Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(Ceil(Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(Ceil(Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(Ceil(Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
	});
});

describe('ceil', () => {
	const e = 1e-10;

	it('should assign the ceiling value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(ceil(v, Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(ceil(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(ceil(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(ceil(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });

		const r = ceil(v, Create(1.0, 2.0, 3.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(ceil(v, Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(ceil(v, Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(ceil(v, Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(ceil(v, Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
	});
});

describe('Align', () => {
	const e = 1e-10;

	it('should return the rounded value of each vector entry', () => {
		assert.deepStrictEqual(Align(Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Align(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Align(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(Align(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });
		assertEquals(Align(Create(1.0, 2.0, 3.0)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 }, e);
		assertEquals(Align(Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 }, e);
	});

	it('should return the finely rounded value of each vector entry', () => {
		assertEquals(Align(Create(1.0, 2.0, 3.0), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.1, 2.1, 3.1), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
	});

	it('should return the finely rounded aligned value of each vector entry', () => {
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.04 - e, 2.04 - e, 3.04 - e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(Align(Create(1.04 + e, 2.04 + e, 3.04 + e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1 }, e);
	});
});

describe('align', () => {
	const e = 1e-10;

	it('should assign the rounded value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(align(v, Create()), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(align(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(align(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0 });
		assert.deepStrictEqual(align(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN });

		const r = align(v, Create(1.0, 2.0, 3.0));

		assert.deepStrictEqual(r, { x : 1.0, y : 2.0, z : 3.0 });
		assert.strictEqual(v, r);

		assert.deepStrictEqual(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e)), { x : 1.0, y : 2.0, z : 3.0 });
		assert.deepStrictEqual(align(v, Create(1.5 - e, 2.5 - e, 3.5 - e)), { x : 1.0, y : 2.0, z : 3.0 });
		assert.deepStrictEqual(align(v, Create(1.5, 2.5, 3.5)), { x : 2.0, y : 3.0, z : 4.0 });
		assert.deepStrictEqual(align(v, Create(2.0 - e, 3.0 - e, 4.0 - e)), { x : 2.0, y : 3.0, z : 4.0 });
	});

	it('should assign the finely rounded value of each vector entry', () => {
		const v = Create();

		assertEquals(align(v, Create(1.0, 2.0, 3.0), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.1, 2.1, 3.1), 0.1), { x : 1.1, y : 2.1, z : 3.1 }, e);
	});

	it('should return the finely rounded aligned value of each vector entry', () => {
		const v = Create();

		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.04 - e, 2.04 - e, 3.04 - e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0 }, e);
		assertEquals(align(v, Create(1.04 + e, 2.04 + e, 3.04 + e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1 }, e);
	});
});

describe('Min', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing the minimum', () => {
		assertEquals(Min(Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(Min(Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(Min(Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(Min(Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(Min(Create(), nan), { x : nan, y : nan, z : nan }, e);
		assertEquals(Min(Create(1.0, 2.0, 3.0), 2.5), { x : 1.0, y : 2.0, z : 2.5 }, e);
	});
});

describe('min', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector4 to represent the minimum', () => {
		const v = Create();

		assertEquals(min(v, Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(min(v, Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(min(v, Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(min(v, Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(min(v, Create(), nan), { x : nan, y : nan, z : nan }, e);

		const r = min(v, Create(1.0, 2.0, 3.0), 2.5);

		assertEquals(r, { x : 1.0, y : 2.0, z : 2.5 }, e);
		assert.strictEqual(v, r);
	});
});

describe('Max', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing the maximum', () => {
		assertEquals(Max(Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(Max(Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(Max(Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(Max(Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(Max(Create(), nan), { x : nan, y : nan, z : nan }, e);
		assertEquals(Max(Create(1.0, 2.0, 3.0), 2.5), { x : 2.5, y : 2.5, z : 3.0 }, e);
	});
});

describe('max', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector4 to represent the maximum', () => {
		const v = Create();

		assertEquals(max(v, Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(max(v, Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(max(v, Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(max(v, Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(max(v, Create(), nan), { x : nan, y : nan, z : nan }, e);

		const r = max(v, Create(1.0, 2.0, 3.0), 2.5);

		assertEquals(r, { x : 2.5, y : 2.5, z : 3.0 }, e);
		assert.strictEqual(v, r);
	});
});

describe('Clamp', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing clamped values', () => {
		assertEquals(Clamp(Create(), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(Clamp(Create(nan), 0.0, 1.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(Clamp(Create(0.0, nan), 0.0, 1.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(Clamp(Create(0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(Clamp(Create(), nan, 1.0), { x : nan, y : nan, z : nan }, e);
		assertEquals(Clamp(Create(), 1.0, nan), { x : nan, y : nan, z : nan }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3), 2.0, 3.0), { x : 2.0, y : 2.2, z : 3.0 }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3), 3.0, 2.0), { x : 2.0, y : 2.2, z : 3.0 }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3), 2.0, 2.0), { x : 2.0, y : 2.0, z : 2.0 }, e);
	});
});

describe('clamp', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector3 to represent clamped values', () => {
		const v = Create();

		assertEquals(clamp(v, Create(), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEquals(clamp(v, Create(nan), 0.0, 1.0), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEquals(clamp(v, Create(0.0, nan), 0.0, 1.0), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEquals(clamp(v, Create(0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : nan }, e);
		assertEquals(clamp(v, Create(), nan, 1.0), { x : nan, y : nan, z : nan }, e);
		assertEquals(clamp(v, Create(), 1.0, nan), { x : nan, y : nan, z : nan }, e);

		const r = clamp(v, Create(1.1, 2.2, 3.3), 2.0, 3.0);

		assertEquals(r, { x : 2.0, y : 2.2, z : 3.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(clamp(v, Create(1.1, 2.2, 3.3), 3.0, 2.0), { x : 2.0, y : 2.2, z : 3.0 }, e);
		assertEquals(clamp(v, Create(1.1, 2.2, 3.3), 2.0, 2.0), { x : 2.0, y : 2.0, z : 2.0 }, e);
	});
});

describe('toString', () => {
	it('should return a string representation of a Vector3', () => {
		assert.strictEqual(toString(Create()), '[0,0,0]');
		assert.strictEqual(toString(Create(Number.NaN)), '[NaN,0,0]');
		assert.strictEqual(toString(Create(0.0, Number.NaN)), '[0,NaN,0]');
		assert.strictEqual(toString(Create(0.0, 0.0, Number.NaN)), '[0,0,NaN]');
		assert.strictEqual(toString(Create(0.12345, 12.345, 1234.5), 2), '[0.12,12.35,1234.5]');
	});
});
