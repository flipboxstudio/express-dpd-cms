this.author = me ? me.username || 'guest' : ''

if(ctx.method === 'GET' && !ctx.query.$sort) {
    ctx.query.$sort = {updatedAt: -1}
}