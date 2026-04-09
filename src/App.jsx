import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 讀取你剛才 cp 進來的 data.json
    fetch('/data.json')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(err => console.error("讀取資料失敗:", err));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333' }}>📈 DAT.co 監測儀表板</h1>
        <h3 style={{ color: '#666' }}>公司：MicroStrategy (MSTR) | 指標：Premium to NAV</h3>
        
        <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Premium (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Price ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              {/* 溢價率曲線 */}
              <Line yAxisId="left" type="monotone" dataKey="premium" stroke="#ff4d4f" name="溢價率 (%)" strokeWidth={3} dot={false} />
              {/* 股價曲線 */}
              <Line yAxisId="right" type="monotone" dataKey="mstr_price" stroke="#1890ff" name="MSTR 股價 ($)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', borderTop: '1px solid #eee' }}>
          <h4>💡 指標分析</h4>
          <p>當<strong>紅色線（溢價率）</strong>上升時，代表市場願意花比持有的比特幣更高的價格購買 MSTR 股票。</p>
          <p>目前的數據狀態：</p>
          <ul>
            <li>最新日期：{data[data.length - 1]?.date}</li>
            <li>目前股價：${data[data.length - 1]?.mstr_price}</li>
            <li>目前溢價：{data[data.length - 1]?.premium}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;