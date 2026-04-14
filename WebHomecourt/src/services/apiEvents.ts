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

export interface SkillLevel {
  skill_level_id: number;
  description: string;
}

type CourtTournamentRow = Omit<CourtTournament, "court_id" | "current_players"> & {
  court_id: number | string;
};

interface UserEventRow {
  event_id: number | string | null;
}

interface UserEventMembershipRow {
  user_event_id: number;
  rated_others: boolean | null;
}

type SkillLevelRow = {
  skill_level_id: number | string;
  description: string;
};

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new Error("No se pudo obtener el usuario actual");
  }

  return user.id;
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
      const eventId = Number(row.event_id);
      if (Number.isNaN(eventId)) return;
      playersCountByEvent.set(eventId, (playersCountByEvent.get(eventId) ?? 0) + 1);
    });
  }

  return normalizedRows.map((row) => ({
    ...row,
    current_players: playersCountByEvent.get(row.event_id) ?? 0,
  }));
}

export async function getSkillLevels(): Promise<SkillLevel[]> {
  const { data, error } = await supabase
    .from("skill_level")
    .select("skill_level_id, description")
    .order("skill_level_id", { ascending: true });

  if (error) {
    throw new Error("No se pudieron cargar los niveles de habilidad");
  }

  return ((data ?? []) as SkillLevelRow[])
    .map((row) => ({
      skill_level_id: Number(row.skill_level_id),
      description: row.description,
    }))
    .filter((row) => !Number.isNaN(row.skill_level_id));
}

export async function getCurrentUserJoinedEventIds(eventIds: number[]): Promise<Set<number>> {
  if (eventIds.length === 0) {
    return new Set<number>();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return new Set<number>();
  }

  const { data, error } = await supabase
    .from("user_event")
    .select("event_id")
    .eq("user_id", user.id)
    .in("event_id", eventIds);

  if (error) {
    throw new Error("No se pudo cargar tus inscripciones");
  }

  const joinedEventIds = new Set<number>();
  ((data ?? []) as UserEventRow[]).forEach((row) => {
    const eventId = Number(row.event_id);
    if (!Number.isNaN(eventId)) {
      joinedEventIds.add(eventId);
    }
  });

  return joinedEventIds;
}

export async function signUpTournament(eventId: number): Promise<void> {
  const userId = await getCurrentUserId();

  const { data: membershipData, error: membershipError } = await supabase
    .from("user_event")
    .select("user_event_id, rated_others")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`No se pudo verificar tu inscripcion: ${membershipError.message}`);
  }

  const membership = membershipData as UserEventMembershipRow | null;
  if (membership) {
    if (membership.rated_others) {
      const { error: updateError } = await supabase
        .from("user_event")
        .update({ rated_others: false })
        .eq("user_event_id", membership.user_event_id);

      if (updateError) {
        throw new Error(`No se pudo actualizar tu inscripcion: ${updateError.message}`);
      }
    }

    return;
  }

  const { error: insertError } = await supabase.from("user_event").insert({
    event_id: eventId,
    user_id: userId,
    rated_others: false,
  });

  if (insertError) {
    throw new Error(`No se pudo inscribir al evento: ${insertError.message}`);
  }
}

export async function leaveTournament(eventId: number): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("user_event")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`No se pudo cancelar tu inscripcion: ${error.message}`);
  }
}
