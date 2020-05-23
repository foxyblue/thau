// @ts-ignore
import yaml from 'js-yaml'
import fs from 'fs'
import { extname } from 'path'
import { Configs, defaultConfigs } from '.'

const readFromFile = (filepath: string) => {
  const ext = extname(filepath)
  if (ext !== '.json' && ext !== '.yaml' && ext !== '.yml') {
    throw new Error(
      `Provided configuration file ${filepath} does not have json or yaml extension`
    )
  }

  let configs: Configs
  if (ext === '.json') {
    configs = require(filepath)
  } else {
    let fileContents = fs.readFileSync(filepath, 'utf8')
    configs = yaml.safeLoad(fileContents)
  }

  configs = {
    ...defaultConfigs,
    ...configs,
  }

  return configs
}

export default readFromFile
