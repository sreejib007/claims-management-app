# Shared Module Architecture

This folder contains reusable components, pipes, and utilities for the FNOL application.

## Folder Structure

```
shared/
├── components/
│   ├── avatar/              # User/handler avatar display
│   ├── card/                # Generic card wrapper
│   ├── empty-state/         # Empty data state display
│   ├── icon-box/            # Icon container with styling
│   ├── metric-card/         # Dashboard metric cards
│   ├── section-header/      # Page/section headers
│   ├── status-badge/        # Status indicators (New, Approved, etc.)
│   ├── type-badge/          # Type indicators (Motor, Home, etc.)
│   └── index.ts             # Barrel export
├── pipes/
│   ├── format-currency.pipe.ts
│   ├── time-ago.pipe.ts
│   ├── truncate.pipe.ts
│   └── index.ts
├── utils/
│   ├── helpers.ts           # Utility functions
│   └── index.ts
└── index.ts                 # Main barrel export
```

## Usage

### Importing Components

```typescript
// Import individual components
import { StatusBadgeComponent, AvatarComponent } from '../shared/components';

// Or import from main barrel
import { StatusBadgeComponent, FormatCurrencyPipe, getInitials } from '../shared';
```

### Components

#### StatusBadge
Displays status with appropriate colors.

```html
<app-status-badge 
  status="New" 
  type="claim" 
  size="md" 
  [showDot]="true">
</app-status-badge>
```

**Inputs:**
- `status`: string - The status text
- `type`: 'claim' | 'policy' | 'recommendation'
- `size`: 'sm' | 'md' | 'lg'
- `showDot`: boolean
- `rounded`: boolean

#### TypeBadge
Displays product/loss type with icons.

```html
<app-type-badge 
  type="Motor" 
  category="product" 
  [showIcon]="true" 
  [showLabel]="true">
</app-type-badge>
```

**Inputs:**
- `type`: string
- `category`: 'product' | 'loss' | 'team'
- `showIcon`: boolean
- `showLabel`: boolean

#### Avatar
Displays user/handler avatar with initials.

```html
<app-avatar 
  name="John Doe" 
  size="md" 
  variant="circle" 
  color="secondary">
</app-avatar>
```

**Inputs:**
- `name`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'circle' | 'rounded' | 'square'
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light'
- `icon`: string (fallback icon if no name)

#### MetricCard
Dashboard metric display card.

```html
<app-metric-card
  label="Active Policies"
  [value]="42"
  icon="pi pi-shield"
  iconBg="primary"
  trend="5% increase"
  [trendUp]="true"
  colorVariant="variant-0">
</app-metric-card>
```

#### IconBox
Icon container with background styling.

```html
<app-icon-box 
  icon="pi pi-chart-pie" 
  size="md" 
  color="subtle-primary" 
  variant="rounded">
</app-icon-box>
```

#### SectionHeader
Page/section header with icon and actions slot.

```html
<app-section-header 
  title="Claims" 
  subtitle="12 total claims" 
  icon="pi pi-file" 
  variant="default">
  <button pButton>Action</button>
</app-section-header>
```

#### EmptyState
Empty data display.

```html
<app-empty-state 
  icon="pi pi-inbox" 
  title="No Claims" 
  message="No claims match your filters" 
  size="md" 
  [showAction]="true">
  <button pButton>Add Claim</button>
</app-empty-state>
```

#### Card
Generic card wrapper.

```html
<app-card 
  variant="default" 
  [hoverable]="true" 
  [bordered]="true" 
  [showHeader]="true" 
  [showFooter]="false">
  <div card-header>Header content</div>
  Body content
</app-card>
```

### Pipes

#### formatCurrency
```html
{{ 1500 | formatCurrency }} <!-- £1,500 -->
{{ 1500 | formatCurrency:'$':2 }} <!-- $1,500.00 -->
```

#### timeAgo
```html
{{ '2024-01-10' | timeAgo }} <!-- 5 days ago -->
```

#### truncate
```html
{{ longText | truncate:50:'...' }}
```

### Utility Functions

```typescript
import { getInitials, formatCurrency, getStatusSeverity, getLossTypeIcon } from '../shared/utils';

getInitials('John Doe'); // 'JD'
formatCurrency(1500); // '£1,500'
getStatusSeverity('New'); // 'info'
getLossTypeIcon('Accident'); // 'pi pi-car'
```

## Design Tokens

The components use consistent design tokens:

- **Colors**: primary, secondary, success, warning, danger, info
- **Sizes**: sm, md, lg, xl
- **Variants**: circle, rounded, square (for shapes)
- **Subtle variants**: subtle-primary, subtle-success, etc.
