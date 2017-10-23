// TODO continue this helper function
// import Vue from 'vue'
// for plugin (?)
// Vue.use({
//   install (Vue, options) {
//     Vue.prototype.$initCriteria = function () {
//       return new DpdQuery()
//     }
//   }
// })

class DpdQuery {
  constructor () {
    this.object = {}
    this.itemPerPage = 10
  }
  login (username, password) {
    this.object.username = username
    this.object.password = password
    return this
  }
  filterBy (key, value) {
    this.object[key] = value
    return this
  }
  excludeAll (key, values) {
    this.object[key] = {$nin: values}
    return this
  }
  notEqual (key, value) {
    this.object[key] = {$ne: value}
    return this
  }
  greaterThan (key, value) {
    this.object[key] = {$gt: value}
    return this
  }
  lessThan (key, value) {
    this.object[key] = {$lt: value}
    return this
  }
  limit (items) {
    this.itemPerPage = items
    return this
  }
  sortBy (key, type) {
    this.object['$sort'] = {}
    this.object['$sort'][key] = type === 'asc' ? 1 : -1
    return this
  }
  search (key, keyword) {
    this.object[key] = {$regex: `.*?${keyword}.*?`}
    return this
  }
  count () { // needs dpd-count plugin
    this.object.id = 'count'
    return this
  }
  page (page) {
    this.object['$limit'] = this.itemPerPage
    this.object['$skip'] = this.itemPerPage * (page - 1)
    return this
  }

  get () {
    return this.object
  }
  toString () {
    return JSON.stringify(this.object)
  }
}

export default DpdQuery
