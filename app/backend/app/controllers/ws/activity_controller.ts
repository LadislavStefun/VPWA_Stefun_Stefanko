import type { Socket } from 'socket.io'
import User from '#models/user'

function serializeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
  }
}

export default class ActivityController {
  private getUserRoom(userId: number) {
    return `user:${userId}`
  }

  public async onConnected(socket: Socket) {
    const user = socket.data.user as User | undefined
    if (!user) {
      socket.disconnect()
      return
    }

    const room = this.getUserRoom(user.id)
    const socketsInRoom = await socket.in(room).allSockets()

    if (socketsInRoom.size === 0) {
      socket.broadcast.emit('user:online', serializeUser(user))
    }

    socket.join(room)
    socket.data.userId = user.id

    const remoteSockets = await socket.nsp.fetchSockets()
    const userIds = new Set<number>()

    for (const remote of remoteSockets) {
      if (remote.data.userId) {
        userIds.add(remote.data.userId)
      }
    }

    const onlineUsers = await User.findMany([...userIds])
    socket.emit('user:list', onlineUsers.map(serializeUser))
  }

  public async onDisconnected(socket: Socket) {
    const user = socket.data.user as User | undefined
    if (!user) {
      return
    }

    const room = this.getUserRoom(user.id)
    const socketsInRoom = await socket.in(room).allSockets()

    if (socketsInRoom.size === 0) {
      socket.broadcast.emit('user:offline', serializeUser(user))
    }
  }
}
