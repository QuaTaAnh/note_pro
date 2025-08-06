import { Module } from '@nestjs/common';
import { HasuraModule } from 'src/hasura/hasura.module';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [HasuraModule],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
