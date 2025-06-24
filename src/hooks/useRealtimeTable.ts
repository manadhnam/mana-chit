import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeTable<T>(table: string, filter?: { column: string, value: any }) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    let query = supabase.from(table).select('*');
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }
    query.then(({ data }) => setData(data || []));

    const subscription = supabase
      .channel(table)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        // Optionally: re-fetch or update state based on payload
        query.then(({ data }) => setData(data || []));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [table, filter?.column, filter?.value]);

  return data;
} 