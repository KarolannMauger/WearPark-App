export interface MotionGraph {
    start: string;
    end: string;
    max: number;
    min: number;
    data: number[];
}
 
export interface MotionDayData {
    start: string;
    end: string;
    coverage: number | null;
    meanAmplitude: number | null;
    peakAmplitude: number | null;
    variance: number | null;
    graph: MotionGraph;
}
 
export interface MotionDaySummary {
    start: string;
    end: string;
    coverage: number | null;
    meanAmplitude: number | null;
    deltaMeanAmplitude: number | null;
}
 
export interface MotionMonthData {
    start: string;
    end: string;
    coverage: number | null;
    meanAmplitude: number | null;
    days: MotionDaySummary[];
}