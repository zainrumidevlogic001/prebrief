export type DocumentStatus = "draft" | "completed" | "signed";
export type TemplateType = "contractor_agreement" | "nda" | "lease";

export interface DatabaseDocument {
  id: string;
  user_id: string;
  template_type: TemplateType;
  title: string;
  data: Record<string, any>;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}
