import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  const location = useLocation();
  const [particles, setParticles] = useState([]);

  // Generate background particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 20,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);



  return (
    <div className="layout">
      {/* Animated background particles */}
      <div className="particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="nav">
        <motion.div
          className="nav-container"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/" className="logo">
            <span className="logo-text gradient-text-primary">心愿星球</span>
          </Link>
        </motion.div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          position: relative;
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          box-shadow: none;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
        }

        .logo-text {
          font-size: 32px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          text-align: center;
        }





        .main-content {
          padding-top: 0px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 16px;
          }

          .logo-text {
            font-size: 20px;
          }


        }
      `}</style>
    </div>
  );
};

export default Layout; 