
## This is what lacks of doc did to a newbie :<

Rename-Item -Path "android" -NewName "android_tmp"
pnpm exec cap add android
Copy-Item -Path "android_tmp\*" -Destination "android" -Recurse -Force
Remove-Item -Path "android_tmp" -Recurse -Force
