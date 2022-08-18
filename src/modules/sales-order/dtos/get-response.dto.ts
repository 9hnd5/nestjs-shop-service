import { PaymentStatus } from '@modules/sales-order/dtos/summary-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetResponse {
    @Expose()
    id: number;

    @Expose()
    code: string;

    @Expose()
    paymentMethodId: number;

    @Expose()
    paymentMethodName: string;

    @Expose()
    status: string;

    @Expose()
    salesChannelCode: string;

    @Expose()
    salesChannelName: string;

    @Expose()
    customerId?: number;

    @Expose()
    customerName?: string;

    @Expose()
    customerPhoneNumber?: string;

    @Expose()
    contactPerson: string;

    @Expose()
    contactPhoneNumber: string;

    @Expose()
    customerAddress?: string;

    @Expose()
    contactAddress: string;

    @Expose()
    contactAddressId: number;

    @Expose()
    shippingFee: number;

    @Expose()
    deliveryPartner: string;

    @Expose()
    totalAmount: number;

    @Expose()
    totalBeforeDiscount: number;

    @Expose()
    totalLineDiscount: number;

    @Expose()
    @Type(() => Date)
    createdDate: Date;

    @Expose()
    @Type(() => Date)
    modifiedDate: Date;

    @Expose()
    @Type(() => Date)
    deliveryDate: Date;

    @Expose()
    @Type(() => Date)
    postingDate: Date;

    @Expose()
    salesmanCode: number;

    @Expose()
    salesmanName: string;

    @Expose()
    paymentStatus: PaymentStatus;
}
