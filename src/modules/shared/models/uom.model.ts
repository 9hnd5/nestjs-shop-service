import { ApiProperty } from "@nestjs/swagger";
import { TenantBaseModel } from "be-core";
import { Exclude, Expose } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
@Exclude()
export class Uom extends TenantBaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    @ApiProperty()
    @Expose()
    public id: number;

    @Column({ nullable: false, length: 50 })
    @ApiProperty()
    @Expose()
    public code: string;

    @Column({ length: 50})
    @ApiProperty()
    @Expose()
    public name: string;

    @Column({ length: 255})
    @ApiProperty()
    @Expose()
    public description: string;

    @Column({ nullable: false})
    @Expose()
    @ApiProperty()
    public status: boolean;
}