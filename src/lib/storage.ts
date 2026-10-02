import { DatabaseDocument } from "@/types/database";

export const isPreviewMode = () => {
  if (typeof window === "undefined") return true;
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_url_here"
  );
};

export const auth = {
  async signUp(email: string, _password: string) {
    const user = { id: "user-" + Date.now(), email };
    localStorage.setItem("prebrief_user", JSON.stringify(user));
    return { user, error: null };
  },
  async signIn(email: string, _password: string) {
    const user = { id: "user-" + Date.now(), email };
    localStorage.setItem("prebrief_user", JSON.stringify(user));
    return { user, error: null };
  },
  async signOut() {
    localStorage.removeItem("prebrief_user");
    return { error: null };
  },
  async getUser() {
    if (typeof window === "undefined") return { user: null };
    const s = localStorage.getItem("prebrief_user");
    return { user: s ? JSON.parse(s) : null };
  },
};

export const documents = {
  async list(): Promise<DatabaseDocument[]> {
    const s = localStorage.getItem("prebrief_documents");
    return s ? JSON.parse(s) : [];
  },
  async get(id: string): Promise<DatabaseDocument | null> {
    const all = await this.list();
    return all.find((d) => d.id === id) || null;
  },
  async create(doc: Omit<DatabaseDocument, "id" | "created_at" | "updated_at">): Promise<DatabaseDocument> {
    const newDoc: DatabaseDocument = {
      ...doc,
      id: "doc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const all = await this.list();
    all.unshift(newDoc);
    localStorage.setItem("prebrief_documents", JSON.stringify(all));
    return newDoc;
  },
  async update(id: string, updates: Partial<DatabaseDocument>): Promise<DatabaseDocument> {
    const all = await this.list();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Not found");
    all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem("prebrief_documents", JSON.stringify(all));
    return all[idx];
  },
  async remove(id: string) {
    const all = await this.list();
    const filtered = all.filter((d) => d.id !== id);
    localStorage.setItem("prebrief_documents", JSON.stringify(filtered));
  },
};
