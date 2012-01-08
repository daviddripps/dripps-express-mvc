module.exports = {
    getIndex: function(req, res)
    {
        res.render('index/index', {
            title: 'Dripps Express MVC Example'
        });
    },
    
    getJson: function(req, res)
    {
        res.json({status: true, text: ['this', 'is', 'an', 'example', 'returning', 'JSON']});
    }
}