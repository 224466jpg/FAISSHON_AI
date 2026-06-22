# 🔧 TROUBLESHOOTING GUIDE

## Current Status Check

### ✅ Servers Running
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Editorial Page**: http://localhost:5173/editorial

### Quick Tests

#### 1. Test if frontend is accessible:
```bash
curl http://localhost:5173
```
✅ Should return HTML content

#### 2. Test if backend is accessible:
```bash
curl http://localhost:5000/api/health
```
✅ Should return: `{"status":"OK","message":"STYLEAI API is running"...}`

#### 3. Test Editorial Route:
Open in browser: http://localhost:5173/editorial

---

## Common Issues & Solutions

### Issue 1: "Page Not Found" or White Screen

**Solution A: Clear Browser Cache**
```
Chrome/Edge: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Safari: Cmd+Option+E
Firefox: Ctrl+Shift+Delete
```

**Solution B: Hard Refresh**
```
Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
Safari: Cmd+Option+R
Firefox: Ctrl+F5
```

**Solution C: Check Browser Console**
1. Press F12 to open DevTools
2. Click "Console" tab
3. Look for red errors
4. Share the error messages

---

### Issue 2: Images Not Loading

**Possible Cause**: Internet connection or Unsplash API rate limit

**Solution**: The Editorial page uses Unsplash images. If they don't load:
1. Check your internet connection
2. Wait a few minutes (Unsplash has rate limits)
3. Try refreshing the page

---

### Issue 3: Styling Looks Broken

**Possible Cause**: Tailwind CDN not loading

**Solution**:
1. Check browser console for network errors
2. Ensure you have internet connection (Tailwind loads from CDN)
3. Try accessing: https://cdn.tailwindcss.com

---

### Issue 4: "Cannot GET /editorial"

**This means routing is not working**

**Solution**:
1. Stop the frontend server (Ctrl+C in terminal)
2. Restart it:
```bash
cd styleai
npm run dev
```

---

### Issue 5: Components Not Rendering

**Check for JavaScript errors**

**Solution**:
1. Open browser console (F12)
2. Look for errors in red
3. Common fixes:
   - Restart development server
   - Clear node_modules and reinstall:
   ```bash
   cd styleai
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

## Step-by-Step Debugging

### Step 1: Verify Servers Are Running

Check if processes are active:
```bash
# Check if ports are in use
lsof -i :5173  # Frontend
lsof -i :5000  # Backend
```

If nothing is running, start them:
```bash
# Terminal 1 - Backend
cd styleai/server
npm run dev

# Terminal 2 - Frontend
cd styleai
npm run dev
```

### Step 2: Test Each Route

Open these URLs in your browser:

1. **Home Page**: http://localhost:5173/
   - Should show: Style Secrets section with Weekend/Rave/Street cards
   - Should have: "TRY FIT CHECK AI" and "VIEW EDITORIAL" buttons

2. **Fit Check Page**: http://localhost:5173/fit-check
   - Should show: Upload area with "Drop Your Outfit Photo Here"
   - Should have: Drag & drop functionality

3. **Editorial Page**: http://localhost:5173/editorial
   - Should show: "EDITORIAL" hero section
   - Should have: Three collections (ELEGANCE, AUTUMN REVERIE, MONOCHROME)
   - Should have: Magazine-style images

### Step 3: Check Browser Console

1. Press **F12** (or Cmd+Option+I on Mac)
2. Click **Console** tab
3. Look for errors (red text)
4. Common errors and solutions:

   **Error**: `Failed to fetch`
   - **Cause**: Backend not running
   - **Fix**: Start backend server

   **Error**: `Module not found`
   - **Cause**: Missing dependencies
   - **Fix**: Run `npm install` in styleai folder

   **Error**: `Unexpected token '<'`
   - **Cause**: Trying to load HTML as JavaScript
   - **Fix**: Clear cache and hard refresh

### Step 4: Check Network Tab

1. Press **F12** → **Network** tab
2. Refresh page
3. Look for failed requests (red)
4. Common issues:
   - **404 errors**: File not found, may need to rebuild
   - **CORS errors**: Backend CORS settings
   - **Timeout errors**: Backend not responding

---

## Manual Verification

### Verify Files Exist

```bash
# Check if EditorialPage exists
ls -la styleai/src/pages/EditorialPage.jsx

# Should show:
# -rw-r--r--  1 user  staff  11858 Jun 19 18:34 EditorialPage.jsx
```

### Verify App.jsx Has Route

```bash
# Check if route is registered
grep -n "EditorialPage" styleai/src/App.jsx

# Should show:
# 3:import EditorialPage from './pages/EditorialPage';
# 12:        <Route path="/editorial" element={<EditorialPage />} />
```

### Verify Navbar Has Link

```bash
# Check if navbar has editorial link
grep -n "editorial" styleai/src/components/Navbar.jsx

# Should show link to /editorial
```

---

## Quick Fixes

### Fix 1: Restart Everything

```bash
# Kill all node processes
killall node

# Start backend
cd styleai/server
npm run dev &

# Start frontend
cd styleai
npm run dev
```

### Fix 2: Clear Everything and Rebuild

```bash
cd styleai

# Clear node_modules
rm -rf node_modules
rm -rf server/node_modules

# Clear package locks
rm package-lock.json
rm server/package-lock.json

# Reinstall
npm install
cd server && npm install && cd ..

# Start servers
cd server && npm run dev &
cd .. && npm run dev
```

### Fix 3: Check Port Conflicts

```bash
# If port 5173 is taken
lsof -ti:5173 | xargs kill -9

# If port 5000 is taken
lsof -ti:5000 | xargs kill -9

# Then restart servers
```

---

## What to Share if Still Not Working

If you're still having issues, please provide:

1. **Browser Console Errors**: 
   - Open DevTools (F12) → Console tab
   - Copy any red error messages

2. **Terminal Output**:
   - Copy the last 20 lines from both terminal windows

3. **What You See**:
   - Blank page?
   - Loading forever?
   - 404 error?
   - Images missing?
   - Styling broken?

4. **What URL**:
   - Which specific URL is not working?

5. **Browser**:
   - Chrome? Firefox? Safari? Edge?

---

## Expected Behavior

### Home Page (http://localhost:5173/)
✅ Shows "STYLEAI" logo in top left
✅ Navigation bar with: SHOP, EDITORIAL, AI LAB, STREET, ARCHIVE
✅ Yellow ticker with "THE NEW DROP" scrolling
✅ "Style Secrets" section
✅ Two buttons: "TRY FIT CHECK AI" and "VIEW EDITORIAL"

### Editorial Page (http://localhost:5173/editorial)
✅ Black hero section with "EDITORIAL" title
✅ Three collection sections:
   - ELEGANCE (beige tones)
   - AUTUMN REVERIE (autumn colors)
   - MONOCHROME (black & white)
✅ Each collection has:
   - Magazine cover image (tall vertical format)
   - Typography overlays
   - Color palette (4 colors)
   - Image gallery (4 images)
✅ Click any image → Opens full-screen lightbox
✅ "CREATE YOUR STORY" button at bottom

### Fit Check Page (http://localhost:5173/fit-check)
✅ "FIT CHECK AI" purple header
✅ Upload area with camera icon
✅ Drag & drop or click to upload
✅ "⚡ ANALYZE FIT" button after upload

---

## Contact Points

If you're stuck, check:
1. Browser console (F12 → Console)
2. Terminal output for both servers
3. Network tab (F12 → Network)

The issue is likely one of:
- Servers not running
- Browser cache
- Port conflicts
- Missing dependencies
- Network/CORS issues

Follow the steps above to diagnose! 🚀
