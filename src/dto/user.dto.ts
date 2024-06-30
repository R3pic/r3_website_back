import { User } from '@prisma/client';

export class UserInterface {
  user: Pick<User, 'user_id' | 'nickname'>;
}
