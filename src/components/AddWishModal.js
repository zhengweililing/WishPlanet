import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Heart, Image, Music, Video, Save, Loader2 } from 'lucide-react';
import { wishChainService } from '../services/wishChainService';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from "ethers";

const AddWishModal = ({ isOpen, onClose, onSave }) => {
    const [nickname, setNickname] = useState('');
    const [wishContent, setWishContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // 使用全局的Web3状态
    const { account, isConnected, contract, createSeal } = useWeb3();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setSelectedFiles(files);

            // 创建预览
            const previews = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previews.push({
                        file: file,
                        type: file.type.split('/')[0], // image, audio, video
                        url: e.target.result,
                        name: file.name
                    });

                    if (previews.length === files.length) {
                        setFilePreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = filePreviews.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setFilePreviews(newPreviews);
    };

    // 保存心愿上链
    const handleSave = async () => {
        if (!nickname.trim() || !wishContent.trim()) {
            alert('请填写昵称和心愿内容！');
            return;
        }

        if (!isConnected) {
            alert('请先连接钱包！请点击页面右上角的连接钱包按钮。');
            return;
        }

        setIsSaving(true);
        try {
            // 使用Web3Context的合约实例直接上链
            const wishData = {
                nickname: nickname.trim(),
                content: wishContent.trim(),
                files: selectedFiles,
                creator: account,
                createdAt: Date.now()
            };

            console.log('正在创建心愿...', wishData);
            const jsonString = JSON.stringify(wishData);
            const encodedData = ethers.toUtf8Bytes(jsonString);

            // 直接使用Web3Context的合约实例
            console.log(encodedData,'encodedData')
            const tx = await contract.createWish(encodedData);
            console.log('交易已发送:', tx.hash);

            // 等待交易确认
            const receipt = await tx.wait();
            console.log('交易已确认:', receipt);

            const result = {
                id: receipt.hash,
                txHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                ...wishData
            };

            console.log('心愿创建成功:', result);

            // 通知父组件
            if (onSave) {
                onSave(result);
            }

            alert('心愿上链成功！');

            // 重置表单
            setNickname('');
            setWishContent('');
            setSelectedFiles([]);
            setFilePreviews([]);

            onClose();
        } catch (error) {
            console.error('心愿创建失败:', error);
            alert('心愿创建失败: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        // 重置表单
        setNickname('');
        setWishContent('');
        setSelectedFiles([]);
        setFilePreviews([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 背景遮罩 */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* 弹窗内容 */}
                    <motion.div
                        className="relative bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-900/90 backdrop-blur-xl border border-purple-400/40 rounded-xl p-4 w-full max-w-sm max-h-[75vh] overflow-y-auto shadow-xl"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 最小装饰 */}
                        <div className="absolute top-2 right-8 text-yellow-300 animate-pulse text-sm">✨</div>

                        {/* 关闭按钮 */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all duration-300 group z-10"
                        >
                            <X size={14} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* 标题 */}
                        <div className="mb-4 text-center">
                            <h2 className="text-lg font-bold text-white mb-1">
                                添加心愿
                            </h2>
                            {/* 钱包连接状态 */}
                            {isConnected ? (
                                <div className="text-xs text-green-300 flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>已连接: {account.slice(0, 6)}...{account.slice(-4)}</span>
                                </div>
                            ) : (
                                <div className="text-xs text-orange-300 flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    <span>请在右上角连接钱包</span>
                                </div>
                            )}
                        </div>

                        {/* 表单内容 */}
                        <div className="space-y-3">
                            {/* 昵称输入 - 必填 */}
                            <div>
                                <label className="flex items-center gap-1 text-white/90 text-sm mb-1">
                                    <User size={14} className="text-pink-300" />
                                    <span>昵称</span>
                                    <span className="text-red-400 text-xs">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="输入昵称"
                                    className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:border-pink-400/60 transition-all duration-300 text-sm"
                                    maxLength={20}
                                />
                            </div>

                            {/* 心愿内容 - 必填 */}
                            <div>
                                <label className="flex items-center gap-1 text-white/90 text-sm mb-1">
                                    <Heart size={14} className="text-pink-300" />
                                    <span>心愿内容</span>
                                    <span className="text-red-400 text-xs">*</span>
                                </label>
                                <textarea
                                    value={wishContent}
                                    onChange={(e) => setWishContent(e.target.value)}
                                    placeholder="描述你的心愿..."
                                    className="w-full h-20 p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 resize-none focus:outline-none focus:border-pink-400/60 transition-all duration-300 text-sm"
                                    maxLength={200}
                                />
                            </div>

                            {/* 文件上传 - 可选 */}
                            <div>
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*,audio/*,video/*';
                                        input.multiple = true;
                                        input.onchange = handleFileChange;
                                        input.click();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-white rounded-lg transition-all duration-300 text-sm border border-indigo-400/40 hover:border-indigo-300/60 cursor-pointer font-medium shadow-md hover:shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Upload size={16} className="text-indigo-300" />
                                    <span>📎 选择文件</span>
                                </motion.button>

                                {/* 文件预览 */}
                                {filePreviews.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-white/80 text-xs mb-1">已选择 {filePreviews.length} 个文件</p>
                                        <div className="space-y-1">
                                            {filePreviews.map((preview, index) => (
                                                <div key={index} className="flex items-center justify-between p-1 bg-white/10 rounded text-xs">
                                                    <span className="text-white/80 truncate flex-1">
                                                        {preview.name}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 transition-colors ml-2"
                                                    >
                                                        <X size={10} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="space-y-2 mt-4">
                            {/* 主要操作按钮 */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-300 text-sm border border-gray-500/40 hover:border-gray-400/60 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ❌ 取消
                                </motion.button>
                                <motion.button
                                    onClick={handleSave}
                                    disabled={!nickname.trim() || !wishContent.trim() || !isConnected || isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 text-white rounded-xl transition-all duration-300 text-sm border border-purple-400/40 hover:border-purple-300/60 disabled:border-gray-400/30 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
                                    whileHover={{ scale: isSaving ? 1 : 1.05 }}
                                    whileTap={{ scale: isSaving ? 1 : 0.95 }}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>⚡ 上链中...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>🚀 上链保存</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddWishModal;
