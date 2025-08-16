// 合约交互核心服务
import { ethers } from "ethers";

// Monad 测试网配置
export const MONAD_CHAIN_CONFIG = {
    chainId: "0x279F", // 10143 in hex
    chainName: "Monad Testnet",
    nativeCurrency: {
        name: "MON",
        symbol: "MON",
        decimals: 18,
    },
    rpcUrls: ["https://testnet-rpc.monad.xyz"],
    blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
};

// 智能合约配置
export const CONTRACT_ADDRESS = "0x37800c9ba3068304039F241967f99176584F1485";

// 合约ABI
export const CONTRACT_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "DataStored",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "caller",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "methodName",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "callIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "MethodCallRecorded",
        type: "event",
    },
    {
        inputs: [],
        name: "callCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "methodCalls",
        outputs: [
            {
                internalType: "address",
                name: "caller",
                type: "address",
            },
            {
                internalType: "string",
                name: "methodName",
                type: "string",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
            },
        ],
        name: "storeData",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_index",
                type: "uint256",
            },
        ],
        name: "getMethodCall",
        outputs: [
            {
                internalType: "address",
                name: "caller",
                type: "address",
            },
            {
                internalType: "string",
                name: "methodName",
                type: "string",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [],
        name: "getAllMethodCalls",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "caller",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "methodName",
                        type: "string",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                ],
                internalType: "struct DataToZeroAddress.MethodCall[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
];

/**
 * 合约交互服务类
 */
export class ContractService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.account = null;
    }

    /**
     * 连接钱包
     */
    async connectWallet() {
        if (!window.ethereum) {
            throw new Error("请安装 MetaMask 钱包");
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            // Create provider and signer
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();

            // Check if we're on the correct chain
            await this.switchToMonadTestnet();

            // Create contract instance
            this.contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                this.signer
            );

            this.account = accounts[0];

            return {
                provider: this.provider,
                signer: this.signer,
                contract: this.contract,
                account: this.account,
            };
        } catch (error) {
            console.error("连接钱包失败:", error);
            throw new Error(`连接钱包失败: ${error.message}`);
        }
    }

    /**
     * 切换到Monad测试网
     */
    async switchToMonadTestnet() {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: MONAD_CHAIN_CONFIG.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [MONAD_CHAIN_CONFIG],
                    });
                } catch (addError) {
                    throw new Error("添加 Monad 测试网失败");
                }
            } else {
                throw switchError;
            }
        }
    }

    /**
     * 断开钱包连接
     */
    disconnectWallet() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.account = null;
    }

    /**
     * 创建心愿上链
     */
    async createWish(nickname, wishContent, fileIds = []) {
        if (!this.contract) {
            throw new Error("请先连接钱包");
        }

        try {
            // 创建心愿数据对象
            const wishData = {
                type: 'wish',
                nickname,
                content: wishContent,
                fileIds, // 存储在IndexedDB中的文件ID数组
                creator: this.account,
                createdAt: Date.now(),
                likes: 0,
                donations: 0
            };

            // 将数据编码为bytes
            const jsonString = JSON.stringify(wishData);
            const encodedData = ethers.toUtf8Bytes(jsonString);

            console.log('正在上链心愿:', encodedData);
            const tx = await this.contract.storeData(encodedData);
            console.log('交易发送成功，等待确认:', tx.hash);

            const receipt = await tx.wait();
            console.log('心愿上链成功:', receipt.hash);

            // 返回交易哈希作为心愿ID
            return receipt.hash;
        } catch (error) {
            console.error("心愿上链失败:", error);
            throw new Error(`心愿上链失败: ${error.message}`);
        }
    }

    /**
     * 创建封印
     */
    async createSeal(content, unlockTime, mediaIds = "") {
        if (!this.contract) {
            throw new Error("请先连接钱包");
        }

        try {
            // 创建封印数据对象
            const sealData = {
                content,
                unlockTime,
                mediaIds,
                creator: this.account,
                createdAt: Date.now(),
            };

            // 将数据编码为bytes
            const jsonString = JSON.stringify(sealData);
            const encodedData = ethers.toUtf8Bytes(jsonString);

            const tx = await this.contract.storeData(encodedData);
            const receipt = await tx.wait();

            // 返回交易哈希作为封印ID
            return receipt.hash;
        } catch (error) {
            console.error("创建封印失败:", error);
            throw new Error(`创建封印失败: ${error.message}`);
        }
    }

    /**
     * 解码封印数据
     */
    decodeSealData(encodedData) {
        try {
            // 如果数据是hex格式，先转换为字符串
            let decodedString = encodedData;
            if (encodedData.startsWith("0x")) {
                decodedString = ethers.toUtf8String(encodedData);
            }

            const sealData = JSON.parse(decodedString);

            // 计算是否已解锁
            const isUnlocked = sealData.unlockTime * 1000 <= Date.now();

            return {
                ...sealData,
                isUnlocked,
                parsedContent:
                    typeof sealData.content === "string"
                        ? JSON.parse(sealData.content)
                        : sealData.content,
            };
        } catch (error) {
            console.error("解码封印数据失败:", error);
            return null;
        }
    }

    /**
     * 获取封印数据
     */
    async getSeal(id) {
        try {
            // 检查是否是method_call格式的ID
            if (id.startsWith("method_call_")) {
                const index = parseInt(id.replace("method_call_", ""));
                if (isNaN(index)) {
                    throw new Error("无效的封印ID格式");
                }

                // 通过索引获取方法调用记录
                const methodCall = await this.getMethodCall(index);
                if (!methodCall) {
                    throw new Error("未找到对应的封印记录");
                }

                return {
                    ...methodCall,
                    id: id, // 保持原始ID
                };
            } else {
                // 原来的逻辑：处理交易哈希
                const receipt = await this.provider.getTransactionReceipt(id);
                if (!receipt) {
                    throw new Error("未找到对应的交易");
                }

                // 解析事件日志
                const iface = new ethers.Interface(CONTRACT_ABI);
                const dataStoredEvent = receipt.logs.find((log) => {
                    try {
                        const parsed = iface.parseLog(log);
                        return parsed.name === "DataStored";
                    } catch {
                        return false;
                    }
                });

                if (!dataStoredEvent) {
                    throw new Error("未找到封印数据事件");
                }

                const parsed = iface.parseLog(dataStoredEvent);
                const decodedSeal = this.decodeSealData(parsed.args.data);

                if (!decodedSeal) {
                    throw new Error("解码封印数据失败");
                }

                return {
                    ...decodedSeal,
                    id: id,
                    txHash: id,
                    blockNumber: receipt.blockNumber,
                    timestamp: parsed.args.timestamp,
                };
            }
        } catch (error) {
            console.error("获取封印数据失败:", error);
            throw new Error(`获取封印数据失败: ${error.message}`);
        }
    }

    /**
     * 获取用户封印列表
     */
    async getUserSeals(userAddress = this.account) {
        if (!userAddress || !this.contract || !this.provider) {
            console.warn("用户地址或合约不存在");
            return [];
        }

        try {
            // 使用新的读取方法获取所有方法调用记录
            const allMethodCalls = await this.contract.getAllMethodCalls();

            // 过滤出当前用户的封印数据
            const userSeals = allMethodCalls
                .filter(call => call.caller.toLowerCase() === userAddress.toLowerCase())
                .map((call, index) => {
                    try {
                        const decodedSeal = this.decodeSealData(call.data);
                        if (decodedSeal) {
                            return {
                                id: `method_call_${index}`,
                                methodCallIndex: index,
                                ...decodedSeal,
                                caller: call.caller,
                                methodName: call.methodName,
                                timestamp: call.timestamp,
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error("解码单个封印失败:", error);
                        return null;
                    }
                })
                .filter(seal => seal !== null);

            // 按时间戳排序（最新的在前）
            userSeals.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

            return userSeals;
        } catch (error) {
            console.error("获取用户封印失败:", error);
            return [];
        }
    }

    /**
     * 获取调用总数
     */
    async getCallCount() {
        if (!this.contract) {
            console.warn("合约不存在");
            return 0;
        }

        try {
            const count = await this.contract.callCount();
            return Number(count);
        } catch (error) {
            console.error("获取调用总数失败:", error);
            return 0;
        }
    }

    /**
     * 根据索引获取单个方法调用记录
     */
    async getMethodCall(index) {
        if (!this.contract) {
            console.warn("合约不存在");
            return null;
        }

        try {
            const methodCall = await this.contract.getMethodCall(index);
            const decodedSeal = this.decodeSealData(methodCall.data);

            if (decodedSeal) {
                return {
                    ...decodedSeal,
                    caller: methodCall.caller,
                    methodName: methodCall.methodName,
                    timestamp: methodCall.timestamp,
                    index,
                };
            }
            return null;
        } catch (error) {
            console.error("获取方法调用记录失败:", error);
            return null;
        }
    }

    /**
     * 获取所有方法调用记录
     */
    async getAllMethodCalls() {
        if (!this.contract) {
            console.warn("合约不存在");
            return [];
        }

        try {
            const allCalls = await this.contract.getAllMethodCalls();

            return allCalls.map((call, index) => {
                try {
                    const decodedSeal = this.decodeSealData(call.data);
                    if (decodedSeal) {
                        return {
                            ...decodedSeal,
                            caller: call.caller,
                            methodName: call.methodName,
                            timestamp: call.timestamp,
                            index,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("解码方法调用记录失败:", error);
                    return null;
                }
            }).filter(call => call !== null);
        } catch (error) {
            console.error("获取所有方法调用记录失败:", error);
            return [];
        }
    }
}

// 创建单例实例
export const contractService = new ContractService();
