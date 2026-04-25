import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, title: string, content: string) {
    return this.prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: { author: true },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, profilePic: true, industry: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(id: string, authorId: string) {
    const post = await this.findOne(id);
    if (post.authorId !== authorId) throw new Error('Unauthorized');
    return this.prisma.post.delete({ where: { id } });
  }
}
