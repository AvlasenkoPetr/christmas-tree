import toys from "./toys";
import { IToy } from "./toys"
// import Filter from "./filter"

// interface IRender {
//   toys: IToy[];
// }

interface IToyDomItem {
  toyInfo: IToy;
  toyDomElement: HTMLElement;
}

class ToyDomItem implements IToyDomItem {
  toyInfo: IToy;
  toyDomElement: HTMLElement;

  constructor(toyObject: IToy, domElement: HTMLElement) {
    this.toyInfo = toyObject;
    this.toyDomElement = domElement;
  }
}

interface IFilter {
  color: string[];
  size: string[];
  shape: string[];
  favorite: boolean | null
}

class Filter implements IFilter {
  color: string[];
  size: string[];
  shape: string[];
  favorite: boolean | null

  constructor() {
    this.color = []
    this.size = []
    this.shape = []
    this.favorite = null
  }
}




class Render {
  container: HTMLElement;
  toysFullData: IToyDomItem[];
  filter: IFilter;

  constructor() {
    this.container = document.querySelector('.toys') as HTMLElement;
    this.toysFullData = [] // массив из классов, в которых мы привязываем инфу об игрушке к соотв-му дом элементу
    this.filter = new Filter
  }


  run(toys: IToy[]): void {
    for (let i = 0; i < toys.length; i++) {
      const toyObject = toys[i];
      const toyDomElement: HTMLElement = document.createElement('div');
      const isFavorite = toyObject.favorite? 'да' : 'нет'

      toyDomElement.className = 'toys__item visible'
      toyDomElement.setAttribute('data-num', `${toyObject.num}`)
      toyDomElement.setAttribute('data-name', `${toyObject.name}`)
      toyDomElement.setAttribute('data-year', `${toyObject.year}`)
      toyDomElement.setAttribute('data-count', `${toyObject.count}`)

      toyDomElement.innerHTML = `
      <h2>${toyObject.name}</h2>
      <img src="https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/christmas-task/assets/toys/${toyObject.num}.png">
      <p>Количество: ${toyObject.count}</p>
      <p data-year="${toyObject.year}">Год: ${toyObject.year}</p>
      <p>Форма: ${toyObject.shape}</p>
      <p>Цвет: ${toyObject.color}</p>
      <p>Размер: ${toyObject.size}</p>
      <p>Любимая: ${isFavorite}</p>
      ` 

      toyDomElement.addEventListener('click', () => {
        let counter = document.querySelector('.header__counter') as HTMLElement;

        if (counter.innerHTML == '20' && !toyDomElement.classList.contains('favorite')) {

          if (document.querySelector('.error__message')) return

          let errorMessage = document.createElement('div')
          errorMessage.className = 'error__message'
          errorMessage.innerHTML = 'Достигнут лимит избранных игрушек!'

          document.querySelector('.header')?.append(errorMessage)

          setTimeout(() => {errorMessage.remove()}, 3000)

        } else {
          // document.querySelector('.error__message')?.remove()

          toyDomElement.classList.toggle('favorite')

          if (toyDomElement.classList.contains('favorite')) {
            counter.innerHTML = `${+counter.innerHTML + 1}`

          } else {
            counter.innerHTML = `${+counter.innerHTML - 1}`
          }
        }
      })

      this.container?.append(toyDomElement)

      const toyData = new ToyDomItem(toyObject, toyDomElement)
      this.toysFullData.push(toyData)
    }
  }

  runFilter() {
    document.querySelector('.filter')?.addEventListener('click', (e: Event) => {
      let targetElement = (e.target as HTMLElement)

      if (targetElement.tagName == 'BUTTON') {
          targetElement.classList.toggle('selected')
          this.updateFilter(targetElement)
        
      }
    })

    document.querySelector("input[type='search']")?.addEventListener('input', (e: Event) => {
      let inputValue = (e.target as HTMLInputElement).value
      this.searchToys(inputValue)
    })    

    // RESET BUTTON
    document.querySelector('.filter__reset-button')?.addEventListener('click', () => {
      for (let i = 0; i < this.toysFullData.length; i++) {
        this.toysFullData[i].toyDomElement.classList.add('visible')
      }

      for (let key in this.filter) {
        if (key == 'color' || key == 'size' || key == 'shape') {
          this.filter[key] = []

        } else if (key == 'favorite') {
           this.filter[key] = null
        }
      }
      
      let activeFilters = document.querySelectorAll('.selected')
      
      for (let i = 0; i < activeFilters.length; i++) {
        activeFilters[i].classList.remove('selected')
      }
    })

    // SELECT SORT
    document.querySelector('select')?.addEventListener('click', (e) => {
      let selectValue = (e.target as HTMLSelectElement).value


      let container = document.querySelector('.toys') as HTMLElement

      if (selectValue == 'По названию от "А" до "Я"') {

        for (let i = 0; i < (container as HTMLElement).children.length; i++) {
          for (let j = i; j < (container as HTMLElement).children.length; j++) {

            if ((container.children[i].getAttribute('data-name') as string) > (container.children[j].getAttribute('data-name') as string)) {
  
              let replacedNode = this.container?.replaceChild(container.children[j], container.children[i])
              insertAfter(replacedNode as HTMLElement, container.children[i] as HTMLElement)
            }
          }
        }

      } else if (selectValue == 'По названию от "Я" до "А"') {
        
        for (let i = 0; i < (container as HTMLElement).children.length; i++) {
          for (let j = i; j < (container as HTMLElement).children.length; j++) {

            if ((container.children[i].getAttribute('data-name') as string) < (container.children[j].getAttribute('data-name') as string)) {
  
              let replacedNode = this.container?.replaceChild(container.children[j], container.children[i])
              insertAfter(replacedNode as HTMLElement, container.children[i] as HTMLElement)
            }
          }
        }

      } else if (selectValue == 'По году производства от старых к новым') {
        
        for (let i = 0; i < (container as HTMLElement).children.length; i++) {
          for (let j = i; j < (container as HTMLElement).children.length; j++) {

            if (+(container.children[i].getAttribute('data-year') as string) > +(container.children[j].getAttribute('data-year') as string)) {
  
              let replacedNode = this.container?.replaceChild(container.children[j], container.children[i])
              insertAfter(replacedNode as HTMLElement, container.children[i] as HTMLElement)
            }
          }
        }

      } else if (selectValue == 'По году производства от новых к старым') {

        for (let i = 0; i < (container as HTMLElement).children.length; i++) {
          for (let j = i; j < (container as HTMLElement).children.length; j++) {

            if (+(container.children[i].getAttribute('data-year') as string) < +(container.children[j].getAttribute('data-year') as string)) {
  
              let replacedNode = this.container?.replaceChild(container.children[j], container.children[i])
              insertAfter(replacedNode as HTMLElement, container.children[i] as HTMLElement)
            }
          }
        }

      }
      
      function insertAfter(elem: HTMLElement, refElem: HTMLElement) {
        return refElem.parentNode?.insertBefore(elem, refElem.nextSibling)
      }
    })

  }

  searchToys(inputValue: string) {
    // let visibleToys = document.querySelectorAll('.visible')
    for (let i = 0; i < this.toysFullData.length; i++){
      // if (visibleToys[i].innerHTML.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
      //   visibleToys[i].classList.add('visible')
      // } else {
      //   visibleToys[i].classList.remove('visible')
      // }
      if (this.toysFullData[i].toyInfo.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
        this.toysFullData[i].toyDomElement.classList.add('visible')

      } else {
        this.toysFullData[i].toyDomElement.classList.remove('visible')
      }

    }
  }

  updateFilter(element: HTMLElement) {
    let elementDataset = {...element.dataset}
    // {color: желтый}
    let key: string = Object.keys(elementDataset).join()
    let value: string = Object.values(elementDataset).join()

    if (key == 'color' || key == 'size' || key == 'shape') {
      if (this.filter[key].find((el) => { if (el == value) return el })) {
        let index = this.filter[key].findIndex(ele => ele == value)
        this.filter[key].splice(index, 1)

      } else {
        this.filter[key].push(value)

      }

    } else if (key == 'favorite') {
      if (element.classList.contains('selected')) {
        this.filter.favorite = true

      } else {
        this.filter.favorite = null
      }
    }

    console.log(this.filter)
  
    this.renderFilter(key)

    // let filterButtons = [...(element.parentElement as HTMLElement).children]
    // let selectedButtons = filterButtons.filter((e) => {
    //   if (e.classList.contains('selected')) return e
    // })
    // console.log(selectedButtons)
    // console.log((element.parentElement as HTMLElement).children)
    // if (element.classList.contains('selected')) {
    //   let datasetObj = {...element.dataset}
    //   let keyF= Object.keys(datasetObj).join()
    //   let valueF = Object.values(datasetObj).join()
    //   this.hideAll()
    //   this.toysFullData.filter((element) => {
    //     if (element.toyInfo.color == valueF) element.toyDomElement.classList.add('visible')
    //   })
    // }
  }


  renderFilter(key: string) {

    this.hideAll()
    
    this.toysFullData.filter((element) => {
      if (key == 'color' || key == 'size' || key == 'shape') {

        if (this.filter[key].length == 0) {
          this.showAll()
  
        } else {
          if (this.filter[key].find(el => el == element.toyInfo[key])) element.toyDomElement.classList.add('visible')
        }

      } else if (key == 'favorite') {
        
        if (this.filter[key]) {
          this.toysFullData.map(el => {
            if (el.toyInfo.favorite) el.toyDomElement.classList.add('visible')
          })

        } else {
          this.showAll()
        }
      }
    })
  }


  hideAll() {
    for (let i = 0; i < this.toysFullData.length; i++) {
      this.toysFullData[i].toyDomElement.classList.remove('visible')
    }
  }

  showAll() {
    for (let i = 0; i < this.toysFullData.length; i++) {
      this.toysFullData[i].toyDomElement.classList.add('visible')
    }
  }


  // test() {
  //   document.querySelector('#red')?.addEventListener('click', () => {
  //     this.hideAll()
  //     this.toysFullData.filter((element) => {
  //       if (element.toyInfo.color == 'красный' && element.toyInfo.favorite == true) element.toyDomElement.classList.add('visible')
  //     })
  //   })
  //   console.log(this.toysFullData.filter((element) => {
  //     if (element.toyInfo.color == 'красный') return element.toyDomElement
  //   }))
  // }
}

export default Render