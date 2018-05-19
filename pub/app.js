function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

var app = new Vue({
  el:'#app',
  data(){
    return {
      isLoading:true,
      taxRatio:6,
      dataCurrency:[]
    }
  },
  computed:{
    taxed(){
      if(this.dataCurrency)
        return this.dataCurrency.map(el=>precisionRound(parseInt(el[3].replace(',','')) * this.taxMulti,2))
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
      console.table(res.data)
      this.dataCurrency = res.data.slice()
    })
  }
})

