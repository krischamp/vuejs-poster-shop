const PRICE = 9.99
const LOAD_NB = 10

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    searchInput: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE,
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        const appendNext = this.results.slice(
          this.items.length,
          this.items.length + LOAD_NB
        )
        this.items = this.items.concat(appendNext)
      }
    },
    onSubmit: function() {
      if (this.searchInput) {
        this.items = []
        this.loading = true
        this.$http.get('/search/'.concat(this.searchInput)).then(function(res) {
          this.lastSearch = this.searchInput
          this.results = res.data
          this.appendItems()
          this.loading = false
        })
      }
    },
    addItem: function(index) {
      this.total += PRICE
      let wItem = this.items[index]
      let wFound = false
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === wItem.id) {
          wFound = true
          this.cart[i].qty++
          break
        }
      }
      if (!wFound) {
        this.cart.push({
          id: wItem.id,
          title: wItem.title,
          qty: 1,
          price: PRICE,
        })
      }
    },
    inc: function(item) {
      item.qty++
      this.total += PRICE
    },
    dec: function(item) {
      item.qty--
      this.total -= PRICE
      // test if no qty left
      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1)
            break
          }
        }
      }
    },
  },
  filters: {
    currency: function(price) {
      return '€'.concat(price.toFixed(2))
    },
  },
  mounted: function() {
    this.onSubmit()
    var vueInstance = this
    var elem = document.getElementById('product-list-bottom')
    var watcher = scrollMonitor.create(elem)
    watcher.enterViewport(function() {
      vueInstance.appendItems()
    })
  },
  computed: {
    noMoreItems: function() {
      return (
        this.results.length === this.items.length && this.results.length > 0
      )
    },
  },
})
