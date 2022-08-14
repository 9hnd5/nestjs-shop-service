import { PaymentStatus } from '@modules/sales-order/dtos/summary-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetResponse {
    @Expose()
    id: number;

    @Expose()
    code: string;

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
    phoneNumber?: string;

    @Expose()
    contactPerson: string;

    @Expose()
    contactNumber: string;

    @Expose()
    address?: string;

    @Expose()
    shipAddress: string;

    @Expose()
    shippingFee: number;

    @Expose()
    deliveryPartner: string;

    @Expose()
    totalAmount: number;

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
