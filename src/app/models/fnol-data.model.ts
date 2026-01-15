export interface Meta {
  asOf: string;
  org: string;
}

export interface RiskFlag {
  code: string;
  label: string;
}

export interface Reference {
  products: string[];
  lossTypes: string[];
  claimStatuses: string[];
  recommendations: string[];
  riskFlagCatalog: RiskFlag[];
}

export interface Handler {
  id: string;
  name: string;
  team: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface MotorCoverage {
  type: string;
  windscreen: boolean;
  courtesyCar: boolean;
  personalInjury: boolean;
}

export interface HomeCoverage {
  buildings: boolean;
  contents: boolean;
  accidentalDamage: boolean;
  homeEmergency: boolean;
}

export interface VehicleAsset {
  vehicleReg: string;
  make: string;
  model: string;
  year: number;
}

export interface PropertyAsset {
  propertyType: string;
  yearBuilt: number;
  bedrooms: number;
}

export interface Policy {
  id: string;
  policyNumber: string;
  product: string;
  status: string;
  startDate: string;
  endDate: string;
  customer: Customer;
  riskTier: string;
  excessGBP: number;
  premiumAnnualGBP: number;
  coverage: MotorCoverage | HomeCoverage;
  asset: VehicleAsset | PropertyAsset;
  policyNotes: string[];
}

export interface ClaimDocument {
  docId: string;
  name: string;
  received: boolean;
}

export interface ClaimNote {
  noteId: string;
  authorId: string;
  createdAt: string;
  text: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  lossType: string;
  lossDateTime: string;
  status: string;
  assignedTo: string | null;
  injury: boolean;
  policeReport: boolean;
  policeRef: string | null;
  incidentDescription: string;
  estimatedImpactGBP: number;
  riskFlags: string[];
  recommendation: string;
  documents: ClaimDocument[];
  notes: ClaimNote[];
  createdAt: string;
}

export interface FnolData {
  meta: Meta;
  reference: Reference;
  handlers: Handler[];
  policies: Policy[];
  claims: Claim[];
}
