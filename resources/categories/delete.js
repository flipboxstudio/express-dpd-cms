console.log(ctx.query.id)

dpd.posts.get({category: ctx.query.id}, function(res, err){
    if(res.length >= 1) {
        cancel('category is being used. cannot delete category!', 400)
    }
})