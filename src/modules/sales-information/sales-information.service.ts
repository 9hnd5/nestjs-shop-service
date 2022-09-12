import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';

const externalServiceConfig = getConfig('externalService');
interface ItemUoMDefinition {
    itemId: number;
    itemCode: string;
    uomGroupId: number;
    altUomId: number;
    baseUomId: number;
    altQuantity: number;
    baseQuantity: number;
    isBaseUoM: boolean;
}

@Injectable()
export class SalesInformationService {
    constructor(private httpClient: HttpService) {}

    async getItemUoMByIds(itemIds: number[]) {
        try {
            const itemsRs = await this.httpClient.post<ItemUoMDefinition[]>(
                `internal/ecommerce-shop/v1/uom/by-item-ids`,
                {
                    itemIds,
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
