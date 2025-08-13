// src/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id }, relations: ['item'] });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['item'] });
  }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const { username, password, email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('User already exists');

    const activationToken = crypto.randomBytes(32).toString('hex');

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      activationToken,
    });
    await this.usersRepository.save(user);

    // Send activation email
    // await this.sendActivationEmail(user.email, activationToken);
    return {
      message:
        'Registration successful! Check your email to activate your account.',
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    // If no user is found, return null immediately.
    if (!user) {
      return null;
    }
    // if (!user.isActive) throw new UnauthorizedException('Account not activated');
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async activateUser(token: string) {
    const user = await this.usersRepository.findOne({
      where: { activationToken: token },
    });
    if (!user) return null;

    user.isActive = true;
    user.activationToken = null; // Remove token after activation
    await this.usersRepository.save(user);
    return user;
  }

  async deactivateUser(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      return { message: 'User is already deactivated' };
    }

    user.isActive = false;
    await this.usersRepository.save(user);

    return { message: 'User deactivated successfully' };
  }

  async sendActivationEmail(email: string, token: string) {
    const activationUrl = `http://localhost:3000/api/user/activate?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate Your Account',
      text: `Click the following link to activate your account: ${activationUrl}`,
      html: `<p>Click <a href="${activationUrl}">here</a> to activate your account.</p>`,
    });
  }
}
