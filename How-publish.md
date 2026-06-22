# Как выпустить Emerald Checkers в App Store

---

## Требования

- Mac с macOS 13+
- Xcode 15+ (скачать бесплатно из App Store)
- Apple Developer аккаунт ($99/год) — [developer.apple.com](https://developer.apple.com)
- Node.js 18+ — [nodejs.org](https://nodejs.org)

---

## Шаг 1 — Клонировать репозиторий

```bash
git clone git@github.com:qa-urbanovics/checkers.git
cd checkers
npm install
```

---

## Шаг 2 — Собрать и открыть в Xcode

```bash
npm run cap:ios
```

Эта команда делает три вещи сразу:
1. Собирает веб-приложение (`npm run build`)
2. Синхронизирует с iOS проектом (`npx cap sync ios`)
3. Открывает Xcode (`npx cap open ios`)

---

## Шаг 3 — Настроить подписание в Xcode

1. В левом дереве выбери **App** (верхний элемент)
2. Перейди во вкладку **Signing & Capabilities**
3. Поставь галку **Automatically manage signing**
4. В **Team** выбери свой Apple Developer аккаунт
5. **Bundle Identifier** должен быть: `com.emeraldcheckers.app`

> Если Xcode говорит "Failed to register bundle ID" — зайди на
> [developer.apple.com/account](https://developer.apple.com/account),
> создай App ID вручную с этим Bundle ID, затем вернись в Xcode.

---

## Шаг 4 — Проверить версию

1. Вкладка **General** → **Identity**
2. **Version**: `1.0.0`
3. **Build**: `1`

---

## Шаг 5 — Проверить на симуляторе (опционально)

Вверху выбери любой симулятор iPhone → нажми **▶ Run** (⌘R).
Убедись что игра запускается и работает.

---

## Шаг 6 — Создать архив

1. Вверху Xcode выбери таргет **Any iOS Device (arm64)** (не симулятор!)
2. В меню: **Product → Archive**
3. Подожди 1-3 минуты пока компилируется
4. Откроется окно **Organizer** с твоим архивом

---

## Шаг 7 — Загрузить в App Store Connect

В окне Organizer:
1. Нажми **Distribute App**
2. Выбери **App Store Connect** → **Next**
3. Выбери **Upload** → **Next**
4. Оставь все галки как есть → **Next**
5. Нажми **Upload**
6. Подожди 5-10 минут — билд появится в App Store Connect

---

## Шаг 8 — Заполнить листинг в App Store Connect

Открой [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

### Создать приложение
- Нажми **+** → **New App**
- Platform: **iOS**
- Name: `Emerald Checkers`
- Primary Language: **English**
- Bundle ID: `com.emeraldcheckers.app` (выбери из списка)
- SKU: `emeraldcheckers-001`
- User Access: Full Access

### Заполнить поля (копируй из `docs/appstore-listing.md`)

| Поле | Значение |
|------|----------|
| Name | `Emerald Checkers` |
| Subtitle | `Classic Draughts & Board Game` |
| Promotional Text | см. файл |
| Description | см. файл |
| Keywords | см. файл |
| Support URL | `https://qa-urbanovics.github.io/checkers/privacy/` |
| Marketing URL | `https://qa-urbanovics.github.io/checkers/` |
| Privacy Policy URL | `https://qa-urbanovics.github.io/checkers/privacy/` |
| Copyright | `© 2026 Aleksejs Urbanovics / Emerald Checkers` |

### Возрастной рейтинг
- Нажми **Edit** рядом с Age Rating
- На все вопросы отвечай **None / No**
- Результат: **4+**

### Категория
- Primary: **Games**
- Secondary: **Board**

### Цена
- Pricing and Availability → **Free**

---

## Шаг 9 — Загрузить скриншоты

Скриншоты лежат в папке `docs/appstore/`:

| Устройство | Папка | Размер |
|-----------|-------|--------|
| iPhone 6.9" (iPhone 16 Pro Max) | `docs/appstore/iphone-69/` | 1320×2868 |
| iPhone 6.7" (iPhone 14 Plus) | `docs/appstore/iphone-67/` | 1290×2796 |
| iPad 13" Pro | `docs/appstore/ipad-13/` | 2064×2752 |

В App Store Connect для каждого устройства загрузи все 5 скриншотов.

---

## Шаг 10 — Привязать билд

1. В разделе **Build** нажми **+**
2. Выбери билд, который загрузил на шаге 7
3. Если билда нет — подожди ещё 5-10 минут и обнови страницу

---

## Шаг 11 — Отправить на ревью

1. Нажми **Add for Review** или **Submit to App Review**
2. Ответь на вопросы:
   - Does this app use the Advertising Identifier (IDFA)? → **No**
   - Export compliance: → **No** (нет шифрования кроме стандартного iOS)
3. Нажми **Submit**

### Ожидание
Обычно **1-3 рабочих дня**. Придёт email когда одобрят или отклонят.

---

## Возможные проблемы

**"Missing compliance"** — при Upload выбери "No" на вопрос про шифрование

**"Icon is missing"** — убедись что `AppIcon.appiconset` содержит файл 1024×1024

**"Invalid bundle"** — проверь что Bundle ID точно `com.emeraldcheckers.app`

**Билд не появляется в App Store Connect** — подожди до 30 минут, иногда долго

---

## Протестировать игру в браузере (до сборки iOS)

Если хочешь проверить на iPhone через Safari:

```bash
npm run deploy:web
git add docs/
git commit -m "Deploy web version"
git push
```

Открой на iPhone: **https://qa-urbanovics.github.io/checkers/**

> Примечание: в браузере не будет хаптиков (вибрации) — это только нативный iOS.
> Всё остальное работает одинаково.
