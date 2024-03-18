export async function downloadVideo(url: string) {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/video?url=${url}`)
    .then(d => d.blob())

  return data;
}
