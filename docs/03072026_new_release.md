# New Release — 03.07.2026

Release with two changes:
1. Default language changed from RU to EN (CFBundleDevelopmentRegion)
2. Tip Jar (In-App Purchases) added

---

## Part 1 — App Store Connect: Create IAP Products

Do this BEFORE uploading the new build.

### 1. Go to App Store Connect > Your App > In-App Purchases

### 2. Create 3 products (type: Consumable)

| Reference Name    | Product ID   | Price         |
|-------------------|--------------|---------------|
| Tip - Cup of Tea  | tip_small    | $0.99 (Tier 1)  |
| Tip - Cup of Coffee | tip_medium | $2.99 (Tier 3)  |
| Tip - Hearty Lunch | tip_large   | $9.99 (Tier 10) |

### 3. For each product, add localizations

Click "+" next to App Store Localization and add 3 languages:

**tip_small:**
| Language | Display Name | Description |
|----------|-------------|-------------|
| English  | Cup of Tea  | Support the developer |
| Russian  | Чашка чая   | Поддержите разработчика |
| Spanish  | Taza de té  | Apoya al desarrollador |

**tip_medium:**
| Language | Display Name   | Description |
|----------|---------------|-------------|
| English  | Cup of Coffee | Support the developer |
| Russian  | Чашка кофе    | Поддержите разработчика |
| Spanish  | Taza de café  | Apoya al desarrollador |

**tip_large:**
| Language | Display Name   | Description |
|----------|---------------|-------------|
| English  | Hearty Lunch  | Support the developer |
| Russian  | Сытный обед   | Поддержите разработчика |
| Spanish  | Almuerzo completo | Apoya al desarrollador |

### 4. For each product, fill in required fields

| Field | Value |
|-------|-------|
| Review Screenshot | Upload `docs/screenshots/tipjar-review-640x920.png` (same for all 3) |
| Tax Category | App Store General (default) |
| Cleared for Sale | Yes |
| Price Schedule | Set the price from the table above |
| Availability | All territories (default) |
| Review Notes | (optional) `Tip jar for voluntary donations. No content is unlocked.` |
| Offer Codes | Skip |
| Image | Skip |

After filling in, each product status should be **"Ready to Submit"**.

---

## Part 2 — Mac: Build & Upload

### 1. Pull latest code
```bash
cd checkers
git pull
```

### 2. Install dependencies
```bash
npm install
```

### 3. Sync Capacitor
```bash
npm run cap:sync
```

### 4. Install CocoaPods
```bash
cd ios/App
pod install
cd ../..
```

### 5. Open Xcode
```bash
npx cap open ios
```

### 6. In Xcode

- Set **Team** (your Apple Developer account) in Signing & Capabilities
- Verify **Bundle ID** = `com.emeraldcourts.checkers`
- Check that **In-App Purchase** capability is added (Signing & Capabilities > + Capability > In-App Purchase)
- Increase **Build Number** (e.g. from 1 to 2). Version can stay the same or bump to 1.0.1
- Test on simulator or real device to verify tip jar screen works

### 7. Archive & Upload
- Product > Archive
- After archive completes: Distribute App > App Store Connect > Upload
- Wait for processing (usually 5-30 minutes)

---

## Part 3 — App Store Connect: Submit for Review

### 1. Create new version
- Go to App Store Connect > Your App
- Click "+" next to iOS App, enter new version (e.g. 1.0.1)

### 2. What's New (release notes)

**English:**
```
- Added support section (Settings > Support Developer)
- Bug fixes and improvements
```

**Russian:**
```
- Добавлен раздел поддержки (Настройки > Поддержать)
- Исправления и улучшения
```

**Spanish:**
```
- Agregada la seccion de apoyo (Ajustes > Apoyar)
- Correcciones y mejoras
```

### 3. Select build
- Choose the new build you just uploaded
- The 3 IAP products should appear in the "In-App Purchases" section — check all 3 are included

### 4. Submit for Review
- Click "Add for Review"
- Verify the IAP products are listed
- Click "Submit to App Review"

### 5. Wait for approval
- Typical review time: 24-48 hours
- After approval, choose to release manually or automatically

---

## Checklist

- [ ] 3 IAP products created in App Store Connect
- [ ] Each product has localizations (EN/RU/ES)
- [ ] Each product has review screenshot uploaded
- [ ] Each product has price set
- [ ] Each product status = "Ready to Submit"
- [ ] New build uploaded from Xcode
- [ ] Build processed and visible in App Store Connect
- [ ] New version created (e.g. 1.0.1)
- [ ] Build attached to new version
- [ ] "What's New" filled in
- [ ] IAP products included in submission
- [ ] Submitted for review
