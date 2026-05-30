import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const eventConfigs = [
  {
    name: "hanh-trinh-di-san",
    dir: path.resolve("public/events/hanh-trinh-di-san"),
  },
  {
    name: "su-kien-ra-mat",
    dir: path.resolve("public/events/su-kien-ra-mat"),
  },
]

const sourceExtensions = new Set([".jpg", ".jpeg", ".png"])
const maxDimension = 1800
const quality = 78

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

async function optimizeDirectory({ name, dir }) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const sourceFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => sourceExtensions.has(path.extname(fileName).toLowerCase()))
    .sort(naturalSort)

  if (sourceFiles.length === 0) {
    console.log(`[skip] ${name}: no source images found in ${dir}`)
    return
  }

  const generated = []

  for (const [index, fileName] of sourceFiles.entries()) {
    const inputPath = path.join(dir, fileName)
    const outputPath = path.join(dir, `${index + 1}.webp`)

    await sharp(inputPath)
      .rotate()
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 6,
      })
      .toFile(outputPath)

    generated.push(path.basename(outputPath))
  }

  console.log(`[done] ${name}: generated ${generated.length} webp files`)
  console.log(`        ${generated.join(", ")}`)
}

async function main() {
  for (const config of eventConfigs) {
    await optimizeDirectory(config)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
