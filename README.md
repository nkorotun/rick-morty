# Rick and Morty App

A **React + Vite + TypeScript** project styled with **Tailwind CSS** and using **React Router** for navigation.  
The app is built around the [Rick and Morty API](https://rickandmortyapi.com/) (or your own data source) to showcase characters, locations, and episodes.

---

## 🚀 Tech Stack
- [React 19](https://react.dev/)  
- [Vite](https://vitejs.dev/) (fast build & dev server)  
- [TypeScript](https://www.typescriptlang.org/)  
- [React Router 7](https://reactrouter.com/)  
- [Tailwind CSS 4](https://tailwindcss.com/)  
- [SVGR](https://react-svgr.com/docs/cli/) (import SVGs as React components)  
- ESLint + TypeScript ESLint for linting  

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/nkorotun/rick-and-morty.git
cd rick-and-morty
yarn install
```
## 🛠 Available Scripts
`yarn dev`
Starts the Vite development server on http://localhost:5173.

`yarn build`
Builds the app for production to the dist/ folder.
Runs TypeScript build (tsc -b) first, then vite build.

`yarn preview`
Serves the compiled dist/ build locally.
Good for testing the production output before deployment.

`yarn lint`
Runs ESLint across the codebase.
---

## 🌐 Deployment (GitHub Pages)

This project includes a GitHub Actions workflow to automatically deploy the app to __GitHub Pages__ when pushing to the main branch.
Ensure your repo is on GitHub.

In your repo: __Settings → Pages → Build and deployment → Source → GitHub Actions.__
Push to main. GitHub Actions will build and deploy the app.

Your app will be live at:
`https://<username>.github.io/rick-and-morty/` (project site), or
`https://<username>.github.io/` if the repo itself is named `<username>.github.io`.

>⚠️ If you’re using `React Router`, make sure to set the basename of your `<BrowserRouter>` to `import.meta.env.BASE_URL`, or use `HashRouter` to avoid routing issues on GitHub Pages.
---

## 📂 Project Structure (typical)
```
rick-and-morty/
├─ src/
│  ├─ assets/       # images, icons, svg
│  ├─ components/   # reusable UI components
│  ├─ pages/        # route-based pages
│  ├─ App.tsx       # root component
│  └─ main.tsx      # entry point
├─ public/          # static assets
├─ dist/            # production build output
├─ package.json
├─ tsconfig.json
└─ vite.config.ts   # vite config
```
## 🔍 Linting

This project uses ESLint 9 with React & TypeScript support. Run:
```bash
yarn lint
```
