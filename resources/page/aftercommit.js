switch (method) {
    case 'GET':
        break;
    case 'POST':
        if (!data.translationId) {
            dpd.pagetranslation.post({ slug: data.slug, contents: [data.id] }, (res, err) => {
                if (!err) {
                    dpd.page.put(data.id, { translationId: res.id })
                }
            })
        } else {
            dpd.pagetranslation.put(data.translationId, { 
                contents: { $push: data.id }
            })    
        }
        break;
    case 'PUT':
        dpd.pagetranslation.put(data.translationId, {
            contents: { $push: data.id }
        })
        break;
    case 'DELETE':
        dpd.pagetranslation.put(data.translationId, { contents: { $pull: data.id } }, (res, err) => {
            if(!err && res.contents.length === 0) {
                dpd.pagetranslation.del(data.translationId)
            }
        })
        break;
}