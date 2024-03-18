import { useState } from 'react'
import './style/global.css'
import { Search, ArrowBigDownDash } from "lucide-react"
import { searchVideo } from './utils/search-video';
import { downloadVideo } from './utils/download-video';

interface VideoInfo {
  ago: string;
  author: {
    name: string,
    url: string
  };
  description: string;
  duration: {
    seconds: number,
    timestamp: string
  };
  image: string;
  seconds: number;
  thumbnail: string;
  timestamp: string;
  title: string;
  type: string;
  url: string;
  videoId: string;
  views: number
}

export function App() {
  const [query, setQuery] = useState('');
  const [canShowError, setCanShowError] = useState(false)
  const [videoList, setVideoList] = useState<VideoInfo[]>();
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingList, setDownloadingList] = useState<string[]>([])

  const handleVideoSearch = async () => {
    setVideoList(undefined);

    if (isLoading) return;

    if (!query) {
      setCanShowError(true)
      setTimeout(() => setCanShowError(false), 2_000);
      return;
    }

    const videoQuery = query

    setIsLoading(true)
    const videos = await searchVideo(videoQuery) as VideoInfo[]
    setIsLoading(false)

    setVideoList(videos?.slice(0, 10))
  }

  const handleDownloadVideo = (videoInfo: VideoInfo) => {
    if (downloadingList.includes(videoInfo.videoId)) return;

    setDownloadingList([...downloadingList, videoInfo.videoId])

    downloadVideo(videoInfo.url).then(blob => {
      const url = URL.createObjectURL(blob)
      const element = document.createElement('a')
      element.href = url
      element.download = videoInfo.title + '.mp3'
      document.body.appendChild(element);
      element.click();
      element.remove();

      setDownloadingList(downloadingList.filter(id => id !== videoInfo.videoId))
    });
  }

  return (
    <div className='flex flex-col'>
      <div className='mt-3 flex gap-2 items-center justify-center text-gray-100'>
        <h1 className='text-2xl font-bold'>DL Tube</h1>
        <ArrowBigDownDash size={29} />
      </div>

      <div className='mt-4 justify-center flex m-2 gap-2'>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Insira o nome ou URL do video '
          className='text-gray-200 rounded-md border-2 border-yellow-200 bg-zinc-700 px-4 py-2 placeholder:text-gray-200 outline-none bg-'
        />
        <button className='bg-yellow-200 outline-none px-4 py-3 text-zinc-800 rounded-md' onClick={handleVideoSearch}>
          <Search />
        </button>
      </div>
      {canShowError && <small className='ml-12 text-xs text-red-400'>insira o nome ou URL do video</small>}

      {isLoading && <h2 className='self-center mt-12 text-lg text-gray-200'>Pesquisando...</h2>}

      <ul>
        {videoList?.map(video => (
          <div onClick={() => handleDownloadVideo(video)} className="flex rounded-md items-center gap-2 m-4 bg-zinc-700/60 hover:bg-zic-600" key={video.videoId}>
            <img src={video.thumbnail} className='object-cover rounded-bl-md rounded-tl-md h-32 w-32' />
            <div className='flex flex-col gap-2'>
              <span className='text-gray-200 text-lg'>{video.title}</span>
              {downloadingList.includes(video.videoId) && <span className='text-lg text-yellow-200'> Baixando... </span>}
            </div>
          </div>
        ))}
      </ul>
    </div>
  )

}

