import { TenantBaseModel } from "be-core";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('price_list')
export class PriceListModel extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({type: 'varchar', length: 50})
    public name: string;

    @Column({name: 'rounding_method', type: 'varchar', length: 50})
    public roundingMethod: string;
    
    @Column({name: 'rounding_rule', type: 'varchar', length: 50})
    public roundingRule: string;
        
    @Column({type: 'varchar', length: 50})
    public description: string;
            
    @Column({type: 'varchar', length: 20})
    public status: string;
}