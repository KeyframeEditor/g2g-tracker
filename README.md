# Event Realtime Tracker

A mobile-first, real-time event schedule tracker built with vanilla HTML, CSS, and JavaScript. Perfect for tracking live events with automatic timezone handling and smooth visual indicators.

## 🎯 Features

- **Real-time Updates**: Automatically updates every second using Asia/Jakarta timezone (GMT+7)
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Live Event Indicator**: Fixed needle at screen center showing current time
- **Visual Status**: Past, current, and future events with different styling
- **Auto-scroll**: Automatically centers on current time when loaded
- **Static Deployment**: Pure HTML/CSS/JS - no frameworks or servers needed

## 📅 Event Schedule

### Day 1 - November 22, 2025
- 14:20 – Opening By TLM
- 14:30 – Pembukaan Menteri Ekonomi Kreatif / Kepala Badan Ekonomi Kreatif
- 14:40 – Kuis Gamer No 1
- 15:10 – Stage Session Ekraf
- 15:40 – Stage Session Intel
- 16:20 – Stage Session Todak
- 17:00 – Stage Session Axioo Pongo
- 17:45 – Stage Session Genshin Impact
- 18:25 – 3 on 3 Djijuriin Michael Jorden by Intel
- 19:05 – Pejuang Seruput by Intel
- 20:00 – Karaoke Wibu
- 20:45 – Prize Announcement & Closing

### Day 2 - November 23, 2025
- 10:35 – Opening by TLM
- 10:50 – Anno 177: Pax Romana Tournament
- 11:30 – Stage Session Ekraf
- 12:00 – Stage Session Todak
- 12:40 – Perintah Aldo (PERINDO)
- 13:20 – Coswalk Competition
- 15:30 – Main Tebak Bok (MABOK)
- 16:00 – Bongkar Bongkar Gacha (BBG)
- 16:25 – Kombatan Performance
- 17:20 – Performance by Okemudin
- 17:30 – Lelang Maha Asik
- 18:00 – Awarding Cosplay
- 19:05 – Raffle Media
- 19:20 – Nakama Toxic Performance
- 20:20 – Band TLM Aldo
- 20:40 – Prize Announcement
- 20:50 – Closing

## 🚀 Quick Start

1. Clone this repository
2. Open `index.html` in your browser
3. That's it! No build process needed.

## 📁 Project Structure

```
/
├── index.html      # Main HTML file
├── style.css       # Styling and responsive design
├── app.js         # JavaScript logic and real-time updates
├── netlify.toml   # Netlify deployment configuration
└── README.md      # This file
```

## 🎨 Visual Design

- **Past Events**: Faded gray appearance
- **Current Event**: Bright with glowing border and "LIVE NOW" badge
- **Future Events**: Normal brightness but slightly dimmed
- **Center Needle**: Fixed red line at 50% viewport height with "NOW" indicator
- **Live Bar**: Sticky top bar showing current event details

## ⚙️ Technical Details

- **Timezone**: All times are handled in Asia/Jakarta (GMT+7)
- **Updates**: Real-time updates every second
- **Timeline**: 15-minute intervals from 1 hour before first event to 2 hours after last event
- **Auto-scroll**: Centers current time block on page load
- **Mobile Optimized**: Touch-friendly with smooth scrolling

## 🌐 Deployment

### Netlify
1. Connect your GitHub repository to Netlify
2. The `netlify.toml` file is already configured
3. Deploy automatically on push to main branch

### Other Static Hosts
Since this is a pure static site, you can deploy to any static hosting service:
- GitHub Pages
- Vercel
- Firebase Hosting
- Any web server

## 🔧 Customization

### Adding Events
Edit the `SCHEDULE_DATA` object in `app.js`:

```javascript
const SCHEDULE_DATA = {
    "2025-11-22": [
        { time: "14:20", title: "Your Event Title" },
        // Add more events...
    ]
};
```

### Changing Timezone
Update the timezone in the `getCurrentTimeInJakarta()` function and other date formatting functions in `app.js`.

### Styling
Modify `style.css` to change colors, fonts, and layout. The CSS uses CSS custom properties for easy theming.

## 📱 Browser Support

- Modern mobile browsers (iOS Safari, Chrome, Firefox)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled

## 🐛 Troubleshooting

- **Time not updating**: Check if JavaScript is enabled
- **Wrong timezone**: Verify browser timezone settings
- **Layout issues on mobile**: Clear browser cache and reload

## 📄 License

This project is open source and available under the MIT License.
