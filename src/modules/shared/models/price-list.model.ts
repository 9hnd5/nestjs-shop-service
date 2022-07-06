import { ApiProperty } from "@nestjs/swagger";
import { TenantBaseModel } from "be-core";
import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('price_list')
@Exclude()
export class PriceListModel extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    @Expose()
    @ApiProperty()
    public id: number;

    @MaxLength(20)
    @Column({type: 'varchar', length: 50})
    @Expose()
    @ApiProperty()
    public name: string;

    @Column({name: 'rounding_method', type: 'varchar', length: 50})
    @Expose()
    @ApiProperty()
    public roundingMethod: string;
    
    @Column({name: 'rounding_rule', type: 'varchar', length: 50})
    @Expose()
    @ApiProperty()
    public roundingRule: string;
        
    @Column({type: 'varchar', length: 50})
    @Expose()
    @ApiProperty()
    public description: string;
            
    @Column({type: 'boolean'})
    @Expose()
    @ApiProperty()
    public status: boolean;
}