import { SalesOrderProps } from '@modules/sales-order/entities/sales-order.entity';
import { TenantBase, DeepMutable } from 'be-core';

export class SalesOrderItemProps extends TenantBase {
    readonly id: number;
    readonly orderId: number;
    readonly itemId: number;
    readonly uomId: number;
    readonly tax: number;
    readonly percentageDiscount: number;
    readonly discountAmount: number;
    readonly unitPrice: number;
    readonly quantity: number;
    readonly lineTotal: number;
    readonly order: SalesOrderProps;
    readonly itemType?: number;
}
type AddProps = Pick<
    DeepMutable<SalesOrderItemProps>,
    'itemId' | 'uomId' | 'unitPrice' | 'quantity' | 'tax'
>;

type UpdateProps = Omit<AddProps, 'tax'>;
export class SalesOrderItem {
    private props: DeepMutable<SalesOrderItemProps>;
    constructor(props: DeepMutable<SalesOrderItemProps | AddProps>) {
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
    get itemId() {
        return this.props.itemId;
    }
    set itemId(value: number) {
        this.props.itemId = value;
    }
    set uomId(value: number) {
        this.props.uomId = value;
    }

    update(data: UpdateProps) {
        this.itemId = data.itemId;
        this.uomId = data.uomId;
        this.props.quantity = data.quantity;
        this.props.unitPrice = data.unitPrice;
        this.props.lineTotal = data.quantity * data.unitPrice;
    }

    static create(props: AddProps) {
        return new SalesOrderItem({
            ...props,
            discountAmount: 0,
            createdDate: new Date(),
            createdBy: 0,
            lineTotal: props.quantity * props.unitPrice,
        });
    }
    static createFromPersistence(props: SalesOrderItemProps) {
        return new SalesOrderItem(props);
    }
}
