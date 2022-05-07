// This type will be of an object used for recurion, it will contain all basic scalar types
export namespace types {
    export type basic = string | number | boolean;
    export type basicArray = string[] | number[] | boolean[];
    export type basicUnion = basic | basicArray;

    export type obj = { [x: string]: basicUnion | obj };
}
