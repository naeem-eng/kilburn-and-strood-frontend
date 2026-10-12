export type IncrementalAnimationFieldKey = string

export const DEFAULT_VERTICAL_DISTANCES = ['-32vh', '-26vh', '-20vh', '-14vh']
export const DEFAULT_AXIS = 'y'

type IncrementalAnimationConfig<FieldKey extends IncrementalAnimationFieldKey> = {
  distances?: string[]
  fieldsOrder: FieldKey[]
  axis?: string
  negativeOnReverse?: boolean
  screenSize?: string
  trigger?: string  
  start?: string
  delay?: number
  stagger?: boolean
  staggerAmount?: number
  duration?: number
}

export const createIncrementalAnimationAttributes = <FieldKey extends IncrementalAnimationFieldKey>(
  config: IncrementalAnimationConfig<FieldKey>
) => {
  const { fieldsOrder, axis = DEFAULT_AXIS, negativeOnReverse = true, screenSize = '' } = config
  const distances = config.distances ?? DEFAULT_VERTICAL_DISTANCES
  const trigger = config.trigger ?? ''
  const start = config.start ?? 'top 80%'
  const baseDelay = config.delay ?? 0
  const staggerAmount = config.staggerAmount ?? 0.04
  const stagger = config.stagger ?? false
  const duration = config.duration ?? 0.5

  return (field: FieldKey) => {
    const index = fieldsOrder.indexOf(field)
    if (index === -1) return {}

    const distance = distances[index] || distances[distances.length - 1]
    const reverseDistance =
      distances[distances.length - 1 - index] || distances[0]
    const delay = stagger ? baseDelay + staggerAmount * index : baseDelay

    const fromValue = JSON.stringify({
      [axis]: `${negativeOnReverse ? '-' : ''}${distance}`,
      opacity: 0
    })
    const middleValue = JSON.stringify({ [axis]: '0%', opacity: 1 })
    const toValue = JSON.stringify({
      [axis]: reverseDistance,
      opacity: 0
    })
    const attributes = {
      'data-animation-atoms': true,
      [`data-${screenSize}from`]: fromValue,
      [`data-${screenSize}middle`]: middleValue,
    }
    if (toValue) {
      attributes[`data-${screenSize}to`] = toValue
    }
    if (trigger) {
      attributes[`data-${screenSize}trigger`] = trigger
    }
    if (start) {
      attributes[`data-${screenSize}start`] = start
    }
    if (delay) {
      attributes[`data-${screenSize}delay`] = `${delay}`
    } 
    if (duration) {
      attributes[`data-${screenSize}duration`] = `${duration}`
    }
    return attributes
  }
}

