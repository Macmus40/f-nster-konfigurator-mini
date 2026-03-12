# Instrukcja obsługi obrazów i CDN

Utworzyłem katalog `/public/images` z podziałem na kategorie. Wszystkie pliki, które tam wrzucisz, będą dostępne w aplikacji pod ścieżkami:

- `/images/fonster/nazwa_pliku.jpg`
- `/images/dorrar/nazwa_pliku.jpg`
- `/images/terrassystem/nazwa_pliku.jpg`

### Dostęp przez CDN (jsDelivr)
Jeśli Twój projekt jest publiczny na GitHubie, możesz uzyskać dostęp do obrazów przez globalny CDN jsDelivr.
Format linku:
`https://cdn.jsdelivr.net/gh/[TWOJA_NAZWA_UZYTKOWNIKA]/[NAZWA_REPOZYTORIUM]@main/public/images/[KATEGORIA]/nazwa_pliku.jpg`

### Jak zaktualizować linki w projekcie?
W pliku `src/constants.ts` możesz zmienić `imageSrc` na ścieżki lokalne, np.:
`imageSrc: '/images/fonster/okno-1.png'`

Vite automatycznie obsłuży te pliki z folderu `public`.
