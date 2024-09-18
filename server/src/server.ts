import express from 'express'
import ytSearch from 'yt-search';
import cors from 'cors'
import ytdl from 'ytdl-core'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/videos', async (req, res) => {
  const { videos } = await ytSearch(req.query.video as string)
  return res.json(videos)
})

app.get('/video', (req, res) => {
  const videoURL = req.query.url as string; // A URL do vídeo é passada como um parâmetro de consulta
  console.log(req.headers.id)
  const audioStream = ytdl(videoURL, {
    quality: 'highestaudio',
    requestOptions: {
      headers: {
        cookie: req.headers.authorization,
        'x-youtube-identity-token': req.headers.id
      }
    }
  });

  res.setHeader('Content-Type', 'audio/mpeg');

  audioStream.pipe(res);
})

app.listen(8080, () => console.log("running"))
