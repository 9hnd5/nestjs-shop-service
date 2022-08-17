import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';

const externalServiceConfig = getConfig('externalService');
interface Item {
    id: number;
    name: string;
    priceListDetails: PriceListDetail[];
}
interface PriceListDetail {
    uomId: number;
    uomName: string;
    price?: number;
    maxPrice?: number;
    promotionPrice?: number;
    commissionPercent: number;
}

@Injectable()
export class SalesOrderService {
    constructor(private httpClient: HttpService) {}

    async getItemByIds(itemIds: number[], customerId: number) {
        try {
            const itemsRs = await this.httpClient.post<Item[]>(
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
            return itemsRs.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
