import {
    SalesOrderItem,
    SalesOrderItemEntity,
} from '@modules/sales-order/entities/sales-order-item.entity';
import { PaymentStatus } from '@modules/sales-order/enums/payment-status.enum';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { BusinessException, TenantEntity, AggregateRoot, AddType } from 'be-core';
import { isAfter } from 'date-fns';
import { isArray, remove, merge } from 'lodash';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales_order')
export class SalesOrderEntity extends TenantEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'code', type: String })
    code: string;
    @Column({ name: 'delivery_date', type: Date })
    deliveryDate: Date;
    @Column({ name: 'status', type: String })
    status: string;
    @Column({ name: 'posting_date', type: Date })
    postingDate: Date;
    @Column({ name: 'contact_person', type: String })
    contactPerson: string;
    @Column({ name: 'contact_phone_number', type: String })
    contactPhoneNumber: string;
    @Column({ name: 'contact_address', type: String })
    contactAddress: string;
    @Column({ name: 'contact_address_id', type: Number })
    contactAddressId: number;
    @Column({ name: 'sales_channel_code', type: String })
    salesChannelCode: string;
    @Column({ name: 'sales_channel_name', type: String })
    salesChannelName: string;
    @Column({ name: 'delivery_partner', type: String })
    deliveryPartner: string;
    @Column({ name: 'shipping_fee', type: Number })
    shippingFee: number;
    @Column({ name: 'payment_method_id', type: Number })
    paymentMethodId: number;
    @Column({ name: 'payment_method_name', type: String })
    paymentMethodName: string;
    @Column({ name: 'total_amount', type: Number })
    totalAmount: number;
    @Column({ name: 'total_before_discount', type: Number })
    totalBeforeDiscount: number;
    @Column({ name: 'total_line_discount', type: Number })
    totalLineDiscount: number;
    @Column({ name: 'total_reduced_amount', type: 'double' })
    totalReducedAmount: number;
    @Column({ name: 'order_discount_amount', type: Number })
    orderDiscountAmount: number;
    @Column({ name: 'commission', type: Number })
    commission: number;
    @Column({ name: 'salesman_code', type: String })
    salesmanCode: string;
    @Column({ name: 'salesman_name', type: String })
    salesmanName: string;
    @Column({ name: 'tax', type: Number })
    tax: number;
    @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, nullable: true })
    paymentStatus?: PaymentStatus;
    @OneToMany(() => SalesOrderItemEntity, (s) => s.order, { cascade: true })
    items: SalesOrderItemEntity[];
    @Column({ name: 'customer_id', type: Number, nullable: true })
    customerId?: number;
    @Column({ name: 'customer_name', type: String, nullable: true })
    customerName?: string;
    @Column({ name: 'customer_phone_number', type: String, nullable: true })
    customerPhoneNumber?: string;
    @Column({ name: 'customer_address', type: String, nullable: true })
    customerAddress?: string;
    @Column({ name: 'note', type: String, nullable: true })
    note?: string;
    @Column({ name: 'payment_type', type: String, nullable: true })
    paymentType?: string;
    @Column({ name: 'service_level', type: String, nullable: true })
    serviceLevel?: string;
    @Column({ name: 'item_type', type: String, nullable: true })
    itemType?: string;
    @Column({ name: 'delivery_order_code', type: String, nullable: true })
    deliveryOrderCode?: string;
}
type AddProps = Omit<
    AddType<SalesOrderEntity>,
    | 'paymentStatus'
    | 'items'
    | 'code'
    | 'id'
    | 'totalAmount'
    | 'totalLineDiscount'
    | 'totalBeforeDiscount'
    | 'tax'
    | 'itemType'
    | 'serviceLevel'
    | 'paymentType'
    | 'totalReducedAmount'
>;
type UpdateProps = Omit<AddProps, 'status' | 'postingDate'> & {
    modifiedBy: number;
    postingDate?: Date;
};

export class SalesOrder extends AggregateRoot<SalesOrderEntity> {
    private constructor(entity: Partial<SalesOrderEntity>) {
        super(entity);
    }

    get customerId() {
        return this.entity.customerId;
    }

    get items() {
        return this.entity.items.map((x) => new SalesOrderItem(x));
    }

    get totalBeforeDiscount() {
        return this.entity.totalBeforeDiscount;
    }

    set code(value: string) {
        this.entity.code = value;
    }

    set itemType(value: string) {
        this.entity.itemType = value;
    }

    set serviceLevel(value: string) {
        this.entity.serviceLevel = value;
    }

    set paymentType(value: string) {
        this.entity.paymentType = value;
    }

    set(value: string) {
        this.entity.code = value;
    }

    get weight() {
        return this.#calcWeight();
    }

    get height() {
        return this.#calcHeight();
    }

    get length() {
        return this.#calcLength();
    }

    get width() {
        return this.#calcWidth();
    }

    set shippingFee(value: number) {
        this.entity.shippingFee = value;
        this.#calcTotalAmount();
    }

    set deliveryOrderCode(value: string) {
        this.entity.deliveryOrderCode = value;
    }

    static create(data: AddProps) {
        return new SalesOrder({
            ...data,
            paymentStatus:
                data.status === SalesOrderStatus.Draft ? undefined : PaymentStatus.Unpaid,
        });
    }

    static createFromPersistence(entity: SalesOrderEntity) {
        return new SalesOrder(entity);
    }

    update(data: UpdateProps) {
        if (isAfter(this.entity.postingDate, data.deliveryDate)) {
            throw new BusinessException('Posting Date is not allow before Delivery Date');
        }
        if (data.postingDate) {
            this.changePostingDate(data.postingDate);
        }
        this.entity = merge(this.entity, data);
    }

    addItem(item: SalesOrderItem) {
        if (!isArray(this.entity.items)) {
            this.entity.items = [];
        }
        this.entity.items.push(item.toEntity());
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTotalReducedAmount();
        this.#calcTax();
        this.#calcTotalAmount();
    }

    updateItem(id: number, item: SalesOrderItem) {
        const index = this.entity.items.findIndex((x) => x.id === id);
        if (index >= 0) {
            this.entity.items[index] = item.toEntity();
        }
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTotalReducedAmount();
        this.#calcTax();
        this.#calcTotalAmount();
    }

    removeItem(id: number) {
        if (!isArray(this.entity.items)) {
            this.entity.items = [];
        }
        remove(this.entity.items, (x) => x.id === id);
        this.#calcTotalBeforeDiscount();
        this.#calcTotalLineDiscount();
        this.#calcTotalReducedAmount();
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

    changeStatusToNew(newStatus: string) {
        const oldStatus = this.entity.status;
        if (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.New) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToConfirmed(newStatus: string) {
        const oldStatus = this.entity.status;
        if (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Confirmed) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToCanceled(newStatus: string) {
        const oldStatus = this.entity.status;
        if (
            (oldStatus == SalesOrderStatus.Draft && newStatus == SalesOrderStatus.Canceled) ||
            (oldStatus == SalesOrderStatus.New && newStatus == SalesOrderStatus.Canceled)
        ) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToOrderPreparation(newStatus: string) {
        const oldStatus = this.entity.status;
        if (
            oldStatus == SalesOrderStatus.Confirmed &&
            newStatus == SalesOrderStatus.OrderPreparation
        ) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToWaitingDelivery(newStatus: string) {
        const oldStatus = this.entity.status;
        if (
            oldStatus == SalesOrderStatus.OrderPreparation &&
            newStatus == SalesOrderStatus.WaitingDelivery
        ) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToDeliveried(newStatus: string) {
        const oldStatus = this.entity.status;
        if (
            oldStatus == SalesOrderStatus.WaitingDelivery &&
            newStatus == SalesOrderStatus.Delivered
        ) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changeStatusToReturned(newStatus: string) {
        const oldStatus = this.entity.status;
        if (oldStatus == SalesOrderStatus.Delivered && newStatus == SalesOrderStatus.Returned) {
            this.entity.status = newStatus;
            this.entity.modifiedDate = new Date();
        } else {
            throw new BusinessException('Status Invalid');
        }
    }

    changePostingDate(postingDate: Date) {
        if (this.entity.status !== SalesOrderStatus.Draft) {
            throw new BusinessException(
                "Can't change the Posting Date because its status is not draft"
            );
        }

        if (isAfter(postingDate, this.entity.deliveryDate)) {
            throw new BusinessException('Posting Date is not allow before Delivery Date');
        }
        this.entity.postingDate = postingDate;
        this.entity.modifiedDate = new Date();
    }

    #calcTotalAmount() {
        this.entity.totalAmount =
            this.entity.totalBeforeDiscount -
            this.entity.totalReducedAmount -
            this.entity.totalLineDiscount -
            this.entity.orderDiscountAmount -
            this.entity.commission +
            this.entity.tax +
            this.entity.shippingFee;
    }

    #calcTotalBeforeDiscount() {
        this.entity.totalBeforeDiscount = this.entity.items.reduce((value, current) => {
            return value + current.quantity * (current.originalPrice ?? current.unitPrice);
        }, 0);
    }

    #calcTotalLineDiscount() {
        this.entity.totalLineDiscount = this.entity.items.reduce((value, current) => {
            return value + current.discountAmount;
        }, 0);
    }

    #calcTax() {
        this.entity.tax = this.entity.items.reduce((value, current) => {
            return value + current.tax;
        }, 0);
    }

    #calcWeight() {
        return this.entity.items.reduce((value, current) => {
            return value + current.weight;
        }, 0);
    }
    #calcLength() {
        return this.entity.items.reduce((value, current) => {
            return value + current.length;
        }, 0);
    }
    #calcWidth() {
        return this.entity.items.reduce((value, current) => {
            return value + current.width;
        }, 0);
    }
    #calcHeight() {
        return this.entity.items.reduce((value, current) => {
            return value + current.height;
        }, 0);
    }

    #calcTotalReducedAmount() {
        this.entity.totalReducedAmount = this.entity.items.reduce((value, current) => {
            return (
                value +
                current.quantity *
                    (current.originalPrice ? current.originalPrice - current.unitPrice : 0)
            );
        }, 0);
    }
}
