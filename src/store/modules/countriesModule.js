import request from "@/api/request"

export const state = {
  currentPage: 1,
  totalNum: 0,
  searchKeywords: '',
  sort: false,
  res: [],
  result: []
}

export const getters = {
  getResponse(state) {
    return state.res
  },
  getResult(state) {
    return state.result
  },
  getPagination(state) {
    const obj = {
      currentPage: state.currentPage,
      totalNum: state.totalNum
    }
    return obj
  },
  getKeywords(state) {
    return state.searchKeywords
  }
}

export const mutations = {
  SET_RESPONSE(state, payload) {
    state.res = payload
    console.log('####MUTATIONS FETCH_RESPONSE: ', state.res)
  },

  SET_PAGE(state, payload) {
    state.currentPage = payload.currentPage
    state.totalNum = payload.totalNum
    console.log('####MUTATIONS SET PAGE: ', payload)
  },

  SET_SORT(state, payload) {
    state.result.sort(() => payload)
  },

  SET_SEARCH_KEYWORDS(state, payload) {
    state.searchKeywords = payload
    console.log('####MUTATIONS SET KEYWORDS: ', payload)
  },

  SET_RESULT(state, payload) {
    const tempArr = []
    const pageSize = 25
    for(let i = 0; i < payload.length; i = i + pageSize){
      tempArr.push(payload.slice(i, i + pageSize))
    }
    state.result = [...tempArr]
    console.log('####MUTATIONS SET RESULT: ', state.result)
  }
}

export const actions = {
  async FETCH_API(context, payload) {
    let source = context.state.searchKeywords !=='' ? `https://restcountries.eu/rest/v2/name/${context.state.searchKeywords}?fullText=false` : 'https://restcountries.eu/rest/v2/all'
    const res = await request.get(source)
    if (res) {
      payload = res
      const pageObj = {
        currentPage: 1,
        totalNum: res.length
      } 
      console.log('####ACTIONS: ', res)
      context.commit('SET_RESPONSE', payload)
      context.commit('SET_RESULT', payload)
      context.commit('SET_PAGE', pageObj)
      context.commit('SET_SEARCH_KEYWORDS', '')
    } else {
      this.$alert('DATA GET FIALED', 'ERROR', {
        confirmButtonText: 'OK',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
    }
  },
}

// const countriesModule = {
//     state: {
//       currentPage: 1,
//       totalNum: 0,
//       searchKeywords: '',
//       sort: false,
//       res: [],
//       result: []
//     },
  
//     getters: {
//       getResponse(state) {
//         return state.res
//       },
//       getResult(state) {
//         return state.result
//       },
//       getPagination(state) {
//         const obj = {
//           currentPage: state.currentPage,
//           totalNum: state.totalNum
//         }
//         return obj
//       },
//       getKeywords(state) {
//         return state.searchKeywords
//       }
//     },
  
//     mutations: {
//       SET_RESPONSE(state, payload) {
//         state.res = payload
//         console.log('####MUTATIONS FETCH_RESPONSE: ', state.res)
//       },

//       SET_PAGE(state, payload) {
//         state.currentPage = payload.currentPage
//         state.totalNum = payload.totalNum
//         console.log('####MUTATIONS SET PAGE: ', payload)
//       },

//       SET_SORT(state, payload) {
//         state.result.sort(() => payload)
//       },

//       SET_SEARCH_KEYWORDS(state, payload) {
//         state.searchKeywords = payload
//         console.log('####MUTATIONS SET KEYWORDS: ', payload)
//       },

//       SET_RESULT(state, payload) {
//         const tempArr = []
//         const pageSize = 25
//         for(let i = 0; i < payload.length; i = i + pageSize){
//           tempArr.push(payload.slice(i, i + pageSize))
//         }
//         state.result = [...tempArr]
//         console.log('####MUTATIONS SET RESULT: ', state.result)
//       }
//     },
  
//     actions: {
//       async FETCH_API(context, payload) {
//         let source = context.state.searchKeywords !=='' ? `https://restcountries.eu/rest/v2/name/${context.state.searchKeywords}?fullText=false` : 'https://restcountries.eu/rest/v2/all'
//         const res = await $request.get(source)
//         if (res) {
//           payload = res
//           const pageObj = {
//             currentPage: 1,
//             totalNum: res.length
//           } 
//           console.log('####ACTIONS: ', res)
//           context.commit('SET_RESPONSE', payload)
//           context.commit('SET_RESULT', payload)
//           context.commit('SET_PAGE', pageObj)
//           context.commit('SET_SEARCH_KEYWORDS', '')
//         } else {
//           this.$alert('DATA GET FIALED', 'ERROR', {
//             confirmButtonText: 'OK',
//             callback: action => {
//               this.$message({
//                 type: 'info',
//                 message: `action: ${ action }`
//               });
//             }
//           });
//         }
//       },
//     }
//   }
  
export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}