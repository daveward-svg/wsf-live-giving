/*
  RAINForest Falls Dashboard Configuration

  GOOGLE SHEET SETUP:
  1. Create a sheet with headers in row 1:
       Goal | Raised
  2. Put 10000 under Goal and your live total under Raised.
  3. In Google Sheets choose File → Share → Publish to web.
  4. Publish the correct sheet/tab as "Comma-separated values (.csv)".
  5. Paste the published CSV URL below.

  Until you add a URL, the dashboard uses demoRaised.
*/

window.DASHBOARD_CONFIG = {
  churchName: "Winston Salem First",
  campaignName: "Rainforest Falls",
  goal: 10000,

  // Paste your Google Sheets published CSV URL between the quotes.
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTonbA7BED9WK9XjN9dgwMqLsjX3k9e7BBk8cxdnrpHBTuJEOMraB9N35XOFyiUoFprGjer90BaoNs2/pub?gid=327469103&single=true&output=csv",

  // Used only before a Sheet URL is connected.
  demoRaised: 3750,

  // How often to check the Google Sheet, in milliseconds.
  refreshIntervalMs: 15000,

  // Paste the actual online giving page here.
  givingUrl: "https://app.easytithe.com/App/Giving/wsf",

  impactMessages: [
    { at: 0, text: "Every gift helps children discover the wonder of God's creation." },
    { at: 25, text: "Amazing! We have reached the first waterfall milestone." },
    { at: 50, text: "Halfway there—thank you for helping VBS come to life!" },
    { at: 75, text: "The rainbow is shining. Our $10,000 goal is within reach!" },
    { at: 100, text: "Goal reached! Thank you, Winston Salem First!" }
  ]
};
