// Enums para estados y prioridades
export enum IncidentStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Resolved = 'RESOLVED',
  Closed = 'CLOSED'
}

export enum IncidentPriority {
  VeryLow = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  Critical = 5
}

// Interfaz principal del Incident
export interface Incident {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  statusId: number;
  statusName: string;
  priority: number;
  priorityName: string;
  priorityColor: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  commentCount: number;
  attachmentCount: number;
}

// DTO para crear incidente
export interface CreateIncidentRequest {
  title: string;
  description: string;
  priority: number;
  categoryId: string;
  assignedTo?: string;
}

// DTO para actualizar incidente
export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  statusId?: number;
  priority?: number;
  categoryId?: string;
  assignedTo?: string;
}

// Parámetros de filtrado
export interface IncidentFilterParams {
  Title?: string;
  StatusId?: number;
  Priority?: number;
  CategoryId?: string;
  PageNumber?: number;
  PageSize?: number;
  SortBy?: string;
  SortOrder?: string;
}

// Respuesta paginada
export interface PaginatedIncidents {
  items: Incident[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
