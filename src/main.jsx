import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import OurWorkPage from './pages/OurWorkPage/OurWorkPage.jsx'
import CaseStudyPage from './pages/CaseStudyPage/CaseStudyPage.jsx'
import CaseStudyArticle from './pages/CaseStudyArticle/CaseStudyArticle.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/ourwork' element={<OurWorkPage />} />
      <Route path="/case-studies" element={<CaseStudyPage />} />
      <Route path="/case-studies/:slug" element={<CaseStudyArticle />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)