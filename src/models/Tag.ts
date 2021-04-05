import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Product from './Product'

@Entity('tags')
export default class Tag {

  @PrimaryColumn()
  readonly id: string;

  @Column()
  tag: string;

  @ManyToMany(() => Product, product => product.tags)
  products: Product[];

  constructor() {
    if(!this.id) {
        this.id = uuid();
    }
  }
}