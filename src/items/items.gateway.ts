import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Server, Socket as BaseSocket } from 'socket.io';

interface Socket extends BaseSocket {
  request: {
    user?: any;
  } & BaseSocket['request'];
}

// import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ItemsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly itemsService: ItemsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    console.log('Token:', token);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('Decoded Token:', decoded);
      client.request.user = decoded;
    } catch (error) {
      console.error('Invalid token:', error.message);
      client.disconnect();
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('createItem')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createItemDto: CreateItemDto,
  ): Promise<CreateItemDto> {
    const user = client.request.user.sub;
    const item = await this.itemsService.create(createItemDto, user);
    this.server.emit('itemCreated', item);
    return item;
  }

  @SubscribeMessage('findAllItems')
  async findAll(): Promise<CreateItemDto[]> {
    const items = await this.itemsService.findAll();
    this.server.emit('allItems', items);
    return items;
  }

  @SubscribeMessage('findOneItem')
  findOne(@MessageBody() id: string) {
    const item = this.itemsService.findOne(id);
    this.server.emit('itemFound', item);
    return item;
  }

  @SubscribeMessage('updateItem')
  async update(@MessageBody() updateItemDto: UpdateItemDto) {
    const updatedItem = await this.itemsService.update(
      updateItemDto.id,
      updateItemDto,
    );
    this.server.emit('itemUpdated', updatedItem);
    return updatedItem;
  }

  @SubscribeMessage('removeItem')
  remove(@MessageBody() id: string) {
    return this.itemsService.remove(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('typing')
  handleTyping(
    // @Request() req,
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { isTyping: boolean },
  ) {
    // const username = req.user.username;
    const username = client.request.user?.username || 'Unknown';
    console.log('User:', username);
    client.broadcast.emit('userTyping', {
      typing: payload.isTyping,
      userId: client.id,
      username: username,
      // userId: user,
    });
  }
}
