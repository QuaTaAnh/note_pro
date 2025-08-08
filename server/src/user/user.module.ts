import { Module } from '@nestjs/common';
import { HasuraModule } from 'src/hasura/hasura.module';
import { UserService } from './user.service';

@Module({
  imports: [HasuraModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
