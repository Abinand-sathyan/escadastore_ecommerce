function pagenation(model){
    return async (req,res,next)=>{
        const page=parseInt(req.query.page);
        const limit=parseInt(req.query.limit)
        console.log(page+" "+limit);
        const startIndex=(page-1)*limit;
        const endInndex=page * limit;
        const results={}
        results.current={page,limit}
        if(endInndex < await model.find().count()){
            results.next={
                page:page+1,
                limit:limit
            }
        }
        if(startIndex>0){
            results.previous={
                 page:page-1,
                 limit:limit
            }
        }
       try{
          results.results= await model.find().limit(limit).skip(startIndex).exec()
          console.log(results);
          res.pagenation=results
          console.log(res.pagenation,"++++++++++++++++++++++++++++++++++");
          next()
       }catch(e){
         res.status(500).json({message:e.message })
       }
    }

}
module.exports={
    pagenation
} 