import Link from "next/link";
import { Button } from "@/components/ui";
import { FileText, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-slate-900">⚖️ PreBrief</span>
          <div className="flex gap-3">
            <Link href="/login"><Button variant="outline">Sign In</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full mb-6">
            Free to use • No credit card required
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Legal documents,{" "}
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">simplified</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Answer simple questions. Get professional, lawyer-ready documents in minutes. Download editable Word files.
          </p>
          <Link href="/signup"><Button className="text-lg px-8 py-6 rounded-lg">Start Creating Documents →</Button></Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Zap, title: "Fast & Easy", desc: "Answer plain-English questions and we generate your document instantly." },
            { icon: Shield, title: "Secure & Private", desc: "Your data stays in your browser. Nothing is uploaded anywhere." },
            { icon: FileText, title: "Professional Output", desc: "Download ready-to-sign .docx files. Fully editable in Word." },
          ].map((f) => (
            <div key={f.title} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <f.icon className="w-10 h-10 text-slate-900 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-slate-100 p-6 rounded-xl">
          <p className="text-sm text-slate-600 text-center">
            <strong>Disclaimer:</strong> PreBrief is a document generation tool and does not provide legal advice. All documents should be reviewed by a qualified attorney before use.
          </p>
        </div>
      </main>
    </div>
  );
}
