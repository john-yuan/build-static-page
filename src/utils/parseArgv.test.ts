import { parseArgv } from './parseArgv'

it('should contain the source passed in', () => {
  const source = ['--init', '--config=path/to/config']
  const result = parseArgv([...source])

  expect(result.source).toEqual(source)
})

it('should not refer to source passed in', () => {
  const source = ['--init', '--config=path/to/config']
  const result = parseArgv(source)

  expect(result.source === source).toBe(false)
})

it('should not change source passed in', () => {
  const source = ['--init', '--config=path/to/config']
  const sourceCopy = [...source]

  parseArgv(source)

  expect(source).toEqual(sourceCopy)
})

it('should parse actions correctly', () => {
  const source = ['serve']
  const result = parseArgv(source)

  expect(result.actions).toEqual(['serve'])
})

it('should parse options correctly', () => {
  const source = ['--init', '--config=path/to/config']
  const result = parseArgv(source)

  expect(result.options).toEqual(['init', 'config'])
  expect(result.option.init).toBe(true)
  expect(result.option.config).toBe('path/to/config')
})

it('should ignore empty options', () => {
  const source = ['--', '--=']
  const result = parseArgv(source)

  expect(result.options).toHaveLength(0)
  expect(result.option).toEqual({})
})
