<template>
  <!--
    - 目錄必須顯示欄位,()内為Api資料物件的屬性
		- 國旗(圖片資源請使用 flag)
		- 國家名稱（name）
		- 2位國家代碼(alpha2Code)
		- 3位國家代碼(alpha3Code)
		- 母語名稱(nativeName)
		- 替代國家名稱(altSpellings)
		- 國際電話區號(callingCodes)
    - 以國名搜尋功能(模糊搜尋)
    - 以國名排序功能（正序、倒序）
    - 分頁(每頁25筆)
    - 點擊國家名稱后顯示一個Modal，裏面顯示該國家的其他資訊。
  -->
  <div class="outer" data-inset="1rem">
    <div class="row vertical">
      <el-form label-width="6rem">
        <el-form-item label="Country:" data-width="30rem">
          <div class="row horizontal v_center">
          <el-input
            v-model="search"
            type="text"
            placeholder="Enter Country's name here"
          />
          <el-button type="primary" data-space-before="0.5rem" @click="handleSearch">Search</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="row horizontal space">
      <el-pagination
        :current-page="getPagination.currentPage"
        :page-size="25"
        layout="total, prev, pager, next"
        :total="getPagination.totalNum"
        @current-change="pageChange"
      />
      <span :class="['sortable_handler', sort ? 'toggled' : '']" @click="handleSort(-1)">Sort: A-Z</span>
    </div>
     
    <div class="row horizontal wrap" data-row-count="5">
      <div v-for="(item, i) in result" :key="i" class="data_row" data-inset="0.5rem">
        <div class="country_items">
          <span class="row horizontal v_center" data-border-bottom="light-gray">
            <img :src="`https://www.countryflags.io/${item.alpha2Code}/shiny/64.png`">
            <b @click="openDialog(item)">{{ item.name }}</b>
          </span>
          <div class="row horizontal v_center" data-space-vertical="0.5rem">
            <span class="tags">{{ item.alpha2Code }}</span>
            <span class="tags">{{ item.alpha3Code }}</span>
          </div>
          <div class="info">
            <span>{{ item.nativeName }}</span>
            <span>{{ item.altSpellings.join(', ') }}</span>
            <span>{{ item.callingCodes.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogInfo.name"
      v-model="showDialog"
      width="50%"
      @close="closeDialog"
    >
      <div class="row horizontal space">
        <img v-if="showDialog" :src="`https://www.countryflags.io/${dialogInfo.alpha2Code}/shiny/64.png`">
        <div class="row horizontal v_center" data-space-before="1rem">
           <span class="tags">{{ dialogInfo.alpha2Code }}</span>
          <span class="tags">{{ dialogInfo.alpha3Code }}</span>
        </div>
      </div>
      <div class="row vertical el-customize" :style="{'max-height':'400px', 'overflow-y':'auto'}">
        <el-form label-width="10rem" label-position="left">
          <el-form-item label="Name:">{{dialogInfo.name}}</el-form-item>
          <el-form-item label="Top level domain:">{{dialogInfo.topLevelDomain}}</el-form-item>
          <el-form-item label="Alpha 2 code:">{{dialogInfo.alpha2Code}}</el-form-item>
          <el-form-item label="Alpha 3 code:">{{dialogInfo.alpha3Code}}</el-form-item>
          <el-form-item label="Calling codes:">{{dialogInfo.callingCodes}}</el-form-item>
          <el-form-item label="Capital:">{{dialogInfo.capital}}</el-form-item>
          <el-form-item label="Alt Spellings:">{{dialogInfo.altSpellings}}</el-form-item>
          <el-form-item label="Region:">{{dialogInfo.region}}</el-form-item>
          <el-form-item label="Sub region:">{{dialogInfo.subregion}}</el-form-item>
          <el-form-item label="Population:">{{dialogInfo.population}}</el-form-item>
          <el-form-item label="LatLng:">{{dialogInfo.latlng}}</el-form-item>
          <el-form-item label="Demonym:">{{dialogInfo.demonym}}</el-form-item>
          <el-form-item label="Area:">{{dialogInfo.area}}</el-form-item>
          <el-form-item label="Time zones:">{{dialogInfo.timezones}}</el-form-item>
          <el-form-item label="Borders:">{{dialogInfo.borders}}</el-form-item>
          <el-form-item label="Native name:">{{dialogInfo.nativeName}}</el-form-item>
          
          <el-form-item label="Numeric code:">{{dialogInfo.numericCode}}</el-form-item>
          <el-form-item label="Currencies:">
            <div v-for="(item, i) in dialogInfo.currencies" :key="i">{{`${item.name}(Code: ${item.code}, ${item.symbol})`}}<br></div>
          </el-form-item>
          <el-form-item label="Languages:">
            <div v-for="(item, i) in dialogInfo.languages" :key="i">{{`${item.name}(Native: ${item.nativeName}, ISO 639: ${item.iso639_1}, ${item.iso639_2})`}}<br></div>
          </el-form-item>
          <el-form-item label="Translations:">
            <div v-for="(item, i) in translations" :key="i">
              {{ item }} <br>
            </div>
          </el-form-item>
          <el-form-item label="Flag:">
            <div class="row horizontal v_center">
              <img :src="dialogInfo.flag" style="width: 64px;">
            </div>
          </el-form-item>
          <el-form-item label="regionalBlocs">
            <div v-for="(item, i) in dialogInfo.regionalBlocs" :key="i">
              <span>{{ `${item.name}(${item.acronym})` }}<br></span>
              <span v-if="item.otherNames.length > 0">{{ `Other names: ${item.otherNames}` }}<br></span>
              <span v-if="item.otherAcronyms.length > 0">{{ `Other acronyms: ${item.otherAcronyms}` }}</span>
            </div>
          </el-form-item>
          <el-form-item label="Cioc">{{dialogInfo.cioc}}</el-form-item>
        </el-form>
      </div>
      <span class="dialog-footer row horizontal end" data-space-top="1rem">
        <el-button type="primary" @click="showDialog = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  ref,
  toRefs,
  reactive, 
  computed,
  onMounted,
  onBeforeMount 
} from 'vue'
import { useStore, mapGetters } from "vuex"
export default {
  name: 'Home',
  components: {
  
  },
  setup() {
    // v-models
    const store = useStore()
    const contriesModule = store.state.countriesModule
    const search = ref('')
    const result = ref([])
    const sort = ref(false)
    const showDialog = ref(false)
    const dialogInfo = ref({})
    const translations = ref([])

    // events

    const handleSearch = async () => {
      await store.commit('countriesModule/SET_SEARCH_KEYWORDS', search.value)
      await store.dispatch("countriesModule/FETCH_API")
      result.value = [...contriesModule.result[getIdx.value]]
    }

    const getPagination = computed(() => {
      return {
        currentPage: contriesModule.currentPage,
        totalNum: contriesModule.totalNum
      }
    })

    const getIdx = computed( () => contriesModule.currentPage - 1 )
    
    const callApi = onMounted( async () => {
      await store.dispatch("countriesModule/FETCH_API")
      result.value = [...contriesModule.result[getIdx.value]]
      console.log('####Call API: ', result.value)
    })

    const pageChange = (val) => {
      const obj = {
        currentPage: val,
        totalNum: getPagination.value.totalNum
      }
      store.commit('countriesModule/SET_PAGE', obj)
      result.value = [...contriesModule.result[getIdx.value]]
    }

    const handleSort = (val) => {
      sort.value = !sort.value
      store.commit('countriesModule/SET_SORT', val)
      result.value = [...contriesModule.result[getIdx.value]]
    }

    const openDialog = async (obj) => {
      dialogInfo.value = JSON.parse(JSON.stringify(obj))
      await parseInfoContents()
      showDialog.value = true
      console.log('##dialog: ', obj)
    }

    const parseInfoContents = () => {
      Object.keys(dialogInfo.value.translations).map(item => {
        translations.value.push(`${dialogInfo.value.translations[item]}(${item})`)
      })
      const excArr = ['currencies', 'languages', 'translations', 'regionalBlocs']
      Object.keys(dialogInfo.value).map(item => {
        if (dialogInfo.value[item] instanceof Array && !excArr.includes(item)) {
          dialogInfo.value[item] = dialogInfo.value[item].join(', ')
        }
      })
    }

    const closeDialog = () => {
      dialogInfo.value = {}
      translations.value = []
    }

    return {
      search,
      result,
      sort,
      showDialog,
      dialogInfo,
      translations,
      getIdx,
      handleSearch,
      pageChange,
      openDialog,
      parseInfoContents,
      closeDialog,
      handleSort,
      callApi,
      getPagination
    }
  }
}
</script>
