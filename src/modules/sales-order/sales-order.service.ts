import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { Employee } from './dtos/employee.dto';
import { ApplyPromotionDoc } from './dtos/apply-promotion.dto';
import { Address } from './dtos/address.dto';

const externalServiceConfig = getConfig('externalService');
export interface Item {
    id: number;
    code: string;
    name: string;
    weight: number;
    height: number;
    width: number;
    length: number;
    picture: Picture;
    priceListDetails: PriceListDetail[];
}
interface Picture {
    imageId: string;
}
interface PriceListDetail {
    uomId: number;
    uomCode: string;
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

    async getItemByCodes(itemCodes: string[], customerId: number) {
        try {
            const itemsRs = await this.httpClient.post<Item[]>(
                `internal/ecommerce-shop/v1/item/by-codes`,
                {
                    itemCodes,
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

    async getEmployeeByUserId(userId: number) {
        try {
            const response = await this.httpClient.get<Employee>(
                `internal/member/v1/employees/by-user-id?userId=${userId}`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.memberService,
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getCustomerById(id: number) {
        try {
            const response = await this.httpClient.get<Employee>(
                `internal/member/v1/customers/${id}`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.memberService,
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async applyPromotion(document: ApplyPromotionDoc) {
        try {
            const response = await this.httpClient.post<ApplyPromotionDoc>(
                `internal/promotions/v1/promotions/apply`,
                { document },
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.promotionService,
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getAddressById(id: number) {
        try {
            const response = await this.httpClient.get<Address>(`member/v1/addresses/${id}`, {
                autoInject: true,
                config: {
                    baseURL: externalServiceConfig.memberService,
                },
            });
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
