import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User as UserModel } from '@prisma/client';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers: UserModel[] = [
        {
          user_id: '1',
          id: '',
          createdAt: undefined,
          password: '',
          nickname: '',
        },
      ];
      jest.spyOn(userService, 'getUsers').mockResolvedValue(mockUsers);

      const result: UserModel[] = await userController.getUsers();
      expect(result).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const newUser: UserModel = {
        user_id: '2',
        nickname: 'New User',
        id: '',
        createdAt: undefined,
        password: '',
      };
      const createdUser: UserModel = {
        user_id: '1',
        nickname: 'Test User',
        id: '',
        createdAt: undefined,
        password: '',
      };
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result: UserModel = await userController.createUser(newUser);
      expect(result).toEqual(createdUser);
      expect(userService.createUser).toHaveBeenCalledWith(newUser);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const mockUser: UserModel = {
        user_id: '1',
        nickname: 'Test User',
        id: '',
        createdAt: undefined,
        password: '',
      };
      jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);

      const result: UserModel = await userController.getUser('1');
      expect(result).toEqual(mockUser);
      expect(userService.getUser).toHaveBeenCalledWith({ user_id: '1' });
    });
  });

  describe('nicknameUpdate', () => {
    it('should update and return a user', async () => {
      const updatedUser: UserModel = {
        user_id: '1',
        nickname: 'Updated User',
        id: '',
        createdAt: undefined,
        password: '',
      };
      jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser);

      const result: UserModel = await userController.nicknameUpdate(
        '1',
        'Updated User',
      );
      expect(result).toEqual(updatedUser);
      expect(userService.updateUser).toHaveBeenCalledWith({
        where: { user_id: '1' },
        data: { nickname: 'Updated User' },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete and return a user', async () => {
      const deletedUser: UserModel = {
        user_id: '1',
        nickname: 'Deleted User',
        id: '',
        createdAt: undefined,
        password: '',
      };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(deletedUser);

      const result: UserModel = await userController.deleteUser('1');
      expect(result).toEqual(deletedUser);
      expect(userService.deleteUser).toHaveBeenCalledWith({ user_id: '1' });
    });
  });
});
