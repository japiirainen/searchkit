import * as React from 'react'

import { mount } from 'enzyme'
import { FastClick, FastClickComponent, NormalClickComponent } from '../../../'

describe('FastClick - fast', () => {
  beforeEach(() => {
    FastClick.component = FastClickComponent

    this.handler = jasmine.createSpy('fastclick handler')
    this.wrapper = mount(
      <FastClick handler={this.handler}>
        <button>click me</button>
      </FastClick>
    )
  })

  afterEach(() => {
    FastClick.component = NormalClickComponent
  })

  it('should render children', () => {
    expect(this.wrapper).toMatchSnapshot()
  })

  it('test mousedown', () => {
    this.wrapper.simulate('mouseDown', { button: 1 })
    expect(this.handler).not.toHaveBeenCalled()

    this.wrapper.simulate('mouseDown', { button: 0 })
    expect(this.handler).toHaveBeenCalled()
  })

  describe('Touch events', () => {
    beforeEach(() => {
      this.fastClick = this.wrapper.find('FastClickComponent').instance()
      this.simulateTouch = (event, x, y) => {
        this.wrapper.simulate(event, {
          changedTouches: [{ pageX: x, pageY: y }]
        })
      }

      this.simulateTouch('touchStart', 10, 20)
      expect(this.fastClick.supportsTouch).toBe(true)
      expect(this.fastClick.startPoint).toEqual({
        x: 10,
        y: 20
      })
    })

    it('test touch above threshold', () => {
      this.simulateTouch('touchEnd', 30, 40)
      expect(this.handler).not.toHaveBeenCalled()
      expect(this.fastClick.startPoint).toBe(undefined)

      //ignore mousedowns if supports touch
      this.wrapper.simulate('mouseDown', { button: 0 })
      expect(this.handler).not.toHaveBeenCalled()
    })

    it('test touch within threshold', () => {
      this.simulateTouch('touchEnd', 29, 39)
      expect(this.handler).toHaveBeenCalled()
      expect(this.fastClick.startPoint).toBe(undefined)
    })

    it('ignore multiple touch', () => {
      this.wrapper.simulate('touchStart', {
        changedTouches: [
          { pageX: 1, pageY: 2 },
          { pageX: 10, pageY: 22 }
        ]
      })
      expect(this.fastClick.startPoint).toBe(null)
    })

    it('prevents default click behaviour', () => {
      const event = {
        preventDefault: jasmine.createSpy('preventDefault')
      }
      this.wrapper.simulate('click', event)
      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  it('Supports normal click', () => {
    FastClick.component = NormalClickComponent
    this.handler = jasmine.createSpy('fastclick handler')
    this.wrapper = mount(
      <FastClick handler={this.handler}>
        <button>click me</button>
      </FastClick>
    )
    this.wrapper.simulate('click')
    expect(this.handler).toHaveBeenCalled()
  })
})
