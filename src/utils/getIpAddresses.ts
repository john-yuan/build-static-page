import { networkInterfaces } from 'os'

export const getIpAddresses = (): string[] => {
  const interfaces = networkInterfaces()
  const addresses: string[] = []

  for (const name in interfaces) {
    const infos = interfaces[name]

    infos?.forEach((info) => {
      if (info.family === 'IPv4') {
        addresses.push(info.address)
      }
    })
  }

  if (addresses[0] !== '127.0.0.1') {
    addresses.reverse()
  }

  return addresses
}
