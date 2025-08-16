// 心愿上链服务 - 结合文件存储和区块链上链
import { contractService } from '../core/contractService';
import { uploadFiles, updateFilesSealId } from './fileService';

/**
 * 心愿上链服务类
 */
class WishChainService {
    constructor() {
        this.isConnected = false;
    }

    /**
     * 连接钱包
     */
    async connectWallet() {
        try {
            const connection = await contractService.connectWallet();
            this.isConnected = true;
            console.log('钱包连接成功:', connection.account);
            return connection;
        } catch (error) {
            this.isConnected = false;
            console.error('钱包连接失败:', error);
            throw error;
        }
    }

    /**
     * 检查钱包连接状态
     */
    checkConnection() {
        if (!this.isConnected || !contractService.contract) {
            throw new Error('请先连接钱包');
        }
    }

    /**
     * 完整的心愿创建流程
     * 1. 文件上传到IndexedDB生成文件ID
     * 2. 心愿数据和文件ID一起上链
     * 3. 更新文件的链上ID关联
     */
    async createWish(wishData) {
        const { nickname, content, files = [] } = wishData;

        // if (!nickname?.trim() || !content?.trim()) {
        //     throw new Error('昵称和心愿内容不能为空');
        // }

        this.checkConnection();

        try {
            let fileIds = [];

            // 步骤1: 如果有文件，先上传到IndexedDB
            if (files && files.length > 0) {
                console.log('正在上传文件到本地存储...');
                fileIds = await uploadFiles(files);
                console.log('文件上传完成，文件ID:', fileIds);
            }

            // 步骤2: 心愿数据上链
            console.log('正在上链心愿数据...');
            const wishId = await contractService.createWish(nickname, content, fileIds);
            console.log('心愿上链成功，ID:', wishId);

            // 步骤3: 更新文件的心愿ID关联
            if (fileIds.length > 0) {
                console.log('正在更新文件关联...');
                await updateFilesSealId(fileIds, wishId);
                console.log('文件关联更新完成');
            }

            // 返回完整的心愿信息
            const result = {
                id: wishId,
                nickname,
                content,
                fileIds,
                creator: contractService.account,
                createdAt: Date.now(),
                likes: 0,
                donations: 0,
                type: 'wish',
                onChain: true
            };

            console.log('心愿创建完成:', result);
            return result;

        } catch (error) {
            console.error('创建心愿失败:', error);
            throw new Error(`创建心愿失败: ${error.message}`);
        }
    }

    /**
     * 获取用户的所有心愿
     */
    async getUserWishes(userAddress = null) {
        this.checkConnection();

        try {
            const wishes = await contractService.getUserSeals(userAddress);
            // 过滤出心愿类型的数据
            return wishes.filter(item => item.type === 'wish');
        } catch (error) {
            console.error('获取用户心愿失败:', error);
            throw new Error(`获取用户心愿失败: ${error.message}`);
        }
    }

    /**
     * 获取所有心愿
     */
    async getAllWishes() {
        this.checkConnection();

        try {
            const allData = await contractService.getAllMethodCalls();
            // 过滤出心愿类型的数据
            return allData.filter(item => item.type === 'wish');
        } catch (error) {
            console.error('获取所有心愿失败:', error);
            throw new Error(`获取所有心愿失败: ${error.message}`);
        }
    }

    /**
     * 根据ID获取心愿详情
     */
    async getWishById(wishId) {
        this.checkConnection();

        try {
            const wishData = await contractService.getSeal(wishId);
            if (wishData && wishData.type === 'wish') {
                return wishData;
            } else {
                throw new Error('心愿不存在或类型不匹配');
            }
        } catch (error) {
            console.error('获取心愿详情失败:', error);
            throw new Error(`获取心愿详情失败: ${error.message}`);
        }
    }

    /**
     * 断开钱包连接
     */
    disconnectWallet() {
        contractService.disconnectWallet();
        this.isConnected = false;
        console.log('钱包已断开连接');
    }

    /**
     * 获取当前连接的账户地址
     */
    getCurrentAccount() {
        return contractService.account;
    }

    /**
     * 检查是否已连接钱包
     */
    isWalletConnected() {
        return this.isConnected && contractService.account;
    }
}

// 创建单例实例
export const wishChainService = new WishChainService();

// 导出服务类
export default WishChainService;
