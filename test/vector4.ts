import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Create } from 'xyzw/dist/vector4';
import {
	Align,
	Ceil,
	Clamp,
	DemultiplyAlpha,
	Floor,
	Max,
	Min,
	MultiplyAlpha,
	Round,
	align,
	alignAssignAlpha,
	assignAlpha,
	ceil,
	clamp,
	clampAssignAlpha,
	demultiplyAlpha,
	demultiplyAssignAlpha,
	floor,
	hadamardAssignAlpha,
	max,
	min,
	multiplyAlpha,
	multiplyAssignAlpha,
	round,
	// eslint-disable-next-line @typescript-eslint/no-shadow
	toString
} from '../source/vector4';
import { assertEqualsVec4 as assertEquals } from './assert/assert';


describe('assignAlpha', () => {
	const nan = Number.NaN;

	it('should assign an alpha value to a Vector4', () => {
		assert.deepStrictEqual(assignAlpha(Create(), 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(assignAlpha(Create(nan), 1.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(assignAlpha(Create(0.0, nan), 1.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(assignAlpha(Create(0.0, 0.0, nan), 1.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 });
		assert.deepStrictEqual(assignAlpha(Create(0.0, 0.0, 0.0, nan), 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(assignAlpha(Create(0.0, 0.0, 0.0, 1.0), nan), { x : 0.0, y : 0.0, z : 0.0, w : nan });
		assert.deepStrictEqual(assignAlpha(Create(1.1, 2.2, 3.3, 4.4), 5.5), { x : 1.1, y : 2.2, z : 3.3, w : 5.5 });
	});
});

describe('MultiplyAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a Vector4 representing a premultiplied alpha channel', () => {
		assertEquals(MultiplyAlpha(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(MultiplyAlpha(Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(MultiplyAlpha(Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(MultiplyAlpha(Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(MultiplyAlpha(Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(MultiplyAlpha(Create(1.0, 0.5, 0.4, 0.5)), { x : 0.5, y : 0.25, z : 0.2, w : 0.5 }, e);
		assertEquals(MultiplyAlpha(Create(1.0, 0.5, 0.4, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('multiplyAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector4 to represent a premultiplied alpha channel', () => {
		const v = Create();

		assertEquals(multiplyAlpha(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAlpha(v, Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAlpha(v, Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAlpha(v, Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(multiplyAlpha(v, Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);

		const r = multiplyAlpha(v, Create(1.0, 0.5, 0.4, 0.5));

		assertEquals(r, { x : 0.5, y : 0.25, z : 0.2, w : 0.5 }, e);
		assert.strictEqual(v, r);

		assertEquals(multiplyAlpha(v, Create(1.0, 0.5, 0.4, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('multiplyAssignAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector4 to represent a premultiplied alpha channel', () => {
		assertEquals(multiplyAssignAlpha(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAssignAlpha(Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAssignAlpha(Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(multiplyAssignAlpha(Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(multiplyAssignAlpha(Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);

		const v = Create(1.0, 0.5, 0.4, 0.5);
		const r = multiplyAssignAlpha(v);

		assertEquals(r, { x : 0.5, y : 0.25, z : 0.2, w : 0.5 }, e);
		assert.strictEqual(v, r);

		assertEquals(multiplyAssignAlpha(Create(1.0, 0.5, 0.4, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('hadamardAssignAlpha', () => {
	const e = 1e-10;

	it('should return a vector4 representing an alpha channel multiplication', () => {
		assert.deepStrictEqual(hadamardAssignAlpha(Create(), 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(hadamardAssignAlpha(Create(Number.NaN), 1.0), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(hadamardAssignAlpha(Create(0.0, Number.NaN), 1.0), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(hadamardAssignAlpha(Create(0.0, 0.0, Number.NaN), 1.0), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(hadamardAssignAlpha(Create(0.0, 0.0, 0.0, Number.NaN), 1.0), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });
		assert.deepStrictEqual(hadamardAssignAlpha(Create(), Number.NaN), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const v = Create(1.1, 2.2, 3.3, 4.4);
		const r = hadamardAssignAlpha(v, 0.5);

		assertEquals(r, { x : 1.1, y : 2.2, z : 3.3, w : 2.2 }, e);
		assert.strictEqual(v, r);

		assertEquals(hadamardAssignAlpha(Create(1.1, 2.2, 3.3, 4.4), 2.0), { x : 1.1, y : 2.2, z : 3.3, w : 8.8 }, e);
		assertEquals(hadamardAssignAlpha(Create(1.1, 2.2, 3.3, 4.4), -1.0), { x : 1.1, y : 2.2, z : 3.3, w : -4.4 }, e);
		assertEquals(hadamardAssignAlpha(Create(1.1, 2.2, 3.3, 4.4), -0.5), { x : 1.1, y : 2.2, z : 3.3, w : -2.2 }, e);
		assertEquals(hadamardAssignAlpha(Create(1.1, 2.2, 3.3, 4.4), -2.0), { x : 1.1, y : 2.2, z : 3.3, w : -8.8 }, e);
	});
});

describe('DemultiplyAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a Vector4 representing a non-premultiplied alpha channel', () => {
		assertEquals(DemultiplyAlpha(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(DemultiplyAlpha(Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(DemultiplyAlpha(Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(DemultiplyAlpha(Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(DemultiplyAlpha(Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(DemultiplyAlpha(Create(1.0, 0.5, 0.4, 1.0)), { x : 1.0, y : 0.5, z : 0.4, w : 1.0 }, e);
		assertEquals(DemultiplyAlpha(Create(0.5, 0.25, 0.2, 0.5)), { x : 1.0, y : 0.5, z : 0.4, w : 0.5 }, e);
		assertEquals(DemultiplyAlpha(Create(0.0, 0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(DemultiplyAlpha(Create(0.5, 0.25, 0.2, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('demultiplyAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector4 to represent a non-premultiplied alpha channel', () => {
		const v = Create();

		assertEquals(demultiplyAlpha(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAlpha(v, Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAlpha(v, Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAlpha(v, Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(demultiplyAlpha(v, Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);

		const r = demultiplyAlpha(v, Create(1.0, 0.5, 0.4, 1.0));

		assertEquals(r, { x : 1.0, y : 0.5, z : 0.4, w : 1.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(demultiplyAlpha(v, Create(0.5, 0.25, 0.2, 0.5)), { x : 1.0, y : 0.5, z : 0.4, w : 0.5 }, e);
		assertEquals(demultiplyAlpha(v, Create(0.0, 0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(demultiplyAlpha(v, Create(0.5, 0.25, 0.2, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('demultiplyAssignAlpha', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector4 to represent a non-premultiplied alpha channel', () => {
		assertEquals(demultiplyAssignAlpha(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAssignAlpha(Create(nan)), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAssignAlpha(Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(demultiplyAssignAlpha(Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(demultiplyAssignAlpha(Create(0.0, 0.0, 0.0, nan)), { x : nan, y : nan, z : nan, w : nan }, e);

		const v = Create(1.0, 0.5, 0.4, 1.0);
		const r = demultiplyAssignAlpha(v);

		assertEquals(r, { x : 1.0, y : 0.5, z : 0.4, w : 1.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(demultiplyAssignAlpha(Create(0.5, 0.25, 0.2, 0.5)), { x : 1.0, y : 0.5, z : 0.4, w : 0.5 }, e);
		assertEquals(demultiplyAssignAlpha(Create(0.0, 0.0, 0.0, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(demultiplyAssignAlpha(Create(0.5, 0.25, 0.2, 0.0)), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
	});
});

describe('Floor', () => {
	const e = 1e-10;

	it('should return the floor value of each vector entry', () => {
		assert.deepStrictEqual(Floor(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Floor(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Floor(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Floor(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(Floor(Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });
		assertEquals(Floor(Create(1.0, 2.0, 3.0, 4.0)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Floor(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Floor(Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Floor(Create(1.5, 2.5, 3.5, 4.5)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Floor(Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
	});
});

describe('floor', () => {
	const e = 1e-10;

	it('should assign the floor value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(floor(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(floor(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(floor(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(floor(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(floor(v, Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const r = floor(v, Create(1.0, 2.0, 3.0, 4.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(floor(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(floor(v, Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(floor(v, Create(1.5, 2.5, 3.5, 4.5)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(floor(v, Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
	});
});

describe('Round', () => {
	const e = 1e-10;

	it('should return the rounded value of each vector entry', () => {
		assert.deepStrictEqual(Round(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Round(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Round(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Round(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(Round(Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });
		assertEquals(Round(Create(1.0, 2.0, 3.0, 4.0)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Round(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Round(Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Round(Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(Round(Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});
});

describe('round', () => {
	const e = 1e-10;

	it('should assign the rounded value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(round(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(round(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(round(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(round(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(round(v, Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const r = round(v, Create(1.0, 2.0, 3.0, 4.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(round(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(round(v, Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(round(v, Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(round(v, Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});
});

describe('Ceil', () => {
	const e = 1e-10;

	it('should return the ceiling value of each vector entry', () => {
		assert.deepStrictEqual(Ceil(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Ceil(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Ceil(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Ceil(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(Ceil(Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });
		assertEquals(Ceil(Create(1.0, 2.0, 3.0, 4.0)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Ceil(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(Ceil(Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(Ceil(Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(Ceil(Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});
});

describe('ceil', () => {
	const e = 1e-10;

	it('should assign the rounded value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(ceil(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(ceil(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(ceil(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(ceil(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(ceil(v, Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const r = ceil(v, Create(1.0, 2.0, 3.0, 4.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(ceil(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(ceil(v, Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(ceil(v, Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(ceil(v, Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});
});

describe('Align', () => {
	const e = 1e-10;

	it('should return the rounded value of each vector entry', () => {
		assert.deepStrictEqual(Align(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Align(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Align(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(Align(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(Align(Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });
		assertEquals(Align(Create(1.0, 2.0, 3.0, 4.0)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(Align(Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});

	it('should return the finely rounded value of each vector entry', () => {
		assertEquals(Align(Create(1.0, 2.0, 3.0, 4.0), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.1, 2.1, 3.1, 4.1), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
	});

	it('should return the finely rounded aligned value of each vector entry', () => {
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.04 - e, 2.04 - e, 3.04 - e, 4.04 - e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(Align(Create(1.04 + e, 2.04 + e, 3.04 + e, 4.04 + e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(Align(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
	});
});

describe('align', () => {
	const e = 1e-10;

	it('should return the rounded value of each vector entry', () => {
		const v = Create();

		assert.deepStrictEqual(align(v, Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(align(v, Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(align(v, Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(align(v, Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(align(v, Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const r = align(v, Create(1.0, 2.0, 3.0, 4.0));

		assertEquals(r, { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.5, 2.5, 3.5, 4.5)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
		assertEquals(align(v, Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0, y : 3.0, z : 4.0, w : 5.0 }, e);
	});

	it('should return the finely rounded value of each vector entry', () => {
		const v = Create();

		assertEquals(align(v, Create(1.0, 2.0, 3.0, 4.0), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.1, 2.1, 3.1, 4.1), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
	});

	it('should return the finely rounded aligned value of each vector entry', () => {
		const v = Create();

		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.0), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 1.0), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.04 - e, 2.04 - e, 3.04 - e, 4.04 - e), 0.1, 0.4), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(align(v, Create(1.04 + e, 2.04 + e, 3.04 + e, 4.04 + e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
		assertEquals(align(v, Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.4), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
	});
});

describe('alignAssignAlpha', () => {
	const e = 1e-10;

	it('should return the rounded value of w', () => {
		assert.deepStrictEqual(alignAssignAlpha(Create()), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(alignAssignAlpha(Create(Number.NaN)), { x : Number.NaN, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(alignAssignAlpha(Create(0.0, Number.NaN)), { x : 0.0, y : Number.NaN, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(alignAssignAlpha(Create(0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : Number.NaN, w : 1.0 });
		assert.deepStrictEqual(alignAssignAlpha(Create(0.0, 0.0, 0.0, Number.NaN)), { x : 0.0, y : 0.0, z : 0.0, w : Number.NaN });

		const v = Create(1.1, 2.2, 3.3, 4.4);
		const r = alignAssignAlpha(v);

		assertEquals(r, { x : 1.1, y : 2.2, z : 3.3, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(alignAssignAlpha(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e)), { x : 1.0 + e, y : 2.0 + e, z : 3.0 + e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.5 - e, 2.5 - e, 3.5 - e, 4.5 - e)), { x : 1.5 - e, y : 2.5 - e, z : 3.5 - e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.5, 2.5, 3.5, 4.5)), { x : 1.5, y : 2.5, z : 3.5, w : 5.0 }, e);
		assertEquals(alignAssignAlpha(Create(2.0 - e, 3.0 - e, 4.0 - e, 5.0 - e)), { x : 2.0 - e, y : 3.0 - e, z : 4.0 - e, w : 5.0 }, e);
	});

	it('should return the finely rounded value of w', () => {
		assertEquals(alignAssignAlpha(Create(1.0, 2.0, 3.0, 4.0), 0.1), { x : 1.0, y : 2.0, z : 3.0, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1), { x : 1.0 + e, y : 2.0 + e, z : 3.0 + e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1), { x : 1.05 - e, y : 2.05 - e, z : 3.05 - e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1), { x : 1.05 + e, y : 2.05 + e, z : 3.05 + e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1), { x : 1.1 - e, y : 2.1 - e, z : 3.1 - e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.1, 2.1, 3.1, 4.1), 0.1), { x : 1.1, y : 2.1, z : 3.1, w : 4.1 }, e);
	});

	it('should return the finely rounded aligned value of w', () => {
		assertEquals(alignAssignAlpha(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.0), { x : 1.0 + e, y : 2.0 + e, z : 3.0 + e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 0.0), { x : 1.05 - e, y : 2.05 - e, z : 3.05 - e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 0.0), { x : 1.05 + e, y : 2.05 + e, z : 3.05 + e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.0), { x : 1.1 - e, y : 2.1 - e, z : 3.1 - e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 1.0), { x : 1.0 + e, y : 2.0 + e, z : 3.0 + e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 - e, 2.05 - e, 3.05 - e, 4.05 - e), 0.1, 1.0), { x : 1.05 - e, y : 2.05 - e, z : 3.05 - e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.05 + e, 2.05 + e, 3.05 + e, 4.05 + e), 0.1, 1.0), { x : 1.05 + e, y : 2.05 + e, z : 3.05 + e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 1.0), { x : 1.1 - e, y : 2.1 - e, z : 3.1 - e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.0 + e, 2.0 + e, 3.0 + e, 4.0 + e), 0.1, 0.4), { x : 1.0 + e, y : 2.0 + e, z : 3.0 + e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.04 - e, 2.04 - e, 3.04 - e, 4.04 - e), 0.1, 0.4), { x : 1.04 - e, y : 2.04 - e, z : 3.04 - e, w : 4.0 }, e);
		assertEquals(alignAssignAlpha(Create(1.04 + e, 2.04 + e, 3.04 + e, 4.04 + e), 0.1, 0.4), { x : 1.04 + e, y : 2.04 + e, z : 3.04 + e, w : 4.1 }, e);
		assertEquals(alignAssignAlpha(Create(1.1 - e, 2.1 - e, 3.1 - e, 4.1 - e), 0.1, 0.4), { x : 1.1 - e, y : 2.1 - e, z : 3.1 - e, w : 4.1 }, e);
	});
});

describe('Min', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing the minimum', () => {
		assertEquals(Min(Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(Min(Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(Min(Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0, w : 0.0 }, e);
		assertEquals(Min(Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan, w : 0.0 }, e);
		assertEquals(Min(Create(0.0, 0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(Min(Create(), nan), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Min(Create(1.0, 2.0, 3.0, 4.0), 2.5), { x : 1.0, y : 2.0, z : 2.5, w : 2.5 }, e);
	});
});

describe('min', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector4 to represent the minimum', () => {
		const v = Create();

		assertEquals(min(v, Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(min(v, Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0, w : 0.0 }, e);
		assertEquals(min(v, Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0, w : 0.0 }, e);
		assertEquals(min(v, Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan, w : 0.0 }, e);
		assertEquals(min(v, Create(0.0, 0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(min(v, Create(), nan), { x : nan, y : nan, z : nan, w : nan }, e);

		const r = min(v, Create(1.0, 2.0, 3.0, 4.0), 2.5);

		assertEquals(r, { x : 1.0, y : 2.0, z : 2.5, w : 2.5 }, e);
		assert.strictEqual(v, r);
	});
});

describe('Max', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing the maximum', () => {
		assertEquals(Max(Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(Max(Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(Max(Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(Max(Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(Max(Create(0.0, 0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(Max(Create(), nan), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Max(Create(1.0, 2.0, 3.0, 4.0), 2.5), { x : 2.5, y : 2.5, z : 3.0, w : 4.0 }, e);
	});
});

describe('max', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector4 to represent the maximum', () => {
		const v = Create();

		assertEquals(max(v, Create(), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(max(v, Create(nan), 0.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(max(v, Create(0.0, nan), 0.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(max(v, Create(0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(max(v, Create(0.0, 0.0, 0.0, nan), 0.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(max(v, Create(), nan), { x : nan, y : nan, z : nan, w : nan }, e);

		const r = max(v, Create(1.0, 2.0, 3.0, 4.0), 2.5);

		assertEquals(r, { x : 2.5, y : 2.5, z : 3.0, w : 4.0 }, e);
		assert.strictEqual(v, r);
	});
});

describe('Clamp', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a vector4 representing clamped values', () => {
		assertEquals(Clamp(Create(), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(Clamp(Create(nan), 0.0, 1.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(Clamp(Create(0.0, nan), 0.0, 1.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(Clamp(Create(0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(Clamp(Create(0.0, 0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(Clamp(Create(), nan, 1.0), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Clamp(Create(), nan, 1.0), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Clamp(Create(), 1.0, nan), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Clamp(Create(), 1.0, nan), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3, 4.4), 2.0, 4.0), { x : 2.0, y : 2.2, z : 3.3, w : 4.0 }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3, 4.4), 4.0, 2.0), { x : 2.0, y : 2.2, z : 3.3, w : 4.0 }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3, 4.4), 3.0, 3.0), { x : 3.0, y : 3.0, z : 3.0, w : 3.0 }, e);
		assertEquals(Clamp(Create(1.1, 2.2, 3.3, 4.4), 3.0, 3.0), { x : 3.0, y : 3.0, z : 3.0, w : 3.0 }, e);
	});
});

describe('clamp', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a vector3 to represent clamped values', () => {
		const v = Create();

		assertEquals(clamp(v, Create(), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(clamp(v, Create(nan), 0.0, 1.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 }, e);
		assertEquals(clamp(v, Create(0.0, nan), 0.0, 1.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 }, e);
		assertEquals(clamp(v, Create(0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 }, e);
		assertEquals(clamp(v, Create(0.0, 0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : nan }, e);
		assertEquals(clamp(v, Create(), nan, 1.0), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(clamp(v, Create(), nan, 1.0), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(clamp(v, Create(), 1.0, nan), { x : nan, y : nan, z : nan, w : nan }, e);
		assertEquals(clamp(v, Create(), 1.0, nan), { x : nan, y : nan, z : nan, w : nan }, e);

		const r = clamp(v, Create(1.1, 2.2, 3.3, 4.4), 2.0, 4.0);

		assertEquals(r, { x : 2.0, y : 2.2, z : 3.3, w : 4.0 }, e);
		assert.strictEqual(v, r);

		assertEquals(clamp(v, Create(1.1, 2.2, 3.3, 4.4), 4.0, 2.0), { x : 2.0, y : 2.2, z : 3.3, w : 4.0 }, e);
		assertEquals(clamp(v, Create(1.1, 2.2, 3.3, 4.4), 3.0, 3.0), { x : 3.0, y : 3.0, z : 3.0, w : 3.0 }, e);
		assertEquals(clamp(v, Create(1.1, 2.2, 3.3, 4.4), 3.0, 3.0), { x : 3.0, y : 3.0, z : 3.0, w : 3.0 }, e);
	});
});

describe('clampAssignAlpha', () => {
	const inf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should assign a vector4 with clamped alpha', () => {
		assert.deepStrictEqual(clampAssignAlpha(Create(), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(nan), 0.0, 1.0), { x : nan, y : 0.0, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(0.0, nan), 0.0, 1.0), { x : 0.0, y : nan, z : 0.0, w : 1.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : nan, w : 1.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(0.0, 0.0, 0.0, nan), 0.0, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : nan });
		assert.deepStrictEqual(clampAssignAlpha(Create(), nan, 1.0), { x : 0.0, y : 0.0, z : 0.0, w : nan });
		assert.deepStrictEqual(clampAssignAlpha(Create(), 0.0, nan), { x : 0.0, y : 0.0, z : 0.0, w : nan });

		const v = Create(inf, inf, inf, inf);
		const w = clampAssignAlpha(v, 0.0, 1.0);

		assert.deepStrictEqual(w, { x : inf, y : inf, z : inf, w : 1.0 });
		assert.strictEqual(v, w);

		assert.deepStrictEqual(clampAssignAlpha(Create(inf, inf, inf, inf), 1.0, 0.0), { x : inf, y : inf, z : inf, w : 1.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(nnf, nnf, nnf, nnf), 0.0, 1.0), { x : nnf, y : nnf, z : nnf, w : 0.0 });
		assert.deepStrictEqual(clampAssignAlpha(Create(nnf, nnf, nnf, nnf), 1.0, 0.0), { x : nnf, y : nnf, z : nnf, w : 0.0 });
	});
});


describe('toString', () => {
	it('should return a string representation of a Vector4', () => {
		assert.strictEqual(toString(Create()), '[0,0,0,1]');
		assert.strictEqual(toString(Create(Number.NaN)), '[NaN,0,0,1]');
		assert.strictEqual(toString(Create(0.0, Number.NaN)), '[0,NaN,0,1]');
		assert.strictEqual(toString(Create(0.0, 0.0, Number.NaN)), '[0,0,NaN,1]');
		assert.strictEqual(toString(Create(0.0, 0.0, 0.0, Number.NaN)), '[0,0,0,NaN]');
		assert.strictEqual(toString(Create(0.12345, 12.345, 1234.5, 1234.0005), 2), '[0.12,12.35,1234.5,1234]');
	});
});
