import { LanguageServiceMode } from "typescript";
import toys, { IToy } from "./toys";

class ToyElement {
  toyElement: HTMLImageElement;

  constructor(num: number) {
    this.toyElement = document.createElement('img')
    this.toyElement.className = 'toy-img'
    this.toyElement.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/christmas-task/assets/toys/${num}.png`
    this.toyElement.alt = 'toy'
    this.toyElement.draggable = true
  }

}


class ToyContainer {
  toyContainer: HTMLElement;
  toyElements: ToyElement[];
  count: number;
  counter: HTMLElement
  
  constructor(num: number, count: number) { 
    this.toyContainer = document.createElement('div'),
    this.toyContainer.className = 'tree-settings__option toy-option',
    this.toyContainer.id = `${num}`
    
    this.toyElements = []
    for (let i = 0; i < count; i++) {
      let toy = new ToyElement(num)
      toy.toyElement.id = `${num}-${i}`
      
      this.addDragability(toy.toyElement)
      this.toyElements.push(toy)
    }
    
    this.count = this.toyElements.length

    this.counter = document.createElement('div')
    this.counter.className = 'toy-counter'
    this.counter.innerHTML = `${this.count}`

    this.toyContainer.append(this.counter)
  }
  

  appendToWarehouse() {
    for (let toy of this.toyElements) {
      this.toyContainer.append(toy.toyElement)
    }

    const warehouseContainer = <HTMLElement>document.querySelector('#toy-select')
    warehouseContainer.append(this.toyContainer)
  }

  addDragability(toy: HTMLElement) {
    let coordX: string
    let coordY: string

    toy.addEventListener('dragstart', (e: DragEvent) => {
      coordX = String(e.offsetX)
      coordY = String(e.offsetY)

      e.dataTransfer?.setData('id', toy.id)
      e.dataTransfer?.setData('coordsX', coordX)
      e.dataTransfer?.setData('coordsY', coordY)
    })

    toy.addEventListener('dragend', () => {
      this.updateCounter()
    })
  }

  updateCounter() {
    console.log("update counter")
    this.counter.innerHTML = String(this.toyContainer.children.length - 1)
  }
}


export class Tree {
  treeContainer: HTMLElement;
  tree: HTMLImageElement;
  mapArea: HTMLElement;
  
  constructor() {
    this.treeContainer = document.querySelector('.tree__section') as HTMLElement,
    this.tree = document.querySelector('#tree') as HTMLImageElement,
    this.mapArea = <HTMLElement>document.querySelector('#tree-area')
  }

  setListeners() {
    const treeOptionsBlock = document.querySelector('#tree-select') as HTMLElement
    const bgOptionsBlock = document.querySelector('#bg-select') as HTMLElement


    // УБЕРИ ЭТО ДУБЛИРОВАНИЕ, ЗДЕСЬ ВООБЩЕ ЛУЧШЕ ДЕЛЕГИРОВАНИЕ ЗАЮЗАТЬ

    for (let i = 0; i < treeOptionsBlock.children.length; i++) {
      treeOptionsBlock.children[i].addEventListener('click', (el: Event) => {
        const target = el.target as HTMLElement
        
        if (target.parentNode?.querySelector('.picked')) {
          target.parentNode?.querySelector('.picked')?.classList.remove('picked')
        }

        target.classList.toggle('picked')
        this.tree.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/christmas-task/assets/tree/${i + 1}.png`
      })
    }

    for (let i = 0; i < bgOptionsBlock.children.length; i++) {
      bgOptionsBlock.children[i].addEventListener('click', (el: Event) => {
        const target = el.target as HTMLElement
        
        if (target.parentNode?.querySelector('.picked')) {
          target.parentNode?.querySelector('.picked')?.classList.remove('picked')
        }

        target.classList.toggle('picked')
        this.treeContainer.style.backgroundImage = `url(https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/christmas-task/assets/bg/${i + 1}.jpg)`
      })
    }

    document.querySelector('.tree-button')?.addEventListener('click', this.renderWarehouse)

    let interval: NodeJS.Timer
    document.querySelector('.snow-button')?.addEventListener('click', () => {
      if (!document.querySelector('.snowflake')) {
        interval = setInterval(this.createSnowFlakes, 50);
      } else {
        clearInterval(interval)
      }
    })

    const audio = new Audio
    audio.src = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/christmas-task/assets/audio/audio.mp3'
    document.querySelector('.audio-button')?.addEventListener('click', () => {
      audio.paused ? audio.play() : audio.pause()
    })

    window.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    window.addEventListener('drop', (e) => {
      const elemId = <string>e.dataTransfer?.getData('id')
      const elem = <HTMLElement>document.getElementById(elemId)

      if ((e.target as HTMLElement).tagName == 'AREA') {
        
        const coordsX = Number(e.dataTransfer?.getData('coordsX'))
        const coordsY = Number(e.dataTransfer?.getData('coordsY'))

        elem.style.position = 'absolute'
        elem.style.left = (e.pageX - coordsX - this.treeContainer.offsetLeft) + 'px'
        elem.style.top = (e.pageY - coordsY - (window.innerHeight / 10)) + 'px'
        
        this.mapArea.append(elem)

      } else {
        const elemContainerId = elemId.split('-')[0]
        const elemContainer = <HTMLElement>document.getElementById(elemContainerId)

        const elemContainerInner = [...elemContainer.children]
        
        for (let elem of elemContainerInner) {
          if (elem.id == elemId) return
        }

        elem.style.left = ''
        elem.style.top = ''
        elemContainer.append(elem)    
      }
    })

    document.querySelector('#garland-select')?.addEventListener('click', (e) => {
      const targetElement = e.target as HTMLElement
      if (!targetElement.classList.contains('garland-option')) return

      const garlandContainer = document.querySelector('.garland-container') as HTMLElement
      garlandContainer.innerHTML = ''
      if (targetElement.id == 'garland-off') return
       
      this.renderGarland(targetElement.id)  
    })
  }

  renderWarehouse() {
    const map = <HTMLElement>document.querySelector('#tree-area')
    map.innerHTML = ''

    let favoriteToys = <NodeList | IToy[]> document.querySelectorAll('.favorite')
    const warehouseContainer = <HTMLElement>document.querySelector('#toy-select')
    warehouseContainer.innerHTML = ''

    let toysToAppend: IToy[] | HTMLElement[]

    if (favoriteToys.length == 0) {
      toysToAppend = toys.slice(0, 20)
      for (let i = 0; i < toysToAppend.length; i++) {
        let toyContainer = new ToyContainer(+toysToAppend[i].num, +toysToAppend[i].count!)
        toyContainer.appendToWarehouse()
      }

    } else {
      toysToAppend = [...favoriteToys] as HTMLElement[]
      for (let i = 0; i < toysToAppend.length; i++) {
        let toyContainer = new ToyContainer(+toysToAppend[i].dataset.num!, +toysToAppend[i].dataset.count!)
        toyContainer.appendToWarehouse()
      }
      
    }
  }

  createSnowFlakes() {
    const treeSection = document.querySelector('.tree__section') as HTMLElement 
    const snowFlake = document.createElement('i');  

    snowFlake.classList.add('snowflake');
    snowFlake.style.left = Math.random() * treeSection.offsetWidth + 'px';
    snowFlake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowFlake.style.opacity = String(Math.random());
    const size = Math.random() * 10 + 5 + 'px';
    snowFlake.style.width = size;
    snowFlake.style.height = size;
    
    treeSection.appendChild(snowFlake);
    
    setTimeout(() => {
      snowFlake.remove();
    }, 5000)
  }

  renderGarland(color: string) {
    const garlandContainer = document.querySelector('.garland-container')
    let lightropeSize = 120
    while (lightropeSize < 450) {
      let lightrope = document.createElement('ul')
      lightrope.className = 'lightrope'
      lightrope.style.width = lightropeSize + 'px'
      lightrope.style.height = lightropeSize * (4 / 3) + 'px'
      
      for (let i = 0; i < (lightropeSize / 20) + 1; i++) {
        const lamp = document.createElement('li')
        lamp.style.animationDuration = 0.5 + (Math.random() * 3) + 's'

        if (color == 'rainbow') {
          let colors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange']
          lamp.className = `${colors[Math.floor(Math.random() * colors.length)]}-lamp`
        } else {
          lamp.className = `${color}-lamp`
        }
        
        lamp.style.bottom = Math.random() * 50 + 'px'

        lightrope.append(lamp)
      }

      garlandContainer?.append(lightrope)

      lightropeSize += 60
    }
  }
}