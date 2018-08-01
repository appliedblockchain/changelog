#! /usr/bin/env node

const { execSync } = require('child_process')

const puts = console.log
const sh = cmd => execSync(cmd, { encoding: 'utf8' }).trim()
const linesOf = cmd => sh(cmd).split('\n').map(_1 => _1.trim()).filter(Boolean)
const tagsOf = () => linesOf('git for-each-ref --sort=taggerdate --format \'%(tag)\' refs/tags | tail -r')
const dateOf = tag => sh(`git log -1 --format=%ai ${tag} | awk '{ print $1 }'`)
const logsOf = (tag1, tag2) => linesOf(`git log ${tag1}...${tag2} --pretty=format:'%s'`).filter(Boolean)
const withDot = $1 => $1.endsWith('.') ? $1 : `${$1}.`
const withCapital = $1 => $1.charAt(0).toUpperCase() + $1.slice(1)
const sentenceOf = $1 => withDot(withCapital($1))

const isValuableLog = log => {
  if (typeof log !== 'string') {
    return false
  }
  if (/^\d+\.\d+\.\d+$/.test(log)) {
    return false
  }
  if (log.startsWith('Merge pull request #')) {
    return false
  }
  if (log.startsWith('Merge branch')) {
    return false
  }
  return true
}

puts('# Changelog')

const tags = tagsOf()
const dates = tags.map(dateOf)

for (let i = 0; i < tags.length - 1; i++) {
  const tag = tags[i]
  const tag2 = tags[i + 1]
  const date = dates[i]
  puts(`\n## ${tag} (${date})\n`)
  let logs = logsOf(tag2, tag).filter(isValuableLog)
  if (!logs.length) {
    logs = [ 'No changes.' ]
  }
  for (const log of logs) {
    puts(`* ${sentenceOf(log)}`)
  }
}
