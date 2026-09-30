# 🎬 Movie Watchlist — MERN Stack Build Guide (Phase-Wise)

**Project:** #09 Movie Watchlist — Beginner | 17 APIs
**Stack:** MongoDB + Express + React (Vite) + Node.js, JWT Auth, Tailwind CSS
**How to use this doc:** Go phase by phase. Copy the **"Prompt for AI"** block under each phase and paste it into Claude Code / Claude / ChatGPT (or any AI coding assistant) to generate that part of the app. Test each phase before moving to the next. Don't skip ahead.

---

## 📋 Full API Reference (for your own tracking)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|----------------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and receive JWT token | No |
| GET | /api/auth/me | Get logged in user profile | Yes |
| POST | /api/movies | Create a new movie | Yes |
| GET | /api/movies | List all movies (with pagination) | Yes |
| GET | /api/movies/:id | Get a single movie | Yes |
| PUT | /api/movies/:id | Update a movie | Yes |
| DELETE | /api/movies/:id | Delete a movie | Yes |
| POST | /api/reviews | Create a new review | Yes |
| GET | /api/reviews | List all reviews (with pagination) | Yes |
| GET | /api/reviews/:id | Get a single review | Yes |
| PUT | /api/reviews/:id | Update a review | Yes |
| DELETE | /api/reviews/:id | Delete a review | Yes |
| PATCH | /api/movies/:id/watched | Mark a movie as watched | Yes |
| GET | /api/movies/watched | List watched movies | Yes |
| GET | /api/movies/top-rated | Highest rated movies | Yes |
| GET | /api/movies/search?q= | Search movies by title | Yes |

---

## 🧱 Phase 0 — Project Setup & Folder Structure

**Goal:** Create the repo skeleton, install core dependencies, and get a health-check route running before writing any real logic.

**Checklist:**
- [ ] Create root folder with `server/` and `client/` subfolders
- [ ] Initialize git repo, add `.gitignore`
- [ ] `server/`: init npm, install express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, express-validator, nodemon
- [ ] `client/`: create Vite + React app, install react-router-dom, axios, tailwindcss
- [ ] Create `.env` in server with `PORT`, `MONGO_URI`, `JWT_SECRET`
- [ ] Basic `server.js` that connects to MongoDB and starts Express
- [ ] Confirm `GET /` or `GET /api/health` returns 200

**Prompt for AI:**
```
Set up a MERN stack project called "movie-watchlist" with this exact folder structure:

movie-watchlist/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    .env.example
    server.js
    package.json
  client/
    (Vite + React app)

Backend requirements:
- Node.js + Express
- Mongoose for MongoDB
- dotenv for env vars (PORT, MONGO_URI, JWT_SECRET)
- cors enabled
- nodemon for dev
- A config/db.js file that connects to MongoDB using MONGO_URI and logs success/failure
- server.js should load env vars, connect to DB, set up express with json parsing and cors, and expose a GET /api/health route returning { status: "ok" }

Frontend requirements:
- React app created with Vite
- Tailwind CSS installed and configured
- react-router-dom and axios installed
- A basic App.jsx with React Router set up and a placeholder Home page

Give me the full code for every file, plus the exact terminal commands to run to install everything and start both servers.
```

**✅ Test before moving on:** `npm run dev` in server starts without errors, MongoDB connects, `/api/health` returns `{status: "ok"}` in Postman.

---

## 🔐 Phase 1 — Authentication (Register, Login, Me)

**APIs built in this phase:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

**Goal:** Users can sign up, log in, get a JWT, and fetch their own profile using that JWT.

**Checklist:**
- [ ] `User` model: name, email (unique), password (hashed), timestamps
- [ ] Password hashing with bcrypt (pre-save hook or in controller)
- [ ] `authController.js`: register, login, getMe
- [ ] JWT generation on register/login (sign with `JWT_SECRET`, expiry e.g. 7d)
- [ ] `authMiddleware.js` (`protect`): verifies `Authorization: Bearer <token>`, attaches `req.user`
- [ ] `authRoutes.js` wired into `server.js` at `/api/auth`
- [ ] Input validation (required fields, valid email, min password length)
- [ ] Correct status codes: 201 on register, 200 on login/me, 400 on bad input, 401 on invalid credentials/bad token

**Prompt for AI:**
```
In my existing MERN project (server/ with models, controllers, routes, middleware folders), build the authentication system:

1. models/User.js — Mongoose schema with name, email (required, unique, lowercase), password (required, min 6 chars, hashed with bcrypt before save), createdAt.

2. middleware/authMiddleware.js — a `protect` middleware that:
   - Reads the token from the "Authorization: Bearer <token>" header
   - Verifies it with JWT_SECRET
   - Fetches the user from DB (excluding password) and attaches it to req.user
   - Returns 401 with a clear error message if token is missing or invalid

3. controllers/authController.js with three functions:
   - register(req, res): validates input, checks for existing email, creates user, returns 201 with { user, token }
   - login(req, res): validates credentials with bcrypt.compare, returns 200 with { user, token } or 401 on failure
   - getMe(req, res): returns 200 with the logged-in user's profile (req.user), requires the protect middleware

4. routes/authRoutes.js:
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/me (protected)

5. A utils/generateToken.js helper that signs a JWT with the user id and JWT_SECRET, expiring in 7 days.

Use express-validator for input validation and return proper status codes (201, 200, 400, 401). Wire authRoutes into server.js under /api/auth. Show me the full code for every file.
```

**✅ Test in Postman before moving on:**
1. `POST /api/auth/register` with name/email/password → expect 201 + token
2. `POST /api/auth/login` with same credentials → expect 200 + token
3. `GET /api/auth/me` with `Authorization: Bearer <token>` → expect 200 + user data
4. `GET /api/auth/me` with no token → expect 401

---

## 🎬 Phase 2 — Movie CRUD

**APIs built in this phase:** `POST /api/movies`, `GET /api/movies`, `GET /api/movies/:id`, `PUT /api/movies/:id`, `DELETE /api/movies/:id`

**Goal:** Logged-in users can create, list, view, update, and delete their own movies.

**Checklist:**
- [ ] `Movie` model: title, genre, releaseYear, watched (bool, default false), rating (0-10, nullable), user (ref to User), timestamps
- [ ] `movieController.js`: createMovie, getMovies (with pagination + only user's own movies), getMovieById, updateMovie, deleteMovie
- [ ] Ownership check: a user can only get/update/delete their OWN movies (404 or 403 if not owner)
- [ ] Pagination via `?page=&limit=` query params, returning `{ data, page, totalPages, totalCount }`
- [ ] `movieRoutes.js`, all routes protected by `protect` middleware
- [ ] Status codes: 201 create, 200 read/update, 204 or 200 delete, 400 bad input, 404 not found

**Prompt for AI:**
```
In my MERN project, build full CRUD for Movies, scoped to the logged-in user only.

1. models/Movie.js — Mongoose schema:
   - title (String, required)
   - genre (String)
   - releaseYear (Number)
   - watched (Boolean, default false)
   - rating (Number, min 0, max 10, default null)
   - user (ObjectId ref "User", required)
   - timestamps: true

2. controllers/movieController.js with:
   - createMovie(req, res): creates a movie linked to req.user._id, returns 201
   - getMovies(req, res): returns only movies belonging to req.user._id, supports pagination via ?page=&limit= (default page=1, limit=10), returns { data, page, totalPages, totalCount }
   - getMovieById(req, res): returns a single movie IF it belongs to req.user, else 404
   - updateMovie(req, res): updates a movie IF it belongs to req.user, else 404
   - deleteMovie(req, res): deletes a movie IF it belongs to req.user, else 404

3. routes/movieRoutes.js, all routes protected with the existing `protect` middleware:
   - POST /api/movies
   - GET /api/movies
   - GET /api/movies/:id
   - PUT /api/movies/:id
   - DELETE /api/movies/:id

Validate input (title required), use proper status codes (201, 200, 400, 404), and handle invalid MongoDB ObjectIds gracefully (return 400, not a server crash). Wire the routes into server.js under /api/movies. Show me full code for every file.
```

**✅ Test in Postman before moving on:**
1. Create 2-3 movies as User A → expect 201 each
2. `GET /api/movies` → expect only User A's movies, paginated
3. Try `GET /api/movies/:id` for a movie belonging to a different user → expect 404
4. Update and delete a movie you own → expect 200

---

## ⭐ Phase 3 — Reviews CRUD

**APIs built in this phase:** `POST /api/reviews`, `GET /api/reviews`, `GET /api/reviews/:id`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id`

**Goal:** Logged-in users can review movies (their own movies), with rating + comment.

**Checklist:**
- [ ] `Review` model: movie (ref Movie), user (ref User), rating (1-5 or 1-10 — decide and stay consistent), comment, timestamps
- [ ] `reviewController.js`: createReview, getReviews (own reviews, paginated), getReviewById, updateReview, deleteReview
- [ ] Ownership check same pattern as movies
- [ ] Validate that the `movie` referenced in a review actually exists and belongs to the user
- [ ] `reviewRoutes.js`, protected routes

**Prompt for AI:**
```
In my MERN project, build full CRUD for Reviews, linked to Movies and scoped to the logged-in user.

1. models/Review.js — Mongoose schema:
   - movie (ObjectId ref "Movie", required)
   - user (ObjectId ref "User", required)
   - rating (Number, required, min 1, max 10)
   - comment (String, max 500 chars)
   - timestamps: true

2. controllers/reviewController.js with:
   - createReview(req, res): validates that req.body.movie exists AND belongs to req.user, then creates the review linked to req.user._id, returns 201
   - getReviews(req, res): returns only reviews belonging to req.user._id, paginated via ?page=&limit=, returns { data, page, totalPages, totalCount }
   - getReviewById(req, res): returns single review IF owned by req.user, else 404
   - updateReview(req, res): updates rating/comment IF owned by req.user, else 404
   - deleteReview(req, res): deletes IF owned by req.user, else 404

3. routes/reviewRoutes.js, all protected:
   - POST /api/reviews
   - GET /api/reviews
   - GET /api/reviews/:id
   - PUT /api/reviews/:id
   - DELETE /api/reviews/:id

Use proper status codes and validation (rating between 1-10, movie must exist and belong to the user before a review can be created). Wire routes into server.js under /api/reviews. Show me full code for every file.
```

**✅ Test in Postman before moving on:**
1. Create a review for a movie you own → 201
2. Try to create a review for a movie ID that doesn't exist or isn't yours → 400/404
3. List, get, update, delete your reviews → correct status codes

---

## 🧩 Phase 4 — Extra Movie Features (Watched, Top Rated, Search)

**APIs built in this phase:** `PATCH /api/movies/:id/watched`, `GET /api/movies/watched`, `GET /api/movies/top-rated`, `GET /api/movies/search?q=`

**Goal:** Add the filter/sort features that make this more than plain CRUD.

**⚠️ Important note on route order:** In Express, `/api/movies/watched`, `/api/movies/top-rated`, and `/api/movies/search` must be declared **before** `/api/movies/:id` in the routes file, or Express will match them to the `:id` param route by mistake.

**Checklist:**
- [ ] `PATCH /api/movies/:id/watched` — toggles or sets `watched: true` on a movie the user owns
- [ ] `GET /api/movies/watched` — lists the user's movies where `watched: true`, paginated
- [ ] `GET /api/movies/top-rated` — lists the user's movies sorted by `rating` descending (only rated ones), maybe top 10
- [ ] `GET /api/movies/search?q=` — case-insensitive partial match on `title`, scoped to user's own movies

**Prompt for AI:**
```
In my MERN project's movieController.js and movieRoutes.js, add these additional endpoints. Remember Express route order matters: /watched, /top-rated, and /search must be registered BEFORE the /:id route.

1. markWatched(req, res) — PATCH /api/movies/:id/watched
   Sets watched = true on the movie IF it belongs to req.user. Returns 404 if not found/not owned. Returns 200 with the updated movie.

2. getWatchedMovies(req, res) — GET /api/movies/watched
   Returns req.user's movies where watched = true, paginated (?page=&limit=), same response shape as getMovies: { data, page, totalPages, totalCount }.

3. getTopRatedMovies(req, res) — GET /api/movies/top-rated
   Returns req.user's movies where rating is not null, sorted by rating descending, limited to top 10 (or a ?limit= query param).

4. searchMovies(req, res) — GET /api/movies/search?q=
   Case-insensitive partial match on title (use a MongoDB regex or text index), scoped to req.user's movies only. Returns 400 if q is missing/empty.

Update routes/movieRoutes.js with the correct route order so these don't get shadowed by /api/movies/:id. Show me the updated controller and routes files in full.
```

**✅ Test in Postman before moving on:**
1. Mark a movie watched → `GET /api/movies/watched` shows it
2. Rate a few movies via review or a rating field → `GET /api/movies/top-rated` returns them sorted correctly
3. `GET /api/movies/search?q=bat` finds "Batman" but not other titles
4. Confirm `/watched`, `/top-rated`, `/search` do NOT get swallowed by the `/:id` route

---

## 🧪 Phase 5 — Full Postman Test Pass (Before Building UI)

**Goal:** Before touching the frontend, verify all 17 endpoints work correctly end to end, including auth failures and ownership checks.

**Checklist — run through this whole list in Postman:**
- [ ] Register 2 separate users (User A, User B)
- [ ] Login both, save their tokens
- [ ] As User A: create movies, reviews, mark watched, search, top-rated — all work
- [ ] As User B: confirm you CANNOT see/edit/delete User A's movies or reviews (404s)
- [ ] Test all validation errors (missing fields, bad email, short password) → 400
- [ ] Test all unauthorized requests (no token / bad token) → 401
- [ ] Test pagination params on `/api/movies` and `/api/reviews`

**Prompt for AI:**
```
Generate a Postman collection (as JSON, importable into Postman) for my Movie Watchlist API covering all 17 endpoints below, including example request bodies, an environment with a {{baseUrl}} and {{token}} variable, and a pre-request/test script pattern that automatically saves the JWT token from the login response into the {{token}} variable for use in subsequent requests.

Endpoints:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/movies
GET /api/movies
GET /api/movies/:id
PUT /api/movies/:id
DELETE /api/movies/:id
POST /api/reviews
GET /api/reviews
GET /api/reviews/:id
PUT /api/reviews/:id
DELETE /api/reviews/:id
PATCH /api/movies/:id/watched
GET /api/movies/watched
GET /api/movies/top-rated
GET /api/movies/search?q=

Base URL: http://localhost:5000
```

**✅ Only move to the frontend once every endpoint above behaves correctly.**

---

## 💻 Phase 6 — Frontend Setup (Routing, State, API Service Layer)

**Goal:** Scaffold the React app's structure, routing, and a central Axios instance before building pages.

**Checklist:**
- [ ] `client/src/pages/`, `client/src/components/`, `client/src/services/`, `client/src/context/`
- [ ] `services/api.js` — Axios instance with base URL and an interceptor that attaches the JWT from storage to every request
- [ ] `context/AuthContext.jsx` — stores current user + token, exposes login/register/logout functions, persists token (e.g. localStorage)
- [ ] `App.jsx` with React Router routes for all pages (placeholders ok for now)
- [ ] A `ProtectedRoute` component that redirects to `/login` if no user/token

**Prompt for AI:**
```
In my client/ React (Vite) app, set up the app shell before I build individual pages:

1. src/services/api.js — an Axios instance with baseURL from an environment variable (VITE_API_URL, fallback http://localhost:5000/api), and a request interceptor that reads the JWT token from localStorage and adds it as "Authorization: Bearer <token>" to every request.

2. src/context/AuthContext.jsx — a React Context + provider that:
   - Holds { user, token, loading }
   - On mount, checks localStorage for a saved token and validates it by calling GET /api/auth/me
   - Exposes register(name, email, password), login(email, password), logout() functions that call the API and update state + localStorage
   - Exposes a useAuth() hook

3. src/components/ProtectedRoute.jsx — wraps a route, redirects to /login if there's no logged-in user (while respecting the loading state so it doesn't redirect before the auth check finishes).

4. src/App.jsx — set up React Router with routes:
   /login, /register, / (Dashboard, protected), /movies (protected), /movies/:id (protected), /reviews (protected)
   Wrap the app in AuthProvider. Use ProtectedRoute for the protected pages.

Use Tailwind CSS classes for any layout shown. Give me full code for every file.
```

**✅ Test before moving on:** App runs with `npm run dev`, routes navigate correctly, hitting a protected route while logged out redirects to `/login`.

---

## 🔑 Phase 7 — Auth Pages (Register / Login / Logout)

**Goal:** Build working Register and Login forms wired to the AuthContext.

**Checklist:**
- [ ] `pages/Register.jsx` — form with name/email/password, calls `register()`, shows validation errors from API
- [ ] `pages/Login.jsx` — form with email/password, calls `login()`, shows errors on 401
- [ ] Navbar with conditional links (Login/Register vs. user's name + Logout) based on auth state
- [ ] Successful login/register redirects to the Dashboard

**Prompt for AI:**
```
Build the auth pages for my React app using the existing AuthContext (useAuth hook) and Tailwind CSS:

1. src/pages/Register.jsx — a form with name, email, password fields. On submit, calls register() from AuthContext. Shows a loading state on the button, and displays the API's error message on failure (e.g. "Email already exists"). On success, redirects to "/".

2. src/pages/Login.jsx — a form with email, password fields. On submit, calls login(). Shows a loading state and displays "Invalid email or password" on 401. On success, redirects to "/".

3. src/components/Navbar.jsx — shows "Login" / "Register" links when logged out, and the user's name + a "Logout" button when logged in (calls logout() and redirects to /login). Include this Navbar in App.jsx above the routed pages.

Style everything with clean, simple Tailwind CSS (centered card forms, clear error states in red text). Give me full code for every file.
```

**✅ Test before moving on:** Can register a new account, get redirected and logged in, log out, log back in, and see wrong-password errors correctly.

---

## 🎥 Phase 8 — Movie Pages (List, Add, Edit, Delete, Detail)

**Goal:** Build the core movie management UI.

**Checklist:**
- [ ] `pages/Movies.jsx` — list of the user's movies, paginated, with "Add Movie" button and edit/delete actions
- [ ] `components/MovieForm.jsx` — reusable form for create & edit
- [ ] `pages/MovieDetail.jsx` — single movie view showing details + its reviews + "Mark as watched" button
- [ ] `services/movieService.js` — wraps all `/api/movies*` Axios calls

**Prompt for AI:**
```
Build the Movie management UI in my React app, using the existing api.js Axios instance and Tailwind CSS.

1. src/services/movieService.js — functions: getMovies(page, limit), getMovie(id), createMovie(data), updateMovie(id, data), deleteMovie(id), markWatched(id), getWatchedMovies(page, limit), getTopRatedMovies(), searchMovies(query). All call the matching backend endpoints under /api/movies.

2. src/components/MovieForm.jsx — a reusable form (title, genre, releaseYear) used for both creating and editing a movie, accepting an optional `initialData` prop and an `onSubmit` handler.

3. src/pages/Movies.jsx — fetches and displays the logged-in user's movies in a responsive grid/list with pagination controls (Prev/Next + page number). Each movie card shows title, genre, year, watched status, and Edit/Delete buttons, plus a link to its detail page. Includes an "Add Movie" button that opens MovieForm in a modal or separate section.

4. src/pages/MovieDetail.jsx — shows a single movie's full details, a "Mark as Watched" button (calls markWatched, disabled if already watched), an Edit button, a Delete button (with confirmation), and lists the movie's reviews (fetched from GET /api/reviews and filtered by movie id, or via a dedicated backend param if you added one).

Handle loading and error states cleanly. Give me full code for every file.
```

**✅ Test before moving on:** Can add, edit, delete, view, and mark movies watched entirely through the UI.

---

## 📝 Phase 9 — Review Pages

**Goal:** Let users add/edit/delete reviews for their movies.

**Checklist:**
- [ ] `services/reviewService.js`
- [ ] `components/ReviewForm.jsx` — rating + comment, reusable for create/edit
- [ ] Reviews shown inline on `MovieDetail.jsx` (already scaffolded in Phase 8) with edit/delete controls
- [ ] Optional standalone `pages/Reviews.jsx` listing all of the user's reviews across movies

**Prompt for AI:**
```
Build the Review UI in my React app.

1. src/services/reviewService.js — functions: getReviews(page, limit), getReview(id), createReview(data), updateReview(id, data), deleteReview(id), calling the /api/reviews endpoints.

2. src/components/ReviewForm.jsx — a form with a rating input (1-10, e.g. a number input or star selector) and a comment textarea. Accepts `movieId`, optional `initialData` for editing, and an `onSubmit` handler.

3. Update src/pages/MovieDetail.jsx to let the user add a new review via ReviewForm, and edit/delete their existing reviews for that movie inline.

4. src/pages/Reviews.jsx — a standalone page listing ALL of the logged-in user's reviews across all movies, paginated, each showing the movie title, rating, comment, and edit/delete actions.

Style with Tailwind, handle loading/error states, and confirm before delete. Give me full code for every file.
```

**✅ Test before moving on:** Can add a review from a movie's detail page, see it reflected immediately, edit and delete it.

---

## 🔍 Phase 10 — Dashboard, Search & Top Rated UI

**Goal:** Tie everything together with a home dashboard and the filter features.

**Checklist:**
- [ ] `pages/Dashboard.jsx` — quick stats (total movies, watched count, avg rating) + shortcuts
- [ ] Search bar (debounced) using `GET /api/movies/search?q=`
- [ ] "Top Rated" section/page using `GET /api/movies/top-rated`
- [ ] "Watched" filter/page using `GET /api/movies/watched`

**Prompt for AI:**
```
Build the Dashboard and filtering UI for my React Movie Watchlist app.

1. src/pages/Dashboard.jsx — shows the logged-in user's stats: total movies, number watched, number unwatched, and average rating (computed client-side from the fetched movie list or from a small summary you add to the API). Includes quick links to Movies, Watched, Top Rated, and Reviews pages.

2. src/components/SearchBar.jsx — a debounced search input (400ms) that calls searchMovies(query) from movieService and displays matching results in a dropdown or inline list, linking each result to its MovieDetail page.

3. src/pages/TopRated.jsx — fetches and displays getTopRatedMovies() in a ranked list/grid.

4. src/pages/Watched.jsx — fetches and displays getWatchedMovies() with pagination, same layout style as the Movies page.

5. Add these pages to the router in App.jsx (protected routes) and link them from the Navbar or Dashboard.

Use Tailwind, keep it clean and consistent with the rest of the UI. Give me full code for every file.
```

**✅ Test before moving on:** Dashboard shows correct live stats, search returns matching movies as you type, top-rated and watched pages show correctly filtered/sorted data.

---

## 🎨 Phase 11 — Styling & UX Polish

**Goal:** Make it look like a real product, not a prototype.

**Checklist:**
- [ ] Consistent color scheme, spacing, typography across all pages
- [ ] Loading spinners/skeletons instead of blank screens
- [ ] Toast notifications for success/error (e.g. "Movie added", "Login failed")
- [ ] Empty states (e.g. "No movies yet — add your first one")
- [ ] Responsive on mobile (test at 375px width)
- [ ] Confirm dialogs before destructive actions (delete)

**Prompt for AI:**
```
Polish the UX of my React Movie Watchlist app:

1. Install and configure react-hot-toast (or similar). Add toast.success/toast.error calls to every create/update/delete/login/register action across the app for clear user feedback.

2. Add a reusable src/components/Spinner.jsx and use it for all loading states instead of blank screens.

3. Add a reusable src/components/EmptyState.jsx (icon + message + optional action button) and use it wherever a list (movies, reviews, watched, top-rated) is empty.

4. Add a reusable src/components/ConfirmDialog.jsx and use it before every delete action (movie, review) instead of a plain window.confirm.

5. Review all pages and make sure they're responsive at mobile widths (375px) — stack grids into single columns, make forms full-width, ensure the Navbar collapses sensibly.

Keep the existing Tailwind design language consistent. Show me the new/updated component code and note which existing files need the toast/spinner/empty-state/confirm-dialog integrated.
```

**✅ Test before moving on:** App feels polished — no jarring blank states, clear feedback on every action, works well on a phone-sized screen.

---

## 🚀 Phase 12 — Deployment

**Goal:** Ship it live using free-tier services.

**Checklist:**
- [ ] **MongoDB Atlas**: create free cluster, whitelist IP (0.0.0.0/0 for simplicity or Render's IPs), get connection string
- [ ] **Render**: deploy `server/` as a Web Service, set env vars (`MONGO_URI`, `JWT_SECRET`, `PORT`), confirm build/start commands
- [ ] Update CORS on the backend to allow your deployed frontend's origin
- [ ] **Vercel or Netlify**: deploy `client/`, set `VITE_API_URL` env var to point to your live Render backend URL
- [ ] Test the fully deployed app end to end (register, login, CRUD, deploy links)

**Prompt for AI:**
```
Help me deploy my MERN Movie Watchlist app for free:

1. Walk me through creating a free MongoDB Atlas cluster, setting a database user, whitelisting network access, and getting the MONGO_URI connection string.

2. For the server/ (Node/Express backend), give me:
   - The exact Render.com Web Service settings (build command, start command, root directory if in a monorepo)
   - Which environment variables to set on Render (MONGO_URI, JWT_SECRET, PORT, and CORS-related origin variable)
   - How to update my Express CORS config to only allow my deployed frontend's URL in production while still allowing localhost in development

3. For the client/ (React/Vite frontend), give me:
   - The exact Vercel (or Netlify, whichever is simpler for Vite) deployment settings
   - How to set VITE_API_URL as an environment variable pointing to my Render backend's live URL, and how to reference it in my axios instance instead of hardcoding localhost

4. Give me a short post-deploy checklist to verify registration, login, and all CRUD operations work correctly against the live backend.

My repo structure is a monorepo with /server and /client folders at the root.
```

**✅ Final test:** Full app works end to end on the live URLs — register, login, add/edit/delete movies and reviews, mark watched, search, top-rated, pagination — all functioning against the deployed backend and database.

---

## ✅ Master Checklist (all phases at a glance)

| Phase | What you build | Done? |
|---|---|---|
| 0 | Project setup & folder structure | ☐ |
| 1 | Auth: register, login, me | ☐ |
| 2 | Movie CRUD | ☐ |
| 3 | Review CRUD | ☐ |
| 4 | Watched / top-rated / search | ☐ |
| 5 | Full Postman test pass | ☐ |
| 6 | Frontend setup: routing, context, API layer | ☐ |
| 7 | Auth pages | ☐ |
| 8 | Movie pages | ☐ |
| 9 | Review pages | ☐ |
| 10 | Dashboard, search & top-rated UI | ☐ |
| 11 | Styling & UX polish | ☐ |
| 12 | Deployment | ☐ |

**Golden rule:** Never start a phase's frontend work until that phase's backend endpoints are tested and working in Postman. Never start deployment until every feature works locally.
