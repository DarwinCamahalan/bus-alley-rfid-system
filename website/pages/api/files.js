import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const dirPath = path.join(process.cwd(), 'public', 'files')
  const files = await fs.promises.readdir(dirPath)
  const urls = files
    .filter((file) => path.extname(file) === '.pdf')
    .map((file) => `/files/${file}`)
  res.status(200).json(urls)
}
