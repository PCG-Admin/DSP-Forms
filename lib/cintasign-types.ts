import { CintasignUnit } from './cintasign-constants';

export interface CommonFields {
  date: string;
  day: string;
  farm: string;
  automaticNumber: string;
  unit: CintasignUnit;
}

export interface ShorthaulFleetEntry {
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

export interface ShorthaulData {
  fleetEntries: ShorthaulFleetEntry[];
  breakdownEntries: BreakdownEntry[];
}

export interface HarvestingFleetEntry {
  fleetNo: string;
  operator: string;
  shift: string;
  compartment: string;
  treeVolume: string;
  treesDebarked: string;
  totalTons: string;
  hoursOpen: string;
  hoursClose: string;
  hoursWorked: string;
  tonsPerHour: string;
  treesPerHour: string;
}

export interface HarvestingData {
  fleetEntries: HarvestingFleetEntry[];
  breakdownEntries: BreakdownEntry[];
}

export interface LoadingEntry {
  deliveryNoteNo: string;
  compNo: string;
  transportCompany: string;
  longHaulReg: string;
  driverName: string;
}

export interface LoadingData {
  operator: string;      // loading supervisor
  fleetNo: string;
  shift: string;
  entries: LoadingEntry[];
}