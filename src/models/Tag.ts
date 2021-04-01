import { Entity, PrimaryColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

import ProductTag from './ProductTag'

@Entity('tags')
export default class Tag {

  @PrimaryColumn()
  readonly id: string;

  @Column()
  tag: string;

  constructor() {
    if(!this.id) {
        this.id = uuid();
    }
}

}