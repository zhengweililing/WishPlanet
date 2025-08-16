import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import WishPlanetPage from './pages/WishPlanetPage';
import { Web3Provider } from './context/Web3Context';

function App() {
    return (
        <Web3Provider>
            <div className="app">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<WishPlanetPage />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </div>
        </Web3Provider>
    );
}

export default App; 