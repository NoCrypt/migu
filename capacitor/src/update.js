import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

export class AutoUpdater {
  constructor(githubApiUrl) {
    this.githubApiUrl = githubApiUrl;
    this.currentVersion = null;
    this.appInfo = null;
  }

  async initialize() {
    const info = await App.getInfo();
    this.appInfo = info;
    this.currentVersion = info.version;
    this.cpuArchitecture = await this.getCPUArchitecture();
  }

  async removeCachedAPKs(){
    const list = await Filesystem.readdir({path: './', directory: Directory.Cache})
    for (const file of list.files) { 
      if (file.name.endsWith('.apk')) {
        await Filesystem.deleteFile({path: file.name, directory: Directory.Cache})
      }
    }
  }

  async getCPUArchitecture() {
    const versionMap = {'arm64-v8a': 1, 'armeabi-v7a': 2, 'x86': 3, 'universal': 4}; //5: debug
    const {build} = this.appInfo;
    
    if (build.length === 7) {
      const architectureCode = parseInt(build.substring(0, 1));
      console.log(architectureCode)
      
      if (architectureCode < 5) {
        for (const [arch, code] of Object.entries(versionMap)) {
          if (code === architectureCode) {
            return arch;
          }
        }
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
      // return true
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

  async downloadUpdate() {
    await this.removeCachedAPKs();
    try {
      const response = await fetch(this.githubApiUrl);
      const releaseInfo = await response.json();

      const assetName = `android-Migu-${releaseInfo.tag_name}-${this.cpuArchitecture}.apk`;
      const asset = releaseInfo.assets.find(a => a.name === assetName);

      if (!asset) {
        console.error('Update file not found', assetName);
        return null;
      }

      const fileName = `update-${releaseInfo.tag_name}.apk`;
      const result = await Filesystem.downloadFile({
        url: asset.browser_download_url,
        path: fileName,
        directory: Directory.Cache,
      });

      return result.path;
    } catch (error) {
      console.error('Error downloading update:', error);
      return null;
    }
  }

  async installUpdate(filePath) {
    try {
      await FileOpener.open({
        filePath,
        contentType: 'application/vnd.android.package-archive'
      });
    } catch (error) {
      console.error('Error installing update:', error);
    }
  }

  async performUpdate() {
    const filePath = await this.downloadUpdate();
    if (filePath) {
      await this.installUpdate(filePath);
    }
  }
}
