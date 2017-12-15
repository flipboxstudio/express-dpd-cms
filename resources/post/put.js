if(this.type === 'event') {
    var start_date = new Date(this.content.startDate)
    var end_date = new Date(this.content.endDate)
    
    if(start_date >= end_date) {
        error('date', 'start date must be earlier than end date')
    }
    
    if(end_date <= Date.now()) {
        error('date', 'end date must be later than today')
    }      
}

this.updatedAt = Date.now()