import { App } from '@capacitor/app'
import { NodeJS } from 'capacitor-nodejs'
import EventEmitter from 'events'
import { AutoUpdater } from './update'

const ready = NodeJS.whenReady()

const main = new EventEmitter()

export default main

main.on('portRequest', async () => {
  globalThis.port = {
    onmessage: cb => {
      NodeJS.addListener('ipc', ({ args }) => cb(args[0]))
    },
    postMessage: (data, b) => {
      NodeJS.send({ eventName: 'ipc', args: [{ data }] })
    }
  }
  await ready
  NodeJS.send({ eventName: 'port-init', args: [localStorage.getItem('settings')] })
  main.emit('port')
})

const [_platform, arch] = navigator.platform.split(' ')

globalThis.version = {
  platform: globalThis.cordova?.platformId,
  arch
}

main.once('version', async () => {
  const { version } = await App.getInfo()
  main.emit('version', version)
})

const updater = new AutoUpdater('https://api.github.com/repos/NoCrypt/migu/releases/latest');
main.on('update', async () => {
  console.log('[Android Updater] Checking for update...')
  await updater.initialize()
  // await updater.performUpdate();
  if (await updater.checkForUpdate()) main.emit('android-update-available')
})

main.on('android-install-update', async () => {
  await updater.performUpdate();
})