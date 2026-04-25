import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly SUPERADMIN_EMAIL = 'jcesperanza@neu.edu.ph';

  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(email: string, name?: string): Promise<User> {
    const role = email === this.SUPERADMIN_EMAIL ? Role.SUPERADMIN : Role.USER;

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        role: email === this.SUPERADMIN_EMAIL ? Role.SUPERADMIN : undefined, // Ensure superadmin stays superadmin
      },
      create: {
        email,
        name,
        role,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
