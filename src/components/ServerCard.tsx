import React from 'react';
import { Card, Row, Col, Avatar, Typography, Statistic, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { ServerStatus, MCExtraText } from '../types';

const { Title, Text } = Typography;

const mcColors: Record<string, string> = {
  black: '#000000', dark_blue: '#0000AA', dark_green: '#00AA00', dark_aqua: '#00AAAA',
  dark_red: '#AA0000', dark_purple: '#AA00AA', gold: '#FFAA00', gray: '#AAAAAA',
  dark_gray: '#555555', blue: '#5555FF', green: '#55FF55', aqua: '#55FFFF',
  red: '#FF5555', light_purple: '#FF55FF', yellow: '#FFFF55', white: '#FFFFFF',
};

interface ServerCardProps {
  target: string;
  coreStatus: ServerStatus | null;
}

const ServerCard: React.FC<ServerCardProps> = ({ target, coreStatus }) => {
  if (!coreStatus) return null;

  const renderMOTD = (description?: ServerStatus['description']) => {
    if (!description) return <Text type="secondary">无简介</Text>;
    if (typeof description === 'string') return <span>{description}</span>;

    const elements: React.ReactNode[] = [];
    const renderSpan = (item: MCExtraText, key: number | string) => {
      const style: React.CSSProperties = {
        color: item.color ? mcColors[item.color] || item.color : '#AAAAAA',
        fontWeight: item.bold ? 'bold' : 'normal',
        fontStyle: item.italic ? 'italic' : 'normal',
        textDecoration: [item.underlined ? 'underline' : '', item.strikethrough ? 'line-through' : ''].join(' ').trim() || 'none',
      };
      return <span key={key} style={style} className={item.obfuscated ? 'mc-obfuscated' : ''}>{item.text}</span>;
    };

    if (description.text) elements.push(renderSpan({ text: description.text }, 'root'));
    if (description.extra && Array.isArray(description.extra)) {
      description.extra.forEach((item, index) => elements.push(renderSpan(item, index)));
    }

    return (
      <div style={{
        backgroundColor: '#000000', padding: '12px 16px', borderRadius: '6px',
        fontFamily: '"Minecraft", "Courier New", Courier, monospace', whiteSpace: 'pre-wrap',
        wordBreak: 'break-all', lineHeight: '1.5', marginTop: '10px', border: '2px solid #222'
      }}>
        {elements}
      </div>
    );
  };

  return (
    <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Row align="top" gutter={24}>
        <Col xs={24} md={16}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            {coreStatus.favicon ? (
              <Avatar shape="square" size={64} src={coreStatus.favicon} style={{ marginRight: '16px', border: '1px solid #d9d9d9' }} />
            ) : (
              <Avatar shape="square" size={64} style={{ marginRight: '16px', backgroundColor: '#bfbfbf' }}>MC</Avatar>
            )}
            <Title level={3} style={{ margin: 0 }}>{target}</Title>
          </div>
          {renderMOTD(coreStatus.description)}
        </Col>
        
        <Col xs={24} md={8} style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '16px' }}>
          <Statistic 
            title="在线玩家" 
            value={coreStatus.players?.online || 0} 
            suffix={`/ ${coreStatus.players?.max || 0}`} 
            prefix={<UserOutlined />} 
            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} 
          />
          <div style={{ marginTop: '16px' }}>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
              版本: {coreStatus.version?.name || '未知'}
            </Tag>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ServerCard;