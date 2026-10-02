import { z } from "zod";

export const contractorAgreementSchema = z.object({
  contractorName: z.string().min(2, "Contractor name is required"),
  contractorAddress: z.string().min(5, "Address is required"),
  clientName: z.string().min(2, "Client name is required"),
  clientAddress: z.string().min(5, "Address is required"),
  projectDescription: z.string().min(10, "Please provide more detail"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  paymentType: z.enum(["hourly", "fixed"]),
  paymentAmount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentTerms: z.string().min(3, "e.g., Net 15"),
  includeNonCompete: z.boolean().default(false),
  includeIPAssignment: z.boolean().default(true),
  governingState: z.string().min(2, "State is required"),
});

export type ContractorAgreementData = z.infer<typeof contractorAgreementSchema>;
