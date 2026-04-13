import { useEffect, useMemo, useState } from "react";
import { LuMapPin, LuPlus, LuSearch, LuTriangle, LuUsers } from "react-icons/lu";
import NewEvent from "./NewEvent";
import { getCourts, type Court } from "../services/apiMAP";
import { getCourtTournaments, type CourtTournament } from "../services/apiEvents";

interface CourtTournamentsProps {
  selectedCourtId: number | null;
}

interface TournamentDateParts {
  dateLabel: string;
  timeLabel: string;
}

function formatTournamentDateParts(value: string | null): TournamentDateParts {
  if (!value) {
    return {
      dateLabel: "Por definir",
      timeLabel: "--:--",
    };
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return {
      dateLabel: "Por definir",
      timeLabel: "--:--",
    };
  }

  const dateLabelRaw = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(parsedDate);

  return {
    dateLabel: dateLabelRaw.replace(".", ""),
    timeLabel: value.includes("T")
      ? new Intl.DateTimeFormat("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(parsedDate)
      : "--:--",
  };
}

function formatCreatorLabel(userId: string): string {
  if (!userId) return "Usuario";
  return `Usuario${userId.slice(0, 5)}`;
}

export default function CourtTournaments({ selectedCourtId }: CourtTournamentsProps) {
  const [tournaments, setTournaments] = useState<CourtTournament[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTournamentData() {
      setLoading(true);
      setError(null);

      try {
        const [eventsData, courtsData] = await Promise.all([getCourtTournaments(), getCourts()]);

        if (cancelled) return;

        setTournaments(eventsData);
        setCourts(courtsData ?? []);
      } catch (loadError) {
        if (!cancelled) {
          setTournaments([]);
          setCourts([]);
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los torneos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTournamentData();

    return () => {
      cancelled = true;
    };
  }, []);

  const courtNamesById = useMemo(
    () =>
      new Map<number, string>(
        courts.map((court) => [court.court_id, court.name])
      ),
    [courts]
  );

  const filteredTournaments = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();

    return tournaments.filter((tournament) => {
      if (selectedCourtId !== null && tournament.court_id !== selectedCourtId) {
        return false;
      }

      if (searchTerm.length === 0) {
        return true;
      }

      const tournamentName = tournament.event_name.toLowerCase();
      const courtName = (courtNamesById.get(tournament.court_id) ?? "").toLowerCase();

      return tournamentName.includes(searchTerm) || courtName.includes(searchTerm);
    });
  }, [courtNamesById, searchValue, selectedCourtId, tournaments]);

  const selectedCourtName =
    selectedCourtId === null
      ? "Todas las canchas"
      : courtNamesById.get(selectedCourtId) ?? `Cancha ${selectedCourtId}`;

  return (
    <section className="w-full max-w-313.75 h-166.75 mx-auto flex flex-col">
      <header className="bg-[#3B195C] rounded-t-[15px] h-[80px] px-6 py-0 flex items-center">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="text-[#F3F2F3] text-[20px] leading-[30px] font-normal text-left">
            Available Events
          </div>
          <button
            type="button"
            onClick={() => setShowCreateEvent((prevState) => !prevState)}
            className="h-[41px] w-[197px] rounded-[12px] bg-[#FCB136] text-[#11061A] text-[14px] font-medium flex items-center justify-center gap-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            <LuPlus size={16} />
            CREATE NEW EVENT
          </button>
        </div>
      </header>

      <div className="bg-white border-[0.8px] border-black/[0.08] rounded-b-[15px] px-6 py-[15px] flex-1 min-h-0 flex flex-col gap-[15px]">
      {showCreateEvent ? (
        <div className="rounded-[14px] border-[0.8px] border-[#E7E6E8] bg-[#F7F6F8] px-4 py-3">
          <NewEvent />
        </div>
      ) : null}

      <label className="relative block h-[45px] w-full max-w-[448px]">
        <LuSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(17,6,26,0.5)]"
        />
        <input
          type="text"
          placeholder="Search courts, events..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-full w-full rounded-[16px] border-[0.8px] border-[#E7E6E8] bg-white pl-10 pr-4 text-[16px] text-[#11061A] outline-none"
        />
      </label>

      {selectedCourtId !== null ? (
        <div className="text-[13px] leading-[19.5px] text-[#6F6975]">
          Mostrando torneos de <span className="text-[#542581]">{selectedCourtName}</span>
        </div>
      ) : null}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="h-full min-h-[250px] rounded-[14px] border-[0.8px] border-[#E7E6E8] bg-[#F3F2F5] flex items-center justify-center">
            <div className="text-[#542581] text-base font-semibold">Cargando torneos...</div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="h-full min-h-[250px] rounded-[14px] border-[0.8px] border-[#E7E6E8] bg-[#F3F2F5] flex items-center justify-center">
            <div className="text-red-600 text-base font-semibold">{error}</div>
          </div>
        ) : null}

        {!loading && !error && filteredTournaments.length === 0 ? (
          <div className="h-full min-h-[250px] rounded-[14px] border-[0.8px] border-[#E7E6E8] bg-[#F3F2F5] flex items-center justify-center">
            <div className="text-[#6F6975] text-base font-semibold">
              {selectedCourtId === null
                ? "No hay torneos activos en este momento"
                : `No hay torneos para ${selectedCourtName}`}
            </div>
          </div>
        ) : null}

        {!loading && !error && filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-[15px] pr-1 pb-1">
            {filteredTournaments.map((tournament) => {
              const courtName = courtNamesById.get(tournament.court_id) ?? `Cancha ${tournament.court_id}`;
              const { dateLabel, timeLabel } = formatTournamentDateParts(tournament.date);
              const safeMaxPlayers = Math.max(0, tournament.max_players);
              const currentPlayers = Math.min(tournament.current_players, safeMaxPlayers);
              const fillPercent =
                safeMaxPlayers > 0 ? Math.min(100, (currentPlayers / safeMaxPlayers) * 100) : 0;

              return (
                <article
                  key={tournament.event_id}
                  className="h-[250px] rounded-[14px] bg-[#F3F2F5] border-[0.8px] border-transparent px-5 pt-5 pb-[21px]"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[16px] leading-[24px] font-normal text-[#11061A] truncate">
                          {tournament.event_name}
                        </div>
                        <div className="mt-2 flex items-center gap-[6px] text-[12px] leading-[18px] text-[#6F6975]">
                          <LuMapPin size={12} />
                          {courtName}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[14px] leading-[21px] text-[#11061A]">{dateLabel}</div>
                        <div className="text-[12px] leading-[18px] text-[#6F6975]">{timeLabel}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-[6px]">
                      <div className="flex items-center justify-between text-[13px] leading-[19.5px]">
                        <span className="text-[#6F6975]">Players</span>
                        <span className="text-[#11061A]">
                          {currentPlayers}/{safeMaxPlayers}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#E7E6E8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#542581_0%,#FCB136_100%)]"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 border-b-[0.8px] border-[#E7E6E8] pb-3 text-[12px] leading-[18px] text-[#6F6975]">
                      Created by: <span className="text-[#542581]">{formatCreatorLabel(tournament.created_user_id)}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-[10px]">
                      <button
                        type="button"
                        className="h-[44px] flex-1 rounded-[12px] bg-[#542581] text-[#F3F2F3] text-[13px] leading-[19.5px] font-medium shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer"
                      >
                        SIGN UP
                      </button>
                      <button
                        type="button"
                        className="h-[44px] w-[44px] rounded-[12px] bg-[#E7E6E8] text-[#542581] flex items-center justify-center cursor-pointer"
                        aria-label="Ver jugadores"
                      >
                        <LuUsers size={16} />
                      </button>
                      <button
                        type="button"
                        className="h-[44px] w-[44px] rounded-[12px] border-[0.8px] border-[#FCB136]/30 bg-[#FCB136]/15 text-[#FCB136] flex items-center justify-center cursor-pointer"
                        aria-label="Reportar evento"
                      >
                        <LuTriangle size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
      </div>
    </section>
  );
}
