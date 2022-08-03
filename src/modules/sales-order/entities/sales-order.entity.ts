import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { BusinessException, TenantBase } from 'be-core';
import { isArray, remove } from 'lodash';

export class SalesOrder extends TenantBase {
    constructor(
        status: string,
        contactPerson: string,
        contactNumber: string,
        shipAddress: string,
        shippingFee: number,
        paymentMethodId: number,
        paymentMethodName: string,
        salesChannelCode: string,
        salesChannelName: string,
        deliveryDate: Date,
        deliveryPartner: string,
        customerId?: number,
        customerName?: string,
        phoneNumber?: string,
        address?: string,
        commission?: number,
        orderDiscountAmount?: number,
        note?: string
    ) {
        super();
        this.customerId = customerId;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.salesChannelCode = salesChannelCode;
        this.salesChannelName = salesChannelName;
        this.postingDate = new Date();
        this.shipAddress = shipAddress;
        this.deliveryPartner = deliveryPartner;
        this.deliveryDate = deliveryDate;
        this.commission = commission ?? 0;
        this.shippingFee = shippingFee;
        this.paymentMethodId = paymentMethodId;
        this.orderDiscountAmount = orderDiscountAmount ?? 0;
        this.status = status;
        this.paymentMethodName = paymentMethodName;
        this.note = note;
    }

    id: number;
    code?: string;

    private _deliveryDate: Date;

    get deliveryDate() {
        return this._deliveryDate;
    }
    set deliveryDate(value) {
        if (value < this.postingDate)
            throw new BusinessException('Delivery date cannot be less than the posting date');
        this._deliveryDate = value;
    }

    private _status: string;

    get status() {
        return this._status;
    }
    private set status(value) {
        this._status = value;
    }

    changeStatusToNew(newStatus: string) {
        const oldStatus = this.status;
        if (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.New) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToConfirmed(newStatus: string) {
        const oldStatus = this.status;
        if (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Confirmed) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToCanceled(newStatus: string) {
        const oldStatus = this.status;
        if (
            (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.Canceled) ||
            (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Canceled)
        ) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToOrderPreparation(newStatus: string) {
        const oldStatus = this.status;
        if (
            oldStatus == SalesOrderStatus.Confirmed &&
            newStatus == SalesOrderStatus.OrderPreparation
        ) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToWaitingDelivery(newStatus: string) {
        const oldStatus = this.status;
        if (
            oldStatus == SalesOrderStatus.OrderPreparation &&
            newStatus == SalesOrderStatus.WaitingDelivery
        ) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToDeliveried(newStatus: string) {
        const oldStatus = this.status;
        if (
            oldStatus == SalesOrderStatus.WaitingDelivery &&
            newStatus == SalesOrderStatus.Delivered
        ) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToReturned(newStatus: string) {
        const oldStatus = this.status;
        if (oldStatus == SalesOrderStatus.Delivered && newStatus == SalesOrderStatus.Returned) {
            this.status = newStatus;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    postingDate: Date;
    address?: string;
    contactPerson: string;
    contactNumber: string;
    shipAddress: string;
    customerId?: number;
    customerName?: string;
    phoneNumber?: string;
    salesChannelCode: string;
    salesChannelName: string;
    deliveryPartner: string;
    shippingFee: number;
    paymentMethodId: number;
    paymentMethodName: string;
    totalAmount: number;
    orderDiscountAmount: number;
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
            this.orderDiscountAmount -
            this.commission +
            this.tax +
            this.shippingFee;
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
