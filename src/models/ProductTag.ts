import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import Product from './Product';
import Tag from './Tag'

@Entity('products_tags')
export default class ProductTag {

  @PrimaryColumn()
  product_id: string;

  @PrimaryColumn()
  tag_id: string;

  @ManyToOne(() => Product, product => product.tags, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Tag, tag => tag.products, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
  
}