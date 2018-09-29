import Vuex from 'vuex'

export default class Storestore {
  constructor() {
    this.store = new Vuex.Store({
     state: {
       map: null,
       activeLayoutId: null
     },

     getters: {
       activeLayout: state => {
         if (state.map) {
            return state.map.layouts.find(layout => {
              return layout.id === state.activeLayoutId
            })
         }

         return null
       }
     },

     mutations: {
       addMap (state, map) {
         state.map = map
       },

       openLayout(state, layoutId) {
         state.activeLayoutId = layoutId
       },

       updateTile(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === state.activeLayoutId
         }).grid[payload.index].color = payload.color
       },

       updateLayoutGrid(state, payload) {
         state.map.layouts.find((layout) => {
           return layout.id === payload.layout
         }).grid = payload.grid
       }
     }
    })
  }
}
