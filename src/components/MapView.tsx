import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PingResponse, ServerStatus } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const targetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// 自动缩放并居中所有点位
const MapFitBounds: React.FC<{ target?: [number, number]; nodes: ([number, number] | undefined)[] }> = ({ target, nodes }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([]);
    if (target) bounds.extend(target);
    nodes.forEach(geo => {
      if (geo) bounds.extend(geo);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 5,
        animate: true,
      });
    }
  }, [map, target, nodes]);

  return null;
};

interface MapViewProps {
  data: PingResponse;
  coreStatus: ServerStatus | null;
}

const MapView: React.FC<MapViewProps> = ({ data, coreStatus }) => {
  const targetGeo = coreStatus?.debug?.geo;

  const allNodeGeos = data.results
  .map(item => item.geo)
  .filter((geo): geo is [number, number] => !!geo);

  const getDynamicCenter = (): [number, number] => {
    if (targetGeo) return targetGeo;
    if (allNodeGeos.length > 0) {
      const avgLat = allNodeGeos.reduce((sum, geo) => sum + geo[0], 0) / allNodeGeos.length;
      const avgLng = allNodeGeos.reduce((sum, geo) => sum + geo[1], 0) / allNodeGeos.length;
      return [avgLat, avgLng];
    }
    return [20, 0]; 
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e8e8e8', position: 'relative' }}>
      <MapContainer 
        center={getDynamicCenter()} 
        zoom={allNodeGeos.length > 0 ? 4 : 3}
        minZoom={3} //最小缩放级别为 3
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <MapFitBounds target={targetGeo} nodes={allNodeGeos} />
        {/* 改色用 */}
        <style>{`
          .dark-tiles {
            filter: invert(100%) hue-rotate(180deg) brightness(90%) contrast(90%) grayscale(20%);
          }
        `}</style>

        <TileLayer
          className="dark-tiles"
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
          attribution='&copy; <a href="https://ditu.amap.com/">高德地图</a>'
        />

        {targetGeo && (
          <Marker position={targetGeo} icon={targetIcon}>
            <Tooltip direction="top" offset={[0, -35]} opacity={1}>
              <div style={{ textAlign: 'center' }}>
                <b style={{ color: '#cf1322' }}>🎯 目标机房: {data.target}</b><br/>
                IP: <span style={{ fontFamily: 'monospace' }}>{coreStatus?.debug?.ipAddress}</span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {data.results.map((item, idx) => {
          if (!item.geo) return null;

          const lineColor = item.success ? (item.delay_ms < 150 ? '#52c41a' : item.delay_ms < 250 ? '#faad14' : '#f5222d') : '#555555';
          const statusText = item.success ? `${item.delay_ms} ms` : '超时/失败';

          return (
            <React.Fragment key={idx}>
              <Marker position={item.geo}>
                <Tooltip direction="top" offset={[0, -35]} opacity={0.9}>
                  <div style={{ textAlign: 'center' }}>
                    <b>{item.node}</b><br/>
                    状态: <span style={{ color: lineColor, fontWeight: 'bold' }}>{statusText}</span>
                  </div>
                </Tooltip>
              </Marker>

              {targetGeo && (
                <>
                {/* 隐线 */}
                  <Polyline 
                    positions={[item.geo, targetGeo]} 
                    pathOptions={{ color: 'transparent', weight: 20 }} 
                  >
                    <Tooltip sticky opacity={0.9}>
                      <b>路由链路:</b> {item.node} ➔ {data.target}<br/>
                      <b>延迟:</b> <span style={{ color: lineColor, fontWeight: 'bold' }}>{statusText}</span>
                    </Tooltip>
                  </Polyline>

                  <Polyline 
                    positions={[item.geo, targetGeo]} 
                    pathOptions={{ color: lineColor, weight: 3, dashArray: '8, 8', opacity: 0.8 }} 
                    interactive={false} 
                  />
                </>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;