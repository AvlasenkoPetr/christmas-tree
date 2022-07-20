export interface IController {
  // page: HTMLElement
  run(): void;
  showActivePage(): void;
  closeActivePage(): void;
}

class Controller implements IController {
  run(): void {
    addEventListener('hashchange', (): void => {
      this.showActivePage()
    })
    this.showActivePage()
  }

  showActivePage() {
    this.closeActivePage()

    let hash: string = window.location.hash
    let pageClass: string

    if (!hash) {
      pageClass = '.main-page'
    } else {
      pageClass = `.${window.location.hash.slice(1)}-page` 
    }

    document.querySelector(pageClass)?.classList.add('active')
  }

  closeActivePage() {
    if (document.querySelector('.active') as HTMLElement) {
      (document.querySelector('.active') as HTMLElement).classList.remove('active')
    }
  }
}

export default Controller