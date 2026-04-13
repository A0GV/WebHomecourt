import Nav from '../components/Nav'
import Map from "../components/Map"
import CourtTournaments from '../components/CourtTournaments'
import RatePlayersPanel from '../components/RatePlayersPanel'
import { useEffect, useState } from 'react'
import { getPendingRatingPlayers, saveUserEventRating, type RatePlayer} from '../services/apiRate'

function LakersCourt() {
  const [players, setPlayers] = useState<RatePlayer[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)
  const [submittingRatings, setSubmittingRatings] = useState(false)
  const [playersError, setPlayersError] = useState<string | null>(null)
  const [pendingUserEventId, setPendingUserEventId] = useState<number | null>(null)
  const [pendingCourtSubtitle, setPendingCourtSubtitle] = useState('Cancha no disponible')
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({})
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null)
  const allPlayersRated =
    players.length > 0 && players.every((player) => Boolean(selectedRatings[player.id]))

  const loadPendingRatings = async () => {
    setLoadingPlayers(true)
    setPlayersError(null)

    try {
      const pendingRating = await getPendingRatingPlayers()

      if (!pendingRating) {
        setPendingUserEventId(null)
        setPendingCourtSubtitle('Cancha no disponible')
        setPlayers([])
        setSelectedRatings({})
        return
      }

      setPendingUserEventId(pendingRating.userEventId)
      const subtitleParts = [pendingRating.courtName, pendingRating.courtDirection].filter(
        (value): value is string => Boolean(value && value.trim().length > 0)
      )
      setPendingCourtSubtitle(
        subtitleParts.length > 0 ? subtitleParts.join(', ') : 'Cancha no disponible'
      )
      setPlayers(pendingRating.players)
      setSelectedRatings((prevRatings) => {
        const nextRatings: Record<string, number> = {}

        pendingRating.players.forEach((player) => {
          const existingRating = prevRatings[player.id]
          if (existingRating) {
            nextRatings[player.id] = existingRating
          }
        })

        return nextRatings
      })
    } catch (error) {
      setPendingUserEventId(null)
      setPendingCourtSubtitle('Cancha no disponible')
      setPlayers([])
      setSelectedRatings({})
      setPlayersError(error instanceof Error ? error.message : 'Error al cargar jugadores')
    } finally {
      setLoadingPlayers(false)
    }
  }

  const handlePlayerRating = (playerId: string, rating: number) => {
    setPlayersError(null)
    setSelectedRatings((prev) => ({
      ...prev,
      [playerId]: rating,
    }))
  }

  const handleSubmitRatings = async () => {
    if (!pendingUserEventId) return

    const unratedPlayers = players.filter((player) => !selectedRatings[player.id])
    if (unratedPlayers.length > 0) {
      setPlayersError('Debes calificar a todos los jugadores antes de enviar')
      return
    }

    try {
      setSubmittingRatings(true)
      await Promise.all(
        players.map((player) =>
          saveUserEventRating(pendingUserEventId, player.id, selectedRatings[player.id])
        )
      )
      await loadPendingRatings()
    } catch (error) {
      setPlayersError(error instanceof Error ? error.message : 'Error al guardar calificacion')
    } finally {
      setSubmittingRatings(false)
    }
  }

  useEffect(() => {
    loadPendingRatings()
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Nav current="LakersCourt" />
      </div>
      <div className='px-14 py-5 bg-zinc-100 w-full '>
        <div className="w-full h-[169.588px] shrink-0 self-stretch px-5 py-7 bg-morado-oscuro rounded-[16px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
          <h1 className="justify-start text-zinc-100">Lakers Court</h1>
        </div>
        {loadingPlayers && <div className="p-5"><p>Cargando jugadores...</p></div>}
        {!loadingPlayers && playersError && <div className="p-5"><p>{playersError}</p></div>}
        {!loadingPlayers && players.length > 0 && <div className="p-5">
          <RatePlayersPanel
            players={players}
            subtitle={pendingCourtSubtitle}
            onSubmit={handleSubmitRatings}
            submitDisabled={submittingRatings || !allPlayersRated}
            submittingRatings={submittingRatings}
            onRatingChange={handlePlayerRating}
            onReportPlayer={(id) => console.log('Reportado:', id)}
          />
        </div>}
        <div>
          <h1 className="text-2xl font-bold p-5">Basketball Fields Map</h1>
          <div className="flex items-center justify-center">
          <Map selectedCourtId={selectedCourtId} onCourtSelect={setSelectedCourtId} />
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center px-5">
          <CourtTournaments selectedCourtId={selectedCourtId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LakersCourt
