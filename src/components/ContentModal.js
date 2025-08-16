import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Type, Image, Music, Video, Save } from 'lucide-react';

const ContentModal = ({ isOpen, onClose, signId, onSave }) => {
    const [contentType, setContentType] = useState('wish');
    const [wishTitle, setWishTitle] = useState('');
    const [wishContent, setWishContent] = useState('');
    const [wishCategory, setWishCategory] = useState('personal');
    const [feeling, setFeeling] = useState('');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // 创建预览
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreview(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSave = () => {
        const content = {
            signId,
            type: contentType,
            wishTitle: wishTitle,
            wishContent: wishContent,
            wishCategory: wishCategory,
            feeling: feeling,
            file: file,
            filePreview: filePreview,
            likes: 0,
            donations: 0,
            timestamp: new Date().toISOString()
        };

        // 调用父组件的保存回调
        if (onSave) {
            onSave(content);
        }

        // 关闭模态框
        onClose();

        // 重置表单
        setWishTitle('');
        setWishContent('');
        setWishCategory('personal');
        setFeeling('');
        setFile(null);
        setFilePreview(null);
        setContentType('wish');
    };

    const contentTypes = [
        { id: 'wish', icon: Type, label: '心愿', accept: null },
        { id: 'image', icon: Image, label: '图片', accept: 'image/*' },
        { id: 'audio', icon: Music, label: '音频', accept: 'audio/*' },
        { id: 'video', icon: Video, label: '视频', accept: 'video/*' }
    ];

    const wishCategories = [
        { id: 'personal', label: '🌟 个人愿望' },
        { id: 'family', label: '👨‍👩‍👧‍👦 家庭幸福' },
        { id: 'career', label: '💼 事业发展' },
        { id: 'health', label: '💚 健康平安' },
        { id: 'love', label: '💕 爱情美满' },
        { id: 'travel', label: '🌍 旅行梦想' },
        { id: 'other', label: '✨ 其他愿望' }
    ];

    console.log('ContentModal render - isOpen:', isOpen, 'signId:', signId); // 调试信息

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 轻微的背景遮罩 */}
                    <motion.div
                        className="absolute inset-0 bg-black/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ pointerEvents: 'auto' }}
                    />

                    {/* 模态框内容 - 在屏幕中央弹出 */}
                    <div className="flex items-center justify-center min-h-screen p-4 pointer-events-auto">
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0, rotateY: -15 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.3, opacity: 0, rotateY: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut", type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-pink-900/40 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
                                            ✨ 许下心愿 ✨
                                        </h2>
                                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 blur-lg rounded-lg -z-10"></div>
                                    </div>
                                    <p className="text-white/80 text-lg font-medium">
                                        在这个神奇的星球上记录你的心愿与美好回忆
                                    </p>
                                    <div className="mt-2 text-purple-200/60">
                                        让愿望在星空中闪闪发光 🌟
                                    </div>
                                </div>

                                {/* 内容类型选择 */}
                                <div className="mb-6">
                                    <label className="block text-white/90 font-medium mb-3">
                                        选择内容类型
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {contentTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setContentType(type.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${contentType === type.id
                                                        ? 'border-purple-400 bg-purple-400/20'
                                                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                                                        }`}
                                                >
                                                    <Icon size={24} className="text-white mx-auto mb-2" />
                                                    <span className="text-white text-sm font-medium">
                                                        {type.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 内容输入区域 */}
                                <div className="mb-6">
                                    {contentType === 'wish' ? (
                                        <div className="space-y-6">
                                            {/* 心愿标题 */}
                                            <div>
                                                <label className="block text-white/90 font-medium mb-3">
                                                    💫 心愿标题
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wishTitle}
                                                    onChange={(e) => setWishTitle(e.target.value)}
                                                    placeholder="给你的心愿起个名字..."
                                                    className="w-full p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-400/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-yellow-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                                                />
                                            </div>

                                            {/* 心愿分类 */}
                                            <div>
                                                <label className="block text-white/90 font-medium mb-3">
                                                    🏷️ 心愿分类
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {wishCategories.map((category) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() => setWishCategory(category.id)}
                                                            className={`p-3 rounded-xl border-2 text-sm transition-all duration-200 ${wishCategory === category.id
                                                                ? 'border-purple-400 bg-purple-400/20 text-white'
                                                                : 'border-white/30 bg-white/10 hover:bg-white/20 text-white/80'
                                                                }`}
                                                        >
                                                            {category.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 心愿内容 */}
                                            <div>
                                                <label className="block text-white/90 font-medium mb-3">
                                                    📝 详细描述
                                                </label>
                                                <textarea
                                                    value={wishContent}
                                                    onChange={(e) => setWishContent(e.target.value)}
                                                    placeholder="详细描述你的心愿，让它更具体、更有力量..."
                                                    className="w-full h-32 p-4 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-pink-900/30 border-2 border-purple-400/40 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:border-yellow-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                                                />
                                            </div>

                                            {/* 感想感受 */}
                                            <div>
                                                <label className="block text-white/90 font-medium mb-3">
                                                    💭 心情感想
                                                </label>
                                                <textarea
                                                    value={feeling}
                                                    onChange={(e) => setFeeling(e.target.value)}
                                                    placeholder="分享一下许下这个心愿时的心情和感受..."
                                                    className="w-full h-24 p-4 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-pink-900/30 border-2 border-purple-400/40 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:border-yellow-400/60 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-white/90 font-medium mb-3">
                                                上传{contentTypes.find(t => t.id === contentType)?.label}
                                            </label>

                                            {/* 文件上传区域 */}
                                            <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                                                <input
                                                    type="file"
                                                    accept={contentTypes.find(t => t.id === contentType)?.accept}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label htmlFor="file-upload" className="cursor-pointer">
                                                    <Upload size={48} className="text-white/60 mx-auto mb-4" />
                                                    <p className="text-white/80 mb-2">
                                                        点击上传{contentTypes.find(t => t.id === contentType)?.label}
                                                    </p>
                                                    <p className="text-white/50 text-sm">
                                                        支持拖拽文件到此区域
                                                    </p>
                                                </label>
                                            </div>

                                            {/* 文件预览 */}
                                            {filePreview && (
                                                <div className="mt-4 p-4 bg-white/10 rounded-xl">
                                                    <p className="text-white/80 mb-2">预览：</p>
                                                    {contentType === 'image' && (
                                                        <img
                                                            src={filePreview}
                                                            alt="预览"
                                                            className="max-w-full h-auto max-h-40 rounded-lg"
                                                        />
                                                    )}
                                                    {contentType === 'audio' && (
                                                        <audio controls className="w-full">
                                                            <source src={filePreview} />
                                                            您的浏览器不支持音频播放。
                                                        </audio>
                                                    )}
                                                    {contentType === 'video' && (
                                                        <video controls className="w-full max-h-40 rounded-lg">
                                                            <source src={filePreview} />
                                                            您的浏览器不支持视频播放。
                                                        </video>
                                                    )}
                                                    <p className="text-white/60 text-sm mt-2">
                                                        文件名: {file?.name}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 操作按钮 */}
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-4 bg-gradient-to-r from-gray-600/40 to-gray-700/40 hover:from-gray-600/60 hover:to-gray-700/60 text-white rounded-xl transition-all duration-300 font-medium border border-gray-400/30 hover:border-gray-300/50"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={contentType === 'wish' ? !wishTitle.trim() || !wishContent.trim() : !file}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-xl transition-all duration-300 flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-purple-500/30 border border-purple-400/30"
                                    >
                                        <Save size={20} />
                                        {contentType === 'wish' ? '✨ 许下心愿 ✨' : '保存'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContentModal;
