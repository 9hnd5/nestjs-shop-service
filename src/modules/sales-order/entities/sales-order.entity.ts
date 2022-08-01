import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { TenantBase } from 'be-core';
import { isArray, remove } from 'lodash';

export class SalesOrder extends TenantBase {
    constructor(
        contactPerson: string,
        contactNumber: string,
        shipAddress: string,
        shippingFee: number,
        paymentMethodId: number,
        salesChannel: string,
        customerId?: number,
        customerName?: string,
        phoneNumber?: string,
        address?: string,
        deliveryPartner?: string,
        deliveryDate?: Date,
        commission?: number,
        discountAmount?: number
    ) {
        super();
        this.customerId = customerId;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.salesChannel = salesChannel;
        this.postingDate = new Date();
        this.shipAddress = shipAddress;
        this.deliveryPartner = deliveryPartner;
        this.deliveryDate = deliveryDate;
        this.commission = commission ?? 0;
        this.shippingFee = shippingFee;
        this.paymentMethodId = paymentMethodId;
        this.discountAmount = discountAmount ?? 0;
        this.status = SalesOrderStatus.WaitingConfirm;
    }

    id: number;
    code?: string;
    status: string;
    postingDate: Date;
    address?: string;
    contactPerson: string;
    contactNumber: string;
    shipAddress: string;
    customerId?: number;
    customerName?: string;
    phoneNumber?: string;
    salesChannel: string;
    deliveryPartner?: string;
    deliveryDate?: Date;
    shippingFee: number;
    paymentMethodId: number;
    totalAmount: number;
    discountAmount: number;
    commission: number;
    note?: string;

    private _totalBeforeDiscount: number;
    get totalBeforeDiscount() {
        return this.items.reduce((value, current) => {
            return value + current.quantity * current.unitPrice;
        }, 0);
    }
    private set totalBeforeDiscount(value) {
        this._totalBeforeDiscount = value;
    }

    private _totalLineDiscount: number;
    get totalLineDiscount() {
        return this.items.reduce((value, current) => {
            return value + current.discountAmount;
        }, 0);
    }
    private set totalLineDiscount(value) {
        this._totalLineDiscount = value;
    }

    private _tax: number;
    get tax() {
        return this.items.reduce((value, current) => {
            return value + current.tax;
        }, 0);
    }
    private set tax(value) {
        this._tax = value;
    }

    items: SalesOrderItem[];

    addItem(item: SalesOrderItem) {
        this.initItems();
        this.items.push(item);
        this.calcTotalAmount();
    }

    removeItem(id: number) {
        this.initItems();
        remove(this.items, (x) => x.id === id);
        this.calcTotalAmount();
    }

    private calcTotalAmount() {
        this.totalAmount =
            this.totalBeforeDiscount -
            this.totalLineDiscount -
            this.discountAmount -
            this.commission +
            this.tax +
            this.shippingFee;
    }
    checkStatus(status: string) {
        return (<any>Object).values(SalesOrderStatus).includes(status);
    }
    generateCode(orderId: number) {
        const currentDate = new Date();
        return 'SO'.concat(
            currentDate.getFullYear().toString(),
            currentDate.getMonth().toString(),
            currentDate.getDate().toString(),
            orderId.toString()
        );
    }

    private initItems() {
        if (!isArray(this.items)) {
            this.items = [];
        }
    }
}
