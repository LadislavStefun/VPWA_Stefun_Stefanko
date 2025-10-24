import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Channel, ChannelType } from '../types'

export const useChannelsStore = defineStore('channels', () => {
    const channels = ref<Channel[]>([
        {
            id: '1',
            name: 'test 1',
            type: 'public',
            isNew: true,
            isActive: true,
        },
        {
            id: '2',
            name: 'test 2',
            type: 'private',
            isNew: false,
            isActive: false,
        },
        {
            id: '3',
            name: 'test 3',
            type: 'public',
            isNew: false,
            isActive: false,
        },
        {
            id: '4',
            name: 'test 4',
            type: 'public',
            isNew: false,
            isActive: false,
        },
    ])

    const activeChannelId = ref<string | null>('1')

    const activeChannel = computed(() =>
        channels.value.find(ch => ch.id === activeChannelId.value)
    )

    const publicChannels = computed(() =>
        channels.value.filter(ch => ch.type === 'public')
    )

    const privateChannels = computed(() =>
        channels.value.filter(ch => ch.type === 'private')
    )


    const setActiveChannel = (channelId: string) => {
        if (activeChannel.value) {
            const prevChannel = channels.value.find(ch => ch.id === activeChannelId.value)
            if (prevChannel) prevChannel.isActive = false

        }
        activeChannelId.value = channelId
        const channel = channels.value.find(ch => ch.id === channelId)
        if (channel) {
            channel.isActive = true;
        }

    }

    const setNewChannel = (channelId: string) => {
        channels.value.forEach(channel => {
            channel.isNew = false
        })

        const channel = channels.value.find(ch => ch.id == channelId)
        if (channel) {
            channel.isNew = true
        }
    }

    const deleteChannel = (channelId: string) => {
        channels.value = channels.value.filter((ch) => ch.id !== channelId)
    }

    const addChannel = (name: string, type: ChannelType) => {
        const id = crypto.randomUUID()
        const newChannel: Channel = {
            id: id,
            name: name,
            type: type,
            isActive: false,
            isNew: true,
        }
        channels.value = [...channels.value, newChannel]
        setActiveChannel(id)
        setNewChannel(id)

    }

    return {
        channels,
        activeChannelId,

        activeChannel,
        publicChannels,
        privateChannels,

        setActiveChannel,
        setNewChannel,
        addChannel,
        deleteChannel

    }

})