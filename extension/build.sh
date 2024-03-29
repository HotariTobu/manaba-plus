rm -r "dist"
tsc
vite build

dest="dest/v${npm_package_version}"
mkdir -p "${dest}"
cd "dist"
npx bestzip "../${dest}/Manaba_Plus_v${npm_package_version}_${BROWSER}.zip" *
