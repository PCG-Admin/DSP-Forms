export const CINTASIGN_UNITS = ['CNT1', 'CNT2', 'CNT3'] as const;
export type CintasignUnit = typeof CINTASIGN_UNITS[number];

export const SHIFTS = ['D', 'N'] as const;

export const FARMS = [
  'Umvoti Heights',
  'Isegedlana',
  // Add more as needed
];

// Harvester operators (for Harvesting form)
export const HARVESTER_OPERATORS = [
  'Bongani Bhengu',
  'Busisiwe Kunene',
  'John Yende',
  'Mandla Dlamini',
  'Mandla Myeni',
  'Mdu Nxumalo',
  'Musa Myeni',
  'Mxolisi Sibisi',
  'Phumlane Makhaye',
  'Richard Mkhwae',
  'Samson Ngwenya',
  'Sfiso Mchunu',
  'Sibusiso B. Thwala',
  'Sifiso S. Nene',
  'Sikhumbuso Mbuyazi',
  'Siya Ntsele',
  'T. Terence Mthethwa',
  'Thulani Thomo',
  'Trevor Magagula',
];

// Shorthaul operators (for Shorthaul form)
export const SHORTHAUL_OPERATORS = [
  'Bhekizenso Zondi',
  'Dumezweni Mbele',
  'Lungisani Mdladla',
  'Mbuso Mnguni',
  'Mduduzi Phungula',
  'Mlungisi Mhlaba',
  'Patrick Mlambo',
  'Sabelo Gwebu',
  'Sabelo Vilane',
  'Sikelela Mkhumbuzi',
];

// Loading operators (for Loading form – used as drivers)
export const LOADING_OPERATORS = [
  'Bheki Mkhambuse',
  'Lucky Nkosi',
  'Nkosi Mngadi',
  'P.Z. Mthembu',
  'S. Lucas Mathonsi',
  'Sonnyboy Mkhaliphi',
  'Zweli Ngema',
];

// Fleet numbers – Harvesters
export const HARVESTER_FLEET_NUMBERS = [
  'H21', 'H30', 'H31', 'H32', 'H35', 'H36', 'H37', 'H38', 'H40'
];

// Fleet numbers – Shorthaul
export const SHORTHAUL_FLEET_NUMBERS = [
  'B02', 'B04', 'D07', 'PB01', 'PB02', 'TP03'
];

// Fleet numbers – Loading
export const LOADING_FLEET_NUMBERS = [
  'HL08', 'HL09', 'HL11', 'HL12'
];

// Transport companies for Loading form
export const TRANSPORT_COMPANIES = [
  'Company A',
  'Company B',
  'Company C',
];