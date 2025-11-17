// // start/ws.ts
// import server from '@adonisjs/core/services/server'
// import env from '#start/env'
// import { Server } from 'socket.io'
// import authService from '#services/socket_auth_service'
// import activityController from '#controllers/ws/activity_controller'
// import channelController from '#controllers/ws/channel_controller'

// const io = new Server(server.getNodeServer(), {
//   cors: {
//     origin: '*',
//     credentials: true,
//   },
// })

// io.use(async (socket, next) => {
//   try {
//     const user = await authService.authenticate(socket.handshake)
//     socket.data.user = user
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

// io.of('/').on('connection', (socket) => {
//   activityController.onConnected(socket)

//   socket.on('disconnect', (reason) => {
//     activityController.onDisconnected(socket, reason)
//   })
// })

// const channelsNs = io.of('/channels')
// channelsNs.on('connection', (socket) => {
//   channelController.registerHandlers(socket)

//   socket.on('join', async ({ channelId }) => {
//     await channelController.joinChannel(socket, channelId)
//   })

//   socket.on('message:add', async (payload) => {
//     await channelController.addMessage(socket, payload)
//   })
// })

// export { io }
