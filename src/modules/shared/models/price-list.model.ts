import { TenantBaseModel } from "be-core";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('price_list')
export class PriceListModel extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({length: 50})
    public name: string;

    @Column({name: 'rounding_method', length: 50})
    public roundingMethod: string;
    
    @Column({name: 'rounding_rule', length: 50})
    public roundingRule: string;
        
    @Column({length: 50})
    public description: string;
            
    @Column({length: 20})
    public status: string;
}