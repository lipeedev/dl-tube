export async function searchVideo(query: string) {
  const videos = await fetch(`${import.meta.env.VITE_API_URL}/videos?video=` + query).then(d => d.json())
  return videos;
}
