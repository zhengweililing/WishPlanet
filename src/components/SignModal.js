import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Heart, Gift, Star, Edit, Trash2, Eye } from 'lucide-react';

const SignModal = ({ isOpen, onClose, signId, onCreateWish, savedWishes = [], onWishUpdate }) => {
    const [signWishes, setSignWishes] = useState([]);
    const [selectedWish, setSelectedWish] = useState(null);
    const [showWishDetail, setShowWishDetail] = useState(false);

    // 获取当前指示牌的心愿
    useEffect(() => {
        if (signId && savedWishes.length > 0) {
            // 对于合约数据，显示所有心愿；对于本地数据，过滤特定signId
            const wishes = savedWishes.filter(wish => {
                // 如果心愿有signId属性，说明是本地数据，需要过滤
                if (wish.signId !== undefined) {
                    return wish.signId === signId;
                }
                // 如果没有signId属性，说明是合约数据，显示所有
                return true;
            });
            setSignWishes(wishes);
        } else {
            setSignWishes([]);
        }
    }, [signId, savedWishes]);

    const handleCreateNew = () => {
        onClose();
        onCreateWish(signId);
    };

    const handleViewWish = (wish) => {
        setSelectedWish(wish);
        setShowWishDetail(true);
    };

    const handleDeleteWish = (wishId) => {
        if (window.confirm('确定要删除这个心愿吗？')) {
            const wishStorageService = require('../services/wishStorageService').default;
            if (wishStorageService.deleteWish(wishId)) {
                // 更新本地状态
                setSignWishes(prev => prev.filter(wish => wish.id !== wishId));
                // 通知父组件更新
                if (onWishUpdate) {
                    onWishUpdate();
                }
                console.log('心愿删除成功:', wishId);
            } else {
                alert('删除失败，请重试');
            }
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getWishCategoryEmoji = (category) => {
        const categoryMap = {
            'personal': '🌟',
            'family': '👨‍👩‍👧‍👦',
            'career': '💼',
            'health': '💚',
            'love': '💕',
            'travel': '🌍',
            'other': '✨'
        };
        return categoryMap[category] || '✨';
    };

    const getSignName = (signId) => {
        const signNames = {
            'sign_0': '顶部星台',
            'sign_1': '右侧月台',
            'sign_2': '左侧云台',
            'sign_3': '前方光台',
            'sign_4': '底部梦台'
        };
        return signNames[signId] || '神秘平台';
    };

    // 点赞功能
    const handleLikeWish = (wishId) => {
        const wishStorageService = require('../services/wishStorageService').default;
        const updatedWish = wishStorageService.incrementLikes(wishId);
        if (updatedWish) {
            // 更新本地状态
            setSignWishes(prev => prev.map(wish =>
                wish.id === wishId ? updatedWish : wish
            ));
            setSelectedWish(updatedWish);
            // 通知父组件更新
            if (onWishUpdate) {
                onWishUpdate();
            }
        }
    };

    // 打赏功能
    const handleDonateWish = (wishId) => {
        const amount = prompt('请输入打赏金额 (MON):');
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            const wishStorageService = require('../services/wishStorageService').default;
            const updatedWish = wishStorageService.addDonation(wishId, parseFloat(amount));
            if (updatedWish) {
                // 更新本地状态
                setSignWishes(prev => prev.map(wish =>
                    wish.id === wishId ? updatedWish : wish
                ));
                setSelectedWish(updatedWish);
                // 通知父组件更新
                if (onWishUpdate) {
                    onWishUpdate();
                }
                alert(`打赏成功！感谢您的 ${amount} MON 支持！`);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 背景遮罩 */}
                    <motion.div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ pointerEvents: 'auto' }}
                    />

                    {/* 模态框内容 */}
                    <div className="flex items-center justify-center min-h-screen p-4 pointer-events-auto">
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0, rotateY: -15 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.3, opacity: 0, rotateY: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut", type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                {/* 装饰性光晕 */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10 rounded-3xl"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-lg -z-10"></div>

                                {/* 星星装饰 */}
                                <div className="absolute top-4 right-16 text-yellow-300 animate-pulse">✨</div>
                                <div className="absolute top-8 left-12 text-purple-300 animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
                                <div className="absolute bottom-6 right-8 text-pink-300 animate-pulse" style={{ animationDelay: '1s' }}>💫</div>

                                {/* 关闭按钮 */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all duration-300 group z-10"
                                >
                                    <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                {/* 标题 */}
                                <div className="mb-8 text-center">
                                    <div className="relative inline-block">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
                                            🏷️ {getSignName(signId)} 🏷️
                                        </h2>
                                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 blur-lg rounded-lg -z-10"></div>
                                    </div>
                                    <p className="text-white/80 text-lg font-medium">
                                        这里记录着你的美好心愿和珍贵回忆
                                    </p>
                                    <div className="mt-2 text-purple-200/60">
                                        心愿总数: {signWishes.length} 个 ✨
                                    </div>
                                </div>

                                {/* 心愿列表 */}
                                <div className="mb-6">
                                    {signWishes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4 opacity-40">🌟</div>
                                            <h3 className="text-xl font-bold text-white/70 mb-2">
                                                这里还没有心愿
                                            </h3>
                                            <p className="text-white/50 mb-6">
                                                点击下方按钮创建你的第一个心愿吧！
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {signWishes.map((wish, index) => (
                                                <motion.div
                                                    key={wish.id || index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-2xl p-5 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">
                                                                {getWishCategoryEmoji(wish.wishCategory || 'other')}
                                                            </span>
                                                            <div>
                                                                <h4 className="font-bold text-white text-lg line-clamp-1">
                                                                    {wish.wishTitle || wish.content || '未命名心愿'}
                                                                </h4>
                                                                <p className="text-white/60 text-sm">
                                                                    {formatDate(wish.timestamp || wish.createdAt)}
                                                                </p>
                                                                {/* 显示创建者昵称（仅合约数据） */}
                                                                {wish.nickname && (
                                                                    <p className="text-purple-300/80 text-xs">
                                                                        👤 {wish.nickname}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleViewWish(wish)}
                                                                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-all duration-200"
                                                                title="查看详情"
                                                            >
                                                                <Eye size={16} className="text-blue-300" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteWish(wish.id)}
                                                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all duration-200"
                                                                title="删除"
                                                            >
                                                                <Trash2 size={16} className="text-red-300" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="text-white/80 text-sm line-clamp-2 mb-3">
                                                        {wish.wishContent || wish.content || '心愿内容'}
                                                    </p>

                                                    {wish.feeling && (
                                                        <p className="text-purple-200/80 text-xs italic bg-purple-500/10 rounded-lg p-2 mb-3">
                                                            💭 {wish.feeling}
                                                        </p>
                                                    )}

                                                    {/* 合约地址信息（仅合约数据） */}
                                                    {wish.address && (
                                                        <p className="text-blue-200/60 text-xs bg-blue-500/10 rounded-lg p-2 mb-3 break-all">
                                                            🔗 {wish.address}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-white/60">
                                                            {wish.address ? '⛓️ 链上心愿' : wish.type === 'wish' ? '💫 本地心愿' : `📁 ${wish.type}`}
                                                        </span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1 text-pink-300">
                                                                <Heart size={14} />
                                                                {wish.likes || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-yellow-300">
                                                                <Gift size={14} />
                                                                {(wish.donations || wish.totalRewards || 0)} MON
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 创建新心愿按钮 */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleCreateNew}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-purple-500/30 border border-purple-400/30 hover:scale-105"
                                    >
                                        <Plus size={24} />
                                        ✨ 创建新心愿 ✨
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 心愿详情弹窗 */}
                    <AnimatePresence>
                        {showWishDetail && selectedWish && (
                            <motion.div
                                className="fixed inset-0 z-[10000] pointer-events-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                                <div className="flex items-center justify-center min-h-screen p-4">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="relative bg-gradient-to-br from-purple-900/50 via-purple-800/40 to-pink-900/50 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
                                    >
                                        <button
                                            onClick={() => setShowWishDetail(false)}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all"
                                        >
                                            <X size={18} className="text-white" />
                                        </button>

                                        <div className="text-center mb-6">
                                            <div className="text-4xl mb-3">
                                                {getWishCategoryEmoji(selectedWish.wishCategory)}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {selectedWish.wishTitle}
                                            </h3>
                                            <p className="text-white/60">
                                                {formatDate(selectedWish.timestamp)}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-white/5 rounded-2xl p-6">
                                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                    📝 心愿内容
                                                </h4>
                                                <p className="text-white/90 leading-relaxed">
                                                    {selectedWish.wishContent}
                                                </p>
                                            </div>

                                            {selectedWish.feeling && (
                                                <div className="bg-purple-500/10 rounded-2xl p-6">
                                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                        💭 心情感想
                                                    </h4>
                                                    <p className="text-purple-200/90 leading-relaxed italic">
                                                        {selectedWish.feeling}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleLikeWish(selectedWish.id)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold hover:scale-105"
                                                >
                                                    <Heart size={18} />
                                                    点赞 ({selectedWish.likes || 0})
                                                </button>
                                                <button
                                                    onClick={() => handleDonateWish(selectedWish.id)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold hover:scale-105"
                                                >
                                                    <Gift size={18} />
                                                    打赏 ({selectedWish.donations || 0})
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SignModal;
