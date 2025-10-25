import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useChannelsStore } from './channelStore'
import type { Message } from 'src/types'


export const useMessagesStore = defineStore('messages', () => {
    const messages = ref<Message[]>([
        {
            id: 'msg1',
            channelId: '1',
            userId: 'user2',
            name: 'Meliško',
            text: [' @Martin Vždy je mi dobre aha'],
            tagged: true,
            sent: false,
            typing: false
        },
        {
            id: 'msg2',
            channelId: '1',
            userId: 'user1',
            name: 'Rytmus',
            text: ['Keď z neba modré aha'],
            tagged: false,
            sent: false,
            typing: true
        },
        {
            id: 'msg3',
            channelId: '1',
            userId: 'me',
            name: 'me',
            text: ['Príde až ku mne aha'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg4',
            channelId: '1',
            userId: 'user2',
            name: 'Meliško',
            text: ['@Gogo Za domom v humne aha'],
            tagged: true,
            sent: false,
            typing: true
        },
        {
            id: 'msg5',
            channelId: '1',
            userId: 'user3',
            name: 'Kali',
            text: ['Veľký svet v malom aha'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg6',
            channelId: '1',
            userId: 'me',
            name: 'me',
            text: ['Milujem slalom aha'],
            tagged: false,
            sent: true,
            typing: false
        },

        {
            id: 'msg7',
            channelId: '2',
            userId: 'user4',
            name: 'Gogo',
            text: ['@Meliško Kľučkujem dobre aha'],
            tagged: true,
            sent: false,
            typing: false
        },
        {
            id: 'msg8',
            channelId: '2',
            userId: 'me',
            name: 'me',
            text: ['Keď mám z neba modré aha'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg9',
            channelId: '2',
            userId: 'user5',
            name: 'Gleb',
            text: ['Keď sa z hrnca parí'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg10',
            channelId: '2',
            userId: 'user1',
            name: 'Rytmus',
            text: ['Mám doma Paríž'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg11',
            channelId: '2',
            userId: 'me',
            name: 'me',
            text: ['Poslúchať som musel'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg12',
            channelId: '2',
            userId: 'user2',
            name: 'Meliško',
            text: ['To bol pre mňa Brusel'],
            tagged: false,
            sent: false,
            typing: false
        },

        // Channel 3 - pokračovanie textov
        {
            id: 'msg13',
            channelId: '3',
            userId: 'user3',
            name: 'Kali',
            text: ['V Cíferi hotovo'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg14',
            channelId: '3',
            userId: 'me',
            name: 'me',
            text: ['Zdravíme Drieňovo'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg15',
            channelId: '3',
            userId: 'user4',
            name: 'Gogo',
            text: ['Robíme kto chce čo chce'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg16',
            channelId: '3',
            userId: 'user5',
            name: 'Gleb',
            text: ['Aj v obci Letanovce'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg17',
            channelId: '3',
            userId: 'me',
            name: 'me',
            text: ['Nestrácam nádej'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg18',
            channelId: '3',
            userId: 'user1',
            name: 'Rytmus',
            text: ['jakože Baden Baden'],
            tagged: false,
            sent: false,
            typing: false
        },

        // Channel 4 - ďalšie slovenské bary
        {
            id: 'msg19',
            channelId: '4',
            userId: 'user2',
            name: 'Meliško',
            text: ['Pri prehre v pinpongu'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg20',
            channelId: '4',
            userId: 'me',
            name: 'me',
            text: ['Duje až z Honkongu'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg21',
            channelId: '4',
            userId: 'user3',
            name: 'Kali',
            text: ['Za hlavou cítim Slavín'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg22',
            channelId: '4',
            userId: 'user4',
            name: 'Gogo',
            text: ['Až kým sa nezastavím'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg23',
            channelId: '4',
            userId: 'me',
            name: 'me',
            text: ['Po ceste v Meste Novom'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg24',
            channelId: '4',
            userId: 'user5',
            name: 'Gleb',
            text: ['Stred sveta je vo Vrbovom'],
            tagged: false,
            sent: false,
            typing: false
        },

        // Mixing ostatných riadkov do channelов
        {
            id: 'msg25',
            channelId: '1',
            userId: 'user1',
            name: 'Rytmus',
            text: ['Celý svet v srdci aha'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg26',
            channelId: '2',
            userId: 'me',
            name: 'me',
            text: ['A papierová Praha'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg27',
            channelId: '3',
            userId: 'user2',
            name: 'Meliško',
            text: ['Krakov či Varšava'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg28',
            channelId: '1',
            userId: 'user3',
            name: 'Kali',
            text: ['Vždy keď je oslava'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg29',
            channelId: '2',
            userId: 'me',
            name: 'me',
            text: ['Cestujem skromne'],
            tagged: false,
            sent: true,
            typing: false
        },
        {
            id: 'msg30',
            channelId: '3',
            userId: 'user4',
            name: 'Gogo',
            text: ['Celý svet vo mne'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg31',
            channelId: '1',
            userId: 'user5',
            name: 'Gleb',
            text: ['Ešte raz poviem aha'],
            tagged: false,
            sent: false,
            typing: false
        },
        {
            id: 'msg32',
            channelId: '2',
            userId: 'me',
            name: 'me',
            text: ['Skončím a ďalej ťahám'],
            tagged: false,
            sent: true,
            typing: false
        }
    ])

    const channelsStore = useChannelsStore()
    const getMessagesByChannel = (channelId: string) => {
        return computed(() =>
            messages.value
                .filter(msg => msg.channelId === channelId)
        )
    }
    const activeChannelMessages = computed(() => {
        if (!channelsStore.activeChannelId) return []
        return getMessagesByChannel(channelsStore.activeChannelId).value
    })

    const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
            ...message,
            id: `msg_${Date.now()}_${Math.random()}`,
        }

        messages.value.push(newMessage)

        return newMessage
    }

    return {

        messages,

        getMessagesByChannel,
        activeChannelMessages,

        addMessage,
    }
})