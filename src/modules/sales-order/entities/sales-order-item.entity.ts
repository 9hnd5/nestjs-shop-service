import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';

export class SalesOrderItem {
    constructor(itemCode: string, unitPrice: number, quantity: number) {
        this.itemCode = itemCode;
        this._unitPrice = unitPrice;
        this._quantity = quantity;
        this._totalPrice = this._quantity * this._unitPrice;
    }

    id: number;
    itemCode: string;

    private _unitPrice: number;
    get unitPrice() {
        return this._unitPrice;
    }
    set unitPrice(unitPrice: number) {
        this._unitPrice = unitPrice;
        this._totalPrice = this._quantity * this._unitPrice;
    }

    private _quantity: number;
    get quantity() {
        return this._quantity;
    }
    set quantity(quantity: number) {
        this._quantity = quantity;
        this._totalPrice = this._quantity * this._unitPrice;
    }

    private _totalPrice: number;
    get totalPrice() {
        return this._totalPrice;
    }
    private set totalPrice(value: number) {
        this._totalPrice = value;
    }

    readonly order: SalesOrder;
}
