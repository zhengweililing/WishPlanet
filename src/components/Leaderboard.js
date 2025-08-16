import React from 'react';
import { Heart, Gift, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// 二次元风格排行榜组件
function Leaderboard({ wishes, timeframe, setTimeframe }) {
    const sortedWishes = React.useMemo(() => {
        const now = Date.now();
        let filteredWishes = [...wishes];

        // 根据时间范围过滤
        switch (timeframe) {
            case 'week':
                filteredWishes = wishes.filter(w => now - w.timestamp <= 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                filteredWishes = wishes.filter(w => now - w.timestamp <= 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                filteredWishes = wishes.filter(w => now - w.timestamp <= 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                break;
        }

        // 按点赞数 + 打赏金额排序
        return filteredWishes
            .sort((a, b) => (b.likes + b.donations) - (a.likes + a.donations))
            .slice(0, 10);
    }, [wishes, timeframe]);

    const timeframeOptions = [
        { key: 'week', label: '📅 周榜', icon: Calendar, emoji: '🌟' },
        { key: 'month', label: '📊 月榜', icon: TrendingUp, emoji: '✨' },
        { key: 'year', label: '🏆 年榜', icon: Trophy, emoji: '👑' }
    ];

    return (
        <div className="glass-light p-10 rounded-3xl border-2 border-white/30 shadow-2xl relative overflow-hidden hover-lift">
            {/* Enhanced decorative background */}
            <div className="absolute top-6 right-6 text-5xl animate-bounce">🌈</div>
            <div className="absolute bottom-6 left-6 text-4xl animate-pulse">💫</div>
            <div className="absolute top-1/3 left-8 text-3xl float opacity-40">🎀</div>
            <div className="absolute bottom-1/3 right-10 text-3xl float opacity-50" style={{ animationDelay: '2s' }}>⭐</div>

            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center pulse-glow">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-bold gradient-text-primary text-glow">
                        🏆 愿望排行榜 🏆
                    </h2>
                </div>
                <p className="text-white/80 text-xl font-medium mb-8">
                    发现最受欢迎的心愿，见证美好的力量 ✨
                </p>

                <div className="flex justify-center gap-4">
                    {timeframeOptions.map(({ key, label, icon: Icon }) => (
                        <motion.button
                            key={key}
                            onClick={() => setTimeframe(key)}
                            className={`btn btn-glow flex items-center gap-3 ${timeframe === key
                                ? 'btn-rainbow'
                                : 'btn-ocean'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {sortedWishes.map((wish, index) => (
                    <div
                        key={wish.id}
                        className="glass-light p-8 rounded-3xl border border-white/25 hover:border-white/40 transition-all duration-300 transform hover-lift shadow-lg"
                    >
                        <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-2xl shadow-xl pulse-glow ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                        'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
                                }`}>
                                {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </div>

                            <div className="flex-1">
                                <div className="glass p-6 rounded-2xl mb-4">
                                    <p className="text-white leading-relaxed font-medium text-lg">
                                        {wish.content.slice(0, 80)}{wish.content.length > 80 ? '...' : ''}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-lg">👤</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">许愿者</p>
                                            <p className="text-white font-bold">{wish.author}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3">
                                            <Heart className="w-5 h-5 text-pink-400" />
                                            <span className="text-white font-bold text-lg">{wish.likes}</span>
                                            <span className="text-xl">💖</span>
                                        </div>
                                        <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3">
                                            <Gift className="w-5 h-5 text-yellow-400" />
                                            <span className="text-white font-bold text-lg">{wish.donations}</span>
                                            <span className="text-xl">💰</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;
