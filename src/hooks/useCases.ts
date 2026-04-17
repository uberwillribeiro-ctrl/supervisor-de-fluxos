import { useState, useEffect } from 'react';
import { supabase, type DbCase } from '@/lib/supabase';

export type CaseFilter = {
  status?: string;
  search?: string;
};

async function fetchCasesQuery(
  status?: string,
): Promise<{ data: DbCase[] | null; error: string | null }> {
  let query = supabase.from('cases').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  return { data: data ?? null, error: error?.message ?? null };
}

export function useCases(filter?: CaseFilter) {
  const [cases, setCases] = useState<DbCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const filterStatus = filter?.status;

  useEffect(() => {
    let cancelled = false;

    fetchCasesQuery(filterStatus).then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) setError(err);
      else setCases(data ?? []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filterStatus, tick]);

  function refetch() {
    setTick((t) => t + 1);
  }

  async function createCase(values: Omit<DbCase, 'id' | 'created_at' | 'updated_at'>) {
    const { error: err } = await supabase.from('cases').insert(values);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  async function updateCase(id: number, values: Partial<DbCase>) {
    const { error: err } = await supabase.from('cases').update(values).eq('id', id);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  async function archiveCase(id: number, reason: string, month: string, year: number) {
    const { error: err } = await supabase
      .from('cases')
      .update({
        status: 'archived',
        description: reason,
        archived_month: month,
        archived_year: year,
      })
      .eq('id', id);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  async function getCaseByCode(code: string): Promise<DbCase | null> {
    const { data } = await supabase.from('cases').select('*').eq('code', code).single();
    return data ?? null;
  }

  return { cases, loading, error, createCase, updateCase, archiveCase, getCaseByCode, refetch };
}
