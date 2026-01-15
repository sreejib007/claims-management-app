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
      { id: 'u4', name: 'A. Patel', team: 'SIU' },
      { id: 'u5', name: 'Sarah Chen', team: 'FNOL' },
      { id: 'u6', name: 'David Morris', team: 'Triage' },
      { id: 'u7', name: 'Emma Thompson', team: 'SIU' },
      { id: 'u8', name: 'Raj Sharma', team: 'FNOL' }
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
      },
      {
        id: 'p5',
        policyNumber: 'MTR-UK-456789',
        product: 'Motor',
        status: 'Active',
        startDate: '2025-03-15',
        endDate: '2026-03-14',
        customer: {
          customerId: 'c5',
          name: 'James Mitchell',
          email: 'j.mitchell@email.example',
          phone: '+44 20 7946 0505',
          address: '45 Oxford Street, London, W1D'
        },
        riskTier: 'Low',
        excessGBP: 200,
        premiumAnnualGBP: 890,
        coverage: {
          type: 'Comprehensive',
          windscreen: true,
          courtesyCar: true,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'AB21 CDE',
          make: 'Honda',
          model: 'Civic',
          year: 2022
        },
        policyNotes: ['No claims bonus: 5 years', 'Telematics: Yes']
      },
      {
        id: 'p6',
        policyNumber: 'HOM-UK-334455',
        product: 'Home',
        status: 'Active',
        startDate: '2025-08-01',
        endDate: '2026-07-31',
        customer: {
          customerId: 'c6',
          name: 'Victoria Gardens Trust',
          email: 'admin@victoriagardens.example',
          phone: '+44 20 7946 0606',
          address: '12 Richmond Hill, Richmond, TW10'
        },
        riskTier: 'Standard',
        excessGBP: 400,
        premiumAnnualGBP: 1150,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: true,
          homeEmergency: true
        },
        asset: {
          propertyType: 'Detached',
          yearBuilt: 2005,
          bedrooms: 5
        },
        policyNotes: ['High value contents', 'Alarm system installed']
      },
      {
        id: 'p7',
        policyNumber: 'MTR-UK-667788',
        product: 'Motor',
        status: 'Active',
        startDate: '2025-11-10',
        endDate: '2026-11-09',
        customer: {
          customerId: 'c7',
          name: 'Manchester Logistics Ltd',
          email: 'fleet@manchesterlogistics.example',
          phone: '+44 161 234 5678',
          address: '88 Deansgate, Manchester, M3'
        },
        riskTier: 'Standard',
        excessGBP: 350,
        premiumAnnualGBP: 1450,
        coverage: {
          type: 'Comprehensive',
          windscreen: true,
          courtesyCar: false,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'MN22 XYZ',
          make: 'Ford',
          model: 'Transit',
          year: 2022
        },
        policyNotes: ['Commercial vehicle', 'Named drivers: 4']
      },
      {
        id: 'p8',
        policyNumber: 'HOM-UK-998877',
        product: 'Home',
        status: 'Active',
        startDate: '2025-05-20',
        endDate: '2026-05-19',
        customer: {
          customerId: 'c8',
          name: 'Eleanor Wright',
          email: 'e.wright@email.example',
          phone: '+44 117 987 6543',
          address: '23 Clifton Down, Bristol, BS8'
        },
        riskTier: 'Low',
        excessGBP: 250,
        premiumAnnualGBP: 720,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: false,
          homeEmergency: true
        },
        asset: {
          propertyType: 'Flat',
          yearBuilt: 2015,
          bedrooms: 2
        },
        policyNotes: ['Ground floor flat', 'Security: entry phone system']
      },
      {
        id: 'p9',
        policyNumber: 'MTR-UK-112233',
        product: 'Motor',
        status: 'Active',
        startDate: '2025-09-01',
        endDate: '2026-08-31',
        customer: {
          customerId: 'c9',
          name: 'Birmingham Tech Solutions',
          email: 'operations@birminghamtech.example',
          phone: '+44 121 456 7890',
          address: '55 Colmore Row, Birmingham, B3'
        },
        riskTier: 'Standard',
        excessGBP: 300,
        premiumAnnualGBP: 1320,
        coverage: {
          type: 'Comprehensive',
          windscreen: true,
          courtesyCar: true,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'BH20 TEC',
          make: 'Tesla',
          model: 'Model 3',
          year: 2023
        },
        policyNotes: ['Electric vehicle', 'Charging equipment covered']
      },
      {
        id: 'p10',
        policyNumber: 'HOM-UK-445566',
        product: 'Home',
        status: 'Active',
        startDate: '2025-07-15',
        endDate: '2026-07-14',
        customer: {
          customerId: 'c10',
          name: 'Scottish Heritage Properties',
          email: 'claims@scottishheritage.example',
          phone: '+44 131 555 1234',
          address: '8 Royal Mile, Edinburgh, EH1'
        },
        riskTier: 'High',
        excessGBP: 750,
        premiumAnnualGBP: 2100,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: true,
          homeEmergency: true
        },
        asset: {
          propertyType: 'Listed Building',
          yearBuilt: 1780,
          bedrooms: 6
        },
        policyNotes: ['Grade A listed', 'Special restoration clause']
      },
      {
        id: 'p11',
        policyNumber: 'MTR-UK-778899',
        product: 'Motor',
        status: 'Active',
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        customer: {
          customerId: 'c11',
          name: 'Leeds Construction Group',
          email: 'admin@leedsconstruction.example',
          phone: '+44 113 222 3333',
          address: '100 Wellington Street, Leeds, LS1'
        },
        riskTier: 'Standard',
        excessGBP: 400,
        premiumAnnualGBP: 1680,
        coverage: {
          type: 'Third Party, Fire & Theft',
          windscreen: false,
          courtesyCar: false,
          personalInjury: true
        },
        asset: {
          vehicleReg: 'LD19 BLD',
          make: 'Land Rover',
          model: 'Defender',
          year: 2020
        },
        policyNotes: ['Work vehicle', 'Tools cover: £5000']
      },
      {
        id: 'p12',
        policyNumber: 'HOM-UK-223344',
        product: 'Home',
        status: 'Active',
        startDate: '2025-02-28',
        endDate: '2026-02-27',
        customer: {
          customerId: 'c12',
          name: 'Cardiff Bay Investments',
          email: 'property@cardiffbay.example',
          phone: '+44 29 2087 4500',
          address: '1 Mermaid Quay, Cardiff, CF10'
        },
        riskTier: 'Standard',
        excessGBP: 500,
        premiumAnnualGBP: 1350,
        coverage: {
          buildings: true,
          contents: true,
          accidentalDamage: true,
          homeEmergency: true
        },
        asset: {
          propertyType: 'Penthouse',
          yearBuilt: 2010,
          bedrooms: 3
        },
        policyNotes: ['Waterfront property', 'Flood risk assessed']
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
      },
      {
        id: 'cl5',
        claimNumber: 'CLM-000746',
        policyId: 'p5',
        lossType: 'Accident',
        lossDateTime: '2026-01-08T08:30:00Z',
        status: 'In Review',
        assignedTo: 'u2',
        injury: true,
        policeReport: true,
        policeRef: 'MET-CR-118845',
        incidentDescription: 'Side collision at junction. Driver reports whiplash. Third party at fault.',
        estimatedImpactGBP: 4500,
        riskFlags: ['HIGH_IMPACT'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd9', name: 'Police report', received: true },
          { docId: 'd10', name: 'Medical assessment', received: false },
          { docId: 'd11', name: 'Dashcam footage', received: true }
        ],
        notes: [
          {
            noteId: 'n3',
            authorId: 'u2',
            createdAt: '2026-01-10T14:20:00Z',
            text: 'Third party liability confirmed. Awaiting medical report for injury claim.'
          }
        ],
        createdAt: '2026-01-08T11:45:00Z'
      },
      {
        id: 'cl6',
        claimNumber: 'CLM-000747',
        policyId: 'p6',
        lossType: 'Fire',
        lossDateTime: '2026-01-07T19:45:00Z',
        status: 'Referred',
        assignedTo: 'u7',
        injury: false,
        policeReport: true,
        policeRef: 'MET-FR-445566',
        incidentDescription: 'Kitchen fire caused by faulty electrical appliance. Fire brigade attended. Significant damage to kitchen and adjoining dining room.',
        estimatedImpactGBP: 45000,
        riskFlags: ['HIGH_IMPACT', 'OOH_TIME'],
        recommendation: 'Refer to SIU',
        documents: [
          { docId: 'd12', name: 'Fire brigade report', received: true },
          { docId: 'd13', name: 'Electrical inspection report', received: false },
          { docId: 'd14', name: 'Contents inventory', received: false },
          { docId: 'd15', name: 'Contractor estimates', received: true }
        ],
        notes: [
          {
            noteId: 'n4',
            authorId: 'u7',
            createdAt: '2026-01-09T09:00:00Z',
            text: 'High value claim. Forensic investigation requested to confirm cause.'
          },
          {
            noteId: 'n5',
            authorId: 'u7',
            createdAt: '2026-01-11T16:30:00Z',
            text: 'Preliminary report confirms electrical fault. No fraud indicators.'
          }
        ],
        createdAt: '2026-01-08T08:00:00Z'
      },
      {
        id: 'cl7',
        claimNumber: 'CLM-000748',
        policyId: 'p7',
        lossType: 'Accident',
        lossDateTime: '2026-01-06T14:20:00Z',
        status: 'Resolved',
        assignedTo: 'u5',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Minor scrape in car park. Paint transfer and small dent on passenger door.',
        estimatedImpactGBP: 850,
        riskFlags: [],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd16', name: 'Photos of damage', received: true },
          { docId: 'd17', name: 'Repair estimate', received: true }
        ],
        notes: [
          {
            noteId: 'n6',
            authorId: 'u5',
            createdAt: '2026-01-07T10:15:00Z',
            text: 'Low value claim. STP approved. Payment processed.'
          }
        ],
        createdAt: '2026-01-06T16:00:00Z'
      },
      {
        id: 'cl8',
        claimNumber: 'CLM-000749',
        policyId: 'p8',
        lossType: 'Water Damage',
        lossDateTime: '2026-01-05T02:00:00Z',
        status: 'In Review',
        assignedTo: 'u6',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Burst pipe in bathroom during cold snap. Water damage to bathroom and bedroom below.',
        estimatedImpactGBP: 8500,
        riskFlags: ['HIGH_IMPACT', 'OOH_TIME'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd18', name: 'Emergency plumber invoice', received: true },
          { docId: 'd19', name: 'Damage photos', received: true },
          { docId: 'd20', name: 'Restoration company quote', received: false }
        ],
        notes: [
          {
            noteId: 'n7',
            authorId: 'u6',
            createdAt: '2026-01-06T11:00:00Z',
            text: 'Emergency repairs completed. Awaiting full restoration quote.'
          }
        ],
        createdAt: '2026-01-05T09:30:00Z'
      },
      {
        id: 'cl9',
        claimNumber: 'CLM-000750',
        policyId: 'p9',
        lossType: 'Theft',
        lossDateTime: '2026-01-04T23:00:00Z',
        status: 'New',
        assignedTo: 'u8',
        injury: false,
        policeReport: true,
        policeRef: 'WMP-CR-998877',
        incidentDescription: 'Catalytic converter stolen from parked vehicle overnight. Vehicle undriveable.',
        estimatedImpactGBP: 3200,
        riskFlags: ['OOH_TIME'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd21', name: 'Police crime reference', received: true },
          { docId: 'd22', name: 'CCTV footage request', received: false },
          { docId: 'd23', name: 'Repair quote', received: false }
        ],
        notes: [],
        createdAt: '2026-01-05T08:15:00Z'
      },
      {
        id: 'cl10',
        claimNumber: 'CLM-000751',
        policyId: 'p10',
        lossType: 'Storm',
        lossDateTime: '2026-01-03T16:30:00Z',
        status: 'In Review',
        assignedTo: 'u3',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Historic chimney stack damaged by high winds. Debris fell onto conservatory roof.',
        estimatedImpactGBP: 28000,
        riskFlags: ['HIGH_IMPACT'],
        recommendation: 'Refer to Underwriting',
        documents: [
          { docId: 'd24', name: 'Structural engineer report', received: true },
          { docId: 'd25', name: 'Conservation officer approval', received: false },
          { docId: 'd26', name: 'Specialist contractor quotes', received: true },
          { docId: 'd27', name: 'Weather report', received: true }
        ],
        notes: [
          {
            noteId: 'n8',
            authorId: 'u3',
            createdAt: '2026-01-05T14:00:00Z',
            text: 'Listed building - requires heritage specialist. Awaiting conservation approval.'
          }
        ],
        createdAt: '2026-01-04T10:00:00Z'
      },
      {
        id: 'cl11',
        claimNumber: 'CLM-000752',
        policyId: 'p11',
        lossType: 'Accident',
        lossDateTime: '2026-01-02T11:15:00Z',
        status: 'Resolved',
        assignedTo: 'u1',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Reversing accident on construction site. Damage to rear bumper and tailgate.',
        estimatedImpactGBP: 2100,
        riskFlags: [],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd28', name: 'Incident report', received: true },
          { docId: 'd29', name: 'Photos', received: true },
          { docId: 'd30', name: 'Repair invoice', received: true }
        ],
        notes: [
          {
            noteId: 'n9',
            authorId: 'u1',
            createdAt: '2026-01-03T09:30:00Z',
            text: 'Straightforward claim. Approved and paid.'
          }
        ],
        createdAt: '2026-01-02T14:00:00Z'
      },
      {
        id: 'cl12',
        claimNumber: 'CLM-000753',
        policyId: 'p12',
        lossType: 'Water Damage',
        lossDateTime: '2026-01-01T06:00:00Z',
        status: 'Resolved',
        assignedTo: 'u6',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'New Year flooding from flat above. Water ingress through ceiling affecting living room.',
        estimatedImpactGBP: 5600,
        riskFlags: ['OOH_TIME'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd31', name: 'Building management report', received: true },
          { docId: 'd32', name: 'Contents damage list', received: true },
          { docId: 'd33', name: 'Restoration invoice', received: true }
        ],
        notes: [
          {
            noteId: 'n10',
            authorId: 'u6',
            createdAt: '2026-01-02T11:00:00Z',
            text: 'Subrogation opportunity against upstairs neighbour insurance.'
          },
          {
            noteId: 'n11',
            authorId: 'u6',
            createdAt: '2026-01-08T16:00:00Z',
            text: 'Claim settled. Subrogation in progress.'
          }
        ],
        createdAt: '2026-01-01T10:30:00Z'
      },
      {
        id: 'cl13',
        claimNumber: 'CLM-000754',
        policyId: 'p5',
        lossType: 'Theft',
        lossDateTime: '2025-12-28T20:00:00Z',
        status: 'Resolved',
        assignedTo: 'u4',
        injury: false,
        policeReport: true,
        policeRef: 'MET-CR-117700',
        incidentDescription: 'Theft of personal items from vehicle. Window smashed in shopping centre car park.',
        estimatedImpactGBP: 1800,
        riskFlags: ['OOH_TIME'],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd34', name: 'Police report', received: true },
          { docId: 'd35', name: 'Window repair invoice', received: true },
          { docId: 'd36', name: 'Contents claim form', received: true }
        ],
        notes: [
          {
            noteId: 'n12',
            authorId: 'u4',
            createdAt: '2025-12-30T10:00:00Z',
            text: 'Low value theft. No fraud indicators. Approved.'
          }
        ],
        createdAt: '2025-12-29T09:00:00Z'
      },
      {
        id: 'cl14',
        claimNumber: 'CLM-000755',
        policyId: 'p6',
        lossType: 'Storm',
        lossDateTime: '2025-12-25T14:00:00Z',
        status: 'Resolved',
        assignedTo: 'u2',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Christmas Day storm. Garden fence blown down and garden furniture damaged.',
        estimatedImpactGBP: 2400,
        riskFlags: [],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd37', name: 'Weather report', received: true },
          { docId: 'd38', name: 'Damage photos', received: true },
          { docId: 'd39', name: 'Replacement quotes', received: true }
        ],
        notes: [
          {
            noteId: 'n13',
            authorId: 'u2',
            createdAt: '2025-12-27T11:30:00Z',
            text: 'Storm damage confirmed by Met Office data. Claim approved.'
          }
        ],
        createdAt: '2025-12-26T09:00:00Z'
      },
      {
        id: 'cl15',
        claimNumber: 'CLM-000756',
        policyId: 'p9',
        lossType: 'Accident',
        lossDateTime: '2026-01-13T07:45:00Z',
        status: 'New',
        assignedTo: null,
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Hit pothole on M6, causing tyre blowout and alloy wheel damage.',
        estimatedImpactGBP: 980,
        riskFlags: ['RECENT_LOSS'],
        recommendation: 'STP Eligible',
        documents: [
          { docId: 'd40', name: 'Photos of pothole', received: false },
          { docId: 'd41', name: 'Tyre/wheel damage photos', received: false }
        ],
        notes: [],
        createdAt: '2026-01-13T10:00:00Z'
      },
      {
        id: 'cl16',
        claimNumber: 'CLM-000757',
        policyId: 'p10',
        lossType: 'Fire',
        lossDateTime: '2025-12-20T21:30:00Z',
        status: 'Resolved',
        assignedTo: 'u7',
        injury: false,
        policeReport: false,
        policeRef: null,
        incidentDescription: 'Small fire in period fireplace. Smoke damage to drawing room. No structural damage.',
        estimatedImpactGBP: 12000,
        riskFlags: ['HIGH_IMPACT', 'OOH_TIME'],
        recommendation: 'Request Documents',
        documents: [
          { docId: 'd42', name: 'Fire safety inspection', received: true },
          { docId: 'd43', name: 'Smoke damage assessment', received: true },
          { docId: 'd44', name: 'Specialist cleaning quote', received: true }
        ],
        notes: [
          {
            noteId: 'n14',
            authorId: 'u7',
            createdAt: '2025-12-22T14:00:00Z',
            text: 'Period property requires specialist restoration. Heritage approved.'
          }
        ],
        createdAt: '2025-12-21T08:00:00Z'
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
