
import axios from 'axios';
import { useState } from "react";
import styles from './index.module.scss';

interface AudioInfo {
    id: string;
    status: string;
    audio_url: string;
    image_url: string;
    title: string;
}

export const InputPannel = () => {
    const [songId, setSongId] = useState('')
    // 获取信息状态
    const [loading, setLoading] = useState<boolean>(false);
    const [audioInfo, setAudioInfo] = useState<AudioInfo | null>(null);

    // 点击生成
    const baseUrl = "http://localhost:3000";
    // 获取当前音频的信息（含下载链接）
    async function getAudioInformation(audioIds: string) {
        setLoading(true);
        const url = `${baseUrl}/api/get?ids=${audioIds}`;
        const response = await axios.get(url)
            .catch(error => {
                console.error('API请求失败:', error);
                if (error.response) {
                    alert(`错误: ${error.response.status} ${error.response.data.message}`);
                } else if (error.request) {
                    alert('服务器响应超时，请检查您的网络连接或稍后再试。');
                } else {
                    alert('请求失败，请检查您的请求配置或稍后再试。');
                }
                return null;  // 返回 null 以避免后续代码执行
            });

        if (response && response.data) {  // 确保 response 和 response.data 都有效
            setAudioInfo(response.data[0]);
        }
        setLoading(false);
    }
    // 下载功能函数
    function downloadAudio() {
        if (audioInfo) {
            const audioUrl = audioInfo.audio_url;
            // 使用 fetch API 下载文件
            fetch(audioUrl)
                .then(response => response.blob()) // 转换为 blob
                .then(blob => {
                    // 创建一个指向该 Blob 的 URL
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = "下载的音频.mp3"; // 指定下载文件名
                    document.body.appendChild(a);
                    a.click();

                    // 清理
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(e => console.error('下载失败:', e));
        }
    }

    const handleGenerateAudio = async () => {
        getAudioInformation(songId);
    };


    return (
        <div className={styles.inputWindow}>
            <div className={styles.inputWindowContainer}>
                <button onClick={() => downloadAudio()}>download</button>
                <textarea
                    value={songId}
                    onChange={e => setSongId(e.target.value)}
                    placeholder="input the songId..."
                    className={styles.inputPrompt}
                />
                <div className={styles.inputBlock}>
                    <div className={styles.inputWindowTitle}><div>歌曲描述</div></div>
                    {audioInfo?.id && (
                        <div style={{ color: 'black' }}>
                            <h2>音频信息</h2>
                            <p>ID: {audioInfo.id}</p>
                            <p>状态: {audioInfo.status}</p>
                            <p>URL: {audioInfo.audio_url ? <a href={audioInfo.audio_url} target="_blank">点击播放</a> : '音频正在处理中'}</p>
                        </div>
                    )}
                </div>
                <div className={styles.createButton} onClick={handleGenerateAudio}>
                    {loading ? 'Geting...' : 'ToGet'}
                </div>
            </div>
        </div>
    );
}