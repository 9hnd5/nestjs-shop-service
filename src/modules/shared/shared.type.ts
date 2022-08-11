export type Immutable<T> = {
    +readonly [K in keyof T]: T[K];
};
export type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

export type primitive = string | number | boolean | undefined | null | Date;
export type DeepImmutable<T> = T extends primitive ? T : DeepImmutableObject<T>;
export type DeepImmutableObject<T> = {
    +readonly [P in keyof T]: DeepImmutable<T[P]>;
};

export type DeepMutable<T> = T extends primitive ? T : DeepMutableObject<T>;
export type DeepMutableObject<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>;
};
