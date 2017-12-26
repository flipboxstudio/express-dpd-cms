switch (method) {
    case 'GET':
        break;
    case 'POST':
        if (!data.translationId) {
            dpd.posttranslation.post({ slug: data.slug, contents: [data.id] }, (res, err) => {
                if (!err) {
                    dpd.post.put(data.id, { translationId: res.id })
                }
            })
        } else {
            dpd.posttranslation.put(data.translationId, { 
                contents: { $push: data.id }
            })    
        }
        break;
    case 'PUT':
        dpd.posttranslation.put(data.translationId, {
            contents: { $push: data.id }
        })
        break;
    case 'DELETE':
        dpd.posttranslation.put(data.translationId, { contents: { $pull: data.id } }, (res, err) => {
            if(!err && res.contents.length === 0) {
                dpd.posttranslation.del(data.translationId)
            }
        })
        break;
}