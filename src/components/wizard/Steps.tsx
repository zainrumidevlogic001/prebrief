"use client";
import { useFormContext } from "react-hook-form";
import { Input, Label } from "@/components/ui";

export function StepParties() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Who is involved?</h2>
      <p className="text-slate-500">Let&apos;s start with the basic details of the parties.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contractorName">Contractor Name</Label>
          <Input id="contractorName" placeholder="John Doe" {...register("contractorName")} />
          {errors.contractorName && <p className="text-red-500 text-xs">{String(errors.contractorName.message)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Client / Company Name</Label>
          <Input id="clientName" placeholder="Acme Corp" {...register("clientName")} />
          {errors.clientName && <p className="text-red-500 text-xs">{String(errors.clientName.message)}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contractorAddress">Contractor Address</Label>
          <Input id="contractorAddress" placeholder="123 Main St, City, State" {...register("contractorAddress")} />
          {errors.contractorAddress && <p className="text-red-500 text-xs">{String(errors.contractorAddress.message)}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="clientAddress">Client Address</Label>
          <Input id="clientAddress" placeholder="456 Business Rd, City, State" {...register("clientAddress")} />
          {errors.clientAddress && <p className="text-red-500 text-xs">{String(errors.clientAddress.message)}</p>}
        </div>
      </div>
    </div>
  );
}

export function StepProject() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">What is the project?</h2>
      <p className="text-slate-500">Define the scope and timeline of the work.</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectDescription">Project Description / Scope of Work</Label>
          <textarea
            id="projectDescription"
            rows={4}
            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            placeholder="e.g., Design and develop a React Native mobile application..."
            {...register("projectDescription")}
          />
          {errors.projectDescription && <p className="text-red-500 text-xs">{String(errors.projectDescription.message)}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && <p className="text-red-500 text-xs">{String(errors.startDate.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepCompensation() {
  const { register, formState: { errors }, watch } = useFormContext();
  const paymentType = watch("paymentType");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">How will payment work?</h2>
      <p className="text-slate-500">Define the compensation structure and payment terms.</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Type</Label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="hourly" {...register("paymentType")} className="w-4 h-4 accent-slate-900" />
              <span className="text-sm">Hourly Rate</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="fixed" {...register("paymentType")} className="w-4 h-4 accent-slate-900" />
              <span className="text-sm">Fixed Fee</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentAmount">{paymentType === "hourly" ? "Hourly Rate ($)" : "Total Project Fee ($)"}</Label>
          <Input id="paymentAmount" type="number" step="0.01" placeholder="0.00" {...register("paymentAmount")} />
          {errors.paymentAmount && <p className="text-red-500 text-xs">{String(errors.paymentAmount.message)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Input id="paymentTerms" placeholder="e.g., Net 15, Due on receipt" {...register("paymentTerms")} />
          {errors.paymentTerms && <p className="text-red-500 text-xs">{String(errors.paymentTerms.message)}</p>}
        </div>
      </div>
    </div>
  );
}

export function StepLegal() {
  const { register, formState: { errors } } = useFormContext();

  const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Legal Details</h2>
      <p className="text-slate-500">Configure the legal framework for this agreement.</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="governingState">Governing State</Label>
          <select id="governingState" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" {...register("governingState")}>
            <option value="">Select a state</option>
            {states.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          {errors.governingState && <p className="text-red-500 text-xs">{String(errors.governingState.message)}</p>}
        </div>
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-semibold text-slate-900">Additional Clauses</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" {...register("includeIPAssignment")} className="w-4 h-4 mt-1 rounded border-slate-300 accent-slate-900" />
            <div>
              <div className="font-medium text-sm">Include IP Assignment Clause</div>
              <div className="text-xs text-slate-500">All work product belongs to the client</div>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" {...register("includeNonCompete")} className="w-4 h-4 mt-1 rounded border-slate-300 accent-slate-900" />
            <div>
              <div className="font-medium text-sm">Include Non-Compete Clause</div>
              <div className="text-xs text-slate-500">Contractor cannot work with competitors</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
