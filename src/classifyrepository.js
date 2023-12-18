const db = require('../pkg/database')

const insertData = (classMapping, classPos, highest, date, imgUrl) => {
    const query = `INSERT INTO classification (className, confidence, date_classify, img_url) VALUES('${classMapping[classPos]}', ${highest}, '${date}', '${imgUrl}')`
    db.query(query, function(err, result) {
        if(err) throw err;
        console.log('INFO 1 rows inserted')
    })
}

module.exports = {
    insertData
}