import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  IncidentFilterParams,
  PaginatedIncidents,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/incidents`;

  // ========== CRUD BÁSICO ==========

  /**
   * Obtener todos los incidentes (con paginación y filtros)
   */
  getIncidents(filters?: IncidentFilterParams): Observable<ApiResponse<PaginatedIncidents>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.assignedTo) params = params.set('assignedTo', filters.assignedTo);
      if (filters.reportedBy) params = params.set('reportedBy', filters.reportedBy);
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDirection) params = params.set('sortDirection', filters.sortDirection);
    }

    return this.http.get<ApiResponse<PaginatedIncidents>>(this.apiUrl, { params });
  }

  /**
   * Obtener un incidente por ID
   */
  getIncidentById(id: string): Observable<ApiResponse<Incident>> {
    return this.http.get<ApiResponse<Incident>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo incidente
   */
  createIncident(incident: CreateIncidentRequest): Observable<ApiResponse<Incident>> {
    return this.http.post<ApiResponse<Incident>>(this.apiUrl, incident);
  }

  /**
   * Actualizar incidente existente
   */
  updateIncident(id: string, incident: UpdateIncidentRequest): Observable<ApiResponse<Incident>> {
    return this.http.put<ApiResponse<Incident>>(`${this.apiUrl}/${id}`, incident);
  }

  /**
   * Eliminar incidente
   */
  deleteIncident(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // ========== OPERACIONES ADICIONALES ==========

  /**
   * Obtener incidentes del usuario actual
   */
  getMyIncidents(filters?: IncidentFilterParams): Observable<ApiResponse<PaginatedIncidents>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedIncidents>>(`${this.apiUrl}/my-incidents`, { params });
  }

  /**
   * Cambiar estado de un incidente
   */
  updateStatus(id: string, status: string): Observable<ApiResponse<Incident>> {
    return this.http.patch<ApiResponse<Incident>>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Asignar incidente a un usuario
   */
  assignIncident(id: string, userId: string): Observable<ApiResponse<Incident>> {
    return this.http.patch<ApiResponse<Incident>>(`${this.apiUrl}/${id}/assign`, { userId });
  }

  /**
   * Obtener estadísticas de incidentes
   */
  getStatistics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/statistics`);
  }
}
