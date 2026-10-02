"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractorAgreementSchema, ContractorAgreementData } from "@/lib/validators/contractor";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui";
import { StepParties, StepProject, StepCompensation, StepLegal } from "@/components/wizard/Steps";
import { generateContractorDocx } from "@/lib/generators/contractor";
import { auth, documents, isPreviewMode } from "@/lib/storage";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

const steps = [
  { id: "parties", title: "The Parties", component: StepParties },
  { id: "project", title: "The Project", component: StepProject },
  { id: "compensation", title: "Compensation", component: StepCompensation },
  { id: "legal", title: "Legal Details", component: StepLegal },
];

function WizardContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [userId, setUserId] = useState("preview-user");
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateType = searchParams.get("template") || "contractor_agreement";
  const existingId = searchParams.get("id");

  const methods = useForm<ContractorAgreementData>({
    resolver: zodResolver(contractorAgreementSchema),
    mode: "onTouched",
    defaultValues: { paymentType: "fixed", includeNonCompete: false, includeIPAssignment: true },
  });

  useEffect(() => {
    (async () => {
      const { user } = await auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      if (existingId) {
        setLoading(true);
        const doc = await documents.get(existingId);
        if (doc) { setDocumentId(doc.id); methods.reset(doc.data); }
        setLoading(false);
      }
    })();
  }, [existingId, router, methods]);

  const { handleSubmit, trigger, getValues } = methods;
  const CurrentStepComponent = steps[currentStep].component;

  const saveDoc = async (data: ContractorAgreementData, status: "draft" | "completed") => {
    const payload = { user_id: userId, template_type: templateType as any, title: `Contractor Agreement - ${data.clientName || "Draft"}`, data, status };
    if (documentId) { await documents.update(documentId, payload); }
    else { const n = await documents.create(payload); setDocumentId(n.id); }
  };

  const onSubmit = async (data: ContractorAgreementData) => {
    setSaving(true);
    try {
      await saveDoc(data, "completed");
      await generateContractorDocx(data);
      router.push("/dashboard");
    } catch (err) { console.error(err); alert("Error generating document."); }
    finally { setSaving(false); }
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (valid && currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else if (valid) handleSubmit(onSubmit)();
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try { await saveDoc(getValues(), "draft"); alert("Draft saved!"); }
    catch { alert("Error saving draft."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-500">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {isPreviewMode() && (
        <div className="max-w-3xl mx-auto mb-4 bg-amber-50 border border-amber-200 rounded-md px-4 py-2 flex items-center gap-2 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>Preview Mode:</strong> Data saved locally in your browser.</span>
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{existingId ? "Edit Document" : "New Document"}</h1>
            <p className="text-slate-600 mt-1">Independent Contractor Agreement</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, i) => (
              <span key={step.id} className={`text-sm font-medium transition-colors ${i <= currentStep ? "text-slate-900" : "text-slate-400"}`}>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-1 ${i < currentStep ? "bg-slate-900 text-white" : i === currentStep ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
                  {i < currentStep ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{step.title}</span>
              </span>
            ))}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-slate-900 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
            <CurrentStepComponent />
            <div className="mt-8 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0}>← Back</Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving}>Save Draft</Button>
                <Button type="button" onClick={handleNext} disabled={saving}>
                  {saving ? "Processing..." : currentStep === steps.length - 1 ? "Generate Document 📄" : "Continue →"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-500">Loading...</div></div>}>
      <WizardContent />
    </Suspense>
  );
}
