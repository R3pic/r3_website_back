import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from 'src/dto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from 'src/dto/user.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('access'))
  @Post('create')
  async createPost(@Body() postDto: CreatePostDto, @Req() req: Request & UserInterface) {
    const user_id = req.user.user_id;
    return this.postService.createPost(postDto, user_id);
  }

  @Get('recent')
  async getRecentPosts() {
    return this.postService.getRecentPosts(10);
  }

  @Get(':user_id')
  async getUserPosts(@Param('user_id') user_id: string) {
    console.log('유저 포스트 요청 ', user_id);
    return this.postService.getUserPosts(user_id);
  }
}
