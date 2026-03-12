import Nav from '../components/Nav'

function Store() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">Store</h1>
      <Nav current="Store" userId="c1998ce5-a357-4963-bda3-fde103393cdd"/>
    </div>
  )
}

export default Store
