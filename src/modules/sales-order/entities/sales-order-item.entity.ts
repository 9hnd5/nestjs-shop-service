import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { TenantBase } from 'be-core';

export class SalesOrderItem extends TenantBase {
    constructor(itemId: number, uomId: number, unitPrice: number, quantity: number, tax: number) {
        super();
        this.itemId = itemId;
        this.uomId = uomId;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.tax = tax;
        this.lineTotal = this.quantity * this.unitPrice;
        this.discountAmount = 0;
    }

    id: number;
    orderId: number;
    itemId: number;
    itemType?: number;
    uomId: number;
    tax: number;
    percentageDiscount: number;
    discountAmount: number;

    private _unitPrice: number;
    get unitPrice() {
        return this._unitPrice;
    }
    set unitPrice(unitPrice: number) {
        this._unitPrice = unitPrice;
        this._lineTotal = this._quantity * this._unitPrice;
    }

    private _quantity: number;
    get quantity() {
        return this._quantity;
    }
    set quantity(quantity: number) {
        this._quantity = quantity;
        this._lineTotal = this._quantity * this._unitPrice;
    }

    private _lineTotal: number;
    get lineTotal() {
        return this._lineTotal;
    }
    private set lineTotal(value: number) {
        this._lineTotal = value;
    }

    readonly order: SalesOrder;
}
