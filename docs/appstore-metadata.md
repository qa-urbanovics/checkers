# App Store Metadata — Emerald Courts Checkers

## Как добавить несколько языков в App Store Connect

В разделе версии (1.0.0 → Prepare for Submission) вверху есть выпадающее меню языка.
По умолчанию стоит **English (U.S.)** — это обязательный язык.
Чтобы добавить другие: нажми **"+"** рядом с языком → выбери нужный → заполни поля.

Рекомендуется добавить:
- **English (U.S.)** — обязательный, показывается всем у кого нет своего языка
- **Russian** — для русскоязычных пользователей
- **Spanish (Spain)** — для испаноязычных

---

## English (U.S.) — обязательный

**Name**
```
Checkers: Emerald Courts
```

**Subtitle** (30 символов макс)
```
Russian & International Draughts
```

**Description**
```
Classic checkers reimagined with a beautiful emerald design — for players who love to think.

Two game modes:
• Player vs Player — play together on one device, pass and play
• Play vs AI — three difficulty levels: Easy, Medium, and Hard

Two rulesets:
• 8×8 Russian Checkers — 12 pieces per side, classic rules
• 10×10 International Draughts — 20 pieces per side, larger board

Features:
• Flying King: moves any number of squares diagonally in any direction
• Mandatory majority capture rule
• Chain captures: when promoted mid-chain, the king continues immediately
• Draw offer system — AI accepts or declines based on board position
• Three board themes: Emerald, Classic, Marble
• Two piece styles: Classic (ivory & black) and Color (crimson & forest green)
• Move hints: highlights all valid moves and captures
• Win statistics tracked per difficulty level
• Available in English, Russian, and Spanish
```

**Keywords** (100 символов макс, через запятую без пробелов)
```
checkers,draughts,board game,strategy,chess,two player,AI,russian checkers,international
```

**What's New in This Version**
```
First release. Russian and international draughts with a smart AI opponent and a stunning emerald design.
```

**Support URL**
```
https://github.com/qa-urbanovics/checkers
```

---

## Russian

**Name**
```
Шашки: Emerald Courts
```

**Subtitle**
```
Русские и международные шашки
```

**Description**
```
Классические шашки в элегантном исполнении — для тех, кто любит думать.

Два режима игры:
• Игрок против игрока — играйте вдвоём на одном устройстве
• Игра против ИИ — три уровня сложности: лёгкий, средний, сложный

Два варианта правил:
• 8×8 Русские шашки — 12 шашек, классические правила
• 10×10 Международные шашки — 20 шашек, расширенное поле

Особенности:
• Дамка-летунья: ходит на любое расстояние по диагонали в любом направлении
• Обязательное взятие наибольшего количества шашек
• Серия взятий: при превращении в дамку цепочка продолжается немедленно
• Предложение ничьей — ИИ принимает или отклоняет в зависимости от позиции
• Три темы доски: Изумрудная, Классическая, Мраморная
• Два стиля шашек: Классика (слоновая кость и чёрные) и Цветные (алые и лесные)
• Подсветка допустимых ходов и взятий
• Статистика побед по каждому уровню сложности
• Интерфейс на русском, английском и испанском
```

**Keywords**
```
шашки,шахматы,настольная игра,стратегия,два игрока,ИИ,русские шашки,международные шашки
```

**What's New in This Version**
```
Первый выпуск. Русские и международные шашки с умным ИИ и красивым изумрудным дизайном.
```

---

## Spanish (Spain)

**Name**
```
Damas: Emerald Courts
```

**Subtitle**
```
Damas rusas e internacionales
```

**Description**
```
Las damas clásicas con un diseño elegante esmeralda — para jugadores que disfrutan pensar.

Dos modos de juego:
• Jugador contra jugador — juega de a dos en un mismo dispositivo
• Jugar contra la IA — tres niveles de dificultad: fácil, medio y difícil

Dos reglamentos:
• Damas rusas 8×8 — 12 piezas por bando, reglas clásicas
• Damas internacionales 10×10 — 20 piezas por bando, tablero más grande

Características:
• Dama voladora: se mueve cualquier número de casillas en diagonal en cualquier dirección
• Captura obligatoria del máximo de piezas
• Capturas en cadena: al coronar en medio de una cadena, la dama continúa inmediatamente
• Sistema de tablas — la IA acepta o rechaza según la posición en el tablero
• Tres temas de tablero: Esmeralda, Clásico, Mármol
• Dos estilos de piezas: Clásico (marfil y negro) y Color (carmesí y verde bosque)
• Indicación de movimientos válidos y capturas
• Estadísticas de victorias por nivel de dificultad
• Disponible en inglés, ruso y español
```

**Keywords**
```
damas,juego de mesa,estrategia,dos jugadores,IA,damas rusas,damas internacionales,ajedrez
```

**What's New in This Version**
```
Primera versión. Damas rusas e internacionales con una IA inteligente y un diseño esmeralda espectacular.
```

---

## Общие поля (не зависят от языка)

### App Information (вкладка слева, заполняется один раз)

**Primary Category:** Games → Board
**Secondary Category:** Games → Strategy

### Возрастной рейтинг

Нажми Edit → все пункты выбери **None / No** → результат: **4+**

### Цена

Pricing and Availability → **Free**

### Конфиденциальность

App Privacy → "Do you collect data?" → **No, we do not collect data** → Publish

---

## Скриншоты

Загружать в разделе конкретной версии (1.0.0), отдельно для каждого языка или один раз для всех.

**iPhone 6.5"** — папка `docs/screenshots/appstore/iphone65/`
Файлы: `01-home.png`, `02-mode-select.png`, `03-game-8x8.png`, `04-game-moves.png`, `05-rules.png`, `06-settings.png`

**iPad Pro 12.9"** — папка `docs/screenshots/appstore/ipad129/`
Файлы: те же имена

> Скриншоты можно загрузить один раз для English и не дублировать для других языков — App Store покажет их всем.

---

## Порядок действий в App Store Connect

1. Войти → My Apps → выбрать приложение
2. Слева: **"+" → New Version** → `1.0.0` → Create
3. Заполнить **English (U.S.)** полностью (name, subtitle, description, keywords, what's new)
4. Нажать **"+"** рядом с языком → добавить **Russian** → заполнить
5. Нажать **"+"** → добавить **Spanish (Spain)** → заполнить
6. Загрузить скриншоты для iPhone 6.5" и iPad Pro 12.9"
7. В блоке **Build** нажать **"+"** → выбрать билд из Xcode
8. Заполнить **App Privacy** (No data collected)
9. Заполнить **Age Rating** (4+)
10. Нажать **"Add for Review"** → ответить на вопросы → **"Submit to App Review"**
