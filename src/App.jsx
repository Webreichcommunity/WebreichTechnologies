import { lazy, Suspense } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  CareersPage,
  ContactPage,
  EcosystemPage,
  FounderPage,
  InsightDetailPage,
  IndustriesPage,
  InfrastructurePage,
  EngineeringPage,
  EngineeringDetailPage,
  InsightsPage,
  Overview,
  ProductDetailPage,
  ProductsPage,
  WorkDetailPage,
  VisionPage,
  WorkPage,
} from './pages/WebReich/PublicPages'
import ScrollToTop from './components/ScrollToTop'
import RouteSEO from './seo/RouteSEO'

const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'))
const InternShip = lazy(() => import('./pages/InternShip/InternShip'))
const GenerateCertificates = lazy(() => import('./pages/InternShip/GenerateCertificates'))

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <RouteSEO />}
      {!isAdmin && <Header />}
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-[#10100f]" />}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:id" element={<WorkDetailPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/founders" element={<FounderPage />} />
          <Route path="/founder" element={<Navigate to="/founders" replace />} />
          <Route path="/engineering" element={<EngineeringPage />} />
          <Route path="/engineering/:id" element={<EngineeringDetailPage />} />
          <Route path="/labs" element={<Navigate to="/engineering" replace />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insight/:id" element={<InsightDetailPage />} />
          <Route path="/insights/:id" element={<InsightDetailPage />} />
          <Route path="/journal" element={<Navigate to="/insights" replace />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/connect" element={<ContactPage />} />
          <Route path="/contact" element={<Navigate to="/connect" replace />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/internships" element={<InternShip />} />
          <Route path="/admin/certificates" element={<GenerateCertificates />} />
          <Route path="/internship-webreich-@3535" element={<Navigate to="/admin/internships" replace />} />
          <Route path="/generate-certificates" element={<Navigate to="/admin/certificates" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
