import assert from 'assert';

import { describe, it } from 'mocha';
import useWith, * as use from 'tesa';

import * as css from '../source/css';



function invalid(value) {
	return use.registerSpec({
		value,
		valid : false
	});
}



describe('parse', () => {
	it("should accept the 'transparent' string", () => {
		const color = css.parse('transparent');

		assert.deepEqual(color, {
			type : 'rgb',
			components : [0, 0, 0, 0]
		});
	});

	it("should accept a rgb() formated string", () => {
		useWith([
			'rgb(0,0,0)',
			' rgb(0,0,0)',
			'rgb(0,0,0) ',
			'rgb( 0,0,0)',
			'rgb(0 ,0,0)',
			'rgb(0, 0,0)',
			'rgb(0,0 ,0)',
			'rgb(0,0, 0)',
			'rgb(0,0,0 )',
			invalid("rg(0,0,0)"),
			invalid("rgb(0,0,)"),
			invalid("rgb(0,0)"),
			invalid("rgb(0,)"),
			invalid("rgb(0)"),
			invalid("rgb()"),
			invalid("rgb(0,0,0,)"),
			invalid("rgb(0,0,0,0)"),
			invalid("rgb(0a,0,0)"),
			invalid("rgb(0.2,0,0)"),
			invalid("rgb(-1,0,0)"),
			invalid("rgb(256,0,0)")
		], first => css.parse(first));
	});

	it("should accept a hsl() formated string", () => {
		useWith([
			'hsl(0,0%,0%)',
			' hsl(0,0%,0%)',
			'hsl(0,0%,0%) ',
			'hsl( 0,0%,0%)',
			'hsl(0 ,0%,0%)',
			'hsl(0, 0%,0%)',
			'hsl(0,0% ,0%)',
			'hsl(0,0%, 0%)',
			'hsl(0,0%,0% )',
			invalid('hs(0,0%,0%)'),
			invalid('hsl()'),
			invalid('hsl(0,)'),
			invalid('hsl(0,0%)'),
			invalid('hsl(0,0%,)'),
			invalid('hsl(0,0%,0%,)'),
			invalid('hsl(0,0%,0%,0)'),
			invalid('hsl(0,0,0%)'),
			invalid('hsl(0,0%,0)'),
			invalid('hsl(361,0%,0%)'),
			invalid('hsl(a,0%,0%)'),
			invalid('hsl(0,-1%,0%)'),
			invalid('hsl(0,101%,0%)'),
			invalid('hsl(0,0%,-1%)'),
			invalid('hsl(0,0%,101%)')
		], first => css.parse(first));
	});

	it("should accept a rgba() formated string", () => {
		useWith([
			'rgba(0,0,0,0)',
			'rgba(0,0,0,0.0)',
			'rgba(0,0,0,1)',
			'rgba(0,0,0,1.0)',
			'rgba(0,0,0,0.5)',
			' rgba(0,0,0,0.5)',
			'rgba(0,0,0,0.5) ',
			'rgba( 0,0,0,0.5)',
			'rgba(0 ,0,0,0.5)',
			'rgba(0, 0,0,0.5)',
			'rgba(0,0 ,0,0.5)',
			'rgba(0,0, 0,0.5)',
			'rgba(0,0,0 ,0.5)',
			'rgba(0,0,0, 0.5)',
			'rgba(0,0,0,0.5 )',
			invalid("rgbb(0,0,0,1)"),
			invalid("rgba(0,0,0,)"),
			invalid("rgba(0,0,0)"),
			invalid("rgba(0,0,)"),
			invalid("rgba(0,0)"),
			invalid("rgba(0,)"),
			invalid("rgba(0)"),
			invalid("rgba(0,0,0,0,"),
			invalid("rgba(0,0,0,0,0)"),
			invalid("rgba(0,0,0,-1)"),
			invalid("rgba(0,0,0,2)")
		], first => css.parse(first));
	});

	it("should accept a hsla() formated string", () => {
		useWith([
			'hsla(0,0%,0%,0)',
			' hsla(0,0%,0%,0)',
			'hsla(0,0%,0%,0) ',
			'hsla( 0,0%,0%,0)',
			'hsla(0 ,0%,0%,0)',
			'hsla(0, 0%,0%,0)',
			'hsla(0,0% ,0%,0)',
			'hsla(0,0%, 0%,0)',
			'hsla(0,0%,0% ,0)',
			'hsla(0,0%,0%, 0)',
			'hsla(0,0%,0%,0 )',
			'hsla(0,0%,0%,0.0)',
			'hsla(0,0%,0%,1)',
			'hsla(0,0%,0%,1.0)',
			'hsla(360,0%,0%,0)',
			'hsla(0,100%,0%,0)',
			'hsla(0,0%,100%,0)',
			invalid('hsll(0,0%,0%,0)'),
			invalid('hsla(-1,0%,0%,0)'),
			invalid('hsla(361,0%,0%,0)'),
			invalid('hsla(a,0%,0%,0)'),
			invalid('hsla(0,-1%,0%,0)'),
			invalid('hsla(0,101%,0%,0)'),
			invalid('hsla(0,0,0%,0)'),
			invalid('hsla(0,0%,-1%,0)'),
			invalid('hsla(0,0%,101%,0)'),
			invalid('hsla(0,0%,0,0)'),
			invalid('hsla(0,0%,0%,-1)'),
			invalid('hsla(0,0%,0%,2)')
		], first => css.parse(first));
	});

	it("should accept a #rrggbb formated string", () => {
		useWith([
			'#000',
			'#000000',
			' #000000',
			'#000000 ',
			'#fff',
			'#ffffff',
			'#abcdef',
			'#ABCDEF',
			invalid('#0'),
			invalid('#00'),
			invalid('#0000'),
			invalid('#00000'),
			invalid('#0000000'),
			invalid('#ghijkl'),
			invalid('#GHIJKL'),
			invalid('# 00 00 00')
		], first => css.parse(first));
	});
});

describe('stringify', () => {
	it("should return a #rrggbb string", () => {
		const hash = css.stringify({
			type : 'rgb',
			components : [15, 15, 15, 1.0]
		});

		assert.strictEqual(hash, '#0f0f0f');
	});

	it("should return a #rgb string", () => {
		const hash = css.stringify({
			type : 'rgb',
			components : [17, 17, 17, 1.0]
		});

		assert.strictEqual(hash, '#111');
	});

	it("should return a color id string if the name is shorter than its hash representation", () => {
		let id = css.stringify({
			type : 'rgb',
			components : [0, 0, 0, 1.0]
		});

		assert.strictEqual(id, '#000');

		id = css.stringify({
			type : 'rgb',
			components : [255, 0, 0, 1.0]
		});

		assert.strictEqual(id, 'red');
	});

	it("should return a rgba() string", () => {
		const rgba = css.stringify({
			type : 'rgb',
			components: [1, 1, 1, 0]
		});

		assert.strictEqual(rgba, 'rgba(1,1,1,0)');
	});

	it("should return the 'transparent' string for a transparent black", () => {
		const transparent = css.stringify({
			type : 'rgb',
			components : [0, 0, 0, 0.0]
		});

		assert.strictEqual(transparent, 'transparent');
	});

	it("should return a hsl() string", () => {
		const hsl = css.stringify({
			type : 'hsl',
			components : [0, 0, 0, 1.0]
		});

		assert.strictEqual(hsl, 'hsl(0,0%,0%)');
	});

	it("should return a hsla() string", () => {
		const hsla = css.stringify({
			type : 'hsl',
			components : [0, 0, 0, 0]
		});

		assert.strictEqual(hsla, 'hsla(0,0%,0%,0)');
	});
});
