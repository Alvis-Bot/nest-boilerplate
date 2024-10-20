import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../shared/prisma.service';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a user if email does not exist', async () => {
      const userCreateInput = {
        email: 'test@example.com',
        password: '123456',
      };

      // Mock exists method to return false (email does not exist)
      jest.spyOn(service, 'exists').mockResolvedValueOnce(false);

      // Mock prisma.user.create to return the created user object
      const createdUser = {
        id: 1,
        email: 'test@example.com',
        password: '123456',
        full_name: null,
      };
      (prismaService.user.create as jest.Mock).mockResolvedValueOnce(
        createdUser,
      );

      const result = await service.create(userCreateInput);
      expect(service.exists).toHaveBeenCalledWith({
        email: userCreateInput.email,
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userCreateInput,
      });
      expect(result).toEqual(createdUser);
    });

    it('should not create a user if email already exists', async () => {
      const userCreateInput: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: '123456',
      };

      // Mock exists method to return true (email exists)
      jest.spyOn(service, 'exists').mockResolvedValueOnce(true);

      const result = await service.create(userCreateInput);
      expect(service.exists).toHaveBeenCalledWith({
        email: userCreateInput.email,
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      const userWhereUniqueInput: Prisma.UserWhereUniqueInput = {
        email: 'test@example.com',
      };

      // Mock prisma.user.findUnique to return a user object
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.exists(userWhereUniqueInput);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: userWhereUniqueInput,
      });
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const userWhereUniqueInput: Prisma.UserWhereUniqueInput = {
        email: 'test@example.com',
      };

      // Mock prisma.user.findUnique to return null (user not found)
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.exists(userWhereUniqueInput);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: userWhereUniqueInput,
      });
      expect(result).toBe(false);
    });
  });
});
