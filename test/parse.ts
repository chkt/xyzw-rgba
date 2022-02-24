import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as vec3 from 'xyzw/dist/vector3';
import {
	compressUint24,
	expandUint24,
	isCssHslString,
	isCssHslaString, isCssRgbString, isCssRgbaString,
	parseCssAngle,
	parseCssPercent, parseCssUint8, parseCssUnitInterval
} from '../source/parse';
import { assertEquals, assertEqualsVec3 } from './assert/assert';
import { createColorSpace } from './mock/colorSpace';


describe('expandUint24', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector3 to represent the expansion of a uint8 valued Vector3', () => {
		const v = vec3.Create();

		assertEqualsVec3(expandUint24(v, vec3.Create()), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(expandUint24(v, vec3.Create(nan)), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(expandUint24(v, vec3.Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEqualsVec3(expandUint24(v, vec3.Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan }, e);

		const r = expandUint24(v, vec3.Create(255.0, 102.0, 128.0));

		assertEqualsVec3(r, { x : 1.0, y : 0.4, z : 128.0 / 255.0 }, e);
		assert.strictEqual(v, r);
	});

	it('should apply color conversions', () => {
		const v = vec3.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(expandUint24(v, vec3.Create(102.0, 153.0, 255.0), cs), { x : 0.8, y : 1.2, z : 2.0 }, e);
	});
});

describe('compressUint24', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should assign a Vector3 to represent the uint8 compression of a Vector3', () => {
		const v = vec3.Create();

		assertEqualsVec3(compressUint24(v, vec3.Create()), { x : 0.0, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(compressUint24(v, vec3.Create(nan)), { x : nan, y : 0.0, z : 0.0 }, e);
		assertEqualsVec3(compressUint24(v, vec3.Create(0.0, nan)), { x : 0.0, y : nan, z : 0.0 }, e);
		assertEqualsVec3(compressUint24(v, vec3.Create(0.0, 0.0, nan)), { x : 0.0, y : 0.0, z : nan }, e);
		assertEqualsVec3(compressUint24(v, vec3.Create(1.0, 0.5, 0.4)), { x : 255.0, y : 128.0, z : 102.0 }, e);
		assertEqualsVec3(
			compressUint24(v, vec3.Create(Number.NEGATIVE_INFINITY, -Number.MIN_VALUE, Number.POSITIVE_INFINITY)),
			{ x : 0.0, y : 0.0, z : 255.0 },
			e
		);
	});

	it('should apply color conversions', () => {
		const v = vec3.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(compressUint24(v, vec3.Create(0.5, 1.0, 2.0), cs), { x : 64.0, y : 128.0, z : 255.0 }, e);
	});
});


describe('parseCssUint8', () => {
	it('should return the numerical value of a string', () => {
		assert.strictEqual(parseCssUint8('0'), 0.0);
		assert.strictEqual(parseCssUint8('0.0'), 0.0);
		assert.strictEqual(parseCssUint8('0.00'), 0.0);
		assert.strictEqual(parseCssUint8('00.0'), 0.0);
		assert.strictEqual(parseCssUint8('.0'), 0.0);
		assert.strictEqual(parseCssUint8('+0.0'), 0.0);
		assert.strictEqual(parseCssUint8('-0.0'), -0.0);
		assert.strictEqual(parseCssUint8('0e0'), 0.0);
		assert.strictEqual(parseCssUint8('0e5'), 0.0);
		assert.strictEqual(parseCssUint8('0e+5'), 0.0);
		assert.strictEqual(parseCssUint8('0e-5'), 0.0);

		assert.strictEqual(parseCssUint8('255'), 255.0);
		assert.strictEqual(parseCssUint8('255.0'), 255.0);
		assert.strictEqual(parseCssUint8('255.00'), 255.0);
		assert.strictEqual(parseCssUint8('0255.0'), 255.0);
		assert.strictEqual(parseCssUint8('+255.0'), 255.0);
		assert.strictEqual(parseCssUint8('255e0'), 255.0);
		assert.strictEqual(parseCssUint8('25.5e1'), 255.0);
		assert.strictEqual(parseCssUint8('2550e-1'), 255.0);

		assert.strictEqual(parseCssUint8('127.5'), 128.0);

		assert.strictEqual(parseCssUint8('0%'), 0.0);
		assert.strictEqual(parseCssUint8('100%'), 255.0);
		assert.strictEqual(parseCssUint8('50%'), 127.0);
		assert.strictEqual(parseCssUint8('55.5%'), 142.0);
	});

	it('should throw for invalid values', () => {
		assert.throws(() => parseCssUint8('foo'), new Error("bad css number or percentage 'foo'"));
		assert.throws(() => parseCssUint8(' 0'), new Error("bad css number or percentage ' 0'"));
		assert.throws(() => parseCssUint8('0 '), new Error("bad css number or percentage '0 '"));
		assert.throws(() => parseCssUint8('0.'), new Error("bad css number or percentage '0.'"));
		assert.throws(() => parseCssUint8('0.0.0'), new Error("bad css number or percentage '0.0.0'"));
		assert.throws(() => parseCssUint8('+-0'), new Error("bad css number or percentage '+-0'"));
		assert.throws(() => parseCssUint8('-+0'), new Error("bad css number or percentage '-+0'"));
		assert.throws(() => parseCssUint8('0e1.0'), new Error("bad css number or percentage '0e1.0'"));
		assert.throws(() => parseCssUint8('-1.0'), new Error("bad css uint8 '-1.0'"));
		assert.throws(() => parseCssUint8('256.0'), new Error("bad css uint8 '256.0'"));
		assert.throws(() => parseCssUint8('0 %'), new Error("bad css number or percentage '0 %'"));
		assert.throws(() => parseCssUint8('-100%'), new Error("bad css uint8 '-100%'"));
		assert.throws(() => parseCssUint8('101%'), new Error("bad css uint8 '101%'"));
	});
});

describe('parseCssUnitInterval', () => {
	it('should return the numerical value of a string', () => {
		assert.strictEqual(parseCssUnitInterval('0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('0.0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('0.00'), 0.0);
		assert.strictEqual(parseCssUnitInterval('00.0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('.0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('+0.0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('-0.0'), -0.0);
		assert.strictEqual(parseCssUnitInterval('0e0'), 0.0);
		assert.strictEqual(parseCssUnitInterval('0e5'), 0.0);

		assert.strictEqual(parseCssUnitInterval('1'), 1.0);
		assert.strictEqual(parseCssUnitInterval('1.0'), 1.0);
		assert.strictEqual(parseCssUnitInterval('1.00'), 1.0);
		assert.strictEqual(parseCssUnitInterval('01.0'), 1.0);
		assert.strictEqual(parseCssUnitInterval('+1.0'), 1.0);
		assert.strictEqual(parseCssUnitInterval('1e0'), 1.0);
		assert.strictEqual(parseCssUnitInterval('0.1e1'), 1.0);
		assert.strictEqual(parseCssUnitInterval('10e-1'), 1.0);

		assert.strictEqual(parseCssUnitInterval('0.5'), 0.5);

		assert.strictEqual(parseCssUnitInterval('0%'), 0.0);
		assert.strictEqual(parseCssUnitInterval('100%'), 1.0);
		assert.strictEqual(parseCssUnitInterval('50%'), 0.5);
		assert.strictEqual(parseCssUnitInterval('55.5%'), 0.555);
	});

	it('should throw for invalid values', () => {
		assert.throws(() => parseCssUnitInterval('foo'), new Error("bad css number or percentage 'foo'"));
		assert.throws(() => parseCssUnitInterval('0.'), new Error("bad css number or percentage '0.'"));
		assert.throws(() => parseCssUnitInterval('0.0.0'), new Error("bad css number or percentage '0.0.0'"));
		assert.throws(() => parseCssUnitInterval('+-0'), new Error("bad css number or percentage '+-0'"));
		assert.throws(() => parseCssUnitInterval('-+0'), new Error("bad css number or percentage '-+0'"));
		assert.throws(() => parseCssUnitInterval('0e1.0'), new Error("bad css number or percentage '0e1.0'"));
		assert.throws(() => parseCssUnitInterval('-1.0'), new Error("bad css unit interval '-1.0'"));
		assert.throws(() => parseCssUnitInterval('2.0'), new Error("bad css unit interval '2.0'"));
		assert.throws(() => parseCssUnitInterval('0 %'), new Error("bad css number or percentage '0 %'"));
		assert.throws(() => parseCssUnitInterval('-100%'), new Error("bad css unit interval '-100%'"));
		assert.throws(() => parseCssUnitInterval('101%'), new Error("bad css unit interval '101%'"));
	});
});

describe('parseCssAngle', () => {
	const e = 1e-10;
	const TURN = Math.PI * 2.0;

	it('should return the numerical value of a string', () => {
		assertEquals(parseCssAngle('0'), 0.0, e);
		assertEquals(parseCssAngle('0.0'), 0.0, e);
		assertEquals(parseCssAngle('0.00'), 0.0, e);
		assertEquals(parseCssAngle('00.0'), 0.0, e);
		assertEquals(parseCssAngle('.0'), 0.0, e);
		assertEquals(parseCssAngle('+0.0'), 0.0, e);
		assertEquals(parseCssAngle('-0.0'), 0.0, e);
		assertEquals(parseCssAngle('0e0'), 0.0, e);
		assertEquals(parseCssAngle('0e5'), 0.0, e);

		assertEquals(parseCssAngle('360'), 0.0, e);
		assertEquals(parseCssAngle('360.0'), 0.0, e);
		assertEquals(parseCssAngle('360.00'), 0.0, e);
		assertEquals(parseCssAngle('0360.0'), 0.0, e);
		assertEquals(parseCssAngle('+360.0'), 0.0, e);
		assertEquals(parseCssAngle('-360.0'), 0.0, e);
		assertEquals(parseCssAngle('360e0'), 0.0, e);
		assertEquals(parseCssAngle('36e1'), 0.0, e);
		assertEquals(parseCssAngle('3600e-1'), 0.0, e);

		assertEquals(parseCssAngle('180'), 0.5 * TURN, e);
		assertEquals(parseCssAngle('540'), 0.5 * TURN, e);
		assertEquals(parseCssAngle('0.5turn'), 0.5 * TURN, e);
		assertEquals(parseCssAngle(`${ 0.5 * TURN }rad`), 0.5 * TURN, e);
		assertEquals(parseCssAngle('180deg'), 0.5 * TURN, e);
		assertEquals(parseCssAngle('200grad'), 0.5 * TURN, e);
	});

	it('should throw for invalid values', () => {
		assert.throws(() => parseCssAngle('foo'), new Error("bad css angle 'foo'"));
		assert.throws(() => parseCssAngle('0.'), new Error("bad css angle '0.'"));
		assert.throws(() => parseCssAngle('0.0.0'), new Error("bad css angle '0.0.0'"));
		assert.throws(() => parseCssAngle('+-0'), new Error("bad css angle '+-0'"));
		assert.throws(() => parseCssAngle('-+0'), new Error("bad css angle '-+0'"));
		assert.throws(() => parseCssAngle('0e1.0'), new Error("bad css angle '0e1.0'"));
		assert.throws(() => parseCssAngle('0 turn'), new Error("bad css angle '0 turn'"));
		assert.throws(() => parseCssAngle('0 rad'), new Error("bad css angle '0 rad'"));
		assert.throws(() => parseCssAngle('0 deg'), new Error("bad css angle '0 deg'"));
		assert.throws(() => parseCssAngle('0 grad'), new Error("bad css angle '0 grad'"));
	});
});

describe('parseCssPercent', () => {
	it('should return the numerical value of a string', () => {
		assert.strictEqual(parseCssPercent('0%'), 0.0);
		assert.strictEqual(parseCssPercent('0.0%'), 0.0);
		assert.strictEqual(parseCssPercent('0.00%'), 0.0);
		assert.strictEqual(parseCssPercent('00.0%'), 0.0);
		assert.strictEqual(parseCssPercent('.0%'), 0.0);
		assert.strictEqual(parseCssPercent('+0.0%'), 0.0);
		assert.strictEqual(parseCssPercent('-0.0%'), -0.0);
		assert.strictEqual(parseCssPercent('0e0%'), 0.0);
		assert.strictEqual(parseCssPercent('0e5%'), 0.0);

		assert.strictEqual(parseCssPercent('100%'), 1.0);
		assert.strictEqual(parseCssPercent('100.0%'), 1.0);
		assert.strictEqual(parseCssPercent('100.00%'), 1.0);
		assert.strictEqual(parseCssPercent('0100.0%'), 1.0);
		assert.strictEqual(parseCssPercent('+100.0%'), 1.0);
		assert.strictEqual(parseCssPercent('100e0%'), 1.0);
		assert.strictEqual(parseCssPercent('10e1%'), 1.0);
		assert.strictEqual(parseCssPercent('1000e-1%'), 1.0);

		assert.strictEqual(parseCssPercent('55.5%'), 0.555);
	});

	it('should throw for invalid values', () => {
		assert.throws(() => parseCssPercent('foo'), new Error("bad css percentage 'foo'"));
		assert.throws(() => parseCssPercent('0'), new Error("bad css percentage '0'"));
		assert.throws(() => parseCssPercent('0.%'), new Error("bad css percentage '0.%'"));
		assert.throws(() => parseCssPercent('0.0.0%'), new Error("bad css percentage '0.0.0%'"));
		assert.throws(() => parseCssPercent('+-0%'), new Error("bad css percentage '+-0%'"));
		assert.throws(() => parseCssPercent('-+0%'), new Error("bad css percentage '-+0%'"));
		assert.throws(() => parseCssPercent('0e1.0%'), new Error("bad css percentage '0e1.0%'"));
		assert.throws(() => parseCssPercent('-1%'), new Error("bad css percentage '-1%'"));
		assert.throws(() => parseCssPercent('101%'), new Error("bad css percentage '101%'"));
		assert.throws(() => parseCssPercent('0 %'), new Error("bad css percentage '0 %'"));
	});
});

describe('isCssRgbString', () => {
	it('should return true for css rgb() color wrappers', () => {
		assert.strictEqual(isCssRgbString('foo'), false);
		assert.strictEqual(isCssRgbString('rgb(foo'), false);
		assert.strictEqual(isCssRgbString('rgbfoo)'), false);
		assert.strictEqual(isCssRgbString('rgb()'), true);
		assert.strictEqual(isCssRgbString('rgba()'), false);
		assert.strictEqual(isCssRgbString('rgb(0,0,0)'), true);
		assert.strictEqual(isCssRgbString('rgb(0 0 0/0.5)'), false);
	});
});

describe('isCssRgbaString', () => {
	it('should return true for css rgba() color wrappers', () => {
		assert.strictEqual(isCssRgbaString('foo'), false);
		assert.strictEqual(isCssRgbaString('rgba(foo'), false);
		assert.strictEqual(isCssRgbaString('rgbafoo)'), false);
		assert.strictEqual(isCssRgbaString('rgba()'), true);
		assert.strictEqual(isCssRgbaString('rgb()'), true);
		assert.strictEqual(isCssRgbaString('rgba(0,0,0,0)'), true);
	});
});

describe('isCssHslString', () => {
	it('should return true for css hsl() color wrappers', () => {
		assert.strictEqual(isCssHslString('foo'), false);
		assert.strictEqual(isCssHslString('hsl(foo'), false);
		assert.strictEqual(isCssHslString('hslfoo)'), false);
		assert.strictEqual(isCssHslString('hsl()'), true);
		assert.strictEqual(isCssHslString('hsla()'), false);
		assert.strictEqual(isCssHslString('hsl(0,0%,0%)'), true);
		assert.strictEqual(isCssHslString('hsl(0 0% 0%/0.5)'), false);
	});
});

describe('isCssHslaString', () => {
	it('should return true for css rgba() color wrappers', () => {
		assert.strictEqual(isCssHslaString('foo'), false);
		assert.strictEqual(isCssHslaString('hsla(foo'), false);
		assert.strictEqual(isCssHslaString('hslafoo)'), false);
		assert.strictEqual(isCssHslaString('hsla()'), true);
		assert.strictEqual(isCssHslaString('hsl()'), true);
		assert.strictEqual(isCssHslaString('hsla(0,0%,0%,0)'), true);
	});
});
