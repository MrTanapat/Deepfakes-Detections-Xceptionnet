// ─────────────────────────────────────────────────────────────────────────────
// src/types/index.ts
// Central type definitions for all API contracts
// ─────────────────────────────────────────────────────────────────────────────

// ─── Generic API Response Wrapper ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // field-level validation errors
  code?: string;                     // e.g. "TOKEN_EXPIRED", "NOT_FOUND"
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

// POST /api/auth/register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

// POST /api/auth/login
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// POST /api/auth/refresh
export interface RefreshRequest {
  refreshToken: string;
}
export interface RefreshResponse {
  tokens: AuthTokens;
}

// GET /api/auth/me
export type MeResponse = User;

// ─── Detection ────────────────────────────────────────────────────────────────

export type DetectionLabel = "real" | "fake";
export type DetectionStatus = "pending" | "processing" | "completed" | "failed";
export type MediaType = "image" | "video";
export type ManipulationMethod =
  | "Deepfakes"
  | "Face2Face"
  | "FaceSwap"
  | "NeuralTextures"
  | "FaceShifter"
  | "DeepFakeDetection"
  | "unknown";

export interface FrameResult {
  frameIndex: number;
  label: DetectionLabel;
  confidence: number; // 0.0 - 1.0
}

export interface DetectionResult {
  label: DetectionLabel;
  confidence: number;          // aggregate confidence
  methodDetected: ManipulationMethod | null;
  framesAnalyzed: number;
  frameResults: FrameResult[]; // per-frame breakdown (video only)
  processingTimeMs: number;
}

export interface Detection {
  id: string;
  userId: string;
  fileHash: string;            // SHA-256 — used for cache lookup
  fileName: string;
  fileSize: number;            // bytes
  mediaType: MediaType;
  status: DetectionStatus;
  result: DetectionResult | null;
  cached: boolean;             // true if result came from cache
  createdAt: string;
  completedAt: string | null;
}

// POST /api/detect/upload  (multipart/form-data)
export interface UploadDetectRequest {
  file: File;
  forceReanalyze?: boolean;    // bypass cache
}
export interface UploadDetectResponse {
  detectionId: string;
  cached: boolean;
  result: DetectionResult | null;  // null if async (video)
  status: DetectionStatus;
}

// GET /api/detect/:id
export type DetectionByIdResponse = Detection;

// GET /api/detect/history  (with pagination)
export interface DetectionHistoryParams {
  page?: number;
  limit?: number;
  label?: DetectionLabel;
  mediaType?: MediaType;
}
export type DetectionHistoryResponse = PaginatedResponse<Detection>;

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface SystemStats {
  totalDetections: number;
  totalUsers: number;
  fakeDetected: number;
  realDetected: number;
  cacheHitRate: number;        // 0.0 - 1.0
  avgProcessingTimeMs: number;
}

// GET /api/admin/stats
export type AdminStatsResponse = SystemStats;

// GET /api/admin/users
export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}
export type AdminUsersResponse = PaginatedResponse<User>;

// PATCH /api/admin/users/:id
export interface UpdateUserRequest {
  role?: UserRole;
  email?: string;
  username?: string;
}
export type UpdateUserResponse = User;

// DELETE /api/admin/users/:id
export interface DeleteUserResponse {
  deleted: boolean;
}