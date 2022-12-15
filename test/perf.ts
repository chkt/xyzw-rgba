import * as assert from 'assert';
import { describe, it } from 'mocha';


describe('compound assignments', () => {
	const num = 100_000_000;
	let a = 1.0;
	let b = 2.0;
	let c = 3.0;

	it('should measure the performance of individual assignments', () => {
		for (let i = 0; i < num; i += 1) {
			a = a / 2.0 + 1.0;
			b = b / 2.0 + 1.0;
			c = c / 2.0 + 1.0;
		}
	});

	it('should measure the performance of compound assigmnents', () => {
		for (let i = 0; i < num; i += 1) {
			[ a, b, c ] = [
				a / 2.0 + 1.0,
				b / 2.0 + 1.0,
				c / 2.0 + 1.0
			];
		}
	});
});

describe('mod operation', () => {
	const num = 10_000_000;
	const sgn = Math.sign;
	let a = 1.0;

	it('should measure the performance of (n % m + m) % m', () => {
		for (let i = 0; i < num; i += 1) {
			a = (a % 3 + 3) % 3;
		}
	});

	it('should measure the performance of n % m + (0.5 - 0.5 * sgn(n)) * m', () => {
		for (let i = 0; i < num; i += 1) {
			a = a % 3 + (0.5 - 0.5 * sgn(a)) * 3;
		}
	});

	it('should measure the performance of n % m + (n % m < 0 ? m : 0)', () => {
		for (let i = 0; i < num; i += 1) {
			a %= 3;
			a += a < 0 ? 3 : 0;
		}
	});

	it('should measure the performance of n % m + ((n % m < 0) * m) with implicit cast', () => {
		for (let i = 0; i < num; i += 1) {
			a %= 3;
			a += (a < 0) as unknown as number * 3;
		}
	});

	it('should measure the performance of n % m + ((n % m < 0) * m) with explicit cast', () => {
		for (let i = 0; i < num; i += 1) {
			a %= 3;
			a += Number(a < 0) * 3;
		}
	});
});

describe('clamping', () => {
	const num = 10_000_000;
	const rndfn = Math.random;
	const minfn = Math.min;
	const maxfn = Math.max;

	it('should measure the performance of min(a, b), max(a, b))', () => {
		let r = 0.0;

		for (let i = 0; i < num; i += 1) {
			const a = rndfn();
			const b = rndfn();
			const min = minfn(a, b);
			const max = maxfn(a, b);

			r += min + max;
		}

		assert(r);
	});

	it('should measure the performance of min(a, b), a + b - min', () => {
		let r = 0.0;

		for (let i = 0; i < num; i += 1) {
			const a = rndfn();
			const b = rndfn();
			const min = minfn(a, b);
			const max = a + b - min;

			r += min + max;
		}

		assert(r);
	});
});

describe('number string trimming', () => {
	const num = 1_000_000;

	function trimDigits(n:number, decimals:number) : string {
		const s = n.toFixed(decimals);

		if (decimals < 1) return s;

		const last = s.indexOf('.') - 1;
		let index = s.length - 1;

		for (; index > last; index -= 1) {
			if (s[index] !== '0' && s[index] !== '.') break;
		}

		return s.slice(0, index + 1);
	}

	function trimDigitsIncludes(n:number, decimals:number) : string {
		const s = n.toFixed(decimals);

		if (decimals < 1) return s;

		const last = s.indexOf('.') - 1;
		let index = s.length - 1;

		for (; index > last; index -= 1) {
			if ([ '0', '.' ].includes(s[index])) break;
		}

		return s.slice(0, index + 1);
	}

	it('should measure the performance using regexp replacement', () => {
		for (let i = 0; i < num; i += 1) {
			Math.random().toFixed(i % 5).replace(/^(\d+)(?:(\.\d*[1-9])|\.)0+$/, '$1$2');
		}
	});

	it('should measure the performance using loop', () => {
		for (let i = 0; i < num; i += 1) {
			const decimals = i % 5;
			const s = Math.random().toFixed(decimals);

			if (decimals < 1) continue;

			const last = s.indexOf('.') - 1;
			let index = s.length - 1;

			for (; index > last; index -= 1) {
				if (s[index] !== '0' && s[index] !== '.') break;
			}

			s.slice(0, index + 1);
		}
	});

	it('should measure the performance using loop function', () => {
		for (let i = 0; i < num; i += 1) {
			trimDigits(Math.random(), i % 5);
		}
	});

	it('should measure the performance using loop function with array lookup', () => {
		for (let i = 0; i < num; i += 1) {
			trimDigitsIncludes(Math.random(), i % 5);
		}
	});
});
