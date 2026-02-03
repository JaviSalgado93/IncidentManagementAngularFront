// Enums para estados y prioridades
export enum IncidentStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed'
}

export enum IncidentPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

// Interfaz principal del Incident
export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// DTO para crear incidente
export interface CreateIncidentRequest {
  title: string;
  description: string;
  priority: IncidentPriority;
  assignedTo?: string;
}

// DTO para actualizar incidente
export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  assignedTo?: string;
}

// Parámetros de filtrado
export interface IncidentFilterParams {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  assignedTo?: string;
  reportedBy?: string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Respuesta paginada
export interface PaginatedIncidents {
  items: Incident[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
