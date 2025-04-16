import { CustomerStatus, CustomerType } from '../models/customer.model';

export interface AddressDTO {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone: string;
  address?: AddressDTO;
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
  address?: AddressDTO;
  companyName?: string;
  industry?: string;
  annualRevenue?: number;
  employeeCount?: number;
  type?: CustomerType;
  status?: CustomerStatus;
  notes?: string;
} 