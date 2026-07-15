# Rainforest Falls Live Giving Tracker

A live, animated $10,000 fundraising dashboard for:

**Winston Salem First**  
**Rainforest Falls — The Nature of God**  
**Vacation Bible School 2026**

## What is included

- Animated waterfall and rising lagoon
- Live amount, percentage, and amount remaining
- Birds at 25%
- Butterflies at 50%
- Rainbow at 75%
- Confetti at 100%
- Automatic Google Sheets refresh every 15 seconds
- TV/projector, website, tablet, and phone layouts
- No paid software or external image files required

---

## 1. Test it on your computer

Open `index.html` in Safari or Chrome.

It starts in demo mode at $3,750. You can change that amount in `config.js`:

```js
demoRaised: 3750,
```

---

## 2. Create the Google Sheet

Create a Google Sheet using this exact format:

| Goal | Raised |
|------|--------|
| 10000 | 3750 |

Only the second row is read by the dashboard.

When donations come in, update the number under **Raised**.

---

## 3. Publish the sheet as CSV

In Google Sheets:

1. Open **File**
2. Choose **Share**
3. Choose **Publish to web**
4. Select the sheet tab containing Goal and Raised
5. Change the format to **Comma-separated values (.csv)**
6. Click **Publish**
7. Copy the generated URL

This publishes only the values in that tab. Do not place donor names or private financial information in the published tab.

---

## 4. Connect the sheet

Open `config.js`.

Paste the published CSV URL here:

```js
sheetCsvUrl: "PASTE_THE_PUBLISHED_CSV_URL_HERE",
```

Also replace the giving link:

```js
givingUrl: "https://your-real-giving-page.com/",
```

Save the file and reopen or refresh `index.html`.

The page checks the sheet every 15 seconds.

---

## 5. Put it online for free

### Netlify Drop — easiest method

1. Go to Netlify Drop in a web browser.
2. Drag the entire `rainforest-falls-dashboard` folder onto the page.
3. Netlify creates a public website address.
4. Use that address on the church website or lobby computer.

Whenever you change the project files, drag the updated folder to Netlify again.

### GitHub Pages

You may also upload these files to a GitHub repository and enable GitHub Pages in the repository settings.

---

## 6. Display it on a TV or projector

1. Open the public dashboard address in Chrome or Safari.
2. Press the browser's full-screen command.
3. Hide the mouse pointer.
4. Leave the dashboard open.

The total updates automatically from Google Sheets.

For a ProPresenter workflow, add the public dashboard URL as a web page or browser source where supported, or open it full-screen on the output computer.

---

## Important privacy note

Use a separate public spreadsheet tab containing only:

- Goal
- Raised

Do not publish donor names, email addresses, individual gift amounts, or other private information.

---

## Customize it

Edit these values in `config.js`:

- Goal
- Demo total
- Giving link
- Refresh interval
- Milestone messages

The visual styling is in `style.css`.
