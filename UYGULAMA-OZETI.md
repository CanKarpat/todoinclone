# Uygulama Özeti

## Genel Yapı
- Vite + React (JavaScript), `react-router-dom`, `@supabase/supabase-js`
- Supabase auth (e-posta/şifre), tüm sayfalar `ProtectedRoute` ile korumalı
- Ana dosyalar:
  - `src/supabaseClient.js` — Supabase client
  - `src/context/AuthContext.jsx` — session/user state, signIn/signOut
  - `src/components/ProtectedRoute.jsx`, `src/components/Nav.jsx`
  - `src/App.jsx` — route tanımları (`/login`, `/`, `/meetings`)
  - `src/pages/Login.jsx`, `src/pages/Todos.jsx`, `src/pages/Meetings.jsx`
  - `src/index.css` — sade, açık renk tema

## Giriş Ekranı (`src/pages/Login.jsx`)
- E-posta/şifre ile giriş (`signInWithPassword`)
- Kayıt ol ekranı yok
- Giriş yapılmadan hiçbir sayfaya erişilemiyor, otomatik `/login`'e yönlendiriliyor

## Görevler Ekranı (`src/pages/Todos.jsx`)
Masaüstünde 4 sütunlu düzen (dar ekranda alt alta dizilir):

1. **Günlük Rutinler** — ayrı `routines` tablosu. Checkbox günlük olarak otomatik sıfırlanır (`last_completed_date` bugünün tarihiyle karşılaştırılır).
2. **Bugün Yapılacaklar** — `is_today=true` olan, henüz taşınmamış görevler.
3. **Tüm Görevler** — diğer aktif görevler; görev ekleme formu bu sütunda.
4. **Tamamlananlar** — `moved_to_completed=true` olan görevler, tik atıldıkları tarihe göre gruplanmış.

Görev akışı:
- Checkbox işaretlenince `completed_at` kaydedilir, görev listede kalmaya devam eder.
- İkon buton (arşiv ikonu) ile "Tamamlananlara taşı" — büyük metin buton yerine küçük ikon buton kullanılıyor.
- Tamamlananlar'dan ikon buton (geri döndür ikonu) ile görev tekrar aktif listeye alınabiliyor. Geri dönen görevlerde satırın solunda küçük bir "tamamlananlardan geri döndü" rozeti gösteriliyor (`restored_from_completed` alanı).
- Silme her bölümde mevcut.

## Toplantılar Ekranı
Ayrı özet dosyasında: `TOPLANTILAR-EKRANI-OZET.md`

## Veritabanı Tabloları
- `todos`: id, user_id, title, tag, is_today, done, completed_at, moved_to_completed, restored_from_completed, created_at
- `routines`: id, user_id, title, last_completed_date, created_at
- `meetings`: id, user_id, title, starts_at, note, created_at

## Bekleyen İş
- İsimlendirme/tema çalışması: kullanıcı ayrı bir referans dosya ve CSS gönderecek, bu gelene kadar isimlendirme değişikliği yapılmadı.
