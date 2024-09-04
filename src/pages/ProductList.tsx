import React, { useEffect } from 'react'

const BASE_URL = 'https://3dprinter-web-api.benhalverson.workers.dev/list'

const getData = async () => {
  const response = await fetch(BASE_URL)
  const data = await response.json()
  console.log('data', data)
  return data
}


function ProductList() {
useEffect(() => {
  getData()
}, [])
  return (
    <div>ProductList</div>
  )
}

export default ProductList