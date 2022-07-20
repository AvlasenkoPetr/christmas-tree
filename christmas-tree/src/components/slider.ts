import * as noUiSlider from 'nouislider'
import { target, API } from 'nouislider'

export const sliderYear = <target>document.getElementById('slider-year')
export const sliderCount = <target>document.getElementById('slider-count')

export class Slider {
  slider: noUiSlider.target;
  type: string

  constructor(sliderElement: HTMLElement, type: string) {
    this.slider = sliderElement
    this.type = type
  }

  run() {

    if (this.type == 'year') {
      noUiSlider.create(this.slider, {
        start: [1940, 2020],
        connect: true,
        range: {
          'min': 1940,
          'max': 2020
        },
        step: 10,
      });

    } else if (this.type == 'count') {
      noUiSlider.create(this.slider, {
        start: [1, 12],
        connect: true,
        range: {
          'min': 1,
          'max': 12
        },
        step: 1,
      });

    }

    (<API>this.slider.noUiSlider).on('slide', (arr) => {
      this.renderToys(arr)
      this.slider.previousElementSibling!.innerHTML = String(arr[0]).split('.')[0]
      this.slider.nextElementSibling!.innerHTML = String(arr[1]).split('.')[0]
    })

    let resetButton = document.querySelector('.filter__reset-button')  as HTMLElement
    
    resetButton.addEventListener('click', () => {
      (<API>this.slider.noUiSlider).reset()
      this.slider.previousElementSibling!.innerHTML = String(this.slider.noUiSlider?.options.range.min)
      this.slider.nextElementSibling!.innerHTML = String(this.slider.noUiSlider?.options.range.max)
    })
  }

  renderToys(arr: (string | number)[]) {
    let toys = (document.querySelector('.toys') as HTMLElement).children

    for(let i = 0; i < toys.length; i++) {

      if (this.type == 'year') {
        let year = Number(toys[i].getAttribute('data-year'))

        if (year >= Number(arr[0]) && year <= Number(arr[1])) {
          toys[i].classList.add('visible')
        } else {
          toys[i].classList.remove('visible')
        }
        
      } else if (this.type == 'count') {
        let count = Number(toys[i].getAttribute('data-count'))

        if (count >= Number(arr[0]) && count <= Number(arr[1])) {
          toys[i].classList.add('visible')
        } else {
          toys[i].classList.remove('visible')
        }

      }
    }
  }
}