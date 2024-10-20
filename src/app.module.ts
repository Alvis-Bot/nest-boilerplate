import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [UsersModule, SharedModule],
})
export class AppModule {}
