if(this.slug && ctx.method === 'POST' && changed('slug')) {
    if (/.*[A-Z\s].*/.test(this.slug)) {
        error('slug', 'slug must not contains whitespace or uppercase character')  
    }
    dpd.pagetranslation.get({slug: this.slug}, function(res, err) {
        if(res.length > 0) {
            error('slug', 'slug must be unique')  
        }
    })
}

if(changed('contents')) {
    this.contents = Array.from(new Set(this.contents))
}