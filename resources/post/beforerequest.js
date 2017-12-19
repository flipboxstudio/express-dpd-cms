this.author = me ? me.username || 'guest' : ''

switch (event) {
    case 'GET':
        if (!ctx.query.$sort) {
            ctx.query.$sort = { updatedAt: -1 }
        }
        break;
    case 'POST':
        break;
    case 'PUT':
        break;
    case 'DELETE':
        break;
}