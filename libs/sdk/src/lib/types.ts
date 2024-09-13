export type Entries<T, K> = (o: { [k: string]: K }) => Array<[T, K]>;
