# Tableau News Ticker Dynamic Portal (NTDP)

Live View: <https://techwithvab.github.io/tableau-ntdp/>

Welcome, Tableau News Ticker Dynamic Portal has two parts:

- [Dynamic Monitor with Playback controls](#dynamic-monitor-with-playback-controls)
- [News Ticker](#news-ticker)

Fully resoinsive implementation that can fit any screen.

## Dynamic Monitor with Playback controls

It lets you change the dashboard view playback controls on top-right.

## News Ticker

It displays the metrics and KPIs in bottom, just like a news channel ticker.

**JS API Overview:**

- Hook for filter change
- Data from sheet for ticker

## Run it locally:

1. Clone the repo
2. Open a Python basic server

   ```sh
   python -m http.server
   ```
3. Open `index.html` in your favourite browser.

**Other JS Libraries Used:**

- Bootstrap
- jQuery
