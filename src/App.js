import { Route, Routes, useLocation, Navigate } from "react-router-dom"
import './locales/i18n';
import Protected from "./components/Auth/Protected";
import NotFound from "./components/404/NotFound";
import Home from "./components/Home/Home";
import Navigation from './components/Nav/Nav';
import BrowseNews from "./components/News/Browse_News";
import News from "./components/News/News";
import CreateForm from "./components/CreateForm";
import CaseBrowse from './components/Case/CaseBrowse';
import Case from './components/Case/Case'
import NewsList from "./components/News/NewsList";
import Login from "./components/Login/Login";
import { GlobalAlert } from "./components/Alert/GlobalAlert";
import {Container} from 'react-bootstrap';

export function App() {
  const location = useLocation();

  return (
    <div className="App">
      <GlobalAlert/>
      {location.pathname !== '/login' && <Navigation />}
      <Container className="py-5">
        <Routes>
          <Route path="/" element={<Protected element={<Home />} />} />
          <Route path="/make/:option" element={<Protected element={<CreateForm />} />} />

          <Route path="/news" element={<Protected/>}>
            <Route index element={<BrowseNews />} />
            <Route path=":newsId" element={<News />} />
            <Route path="list/:param" element={<NewsList/>} />
          </Route>
          <Route path="/case" element={<Protected/>}>
            <Route index element={<CaseBrowse />} />
            <Route path=":id" element={<Case/>} />
          </Route>
          <Route path="/news/*" element={<Navigate to="/404" />} />
          <Route path="/case/*" element={<Navigate to="/404" />} />
          <Route path="/login" element={<Login/>} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  )
}