import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [aiSummary, setAiSummary] = useState('AI 顧問正在分析數據中...');

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(json => {
        setData(json.series_data);
        setAiSummary(json.ai_summary);
      })
      .catch(err => console.error("讀取資料失敗:", err));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#333' }}> Robo_Advisor 監測儀表板</h1>
        <h3 style={{ color: '#666' }}>公司：MicroStrategy (MSTR) | 關聯資產：Bitcoin (BTC) | 核心指標：Premium to NAV</h3>
        
        {/* 1. 圖表區域 (整合三條線與雙 Y 軸) */}
        <div style={{ width: '100%', height: 450, marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}} 
                minTickGap={20}
              />
              
              {/* 左側座標軸：專門顯示百分比 (%)，給溢價率用 */}
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Premium (%)', angle: -90, position: 'insideLeft', offset: -10 }} 
              />
              
              {/* 右側座標軸：專門顯示美金 ($)，給 MSTR 和 BTC 用 */}
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Price ($)', angle: 90, position: 'insideRight', offset: -10 }} 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              
              <Tooltip formatter={(value, name) => [name.includes('率') ? `${value}%` : `$${value.toLocaleString()}`, name]} />
              <Legend verticalAlign="top" height={36}/>

              {/* 比特幣價格線 (橘黃色，對應右軸 Price) */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="btc_price" 
                stroke="#f2a900" 
                name="BTC 價格 ($)" 
                strokeWidth={2} 
                dot={false} 
              />

              {/* MSTR 股價線 (藍色，對應右軸 Price) */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="mstr_price" 
                stroke="#1890ff" 
                name="MSTR 股價 ($)" 
                strokeWidth={2} 
                dot={false} 
              />

              {/* 溢價率線 (紅色，對應左軸 Premium) */}
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="premium" 
                stroke="#ff4d4f" 
                name="溢價率 (%)" 
                strokeWidth={3} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 2. AI 投資助手分析區塊 */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#e6f7ff', 
          borderRadius: '12px', 
          borderLeft: '6px solid #1890ff', 
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0050b3' }}>
             AI 顧問深度分析 (Gemini 3 Flash-Preview)
          </h3>
          <p style={{ 
            color: '#333', 
            lineHeight: '1.8', 
            fontSize: '1.05rem',
            whiteSpace: 'pre-wrap' 
          }}>
            {aiSummary}
          </p>
        </div>

        {/* 3. 數據統計資訊 */}
        <div style={{ marginTop: '30px', padding: '15px', borderTop: '1px solid #eee' }}>
          <h4> 指標與即時數據</h4>
          <p>觀察重點：當<strong>紅色線（溢價率）</strong>上升時，代表傳統金融市場正以高於比特幣現貨的溢價搶進 MSTR 股票，常視為看多情緒的先行指標。</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            <div style={{ padding: '10px 15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #888' }}>
              <strong>最新日期：</strong> {data[data.length - 1]?.date || '載入中...'}
            </div>
            <div style={{ padding: '10px 15px', backgroundColor: '#fffbe6', borderRadius: '8px', borderLeft: '4px solid #f2a900' }}>
              <strong>BTC 價格：</strong> ${data[data.length - 1]?.btc_price?.toLocaleString() || '---'}
            </div>
            <div style={{ padding: '10px 15px', backgroundColor: '#e6f7ff', borderRadius: '8px', borderLeft: '4px solid #1890ff' }}>
              <strong>MSTR 股價：</strong> ${data[data.length - 1]?.mstr_price?.toLocaleString() || '---'}
            </div>
            <div style={{ padding: '10px 15px', backgroundColor: '#fff1f0', borderRadius: '8px', borderLeft: '4px solid #ff4d4f' }}>
              <strong>溢價率：</strong> {data[data.length - 1]?.premium}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;