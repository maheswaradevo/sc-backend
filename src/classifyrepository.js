const db = require('../pkg/database')

const insertData = (classMapping, classPos, highest, date) => {
    const query = `INSERT INTO classification (className, confidence, date_classify) VALUES('${classMapping[classPos]}', ${highest}, '${date}')`
    db.query(query, function(err, result) {
        if(err) throw err;
        console.log('INFO 1 rows inserted')
    })
}

module.exports = {
    insertData
}