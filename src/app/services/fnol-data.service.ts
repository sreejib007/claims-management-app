import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FnolData,
  Meta,
  Reference,
  RiskFlag,
  Handler,
  Policy,
  Claim,
  ClaimDocument,
  ClaimNote
} from '../models/fnol-data.model';

@Injectable({
  providedIn: 'root'
})
export class FnolDataService {
  private readonly data: FnolData = {
    meta: {
      asOf: '2026-01-14T00:00:00Z',
      org: 'Acme Insurance UK'
    },
    reference: {
      products: ['Motor', 'Home'],
      lossTypes: ['Accident', 'Theft', 'Water Damage', 'Fire', 'Storm'],
      claimStatuses: ['New', 'In Review', 'Referred', 'Resolved'],
      recommendations: [
        'STP Eligible',
        'Request Documents',
        'Refer to SIU',
        'Refer to Underwriting'
      ],
      riskFlagCatalog: [
        { code: 'RECENT_LOSS', label: 'Recent loss (≤7 days)' },
        { code: 'HIGH_IMPACT', label: 'High estimated impact' },
        { code: 'OOH_TIME', label: 'Out-of-hours loss time' },
        { code: 'NEW_POLICY', label: 'New policy (<30 days)' },
        { code: 'LAPSED_POLICY', label: 'Policy not active (lapsed)' },
        { code: 'PRIOR_THEFT', label: 'Prior theft history' }
      ]
    },
    handlers: [
      { id: 'u1', name: 'Mina Rahman', team: 'FNOL' },
      { id: 'u2', name: 'Jon Wallace', team: 'FNOL' },
      { id: 'u3', name: 'Priya Sen', team: 'Triage' },
      { id: 'u4', name: 'A. Patel', team: 'SIU' }
    ],
    policies: [
      {
        id: 'p1',
        policyNumber: 'MTR-UK-104983',
        product: 'Motor',
        status: 'Active',
        startDate: '2025-06-01',
        endDate: '2026-05-31',
        customer: {
          customerId: 'c1',
          name: 'Northbridge Life Ltd',
          email: 'ops@northbridge.example',
          phone: '+44 20 7946 0101',
          address: '2 London Wall, London, EC2Y'
        },
        riskTier: 'Standard',
        excessGBP: 250,
        premiumAnnualGBP: 1280,
        coverage: {
          type: 'Comprehensive',
          windscreen: true,
          courtesyCar: true,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'LK65 ZRT',
          make: 'Toyota',
          model: 'Corolla',
          year: 2021
        },
        policyNotes: ['Named drivers: 2', 'Telematics: No']
      },
      {
        id: 'p2',
        policyNumber: 'HOM-UK-220771',
        product: 'Home',
        status: 'Active',
        startDate: '2025-10-12',
        endDate: '2026-10-11',
        customer: {
          customerId: 'c2',
          name: 'Harbor Mutual',
          email: 'finance@harbor.example',
          phone: '+44 20 7946 0202',
          address: '18 Bexley Rd, Bexleyheath, DA6'
        },
        riskTier: 'Standard',
        excessGBP: 350,
        premiumAnnualGBP: 980,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: false,
          homeEmergency: true
        },
        asset: {
          propertyType: 'Semi-detached',
          yearBuilt: 1989,
          bedrooms: 3
        },
        policyNotes: ['Mortgagee noted', 'Previous claim: none (24m)']
      },
      {
        id: 'p3',
        policyNumber: 'MTR-UK-305411',
        product: 'Motor',
        status: 'Lapsed',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        customer: {
          customerId: 'c3',
          name: 'SilverOak Pensions',
          email: 'helpdesk@silveroaks.example',
          phone: '+44 20 7946 0303',
          address: '50 Queen St, London, EC4'
        },
        riskTier: 'High',
        excessGBP: 500,
        premiumAnnualGBP: 1760,
        coverage: {
          type: 'Third Party, Fire & Theft',
          windscreen: false,
          courtesyCar: false,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'AJ18 MNO',
          make: 'BMW',
          model: '320d',
          year: 2018
        },
        policyNotes: ['Policy lapsed due to non-payment', 'Prior theft claim (18m)']
      },
      {
        id: 'p4',
        policyNumber: 'HOM-UK-881902',
        product: 'Home',
        status: 'Active',
        startDate: '2025-12-20',
        endDate: '2026-12-19',
        customer: {
          customerId: 'c4',
          name: 'Greenfield Consulting',
          email: 'admin@greenfield.example',
          phone: '+44 20 7946 0404',
          address: '9 Station Rd, Sidcup, DA15'
        },
        riskTier: 'High',
        excessGBP: 500,
        premiumAnnualGBP: 1420,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: true,
          homeEmergency: false
        },
        asset: {
          propertyType: 'Terraced',
          yearBuilt: 1930,
          bedrooms: 4
        },
        policyNotes: ['New policy (<30 days)', 'Previous insurer flagged subsidence area']
      }
    ],
    claims: [
      {
        id: 'cl1',
        claimNumber: 'CLM-000742',
        policyId: 'p1',
        lossType: 'Accident',
        lossDateTime: '2026-01-12T17:40:00Z',
        status: 'New',
        assignedTo: null,
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Rear-ended at low speed in stop-start traffic. Minor bumper damage reported.',
        estimatedImpactGBP: 1200,
        riskFlags: ['RECENT_LOSS'],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd1', name: 'Photos of damage', received: false },
          { docId: 'd2', name: 'Third party details', received: false }
        ],
        notes: [],
        createdAt: '2026-01-13T09:10:00Z'
      },
      {
        id: 'cl2',
        claimNumber: 'CLM-000743',
        policyId: 'p2',
        lossType: 'Water Damage',
        lossDateTime: '2026-01-10T03:15:00Z',
        status: 'In Review',
        assignedTo: 'u3',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Leak under kitchen sink caused damage to cabinets and flooring. Plumber attended.',
        estimatedImpactGBP: 3800,
        riskFlags: ['HIGH_IMPACT', 'OOH_TIME'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd3', name: 'Plumber report/invoice', received: false },
          { docId: 'd4', name: 'Photos of damaged area', received: true }
        ],
        notes: [
          {
            noteId: 'n1',
            authorId: 'u3',
            createdAt: '2026-01-13T10:05:00Z',
            text: 'Need plumber invoice to validate cause and mitigation steps.'
          }
        ],
        createdAt: '2026-01-12T08:22:00Z'
      },
      {
        id: 'cl3',
        claimNumber: 'CLM-000744',
        policyId: 'p3',
        lossType: 'Theft',
        lossDateTime: '2026-01-11T22:30:00Z',
        status: 'Referred',
        assignedTo: 'u4',
        injury: false,
        policeReport: true,
        policeRef: 'MET-CR-118820',
        incidentDescription: 'Vehicle reportedly stolen from street parking. Keys present per customer.',
        estimatedImpactGBP: 16000,
        riskFlags: ['LAPSED_POLICY', 'HIGH_IMPACT', 'PRIOR_THEFT'],
        recommendation: 'Refer to SIU',
        documents: [
          { docId: 'd5', name: 'Police crime reference', received: true },
          { docId: 'd6', name: 'Key statements / key audit', received: false }
        ],
        notes: [
          {
            noteId: 'n2',
            authorId: 'u4',
            createdAt: '2026-01-13T11:30:00Z',
            text: 'Check policy status at time of loss; request evidence of payment/lapse dispute.'
          }
        ],
        createdAt: '2026-01-13T08:40:00Z'
      },
      {
        id: 'cl4',
        claimNumber: 'CLM-000745',
        policyId: 'p4',
        lossType: 'Storm',
        lossDateTime: '2026-01-09T14:05:00Z',
        status: 'New',
        assignedTo: 'u1',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Roof tiles displaced during high winds; water ingress reported in loft.',
        estimatedImpactGBP: 6200,
        riskFlags: ['NEW_POLICY', 'HIGH_IMPACT'],
        recommendation: 'Refer to Underwriting',
        documents: [
          { docId: 'd7', name: 'Roofing contractor quote', received: false },
          { docId: 'd8', name: 'Weather report / evidence', received: false }
        ],
        notes: [],
        createdAt: '2026-01-13T12:12:00Z'
      }
    ]
  };

  private dataSubject = new BehaviorSubject<FnolData>(this.data);
  private handlersSubject = new BehaviorSubject<Handler[]>(this.data.handlers);
  private policiesSubject = new BehaviorSubject<Policy[]>(this.data.policies);
  private claimsSubject = new BehaviorSubject<Claim[]>(this.data.claims);

  // ============ META ============
  getMeta(): Meta {
    return { ...this.data.meta };
  }

  setMeta(meta: Meta): void {
    this.data.meta = { ...meta };
    this.emitDataChange();
  }

  // ============ REFERENCE ============
  getReference(): Reference {
    return { ...this.data.reference };
  }

  getProducts(): string[] {
    return [...this.data.reference.products];
  }

  getLossTypes(): string[] {
    return [...this.data.reference.lossTypes];
  }

  getClaimStatuses(): string[] {
    return [...this.data.reference.claimStatuses];
  }

  getRecommendations(): string[] {
    return [...this.data.reference.recommendations];
  }

  getRiskFlagCatalog(): RiskFlag[] {
    return this.data.reference.riskFlagCatalog.map(rf => ({ ...rf }));
  }

  getRiskFlagByCode(code: string): RiskFlag | undefined {
    const flag = this.data.reference.riskFlagCatalog.find(rf => rf.code === code);
    return flag ? { ...flag } : undefined;
  }

  // ============ HANDLERS ============
  getHandlers(): Handler[] {
    return this.data.handlers.map(h => ({ ...h }));
  }

  getHandlers$(): Observable<Handler[]> {
    return this.handlersSubject.asObservable();
  }

  getHandlerById(id: string): Handler | undefined {
    const handler = this.data.handlers.find(h => h.id === id);
    return handler ? { ...handler } : undefined;
  }

  getHandlersByTeam(team: string): Handler[] {
    return this.data.handlers.filter(h => h.team === team).map(h => ({ ...h }));
  }

  addHandler(handler: Handler): void {
    this.data.handlers.push({ ...handler });
    this.handlersSubject.next(this.getHandlers());
    this.emitDataChange();
  }

  updateHandler(id: string, updates: Partial<Handler>): boolean {
    const index = this.data.handlers.findIndex(h => h.id === id);
    if (index === -1) return false;
    this.data.handlers[index] = { ...this.data.handlers[index], ...updates };
    this.handlersSubject.next(this.getHandlers());
    this.emitDataChange();
    return true;
  }

  deleteHandler(id: string): boolean {
    const index = this.data.handlers.findIndex(h => h.id === id);
    if (index === -1) return false;
    this.data.handlers.splice(index, 1);
    this.handlersSubject.next(this.getHandlers());
    this.emitDataChange();
    return true;
  }

  // ============ POLICIES ============
  getPolicies(): Policy[] {
    return this.data.policies.map(p => ({ ...p }));
  }

  getPolicies$(): Observable<Policy[]> {
    return this.policiesSubject.asObservable();
  }

  getPolicyById(id: string): Policy | undefined {
    const policy = this.data.policies.find(p => p.id === id);
    return policy ? { ...policy } : undefined;
  }

  getPolicyByNumber(policyNumber: string): Policy | undefined {
    const policy = this.data.policies.find(p => p.policyNumber === policyNumber);
    return policy ? { ...policy } : undefined;
  }

  getPoliciesByProduct(product: string): Policy[] {
    return this.data.policies.filter(p => p.product === product).map(p => ({ ...p }));
  }

  getPoliciesByStatus(status: string): Policy[] {
    return this.data.policies.filter(p => p.status === status).map(p => ({ ...p }));
  }

  getActivePolicies(): Policy[] {
    return this.data.policies.filter(p => p.status === 'Active').map(p => ({ ...p }));
  }

  addPolicy(policy: Policy): void {
    this.data.policies.push({ ...policy });
    this.policiesSubject.next(this.getPolicies());
    this.emitDataChange();
  }

  updatePolicy(id: string, updates: Partial<Policy>): boolean {
    const index = this.data.policies.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.policies[index] = { ...this.data.policies[index], ...updates };
    this.policiesSubject.next(this.getPolicies());
    this.emitDataChange();
    return true;
  }

  deletePolicy(id: string): boolean {
    const index = this.data.policies.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.policies.splice(index, 1);
    this.policiesSubject.next(this.getPolicies());
    this.emitDataChange();
    return true;
  }

  // ============ CLAIMS ============
  getClaims(): Claim[] {
    return this.data.claims.map(c => ({ ...c }));
  }

  getClaims$(): Observable<Claim[]> {
    return this.claimsSubject.asObservable();
  }

  getClaimById(id: string): Claim | undefined {
    const claim = this.data.claims.find(c => c.id === id);
    return claim ? { ...claim } : undefined;
  }

  getClaimByNumber(claimNumber: string): Claim | undefined {
    const claim = this.data.claims.find(c => c.claimNumber === claimNumber);
    return claim ? { ...claim } : undefined;
  }

  getClaimsByPolicyId(policyId: string): Claim[] {
    return this.data.claims.filter(c => c.policyId === policyId).map(c => ({ ...c }));
  }

  getClaimsByStatus(status: string): Claim[] {
    return this.data.claims.filter(c => c.status === status).map(c => ({ ...c }));
  }

  getClaimsByLossType(lossType: string): Claim[] {
    return this.data.claims.filter(c => c.lossType === lossType).map(c => ({ ...c }));
  }

  getClaimsByHandler(handlerId: string): Claim[] {
    return this.data.claims.filter(c => c.assignedTo === handlerId).map(c => ({ ...c }));
  }

  getUnassignedClaims(): Claim[] {
    return this.data.claims.filter(c => c.assignedTo === null).map(c => ({ ...c }));
  }

  addClaim(claim: Claim): void {
    this.data.claims.push({ ...claim });
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
  }

  updateClaim(id: string, updates: Partial<Claim>): boolean {
    const index = this.data.claims.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.claims[index] = { ...this.data.claims[index], ...updates };
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
    return true;
  }

  deleteClaim(id: string): boolean {
    const index = this.data.claims.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.claims.splice(index, 1);
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
    return true;
  }

  // ============ CLAIM DOCUMENTS ============
  getClaimDocuments(claimId: string): ClaimDocument[] {
    const claim = this.data.claims.find(c => c.id === claimId);
    return claim ? claim.documents.map(d => ({ ...d })) : [];
  }

  addClaimDocument(claimId: string, document: ClaimDocument): boolean {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return false;
    claim.documents.push({ ...document });
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
    return true;
  }

  updateClaimDocument(claimId: string, docId: string, updates: Partial<ClaimDocument>): boolean {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return false;
    const docIndex = claim.documents.findIndex(d => d.docId === docId);
    if (docIndex === -1) return false;
    claim.documents[docIndex] = { ...claim.documents[docIndex], ...updates };
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
    return true;
  }

  // ============ CLAIM NOTES ============
  getClaimNotes(claimId: string): ClaimNote[] {
    const claim = this.data.claims.find(c => c.id === claimId);
    return claim ? claim.notes.map(n => ({ ...n })) : [];
  }

  addClaimNote(claimId: string, note: ClaimNote): boolean {
    const claim = this.data.claims.find(c => c.id === claimId);
    if (!claim) return false;
    claim.notes.push({ ...note });
    this.claimsSubject.next(this.getClaims());
    this.emitDataChange();
    return true;
  }

  // ============ FULL DATA ============
  getData(): FnolData {
    return JSON.parse(JSON.stringify(this.data));
  }

  getData$(): Observable<FnolData> {
    return this.dataSubject.asObservable();
  }

  // ============ STATISTICS ============
  getClaimCountByStatus(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.data.reference.claimStatuses.forEach(status => {
      counts[status] = this.data.claims.filter(c => c.status === status).length;
    });
    return counts;
  }

  getClaimCountByLossType(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.data.reference.lossTypes.forEach(type => {
      counts[type] = this.data.claims.filter(c => c.lossType === type).length;
    });
    return counts;
  }

  getHandlerWorkload(): Record<string, number> {
    const workload: Record<string, number> = {};
    this.data.handlers.forEach(h => {
      workload[h.name] = this.data.claims.filter(c => c.assignedTo === h.id).length;
    });
    return workload;
  }

  getTotalEstimatedImpact(): number {
    return this.data.claims.reduce((sum, c) => sum + c.estimatedImpactGBP, 0);
  }

  // ============ PRIVATE ============
  private emitDataChange(): void {
    this.dataSubject.next(this.getData());
  }
}
