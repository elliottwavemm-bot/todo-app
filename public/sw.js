const CACHE = 'kaui-tam-v1'

const CACHEABLE_HOSTS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
]

// precache หน้าแรกและ asset ทั้งหมดที่อ้างถึงใน HTML
// (ชื่อไฟล์ JS/CSS มี hash เปลี่ยนทุก build จึงต้องอ่านจาก HTML แทนการ hardcode)
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      const res = await fetch('./')
      await cache.put('./', res.clone())
      const html = await res.text()
      const urls = [
        ...html.matchAll(/(?:src|href)="(\.\/[^"]+|https:\/\/fonts\.[^"]+)"/g),
      ]
        .map((m) => m[1])
        .filter((u) => !u.endsWith('sw.js'))
      await Promise.all(urls.map((u) => cache.add(u).catch(() => {})))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

// stale-while-revalidate: ตอบจาก cache ทันที แล้วอัปเดต cache เบื้องหลัง
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (!CACHEABLE_HOSTS.some((h) => request.url.startsWith(h))) return

  // ignoreVary: response ที่เก็บไว้อาจมี Vary header ซึ่งทำให้ request
  // ของ module script (ส่ง Origin) ไม่ match กับที่ precache ตอน install
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response.ok || response.type === 'opaque') {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => {
          if (cached) return cached
          // ออฟไลน์และไม่มีใน cache: ถ้าเป็นการเปิดหน้า ให้หน้าแรกที่ cache ไว้
          if (request.mode === 'navigate') {
            return caches.match('./', { ignoreVary: true })
          }
          return Response.error()
        })
      return cached || fetched
    }),
  )
})
