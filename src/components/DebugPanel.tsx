import React from 'react';
import { Collapse, Descriptions, Table, Badge, Typography, Tag } from 'antd';
import { BugOutlined, ApiOutlined } from '@ant-design/icons';
import type { ServerStatus } from '../types';

const { Panel } = Collapse;
const { Text } = Typography;

interface DebugPanelProps {
  coreStatus: ServerStatus | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ coreStatus }) => {
  if (!coreStatus?.debug) return null;

  const dnsColumns = [
    { title: 'Hostname', dataIndex: 'hostname', key: 'hostname', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Data', dataIndex: 'data', key: 'data', render: (text: string) => <Text code>{text}</Text> },
  ];

  return (
    <Collapse style={{ marginBottom: '24px', borderRadius: '12px', background: 'white' }}>
      <Panel header={<><BugOutlined /> <b>Debug info</b></>} key="1">
        <Descriptions bordered size="small" column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Cache time">{coreStatus.debug.cacheTime}</Descriptions.Item>
          <Descriptions.Item label="Hostname">{coreStatus.debug.hostname}</Descriptions.Item>
          <Descriptions.Item label="IP address"><Text copyable>{coreStatus.debug.ipAddress}</Text></Descriptions.Item>
          <Descriptions.Item label="Port">{coreStatus.debug.port}</Descriptions.Item>
          <Descriptions.Item label="Protocol version">{coreStatus.debug.protocolVersion}</Descriptions.Item>
          <Descriptions.Item label="Blocked by Mojang">
            {coreStatus.debug.blockedByMojang ? <Badge status="error" text="Yes" /> : <Badge status="success" text="No" />}
          </Descriptions.Item>
          <Descriptions.Item label="SRV record" span={2}>
            {coreStatus.debug.srvRecord.includes('CNAME') ? (
              <Text type="warning">{coreStatus.debug.srvRecord}</Text>
            ) : (
              <Text type="success">{coreStatus.debug.srvRecord}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ping">{coreStatus.debug.pingSuccess ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Query">
            {coreStatus.debug.querySuccess ? 'Yes' : `No - ${coreStatus.debug.queryError || 'Timeout'}`}
          </Descriptions.Item>
        </Descriptions>
      </Panel>
      
      {coreStatus.dnsRecords && coreStatus.dnsRecords.length > 0 && (
        <Panel header={<><ApiOutlined /> <b>List of DNS records</b></>} key="2">
          <Table 
            dataSource={coreStatus.dnsRecords} 
            columns={dnsColumns} 
            pagination={false} 
            rowKey={(record) => record.hostname + record.type}
            size="small"
          />
        </Panel>
      )}
    </Collapse>
  );
};

export default DebugPanel;