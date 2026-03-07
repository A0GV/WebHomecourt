import Nav from '../components/Nav'

function Agenda() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-5xl font-bold">Agenda</h1>
      <Nav current="Agenda" />
    </div>
  )
}

export default Agenda
