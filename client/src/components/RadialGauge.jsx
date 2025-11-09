import React from 'react';

const RadialGauge = ({ value = 0, label = 'Signal', size = 120 }) => {
  const style = {
    width: size,
    height: size,
    ['--val']: value,
  };
  return (
    <div className="gauge" style={style}>
      <div className="inner">
        <div className="text-center">
          <div className="text-xl font-bold">{Math.round(value)}%</div>
          <div className="text-xs text-muted">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default RadialGauge;