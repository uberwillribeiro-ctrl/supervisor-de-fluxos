import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e ANON KEY são obrigatórias. Verifique o .env.local');
}

// ─── Tipos do banco (espelho do schema público) ───────────────────────────────

export interface DbCase {
  id: number;
  user_id: string | null;
  name: string;
  year: number | null;
  reference_month: string | null;
  profile: string | null;
  responsible: string | null;
  age: number | null;
  sex: string | null;
  nationality: string | null;
  address: string | null;
  neighborhood: string | null;
  phone: string | null;
  violence_type: string | null;
  code: string | null;
  document_date: string | null;
  received_date: string | null;
  origin: string | null;
  cpf: string | null;
  birth_date: string | null;
  status: string | null;
  was_new: boolean | null;
  category: string | null;
  archived_month: string | null;
  archived_year: number | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  ultimo_relatorio: string | null;
}

export interface DbProcedure {
  id: number;
  case_id: number | null;
  name: string | null;
  month: string | null;
  year: number | null;
  service: string | null;
  category: string | null;
  sex: string | null;
  age: number | null;
  nationality: string | null;
  date: string | null;
  institution: number | null;
  contatos_com_exito: number | null;
  telefonicos_sem_exito: number | null;
  atendimento_individualizado: number | null;
  atendimento_em_grupo: number | null;
  encaminhamento_cras: number | null;
  visita_domiciliar: number | null;
  visita_institucional: number | null;
  visita_sem_exito: number | null;
  casos_desligados: number | null;
  outros_encaminhamentos: number | null;
  reuniao_familiar: number | null;
  palestras: number | null;
  prontuario_suas: number | null;
  relatorios: number | null;
  pias: number | null;
  parecer: number | null;
  atendidos_0_10_anos: number | null;
  atendimentos_0_10_anos: number | null;
  atendidos_11_17_anos: number | null;
  atendimentos_11_17_anos: number | null;
  mulheres_atendidas_violencia: number | null;
  others: string | null;
  created_at: string | null;
  user_id: string | null;
}

export interface DbProfile {
  id: string;
  username: string | null;
  name: string | null;
  role: string | null;
  created_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: DbCase;
        Insert: Omit<DbCase, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<DbCase>;
      };
      procedures: {
        Row: DbProcedure;
        Insert: Omit<DbProcedure, 'id' | 'created_at'>;
        Update: Partial<DbProcedure>;
      };
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, 'created_at'>;
        Update: Partial<DbProfile>;
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
