export interface ValidationErrorResponse {
  timestamp: Date;
  status: number;
  error: string;
  invalidFields: InvalidFields[]
}

export interface InvalidFields {
  field: string;
  error: string
}
