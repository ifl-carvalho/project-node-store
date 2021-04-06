import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from './Category';

import Product from './Product';

@Entity('images')
export default class Image {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Product, product => product.images)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => Category, category => category.images)
  @JoinColumn({ name: 'category_id' })
  category!: Category;
  
}