export type UserRole = 'admin' | 'teacher' | 'student';

export type TeacherApprovalStatus = 'pending_email' | 'pending_admin_approval' | 'approved' | 'rejected' | 'suspended';

export interface BaseUser {
  id: string;
  name: string; // Tam Ad (firstName + lastName)
  firstName: string; // Ad
  lastName: string; // Soyad
  email?: string; // Öğretmen ve Yöneticiler için zorunlu, öğrenciler için opsiyonel
  password?: string; // Profilde belirlenebilen veya otomatik üretilen giriş şifresi
  gender?: 'Kız' | 'Erkek' | 'Belirtmek İstemiyorum' | string; // İsteğe bağlı cinsiyet
  role: UserRole;
  status?: TeacherApprovalStatus | string;
  accountStatus?: 'aktif' | 'beklemede';
  isKvkkAccepted?: boolean;
  avatar?: string;
  createdAt: string;
  kvkkAcceptedAt?: string; // KVKK & Öğretmen Taahhütnamesi Onay Zamanı
}

export interface ClassroomInfo {
  id: string;
  name: string; // Örn: '5-A'
  code: string; // 6 haneli sistem genelinde BENZERSİZ sınıf kodu (Örn: 'MRF5A1')
  teacherId?: string;
  school?: string;
  gradeLevel: number;
  createdAt: string;
}

export interface TeacherUser extends BaseUser {
  role: 'teacher';
  email: string;
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
  classCode?: string; // 6 haneli benzersiz sınıf kodu
  school: string;
  city: string;
  district: string;
  teacherId?: string;
  points: number;
  subjectPoints?: Record<string, number>; // Ders bazında kazanılan XP puanları: { 'Matematik': 250, 'Fen Bilimleri': 120 }
  unlockedBadges: string[];
}

export interface AdminUser extends BaseUser {
  role: 'admin';
  email: string;
  permissions: string[];
  phone?: string;
  city?: string;
  district?: string;
  school?: string;
  branch?: string;
  principalName?: string;
  assignedClasses?: string[];
  isProfileComplete?: boolean;
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

export interface StudentRegistrationPayload {
  firstName: string;
  lastName: string;
  name?: string;
  studentNumber: string;
  gradeLevel: number;
  classSection: string;
  city: string;
  district: string;
  school: string;
  gender?: string;
  email?: string;
  password?: string;
}

