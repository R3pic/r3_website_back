import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();

    const sequence = await this.postCount.findFirst();
    if (!sequence) {
      await this.postCount.create({
        data: {
          postId: 1,
        },
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getLastPostId() {
    const counter = await this.postCount.findFirst();
    const postId = counter.postId;
    await this.postCount.update({
      where: { id: counter.id },
      data: { postId: counter.postId + 1 },
    });
    return postId;
  }
}
