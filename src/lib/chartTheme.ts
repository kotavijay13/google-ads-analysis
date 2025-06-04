
// Secure chart theme configuration without XSS vulnerabilities
export const getChartTheme = () => {
  return {
    background: 'transparent',
    textStyle: {
      color: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      borderColor: '#e5e7eb'
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    tooltip: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'
    },
    legend: {
      textStyle: {
        color: '#374151'
      }
    }
  };
};

export const sanitizeChartData = (data: any) => {
  // Recursively sanitize any string values in chart data
  if (typeof data === 'string') {
    return data.replace(/<[^>]*>/g, ''); // Remove HTML tags
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeChartData);
  }
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeChartData(value);
    }
    return sanitized;
  }
  return data;
};
