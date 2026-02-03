export interface IncidentStatusInfo {
  id: number;
  name: string;           // "OPEN", "IN_PROGRESS", etc.
  displayName: string;    // "Abierto", "En Progreso", etc.
  description: string;
}
