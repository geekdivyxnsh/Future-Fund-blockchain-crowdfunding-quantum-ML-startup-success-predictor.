import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import RadialGauge from './RadialGauge';

const PredictionPanel = ({ startup, onClose, onInvest, isAdmin }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const profitChartRef = useRef(null);
  const profitChartInstance = useRef(null);
  const candleCanvasRef = useRef(null);

  const [prediction, setPrediction] = useState(startup.prediction || {});
  const [investment, setInvestment] = useState(5); // ETH
  const [loading, setLoading] = useState(false);

  // Fetch latest prediction from backend if available
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/startups/${startup.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.prediction) {
            setPrediction(data.prediction);
          }
        }
      } catch (e) {
        // Silently ignore; fallback to provided prediction
        console.warn('Prediction fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [startup.id]);
  
  const score = prediction?.score ?? prediction?.prediction ?? 0;
  const confidence = prediction?.confidence ?? 0;
  const breakdown = prediction?.breakdown ?? {};
  const predictionFactors = [
    { name: 'Team', value: breakdown.team ?? 0.25, color: '#10b981' },
    { name: 'Traction', value: breakdown.traction ?? 0.20, color: '#3b82f6' },
    { name: 'Market', value: breakdown.market ?? 0.12, color: '#f97316' },
    { name: 'Innovation', value: breakdown.innovation ?? 0.18, color: '#8c6dfd' },
    { name: 'Financials', value: breakdown.financials ?? 0.15, color: '#ec4899' },
    { name: 'Execution', value: breakdown.execution ?? 0.10, color: '#eab308' },
  ];
  
  useEffect(() => {
    // Success vs risk doughnut
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext('2d');
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue('--accent').trim() || '#00e5ff';
      const faint = 'rgba(255,255,255,0.12)';
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Success', 'Risk'],
          datasets: [{
            data: [score, 100 - score],
            backgroundColor: [accent, faint],
            borderWidth: 0,
            cutout: '70%'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }

    // Profit projection chart
    if (profitChartRef.current) {
      if (profitChartInstance.current) profitChartInstance.current.destroy();
      const ctx2 = profitChartRef.current.getContext('2d');
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--primary').trim() || '#cdeaff';
      const accent = styles.getPropertyValue('--accent').trim() || '#00e5ff';
      const muted = styles.getPropertyValue('--muted').trim() || '#9fbcc8';
      const grid = 'rgba(255,255,255,0.12)';
      const months = Array.from({ length: 13 }, (_, i) => i); // 0..12
      const prob = score / 100;
      const roiLow = 0.2; // 20% annual
      const roiAvg = 0.5; // 50% annual
      const roiHigh = 1.0; // 100% annual
      const series = (roi) => months.map(m => +(investment * roi * (m / 12) * prob).toFixed(2));
      profitChartInstance.current = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: months.map(m => `${m}m`),
          datasets: [
            { label: 'Low', data: series(roiLow), borderColor: '#2563eb', backgroundColor: 'transparent', tension: 0.3 },
            { label: 'Average', data: series(roiAvg), borderColor: '#16a34a', backgroundColor: 'transparent', tension: 0.3 },
            { label: 'High', data: series(roiHigh), borderColor: '#dc2626', backgroundColor: 'transparent', tension: 0.3 }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: muted } } },
          scales: {
            y: { title: { display: true, text: 'Projected Profit (ETH)', color: muted }, grid: { color: grid }, ticks: { color: muted } },
            x: { grid: { display: false }, ticks: { color: muted } }
          }
        }
      });
    }

    // Candlestick chart (simulated) without new dependencies
    if (candleCanvasRef.current) {
      const canvas = candleCanvasRef.current;
      const ctx = canvas.getContext('2d');
      // Match canvas width to rendered width for crisp drawing
      const cssWidth = canvas.clientWidth || 600;
      canvas.width = cssWidth;
      const width = canvas.width;
      const height = canvas.height || 160;
      ctx.clearRect(0, 0, width, height);

      const months = Array.from({ length: 13 }, (_, i) => i); // 0..12
      const prob = score / 100;
      const roiAvg = 0.5; // 50% annual baseline
      const closes = months.map(m => investment * roiAvg * (m / 12) * prob);
      const volatility = 0.1 + (100 - (prediction?.confidence ?? 0)) / 100 * 0.2; // more vol with lower confidence

      const candles = [];
      let prevClose = closes[0] || investment * 0.02;
      for (let i = 0; i < closes.length; i++) {
        const target = closes[i];
        const open = prevClose;
        const noise = (Math.random() - 0.5) * volatility * Math.max(target, open);
        const close = Math.max(0, target + noise * 0.3);
        const high = Math.max(open, close) + Math.abs(noise);
        const low = Math.max(0, Math.min(open, close) - Math.abs(noise));
        candles.push({ open, high, low, close });
        prevClose = close;
      }

      const minV = Math.min(...candles.map(c => c.low));
      const maxV = Math.max(...candles.map(c => c.high));
      const pad = (maxV - minV) * 0.05;
      const yMin = Math.max(0, minV - pad);
      const yMax = maxV + pad;
      const scaleY = (v) => height - ((v - yMin) / (yMax - yMin)) * height;

      const n = candles.length;
      const gap = 8;
      const barW = Math.max(4, Math.floor((width - gap * (n + 1)) / n));
      let x = gap;
      for (let i = 0; i < n; i++) {
        const c = candles[i];
        const yOpen = scaleY(c.open);
        const yClose = scaleY(c.close);
        const yHigh = scaleY(c.high);
        const yLow = scaleY(c.low);

        // Wick
        ctx.strokeStyle = '#475569'; // slate-600
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + barW / 2, yHigh);
        ctx.lineTo(x + barW / 2, yLow);
        ctx.stroke();

        // Body
        const up = c.close >= c.open;
        ctx.fillStyle = up ? '#16a34a' : '#dc2626'; // green for up, red for down
        const bodyTop = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillRect(x, bodyTop, barW, bodyH);

        x += barW + gap;
      }
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
      if (profitChartInstance.current) profitChartInstance.current.destroy();
    };
  }, [score, investment]);

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg card text-left align-bottom shadow-dropdown transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-primary mb-4 flex justify-between">
                  <span>Prediction for {startup.title}</span>
                  <span className="text-sm text-muted">Model {prediction.modelVersion ?? prediction.version ?? 'QML'}</span>
                </h3>
                
                <div className="mt-4 card p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                      <div className="relative w-48 h-48">
                        <canvas ref={chartRef} width="200" height="200"></canvas>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-bold text-primary">{score}%</span>
                          <span className="text-sm text-muted">Success</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center">
                        <RadialGauge value={confidence} label="Signal" />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                      <h4 className="text-primary text-sm mb-3">Prediction Breakdown</h4>
                      {predictionFactors.map((factor) => (
                        <div key={factor.name} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-primary">{factor.name}</span>
                            <span className="text-muted">{factor.value.toFixed(2)}</span>
                          </div>
                          <div className="w-full h-[5px] rounded-[10px]" style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <div 
                              className="h-full rounded-[10px]" 
                              style={{ width: `${factor.value * 100}%`, backgroundColor: factor.color }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profit Projection */}
                <div className="mt-4 card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-primary text-sm">Projected Profit (12 months)</h4>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-secondary">Investment</label>
                      <input
                        type="number"
                        className="w-24 py-1 px-2 border border-[rgba(255,255,255,0.16)] rounded-[8px] bg-transparent text-primary"
                        value={investment}
                        min={0}
                        step={0.1}
                        onChange={(e) => setInvestment(parseFloat(e.target.value || '0'))}
                      />
                      <span className="text-sm text-muted">ETH</span>
                    </div>
                  </div>
                  <canvas ref={profitChartRef} height="140"></canvas>
                </div>

                {/* Candlestick Section */}
                <div className="mt-4 card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-primary text-sm">Candlesticks (simulated)</h4>
                    <span className="text-muted text-xs">12 months</span>
                  </div>
                  <canvas ref={candleCanvasRef} height="160"></canvas>
                  <p className="text-muted mt-2 text-xs">Green = up month, Red = down month. Based on average ROI and confidence.</p>
                </div>
                
                <div className="mt-4 text-sm text-muted">
                  <div className="flex justify-between">
                    <span>
                      Prediction Time: {
                        (() => {
                          const t = prediction?.time ?? Date.now();
                          const ms = t > 1e12 ? t : t * 1000;
                          return new Date(ms).toLocaleString();
                        })()
                      }
                    </span>
                    <span>IPFS Hash: {(prediction?.ipfsHash ?? prediction?.hash ?? '').toString().substring(0, 10)}...</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="mt-4">
                    <button
                      className="w-full py-3 neon-btn rounded-[10px] font-inter font-semibold text-[14px]"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const body = {
                            startupId: startup.id,
                            features: {
                              team: breakdown.team ?? 0.5,
                              traction: breakdown.traction ?? 0.5,
                              market: breakdown.market ?? 0.5,
                              innovation: breakdown.innovation ?? 0.5,
                              financials: breakdown.financials ?? 0.5
                            }
                          };
                          await fetch('http://localhost:8000/api/predict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                          });
                          // Poll latest
                          setTimeout(async () => {
                            const res = await fetch(`http://localhost:8000/api/startups/${startup.id}`);
                            if (res.ok) {
                              const data = await res.json();
                              if (data && data.prediction) setPrediction(data.prediction);
                            }
                            setLoading(false);
                          }, 800);
                        } catch (e) {
                          console.warn('Re-run prediction failed', e);
                          setLoading(false);
                        }
                      }}
                    >
                      Re-run Prediction
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-[rgba(255,255,255,0.12)]">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent neon-btn px-4 py-2 text-base font-medium shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onInvest(startup)}
            >
              Invest Now
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md neon-outline px-4 py-2 text-base font-medium shadow-sm focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => onClose()}
            >
              Close
            </button>
            {loading && (
              <span className="mt-3 text-sm text-muted">Updating prediction...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;