import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Image from './Image';
import Tag from './Tag';

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

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];

    constructor() {
        if(!this.id) {
            this.id = uuid();
        }
    }

}