import { boot } from 'quasar/wrappers'
import ChannelSocketManager from 'src/services/ChannelSocketManager'

export default boot(() => {
    // Inicializácia ChannelSocketManager pri štarte aplikácie
    // Socket sa automaticky pripojí keď bude mať užívateľ token
    console.log('Socket manager initialized', ChannelSocketManager)
})