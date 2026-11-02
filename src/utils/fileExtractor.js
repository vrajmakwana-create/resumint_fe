import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

// Set up the PDF.js web worker properly for Vite
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    pdfWorkerUrl || `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
}

/**
 * Extracts clean plain text from a PDF file preserving paragraphs and bullet layout.
 * @param {File} file - PDF file object
 * @returns {Promise<string>} Clean extracted text
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    })

    const pdf = await loadingTask.promise
    let fullText = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      let lastY = null
      let pageText = ''

      for (const item of textContent.items) {
        if (!item.str) continue

        // If the vertical Y coordinate changed by more than 8 points, insert a newline
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 8) {
          pageText += '\n'
        } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' '
        }

        pageText += item.str
        lastY = item.transform[5]
      }

      if (pageText.trim()) {
        fullText += pageText.trim() + '\n\n'
      }
    }

    const cleanResult = fullText.trim()
    if (!cleanResult) {
      throw new Error(
        'The selected PDF contains no readable text. It might be a scanned image or empty. Please paste the job description text manually.'
      )
    }

    return cleanResult
  } catch (err) {
    if (err.message && err.message.includes('readable text')) {
      throw err
    }
    throw new Error(`Failed to extract text from PDF: ${err.message || 'Unknown error'}`)
  }
}

/**
 * Extracts plain text from a Word (.docx) file.
 * @param {File} file - Word document file object
 * @returns {Promise<string>} Extracted plain text
 */
export async function extractTextFromDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    const cleanResult = (result.value || '').trim()

    if (!cleanResult) {
      throw new Error('The Word document contains no readable text.')
    }

    return cleanResult
  } catch (err) {
    throw new Error(`Failed to extract text from Word document: ${err.message || 'Unknown error'}`)
  }
}

/**
 * Extracts plain text from a text (.txt / .md / .json) file.
 * @param {File} file - Text file object
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromTxt(file) {
  try {
    const text = await file.text()
    const cleanResult = text.trim()

    if (!cleanResult) {
      throw new Error('The text file is empty.')
    }

    return cleanResult
  } catch (err) {
    throw new Error(`Failed to read text file: ${err.message || 'Unknown error'}`)
  }
}

/**
 * Unified file text extractor supporting PDF, DOCX, and TXT files.
 * @param {File} file - File uploaded by user
 * @returns {Promise<string>} Clean extracted text
 */
export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file selected.')
  }

  const filename = file.name || ''
  const ext = filename.split('.').pop().toLowerCase()

  if (ext === 'pdf' || file.type === 'application/pdf') {
    return await extractTextFromPdf(file)
  }

  if (
    ext === 'docx' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await extractTextFromDocx(file)
  }

  if (ext === 'txt' || ext === 'md' || file.type === 'text/plain') {
    return await extractTextFromTxt(file)
  }

  throw new Error(`Unsupported file type (.${ext}). Please select a PDF, DOCX, or TXT file.`)
}

