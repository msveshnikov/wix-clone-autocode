import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Builder = lazy(() => import('./pages/Builder'));
const Templates = lazy(() => import('./pages/Templates'));
const UserAccount = lazy(() => import('./pages/UserAccount'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PublishedSite = lazy(() => import('./pages/PublishedSite'));
const SEOTools = lazy(() => import('./pages/SEOTools'));
const Ecommerce = lazy(() => import('./pages/Ecommerce'));
const Collaboration = lazy(() => import('./pages/Collaboration'));
const VersionControl = lazy(() => import('./pages/VersionControl'));

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Header />
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/builder" element={<Builder />} />
                            <Route path="/templates" element={<Templates />} />
                            <Route path="/account" element={<UserAccount />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/site/:siteId" element={<PublishedSite />} />
                            <Route path="/seo-tools" element={<SEOTools />} />
                            <Route path="/ecommerce" element={<Ecommerce />} />
                            <Route path="/collaboration" element={<Collaboration />} />
                            <Route path="/version-control" element={<VersionControl />} />
                        </Routes>
                    </Suspense>
                    <Footer />
                </div>
            </Router>
        </Provider>
    );
};

export default App;
