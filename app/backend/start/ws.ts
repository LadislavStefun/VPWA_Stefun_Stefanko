// start/ws.ts
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import env from '#start/env'
import { Server } from 'socket.io'
import type { Socket } from 'socket.io'
import authService from '#services/socket_auth_service'
import ActivityController from '#controllers/ws/activity_controller'
import ChannelManagementController from '#controllers/ws/channel/management_controller'
import ChannelMembershipController from '#controllers/ws/channel/membership_controller'
import ChannelRoomController from '#controllers/ws/channel/room_controller'
import ChannelMessageController from '#controllers/ws/channel/message_controller'

const activityController = new ActivityController()
const channelManagementController = new ChannelManagementController()
const channelMembershipController = new ChannelMembershipController()
const channelRoomController = new ChannelRoomController()
const channelMessageController = new ChannelMessageController()

let io: Server | null = null

app.ready(() => {
  const nodeServer = server.getNodeServer()
  if (!nodeServer) {
    console.error('HTTP server not ready. Cannot attach Socket.IO.')
    return
  }

  const frontendOrigin = env.get('FRONTEND_URL') || '*'

  io = new Server(nodeServer, {
    cors: {
      origin: frontendOrigin,
      credentials: frontendOrigin !== '*',
    },
  })

  const authorize = async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const user = await authService.authenticate(socket)
      socket.data.user = user
      next()
    } catch (error) {
      next(error)
    }
  }

  io.use(authorize)
  io.of('/channels').use(authorize)

  io.of('/').on('connection', (socket) => {
    activityController.onConnected(socket)

    socket.on('disconnect', (reason) => {
      activityController.onDisconnected(socket, reason)
    })
  })

  io.of('/channels').on('connection', (socket) => {
    channelManagementController.register(socket)
    channelMembershipController.register(socket)
    channelRoomController.register(socket)
    channelMessageController.register(socket)
  })
})

export { io }
