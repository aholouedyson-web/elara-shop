export interface PhoneCountryCode {
  country: string
  code: string
  flag: string
  iso: string
}

export const PHONE_COUNTRY_CODES: PhoneCountryCode[] = [
  { country: 'Espagne', code: '+34', flag: '🇪🇸', iso: 'ES' },
  { country: 'France', code: '+33', flag: '🇫🇷', iso: 'FR' },
  { country: 'Royaume-Uni', code: '+44', flag: '🇬🇧', iso: 'GB' },
  { country: 'États-Unis / Canada', code: '+1', flag: '🇺🇸', iso: 'US' },
  { country: 'Allemagne', code: '+49', flag: '🇩🇪', iso: 'DE' },
  { country: 'Italie', code: '+39', flag: '🇮🇹', iso: 'IT' },
  { country: 'Portugal', code: '+351', flag: '🇵🇹', iso: 'PT' },
  { country: 'Belgique', code: '+32', flag: '🇧🇪', iso: 'BE' },
  { country: 'Suisse', code: '+41', flag: '🇨🇭', iso: 'CH' },
  { country: 'Pays-Bas', code: '+31', flag: '🇳🇱', iso: 'NL' },
  { country: 'Maroc', code: '+212', flag: '🇲🇦', iso: 'MA' },
  { country: 'Mexique', code: '+52', flag: '🇲🇽', iso: 'MX' },
  { country: 'Argentine', code: '+54', flag: '🇦🇷', iso: 'AR' },
  { country: 'Colombie', code: '+57', flag: '🇨🇴', iso: 'CO' },
  { country: 'Chili', code: '+56', flag: '🇨🇱', iso: 'CL' },
  { country: 'Sénégal', code: '+221', flag: '🇸🇳', iso: 'SN' },
  { country: 'Côte d’Ivoire', code: '+225', flag: '🇨🇮', iso: 'CI' },
  { country: 'Australie', code: '+61', flag: '🇦🇺', iso: 'AU' },
]
