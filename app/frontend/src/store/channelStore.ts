import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Channel, ChannelType } from '../types'

export const useChannelsStore = defineStore('channels', () => {
    const channels = ref<Channel[]>([
        {
            id: '1',
            name: 'test 1',
            type: 'public',
            isPrivate: false,
            isNew: true,
            isActive: true,
        },
        {
            id: '2',
            name: 'test 2',
            type: 'private',
            isPrivate: true,
            isNew: false,
            isActive: false,
        },
        {
            id: '3',
            name: 'test 3',
            type: 'public',
            isPrivate: false,
            isNew: false,
            isActive: false,
        },
        {
            id: '4',
            name: 'test 4',
            type: 'public',
            isPrivate: false,
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
        console.log(`Active channel now : ${activeChannelId.value}`)
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

    const addChannel = (name: string, type: ChannelType)

    return {
        channels,
        activeChannelId,

        activeChannel,
        publicChannels,
        privateChannels,

        setActiveChannel

    }

})