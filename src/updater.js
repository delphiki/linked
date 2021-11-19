import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

var updatesAvailableCurrently

const DIALOG_OPTS = {
    title: "Check for updates",
    message: "There's a Linked update available. Do you want to update?",
    type: "question",
    buttons: ["No", "OK"],
    defaultId: 1, // ok button
    noLink: true
}

autoUpdater.autoDownload = false

function setupUpdates() {
    autoUpdater.on('update-available', async () => {
        updatesAvailableCurrently = true
        const { response } = await dialog.showMessageBox(DIALOG_OPTS)
        if (response === 1) { //ok button has been clicked
            autoUpdater.downloadUpdate()
        }
    })
    autoUpdater.on('update-not-available', () => {
        updatesAvailableCurrently = false
    })
    autoUpdater.on('update-downloaded', async () => {
        app.quit()
        app.relaunch()
    })
    setInterval(() => askForUpdates(), global.storage.get("updateInterval"))
}

export default { setupUpdates, askForUpdates, updatesAvailableCurrently }
