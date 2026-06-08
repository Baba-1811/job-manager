export type EntrySheet = {
  id: number;
  companyId: number;
  question: string;
  answer: string;
  charLimit: number | null;
  status: string;
  company?: {
    id: number;
    name: string;
  };
};
