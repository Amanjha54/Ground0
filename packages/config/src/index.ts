import { ComplaintCategory, SeverityLevel, UserRole } from '@ground0/types';

export const APP_CONFIG = {
  name: 'GROUND0',
  tagline: 'Verify the Work. Reveal the Reality.',
  description: 'AI-Powered Proof of Physical Work & Municipal Trust Infrastructure',
  version: '1.0.0',
  defaultCoordinates: {
    latitude: 37.774929,
    longitude: -122.419418,
    zoom: 13,
  },
  geofenceRadiusDefaultMeters: 50.0,
  maxUploadSizeBytes: 50 * 1024 * 1024, // 50MB
  supportedMediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'audio/webm'],
};

export const COMPLAINT_CATEGORIES: {
  id: ComplaintCategory;
  label: string;
  iconName: string;
  description: string;
}[] = [
  {
    id: 'POTHOLE',
    label: 'Pothole & Road Cavity',
    iconName: 'AlertCircle',
    description: 'Road surface damage, depressions, cracks, and hazardous asphalt cavities.',
  },
  {
    id: 'GARBAGE',
    label: 'Garbage & Solid Waste',
    iconName: 'Trash2',
    description: 'Uncollected refuse, overflowing commercial dumpsters, and street waste.',
  },
  {
    id: 'DRAIN_BLOCKAGE',
    label: 'Drain Blockage & Flooding',
    iconName: 'Droplets',
    description: 'Clogged storm drains, overflowing culverts, and stagnant street runoff.',
  },
  {
    id: 'WATER_LEAKAGE',
    label: 'Water Main Leakage',
    iconName: 'Activity',
    description: 'Burst municipal supply pipes, hydrants leaking, or localized pavement swelling.',
  },
  {
    id: 'BROKEN_STREETLIGHT',
    label: 'Broken Streetlight',
    iconName: 'Sun',
    description: 'Dark corridors, damaged luminaires, exposed wiring, or non-functional fixtures.',
  },
  {
    id: 'ROAD_DAMAGE',
    label: 'Severe Road Damage',
    iconName: 'GitCommit',
    description: 'Collapsed embankments, missing guardrails, and buckled concrete spans.',
  },
  {
    id: 'ILLEGAL_DUMPING',
    label: 'Illegal Dumping',
    iconName: 'ShieldAlert',
    description: 'Unlawful disposal of construction debris, toxic drums, or hazardous scrap.',
  },
  {
    id: 'DAMAGED_PUBLIC_INFRASTRUCTURE',
    label: 'Damaged Public Assets',
    iconName: 'Building',
    description: 'Vandalized transit shelters, broken pedestrian bridges, or structural railings.',
  },
  {
    id: 'ENVIRONMENTAL_ISSUE',
    label: 'Environmental Hazard',
    iconName: 'Leaf',
    description: 'Chemical spills, dying municipal foliage, or unauthorized emissions.',
  },
  {
    id: 'OTHER',
    label: 'Other Civil Concern',
    iconName: 'HelpCircle',
    description: 'Civic maintenance matters requiring verification.',
  },
];

export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; color: string; badgeClass: string }
> = {
  LOW: {
    label: 'Low Priority',
    color: '#38bdf8',
    badgeClass: 'bg-sky-950 text-sky-300 border-sky-800',
  },
  MEDIUM: {
    label: 'Medium Priority',
    color: '#fbbf24',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-800',
  },
  HIGH: {
    label: 'High Priority',
    color: '#f97316',
    badgeClass: 'bg-orange-950 text-orange-300 border-orange-800',
  },
  CRITICAL: {
    label: 'Critical Hazard',
    color: '#f43f5e',
    badgeClass: 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse',
  },
};

export const ROYAL_OBSIDIAN_PALETTE = {
  obsidianBlack: '#090A0F',
  graphite: '#13151F',
  darkGlass: 'rgba(19, 21, 31, 0.75)',
  champagneGold: '#D4AF37',
  champagneGoldHover: '#F3E5AB',
  deepEmerald: '#059669',
  platinum: '#E2E8F0',
  amberWarning: '#F59E0B',
  controlledCrimson: '#E11D48',
};

export const ROLE_PERMISSIONS: Record<UserRole, { label: string; description: string }> = {
  CITIZEN: {
    label: 'Citizen',
    description: 'Can report issues, track resolutions, and confirm work completion.',
  },
  FIELD_WORKER: {
    label: 'Field Worker',
    description: 'Executes assigned work orders, captures verified Before/After evidence.',
  },
  CONTRACTOR: {
    label: 'Contractor Dispatcher',
    description: 'Manages contractor field teams and monitors job completion.',
  },
  INSPECTOR: {
    label: 'Official Inspector',
    description: 'Audits AI verification reports, inspects evidence, approves/rejects.',
  },
  PROJECT_MANAGER: {
    label: 'Project Manager',
    description: 'Dispatches work orders, manages sites, and oversees municipal projects.',
  },
  ORGANIZATION_ADMIN: {
    label: 'Department Administrator',
    description: 'Manages organization settings, cameras, integrations, and permissions.',
  },
  AUDITOR: {
    label: 'Compliance Auditor',
    description: 'Read-only immutable access to system telemetry, hashes, and audit events.',
  },
  SUPER_ADMIN: {
    label: 'Super Administrator',
    description: 'Root system administration across all organizations.',
  },
};
