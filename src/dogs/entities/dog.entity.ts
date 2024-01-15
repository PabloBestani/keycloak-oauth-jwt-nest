import { Entity } from 'typeorm';

@Entity()
export class Dog {
  id: number;

  name: string;

  age: number;
}
