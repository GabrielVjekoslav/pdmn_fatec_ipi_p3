import React, { useState } from 'react'
import Busca from './Busca'
import striptags from 'striptags'

const ListaPrevisao = () => {
  const [previsoes, setPrevisoes] = useState([])

  const onBuscaRealizada = async (termo, opcao) => {
    if (!termo || !opcao) return

    try {
      const response = await fetch(`http://localhost:3000/search?query=${termo}`)

      if (!response.ok) {
        console.error('Erro ao obter a previsão')
        setPrevisoes([])
        return
      }

      const data = await response.json()
      console.log(data)
      const novasPrevisoes = data.list.map((p) => {
        const item = {
          dataHora: new Date(p.dt * 1000),
          icone: p.icon,
          descricao: p.description,
        }

        if (opcao === 'temp') {
          item.min = p.temp_min;
          item.max = p.temp_max;
        } else if (opcao === 'press') {
          item.umidade = p.humidity;
          item.pressao = p.pressure;
        }

        return item
      })


      setPrevisoes(novasPrevisoes)
    } catch (erro) {
      console.error('Erro ao buscar previsões:', erro)
      setPrevisoes([])
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Previsão do Tempo</h1>

      <div className="mb-4">
        <Busca onBuscaRealizada={onBuscaRealizada} />
      </div>

      <div className="grid">
        {previsoes.map((p, i) => (
          <div key={i} className="col-12 md:col-6 lg:col-4">
            <div className="border-1 shadow-2 border-round p-3 flex align-items-center gap-3">
              <img src={`http://openweathermap.org/img/wn/${p.icone}@2x.png`} alt="Ícone clima" className="w-4rem h-4rem"/>
              <div className="flex flex-column">
                <span className="text-lg font-semibold">
                  {p.dataHora.toLocaleString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <span className="text-sm text-gray-700 mb-1">
                  {striptags(p.descricao)}
                </span>
                {p.min !== undefined && (
                  <span className="text-sm text-gray-600">
                    <strong>Mín:</strong> {p.min.toFixed(1)}°C | <strong>Máx:</strong> {p.max.toFixed(1)}°C
                  </span>
                )}

                {p.umidade !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600">
                      <strong>Umidade:</strong> {p.umidade}% |
                    </span>
                    <span className="text-sm text-gray-600">
                      <strong> Pressão:</strong> {p.pressao} hPa
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListaPrevisao
