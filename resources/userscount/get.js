dpd.users.get(function(res, err) {
    if(res) {
        setResult({'count': res.length})
    }
})