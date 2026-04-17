import { useState, useEffect } from 'react';
import { supabase, type DbProcedure } from '@/lib/supabase';

async function fetchProceduresQuery(
  month?: string,
  year?: string,
  service?: string,
): Promise<{ data: DbProcedure[] | null; error: string | null }> {
  let query = supabase.from('procedures').select('*').order('created_at', { ascending: false });
  if (month) query = query.eq('month', month);
  if (year) query = query.eq('year', parseInt(year, 10));
  if (service && service !== 'ALL') query = query.eq('service', service);
  const { data, error } = await query;
  return { data: data ?? null, error: error?.message ?? null };
}

export function useProcedures(month?: string, year?: string, service?: string) {
  const [procedures, setProcedures] = useState<DbProcedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchProceduresQuery(month, year, service).then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) setError(err);
      else setProcedures(data ?? []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [month, year, service, tick]);

  function refetch() {
    setTick((t) => t + 1);
  }

  async function createProcedure(values: Omit<DbProcedure, 'id' | 'created_at'>) {
    const { error: err } = await supabase.from('procedures').insert(values);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  async function updateProcedure(id: number, values: Partial<DbProcedure>) {
    const { error: err } = await supabase.from('procedures').update(values).eq('id', id);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  async function deleteProcedure(id: number) {
    const { error: err } = await supabase.from('procedures').delete().eq('id', id);
    if (err) return { error: err.message };
    refetch();
    return { error: null };
  }

  return { procedures, loading, error, createProcedure, updateProcedure, deleteProcedure, refetch };
}
