# 🇮🇳 ElectionGuide India - Premium Voter Education Portal

ElectionGuide India is a premium, client-side web application designed to educate citizens about the democratic process, practice voting in a simulated environment, lookup local voting centers, explore state election statistics, and manage custom schedule alarms. 

The site features rich modern aesthetics, a dedicated dark/light mode engine with smooth animated widgets, and client-side translation capabilities.

---

## 🌟 Core Features & Modules

### 1. 3D Bezel Precise Timeline (`timeline.html`)
* **Vertical Scroll Inertia Engine**: Custom requestAnimationFrame scroll wheel and touch-drag momentum engine designed specifically for responsive desktop and mobile glide simulation.
* **Progress Conduit Comet**: A neon-glowing saffron comet spark line that tracks down the conduit, pulsing and lighting up circular step nodes as they align to the viewport center.
* **ECI Phase Steps (Phases 0-7)**:
  * **Phase 0**: System initialization and general instructions.
  * **Phases 1–6**: Interactive checklists for each primary election phase (registrations, campaigns, voting steps). Checking checklist items updates the local voter readiness index in `localStorage` in real-time.
  * **Phase 7**: Final checklist compilation, final voting readiness score, and quick dashboard navigation.
* **Alarm Sync Shortcuts**: Quickly prefill and schedule upcoming phase alarms to the reminder module.

### 2. Polling Information Finder (`booth-locator.html`)
* **Regional Area Search**: Search filters by **State**, **District**, **Constituency**, and **Pincode**.
* **Dynamic Nested Dropdowns**: Automatically cascading selectors that populate local districts and constituencies for primary Indian states (TN, KA, KL, MH, AP, TS, GJ, RJ, DL).
* **Mock Live Queue Tracker**: An interactive dashboard component indicating primary center wait times (Low, Medium, High) with estimated voter tallies. Features a clickable `🔄 Refresh` button that dynamically recalculates values.
* **Facilities & Contacts**: Badge listings for accessibility setups (Wheelchair Ramps, Separate queues, Drinking Water, First Aid) and booth timing alerts alongside Electoral Officer helpline details.

### 3. EVM & VVPAT Mock Simulator (`evm-practice.html`)
* **Generic Candidate Ballot**: A scrollable candidate register showing 4 generic sample parties (P1 to P4 with non-partisan icons: Star, Bell, Kite, Key) plus **NOTA (None of the Above)** as the final option.
* **Snappy Verification Loop**:
  * Serving tickets is instant (0 queue wait time) for rapid mock interactions.
  * Pressing a candidate button lights up the respective LED, triggers a buzzer beep oscillator, prints a paper slip inside the VVPAT, and drops it after a snappy 2.5-second inspection interval.
* **Indelible Ink Mark Warning**: Displays a responsive light-mode/dark-mode compatible banner notifying voters about left index finger ink staining.

### 4. Interactive India Map (`india-map.html`)
* **Raphael.js Vector Mapping**: A fully interactive, clickable, and responsive vector map of India.
* **Area Statistics HUD**: Hovering or tapping on states renders details about next election cycles (year-only), Chief Ministers, and Ruling Party alliances (using `&` notations).

### 5. My Voter Profile (`profile.html`)
* **Virtual Voter ID Generator**: Real-time rendering of a mock Electoral Photo Identity Card (EPIC) pulling names and state details dynamically from local storage.
* **Profile Settings**: Simple input fields for saving voter details securely on the client-side.

### 6. Voting Reminders (`reminders.html`)
* **Alarm Scheduling Utility**: Input fields for setting voter-specific date-alarms that synchronize with browser notifications.

### 7. Translation Engine (`js/theme.js`)
* **Dynamic Translation Dropdown**: Instantly translates the website to **English, Hindi, Tamil, Malayalam, or Kannada** using Google Translate.
* **Premium Overlay Styles**: Native Google widget branding, frames, headers, and tooltip popups are completely hidden via custom CSS overrides to preserve a native design feel.

---

## 🎨 Theme & Styling System

* **Double-Key Tailwind Support**: Colors are fully configured for both hyphenated and underscore naming conventions:
  * **Saffron**: `#FF9933` (Indian national color scheme)
  * **Green ECI**: `#138808`
  * **Navy ECI**: `#000080`
* **Custom Theme Toggler**: Featuring a fully animated checkbox-driven SVG theme switch. Toggling it slides the sun/moon container, triggers cloud-drifting, and reveals twinkling stars in dark mode.
* **Premium Components**: Card designs implement glassmorphism (`backdrop-blur`), soft inset highlights, micro-animations on hover (`scale-102`), and smooth 300ms transitions on theme swaps.

---

## 📱 Responsiveness (PC & Mobile)

* **Sticky Headers & FAB Drawers**: Global navigation links stay sticky at the top, and support drawers slide in as floating side sheets.
* **Mobile Bottom Nav**: On viewports smaller than `1024px`, primary pages are mapped to a sticky tab-bar anchored at the bottom of the screen.
* **Flexible Grids**: Columns shift dynamically (`grid-cols-1 lg:grid-cols-3` or `grid-cols-1 md:grid-cols-2`) to keep dashboards elegant on all device screens.

---

## 🛠️ Installation & Local Run

1. Clone or copy the project files to your local system directory.
2. Serve the directory using any local web server. For example, using Node.js:
   ```bash
   npx http-server ./
   ```
3. Open `http://localhost:8080` in your web browser.
