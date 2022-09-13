export class Dimensions {
    constructor(weight: number, size: DimensionsSize) {
        this.weight = weight;
        this.size = size;
    }
    weight: number; //KG
    size: DimensionsSize;
}

export class DimensionsSize {
    constructor(length: number, width: number, height: number) {
        this.length = length;
        this.width = width;
        this.height = height;
    }
    length: number; //CM
    width: number; //CM
    height: number; //CM
}
