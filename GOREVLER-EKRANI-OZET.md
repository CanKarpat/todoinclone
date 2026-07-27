# Görevler Ekranı — Özet

**Dosya:** `src/pages/Todos.jsx` (stil: `src/index.css`)

**Veri modeli (`todos` tablosu):**
- `title`, `tag` (iş/kişisel/boş), `is_today`, `done`, `completed_at`, `moved_to_completed`, `created_at`

**Ekran yapısı — 3 bölüm:**

1. **Ekleme formu** — başlık + etiket seçimi (İş / Kişisel / Etiket yok), "Ekle" butonu. Yeni görev varsayılan: `is_today=false`, `done=false`.

2. **Bugün Yapılacaklar** — `is_today=true` ve henüz taşınmamış (`moved_to_completed=false`) görevler. Sarı arka planla vurgulanıyor.

3. **Tüm Görevler** — `is_today=false` ve henüz taşınmamış diğer tüm görevler.

Her görev satırında: tamamlandı checkbox'ı (üstü çizili gösterir), etiket rozeti, "Bugün" toggle'ı, tik atılmışsa "Tamamlananlara taşı" butonu, ve Sil butonu.

4. **Tamamlananlar** — `moved_to_completed=true` olan görevler, **tik atıldıkları tarihe** göre gruplanıp başlıklandırılıyor (örn. "25 Temmuz 2026"), en yeni tarih üstte. Her satırda etiket rozeti + Sil butonu var (checkbox/Bugün toggle yok — artık pasif kayıt).

**Akış mantığı:**
- Checkbox işaretlenince `completed_at` o anki zamanla kaydediliyor (tarih grubu bunu kullanıyor), satır listede kalıyor.
- "Tamamlananlara taşı" butonuna basılınca `moved_to_completed=true` olup görev bölüm değiştiriyor — tarih değişmiyor.
- Checkbox taşınmadan geri açılırsa `completed_at` sıfırlanıyor, taşı butonu kayboluyor.
- Silme her bölümden çalışıyor.

Tüm bu akışlar gerçek Supabase verisiyle test edildi, çalışıyor.
