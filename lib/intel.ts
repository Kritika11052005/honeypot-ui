export interface Intel {
  bankAccounts: string[]
  upiIds: string[]
  phoneNumbers: string[]
  phishingLinks: string[]
  emailAddresses: string[]
  caseIds: string[]
  policyNumbers: string[]
  orderNumbers: string[]
}

export interface RedFlag {
  flag: string
  timestamp: number
}

export function emptyIntel(): Intel {
  return {
    bankAccounts: [],
    upiIds: [],
    phoneNumbers: [],
    phishingLinks: [],
    emailAddresses: [],
    caseIds: [],
    policyNumbers: [],
    orderNumbers: [],
  }
}

export function extractIntel(text: string): Intel {
  if (!text) return emptyIntel()

  const emailAddresses: string[] = text.match(/\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g) || []
  const rawUpi: string[] = text.match(/\b[\w.\-+]+@[a-zA-Z0-9]+\b/g) || []
  const upiIds = rawUpi.filter(u => !emailAddresses.includes(u))

  return {
    bankAccounts: text.match(/\b\d{9,18}\b/g) || [],
    upiIds,
    phoneNumbers: text.match(/(?:\+91[\s\-]?|0)?[6-9]\d{9}\b/g) || [],
    phishingLinks: text.match(/https?:\/\/[^\s"'<>]+/g) || [],
    emailAddresses,
    caseIds: text.match(/\b(?:case|ref(?:erence)?|sr|ticket|complaint|crn|urn)[\s:.\-#]*[A-Z0-9][A-Z0-9\-]{3,}\b/gi) || [],
    policyNumbers: text.match(/\b(?:policy|pol(?:icy)?\s*(?:no|num(?:ber)?))[\s:.\-#]*[A-Z0-9\-]{4,}\b/gi) || [],
    orderNumbers: text.match(/\b(?:order|txn|transaction|ref)[\s:.\-#]*[A-Z0-9\-]{4,}\b/gi) || [],
  }
}

export function mergeIntel(base: Intel, incoming: Intel): Intel {
  const merged = { ...base }
  ;(Object.keys(base) as (keyof Intel)[]).forEach(k => {
    merged[k] = Array.from(new Set([...base[k], ...incoming[k]])) as string[]
  })
  return merged
}

const SCAM_PATTERNS = [
  { re: /urgent|immediately|right\s*now|act\s*fast|emergency|hurry/i, flag: 'Urgency language' },
  { re: /otp|one.time.pass(?:word|code)|verification\s*code|pin/i, flag: 'OTP / PIN request' },
  { re: /blocked|suspended|compromised|unauthorized|deactivated|frozen/i, flag: 'Account threat' },
  { re: /upi|gpay|paytm|phonepe|bank\s*transfer|neft|imps|rtgs/i, flag: 'Payment platform' },
  { re: /click\s*here|visit\s*|http|\.com|\.in|link|website|portal/i, flag: 'Suspicious link' },
  { re: /kyc|know\s*your\s*customer|update\s*details|verify\s*account|aadhar/i, flag: 'KYC scam' },
  { re: /prize|winner|lucky|cashback|reward|refund|offer|lottery|claim/i, flag: 'Reward lure' },
  { re: /sbi|hdfc|icici|axis|kotak|rbi|sebi|irdai|insurance|policy\s*number/i, flag: 'Impersonation' },
  { re: /account\s*number|card\s*number|cvv|expir|sort\s*code/i, flag: 'Financial data request' },
  { re: /fee|charge|pay|deposit|advance|processing|tax|refundable/i, flag: 'Advance fee fraud' },
  { re: /fraud\s*department|cyber\s*cell|crime\s*branch|investigation|arrest/i, flag: 'Authority impersonation' },
  { re: /package|parcel|delivery|customs|courier|fedex|dhl/i, flag: 'Parcel scam' },
]

export function detectScamFlags(text: string): string[] {
  return SCAM_PATTERNS.filter(p => p.re.test(text)).map(p => p.flag)
}

export function classifyScamType(intel: Intel, allText: string): string {
  if (intel.phishingLinks.length) return 'phishing'
  if (/upi|cashback|gpay|paytm/i.test(allText)) return 'upi_fraud'
  if (/bank|account|otp|sbi|hdfc|neft/i.test(allText)) return 'bank_fraud'
  if (/insurance|policy|irdai/i.test(allText)) return 'insurance_fraud'
  if (/prize|lottery|winner|claim/i.test(allText)) return 'lottery_scam'
  if (/parcel|courier|customs|delivery/i.test(allText)) return 'parcel_scam'
  if (/arrest|crime|cyber|investigation/i.test(allText)) return 'authority_scam'
  return 'generic_scam'
}

export function getConfidenceLevel(flagCount: number): 'low' | 'medium' | 'high' {
  if (flagCount >= 6) return 'high'
  if (flagCount >= 3) return 'medium'
  return 'low'
}
