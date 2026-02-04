export interface IncidentUpdate {
  id: string;
  incidentId: string;
  comment: string | null;
  authorId: string;
  authorName: string;
  updateType: UpdateType;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export type UpdateType =
  | 'COMMENT'
  | 'STATUS_CHANGE'
  | 'PRIORITY_CHANGE'
  | 'USER_REASSIGNMENT'
  | 'CATEGORY_CHANGE';

export interface AddCommentRequest {
  comment: string;
}

export interface IncidentUpdateResponse {
  updates: IncidentUpdate[];
  totalCount: number;
}
