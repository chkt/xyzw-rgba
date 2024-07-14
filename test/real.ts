import * as assert from 'node:assert';
import { describe, it } from 'mocha';
import {
	align,
	angle,
	angleUnit,
	clamp,
	interval,
	isAbsEq, isAbsGt, isAbsGtEq,
	isAbsLt,
	isAbsLtEq,
	mean,
	mid,
	range, relative,
	toFixed
} from '../source/real';
import { assertEquals } from './assert/assert';


describe('angle', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should convert angles between unit', () => {
		assertEquals(angle(nan, angleUnit.turn, angleUnit.turn), nan, e);
		assertEquals(angle(nan, angleUnit.turn, angleUnit.rad), nan, e);
		assertEquals(angle(nan, angleUnit.turn, angleUnit.deg), nan, e);
		assertEquals(angle(nan, angleUnit.turn, angleUnit.grad), nan, e);
		assertEquals(angle(0.5, angleUnit.turn, angleUnit.turn), 0.5, e);
		assertEquals(angle(0.5, angleUnit.turn, angleUnit.rad), Math.PI, e);
		assertEquals(angle(0.5, angleUnit.turn, angleUnit.deg), 180.0, e);
		assertEquals(angle(0.5, angleUnit.turn, angleUnit.grad), 200.0, e);
		assertEquals(angle(Math.PI, angleUnit.rad, angleUnit.turn), 0.5, e);
		assertEquals(angle(Math.PI, angleUnit.rad, angleUnit.rad), Math.PI, e);
		assertEquals(angle(Math.PI, angleUnit.rad, angleUnit.deg), 180.0, e);
		assertEquals(angle(Math.PI, angleUnit.rad, angleUnit.grad), 200.0, e);
		assertEquals(angle(180.0, angleUnit.deg, angleUnit.turn), 0.5, e);
		assertEquals(angle(180.0, angleUnit.deg, angleUnit.rad), Math.PI, e);
		assertEquals(angle(180.0, angleUnit.deg, angleUnit.deg), 180.0, e);
		assertEquals(angle(180.0, angleUnit.deg, angleUnit.grad), 200.0, e);
		assertEquals(angle(200.0, angleUnit.grad, angleUnit.turn), 0.5, e);
		assertEquals(angle(200.0, angleUnit.grad, angleUnit.rad), Math.PI, e);
		assertEquals(angle(200.0, angleUnit.grad, angleUnit.deg), 180.0, e);
		assertEquals(angle(200.0, angleUnit.grad, angleUnit.grad), 200.0, e);
	});
});

describe('align', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return an aligned value', () => {
		assertEquals(align(nan, 1.0, 0.5), nan, e);
		assertEquals(align(e, nan, 0.5), nan, e);
		assertEquals(align(e, 1.0, nan), 0.0, e);	// TODO: return NaN?
		assertEquals(align(e, 1.0, 0.5), 0.0, e);
		assertEquals(align(0.5 - e, 1.0, 0.5), 0.0, e);
		assertEquals(align(0.5 + e, 1.0, 0.5), 1.0, e);
		assertEquals(align(1.0 - e, 1.0, 0.5), 1.0, e);
		assertEquals(align(e, 1.0, 0.0), 1.0, e);
		assertEquals(align(0.5 - e, 1.0, 0.0), 1.0, e);
		assertEquals(align(0.5 + e, 1.0, 0.0), 1.0, e);
		assertEquals(align(1.0 - e, 1.0, 0.0), 1.0, e);
		assertEquals(align(e, 1.0, 1.0), 0.0, e);
		assertEquals(align(0.5 - e, 1.0, 1.0), 0.0, e);
		assertEquals(align(0.5 + e, 1.0, 1.0), 0.0, e);
		assertEquals(align(1.0 - e, 1.0, 1.0), 0.0, e);
		assertEquals(align(e, 0.4, 0.5), 0.0, e);
		assertEquals(align(0.5 - e, 0.4, 0.5), 0.4, e);
		assertEquals(align(0.5 + e, 0.4, 0.5), 0.4, e);
		assertEquals(align(1.0 - e, 0.4, 0.5), 0.8, e);
		assertEquals(align(e, 0.4, 0.25), 0.0, e);
		assertEquals(align(0.5 - e, 0.4, 0.25), 0.4, e);
		assertEquals(align(0.5 + e, 0.4, 0.25), 0.8, e);
		assertEquals(align(1.0 - e, 0.4, 0.25), 1.2, e);
	});
});

describe('isAbsEq', () => {
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return true if two values are equal', () => {
		assert.strictEqual(isAbsEq(0.0, 0.0), true);
		assert.strictEqual(isAbsEq(nan, 0.0), false);
		assert.strictEqual(isAbsEq(0.0, nan), false);
		assert.strictEqual(isAbsEq(1.0, 1.0), true);
		assert.strictEqual(isAbsEq(1.0, -1.0), true);
		assert.strictEqual(isAbsEq(-1.0, 1.0), true);
		assert.strictEqual(isAbsEq(-1.0, -1.0), true);
		assert.strictEqual(isAbsEq(1.0, 2.0), false);
		assert.strictEqual(isAbsEq(1.0, -2.0), false);
		assert.strictEqual(isAbsEq(-1.0, 2.0), false);
		assert.strictEqual(isAbsEq(-1.0, -2.0), false);
		assert.strictEqual(isAbsEq(pnf, 0.0), false);
		assert.strictEqual(isAbsEq(0.0, pnf), false);
		assert.strictEqual(isAbsEq(pnf, pnf), true);
		assert.strictEqual(isAbsEq(nnf, 0.0), false);
		assert.strictEqual(isAbsEq(0.0, nnf), false);
		assert.strictEqual(isAbsEq(nnf, nnf), true);
		assert.strictEqual(isAbsEq(nnf, pnf), true);
		assert.strictEqual(isAbsEq(pnf, nnf), true);
	});
});

describe('isAbsLt', () => {
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return true if the absolute of a value is less than the absolute of another value', () => {
		assert.strictEqual(isAbsLt(0.0, 0.0), false);
		assert.strictEqual(isAbsLt(nan, 0.0), false);
		assert.strictEqual(isAbsLt(0.0, nan), false);
		assert.strictEqual(isAbsLt(1.0, 1.0), false);
		assert.strictEqual(isAbsLt(1.0, -1.0), false);
		assert.strictEqual(isAbsLt(-1.0, 1.0), false);
		assert.strictEqual(isAbsLt(-1.0, -1.0), false);
		assert.strictEqual(isAbsLt(1.0, 2.0), true);
		assert.strictEqual(isAbsLt(1.0, -2.0), true);
		assert.strictEqual(isAbsLt(-1.0, 2.0), true);
		assert.strictEqual(isAbsLt(-1.0, -2.0), true);
		assert.strictEqual(isAbsLt(2.0, 1.0), false);
		assert.strictEqual(isAbsLt(2.0, -1.0), false);
		assert.strictEqual(isAbsLt(-2.0, 1.0), false);
		assert.strictEqual(isAbsLt(-2.0, -1.0), false);
		assert.strictEqual(isAbsLt(pnf, 0.0), false);
		assert.strictEqual(isAbsLt(0.0, pnf), true);
		assert.strictEqual(isAbsLt(pnf, pnf), false);
		assert.strictEqual(isAbsLt(nnf, 0.0), false);
		assert.strictEqual(isAbsLt(0.0, nnf), true);
		assert.strictEqual(isAbsLt(nnf, nnf), false);
		assert.strictEqual(isAbsLt(nnf, pnf), false);
		assert.strictEqual(isAbsLt(pnf, nnf), false);
	});
});
describe('isAbsLtEq', () => {
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return true if the absolute of a value is less than or equal to the absolute of another value', () => {
		assert.strictEqual(isAbsLtEq(0.0, 0.0), true);
		assert.strictEqual(isAbsLtEq(nan, 0.0), false);
		assert.strictEqual(isAbsLtEq(0.0, nan), false);
		assert.strictEqual(isAbsLtEq(1.0, 1.0), true);
		assert.strictEqual(isAbsLtEq(1.0, -1.0), true);
		assert.strictEqual(isAbsLtEq(-1.0, 1.0), true);
		assert.strictEqual(isAbsLtEq(-1.0, -1.0), true);
		assert.strictEqual(isAbsLtEq(1.0, 2.0), true);
		assert.strictEqual(isAbsLtEq(1.0, -2.0), true);
		assert.strictEqual(isAbsLtEq(-1.0, 2.0), true);
		assert.strictEqual(isAbsLtEq(-1.0, -2.0), true);
		assert.strictEqual(isAbsLtEq(2.0, 1.0), false);
		assert.strictEqual(isAbsLtEq(2.0, -1.0), false);
		assert.strictEqual(isAbsLtEq(-2.0, 1.0), false);
		assert.strictEqual(isAbsLtEq(-2.0, -1.0), false);
		assert.strictEqual(isAbsLtEq(pnf, 0.0), false);
		assert.strictEqual(isAbsLtEq(0.0, pnf), true);
		assert.strictEqual(isAbsLtEq(pnf, pnf), true);
		assert.strictEqual(isAbsLtEq(nnf, 0.0), false);
		assert.strictEqual(isAbsLtEq(0.0, nnf), true);
		assert.strictEqual(isAbsLtEq(nnf, nnf), true);
		assert.strictEqual(isAbsLtEq(nnf, pnf), true);
		assert.strictEqual(isAbsLtEq(pnf, nnf), true);
	});
});
describe('isAbsGt', () => {
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return true if the absolute of a value is greater than the absolute of another value', () => {
		assert.strictEqual(isAbsGt(0.0, 0.0), false);
		assert.strictEqual(isAbsGt(nan, 0.0), false);
		assert.strictEqual(isAbsGt(0.0, nan), false);
		assert.strictEqual(isAbsGt(1.0, 1.0), false);
		assert.strictEqual(isAbsGt(1.0, -1.0), false);
		assert.strictEqual(isAbsGt(-1.0, 1.0), false);
		assert.strictEqual(isAbsGt(-1.0, -1.0), false);
		assert.strictEqual(isAbsGt(1.0, 2.0), false);
		assert.strictEqual(isAbsGt(1.0, -2.0), false);
		assert.strictEqual(isAbsGt(-1.0, 2.0), false);
		assert.strictEqual(isAbsGt(-1.0, -2.0), false);
		assert.strictEqual(isAbsGt(2.0, 1.0), true);
		assert.strictEqual(isAbsGt(2.0, -1.0), true);
		assert.strictEqual(isAbsGt(-2.0, 1.0), true);
		assert.strictEqual(isAbsGt(-2.0, -1.0), true);
		assert.strictEqual(isAbsGt(pnf, 0.0), true);
		assert.strictEqual(isAbsGt(0.0, pnf), false);
		assert.strictEqual(isAbsGt(pnf, pnf), false);
		assert.strictEqual(isAbsGt(nnf, 0.0), true);
		assert.strictEqual(isAbsGt(0.0, nnf), false);
		assert.strictEqual(isAbsGt(nnf, nnf), false);
		assert.strictEqual(isAbsGt(nnf, pnf), false);
		assert.strictEqual(isAbsGt(pnf, nnf), false);
	});
});
describe('isAbsGtEq', () => {
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return true if the absolute of a value is greater than or equal to the absolute of another value', () => {
		assert.strictEqual(isAbsGtEq(0.0, 0.0), true);
		assert.strictEqual(isAbsGtEq(nan, 0.0), false);
		assert.strictEqual(isAbsGtEq(0.0, nan), false);
		assert.strictEqual(isAbsGtEq(1.0, 1.0), true);
		assert.strictEqual(isAbsGtEq(1.0, -1.0), true);
		assert.strictEqual(isAbsGtEq(-1.0, 1.0), true);
		assert.strictEqual(isAbsGtEq(-1.0, -1.0), true);
		assert.strictEqual(isAbsGtEq(1.0, 2.0), false);
		assert.strictEqual(isAbsGtEq(1.0, -2.0), false);
		assert.strictEqual(isAbsGtEq(-1.0, 2.0), false);
		assert.strictEqual(isAbsGtEq(-1.0, -2.0), false);
		assert.strictEqual(isAbsGtEq(2.0, 1.0), true);
		assert.strictEqual(isAbsGtEq(2.0, -1.0), true);
		assert.strictEqual(isAbsGtEq(-2.0, 1.0), true);
		assert.strictEqual(isAbsGtEq(-2.0, -1.0), true);
		assert.strictEqual(isAbsGtEq(pnf, 0.0), true);
		assert.strictEqual(isAbsGtEq(0.0, pnf), false);
		assert.strictEqual(isAbsGtEq(pnf, pnf), true);
		assert.strictEqual(isAbsGtEq(nnf, 0.0), true);
		assert.strictEqual(isAbsGtEq(0.0, nnf), false);
		assert.strictEqual(isAbsGtEq(nnf, nnf), true);
		assert.strictEqual(isAbsGtEq(nnf, pnf), true);
		assert.strictEqual(isAbsGtEq(pnf, nnf), true);
	});
});

describe('clamp', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a clamped number', () => {
		assertEquals(clamp(nan, 0.0, 1.0), nan, e);
		assertEquals(clamp(0.0, nan, 1.0), nan, e);
		assertEquals(clamp(0.0, 0.0, nan), nan, e);
		assertEquals(clamp(-1.0, 0.0, 1.0), 0.0, e);
		assertEquals(clamp(0.0, 0.0, 1.0), 0.0, e);
		assertEquals(clamp(0.5, 0.0, 1.0), 0.5, e);
		assertEquals(clamp(1.0, 0.0, 1.0), 1.0, e);
		assertEquals(clamp(1.5, 0.0, 1.0), 1.0, e);
		assertEquals(clamp(-1.0, 1.0, 0.0), 0.0, e);
		assertEquals(clamp(0.0, 1.0, 0.0), 0.0, e);
		assertEquals(clamp(0.5, 1.0, 0.0), 0.5, e);
		assertEquals(clamp(1.0, 1.0, 0.0), 1.0, e);
		assertEquals(clamp(1.5, 1.0, 0.0), 1.0, e);
		assertEquals(clamp(-1.0, 1.0, 1.0), 1.0, e);
		assertEquals(clamp(0.0, 1.0, 1.0), 1.0, e);
		assertEquals(clamp(0.5, 1.0, 1.0), 1.0, e);
		assertEquals(clamp(1.0, 1.0, 1.0), 1.0, e);
		assertEquals(clamp(1.5, 1.0, 1.0), 1.0, e);
	});
});

describe('interval', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return a number normalized to an interval', () => {
		assertEquals(interval(nan, 0.0, 1.0), nan, e);
		assertEquals(interval(-0.25, nan, 1.0), nan, e);
		assertEquals(interval(-0.25, 0.0, nan), nan, e);
		assertEquals(interval(-0.25, 0.0, 1.0), 0.75, e);
		assertEquals(interval(1.25, 0.0, 1.0), 0.25, e);
		assertEquals(interval(-0.25, 1.0, 0.0), 0.75, e);
		assertEquals(interval(1.25, 1.0, 0.0), 0.25, e);
		assertEquals(interval(-0.25, 2.0, 3.0), 2.75, e);
		assertEquals(interval(1.25, 2.0, 3.0), 2.25, e);
		assertEquals(interval(-0.25, -2.0, -3.0), -2.25, e);
		assertEquals(interval(1.25, -2.0, -3.0), -2.75, e);
	});
});

describe('range', () => {
	const e = 1e-10;
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return the range of an array of numbers', () => {
		assert.strictEqual(range([]), nan);
		assert.strictEqual(range([ nan, 2.0, 3.0 ]), nan);
		assert.strictEqual(range([ 1.0, nan, 3.0 ]), nan);
		assert.strictEqual(range([ 1.0, 2.0, nan ]), nan);
		assert.strictEqual(range([ 1.0, pnf ]), pnf);
		assert.strictEqual(range([ 1.0, nnf ]), pnf);
		assert.strictEqual(range([ pnf, nnf ]), pnf);
		assertEquals(range([ 1.0, 2.0, 3.0 ]), 2.0, e);
		assertEquals(range([ -1.0, 2.0, 3.0 ]), 4.0, e);
		assertEquals(range([ 1.0, -2.0, 3.0 ]), 5.0, e);
		assertEquals(range([ 1.0, 2.0, -3.0 ]), 5.0, e);
		assertEquals(range([ -1.0, -2.0, -3.0 ]), 2.0, e);
	});
});

describe('mean', () => {
	const e = 1e-10;
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return the arithmetic mean of an array of numbers', () => {
		assert.strictEqual(mean([]), nan);
		assert.strictEqual(mean([ nan, 2.0, 3.0 ]), nan);
		assert.strictEqual(mean([ 1.0, nan, 3.0 ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, nan ]), nan);
		assert.strictEqual(mean([ 1.0, pnf ]), pnf);
		assert.strictEqual(mean([ pnf, pnf ]), pnf);
		assert.strictEqual(mean([ 1.0, nnf ]), nnf);
		assert.strictEqual(mean([ nnf, nnf ]), nnf);
		assert.strictEqual(mean([ pnf, nnf ]), nan);
		assert.strictEqual(mean([ pnf, nnf, pnf ]), nan);
		assertEquals(mean([ 1.0, 2.0 ]), 1.5, e);
		assertEquals(mean([ 1.0, 2.0, 3.0 ]), 2.0, e);
		assertEquals(mean([ -1.0, 2.0 ]), 0.5, e);
		assertEquals(mean([ -1.0, -2.0 ]), -1.5, e);
	});

	it('should return the weighted mean of an array of numbers', () => {
		assertEquals(mean([ 1.0, 2.0, 3.0 ], []), 2.0, e);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ nan ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, nan ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, nan ]), nan);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, 1.0, nan ]), 2.0, e);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ pnf ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, pnf ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, pnf ]), nan);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, 1.0, pnf ]), 2.0, e);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ nnf ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, nnf ]), nan);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, nnf ]), nan);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 1.0, 1.0, 1.0, nnf ]), 2.0, e);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 3.0, 2.0, 1.0 ]), 10.0 / 6.0, e);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ -3.0, 2.0, 1.0 ]), pnf);
		assert.strictEqual(mean([ 1.0, -2.0, 3.0 ], [ -3.0, 2.0, 1.0 ]), nnf);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 3.0, -2.0, 1.0 ]), 2.0 / 2.0, e);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 0.0, 2.0, 1.0 ]), 7.0 / 3.0, e);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 3.0, 0.0, 1.0 ]), 6.0 / 4.0, e);
		assertEquals(mean([ 1.0, 2.0, 3.0 ], [ 3.0, 2.0, 0.0 ]), 7.0 / 5.0, e);
		assert.strictEqual(mean([ 1.0, 2.0, 3.0 ], [ 0.0, 0.0, 0.0 ]), nan);
	});
});

describe('mid', () => {
	const e = 1e-10;
	const pnf = Number.POSITIVE_INFINITY;
	const nnf = Number.NEGATIVE_INFINITY;
	const nan = Number.NaN;

	it('should return the midrange of an array of numbers', () => {
		assert.strictEqual(mid([]), nan);
		assert.strictEqual(mid([ nan, 2.0, 3.0 ]), nan);
		assert.strictEqual(mid([ 1.0, nan, 3.0 ]), nan);
		assert.strictEqual(mid([ 1.0, 2.0, nan ]), nan);
		assert.strictEqual(mid([ 1.0, pnf ]), pnf);
		assert.strictEqual(mid([ pnf, pnf ]), pnf);
		assert.strictEqual(mid([ 1.0, nnf ]), nnf);
		assert.strictEqual(mid([ nnf, nnf ]), nnf);
		assert.strictEqual(mid([ pnf, nnf ]), nan);
		assert.strictEqual(mid([ pnf, nnf, pnf ]), nan);
		assertEquals(mid([ 1.0, 2.0, 3.0 ]), 2.0, e);
		assertEquals(mid([ -1.0, 2.0, 3.0 ]), 1.0, e);
		assertEquals(mid([ 1.0, -2.0, 3.0 ]), 0.5, e);
		assertEquals(mid([ 1.0, 2.0, -3.0 ]), -0.5, e);
		assertEquals(mid([ -1.0, -2.0, -3.0 ]), -2.0, e);
	});

	it('should return the lerp of the extremes of an array of numbers', () => {
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], nan), nan);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], pnf), nan);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], nnf), nan);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], -1.0), -1.0);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 0.0), 1.0);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 0.25), 1.5);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 0.5), 2.0);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 0.75), 2.5);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 1.0), 3.0);
		assert.strictEqual(mid([ 1.0, 2.0, 3.0 ], 2.0), 5.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], -1.0), -5.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 0.0), -1.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 0.25), 0.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 0.5), 1.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 0.75), 2.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 1.0), 3.0);
		assert.strictEqual(mid([ -1.0, 2.0, 3.0 ], 2.0), 7.0);
	});
});

describe('relative', () => {
	it('should return the position of a value along an array of numbers', () => {
		const pnf = Number.POSITIVE_INFINITY;
		const nnf = Number.NEGATIVE_INFINITY;
		const nan = Number.NaN;

		assert.strictEqual(relative([ 1.0, 3.0, 2.0 ], 1.0), 0.0);
		assert.strictEqual(relative([ 1.0, 3.0, 2.0 ], 3.0), 1.0);
		assert.strictEqual(relative([ 1.0, 3.0, 2.0 ], 2.0), 0.5);
		assert.strictEqual(relative([ 1.0, 3.0, 2.0 ], 0.0), -0.5);
		assert.strictEqual(relative([ 1.0, 3.0, 2.0 ], 4.0), 1.5);
		assert.strictEqual(relative([ 1.0, 1.0, 1.0 ], 2.0), pnf);
		assert.strictEqual(relative([ 1.0, 1.0, 1.0 ], 0.0), nnf);
		assert.strictEqual(relative([ 1.0, 1.0, 1.0 ], 1.0), nan);

		assert.strictEqual(relative([ 0.0, 1.0 ], nan), nan);
		assert.strictEqual(relative([ nan, 1.0 ], 2.0), nan);
		assert.strictEqual(relative([ 0.0, nan ], 2.0), nan);

		assert.strictEqual(relative([ 0.0, 1.0 ], pnf), pnf);
		assert.strictEqual(relative([ 0.0, pnf ], 2.0), 0.0);
		assert.strictEqual(relative([ 0.0, pnf ], -2.0), 0.0);
		assert.strictEqual(relative([ pnf, pnf ], 2.0), nan);
		assert.strictEqual(relative([ 0.0, pnf ], pnf), nan);

		assert.strictEqual(relative([ 0.0, 1.0 ], nnf), nnf);
		assert.strictEqual(relative([ nnf, 1.0 ], 2.0), 1.0);
		assert.strictEqual(relative([ nnf, 1.0 ], nnf), nan);
		assert.strictEqual(relative([ nnf, nnf ], 2.0), nan);

		assert.strictEqual(relative([ nnf, 1.0 ], pnf), nan);
		assert.strictEqual(relative([ 0.0, pnf ], nnf), nan);
		assert.strictEqual(relative([ nnf, pnf ], 2.0), nan);
	});
});

describe('toFixed', () => {
	it('should return a trimmed string representation', () => {
		assert.strictEqual(toFixed(0.0), '0');
		assert.strictEqual(toFixed(0.0, 1), '0');
		assert.strictEqual(toFixed(0.123, 0), '0');
		assert.strictEqual(toFixed(0.999, 0), '1');
		assert.strictEqual(toFixed(0.123, 1), '0.1');
		assert.strictEqual(toFixed(0.899, 1), '0.9');
		assert.strictEqual(toFixed(0.999, 1), '1');
		assert.strictEqual(toFixed(0.123, 2), '0.12');
		assert.strictEqual(toFixed(0.989, 2), '0.99');
		assert.strictEqual(toFixed(0.999, 2), '1');
		assert.strictEqual(toFixed(0.123, 3), '0.123');
		assert.strictEqual(toFixed(0.999, 3), '0.999');
		assert.strictEqual(toFixed(0.123, 4), '0.123');
		assert.strictEqual(toFixed(0.999, 4), '0.999');
		assert.strictEqual(toFixed(123, 4), '123');
		assert.strictEqual(toFixed(1230, 4), '1230');
		assert.strictEqual(toFixed(0.123004, 6), '0.123004');
		assert.strictEqual(toFixed(0.123004, 5), '0.123');
	});
});
