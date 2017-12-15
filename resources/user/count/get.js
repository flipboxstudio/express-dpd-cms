dpd.user.get(function(res, err) {
    if(res) {
        setResult({'count': res.length})
    }
})