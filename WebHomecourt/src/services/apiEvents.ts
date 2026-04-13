import { supabase } from "../lib/supabase";

export interface CourtTournament {
  event_id: number;
  event_name: string;
  date: string | null;
  created_user_id: string;
  court_id: number;
  max_players: number;
  current_players: number;
  min_age: number;
  max_age: number;
  skill_level_id: number | null;
  allow_event: boolean;
}

type CourtTournamentRow = Omit<CourtTournament, "court_id" | "current_players"> & {
  court_id: number | string;
};

interface UserEventRow {
  event_id: number | null;
}

export async function getCourtTournaments(): Promise<CourtTournament[]> {
  const { data, error } = await supabase
    .from("event")
    .select(
      "event_id, event_name, date, created_user_id, court_id, max_players, min_age, max_age, skill_level_id, allow_event"
    )
    .eq("allow_event", true)
    .order("date", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error("No se pudieron cargar los torneos");
  }

  const rows = (data ?? []) as CourtTournamentRow[];
  const normalizedRows = rows
    .map((row) => ({
      ...row,
      court_id: Number(row.court_id),
    }))
    .filter((row) => !Number.isNaN(row.court_id));

  if (normalizedRows.length === 0) {
    return [];
  }

  const playersCountByEvent = new Map<number, number>();
  const eventIds = normalizedRows.map((row) => row.event_id);
  const { data: userEventsData, error: userEventsError } = await supabase
    .from("user_event")
    .select("event_id")
    .in("event_id", eventIds);

  if (!userEventsError) {
    ((userEventsData ?? []) as UserEventRow[]).forEach((row) => {
      if (row.event_id === null) return;
      playersCountByEvent.set(row.event_id, (playersCountByEvent.get(row.event_id) ?? 0) + 1);
    });
  }

  return normalizedRows.map((row) => ({
    ...row,
    current_players: playersCountByEvent.get(row.event_id) ?? 0,
  }));
}
