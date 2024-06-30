import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from 'src/dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(postDto: CreatePostDto, user_id: string) {
    const postCount = await this.prisma.getLastPostId();

    const post = await this.prisma.post.create({
      data: {
        postId: postCount,
        content: postDto.content,
        authorId: user_id,
      },
    });

    return post;
  }

  async getRecentPosts(count: number) {
    const posts = await this.prisma.post.findMany({
      take: count,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: false,
        postId: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const getpostDtos = posts.map(post => {
      return {
        postId: post.postId,
        authorId: post.authorId,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nickname: post.author.nickname,
      };
    });

    return getpostDtos;
  }

  async getUserPosts(user_id: string) {
    const posts = await this.prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        authorId: user_id,
      },
      select: {
        id: false,
        postId: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const getpostDtos = posts.map(post => {
      return {
        postId: post.postId,
        authorId: post.authorId,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nickname: post.author.nickname,
      };
    });

    console.log('유저 포스트 요청 결과', getpostDtos);

    return getpostDtos;
  }
}
