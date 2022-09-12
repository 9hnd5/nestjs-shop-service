import { PromotionTypeId } from '@constants/enum';

export class ApplyPromotionDoc {
    customer: string;
    documentLines: ApplyPromotionDocLine[];
}

export class ApplyPromotionDocLine {
    item: string;
    uom: string;
    quantity: number;
    itemType: PromotionTypeId;
    unitPrice: number;
    tax: number;
    discountValue: number;
    rateDiscount: number;
    promotionCode?: string;
    promotionDescription?: string;
}
