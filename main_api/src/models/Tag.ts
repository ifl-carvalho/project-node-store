import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Product from './Product';

@Entity('tags')
export default class Tag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  tag: string;

  @ManyToOne(() => Product, product => product.tags)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}