
export function getIndustryKeywords(domain: string): string[] {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('security') || domainLower.includes('cyber')) {
    return [
      'cybersecurity solutions', 'network security', 'data protection', 'threat detection',
      'security consulting', 'penetration testing', 'vulnerability assessment', 'compliance audit',
      'incident response', 'security training', 'firewall management', 'endpoint security',
      'cloud security', 'security monitoring', 'risk assessment', 'security software'
    ];
  }
  
  if (domainLower.includes('marketing') || domainLower.includes('digital')) {
    return [
      'digital marketing', 'seo services', 'ppc management', 'social media marketing',
      'content marketing', 'email marketing', 'conversion optimization', 'marketing automation',
      'brand strategy', 'online advertising', 'lead generation', 'marketing analytics',
      'web design', 'marketing consultant', 'growth hacking', 'marketing tools'
    ];
  }
  
  if (domainLower.includes('tech') || domainLower.includes('software')) {
    return [
      'software development', 'web development', 'mobile app development', 'cloud computing',
      'artificial intelligence', 'machine learning', 'data analytics', 'business intelligence',
      'enterprise software', 'saas solutions', 'api development', 'devops services',
      'software consulting', 'tech support', 'system integration', 'database management'
    ];
  }
  
  // Default business keywords
  return [
    'business solutions', 'professional services', 'consulting services', 'business consulting',
    'customer service', 'business development', 'project management', 'business strategy',
    'operational efficiency', 'process improvement', 'quality assurance', 'business analytics',
    'customer experience', 'business automation', 'workflow optimization', 'business growth'
  ];
}

export function getBrandKeywords(domain: string): string[] {
  const brandName = domain.split('.')[0].replace(/[-_]/g, ' ');
  const brandVariations = [
    brandName,
    `${brandName} reviews`,
    `${brandName} pricing`,
    `${brandName} features`,
    `${brandName} alternatives`,
    `${brandName} vs`,
    `${brandName} demo`,
    `${brandName} login`,
    `${brandName} support`,
    `${brandName} tutorial`,
    `${brandName} guide`,
    `${brandName} benefits`,
    `${brandName} comparison`,
    `${brandName} cost`,
    `${brandName} trial`,
    `${brandName} software`
  ];
  
  return brandVariations;
}

export function getCompetitorKeywords(domain: string): string[] {
  const industry = domain.toLowerCase().includes('security') ? 'security' :
                   domain.toLowerCase().includes('marketing') ? 'marketing' : 'business';
  
  const competitorTerms = {
    security: ['best cybersecurity', 'top security companies', 'enterprise security', 'security providers'],
    marketing: ['best marketing agencies', 'top digital marketers', 'marketing companies', 'seo agencies'],
    business: ['best business solutions', 'top consultants', 'business services', 'professional firms']
  };
  
  return competitorTerms[industry] || competitorTerms.business;
}

export function generateKeywordVariation(baseKeyword: string, domain: string, seed: number): string {
  const modifiers = [
    'best', 'top', 'professional', 'expert', 'advanced', 'premium', 'affordable', 'custom',
    'enterprise', 'small business', 'local', 'online', 'managed', 'comprehensive', 'innovative'
  ];
  
  const locations = ['near me', 'in [city]', 'services', 'solutions', 'company', 'provider'];
  
  const modifierIndex = Math.abs(seed) % modifiers.length;
  const locationIndex = Math.abs(seed / 10) % locations.length;
  
  const variation = Math.abs(seed) % 4;
  
  switch (variation) {
    case 0:
      return `${modifiers[modifierIndex]} ${baseKeyword}`;
    case 1:
      return `${baseKeyword} ${locations[locationIndex]}`;
    case 2:
      return `${modifiers[modifierIndex]} ${baseKeyword} ${locations[locationIndex]}`;
    default:
      return baseKeyword;
  }
}
