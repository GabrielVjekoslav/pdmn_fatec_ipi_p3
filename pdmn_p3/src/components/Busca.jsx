import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'

const Busca = ({onBuscaRealizada, dica = 'Digite latitude,longitude'}) => {
  const [termoDeBusca, setTermoDeBusca] = useState('-23.561167625063238, -46.65648357473211')
  const [opcao, setOpcao] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const validarTermo = (termo) => {
    const partes = termo.split(',').map(p => p.trim())
    return partes.length === 2 && partes.every(p => !isNaN(p))
  }

  const realizarBusca = () => {
    if (validarTermo(termoDeBusca) && opcao) {
        onBuscaRealizada(termoDeBusca, opcao)
    }
  }

  useEffect(() => {
    realizarBusca()
  }, [])

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId)

    const novoTimeout = setTimeout(() => {
      if (validarTermo(termoDeBusca) && opcao) {
        realizarBusca()
      }
    }, 5000)

    setTimeoutId(novoTimeout)
    return () => clearTimeout(novoTimeout)
  }, [termoDeBusca, opcao])

  const onFormSubmit = (event) => {
    event.preventDefault()
    realizarBusca()
  }

  return (
    <form onSubmit={onFormSubmit}>
      <div className="flex flex-column gap-2">
        <span className="p-input-icon-left w-full">
          <InputText
            value={termoDeBusca}
            onChange={(e) => setTermoDeBusca(e.target.value)}
            placeholder={dica}
            className="w-full"
          />
        </span>

        <div className="flex gap-4">
          <div className="flex align-items-center">
            <RadioButton
              inputId="temp"
              name="opcao"
              value="temp"
              onChange={(e) => setOpcao(e.value)}
              checked={opcao === 'temp'}
            />
            <label htmlFor="temp" className="ml-2">Temperatura</label>
          </div>

          <div className="flex align-items-center">
            <RadioButton
              inputId="press"
              name="opcao"
              value="press"
              onChange={(e) => setOpcao(e.value)}
              checked={opcao === 'press'}
            />
            <label htmlFor="press" className="ml-2">Pressão/Umidade</label>
          </div>
        </div>

        <Button type="submit" label="OK" className="p-button-outlined mt-2" />
      </div>
    </form>
  )
}

export default Busca
