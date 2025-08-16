import React from 'react';
import { Heart, Gift, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// 二次元风格愿望详情弹窗
function WishModal({ wish, isOpen, onClose }) {
    if (!isOpen || !wish) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="glass-light p-12 rounded-3xl border-2 border-white/40 max-w-2xl w-full shadow-2xl relative overflow-hidden hover-lift">
                {/* Enhanced decorative background elements */}
                <div className="absolute top-6 right-6 text-4xl animate-spin opacity-60">🌟</div>
                <div className="absolute bottom-6 left-6 text-3xl animate-pulse opacity-50">💫</div>
                <div className="absolute top-1/2 left-4 text-2xl float opacity-30">✨</div>
                <div className="absolute top-1/4 right-8 text-2xl float opacity-40" style={{ animationDelay: '1s' }}>🎀</div>

                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-xl pulse-glow">
                            <Star className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold gradient-text-primary mb-2 text-glow">
                                ✨ 心愿详情 ✨
                            </h3>
                            <p className="text-white/70 text-lg">探索美好的心愿世界</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-14 h-14 bg-white/20 hover:bg-white/40 text-white rounded-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center font-bold backdrop-blur-10 border border-white/30 text-xl hover-lift"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Wish content */}
                    <div className="glass-light p-8 rounded-3xl border border-white/25 hover-lift">
                        <div className="text-center mb-4">
                            <div className="text-3xl mb-2">💭</div>
                            <h4 className="text-xl font-bold text-white mb-4">心愿内容</h4>
                        </div>
                        <p className="text-white leading-relaxed font-medium text-xl text-center">{wish.content}</p>
                    </div>

                    {/* Author info */}
                    <div className="glass p-6 rounded-2xl border border-white/20 hover-lift">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xl">👤</span>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">许愿者</p>
                                <p className="text-white font-bold text-lg">{wish.author}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="glass-light p-8 rounded-3xl border border-white/25 hover-lift">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 pulse-glow">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-pink-300 mb-1">{wish.likes}</div>
                                <div className="text-white/80 font-medium">点赞数 💖</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 pulse-glow">
                                    <Gift className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-yellow-300 mb-1">{wish.donations}</div>
                                <div className="text-white/80 font-medium">打赏 MON 💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-6 pt-4">
                        <motion.button
                            className="btn btn-sakura btn-lg btn-glow flex-1 flex items-center justify-center gap-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Heart className="w-7 h-7" />
                            💖 点赞支持
                        </motion.button>
                        <motion.button
                            className="btn btn-fire btn-lg btn-glow flex-1 flex items-center justify-center gap-4"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Gift className="w-7 h-7" />
                            💰 打赏助力
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishModal;
