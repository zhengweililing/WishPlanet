import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Three.js 场景组件 - 显示星球和指示牌
function ThreeScene({ onSignClick }) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const planetRef = useRef(null);
    const signboardsRef = useRef([]);
    const animationIdRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2D1B69); // Monad 深紫色背景
        sceneRef.current = scene;

        // 创建相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 6);
        cameraRef.current = camera;

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 添加光源
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        pointLight.castShadow = true;
        scene.add(pointLight);

        const directionalLight = new THREE.DirectionalLight(0x6366f1, 0.5);
        directionalLight.position.set(-5, -5, -5);
        scene.add(directionalLight);

        // 创建二次元风格星球
        const planetGroup = new THREE.Group();

        // 主星球 - Monad 风格紫色
        const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({
            color: 0x6A4C93, // Monad 紫色
            transparent: false,
            opacity: 1.0,
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planetGroup.add(planet);

        // 星球表面装饰条纹 - Monad 风格
        const stripeGeometry = new THREE.SphereGeometry(2.01, 32, 16);
        const stripeMaterial = new THREE.MeshBasicMaterial({
            color: 0xB19CD9, // 浅紫色条纹
            transparent: true,
            opacity: 0.4,
            wireframe: true,
        });
        const stripes = new THREE.Mesh(stripeGeometry, stripeMaterial);
        planetGroup.add(stripes);

        scene.add(planetGroup);
        planetRef.current = planetGroup;

        // 创建二次元风格背景 - 彩色星星和爱心
        const backgroundElements = new THREE.Group();

        // Monad 风格星星
        const starShapes = [];
        for (let i = 0; i < 100; i++) {
            const starGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const colors = [0x9B59B6, 0xB19CD9, 0x6A4C93, 0x8E44AD, 0xDDA0DD]; // Monad 紫色系
            const starMaterial = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.8,
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);

            star.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );

            backgroundElements.add(star);
            starShapes.push(star);
        }

        // Monad 风格装饰元素
        for (let i = 0; i < 20; i++) {
            const heartGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const heartMaterial = new THREE.MeshBasicMaterial({
                color: 0xAB7FDE, // Monad 紫色调
                transparent: true,
                opacity: 0.6,
            });
            const heart = new THREE.Mesh(heartGeometry, heartMaterial);

            heart.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );

            backgroundElements.add(heart);
        }

        scene.add(backgroundElements);

        // 创建指示牌
        const signboards = [];
        const signPositions = [
            { x: 0, y: 1.5, z: 0 },     // 顶部
            { x: 1.5, y: 0, z: 0 },     // 右侧
            { x: -1.5, y: 0, z: 0 },    // 左侧
            { x: 0, y: 0, z: 1.5 },     // 前方
            { x: 0, y: -1.5, z: 0 }     // 底部
        ];

        signPositions.forEach((pos, index) => {
            const signGroup = new THREE.Group();

            // 计算从星球中心到位置的方向
            const direction = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();

            // 把手 - 从星球表面向外延伸
            const handleGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.4, 8);
            const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // 棕色把手
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);

            // 将把手定位到星球表面，并朝向外部
            const surfacePosition = direction.clone().multiplyScalar(2.0); // 星球半径是2
            handle.position.copy(direction.clone().multiplyScalar(2.2)); // 把手中心稍微外移
            handle.lookAt(direction.clone().multiplyScalar(3)); // 把手朝向外侧
            signGroup.add(handle);

            // 指示牌主体 - 适中尺寸
            const signGeometry = new THREE.PlaneGeometry(0.5, 0.35);
            const signMaterial = new THREE.MeshBasicMaterial({
                color: 0xF5F5F5, // 白色牌子
                transparent: true,
                opacity: 0.95,
                side: THREE.DoubleSide,
            });
            const sign = new THREE.Mesh(signGeometry, signMaterial);

            // 指示牌边框
            const borderGeometry = new THREE.PlaneGeometry(0.55, 0.4);
            const borderMaterial = new THREE.MeshBasicMaterial({
                color: 0x6A4C93, // Monad 紫色边框
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
            });
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.z = -0.001; // 稍微在背景后面

            // 将指示牌放在把手顶端，竖立着
            const signPosition = direction.clone().multiplyScalar(2.45);
            sign.position.copy(signPosition);
            border.position.copy(signPosition.clone().add(new THREE.Vector3(0, 0, -0.001)));

            // 简化指示牌方向 - 暂时让牌子面向相机，先确保点击检测工作
            sign.lookAt(new THREE.Vector3(0, 0, 0));
            border.lookAt(new THREE.Vector3(0, 0, 0));

            signGroup.add(border);
            signGroup.add(sign);

            // 添加小装饰星星 - 围绕竖立的指示牌
            for (let i = 0; i < 3; i++) {
                const starGeometry = new THREE.SphereGeometry(0.02, 8, 8);
                const starMaterial = new THREE.MeshBasicMaterial({
                    color: 0xB19CD9,
                    transparent: true,
                    opacity: 0.8,
                });
                const star = new THREE.Mesh(starGeometry, starMaterial);

                const angle = (i / 3) * Math.PI * 2;
                // 简单地围绕指示牌位置放置星星
                const starPos = signPosition.clone();
                starPos.add(new THREE.Vector3(
                    Math.cos(angle) * 0.4,
                    Math.sin(angle) * 0.3,
                    Math.sin(angle) * 0.2
                ));
                star.position.copy(starPos);

                signGroup.add(star);
            }

            // 存储用户数据
            signGroup.userData = {
                signId: `sign_${index}`,
                originalScale: 1,
                signMesh: sign,
                borderMesh: border,
                isHovered: false
            };

            console.log('创建指示牌:', `sign_${index}`, '位置:', signPosition); // 调试信息

            scene.add(signGroup);
            signboards.push(signGroup);
        });

        signboardsRef.current = signboards;

        // 鼠标交互功能
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredSign = null;

        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(signboards, true);

            // 重置之前的hover状态
            if (hoveredSign) {
                hoveredSign.scale.setScalar(hoveredSign.userData.originalScale);
                hoveredSign.userData.borderMesh.material.opacity = 0.8;
                hoveredSign.userData.isHovered = false;
                hoveredSign = null;
            }

            if (intersects.length > 0) {
                console.log('鼠标悬停检测到', intersects.length, '个对象'); // 调试信息

                // 找到包含相交对象的指示牌组
                let targetGroup = intersects[0].object;
                while (targetGroup.parent && targetGroup.parent.type !== 'Scene') {
                    targetGroup = targetGroup.parent;
                }

                if (targetGroup.userData.signId) {
                    console.log('悬停在指示牌:', targetGroup.userData.signId); // 调试信息
                    hoveredSign = targetGroup;
                    hoveredSign.scale.setScalar(1.2);
                    hoveredSign.userData.borderMesh.material.opacity = 1.0;
                    hoveredSign.userData.isHovered = true;
                    renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                renderer.domElement.style.cursor = 'grab';
            }
        };

        const onClick = (event) => {
            if (dragStarted) return; // 如果进行了拖拽，不触发点击

            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(signboards, true);

            console.log('点击检测:', intersects.length, '个对象'); // 调试信息

            if (intersects.length > 0) {
                // 找到包含相交对象的指示牌组
                let targetGroup = intersects[0].object;
                while (targetGroup.parent && targetGroup.parent.type !== 'Scene') {
                    targetGroup = targetGroup.parent;
                }

                console.log('找到指示牌:', targetGroup.userData.signId); // 调试信息

                if (targetGroup.userData.signId && onSignClick) {
                    console.log('调用回调函数:', targetGroup.userData.signId); // 调试信息
                    onSignClick(targetGroup.userData.signId);
                }
            }
        };

        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onClick);

        // 添加调试信息
        console.log('Three.js 场景初始化完成，共有', signboards.length, '个指示牌');
        console.log('事件监听器已添加到渲染器');



        // 完整的轨道控制（鼠标拖拽旋转）
        let isDragging = false;
        let dragStarted = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotationSpeed = 0.005;

        // 用于存储相机的球坐标
        let spherical = {
            radius: 6,
            phi: Math.PI / 2,     // 极角 (0 到 π)
            theta: 0              // 方位角 (0 到 2π)
        };

        const onMouseDown = (event) => {
            isDragging = true;
            dragStarted = false;
            previousMousePosition = { x: event.clientX, y: event.clientY };
            renderer.domElement.style.cursor = 'grabbing';
        };

        const onMouseUp = () => {
            isDragging = false;
            dragStarted = false;
            renderer.domElement.style.cursor = 'grab';
        };

        const onMouseDrag = (event) => {
            if (!isDragging) return;

            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            // 如果鼠标移动了一定距离，才认为是真正的拖拽
            if (Math.abs(deltaMove.x) > 3 || Math.abs(deltaMove.y) > 3) {
                dragStarted = true;
            }

            // 更新球坐标
            spherical.theta -= deltaMove.x * rotationSpeed;
            spherical.phi += deltaMove.y * rotationSpeed;

            // 限制极角范围，防止翻转
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            // 将球坐标转换为笛卡尔坐标
            camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
            camera.position.y = spherical.radius * Math.cos(spherical.phi);
            camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);

            // 让相机始终看向星球中心
            camera.lookAt(0, 0, 0);

            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onWheel = (event) => {
            event.preventDefault();
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            spherical.radius *= scale;

            // 限制缩放范围
            spherical.radius = Math.max(3, Math.min(15, spherical.radius));

            // 更新相机位置
            camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
            camera.position.y = spherical.radius * Math.cos(spherical.phi);
            camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);

            camera.lookAt(0, 0, 0);
        };

        // 触摸事件支持（移动端）
        const onTouchStart = (event) => {
            if (event.touches.length === 1) {
                isDragging = true;
                previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
        };

        const onTouchEnd = () => {
            isDragging = false;
        };

        const onTouchMove = (event) => {
            if (!isDragging || event.touches.length !== 1) return;

            event.preventDefault();

            const deltaMove = {
                x: event.touches[0].clientX - previousMousePosition.x,
                y: event.touches[0].clientY - previousMousePosition.y
            };

            spherical.theta -= deltaMove.x * rotationSpeed;
            spherical.phi += deltaMove.y * rotationSpeed;

            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
            camera.position.y = spherical.radius * Math.cos(spherical.phi);
            camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);

            camera.lookAt(0, 0, 0);

            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        };

        // 设置初始相机位置
        camera.position.set(0, 0, 6);
        camera.lookAt(0, 0, 0);

        // 初始化球坐标
        const initialPosition = camera.position;
        spherical.radius = initialPosition.length();
        spherical.phi = Math.acos(initialPosition.y / spherical.radius);
        spherical.theta = Math.atan2(initialPosition.z, initialPosition.x);

        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('mousemove', onMouseDrag);
        renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

        // 移动端触摸支持
        renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
        renderer.domElement.addEventListener('touchend', onTouchEnd);
        renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });

        // 二次元动画循环
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // 星球可爱的慢速摇摆动画
            if (planetRef.current) {
                planetRef.current.rotation.y += 0.001; // 减慢自转速度
                planetRef.current.rotation.x = Math.sin(time * 0.3) * 0.05; // 减慢摇摆
                planetRef.current.position.y = Math.sin(time * 0.5) * 0.05; // 减慢浮动
            }

            // 背景元素动画
            if (backgroundElements) {
                backgroundElements.rotation.y += 0.001;
                backgroundElements.children.forEach((element, index) => {
                    element.position.y += Math.sin(time * 2 + index) * 0.001;
                    element.rotation.z += 0.02;
                });
            }



            renderer.render(scene, camera);
        };

        animate();

        // 窗口大小调整
        const handleResize = () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // 清理函数
        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }


            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('click', onClick);
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            renderer.domElement.removeEventListener('mouseup', onMouseUp);
            renderer.domElement.removeEventListener('mousemove', onMouseDrag);
            renderer.domElement.removeEventListener('wheel', onWheel);
            renderer.domElement.removeEventListener('touchstart', onTouchStart);
            renderer.domElement.removeEventListener('touchend', onTouchEnd);
            renderer.domElement.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('resize', handleResize);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            renderer.dispose();
        };
    }, [onSignClick]);

    return <div ref={mountRef} className="w-full h-full" />;
}

export default ThreeScene;
