import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// 这就是我们给金库画的图纸，规定了要有 name 和 milestone 两个字段
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  milestone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);