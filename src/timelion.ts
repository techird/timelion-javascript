

const EXP_FUNCTIONS = ['es','static','abs','bars','color','condition','cusum','derivative','divide','first','fit','hide','label','legend','lines','log','max','min','movingaverage','movingstd','mutiply','points','precision','prop','range','scale_interval','subtract','sum','title','trim','yaxis','holt','trend'];

const next = (prev?: ExpressionCompile) => {
  const compile = (func?: string, param?: any) => {
    // build param expression
    let paramExpr = '';
    if (typeof param === 'string') {
      paramExpr = `"${param}"`;
    }
    else if (typeof param === 'number' || typeof param === 'boolean') {
      paramExpr = String(param);
    }
    else if (param && typeof param === 'object') {
      const pairs = [];
      for (let [key, value] of Object.entries(param)) {
        if (typeof value === 'number' || typeof value === 'boolean') {
          pairs.push(`${key}=${value}`);
        }
        else {
          pairs.push(`${key}="${value}"`);
        }
      }
      paramExpr = pairs.join(', ');
    }

    // build expression
    let built = func ? `.${func}(${paramExpr})` : '';
    if (prev) {
      built = prev.compile() + built;
    }
    return built;
  };

  const exp = (func: string) => (param?) => next({
    compile: () => compile(func, param)
  });

  const nextExpression = {
    compile: () => compile(),
  };

  for (let func of EXP_FUNCTIONS) {
    nextExpression[func] = exp(func);
  }

  return nextExpression as ExpressionNext;
}

export const timelion = next();

interface ExpressionCompile {
  compile(): string;
}

interface Expression<T = any> {
  (param?: T extends Object ? Partial<T> : T): ExpressionNext;
}

////////////////////////////////////////////////////////////////////////////////
/// 下面的定义来自于：
/// https://github.com/elastic/timelion/blob/master/FUNCTIONS.md
////////////////////////////////////////////////////////////////////////////////

interface ExpressionNext extends ExpressionCompile {
  /** Pull data from an elasticsearch instance */
  es: Expression<string | ESFunctionParams>
  
  /** Draws a single value across the chart */
  static: Expression<string | number | StaticFunctionParams>;

  /** Return the absolute value of each value in the series list */
  abs: Expression<never>;

  /** Show the seriesList as bars */
  bars: Expression<number | BarsFunctionParams>;

  /** Change the color of the series */
  color: Expression<string | ColorFunctionParams>;

  /** Compares each point to a number, or the same point in another series using an operator, then sets its valueto the result if the condition proves true, with an optional else. */
  condition: Expression<ConditionFunctionParams>;

  /** Return the cumulative sum of a series, starting at a base. */
  cusum: Expression<number | CusumFunctionParams>;

  /** Plot the change in values over time. */
  derivative: Expression<never>;

  /** Divides the values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  divide: Expression<number | DivideFunctionParams>;

  /** This is an internal function that simply returns the input seriesList. Don't use this */
  first: Expression<never>;

  /** Fills null values using a defined fit function */
  fit: Expression<FitMode | FitFunctionParams>;

  /** Hide the series by default */
  hide: Expression<boolean | HideFunctionParams>;

  /** Change the label of the series. Use %s reference the existing label */
  label: Expression<string | LabelFunctionParams>;

  /** Set the position and style of the legend on the plot */
  legend: Expression<string | boolean | LegendFunctionParams>;

  /** Show the seriesList as lines */
  lines: Expression<number | LinesFunctionParams>;

  /** Return the logarithm value of each value in the series list (default base: 10) */
  log: Expression<number | LogFunctionParams>;

  /** Maximum values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  max: Expression<number | string | MaxFunctionParams>;

  /** Minimum values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  min: Expression<number | string | MinFunctionParams>;

  /** Calculate the moving average over a given window. Nice for smoothing noisey series */
  movingaverage: Expression<number | MovingAverageFunctionParams>;

  /** Calculate the moving standard deviation over a given window. Uses naive two-pass algorithm. Rounding errors may become more noticeable with very long series, or series with very large numbers. */
  movingstd: Expression<number | MovingStdFunctionParams>;

  /** Multiply the values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  mutiply: Expression<number | string | MutiplyFunctionParams>;

  /** Show the series as points */
  points: Expression<number | PointsFunctionParams>;

  /** number of digits to round the decimal portion of the value to */
  precision: Expression<number | PrecisionFunctionParams>;

  /** Use at your own risk, sets arbitrary properties on the series. For example .props(label=bears!) */
  prop: Expression<any>;
  
  /** Changes the max and min of a series while keeping the same shape */
  range: Expression<RangeFunctionParams>;

  /** Changes scales a value (usually a sum or a count) to a new interval. For example, as a per-second rate */
  scale_interval: Expression<string | ScaleIntervalFunctionParams>;

  /** Subtract the values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  subtract: Expression<number | string | SubtractFunctionParams>;

  /** Adds the values of one or more series in a seriesList to each position, in each series, of the input seriesList */
  sum: Expression<number | string | SumFunctionParams>;

  /** Adds a title to the top of the plot. If called on more than 1 seriesList the last call will be used. */
  title: Expression<string | TitleFunctionParams>;

  /** Set N buckets at the start or end of a series to null to fit the "partial bucket issue" */
  trim: Expression<TrimFunctionParams>;

  /** Configures a variety of y-axis options, the most important likely being the ability to add an Nth (eg 2nd) y-axis */
  yaxis: Expression<number | YaxisFunctionParams>;

  /**
    Sample the beginning of a series and use it to forecast what should happen via several optional parameters. In general, like everything, this is crappy at predicting the future. You're much better off using it to predict what should be happening right now, for the purpose of anomaly detection. Note that nulls will be filled with forecasted values. Deal with it.
  */
  holt: Expression<HoltFunctionParams>;
  
  /** Draws a trend line using a specified regression algorithm */
  trend: Expression<string | TrendFunctionParams>;
}


interface ESFunctionParams {
  /**
   * Query in lucene query string syntax  
*/
  q: string;

  /**
   * An elasticsearch single value metric agg, eg avg, sum, min, max or cardinality, followed by a field. Eg "sum:bytes", or just "count"  
*/
  metric: string;

  /**
   * An elasticsearch field to split the series on and a limit. Eg, "hostname:10" to get the top 10 hostnames  
*/
  split: string;

  /**
   * Index to query, wildcards accepted  
*/
  index: string;

  /**
   * Field of type "date" to use for x-axis  
*/
  timefield: string;

  /**
   * Respect filters on Kibana dashboards. Only has an effect when using on Kibana dashboards  
*/
  kibana: boolean | string;

  /**
   * **DO NOT USE THIS**. Its fun for debugging fit functions, but you really should use the interval picker  
*/
  interval: string;

  /**
   * Offset the series retrieval by a date expression. Eg -1M to make events from one month ago appear as if they are happening now  
*/
  offset: string;

  /**
   * Algorithm to use for fitting series to the target time span and interval. Available: average, carry, nearest, none, scale,
*/
  fit: FitMode;
}

interface StaticFunctionParams {
  /** The single value to to display, you can also pass several values and I will interpolate them evenly across your time range. */
  value: number | string;

  /** A quick way to set the label for the series. You could also use the .label() function */
  label: string;

  /** Offset the series retrieval by a date expression. Eg -1M to make events from one month ago appear as if they are happening now */
  offset:string;

  /** Algorithm to use for fitting series to the target time span and interval. Available: average, carry, nearest, none, scale, */
  fit: FitMode;
}

interface BarsFunctionParams {
  /** Width of bars in pixels */
  width: number;

  /** Should bars be stacked, true by default */
  stack: boolean;

}

interface ColorFunctionParams {
  /** Color of series, as hex, eg #c6c6c6 is a lovely light grey. If you specify multiple colors, and have multiple series, you will get a gradient, eg "#00B1CC:#00FF94:#FF3A39:#CC1A6F" */
  color: string;
}

interface ConditionFunctionParams {
  /** Operator to use for comparison, valid operators are eq (equal), ne (not equal), lt (less than), lte (less than equal), gt (greater than), gte (greater than equal) */
  operator: string;

  /** The value to which the point will be compared. If you pass a seriesList here the first series will be used */
  if: number | string;

  /** The value the point will be set to if the comparison is true. If you pass a seriesList here the first series will be used */
  then: number | string;

  /** The value the point will be set to if the comparison is false. If you pass a seriesList here the first series will be used */
  else: number | string;
}

interface CusumFunctionParams {
  /** Number to start at. Basically just adds this to the beginning of the series */
  base: number;
}

interface DivideFunctionParams {
  /** Number or series to divide by. If passing a seriesList it must contain exactly 1 series. */
  divisor: string | number;
}

interface FitFunctionParams {
  /** The algorithm to use for fitting the series to the target. One of: average, carry, nearest, none, scale */
  mode: FitMode;
}

interface HideFunctionParams {
  /** Hide or unhide the series */
  hide: boolean;
}

interface LabelFunctionParams {
  /** Legend value for series. You can use $1, $2, etc, in the string to match up with the regex capture groups */
  label: string;

  /** A regex with capture group support */
  regex: string;
}

interface LegendFunctionParams {
  /** Corner to place the legend in: nw, ne, se, or sw. You can also pass false to disable the legend */
  position: string | boolean;

  /** Number of columns to divide the legend into */
  columns: number;
}

interface LinesFunctionParams {
  /** Line thickness */
  width: number;

  /** Number between 0 and 10. Use for making area charts */
  fill: number;

  /** Stack lines, often misleading. At least use some fill if you use this. */
  stack: boolean;

  /** Show or hide lines */
  show: number | boolean;

  /** Show line as step, eg, do not interpolate between points */
  steps: number | boolean;
}

interface LogFunctionParams {
  /** Set logarithmic base, 10 by default */
  base: number;
}

interface MaxFunctionParams {
  /** Sets the point to whichever is higher, the existing value, or the one passed. If passing a seriesList it must contain exactly 1 series. */
  value: string | number;
}

interface MinFunctionParams {
  /** Sets the point to whichever is lower, the existing value, or the one passed. If passing a seriesList it must contain exactly 1 series. */
  value: string | number;
}

interface MovingAverageFunctionParams {
  /** Number of points to average over */
  window: number;

  /** Position of the averaged points relative to the result time.  Options are left, right, and center (default). */
  position: string;
}

interface MovingStdFunctionParams {
  /** Number of points to compute the standard deviation over */
  window: number;
}

interface MutiplyFunctionParams {
  /** Number or series by which to multiply. If passing a seriesList it must contain exactly 1 series.  */
  multiplier: string | number;
}

interface PointsFunctionParams {
  /** Size of points */
  radius: number;

  /** Thickness of line around point */
  weight: number;

  /** Number between 0 and 10 representing opacity of fill */
  fill: number;

  /** Color with which to fill point */
  fillColor: string;

  /** cross, circle, triangle, square or diamond */
  symbol: string;

  /** Show points or not */
  show: boolean;
}

interface PrecisionFunctionParams {
  /** Number of digits to round each value to */
  precision: number;
}

interface RangeFunctionParams {
  /** New minimum value */
  min: number;

  /** New maximum value */
  max: number;
}

interface ScaleIntervalFunctionParams {
  /** The new interval in date math notation, eg 1s for 1 second. 1m, 5m, 1M, 1w, 1y, etc. */
  interval: string;
}

interface SubtractFunctionParams {
  /** Number or series to subtract from input. If passing a seriesList it must contain exactly 1 series. */
  term: string | number;
}

interface SumFunctionParams {
  /** Number or series to sum with the input series. If passing a seriesList it must contain exactly 1 series. */
  term: string | number;
}

interface TitleFunctionParams {
  /** Title for the plot. */
  title: string;
}

interface TrimFunctionParams {
  /** Buckets to trim from the beginning of the series. Default: 1 */
  start: number;
  /** Buckets to trim from the end of the series. Default: 1 */
  end: number;
}

interface YaxisFunctionParams {
  /** The numbered y-axis to plot this series on, eg .yaxis(2) for a 2nd y-axis. */
  yaxis: number;

  /** Min value */
  min: number;

  /** Max value */
  max: number;

  /** left or right */
  position: string;

  /** Label for axis */
  label: string;

  /** Color of axis label */
  color: string;
}

interface HoltFunctionParams {
  /** Smoothing weight from 0 to 1. Increasing alpha will make the new series more closely follow the original. Lowering it will make the series smoother */
  alpha: number;

  /** Trending weight from 0 to 1. Increasing beta will make rising/falling lines continue to rise/fall longer. Lowering it will make the function learn the new trend faster */
  beta: number;

  /** Seasonal weight from 0 to 1. Does your data look like a wave? Increasing this will give recent seasons more importance, thus changing the wave form faster. Lowering it will reduce the importance of new seasons, making history more important. */
  gamma: number;

  /** How long is the season, eg, 1w if you pattern repeats weekly. (Only useful with gamma) */
  season: string;

  /** The number of seasons to sample before starting to "predict" in a seasonal series. (Only useful with gamma, Default: all) */
  sample: number;
}

interface TrendFunctionParams {
  /** The algorithm to use for generating the trend line. One of: linear, log */
  mode: 'linear' | 'log';

  /** Where to start calculating from the beginning or end. For example -10 would start calculating 10 points from the end, +15 would start 15 points from the beginning. Default: 0 */
  start: number;

  /** Where to stop calculating from the beginning or end. For example -10 would stop calculating 10 points from the end, +15 would stop 15 points from the beginning. Default: 0 */
  end: number;
}

type FitMode = 'average' | 'carry' | 'nearest' | 'none' | 'scale';