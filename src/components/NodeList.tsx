import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { GlobalOutlined, FieldTimeOutlined } from '@ant-design/icons';
import type { NodeResult } from '../types';

const { Title, Text } = Typography;

interface NodeListProps {
  results: NodeResult[];
}

const NodeList: React.FC<NodeListProps> = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <>
      <Title level={5} style={{ marginBottom: '16px' }}>
        <GlobalOutlined /> 各节点连通性
      </Title>
      <Row gutter={[16, 16]}>
        {results.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card 
              hoverable 
              bodyStyle={{ padding: '20px' }} 
              style={{ 
                borderRadius: '12px', 
                borderTop: `4px solid ${item.success ? (item.delay_ms < 150 ? '#52c41a' : '#faad14') : '#f5222d'}` 
              }}
            >
              <Statistic 
                title={<span style={{ fontSize: '16px', fontWeight: '500' }}>{item.node}</span>} 
                value={item.success ? item.delay_ms : '超时/失败'} 
                suffix={item.success ? "ms" : ""} 
                valueStyle={{ 
                  color: item.success ? (item.delay_ms < 150 ? '#3f8600' : '#cf1322') : '#999', 
                  fontWeight: 'bold' 
                }} 
                prefix={<FieldTimeOutlined />} 
              />
              {!item.success && item.error && (
                <Text type="danger" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  {item.error}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NodeList;