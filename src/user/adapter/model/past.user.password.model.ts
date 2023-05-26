import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'past_user_password' })
export class PastUserPasswordModel {
  @PrimaryColumn()
  user_id: string;

  @Column()
  hash2: string;

  @Column()
  hash3: string;
}
