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
    customerId?: number;

    @Expose()
    customerName?: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    contactPerson?: string;

    @Expose()
    contactNumber?: string;

    @Expose()
    address?: string;

    @Expose()
    shipAddress?: string;

    @Expose()
    shippingFee?: number;

    @Expose()
    deliveryPartner?: string;

    @Expose()
    @Type(() => Date)
    createdDate: Date;
}
