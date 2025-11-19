import type { Socket } from 'socket.io'
import type User from '#models/user'

export type AckResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      message: string
    }

export type AckFn<T = unknown> = (response: AckResponse<T>) => void

export function respondError<T>(socket: Socket, ack: AckFn<T> | undefined, message: string) {
  if (ack) {
    ack({ success: false, message })
  } else {
    socket.emit('channel:error', { message })
  }
}

export function respondSuccess<T>(ack: AckFn<T> | undefined, data: T) {
  if (ack) {
    ack({ success: true, data })
  }
}

export function ensureUser<T>(socket: Socket, ack?: AckFn<T>): User | null {
  const user = socket.data.user as User | undefined
  if (!user) {
    respondError(socket, ack, 'Unauthorized')
    return null
  }
  return user
}

export function handleException<T>(socket: Socket, ack: AckFn<T> | undefined, error: unknown) {
  console.error('Channel namespace error:', error)
  if (typeof error === 'object' && error && 'messages' in error) {
    const messages = (error as { messages?: { message?: string }[] }).messages
    if (messages && messages[0]?.message) {
      respondError(socket, ack, messages[0].message)
      return
    }
  }
  const message = error instanceof Error ? error.message : 'Unexpected channel error'
  respondError(socket, ack, message)
}
