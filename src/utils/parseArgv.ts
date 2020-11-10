export interface Argv {
  source: string[];
  actions: string[];
  options: string[];
  option: {
    [name: string]: string | boolean;
  }
}

export const parseArgv = (source: string[]) => {
  const argv: Argv = {
    source: [...source],
    actions: [],
    options: [],
    option: {}
  }

  source.forEach((arg) => {
    if (arg.indexOf('--') === 0) {
      const values = arg.substr(2).split('=')
      const name = values.shift()
      if (name) {
        argv.option[name] = values.length ? values.join('=') : true
        argv.options.push(name)
      }
    } else {
      argv.actions.push(arg)
    }
  })

  return argv
}
