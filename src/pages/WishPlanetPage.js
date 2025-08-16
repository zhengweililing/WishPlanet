import React, { useState, useEffect } from 'react';
import ThreeScene from '../components/ThreeScene';
import ContentModal from '../components/ContentModal';
import SignModal from '../components/SignModal';
import wishStorageService from '../services/wishStorageService';

// 心愿星球页面 - 带指示牌和内容创建功能
function WishPlanetPage() {
    const [showSignModal, setShowSignModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [selectedSignId, setSelectedSignId] = useState(null);
    const [savedWishes, setSavedWishes] = useState([]);

    // 加载保存的心愿数据
    useEffect(() => {
        const loadWishes = () => {
            const wishes = wishStorageService.getAllWishes();
            setSavedWishes(wishes);
        };

        loadWishes();
    }, []);

    // 处理指示牌点击 - 显示该牌子的心愿列表
    const handleSignClick = (signId) => {
        console.log('WishPlanetPage: 收到点击信号', signId); // 调试信息
        setSelectedSignId(signId);
        setShowSignModal(true);
    };

    // 处理创建新心愿
    const handleCreateWish = (signId) => {
        setSelectedSignId(signId);
        setShowContentModal(true);
    };

    // 关闭指示牌弹窗
    const handleCloseSignModal = () => {
        setShowSignModal(false);
        setSelectedSignId(null);
    };

    // 关闭内容创建弹窗
    const handleCloseContentModal = () => {
        setShowContentModal(false);
        setSelectedSignId(null);
    };

    // 保存心愿后的回调
    const handleWishSaved = (wishData) => {
        try {
            const savedWish = wishStorageService.saveWish(wishData);
            setSavedWishes(prev => [...prev, savedWish]);
            console.log('心愿保存成功:', savedWish);
        } catch (error) {
            console.error('保存心愿失败:', error);
            alert('保存心愿失败，请重试');
        }
    };

    // 心愿更新回调（用于点赞、打赏、删除后刷新数据）
    const handleWishUpdate = () => {
        const wishes = wishStorageService.getAllWishes();
        setSavedWishes(wishes);
    };

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* 统计信息显示 */}
            <div className="fixed top-4 left-4 z-50 bg-purple-900/40 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-4 text-white">
                <div className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-300">✨</span>
                        <span>心愿总数: {savedWishes.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-pink-300">💖</span>
                        <span>点赞: {savedWishes.reduce((sum, wish) => sum + (wish.likes || 0), 0)}</span>
                    </div>
                </div>
            </div>

            {/* 测试按钮 */}
            <button
                onClick={() => handleSignClick('sign_0')}
                className="fixed top-20 right-4 z-50 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                测试指示牌弹窗
            </button>

            {/* 主内容区域 */}
            <div className="relative">
                <div className="h-screen">
                    <ThreeScene onSignClick={handleSignClick} />
                </div>
            </div>

            {/* 指示牌弹窗 - 显示该牌子的心愿列表 */}
            <SignModal
                isOpen={showSignModal}
                onClose={handleCloseSignModal}
                signId={selectedSignId}
                onCreateWish={handleCreateWish}
                savedWishes={savedWishes}
                onWishUpdate={handleWishUpdate}
            />

            {/* 内容创建模态框 - 创建新心愿 */}
            <ContentModal
                isOpen={showContentModal}
                onClose={handleCloseContentModal}
                signId={selectedSignId}
                onSave={handleWishSaved}
            />
        </div>
    );
}

export default WishPlanetPage;
