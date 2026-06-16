import React, { useState } from 'react';
import { Layout, Input, Card, Typography, Spin, message, Radio } from 'antd';
import axios from 'axios';

import type { PingResponse, ServerStatus } from './types';

import MapView from './components/MapView';
import ServerCard from './components/ServerCard';
import DebugPanel from './components/DebugPanel';
import NodeList from './components/NodeList';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Search } = Input;

const App: React.FC = () => {
  const [edition, setEdition] = useState('java');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PingResponse | null>(null);

  const onSearch = async (value: string) => {
  if (!value) return;
  setLoading(true);
  setData(null);
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.get<PingResponse>(`${apiBaseUrl}/api/ping?ip=${value}&edition=${edition}`);
    setData(res.data);
    message.success(`解析完成 (${edition === 'java' ? 'Java版' : '基岩版'})`);
  } catch (error) {
    message.error('请求失败');
  } finally {
    setLoading(false);
  }
};

  // 提取成功的核心状态 从任一成功的节点提取
  const getCoreStatus = (): ServerStatus | null => {
    if (!data) return null;
    const successNode = data.results.find(r => r.success && r.status);
    return successNode && successNode.status ? successNode.status : null;
  };

  const coreStatus = getCoreStatus();

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#1890ff', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>请输入文本</Title>
      </Header>

      <Content style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
  <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>
    检测 Minecraft 服务器连通性
  </Title>
  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
    <Radio.Group 
      value={edition} 
      onChange={(e) => setEdition(e.target.value)} 
      buttonStyle="solid"
    >
      <Radio.Button value="java">Java 版</Radio.Button>
      <Radio.Button value="bedrock">基岩版</Radio.Button>
    </Radio.Group>
  </div>
  <Search 
    placeholder={`输入服务器 IP (例如: ${edition === 'java' ? 'mc.hypixel.net' : 'play.inpvp.net'})`} 
    allowClear 
    enterButton="一键测速" 
    size="large" 
    onSearch={onSearch} 
  />
</Card>

        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" description="查询中..." />
          </div>
        )}

        {data && !loading && (
          <>
            {/* 地图组件 */}
            <MapView data={data} coreStatus={coreStatus} />
            
            {/* 服务器核心信息卡片 */}
            <ServerCard target={data.target} coreStatus={coreStatus} />

            {/* Debug与DNS面板 */}
            <DebugPanel coreStatus={coreStatus} />

            {/* 各地区节点连通性卡片列表 */}
            <NodeList results={data.results} />
          </>
        )}
      </Content>
      
      <Footer style={{ textAlign: 'center', color: '#888' }}>
        ©2026
      </Footer>
    </Layout>
  );
};

export default App;