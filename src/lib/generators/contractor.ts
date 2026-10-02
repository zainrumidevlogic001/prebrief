import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { ContractorAgreementData } from "@/lib/validators/contractor";

export async function generateContractorDocx(data: ContractorAgreementData) {
  const children: Paragraph[] = [
    new Paragraph({
      text: "INDEPENDENT CONTRACTOR AGREEMENT",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `This Agreement is made on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}, between:`,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Contractor: ", bold: true }),
        new TextRun(`${data.contractorName}, located at ${data.contractorAddress}.`),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Client: ", bold: true }),
        new TextRun(`${data.clientName}, located at ${data.clientAddress}.`),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({ text: "1. SERVICES", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
    new Paragraph({
      text: `The Contractor agrees to perform: ${data.projectDescription}. Commencing ${data.startDate}${data.endDate ? ` and concluding ${data.endDate}` : ""}.`,
      spacing: { after: 400 },
    }),
    new Paragraph({ text: "2. COMPENSATION", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
    new Paragraph({
      text: `The Client agrees to pay ${data.paymentType === "hourly" ? "an hourly rate of" : "a fixed fee of"} $${data.paymentAmount.toFixed(2)}. Terms: ${data.paymentTerms}.`,
      spacing: { after: 400 },
    }),
    new Paragraph({ text: "3. GOVERNING LAW", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
    new Paragraph({
      text: `This Agreement shall be governed by the laws of the State of ${data.governingState}.`,
      spacing: { after: 600 },
    }),
    new Paragraph({ children: [new TextRun({ text: "Contractor: ", bold: true }), new TextRun("___________________________")], spacing: { after: 100 } }),
    new Paragraph({ text: `Name: ${data.contractorName}`, spacing: { after: 400 } }),
    new Paragraph({ children: [new TextRun({ text: "Client: ", bold: true }), new TextRun("___________________________")], spacing: { after: 100 } }),
    new Paragraph({ text: `Name: ${data.clientName}` }),
  ];

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Contractor_Agreement_${data.clientName.replace(/\s+/g, "_")}.docx`);
}
