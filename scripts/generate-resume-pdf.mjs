import fs from 'node:fs/promises'
import path from 'node:path'

const pageWidth = 595
const pageHeight = 842
const sidebarWidth = 178
const gutter = 28
const rightX = sidebarWidth + gutter
const rightWidth = pageWidth - rightX - 28

const colors = {
  ink: [42, 35, 40],
  muted: [113, 101, 108],
  pink: [238, 70, 120],
  pinkDeep: [216, 56, 105],
  blush: [255, 242, 246],
  blushDeep: [252, 229, 237],
  white: [255, 255, 255],
}

function rgb([r, g, b]) {
  return `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`
}

function escapeText(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function estimateWidth(text, size) {
  return text.length * size * 0.52
}

function wrapText(text, size, width) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (estimateWidth(next, size) <= width || !line) {
      line = next
      continue
    }
    lines.push(line)
    line = word
  }

  if (line) lines.push(line)
  return lines
}

class PdfComposer {
  constructor() {
    this.parts = []
  }

  push(command) {
    this.parts.push(command)
  }

  rect(x, y, width, height, fillColor, strokeColor = null, lineWidth = 1) {
    this.push('q')
    if (fillColor) this.push(`${rgb(fillColor)} rg`)
    if (strokeColor) {
      this.push(`${rgb(strokeColor)} RG`)
      this.push(`${lineWidth} w`)
    }
    this.push(`${x} ${y} ${width} ${height} re`)
    this.push(fillColor && strokeColor ? 'B' : fillColor ? 'f' : 'S')
    this.push('Q')
  }

  line(x1, y1, x2, y2, strokeColor, lineWidth = 1) {
    this.push('q')
    this.push(`${rgb(strokeColor)} RG`)
    this.push(`${lineWidth} w`)
    this.push(`${x1} ${y1} m`)
    this.push(`${x2} ${y2} l`)
    this.push('S')
    this.push('Q')
  }

  text(text, x, y, size = 12, font = 'F1', color = colors.ink) {
    this.push('BT')
    this.push(`/${font} ${size} Tf`)
    this.push(`${rgb(color)} rg`)
    this.push(`1 0 0 1 ${x} ${y} Tm`)
    this.push(`(${escapeText(text)}) Tj`)
    this.push('ET')
  }

  wrappedText(text, x, y, width, size = 12, font = 'F1', color = colors.ink, lineHeight = 1.35) {
    const lines = wrapText(text, size, width)
    lines.forEach((line, index) => {
      this.text(line, x, y - index * size * lineHeight, size, font, color)
    })
    return lines.length
  }

  pillLabel(text, x, y, width) {
    this.rect(x, y - 6, width, 22, colors.blush)
    this.text(text.toUpperCase(), x + 10, y, 10, 'F2', colors.pinkDeep)
  }

  sidebarList(title, items, startY, options = {}) {
    const titleSize = options.titleSize || 12
    const bodySize = options.bodySize || 10
    const lineHeight = options.lineHeight || 1.3
    const itemGap = options.itemGap || 10
    const textX = options.textX || 38
    const bulletX = options.bulletX || 24
    const width = options.width || sidebarWidth - 50

    this.text(title.toUpperCase(), 24, startY, titleSize, 'F2', colors.white)

    let y = startY - 22
    for (const item of items) {
      const lines = wrapText(item, bodySize, width)
      const blockHeight = Math.max(1, lines.length) * bodySize * lineHeight
      const bulletY = y - bodySize + 4

      this.rect(bulletX, bulletY, 6, 6, colors.white)
      this.wrappedText(item, textX, y, width, bodySize, 'F1', colors.white, lineHeight)
      y -= blockHeight + itemGap
    }

    return y
  }

  build() {
    return this.parts.join('\n')
  }
}

const pdf = new PdfComposer()

pdf.rect(0, 0, pageWidth, pageHeight, colors.white)
pdf.rect(0, 0, sidebarWidth, pageHeight, colors.pinkDeep)
pdf.rect(rightX - 12, pageHeight - 118, rightWidth + 24, 92, colors.blush)
pdf.rect(rightX + rightWidth - 84, pageHeight - 94, 56, 56, colors.blushDeep)

pdf.text('AZAN', 24, pageHeight - 56, 28, 'F2', colors.white)
pdf.text('Graphic Designer', 24, pageHeight - 76, 12, 'F1', colors.white)
pdf.text('Resume', 24, pageHeight - 101, 18, 'F3', colors.white)

pdf.text('AZAN', rightX, pageHeight - 60, 32, 'F2', colors.pinkDeep)
pdf.text('Graphic Designer and Prototyping Expert', rightX, pageHeight - 84, 13, 'F1', colors.ink)
pdf.line(rightX, pageHeight - 96, rightX + 148, pageHeight - 96, colors.pink, 2)

pdf.pillLabel('Profile', rightX, pageHeight - 136, 78)
pdf.wrappedText(
  'Creative graphic designer focused on branding, social media visuals, print design, and UI/UX prototyping. Experienced in turning ideas into clean, feminine, client-ready presentations and remote-first project delivery.',
  rightX,
  pageHeight - 166,
  rightWidth,
  11,
  'F1',
  colors.muted,
  1.5,
)

pdf.rect(rightX, pageHeight - 278, 106, 58, colors.blush)
pdf.rect(rightX + 118, pageHeight - 278, 106, 58, colors.blush)
pdf.rect(rightX + 236, pageHeight - 278, 106, 58, colors.blush)
pdf.text('3+', rightX + 18, pageHeight - 248, 24, 'F2', colors.pinkDeep)
pdf.text('Years Experience', rightX + 18, pageHeight - 264, 10, 'F1', colors.muted)
pdf.text('100+', rightX + 136, pageHeight - 248, 24, 'F2', colors.pinkDeep)
pdf.text('Projects Completed', rightX + 136, pageHeight - 264, 10, 'F1', colors.muted)
pdf.text('50+', rightX + 254, pageHeight - 248, 24, 'F2', colors.pinkDeep)
pdf.text('Happy Clients', rightX + 254, pageHeight - 264, 10, 'F1', colors.muted)

pdf.pillLabel('Core Services', rightX, pageHeight - 324, 108)
const leftServices = [
  'Brand identity systems',
  'Logo, banner, and flyer design',
  'Social media campaign creatives',
  'Thumbnail and presentation graphics',
]
const rightServices = [
  'UI/UX wireframes and prototypes',
  'Photo retouching and editing',
  'GIF and short-form visual content',
  'Video editing with CapCut and Filmora',
]

let serviceY = pageHeight - 352
for (const service of leftServices) {
  pdf.rect(rightX, serviceY + 4, 5, 5, colors.pink)
  pdf.wrappedText(service, rightX + 14, serviceY, 154, 10.5, 'F1', colors.ink, 1.25)
  serviceY -= 26
}

serviceY = pageHeight - 352
for (const service of rightServices) {
  pdf.rect(rightX + 188, serviceY + 4, 5, 5, colors.pink)
  pdf.wrappedText(service, rightX + 202, serviceY, 154, 10.5, 'F1', colors.ink, 1.25)
  serviceY -= 26
}

pdf.pillLabel('Education', rightX, pageHeight - 472, 92)
pdf.text('2024 - Present', rightX, pageHeight - 500, 10, 'F2', colors.pinkDeep)
pdf.text('BFA (Graphic Designing)', rightX, pageHeight - 516, 13, 'F2', colors.ink)
pdf.text('Education University Lahore', rightX, pageHeight - 532, 10.5, 'F1', colors.muted)
pdf.text('2023', rightX, pageHeight - 562, 10, 'F2', colors.pinkDeep)
pdf.text('Inter ICS', rightX, pageHeight - 578, 13, 'F2', colors.ink)
pdf.text('Punjab College', rightX, pageHeight - 594, 10.5, 'F1', colors.muted)
pdf.text('2021', rightX, pageHeight - 624, 10, 'F2', colors.pinkDeep)
pdf.text('Matric', rightX, pageHeight - 640, 13, 'F2', colors.ink)
pdf.text("Old Ravian's Public School", rightX, pageHeight - 656, 10.5, 'F1', colors.muted)

pdf.pillLabel('Certifications', rightX + 188, pageHeight - 472, 112)
const certifications = [
  'Microsoft - Word, Excel, PowerPoint',
  'IDM Pakistan - Graphic Designing',
  'DigiSkills.pk - Graphic Designing',
  'DigiSkills.pk - Freelancing',
  'DigiSkills.pk - Data Analytics',
]

let certY = pageHeight - 500
for (const certification of certifications) {
  pdf.line(rightX + 188, certY + 7, rightX + 196, certY + 7, colors.pink, 2)
  pdf.wrappedText(certification, rightX + 202, certY, 154, 10.5, 'F1', colors.ink, 1.25)
  certY -= 28
}

pdf.rect(rightX, 72, rightWidth, 84, colors.blush)
pdf.text('Work Style', rightX + 18, 128, 12, 'F2', colors.pinkDeep)
pdf.wrappedText(
  'Remote-first designer focused on clear communication, organized delivery, and polished visuals that match feminine, modern brand direction.',
  rightX + 18,
  108,
  rightWidth - 36,
  10.5,
  'F1',
  colors.muted,
  1.4,
)

let sidebarY = pageHeight - 150
pdf.text('CONTACT', 24, sidebarY, 12, 'F2', colors.white)
pdf.wrappedText('azanabidkhawaja@gmail.com', 24, sidebarY - 22, sidebarWidth - 40, 10.5, 'F1', colors.white, 1.3)
pdf.text('03354414787', 24, sidebarY - 52, 10.5, 'F1', colors.white)
pdf.text('Lahore, Pakistan', 24, sidebarY - 72, 10.5, 'F1', colors.white)

sidebarY = pdf.sidebarList('Tools', [
  'Photoshop, Illustrator, Figma, MS Office',
  'Canva, InShot, Filmora, CapCut',
], pageHeight - 258, {
  bodySize: 9.6,
  lineHeight: 1.24,
  itemGap: 8,
  width: sidebarWidth - 58,
})

sidebarY = pdf.sidebarList('Strengths', [
  'Creative direction with feminine visual style',
  'Clean presentation and layout hierarchy',
  'Fast remote collaboration and revisions',
  'Branding plus prototype-ready thinking',
], sidebarY - 8, {
  bodySize: 9.6,
  lineHeight: 1.24,
  itemGap: 8,
  width: sidebarWidth - 58,
})

pdf.text('Portfolio Focus', 24, sidebarY - 10, 12, 'F2', colors.white)
pdf.wrappedText(
  'Brand identity, digital campaign assets, print design, prototypes, thumbnails, and polished content for client delivery.',
  24,
  sidebarY - 32,
  sidebarWidth - 40,
  10,
  'F1',
  colors.white,
  1.32,
)

pdf.text('Azan Resume', 24, 30, 10, 'F3', colors.white)
pdf.text('Generated from the portfolio profile', 24, 16, 8.5, 'F1', colors.white)

const stream = pdf.build()

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>',
  `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`,
]

let pdfText = '%PDF-1.4\n'
const offsets = [0]

for (let index = 0; index < objects.length; index += 1) {
  offsets.push(Buffer.byteLength(pdfText, 'utf8'))
  pdfText += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`
}

const xrefOffset = Buffer.byteLength(pdfText, 'utf8')
pdfText += `xref\n0 ${objects.length + 1}\n`
pdfText += '0000000000 65535 f \n'
for (let index = 1; index < offsets.length; index += 1) {
  pdfText += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
}
pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

const outputPath = path.resolve('client/public/azan-resume.pdf')
await fs.writeFile(outputPath, pdfText, 'binary')
console.log(`Resume PDF written to ${outputPath}`)
