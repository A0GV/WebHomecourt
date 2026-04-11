import Nav from '../components/Nav'
import Map from "../components/Map"
import NewEvent from '../components/NewEvent'
import ShowEvents from '../components/ShowEvents'
import RateCard from '../components/RateCard'
import JumboCard from '../components/JumboCard'
function LakersCourt() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Nav current="LakersCourt" />
      </div>
      <div className='px-14 py-5 bg-zinc-100 w-full '>
        <div className="w-full h-[169.588px] shrink-0 self-stretch px-5 py-7 bg-[#3B195C] rounded-[16px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
          <h1 className="justify-start text-zinc-100">Lakers Court</h1>
        </div>
        <div className="p-5">
          <JumboCard
            title="Rate Players' Sportsmanship"
            subtitle="Las Riveras Park, court 2"
            onSubmit={() => console.log("Rating Submitted")}
          >
            <RateCard
              id="player-1"
              avatarUrl="https://i.pravatar.cc/150?img=1"
              playerName="Adolfo García"
              playerTag="@AdolfGOD"
              initialRating={4}
              onReport={(id) => console.log("Reportado:", id)}
            />
            <RateCard
              id="player-2"
              avatarUrl="https://i.pravatar.cc/150?img=2"
              playerName="Luis Humberto"
              playerTag="@Wicho"
              initialRating={4}
              onReport={(id) => console.log("Reportado:", id)}
            />
            <RateCard
              id="player-3"
              avatarUrl="https://i.pravatar.cc/150?img=3"
              playerName="Cristina González"
              playerTag="@cgonzalez10"
              initialRating={4}
              onReport={(id) => console.log("Reportado:", id)}
            />
            <RateCard
              id="player-4"
              avatarUrl="https://i.pravatar.cc/150?img=4"
              playerName="Cielo Vega"
              playerTag="@SkyMaligna"
              initialRating={4}
              onReport={(id) => console.log("Reportado:", id)}
            />
          </JumboCard>
        </div>
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
