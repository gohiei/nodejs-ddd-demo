import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_password' })
export class UserPasswordModel {
  @PrimaryColumn()
  user_id: string;

  @Column()
  hash: string;

  @Column()
  encrypted_password: Buffer;

  @Column()
  modified_at: Date = new Date();

  @Column()
  expired_at: Date = new Date();

  @Column()
  reset: boolean;
}
