import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Image from './Image';
import Tag from './Tag'

@Entity('products')
export default class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @OneToMany(() => Image, image => image.product, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'product_id' })
    images: Image[];

    @OneToMany(() => Tag, tag => tag.product, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'product_id' })
    tags: Tag[];
}