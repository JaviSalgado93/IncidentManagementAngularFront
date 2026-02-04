import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  IncidentFilterParams,
  ApiResponse,
  PaginatedApiResponse,
  Category,
  IncidentStatusInfo,
  PriorityInfo,
  IncidentUpdateResponse,
  AddCommentRequest,
  IncidentUpdate
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Incident`;

  getIncidents(filters?: IncidentFilterParams): Observable<PaginatedApiResponse<Incident>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.Title) params = params.set('Title', filters.Title);
      if (filters.StatusId) params = params.set('StatusId', filters.StatusId.toString());
      if (filters.Priority) params = params.set('Priority', filters.Priority.toString());
      if (filters.CategoryId) params = params.set('CategoryId', filters.CategoryId);
      if (filters.PageNumber) params = params.set('PageNumber', filters.PageNumber.toString());
      if (filters.PageSize) params = params.set('PageSize', filters.PageSize.toString());
      if (filters.SortBy) params = params.set('SortBy', filters.SortBy);
      if (filters.SortOrder) params = params.set('SortOrder', filters.SortOrder);
    }

    return this.http.get<PaginatedApiResponse<Incident>>(`${this.apiUrl}/search`, { params });
  }

  getIncidentById(id: string): Observable<ApiResponse<Incident>> {
    return this.http.get<ApiResponse<Incident>>(`${this.apiUrl}/${id}`);
  }

  createIncident(incident: CreateIncidentRequest): Observable<ApiResponse<Incident>> {
    return this.http.post<ApiResponse<Incident>>(this.apiUrl, incident);
  }

  updateIncident(id: string, incident: UpdateIncidentRequest): Observable<ApiResponse<Incident>> {
    return this.http.put<ApiResponse<Incident>>(`${this.apiUrl}/${id}`, incident);
  }

  deleteIncident(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  getStatuses(): Observable<ApiResponse<IncidentStatusInfo[]>> {
    return this.http.get<ApiResponse<IncidentStatusInfo[]>>(`${this.apiUrl}/statuses`);
  }

  getPriorities(): Observable<ApiResponse<PriorityInfo[]>> {
    return this.http.get<ApiResponse<PriorityInfo[]>>(`${this.apiUrl}/priorities`);
  }

  // ============ UPDATES & COMMENTS ============

  /**
   * Obtener todas las actualizaciones de un incidente
   */
  getIncidentUpdates(incidentId: string): Observable<ApiResponse<IncidentUpdate[]>> {
    return this.http.get<ApiResponse<IncidentUpdate[]>>(`${this.apiUrl}/${incidentId}/updates`)
      .pipe(
        catchError(error => {
          console.error('Error getting incident updates:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Agregar un comentario a un incidente
   */
  addComment(incidentId: string, request: AddCommentRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${incidentId}/comments`, request)
      .pipe(
        catchError(error => {
          console.error('Error adding comment:', error);
          return throwError(() => error);
        })
      );
  }
}
