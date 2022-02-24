import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Create, assign } from 'xyzw/dist/vector3';
import {
	compressGamma,
	compressSrgb,
	expandGamma,
	expandSrgb,
	gamma,
	identity,
	linear,
	srgb
} from '../source/colorSpace';
import { assertEqualsVec3 } from './assert/assert';


describe('identity', () => {
	it('should return a copy of the input vector', () => {
		const v = Create();
		const w = Create(1.1, 2.2, 3.3);
		const r = identity(v, w);

		assert.deepStrictEqual(v, w);
		assert.notStrictEqual(v, w);
		assert.strictEqual(v, r);
	});
});

describe('expandSrgb', () => {
	const e = 1e-10;

	it('should perform a srgb expansion', () => {
		const v = Create();
		const X = 0.04045;
		const A = 0.055;
		const L = 2.4;
		const phi = 12.92;

		assertEqualsVec3(expandSrgb(v, Create(0.0, 0.0, 0.0)), Create(0.0, 0.0, 0.0), e);
		assertEqualsVec3(expandSrgb(v, Create(1.0, 1.0, 1.0)), Create(1.0, 1.0, 1.0), e);
		assertEqualsVec3(expandSrgb(v, Create(X, X, X)), Create(X / phi, X / phi, X / phi), e);
		assertEqualsVec3(expandSrgb(v, Create(X + 0.00001, X + 0.00001, X + 0.00001)), Create(
			((X + 0.00001 + A) / (1.0 + A)) ** L,
			((X + 0.00001 + A) / (1.0 + A)) ** L,
			((X + 0.00001 + A) / (1.0 + A)) ** L
		), e);
		assertEqualsVec3(expandSrgb(v, Create(0.02, 0.5, 0.8)), Create(
			0.02 / phi,
			((0.5 + A) / (1.0 + A)) ** L,
			((0.8 + A) / (1.0 + A)) ** L
		), e);
	});
});

describe('compressSrgb', () => {
	const e = 1e-10;

	it('should perform a srgb compression', () => {
		const v = Create();
		const X = 0.0031308; // 0.04045 / phi
		const A = 0.055;
		const L = 2.4;
		const phi = 12.92;

		assertEqualsVec3(compressSrgb(v, Create(0.0, 0.0, 0.0)), Create(0.0, 0.0, 0.0), e);
		assertEqualsVec3(compressSrgb(v, Create(1.0, 1.0, 1.0)), Create(1.0, 1.0, 1.0), e);
		assertEqualsVec3(compressSrgb(v, Create(X, X, X)), Create(X * phi, X * phi, X * phi), e);
		assertEqualsVec3(compressSrgb(v, Create(X + 0.0000001, X + 0.0000001, X + 0.0000001)), Create(
			(1.0 + A) * (X + 0.0000001) ** (1.0 / L) - A,
			(1.0 + A) * (X + 0.0000001) ** (1.0 / L) - A,
			(1.0 + A) * (X + 0.0000001) ** (1.0 / L) - A
		), e);
		assertEqualsVec3(compressSrgb(v, Create(0.0015, 0.5, 0.8)), Create(
			0.0015 * phi,
			(1.0 + A) * 0.5 ** (1.0 / L) - A,
			(1.0 + A) * 0.8 ** (1.0 / L) - A
		), e);
	});
});

describe('expandGamma', () => {
	const e = 1e-10;

	it('should perform gamma expansion', () => {
		const v = Create();

		assertEqualsVec3(expandGamma(2.2, v, Create()), Create(), e);
		assertEqualsVec3(expandGamma(2.2, v, Create(1.0, 1.0, 1.0)), Create(1.0, 1.0, 1.0), e);
		assertEqualsVec3(expandGamma(2.2, v, Create(0.2, 0.5, 0.7)), Create(
			0.2 ** 2.2,
			0.5 ** 2.2,
			0.7 ** 2.2
		), e);
	});
});

describe('compressGamma', () => {
	const e = 1e-10;

	it('should perform gamma compression', () => {
		const v = Create();

		assertEqualsVec3(compressGamma(1.0 / 2.2, v, Create()), Create(), e);
		assertEqualsVec3(compressGamma(1.0 / 2.2, v, Create(1.0, 1.0, 1.0)), Create(1.0, 1.0, 1.0), e);
		assertEqualsVec3(compressGamma(1.0 / 2.2, v, Create(0.2, 0.5, 0.7)), Create(
			0.2 ** (1.0 / 2.2),
			0.5 ** (1.0 / 2.2),
			0.7 ** (1.0 / 2.2)
		), e);
	});
});

describe('linear', () => {
	it('should supply two identity transforms', () => {
		const v = Create();
		const w = Create(1.1, 2.2, 3.3);
		let r = linear.expand(v, w);

		assert.deepStrictEqual(v, w);
		assert.notStrictEqual(v, w);
		assert.strictEqual(v, r);

		assign(v, 0.0, 0.0, 0.0);

		r = linear.compress(v, w);

		assert.deepStrictEqual(v, w);
		assert.notStrictEqual(v, w);
		assert.strictEqual(v, r);
	});
});

describe('srgb', () => {
	it('should supply srgb expansion and compression transforms', () => {
		assert.strictEqual(srgb.expand, expandSrgb);
		assert.strictEqual(srgb.compress, compressSrgb);
	});
});

describe('gamma', () => {
	const e = 1e-10;

	it('should return a gamma color space', () => {
		const v = Create();
		const w = Create();
		const g = gamma();

		assertEqualsVec3(g.expand(v, Create(0.2, 0.5, 0.7)), expandGamma(2.2, w, Create(0.2, 0.5, 0.7)), e);
		assertEqualsVec3(g.compress(v, Create(0.2, 0.5, 0.7)), compressGamma(1.0 / 2.2, w, Create(0.2, 0.5, 0.7)), e);
	});
});
