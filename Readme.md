
```
# Install in your project:
npx jq '.scripts.changelog = "npx @appliedblockchain/changelog changelog > Changelog.md"' > package.json

# Regenerate changelog:
npm run changelog

# Commit:
git add Changelog.md
git commit -m "Updating changelog."
git push
```
