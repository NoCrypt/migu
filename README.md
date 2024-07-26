<p align="center">
	<a href="https://github.com/ThaUnknown/miru">
		<img src="./common/public/logo_filled.png" width="200">
	</a>
</p>
<h1 align="center"><b>Migu</b></h1>

<h4 align="center"><b>Stream anime torrents, real-time with no waiting for downloads</b></h4>

**Migu** is a fork of [Miru](https://github.com/ThaUnknown/miru/) that focused on better **mobile** experience with added features and polished the experience by a mile.


## Changes from Miru

### Limited Bandwidth Options
- **Prevent Mini Player Loading Upon Startup:** By default, the mini player does not load on startup resulting in less bandwidth usage (this can be toggled).
- **Separate Download and Upload Limits:** Allows setting different limits for downloading and uploading. Give user more control.

### Mobile Focused Fixes

- **AMOLED Theme:** Adds a sleek, battery-saving dark theme for AMOLED displays.
- **Back Button Functionality:** The back button now works as expected. *Shocking I know!* 🤯
- **Status Bar Enhancement:** The status bar now displays and hides dynamically when playing video in fullscreen. *Shocking I know!* 🤯
- **Improved Tab Navigation:** Changing tabs now reliably switches to the selected tab, closing any modals. *Shocking I know!* 🤯
- **Modal Behavior:** Re-clicking the "Now Playing" tab will now close the modal.
- **Fullscreen Video Playback:** Videos now play in fullscreen by default, enhancing the viewing experience.


#### Why?
Mobile users often have limited bandwidth or data quotas. Miru can consume up to 1GB per 3 minutes upon startup due to miniplayer, which is impractical for mobile users since you might want to watch other anime but the miniplayer just keep running upon startup[.](https://rentry.org/miguarg)


## **Building and Development**

<sub>[~~*dont.*~~](https://github.com/ThaUnknown/miru/#:~:text=Building%20and%20Development-,dont,-Dependencies%3A)</sub>

<u>***Please do! I highly encourage this!***</u>


### Requirements
- PNPM (any packgage manager will do)
- Nodejs LTS
- Docker (with WSL support if you're on windows)
- ADB
- Android Studio (with SDK 33, **EXACTLY 33**, no more no less)

### Preparation
- `pnpm install`

### Building for PC (electron)
- `cd electron`
- `pnpm install`
- Development: `pnpm start`
- Release: `pnpm build`

### Building for Android (capacitor)
- `cd capacitor`
- `pnpm install`
- Check what's missing: `pnpm exec cap doctor`
- Windows: `pnpm build:native-win` || Linux: `pnpm build:native`
- (optional) Generate Assets: `pnpm dlx @capacitor/assets generate --iconBackgroundColor #20a2ff --iconBackgroundColorDark #20a2ff --splashBackgroundColor #20a2ff --splashBackgroundColorDark #20a2ff --android` (built-in forked capacitor/assets from this project didnt work for me)
- `pnpm exec cap open android`
- Connect your phone with ADB
- Development: `pnpm build:web` then `pnpm start`
- Release: `pnpm test:e2e`

## License

This project acknowledges and complies with the GPLv3 license.