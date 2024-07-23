#!/bin/bash

## This is what lacks of doc did to a newbie :<

mv android android_tmp
pnpm exec cap add android
cp -r android_tmp/* android/
rm -rf android_tmp