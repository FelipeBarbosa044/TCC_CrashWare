// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Cabecalho, Rodape } from './Componentes'
import { PgInicial } from './Paginas'


function App() {
  return (
    <>
      <div>
        <Cabecalho />

        <PgInicial />
          {/* https://www.figma.com/design/U7UqZ5YFRgsuLtWkSUfGDc/Glass-Effect--Community---c%C3%B3pia---Copy- */}
        <Rodape />
      </div>
    </>
  )
}

export default App
