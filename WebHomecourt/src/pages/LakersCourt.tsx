import Nav from '../components/Nav'
import Map from "../components/Map"
import NewEvent from '../components/NewEvent'
import ShowEvents from '../components/ShowEvents'
import RateCard from '../components/RateCard'
import JumboCard from '../components/JumboCard'
import { useEffect, useState } from 'react'
import { getPendingRatingPlayers, saveUserEventRating, type RatePlayer} from '../services/apiRate'

function LakersCourt() {
  const [players, setPlayers] = useState<RatePlayer[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)
  const [submittingRatings, setSubmittingRatings] = useState(false)
  const [playersError, setPlayersError] = useState<string | null>(null)
  const [pendingUserEventId, setPendingUserEventId] = useState<number | null>(null)
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({})
  const allPlayersRated =
    players.length > 0 && players.every((player) => Boolean(selectedRatings[player.id]))

  const loadPendingRatings = async () => {
    setLoadingPlayers(true)
    setPlayersError(null)

    try {
      const pendingRating = await getPendingRatingPlayers()

      if (!pendingRating) {
        setPendingUserEventId(null)
        setPlayers([])
        setSelectedRatings({})
        return
      }

      setPendingUserEventId(pendingRating.userEventId)
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
        <div className="w-full h-[169.588px] shrink-0 self-stretch px-5 py-7 bg-[#3B195C] rounded-[16px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
          <h1 className="justify-start text-zinc-100">Lakers Court</h1>
        </div>
        {loadingPlayers && <div className="p-5"><p>Cargando jugadores...</p></div>}
        {!loadingPlayers && playersError && <div className="p-5"><p>{playersError}</p></div>}
        {!loadingPlayers && players.length > 0 && <div className="p-5">
          <JumboCard
            title="Rate Players' Sportsmanship"
            subtitle="Las Riveras Park, court 2"
            onSubmit={handleSubmitRatings}
            submitText={submittingRatings ? 'Enviando calificaciones...' : 'Submit rating'}
            submitDisabled={submittingRatings || !allPlayersRated}
          >
            {players.map((player) => (
              <RateCard
                key={player.id}
                id={player.id}
                avatarUrl={player.avatarUrl}
                playerName={player.playerName}
                playerTag={player.playerTag}
                initialRating={player.initialRating}
                onReport={(id) => console.log('Reportado:', id)}
                onRatingChange={handlePlayerRating}
              />
            ))}
          </JumboCard>
        </div>}
        <div>
          <h1 className="text-2xl font-bold p-5">Events</h1>
          <div className="flex items-center justify-center">
          <NewEvent/>
          <ShowEvents/>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold p-5">Basketball Fields Map</h1>
          <div className="flex items-center justify-center">
          <Map />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LakersCourt
