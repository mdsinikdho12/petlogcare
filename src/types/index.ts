export type UserRole = "USER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  profileImage?: { url: string; key: string };
  language?: "en" | "bn";
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: "DOG" | "CAT" | "BIRD" | "RABBIT" | "OTHER";
  breed?: string;
  gender: "MALE" | "FEMALE";
  dob?: string;
  weightKg?: number;
  microchipNumber?: string;
  avatarUrl?: string;
  allergies?: string[];
  medicalNotes?: string;
}

export type ServiceMode = "IN_CLINIC" | "HOME_VISIT";
export type ProviderVerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface OperatingHour {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export type DocumentType =
  | "TRADE_LICENSE"
  | "TIN_CERTIFICATE"
  | "VET_DEGREE"
  | "NID"
  | "OTHER";

export interface VerificationDocument {
  id: string;
  docType: DocumentType;
  fileUrl: string;
  originalName?: string;
  createdAt: string;
}

export interface ProviderStaff {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  phone?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  experienceYears?: number;
  categories: string[];
  serviceModes: ServiceMode[];
  address: {
    street?: string;
    area?: string;
    city: string;
    district: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  logo?: { url: string; key: string };
  cover?: { url: string; key: string };
  gallery?: Array<{ id: string; url: string; key?: string }>;
  operatingHours?: OperatingHour[];
  verificationStatus: ProviderVerificationStatus;
  rejectionReason?: string;
  verified: boolean;
  services?: ServiceOffering[];
}

export interface ServiceOffering {
  id: string;
  providerId: string;
  title: string;
  category: string;
  description?: string;
  priceBDT: number;
  durationMinutes: number;
}

export interface PetDocument {
  id: string;
  petId: string;
  title: string;
  docType:
    | "VACCINATION_CERTIFICATE"
    | "PRESCRIPTION"
    | "LAB_REPORT"
    | "INSURANCE"
    | "IMAGING"
    | "ADOPTION_PAPER"
    | "OTHER";
  fileUrl?: string;
  issuedOn: string;
  expiryDate?: string;
  visibleToProviders: boolean;
  isExpired?: boolean;
  expiryStatus?: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  daysUntilExpiry?: number | null;
  notes?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
