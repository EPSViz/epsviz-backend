interface EarningsData {
  EPSReportDate: string;
  consensusEPS: number;
  actualEPS: number;
}

export interface TrendsData {
  time: string;
  value: number[];
}

interface OutputData {
  ready: boolean;
  data: Array<{ x: number; y: number }>;
  predict: {
    nextDate: Date | null;
    consensusEPS: number | null;
    lower: number | null;
  };
}

function getQuarter(date: Date): number {
  const month = date.getMonth();
  if (month <= 2) {
    return 1;
  } else if (month <= 5) {
    return 2;
  } else if (month <= 8) {
    return 3;
  } else {
    return 4;
  }
}

export function processData(
  earningsData: EarningsData[],
  trendsData: TrendsData[]
): OutputData {
  const data: Array<{ x: number; y: number }> = [];
  const today = new Date();
  let nextDate: Date | null = null;
  let consensusEPS: number | null = null;

  const withActual = earningsData.filter(
    (earnings) => earnings.actualEPS !== null
  );
  if (withActual.length === 0) {
    return {
      ready: false,
      data: [],
      predict: {
        nextDate: null,
        consensusEPS: null,
        lower: null,
      },
    };
  }
  const indexOfFirstActual = earningsData.indexOf(withActual[0]);

  // trim earningsData to only include actual earnings + next quarter
  earningsData = earningsData.slice(indexOfFirstActual - 1);

  for (const earnings of earningsData) {
    const earningsDate = new Date(earnings.EPSReportDate);
    console.log("ed", earningsDate);
    console.log("today", today);

    if (earningsDate <= today) {
      const quarter = getQuarter(earningsDate);
      let quarterTrends = 0;
      let quarterCount = 0;
      for (const trend of trendsData) {
        const trendDate = new Date(Number(trend.time) * 1000);
        if (getQuarter(trendDate) === quarter) {
          quarterTrends += trend.value[0];
          quarterCount++;
        }
      }
      if (quarterCount > 0) {
        const avgTrend = quarterTrends / quarterCount;
        data.push({ x: avgTrend, y: earnings.actualEPS });
      }
    } else {
      console.log("nextDate", nextDate);
      if (!nextDate || earningsDate <= nextDate) {
        console.log("nextDate2", nextDate);
        nextDate = earningsDate;
        consensusEPS = earnings.consensusEPS;
      }
    }
  }

  console.log("data", data);

  // Perform linear regression
  const xSum = data.reduce((sum, d) => sum + d.x, 0);
  const ySum = data.reduce((sum, d) => sum + d.y, 0);
  const xSquaredSum = data.reduce((sum, d) => sum + d.x * d.x, 0);
  const xySum = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const n = data.length;

  const b = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const a = (ySum - b * xSum) / n;

  // Calculate lower prediction interval
  let lower: number | null = null;
  if (data.length > 2) {
    const residualSum = data.reduce(
      (sum, d) => sum + (d.y - a - b * d.x) ** 2,
      0
    );
    const s = Math.sqrt(residualSum / (n - 2));
    const xbar = xSum / n;
    const x = trendsData[trendsData.length - 1].value[0];
    const t = 1.96; // t-value for 95% confidence interval with n-2 degrees of freedom
    lower =
      a + b * x - t * s * Math.sqrt(1 + 1 / n + (x - xbar) ** 2 / xSquaredSum);
  }

  return {
    ready: true, //today >= nextDate,
    data,
    predict: {
      nextDate,
      consensusEPS,
      lower,
    },
  };
}
