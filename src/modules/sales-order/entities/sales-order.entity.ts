import {
    SalesOrderItem,
    SalesOrderItemProps,
} from '@modules/sales-order/entities/sales-order-item.entity';
import { PaymentStatus } from '@modules/sales-order/enums/payment-status.enum';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { BusinessException, DeepMutable, TenantBase } from 'be-core';
import { isAfter } from 'date-fns';
import { isArray, remove } from 'lodash';

export class SalesOrderProps extends TenantBase {
    readonly id: number;
    readonly code: string;
    readonly deliveryDate: Date;
    readonly status: string;
    readonly postingDate: Date;
    readonly contactPerson: string;
    readonly contactPhoneNumber: string;
    readonly contactAddress: string;
    readonly contactAddressId: number;
    readonly salesChannelCode: string;
    readonly salesChannelName: string;
    readonly deliveryPartner: string;
    readonly shippingFee: number;
    readonly paymentMethodId: number;
    readonly paymentMethodName: string;
    readonly totalAmount: number;
    readonly totalBeforeDiscount: number;
    readonly totalLineDiscount: number;
    readonly orderDiscountAmount: number;
    readonly commission: number;
    readonly salesmanCode: string;
    readonly salesmanName: string;
    readonly tax: number;
    readonly paymentStatus?: PaymentStatus;
    readonly items: SalesOrderItemProps[];
    readonly customerId?: number;
    readonly customerName?: string;
    readonly customerPhoneNumber?: string;
    readonly customerAddress?: string;
    readonly note?: string;
}
type AddProps = Omit<
    DeepMutable<SalesOrderProps>,
    | 'paymentStatus'
    | 'items'
    | 'code'
    | 'id'
    | 'totalAmount'
    | 'createdDate'
    | 'modifiedDate'
    | 'modifiedBy'
    | 'companyId'
    | 'isDeleted'
    | 'totalLineDiscount'
    | 'totalBeforeDiscount'
    | 'tax'
>;
type UpdateProps = Omit<AddProps, 'status' | 'postingDate' | 'createdBy'> & {
    modifiedBy: number;
    postingDate?: Date;
};

export class SalesOrder {
    private props: DeepMutable<SalesOrderProps>;

    private constructor(props: DeepMutable<AddProps> | DeepMutable<SalesOrderProps>) {
        if ('id' in props) {
            this.props = props;
        } else {
            this.props = { ...this.props, ...props };
        }
    }

    get id() {
        return this.props.id;
    }
    get entity() {
        return this.props;
    }
    get items() {
        return this.props.items.map((x) => new SalesOrderItem(x));
    }
    set code(value: string) {
        this.props.code = value;
    }

    static create(props: AddProps) {
        return new SalesOrder({
            ...props,
            createdDate: new Date(),
            paymentStatus:
                props.status === SalesOrderStatus.Draft ? undefined : PaymentStatus.Unpaid,
        });
    }

    static createFromPersistence(props: SalesOrderProps) {
        return new SalesOrder(props);
    }

    update(data: UpdateProps) {
        if (isAfter(this.props.postingDate, data.deliveryDate)) {
            throw new BusinessException('Posting Date is not allow before Delivery Date');
        }
        if (data.postingDate) {
            this.changePostingDate(data.postingDate);
        }
        this.props = { ...this.props, ...data, modifiedDate: new Date() };
    }

    addItem(item: SalesOrderItem) {
        if (!isArray(this.props.items)) {
            this.props.items = [];
        }
        this.props.items.push(item.entity);
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTax();
        this.#calcTotalAmount();
    }

    updateItem(id: number, item: SalesOrderItem) {
        const index = this.props.items.findIndex((x) => x.id === id);
        if (index >= 0) {
            this.props.items[index] = item.entity;
        }
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTax();
        this.#calcTotalAmount();
    }

    removeItem(id: number) {
        if (!isArray(this.props.items)) {
            this.props.items = [];
        }
        remove(this.props.items, (x) => x.id === id);
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTax();
        this.#calcTotalAmount();
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

    changeStatusToNew(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.New) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToConfirmed(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Confirmed) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToCanceled(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (
            (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.Canceled) ||
            (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Canceled)
        ) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToOrderPreparation(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (
            oldStatus == SalesOrderStatus.Confirmed &&
            newStatus == SalesOrderStatus.OrderPreparation
        ) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToWaitingDelivery(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (
            oldStatus == SalesOrderStatus.OrderPreparation &&
            newStatus == SalesOrderStatus.WaitingDelivery
        ) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToDeliveried(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (
            oldStatus == SalesOrderStatus.WaitingDelivery &&
            newStatus == SalesOrderStatus.Delivered
        ) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToReturned(newStatus: string, modifiedBy: number) {
        const oldStatus = this.props.status;
        if (oldStatus == SalesOrderStatus.Delivered && newStatus == SalesOrderStatus.Returned) {
            this.props.status = newStatus;
            this.props.modifiedDate = new Date();
            this.props.modifiedBy = modifiedBy;
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changePostingDate(postingDate: Date) {
        if (this.props.status !== SalesOrderStatus.Draft) {
            throw new BusinessException(
                "Can't change the Posting Date because its status is not draft"
            );
        }

        if (isAfter(postingDate, this.props.deliveryDate)) {
            throw new BusinessException('Posting Date is not allow before Delivery Date');
        }
        this.props.postingDate = postingDate;
        this.props.modifiedDate = new Date();
    }

    #calcTotalAmount() {
        this.props.totalAmount =
            this.props.totalBeforeDiscount -
            this.props.totalLineDiscount -
            this.props.orderDiscountAmount -
            this.props.commission +
            this.props.tax +
            this.props.shippingFee;
    }

    #calcTotalBeforeDiscount() {
        this.props.totalBeforeDiscount = this.props.items.reduce((value, current) => {
            return value + current.quantity * current.unitPrice;
        }, 0);
    }

    #calcTotalLineDiscount() {
        this.props.totalLineDiscount = this.props.items.reduce((value, current) => {
            return value + current.discountAmount;
        }, 0);
    }

    #calcTax() {
        this.props.tax = this.props.items.reduce((value, current) => {
            return value + current.tax;
        }, 0);
    }
}
