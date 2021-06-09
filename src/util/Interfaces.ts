export interface Events {
	[name: string]: (...args: any[]) => Promise<any> | any;
}
export interface ConvertedOptions {
	[name: string]: string;
}
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
