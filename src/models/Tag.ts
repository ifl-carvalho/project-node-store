import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import Product from './Product'
import Category from './Category'

@Entity('tags')
export default class Tag {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string;

  @ManyToMany(() => Product, product => product.tags)
  products: Product[];

  @ManyToMany(() => Category, category => category.tags)
  categories: Category[];
  
}