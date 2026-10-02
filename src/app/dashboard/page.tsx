"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FileText, Plus, LogOut, AlertCircle, Trash2 } from "lucide-react";
import { auth, documents, isPreviewMode } from "@/lib/storage";
import { DatabaseDocument } from "@/types/database";

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [docs, setDocs] = useState<DatabaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user } = await auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      setDocs(await documents.list());
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this document?")) {
      await documents.remove(id);
      setDocs(await documents.list());
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-slate-500">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {isPreviewMode() && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span><strong>Preview Mode:</strong> Data stored locally in your browser.</span>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">⚖️ PreBrief</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Documents</h2>
            <p className="text-slate-600 mt-1">Manage your legal documents</p>
          </div>
          <Link href="/wizard?template=contractor_agreement"><Button><Plus className="w-4 h-4 mr-2" />New Document</Button></Link>
        </div>
        {docs.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {docs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{doc.title}</div>
                            <div className="text-xs text-slate-500 capitalize">{doc.template_type.replace(/_/g, " ")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doc.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{doc.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(doc.updated_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={`/wizard?template=${doc.template_type}&id=${doc.id}`} className="text-sm text-slate-900 hover:underline font-medium">Edit</Link>
                          <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No documents yet</h3>
            <p className="text-slate-600 mb-6">Create your first legal document to get started</p>
            <Link href="/wizard?template=contractor_agreement"><Button><Plus className="w-4 h-4 mr-2" />Create Document</Button></Link>
          </div>
        )}
      </main>
    </div>
  );
}
