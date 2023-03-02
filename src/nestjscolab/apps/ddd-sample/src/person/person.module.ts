import { Module } from '@nestjs/common';

import { DddModule } from '@nestjscolab/ddd';

@Module({
  imports: [DddModule],
})
export class PersonModule {}
