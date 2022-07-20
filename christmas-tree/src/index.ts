import "./style.css"
import "./nouislider.css"
import "./tree.css"

import Controller from "./components/controller"
import { IController } from "./components/controller"
import toys from "./components/toys"
import Render from "./components/render"
import { Slider } from "./components/slider"
import { sliderYear, sliderCount } from "./components/slider"
import { Tree } from "./components/tree"

const controller: IController = new Controller
controller.run()

const render = new Render
render.run(toys)
render.runFilter()

const sliderY = new Slider(sliderYear, "year")
sliderY.run()

const sliderC = new Slider(sliderCount, "count")
sliderC.run()

const tree = new Tree
tree.setListeners()
tree.renderWarehouse()

console.log(`Дико извиняюсь, не заметил что пушу коммиты без индекса в корневой))
Если есть возможность проверить завтра, был бы очень благодарен, надеюсь успеть доделать гирлянду. Но на нет и суда нет, в любом случае спасибо)`)

