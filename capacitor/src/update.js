import { App } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';

export class AutoUpdater {
  constructor(githubApiUrl) {
    this.githubApiUrl = githubApiUrl;
    this.currentVersion = null;
    this.appInfo = null;
    this.cpuArchitecture = null;
  }

  async initialize() {
    const info = await App.getInfo();
    this.appInfo = info;
    this.currentVersion = info.version;
    this.cpuArchitecture = await this.getCPUArchitecture();
  }

  async getCPUArchitecture() {
    const versionMap = {'arm64-v8a': 1, 'armeabi-v7a': 2, 'x86': 3, 'universal': 4}; //5: debug
    const {build} = this.appInfo;
   
    if (build.length === 7) {
      const architectureCode = parseInt(build.substring(0, 1));
      if (architectureCode < 5) {
        for (const [arch, code] of Object.entries(versionMap)) {
          if (code === architectureCode) {
            return arch;
          }
        }
      } else if (architectureCode === 5) {
        return 'arm64-v8a';
      }
    }
 
    // If version code doesn't match expected format or no match found
    return 'universal';
  }

  async checkForUpdate() {
    try {
      const response = await fetch(this.githubApiUrl);
      const releaseInfo = await response.json();
     
      const latestVersion = releaseInfo.tag_name.replace('v', '');
      return this.isNewerVersion(latestVersion, this.currentVersion);
    } catch (error) {
      console.error('Error checking for update:', error);
      return false;
    }
  }

  isNewerVersion(latestVersion, currentVersion) {
    const latest = latestVersion.split('.').map(Number);
    const current = currentVersion.split('.').map(Number);
    for (let i = 0; i < latest.length; i++) {
      if (latest[i] > current[i]) return true;
      if (latest[i] < current[i]) return false;
    }
    return false;
  }

  async openUpdateUrl() {
    try {
      const response = await fetch(this.githubApiUrl);
      const releaseInfo = await response.json();
      
      const assetName = `android-Migu-${releaseInfo.tag_name}-${this.cpuArchitecture}.apk`;
      const asset = releaseInfo.assets.find(a => a.name === assetName);
      
      if (!asset) {
        console.error('Update file not found', assetName);
        return;
      }

      // Open the specific asset download URL using AppLauncher
      await AppLauncher.openUrl({ url: asset.browser_download_url });
    } catch (error) {
      console.error('Error opening update URL:', error);
    }
  }

  async performUpdate() {
      await this.openUpdateUrl();
  }
}