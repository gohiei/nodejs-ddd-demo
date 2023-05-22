import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserModel {
  @PrimaryColumn()
  id: string;

  @Column({ comment: '帳號' })
  username: string;

  @Column({ comment: '密碼' })
  password: string;

  @Column({ comment: '建立時間' })
  created_at: Date = new Date();

  @Column({ comment: '最後異動時間' })
  updated_at: Date = new Date();

  @Column({ comment: '刪除時間' })
  deleted_at: Date;
}
