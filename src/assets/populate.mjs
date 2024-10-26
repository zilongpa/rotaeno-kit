import fs from 'fs/promises'

const DIFFICULTY_LEVEL_SORT = ['I', 'II', 'III', 'IV', 'IV-α']

async function main() {
  const charts = JSON.parse(await fs.readFile('./charts_without_slug.json', 'utf-8'))
  const slugMap = JSON.parse(await fs.readFile('./slug_map.json', 'utf-8'))

  const mapped = charts.map((chart) => {
    const slug = slugMap.find((slug) => slug.name === chart.name)?.slug
    return { ...chart, slug }
  })

  const grouped = {}
  for (const chart of mapped) {
    if (!grouped[chart.slug]) {
      grouped[chart.slug] = []
    }
    grouped[chart.slug].push(chart)
  }

  const songs = []
  for (const slug in grouped) {
    const first = grouped[slug][0]
    const charts = grouped[slug].map((chart) => ({
      defaultIndex: chart.defaultIndex,
      updateIndex: chart.updateIndex,
      version: chart.version,
      difficultyLevel: chart.difficultyLevel,
      difficultyDecimal: chart.difficultyDecimal,
    }))
    charts.sort(
      (a, b) =>
        DIFFICULTY_LEVEL_SORT.indexOf(a.difficultyLevel) -
        DIFFICULTY_LEVEL_SORT.indexOf(b.difficultyLevel)
    )

    songs.push({
      name: first.name,
      slug: first.slug,
      category: first.categoryName,
      charts: charts,
    })
  }

  await fs.writeFile('./songs.json', JSON.stringify(songs, null, 2))
}

main()
