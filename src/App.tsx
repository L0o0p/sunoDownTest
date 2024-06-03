import { useState } from 'react'
import './App.css'
import { InputIdToDownload } from './component/InputPannel'

function App() {
  // 键入要下载的曲目的id
  const [songId, setSongId] = useState('')
  const imInput = (i: string) => {
    setSongId(i);
    console.log(i)
  }
  return (

    <>
      <InputIdToDownload songId={songId} setSongId={imInput} />
    </>
  )
}

export default App
