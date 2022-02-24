import { multiplyScalar } from 'xyzw/dist/vector3';
import { ColorSpace, Transfer } from '../../source/colorSpace';


export function createTransferFunction(n:number) : Transfer {
	return (r, v) => multiplyScalar(r, v, n);
}

export function createColorSpace(n:number) : ColorSpace {
	return {
		expand : (r, v) => multiplyScalar(r, v, n),
		compress : (r, v) => multiplyScalar(r, v, 1.0 / n)
	};
}
