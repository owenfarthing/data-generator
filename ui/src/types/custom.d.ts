declare module "*.svg" {
	const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	export default content;
}

declare module '*.png' {
	const src: string;
	export default src;
}

declare module '*.module.css' {
	const styles: Record<string, string>;
	export default styles;
}

// TODO: fix this once common is updated to use typescript
declare module 'common';

declare module globalThis {
	interface Window {
		__env__?: Record<string, string>;
	}
}
