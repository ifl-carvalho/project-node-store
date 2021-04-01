import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Image from './Image';
import ProductTag from './ProductTag';

@Entity('products')
export default class Product {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    amount: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => Image, image => image.product, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'product_id' })
    images: Image[];

    @OneToMany(() => ProductTag, productTag => productTag.product, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'product_id' })
    tags!: ProductTag[];

    constructor() {
        if(!this.id) {
            this.id = uuid();
        }
    }

}