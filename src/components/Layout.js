import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Wallet, LogOut } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const Layout = ({ onAddWish }) => {
  const location = useLocation();
  const [particles, setParticles] = useState([]);
  const { account, isConnecting, isConnected, connectWallet, disconnectWallet } = useWeb3();

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

  // 处理钱包连接
  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  // 格式化账户地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
          {/* 添加心愿按钮 */}
          <motion.button
            onClick={onAddWish}
            className="add-wish-btn relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-black font-bold rounded-full transition-all duration-500 hover:scale-110 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/40 border-2 border-yellow-200/50 hover:border-yellow-100 backdrop-blur-sm overflow-hidden group"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 25px 50px -12px rgba(251, 191, 36, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 闪烁背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>

            {/* 图标和文字 */}
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <Plus size={20} />
            </motion.div>
            <span className="relative z-10 text-lg">✨ 添加心愿</span>

            {/* 装饰星星 */}
            <div className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-pulse">⭐</div>
          </motion.button>

          <Link to="/" className="logo">
            <span className="logo-text gradient-text-primary">心愿星球</span>
          </Link>

          {/* 钱包连接按钮 */}
          <motion.button
            onClick={handleWalletConnect}
            disabled={isConnecting}
            className={`wallet-btn relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 hover:scale-110 shadow-xl hover:shadow-2xl border-2 font-bold backdrop-blur-sm overflow-hidden group ${isConnected
              ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 text-black border-green-200/50 hover:border-green-100 hover:shadow-green-400/40'
              : 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white border-purple-200/50 hover:border-purple-100 hover:shadow-purple-400/40'
              } ${isConnecting ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={{
              scale: isConnecting ? 1 : 1.1,
              boxShadow: isConnected
                ? "0 25px 50px -12px rgba(16, 185, 129, 0.5)"
                : "0 25px 50px -12px rgba(139, 92, 246, 0.5)"
            }}
            whileTap={{ scale: isConnecting ? 1 : 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 闪烁背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>

            {isConnecting ? (
              <>
                <div className="relative z-10 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="relative z-10 text-lg">⏳ 连接中...</span>
              </>
            ) : isConnected ? (
              <>
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <LogOut size={20} />
                </motion.div>
                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-lg">🔗 {formatAddress(account)}</span>
                  <span className="text-xs opacity-75">点击断开</span>
                </div>
                {/* 连接状态指示灯 */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                  className="relative z-10"
                >
                  <Wallet size={20} />
                </motion.div>
                <span className="relative z-10 text-lg">💰 连接钱包</span>
                {/* 装饰星星 */}
                <div className="absolute -top-1 -right-1 text-purple-300 text-xs animate-bounce">💎</div>
              </>
            )}
          </motion.button>
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
          justify-content: space-between;
          position: relative;
        }

        .wallet-btn {
          min-width: 140px;
          min-height: 50px;
        }
        
        .add-wish-btn {
          min-width: 140px;
          min-height: 50px;
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