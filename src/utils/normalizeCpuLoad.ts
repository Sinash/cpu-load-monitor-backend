import os from 'os';

/**
 * Get the normalized CPU load average.
 * This function uses the system's 1-minute load average and normalizes it
 * by dividing the load by the number of CPU cores.
 *
 * @returns The normalized load average (1-minute average).
 */
export const getNormalizedCpuLoad = (): number => {
  // Get the number of CPUs
  const numCpus = os.cpus().length;

  // Get the 1-minute load average (index 0 of os.loadavg())
  const loadAverage = os.loadavg()[0];

  // Normalize by dividing the load average by the number of CPUs
  const normalizedLoad = loadAverage / numCpus;

  return normalizedLoad;
};
