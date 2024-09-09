import { Client } from 'discord-rpc'
import { ipcMain } from 'electron'
import { debounce } from '@/modules/util.js'

export default class Discord {
  defaultStatus = {
    activity: {
      timestamps: { start: Date.now() },
      details: 'Stream anime torrents, real-time.',
      state: 'Watching anime',
      assets: {
        small_image: 'logo',
        small_text: 'https://github.com/NoCrypt/migu'
      },
      buttons: [
        {
          label: 'Download app',
          url: 'https://github.com/NoCrypt/migu/releases/latest'
        }
      ],
      instance: true,
      type: 3
    }
  }

  discord = new Client({ transport: 'ipc' })

  /** @type {Discord['defaultStatus'] | undefined} */
  allowDiscordDetails
  /** @type {Discord['defaultStatus'] | undefined} */
  cachedPresence

  rpcEnabled = false  // Property to track RPC state

  /** @param {import('electron').BrowserWindow} window */
  constructor (window) {
    ipcMain.on('show-discord-status', (event, data) => {
      this.allowDiscordDetails = data
      this.debouncedDiscordRPC(this.allowDiscordDetails && this.rpcEnabled ? this.cachedPresence : undefined)
    })

    ipcMain.on('discord', (event, data) => {
      this.cachedPresence = data
      this.debouncedDiscordRPC(this.allowDiscordDetails && this.rpcEnabled ? this.cachedPresence : undefined)
    })

    ipcMain.on('toggle-rpc', (event, data) => {
      this.toggleRPC(data)
    })

    this.discord.on('ready', async () => {
      if (this.rpcEnabled) {
        this.setDiscordRPC(this.cachedPresence || this.defaultStatus)
        this.discord.subscribe('ACTIVITY_JOIN_REQUEST')
        this.discord.subscribe('ACTIVITY_JOIN')
        this.discord.subscribe('ACTIVITY_SPECTATE')
      }
    })

    this.discord.on('ACTIVITY_JOIN', ({ secret }) => {
      window.webContents.send('w2glink', secret)
    })

    this.loginRPC()

    this.debouncedDiscordRPC = debounce(status => this.setDiscordRPC(status), 4500)
  }

  loginRPC () {
    if (this.rpcEnabled) {
      this.discord.login({ clientId: '1267153966714589235' }).catch(() => {
        setTimeout(() => this.loginRPC(), 5000).unref()
      })
    }
  }

  setDiscordRPC (data = this.defaultStatus) {
    if (this.discord.user && data && this.rpcEnabled) {
      data.pid = process.pid
      this.discord.request('SET_ACTIVITY', data)
    }
  }

  clearDiscordRPC () {
    if (this.discord.user) {
      this.discord.request('SET_ACTIVITY', { pid: process.pid })
    }
  }

  toggleRPC (enabled) {
    this.rpcEnabled = enabled
    if (this.rpcEnabled) {
      this.loginRPC()
      this.setDiscordRPC(this.cachedPresence || this.defaultStatus)
    } else {
      this.clearDiscordRPC()
    }
  }
}