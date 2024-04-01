auto-changelog -p
git add package.json CHANGELOG.md
git commit -m "v${npm_package_version}"
git tag "v${npm_package_version}"
