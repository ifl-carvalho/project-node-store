import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Product from './Product'

@Entity('categories')
export default class Category {

  @PrimaryColumn()
  readonly id: string;

  @Column()
  category: string;

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];

  constructor() {
    if(!this.id) {
        this.id = uuid();
    }
  }
}