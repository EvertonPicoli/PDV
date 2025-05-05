import Layout from "./Layout.jsx";

import PDV from "./PDV";

import Orders from "./Orders";

import Products from "./Products";

import Dashboard from "./Dashboard";

import Company from "./Company";

import Customers from "./Customers";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    PDV: PDV,
    
    Orders: Orders,
    
    Products: Products,
    
    Dashboard: Dashboard,
    
    Company: Company,
    
    Customers: Customers,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<PDV />} />
                
                
                <Route path="/PDV" element={<PDV />} />
                
                <Route path="/Orders" element={<Orders />} />
                
                <Route path="/Products" element={<Products />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Company" element={<Company />} />
                
                <Route path="/Customers" element={<Customers />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}