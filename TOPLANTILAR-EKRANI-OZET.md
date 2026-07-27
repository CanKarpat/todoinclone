# Toplantılar Ekranı — Özet

**Dosya:** `src/pages/Meetings.jsx`

**Veri modeli (`meetings` tablosu):**
- `title`, `starts_at` (timestamptz), `note` (nullable), `created_at`

**Ekran yapısı:**
- Ekleme formu — başlık, tarih+saat (`datetime-local`), isteğe bağlı not
- **Yaklaşan Toplantılar** — en yakın tarihe göre artan sırayla listelenir
- **Geçmiş** — geçmiş toplantılar soluk renkte (opacity), en yeni geçmişten eskiye doğru sıralı
- Her satırda: başlık, not (varsa), tarih/saat (Türkçe format, örn. "1 Ağustos 2026 10:00"), Sil butonu

**Görünüm:** Bu sayfa diğer sayfalardan farklı olarak dar genişlikte (`720px`, `.narrow` class) tutuluyor — Görevler sayfası sütunlu düzen için genişletilirken Toplantılar sayfası eski görünümünde bırakıldı.

**Test durumu:** Gerçek Supabase verisiyle doğrulandı — ekleme, yaklaşan/geçmiş ayrımı, sıralama ve silme çalışıyor, konsol hatası yok.
