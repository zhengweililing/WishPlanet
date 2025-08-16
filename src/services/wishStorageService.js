// 心愿本地存储服务
class WishStorageService {
    constructor() {
        this.storageKey = 'wishPlanet_wishes';
    }

    // 获取所有心愿
    getAllWishes() {
        try {
            const wishes = localStorage.getItem(this.storageKey);
            return wishes ? JSON.parse(wishes) : [];
        } catch (error) {
            console.error('获取心愿数据失败:', error);
            return [];
        }
    }

    // 保存心愿
    saveWish(wishData) {
        try {
            const wishes = this.getAllWishes();

            // 添加ID和时间戳
            const newWish = {
                ...wishData,
                id: Date.now() + Math.random(), // 简单的ID生成
                timestamp: Date.now()
            };

            wishes.push(newWish);
            localStorage.setItem(this.storageKey, JSON.stringify(wishes));

            console.log('心愿保存成功:', newWish);
            return newWish;
        } catch (error) {
            console.error('保存心愿失败:', error);
            throw error;
        }
    }

    // 根据指示牌ID获取心愿
    getWishesBySignId(signId) {
        try {
            const wishes = this.getAllWishes();
            return wishes.filter(wish => wish.signId === signId);
        } catch (error) {
            console.error('获取指定指示牌心愿失败:', error);
            return [];
        }
    }

    // 删除心愿
    deleteWish(wishId) {
        try {
            const wishes = this.getAllWishes();
            const filteredWishes = wishes.filter(wish => wish.id !== wishId);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredWishes));

            console.log('心愿删除成功:', wishId);
            return true;
        } catch (error) {
            console.error('删除心愿失败:', error);
            return false;
        }
    }

    // 更新心愿
    updateWish(wishId, updateData) {
        try {
            const wishes = this.getAllWishes();
            const wishIndex = wishes.findIndex(wish => wish.id === wishId);

            if (wishIndex !== -1) {
                wishes[wishIndex] = { ...wishes[wishIndex], ...updateData };
                localStorage.setItem(this.storageKey, JSON.stringify(wishes));

                console.log('心愿更新成功:', wishes[wishIndex]);
                return wishes[wishIndex];
            } else {
                throw new Error('心愿未找到');
            }
        } catch (error) {
            console.error('更新心愿失败:', error);
            throw error;
        }
    }

    // 增加点赞数
    incrementLikes(wishId) {
        try {
            const wishes = this.getAllWishes();
            const wishIndex = wishes.findIndex(wish => wish.id === wishId);

            if (wishIndex !== -1) {
                wishes[wishIndex].likes = (wishes[wishIndex].likes || 0) + 1;
                localStorage.setItem(this.storageKey, JSON.stringify(wishes));
                return wishes[wishIndex];
            }
        } catch (error) {
            console.error('增加点赞失败:', error);
        }
        return null;
    }

    // 增加打赏
    addDonation(wishId, amount) {
        try {
            const wishes = this.getAllWishes();
            const wishIndex = wishes.findIndex(wish => wish.id === wishId);

            if (wishIndex !== -1) {
                wishes[wishIndex].donations = (wishes[wishIndex].donations || 0) + amount;
                localStorage.setItem(this.storageKey, JSON.stringify(wishes));
                return wishes[wishIndex];
            }
        } catch (error) {
            console.error('增加打赏失败:', error);
        }
        return null;
    }

    // 清空所有心愿
    clearAllWishes() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('所有心愿已清空');
            return true;
        } catch (error) {
            console.error('清空心愿失败:', error);
            return false;
        }
    }

    // 导出数据
    exportWishes() {
        try {
            const wishes = this.getAllWishes();
            const dataStr = JSON.stringify(wishes, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = window.URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `wish_planet_wishes_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            window.URL.revokeObjectURL(url);
            console.log('心愿数据导出成功');
            return true;
        } catch (error) {
            console.error('导出心愿数据失败:', error);
            return false;
        }
    }

    // 导入数据
    importWishes(file) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedWishes = JSON.parse(e.target.result);
                        const currentWishes = this.getAllWishes();

                        // 合并数据，避免重复
                        const mergedWishes = [...currentWishes];
                        importedWishes.forEach(importedWish => {
                            const exists = mergedWishes.some(wish =>
                                wish.signId === importedWish.signId &&
                                wish.wishContent === importedWish.wishContent
                            );
                            if (!exists) {
                                mergedWishes.push({
                                    ...importedWish,
                                    id: Date.now() + Math.random() // 重新生成ID
                                });
                            }
                        });

                        localStorage.setItem(this.storageKey, JSON.stringify(mergedWishes));
                        console.log('心愿数据导入成功');
                        resolve(mergedWishes);
                    } catch (parseError) {
                        reject(new Error('文件格式错误'));
                    }
                };
                reader.readAsText(file);
            } catch (error) {
                reject(error);
            }
        });
    }

    // 获取统计信息
    getStatistics() {
        try {
            const wishes = this.getAllWishes();
            const stats = {
                totalWishes: wishes.length,
                totalLikes: wishes.reduce((sum, wish) => sum + (wish.likes || 0), 0),
                totalDonations: wishes.reduce((sum, wish) => sum + (wish.donations || 0), 0),
                wishesBySign: {},
                wishesByCategory: {},
                recentWishes: wishes
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 5)
            };

            // 按指示牌统计
            wishes.forEach(wish => {
                stats.wishesBySign[wish.signId] = (stats.wishesBySign[wish.signId] || 0) + 1;
            });

            // 按分类统计
            wishes.forEach(wish => {
                const category = wish.wishCategory || 'other';
                stats.wishesByCategory[category] = (stats.wishesByCategory[category] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error('获取统计信息失败:', error);
            return {
                totalWishes: 0,
                totalLikes: 0,
                totalDonations: 0,
                wishesBySign: {},
                wishesByCategory: {},
                recentWishes: []
            };
        }
    }
}

// 创建单例实例
const wishStorageService = new WishStorageService();

export default wishStorageService;
