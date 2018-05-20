function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


var app = new Vue({
  el:'#app',
  data(){
    return {
      isLoading:true,
      taxRatio:6,
      dataCurrency:[],
      timemarked:''
    }
  },
  computed:{
    taxed(){
      if(this.dataCurrency)
        return this.dataCurrency.map(el=>(parseFloat(el.priceSell.replace(',','')) * this.taxMulti).toFixed(2))
      else
        return []
    },
    taxMulti(){
      return (100 - this.taxRatio) / 100
    }
  },
  mounted(){
    Vue.axios.get('/currencydata').then(res=>{
      this.isLoading = false
      console.table(res.data.currencies)
      this.dataCurrency = res.data.currencies.slice()
      this.timemarked = res.data.timemarked
    })
  },
  methods:{
    printout(){
      window.print()
    }
  }
})

