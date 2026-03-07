import Nav from '../components/Nav'

function Perfil() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-5xl font-bold">Perfil</h1>
      <Nav current="Perfil" />
    </div>
  )
}

export default Perfil
