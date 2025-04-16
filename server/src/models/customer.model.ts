import { Pool } from 'pg';

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked'
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  GOVERNMENT = 'government',
  NONPROFIT = 'nonprofit'
}

export enum InteractionType {
  EMAIL = 'email',
  PHONE = 'phone',
  MEETING = 'meeting',
  NOTE = 'note',
  OTHER = 'other'
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
  title: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  company_name: string | null;
  industry: string | null;
  annual_revenue: number | null;
  employee_count: number | null;
  type: CustomerType;
  status: CustomerStatus;
  notes: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  type: InteractionType;
  summary: string;
  details: string | null;
  interaction_date: Date;
  next_follow_up_date: Date | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: object | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  companyName?: string;
  industry?: string;
  annualRevenue?: number;
  employeeCount?: number;
  type?: CustomerType;
  status?: CustomerStatus;
  notes?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  companyName?: string;
  industry?: string;
  annualRevenue?: number;
  employeeCount?: number;
  type?: CustomerType;
  status?: CustomerStatus;
  notes?: string;
}

export interface CreateInteractionDTO {
  customer_id: string;
  type: InteractionType;
  summary: string;
  details?: string;
  interaction_date?: Date;
  next_follow_up_date?: Date;
}

export interface CreateSegmentDTO {
  name: string;
  description?: string;
  criteria?: object;
}