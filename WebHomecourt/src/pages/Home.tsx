import Nav from '../components/Nav'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">Home</h1>
      <Nav current="Home" />
    </div>
  )
}

export default Home
