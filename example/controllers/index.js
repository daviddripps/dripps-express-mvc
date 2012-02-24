module.exports = {
    /**
     * The following endpionts will render this output (case INsensitive)
     * 
     * /
     * /index
     * /index/index
     * 
     */
    getIndex: function(req, res)
    {
        res.render('index/index', {
            title: 'Dripps Express MVC Example'
        });
    },
    
    /**
     * The following endpionts will render this output (case INsensitive)
     * 
     * /json
     * /index/json
     * 
     */
    getJson: function(req, res)
    {
        res.json({status: true, text: ['this', 'is', 'an', 'example', 'returning', 'JSON']});
    }
}