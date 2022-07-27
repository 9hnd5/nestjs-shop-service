import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { TenantBase } from 'be-core';
import { isArray, remove } from 'lodash';
export class SalesOrder extends TenantBase {
    constructor(name: string, customerId?: number, customerName?: string, deliveryCode?: string) {
        super();
        this.name = name;
        this.customerId = customerId;
        this.customerName = customerName;
        this.deliveryCode = deliveryCode;
        this.status = SalesOrderStatus.Draft;
    }

    id: number;
    name: string;
    customerId?: number;
    customerName?: string;
    deliveryCode?: string;
    status: string;
    items: SalesOrderItem[];

    addItem(item: SalesOrderItem) {
        this.initItems();
        this.items.push(item);
    }

    removeItem(id: number) {
        this.initItems();
        remove(this.items, (x) => x.id === id);
    }

    private initItems() {
        if (!isArray(this.items)) {
            this.items = [];
        }
    }
}
