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

// ========== NEW VEHICLE JOB CARD TYPES ==========
export interface JobPart {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface JobLabour {
  id: string;
  description: string;
  hours: number;
}

export interface VehicleJobCardFormData {
  jobNumber: string;
  date: string;
  vehicleEquipment: string;
  registrationNumber: string;
  hourMeter: string;
  reportedProblem: string;
  workPerformed: string;
  mechanicName: string;
  supervisorName: string;
  parts: JobPart[];
  labour: JobLabour[];
  partsTotal: number;
  labourTotal: number;
  grandTotal: number;
  signature: string;
}
// ===================================================

// Union type for all form data
export type FormDataUnion = 
  | LightDeliveryFormData 
  | ExcavatorLoaderFormData 
  | ExcavatorHarvesterFormData
  | LowbedTrailerFormData      // ✅ ADDED
  | MechanicLDVFormData        // ✅ ADDED
  | CintasignShorthaulFormData // ✅ NEW
  | VehicleJobCardFormData;    // ✅ NEW

// ============================================
// FORM TYPE CONSTANTS
// ============================================
export type FormType = 
  | "light-delivery" 
  | "excavator-loader" 
  | "excavator-harvester"
  | "lowbed-trailer"          // ✅ ADDED
  | "mechanic-ldv"            // ✅ ADDED
  | "cintasign-shorthaul"     // ✅ NEW
  | "vehicle-job-card";       // ✅ NEW

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
  // ... unchanged ...
] as const

export const excavatorLoaderItems = [
  // ... unchanged ...
] as const

export const excavatorHarvesterItems = [
  // ... unchanged ...
] as const

// ✅ ADDED: Lowbed Trailer Checklist Items
export const lowbedTrailerItems = [
  // ... unchanged ...
] as const

// ✅ ADDED: Mechanic LDV Checklist Items
export const mechanicLDVItems = [
  // ... unchanged ...
] as const

// ========== NEW CINTASIGN SHORTHAUL ITEMS (empty, as no checklist) ==========
export const cintasignShorthaulItems = [] as const
// ===================================================

// ========== NEW VEHICLE JOB CARD ITEMS (empty) ==========
export const vehicleJobCardItems = [] as const
// ========================================================

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
export type VehicleJobCardItem = typeof vehicleJobCardItems[number];   // ✅ NEW

// Map form type to its items type
export type FormItemsMap = {
  'light-delivery': LightDeliveryItem
  'excavator-loader': ExcavatorLoaderItem
  'excavator-harvester': ExcavatorHarvesterItem
  'lowbed-trailer': LowbedTrailerItem        // ✅ ADDED
  'mechanic-ldv': MechanicLDVItem            // ✅ ADDED
  'cintasign-shorthaul': CintasignShorthaulItem // ✅ NEW
  'vehicle-job-card': VehicleJobCardItem;    // ✅ NEW
}

// Map form type to its data type
export type FormDataMap = {
  'light-delivery': LightDeliveryFormData
  'excavator-loader': ExcavatorLoaderFormData
  'excavator-harvester': ExcavatorHarvesterFormData
  'lowbed-trailer': LowbedTrailerFormData    // ✅ ADDED
  'mechanic-ldv': MechanicLDVFormData        // ✅ ADDED
  'cintasign-shorthaul': CintasignShorthaulFormData // ✅ NEW
  'vehicle-job-card': VehicleJobCardFormData; // ✅ NEW
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
  },
  // ✅ NEW: Vehicle Job Card config
  'vehicle-job-card': {
    type: 'vehicle-job-card',
    title: 'Motorised Equipment/Vehicle Job Card',
    description: 'Job card for recording repairs, maintenance, and tests on equipment and vehicles.',
    items: vehicleJobCardItems
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

// ✅ NEW: Type guard for Vehicle Job Card
export function isVehicleJobCardFormData(data: FormDataUnion): data is VehicleJobCardFormData {
  return (data as VehicleJobCardFormData).jobNumber !== undefined;
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
    'cintasign-shorthaul': 'Cintasign Shorthaul', // ✅ NEW
    'vehicle-job-card': 'Vehicle Job Card'        // ✅ NEW
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
    // ✅ NEW: Vehicle Job Card
    case 'vehicle-job-card':
      return {
        jobNumber: '',
        date: new Date().toISOString().split('T')[0],
        vehicleEquipment: '',
        registrationNumber: '',
        hourMeter: '',
        reportedProblem: '',
        workPerformed: '',
        mechanicName: '',
        supervisorName: '',
        parts: [],
        labour: [],
        partsTotal: 0,
        labourTotal: 0,
        grandTotal: 0,
        signature: ''
      }
    default:
      return {}
  }
}