import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Copy, Create } from 'xyzw/dist/vector3';
import { cssFormat, cssPrecision } from '../source/parse';
import {
	CssRgb,
	Hex24,
	Uint24,
	chroma,
	cssRgb,
	hSi,
	hSl,
	hSv,
	hex24,
	hsI,
	hsL,
	hsV,
	hue,
	luma,
	toCss,
	toHex24,
	toUint24,
	uint24
} from '../source/rgb';
import { assertEquals, assertEqualsVec3 } from './assert/assert';
import { createColorSpace } from './mock/colorSpace';


describe('chroma', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the chromacity of an rgb64', () => {
		assertEquals(chroma({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(chroma({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(chroma({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(chroma({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(chroma({ x : 0.5, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(chroma({ x : 1.0, y : 1.0, z : 1.0 }), 0.0, e);
		assertEquals(chroma({ x : 1.0, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(chroma({ x : 1.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(chroma({ x : 0.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(chroma({ x : 0.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(chroma({ x : 0.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(chroma({ x : 1.0, 	y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(chroma({ x : 0.5, y : 0.75, z : 0.75 }), 0.25, e);
		assertEquals(chroma({ x : 0.5, y : 0.5, z : 0.75 }), 0.25, e);
		assertEquals(chroma({ x : 0.75, y : 0.5, z : 0.75 }), 0.25, e);
		assertEquals(chroma({ x : 0.75, y : 0.5, z : 0.5 }), 0.25, e);
		assertEquals(chroma({ x : 0.75, y : 0.75, z : 0.5 }), 0.25, e);
		assertEquals(chroma({ x : 0.5, y : 0.75, z : 0.5 }), 0.25, e);
	});
});

describe('hue', () => {
	const e = 1e-10;
	const nan = Number.NaN;
	const turn = Math.PI * 2.0;

	it('should return the hue of an rgb64', () => {
		assertEquals(hue({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hue({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hue({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hue({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hue({ x : 0.5, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(hue({ x : 1.0, y : 1.0, z : 1.0 }), 0.0, e);
		assertEquals(hue({ x : 1.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hue({ x : 1.0, y : 1.0, z : 0.0 }), turn / 6.0, e);
		assertEquals(hue({ x : 0.0, y : 1.0, z : 0.0 }), turn * 2.0 / 6.0, e);
		assertEquals(hue({ x : 0.0, y : 1.0, z : 1.0 }), turn * 3.0 / 6.0, e);
		assertEquals(hue({ x : 0.0, y : 0.0, z : 1.0 }), turn * 4.0 / 6.0, e);
		assertEquals(hue({ x : 1.0, y : 0.0, z : 1.0 }), turn * 5.0 / 6.0, e);
		assertEquals(hue({ x : 0.75, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(hue({ x : 0.75, y : 0.75, z : 0.5 }), turn / 6.0, e);
		assertEquals(hue({ x : 0.5, y : 0.75, z : 0.5 }), turn * 2.0 / 6.0, e);
		assertEquals(hue({ x : 0.5, y : 0.75, z : 0.75 }), turn * 3.0 / 6.0, e);
		assertEquals(hue({ x : 0.5, y : 0.5, z : 0.75 }), turn * 4.0 / 6.0, e);
		assertEquals(hue({ x : 0.75, y : 0.5, z : 0.75 }), turn * 5.0 / 6.0, e);
	});
});

describe('hSl', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the hsl saturation of an rgb64', () => {
		assertEquals(hSl({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hSl({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hSl({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hSl({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hSl({ x : 0.5, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(hSl({ x : 1.0, y : 1.0, z : 1.0 }), 0.0, e);
		assertEquals(hSl({ x : 1.0, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSl({ x : 1.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSl({ x : 0.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSl({ x : 0.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(hSl({ x : 0.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSl({ x : 1.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSl({ x : 1.0, y : 0.5, z : 0.5 }), 1.0, e);
		assertEquals(hSl({ x : 0.75, y : 0.25, z : 0.25 }), 0.5, e);
		assertEquals(hSl({ x : 0.5, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSl({ x : 1.0, y : 0.75, z : 0.75 }), 1.0, e);
		assertEquals(hSl({ x : 0.75, y : 0.5, z : 0.5 }), 1.0 / 3.0, e);
		assertEquals(hSl({ x : 0.5, y : 0.25, z : 0.25 }), 1.0 / 3.0, e);
	});
});

describe('hSv', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the hsv saturation of an rgb64', () => {
		assertEquals(hSv({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hSv({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hSv({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hSv({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hSv({ x : 0.5, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(hSv({ x : 1.0, y : 1.0, z : 1.0 }), 0.0, e);
		assertEquals(hSv({ x : 1.0, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSv({ x : 1.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSv({ x : 0.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSv({ x : 0.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(hSv({ x : 0.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSv({ x : 1.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSv({ x : 1.0, y : 0.5, z : 0.5 }), 0.5, e);
		assertEquals(hSv({ x : 0.75, y : 0.25, z : 0.25 }), 2.0 / 3.0, e);
		assertEquals(hSv({ x : 0.5, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSv({ x : 1.0, y : 0.75, z : 0.75 }), 1.0 / 4.0, e);
		assertEquals(hSv({ x : 0.75, y : 0.5, z : 0.5 }), 1.0 / 3.0, e);
		assertEquals(hSv({ x : 0.5, y : 0.25, z : 0.25 }), 1.0 / 2.0, e);
	});
});

describe('hSi', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the hsi intensity of an rgb64', () => {
		assertEquals(hSi({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hSi({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hSi({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hSi({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hSi({ x : 0.5, y : 0.5, z : 0.5 }), 0.0, e);
		assertEquals(hSi({ x : 1.0, y : 1.0, z : 1.0 }), 0.0, e);
		assertEquals(hSi({ x : 1.0, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSi({ x : 1.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSi({ x : 0.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hSi({ x : 0.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(hSi({ x : 0.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSi({ x : 1.0, y : 0.0, z : 1.0 }), 1.0, e);
		assertEquals(hSi({ x : 1.0, y : 0.5, z : 0.5 }), 0.25, e);
		assertEquals(hSi({ x : 0.75, y : 0.25, z : 0.25 }), 0.4, e);
		assertEquals(hSi({ x : 0.5, y : 0.0, z : 0.0 }), 1.0, e);
		assertEquals(hSi({ x : 1.0, y : 0.75, z : 0.75 }), 0.1, e);
		assertEquals(hSi({ x : 0.75, y : 0.5, z : 0.5 }), 1.0 / 7.0, e);
		assertEquals(hSi({ x : 0.5, y : 0.25, z : 0.25 }), 0.25, e);
	});
});

describe('hsL', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the hsl lightness of an rgb64', () => {
		assertEquals(hsL({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hsL({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hsL({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hsL({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hsL({ x : 0.5, y : 0.5, z : 0.5 }), 0.5, e);
		assertEquals(hsL({ x : 1.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(hsL({ x : 1.0, y : 1.0, z : 0.0 }), 0.5, e);
		assertEquals(hsL({ x : 0.5, y : 0.3, z : 0.3 }), 0.4, e);
	});
});

describe('hsV', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return hsv value of an rgb64', () => {
		assertEquals(hsV({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hsV({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hsV({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hsV({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hsV({ x : 0.5, y : 0.5, z : 0.5 }), 0.5, e);
		assertEquals(hsV({ x : 1.0, y : 1.0, z : 0.0 }), 1.0, e);
		assertEquals(hsV({ x : 0.5, y : 0.3, z : 0.3 }), 0.5, e);
	});
});

describe('hsI', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the hsi intensity of an rgb64', () => {
		assertEquals(hsI({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(hsI({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(hsI({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(hsI({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(hsI({ x : 0.5, y : 0.5, z : 0.5 }), 0.5, e);
		assertEquals(hsI({ x : 1.0, y : 1.0, z : 0.0 }), 2.0 / 3.0, e);
		assertEquals(hsI({ x : 0.5, y : 0.3, z : 0.3 }), 1.1 / 3.0, e);
	});
});

describe('luma', () => {
	const e = 1e-10;
	const nan = Number.NaN;

	it('should return the luma of an rgba64 in Y709 colorspace', () => {
		assertEquals(luma({ x : nan, y : 0.0, z : 0.0 }), nan, e);
		assertEquals(luma({ x : 0.0, y : nan, z : 0.0 }), nan, e);
		assertEquals(luma({ x : 0.0, y : 0.0, z : nan }), nan, e);
		assertEquals(luma({ x : 1.0, y : 1.0, z : 1.0 }), 1.0, e);
		assertEquals(luma({ x : 0.5, y : 0.5, z : 0.5 }), 0.5, e);
		assertEquals(luma({ x : 0.0, y : 0.0, z : 0.0 }), 0.0, e);
		assertEquals(luma({ x : 1.0, y : 1.0, z : 0.0 }), 1.0 * 0.2126 + 1.0 * 0.7152 + 0.0 * 0.0722, e);
		assertEquals(luma({ x : 0.5, y : 0.3, z : 0.3 }), 0.5 * 0.2126 + 0.3 * 0.7152 + 0.3 * 0.0722, e);
	});

	it('should return the luma of an rgba64 in an arbitrary colorspace', () => {
		const y601 = { x : 0.2989, y : 0.5870, z : 0.1140 };

		assertEquals(luma({ x : 0.0, y : 0.0, z : 0.0 }, { x : nan, y : 0.5, z : 0.5 }), nan, e);
		assertEquals(luma({ x : 0.0, y : 0.0, z : 0.0 }, { x : 0.5, y : nan, z : 0.5 }), nan, e);
		assertEquals(luma({ x : 0.0, y : 0.0, z : 0.0 }, { x : 0.5, y : 0.5, z : nan }), nan, e);
		assertEquals(luma({ x : 0.0, y : 0.0, z : 0.0 }, y601), 0.0, e);
		assertEquals(luma({ x : 0.5, y : 0.5, z : 0.5 }, y601), 0.49995, e);
		assertEquals(luma({ x : 1.0, y : 1.0, z : 1.0 }, y601), 0.9999, e);
		assertEquals(luma({ x : 1.0, y : 1.0, z : 0.0 }, y601), y601.x + y601.y, e);
		assertEquals(luma({ x : 0.5, y : 0.3, z : 0.3 }, y601), 0.5 * y601.x + 0.3 * y601.y + 0.3 * y601.z, e);
	});
});

describe('Hex24', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a hex color', () => {
		assert.deepStrictEqual(Hex24('#000000'), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Hex24('#ffffff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(Hex24('#fff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(Hex24('ffffff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(Hex24('fff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(Hex24('#08f'), { x : 0.0, y : 0x88 / 0xff, z : 1.0 });
	});

	it('should throw for invalid color strings', () => {
		assert.throws(() => Hex24('foo'), new Error("bad hex 'foo'"));
		assert.throws(() => Hex24('#0'), new Error("bad hex '#0'"));
		assert.throws(() => Hex24('0'), new Error("bad hex '0'"));
		assert.throws(() => Hex24('#00'), new Error("bad hex '#00'"));
		assert.throws(() => Hex24('00'), new Error("bad hex '00'"));
		assert.throws(() => Hex24('#0000'), new Error("bad hex '#0000'"));
		assert.throws(() => Hex24('0000'), new Error("bad hex '0000'"));
		assert.throws(() => Hex24('#00000'), new Error("bad hex '#00000'"));
		assert.throws(() => Hex24('00000'), new Error("bad hex '00000'"));
		assert.throws(() => Hex24('#0000000'), new Error("bad hex '#0000000'"));
		assert.throws(() => Hex24('0000000'), new Error("bad hex '0000000'"));
		assert.throws(() => Hex24('#abcdeg'), new Error("bad hex '#abcdeg'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec3(Hex24('#6699ff', cs), { x : 0.8, y : 1.2, z : 2.0 }, e);
	});
});

describe('hex24', () => {
	const e = 1e-10;

	it('should assign a Vector3 to represent a hex color', () => {
		const v = Create();

		assert.deepStrictEqual(hex24(v, '#000000'), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(hex24(v, '#ffffff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(hex24(v, '#fff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(hex24(v, 'ffffff'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(hex24(v, 'fff'), { x : 1.0, y : 1.0, z : 1.0 });

		const r = hex24(v, '#08f');

		assert.deepStrictEqual(r, { x : 0.0, y : 0x88 / 0xff, z : 1.0 });
		assert.strictEqual(v, r);
	});

	it('should throw for invalid color strings', () => {
		const v = Create(1.0, 2.0, 3.0);
		const w = Copy(v);

		assert.throws(() => hex24(v, 'foo'), new Error("bad hex 'foo'"));
		assert.deepStrictEqual(v, w);

		assert.throws(() => hex24(v, '#0'), new Error("bad hex '#0'"));
		assert.throws(() => hex24(v, '0'), new Error("bad hex '0'"));
		assert.throws(() => hex24(v, '#00'), new Error("bad hex '#00'"));
		assert.throws(() => hex24(v, '00'), new Error("bad hex '00'"));
		assert.throws(() => hex24(v, '#0000'), new Error("bad hex '#0000'"));
		assert.throws(() => hex24(v, '0000'), new Error("bad hex '0000'"));
		assert.throws(() => hex24(v, '#00000'), new Error("bad hex '#00000'"));
		assert.throws(() => hex24(v, '00000'), new Error("bad hex '00000'"));
		assert.throws(() => hex24(v, '#0000000'), new Error("bad hex '#0000000'"));
		assert.throws(() => hex24(v, '0000000'), new Error("bad hex '0000000'"));
		assert.throws(() => hex24(v, '#abcdeg'), new Error("bad hex '#abcdeg'"));
	});

	it('should apply color conversions', () => {
		const v = Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(hex24(v, '#6699ff', cs), { x : 0.8, y : 1.2, z : 2.0 }, e);
	});
});

describe('toHex24', () => {
	it('should return return a hex color string', () => {
		assert.strictEqual(toHex24(Create()), '#000');
		assert.strictEqual(toHex24(Create(1.0, 1.0, 1.0)), '#fff');
		assert.strictEqual(toHex24(Create(0.0, 0x88 / 0xff, 1.0)), '#08f');
		assert.strictEqual(toHex24(Create(0.0, 0x87 / 0xff, 1.0)), '#0087ff');
		assert.strictEqual(toHex24(Create(-1.0, -0.1, -0.01)), '#000');
		assert.strictEqual(toHex24(Create(2.0, 1.1, 1.01)), '#fff');
		assert.strictEqual(toHex24(Create(0.123, 0.50, 0.987)), '#1f80fc');
		assert.strictEqual(toHex24(Create(), undefined, { short : true }), '#000');
		assert.strictEqual(toHex24(Create(), undefined, { short : false }), '#000000');
		assert.strictEqual(toHex24(Create(), undefined, { hash : true }), '#000');
		assert.strictEqual(toHex24(Create(), undefined, { hash : false }), '000');
		assert.strictEqual(toHex24(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff)), '#abcdef');
		assert.strictEqual(toHex24(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff), undefined, { uppercase : true }), '#ABCDEF');
		assert.strictEqual(toHex24(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff), undefined, { uppercase : false }), '#abcdef');
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toHex24(Create(Number.NaN)), new Error('bad color [NaN,0,0]'));
		assert.throws(() => toHex24(Create(0.0, Number.NaN)), new Error('bad color [0,NaN,0]'));
		assert.throws(() => toHex24(Create(0.0, 0.0, Number.NaN)), new Error('bad color [0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(toHex24(Create(2.0, 1.2, 0.8), cs), '#f96');
	});
});

describe('Uint24', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a uint24 color', () => {
		assert.deepStrictEqual(Uint24(0x0), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Uint24(0xffffff), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(Uint24(Number.NaN), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Uint24(Number.POSITIVE_INFINITY), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Uint24(Number.NEGATIVE_INFINITY), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Uint24(0x0088ff), { x : 0.0, y : 0x88 / 0xff, z : 1.0 });
		assert.deepStrictEqual(Uint24(0x1000000), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(Uint24(-1), { x : 1.0, y : 1.0, z : 1.0 });
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec3(Uint24(0x6699ff, cs), { x : 0.8, y : 1.2, z : 2.0 }, e);
	});
});

describe('uint24', () => {
	const e = 1e-10;

	it('should assign a Vector3 to represent a hex color', () => {
		const v = Create();

		assert.deepStrictEqual(uint24(v, 0x0), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(uint24(v, 0xffffff), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(uint24(v, Number.NaN), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(uint24(v, Number.POSITIVE_INFINITY), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(uint24(v, Number.NEGATIVE_INFINITY), { x : 0.0, y : 0.0, z : 0.0 });

		const r = uint24(v, 0x0088ff);

		assert.deepStrictEqual(r, { x : 0.0, y : 0x88 / 0xff, z : 1.0 });
		assert.deepStrictEqual(v, r);

		assert.deepStrictEqual(uint24(v, 0x1000000), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(uint24(v, -1), { x : 1.0, y : 1.0, z : 1.0 });
	});

	it('should apply color conversions', () => {
		const v = Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(uint24(v, 0x6699ff, cs), { x : 0.8, y : 1.2, z : 2.0 }, e);
	});
});

describe('toUint24', () => {
	it('should return return a color uint24', () => {
		assert.strictEqual(toUint24(Create()), 0x000000);
		assert.strictEqual(toUint24(Create(Number.NaN, 1.0, 1.0)), 0x00ffff);
		assert.strictEqual(toUint24(Create(1.0, Number.NaN, 1.0)), 0xff00ff);
		assert.strictEqual(toUint24(Create(1.0, 1.0, Number.NaN)), 0xffff00);
		assert.strictEqual(toUint24(Create(1.0, 1.0, 1.0)), 0xffffff);
		assert.strictEqual(toUint24(Create(0.0, 0x88 / 0xff, 1.0)), 0x0088ff);
		assert.strictEqual(toUint24(Create(-1.0, -0.1, -0.01)), 0x000000);
		assert.strictEqual(toUint24(Create(2.0, 1.1, 1.01)), 0xffffff);
		assert.strictEqual(toUint24(Create(0.123, 0.50, 0.987)), 0x1f80fc);
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(toUint24(Create(2.0, 1.2, 0.8), cs), 0xff9966);
	});
});

describe('CssRgb', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a css rgb() color', () => {
		assert.deepStrictEqual(CssRgb('rgb(0,0,0)'), { x : 0.0, y : 0.0, z : 0.0 });
		assert.deepStrictEqual(CssRgb('rgb(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(CssRgb('rgb( 255 , 255 , 255 )'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(CssRgb('rgb(0,128,255)'), { x : 0.0, y : 0x80 / 0xff, z : 1.0 });
		assert.deepStrictEqual(CssRgb('rgb(0%,50%,100%)'), { x : 0.0, y : 0x7f / 0xff, z : 1.0 });
	});

	it('should throw for invalid rgb() strings', () => {
		assert.throws(() => CssRgb('rgb(foo)'), new Error("bad css color 'rgb(foo)'"));
		assert.throws(() => CssRgb('rgb(a,b,c)'), new Error("bad css color 'rgb(a,b,c)'"));
		assert.throws(() => CssRgb('rgb(-1,0,0)'), new Error("bad css color 'rgb(-1,0,0)'"));
		assert.throws(() => CssRgb('rgb(0,-1,0)'), new Error("bad css color 'rgb(0,-1,0)'"));
		assert.throws(() => CssRgb('rgb(0,0,-1)'), new Error("bad css color 'rgb(0,0,-1)'"));
		assert.throws(() => CssRgb('rgb(256,0,0)'), new Error("bad css color 'rgb(256,0,0)'"));
		assert.throws(() => CssRgb('rgb(0,256,0)'), new Error("bad css color 'rgb(0,256,0)'"));
		assert.throws(() => CssRgb('rgb(0,0,256)'), new Error("bad css color 'rgb(0,0,256)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec3(CssRgb('rgb(255,153,102)', cs), { x : 2.0, y : 1.2, z : 0.8 }, e);
	});
});

describe('cssRgb', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a css rgb() color', () => {
		const v = Create();

		const r = cssRgb(v, 'rgb(0,0,0)');

		assert.deepStrictEqual(r, { x : 0.0, y : 0.0, z : 0.0 });
		assert.strictEqual(v, r);

		assert.deepStrictEqual(cssRgb(v, 'rgb(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(cssRgb(v, 'rgb( 255 , 255 , 255 )'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(cssRgb(v, 'rgb(0,128,255)'), { x : 0.0, y : 0x80 / 0xff, z : 1.0 });
		assert.deepStrictEqual(cssRgb(v, 'rgb(0%,50%,100%)'), { x : 0.0, y : 0x7f / 0xff, z : 1.0 });
	});

	it('should throw for invalid rgb() strings', () => {
		const v = Create(1.0, 2.0, 3.0);
		const w = Copy(v);

		assert.throws(() => cssRgb(v, 'rgb(foo)'), new Error("bad css color 'rgb(foo)'"));
		assert.deepStrictEqual(v, w);

		assert.throws(() => cssRgb(v, 'rgb(a,b,c)'), new Error("bad css color 'rgb(a,b,c)'"));
		assert.throws(() => cssRgb(v, 'rgb(-1,0,0)'), new Error("bad css color 'rgb(-1,0,0)'"));
		assert.throws(() => cssRgb(v, 'rgb(0,-1,0)'), new Error("bad css color 'rgb(0,-1,0)'"));
		assert.throws(() => cssRgb(v, 'rgb(0,0,-1)'), new Error("bad css color 'rgb(0,0,-1)'"));
		assert.throws(() => cssRgb(v, 'rgb(256,0,0)'), new Error("bad css color 'rgb(256,0,0)'"));
		assert.throws(() => cssRgb(v, 'rgb(0,256,0)'), new Error("bad css color 'rgb(0,256,0)'"));
		assert.throws(() => cssRgb(v, 'rgb(0,0,256)'), new Error("bad css color 'rgb(0,0,256)'"));
	});

	it('should apply color conversions', () => {
		const v = Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(cssRgb(v, 'rgb(255,153,102)', cs), { x : 2.0, y : 1.2, z : 0.8 }, e);
	});
});

describe('toCss', () => {
	it('should return a css rgb() string', () => {
		assert.strictEqual(toCss(Create()), 'rgb(0,0,0)');
		assert.strictEqual(toCss(Create(1.0, 1.0, 1.0)), 'rgb(255,255,255)');
		assert.strictEqual(toCss(Create(0.0, 0.5, 1.0)), 'rgb(0,128,255)');
		assert.strictEqual(toCss(Create(-1.0, -0.1, -0.01)), 'rgb(0,0,0)');
		assert.strictEqual(toCss(Create(2.0, 1.1, 1.01)), 'rgb(255,255,255)');
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, { precision : cssPrecision.uint8 }),
			'rgb(31,128,80)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, { precision : cssPrecision.float64 }),
			'rgb(31.365,127.5,80.111)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				decimals : 1
			}),
			'rgb(31.4,127.5,80.1)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				precision : cssPrecision.float64,
				decimals : 2
			}),
			'rgb(31.36,127.5,80.11)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, { format : cssFormat.css4 }),
			'rgb(31 128 80)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, { percent : true }),
			'rgb(12.2%,50.2%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				percent : true,
				decimals : 0
			}),
			'rgb(12%,50%,31%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64
			}),
			'rgb(12.3%,50%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64,
				decimals : 1
			}),
			'rgb(12.3%,50%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64,
				decimals : 4
			}),
			'rgb(12.3%,50%,31.4159%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, Math.PI * 0.1), undefined, {
				percent : true,
				format : cssFormat.css4
			}),
			'rgb(12.2% 50.2% 31.4%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toCss(Create(Number.NaN)), new Error('bad rgb64 [NaN,0,0]'));
		assert.throws(() => toCss(Create(0.0, Number.NaN)), new Error('bad rgb64 [0,NaN,0]'));
		assert.throws(() => toCss(Create(0.0, 0.0, Number.NaN)), new Error('bad rgb64 [0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(toCss(Create(2.0, 1.2, 0.8), cs), 'rgb(255,153,102)');
	});
});
