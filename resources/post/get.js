var vm = this
var roles = []
if(me) roles = me.roles

var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

if(this.type === 'event') {
    var startDate = new Date(this.content.startDate)
    var endDate = new Date(this.content.endDate)
    
    if(startDate.getFullYear() != endDate.getFullYear()) {
        this.date = startDate.getDate() + ' ' + bulan[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' - ' 
                    + endDate.getDate() + ' ' + bulan[endDate.getMonth()] + ' ' + endDate.getFullYear()
    } else if (startDate.getMonth() != endDate.getMonth()) {
        this.date = startDate.getDate() + ' ' + bulan[startDate.getMonth()] + ' - ' 
                    + endDate.getDate() + ' ' + bulan[endDate.getMonth()] + ' ' + endDate.getFullYear()
    } else {
        this.date = startDate.getDate() + ' - ' + endDate.getDate() + ' ' + bulan[endDate.getMonth()] + ' ' + endDate.getFullYear()    
    }
} else if (this.type === 'article' && !roles.includes("admin")) {
    var date = new Date(this.content.date)
    this.date = date.getDate() + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear()    
}

if(ctx.query.id && !roles.includes("admin")) {
    this.meta.visit++
    dpd.post.put(this, function(res, err) {
        if(err) console.log(err)
    })
}

// default featured image
if(!this.featuredImage) {
    this.featuredImage = {}
}

if(this.category) {
    dpd.category.get(this.category, function(res, err) {
        vm.category = res || {}
    })
}