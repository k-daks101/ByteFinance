# Where to Add More Information

Use this as a map for where to add or edit content in ByteFinance.

---

## By page (edit existing content)

| What you want to change | File to edit |
|-------------------------|--------------|
| **Dashboard** – welcome text, stats labels, lesson cards, quiz, market widget, community preview | `src/pages/Dashboard.jsx` |
| **Learning** – module title, lesson text, tips, quiz questions/answers, step labels (Read/Learn/Quiz) | `src/pages/Learning.jsx` |
| **Trading** – headings, tips, watchlist table headers, form labels | `src/pages/Trade.jsx` |
| **Market** – page title, search label, table headers | `src/pages/Market.jsx` |
| **Portfolio** – section titles, card labels (Cash Balance, Portfolio Value, etc.) | `src/pages/Portfolio.jsx` |
| **Transactions** – page title, table headers | `src/pages/Transactions.jsx` |
| **Community** – page title, post examples, form placeholder/labels | `src/pages/Community.jsx` |
| **Settings** – any settings labels or help text | `src/pages/Settings.jsx` |
| **Login / Register** – form labels, links, error messages | `src/pages/Login.jsx`, `src/pages/Register.jsx` |
| **404 page** – message and button text | `src/pages/NotFound.jsx` |

---

## Add a new “Information” page (e.g. About, Help, FAQ)

1. **Create the page**  
   Add a new file, e.g. `src/pages/About.jsx` or `src/pages/Help.jsx`:

   ```jsx
   export default function About() {
     return (
       <div className="space-y-6">
         <h1 className="text-2xl font-bold text-foreground">About ByteFinance</h1>
         <p className="text-foreground/80">Your content here…</p>
       </div>
     );
   }
   ```

2. **Register the route**  
   In `src/routes/index.tsx`:
   - Import the new page.
   - Add a route inside the `AppLayout` block, e.g.  
     `<Route path="/about" element={<About />} />`

3. **Add it to the sidebar**  
   In `src/layouts/AppLayout.tsx`, add an entry to the `navItems` array, e.g.:

   ```js
   { label: "About", to: "/about", Icon: Info },
   ```

   (Add `Info` to the lucide-react imports at the top.)

---

## Add reusable copy or data

- **Shared labels/copy**  
  You can add a small module, e.g. `src/content/copy.js` or `src/constants/labels.js`, and import it in the pages above.

- **Learning modules/lessons**  
  For multiple lessons, consider `src/content/lessons.js` (or similar) with an array of modules; then `Learning.jsx` can map over it and you add more info by editing that file.

- **FAQ / Help content**  
  Same idea: e.g. `src/content/faq.js` and a page that maps over it.

---

## Quick reference – main content files

```
src/
├── pages/
│   ├── Dashboard.jsx    ← Dashboard content
│   ├── Learning.jsx    ← Learning + Knowledge Check
│   ├── Trade.jsx        ← Trading tab
│   ├── Market.jsx      ← Market list
│   ├── Portfolio.jsx   ← Portfolio
│   ├── Transactions.jsx
│   ├── Community.jsx
│   └── Settings.jsx
├── layouts/
│   └── AppLayout.tsx   ← Sidebar nav (add new links here)
└── routes/
    └── index.tsx       ← Routes (add new pages here)
```

---

## Summary

- **Change text on an existing page** → Edit the right file in the table above.
- **Add a whole new section (About, Help, FAQ)** → New file in `src/pages/`, then route in `src/routes/index.tsx` and link in `src/layouts/AppLayout.tsx`.
- **Reuse the same info in several places** → Put it in `src/content/` or `src/constants/` and import where needed.
