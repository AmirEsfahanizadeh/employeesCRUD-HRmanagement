import { throttle } from 'lodash'

export const useThrottle = (fn, delay = 300) => {
  return throttle(fn, delay, { leading: false, trailing: true })
}