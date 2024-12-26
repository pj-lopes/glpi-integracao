import 'chart.js'
declare module 'chart.js' {
  export interface ChartData<
    TType extends ChartType = ChartType,
    TData = DefaultDataPoint<TType>,
    TLabel = unknown,
  > {
    categories?: string[]
    labels?: TLabel[]
    xLabels?: TLabel[]
    yLabels?: TLabel[]
    datasets: ChartDataset<TType, TData>[]
  }
}
