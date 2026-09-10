export type UserRole = 'admin' | 'teacher' | 'student';

export type TeacherApprovalStatus = 'pending_email' | 'pending_admin_approval' | 'approved' | 'rejected';

export interface BaseUser {
  id: string;
  name: string; // Tam Ad (firstName + lastName)
  firstName: string; // Ad
  lastName: string; // Soyad
  email: string;
  password?: string; // Profilde belirlenebilen giriş şifresi
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface TeacherUser extends BaseUser {
  role: 'teacher';
  phone?: string;
  city: string; // İl
  district: string; // İlçe
  school: string; // Okul Adı
  branch: string; // Branş (örn. Matematik)
  principalName?: string; // Okul Müdürü Adı Soyadı
  status: TeacherApprovalStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  approvedAt?: string;
  assignedClasses: string[]; // ['5-A', '5-B']
  isProfileComplete?: boolean;
}

export interface StudentUser extends BaseUser {
  role: 'student';
  studentNumber: string; // Okul No
  gradeLevel: number; // 5
  classSection: string; // 5-A
  school: string;
  city: string;
  district: string;
  teacherId?: string;
  points: number;
  unlockedBadges: string[];
}

export interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: string[];
  phone?: string;
  city?: string;
  district?: string;
  school?: string;
  branch?: string;
  principalName?: string;
}

export type AuthUser = TeacherUser | StudentUser | AdminUser;

export interface SchoolItem {
  id: string;
  name: string;
  type: 'İlkokul' | 'Ortaokul' | 'İmam Hatip Ortaokulu' | 'Lise' | 'Diğer';
}

export interface DistrictItem {
  name: string;
  schools: SchoolItem[];
}

export interface ProvinceItem {
  plate: string;
  name: string;
  districts: DistrictItem[];
}

export interface TeacherRegistrationPayload {
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  password?: string;
  phone?: string;
  city: string;
  district: string;
  school: string;
  branch: string;
}
