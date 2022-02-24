import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as vec3 from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import { cssFormat } from '../source/parse';
import { assignRgb, assignRgba, cssStringifyMode, fromRgb, fromRgba, toRgb, toRgba } from '../source/css';
import { assertEqualsVec3, assertEqualsVec4 } from './assert/assert';
import { createColorSpace } from './mock/colorSpace';


describe('fromRgb', () => {
	it('should convert a Vector3 color into a css color', () => {
		assert.strictEqual(fromRgb(vec3.Create()), 'rgb(0,0,0)');
		assert.strictEqual(fromRgb(vec3.Create(0.0, 0.0, 0.0), { format : cssFormat.css4 }), 'rgb(0 0 0)');
		assert.strictEqual(fromRgb(vec3.Create(1.0, 0.0, 0.0)), 'rgb(255,0,0)');
		assert.strictEqual(fromRgb(vec3.Create(1.0, 0.0, 0.0), { mode : cssStringifyMode.short }), '#f00');
		assert.strictEqual(fromRgb(vec3.Create(1.0, 0.0, 1.0 / 255.0), { mode : cssStringifyMode.short }), '#ff0001');
	});

	it('should return named color names', () => {
		const red = vec4.Create(1.0, 0.0, 0.0, 1.0);
		const blue = vec4.Create(0.0, 0.0, 1.0, 1.0);
		const black = vec4.Create(0.0, 0.0, 0.0, 1.0);

		assert.strictEqual(fromRgb(vec3.Create(1.0, 0.0, 0.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, blue, black }
		}), 'red');
		assert.strictEqual(fromRgb(vec3.Create(0.0, 0.0, 1.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, blue, black }
		}), '#00f');
		assert.strictEqual(fromRgb(vec3.Create(0.0, 0.0, 0.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, blue, black }
		}), '#000');
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => fromRgb(vec3.Create(Number.NaN)), new Error('bad rgb64 [NaN,0,0]'));
		assert.throws(() => fromRgb(vec3.Create(0.0, Number.NaN)), new Error('bad rgb64 [0,NaN,0]'));
		assert.throws(() => fromRgb(vec3.Create(0.0, 0.0, Number.NaN)), new Error('bad rgb64 [0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			fromRgb(vec3.Create(2.0, 1.2, 0.8), { profile : cs }),
			'rgb(255,153,102)'
		);
	});
});

describe('fromRgba', () => {
	it('should convert a Vector4 color into a css color', () => {
		assert.strictEqual(fromRgba(vec4.Create()), 'rgb(0,0,0)');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 0.0, 1.0), { format : cssFormat.css4 }), 'rgb(0 0 0)');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 0.0, 0.5), { format : cssFormat.css2 }), 'rgba(0,0,0,0.502)');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 0.0, 0.5), { format : cssFormat.css4 }), 'rgb(0 0 0/0.502)');
		assert.strictEqual(fromRgba(vec4.Create(1.0, 0.0, 0.0, 1.0), { mode : cssStringifyMode.short }), '#f00');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 0.0, 0.4), { mode : cssStringifyMode.short }), 'rgba(0,0,0,0.4)');
		assert.strictEqual(fromRgba(vec4.Create(1.0, 1.0, 1.0, 0.4), { mode : cssStringifyMode.short }), 'hsla(0,0%,100%,0.4)');
	});

	it('should return named color names', () => {
		const red = vec4.Create(1.0);
		const redTransparent16 = vec4.Create(1.0, 0.0, 0.0, 0.5);
		const blue = vec4.Create(0.0, 0.0, 1.0);
		const blueTransparent19ch = vec4.Create(0.0, 0.0, 1.0, 0.5);
		const black = vec4.Create();
		const blackTransparent18 = vec4.Create(0.0, 0.0, 0.0, 0.5);
		const trn = vec4.Create(0.0, 0.0, 0.0, 0.0);

		assert.strictEqual(fromRgba(vec4.Create(1.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), 'red');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 1.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), '#00f');
		assert.strictEqual(fromRgba(vec4.Create(), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), '#000');
		assert.strictEqual(fromRgba(vec4.Create(1.0, 0.0, 0.0, 0.5), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), 'redTransparent16');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 1.0, 0.5), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), 'rgba(0,0,255,0.502)');
		assert.strictEqual(fromRgba(vec4.Create(0.0, 0.0, 0.0, 0.5), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), 'rgba(0,0,0,0.502)');
		assert.strictEqual(fromRgba(vec4.Create(1.0, 0.0, 0.0, 0.0), {
			mode : cssStringifyMode.short,
			namedColors : { red, redTransparent16, blue, blueTransparent19ch, black, blackTransparent18, trn }
		}), 'trn');
	});

	it('should throw for NaN color components', () => {
		assert.throws(() => fromRgba(vec4.Create(Number.NaN, 0.0, 0.0, 1.0)), new Error('bad rgb64 [NaN,0,0]'));
		assert.throws(() => fromRgba(vec4.Create(Number.NaN, 0.0, 0.0, 0.5)), new Error('bad rgba64 [NaN,0,0,0.5]'));
		assert.throws(() => fromRgba(vec4.Create(0.0, Number.NaN, 0.0, 1.0)), new Error('bad rgb64 [0,NaN,0]'));
		assert.throws(() => fromRgba(vec4.Create(0.0, Number.NaN, 0.0, 0.5)), new Error('bad rgba64 [0,NaN,0,0.5]'));
		assert.throws(() => fromRgba(vec4.Create(0.0, 0.0, Number.NaN, 1.0)), new Error('bad rgb64 [0,0,NaN]'));
		assert.throws(() => fromRgba(vec4.Create(0.0, 0.0, Number.NaN, 0.5)), new Error('bad rgba64 [0,0,NaN,0.5]'));
		assert.throws(() => fromRgba(vec4.Create(0.0, 0.0, 0.0, Number.NaN)), new Error('bad rgba64 [0,0,0,NaN]'));
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.strictEqual(
			fromRgba(vec4.Create(2.0, 1.2, 0.8, 0.2), { profile : cs }),
			'rgba(255,153,102,0.2)'
		);
	});
});

describe('toRgb', () => {
	const e = 1e-10;

	it('should return a Vector3 representing a css color', () => {
		assert.deepStrictEqual(toRgb('#FF6600'), { x : 1.0, y : 0.4, z : 0 });
		assert.deepStrictEqual(toRgb('rgb(255,102,0)'), { x : 1.0, y : 0.4, z : 0 });
		assert.deepStrictEqual(toRgb('hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(toRgb('rgba(255,102,0,0.5)'), { x : 1.0, y : 0.7, z : 0.5 });
		assert.deepStrictEqual(toRgb('rgb(255 102 0/0.5)'), { x : 1.0, y : 0.7, z : 0.5 });
		assert.deepStrictEqual(toRgb(
			'rgba(255,102,0,0.5)',
			{ matte : vec3.Create() }
		), { x : 0.5, y : 0.2, z : 0 });
		assert.deepStrictEqual(toRgb('hsla(60,100%,50%,0.5)'), { x : 1.0, y : 1.0, z : 0.5 });
		assert.deepStrictEqual(toRgb('hsl(60 100% 50%/0.5)'), { x : 1.0, y : 1.0, z : 0.5 });
		assert.deepStrictEqual(toRgb(
			'hsla(60,100%,50%,0.5)',
			{ matte : vec3.Create() }
		), { x : 0.5, y : 0.5, z : 0.0 });
	});

	it('should throw for non css color strings', () => {
		assert.throws(() => toRgb('foo'), new Error("not css color 'foo'"));
		assert.throws(() => toRgb('#00'), new Error("not css color '#00'"));
		assert.throws(() => toRgb('#0000'), new Error("not css color '#0000'"));
		assert.throws(() => toRgb('#00000'), new Error("not css color '#00000'"));
		assert.throws(() => toRgb('#0000000'), new Error("not css color '#0000000'"));
		assert.throws(() => toRgb('#abcdeg'), new Error("bad hex '#abcdeg'"));
		assert.throws(() => toRgb('rgb('), new Error("not css color 'rgb('"));
		assert.throws(() => toRgb('rgb(0,0)'), new Error("bad css color 'rgb(0,0)'"));
		assert.throws(() => toRgb('rgb(0,0,)'), new Error("bad css color 'rgb(0,0,)'"));
		assert.throws(() => toRgb('rgb(characters)'), new Error("bad css color 'rgb(characters)'"));
		assert.throws(() => toRgb('hsl('), new Error("not css color 'hsl('"));
		assert.throws(() => toRgb('hsl(0,0%)'), new Error("bad css color 'hsl(0,0%)'"));
		assert.throws(() => toRgb('hsl(0,0%,)'), new Error("bad css color 'hsl(0,0%,)'"));
		assert.throws(() => toRgb('hsl(0,0%,0)'), new Error("bad css color 'hsl(0,0%,0)'"));
		assert.throws(() => toRgb('hsl(characters)'), new Error("bad css color 'hsl(characters)'"));
	});

	it('should return a Vector3 representing a named color', () => {
		const red = vec4.Create(1.0);
		const trnRed = vec4.Create(1.0, 0.0, 0.0, 0.5);

		assert.deepStrictEqual(
			toRgb('red', { namedColors : { red, trnRed }}),
			vec3.Create(1.0)
		);
		assert.deepStrictEqual(
			toRgb('trnRed', { namedColors : { red, trnRed }}),
			vec3.Create(1.0, 0.5, 0.5)
		);
		assert.deepStrictEqual(
			toRgb('trnRed', { matte : vec3.Create(), namedColors : { red, trnRed }}),
			vec3.Create(0.5, 0.0, 0.0)
		);
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec3(
			toRgb('#ff9966', { profile : cs }),
			{ x : 2.0, y : 1.2, z : 0.8 },
			e
		);
	});
});

describe('assignRgb', () => {
	const e = 1e-10;

	it('should assign a Vector3 to represent a css color', () => {
		const v = vec3.Create();
		const r = assignRgb(v, '#FF6600');

		assert.deepStrictEqual(r, { x : 1.0, y : 0.4, z : 0 });
		assert.strictEqual(v, r);

		assert.deepStrictEqual(assignRgb(v, 'rgb(255,102,0)'), { x : 1.0, y : 0.4, z : 0 });
		assert.deepStrictEqual(assignRgb(v, 'hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0 });
		assert.deepStrictEqual(assignRgb(v, 'rgba(255,102,0,0.5)'), { x : 1.0, y : 0.7, z : 0.5 });
		assert.deepStrictEqual(assignRgb(v, 'rgb(255 102 0/0.5)'), { x : 1.0, y : 0.7, z : 0.5 });
		assert.deepStrictEqual(assignRgb(
			v,
			'rgba(255,102,0,0.5)',
			{ matte : vec3.Create() }
		), { x : 0.5, y : 0.2, z : 0 });
		assert.deepStrictEqual(assignRgb(v, 'hsla(60,100%,50%,0.5)'), { x : 1.0, y : 1.0, z : 0.5 });
		assert.deepStrictEqual(assignRgb(v, 'hsl(60 100% 50%/0.5)'), { x : 1.0, y : 1.0, z : 0.5 });
		assert.deepStrictEqual(assignRgb(
			v,
			'hsla(60,100%,50%,0.5)',
			{ matte : vec3.Create() }
		), { x : 0.5, y : 0.5, z : 0.0 });
	});

	it('should throw for non css color strings', () => {
		const v = vec3.Create();

		assert.throws(() => assignRgb(v, 'foo'), new Error("not css color 'foo'"));
		assert.throws(() => assignRgb(v, '#00'), new Error("not css color '#00'"));
		assert.throws(() => assignRgb(v, '#0000'), new Error("not css color '#0000'"));
		assert.throws(() => assignRgb(v, '#00000'), new Error("not css color '#00000'"));
		assert.throws(() => assignRgb(v, '#0000000'), new Error("not css color '#0000000'"));
		assert.throws(() => assignRgb(v, '#abcdeg'), new Error("bad hex '#abcdeg'"));
		assert.throws(() => assignRgb(v, 'rgb('), new Error("not css color 'rgb('"));
		assert.throws(() => assignRgb(v, 'rgb(0,0)'), new Error("bad css color 'rgb(0,0)'"));
		assert.throws(() => assignRgb(v, 'rgb(0,0,)'), new Error("bad css color 'rgb(0,0,)'"));
		assert.throws(() => assignRgb(v, 'rgb(characters)'), new Error("bad css color 'rgb(characters)'"));
		assert.throws(() => assignRgb(v, 'hsl('), new Error("not css color 'hsl('"));
		assert.throws(() => assignRgb(v, 'hsl(0,0%)'), new Error("bad css color 'hsl(0,0%)'"));
		assert.throws(() => assignRgb(v, 'hsl(0,0%,)'), new Error("bad css color 'hsl(0,0%,)'"));
		assert.throws(() => assignRgb(v, 'hsl(0,0%,0)'), new Error("bad css color 'hsl(0,0%,0)'"));
		assert.throws(() => assignRgb(v, 'hsl(characters)'), new Error("bad css color 'hsl(characters)'"));
	});

	it('should assign a Vector3 to represent a named color', () => {
		const red = vec4.Create(1.0);
		const trnRed = vec4.Create(1.0, 0.0, 0.0, 0.5);

		const v = vec3.Create();
		const r = assignRgb(v, 'red', { namedColors : { red, trnRed }});

		assert.deepStrictEqual(r, vec3.Create(1.0));
		assert.strictEqual(v, r);

		assert.deepStrictEqual(
			assignRgb(v, 'trnRed', { namedColors : { red, trnRed }}),
			vec3.Create(1.0, 0.5, 0.5)
		);
		assert.deepStrictEqual(
			assignRgb(v, 'trnRed', { matte : vec3.Create(), namedColors : { red, trnRed }}),
			vec3.Create(0.5, 0.0, 0.0)
		);
	});

	it('should apply color conversions', () => {
		const v = vec3.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec3(
			assignRgb(v, '#ff9966', { profile : cs }),
			{ x : 2.0, y : 1.2, z : 0.8 },
			e
		);
	});
});

describe('toRgba', () => {
	const e = 1e-10;

	it('should return a Vector4 representing a css color', () => {
		assert.deepStrictEqual(toRgba('#FF6600'), { x : 1.0, y : 0.4, z : 0, w : 1.0 });
		assert.deepStrictEqual(toRgba('rgb(255,102,0)'), { x : 1.0, y : 0.4, z : 0, w : 1.0 });
		assert.deepStrictEqual(toRgba('hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(toRgba('rgba(255,102,0,0.5)'), { x : 1.0, y : 0.4, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(toRgba('rgb(255 102 0/0.5)'), { x : 1.0, y : 0.4, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(toRgba('hsla(60,100%,50%,0.5)'), { x : 1.0, y : 1.0, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(toRgba('hsl(60 100% 50%/0.5)'), { x : 1.0, y : 1.0, z : 0.0, w : 0.5 });
	});

	it('should throw for non css color strings', () => {
		assert.throws(() => toRgba('foo'), new Error("not css color 'foo'"));
		assert.throws(() => toRgba('#00'), new Error("not css color '#00'"));
		assert.throws(() => toRgba('#0000'), new Error("not css color '#0000'"));
		assert.throws(() => toRgba('#00000'), new Error("not css color '#00000'"));
		assert.throws(() => toRgba('#0000000'), new Error("not css color '#0000000'"));
		assert.throws(() => toRgba('#abcdeg'), new Error("bad hex '#abcdeg'"));
		assert.throws(() => toRgba('rgb('), new Error("not css color 'rgb('"));
		assert.throws(() => toRgba('rgb(0,0)'), new Error("bad css color 'rgb(0,0)'"));
		assert.throws(() => toRgba('rgb(0,0,)'), new Error("bad css color 'rgb(0,0,)'"));
		assert.throws(() => toRgba('rgb(characters)'), new Error("bad css color 'rgb(characters)'"));
		assert.throws(() => toRgba('hsl('), new Error("not css color 'hsl('"));
		assert.throws(() => toRgba('hsl(0,0%)'), new Error("bad css color 'hsl(0,0%)'"));
		assert.throws(() => toRgba('hsl(0,0%,)'), new Error("bad css color 'hsl(0,0%,)'"));
		assert.throws(() => toRgba('hsl(0,0%,0)'), new Error("bad css color 'hsl(0,0%,0)'"));
		assert.throws(() => toRgba('hsl(characters)'), new Error("bad css color 'hsl(characters)'"));
	});

	it('should return a Vector4 representing a named color', () => {
		const red = vec4.Create(1.0);
		const trnRed = vec4.Create(1.0, 0.0, 0.0, 0.5);

		const r = toRgba('red', { namedColors : { red, trnRed }});

		assert.deepStrictEqual(r, red);
		assert.notStrictEqual(r, red);

		assert.deepStrictEqual(
			toRgba('trnRed', { namedColors : { red, trnRed }}),
			vec4.Create(1.0, 0.0, 0.0, 0.5)
		);
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assertEqualsVec4(
			toRgba('rgba(255,153,102,0.2)', { profile : cs }),
			{ x : 2.0, y : 1.2, z : 0.8, w : 0.2 },
			e
		);
	});
});

describe('assignRgba', () => {
	const e = 1e-10;

	it('should assign a Vector4 to represent a css color', () => {
		const v = vec4.Create();
		const r = assignRgba(v, '#FF6600');

		assert.deepStrictEqual(r, { x : 1.0, y : 0.4, z : 0, w : 1.0 });
		assert.strictEqual(v, r);

		assert.deepStrictEqual(assignRgba(v, 'rgb(255,102,0)'), { x : 1.0, y : 0.4, z : 0, w : 1.0 });
		assert.deepStrictEqual(assignRgba(v, 'hsl(0,0%,100%)'), { x : 1.0, y : 1.0, z : 1.0, w : 1.0 });
		assert.deepStrictEqual(assignRgba(v, 'rgba(255,102,0,0.5)'), { x : 1.0, y : 0.4, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(assignRgba(v, 'rgb(255 102 0/0.5)'), { x : 1.0, y : 0.4, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(assignRgba(v, 'hsla(60,100%,50%,0.5)'), { x : 1.0, y : 1.0, z : 0.0, w : 0.5 });
		assert.deepStrictEqual(assignRgba(v, 'hsl(60 100% 50%/0.5)'), { x : 1.0, y : 1.0, z : 0.0, w : 0.5 });
	});

	it('should throw for non css color strings', () => {
		const v = vec4.Create();

		assert.throws(() => assignRgba(v, 'foo'), new Error("not css color 'foo'"));
		assert.throws(() => assignRgba(v, '#00'), new Error("not css color '#00'"));
		assert.throws(() => assignRgba(v, '#0000'), new Error("not css color '#0000'"));
		assert.throws(() => assignRgba(v, '#00000'), new Error("not css color '#00000'"));
		assert.throws(() => assignRgba(v, '#0000000'), new Error("not css color '#0000000'"));
		assert.throws(() => assignRgba(v, '#abcdeg'), new Error("bad hex '#abcdeg'"));
		assert.throws(() => assignRgba(v, 'rgb('), new Error("not css color 'rgb('"));
		assert.throws(() => assignRgba(v, 'rgb(0,0)'), new Error("bad css color 'rgb(0,0)'"));
		assert.throws(() => assignRgba(v, 'rgb(0,0,)'), new Error("bad css color 'rgb(0,0,)'"));
		assert.throws(() => assignRgba(v, 'rgb(characters)'), new Error("bad css color 'rgb(characters)'"));
		assert.throws(() => assignRgba(v, 'hsl('), new Error("not css color 'hsl('"));
		assert.throws(() => assignRgba(v, 'hsl(0,0%)'), new Error("bad css color 'hsl(0,0%)'"));
		assert.throws(() => assignRgba(v, 'hsl(0,0%,)'), new Error("bad css color 'hsl(0,0%,)'"));
		assert.throws(() => assignRgba(v, 'hsl(0,0%,0)'), new Error("bad css color 'hsl(0,0%,0)'"));
		assert.throws(() => assignRgba(v, 'hsl(characters)'), new Error("bad css color 'hsl(characters)'"));
	});

	it('should assign a Vector4 to represent a named color', () => {
		const red = vec4.Create(1.0);
		const trnRed = vec4.Create(1.0, 0.0, 0.0, 0.5);

		const v = vec4.Create();
		const r = assignRgba(v, 'red', { namedColors : { red, trnRed }});

		assert.deepStrictEqual(r, red);
		assert.notStrictEqual(r, red);
		assert.strictEqual(v, r);

		assert.deepStrictEqual(
			assignRgba(v, 'trnRed', { namedColors : { red, trnRed }}),
			vec4.Create(1.0, 0.0, 0.0, 0.5)
		);
	});

	it('should apply color conversions', () => {
		const v = vec4.Create();
		const cs = createColorSpace(2.0);

		assertEqualsVec4(
			assignRgba(v, 'rgba(255,153,102,0.2)', { profile : cs }),
			{ x : 2.0, y : 1.2, z : 0.8, w : 0.2 },
			e
		);
	});
});
