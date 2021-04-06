import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, JoinTable, OneToMany, ManyToMany } from 'typeorm';

import Image from './Image'
import Tag from './Tag';

@Entity('categories')
export default class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Image, image => image.category, {
    cascade: true
  })
  @JoinColumn({ name: 'product_id' })
  images: Image[];

  @ManyToMany(() => Tag, tag => tag.categories, {
    cascade: true
  })
  @JoinTable()
  tags!: Tag[];
  
}