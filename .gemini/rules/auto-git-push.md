---
description: Her düzenleme sonrası otomatik Git Push kuralı
globs: *
---
# Otomatik Git Push Kuralı

Kullanıcı kuralı gereğince:
Her geliştirme, hata düzeltmesi veya düzenleme tamamlandıktan sonra;
1. Değişiklikler incelenmeli ve derleme/tip testleri yapılmalı (`npx tsc --noEmit`).
2. `git add .` ile sahnelenmeli.
3. Anlamlı ve açıklayıcı bir mesaj ile `git commit` edilmeli.
4. `git push origin main` komutu ile değişiklikler otomatik olarak uzak depoya gönderilmeli ve kullanıcıya teyit verilmelidir.
