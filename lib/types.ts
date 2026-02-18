// ============================================
// CHECK STATUS TYPES
// ============================================
export type CheckStatus = "ok" | "def" | "na" | null

export interface ChecklistItem {
  id: string
  label: string
  status: CheckStatus
}

// ============================================
// FORM DATA TYPES - EXACT FIELDS FROM YOUR FORMS
// ============================================
export interface LightDeliveryFormData {
  driverName: string
  documentNo: string
  vehicleRegistration: string
  date: string
  validTrainingCard: string
  driversLicenseAvailable: string
  odometerStart: string
  odometerStop: string
  items: Record<string, CheckStatus>
  hasDefects: boolean
  defectDetails: string
  signature: string
}

export interface ExcavatorLoaderFormData {
  operatorName: string
  documentNo: string
  shift: string
  date: string
  hourMeterStart: string
  hourMeterStop: string
  validTrainingCard: string
  unitNumber: string
  items: Record<string, CheckStatus>
  hasDefects: boolean
  defectDetails: string
  signature: string
}

export interface ExcavatorHarvesterFormData {
  operatorName: string
  documentNo: string
  shift: string
  date: string
  hourMeterStart: string
  hourMeterStop: string
  validTrainingCard: string
  unitNumber: string
  items: Record<string, CheckStatus>
  hasDefects: boolean
  defectDetails: string
  signature: string
}

// ✅ ADDED: Lowbed Trailer Form Data
export interface LowbedTrailerFormData {
  operatorName: string
  documentNo: string
  date: string
  unitNumber: string
  trailerReg: string
  hourMeterStart: string
  hourMeterStop: string
  validTrainingCard: string
  items: Record<string, CheckStatus>
  hasDefects: boolean
  defectDetails: string
  signature: string
}

// ✅ ADDED: Mechanic LDV Form Data
export interface MechanicLDVFormData {
  driverName: string
  documentNo: string
  vehicleRegistration: string
  date: string
  validTrainingCard: string
  driversLicenseAvailable: string
  odometerStart: string
  odometerStop: string
  items: Record<string, CheckStatus>
  hasDefects: boolean
  defectDetails: string
  signature: string
}

// ========== NEW CINTASIGN SHORTHAUL TYPES ==========
export interface FleetEntry {
  fleetNo: string;
  operator: string;
  shift: string;
  compartment: string;
  noOfLoads: string;
  estTons: string;
  hoursOpen: string;
  hoursClose: string;
  hoursWorked: string;
  loadsPerHour: string;
  tonsPerHour: string;
}

export interface BreakdownEntry {
  machineId: string;
  operator: string;
  stop: string;
  start: string;
  details: string;
}

export interface CintasignShorthaulFormData {
  date: string;
  day: string;
  farm: string;
  automaticNumber: string;
  fleetEntries: FleetEntry[];
  breakdownEntries: BreakdownEntry[];
}
// ===================================================

// Union type for all form data
export type FormDataUnion = 
  | LightDeliveryFormData 
  | ExcavatorLoaderFormData 
  | ExcavatorHarvesterFormData
  | LowbedTrailerFormData      // ✅ ADDED
  | MechanicLDVFormData        // ✅ ADDED
  | CintasignShorthaulFormData; // ✅ NEW

// ============================================
// FORM TYPE CONSTANTS
// ============================================
export type FormType = 
  | "light-delivery" 
  | "excavator-loader" 
  | "excavator-harvester"
  | "lowbed-trailer"          // ✅ ADDED
  | "mechanic-ldv"            // ✅ ADDED
  | "cintasign-shorthaul";     // ✅ NEW

// ============================================
// SUBMISSION TYPE - WITH NOTIFICATION FIELDS
// ============================================
export interface Submission {
  id: string
  formType: FormType
  formTitle: string
  submittedBy: string
  submittedAt: string
  data: FormDataUnion  // Using the union type
  hasDefects: boolean
  // Notification tracking fields
  isRead?: boolean      // Whether admin has viewed this submission
  viewedAt?: string     // When admin viewed it
  brand: 'ringomode' | 'cintasign';
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface Notification {
  id: string
  title: string
  message: string
  time: string
  formType: FormType
  hasDefects: boolean
  isRead: boolean
  submissionId: string
}

// ============================================
// FILTER OPTIONS
// ============================================
export interface FilterOptions {
  formType?: FormType | 'all'
  hasDefects?: boolean
  unreadOnly?: boolean
  search?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
  startDate?: string
  endDate?: string
}

// ============================================
// STATISTICS TYPES
// ============================================
export interface SubmissionStats {
  total: number
  unread: number
  withDefects: number
  clean: number
  today: number
  weekly: number
  monthly: number
  byType: Record<FormType, number>
  byStatus: {
    ok: number
    def: number
    na: number
  }
}

// ============================================
// CHECKLIST ITEMS - ARRAYS FOR EACH FORM TYPE
// ============================================
export const lightDeliveryItems = [
  "Drivers license available",
  "Valid training card",
  "Vehicle registration document",
  "Windscreen (cracks/chips)",
  "Wipers and washers",
  "Mirrors (rear view/side)",
  "Lights (head/tail/brake/indicator)",
  "Horn",
  "Seat belt",
  "Seats (condition/adjustment)",
  "Fire extinguisher (serviced/sealed)",
  "First aid kit",
  "Warning triangle",
  "Jack and wheel spanner",
  "Spare wheel (condition/pressure)",
  "Tyres (condition/pressure/wear)",
  "Brakes (foot/handbrake)",
  "Steering (play/condition)",
  "Oil level",
  "Coolant level",
  "Battery (condition/terminals)",
  "Exhaust system (leaks/condition)",
  "Body (dents/damage)",
  "Doors (locks/handles)",
  "Fuel level",
  "General cleanliness",
] as const

export const excavatorLoaderItems = [
  "Fire extinguisher (serviced/sealed)",
  "First aid kit",
  "Seat belt",
  "Mirrors",
  "Lights (head/tail/work)",
  "Horn / reverse alarm",
  "Windscreen / wipers",
  "Steps / handrails",
  "Guards / covers in place",
  "Cabin (clean/undamaged)",
  "Engine oil level",
  "Hydraulic oil level",
  "Coolant level",
  "Fuel level",
  "Air filter indicator",
  "Battery (condition/terminals)",
  "Tracks / undercarriage",
  "Bucket (teeth/cutting edge)",
  "Boom / stick / linkage pins",
  "Hydraulic hoses / fittings",
  "Slew ring / bearing",
  "Swing mechanism",
  "Exhaust system",
  "Instruments / gauges",
  "Controls (levers/pedals)",
  "Brakes (service/park)",
  "Steering",
  "Tyres / wheels (if applicable)",
  "Grease points",
  "No leaks (oil/fuel/coolant)",
  "Loader arms / linkage",
  "Quick hitch (if fitted)",
  "Attachments secure",
] as const

export const excavatorHarvesterItems = [
  "Fire extinguisher (serviced/sealed)",
  "First aid kit",
  "Seat belt",
  "Mirrors",
  "Lights (head/tail/work)",
  "Horn / reverse alarm",
  "Windscreen / wipers",
  "Steps / handrails",
  "Guards / covers in place",
  "Cabin (clean/undamaged)",
  "Engine oil level",
  "Hydraulic oil level",
  "Coolant level",
  "Fuel level",
  "Air filter indicator",
  "Battery (condition/terminals)",
  "Tracks / undercarriage",
  "Boom / stick / linkage pins",
  "Hydraulic hoses / fittings",
  "Slew ring / bearing",
  "Swing mechanism",
  "Exhaust system",
  "Instruments / gauges",
  "Controls (levers/pedals)",
  "Brakes (service/park)",
  "Steering",
  "Grease points",
  "No leaks (oil/fuel/coolant)",
  "Harvester head condition",
  "Feed rollers",
  "Delimbing knives",
  "Measuring system calibration",
  "Saw bar / chain condition",
  "Rotator / tilt function",
  "Hose routing on boom",
  "Computer / display functional",
] as const

// ✅ ADDED: Lowbed Trailer Checklist Items
export const lowbedTrailerItems = [
  "Lowbed deck condition (no cracks/welds intact)",
  "Roll back deck operation",
  "Hydraulic system (no leaks)",
  "Hydraulic hoses (condition/routing)",
  "Ramps (condition/operation)",
  "Ramp locks/pins",
  "Winch (condition/operation)",
  "Winch cable (no fraying)",
  "Winch hook & safety latch",
  "Tie down points (condition)",
  "Ratchet straps/load binders",
  "Lights (stop/tail/indicator/marker)",
  "Reflectors/conspicuity tape",
  "Mud flaps",
  "Suspension (air bags/springs)",
  "Brakes (service/park)",
  "Brake chambers/lines",
  "Axles/wheels",
  "Tyres (condition/pressure)",
  "Rim condition (no damage)",
  "Wheel nuts (torque marks)",
  "Landing gear (if semi-trailer)",
  "Fifth wheel coupling (if applicable)",
  "Safety chains/breakaway cable",
  "Electrical plug/socket",
  "Grease points",
  "Fire extinguisher",
  "Warning triangles/reflectors",
  "Number plate (visible/secure)"
] as const

// ✅ ADDED: Mechanic LDV Checklist Items
export const mechanicLDVItems = [
  "Fire extinguisher (serviced & sealed)",
  "First aid kit",
  "Warning triangle & reflective jacket",
  "Jacks & wheel spanner",
  "Spare wheel (condition)",
  "Tyres (condition & pressure)",
  "Wheel nuts (torque marks visible)",
  "Windscreen (cracks/chips)",
  "Wipers & washers",
  "Mirrors (rear view & side)",
  "Lights (head, tail, brake, indicators)",
  "Horn",
  "Seat belts",
  "Seats (condition & adjustment)",
  "Brakes (foot & handbrake)",
  "Steering",
  "Engine oil level",
  "Coolant level",
  "Battery (condition & terminals)",
  "Exhaust system (leaks)",
  "Body (dents, damage)",
  "Doors (locks & handles)",
  "Fuel level",
  "General cleanliness",
] as const

// ========== NEW CINTASIGN SHORTHAUL ITEMS (empty, as no checklist) ==========
export const cintasignShorthaulItems = [] as const
// ===================================================

// ============================================
// TYPE HELPERS
// ============================================
// Extract the items array type
export type LightDeliveryItem = typeof lightDeliveryItems[number]
export type ExcavatorLoaderItem = typeof excavatorLoaderItems[number]
export type ExcavatorHarvesterItem = typeof excavatorHarvesterItems[number]
export type LowbedTrailerItem = typeof lowbedTrailerItems[number]      // ✅ ADDED
export type MechanicLDVItem = typeof mechanicLDVItems[number]          // ✅ ADDED
export type CintasignShorthaulItem = typeof cintasignShorthaulItems[number] // ✅ NEW

// Map form type to its items type
export type FormItemsMap = {
  'light-delivery': LightDeliveryItem
  'excavator-loader': ExcavatorLoaderItem
  'excavator-harvester': ExcavatorHarvesterItem
  'lowbed-trailer': LowbedTrailerItem        // ✅ ADDED
  'mechanic-ldv': MechanicLDVItem            // ✅ ADDED
  'cintasign-shorthaul': CintasignShorthaulItem // ✅ NEW
}

// Map form type to its data type
export type FormDataMap = {
  'light-delivery': LightDeliveryFormData
  'excavator-loader': ExcavatorLoaderFormData
  'excavator-harvester': ExcavatorHarvesterFormData
  'lowbed-trailer': LowbedTrailerFormData    // ✅ ADDED
  'mechanic-ldv': MechanicLDVFormData        // ✅ ADDED
  'cintasign-shorthaul': CintasignShorthaulFormData // ✅ NEW
}

// ============================================
// FORM CONFIGURATION
// ============================================
export interface FormConfig {
  type: FormType
  title: string
  description: string
  items: readonly string[]
}

export const formConfigs: Record<FormType, FormConfig> = {
  'light-delivery': {
    type: 'light-delivery',
    title: 'Light Delivery Vehicle Daily Checklist',
    description: 'Complete your daily light delivery vehicle inspection checklist.',
    items: lightDeliveryItems
  },
  'excavator-loader': {
    type: 'excavator-loader',
    title: 'Excavator Loader Pre-Shift Inspection',
    description: 'Complete your pre-shift excavator loader inspection checklist.',
    items: excavatorLoaderItems
  },
  'excavator-harvester': {
    type: 'excavator-harvester',
    title: 'Excavator Harvester Pre-Shift Inspection',
    description: 'Complete your pre-shift excavator harvester inspection checklist.',
    items: excavatorHarvesterItems
  },
  // ✅ ADDED: Lowbed Trailer config
  'lowbed-trailer': {
    type: 'lowbed-trailer',
    title: 'Lowbed & Roll Back Trailer Pre-Shift Inspection',
    description: 'Complete the lowbed and roll back trailer pre-shift use inspection checklist.',
    items: lowbedTrailerItems
  },
  // ✅ ADDED: Mechanic LDV config
  'mechanic-ldv': {
    type: 'mechanic-ldv',
    title: 'Mechanic LDV Daily Checklist',
    description: 'Complete the mechanic light delivery vehicle daily inspection checklist.',
    items: mechanicLDVItems
  },
  // ✅ NEW: Cintasign Shorthaul config
  'cintasign-shorthaul': {
    type: 'cintasign-shorthaul',
    title: 'Cintasign Shorthaul Trip Sheet',
    description: 'Daily log for shorthaul operations.',
    items: cintasignShorthaulItems
  }
}

// ============================================
// UTILITY FUNCTIONS (Type Guards)
// ============================================
export function isLightDeliveryFormData(data: FormDataUnion): data is LightDeliveryFormData {
  return (data as LightDeliveryFormData).vehicleRegistration !== undefined
}

export function isExcavatorLoaderFormData(data: FormDataUnion): data is ExcavatorLoaderFormData {
  return (data as ExcavatorLoaderFormData).unitNumber !== undefined && 
         (data as ExcavatorLoaderFormData).hourMeterStart !== undefined
}

export function isExcavatorHarvesterFormData(data: FormDataUnion): data is ExcavatorHarvesterFormData {
  return (data as ExcavatorHarvesterFormData).unitNumber !== undefined && 
         (data as ExcavatorHarvesterFormData).hourMeterStart !== undefined
}

// ✅ ADDED: Type guard for Lowbed Trailer
export function isLowbedTrailerFormData(data: FormDataUnion): data is LowbedTrailerFormData {
  return (data as LowbedTrailerFormData).trailerReg !== undefined
}

// ✅ ADDED: Type guard for Mechanic LDV
export function isMechanicLDVFormData(data: FormDataUnion): data is MechanicLDVFormData {
  return (data as MechanicLDVFormData).vehicleRegistration !== undefined && 
         (data as MechanicLDVFormData).odometerStart !== undefined
}

// ✅ NEW: Type guard for Cintasign Shorthaul
export function isCintasignShorthaulFormData(data: FormDataUnion): data is CintasignShorthaulFormData {
  return (data as CintasignShorthaulFormData).fleetEntries !== undefined
}

// Get form title from form type
export function getFormTitle(type: FormType): string {
  return formConfigs[type].title
}

// Get form description from form type
export function getFormDescription(type: FormType): string {
  return formConfigs[type].description
}

// Get form items from form type
export function getFormItems(type: FormType): readonly string[] {
  return formConfigs[type].items
}

// ============================================
// FORM LABEL HELPERS (for admin dashboard)
// ============================================
export function getFormTypeLabel(type: FormType): string {
  const labels: Record<FormType, string> = {
    'light-delivery': 'Light Delivery Vehicle',
    'excavator-loader': 'Excavator Loader',
    'excavator-harvester': 'Excavator Harvester',
    'lowbed-trailer': 'Lowbed & Roll Back Trailer',
    'mechanic-ldv': 'Mechanic LDV',
    'cintasign-shorthaul': 'Cintasign Shorthaul' // ✅ NEW
  }
  return labels[type]
}

// ============================================
// INITIAL FORM VALUES
// ============================================
export function getInitialItems(formType: FormType): Record<string, CheckStatus> {
  const items = getFormItems(formType)
  return Object.fromEntries(items.map((item) => [item, null]))
}

export function getInitialFormData(formType: FormType): Partial<FormDataUnion> {
  switch (formType) {
    case 'light-delivery':
    case 'mechanic-ldv':
      return {
        driverName: '',
        documentNo: '',
        vehicleRegistration: '',
        date: new Date().toISOString().split('T')[0],
        validTrainingCard: '',
        driversLicenseAvailable: '',
        odometerStart: '',
        odometerStop: '',
        defectDetails: '',
        signature: ''
      }
    case 'excavator-loader':
    case 'excavator-harvester':
    case 'lowbed-trailer':
      return {
        operatorName: '',
        documentNo: '',
        date: new Date().toISOString().split('T')[0],
        unitNumber: '',
        hourMeterStart: '',
        hourMeterStop: '',
        validTrainingCard: '',
        defectDetails: '',
        signature: ''
      }
    // ✅ NEW: Cintasign Shorthaul
    case 'cintasign-shorthaul':
      return {
        date: new Date().toISOString().split('T')[0],
        day: '',
        farm: '',
        automaticNumber: '',
        fleetEntries: [],
        breakdownEntries: []
      }
    default:
      return {}
  }
}