import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    status: string;

    @Expose()
    customerId: number;

    @Expose()
    @Type(() => Date)
    createdDate: Date;
}
