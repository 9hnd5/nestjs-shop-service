import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';

const externalServiceConfig = getConfig('externalService');

@Injectable()
export class SalesOrderService {
    constructor(private httpClient: HttpService) {}

    async getItemByIds(itemIds: number[], customerId: number) {
        try {
            const itemsRs = await this.httpClient.post(
                `internal/ecommerce-shop/v1/item/by-ids`,
                {
                    itemIds,
                    customerId,
                },
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.ecommerceShopService,
                    },
                }
            );
            return itemsRs;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
