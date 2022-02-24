import * as assert from 'assert';
import { describe, it } from 'mocha';
import { Copy, Create } from 'xyzw/dist/vector4';
import {
	CssRgba,
	Hex32,
	cssRgba,
	hex32,
	toCss, toHex32
} from '../source/rgba';
import { cssFormat, cssPrecision } from '../source';
import { assertEqualsVec4 } from './assert/assert';
import { createColorSpace } from './mock/colorSpace';


describe('Hex32', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a hex color', () => {
		assert.deepStrictEqual(Hex32('#00000000'), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });
		assert.deepStrictEqual(Hex32('#ffffffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(Hex32('#ffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(Hex32('ffffffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(Hex32('ffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(Hex32('#08f3'), { x : 0.0, y : 0x88 / 0xff, z : 1.0, w : 0x33 / 0xff });
	});

	it('should throw for invalid color strings', () => {
		assert.throws(() => Hex32('foo'), new Error("bad hex 'foo'"));
		assert.throws(() => Hex32('#0'), new Error("bad hex '#0'"));
		assert.throws(() => Hex32('0'), new Error("bad hex '0'"));
		assert.throws(() => Hex32('#01'), new Error("bad hex '#01'"));
		assert.throws(() => Hex32('01'), new Error("bad hex '01'"));
		assert.throws(() => Hex32('#012'), new Error("bad hex '#012'"));
		assert.throws(() => Hex32('012'), new Error("bad hex '012'"));
		assert.throws(() => Hex32('#01234'), new Error("bad hex '#01234'"));
		assert.throws(() => Hex32('01234'), new Error("bad hex '01234'"));
		assert.throws(() => Hex32('#012345'), new Error("bad hex '#012345'"));
		assert.throws(() => Hex32('012345'), new Error("bad hex '012345'"));
		assert.throws(() => Hex32('#0123456'), new Error("bad hex '#0123456'"));
		assert.throws(() => Hex32('0123456'), new Error("bad hex '0123456'"));
		assert.throws(() => Hex32('#012345678'), new Error("bad hex '#012345678'"));
		assert.throws(() => Hex32('012345678'), new Error("bad hex '012345678'"));
		assert.throws(() => Hex32('#abcdefgh'), new Error("bad hex '#abcdefgh'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec4(Hex32('#6699ff33', cs), { x : 0.8, y : 1.2, z : 2.0, w : 0.2 }, e);
	});
});

describe('hex32', () => {
	const e = 1e-10;

	it('should assign a Vector3 to represent a hex color', () => {
		const v = Create();

		assert.deepStrictEqual(hex32(v, '#00000000'), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });
		assert.deepStrictEqual(hex32(v, '#ffffffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(hex32(v, '#ffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(hex32(v, 'ffffffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(hex32(v, 'ffff'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });

		const r = hex32(v, '#08f3');

		assert.deepStrictEqual(r, { x : 0.0, y : 0x88 / 0xff, z : 1.0, w : 0x33 / 0xff });
		assert.strictEqual(v, r);
	});

	it('should throw for invalid color strings', () => {
		const v = Create();
		const w = Copy(v);

		assert.throws(() => hex32(v, 'foo'), new Error("bad hex 'foo'"));
		assert.deepStrictEqual(v, w);

		assert.throws(() => hex32(v, '#0'), new Error("bad hex '#0'"));
		assert.throws(() => hex32(v, '0'), new Error("bad hex '0'"));
		assert.throws(() => hex32(v, '#01'), new Error("bad hex '#01'"));
		assert.throws(() => hex32(v, '01'), new Error("bad hex '01'"));
		assert.throws(() => hex32(v, '#012'), new Error("bad hex '#012'"));
		assert.throws(() => hex32(v, '012'), new Error("bad hex '012'"));
		assert.throws(() => hex32(v, '#01234'), new Error("bad hex '#01234'"));
		assert.throws(() => hex32(v, '01234'), new Error("bad hex '01234'"));
		assert.throws(() => hex32(v, '#012345'), new Error("bad hex '#012345'"));
		assert.throws(() => hex32(v, '012345'), new Error("bad hex '012345'"));
		assert.throws(() => hex32(v, '#0123456'), new Error("bad hex '#0123456'"));
		assert.throws(() => hex32(v, '0123456'), new Error("bad hex '0123456'"));
		assert.throws(() => hex32(v, '#012345678'), new Error("bad hex '#012345678'"));
		assert.throws(() => hex32(v, '012345678'), new Error("bad hex '012345678'"));
		assert.throws(() => hex32(v, '#abcdefgh'), new Error("bad hex '#abcdefgh'"));
	});

	it('should apply color conversions', () => {
		const v = Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec4(hex32(v, '#6699ff33', cs), { x : 0.8, y : 1.2, z : 2.0, w : 0.2 }, e);
	});
});

describe('toHex32', () => {
	it('should return return a hex color string', () => {
		assert.strictEqual(toHex32(Create()), '#000f');
		assert.strictEqual(toHex32(Create(1.0, 1.0, 1.0, 0.0)), '#fff0');
		assert.strictEqual(toHex32(Create(0.0, 0x88 / 0xff, 1.0, 0x33 / 0xff)), '#08f3');
		assert.strictEqual(toHex32(Create(0.0, 0x87 / 0xff, 1.0, 0x33 / 0xff)), '#0087ff33');
		assert.strictEqual(toHex32(Create(-1.0, -0.1, -0.01, -0.001)), '#0000');
		assert.strictEqual(toHex32(Create(2.0, 1.1, 1.01, 1.001)), '#ffff');
		assert.strictEqual(toHex32(Create(0.123, 0.50, 0.987, Math.PI * 0.1)), '#1f80fc50');
		assert.strictEqual(toHex32(Create(), undefined, { short : true }), '#000f');
		assert.strictEqual(toHex32(Create(), undefined, { short : false }), '#000000ff');
		assert.strictEqual(toHex32(Create(), undefined, { hash : true }), '#000f');
		assert.strictEqual(toHex32(Create(), undefined, { hash : false }), '000f');
		assert.strictEqual(
			toHex32(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff, 0x0f / 0xff)),
			'#abcdef0f'
		);
		assert.strictEqual(
			toHex32(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff, 0x0f / 0xff), undefined, { uppercase : true }),
			'#ABCDEF0F'
		);
		assert.strictEqual(
			toHex32(Create(0xab / 0xff, 0xcd / 0xff, 0xef / 0xff, 0x0f / 0xff), undefined, { uppercase : false }),
			'#abcdef0f'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toHex32(Create(Number.NaN)), new Error('bad rgba64 [NaN,0,0,1]'));
		assert.throws(() => toHex32(Create(0.0, Number.NaN)), new Error('bad rgba64 [0,NaN,0,1]'));
		assert.throws(() => toHex32(Create(0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,NaN,1]'));
		assert.throws(() => toHex32(Create(0.0, 0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(toHex32(Create(2.0, 1.2, 0.8, 0.2), cs), '#f963');
	});
});

describe('CssRgba', () => {
	const e = 1e-10;

	it('should return a vector4 representing a css rgba() color', () => {
		assert.deepStrictEqual(CssRgba('rgba(0,0,0,0)'), { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });
		assert.deepStrictEqual(CssRgba('rgb(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(CssRgba('rgba(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(CssRgba('rgba( 255 , 255 , 255 )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(CssRgba('rgba(255 255 255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(CssRgba('rgba( 255   255   255 )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(CssRgba('rgb(255,255,255,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba(255,255,255,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba( 255 , 255 , 255 , 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba(255 255 255/0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba( 255   255   255  /  0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba(0,128,255,0.5)'), { x : 0.0, y : 0x80 / 0xff, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(CssRgba('rgba(0%,50%,100%,75%)'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
		assert.deepStrictEqual(CssRgba('rgba( 0%   50%   100%  /  75% )'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
		assert.deepStrictEqual(CssRgba('rgba( 0   50%   255  /  0.75 )'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
	});

	it('should throw for invalid css rgba() strings', () => {
		assert.throws(() => CssRgba('rgba(foo)'), new Error("bad css color 'rgba(foo)'"));
		assert.throws(() => CssRgba('rgba(a,b,c,d)'), new Error("bad css color 'rgba(a,b,c,d)'"));
		assert.throws(() => CssRgba('rgba(-1,0,0,0)'), new Error("bad css color 'rgba(-1,0,0,0)'"));
		assert.throws(() => CssRgba('rgba(0,-1,0,0)'), new Error("bad css color 'rgba(0,-1,0,0)'"));
		assert.throws(() => CssRgba('rgba(0,0,-1,0)'), new Error("bad css color 'rgba(0,0,-1,0)'"));
		assert.throws(() => CssRgba('rgba(0,0,0,-1)'), new Error("bad css color 'rgba(0,0,0,-1)'"));
		assert.throws(() => CssRgba('rgba(256,0,0,0)'), new Error("bad css color 'rgba(256,0,0,0)'"));
		assert.throws(() => CssRgba('rgba(0,256,0,0)'), new Error("bad css color 'rgba(0,256,0,0)'"));
		assert.throws(() => CssRgba('rgba(0,0,256,0)'), new Error("bad css color 'rgba(0,0,256,0)'"));
		assert.throws(() => CssRgba('rgba(0,0,0,1.1)'), new Error("bad css color 'rgba(0,0,0,1.1)'"));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec4(CssRgba('rgba(255,153,102,0.2)', cs), { x : 2.0, y : 1.2, z : 0.8, w : 0.2 }, e);
	});
});

describe('cssRgba', () => {
	const e = 1e-10;

	it('should assign a vector4 to represent a css rgba() color', () => {
		const v = Create();

		const r = cssRgba(v, 'rgba(0,0,0,0)');

		assert.deepStrictEqual(r, { x : 0.0, y : 0.0, z : 0.0, w : 0.0 });
		assert.strictEqual(v, r);

		assert.deepStrictEqual(cssRgba(v, 'rgb(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(255,255,255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 255 , 255 , 255 )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(255 255 255)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 255   255   255 )'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(cssRgba(v, 'rgb(255,255,255,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(255,255,255,0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 255 , 255 , 255 , 0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(255 255 255/0.5)'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 255   255   255  /  0.5 )'), { x : 1.0, y : 1.0, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(0,128,255,0.5)'), { x : 0.0, y : 0x80 / 0xff, z : 1.0, w : 0.5 });
		assert.deepStrictEqual(cssRgba(v, 'rgba(0%,50%,100%,75%)'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 0%   50%   100%  /  75% )'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
		assert.deepStrictEqual(cssRgba(v, 'rgba( 0   50%   255  /  0.75 )'), { x : 0.0, y : 0x7f / 0xff, z : 1.0, w : 0.75 });
	});

	it('should throw for invalid css rgba() strings', () => {
		const v = Create(1.0, 2.0, 3.0, 4.0);
		const w = Copy(v);

		assert.throws(() => cssRgba(v, 'rgba(foo)'), new Error("bad css color 'rgba(foo)'"));
		assert.deepStrictEqual(v, w);

		assert.throws(() => cssRgba(v, 'rgba(a,b,c,d)'), new Error("bad css color 'rgba(a,b,c,d)'"));
		assert.throws(() => cssRgba(v, 'rgba(-1,0,0,0)'), new Error("bad css color 'rgba(-1,0,0,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,-1,0,0)'), new Error("bad css color 'rgba(0,-1,0,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,0,-1,0)'), new Error("bad css color 'rgba(0,0,-1,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,0,0,-1)'), new Error("bad css color 'rgba(0,0,0,-1)'"));
		assert.throws(() => cssRgba(v, 'rgba(256,0,0,0)'), new Error("bad css color 'rgba(256,0,0,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,256,0,0)'), new Error("bad css color 'rgba(0,256,0,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,0,256,0)'), new Error("bad css color 'rgba(0,0,256,0)'"));
		assert.throws(() => cssRgba(v, 'rgba(0,0,0,1.1)'), new Error("bad css color 'rgba(0,0,0,1.1)'"));
	});

	it('should apply color conversions', () => {
		const v = Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec4(cssRgba(v, 'rgba(255,153,102,0.2)', cs), { x : 2.0, y : 1.2, z : 0.8, w : 0.2 }, e);
	});
});

describe('toCss', () => {
	it('should return a css rgba() string', () => {
		assert.strictEqual(toCss(Create()), 'rgb(0,0,0)');
		assert.strictEqual(toCss(Create(1.0, 1.0, 1.0, 0.0)), 'rgba(255,255,255,0)');
		assert.strictEqual(toCss(Create(0.0, 0.5, 1.0, 0.5)), 'rgba(0,128,255,0.502)');
		assert.strictEqual(toCss(Create(-1.0, -0.1, -0.01, -0.01)), 'rgba(0,0,0,0)');
		assert.strictEqual(toCss(Create(2.0, 1.1, 1.01, 1.001)), 'rgb(255,255,255)');
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { precision : cssPrecision.uint8 }),
			'rgba(31,128,252,0.314)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { precision : cssPrecision.float64 }),
			'rgba(31.365,127.5,251.685,0.314)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { decimals : 1 }),
			'rgba(31,128,252,0.3)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { decimals : 2 }),
			'rgba(31,128,252,0.31)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { format : cssFormat.css4 }),
			'rgb(31 128 252/0.314)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, { percent : true }),
			'rgba(12.2%,50.2%,98.8%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, {
				percent : true,
				decimals : 0
			}),
			'rgba(12%,50%,99%,31%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64
			}),
			'rgba(12.3%,50%,98.7%,31.416%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64,
				decimals : 1
			}),
			'rgba(12.3%,50%,98.7%,31.4%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, {
				percent : true,
				precision : cssPrecision.float64,
				decimals : 4
			}),
			'rgba(12.3%,50%,98.7%,31.4159%)'
		);
		assert.strictEqual(
			toCss(Create(0.123, 0.5, 0.987, Math.PI * 0.1), undefined, {
				percent : true,
				format : cssFormat.css4
			}),
			'rgb(12.2% 50.2% 98.8%/31.4%)'
		);
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => toCss(Create(Number.NaN)), new Error('bad rgba64 [NaN,0,0,1]'));
		assert.throws(() => toCss(Create(0.0, Number.NaN)), new Error('bad rgba64 [0,NaN,0,1]'));
		assert.throws(() => toCss(Create(0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,NaN,1]'));
		assert.throws(() => toCss(Create(0.0, 0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(toCss(Create(2.0, 1.2, 0.8, 0.2), cs), 'rgba(255,153,102,0.2)');
	});
});
