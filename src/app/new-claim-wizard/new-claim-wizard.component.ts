import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputTextarea } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { FnolDataService } from '../services/fnol-data.service';
import { Policy, Handler, Claim } from '../models/fnol-data.model';

@Component({
  selector: 'app-new-claim-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputTextarea,
    CheckboxModule,
    DatePickerModule,
    StepsModule,
    CardModule,
    TagModule
  ],
  templateUrl: './new-claim-wizard.component.html',
  styleUrl: './new-claim-wizard.component.css'
})
export class NewClaimWizardComponent implements OnInit {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() claimCreated = new EventEmitter<Claim>();

  currentStep = 0;
  steps: MenuItem[] = [
    { label: 'Select Policy' },
    { label: 'Loss Details' }
  ];

  // Step 1: Policy Selection
  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  selectedPolicy: Policy | null = null;
  policySearchTerm = '';

  // Step 2: Loss Details Form
  lossDetailsForm!: FormGroup;
  lossTypes: { label: string; value: string }[] = [];
  handlers: Handler[] = [];

  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private fnolDataService: FnolDataService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initForm();
  }

  private loadData(): void {
    this.policies = this.fnolDataService.getActivePolicies();
    this.filteredPolicies = [...this.policies];
    this.handlers = this.fnolDataService.getHandlers();

    const lossTypesList = this.fnolDataService.getLossTypes();
    this.lossTypes = lossTypesList.map(lt => ({ label: lt, value: lt }));
  }

  private initForm(): void {
    this.lossDetailsForm = this.fb.group({
      lossType: ['', Validators.required],
      lossDate: [null, Validators.required],
      lossTime: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      incidentDescription: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      injury: [false],
      policeReport: [false],
      policeRef: [''],
      assignedTo: ['']
    });

    // Conditional validation for policeRef when policeReport is true
    this.lossDetailsForm.get('policeReport')?.valueChanges.subscribe(value => {
      const policeRefControl = this.lossDetailsForm.get('policeRef');
      if (value) {
        policeRefControl?.setValidators([Validators.required, Validators.minLength(5)]);
      } else {
        policeRefControl?.clearValidators();
        policeRefControl?.setValue('');
      }
      policeRefControl?.updateValueAndValidity();
    });
  }

  // Policy Search
  onPolicySearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.policySearchTerm = term;

    if (!term) {
      this.filteredPolicies = [...this.policies];
      return;
    }

    this.filteredPolicies = this.policies.filter(p =>
      p.policyNumber.toLowerCase().includes(term) ||
      p.customer.name.toLowerCase().includes(term) ||
      p.product.toLowerCase().includes(term)
    );
  }

  selectPolicy(policy: Policy): void {
    this.selectedPolicy = policy;
  }

  // Navigation
  nextStep(): void {
    if (this.currentStep === 0 && this.selectedPolicy) {
      this.currentStep = 1;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    if (this.currentStep === 0) {
      return this.selectedPolicy !== null;
    }
    return false;
  }

  // Form Submission
  submitClaim(): void {
    if (this.lossDetailsForm.invalid || !this.selectedPolicy) {
      this.lossDetailsForm.markAllAsTouched();
      return;
    }

    const formValue = this.lossDetailsForm.value;

    // Combine date and time
    const lossDate = new Date(formValue.lossDate);
    const [hours, minutes] = formValue.lossTime.split(':');
    lossDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const newClaim: Claim = {
      id: `cl${Date.now()}`,
      claimNumber: `CLM-${String(Math.floor(Math.random() * 900000) + 100000).substring(0, 6)}`,
      policyId: this.selectedPolicy.id,
      lossType: formValue.lossType,
      lossDateTime: lossDate.toISOString(),
      status: 'New',
      assignedTo: formValue.assignedTo || null,
      injury: formValue.injury,
      policeReport: formValue.policeReport,
      policeRef: formValue.policeReport ? formValue.policeRef : null,
      incidentDescription: formValue.incidentDescription,
      estimatedImpactGBP: 0,
      riskFlags: [],
      recommendation: 'STP Eligible',
      documents: [],
      notes: [],
      createdAt: new Date().toISOString()
    };

    this.fnolDataService.addClaim(newClaim);
    this.claimCreated.emit(newClaim);
    this.closePanel();
  }

  // Panel Control
  closePanel(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.currentStep = 0;
    this.selectedPolicy = null;
    this.policySearchTerm = '';
    this.filteredPolicies = [...this.policies];
    this.lossDetailsForm.reset({
      injury: false,
      policeReport: false
    });
  }

  // Helper methods
  getFieldError(fieldName: string): string {
    const control = this.lossDetailsForm.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (control.errors['minlength']) {
      const minLen = control.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLen} characters`;
    }
    if (control.errors['maxlength']) {
      const maxLen = control.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${maxLen} characters`;
    }
    if (control.errors['pattern']) return `Invalid ${this.getFieldLabel(fieldName)} format`;

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      lossType: 'Loss Type',
      lossDate: 'Loss Date',
      lossTime: 'Loss Time',
      incidentDescription: 'Incident Description',
      policeRef: 'Police Reference'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.lossDetailsForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  getPolicyTypeIcon(product: string): string {
    return product === 'Motor' ? 'pi pi-car' : 'pi pi-home';
  }

  getHandlerInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
