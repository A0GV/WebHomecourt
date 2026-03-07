import Nav from '../components/Nav'

function Juego() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-5xl font-bold">Juego</h1>
      <Nav current="Juego" />
    </div>
  )
}

export default Juego
