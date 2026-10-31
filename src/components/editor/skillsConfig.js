export const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Technologies',
  'Cloud & DevOps',
  'Web Development',
  'AI & Machine Learning',
  'Data Analysis & Visualization',
  'Testing & QA',
  'Operating Systems',
]

export const CATEGORY_ICONS = {
  'Programming Languages': 'code',
  'Frameworks & Libraries': 'layers',
  'Databases': 'database',
  'Tools & Technologies': 'build',
  'Cloud & DevOps': 'cloud',
  'Web Development': 'language',
  'AI & Machine Learning': 'smart_toy',
  'Data Analysis & Visualization': 'monitoring',
  'Testing & QA': 'bug_report',
  'Operating Systems': 'terminal',
}

export const CATEGORY_SUGGESTIONS = {
  'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Java', 'C++', 'Go', 'Rust'],
  'Frameworks & Libraries': ['Django', 'Django REST Framework', 'FastAPI', 'React', 'Next.js', 'Node.js', 'Express'],
  'Databases': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'SQLite', 'DynamoDB', 'Elasticsearch'],
  'Tools & Technologies': ['Git & GitHub', 'Postman', 'Docker', 'VS Code', 'Jira', 'Vite'],
  'Cloud & DevOps': ['AWS', 'Docker', 'CI/CD', 'Kubernetes', 'Azure', 'GCP', 'GitHub Actions'],
  'Web Development': ['React', 'HTML5', 'CSS3', 'RESTful APIs', 'Tailwind CSS', 'GraphQL'],
  'AI & Machine Learning': ['RAG Systems', 'AI Orchestration', 'LangChain', 'PyTorch', 'TensorFlow', 'LLMs'],
  'Data Analysis & Visualization': ['Pandas', 'NumPy', 'Power BI', 'Tableau', 'Matplotlib'],
  'Testing & QA': ['Pytest', 'Unit Testing', 'Jest', 'Cypress', 'Integration Testing'],
  'Operating Systems': ['Linux', 'Ubuntu', 'macOS', 'Windows', 'Debian'],
}

/**
 * Normalizes any incoming skills payload (legacy array or categorized object)
 * into a strict 10-category dictionary: { [category]: string[] }
 */
export function normalizeSkills(raw) {
  const result = {
    'Programming Languages': [],
    'Frameworks & Libraries': [],
    'Databases': [],
    'Tools & Technologies': [],
    'Cloud & DevOps': [],
    'Web Development': [],
    'AI & Machine Learning': [],
    'Data Analysis & Visualization': [],
    'Testing & QA': [],
    'Operating Systems': [],
  }

  if (!raw) return result

  const source =
    typeof raw === 'object' && raw !== null && 'skills' in raw && typeof raw.skills === 'object'
      ? raw.skills
      : raw

  if (Array.isArray(source)) {
    const list = source
      .map((s) => (typeof s === 'object' && s !== null ? s.name || s.skill || s.title || '' : String(s || '')))
      .map((s) => s.trim())
      .filter(Boolean)
    result['Programming Languages'] = list
    return result
  }

  if (typeof source === 'object' && source !== null) {
    for (const cat of SKILL_CATEGORIES) {
      if (Array.isArray(source[cat])) {
        result[cat] = source[cat]
          .map((s) => (typeof s === 'object' && s !== null ? s.name || s.skill || s.title || '' : String(s || '')))
          .map((s) => s.trim())
          .filter(Boolean)
      }
    }

    // Handle case-insensitive keys if coming from various formats
    for (const [k, v] of Object.entries(source)) {
      const matched = SKILL_CATEGORIES.find((c) => c.toLowerCase() === k.toLowerCase())
      if (matched && result[matched].length === 0 && Array.isArray(v)) {
        result[matched] = v
          .map((s) => (typeof s === 'object' && s !== null ? s.name || s.skill || s.title || '' : String(s || '')))
          .map((s) => s.trim())
          .filter(Boolean)
      }
    }
  }

  return result
}

export function getTotalSkillsCount(skillsObj) {
  if (!skillsObj) return 0
  if (Array.isArray(skillsObj)) return skillsObj.length
  return Object.values(skillsObj).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  )
}

