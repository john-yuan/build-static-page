import { readAsString } from './readAsString'

it('should read null as empty string', () => {
  expect(readAsString(null)).toBe('')
})

it('should read undefined as empty string', () => {
  expect(readAsString(undefined)).toBe('')
})

it('should convert non-string value to string', () => {
  expect(readAsString(1)).toBe('1')
  expect(readAsString(true)).toBe('true')
})
