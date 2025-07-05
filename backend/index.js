require('dotenv').config()
const axios = require('axios')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())

const openWeatherClient = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/'
})

app.get('/search', async (req, res) => {
    const query = req.query.query
    if (!query) {
        return res.status(400).json({ erro: 'Parâmetro "query" é obrigatório.' })
    }
    const partes = query.split(',').map(p => p.trim())
    if (partes.length !== 2 || isNaN(partes[0]) || isNaN(partes[1])) {
        return res.status(400).json({ erro: 'Parâmetro "query" deve conter latitude e longitude numéricas separadas por vírgula.' });
    }
    const [lat, lon] = partes

    try {
    const response = await openWeatherClient.get('forecast', {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_KEY,
        units: 'metric',
        lang: 'pt_br',
      },
    })

        const dataProcessing = response.data.list.map(item => ({
            dt: item.dt,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            humidity: item.main.humidity,
            description: item.weather[0]?.description || null,
            icon: item.weather[0]?.icon || null,
            pressure: item.main.pressure
        }))

        res.json({
            city: response.data.city?.name,
            timezone: response.data.city?.timezone,
            list: dataProcessing
        })

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response
            res.status(status).json({ erro: data.message })
        } else {
            res.status(500).json({ erro: 'Erro ao acessar a API do OpenWeatherMap.' })
        }
    }

})
const port = 3000
app.listen(port, () => console.log(`Backend Ok! Porta ${port}.`))
//http
//GET