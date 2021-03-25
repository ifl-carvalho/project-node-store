/*import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Product from './Product';
import Tag from './Tag';

@Entity()
export class ProductTag extends BaseEntity {
    @PrimaryColumn()
    productId: number;

    @PrimaryColumn()
    tagId: number;

    @ManyToOne(() => Product, product => product.tagConnection, { primary: true })
    @JoinColumn({ name: 'productId' })
    product: Promise<Product>

    @ManyToOne(() => Tag, Product)
}*/