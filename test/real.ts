import * as assert from 'assert';
import { describe, it } from 'mocha';
import { align, angle, angleUnit, clamp, interval, toFixed } from '../source/real';
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
